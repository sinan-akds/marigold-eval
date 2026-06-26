import { useState } from 'react';
import {
  Stack,
  Inline,
  Card,
  Headline,
  Text,
  Badge,
  NumberField,
  TextField,
  Button,
  Divider,
  Message,
} from '@marigold/components';

interface Category {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  badge?: string;
  soldOut?: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 'early',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted advance tickets for the quickest fans.',
    maxQuantity: 12,
    badge: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission for all three festival days.',
    maxQuantity: 10,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium access with backstage lounge and perks.',
    maxQuantity: 0,
    badge: 'Sold Out',
    soldOut: true,
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

type Feedback = {
  variant: 'success' | 'warning';
  title: string;
  message: string;
};

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    early: 0,
    regular: 0,
    vip: 0,
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const lineItems = CATEGORIES.map((category) => {
    const quantity = quantities[category.id] ?? 0;
    return {
      category,
      quantity,
      subtotal: quantity * category.price,
    };
  }).filter((item) => item.quantity > 0);

  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const nameMissing = fullName.trim() === '';
  const emailMissing = email.trim() === '';
  const emailInvalid = !emailMissing && !EMAIL_REGEX.test(email.trim());

  const setQuantity = (id: string, value: number) => {
    setFeedback(null);
    setQuantities((prev) => ({
      ...prev,
      [id]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const handlePurchase = () => {
    setSubmitted(true);

    if (totalQuantity === 0) {
      setFeedback({
        variant: 'warning',
        title: 'No tickets selected',
        message: 'Please choose at least one ticket before purchasing.',
      });
      return;
    }

    if (nameMissing || emailMissing || emailInvalid) {
      setFeedback({
        variant: 'warning',
        title: 'Missing buyer information',
        message:
          'Please provide your full name and a valid email address to complete the order.',
      });
      return;
    }

    const ticketWord = totalQuantity === 1 ? 'ticket' : 'tickets';
    setFeedback({
      variant: 'success',
      title: 'Order confirmed!',
      message: `Thank you, ${fullName.trim()}. ${totalQuantity} ${ticketWord} for ${formatMoney(
        grandTotal
      )} have been reserved. A confirmation has been sent to ${email.trim()}.`,
    });
  };

  return (
    <Stack space={8}>
      <Stack space={2}>
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Text fontWeight="bold">July 15–17, 2026</Text>
        <Text>Stadtpark Freiburg</Text>
        <Text>
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      <Divider />

      <Stack space={4}>
        <Headline level={2}>Tickets</Headline>
        <Inline space={4}>
          {CATEGORIES.map((category) => (
            <Card key={category.id}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level={3}>{category.name}</Headline>
                  {category.badge ? <Badge>{category.badge}</Badge> : null}
                </Inline>
                <Text fontWeight="bold">{formatMoney(category.price)}</Text>
                <Text>{category.description}</Text>
                <NumberField
                  label="Quantity"
                  value={quantities[category.id] ?? 0}
                  onChange={(value) => setQuantity(category.id, value)}
                  minValue={0}
                  maxValue={category.maxQuantity}
                  step={1}
                  isDisabled={category.soldOut}
                />
              </Stack>
            </Card>
          ))}
        </Inline>
      </Stack>

      <Divider />

      <Stack space={4}>
        <Headline level={2}>Buyer Information</Headline>
        <Stack space={3}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            isRequired
            error={submitted && nameMissing}
            errorMessage="Full name is required."
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            isRequired
            error={submitted && (emailMissing || emailInvalid)}
            errorMessage={
              emailMissing
                ? 'Email is required.'
                : 'Please enter a valid email address.'
            }
          />
          <TextField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={setPhone}
            description="Optional"
          />
        </Stack>
      </Stack>

      <Divider />

      <Stack space={4}>
        <Headline level={2}>Order Summary</Headline>
        <Stack space={2}>
          {lineItems.length === 0 ? (
            <Text>No tickets selected yet.</Text>
          ) : (
            lineItems.map((item) => (
              <Inline key={item.category.id} space={3} alignY="center">
                <Text>
                  {item.category.name} × {item.quantity}
                </Text>
                <Text fontWeight="bold">{formatMoney(item.subtotal)}</Text>
              </Inline>
            ))
          )}
        </Stack>
        <Divider />
        <Inline space={3} alignY="center">
          <Headline level={3}>Grand Total</Headline>
          <Headline level={3}>{formatMoney(grandTotal)}</Headline>
        </Inline>

        {feedback ? (
          <Message variant={feedback.variant} messageTitle={feedback.title}>
            {feedback.message}
          </Message>
        ) : null}

        <Button variant="primary" onPress={handlePurchase}>
          Purchase Tickets
        </Button>
      </Stack>
    </Stack>
  );
};

export default TestApp;
