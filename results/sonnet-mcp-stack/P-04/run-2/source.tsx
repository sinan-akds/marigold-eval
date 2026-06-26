import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Headline,
  Inline,
  NumberField,
  SectionMessage,
  Split,
  Stack,
  Text,
  TextField,
  Tiles,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  soldOut: boolean;
  limitedCount?: number;
  maxQuantity: number;
}

const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability — grab your spot early and save!',
    soldOut: false,
    limitedCount: 12,
    maxQuantity: 12,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival admission for all three days.',
    soldOut: false,
    maxQuantity: 20,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Exclusive access with premium perks and backstage passes.',
    soldOut: true,
    maxQuantity: 0,
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

  const [attempted, setAttempted] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const grandTotal = TICKET_CATEGORIES.reduce(
    (sum, cat) => sum + (quantities[cat.id] || 0) * cat.price,
    0
  );

  const selectedCategories = TICKET_CATEGORIES.filter(cat => quantities[cat.id] > 0);

  const isEmailValid = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const nameError =
    attempted && !name.trim() ? 'Full name is required.' : undefined;
  const emailError = attempted
    ? !email.trim()
      ? 'Email address is required.'
      : !isEmailValid(email)
      ? 'Please enter a valid email address.'
      : undefined
    : undefined;

  const noTicketsWarning = attempted && totalTickets === 0;
  const hasFieldErrors = !!(nameError || emailError);

  const handlePurchase = () => {
    setAttempted(true);

    const hasTickets = totalTickets > 0;
    const hasName = name.trim().length > 0;
    const validEmail = email.trim().length > 0 && isEmailValid(email);

    if (hasTickets && hasName && validEmail) {
      setPurchaseSuccess(true);
    }
  };

  if (purchaseSuccess) {
    return (
      <Stack space={6}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            <Stack space={3}>
              <Text>
                Thank you, {name}! Your order has been placed successfully.
              </Text>
              <Text>A confirmation email will be sent to {email}.</Text>
              <Divider />
              {selectedCategories.map(cat => (
                <Inline key={cat.id}>
                  <Text>
                    {cat.name} &times; {quantities[cat.id]}
                  </Text>
                  <Split />
                  <Text>${quantities[cat.id] * cat.price}</Text>
                </Inline>
              ))}
              <Divider />
              <Inline>
                <Text weight="bold">Grand Total</Text>
                <Split />
                <Text weight="bold">${grandTotal}</Text>
              </Inline>
            </Stack>
          </SectionMessage.Content>
        </SectionMessage>
      </Stack>
    );
  }

  return (
    <Stack space={8}>
      {/* Event Header */}
      <Stack space={2}>
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Inline space={4}>
          <Text variant="muted">July 15–17, 2026</Text>
          <Text variant="muted">Stadtpark Freiburg</Text>
        </Inline>
        <Text>
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      <Divider />

      {/* Ticket Categories */}
      <Stack space={4}>
        <Headline level={2}>Select Your Tickets</Headline>
        <Tiles tilesWidth="260px" space={4} stretch equalHeight>
          {TICKET_CATEGORIES.map(cat => (
            <Card key={cat.id} p={4}>
              <Stack space={3}>
                <Stack space={1}>
                  <Inline>
                    <Headline level={3}>{cat.name}</Headline>
                    <Split />
                    {cat.soldOut ? (
                      <Badge variant="error">Sold Out</Badge>
                    ) : cat.limitedCount !== undefined ? (
                      <Badge variant="warning">
                        Only {cat.limitedCount} left
                      </Badge>
                    ) : null}
                  </Inline>
                  <Text size="2xl">${cat.price}</Text>
                </Stack>
                <Text variant="muted">{cat.description}</Text>
                <NumberField
                  label="Quantity"
                  value={quantities[cat.id]}
                  minValue={0}
                  maxValue={cat.maxQuantity}
                  onChange={(val: number) =>
                    setQuantities(prev => ({
                      ...prev,
                      [cat.id]: val ?? 0,
                    }))
                  }
                  disabled={cat.soldOut}
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
        <Headline level={2}>Buyer Information</Headline>
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
        <Card p={4}>
          <Stack space={3}>
            {selectedCategories.length === 0 ? (
              <Text variant="muted">No tickets selected yet.</Text>
            ) : (
              selectedCategories.map(cat => (
                <Inline key={cat.id}>
                  <Text>
                    {cat.name} &times; {quantities[cat.id]}
                  </Text>
                  <Split />
                  <Text>${quantities[cat.id] * cat.price}</Text>
                </Inline>
              ))
            )}
            <Divider />
            <Inline>
              <Text weight="bold" size="lg">
                Grand Total
              </Text>
              <Split />
              <Text weight="bold" size="xl">
                ${grandTotal}
              </Text>
            </Inline>
          </Stack>
        </Card>

        {noTicketsWarning && (
          <SectionMessage variant="warning">
            <SectionMessage.Title>No Tickets Selected</SectionMessage.Title>
            <SectionMessage.Content>
              Please select at least one ticket before completing your purchase.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        {attempted && hasFieldErrors && (
          <SectionMessage variant="error">
            <SectionMessage.Title>
              Missing Required Information
            </SectionMessage.Title>
            <SectionMessage.Content>
              Please fill in all required buyer fields above before purchasing.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Button variant="primary" onPress={handlePurchase}>
          Purchase Tickets
        </Button>
      </Stack>
    </Stack>
  );
};

export default TestApp;
