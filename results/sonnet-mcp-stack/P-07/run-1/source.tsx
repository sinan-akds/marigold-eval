import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  Autocomplete,
  Badge,
  Button,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  Headline,
  Inline,
  Menu,
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

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-23',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Anniversary dinner event. Requires floral arrangement.',
  },
  {
    id: 'BK-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-23',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Corporate quarterly review. Projector and whiteboard needed.',
  },
  {
    id: 'BK-003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-24',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Product launch cocktail reception.',
  },
  {
    id: 'BK-004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-25',
    timeSlot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Photography workshop cancelled by organizer.',
  },
  {
    id: 'BK-005',
    customer: 'Eve Martinez',
    email: 'eve@example.com',
    venue: 'Main Hall',
    date: '2026-06-23',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Team celebration lunch.',
  },
  {
    id: 'BK-006',
    customer: 'Frank Lee',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-26',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Awards ceremony. Stage and lighting setup required.',
  },
  {
    id: 'BK-007',
    customer: 'Grace Kim',
    email: 'grace@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-28',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Sunrise yoga session.',
  },
];

const TODAY = '2026-06-23';
const WEEK_START = '2026-06-22';
const WEEK_END = '2026-06-28';

const STATUS_VARIANT: Record<BookingStatus, 'success' | 'warning' | 'default'> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'default',
};

