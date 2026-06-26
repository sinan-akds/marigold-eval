'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  Heading,
  Text,
  NumberField,
  TextField,
  Button,
  Badge,
  Stack,
  Columns,
  Inline,
} from '@marigold/components';

interface TicketQuantities {
  earlyBird: number;
  regular: number;
  vip: number;
}

interface BuyerInfo {
  name: string;
  email: string;
  phone: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
}

const TestApp = () => {
  const [quantities, setQuantities] = useState<TicketQuantities>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });

  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    name: '',
    email: '',
    phone: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [success, setSuccess] = useState(false);

  const ticketTypes = [
    {
      id: 'earlyBird',
      name: 'Early Bird',
      price: 49,
      description: 'Only 12 left',
      maxQuantity: 12,
      soldOut: false,
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 79,
      description: 'Available',
      maxQuantity: 999,
      soldOut: false,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Sold Out',
      maxQuantity: 0,
      soldOut: true,
    },
  ];

  const handleQuantityChange = (ticketId: string, newValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: newValue,
    }));
  };

  const calculateSubtotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal(49, quantities.earlyBird) +
      calculateSubtotal(79, quantities.regular) +
      calculateSubtotal(149, quantities.vip)
    );
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePurchase = () => {
    const errors: ValidationErrors = {};

    if (!buyerInfo.name.trim()) {
      errors.name = 'Full Name is required';
    }

    if (!buyerInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(buyerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const totalTickets =
      quantities.earlyBird + quantities.regular + quantities.vip;
    if (totalTickets === 0) {
      setValidationErrors({
        name: 'Please select at least one ticket',
      });
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setQuantities({ earlyBird: 0, regular: 0, vip: 0 });
      setBuyerInfo({ name: '', email: '', phone: '' });
      setValidationErrors({});
    }, 3000);
  };

  return (
    <Box padding="xl">
      <Stack space="xl">
        <Box>
          <Heading level="1">Summer Music Festival 2026</Heading>
          <Stack space="sm" marginTop="md">
            <Text>
              <strong>Date:</strong> July 15-17, 2026
            </Text>
            <Text>
              <strong>Venue:</strong> Stadtpark Freiburg
            </Text>
            <Text>Three days of live music featuring local and international artists.</Text>
          </Stack>
        </Box>

        <Box>
          <Heading level="2" marginBottom="md">
            Choose Your Tickets
          </Heading>
          <Columns columns="repeat(auto-fit, minmax(300px, 1fr))" gap="md">
            {ticketTypes.map((ticket) => (
              <Card key={ticket.id} padding="md">
                <Stack space="md">
                  <Box>
                    <Heading level="3">{ticket.name}</Heading>
                    <Text size="lg" weight="bold" marginTop="sm">
                      ${ticket.price}
                    </Text>
                  </Box>

                  <Box>
                    {ticket.soldOut ? (
                      <Badge color="critical">Sold Out</Badge>
                    ) : (
                      <Text size="sm">{ticket.description}</Text>
                    )}
                  </Box>

                  <NumberField
                    label="Quantity"
                    value={quantities[ticket.id as keyof TicketQuantities]}
                    onChange={(newValue) =>
                      handleQuantityChange(ticket.id, newValue)
                    }
                    disabled={ticket.soldOut}
                    minValue={0}
                    maxValue={ticket.maxQuantity}
                  />
                </Stack>
              </Card>
            ))}
          </Columns>
        </Box>

        <Box>
          <Heading level="2" marginBottom="md">
            Buyer Information
          </Heading>
          <Stack space="md">
            <TextField
              label="Full Name"
              placeholder="John Doe"
              value={buyerInfo.name}
              onChange={(value) =>
                setBuyerInfo((prev) => ({ ...prev, name: value }))
              }
              isInvalid={!!validationErrors.name}
              errorMessage={validationErrors.name}
              required
            />
            <TextField
              label="Email"
              placeholder="john@example.com"
              value={buyerInfo.email}
              onChange={(value) =>
                setBuyerInfo((prev) => ({ ...prev, email: value }))
              }
              isInvalid={!!validationErrors.email}
              errorMessage={validationErrors.email}
              required
            />
            <TextField
              label="Phone Number (optional)"
              placeholder="+49 123 456789"
              value={buyerInfo.phone}
              onChange={(value) =>
                setBuyerInfo((prev) => ({ ...prev, phone: value }))
              }
            />
          </Stack>
        </Box>

        <Box>
          <Card padding="md" variant="outline">
            <Stack space="md">
              <Heading level="3">Order Summary</Heading>

              <Stack space="sm">
                {quantities.earlyBird > 0 && (
                  <Inline justify="space-between">
                    <Text>
                      Early Bird x {quantities.earlyBird} @ $49 each
                    </Text>
                    <Text weight="bold">
                      ${calculateSubtotal(49, quantities.earlyBird)}
                    </Text>
                  </Inline>
                )}
                {quantities.regular > 0 && (
                  <Inline justify="space-between">
                    <Text>
                      Regular x {quantities.regular} @ $79 each
                    </Text>
                    <Text weight="bold">
                      ${calculateSubtotal(79, quantities.regular)}
                    </Text>
                  </Inline>
                )}
                {quantities.vip > 0 && (
                  <Inline justify="space-between">
                    <Text>VIP x {quantities.vip} @ $149 each</Text>
                    <Text weight="bold">
                      ${calculateSubtotal(149, quantities.vip)}
                    </Text>
                  </Inline>
                )}
              </Stack>

              {quantities.earlyBird + quantities.regular + quantities.vip > 0 && (
                <Box borderTop="1px solid" borderColor="gray" paddingTop="md">
                  <Inline justify="space-between">
                    <Heading level="4">Total</Heading>
                    <Heading level="4">${calculateTotal()}</Heading>
                  </Inline>
                </Box>
              )}
            </Stack>
          </Card>
        </Box>

        {success && (
          <Box backgroundColor="success" padding="md" borderRadius="md">
            <Text weight="bold" color="white">
              ✓ Order confirmed! Thank you for purchasing tickets to Summer
              Music Festival 2026. A confirmation email has been sent to{' '}
              {buyerInfo.email}.
            </Text>
          </Box>
        )}

        {validationErrors.name && !success && (
          <Box backgroundColor="critical" padding="md" borderRadius="md">
            <Text weight="bold" color="white">
              ⚠ {validationErrors.name}
            </Text>
          </Box>
        )}

        <Box>
          <Button onClick={handlePurchase} size="lg" fullWidth>
            Purchase Tickets
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default TestApp;
