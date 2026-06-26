import { useState } from 'react';
import {
  Accordion,
  ActionMenu,
  Autocomplete,
  Badge,
  Button,
  DatePicker,
  Dialog,
  Headline,
  Inline,
  Scrollable,
  SectionMessage,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
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

const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
];

const TODAY = '2026-06-25';

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual company meeting — catering required',
  },
  {
    id: 'BK-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Team workshop, awaiting deposit',
  },
  {
    id: 'BK-003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-26',
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Birthday party — cancelled by customer',
  },
  {
    id: 'BK-004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-27',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Product launch event',
  },
  {
    id: 'BK-005',
    customer: 'Eva Martinez',
    email: 'eva@example.com',
    venue: 'Main Hall',
    date: '2026-06-28',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Photography workshop',
  },
  {
    id: 'BK-006',
    customer: 'Frank Lee',
    email: 'frank@example.com',
    venue: 'Conference Room B',
    date: '2026-06-25',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Interview sessions — 6 candidates',
  },
  {
    id: 'BK-007',
    customer: 'Grace Kim',
    email: 'grace@example.com',
    venue: 'Main Hall',
    date: '2026-06-26',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Art exhibition setup',
  },
];

const STATUS_BADGE: Record<BookingStatus, 'success' | 'warning' | 'default'> =
  {
    Confirmed: 'success',
    Pending: 'warning',
    Cancelled: 'default',
  };

