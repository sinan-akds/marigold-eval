import { useState } from 'react';
import {
  Heading,
  Text,
  Card,
  Button,
  NumberField,
  TextField,
  Flex,
  Stack,
  Container,
  Message,
} from '@marigold/components';

interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  max: number;
  status: 'available' | 'limited' | 'soldout';
  statusText?: string;
}

interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
}

const TestApp = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'earlybird',
      name: 'Early Bird',
      price: 49,
      description: 'Limited early bird pricing',
      quantity: 0,
      max: 12,
      status: 'limited',
      statusText: 'Only 12 left',
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 79,
      description: 'Standard ticket price',
      quantity: 0,
      max: 999,
      status: 'available',
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Premium VIP experience',
      quantity: 0,
      max: 0,
      status: 'soldout',
      statusText: 'Sold Out',
    },
  ]);

  const [buyer, setBuyer] = useState<BuyerInfo>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleQuantityChange = (ticketId: string, newQuantity: number) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, quantity: Math.max(0, newQuantity) }
          : ticket
      )
    );
    setValidationError('');
  };

  const handleBuyerChange = (field: keyof BuyerInfo, value: string) => {
    setBuyer({ ...buyer, [field]: value });
    setValidationError('');
  };

  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const subtotalByTicket = tickets.map((ticket) => ({
    id: ticket.id,
    name: ticket.name,
    quantity: ticket.quantity,
    subtotal: ticket.price * ticket.quantity,
  }));
  const grandTotal = subtotalByTicket.reduce((sum, item) => sum + item.subtotal, 0);

  const validateAndSubmit = () => {
    if (totalTickets === 0) {
      setValidationError('Please select at least one ticket.');
      return;
    }

    if (!buyer.fullName.trim()) {
      setValidationError('Full Name is required.');
      return;
    }

    if (!buyer.email.trim()) {
      setValidationError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer.email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setValidationError('');
    setOrderSubmitted(true);
    setTimeout(() => setOrderSubmitted(false), 5000);
  };

  return (
    <Container>
      <Stack gap="large">
        {/* Event Header */}
        <Stack gap="small">
          <Heading level="1">Summer Music Festival 2026</Heading>
          <Text>July 15-17, 2026</Text>
          <Text>Stadtpark Freiburg</Text>
          <Text>Three days of live music featuring local and international artists.</Text>
        </Stack>

        {/* Tickets Section */}
        <Stack gap="medium">
          <Heading level="2">Tickets</Heading>
          <Flex gap="medium" wrap="wrap">
            {tickets.map((ticket) => (
              <Card key={ticket.id} width={{ base: '100%', md: 'calc(33.333% - 12px)' }}>
                <Stack gap="small">
                  <Heading level="3">{ticket.name}</Heading>
                  <Text weight="bold" size="large">
                    ${ticket.price}
                  </Text>
                  <Text size="small">{ticket.description}</Text>

                  {ticket.status === 'soldout' && (
                    <Message variant="warning">Sold Out</Message>
                  )}
                  {ticket.status === 'limited' && ticket.statusText && (
                    <Text size="small" color="warning">
                      {ticket.statusText}
                    </Text>
                  )}

                  {ticket.status === 'soldout' ? (
                    <Text size="small" color="disabled">
                      Quantity unavailable
                    </Text>
                  ) : (
                    <NumberField
                      label="Quantity"
                      value={ticket.quantity}
                      onChange={(value) => handleQuantityChange(ticket.id, value || 0)}
                      minValue={0}
                      maxValue={ticket.max}
                      disabled={ticket.status === 'soldout'}
                    />
                  )}
                </Stack>
              </Card>
            ))}
          </Flex>
        </Stack>

        {/* Buyer Information */}
        <Stack gap="medium">
          <Heading level="2">Your Information</Heading>
          <Stack gap="medium" width="100%">
            <TextField
              label="Full Name *"
              value={buyer.fullName}
              onChange={(value) => handleBuyerChange('fullName', value)}
              placeholder="John Doe"
              required
            />
            <TextField
              label="Email *"
              type="email"
              value={buyer.email}
              onChange={(value) => handleBuyerChange('email', value)}
              placeholder="john@example.com"
              required
            />
            <TextField
              label="Phone Number"
              value={buyer.phone}
              onChange={(value) => handleBuyerChange('phone', value)}
              placeholder="+49 123 456789"
            />
          </Stack>
        </Stack>

        {/* Order Summary */}
        <Stack gap="medium">
          <Heading level="2">Order Summary</Heading>
          <Card>
            <Stack gap="medium">
              {subtotalByTicket.map((item) =>
                item.quantity > 0 ? (
                  <Flex key={item.id} justify="space-between">
                    <Text>
                      {item.name} × {item.quantity}
                    </Text>
                    <Text>${item.subtotal.toFixed(2)}</Text>
                  </Flex>
                ) : null
              )}

              {totalTickets === 0 && (
                <Text color="disabled">No tickets selected</Text>
              )}

              {totalTickets > 0 && (
                <Flex justify="space-between" gap="medium">
                  <Heading level="3">Total</Heading>
                  <Heading level="3">${grandTotal.toFixed(2)}</Heading>
                </Flex>
              )}
            </Stack>
          </Card>
        </Stack>

        {/* Validation Error */}
        {validationError && <Message variant="danger">{validationError}</Message>}

        {/* Success Message */}
        {orderSubmitted && (
          <Message variant="success">
            Order confirmed! Your tickets for {tickets.filter((t) => t.quantity > 0).map((t) => `${t.quantity}x ${t.name}`).join(', ')} have been reserved. A confirmation email has been sent to {buyer.email}.
          </Message>
        )}

        {/* Purchase Button */}
        <Button onPress={validateAndSubmit} variant="primary" size="large">
          Purchase Tickets
        </Button>
      </Stack>
    </Container>
  );
};

export default TestApp;
