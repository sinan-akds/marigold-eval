import { useEffect, useMemo, useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  AppLayout,
  Autocomplete,
  Badge,
  Button,
  Columns,
  DatePicker,
  Dialog,
  Divider,
  Headline,
  Inline,
  Inset,
  Menu,
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
const TODAY = '2026-06-28';
const THIS_WEEK_START = '2026-06-22';
const THIS_WEEK_END = '2026-06-28';

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: TODAY,
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Team meeting for Q3 planning.',
  },
  {
    id: 'BK-002',
    customer: 'Bob Martinez',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: TODAY,
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: '',
  },
  {
    id: 'BK-003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-25',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Birthday celebration.',
  },
  {
    id: 'BK-004',
    customer: 'David Kim',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-26',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Cancelled due to weather.',
  },
  {
    id: 'BK-005',
    customer: 'Eve Chen',
    email: 'eve@example.com',
    venue: 'Conference Room B',
    date: '2026-07-02',
    timeSlot: '18:00-21:00',
    status: 'Pending',
    notes: 'Product launch event.',
  },
  {
    id: 'BK-006',
    customer: 'Frank Rivera',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: TODAY,
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Annual company gathering.',
  },
  {
    id: 'BK-007',
    customer: 'Grace Liu',
    email: 'grace@example.com',
    venue: 'Workshop Studio',
    date: '2026-07-05',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: '',
  },
];

const statusBadgeVariant = (status: BookingStatus): 'success' | 'warning' | 'default' => {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'default';
};

