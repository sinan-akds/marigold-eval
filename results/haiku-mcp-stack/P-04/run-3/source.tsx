import { useState } from 'react';
import {
  Button,
  Card,
  Headline,
  Inline,
  NumberField,
  SectionMessage,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [earlyBirdQty, setEarlyBirdQty] = useState(0);
  const [regularQty, setRegularQty] = useState(0);
  const [vipQty, setVipQty] = useState(0);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const EARLY_BIRD_PRICE = 49;
  const REGULAR_PRICE = 79;
  const VIP_PRICE = 149;

  const earlyBirdSubtotal = earlyBirdQty * EARLY_BIRD_PRICE;
  const regularSubtotal = regularQty * REGULAR_PRICE;
  const vipSubtotal = vipQty * VIP_PRICE;
  const grandTotal = earlyBirdSubtotal + regularSubtotal + vipSubtotal;

  const totalTickets = earlyBirdQty + regularQty + vipQty;

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handlePurchase = () => {
    let errors: string[] = [];

    if (totalTickets === 0) {
      errors.push('Please select at least one ticket.');
    }
    if (!fullName.trim()) {
      errors.push('Full Name is required.');
    }
    if (!email.trim()) {
      errors.push('Email is required.');
    } else if (!isValidEmail(email)) {
      errors.push('Please enter a valid email address.');
    }

    if (errors.length > 0) {
      setFeedback({
        type: 'error',
        message: errors.join(' '),
      });
      return;
    }

    setFeedback({
      type: 'success',
      message: `Order confirmed! ${totalTickets} ticket(s) for ${fullName}. A confirmation email has been sent to ${email}.`,
    });

    setEarlyBirdQty(0);
    setRegularQty(0);
    setVipQty(0);
    setFullName('');
    setEmail('');
    setPhone('');
  };

  return (
    <Stack space="section">
      {/* Event Header */}
      <Stack space="regular">
        <Headline level="1">Summer Music Festival 2026</Headline>
        <Inline space="group">
          <Text weight="bold">July 15-17, 2026</Text>
          <Text>•</Text>
          <Text weight="bold">Stadtpark Freiburg</Text>
        </Inline>
        <Text>Three days of live music featuring local and international artists.</Text>
      </Stack>

      {/* Ticket Categories */}
      <Stack space="group">
        <Headline level="2">Select Your Tickets</Headline>
        <Inline space="group">
          {/* Early Bird Card */}
          <Card>
            <Stack space="group" alignX="stretch">
              <Stack space="tight">
                <Headline level="3">Early Bird</Headline>
                <Text size="lg" weight="bold">
                  $49
                </Text>
                <Text size="sm">Limited offer</Text>
                <Text variant="muted" size="sm">
                  Only 12 left
                </Text>
              </Stack>
              <NumberField
                label="Quantity"
                value={earlyBirdQty}
                onChange={setEarlyBirdQty}
                minValue={0}
                maxValue={12}
                width="1/3"
              />
            </Stack>
          </Card>

          {/* Regular Card */}
          <Card>
            <Stack space="group" alignX="stretch">
              <Stack space="tight">
                <Headline level="3">Regular</Headline>
                <Text size="lg" weight="bold">
                  $79
                </Text>
                <Text size="sm">Standard admission</Text>
                <Text variant="muted" size="sm">
                  Available
                </Text>
              </Stack>
              <NumberField
                label="Quantity"
                value={regularQty}
                onChange={setRegularQty}
                minValue={0}
                width="1/3"
              />
            </Stack>
          </Card>

          {/* VIP Card */}
          <Card>
            <Stack space="group" alignX="stretch">
              <Stack space="tight">
                <Headline level="3">VIP</Headline>
                <Text size="lg" weight="bold">
                  $149
                </Text>
                <Text size="sm" color="destructive" weight="bold">
                  Sold Out
                </Text>
              </Stack>
              <NumberField
                label="Quantity"
                value={vipQty}
                onChange={setVipQty}
                minValue={0}
                disabled
              />
            </Stack>
          </Card>
        </Inline>
      </Stack>

      {/* Buyer Information Form */}
      <Stack space="group">
        <Headline level="2">Buyer Information</Headline>
        <Stack space="regular">
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
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={setPhone}
          />
        </Stack>
      </Stack>

      {/* Order Summary */}
      <Stack space="group">
        <Headline level="2">Order Summary</Headline>
        <Card>
          <Stack space="regular">
            {earlyBirdQty > 0 && (
              <Inline alignX="between">
                <Text>
                  Early Bird × {earlyBirdQty}
                </Text>
                <Text weight="bold">
                  ${earlyBirdSubtotal}
                </Text>
              </Inline>
            )}
            {regularQty > 0 && (
              <Inline alignX="between">
                <Text>
                  Regular × {regularQty}
                </Text>
                <Text weight="bold">
                  ${regularSubtotal}
                </Text>
              </Inline>
            )}
            {vipQty > 0 && (
              <Inline alignX="between">
                <Text>
                  VIP × {vipQty}
                </Text>
                <Text weight="bold">
                  ${vipSubtotal}
                </Text>
              </Inline>
            )}
            {totalTickets === 0 && (
              <Text variant="muted" size="sm">
                No tickets selected
              </Text>
            )}
            <Inline alignX="between">
              <Text size="lg" weight="bold">
                Grand Total:
              </Text>
              <Text size="lg" weight="bold">
                ${grandTotal}
              </Text>
            </Inline>
          </Stack>
        </Card>
      </Stack>

      {/* Feedback Messages */}
      {feedback.type === 'error' && (
        <SectionMessage>
          <SectionMessage.Title>Purchase Could Not Be Completed</SectionMessage.Title>
          <SectionMessage.Content>
            <Text>{feedback.message}</Text>
          </SectionMessage.Content>
        </SectionMessage>
      )}

      {feedback.type === 'success' && (
        <SectionMessage>
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            <Text>{feedback.message}</Text>
          </SectionMessage.Content>
        </SectionMessage>
      )}

      {/* Purchase Button */}
      <Button variant="primary" onPress={handlePurchase} fullWidth>
        Purchase Tickets
      </Button>
    </Stack>
  );
};

export default TestApp;