function getWeekBounds() {
  const today = new Date(TODAY);
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(today);
  start.setDate(today.getDate() + diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filter state
  const [filterDate, setFilterDate] = useState('');
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKey, setFilterKey] = useState(0);

  // Active tab
  const [activeTab, setActiveTab] = useState('all');

  // New booking dialog
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Detail drawer
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const week = getWeekBounds();

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'today' && b.date !== TODAY) return false;
    if (activeTab === 'week' && (b.date < week.start || b.date > week.end))
      return false;
    if (filterDate && b.date !== filterDate) return false;
    if (
      filterVenue &&
      !b.venue.toLowerCase().includes(filterVenue.toLowerCase())
    )
      return false;
    if (filterStatus !== 'all' && b.status.toLowerCase() !== filterStatus)
      return false;
    return true;
  });

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterVenue('');
    setFilterStatus('all');
    setFilterKey(k => k + 1);
  };

  const handleViewDetails = (booking: Booking) => {
    setDetailBooking(booking);
    setDetailOpen(true);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' as const } : b))
    );
  };

  const handleCreateBooking = () => {
    if (!newName.trim()) return;
    const newBooking: Booking = {
      id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
      customer: newName,
      email: newEmail,
      venue: newVenue || VENUES[0],
      date: newDate || TODAY,
      timeSlot: newTimeSlot || TIME_SLOTS[0],
      status: 'Pending',
      notes: newNotes,
    };
    setBookings(prev => [...prev, newBooking]);
    setNewBookingOpen(false);
    setNewName('');
    setNewEmail('');
    setNewVenue('');
    setNewDate('');
    setNewTimeSlot('');
    setNewNotes('');
    setFormKey(k => k + 1);
  };

  const venueOptions = VENUES.filter(
    v => !filterVenue || v.toLowerCase().includes(filterVenue.toLowerCase())
  );

  return (
    <Stack space={4}>
      <Headline level={1}>Booking Management</Headline>

      {/* Capacity alert */}
      <SectionMessage variant="warning">
        <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
        <SectionMessage.Content>
          Main Hall has only 2 slots remaining for today.
        </SectionMessage.Content>
      </SectionMessage>

      {/* Filter bar */}
      <Inline space={3} alignY="bottom">
        <DatePicker
          key={filterKey}
          label="Date"
          width={36}
          onChange={val => setFilterDate(val ? val.toString() : '')}
        />
        <Autocomplete
          key={filterKey + 100}
          label="Venue"
          width={48}
          value={filterVenue}
          onChange={val => setFilterVenue(val)}
          onSubmit={(val, key) =>
            setFilterVenue(key != null ? String(key) : val != null ? String(val) : '')
          }
        >
          {venueOptions.map(v => (
            <Autocomplete.Option key={v} id={v}>
              {v}
            </Autocomplete.Option>
          ))}
        </Autocomplete>
        <Select
          label="Status"
          width={40}
          selectedKey={filterStatus}
          onSelectionChange={key => setFilterStatus(String(key))}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="confirmed">Confirmed</Select.Option>
          <Select.Option id="pending">Pending</Select.Option>
          <Select.Option id="cancelled">Cancelled</Select.Option>
        </Select>
        <Button variant="secondary" onPress={handleClearFilters}>
          Clear Filters
        </Button>
      </Inline>

      {/* New Booking button */}
      <Button variant="primary" onPress={() => setNewBookingOpen(true)}>
        New Booking
      </Button>

      {/* Tabs */}
      <Tabs
        aria-label="Booking views"
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(String(key))}
      >
        <Tabs.List aria-label="View filters">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">
          <BookingsTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onCancelBooking={handleCancelBooking}
          />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="today">
          <BookingsTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onCancelBooking={handleCancelBooking}
          />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="week">
          <BookingsTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onCancelBooking={handleCancelBooking}
          />
        </Tabs.TabPanel>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog
        closeButton
        open={newBookingOpen}
        onOpenChange={setNewBookingOpen}
        size="small"
      >
        {({ close }) => (
          <>
            <Dialog.Title>New Booking</Dialog.Title>
            <Dialog.Content>
              <Stack space={3} key={formKey}>
                <TextField
                  label="Customer Name"
                  required
                  value={newName}
                  onChange={setNewName}
                />
                <TextField
                  label="Customer Email"
                  type="email"
                  value={newEmail}
                  onChange={setNewEmail}
                />
                <Select
                  label="Venue"
                  placeholder="Select a venue"
                  selectedKey={newVenue || null}
                  onSelectionChange={key => setNewVenue(String(key))}
                >
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker
                  label="Date"
                  onChange={val => setNewDate(val ? val.toString() : '')}
                />
                <Select
                  label="Time Slot"
                  placeholder="Select a time slot"
                  selectedKey={newTimeSlot || null}
                  onSelectionChange={key => setNewTimeSlot(String(key))}
                >
                  {TIME_SLOTS.map(ts => (
                    <Select.Option key={ts} id={ts}>
                      {ts}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  value={newNotes}
                  onChange={setNewNotes}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" onPress={handleCreateBooking}>
                Create Booking
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Detail Dialog */}
      <Dialog
        closeButton
        open={detailOpen}
        onOpenChange={setDetailOpen}
        size="medium"
      >
        {({ close }) => (
          <>
            <Dialog.Title>
              {detailBooking ? `Booking ${detailBooking.id}` : 'Booking Details'}
            </Dialog.Title>
            <Dialog.Content>
              {detailBooking && (
                <Stack space={4}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Status:</Text>
                    <Badge variant={STATUS_BADGE[detailBooking.status]}>
                      {detailBooking.status}
                    </Badge>
                  </Inline>

                  <Stack space={2}>
                    <Headline level={3}>Customer Information</Headline>
                    <Text>Name: {detailBooking.customer}</Text>
                    <Text>Email: {detailBooking.email}</Text>
                  </Stack>

                  <Stack space={2}>
                    <Headline level={3}>Venue &amp; Schedule</Headline>
                    <Text>Venue: {detailBooking.venue}</Text>
                    <Text>Date: {detailBooking.date}</Text>
                    <Text>Time: {detailBooking.timeSlot}</Text>
                  </Stack>

                  <Stack space={2}>
                    <Headline level={3}>Notes</Headline>
                    <Text>
                      {detailBooking.notes || 'No notes provided.'}
                    </Text>
                  </Stack>

                  <Accordion>
                    <Accordion.Item id="payment">
                      <Accordion.Header>Payment History</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <Text>Invoice #INV-001 — €500.00 — Paid</Text>
                          <Text>Deposit — €150.00 — Paid</Text>
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item id="communication">
                      <Accordion.Header>Communication Log</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <Text>
                            Confirmation email sent on {detailBooking.date}
                          </Text>
                          <Text>Reminder sent 48h before event</Text>
                          <Text>Customer acknowledged venue rules</Text>
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Close
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

interface BookingsTableProps {
  bookings: Booking[];
  onViewDetails: (b: Booking) => void;
  onCancelBooking: (id: string) => void;
}

function BookingsTable({
  bookings,
  onViewDetails,
  onCancelBooking,
}: BookingsTableProps) {
  if (bookings.length === 0) {
    return <Text>No bookings match the current filters.</Text>;
  }
  return (
    <Scrollable>
    <Table aria-label="Bookings table">
      <Table.Header>
        <Table.Column rowHeader>Booking ID</Table.Column>
        <Table.Column>Customer</Table.Column>
        <Table.Column>Venue</Table.Column>
        <Table.Column>Date</Table.Column>
        <Table.Column>Time Slot</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Actions</Table.Column>
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
              <Badge variant={STATUS_BADGE[booking.status]}>
                {booking.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu aria-label={`Actions for ${booking.id}`}>
                <ActionMenu.Item
                  id="view"
                  onAction={() => onViewDetails(booking)}
                >
                  View Details
                </ActionMenu.Item>
                <ActionMenu.Item id="edit" onAction={() => {}}>
                  Edit
                </ActionMenu.Item>
                <ActionMenu.Item
                  id="cancel"
                  variant="destructive"
                  onAction={() => onCancelBooking(booking.id)}
                >
                  Cancel Booking
                </ActionMenu.Item>
              </ActionMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
    </Scrollable>
  );
}
