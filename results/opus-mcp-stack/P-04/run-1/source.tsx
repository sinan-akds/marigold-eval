import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Headline,
  Inline,
  Inset,
  NumberField,
  SectionMessage,
  Split,
  Stack,
  Text,
  TextField,
  Tiles,
} from '@marigold/components';

type CategoryId = 'earlyBird' | 'regular' | 'vip';

interface Category {
  id: CategoryId;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  soldOut?: boolean;
  limitedNote?: string;
}

const categories: Category[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted entry for the whole festival.',
    maxQuantity: 12,
    limitedNote: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard three-day festival pass.',
    maxQuantity: 10,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Backstage access and premium viewing area.',
    maxQuantity: 0,
    soldOut: true,
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<CategoryId, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'warning';
    title: string;
    content: string;
  } | null>(null);

  const setQuantity = (id: CategoryId, value: number) =>
    setQuantities(prev => ({ ...prev, [id]: Number.isNaN(value) ? 0 : value }));

  const lineItems = categories
    .map(category => ({
      category,
      quantity: quantities[category.id],
      subtotal: quantities[category.id] * category.price,
    }))
    .filter(item => item.quantity > 0);

  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (totalQuantity === 0) {
      setFeedback({
        variant: 'warning',
        title: 'No tickets selected',
        content: 'Choose a quantity for at least one ticket category to continue.',
      });
      return;
    }

    if (!name.trim()) {
      setFeedback({
        variant: 'warning',
        title: 'Name required',
        content: 'Enter your full name so we can issue your tickets.',
      });
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setFeedback({
        variant: 'warning',
        title: 'Valid email required',
        content: 'Enter a valid email address so we can send your confirmation.',
      });
      return;
    }

    setFeedback({
      variant: 'success',
      title: 'Order confirmed!',
      content: `Thank you, ${name.trim()}. ${totalQuantity} ticket${
        totalQuantity > 1 ? 's' : ''
      } totalling ${formatCurrency(
        grandTotal
      )} are confirmed. A confirmation has been sent to ${email.trim()}.`,
    });
  };

  return (
    <Inset space={8}>
      <Stack space={8} alignX="center">
        <Stack space={6}>
          {/* Event information */}
          <Stack space={2}>
            <Headline level={1}>Summer Music Festival 2026</Headline>
            <Inline space={2} alignY="center">
              <Badge variant="info">July 15-17, 2026</Badge>
              <Text weight="medium">Stadtpark Freiburg</Text>
            </Inline>
            <Text color="text-secondary-muted">
              Three days of live music featuring local and international artists.
            </Text>
          </Stack>

          <Divider />

          {/* Ticket categories */}
          <Stack space={4}>
            <Headline level={2}>Choose your tickets</Headline>
            <Tiles tilesWidth="240px" space={4} stretch equalHeight>
              {categories.map(category => (
                <Card key={category.id} p={5}>
                  <Stack space={4}>
                    <Stack space={2}>
                      <Split>
                        <Headline level={3}>{category.name}</Headline>
                        {category.soldOut ? (
                          <Badge variant="error">Sold Out</Badge>
                        ) : category.limitedNote ? (
                          <Badge variant="warning">{category.limitedNote}</Badge>
                        ) : (
                          <Badge variant="success">Available</Badge>
                        )}
                      </Split>
                      <Text fontSize="xl" weight="bold">
                        {formatCurrency(category.price)}
                      </Text>
                      <Text color="text-secondary-muted">
                        {category.description}
                      </Text>
                    </Stack>
                    <NumberField
                      label="Quantity"
                      width="full"
                      minValue={0}
                      maxValue={category.maxQuantity}
                      value={quantities[category.id]}
                      onChange={value => setQuantity(category.id, value)}
                      disabled={category.soldOut}
                    />
                  </Stack>
                </Card>
              ))}
            </Tiles>
          </Stack>

          <Divider />

          {/* Buyer information + Order summary */}
          <Form onSubmit={handleSubmit}>
            <Stack space={6}>
              <Stack space={4}>
                <Headline level={2}>Buyer information</Headline>
                <Stack space={3}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={name}
                    onChange={setName}
                    required
                    width="full"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                    width="full"
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    description="Optional"
                    width="full"
                  />
                </Stack>
              </Stack>

              <Divider />

              {/* Order summary */}
              <Stack space={4}>
                <Headline level={2}>Order summary</Headline>
                <Card p={5}>
                  <Stack space={3}>
                    {lineItems.length === 0 ? (
                      <Text color="text-secondary-muted">
                        No tickets selected yet.
                      </Text>
                    ) : (
                      lineItems.map(item => (
                        <Split key={item.category.id}>
                          <Text>
                            {item.category.name} × {item.quantity}
                          </Text>
                          <Text weight="medium">
                            {formatCurrency(item.subtotal)}
                          </Text>
                        </Split>
                      ))
                    )}
                    <Divider />
                    <Split>
                      <Text weight="bold" fontSize="lg">
                        Grand Total
                      </Text>
                      <Text weight="bold" fontSize="lg">
                        {formatCurrency(grandTotal)}
                      </Text>
                    </Split>
                  </Stack>
                </Card>
              </Stack>

              {feedback && (
                <SectionMessage variant={feedback.variant}>
                  <SectionMessage.Title>{feedback.title}</SectionMessage.Title>
                  <SectionMessage.Content>
                    {feedback.content}
                  </SectionMessage.Content>
                </SectionMessage>
              )}

              <Button variant="primary" type="submit" size="large">
                Purchase Tickets
              </Button>
            </Stack>
          </Form>
        </Stack>
      </Stack>
    </Inset>
  );
};

export default TestApp;
