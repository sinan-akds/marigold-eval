import { useState } from 'react';
import {
  AppLayout,
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
  Split,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

type TicketId = 'early-bird' | 'regular' | 'vip';

interface Ticket {
  id: TicketId;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  soldOut: boolean;
  limitNote: string | null;
}

const TICKETS: Ticket[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — grab yours before they run out!',
    maxQuantity: 12,
    soldOut: false,
    limitNote: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission for all three festival days.',
    maxQuantity: 20,
    soldOut: false,
    limitNote: null,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience with backstage access and VIP lounge.',
    maxQuantity: 0,
    soldOut: true,
    limitNote: null,
  },
];

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<TicketId, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + quantities[t.id] * t.price,
    0
  );
  const selectedTickets = TICKETS.filter(t => quantities[t.id] > 0);

  const updateQuantity = (id: TicketId, value: number) => {
    setQuantities(prev => ({ ...prev, [id]: isNaN(value) ? 0 : value }));
  };

  const handlePurchase = () => {
    let valid = true;

    if (totalTickets === 0) {
      setTicketError('Please select at least one ticket before purchasing.');
      valid = false;
    } else {
      setTicketError('');
    }

    if (!name.trim()) {
      setNameError('Full name is required.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!valid) return;

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout>
        <AppLayout.Main>
          <Inset space={8}>
            <Stack space={6}>
              <Headline level={1}>Summer Music Festival 2026</Headline>
              <SectionMessage variant="success">
                <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
                <SectionMessage.Content>
                  Thank you, {name}! Your tickets for Summer Music Festival 2026
                  have been confirmed. A confirmation receipt will be sent to{' '}
                  {email}.
                </SectionMessage.Content>
              </SectionMessage>
              <Button
                variant="secondary"
                onPress={() => {
                  setSubmitted(false);
                  setQuantities({ 'early-bird': 0, regular: 0, vip: 0 });
                  setName('');
                  setEmail('');
                  setPhone('');
                }}
              >
                Back to Shop
              </Button>
            </Stack>
          </Inset>
        </AppLayout.Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppLayout.Main>
        <Inset space={8}>
          <Stack space={8}>
        {/* Event Info */}
        <Stack space={2}>
          <Headline level={1}>Summer Music Festival 2026</Headline>
          <Inline space={3}>
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
          <Headline level={2}>Select Tickets</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="50em">
            {TICKETS.map(ticket => (
              <Card key={ticket.id}>
                <Inset spaceX="padding-regular" spaceY="padding-snug">
                  <Stack space={3}>
                    <Inline space={2}>
                      <Headline level={3}>{ticket.name}</Headline>
                      {ticket.soldOut ? (
                        <Badge variant="error">Sold Out</Badge>
                      ) : ticket.limitNote ? (
                        <Badge variant="warning">{ticket.limitNote}</Badge>
                      ) : null}
                    </Inline>
                    <Text weight="bold" size="xl">
                      ${ticket.price}
                    </Text>
                    <Text variant="muted">{ticket.description}</Text>
                    <NumberField
                      label="Quantity"
                      value={quantities[ticket.id]}
                      onChange={val => updateQuantity(ticket.id, val)}
                      minValue={0}
                      maxValue={ticket.soldOut ? 0 : ticket.maxQuantity}
                      disabled={ticket.soldOut}
                      width="1/3"
                    />
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Columns>
        </Stack>

        <Divider />

        {/* Buyer Info */}
        <Stack space={4}>
          <Headline level={2}>Your Information</Headline>
          <Form onSubmit={e => e.preventDefault()}>
            <Stack space={4}>
              <TextField
                label="Full Name"
                value={name}
                onChange={setName}
                required
                error={!!nameError}
                errorMessage={nameError}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                error={!!emailError}
                errorMessage={emailError}
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
              />
            </Stack>
          </Form>
        </Stack>

        <Divider />

        {/* Order Summary */}
        <Stack space={4}>
          <Headline level={2}>Order Summary</Headline>
          <Card>
            <Inset spaceX="padding-regular" spaceY="padding-snug">
              <Stack space={3}>
                {selectedTickets.length === 0 ? (
                  <Text variant="muted">No tickets selected yet.</Text>
                ) : (
                  selectedTickets.map(ticket => (
                    <Inline key={ticket.id} space={4}>
                      <Text>
                        {ticket.name} × {quantities[ticket.id]}
                      </Text>
                      <Split />
                      <Text weight="bold">
                        ${quantities[ticket.id] * ticket.price}
                      </Text>
                    </Inline>
                  ))
                )}
                <Divider />
                <Inline space={4}>
                  <Text weight="bold" size="lg">
                    Grand Total
                  </Text>
                  <Split />
                  <Text weight="bold" size="lg">
                    ${grandTotal}
                  </Text>
                </Inline>
              </Stack>
            </Inset>
          </Card>

          {ticketError && (
            <SectionMessage variant="warning">
              <SectionMessage.Title>No tickets selected</SectionMessage.Title>
              <SectionMessage.Content>{ticketError}</SectionMessage.Content>
            </SectionMessage>
          )}

          <Button variant="primary" onPress={handlePurchase} fullWidth>
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