const toDateString = (d: DateValue): string =>
  `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;

// ── New Booking Dialog ──────────────────────────────────────────────────────
const NewBookingDialog = ({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (b: Omit<Booking, 'id'>) => void;
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState<DateValue | null>(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setName(''); setEmail(''); setVenue('');
    setDate(null); setTimeSlot(''); setNotes('');
  };

  const handleCreate = () => {
    if (!name) return;
    onAdd({
      customer: name, email, venue,
      date: date ? toDateString(date) : '',
      timeSlot, status: 'Pending', notes,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      size="medium"
      closeButton
      open={open}
      onOpenChange={v => { if (!v) reset(); onOpenChange(v); }}
    >
      <Dialog.Title>New Booking</Dialog.Title>
      <Dialog.Content>
        <Stack space={4}>
          <TextField label="Customer Name" required value={name} onChange={setName} />
          <TextField label="Customer Email" type="email" value={email} onChange={setEmail} />
          <Select
            label="Venue"
            placeholder="Select a venue"
            selectedKey={venue || null}
            onSelectionChange={(k: any) => setVenue(String(k))}
          >
            {VENUES.map(v => <Select.Option key={v} id={v}>{v}</Select.Option>)}
          </Select>
          <DatePicker
            label="Date"
            value={date ?? undefined}
            onChange={(v: DateValue | null) => setDate(v)}
          />
          <Select
            label="Time Slot"
            placeholder="Select a time slot"
            selectedKey={timeSlot || null}
            onSelectionChange={(k: any) => setTimeSlot(String(k))}
          >
            {TIME_SLOTS.map(t => <Select.Option key={t} id={t}>{t}</Select.Option>)}
          </Select>
          <TextArea label="Notes" value={notes} onChange={setNotes} />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => { reset(); onOpenChange(false); }}>Cancel</Button>
        <Button variant="primary" onPress={handleCreate}>Create Booking</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

// ── Edit Booking Dialog ─────────────────────────────────────────────────────
const EditBookingDialog = ({
  booking,
  open,
  onOpenChange,
  onSave,
}: {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (id: string, updates: Partial<Booking>) => void;
}) => {
  const [status, setStatus] = useState<BookingStatus>('Pending');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (booking) { setStatus(booking.status); setNotes(booking.notes); }
  }, [booking?.id]);

  return (
    <Dialog size="small" closeButton open={open} onOpenChange={onOpenChange}>
      <Dialog.Title>Edit Booking {booking?.id ?? ''}</Dialog.Title>
      <Dialog.Content>
        <Stack space={4}>
          <TextField label="Customer" value={booking?.customer ?? ''} readOnly />
          <Select
            label="Status"
            selectedKey={status}
            onSelectionChange={(k: any) => setStatus(String(k) as BookingStatus)}
          >
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <TextArea label="Notes" value={notes} onChange={setNotes} />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={() => onOpenChange(false)}>Cancel</Button>
        <Button
          variant="primary"
          onPress={() => {
            if (booking) onSave(booking.id, { status, notes });
            onOpenChange(false);
          }}
        >
          Save Changes
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

// ── Booking Detail Dialog ───────────────────────────────────────────────────
const DetailDialog = ({
  booking,
  open,
  onOpenChange,
}: {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) => (
  <Dialog size="large" closeButton open={open} onOpenChange={onOpenChange}>
    <Dialog.Title>Booking Details</Dialog.Title>
    <Dialog.Content>
      {booking && (
        <Stack space={4}>
          <Inline space={3} alignY="center">
            <Text weight="bold">{booking.id}</Text>
            <Badge variant={statusBadgeVariant(booking.status)}>{booking.status}</Badge>
          </Inline>
          <Divider />
          <Stack space={2}>
            <Headline level={3}>Customer Information</Headline>
            <Text>{booking.customer}</Text>
            <Text>{booking.email}</Text>
          </Stack>
          <Divider />
          <Stack space={2}>
            <Headline level={3}>Venue &amp; Schedule</Headline>
            <Text>Venue: {booking.venue}</Text>
            <Text>Date: {booking.date}</Text>
            <Text>Time Slot: {booking.timeSlot}</Text>
          </Stack>
          <Divider />
          <Stack space={2}>
            <Headline level={3}>Notes</Headline>
            <Text>{booking.notes || 'No notes provided.'}</Text>
          </Stack>
          <Accordion allowsMultipleExpanded>
            <Accordion.Item id="payment-history">
              <Accordion.Header>Payment History</Accordion.Header>
              <Accordion.Content>
                <Stack space={2}>
                  <Text>Invoice #INV-001 — €500.00 — Paid on 2026-06-01</Text>
                  <Text>Invoice #INV-002 — €250.00 — Pending</Text>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="communication-log">
              <Accordion.Header>Communication Log</Accordion.Header>
              <Accordion.Content>
                <Stack space={2}>
                  <Text>2026-06-20 — Booking confirmation email sent.</Text>
                  <Text>2026-06-22 — Customer requested time change.</Text>
                  <Text>2026-06-23 — Time change confirmed via email.</Text>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      )}
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={() => onOpenChange(false)}>Close</Button>
    </Dialog.Actions>
  </Dialog>
);

// ── Booking Table ───────────────────────────────────────────────────────────
const BookingTable = ({
  bookings,
  onViewDetails,
  onEditBooking,
  onCancelBooking,
}: {
  bookings: Booking[];
  onViewDetails: (b: Booking) => void;
  onEditBooking: (b: Booking) => void;
  onCancelBooking: (id: string) => void;
}) => {
  if (bookings.length === 0) {
    return <Text>No bookings match the current filters.</Text>;
  }

  return (
    <Scrollable>
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
          {bookings.map(booking => (
            <Table.Row key={booking.id} id={booking.id}>
              <Table.Cell>{booking.id}</Table.Cell>
              <Table.Cell>{booking.customer}</Table.Cell>
              <Table.Cell>{booking.venue}</Table.Cell>
              <Table.Cell>{booking.date}</Table.Cell>
              <Table.Cell>{booking.timeSlot}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusBadgeVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label="Row actions">
                  <ActionMenu.Item id="view-details" onAction={() => onViewDetails(booking)}>
                    View Details
                  </ActionMenu.Item>
                  <ActionMenu.Item id="edit" onAction={() => onEditBooking(booking)}>
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
};

// ── Main Page ───────────────────────────────────────────────────────────────
const BookingManagementPage = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [venueFilter, setVenueFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const handleAddBooking = (b: Omit<Booking, 'id'>) => {
    const id = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    setBookings(prev => [...prev, { id, ...b }]);
  };

  const handleSaveBooking = (id: string, updates: Partial<Booking>) =>
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));

  const handleCancelBooking = (id: string) =>
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' as BookingStatus } : b))
    );

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditOpen(true);
  };

  const clearFilters = () => {
    setDateFilter(null);
    setVenueFilter('');
    setStatusFilter('all');
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (activeTab === 'today' && b.date !== TODAY) return false;
      if (activeTab === 'this-week' && (b.date < THIS_WEEK_START || b.date > THIS_WEEK_END))
        return false;
      if (dateFilter && b.date !== toDateString(dateFilter)) return false;
      if (venueFilter && !b.venue.toLowerCase().includes(venueFilter.toLowerCase()))
        return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });
  }, [bookings, activeTab, dateFilter, venueFilter, statusFilter]);

  const tableProps = {
    bookings: filteredBookings,
    onViewDetails: handleViewDetails,
    onEditBooking: handleEditBooking,
    onCancelBooking: handleCancelBooking,
  };

  return (
    <AppLayout>
      <AppLayout.Main>
    <Inset space={6}>
      <Stack space={6}>
        {/* Header */}
        <Inline alignX="between" alignY="center">
          <Headline level={1}>Booking Management</Headline>
          <Button variant="primary" onPress={() => setNewBookingOpen(true)}>
            New Booking
          </Button>
        </Inline>

        {/* Capacity alert */}
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only 2 slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>

        {/* Filter bar */}
        <Columns columns={[3, 3, 2, 'fit']} space={4} collapseAt="600px">
          <DatePicker
            label="Date"
            value={dateFilter ?? undefined}
            onChange={(v: DateValue | null) => setDateFilter(v)}
          />
          <Autocomplete
            label="Search venue"
            value={venueFilter}
            onChange={setVenueFilter}
            onSubmit={(key: any) => { if (key) setVenueFilter(String(key)); }}
          >
            {VENUES.filter(
              v => !venueFilter || v.toLowerCase().includes(venueFilter.toLowerCase())
            ).map(v => (
              <Autocomplete.Option key={v} id={v}>{v}</Autocomplete.Option>
            ))}
          </Autocomplete>
          <Select
            label="Status"
            selectedKey={statusFilter}
            onSelectionChange={(key: any) => setStatusFilter(String(key))}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button onPress={clearFilters}>Clear Filters</Button>
        </Columns>

        {/* Tabs + Table */}
        <Tabs
          aria-label="Booking views"
          selectedKey={activeTab}
          onSelectionChange={(key: any) => setActiveTab(String(key))}
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

        {/* Dialogs */}
        <NewBookingDialog
          open={newBookingOpen}
          onOpenChange={setNewBookingOpen}
          onAdd={handleAddBooking}
        />
        <DetailDialog
          booking={selectedBooking}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
        <EditBookingDialog
          booking={editingBooking}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={handleSaveBooking}
        />
      </Stack>
    </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default BookingManagementPage;
