import { useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Headline,
  Inline,
  NumberField,
  SectionMessage,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  stock?: number;
  maxPerOrder?: number;
  soldOut?: boolean;
}

const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability',
    stock: 12,
    maxPerOrder: 12,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience',
    soldOut: true,
  },
];

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email.length === 0 || emailRegex.test(email);

  const handleQuantityChange = (categoryId: string, value: number) => {
    const category = TICKET_CATEGORIES.find(c => c.id === categoryId);
    const maxAllowed = category?.maxPerOrder ?? Infinity;
    const validValue = Math.min(Math.max(0, value), maxAllowed);
    setQuantities(prev => ({
      ...prev,
      [categoryId]: validValue,
    }));
  };

  const calculateSubtotal = (categoryId: string) => {
    const category = TICKET_CATEGORIES.find(c => c.id === categoryId);
    return (category?.price ?? 0) * quantities[categoryId];
  };

  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const grandTotal = Object.keys(quantities).reduce(
    (sum, categoryId) => sum + calculateSubtotal(categoryId),
    0
  );

  const handlePurchase = () => {
    setSuccessMessage('');
    setErrorMessage('');

    if (totalQuantity === 0) {
      setErrorMessage('Please select at least one ticket to purchase.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const ticketSummary = TICKET_CATEGORIES.filter(c => quantities[c.id] > 0)
      .map(c => `${quantities[c.id]} ${c.name}`)
      .join(', ');

    setSuccessMessage(
      `Order confirmed! You've purchased ${ticketSummary} for $${grandTotal.toFixed(2)}. Confirmation sent to ${email}.`
    );

    setQuantities({ 'early-bird': 0, regular: 0, vip: 0 });
    setFullName('');
    setEmail('');
    setPhone('');
  };

  return (
    <Stack space={8}>
      {/* Event Header */}
      <Stack space={3}>
        <Headline level="1">Summer Music Festival 2026</Headline>
        <Stack space={2}>
          <Text weight="medium">July 15-17, 2026</Text>
          <Text weight="medium">Stadtpark Freiburg</Text>
          <Text color="muted">
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>
      </Stack>

      <Divider />

      {/* Ticket Categories */}
      <Stack space={4}>
        <Headline level="2">Ticket Categories</Headline>
        <Stack space={4}>
          {TICKET_CATEGORIES.map(category => (
            <Card key={category.id}>
              <Stack space={3}>
                <Stack space={1}>
                  <Headline level="3">{category.name}</Headline>
                  <Inline space={2}>
                    <Text weight="bold">${category.price}</Text>
                    <Text color="muted" size="sm">
                      {category.soldOut ? (
                        <span style={{ color: 'var(--color-feedback-error)' }}>
                          Sold Out
                        </span>
                      ) : category.stock ? (
                        `Only ${category.stock} left`
                      ) : (
                        'Available'
                      )}
                    </Text>
                  </Inline>
                  <Text color="muted" size="sm">
                    {category.description}
                  </Text>
                </Stack>

                <NumberField
                  label="Quantity"
                  value={quantities[category.id]}
                  onChange={value => handleQuantityChange(category.id, value)}
                  minValue={0}
                  maxValue={category.maxPerOrder ?? 999}
                  disabled={category.soldOut}
                  width="1/4"
                  hideStepper
                />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      <Divider />

      {/* Buyer Information */}
      <Stack space={4}>
        <Headline level="2">Buyer Information</Headline>
        <Stack space={3}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            error={email.length > 0 && !isEmailValid}
            errorMessage={
              email.length > 0 && !isEmailValid
                ? 'Please enter a valid email address'
                : undefined
            }
          />
          <TextField label="Phone Number" value={phone} onChange={setPhone} />
        </Stack>
      </Stack>

      <Divider />

      {/* Order Summary */}
      <Stack space={4}>
        <Headline level="2">Order Summary</Headline>
        <Card>
          <Stack space={3}>
            {TICKET_CATEGORIES.filter(c => quantities[c.id] > 0).map(
              category => (
                <Inline key={category.id} alignX="between">
                  <Text>
                    {quantities[category.id]}x {category.name}
                  </Text>
                  <Text weight="bold">
                    ${calculateSubtotal(category.id).toFixed(2)}
                  </Text>
                </Inline>
              )
            )}
            {totalQuantity > 0 && <Divider />}
            <Inline alignX="between">
              <Text weight="bold">Grand Total:</Text>
              <Text
                weight="bold"
                size="lg"
                color={totalQuantity > 0 ? 'default' : 'muted'}
              >
                ${grandTotal.toFixed(2)}
              </Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>

      {/* Messages */}
      {successMessage && (
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>{successMessage}</SectionMessage.Content>
        </SectionMessage>
      )}

      {errorMessage && (
        <SectionMessage variant="error">
          <SectionMessage.Title>Cannot Complete Order</SectionMessage.Title>
          <SectionMessage.Content>{errorMessage}</SectionMessage.Content>
        </SectionMessage>
      )}

      {/* Submit Button */}
      <Stack alignX="right">
        <Button variant="primary" onPress={handlePurchase}>
          Purchase Tickets
        </Button>
      </Stack>
    </Stack>
  );
};

export default TestApp;
