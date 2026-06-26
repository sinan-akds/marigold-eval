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
  maxQty: number;
  soldOut: boolean;
  limitedNote?: string;
}

const TICKETS: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — get in early!',
    maxQty: 12,
    soldOut: false,
    limitedNote: 'Only 12 left',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival access for all three days.',
    maxQty: 20,
    soldOut: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Backstage access and premium viewing areas.',
    maxQty: 0,
    soldOut: true,
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
  const [submitted, setSubmitted] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0) * t.price,
    0
  );
  const selectedTickets = TICKETS.filter(t => (quantities[t.id] ?? 0) > 0);
  const totalTickets = Object.values(quantities).reduce((s, q) => s + q, 0);

  const handlePurchase = () => {
    if (totalTickets === 0) {
      setPurchaseError('Please select at least one ticket before continuing.');
      return;
    }
    if (!name.trim()) {
      setPurchaseError('Full Name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setPurchaseError('A valid email address is required.');
      return;
    }
    setPurchaseError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Inset space={6}>
        <Stack space={8}>
          <SectionMessage variant="success">
            <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
            <SectionMessage.Content>
              <Stack space={2}>
                <Text>
                  Thank you, {name}! Your tickets for the Summer Music Festival
                  2026 are booked.
                </Text>
                <Text>A confirmation email will be sent to {email}.</Text>
              </Stack>
            </SectionMessage.Content>
          </SectionMessage>

          <Card>
            <Inset spaceX="padding-regular" spaceY="padding-snug">
              <Stack space={4}>
                <Headline level={3}>Your Order</Headline>
                {selectedTickets.map(t => (
                  <Inline key={t.id} space={2}>
                    <Text>
                      {quantities[t.id]}× {t.name}
                    </Text>
                    <Split />
                    <Text>${(quantities[t.id] * t.price).toFixed(2)}</Text>
                  </Inline>
                ))}
                <Divider />
                <Inline space={2}>
                  <Text weight="bold">Grand Total</Text>
                  <Split />
                  <Text weight="bold">${grandTotal.toFixed(2)}</Text>
                </Inline>
              </Stack>
            </Inset>
          </Card>

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
            Start Over
          </Button>
        </Stack>
      </Inset>
    );
  }

  return (
    <Inset space={6}>
      <Stack space={8}>
        {/* Event Header */}
        <Card>
          <Inset spaceX="padding-regular" spaceY="padding-snug">
            <Stack space={3}>
              <Headline level={1}>Summer Music Festival 2026</Headline>
              <Inline space={2} alignY="center">
                <Text weight="bold">July 15–17, 2026</Text>
                <Text>·</Text>
                <Text>Stadtpark Freiburg</Text>
              </Inline>
              <Text>
                Three days of live music featuring local and international
                artists.
              </Text>
            </Stack>
          </Inset>
        </Card>

        {/* Ticket Categories */}
        <Stack space={4}>
          <Headline level={2}>Select Tickets</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            {TICKETS.map(ticket => (
              <Card key={ticket.id}>
                <Inset spaceX="padding-regular" spaceY="padding-snug">
                  <Stack space={4}>
                    <Inline space={2} alignY="center">
                      <Headline level={3}>{ticket.name}</Headline>
                      {ticket.soldOut && (
                        <Badge variant="error">Sold Out</Badge>
                      )}
                      {ticket.limitedNote && !ticket.soldOut && (
                        <Badge variant="warning">{ticket.limitedNote}</Badge>
                      )}
                    </Inline>
                    <Headline level={4}>${ticket.price}</Headline>
                    <Text>{ticket.description}</Text>
                    <NumberField
                      label="Quantity"
                      value={quantities[ticket.id] ?? 0}
                      onChange={val =>
                        setQuantities(prev => ({
                          ...prev,
                          [ticket.id]: isNaN(val) ? 0 : val,
                        }))
                      }
                      minValue={0}
                      maxValue={ticket.soldOut ? 0 : ticket.maxQty || 20}
                      disabled={ticket.soldOut}
                      width="1/2"
                    />
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Columns>
        </Stack>

        {/* Buyer Information + Order Summary side by side */}
        <Inline space={4} alignY="top">
          {/* Buyer Information */}
          <Card>
            <Inset spaceX="padding-regular" spaceY="padding-snug">
              <Stack space={4}>
                <Headline level={2}>Buyer Information</Headline>
                <Form onSubmit={e => e.preventDefault()}>
                  <Stack space={4}>
                    <TextField
                      label="Full Name"
                      required
                      value={name}
                      onChange={setName}
                      width={80}
                    />
                    <TextField
                      label="Email"
                      type="email"
                      required
                      value={email}
                      onChange={setEmail}
                      width={80}
                    />
                    <TextField
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      width={80}
                    />
                  </Stack>
                </Form>
              </Stack>
            </Inset>
          </Card>

          {/* Order Summary */}
          <Card>
            <Inset spaceX="padding-regular" spaceY="padding-snug">
              <Stack space={4}>
                <Headline level={2}>Order Summary</Headline>
                {selectedTickets.length === 0 ? (
                  <Text>No tickets selected yet.</Text>
                ) : (
                  <Stack space={2}>
                    {selectedTickets.map(t => (
                      <Inline key={t.id} space={2}>
                        <Text>
                          {quantities[t.id]}× {t.name}
                        </Text>
                        <Split />
                        <Text>
                          ${(quantities[t.id] * t.price).toFixed(2)}
                        </Text>
                      </Inline>
                    ))}
                  </Stack>
                )}
                <Divider />
                <Inline space={2}>
                  <Text weight="bold">Grand Total</Text>
                  <Split />
                  <Headline level={3}>${grandTotal.toFixed(2)}</Headline>
                </Inline>

                {purchaseError && (
                  <SectionMessage variant="error">
                    <SectionMessage.Title>
                      Cannot complete purchase
                    </SectionMessage.Title>
                    <SectionMessage.Content>
                      {purchaseError}
                    </SectionMessage.Content>
                  </SectionMessage>
                )}

                <Button
                  variant="primary"
                  fullWidth
                  onPress={handlePurchase}
                >
                  Purchase Tickets
                </Button>
              </Stack>
            </Inset>
          </Card>
        </Inline>
      </Stack>
    </Inset>
  );
};

export default TestApp;
