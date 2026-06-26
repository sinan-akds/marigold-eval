import React, { useState, useMemo } from 'react';
import { CalendarDate } from '@internationalized/date';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  TextField,
  Select,
  DatePicker,
  Table,
  Dialog,
  Tabs,
  ComboBox,
  Textarea,
  Badge,
  Card,
  Divider,
  Message,
  Menu,
} from '@marigold/components';

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  notes: string;
}

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const TODAY = '2026-06-21';
const WEEK_DATES = [
  '2026-06-21',
  '2026-06-22',
  '2026-06-23',
  '2026-06-24',
  '2026-06-25',
  '2026-06-26',
  '2026-06-27',
];
const MAIN_HALL_CAPACITY = 5;

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-21',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Setup for annual conference',
  },
  {
    id: 'BK002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-21',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Weekly team meeting',
  },
  {
    id: 'BK003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-22',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Birthday celebration',
  },
  {
    id: 'BK004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-23',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Art workshop – cancelled by client',
  },
  {
    id: 'BK005',
    customer: 'Eve Davis',
    email: 'eve@example.com',
    venue: 'Main Hall',
    date: '2026-06-21',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch event',
  },
  {
    id: 'BK006',
    customer: 'Frank Wilson',
    email: 'frank@example.com',
    venue: 'Conference Room B',
    date: '2026-06-27',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Quarterly board meeting',
  },
  {
    id: 'BK007',
    customer: 'Grace Lee',
    email: 'grace@example.com',
    venue: 'Main Hall',
    date: '2026-06-21',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Networking event for local startups',
  },
];

function calendarDateToString(d: CalendarDate): string {
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const variant =
    status === 'Confirmed' ? 'success' : status === 'Pending' ? 'warning' : 'neutral';
  return <Badge variant={variant}>{status}</Badge>;
};

