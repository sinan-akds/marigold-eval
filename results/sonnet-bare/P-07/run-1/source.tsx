import React, { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Box,
  Text,
  Heading,
  Button,
  TextField,
  Select,
  DatePicker,
  Table,
  Dialog,
  DialogTrigger,
  MenuTrigger,
  Menu,
  Badge,
  Combobox,
  Textarea,
  Alert,
  Divider,
  Tabs,
} from '@marigold/components';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes: string;
}

const TODAY = '2026-06-21';
const WEEK_END = '2026-06-27';

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-21',
    timeSlot: '09:00-12:00',
    status: 'confirmed',
    notes: 'Anniversary celebration',
  },
  {
    id: 'BK-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-21',
    timeSlot: '12:00-15:00',
    status: 'pending',
    notes: 'Team meeting',
  },
  {
    id: 'BK-003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-22',
    timeSlot: '18:00-21:00',
    status: 'confirmed',
    notes: 'Birthday party',
  },
  {
    id: 'BK-004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-23',
    timeSlot: '09:00-12:00',
    status: 'cancelled',
    notes: 'Cancelled by customer',
  },
  {
    id: 'BK-005',
    customer: 'Eve Martinez',
    email: 'eve@example.com',
    venue: 'Conference Room B',
    date: '2026-06-24',
    timeSlot: '15:00-18:00',
    status: 'pending',
    notes: 'Product launch event',
  },
  {
    id: 'BK-006',
    customer: 'Frank Lee',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-21',
    timeSlot: '15:00-18:00',
    status: 'confirmed',
    notes: 'Corporate team event',
  },
  {
    id: 'BK-007',
    customer: 'Grace Kim',
    email: 'grace@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    timeSlot: '12:00-15:00',
    status: 'confirmed',
    notes: 'Training session',
  },
  {
    id: 'BK-008',
    customer: 'Henry Chen',
    email: 'henry@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-27',
    timeSlot: '18:00-21:00',
    status: 'pending',
    notes: '',
  },
];

function statusVariant(status: string): 'success' | 'warning' | 'neutral' | 'info' | 'error' {
  if (status === 'confirmed') return 'success';
  if (status === 'pending') return 'warning';
  return 'neutral';
}

function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <Badge variant={statusVariant(status)}>{label}</Badge>;
}

