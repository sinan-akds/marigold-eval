import { useMemo, useState } from 'react';
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
  Tiles,
} from '@marigold/components';

type Category = {
  id: string;
  name: string;
  price: number;
  description: string;
  max: number;
  soldOut?: boolean;
  badge?: { label: string; variant: 'warning' | 'error' | 'success' };
};

const CATEGORIES: Category[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted entry for the first wave of fans.',
    max: 12,
    badge: { label: 'Only 12 left', variant: 'warning' },
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard three-day festival pass.',
    max: 20,
    badge: { label: 'Available', variant: 'success' },
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium access with backstage perks.',
    max: 0,
    soldOut: true,
    badge: { label: 'Sold Out', variant: 'error' },
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<
    { type: 'success' | 'warning'; message: string } | null
  >(null);

  const lineItems = useMemo(
    () =>
      CATEGORIES.map(category => {
        const quantity = quantities[category.id] ?? 0;
        return {
          category,
          quantity,
          subtotal: quantity * category.price,
        };
      }).filter(item => item.quantity > 0),
    [quantities]
  );

  const total = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.subtotal, 0),
    [lineItems]
  );
  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);

  const nameMissing = submitted && name.trim() === '';
  const emailMissing = submitted && email.trim() === '';
  const emailInvalid = submitted && email.trim() !== '' && !isValidEmail(email);

  const handleQuantityChange = (id: string, value: number) => {
    setStatus(null);
    setQuantities(prev => ({ ...prev, [id]: Number.isNaN(value) ? 0 : value }));
  };

  const handlePurchase = () => {
    setSubmitted(true);

    if (totalQuantity === 0) {
      setStatus({
        type: 'warning',
        message: 'Please select at least one ticket before purchasing.',
      });
      return;
    }

    if (name.trim() === '' || email.trim() === '' || !isValidEmail(email)) {
      setStatus({
        type: 'warning',
        message:
          'Please complete the required buyer details: a full name and a valid email address.',
      });
      return;
    }

    setStatus({
      type: 'success',
      message: `Thank you, ${name.trim()}! Your order of ${totalQuantity} ticket${
        totalQuantity > 1 ? 's' : ''
      } for ${formatCurrency(
        total
      )} is confirmed. A confirmation email is on its way to ${email.trim()}.`,
    });
  };

  return (
    <Inset space={6}>
      <Stack space={8}>
        <Stack space={2}>
          <Headline level={1}>Summer Music Festival 2026</Headline>
          <Inline space={4} alignY="center">
            <Text weight="bold">July 15–17, 2026</Text>
            <Text variant="muted">Stadtpark Freiburg</Text>
          </Inline>
          <Text>
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>

        <Stack space={4}>
          <Headline level={2}>Tickets</Headline>
          <Tiles space={4} tilesWidth="240px" stretch>
            {CATEGORIES.map(category => (
              <Card key={category.id} p={4}>
                <Stack space={4}>
                  <Stack space={2}>
                    <Inline space={2} alignY="center">
                      <Headline level={3}>{category.name}</Headline>
                      {category.badge ? (
                        <Badge variant={category.badge.variant}>
                          {category.badge.label}
                        </Badge>
                      ) : null}
                    </Inline>
                    <Text weight="bold" size="xl">
                      {formatCurrency(category.price)}
                    </Text>
                    <Text variant="muted">{category.description}</Text>
                  </Stack>
                  <NumberField
                    label="Quantity"
                    width="full"
                    minValue={0}
                    maxValue={category.max}
                    value={quantities[category.id] ?? 0}
                    disabled={category.soldOut}
                    onChange={value => handleQuantityChange(category.id, value)}
                  />
                </Stack>
              </Card>
            ))}
          </Tiles>
        </Stack>

        <Columns columns={[1, 1]} space={8} collapseAt="40rem">
          <Stack space={4}>
            <Headline level={2}>Buyer Information</Headline>
            <Form>
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  value={name}
                  required
                  error={nameMissing}
                  errorMessage="Full name is required."
                  onChange={value => {
                    setStatus(null);
                    setName(value);
                  }}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  required
                  error={emailMissing || emailInvalid}
                  errorMessage={
                    emailMissing
                      ? 'Email is required.'
                      : 'Please enter a valid email address.'
                  }
                  onChange={value => {
                    setStatus(null);
                    setEmail(value);
                  }}
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  description="Optional"
                  onChange={setPhone}
                />
              </Stack>
            </Form>
          </Stack>

          <Stack space={4}>
            <Headline level={2}>Order Summary</Headline>
            <Card p={4}>
              <Stack space={4}>
                {lineItems.length > 0 ? (
                  <Stack space={3}>
                    {lineItems.map(item => (
                      <Inline
                        key={item.category.id}
                        space={4}
                        alignX="between"
                        alignY="center"
                      >
                        <Text>
                          {item.category.name} × {item.quantity}
                        </Text>
                        <Text>{formatCurrency(item.subtotal)}</Text>
                      </Inline>
                    ))}
                  </Stack>
                ) : (
                  <Text variant="muted">No tickets selected yet.</Text>
                )}
                <Inline space={4} alignX="between" alignY="center">
                  <Headline level={3}>Total</Headline>
                  <Headline level={3}>{formatCurrency(total)}</Headline>
                </Inline>
                <Button variant="primary" onPress={handlePurchase}>
                  Purchase Tickets
                </Button>
              </Stack>
            </Card>

            {status ? (
              <SectionMessage variant={status.type}>
                <SectionMessage.Title>
                  {status.type === 'success'
                    ? 'Order Confirmed'
                    : 'Unable to Complete Purchase'}
                </SectionMessage.Title>
                <SectionMessage.Content>{status.message}</SectionMessage.Content>
              </SectionMessage>
            ) : null}
          </Stack>
        </Columns>
      </Stack>
    </Inset>
  );
};

export default TestApp;