const TestApp: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filter state
  const [dateFilter, setDateFilter] = useState<CalendarDate | null>(null);
  const [venueSearch, setVenueSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Tab state
  const [activeTab, setActiveTab] = useState<string>('all');

  // Dialog states
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Detail panel collapsible sections
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [commLogExpanded, setCommLogExpanded] = useState(false);

  // New booking form
  const [formCustomer, setFormCustomer] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState<CalendarDate | null>(null);
  const [formTimeSlot, setFormTimeSlot] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Capacity alert
  const mainHallTodayCount = useMemo(
    () =>
      bookings.filter(
        b => b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'Cancelled'
      ).length,
    [bookings]
  );
  const mainHallRemaining = MAIN_HALL_CAPACITY - mainHallTodayCount;
  const showCapacityAlert = mainHallRemaining <= 2 && mainHallRemaining >= 0;

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (activeTab === 'today') {
      result = result.filter(b => b.date === TODAY);
    } else if (activeTab === 'week') {
      result = result.filter(b => WEEK_DATES.includes(b.date));
    }

    if (dateFilter) {
      const dateStr = calendarDateToString(dateFilter);
      result = result.filter(b => b.date === dateStr);
    }

    if (venueSearch) {
      result = result.filter(b =>
        b.venue.toLowerCase().includes(venueSearch.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(b => b.status.toLowerCase() === statusFilter);
    }

    return result;
  }, [bookings, activeTab, dateFilter, venueSearch, statusFilter]);

  const clearFilters = () => {
    setDateFilter(null);
    setVenueSearch('');
    setStatusFilter('all');
  };

  const handleCreateBooking = () => {
    if (!formCustomer.trim()) return;
    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formCustomer,
      email: formEmail,
      venue: formVenue || VENUES[0],
      date: formDate ? calendarDateToString(formDate) : TODAY,
      timeSlot: formTimeSlot || TIME_SLOTS[0],
      status: 'Pending',
      notes: formNotes,
    };
    setBookings(prev => [...prev, newBooking]);
    setNewBookingOpen(false);
    setFormCustomer('');
    setFormEmail('');
    setFormVenue('');
    setFormDate(null);
    setFormTimeSlot('');
    setFormNotes('');
  };

  const handleRowAction = (action: string, booking: Booking) => {
    if (action === 'view') {
      setPaymentExpanded(false);
      setCommLogExpanded(false);
      setSelectedBooking(booking);
    } else if (action === 'cancel') {
      setBookings(prev =>
        prev.map(b =>
          b.id === booking.id ? { ...b, status: 'Cancelled' as BookingStatus } : b
        )
      );
    }
  };

  const renderTable = () => (
    <Stack space={3}>
      <Table aria-label="Bookings table">
        <Table.Header>
          <Table.Column key="id">Booking ID</Table.Column>
          <Table.Column key="customer">Customer</Table.Column>
          <Table.Column key="venue">Venue</Table.Column>
          <Table.Column key="date">Date</Table.Column>
          <Table.Column key="timeSlot">Time Slot</Table.Column>
          <Table.Column key="status">Status</Table.Column>
          <Table.Column key="actions">Actions</Table.Column>
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
                <Menu onAction={key => handleRowAction(String(key), booking)}>
                  <Menu.Trigger>
                    <Button variant="ghost" size="small">
                      •••
                    </Button>
                  </Menu.Trigger>
                  <Menu.Item id="view">View Details</Menu.Item>
                  <Menu.Item id="edit">Edit</Menu.Item>
                  <Menu.Item id="cancel">Cancel Booking</Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {filteredBookings.length === 0 && (
        <Text>No bookings match the current filters.</Text>
      )}
    </Stack>
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Booking Management</Headline>

      {/* Filter bar */}
      <Inline space={3} alignY="end">
        <DatePicker label="Date" value={dateFilter} onChange={setDateFilter} />
        <ComboBox
          label="Search Venue"
          inputValue={venueSearch}
          onInputChange={setVenueSearch}
          onSelectionChange={key => key && setVenueSearch(String(key))}
        >
          {VENUES.map(v => (
            <ComboBox.Option key={v} id={v}>
              {v}
            </ComboBox.Option>
          ))}
        </ComboBox>
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
        <Button variant="ghost" onPress={clearFilters}>
          Clear Filters
        </Button>
      </Inline>

      {/* Capacity alert */}
      {showCapacityAlert && (
        <Message variant="warning">
          Main Hall has only {mainHallRemaining} slot
          {mainHallRemaining === 1 ? '' : 's'} remaining for today.
        </Message>
      )}

      {/* New Booking button */}
      <Inline space={3} alignY="center">
        <Headline level={2}>Bookings</Headline>
        <Button variant="primary" onPress={() => setNewBookingOpen(true)}>
          New Booking
        </Button>
      </Inline>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={k => setActiveTab(String(k))}
      >
        <Tabs.List>
          <Tabs.Tab id="all">All Bookings</Tabs.Tab>
          <Tabs.Tab id="today">Today</Tabs.Tab>
          <Tabs.Tab id="week">This Week</Tabs.Tab>
        </Tabs.List>
        <Tabs.TabPanel id="all">{renderTable()}</Tabs.TabPanel>
        <Tabs.TabPanel id="today">{renderTable()}</Tabs.TabPanel>
        <Tabs.TabPanel id="week">{renderTable()}</Tabs.TabPanel>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog open={newBookingOpen} onClose={() => setNewBookingOpen(false)}>
        <Stack space={4}>
          <Headline level={2}>New Booking</Headline>
          <TextField
            label="Customer Name"
            value={formCustomer}
            onChange={setFormCustomer}
            required
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
            onSelectionChange={k => setFormVenue(String(k))}
          >
            {VENUES.map(v => (
              <Select.Option key={v} id={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
          <DatePicker label="Date" value={formDate} onChange={setFormDate} />
          <Select
            label="Time Slot"
            selectedKey={formTimeSlot}
            onSelectionChange={k => setFormTimeSlot(String(k))}
          >
            {TIME_SLOTS.map(s => (
              <Select.Option key={s} id={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
          <Textarea label="Notes" value={formNotes} onChange={setFormNotes} />
          <Inline space={2}>
            <Button variant="primary" onPress={handleCreateBooking}>
              Create Booking
            </Button>
            <Button variant="ghost" onPress={() => setNewBookingOpen(false)}>
              Cancel
            </Button>
          </Inline>
        </Stack>
      </Dialog>

      {/* Detail Panel Dialog */}
      {selectedBooking && (
        <Dialog open={true} onClose={() => setSelectedBooking(null)}>
          <Stack space={4}>
            <Inline space={3} alignY="center">
              <Headline level={2}>{selectedBooking.id}</Headline>
              <StatusBadge status={selectedBooking.status} />
            </Inline>

            <Divider />

            <Stack space={2}>
              <Headline level={3}>Customer Information</Headline>
              <Text>Name: {selectedBooking.customer}</Text>
              <Text>Email: {selectedBooking.email}</Text>
            </Stack>

            <Stack space={2}>
              <Headline level={3}>Venue & Date</Headline>
              <Text>Venue: {selectedBooking.venue}</Text>
              <Text>Date: {selectedBooking.date}</Text>
              <Text>Time Slot: {selectedBooking.timeSlot}</Text>
            </Stack>

            <Stack space={2}>
              <Headline level={3}>Notes</Headline>
              <Text>{selectedBooking.notes || 'No notes provided.'}</Text>
            </Stack>

            <Divider />

            {/* Payment History collapsible */}
            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setPaymentExpanded(e => !e)}
              >
                Payment History {paymentExpanded ? '▲' : '▼'}
              </Button>
              {paymentExpanded && (
                <Card>
                  <Stack space={2}>
                    <Text>2026-06-15 — €500.00 — Paid</Text>
                    <Text>2026-06-18 — €200.00 — Paid</Text>
                  </Stack>
                </Card>
              )}
            </Stack>

            {/* Communication Log collapsible */}
            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setCommLogExpanded(e => !e)}
              >
                Communication Log {commLogExpanded ? '▲' : '▼'}
              </Button>
              {commLogExpanded && (
                <Card>
                  <Stack space={2}>
                    <Text>2026-06-10 — Booking confirmation sent via email</Text>
                    <Text>2026-06-14 — Reminder email sent 7 days before event</Text>
                  </Stack>
                </Card>
              )}
            </Stack>

            <Button onPress={() => setSelectedBooking(null)}>Close</Button>
          </Stack>
        </Dialog>
      )}
    </Stack>
  );
};

export default TestApp;
