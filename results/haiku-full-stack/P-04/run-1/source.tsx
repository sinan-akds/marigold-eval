import { useState } from 'react';
import {
  Button,
  Card,
  Columns,
  Form,
  Headline,
  NumberField,
  SectionMessage,
  Stack,
  Text,
  TextField,
  ToastProvider,
  useToast,
} from '@marigold/components';

type TicketCategory = {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  status: 'available' | 'limited' | 'sold_out';
};

const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited availability',
    maxQuantity: 12,
    status: 'limited',
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard admission',
    maxQuantity: 999,
    status: 'available',
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Premium experience',
    maxQuantity: 0,
    status: 'sold_out',
  },
];

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

const TicketShop = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'early-bird': 0,
    regular: 0,
    vip: 0,
  });

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { addToast } = useToast();

  const updateQuantity = (categoryId: string, value: number) => {
    const category = TICKET_CATEGORIES.find(c => c.id === categoryId);
    if (category && value >= 0 && value <= category.maxQuantity) {
      setQuantities(prev => ({
        ...prev,
        [categoryId]: value,
      }));
      setShowWarning(false);
    }
  };

  const calculateSubtotal = (categoryId: string): number => {
    const category = TICKET_CATEGORIES.find(c => c.id === categoryId);
    return (category?.price || 0) * (quantities[categoryId] || 0);
  };

  const calculateTotal = (): number => {
    return TICKET_CATEGORIES.reduce((sum, category) => {
      return sum + calculateSubtotal(category.id);
    }, 0);
  };

  const getTotalTickets = (): number => {
    return Object.values(quantities).reduce((sum, q) => sum + q, 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowWarning(false);
    setShowSuccess(false);

    const totalTickets = getTotalTickets();
    const hasRequiredFields = formData.fullName.trim() && formData.email.trim();

    if (totalTickets === 0) {
      setShowWarning(true);
      return;
    }

    if (!hasRequiredFields) {
      setShowWarning(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setShowWarning(true);
      return;
    }

    setShowSuccess(true);
    addToast({
      title: 'Order Confirmed',
      description: `Your tickets for Summer Music Festival 2026 have been booked!`,
      variant: 'success',
      timeout: 5000,
    });

    setQuantities({
      'early-bird': 0,
      regular: 0,
      vip: 0,
    });
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Stack space="section">
        <Stack space="related">
          <Headline level="1">Summer Music Festival 2026</Headline>
          <Stack space="tight">
            <Text>
              <Text weight="bold">July 15-17, 2026</Text>
            </Text>
            <Text>
              <Text weight="bold">Stadtpark Freiburg</Text>
            </Text>
            <Text>Three days of live music featuring local and international artists.</Text>
          </Stack>
        </Stack>

        <Stack space="related">
          <Headline level="2">Select Tickets</Headline>
          <Columns columns={[1, 1, 1]} space="related" collapseAt="40em">
            {TICKET_CATEGORIES.map(category => (
              <Card key={category.id} p="square-regular">
                <Stack space="related">
                  <Stack space="tight">
                    <Headline level="3">{category.name}</Headline>
                    <Text weight="bold">${category.price}</Text>
                    <Text size="sm">{category.description}</Text>
                  </Stack>

                  {category.status === 'limited' && (
                    <Text size="sm" color="destructive">
                      Only {category.maxQuantity} left
                    </Text>
                  )}

                  {category.status === 'sold_out' && (
                    <Stack space="tight">
                      <Text weight="bold" color="destructive">
                        Sold Out
                      </Text>
                      <NumberField
                        label="Quantity"
                        value={0}
                        minValue={0}
                        disabled
                        hideStepper
                        width="fit"
                      />
                    </Stack>
                  )}

                  {category.status !== 'sold_out' && (
                    <NumberField
                      label="Quantity"
                      value={quantities[category.id]}
                      onChange={value => updateQuantity(category.id, value)}
                      minValue={0}
                      maxValue={category.maxQuantity}
                      width="fit"
                    />
                  )}
                </Stack>
              </Card>
            ))}
          </Columns>
        </Stack>

        <Stack space="related">
          <Headline level="2">Buyer Information</Headline>
          <Form onSubmit={handleSubmit}>
            <Stack space="related">
              {showWarning && (
                <SectionMessage variant="error">
                  <SectionMessage.Title>Unable to Complete Order</SectionMessage.Title>
                  <SectionMessage.Content>
                    {getTotalTickets() === 0 && 'Please select at least one ticket.'}
                    {getTotalTickets() > 0 && !formData.fullName.trim() && 'Full Name is required.'}
                    {getTotalTickets() > 0 &&
                      formData.fullName.trim() &&
                      !formData.email.trim() &&
                      'Email is required.'}
                    {getTotalTickets() > 0 &&
                      formData.fullName.trim() &&
                      formData.email.trim() &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                      'Please enter a valid email address.'}
                  </SectionMessage.Content>
                </SectionMessage>
              )}

              {showSuccess && (
                <SectionMessage variant="success">
                  <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
                  <SectionMessage.Content>
                    Thank you for purchasing tickets for Summer Music Festival 2026. A confirmation
                    email will be sent to {formData.email}.
                  </SectionMessage.Content>
                </SectionMessage>
              )}

              <TextField
                label="Full Name"
                required
                value={formData.fullName}
                onChange={value => setFormData(prev => ({ ...prev, fullName: value }))}
                width="1/2"
              />

              <TextField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={value => setFormData(prev => ({ ...prev, email: value }))}
                width="1/2"
              />

              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={value => setFormData(prev => ({ ...prev, phoneNumber: value }))}
                width="1/2"
              />
            </Stack>
          </Form>
        </Stack>

        <Card p="square-regular" variant="primary">
          <Stack space="related">
            <Headline level="3">Order Summary</Headline>

            <Stack space="tight">
              {TICKET_CATEGORIES.map(category => {
                const qty = quantities[category.id];
                const subtotal = calculateSubtotal(category.id);

                if (qty === 0) return null;

                return (
                  <Columns key={category.id} columns={[2, 'fit', 'fit']} space="related">
                    <Text>
                      {category.name} × {qty}
                    </Text>
                    <Text>${subtotal.toFixed(2)}</Text>
                  </Columns>
                );
              })}
            </Stack>

            {getTotalTickets() > 0 && (
              <>
                <Text weight="bold" size="lg">
                  Total: ${calculateTotal().toFixed(2)}
                </Text>

                <Button variant="primary" type="submit">
                  Purchase Tickets
                </Button>
              </>
            )}

            {getTotalTickets() === 0 && (
              <Text variant="muted">Select tickets to see summary</Text>
            )}
          </Stack>
        </Card>
      </Stack>
    </>
  );
};

export default TicketShop;
