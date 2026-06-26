import { useState } from 'react';
import {
  Badge,
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
  Tiles,
} from '@marigold/components';

interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string;
  availability: 'available' | 'limited' | 'soldOut';
  limitedLabel?: string;
  maxQty: number;
  soldOut: boolean;
}

interface BuyerInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
}

const TICKETS: Ticket[] = [
  {
    id: 'earlyBird',
    name: 'Early Bird',
    price: 49,
    description: 'Limited early access tickets at a special price.',
    availability: 'limited',
    limitedLabel: 'Only 12 left',
    maxQty: 12,
    soldOut: false,
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 79,
    description: 'Standard festival admission for all three days.',
    availability: 'available',
    maxQty: 20,
    soldOut: false,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 149,
    description: 'Exclusive VIP access with premium perks and backstage pass.',
    availability: 'soldOut',
    maxQty: 0,
    soldOut: true,
  },
];

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function TestApp() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(TICKETS.map(t => [t.id, 0]))
  );
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [noTicketError, setNoTicketError] = useState(false);

  const totalTickets = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  // Clear the no-ticket error as soon as the user selects a ticket
  const showNoTicketError = noTicketError && totalTickets === 0;

  const grandTotal = TICKETS.reduce(
    (sum, t) => sum + (quantities[t.id] ?? 0) * t.price,
    0
  );

  const handlePurchase = () => {
    const errors: FormErrors = {};

    if (!buyerInfo.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!buyerInfo.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!validateEmail(buyerInfo.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    setFormErrors(errors);
    setNoTicketError(totalTickets === 0);

    if (Object.keys(errors).length === 0 && totalTickets > 0) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setQuantities(Object.fromEntries(TICKETS.map(t => [t.id, 0])));
    setBuyerInfo({ fullName: '', email: '', phone: '' });
    setFormErrors({});
    setNoTicketError(false);
  };

  if (submitted) {
    return (
      <Stack space={6}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Order Confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            <Stack space={2}>
              <Text>
                Thank you, {buyerInfo.fullName}! Your tickets for Summer Music
                Festival 2026 have been booked successfully. A confirmation will
                be sent to {buyerInfo.email}.
              </Text>
              <Divider />
              {TICKETS.filter(t => (quantities[t.id] ?? 0) > 0).map(ticket => (
                <Inline key={ticket.id} alignX="between" space={4}>
                  <Text>
                    {ticket.name} × {quantities[ticket.id]}
                  </Text>
                  <Text weight="bold">
                    ${ticket.price * (quantities[ticket.id] ?? 0)}
                  </Text>
                </Inline>
              ))}
              <Divider />
              <Inline alignX="between" space={4}>
                <Text weight="bold">Total paid</Text>
                <Text weight="bold">${grandTotal}</Text>
              </Inline>
            </Stack>
          </SectionMessage.Content>
        </SectionMessage>
        <Button variant="secondary" onPress={handleReset}>
          Buy More Tickets
        </Button>
      </Stack>
    );
  }

  return (
    <Stack space={8}>
      <Tiles tilesWidth="280px" space={0} stretch>
        <Card>
          <Stack space={3}>
            <Headline level="1">Summer Music Festival 2026</Headline>
            <Inline space={6}>
              <Text>July 15–17, 2026</Text>
              <Text>Stadtpark Freiburg</Text>
            </Inline>
            <Text variant="muted">
              Three days of live music featuring local and international artists.
            </Text>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level="2">Select Tickets</Headline>
        <Tiles tilesWidth="260px" space={4} stretch>
          {TICKETS.map(ticket => (
            <Card key={ticket.id}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level="3">{ticket.name}</Headline>
                  {ticket.soldOut && (
                    <Badge variant="error">Sold Out</Badge>
                  )}
                  {ticket.availability === 'limited' && ticket.limitedLabel && (
                    <Badge variant="warning">{ticket.limitedLabel}</Badge>
                  )}
                </Inline>
                <Text size="xl" weight="bold">
                  ${ticket.price}
                </Text>
                <Text variant="muted">{ticket.description}</Text>
                <NumberField
                  label="Quantity"
                  value={quantities[ticket.id] ?? 0}
                  onChange={val =>
                    setQuantities(prev => ({ ...prev, [ticket.id]: val }))
                  }
                  minValue={0}
                  maxValue={ticket.soldOut ? 0 : ticket.maxQty}
                  disabled={ticket.soldOut}
                  width="1/2"
                />
              </Stack>
            </Card>
          ))}
        </Tiles>
      </Stack>

      <Stack space={3}>
        <Headline level="2">Buyer Information</Headline>
        <Stack space={4}>
          <TextField
            label="Full Name"
            value={buyerInfo.fullName}
            onChange={val => {
              setBuyerInfo(prev => ({ ...prev, fullName: val }));
              if (formErrors.fullName) {
                setFormErrors(prev => ({ ...prev, fullName: undefined }));
              }
            }}
            required
            error={!!formErrors.fullName}
            errorMessage={formErrors.fullName}
            width="1/1"
          />
          <TextField
            label="Email"
            type="email"
            value={buyerInfo.email}
            onChange={val => {
              setBuyerInfo(prev => ({ ...prev, email: val }));
              if (formErrors.email) {
                setFormErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
            required
            error={!!formErrors.email}
            errorMessage={formErrors.email}
            width="1/1"
          />
          <TextField
            label="Phone Number"
            type="tel"
            value={buyerInfo.phone}
            onChange={val => setBuyerInfo(prev => ({ ...prev, phone: val }))}
            width="1/1"
          />
        </Stack>
      </Stack>

      <Stack space={3}>
        <Headline level="2">Order Summary</Headline>
        <Stack space={4}>
          {totalTickets === 0 ? (
            <Text variant="muted">No tickets selected yet.</Text>
          ) : (
            <Stack space={2}>
              {TICKETS.filter(t => (quantities[t.id] ?? 0) > 0).map(ticket => (
                <Inline key={ticket.id} alignX="between" space={4}>
                  <Text>
                    {ticket.name} × {quantities[ticket.id]}
                  </Text>
                  <Text weight="bold">
                    ${ticket.price * (quantities[ticket.id] ?? 0)}
                  </Text>
                </Inline>
              ))}
            </Stack>
          )}
          <Divider />
          <Inline alignX="between" space={4}>
            <Text weight="bold">Grand Total</Text>
            <Headline level="3">${grandTotal}</Headline>
          </Inline>

          {showNoTicketError && (
            <SectionMessage variant="warning">
              <SectionMessage.Title>No tickets selected</SectionMessage.Title>
              <SectionMessage.Content>
                <Text>
                  Please select at least one ticket before purchasing.
                </Text>
              </SectionMessage.Content>
            </SectionMessage>
          )}

          {(formErrors.fullName || formErrors.email) && (
            <SectionMessage variant="error">
              <SectionMessage.Title>Missing required fields</SectionMessage.Title>
              <SectionMessage.Content>
                <Text>
                  Please fill in all required fields in the Buyer Information
                  section above.
                </Text>
              </SectionMessage.Content>
            </SectionMessage>
          )}

          <Button variant="primary" fullWidth onPress={handlePurchase}>
            Purchase Tickets
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
