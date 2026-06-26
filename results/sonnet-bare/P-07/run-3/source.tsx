import { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  TextField,
  Select,
  Combobox,
  DatePicker,
  Textarea,
  Tabs,
  Table,
  Alert,
  Badge,
  Dialog,
  Card,
  Divider,
  Menu,
} from '@marigold/components';
import type { CalendarDate } from '@internationalized/date';

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
] as const;

const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
] as const;

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes: string;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'B001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-22',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Anniversary dinner event for 150 guests.',
  },
  {
    id: 'B002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-22',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Quarterly team all-hands meeting.',
  },
  {
    id: 'B003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-23',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Birthday celebration party for 40 guests.',
  },
  {
    id: 'B004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-24',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: '',
  },
  {
    id: 'B005',
    customer: 'Eva Martinez',
    email: 'eva@example.com',
    venue: 'Conference Room B',
    date: '2026-06-22',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch preparation workshop.',
  },
  {
    id: 'B006',
    customer: 'Frank Lee',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Corporate annual awards ceremony for 200 guests.',
  },
];

const TODAY = '2026-06-22';
const WEEK_END = '2026-06-28';

function getStatusVariant(
  status: string
): 'success' | 'warning' | 'neutral' {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'neutral';
}

interface BookingTableProps {
  bookings: Booking[];
  onAction: (bookingId: string, action: string) => void;
}

