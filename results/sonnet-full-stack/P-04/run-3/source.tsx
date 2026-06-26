import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Columns,
  Divider,
  Headline,
  Inline,
  NumberField,
  SectionMessage,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

type TicketId = 'earlyBird' | 'regular' | 'vip';
type TicketStatus = 'available' | 'limited' | 'soldOut';

interface TicketCategory {
  id: TicketId;
  name: string;
  price: number;
  description: string;
  status: TicketStatus;
  maxQty: number;
  limitText?: string;
}

const TICKETS: TicketCategory[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — grab yours early!',
    status: 'limited',
    maxQty: 12,
    limitText: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival access for all three days.',
    status: 'available',
    maxQty: 99,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience with backstage access.',
    status: 'soldOut',
    maxQty: 0,
  },
];

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<TicketId, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const selectedTickets = TICKETS.filter(t => quantities[t.id] > 0);
  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const grandTotal = TICKETS.reduce(
    (total, t) => total + quantities[t.id] * t.price,
    0
  );

  const noTicketsSelected = totalTickets === 0;
  const nameError = submitted && !name.trim();
  const emailError = submitted && (!email.trim() || !isValidEmail(email));

  const handlePurchase = () => {
    setSubmitted(true);
    if (noTicketsSelected || !name.trim() || !email.trim() || !isValidEmail(email)) {
      setOrderStatus('error');
      return;
    }
    setOrderStatus('success');
  };

  if (orderStatus === 'success') {
    return (
      <Stack space={6}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            <Stack space={2}>
              <Text>
                Thank you, {name}! Your tickets for Summer Music Festival 2026
                have been booked.
              </Text>
              <Text>A confirmation will be sent to {email}.</Text>
              <Stack space={1}>
                {selectedTickets.map(t => (
                  <Text key={t.id}>
                    {t.name} x {quantities[t.id]} — ${t.price * quantities[t.id]}
                  </Text>
                ))}
              </Stack>
              <Text weight="bold">Total: ${grandTotal}</Text>
            </Stack>
          </SectionMessage.Content>
        </SectionMessage>
      </Stack>
    );
  }

  return (
    <Stack space={6}>
      {/* Event Header */}
      <Card>
        <Stack space={3}>
          <Headline level={1}>Summer Music Festival 2026</Headline>
          <Inline space={4}>
            <Text>July 15-17, 2026</Text>
            <Text>Stadtpark Freiburg</Text>
          </Inline>
          <Text>
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>
      </Card>

      {/* Ticket Categories */}
      <Stack space={3}>
        <Headline level={2}>Tickets</Headline>
        <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
          {TICKETS.map(ticket => (
            <Card key={ticket.id}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level={3}>{ticket.name}</Headline>
                  {ticket.status === 'soldOut' && (
                    <Badge variant="error">Sold Out</Badge>
                  )}
                  {ticket.status === 'limited' && ticket.limitText && (
                    <Badge variant="warning">{ticket.limitText}</Badge>
                  )}
                </Inline>
                <Text weight="bold">${ticket.price}</Text>
                <Text>{ticket.description}</Text>
                <NumberField
                  label="Quantity"
                  value={quantities[ticket.id]}
                  onChange={(val: number) =>
                    setQuantities(prev => ({
                      ...prev,
                      [ticket.id]: Number.isFinite(val) ? val : 0,
                    }))
                  }
                  minValue={0}
                  maxValue={ticket.maxQty}
                  disabled={ticket.status === 'soldOut'}
                  width="1/2"
                />
              </Stack>
            </Card>
          ))}
        </Columns>
      </Stack>

      {/* Buyer Information */}
      <Card>
        <Stack space={4}>
          <Headline level={2}>Buyer Information</Headline>
          <TextField
            label="Full Name"
            value={name}
            onChange={setName}
            required
            error={nameError}
            errorMessage="Full name is required."
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            error={emailError}
            errorMessage="A valid email address is required."
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={setPhone}
          />
        </Stack>
      </Card>

      {/* Order Summary */}
      <Card>
        <Stack space={4}>
          <Headline level={2}>Order Summary</Headline>
          {selectedTickets.length === 0 ? (
            <Text variant="muted">No tickets selected yet.</Text>
          ) : (
            <Stack space={2}>
              {selectedTickets.map(ticket => (
                <Inline key={ticket.id} alignX="between" space={2}>
                  <Text>
                    {ticket.name} x {quantities[ticket.id]}
                  </Text>
                  <Text weight="bold">
                    ${ticket.price * quantities[ticket.id]}
                  </Text>
                </Inline>
              ))}
              <Divider />
              <Inline alignX="between" space={2}>
                <Text weight="bold">Grand Total</Text>
                <Headline level={3}>${grandTotal}</Headline>
              </Inline>
            </Stack>
          )}

          {submitted && orderStatus === 'error' && (
            <SectionMessage variant="error">
              <SectionMessage.Title>Cannot Complete Purchase</SectionMessage.Title>
              <SectionMessage.Content>
                {noTicketsSelected
                  ? 'Please select at least one ticket before purchasing.'
                  : 'Please fill in all required buyer information correctly.'}
              </SectionMessage.Content>
            </SectionMessage>
          )}

          <Button variant="primary" onPress={handlePurchase}>
            Purchase Tickets
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

export default TestApp;
