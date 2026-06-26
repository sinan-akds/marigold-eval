import { useState } from 'react';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Card,
  TextField,
  NumberField,
  Button,
  Badge,
  Divider,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  maxQty: number;
  note?: string;
}

const TICKETS: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Get in early at a discounted price.',
    soldOut: false,
    maxQty: 12,
    note: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission to all three days.',
    soldOut: false,
    maxQty: 99,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Exclusive backstage access and premium seating.',
    soldOut: true,
    maxQty: 0,
  },
];

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const setQty = (id: string, value: number) => {
    setQuantities(prev => ({ ...prev, [id]: value }));
  };

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);

  const lineItems = TICKETS.filter(t => quantities[t.id] > 0).map(t => ({
    name: t.name,
    qty: quantities[t.id],
    subtotal: quantities[t.id] * t.price,
  }));

  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handlePurchase = () => {
    const errs: string[] = [];

    if (totalTickets === 0) {
      errs.push('Please select at least one ticket.');
    }
    if (!fullName.trim()) {
      errs.push('Full Name is required.');
    }
    if (!email.trim()) {
      errs.push('Email is required.');
    } else if (!isValidEmail(email)) {
      errs.push('Please enter a valid email address.');
    }

    if (errs.length > 0) {
      setErrors(errs);
      setSubmitted(false);
    } else {
      setErrors([]);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Stack space={4}>
        <Card>
          <Stack space={3}>
            <Headline level={2}>Order Confirmed!</Headline>
            <Text>
              Thank you, {fullName}! Your tickets to Summer Music Festival 2026
              have been booked. A confirmation will be sent to {email}.
            </Text>
            {lineItems.map(item => (
              <Inline key={item.name} space={2}>
                <Text>
                  {item.qty}× {item.name}
                </Text>
                <Text>${item.subtotal}</Text>
              </Inline>
            ))}
            <Divider />
            <Inline space={2}>
              <Text weight="bold">Total</Text>
              <Text weight="bold">${grandTotal}</Text>
            </Inline>
            <Button
              variant="secondary"
              onPress={() => {
                setSubmitted(false);
                setQuantities({ 'early-bird': 0, regular: 0, vip: 0 });
                setFullName('');
                setEmail('');
                setPhone('');
              }}
            >
              Start Over
            </Button>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack space={6}>
      {/* Event Header */}
      <Stack space={2}>
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Text>July 15–17, 2026 · Stadtpark Freiburg</Text>
        <Text>
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      {/* Ticket Categories */}
      <Stack space={2}>
        <Headline level={2}>Tickets</Headline>
        <Stack space={3}>
          {TICKETS.map(ticket => (
            <Card key={ticket.id}>
              <Stack space={2}>
                <Inline space={3}>
                  <Text weight="bold">{ticket.name}</Text>
                  <Text weight="bold">${ticket.price}</Text>
                  {ticket.soldOut && (
                    <Badge variant="negative">Sold Out</Badge>
                  )}
                  {ticket.note && !ticket.soldOut && (
                    <Badge variant="warning">{ticket.note}</Badge>
                  )}
                </Inline>
                <Text>{ticket.description}</Text>
                <NumberField
                  label={`${ticket.name} quantity`}
                  value={quantities[ticket.id]}
                  onChange={val => setQty(ticket.id, val ?? 0)}
                  minValue={0}
                  maxValue={ticket.soldOut ? 0 : ticket.maxQty}
                  isDisabled={ticket.soldOut}
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      {/* Buyer Information */}
      <Stack space={2}>
        <Headline level={2}>Your Information</Headline>
        <Stack space={3}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
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
            type="tel"
          />
        </Stack>
      </Stack>

      {/* Order Summary */}
      <Card>
        <Stack space={3}>
          <Headline level={2}>Order Summary</Headline>
          {lineItems.length === 0 ? (
            <Text>No tickets selected yet.</Text>
          ) : (
            lineItems.map(item => (
              <Inline key={item.name} space={2}>
                <Text>
                  {item.qty}× {item.name}
                </Text>
                <Text>${item.subtotal}</Text>
              </Inline>
            ))
          )}
          <Divider />
          <Inline space={2}>
            <Text weight="bold">Total</Text>
            <Text weight="bold">${grandTotal}</Text>
          </Inline>
        </Stack>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Card>
          <Stack space={2}>
            {errors.map(err => (
              <Text key={err} color="negative">
                {err}
              </Text>
            ))}
          </Stack>
        </Card>
      )}

      {/* Purchase Button */}
      <Button variant="primary" onPress={handlePurchase}>
        Purchase Tickets
      </Button>
    </Stack>
  );
};

export default TestApp;
