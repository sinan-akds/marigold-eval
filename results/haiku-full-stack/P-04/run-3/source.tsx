import { useState } from 'react';
import {
  AppLayout,
  Button,
  Card,
  Columns,
  Container,
  Headline,
  Inset,
  NumberField,
  SectionMessage,
  Stack,
  Text,
  TextField,
  Badge,
  Inline,
  Divider,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  maxQuantity: number;
  isSoldOut: boolean;
}

interface BuyerInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

const TestApp = () => {
  const [tickets, setTickets] = useState<TicketCategory[]>([
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 49,
      description: 'Limited availability',
      quantity: 0,
      maxQuantity: 12,
      isSoldOut: false,
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 79,
      description: 'Available',
      quantity: 0,
      maxQuantity: Infinity,
      isSoldOut: false,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Sold out',
      quantity: 0,
      maxQuantity: 0,
      isSoldOut: true,
    },
  ]);

  const [buyer, setBuyer] = useState<BuyerInfo>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const updateTicketQuantity = (id: string, quantity: number) => {
    setTickets(tickets.map(t => (t.id === id ? { ...t, quantity } : t)));
  };

  const calculateSubtotal = (ticket: TicketCategory) => {
    return ticket.price * ticket.quantity;
  };

  const calculateTotal = () => {
    return tickets.reduce((sum, ticket) => sum + calculateSubtotal(ticket), 0);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!buyer.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!buyer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = () => {
    const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0);

    if (totalTickets === 0) {
      setMessage({
        type: 'error',
        text: 'Please select at least one ticket',
      });
      return;
    }

    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields correctly',
      });
      return;
    }

    setMessage({
      type: 'success',
      text: `Order confirmed! You have purchased ${totalTickets} ticket${totalTickets !== 1 ? 's' : ''} for ${buyer.fullName}. A confirmation email will be sent to ${buyer.email}.`,
    });

    setTickets(tickets.map(t => ({ ...t, quantity: 0 })));
    setBuyer({ fullName: '', email: '', phoneNumber: '' });
    setErrors({});
  };

  const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0);
  const grandTotal = calculateTotal();

  return (
    <AppLayout>
      <AppLayout.Main>
        <Container>
          <Stack space={6}>
        {/* Event Header */}
        <Stack space={2}>
          <Headline level="1">Summer Music Festival 2026</Headline>
          <Inline space={4}>
            <Text weight="bold">July 15-17, 2026</Text>
            <Text>Stadtpark Freiburg</Text>
          </Inline>
          <Text>Three days of live music featuring local and international artists.</Text>
        </Stack>

        {/* Feedback Messages */}
        {message && (
          <SectionMessage variant={message.type}>
            <SectionMessage.Content>{message.text}</SectionMessage.Content>
          </SectionMessage>
        )}

        {/* Ticket Categories */}
        <Stack space={3}>
          <Headline level="2">Tickets</Headline>
          <Columns columns={[1, 1, 1]} collapseAt="40em" space={3}>
            {tickets.map(ticket => (
              <Card key={ticket.id}>
                <Inset space="square-regular">
                  <Stack space={3}>
                    {/* Card Header */}
                    <Stack space={1}>
                      <Inline space={2}>
                        <Headline level="3">{ticket.name}</Headline>
                        {ticket.isSoldOut && (
                          <Badge variant="error">Sold Out</Badge>
                        )}
                        {!ticket.isSoldOut && ticket.maxQuantity !== Infinity && (
                          <Badge variant="warning">Only {ticket.maxQuantity} left</Badge>
                        )}
                      </Inline>
                      <Text>${ticket.price}</Text>
                      <Text fontSize="sm" color="text-base-muted">
                        {ticket.description}
                      </Text>
                    </Stack>

                    <Divider />

                    {/* Quantity Control */}
                    <NumberField
                      label="Quantity"
                      value={ticket.quantity}
                      onChange={value =>
                        updateTicketQuantity(ticket.id, Math.max(0, value || 0))
                      }
                      minValue={0}
                      maxValue={ticket.maxQuantity === Infinity ? undefined : ticket.maxQuantity}
                      disabled={ticket.isSoldOut}
                      hideStepper={false}
                    />
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Columns>
        </Stack>

        {/* Buyer Information */}
        <Stack space={3}>
          <Headline level="2">Buyer Information</Headline>
          <Stack space={3}>
            <TextField
              label="Full Name"
              required
              value={buyer.fullName}
              onChange={value => setBuyer({ ...buyer, fullName: value })}
              error={!!errors.fullName}
              errorMessage={errors.fullName}
              width="1/2"
            />
            <TextField
              label="Email"
              type="email"
              required
              value={buyer.email}
              onChange={value => setBuyer({ ...buyer, email: value })}
              error={!!errors.email}
              errorMessage={errors.email}
              width="1/2"
            />
            <TextField
              label="Phone Number"
              value={buyer.phoneNumber}
              onChange={value => setBuyer({ ...buyer, phoneNumber: value })}
              width="1/2"
            />
          </Stack>
        </Stack>

        {/* Order Summary */}
        <Card>
          <Inset space="square-regular">
            <Stack space={3}>
              <Headline level="2">Order Summary</Headline>

              {totalTickets > 0 ? (
                <>
                  <Stack space={2}>
                    {tickets.map(ticket =>
                      ticket.quantity > 0 ? (
                        <Inline space={4} key={ticket.id} alignY="center">
                          <Text>{ticket.name}</Text>
                          <Text>
                            {ticket.quantity} × ${ticket.price}
                          </Text>
                          <Text weight="bold">
                            ${calculateSubtotal(ticket)}
                          </Text>
                        </Inline>
                      ) : null,
                    )}
                  </Stack>

                  <Divider />

                  <Inline space={4} alignY="center">
                    <Headline level="3">Total</Headline>
                    <Headline level="3">${grandTotal}</Headline>
                  </Inline>
                </>
              ) : (
                <Text color="text-base-muted">No tickets selected yet</Text>
              )}

              <Button variant="primary" onPress={handlePurchase} fullWidth>
                Purchase Tickets
              </Button>
            </Stack>
          </Inset>
        </Card>
      </Stack>
        </Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
