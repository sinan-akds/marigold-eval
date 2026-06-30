'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Text,
  Headline,
  TextField,
  Stack,
  Inline,
  Columns,
  Badge,
  SectionMessage,
  NumberField,
  Form,
  AppLayout,
  Container,
} from '@marigold/components';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
  maxQuantity: number;
  status?: string;
}

const TestApp = () => {
  const [quantities, setQuantities] = useState({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const ticketCategories: TicketCategory[] = [
    {
      id: 'earlyBird',
      name: 'Early Bird',
      price: 49,
      description: 'Only 12 left',
      available: true,
      maxQuantity: 12,
    },
    {
      id: 'regular',
      name: 'Regular',
      price: 79,
      description: 'Available',
      available: true,
      maxQuantity: 100,
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 149,
      description: 'Sold Out',
      available: false,
      maxQuantity: 0,
      status: 'Sold Out',
    },
  ];

  const calculateSubtotal = (categoryId: string, quantity: number) => {
    const category = ticketCategories.find((c) => c.id === categoryId);
    return category ? category.price * quantity : 0;
  };

  const totalQuantity =
    quantities.earlyBird + quantities.regular + quantities.vip;
  const grandTotal =
    calculateSubtotal('earlyBird', quantities.earlyBird) +
    calculateSubtotal('regular', quantities.regular) +
    calculateSubtotal('vip', quantities.vip);

  const handleQuantityChange = (categoryId: string, value: number) => {
    const category = ticketCategories.find((c) => c.id === categoryId);
    if (category) {
      const constrainedValue = Math.min(
        Math.max(value, 0),
        category.maxQuantity
      );
      setQuantities((prev) => ({
        ...prev,
        [categoryId]: constrainedValue,
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePurchase = () => {
    const validationErrors: string[] = [];

    if (totalQuantity === 0) {
      validationErrors.push('Please select at least one ticket');
    }

    if (!formData.fullName.trim()) {
      validationErrors.push('Full Name is required');
    }

    if (!formData.email.trim()) {
      validationErrors.push('Email is required');
    } else if (!validateEmail(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }

    if (validationErrors.length > 0) {
      setFeedback({
        type: 'error',
        message: validationErrors.join('. '),
      });
      return;
    }

    setFeedback({
      type: 'success',
      message: `Order confirmed! ${totalQuantity} ticket(s) for $${grandTotal.toFixed(2)} will be sent to ${formData.email}`,
    });

    setQuantities({ earlyBird: 0, regular: 0, vip: 0 });
    setFormData({ fullName: '', email: '', phoneNumber: '' });
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Container>
          <Stack space={5}>
            <Stack space={2}>
              <Headline level="1">Summer Music Festival 2026</Headline>
              <Text>July 15-17, 2026</Text>
              <Text>Stadtpark Freiburg</Text>
              <Text>Three days of live music featuring local and international artists.</Text>
            </Stack>

            <Stack space={4}>
              <Headline level="2">Ticket Categories</Headline>
              <Columns columns={[1, 1, 3]}>
                {ticketCategories.map((category) => (
                  <Card key={category.id}>
                    <Stack space={2}>
                      <Headline level="3">{category.name}</Headline>
                      <Text weight="bold">${category.price}</Text>
                      <Text>{category.description}</Text>

                      {category.status && (
                        <Badge>{category.status}</Badge>
                      )}

                      <NumberField
                        label="Quantity"
                        value={quantities[category.id as keyof typeof quantities]}
                        onChange={(value) =>
                          handleQuantityChange(category.id, value || 0)
                        }
                        disabled={!category.available}
                        minValue={0}
                        maxValue={category.maxQuantity}
                      />
                    </Stack>
                  </Card>
                ))}
              </Columns>
            </Stack>

            <Stack space={4}>
              <Headline level="2">Buyer Information</Headline>
              <Form>
                <Stack space={3}>
                  <TextField
                    label="Full Name"
                    required
                    value={formData.fullName}
                    onChange={(value) => handleInputChange('fullName', value)}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                  />
                  <TextField
                    label="Phone Number"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                  />
                </Stack>
              </Form>
            </Stack>

            <Stack space={4}>
              <Headline level="2">Order Summary</Headline>
              <Card>
                <Stack space={2}>
                  {ticketCategories.map((category) => {
                    const qty = quantities[category.id as keyof typeof quantities];
                    const subtotal = calculateSubtotal(category.id, qty);
                    if (qty > 0) {
                      return (
                        <Columns key={category.id} columns={[1, 'fit']}>
                          <Text>
                            {category.name} x {qty}
                          </Text>
                          <Text align="right">${subtotal.toFixed(2)}</Text>
                        </Columns>
                      );
                    }
                    return null;
                  })}

                  <Columns columns={[1, 'fit']}>
                    <Headline level="3">Total</Headline>
                    <Headline level="3" align="right">${grandTotal.toFixed(2)}</Headline>
                  </Columns>
                </Stack>
              </Card>

              {feedback.type && (
                <SectionMessage
                  variant={feedback.type === 'success' ? 'info' : 'warning'}
                >
                  {feedback.message}
                </SectionMessage>
              )}

              <Button onPress={handlePurchase} variant="primary">
                Purchase Tickets
              </Button>
            </Stack>
          </Stack>
        </Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
