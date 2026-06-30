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
} from '@marigold/components';

type TicketId = 'early' | 'regular' | 'vip';

interface TicketCategory {
  id: TicketId;
  name: string;
  price: number;
  description: string;
  maxValue?: number;
  note?: string;
  soldOut?: boolean;
}

const TICKETS: TicketCategory[] = [
  {
    id: 'early',
    name: 'Early Bird',
    price: 49,
    description: 'Discounted admission for the first wave of fans.',
    maxValue: 12,
    note: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard three-day festival admission.',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium access with backstage perks and lounge entry.',
    soldOut: true,
  },
];

const formatPrice = (amount: number) => `$${amount}`;

type Feedback = { type: 'success' | 'warning'; title: string; message: string };

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<TicketId, number>>({
    early: 0,
    regular: 0,
    vip: 0,
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const updateQuantity = (id: TicketId, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Number.isNaN(value) ? 0 : value,
    }));
    setFeedback(null);
  };

  const selected = TICKETS.filter(ticket => quantities[ticket.id] > 0);
  const totalQuantity = selected.reduce(
    (sum, ticket) => sum + quantities[ticket.id],
    0
  );
  const grandTotal = selected.reduce(
    (sum, ticket) => sum + ticket.price * quantities[ticket.id],
    0
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (totalQuantity < 1) {
      setFeedback({
        type: 'warning',
        title: 'No tickets selected',
        message:
          'Please choose at least one ticket before completing your purchase.',
      });
      return;
    }

    const data = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as Record<string, string>;

    setFeedback({
      type: 'success',
      title: 'Order confirmed!',
      message: `Thank you, ${data.fullName}. Your order of ${totalQuantity} ticket${
        totalQuantity > 1 ? 's' : ''
      } for ${formatPrice(
        grandTotal
      )} is confirmed. A confirmation has been sent to ${data.email}.`,
    });
  };

  return (
    <Inset space={8}>
      <Stack space={10}>
        {/* Event information */}
        <Stack space={2}>
          <Headline level="1">Summer Music Festival 2026</Headline>
          <Inline space={4} alignY="center">
            <Badge variant="info">July 15–17, 2026</Badge>
            <Text weight="medium">Stadtpark Freiburg</Text>
          </Inline>
          <Text variant="muted">
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>

        {/* Ticket categories */}
        <Stack space={4}>
          <Headline level="2">Choose your tickets</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="48em">
            {TICKETS.map(ticket => (
              <Card key={ticket.id}>
                <Inset space={5}>
                  <Stack space={4}>
                    <Inline space={3} alignX="between" alignY="center">
                      <Headline level="3">{ticket.name}</Headline>
                      {ticket.soldOut ? (
                        <Badge variant="error">Sold Out</Badge>
                      ) : ticket.note ? (
                        <Badge variant="warning">{ticket.note}</Badge>
                      ) : (
                        <Badge variant="success">Available</Badge>
                      )}
                    </Inline>
                    <Headline level="4">{formatPrice(ticket.price)}</Headline>
                    <Text variant="muted">{ticket.description}</Text>
                    <NumberField
                      label="Quantity"
                      minValue={0}
                      maxValue={ticket.maxValue}
                      value={quantities[ticket.id]}
                      onChange={value => updateQuantity(ticket.id, value)}
                      disabled={ticket.soldOut}
                    />
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Columns>
        </Stack>

        {/* Buyer information + order summary */}
        <Form onSubmit={handleSubmit}>
          <Columns columns={[1, 1]} space={8} collapseAt="48em">
            <Stack space={4}>
              <Headline level="2">Buyer information</Headline>
              <TextField
                label="Full Name"
                name="fullName"
                required
                description="Required."
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                description="We'll send your tickets here."
              />
              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                description="Optional."
              />
            </Stack>

            <Stack space={4}>
              <Headline level="2">Order summary</Headline>
              <Card>
                <Inset space={5}>
                  <Stack space={3}>
                    {selected.length > 0 ? (
                      selected.map(ticket => (
                        <Inline
                          key={ticket.id}
                          space={3}
                          alignX="between"
                          alignY="center"
                        >
                          <Text>
                            {ticket.name} × {quantities[ticket.id]}
                          </Text>
                          <Text weight="medium">
                            {formatPrice(ticket.price * quantities[ticket.id])}
                          </Text>
                        </Inline>
                      ))
                    ) : (
                      <Text variant="muted">No tickets selected yet.</Text>
                    )}
                    <Divider />
                    <Inline space={3} alignX="between" alignY="center">
                      <Headline level="4">Total</Headline>
                      <Headline level="4">{formatPrice(grandTotal)}</Headline>
                    </Inline>
                  </Stack>
                </Inset>
              </Card>
              <Button variant="primary" type="submit" fullWidth>
                Purchase Tickets
              </Button>
              {feedback ? (
                <SectionMessage variant={feedback.type}>
                  <SectionMessage.Title>{feedback.title}</SectionMessage.Title>
                  <SectionMessage.Content>
                    {feedback.message}
                  </SectionMessage.Content>
                </SectionMessage>
              ) : null}
            </Stack>
          </Columns>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
