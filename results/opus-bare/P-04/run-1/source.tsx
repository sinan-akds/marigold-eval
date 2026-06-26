import { useState } from 'react';
import {
  Stack,
  Inline,
  Headline,
  Text,
  Card,
  NumberField,
  TextField,
  Button,
  Badge,
  Divider,
} from '@marigold/components';

type CategoryId = 'earlyBird' | 'regular' | 'vip';

interface Category {
  id: CategoryId;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  soldOut?: boolean;
  badge?: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted early access — limited availability.',
    maxQuantity: 12,
    badge: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard three-day festival admission.',
    maxQuantity: 20,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium access with backstage perks and lounge entry.',
    maxQuantity: 0,
    soldOut: true,
    badge: 'Sold Out',
  },
];

const formatCurrency = (amount: number) =>
  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<CategoryId, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState<
    { type: 'success' | 'warning'; title: string; message: string } | null
  >(null);

  const setQuantity = (id: CategoryId, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const lineItems = CATEGORIES.map((cat) => {
    const qty = quantities[cat.id];
    return { ...cat, qty, subtotal: qty * cat.price };
  }).filter((item) => item.qty > 0);

  const totalTickets = lineItems.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const emailValid = EMAIL_RE.test(email);
  const showEmailError = email.length > 0 && !emailValid;

  const handlePurchase = () => {
    if (totalTickets === 0) {
      setFeedback({
        type: 'warning',
        title: 'No tickets selected',
        message: 'Please choose at least one ticket before purchasing.',
      });
      return;
    }
    if (fullName.trim() === '') {
      setFeedback({
        type: 'warning',
        title: 'Full name required',
        message: 'Please enter your full name to complete the purchase.',
      });
      return;
    }
    if (email.trim() === '' || !emailValid) {
      setFeedback({
        type: 'warning',
        title: 'Valid email required',
        message: 'Please enter a valid email address to complete the purchase.',
      });
      return;
    }
    setFeedback({
      type: 'success',
      title: 'Order confirmed',
      message: `Thank you, ${fullName}! Your order of ${totalTickets} ticket${
        totalTickets > 1 ? 's' : ''
      } totalling ${formatCurrency(
        grandTotal,
      )} has been confirmed. A confirmation has been sent to ${email}.`,
    });
  };

  return (
    <Stack space="xlarge">
      {/* Event information */}
      <Stack space="xsmall">
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Text weight="bold">July 15-17, 2026</Text>
        <Text>Stadtpark Freiburg</Text>
        <Text>
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      <Divider />

      {/* Ticket categories */}
      <Stack space="medium">
        <Headline level={2}>Tickets</Headline>
        <Inline space="medium" alignY="stretch">
          {CATEGORIES.map((cat) => (
            <Card key={cat.id}>
              <Stack space="small">
                <Inline space="small" alignY="center">
                  <Headline level={3}>{cat.name}</Headline>
                  {cat.badge ? (
                    <Badge variant={cat.soldOut ? 'error' : 'info'}>
                      {cat.badge}
                    </Badge>
                  ) : null}
                </Inline>
                <Headline level={4}>{formatCurrency(cat.price)}</Headline>
                <Text>{cat.description}</Text>
                <NumberField
                  label="Quantity"
                  value={quantities[cat.id]}
                  onChange={(v) => setQuantity(cat.id, v)}
                  minValue={0}
                  maxValue={cat.maxQuantity}
                  step={1}
                  isDisabled={cat.soldOut}
                />
              </Stack>
            </Card>
          ))}
        </Inline>
      </Stack>

      <Divider />

      {/* Buyer information */}
      <Stack space="medium">
        <Headline level={2}>Your Information</Headline>
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
          isInvalid={showEmailError}
          errorMessage="Please enter a valid email address."
        />
        <TextField
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={setPhone}
          description="Optional"
        />
      </Stack>

      <Divider />

      {/* Order summary */}
      <Stack space="medium">
        <Headline level={2}>Order Summary</Headline>
        {lineItems.length === 0 ? (
          <Text>No tickets selected yet.</Text>
        ) : (
          <Stack space="small">
            {lineItems.map((item) => (
              <Inline key={item.id} space="small" alignY="center">
                <Text>
                  {item.name} ({formatCurrency(item.price)}) × {item.qty}
                </Text>
                <Text weight="bold">{formatCurrency(item.subtotal)}</Text>
              </Inline>
            ))}
          </Stack>
        )}
        <Divider />
        <Inline space="medium" alignY="center">
          <Headline level={3}>Grand Total</Headline>
          <Headline level={3}>{formatCurrency(grandTotal)}</Headline>
        </Inline>

        <Button variant="primary" onPress={handlePurchase}>
          Purchase Tickets
        </Button>

        {feedback ? (
          <Card>
            <Stack space="xsmall">
              <Headline level={4}>
                {feedback.type === 'success' ? '✓ ' : '⚠ '}
                {feedback.title}
              </Headline>
              <Text>{feedback.message}</Text>
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default TestApp;
