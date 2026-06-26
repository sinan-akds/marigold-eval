import { useState } from 'react';
import {
  Stack,
  Inline,
  Text,
  Heading,
  Card,
  Button,
  TextField,
  NumberField,
  Badge,
  Divider,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  soldOut: boolean;
  limitLabel?: string;
}

const TICKETS: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — grab yours while they last.',
    maxQuantity: 12,
    soldOut: false,
    limitLabel: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission for all three festival days.',
    maxQuantity: 99,
    soldOut: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Exclusive VIP access with backstage perks.',
    maxQuantity: 0,
    soldOut: true,
  },
];

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0) * t.price,
    0
  );

  const handleQuantityChange = (id: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: isNaN(val) ? 0 : val }));
  };

  const handlePurchase = () => {
    const errs: string[] = [];
    if (totalTickets === 0) errs.push('Please select at least one ticket.');
    if (!fullName.trim()) errs.push('Full Name is required.');
    if (!email.trim()) errs.push('Email address is required.');
    else if (!isValidEmail(email)) errs.push('Please enter a valid email address.');

    if (errs.length > 0) {
      setErrors(errs);
      setOrderPlaced(false);
    } else {
      setErrors([]);
      setOrderPlaced(true);
    }
  };

  return (
    <Stack space={8}>
      {/* Event Header */}
      <Stack space={2}>
        <Heading level={1}>Summer Music Festival 2026</Heading>
        <Text>July 15–17, 2026 · Stadtpark Freiburg</Text>
        <Text>Three days of live music featuring local and international artists.</Text>
      </Stack>

      <Divider />

      {/* Ticket Selection */}
      <Stack space={4}>
        <Heading level={2}>Select Tickets</Heading>
        {TICKETS.map((ticket) => (
          <Card key={ticket.id}>
            <Stack space={3}>
              <Inline space={2}>
                <Heading level={3}>{ticket.name}</Heading>
                {ticket.soldOut && (
                  <Badge variant="error">Sold Out</Badge>
                )}
                {!ticket.soldOut && ticket.limitLabel && (
                  <Badge variant="warning">{ticket.limitLabel}</Badge>
                )}
              </Inline>
              <Text>${ticket.price} per ticket</Text>
              <Text>{ticket.description}</Text>
              <NumberField
                label="Quantity"
                value={quantities[ticket.id]}
                onChange={(val) => handleQuantityChange(ticket.id, val)}
                minValue={0}
                maxValue={ticket.soldOut ? 0 : ticket.maxQuantity}
                isDisabled={ticket.soldOut}
              />
            </Stack>
          </Card>
        ))}
      </Stack>

      <Divider />

      {/* Buyer Information */}
      <Stack space={4}>
        <Heading level={2}>Buyer Information</Heading>
        <TextField
          label="Full Name"
          value={fullName}
          onChange={setFullName}
          isRequired
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          isRequired
        />
        <TextField
          label="Phone Number"
          value={phone}
          onChange={setPhone}
        />
      </Stack>

      <Divider />

      {/* Order Summary */}
      <Stack space={3}>
        <Heading level={2}>Order Summary</Heading>
        {totalTickets === 0 ? (
          <Text>No tickets selected yet.</Text>
        ) : (
          <Stack space={1}>
            {TICKETS.filter((t) => (quantities[t.id] ?? 0) > 0).map((t) => (
              <Inline key={t.id} space={4}>
                <Text>
                  {t.name} × {quantities[t.id]}
                </Text>
                <Text>${(t.price * quantities[t.id]).toFixed(2)}</Text>
              </Inline>
            ))}
          </Stack>
        )}
        <Divider />
        <Inline space={4}>
          <Heading level={3}>Total</Heading>
          <Heading level={3}>${grandTotal.toFixed(2)}</Heading>
        </Inline>
      </Stack>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <Stack space={1}>
          {errors.map((err, i) => (
            <Text key={i}>{err}</Text>
          ))}
        </Stack>
      )}

      {/* Success Message */}
      {orderPlaced && (
        <Text>
          Your order is confirmed! A receipt will be sent to {email}. See you at the festival!
        </Text>
      )}

      <Button variant="primary" onPress={handlePurchase}>
        Purchase Tickets
      </Button>
    </Stack>
  );
};

export default TestApp;
