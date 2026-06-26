import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Columns,
  Form,
  Headline,
  Inline,
  NumberField,
  SectionMessage,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [quantities, setQuantities] = useState({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submittedOrder, setSubmittedOrder] = useState<{
    fullName: string;
    email: string;
    phone: string;
    earlyBird: number;
    regular: number;
    vip: number;
  } | null>(null);

  const [validationError, setValidationError] = useState('');

  const ticketCategories = [
    {
      id: 'earlyBird',
      name: 'Early Bird',
      price: 49,
      description: 'Limited Early Bird special',
      status: 'limited',
      statusLabel: 'Only 12 left',
      maxQuantity: 12,
      disabled: false,
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 79,
      description: 'Standard ticket',
      status: 'available',
      statusLabel: 'Available',
      maxQuantity: 999,
      disabled: false,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Premium VIP experience',
      status: 'soldOut',
      statusLabel: 'Sold Out',
      maxQuantity: 0,
      disabled: true,
    },
  ];

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const totalTickets =
    quantities.earlyBird + quantities.regular + quantities.vip;

  const subtotals = {
    earlyBird: quantities.earlyBird * 49,
    regular: quantities.regular * 79,
    vip: quantities.vip * 149,
  };

  const grandTotal =
    subtotals.earlyBird + subtotals.regular + subtotals.vip;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError('');

    if (totalTickets === 0) {
      setValidationError('Please select at least one ticket.');
      return;
    }

    if (!fullName.trim()) {
      setValidationError('Full Name is required.');
      return;
    }

    if (!email.trim()) {
      setValidationError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setSubmittedOrder({
      fullName,
      email,
      phone,
      earlyBird: quantities.earlyBird,
      regular: quantities.regular,
      vip: quantities.vip,
    });
  };

  if (submittedOrder) {
    return (
      <Stack space={8}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you, {submittedOrder.fullName}! Your order has been
            confirmed. A confirmation email will be sent to{' '}
            {submittedOrder.email}.
          </SectionMessage.Content>
        </SectionMessage>

        <Card>
          <Stack space={4}>
            <Headline level="3">Order Summary</Headline>
            <Stack space={2}>
              {submittedOrder.earlyBird > 0 && (
                <Inline alignX="between">
                  <Text>
                    Early Bird x{submittedOrder.earlyBird}
                  </Text>
                  <Text weight="bold">
                    ${submittedOrder.earlyBird * 49}
                  </Text>
                </Inline>
              )}
              {submittedOrder.regular > 0 && (
                <Inline alignX="between">
                  <Text>
                    Regular x{submittedOrder.regular}
                  </Text>
                  <Text weight="bold">
                    ${submittedOrder.regular * 79}
                  </Text>
                </Inline>
              )}
              {submittedOrder.vip > 0 && (
                <Inline alignX="between">
                  <Text>VIP x{submittedOrder.vip}</Text>
                  <Text weight="bold">
                    ${submittedOrder.vip * 149}
                  </Text>
                </Inline>
              )}
            </Stack>
            <Inline alignX="between">
              <Text weight="bold">Total:</Text>
              <Text weight="bold">
                $
                {submittedOrder.earlyBird * 49 +
                  submittedOrder.regular * 79 +
                  submittedOrder.vip * 149}
              </Text>
            </Inline>
          </Stack>
        </Card>

        <Button
          variant="primary"
          onPress={() => {
            setSubmittedOrder(null);
            setFullName('');
            setEmail('');
            setPhone('');
            setQuantities({ earlyBird: 0, regular: 0, vip: 0 });
          }}
        >
          Purchase More Tickets
        </Button>
      </Stack>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack space={8}>
        <Stack space={2} alignX="left">
          <Headline level="1">Summer Music Festival 2026</Headline>
          <Text>July 15-17, 2026</Text>
          <Text>Stadtpark Freiburg</Text>
          <Text>Three days of live music featuring local and international artists.</Text>
        </Stack>

        <Stack space={4} alignX="left">
          <Headline level="2">Select Tickets</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="50em">
            {ticketCategories.map(category => (
              <Card key={category.id}>
                <Stack space={4}>
                  <Stack space={2} alignX="left">
                    <Inline alignX="between" alignY="top">
                      <Headline level="3">{category.name}</Headline>
                      <Badge
                        variant={
                          category.status === 'limited'
                            ? 'warning'
                            : category.status === 'available'
                              ? 'success'
                              : 'error'
                        }
                      >
                        {category.statusLabel}
                      </Badge>
                    </Inline>
                    <Text weight="bold">${category.price}</Text>
                    <Text>{category.description}</Text>
                  </Stack>

                  <NumberField
                    label="Quantity"
                    value={quantities[category.id as keyof typeof quantities]}
                    onChange={value =>
                      handleQuantityChange(category.id, value)
                    }
                    minValue={0}
                    maxValue={category.maxQuantity}
                    disabled={category.disabled}
                    width="1/3"
                  />
                </Stack>
              </Card>
            ))}
          </Columns>
        </Stack>

        <Stack space={4} alignX="left">
          <Headline level="2">Buyer Information</Headline>
          <Stack space={2}>
            <TextField
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={setFullName}
              required
              width="1/2"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              width="1/2"
            />
            <TextField
              label="Phone Number"
              name="phone"
              type="tel"
              value={phone}
              onChange={setPhone}
              width="1/2"
            />
          </Stack>
        </Stack>

        <Card>
          <Stack space={4}>
            <Headline level="3">Order Summary</Headline>
            <Stack space={2}>
              {quantities.earlyBird > 0 && (
                <Inline alignX="between">
                  <Text>
                    Early Bird x{quantities.earlyBird}
                  </Text>
                  <Text>${subtotals.earlyBird}</Text>
                </Inline>
              )}
              {quantities.regular > 0 && (
                <Inline alignX="between">
                  <Text>
                    Regular x{quantities.regular}
                  </Text>
                  <Text>${subtotals.regular}</Text>
                </Inline>
              )}
              {quantities.vip > 0 && (
                <Inline alignX="between">
                  <Text>VIP x{quantities.vip}</Text>
                  <Text>${subtotals.vip}</Text>
                </Inline>
              )}
              {totalTickets === 0 && (
                <Text variant="muted">No tickets selected</Text>
              )}
            </Stack>
            <Inline alignX="between">
              <Text weight="bold">Total:</Text>
              <Text weight="bold" size="lg">
                ${grandTotal}
              </Text>
            </Inline>
          </Stack>
        </Card>

        {validationError && (
          <SectionMessage variant="error">
            <SectionMessage.Title>Cannot Complete Purchase</SectionMessage.Title>
            <SectionMessage.Content>
              {validationError}
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Button variant="primary" type="submit">
          Purchase Tickets
        </Button>
      </Stack>
    </Form>
  );
};

export default TestApp;
