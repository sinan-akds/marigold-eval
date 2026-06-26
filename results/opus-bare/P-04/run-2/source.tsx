import { useState } from 'react';
import {
  Stack,
  Inline,
  Columns,
  Headline,
  Text,
  Card,
  Badge,
  Button,
  NumberField,
  TextField,
  Divider,
  Message,
} from '@marigold/components';

type CategoryId = 'early' | 'regular' | 'vip';

interface Category {
  id: CategoryId;
  name: string;
  price: number;
  description: string;
  maxValue?: number;
  badge?: string;
  soldOut?: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 'early',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted early access — grab them before they go.',
    maxValue: 12,
    badge: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival admission for all three days.',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium viewing area and backstage access.',
    soldOut: true,
    badge: 'Sold Out',
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Feedback = { variant: 'success' | 'warning'; title: string; text: string };

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<CategoryId, number>>({
    early: 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const setQuantity = (id: CategoryId, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Number.isNaN(value) ? 0 : value }));
  };

  const lineItems = CATEGORIES.filter((c) => quantities[c.id] > 0).map((c) => ({
    ...c,
    quantity: quantities[c.id],
    subtotal: quantities[c.id] * c.price,
  }));

  const totalTickets = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePurchase = () => {
    setFeedback(null);

    const isNameInvalid = name.trim() === '';
    const isEmailInvalid = !EMAIL_REGEX.test(email.trim());
    setNameInvalid(isNameInvalid);
    setEmailInvalid(isEmailInvalid);

    if (totalTickets === 0) {
      setFeedback({
        variant: 'warning',
        title: 'No tickets selected',
        text: 'Please choose at least one ticket before purchasing.',
      });
      return;
    }

    if (isNameInvalid || isEmailInvalid) {
      setFeedback({
        variant: 'warning',
        title: 'Missing buyer information',
        text: 'Please provide your full name and a valid email address to continue.',
      });
      return;
    }

    setFeedback({
      variant: 'success',
      title: 'Order confirmed',
      text: `Thank you, ${name.trim()}! Your order of ${totalTickets} ticket${
        totalTickets === 1 ? '' : 's'
      } for a total of $${grandTotal} has been confirmed. A confirmation has been sent to ${email.trim()}.`,
    });
  };

  return (
    <Stack space={8}>
      {/* Event information */}
      <Stack space={2}>
        <Headline level="1">Summer Music Festival 2026</Headline>
        <Text weight="bold">July 15–17, 2026 · Stadtpark Freiburg</Text>
        <Text>Three days of live music featuring local and international artists.</Text>
      </Stack>

      <Divider />

      {/* Ticket categories */}
      <Stack space={4}>
        <Headline level="2">Tickets</Headline>
        <Columns columns={[1, 1, 1]} space={4}>
          {CATEGORIES.map((category) => (
            <Card key={category.id}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level="3">{category.name}</Headline>
                  {category.badge ? (
                    <Badge variant={category.soldOut ? 'error' : 'info'}>
                      {category.badge}
                    </Badge>
                  ) : null}
                </Inline>
                <Text weight="bold">${category.price}</Text>
                <Text>{category.description}</Text>
                <NumberField
                  label="Quantity"
                  minValue={0}
                  maxValue={category.maxValue}
                  value={quantities[category.id]}
                  onChange={(value) => setQuantity(category.id, value)}
                  isDisabled={category.soldOut}
                />
              </Stack>
            </Card>
          ))}
        </Columns>
      </Stack>

      <Divider />

      {/* Buyer information */}
      <Stack space={4}>
        <Headline level="2">Your details</Headline>
        <Stack space={3}>
          <TextField
            label="Full Name"
            isRequired
            value={name}
            onChange={setName}
            isInvalid={nameInvalid}
            errorMessage="Please enter your full name."
          />
          <TextField
            label="Email"
            type="email"
            isRequired
            value={email}
            onChange={setEmail}
            isInvalid={emailInvalid}
            errorMessage="Please enter a valid email address."
          />
          <TextField
            label="Phone Number"
            description="Optional"
            value={phone}
            onChange={setPhone}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* Order summary */}
      <Stack space={4}>
        <Headline level="2">Order summary</Headline>
        <Card>
          <Stack space={3}>
            {lineItems.length === 0 ? (
              <Text>No tickets selected yet.</Text>
            ) : (
              lineItems.map((item) => (
                <Inline key={item.id} space={3} alignY="center">
                  <Text>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text weight="bold">${item.subtotal}</Text>
                </Inline>
              ))
            )}
            <Divider />
            <Inline space={3} alignY="center">
              <Headline level="3">Total</Headline>
              <Headline level="3">${grandTotal}</Headline>
            </Inline>
          </Stack>
        </Card>

        {feedback ? (
          <Message variant={feedback.variant} messageTitle={feedback.title}>
            {feedback.text}
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
