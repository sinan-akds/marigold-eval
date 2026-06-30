import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Columns,
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

const TICKETS = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — grab yours before they\'re gone.',
    max: 12,
    soldOut: false,
    limited: true,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission to all three days.',
    max: 99,
    soldOut: false,
    limited: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience with backstage access.',
    max: 0,
    soldOut: true,
    limited: false,
  },
];

export default function TestApp() {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + t.price * (quantities[t.id] ?? 0),
    0
  );
  const lineItems = TICKETS.filter(t => (quantities[t.id] ?? 0) > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (totalTickets === 0) {
      setPurchaseError('Please select at least one ticket before purchasing.');
      return;
    }
    if (!fullName.trim()) {
      setPurchaseError('Full name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setPurchaseError('Please enter a valid email address.');
      return;
    }

    setPurchaseError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Inset space={8}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you, {fullName}! Your tickets for the Summer Music Festival
            2026 have been booked. A confirmation will be sent to {email}.
          </SectionMessage.Content>
        </SectionMessage>
      </Inset>
    );
  }

  return (
    <Inset space={8}>
      <Form onSubmit={handleSubmit}>
        <Stack space={8}>
          {/* Event Header */}
          <Stack space={2}>
            <Headline level="1">Summer Music Festival 2026</Headline>
            <Inline space={2}>
              <Text>July 15–17, 2026</Text>
              <Text>·</Text>
              <Text>Stadtpark Freiburg</Text>
            </Inline>
            <Text variant="muted">
              Three days of live music featuring local and international artists.
            </Text>
          </Stack>

          <Divider />

          {/* Ticket Categories */}
          <Stack space={4}>
            <Headline level="2">Choose Your Tickets</Headline>
            <Tiles tilesWidth="240px" space={4} equalHeight stretch>
              {TICKETS.map(ticket => (
                <Card key={ticket.id} p={4}>
                  <Stack space={3}>
                    <Stack space={1}>
                      <Inline space={2}>
                        <Headline level="3">{ticket.name}</Headline>
                        {ticket.soldOut && (
                          <Badge variant="error">Sold Out</Badge>
                        )}
                        {ticket.limited && !ticket.soldOut && (
                          <Badge variant="warning">Only 12 left</Badge>
                        )}
                      </Inline>
                      <Text size="xl">${ticket.price}</Text>
                    </Stack>
                    <Text variant="muted">{ticket.description}</Text>
                    <NumberField
                      label="Quantity"
                      value={quantities[ticket.id] ?? 0}
                      minValue={0}
                      maxValue={ticket.soldOut ? 0 : ticket.max}
                      onChange={value => {
                        setQuantities(prev => ({ ...prev, [ticket.id]: value }));
                        setPurchaseError(null);
                      }}
                      disabled={ticket.soldOut}
                      width="1/2"
                    />
                  </Stack>
                </Card>
              ))}
            </Tiles>
          </Stack>

          <Divider />

          {/* Buyer Information */}
          <Stack space={4}>
            <Headline level="2">Your Information</Headline>
            <Stack space={3}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={setFullName}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
              />
            </Stack>
          </Stack>

          <Divider />

          {/* Order Summary */}
          <Stack space={4}>
            <Headline level="2">Order Summary</Headline>
            <Card p={4}>
              <Stack space={3}>
                {lineItems.length === 0 ? (
                  <Text variant="muted">No tickets selected yet.</Text>
                ) : (
                  lineItems.map(ticket => (
                    <Columns
                      key={ticket.id}
                      columns={[1, 'fit']}
                      space={2}
                      collapseAt="0em"
                    >
                      <Text>
                        {ticket.name} × {quantities[ticket.id]}
                      </Text>
                      <Text>
                        ${ticket.price * (quantities[ticket.id] ?? 0)}
                      </Text>
                    </Columns>
                  ))
                )}
                <Divider />
                <Columns columns={[1, 'fit']} space={2} collapseAt="0em">
                  <Headline level="3">Grand Total</Headline>
                  <Headline level="3">${grandTotal}</Headline>
                </Columns>
              </Stack>
            </Card>

            {purchaseError && (
              <SectionMessage variant="warning">
                <SectionMessage.Title>Cannot Complete Purchase</SectionMessage.Title>
                <SectionMessage.Content>{purchaseError}</SectionMessage.Content>
              </SectionMessage>
            )}

            <Button variant="primary" fullWidth type="submit">
              Purchase Tickets
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Inset>
  );
}
