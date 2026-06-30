import { useState } from 'react';
import {
  AppLayout,
  Button,
  Card,
  Columns,
  Form,
  Headline,
  Inline,
  Inset,
  NumberField,
  SectionMessage,
  Stack,
  TextField,
  Text,
  Badge,
} from '@marigold/components';

interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  maxQuantity: number;
  isSoldOut: boolean;
}

const TestApp = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 49,
      description: 'Only 12 left',
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
      maxQuantity: 999,
      isSoldOut: false,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Sold Out',
      quantity: 0,
      maxQuantity: 0,
      isSoldOut: true,
    },
  ]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const updateTicketQuantity = (ticketId: string, newQuantity: number) => {
    setTickets(
      tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, quantity: newQuantity } : ticket
      )
    );
    setSubmitted(false);
  };

  const calculateSubtotal = (ticket: Ticket): number => {
    return ticket.quantity * ticket.price;
  };

  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const grandTotal = tickets.reduce(
    (sum, ticket) => sum + calculateSubtotal(ticket),
    0
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: string[] = [];

    // Validate tickets selected
    if (totalTickets === 0) {
      errors.push('Please select at least one ticket');
    }

    // Validate required fields
    if (!fullName.trim()) {
      errors.push('Full Name is required');
    }

    if (!email.trim()) {
      errors.push('Email is required');
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }

    setFormErrors(errors);

    if (errors.length === 0) {
      setSubmitSuccess(true);
      setSubmitted(true);
    }
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Inset space="square-relaxed">
          <Stack space={6}>
            {/* Event Header */}
            <Stack space={3}>
              <Headline level={1}>Summer Music Festival 2026</Headline>
              <Stack space={1}>
                <Text>
                  <Text as="span" weight="bold">Date:</Text> July 15-17, 2026
                </Text>
                <Text>
                  <Text as="span" weight="bold">Venue:</Text> Stadtpark Freiburg
                </Text>
                <Text>
                  Three days of live music featuring local and international
                  artists.
                </Text>
              </Stack>
            </Stack>

            {/* Ticket Categories */}
            <Stack space={3}>
              <Headline level={2}>Tickets</Headline>
              <Columns
                columns={[1, 1, 1]}
                space={3}
                collapseAt="48em"
              >
                {tickets.map(ticket => (
                  <Card key={ticket.id} stretch>
                    <Inset space="square-regular">
                      <Stack space={3}>
                        <Stack space={1}>
                          <Headline level={3}>{ticket.name}</Headline>
                          <Text weight="bold" fontSize="lg">
                            ${ticket.price}
                          </Text>
                          <Text>{ticket.description}</Text>
                        </Stack>

                        {ticket.isSoldOut && (
                          <Badge variant="error">Sold Out</Badge>
                        )}

                        <NumberField
                          label="Quantity"
                          value={ticket.quantity}
                          onChange={newValue =>
                            updateTicketQuantity(ticket.id, newValue as number)
                          }
                          minValue={0}
                          maxValue={ticket.maxQuantity}
                          disabled={ticket.isSoldOut}
                          hideStepper={false}
                          width="full"
                        />
                      </Stack>
                    </Inset>
                  </Card>
                ))}
              </Columns>
            </Stack>

            {/* Buyer Information */}
            <Stack space={3}>
              <Headline level={2}>Buyer Information</Headline>
              <Form onSubmit={handleSubmit}>
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  required
                  value={fullName}
                  onChange={setFullName}
                  width="full"
                />

                <TextField
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  width="full"
                />

                <TextField
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  width="full"
                />

                {/* Order Summary */}
                <Stack space={3}>
                  <Headline level={3}>Order Summary</Headline>

                  {totalTickets === 0 ? (
                    <Text color="text-base-disabled">No tickets selected</Text>
                  ) : (
                    <Stack space={2}>
                      {tickets.map(ticket => {
                        if (ticket.quantity > 0) {
                          const subtotal = calculateSubtotal(ticket);
                          return (
                            <Inline
                              key={ticket.id}
                              alignX="between"
                              alignY="center"
                            >
                              <Text>
                                {ticket.name} × {ticket.quantity}
                              </Text>
                              <Text>
                                ${subtotal.toFixed(2)}
                              </Text>
                            </Inline>
                          );
                        }
                        return null;
                      })}
                      <Inline alignX="between" alignY="center">
                        <Text weight="bold" fontSize="lg">
                          Total
                        </Text>
                        <Text weight="bold" fontSize="lg">
                          ${grandTotal.toFixed(2)}
                        </Text>
                      </Inline>
                    </Stack>
                  )}
                </Stack>

                {/* Error Messages */}
                {submitted && !submitSuccess && formErrors.length > 0 && (
                  <SectionMessage variant="error">
                    <SectionMessage.Title>
                      Cannot proceed with purchase
                    </SectionMessage.Title>
                    <SectionMessage.Content>
                      <Stack space={1}>
                        {formErrors.map((error, index) => (
                          <Text key={index}>• {error}</Text>
                        ))}
                      </Stack>
                    </SectionMessage.Content>
                  </SectionMessage>
                )}

                {/* Success Message */}
                {submitSuccess && (
                  <SectionMessage variant="success">
                    <SectionMessage.Title>
                      Order Confirmed!
                    </SectionMessage.Title>
                    <SectionMessage.Content>
                      <Text>
                        Thank you for your purchase! Your order for{' '}
                        {totalTickets} ticket{totalTickets !== 1 ? 's' : ''} has
                        been confirmed. A confirmation email has been sent to{' '}
                        <Text as="span" weight="bold">{email}</Text>.
                      </Text>
                    </SectionMessage.Content>
                  </SectionMessage>
                )}

                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  fullWidth
                >
                  Purchase Tickets
                </Button>
              </Stack>
              </Form>
            </Stack>
          </Stack>
        </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
