import { useState } from 'react';
import {
  Button,
  Card,
  Stack,
  Inline,
  Text,
  Headline,
  TextField,
  NumberField,
  Form,
  Badge,
  SectionMessage,
  Container,
} from '@marigold/components';

interface TicketQuantities {
  earlyBird: number;
  regular: number;
  vip: number;
}

interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
}

const TestApp = () => {
  const [quantities, setQuantities] = useState<TicketQuantities>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });

  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: '',
    email: '',
    phone: '',
  });

  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const tickets = {
    earlyBird: { name: 'Early Bird', price: 49, description: 'Only 12 left', maxQuantity: 12, available: true, soldOut: false },
    regular: { name: 'Regular', price: 79, description: 'Available', maxQuantity: Infinity, available: true, soldOut: false },
    vip: { name: 'VIP', price: 149, description: 'Sold Out', maxQuantity: 0, available: false, soldOut: true },
  };

  const calculateSubtotal = (ticketType: keyof typeof tickets) => {
    return quantities[ticketType] * tickets[ticketType].price;
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal('earlyBird') +
      calculateSubtotal('regular') +
      calculateSubtotal('vip')
    );
  };

  const totalTickets = quantities.earlyBird + quantities.regular + quantities.vip;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleQuantityChange = (ticketType: keyof typeof tickets, value: number) => {
    const max = tickets[ticketType].maxQuantity;
    const newValue = Math.min(Math.max(0, value), max);
    setQuantities(prev => ({ ...prev, [ticketType]: newValue }));
  };

  const handlePurchase = () => {
    setErrorMessage('');

    if (totalTickets === 0) {
      setErrorMessage('Please select at least one ticket.');
      setOrderStatus('error');
      return;
    }

    if (!buyerInfo.fullName.trim()) {
      setErrorMessage('Full Name is required.');
      setOrderStatus('error');
      return;
    }

    if (!buyerInfo.email.trim()) {
      setErrorMessage('Email is required.');
      setOrderStatus('error');
      return;
    }

    if (!isValidEmail(buyerInfo.email)) {
      setErrorMessage('Please enter a valid email address.');
      setOrderStatus('error');
      return;
    }

    setOrderStatus('success');
    setTimeout(() => {
      setOrderStatus('idle');
      setQuantities({ earlyBird: 0, regular: 0, vip: 0 });
      setBuyerInfo({ fullName: '', email: '', phone: '' });
    }, 3000);
  };

  return (
    <main>
      <Container>
        <Stack space="section">
      <Stack space="2">
        <Headline level={1}>Summer Music Festival 2026</Headline>
        <Text>July 15-17, 2026</Text>
        <Text>Stadtpark Freiburg</Text>
        <Text>Three days of live music featuring local and international artists.</Text>
      </Stack>

      <Stack space="section">
        <Headline level={2}>Ticket Categories</Headline>
        <Stack space="section">
          {/* Early Bird Ticket */}
          <Card>
            <Stack space="2">
              <Inline space="1" alignY="center">
                <Headline level={3}>{tickets.earlyBird.name}</Headline>
              </Inline>
              <Text>${tickets.earlyBird.price}</Text>
              <Text>{tickets.earlyBird.description}</Text>
              <NumberField
                label="Quantity"
                value={quantities.earlyBird}
                onChange={(value) => handleQuantityChange('earlyBird', value || 0)}
                disabled={!tickets.earlyBird.available}
                minValue={0}
                maxValue={tickets.earlyBird.maxQuantity}
              />
            </Stack>
          </Card>

          {/* Regular Ticket */}
          <Card>
            <Stack space="2">
              <Inline space="1" alignY="center">
                <Headline level={3}>{tickets.regular.name}</Headline>
              </Inline>
              <Text>${tickets.regular.price}</Text>
              <Text>{tickets.regular.description}</Text>
              <NumberField
                label="Quantity"
                value={quantities.regular}
                onChange={(value) => handleQuantityChange('regular', value || 0)}
                disabled={!tickets.regular.available}
                minValue={0}
              />
            </Stack>
          </Card>

          {/* VIP Ticket */}
          <Card>
            <Stack space="2">
              <Inline space="1" alignY="center">
                <Headline level={3}>{tickets.vip.name}</Headline>
                <Badge>{tickets.vip.description}</Badge>
              </Inline>
              <Text>${tickets.vip.price}</Text>
              <Text>{tickets.vip.description}</Text>
              {!tickets.vip.soldOut && (
                <NumberField
                  label="Quantity"
                  value={quantities.vip}
                  onChange={(value) => handleQuantityChange('vip', value || 0)}
                  disabled={tickets.vip.soldOut}
                  minValue={0}
                />
              )}
            </Stack>
          </Card>
        </Stack>
      </Stack>

      <Stack space="section">
        <Headline level={2}>Buyer Information</Headline>
        <Form>
          <Stack space="section">
            <TextField
              label="Full Name"
              required
              value={buyerInfo.fullName}
              onChange={(value) => setBuyerInfo(prev => ({ ...prev, fullName: value }))}
            />
            <TextField
              label="Email"
              required
              type="email"
              value={buyerInfo.email}
              onChange={(value) => setBuyerInfo(prev => ({ ...prev, email: value }))}
            />
            <TextField
              label="Phone Number"
              value={buyerInfo.phone}
              onChange={(value) => setBuyerInfo(prev => ({ ...prev, phone: value }))}
            />
          </Stack>
        </Form>
      </Stack>

      <Stack space="section">
        <Headline level={2}>Order Summary</Headline>
        <Card>
          <Stack space="2">
            {quantities.earlyBird > 0 && (
              <Inline space="2" alignX="between">
                <Text>{tickets.earlyBird.name} x {quantities.earlyBird}</Text>
                <Text>${calculateSubtotal('earlyBird')}</Text>
              </Inline>
            )}
            {quantities.regular > 0 && (
              <Inline space="2" alignX="between">
                <Text>{tickets.regular.name} x {quantities.regular}</Text>
                <Text>${calculateSubtotal('regular')}</Text>
              </Inline>
            )}
            {quantities.vip > 0 && (
              <Inline space="2" alignX="between">
                <Text>{tickets.vip.name} x {quantities.vip}</Text>
                <Text>${calculateSubtotal('vip')}</Text>
              </Inline>
            )}
            {totalTickets === 0 && <Text>No tickets selected</Text>}
            <Inline space="2" alignX="between">
              <Headline level={3}>Total</Headline>
              <Headline level={3}>${calculateTotal()}</Headline>
            </Inline>
          </Stack>
        </Card>
      </Stack>

      {orderStatus === 'success' && (
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed</SectionMessage.Title>
          <SectionMessage.Content>Your order has been placed successfully! You will receive a confirmation email shortly.</SectionMessage.Content>
        </SectionMessage>
      )}

      {orderStatus === 'error' && errorMessage && (
        <SectionMessage variant="error">
          <SectionMessage.Title>Order Error</SectionMessage.Title>
          <SectionMessage.Content>{errorMessage}</SectionMessage.Content>
        </SectionMessage>
      )}

      <Button onPress={handlePurchase}>Purchase Tickets</Button>
        </Stack>
      </Container>
    </main>
  );
};

export default TestApp;