function dateToString(val: { year: number; month: number; day: number }): string {
  return `${val.year}-${String(val.month).padStart(2, '0')}-${String(val.day).padStart(2, '0')}`;
}

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [commExpanded, setCommExpanded] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const clearFilters = () => {
    setDateFilter('');
    setVenueFilter('');
    setStatusFilter('all');
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (activeTab === 'today' && b.date !== TODAY) return false;
      if (activeTab === 'week' && (b.date < TODAY || b.date > WEEK_END)) return false;
      if (dateFilter && b.date !== dateFilter) return false;
      if (venueFilter && !b.venue.toLowerCase().includes(venueFilter.toLowerCase())) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });
  }, [bookings, activeTab, dateFilter, venueFilter, statusFilter]);

  const handleMenuAction = (action: string | number, booking: Booking) => {
    if (action === 'view') {
      setSelectedBooking(booking);
      setPaymentExpanded(false);
      setCommExpanded(false);
    } else if (action === 'cancel') {
      setBookings(prev =>
        prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' as const } : b)
      );
    }
  };

  const handleCreateBooking = () => {
    if (!newCustomerName.trim()) return;
    const newBooking: Booking = {
      id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
      customer: newCustomerName.trim(),
      email: newEmail.trim(),
      venue: newVenue || 'Main Hall',
      date: newDate || TODAY,
      timeSlot: newTimeSlot || '09:00-12:00',
      status: 'pending',
      notes: newNotes.trim(),
    };
    setBookings(prev => [...prev, newBooking]);
    setDialogOpen(false);
    setNewCustomerName('');
    setNewEmail('');
    setNewVenue('');
    setNewDate('');
    setNewTimeSlot('');
    setNewNotes('');
  };

  const mainHallToday = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'cancelled'
  ).length;
  const remainingSlots = Math.max(0, 4 - mainHallToday);
  const showCapacityAlert = remainingSlots <= 2;

  return (
    <Box padding={6}>
      <Stack space={6}>
        {/* Page Header */}
        <Inline space={4} alignY="center">
          <Heading level={1}>Booking Management</Heading>
          <DialogTrigger isOpen={dialogOpen} onOpenChange={setDialogOpen}>
            <Button variant="primary">+ New Booking</Button>
            <Dialog title="New Booking">
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  value={newCustomerName}
                  onChange={setNewCustomerName}
                  required
                />
                <TextField
                  label="Customer Email"
                  type="email"
                  value={newEmail}
                  onChange={setNewEmail}
                />
                <Select
                  label="Venue"
                  selectedKey={newVenue}
                  onSelectionChange={k => setNewVenue(String(k))}
                >
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>{v}</Select.Option>
                  ))}
                </Select>
                <DatePicker
                  label="Date"
                  onChange={val => setNewDate(val ? dateToString(val) : '')}
                />
                <Select
                  label="Time Slot"
                  selectedKey={newTimeSlot}
                  onSelectionChange={k => setNewTimeSlot(String(k))}
                >
                  {TIME_SLOTS.map(ts => (
                    <Select.Option key={ts} id={ts}>{ts}</Select.Option>
                  ))}
                </Select>
                <Textarea
                  label="Notes"
                  value={newNotes}
                  onChange={setNewNotes}
                />
                <Inline space={2}>
                  <Button variant="primary" onPress={handleCreateBooking}>
                    Create Booking
                  </Button>
                  <Button onPress={() => setDialogOpen(false)}>Cancel</Button>
                </Inline>
              </Stack>
            </Dialog>
          </DialogTrigger>
        </Inline>

        {/* Filter Bar */}
        <Box>
          <Inline space={3} alignY="end">
            <DatePicker
              label="Filter by Date"
              onChange={val => setDateFilter(val ? dateToString(val) : '')}
            />
            <Combobox
              label="Venue"
              inputValue={venueFilter}
              onInputChange={setVenueFilter}
              onSelectionChange={k => setVenueFilter(k != null ? String(k) : '')}
            >
              {VENUES.map(v => (
                <Combobox.Option key={v} id={v}>{v}</Combobox.Option>
              ))}
            </Combobox>
            <Select
              label="Status"
              selectedKey={statusFilter}
              onSelectionChange={k => setStatusFilter(String(k))}
            >
              <Select.Option id="all">All</Select.Option>
              <Select.Option id="confirmed">Confirmed</Select.Option>
              <Select.Option id="pending">Pending</Select.Option>
              <Select.Option id="cancelled">Cancelled</Select.Option>
            </Select>
            <Button onPress={clearFilters}>Clear Filters</Button>
          </Inline>
        </Box>

        {/* Capacity Alert */}
        {showCapacityAlert && (
          <Alert variant="warning">
            Main Hall has only {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining for today.
          </Alert>
        )}

        {/* Tabs */}
        <Tabs selectedKey={activeTab} onSelectionChange={k => setActiveTab(String(k))}>
          <Tabs.List>
            <Tabs.Tab id="all">All Bookings</Tabs.Tab>
            <Tabs.Tab id="today">Today</Tabs.Tab>
            <Tabs.Tab id="week">This Week</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {/* Table */}
        <Table aria-label="Booking management table">
          <Table.Header>
            <Table.Column>Booking ID</Table.Column>
            <Table.Column>Customer</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Time Slot</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filteredBookings.map(booking => (
              <Table.Row key={booking.id}>
                <Table.Cell>{booking.id}</Table.Cell>
                <Table.Cell>{booking.customer}</Table.Cell>
                <Table.Cell>{booking.venue}</Table.Cell>
                <Table.Cell>{booking.date}</Table.Cell>
                <Table.Cell>{booking.timeSlot}</Table.Cell>
                <Table.Cell>
                  <StatusBadge status={booking.status} />
                </Table.Cell>
                <Table.Cell>
                  <MenuTrigger>
                    <Button variant="ghost" aria-label="Actions">•••</Button>
                    <Menu onAction={key => handleMenuAction(key, booking)}>
                      <Menu.Item id="view">View Details</Menu.Item>
                      <Menu.Item id="edit">Edit</Menu.Item>
                      <Menu.Item id="cancel">Cancel Booking</Menu.Item>
                    </Menu>
                  </MenuTrigger>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {filteredBookings.length === 0 && (
          <Box padding={4}>
            <Text>No bookings match the current filters.</Text>
          </Box>
        )}
      </Stack>

      {/* Detail Panel */}
      {selectedBooking && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '380px',
            height: '100vh',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.12)',
            overflowY: 'auto',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <Stack space={4}>
            {/* Panel Header */}
            <Inline alignY="center">
              <Heading level={2}>Booking Details</Heading>
              <Box style={{ marginLeft: 'auto' }}>
                <Button variant="ghost" onPress={() => setSelectedBooking(null)}>
                  ✕ Close
                </Button>
              </Box>
            </Inline>

            <Inline space={2} alignY="center">
              <Text>{selectedBooking.id}</Text>
              <StatusBadge status={selectedBooking.status} />
            </Inline>

            <Divider />

            {/* Customer Info */}
            <Stack space={2}>
              <Heading level={3}>Customer Information</Heading>
              <Text>Name: {selectedBooking.customer}</Text>
              <Text>Email: {selectedBooking.email}</Text>
            </Stack>

            <Divider />

            {/* Venue & Schedule */}
            <Stack space={2}>
              <Heading level={3}>Venue &amp; Schedule</Heading>
              <Text>Venue: {selectedBooking.venue}</Text>
              <Text>Date: {selectedBooking.date}</Text>
              <Text>Time: {selectedBooking.timeSlot}</Text>
            </Stack>

            <Divider />

            {/* Notes */}
            <Stack space={2}>
              <Heading level={3}>Notes</Heading>
              <Text>{selectedBooking.notes || 'No notes provided.'}</Text>
            </Stack>

            <Divider />

            {/* Payment History — Collapsible */}
            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setPaymentExpanded(v => !v)}
              >
                Payment History {paymentExpanded ? '▲' : '▼'}
              </Button>
              {paymentExpanded && (
                <Stack space={2}>
                  <Text>Invoice #INV-001 — $500.00 — Paid</Text>
                  <Text>Invoice #INV-002 — $150.00 — Pending</Text>
                  <Text>Deposit received: $200.00</Text>
                </Stack>
              )}
            </Stack>

            <Divider />

            {/* Communication Log — Collapsible */}
            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setCommExpanded(v => !v)}
              >
                Communication Log {commExpanded ? '▲' : '▼'}
              </Button>
              {commExpanded && (
                <Stack space={2}>
                  <Text>2026-06-20 — Booking confirmation email sent</Text>
                  <Text>2026-06-19 — Customer inquiry via contact form</Text>
                  <Text>2026-06-18 — Initial quote sent</Text>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TestApp;
