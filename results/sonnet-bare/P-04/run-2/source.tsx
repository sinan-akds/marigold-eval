import { useState } from 'react';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  TextField,
  NumberField,
  Card,
  Badge,
  Divider,
} from '@marigold/components';

type TicketId = 'earlyBird' | 'regular' | 'vip';

interface Ticket {
  id: TicketId;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  maxQty: number;
  note?: string;
}

const TICKETS: Ticket[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — grab yours before they\'re gone.',
    soldOut: false,
    maxQty: 12,
    note: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission with full access to all stages.',
    soldOut: false,
    maxQty: 99,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience with backstage access and lounge.',
    soldOut: true,
    maxQty: 0,
  },
];

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

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
  const [formError, setFormError] = useState('');

  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + quantities[t.id] * t.price,
    0
  );

  const selectedTickets = TICKETS.filter(t => quantities[t.id] > 0);

  const setQty = (id: TicketId, val: number) =>
    setQuantities(prev => ({ ...prev, [id]: isNaN(val) ? 0 : val }));

  const handlePurchase = () => {
    setFormError('');

    if (totalTickets === 0) {
      setFormError('Please select at least one ticket before purchasing.');
      return;
    }
    if (!name.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!email.trim() || !isValidEmail(email.trim())) {
      setFormError('A valid email address is required.');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Stack space={4}>
        <Headline level={2}>Order Confirmed!</Headline>
        <Card>
          <Stack space={3}>
            <Text>
              Thank you, {name}! Your order of {totalTickets} ticket
              {totalTickets !== 1 ? 's' : ''} has been placed. A confirmation
              email will be sent to {email}.
            </Text>
            <Divider />
            {selectedTickets.map(ticket => (
              <Inline key={ticket.id} space={4}>
                <Text>
                  {ticket.name} × {quantities[ticket.id]}
                </Text>
                <Text>${quantities[ticket.id] * ticket.price}</Text>
              </Inline>
            ))}
            <Divider />
            <Inline space={4}>
              <Text weight="bold">Total charged</Text>
              <Text weight="bold">${grandTotal}</Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack space={8}>
      {/* Event Details */}
      <Stack space={2}>
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Text>July 15–17, 2026 · Stadtpark Freiburg</Text>
        <Text>
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      {/* Ticket Categories */}
      <Stack space={4}>
        <Headline level={2}>Select Tickets</Headline>
        <Stack space={3}>
          {TICKETS.map(ticket => (
            <Card key={ticket.id}>
              <Stack space={3}>
                <Inline space={3}>
                  <Stack space={1}>
                    <Text weight="bold">{ticket.name}</Text>
                    <Text>${ticket.price}</Text>
                  </Stack>
                  {ticket.note && !ticket.soldOut && (
                    <Badge variant="warning">{ticket.note}</Badge>
                  )}
                  {ticket.soldOut && (
                    <Badge variant="error">Sold Out</Badge>
                  )}
                </Inline>
                <Text>{ticket.description}</Text>
                <NumberField
                  label="Quantity"
                  value={quantities[ticket.id]}
                  onChange={(val: number) => setQty(ticket.id, val)}
                  minValue={0}
                  maxValue={ticket.maxQty}
                  isDisabled={ticket.soldOut}
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      {/* Buyer Information */}
      <Stack space={4}>
        <Headline level={2}>Your Information</Headline>
        <TextField
          label="Full Name"
          value={name}
          onChange={setName}
          isRequired
        />
        <TextField
          label="Email"
          value={email}
          onChange={setEmail}
          isRequired
          type="email"
        />
        <TextField
          label="Phone Number"
          value={phone}
          onChange={setPhone}
        />
      </Stack>

      {/* Order Summary */}
      <Stack space={4}>
        <Headline level={2}>Order Summary</Headline>
        <Card>
          <Stack space={3}>
            {selectedTickets.length > 0 ? (
              selectedTickets.map(ticket => (
                <Inline key={ticket.id} space={4}>
                  <Text>
                    {ticket.name} × {quantities[ticket.id]}
                  </Text>
                  <Text>${quantities[ticket.id] * ticket.price}</Text>
                </Inline>
              ))
            ) : (
              <Text>No tickets selected yet.</Text>
            )}
            <Divider />
            <Inline space={4}>
              <Text weight="bold">Grand Total</Text>
              <Text weight="bold">${grandTotal}</Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>

      {/* Validation Error */}
      {formError && (
        <Card>
          <Text>{formError}</Text>
        </Card>
      )}

      <Button variant="primary" onPress={handlePurchase}>
        Purchase Tickets
      </Button>
    </Stack>
  );
};

export default TestApp;
