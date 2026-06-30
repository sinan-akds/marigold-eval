import { useMemo, useState } from 'react';
import {
  Accordion,
  ActionMenu,
  Autocomplete,
  Badge,
  Button,
  Columns,
  DatePicker,
  Dialog,
  Drawer,
  Headline,
  Inline,
  SectionMessage,
  Select,
  Scrollable,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';
import type { DateValue } from '@internationalized/date';

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
] as const;

const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
] as const;

const INITIAL_BOOKINGS: Booking[] = [
  { id: 'BK-001', customer: 'Alice Johnson', email: 'alice@example.com', venue: 'Main Hall', date: '2026-06-28', timeSlot: '09:00-12:00', status: 'Confirmed', notes: 'Setup required for conference' },
  { id: 'BK-002', customer: 'Bob Smith', email: 'bob@example.com', venue: 'Conference Room A', date: '2026-06-28', timeSlot: '12:00-15:00', status: 'Pending', notes: 'Awaiting deposit payment' },
  { id: 'BK-003', customer: 'Carol White', email: 'carol@example.com', venue: 'Rooftop Terrace', date: '2026-06-29', timeSlot: '18:00-21:00', status: 'Confirmed', notes: 'Evening cocktail event' },
  { id: 'BK-004', customer: 'David Brown', email: 'david@example.com', venue: 'Workshop Studio', date: '2026-06-30', timeSlot: '09:00-12:00', status: 'Cancelled', notes: 'Cancelled by customer request' },
  { id: 'BK-005', customer: 'Eva Martinez', email: 'eva@example.com', venue: 'Conference Room B', date: '2026-06-28', timeSlot: '15:00-18:00', status: 'Pending', notes: 'Waiting for final headcount' },
  { id: 'BK-006', customer: 'Frank Wilson', email: 'frank@example.com', venue: 'Main Hall', date: '2026-07-01', timeSlot: '12:00-15:00', status: 'Confirmed', notes: 'VIP corporate event' },
  { id: 'BK-007', customer: 'Grace Lee', email: 'grace@example.com', venue: 'Rooftop Terrace', date: '2026-06-28', timeSlot: '09:00-12:00', status: 'Confirmed', notes: 'Morning yoga session' },
];

const getBadgeVariant = (status: BookingStatus): 'success' | 'warning' | 'default' => {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'default';
};

const dateValueToString = (v: DateValue): string =>
  `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`;

