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
  status?: string;
}

const CATEGORIES: Category[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted entry for early supporters.',
    maxQuantity: 12,
    status: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival admission for all three days.',
    maxQuantity: 20,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium access with backstage perks and lounge entry.',
    maxQuantity: 0,
    soldOut: true,
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<CategoryId, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalQuantity = CATEGORIES.reduce(
    (sum, category) => sum + quantities[category.id],
    0
  );
  const grandTotal = CATEGORIES.reduce(
    (sum, category) => sum + quantities[category.id] * category.price,
    0
  );

  const nameMissing = name.trim() === '';
  const emailInvalid = email.trim() === '' || !EMAIL_REGEX.test(email.trim());
  const noTickets = totalQuantity === 0;

  const handleQuantityChange = (id: CategoryId, value: number) => {
    setSuccess(false);
    setQuantities(prev => ({
      ...prev,
      [id]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);

    if (noTickets || nameMissing || emailInvalid) {
      setSuccess(false);
      return;
    }

    setSuccess(true);
  };

  const handleInvalid = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    setSuccess(false);
  };

  const selectedLineItems = CATEGORIES.filter(
    category => quantities[category.id] > 0
  );

  const warningMessages: string[] = [];
  if (attempted && !success) {
    if (noTickets) {
      warningMessages.push('Select at least one ticket before purchasing.');
    }
    if (nameMissing) {
      warningMessages.push('Enter your full name.');
    }
    if (emailInvalid) {
      warningMessages.push('Enter a valid email address.');
    }
  }
  const showWarning = warningMessages.length > 0;

  return (
    <Inset space={6}>
      <Stack space={8}>
        <Stack space={2}>
          <Headline level="1">Summer Music Festival 2026</Headline>
          <Inline space={4} alignY="center">
            <Text weight="bold">July 15–17, 2026</Text>
            <Text variant="muted">Stadtpark Freiburg</Text>
          </Inline>
          <Text>
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>

        <Stack space={4}>
          <Headline level="2">Tickets</Headline>
          <Tiles tilesWidth="240px" space={4} stretch equalHeight>
            {CATEGORIES.map(category => (
              <Card key={category.id} p={5}>
                <Stack space={4}>
                  <Stack space={2}>
                    <Inline space={2} alignY="center" alignX="between">
                      <Headline level="3">{category.name}</Headline>
                      {category.soldOut ? (
                        <Badge variant="error">Sold Out</Badge>
                      ) : category.status ? (
                        <Badge variant="warning">{category.status}</Badge>
                      ) : (
                        <Badge variant="success">Available</Badge>
                      )}
                    </Inline>
                    <Text weight="bold" size="lg">
                      {formatPrice(category.price)}
                    </Text>
                    <Text variant="muted">{category.description}</Text>
                  </Stack>
                  <NumberField
                    label="Quantity"
                    value={quantities[category.id]}
                    minValue={0}
                    maxValue={category.maxQuantity}
                    width="full"
                    disabled={category.soldOut}
                    onChange={value => handleQuantityChange(category.id, value)}
                  />
                </Stack>
              </Card>
            ))}
          </Tiles>
        </Stack>

        <Form onSubmit={handleSubmit} onInvalid={handleInvalid}>
          <Stack space={8}>
            <Stack space={4}>
              <Headline level="2">Buyer Information</Headline>
              <TextField
                label="Full Name"
                name="fullName"
                value={name}
                onChange={value => {
                  setSuccess(false);
                  setName(value);
                }}
                required
                error={attempted && nameMissing}
                errorMessage="Enter your full name."
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={value => {
                  setSuccess(false);
                  setEmail(value);
                }}
                required
                error={attempted && emailInvalid}
                errorMessage="Enter a valid email address."
              />
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={phone}
                description="Optional"
                onChange={setPhone}
              />
            </Stack>

            <Card p={5}>
              <Stack space={4}>
                <Headline level="3">Order Summary</Headline>
                {selectedLineItems.length > 0 ? (
                  <Stack space={2}>
                    {selectedLineItems.map(category => (
                      <Inline
                        key={category.id}
                        space={4}
                        alignX="between"
                        alignY="center"
                      >
                        <Text>
                          {category.name} × {quantities[category.id]}
                        </Text>
                        <Text weight="medium">
                          {formatPrice(
                            quantities[category.id] * category.price
                          )}
                        </Text>
                      </Inline>
                    ))}
                  </Stack>
                ) : (
                  <Text variant="muted">No tickets selected yet.</Text>
                )}
                <Divider />
                <Inline space={4} alignX="between" alignY="center">
                  <Headline level="4">Total</Headline>
                  <Headline level="4">{formatPrice(grandTotal)}</Headline>
                </Inline>
              </Stack>
            </Card>

            {success ? (
              <SectionMessage variant="success">
                <SectionMessage.Title>Order confirmed!</SectionMessage.Title>
                <SectionMessage.Content>
                  Thank you, {name.trim()}. We have reserved {totalQuantity}{' '}
                  ticket{totalQuantity === 1 ? '' : 's'} for a total of{' '}
                  {formatPrice(grandTotal)}. A confirmation has been sent to{' '}
                  {email.trim()}.
                </SectionMessage.Content>
              </SectionMessage>
            ) : null}

            {showWarning ? (
              <SectionMessage variant="warning">
                <SectionMessage.Title>
                  Unable to complete your purchase
                </SectionMessage.Title>
                <SectionMessage.Content>
                  <Stack space={1}>
                    {warningMessages.map(message => (
                      <Text key={message}>{message}</Text>
                    ))}
                  </Stack>
                </SectionMessage.Content>
              </SectionMessage>
            ) : null}

            <Button variant="primary" type="submit">
              Purchase Tickets
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
