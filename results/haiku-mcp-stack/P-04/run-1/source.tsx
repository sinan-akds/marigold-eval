import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Columns,
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
  maxQuantity: number;
  available: 'available' | 'limited' | 'soldOut';
  remaining?: number;
}

const TestApp = () => {
  const [quantities, setQuantities] = useState({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [validationError, setValidationError] = useState(false);

  const categories: TicketCategory[] = [
    {
      id: 'earlyBird',
      name: 'Early Bird',
      price: 49,
      description: 'Limited',
      maxQuantity: 12,
      available: 'limited',
      remaining: 12,
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 79,
      description: 'Available',
      maxQuantity: 999,
      available: 'available',
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Sold out',
      maxQuantity: 0,
      available: 'soldOut',
    },
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = email === '' || emailPattern.test(email);

  const totalQuantity =
    quantities.earlyBird + quantities.regular + quantities.vip;

  const subtotals = {
    earlyBird: quantities.earlyBird * 49,
    regular: quantities.regular * 79,
    vip: quantities.vip * 149,
  };

  const grandTotal =
    subtotals.earlyBird + subtotals.regular + subtotals.vip;

  const handlePurchase = () => {
    setSuccessMessage(false);
    setValidationError(false);

    if (!fullName.trim()) {
      setValidationError(true);
      return;
    }

    if (!email.trim() || !isValidEmail) {
      setValidationError(true);
      return;
    }

    if (totalQuantity === 0) {
      setValidationError(true);
      return;
    }

    setSuccessMessage(true);
    setQuantities({ earlyBird: 0, regular: 0, vip: 0 });
    setFullName('');
    setEmail('');
    setPhone('');
  };

  return (
    <Stack space="group">
      <Stack space={3} alignX="left">
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Text>
          <strong>July 15-17, 2026</strong> • Stadtpark Freiburg
        </Text>
        <Text>
          Three days of live music featuring local and international artists.
        </Text>
      </Stack>

      <Divider />

      <Stack space="group">
        <Headline level={2}>Ticket Categories</Headline>
        <Columns columns={[1, 1, 1]} space="group">
          {categories.map(category => (
            <Card key={category.id}>
              <Stack space="tight" alignX="left">
                <Stack space={1} alignX="left">
                  <Headline level={3}>{category.name}</Headline>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">${category.price}</Text>
                    {category.available === 'limited' && (
                      <Badge variant="warning">
                        Only {category.remaining} left
                      </Badge>
                    )}
                    {category.available === 'soldOut' && (
                      <Badge variant="error">Sold Out</Badge>
                    )}
                  </Inline>
                </Stack>
                <Text variant="muted">{category.description}</Text>
                <NumberField
                  label="Quantity"
                  minValue={0}
                  maxValue={category.maxQuantity}
                  value={quantities[category.id as keyof typeof quantities]}
                  onChange={value =>
                    setQuantities({
                      ...quantities,
                      [category.id]: value,
                    })
                  }
                  disabled={category.available === 'soldOut'}
                  hideStepper
                />
              </Stack>
            </Card>
          ))}
        </Columns>
      </Stack>

      <Divider />

      <Stack space="group">
        <Headline level={2}>Your Information</Headline>
        <Stack space={2} alignX="left">
          <TextField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            required
            width="1/2"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            required
            error={!isValidEmail && email !== ''}
            errorMessage={
              !isValidEmail && email !== ''
                ? 'Please enter a valid email address'
                : undefined
            }
            width="1/2"
          />
          <TextField
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={setPhone}
            width="1/2"
          />
        </Stack>
      </Stack>

      <Divider />

      <Stack space="group">
        <Headline level={2}>Order Summary</Headline>

        {successMessage && (
          <SectionMessage variant="success">
            <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
            <SectionMessage.Content>
              Your purchase has been completed. You will receive a confirmation
              email shortly.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        {validationError && (
          <SectionMessage variant="error">
            <SectionMessage.Title>Cannot Complete Order</SectionMessage.Title>
            <SectionMessage.Content>
              {totalQuantity === 0
                ? 'Please select at least one ticket.'
                : 'Please fill in all required fields correctly (Full Name and valid Email).'}
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Stack space={2} alignX="left">
          {quantities.earlyBird > 0 && (
            <Inline space={2} alignX="between">
              <Text>
                Early Bird × {quantities.earlyBird} @ ${49}
              </Text>
              <Text weight="bold">${subtotals.earlyBird}</Text>
            </Inline>
          )}
          {quantities.regular > 0 && (
            <Inline space={2} alignX="between">
              <Text>
                Regular × {quantities.regular} @ ${79}
              </Text>
              <Text weight="bold">${subtotals.regular}</Text>
            </Inline>
          )}
          {quantities.vip > 0 && (
            <Inline space={2} alignX="between">
              <Text>
                VIP × {quantities.vip} @ ${149}
              </Text>
              <Text weight="bold">${subtotals.vip}</Text>
            </Inline>
          )}

          {totalQuantity > 0 && <Divider />}

          <Inline space={2} alignX="between">
            <Headline level={3}>Grand Total</Headline>
            <Headline level={3}>${grandTotal}</Headline>
          </Inline>
        </Stack>

        <Button
          variant="primary"
          onPress={handlePurchase}
          disabled={totalQuantity === 0}
        >
          Purchase Tickets
        </Button>
      </Stack>
    </Stack>
  );
};

export default TestApp;
