import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
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

const TICKETS = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Grab an early bird ticket at a special discounted price.',
    badgeLabel: 'Only 12 left',
    badgeVariant: 'warning' as const,
    max: 12,
    soldOut: false,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission to all three days of the festival.',
    badgeLabel: 'Available',
    badgeVariant: 'success' as const,
    max: undefined,
    soldOut: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Exclusive access with premium facilities and meet & greets.',
    badgeLabel: 'Sold Out',
    badgeVariant: 'error' as const,
    max: 0,
    soldOut: true,
  },
];

type QuantityMap = Record<string, number>;

const TestApp = () => {
  const [quantities, setQuantities] = useState<QuantityMap>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0) * t.price,
    0
  );

  const noTickets = totalTickets === 0;
  const missingName = !name.trim();
  const invalidEmail =
    !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasErrors = noTickets || missingName || invalidEmail;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    if (!hasErrors) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <Container>
        <Inset space={8}>
          <SectionMessage variant="success">
            <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
            <SectionMessage.Content>
              Thank you, {name}! Your tickets for Summer Music Festival 2026
              have been purchased. A confirmation will be sent to {email}.
            </SectionMessage.Content>
          </SectionMessage>
        </Inset>
      </Container>
    );
  }

  return (
    <Container>
      <Inset space={8}>
        <Stack space={8}>
          {/* Event Details */}
          <Card p={6}>
            <Stack space={3}>
              <Headline level={1}>Summer Music Festival 2026</Headline>
              <Inline space={6}>
                <Text>July 15–17, 2026</Text>
                <Text>Stadtpark Freiburg</Text>
              </Inline>
              <Text>
                Three days of live music featuring local and international
                artists.
              </Text>
            </Stack>
          </Card>

          {/* Ticket Categories */}
          <Stack space={4}>
            <Headline level={2}>Ticket Categories</Headline>
            <Tiles tilesWidth="260px" space={4} stretch equalHeight>
              {TICKETS.map(ticket => (
                <Card key={ticket.id} p={4}>
                  <Stack space={3}>
                    <Inline space={2} alignY="center">
                      <Headline level={3}>{ticket.name}</Headline>
                      <Badge variant={ticket.badgeVariant}>
                        {ticket.badgeLabel}
                      </Badge>
                    </Inline>
                    <Text>{ticket.description}</Text>
                    <Text weight="bold">${ticket.price}</Text>
                    <NumberField
                      label="Quantity"
                      minValue={0}
                      maxValue={ticket.max}
                      value={quantities[ticket.id]}
                      onChange={val =>
                        setQuantities(q => ({ ...q, [ticket.id]: val }))
                      }
                      disabled={ticket.soldOut}
                      width="1/2"
                    />
                  </Stack>
                </Card>
              ))}
            </Tiles>
          </Stack>

          {/* Buyer Information & Order Summary in one Form */}
          <Form onSubmit={handleSubmit}>
            <Stack space={8}>
              {/* Buyer Information */}
              <Stack space={4}>
                <Headline level={2}>Buyer Information</Headline>
                <Stack space={3}>
                  <TextField
                    label="Full Name"
                    value={name}
                    onChange={setName}
                    error={attemptedSubmit && missingName}
                    errorMessage="Full name is required."
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    error={attemptedSubmit && invalidEmail}
                    errorMessage="Please enter a valid email address."
                  />
                  <TextField
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                  />
                </Stack>
              </Stack>

              {/* Order Summary */}
              <Stack space={4}>
                <Headline level={2}>Order Summary</Headline>
                <Card p={4}>
                  <Stack space={3}>
                    {totalTickets === 0 ? (
                      <Text>No tickets selected yet.</Text>
                    ) : (
                      <>
                        {TICKETS.filter(t => quantities[t.id] > 0).map(
                          ticket => (
                            <Inline key={ticket.id} space={2}>
                              <Text>
                                {ticket.name} × {quantities[ticket.id]}
                              </Text>
                              <Split />
                              <Text>
                                ${quantities[ticket.id] * ticket.price}
                              </Text>
                            </Inline>
                          )
                        )}
                        <Divider />
                      </>
                    )}

                    <Inline space={2}>
                      <Text weight="bold">Grand Total</Text>
                      <Split />
                      <Text weight="bold">${grandTotal}</Text>
                    </Inline>

                    {attemptedSubmit && noTickets && (
                      <SectionMessage variant="warning">
                        <SectionMessage.Title>
                          No tickets selected
                        </SectionMessage.Title>
                        <SectionMessage.Content>
                          Please select at least one ticket before purchasing.
                        </SectionMessage.Content>
                      </SectionMessage>
                    )}

                    {attemptedSubmit && !noTickets && (missingName || invalidEmail) && (
                      <SectionMessage variant="error">
                        <SectionMessage.Title>
                          Buyer information incomplete
                        </SectionMessage.Title>
                        <SectionMessage.Content>
                          Please fill in your Full Name and a valid Email
                          address before proceeding.
                        </SectionMessage.Content>
                      </SectionMessage>
                    )}

                    <Button variant="primary" type="submit" fullWidth>
                      Purchase Tickets
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Stack>
          </Form>
        </Stack>
      </Inset>
    </Container>
  );
};

export default TestApp;