const getTodayString = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${mo}-${dd}`;
  };
  return { start: fmt(monday), end: fmt(sunday) };
};

let nextBookingId = 8;

interface FormState {
  customerName: string;
  customerEmail: string;
  venue: string;
  date: DateValue | null;
  timeSlot: string;
  notes: string;
  editingId: string | null;
}

const EMPTY_FORM: FormState = {
  customerName: '',
  customerEmail: '',
  venue: 'Main Hall',
  date: null,
  timeSlot: '09:00-12:00',
  notes: '',
  editingId: null,
};

interface BookingTableProps {
  bookings: Booking[];
  onViewDetails: (b: Booking) => void;
  onEdit: (b: Booking) => void;
  onCancel: (id: string) => void;
}

const BookingTable = ({ bookings, onViewDetails, onEdit, onCancel }: BookingTableProps) => (
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
              <Badge variant={getBadgeVariant(booking.status)}>
                {booking.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu
                onAction={key => {
                  if (key === 'view') onViewDetails(booking);
                  else if (key === 'edit') onEdit(booking);
                  else if (key === 'cancel') onCancel(booking.id);
                }}
              >
                <ActionMenu.Item id="view">View Details</ActionMenu.Item>
                <ActionMenu.Item id="edit">Edit</ActionMenu.Item>
                <ActionMenu.Item id="cancel">Cancel Booking</ActionMenu.Item>
              </ActionMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Scrollable>
);

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const [activeTab, setActiveTab] = useState('all');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(EMPTY_FORM);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const todayStr = getTodayString();
  const weekRange = getWeekRange();

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (activeTab === 'today' && b.date !== todayStr) return false;
      if (activeTab === 'this-week' && (b.date < weekRange.start || b.date > weekRange.end)) return false;
      if (filterDate && b.date !== dateValueToString(filterDate)) return false;
      if (filterVenue && !b.venue.toLowerCase().includes(filterVenue.toLowerCase())) return false;
      if (filterStatus !== 'all' && b.status.toLowerCase() !== filterStatus) return false;
      return true;
    });
  }, [bookings, activeTab, filterDate, filterVenue, filterStatus, todayStr, weekRange]);

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('all');
    setAutocompleteKey(k => k + 1);
  };

  const openNewBooking = () => {
    setFormState(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (b: Booking) => {
    setFormState({
      customerName: b.customer,
      customerEmail: b.email,
      venue: b.venue,
      date: null,
      timeSlot: b.timeSlot,
      notes: b.notes,
      editingId: b.id,
    });
    setDialogOpen(true);
  };

  const openDetail = (b: Booking) => {
    setDetailBooking(b);
    setDrawerOpen(true);
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: 'Cancelled' as BookingStatus } : b)
    );
  };

  const submitBooking = (close: () => void) => {
    if (!formState.customerName.trim()) return;
    if (formState.editingId) {
      setBookings(prev =>
        prev.map(b =>
          b.id === formState.editingId
            ? {
                ...b,
                customer: formState.customerName,
                email: formState.customerEmail,
                venue: formState.venue,
                date: formState.date ? dateValueToString(formState.date) : b.date,
                timeSlot: formState.timeSlot,
                notes: formState.notes,
              }
            : b
        )
      );
    } else {
      setBookings(prev => [
        ...prev,
        {
          id: `BK-${String(nextBookingId++).padStart(3, '0')}`,
          customer: formState.customerName,
          email: formState.customerEmail,
          venue: formState.venue,
          date: formState.date ? dateValueToString(formState.date) : todayStr,
          timeSlot: formState.timeSlot,
          status: 'Pending',
          notes: formState.notes,
        },
      ]);
    }
    close();
  };

  const mainHallToday = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === todayStr && b.status !== 'Cancelled'
  ).length;
  const HALL_CAPACITY = 4;
  const remaining = HALL_CAPACITY - mainHallToday;
  const showAlert = remaining <= 2 && remaining >= 0;

  const tableProps: BookingTableProps = {
    bookings: filteredBookings,
    onViewDetails: openDetail,
    onEdit: openEdit,
    onCancel: cancelBooking,
  };

  return (
    <Stack space={6}>
      <Inline alignX="between" alignY="center">
        <Headline level={1}>Booking Management</Headline>
        <Button variant="primary" onPress={openNewBooking}>
          New Booking
        </Button>
      </Inline>

      <Columns space={3} columns={[1, 1, 1, 'fit']} collapseAt="768px">
        <DatePicker
          label="Date"
          value={filterDate}
          onChange={v => setFilterDate(v)}
        />
        <Autocomplete
          key={autocompleteKey}
          label="Venue"
          onChange={setFilterVenue}
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
          onSelectionChange={key => setFilterStatus(key as string)}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="confirmed">Confirmed</Select.Option>
          <Select.Option id="pending">Pending</Select.Option>
          <Select.Option id="cancelled">Cancelled</Select.Option>
        </Select>
        <Button variant="secondary" onPress={clearFilters}>
          Clear Filters
        </Button>
      </Columns>

      {showAlert && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Venue Nearly Full</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only {remaining} slot{remaining !== 1 ? 's' : ''} remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      <Tabs
        aria-label="Booking views"
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(key as string)}
      >
        <Tabs.List aria-label="Booking view tabs">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="this-week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">
          <BookingTable {...tableProps} />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="today">
          <BookingTable {...tableProps} />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="this-week">
          <BookingTable {...tableProps} />
        </Tabs.TabPanel>
      </Tabs>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        size="medium"
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>
              {formState.editingId ? 'Edit Booking' : 'New Booking'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  value={formState.customerName}
                  onChange={v => setFormState(p => ({ ...p, customerName: v }))}
                  required
                />
                <TextField
                  label="Customer Email"
                  type="email"
                  value={formState.customerEmail}
                  onChange={v => setFormState(p => ({ ...p, customerEmail: v }))}
                />
                <Select
                  label="Venue"
                  selectedKey={formState.venue}
                  onSelectionChange={key =>
                    setFormState(p => ({ ...p, venue: key as string }))
                  }
                >
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker
                  label="Date"
                  value={formState.date}
                  onChange={v => setFormState(p => ({ ...p, date: v }))}
                />
                <Select
                  label="Time Slot"
                  selectedKey={formState.timeSlot}
                  onSelectionChange={key =>
                    setFormState(p => ({ ...p, timeSlot: key as string }))
                  }
                >
                  {TIME_SLOTS.map(t => (
                    <Select.Option key={t} id={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  value={formState.notes}
                  onChange={v => setFormState(p => ({ ...p, notes: v }))}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" onPress={() => submitBooking(close)}>
                {formState.editingId ? 'Save Changes' : 'Create Booking'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      <Drawer.Trigger open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer size="medium" closeButton>
          {detailBooking ? (
            <>
              <Drawer.Title>Booking {detailBooking.id}</Drawer.Title>
              <Drawer.Content>
                <Stack space={5}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Status:</Text>
                    <Badge variant={getBadgeVariant(detailBooking.status)}>
                      {detailBooking.status}
                    </Badge>
                  </Inline>

                  <Stack space={2}>
                    <Text weight="bold">Customer Information</Text>
                    <Stack space={1}>
                      <Inline space={1}>
                        <Text weight="bold">Name:</Text>
                        <Text>{detailBooking.customer}</Text>
                      </Inline>
                      <Inline space={1}>
                        <Text weight="bold">Email:</Text>
                        <Text>{detailBooking.email}</Text>
                      </Inline>
                    </Stack>
                  </Stack>

                  <Stack space={2}>
                    <Text weight="bold">Venue &amp; Schedule</Text>
                    <Stack space={1}>
                      <Inline space={1}>
                        <Text weight="bold">Venue:</Text>
                        <Text>{detailBooking.venue}</Text>
                      </Inline>
                      <Inline space={1}>
                        <Text weight="bold">Date:</Text>
                        <Text>{detailBooking.date}</Text>
                      </Inline>
                      <Inline space={1}>
                        <Text weight="bold">Time:</Text>
                        <Text>{detailBooking.timeSlot}</Text>
                      </Inline>
                    </Stack>
                  </Stack>

                  <Stack space={2}>
                    <Text weight="bold">Notes</Text>
                    <Text>{detailBooking.notes || 'No notes provided.'}</Text>
                  </Stack>

                  <Accordion allowsMultipleExpanded>
                    <Accordion.Item id="payment">
                      <Accordion.Header>Payment History</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <Text>Deposit €500 — Paid on 2026-06-15</Text>
                          <Text>Balance €1,500 — Due on 2026-07-01</Text>
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item id="comms">
                      <Accordion.Header>Communication Log</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <Text>Email: Booking confirmation — 2026-06-10</Text>
                          <Text>Call: Venue details discussed — 2026-06-12</Text>
                          <Text>Email: Payment reminder — 2026-06-20</Text>
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button slot="close">Close</Button>
              </Drawer.Actions>
            </>
          ) : null}
        </Drawer>
      </Drawer.Trigger>
    </Stack>
  );
};

export default TestApp;
