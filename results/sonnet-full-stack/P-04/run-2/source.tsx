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

interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQty: number;
  available: boolean;
  limitedText?: string;
  soldOut?: boolean;
}

const TICKETS: Ticket[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited early access tickets.',
    maxQty: 12,
    available: true,
    limitedText: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival admission.',
    maxQty: 99,
    available: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience with backstage access.',
    maxQty: 0,
    available: false,
    soldOut: true,
  },
];

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0) * t.price,
    0
  );
  const lineItems = TICKETS.filter(t => (quantities[t.id] ?? 0) > 0);

  const nameError = attempted && !name.trim();
  const emailError = attempted && !isValidEmail(email);
  const noTicketsError = attempted && totalTickets === 0;
  const hasErrors = nameError || emailError || noTicketsError;

  const handleQtyChange = (id: string, val: number) => {
    setOrderSuccess(false);
    setQuantities(prev => ({
      ...prev,
      [id]: Number.isFinite(val) ? val : 0,
    }));
  };

  return (
    <main>
    <Inset space={8}>
      <Stack space={8}>
        {/* Event header */}
        <Card>
          <Inset spaceX="padding-regular" spaceY="padding-snug">
            <Stack space={2}>
              <Headline level={1}>Summer Music Festival 2026</Headline>
              <Inline space={4}>
                <Text weight="bold">July 15–17, 2026</Text>
                <Text variant="muted">Stadtpark Freiburg</Text>
              </Inline>
              <Text>
                Three days of live music featuring local and international
                artists.
              </Text>
            </Stack>
          </Inset>
        </Card>

        {/* Ticket categories */}
        <Stack space={4}>
          <Headline level={2}>Select Tickets</Headline>
          <Tiles tilesWidth="260px" space={4} stretch equalHeight>
            {TICKETS.map(ticket => (
              <Card key={ticket.id}>
                <Inset spaceX="padding-regular" spaceY="padding-snug">
                  <Stack space={3}>
                    <Inline space={2}>
                      <Text weight="bold" size="lg">
                        {ticket.name}
                      </Text>
                      {ticket.limitedText && (
                        <Badge variant="warning">{ticket.limitedText}</Badge>
                      )}
                      {ticket.soldOut && (
                        <Badge variant="error">Sold Out</Badge>
                      )}
                    </Inline>
                    <Text weight="bold" size="xl">
                      ${ticket.price}
                    </Text>
                    <Text variant="muted">{ticket.description}</Text>
                    <NumberField
                      label="Quantity"
                      value={quantities[ticket.id]}
                      onChange={val => handleQtyChange(ticket.id, val)}
                      minValue={0}
                      maxValue={ticket.available ? ticket.maxQty : 0}
                      disabled={!ticket.available}
                      hideStepper
                    />
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Tiles>
        </Stack>

        <Divider />

        {/* Buyer info, order summary and checkout */}
        <Form
          onSubmit={e => {
            e.preventDefault();
            setAttempted(true);
            const valid =
              totalTickets > 0 &&
              name.trim() !== '' &&
              isValidEmail(email);
            setOrderSuccess(valid);
          }}
        >
          <Stack space={6}>
            {/* Buyer fields */}
            <Stack space={4}>
              <Headline level={2}>Buyer Information</Headline>
              <TextField
                label="Full Name"
                value={name}
                onChange={val => {
                  setOrderSuccess(false);
                  setName(val);
                }}
                error={nameError}
                errorMessage="Full Name is required."
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={val => {
                  setOrderSuccess(false);
                  setEmail(val);
                }}
                error={emailError}
                errorMessage="Please enter a valid email address."
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
              />
            </Stack>

            <Divider />

            {/* Order summary */}
            <Stack space={3}>
              <Headline level={3}>Order Summary</Headline>
              {lineItems.length === 0 ? (
                <Text variant="muted">No tickets selected yet.</Text>
              ) : (
                <Stack space={2}>
                  {lineItems.map(ticket => (
                    <Inline key={ticket.id} space={2}>
                      <Text>
                        {ticket.name} &times; {quantities[ticket.id]}
                      </Text>
                      <Split />
                      <Text weight="bold">
                        ${(quantities[ticket.id] ?? 0) * ticket.price}
                      </Text>
                    </Inline>
                  ))}
                  <Divider />
                  <Inline space={2}>
                    <Text weight="bold">Grand Total</Text>
                    <Split />
                    <Text weight="bold" size="xl">
                      ${grandTotal}
                    </Text>
                  </Inline>
                </Stack>
              )}
            </Stack>

            {/* Feedback */}
            {orderSuccess && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
                <SectionMessage.Content>
                  Thank you, {name}! Your {totalTickets} ticket
                  {totalTickets !== 1 ? 's have' : ' has'} been reserved. A
                  confirmation will be sent to {email}.
                </SectionMessage.Content>
              </SectionMessage>
            )}
            {attempted && hasErrors && (
              <SectionMessage variant="error">
                <SectionMessage.Title>
                  Unable to complete purchase
                </SectionMessage.Title>
                <SectionMessage.Content>
                  <Stack space={1}>
                    {noTicketsError && (
                      <Text>Please select at least one ticket.</Text>
                    )}
                    {nameError && <Text>Full Name is required.</Text>}
                    {emailError && (
                      <Text>Please enter a valid email address.</Text>
                    )}
                  </Stack>
                </SectionMessage.Content>
              </SectionMessage>
            )}

            <Button type="submit" variant="primary" fullWidth>
              Purchase Tickets
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Inset>
    </main>
  );
};

export default TestApp;
