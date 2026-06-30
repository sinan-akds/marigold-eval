import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Form,
  Headline,
  Inline,
  Inset,
  NumberField,
  NumericFormat,
  SectionMessage,
  Split,
  Stack,
  Text,
  TextField,
  Tiles,
} from '@marigold/components';

type CategoryStatus = 'limited' | 'available' | 'soldOut';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  status: CategoryStatus;
  max: number;
}

const CATEGORIES: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted entry for the first wave of fans.',
    status: 'limited',
    max: 12,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard three-day festival admission.',
    status: 'available',
    max: 20,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Backstage access, lounge and premium viewing.',
    status: 'soldOut',
    max: 0,
  },
];

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const lineItems = useMemo(
    () =>
      CATEGORIES.map(category => ({
        category,
        quantity: quantities[category.id] ?? 0,
        subtotal: (quantities[category.id] ?? 0) * category.price,
      })).filter(item => item.quantity > 0),
    [quantities]
  );

  const totalTickets = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

  const setQuantity = (id: string, value: number) => {
    const safe = Number.isNaN(value) ? 0 : value;
    setQuantities(prev => ({ ...prev, [id]: safe }));
    setSuccess(null);
    setWarning(null);
  };

  // Fires when all required buyer fields pass native validation.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);

    if (totalTickets === 0) {
      setWarning('Please select at least one ticket before purchasing.');
      return;
    }

    setWarning(null);
    setSuccess(
      `Thank you, ${name.trim()}! Your order of ${totalTickets} ticket${
        totalTickets > 1 ? 's' : ''
      } for the Summer Music Festival 2026 is confirmed. A confirmation has been sent to ${email.trim()}.`
    );
  };

  // Fires when a required buyer field is missing or the email is invalid.
  const handleInvalid = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setWarning(
      'Please fill in your full name and a valid email address before purchasing.'
    );
  };

  return (
    <Inset space={8}>
      <Stack space={8}>
        {/* Event information */}
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

        {/* Ticket categories */}
        <Stack space={4}>
          <Headline level={2}>Choose Your Tickets</Headline>
          <Tiles tilesWidth="240px" space={4} stretch equalHeight>
            {CATEGORIES.map(category => {
              const soldOut = category.status === 'soldOut';
              return (
                <Card key={category.id} p={6}>
                  <Stack space={4}>
                    <Stack space={2}>
                      <Inline space={3} alignY="center" alignX="between">
                        <Headline level={3}>{category.name}</Headline>
                        {category.status === 'limited' && (
                          <Badge variant="warning">Only 12 left</Badge>
                        )}
                        {category.status === 'available' && (
                          <Badge variant="success">Available</Badge>
                        )}
                        {soldOut && <Badge variant="error">Sold Out</Badge>}
                      </Inline>
                      <Text weight="bold" size="2xl">
                        <NumericFormat
                          style="currency"
                          currency="USD"
                          value={category.price}
                        />
                      </Text>
                      <Text variant="muted">{category.description}</Text>
                    </Stack>
                    <NumberField
                      label="Quantity"
                      width="full"
                      minValue={0}
                      maxValue={category.max}
                      value={quantities[category.id]}
                      onChange={value => setQuantity(category.id, value)}
                      disabled={soldOut}
                    />
                  </Stack>
                </Card>
              );
            })}
          </Tiles>
        </Stack>

        {/* Buyer information + order summary */}
        <Form onSubmit={handleSubmit} onInvalid={handleInvalid}>
          <Stack space={8}>
            <Stack space={4}>
              <Headline level={2}>Buyer Information</Headline>
              <Card p={6}>
                <Stack space={5}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    width="full"
                    value={name}
                    onChange={setName}
                    required
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    width="full"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                  <TextField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    width="full"
                    value={phone}
                    onChange={setPhone}
                    description="Optional"
                  />
                </Stack>
              </Card>
            </Stack>

            <Stack space={4}>
              <Headline level={2}>Order Summary</Headline>
              <Card p={6}>
                <Stack space={5}>
                  {lineItems.length === 0 ? (
                    <Text variant="muted">No tickets selected yet.</Text>
                  ) : (
                    <Stack space={3}>
                      {lineItems.map(item => (
                        <Inline key={item.category.id} space={4} alignY="center">
                          <Text>
                            {item.category.name} × {item.quantity}
                          </Text>
                          <Split />
                          <Text weight="medium">
                            <NumericFormat
                              style="currency"
                              currency="USD"
                              value={item.subtotal}
                            />
                          </Text>
                        </Inline>
                      ))}
                    </Stack>
                  )}

                  <Inline space={4} alignY="center">
                    <Headline level={3}>Total</Headline>
                    <Split />
                    <Headline level={3}>
                      <NumericFormat
                        style="currency"
                        currency="USD"
                        value={grandTotal}
                      />
                    </Headline>
                  </Inline>

                  {warning && (
                    <SectionMessage variant="warning">
                      <SectionMessage.Title>
                        Unable to complete purchase
                      </SectionMessage.Title>
                      <SectionMessage.Content>{warning}</SectionMessage.Content>
                    </SectionMessage>
                  )}

                  {success && (
                    <SectionMessage variant="success">
                      <SectionMessage.Title>
                        Order confirmed
                      </SectionMessage.Title>
                      <SectionMessage.Content>{success}</SectionMessage.Content>
                    </SectionMessage>
                  )}

                  <Button variant="primary" type="submit">
                    Purchase Tickets
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