function BookingTable({ bookings, onAction }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <Stack space={4}>
        <Text>No bookings match the current filters.</Text>
      </Stack>
    );
  }

  return (
    <Table aria-label="Bookings table">
      <Table.Header>
        <Table.Column id="id" isRowHeader>
          Booking ID
        </Table.Column>
        <Table.Column id="customer">Customer</Table.Column>
        <Table.Column id="venue">Venue</Table.Column>
        <Table.Column id="date">Date</Table.Column>
        <Table.Column id="timeSlot">Time Slot</Table.Column>
        <Table.Column id="status">Status</Table.Column>
        <Table.Column id="actions">Actions</Table.Column>
      </Table.Header>
      <Table.Body>
        {bookings.map(booking => (
          <Table.Row key={booking.id} id={booking.id}>
            <Table.Cell>{booking.id}</Table.Cell>
            <Table.Cell>{booking.customer}</Table.Cell>
            <Table.Cell>{booking.venue}</Table.Cell>
            <Table.Cell>{booking.date}</Table.Cell>
            <Table.Cell>{booking.timeSlot}</Table.Cell>
            <Table.Cell>
              <Badge variant={getStatusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <Menu.Trigger>
                <Button
                  variant="ghost"
                  aria-label={`Actions for booking ${booking.id}`}
                >
                  •••
                </Button>
                <Menu onAction={key => onAction(booking.id, String(key))}>
                  <Menu.Item id="view">View Details</Menu.Item>
                  <Menu.Item id="edit">Edit</Menu.Item>
                  <Menu.Item id="cancel">Cancel Booking</Menu.Item>
                </Menu>
              </Menu.Trigger>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

interface DetailPanelProps {
  booking: Booking;
  onClose: () => void;
}

function DetailPanel({ booking, onClose }: DetailPanelProps) {
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [commExpanded, setCommExpanded] = useState(false);

  return (
    <Card>
      <Stack space={4}>
        <Inline alignY="center">
          <Stack space={1}>
            <Headline level={3}>{booking.id}</Headline>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </Stack>
          <Button
            variant="ghost"
            onPress={onClose}
            aria-label="Close detail panel"
          >
            ✕
          </Button>
        </Inline>

        <Divider />

        <Stack space={2}>
          <Text weight="bold">Customer</Text>
          <Text>{booking.customer}</Text>
          <Text>{booking.email}</Text>
        </Stack>

        <Divider />

        <Stack space={2}>
          <Text weight="bold">Venue & Schedule</Text>
          <Text>{booking.venue}</Text>
          <Text>{booking.date}</Text>
          <Text>{booking.timeSlot}</Text>
        </Stack>

        {booking.notes ? (
          <>
            <Divider />
            <Stack space={2}>
              <Text weight="bold">Notes</Text>
              <Text>{booking.notes}</Text>
            </Stack>
          </>
        ) : null}

        <Divider />

        <Stack space={2}>
          <Button
            variant="ghost"
            onPress={() => setPaymentExpanded(prev => !prev)}
          >
            <Inline space={2}>
              <Text weight="bold">Payment History</Text>
              <Text>{paymentExpanded ? '▲' : '▼'}</Text>
            </Inline>
          </Button>
          {paymentExpanded ? (
            <Stack space={2}>
              <Text>Invoice #INV-{booking.id} — Pending payment</Text>
              <Text>Amount: £500.00</Text>
              <Text>Due date: {booking.date}</Text>
            </Stack>
          ) : null}
        </Stack>

        <Stack space={2}>
          <Button
            variant="ghost"
            onPress={() => setCommExpanded(prev => !prev)}
          >
            <Inline space={2}>
              <Text weight="bold">Communication Log</Text>
              <Text>{commExpanded ? '▲' : '▼'}</Text>
            </Inline>
          </Button>
          {commExpanded ? (
            <Stack space={2}>
              <Text>Confirmation email sent — {booking.date}</Text>
              <Text>Reminder scheduled — 24h before event</Text>
              <Text>No further communications on record.</Text>
            </Stack>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [filterDate, setFilterDate] = useState<CalendarDate | null>(null);
  const [filterVenue, setFilterVenue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // New booking form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formVenue, setFormVenue] = useState<string>('');
  const [formDate, setFormDate] = useState<CalendarDate | null>(null);
  const [formTimeSlot, setFormTimeSlot] = useState<string>('');
  const [formNotes, setFormNotes] = useState('');

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (activeTab === 'today') {
      result = result.filter(b => b.date === TODAY);
    } else if (activeTab === 'week') {
      result = result.filter(b => b.date >= TODAY && b.date <= WEEK_END);
    }

    if (filterDate) {
      const dateStr = filterDate.toString();
      result = result.filter(b => b.date === dateStr);
    }

    if (filterVenue) {
      result = result.filter(b => b.venue === filterVenue);
    }

    if (filterStatus !== 'All') {
      result = result.filter(b => b.status === filterStatus);
    }

    return result;
  }, [bookings, activeTab, filterDate, filterVenue, filterStatus]);

  function clearFilters() {
    setFilterDate(null);
    setFilterVenue(null);
    setFilterStatus('All');
  }

  function resetForm() {
    setFormName('');
    setFormEmail('');
    setFormVenue('');
    setFormDate(null);
    setFormTimeSlot('');
    setFormNotes('');
  }

  function handleCreateBooking() {
    if (!formName.trim()) return;
    const newId = `B${String(bookings.length + 1).padStart(3, '0')}`;
    const newBooking: Booking = {
      id: newId,
      customer: formName,
      email: formEmail,
      venue: formVenue,
      date: formDate ? formDate.toString() : TODAY,
      timeSlot: formTimeSlot,
      status: 'Pending',
      notes: formNotes,
    };
    setBookings(prev => [...prev, newBooking]);
    setIsNewBookingOpen(false);
    resetForm();
  }

  function handleRowAction(bookingId: string, action: string) {
    if (action === 'view') {
      const found = bookings.find(b => b.id === bookingId) ?? null;
      setSelectedBooking(found);
    } else if (action === 'edit') {
      // placeholder — would open an edit dialog
    } else if (action === 'cancel') {
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
        )
      );
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev =>
          prev ? { ...prev, status: 'Cancelled' } : null
        );
      }
    }
  }

  return (
    <Stack space={6}>
      {/* Page header */}
      <Inline alignY="center">
        <Headline level={1}>Venue Booking Management</Headline>
        <Button variant="primary" onPress={() => setIsNewBookingOpen(true)}>
          New Booking
        </Button>
      </Inline>

      {/* Capacity alert */}
      <Alert variant="warning">
        Main Hall has only 2 slots remaining for today.
      </Alert>

      {/* Filter bar */}
      <Inline space={4} alignY="end">
        <DatePicker
          label="Date"
          value={filterDate}
          onChange={setFilterDate}
        />
        <Combobox
          label="Venue"
          selectedKey={filterVenue}
          onSelectionChange={key => setFilterVenue(key ? String(key) : null)}
        >
          {VENUES.map(venue => (
            <Combobox.Option key={venue} id={venue}>
              {venue}
            </Combobox.Option>
          ))}
        </Combobox>
        <Select
          label="Status"
          selectedKey={filterStatus}
          onSelectionChange={key => setFilterStatus(String(key))}
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Confirmed">Confirmed</Select.Option>
          <Select.Option id="Pending">Pending</Select.Option>
          <Select.Option id="Cancelled">Cancelled</Select.Option>
        </Select>
        <Button variant="secondary" onPress={clearFilters}>
          Clear Filters
        </Button>
      </Inline>

      {/* Main content area: table + detail panel */}
      <Inline alignY="start" space={4}>
        {/* Table with tabs */}
        <Stack space={4}>
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(String(key))}
          >
            <Tabs.List>
              <Tabs.Tab id="all">All Bookings</Tabs.Tab>
              <Tabs.Tab id="today">Today</Tabs.Tab>
              <Tabs.Tab id="week">This Week</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="all">
              <BookingTable
                bookings={filteredBookings}
                onAction={handleRowAction}
              />
            </Tabs.Panel>
            <Tabs.Panel id="today">
              <BookingTable
                bookings={filteredBookings}
                onAction={handleRowAction}
              />
            </Tabs.Panel>
            <Tabs.Panel id="week">
              <BookingTable
                bookings={filteredBookings}
                onAction={handleRowAction}
              />
            </Tabs.Panel>
          </Tabs>
        </Stack>

        {/* Detail panel */}
        {selectedBooking ? (
          <DetailPanel
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        ) : null}
      </Inline>

      {/* New Booking Dialog */}
      <Dialog
        open={isNewBookingOpen}
        onClose={() => {
          setIsNewBookingOpen(false);
          resetForm();
        }}
      >
        <Stack space={4}>
          <Headline level={3}>New Booking</Headline>

          <TextField
            label="Customer Name"
            value={formName}
            onChange={setFormName}
            isRequired
          />

          <TextField
            label="Customer Email"
            type="email"
            value={formEmail}
            onChange={setFormEmail}
          />

          <Select
            label="Venue"
            selectedKey={formVenue}
            onSelectionChange={key => setFormVenue(String(key))}
            placeholder="Select a venue"
          >
            {VENUES.map(venue => (
              <Select.Option key={venue} id={venue}>
                {venue}
              </Select.Option>
            ))}
          </Select>

          <DatePicker
            label="Date"
            value={formDate}
            onChange={setFormDate}
          />

          <Select
            label="Time Slot"
            selectedKey={formTimeSlot}
            onSelectionChange={key => setFormTimeSlot(String(key))}
            placeholder="Select a time slot"
          >
            {TIME_SLOTS.map(slot => (
              <Select.Option key={slot} id={slot}>
                {slot}
              </Select.Option>
            ))}
          </Select>

          <Textarea
            label="Notes"
            value={formNotes}
            onChange={setFormNotes}
          />

          <Inline space={2}>
            <Button variant="primary" onPress={handleCreateBooking}>
              Create Booking
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                setIsNewBookingOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </Inline>
        </Stack>
      </Dialog>
    </Stack>
  );
}