function fmtDateValue(v: DateValue): string {
  return `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Overlays
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Form state
  const [formCustomer, setFormCustomer] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState<DateValue | null>(null);
  const [formTimeSlot, setFormTimeSlot] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const openNewBookingDialog = () => {
    setEditingBooking(null);
    setFormCustomer('');
    setFormEmail('');
    setFormVenue('');
    setFormDate(null);
    setFormTimeSlot('');
    setFormNotes('');
    setBookingDialogOpen(true);
  };

  const openEditDialog = (booking: Booking) => {
    setEditingBooking(booking);
    setFormCustomer(booking.customer);
    setFormEmail(booking.email);
    setFormVenue(booking.venue);
    setFormDate(null);
    setFormTimeSlot(booking.timeSlot);
    setFormNotes(booking.notes);
    setBookingDialogOpen(true);
  };

  const handleSubmitBooking = () => {
    if (!formCustomer.trim()) return;
    const dateStr = formDate ? fmtDateValue(formDate) : TODAY;

    if (editingBooking) {
      setBookings(prev =>
        prev.map(b =>
          b.id === editingBooking.id
            ? {
                ...b,
                customer: formCustomer,
                email: formEmail,
                venue: formVenue || b.venue,
                date: dateStr,
                timeSlot: formTimeSlot || b.timeSlot,
                notes: formNotes,
              }
            : b
        )
      );
    } else {
      const newBooking: Booking = {
        id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
        customer: formCustomer,
        email: formEmail,
        venue: formVenue || VENUES[0],
        date: dateStr,
        timeSlot: formTimeSlot || TIME_SLOTS[0],
        status: 'Pending',
        notes: formNotes,
      };
      setBookings(prev => [...prev, newBooking]);
    }
    setBookingDialogOpen(false);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'Cancelled' as BookingStatus } : b))
    );
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('all');
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'today' && b.date !== TODAY) return false;
    if (activeTab === 'week' && (b.date < WEEK_START || b.date > WEEK_END)) return false;
    if (filterDate && b.date !== fmtDateValue(filterDate)) return false;
    if (filterVenue && !b.venue.toLowerCase().includes(filterVenue.toLowerCase())) return false;
    if (filterStatus !== 'all' && b.status.toLowerCase() !== filterStatus) return false;
    return true;
  });

  const mainHallTodayBookings = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'Cancelled'
  ).length;
  const showCapacityAlert = mainHallTodayBookings >= 2;

  const tableSection = (
    <Stack space={4}>
      {showCapacityAlert && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Venue Nearly Full</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only 2 slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      <Table aria-label="Bookings">
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
          {filteredBookings.length === 0
            ? (
                <Table.Row id="empty-row">
                  <Table.Cell>No bookings match the current filters.</Table.Cell>
                  <Table.Cell>{''}</Table.Cell>
                  <Table.Cell>{''}</Table.Cell>
                  <Table.Cell>{''}</Table.Cell>
                  <Table.Cell>{''}</Table.Cell>
                  <Table.Cell>{''}</Table.Cell>
                  <Table.Cell>{''}</Table.Cell>
                </Table.Row>
              )
            : filteredBookings.map(booking => (
                <Table.Row key={booking.id} id={booking.id}>
                  <Table.Cell>{booking.id}</Table.Cell>
                  <Table.Cell>{booking.customer}</Table.Cell>
                  <Table.Cell>{booking.venue}</Table.Cell>
                  <Table.Cell>{booking.date}</Table.Cell>
                  <Table.Cell>{booking.timeSlot}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={STATUS_VARIANT[booking.status]}>
                      {booking.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <ActionMenu>
                      <Menu.Item
                        id="view-details"
                        onAction={() => handleViewDetails(booking)}
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Item
                        id="edit"
                        onAction={() => openEditDialog(booking)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        id="cancel"
                        variant="destructive"
                        onAction={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Menu.Item>
                    </ActionMenu>
                  </Table.Cell>
                </Table.Row>
              ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  return (
    <Stack space={6}>
      {/* Page header */}
      <Inline alignX="between" alignY="center">
        <Headline level={1}>Booking Management</Headline>
        <Button variant="primary" onPress={openNewBookingDialog}>
          + New Booking
        </Button>
      </Inline>

      {/* Filter bar */}
      <Inline space={4} alignY="end">
        <DatePicker
          label="Date"
          value={filterDate ?? undefined}
          onChange={val => setFilterDate(val)}
          width={48}
        />
        <Autocomplete
          label="Venue"
          value={filterVenue}
          onChange={val => setFilterVenue(val)}
          width={56}
        >
          {VENUES.map(v => (
            <Autocomplete.Option key={v} id={v}>
              {v}
            </Autocomplete.Option>
          ))}
        </Autocomplete>
        <Select
          label="Status"
          selectedKey={filterStatus}
          onSelectionChange={key => setFilterStatus(String(key))}
          width={40}
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

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(String(key))}
      >
        <Tabs.List aria-label="Booking views">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">{tableSection}</Tabs.TabPanel>
        <Tabs.TabPanel id="today">{tableSection}</Tabs.TabPanel>
        <Tabs.TabPanel id="week">{tableSection}</Tabs.TabPanel>
      </Tabs>

      {/* New / Edit Booking Dialog */}
      <Dialog
        size="medium"
        closeButton
        open={bookingDialogOpen}
        onOpenChange={open => {
          setBookingDialogOpen(open);
          if (!open) setEditingBooking(null);
        }}
      >
        {({ close }) => (
          <>
            <Dialog.Title>
              {editingBooking ? `Edit Booking ${editingBooking.id}` : 'New Booking'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  required
                  value={formCustomer}
                  onChange={setFormCustomer}
                />
                <TextField
                  label="Customer Email"
                  type="email"
                  value={formEmail}
                  onChange={setFormEmail}
                />
                <Select
                  label="Venue"
                  selectedKey={formVenue || null}
                  onSelectionChange={key => setFormVenue(String(key))}
                  placeholder="Select a venue"
                >
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker
                  label="Date"
                  value={formDate ?? undefined}
                  onChange={val => setFormDate(val)}
                />
                <Select
                  label="Time Slot"
                  selectedKey={formTimeSlot || null}
                  onSelectionChange={key => setFormTimeSlot(String(key))}
                  placeholder="Select a time slot"
                >
                  {TIME_SLOTS.map(t => (
                    <Select.Option key={t} id={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  value={formNotes}
                  onChange={setFormNotes}
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  handleSubmitBooking();
                  close();
                }}
              >
                {editingBooking ? 'Save Changes' : 'Create Booking'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Detail Drawer */}
      <Drawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
      >
        {selectedBooking && (
          <>
            <Drawer.Title>Booking {selectedBooking.id}</Drawer.Title>
            <Drawer.Content>
              <Stack space={4}>
                <Inline space={3} alignY="center">
                  <Text weight="bold">Status</Text>
                  <Badge variant={STATUS_VARIANT[selectedBooking.status]}>
                    {selectedBooking.status}
                  </Badge>
                </Inline>

                <Divider />

                <Stack space={2}>
                  <Headline level={3}>Customer Information</Headline>
                  <Text>
                    <Text weight="bold">Name: </Text>
                    {selectedBooking.customer}
                  </Text>
                  <Text>
                    <Text weight="bold">Email: </Text>
                    {selectedBooking.email}
                  </Text>
                </Stack>

                <Divider />

                <Stack space={2}>
                  <Headline level={3}>Venue &amp; Schedule</Headline>
                  <Text>
                    <Text weight="bold">Venue: </Text>
                    {selectedBooking.venue}
                  </Text>
                  <Text>
                    <Text weight="bold">Date: </Text>
                    {selectedBooking.date}
                  </Text>
                  <Text>
                    <Text weight="bold">Time: </Text>
                    {selectedBooking.timeSlot}
                  </Text>
                </Stack>

                {selectedBooking.notes && (
                  <>
                    <Divider />
                    <Stack space={2}>
                      <Headline level={3}>Notes</Headline>
                      <Text>{selectedBooking.notes}</Text>
                    </Stack>
                  </>
                )}

                <Divider />

                <Accordion>
                  <Accordion.Item id="payment-history">
                    <Accordion.Header>Payment History</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Text>Invoice #INV-2026-042 · €450.00 · Paid on 2026-05-15</Text>
                        <Text>Deposit of €150.00 received on 2026-04-10</Text>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="communication-log">
                    <Accordion.Header>Communication Log</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Text>Booking confirmation email sent · 2026-06-01</Text>
                        <Text>24-hour reminder sent · 2026-06-22</Text>
                        <Text>Customer confirmed attendance · 2026-06-22</Text>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button onPress={() => setDetailOpen(false)}>Close</Button>
            </Drawer.Actions>
          </>
        )}
      </Drawer>
    </Stack>
  );
}
