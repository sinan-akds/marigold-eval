import { useState } from 'react';
import {
  Badge,
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
  Text,
  TextField,
} from '@marigold/components';

type CategoryId = 'earlyBird' | 'regular' | 'vip';

interface Category {
  id: CategoryId;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  soldOut?: boolean;
  badge: { variant: 'warning' | 'success' | 'error'; label: string };
}

const CATEGORIES: Category[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted entry for the first wave of fans.',
    maxQuantity: 12,
    badge: { variant: 'warning', label: 'Only 12 left' },
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard three-day festival pass.',
    maxQuantity: 20,
    badge: { variant: 'success', label: 'Available' },
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Backstage access and premium viewing area.',
    maxQuantity: 0,
    soldOut: true,
    badge: { variant: 'error', label: 'Sold Out' },
  },
];

type Feedback =
  | { type: 'success'; message: string }
  | { type: 'warning'; message: string }
  | null;

const formatPrice = (value: number) => `$${value}`;

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<CategoryId, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [feedback, setFeedback] = useState<Feedback>(null);

  const lineItems = CATEGORIES.map(category => ({
    category,
    quantity: quantities[category.id],
    subtotal: quantities[category.id] * category.price,
  })).filter(item => item.quantity > 0);

  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleQuantityChange = (id: CategoryId, value: number) => {
    const category = CATEGORIES.find(c => c.id === id)!;
    const safeValue = Number.isNaN(value) ? 0 : value;
    const clamped = Math.max(0, Math.min(category.maxQuantity, safeValue));
    setQuantities(prev => ({ ...prev, [id]: clamped }));
    setFeedback(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (totalQuantity === 0) {
      setFeedback({
        type: 'warning',
        message: 'Please select at least one ticket before purchasing.',
      });
      return;
    }
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setFeedback({
      type: 'success',
      message: `Thank you, ${data.fullName}! Your order of ${totalQuantity} ticket(s) totalling ${formatPrice(
        grandTotal
      )} is confirmed. A confirmation has been sent to ${data.email}.`,
    });
  };

  const handleInvalid = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback({
      type: 'warning',
      message:
        'Please fill in all required buyer fields with a valid email address before purchasing.',
    });
  };

  return (
    <Inset space={6}>
      <Stack space={8}>
        <Stack space={2}>
          <Headline level={1}>Summer Music Festival 2026</Headline>
          <Inline space={4} alignY="center">
            <Text weight="bold">July 15–17, 2026</Text>
            <Text color="text-secondary">Stadtpark Freiburg</Text>
          </Inline>
          <Text>
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>

        <Stack space={4}>
          <Headline level={2}>Choose Your Tickets</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="48em">
            {CATEGORIES.map(category => (
              <Card key={category.id}>
                <Inset space={5}>
                  <Stack space={4}>
                    <Inline space={2} alignY="center" alignX="between">
                      <Headline level={3}>{category.name}</Headline>
                      <Badge variant={category.badge.variant}>
                        {category.badge.label}
                      </Badge>
                    </Inline>
                    <Text weight="bold" size="body-large">
                      {formatPrice(category.price)}
                    </Text>
                    <Text>{category.description}</Text>
                    <NumberField
                      label="Quantity"
                      value={quantities[category.id]}
                      minValue={0}
                      maxValue={category.maxQuantity}
                      disabled={category.soldOut}
                      width="full"
                      onChange={value =>
                        handleQuantityChange(category.id, value)
                      }
                    />
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Columns>
        </Stack>

        <Form onSubmit={handleSubmit} onInvalid={handleInvalid}>
          <Stack space={8}>
            <Stack space={4}>
              <Headline level={2}>Buyer Information</Headline>
              <Columns columns={[1, 1]} space={4} collapseAt="40em">
                <TextField
                  label="Full Name"
                  name="fullName"
                  type="text"
                  required
                  errorMessage="Please enter your full name."
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  errorMessage="Please enter a valid email address."
                />
              </Columns>
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                description="Optional"
              />
            </Stack>

            <Stack space={4}>
              <Headline level={2}>Order Summary</Headline>
              <Card>
                <Inset space={5}>
                  <Stack space={4}>
                    {lineItems.length === 0 ? (
                      <Text color="text-secondary">
                        No tickets selected yet.
                      </Text>
                    ) : (
                      <Stack space={3}>
                        {lineItems.map(item => (
                          <Columns
                            key={item.category.id}
                            columns={[1, 'fit']}
                            space={4}
                          >
                            <Text>
                              {item.category.name} × {item.quantity}
                            </Text>
                            <Text>{formatPrice(item.subtotal)}</Text>
                          </Columns>
                        ))}
                      </Stack>
                    )}
                    <Columns columns={[1, 'fit']} space={4}>
                      <Headline level={3}>Grand Total</Headline>
                      <Headline level={3}>{formatPrice(grandTotal)}</Headline>
                    </Columns>
                  </Stack>
                </Inset>
              </Card>

              {feedback ? (
                <SectionMessage variant={feedback.type}>
                  <SectionMessage.Title>
                    {feedback.type === 'success'
                      ? 'Order Confirmed'
                      : 'Action Required'}
                  </SectionMessage.Title>
                  <SectionMessage.Content>
                    {feedback.message}
                  </SectionMessage.Content>
                </SectionMessage>
              ) : null}

              <Stack alignX="right">
                <Button variant="primary" type="submit">
                  Purchase Tickets
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
