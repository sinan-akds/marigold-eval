import { useState } from "react";
import {
  Text,
  Heading,
  Card,
  Button,
  TextField,
  Stack,
  Inline,
  Badge,
  Textarea,
} from "@marigold/components";

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  available: boolean;
  status?: string;
}

const TestApp = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    earlyBird: 0,
    regular: 0,
    vip: 0,
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [validationError, setValidationError] = useState("");

  const ticketCategories: TicketCategory[] = [
    {
      id: "earlyBird",
      name: "Early Bird",
      price: 49,
      description: "Only 12 left",
      maxQuantity: 12,
      available: true,
      status: "Limited",
    },
    {
      id: "regular",
      name: "Regular",
      price: 79,
      description: "Available",
      maxQuantity: 999,
      available: true,
    },
    {
      id: "vip",
      name: "VIP",
      price: 149,
      description: "Sold out",
      maxQuantity: 0,
      available: false,
      status: "Sold Out",
    },
  ];

  const handleQuantityChange = (categoryId: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const category = ticketCategories.find((c) => c.id === categoryId);
    if (category) {
      setQuantities({
        ...quantities,
        [categoryId]: Math.min(numValue, category.maxQuantity),
      });
    }
  };

  const calculateSubtotal = (categoryId: string): number => {
    const category = ticketCategories.find((c) => c.id === categoryId);
    if (!category) return 0;
    return quantities[categoryId] * category.price;
  };

  const calculateTotal = (): number => {
    return ticketCategories.reduce((sum, category) => {
      return sum + calculateSubtotal(category.id);
    }, 0);
  };

  const validateEmail = (emailAddr: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddr);
  };

  const handlePurchase = () => {
    setValidationError("");

    const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
    if (totalTickets === 0) {
      setValidationError("Please select at least one ticket.");
      return;
    }

    if (!fullName.trim()) {
      setValidationError("Full Name is required.");
      return;
    }

    if (!email.trim()) {
      setValidationError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
    }, 5000);
  };

  if (orderPlaced) {
    return (
      <Stack space="xl">
        <Card>
          <Stack space="md">
            <Heading level="1">Order Confirmed!</Heading>
            <Text>
              Thank you for your order. Your tickets for Summer Music Festival
              2026 have been confirmed. A confirmation email has been sent to{" "}
              <strong>{email}</strong>.
            </Text>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack space="xl">
      {/* Event Header */}
      <Card>
        <Stack space="md">
          <Heading level="1">Summer Music Festival 2026</Heading>
          <Text>
            <strong>Date:</strong> July 15-17, 2026
          </Text>
          <Text>
            <strong>Venue:</strong> Stadtpark Freiburg
          </Text>
          <Text>
            Three days of live music featuring local and international artists.
          </Text>
        </Stack>
      </Card>

      {/* Ticket Categories */}
      <div>
        <Heading level="2">Choose Your Tickets</Heading>
        <Stack space="md">
          {ticketCategories.map((category) => (
            <Card key={category.id}>
              <Stack space="md">
                <Inline space="md" alignY="center">
                  <div>
                    <Heading level="3">{category.name}</Heading>
                    <Text>${category.price}</Text>
                  </div>
                  {category.status && (
                    <Badge color={category.available ? "warning" : "critical"}>
                      {category.status}
                    </Badge>
                  )}
                </Inline>
                <Text>{category.description}</Text>
                {category.available && category.maxQuantity > 0 && (
                  <div>
                    <Text size="sm">Quantity:</Text>
                    <TextField
                      type="number"
                      min="0"
                      max={category.maxQuantity}
                      value={quantities[category.id].toString()}
                      onChange={(e) => {
                        handleQuantityChange(category.id, e.target.value);
                      }}
                      disabled={!category.available}
                    />
                  </div>
                )}
                {!category.available && (
                  <TextField
                    type="number"
                    disabled={true}
                    value="0"
                  />
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </div>

      {/* Buyer Information */}
      <Card>
        <Stack space="md">
          <Heading level="2">Buyer Information</Heading>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Phone Number"
            placeholder="Enter your phone number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Stack>
      </Card>

      {/* Order Summary */}
      <Card>
        <Stack space="md">
          <Heading level="2">Order Summary</Heading>
          <Stack space="sm">
            {ticketCategories.map((category) =>
              quantities[category.id] > 0 ? (
                <Inline
                  key={category.id}
                  space="md"
                  justifyContent="space-between"
                >
                  <Text>
                    {category.name} × {quantities[category.id]} @${category.price}
                  </Text>
                  <Text>
                    <strong>${calculateSubtotal(category.id)}</strong>
                  </Text>
                </Inline>
              ) : null
            )}
          </Stack>
          <div
            style={{
              borderTop: "1px solid #ccc",
              paddingTop: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <Inline space="md" justifyContent="space-between">
              <Heading level="3">Total</Heading>
              <Heading level="3">${calculateTotal()}</Heading>
            </Inline>
          </div>
        </Stack>
      </Card>

      {/* Validation Error */}
      {validationError && (
        <Card>
          <Text color="critical">{validationError}</Text>
        </Card>
      )}

      {/* Purchase Button */}
      <Button onClick={handlePurchase}>Purchase Tickets</Button>
    </Stack>
  );
};

export default TestApp;
