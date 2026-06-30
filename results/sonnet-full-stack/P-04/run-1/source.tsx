import { useState } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Columns,
  Divider,
  Headline,
  Inline,
  Inset,
  NumberField,
  SectionMessage,
  Split,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  status: 'available' | 'limited' | 'soldOut';
  maxQty: number;
}

const TICKETS: TicketCategory[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: "Limited availability – grab yours before they're gone!",
    status: 'limited',
    maxQty: 12,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival access for all three days.',
    status: 'available',
    maxQty: 99,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience with exclusive access and perks.',
    status: 'soldOut',
    maxQty: 0,
  },
];

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = TICKETS.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0) * t.price,
    0
  );
  const hasTickets = TICKETS.some(t => (quantities[t.id] ?? 0) > 0);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handlePurchase = () => {
    const newErrors: Record<string, string> = {};
    if (!hasTickets) newErrors.tickets = 'Please select at least one ticket.';
    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim()) newErrors.email = 'Email address is required.';
    else if (!isValidEmail(email))
      newErrors.email = 'Please enter a valid email address.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout>
        <AppLayout.Main>
          <Inset space="square-relaxed">
            <SectionMessage variant="success">
              <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
              <SectionMessage.Content>
                Thank you, {name}! Your tickets for Summer Music Festival 2026
                have been booked. A confirmation will be sent to {email}.
              </SectionMessage.Content>
            </SectionMessage>
          </Inset>
        </AppLayout.Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppLayout.Main>
        <Inset space="square-relaxed">
    <Stack space={8}>
      {/* Event Header */}
      <Stack space={3}>
        <Headline level="1">Summer Music Festival 2026</Headline>
        <Inline space={2}>
          <Text weight="bold">July 15–17, 2026</Text>
          <Text>·</Text>
          <Text>Stadtpark Freiburg</Text>
        </Inline>
        <Text variant="muted">
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      {/* Ticket Categories */}
      <Stack space={4}>
        <Headline level="2">Tickets</Headline>
        <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
          {TICKETS.map(ticket => {
            const isSoldOut = ticket.status === 'soldOut';
            const isLimited = ticket.status === 'limited';
            return (
              <Card key={ticket.id}>
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Headline level="3">{ticket.name}</Headline>
                    {isSoldOut && <Badge variant="error">Sold Out</Badge>}
                    {isLimited && <Badge variant="warning">Only 12 left</Badge>}
                  </Inline>
                  <Text weight="bold" size="xl">
                    ${ticket.price}
                  </Text>
                  <Text variant="muted">{ticket.description}</Text>
                  <NumberField
                    label="Quantity"
                    value={quantities[ticket.id]}
                    minValue={0}
                    maxValue={ticket.maxQty}
                    onChange={v =>
                      setQuantities(q => ({
                        ...q,
                        [ticket.id]: Number.isNaN(v) ? 0 : v,
                      }))
                    }
                    disabled={isSoldOut}
                    width="1/2"
                  />
                </Stack>
              </Card>
            );
          })}
        </Columns>
      </Stack>

      {/* Buyer Information */}
      <Stack space={4}>
        <Headline level="2">Buyer Information</Headline>
        <Stack space={4}>
          <TextField
            label="Full Name"
            value={name}
            onChange={setName}
            required
            error={!!errors.name}
            errorMessage={errors.name}
          />
          <TextField
            label="Email"
            value={email}
            onChange={setEmail}
            required
            error={!!errors.email}
            errorMessage={errors.email}
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={setPhone}
          />
        </Stack>
      </Stack>

      {/* Order Summary */}
      <Stack space={4}>
        <Headline level="2">Order Summary</Headline>
        <Card>
          <Stack space={3}>
            {!hasTickets && (
              <Text variant="muted">No tickets selected yet.</Text>
            )}
            {TICKETS.filter(t => (quantities[t.id] ?? 0) > 0).map(ticket => (
              <Inline key={ticket.id} space={2}>
                <Text>
                  {ticket.name} × {quantities[ticket.id]}
                </Text>
                <Split />
                <Text weight="bold">
                  ${(quantities[ticket.id] ?? 0) * ticket.price}
                </Text>
              </Inline>
            ))}
            <Divider />
            <Inline space={2}>
              <Text weight="bold">Total</Text>
              <Split />
              <Text weight="bold" size="xl">
                ${total}
              </Text>
            </Inline>
          </Stack>
        </Card>

        {errors.tickets && (
          <SectionMessage variant="warning">
            <SectionMessage.Title>No Tickets Selected</SectionMessage.Title>
            <SectionMessage.Content>{errors.tickets}</SectionMessage.Content>
          </SectionMessage>
        )}

        {!errors.tickets && (errors.name || errors.email) && (
          <SectionMessage variant="warning">
            <SectionMessage.Title>Required Fields Missing</SectionMessage.Title>
            <SectionMessage.Content>
              Please complete all required buyer information above.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Button variant="primary" onPress={handlePurchase}>
          Purchase Tickets
        </Button>
      </Stack>
    </Stack>
        </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
