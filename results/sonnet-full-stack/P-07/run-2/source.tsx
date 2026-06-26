import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  Autocomplete,
  Badge,
  Button,
  Columns,
  DatePicker,
  Dialog,
  Divider,
  Headline,
  Inline,
  Scrollable,
  SectionMessage,
  Select,
  Split,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

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

const TODAY = '2026-06-25';
const WEEK_DATES = [
  '2026-06-22',
  '2026-06-23',
  '2026-06-24',
  '2026-06-25',
  '2026-06-26',
  '2026-06-27',
  '2026-06-28',
];

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: Status;
  notes?: string;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BKG-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Anniversary celebration, needs catering setup',
  },
  {
    id: 'BKG-002',
    customer: 'Bob Martinez',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Quarterly review meeting',
  },
  {
    id: 'BKG-003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-26',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
  },
  {
    id: 'BKG-004',
    customer: 'David Lee',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-27',
    timeSlot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Team building event — cancelled due to scheduling conflict',
  },
  {
    id: 'BKG-005',
    customer: 'Emma Brown',
    email: 'emma@example.com',
    venue: 'Conference Room B',
    date: '2026-06-28',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Product launch preparation',
  },
  {
    id: 'BKG-006',
    customer: 'Frank Chen',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Corporate dinner event',
  },
  {
    id: 'BKG-007',
    customer: 'Grace Kim',
    email: 'grace@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '12:00-15:00',
    status: 'Pending',
  },
];

function statusVariant(status: Status): 'success' | 'warning' | 'default' {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'default';
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function dateValueToString(dv: DateValue): string {
  return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
}

export default function TestApp() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeTab, setActiveTab] = useState<string>('all');

  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenueText, setFilterVenueText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newBookingOpen, setNewBookingOpen] = useState(false);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState<DateValue | null>(null);
  const [formTimeSlot, setFormTimeSlot] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormVenue('');
    setFormDate(null);
    setFormTimeSlot('');
    setFormNotes('');
  };

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenueText('');
    setFilterStatus('all');
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'today' && b.date !== TODAY) return false;
    if (activeTab === 'week' && !WEEK_DATES.includes(b.date)) return false;
    if (filterDate && b.date !== dateValueToString(filterDate)) return false;
    if (
      filterVenueText &&
      !b.venue.toLowerCase().includes(filterVenueText.toLowerCase())
    )
      return false;
    if (filterStatus !== 'all' && b.status.toLowerCase() !== filterStatus)
      return false;
    return true;
  });

  const mainHallTodayCount = bookings.filter(
    b =>
      b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'Cancelled'
  ).length;
  const mainHallRemaining = TIME_SLOTS.length - mainHallTodayCount;
  const showCapacityAlert = mainHallRemaining <= 2;

  const handleMenuAction = (action: string, booking: Booking) => {
    if (action === 'view') {
      setSelectedBooking(booking);
    } else if (action === 'cancel') {
      const updated = { ...booking, status: 'Cancelled' as Status };
      setBookings(prev => prev.map(b => (b.id === booking.id ? updated : b)));
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking(updated);
      }
    }
  };

  const handleCreateBooking = (close: () => void) => {
    if (!formName.trim()) return;
    const newBooking: Booking = {
      id: `BKG-${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formName,
      email: formEmail,
      venue: formVenue || VENUES[0],
      date: formDate ? dateValueToString(formDate) : TODAY,
      timeSlot: formTimeSlot || TIME_SLOTS[0],
      status: 'Pending',
      notes: formNotes || undefined,
    };
    setBookings(prev => [...prev, newBooking]);
    resetForm();
    close();
  };

  return (
    <Stack space={4}>
      <Inline alignY="center" space={4}>
        <Headline level="1">Booking Management</Headline>
        <Split />
        <Button variant="primary" onPress={() => setNewBookingOpen(true)}>
          New Booking
        </Button>
      </Inline>

      <Divider />

      <Inline space={3} alignY="input">
        <DatePicker
          label="Date"
          width="fit"
          value={filterDate ?? undefined}
          onChange={val => setFilterDate(val)}
        />
        <Autocomplete
          label="Venue"
          width={48}
          menuTrigger="focus"
          value={filterVenueText}
          onChange={val => setFilterVenueText(val)}
        >
          {VENUES.map(v => (
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
        <Button variant="secondary" onPress={clearFilters}>
          Clear Filters
        </Button>
      </Inline>

      {showCapacityAlert && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Venue Nearly Full</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only {mainHallRemaining} slot
            {mainHallRemaining !== 1 ? 's' : ''} remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      {selectedBooking ? (
        <Columns columns={[3, 1]} space={4} collapseAt="60em">
          <BookingTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            bookings={filteredBookings}
            onAction={handleMenuAction}
          />
          <DetailPanel
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        </Columns>
      ) : (
        <BookingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bookings={filteredBookings}
          onAction={handleMenuAction}
        />
      )}

      <Dialog
        size="medium"
        open={newBookingOpen}
        onOpenChange={open => {
          setNewBookingOpen(open);
          if (!open) resetForm();
        }}
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>New Booking</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  value={formName}
                  onChange={setFormName}
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
                  selectedKey={formVenue || undefined}
                  onSelectionChange={key => setFormVenue(String(key))}
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
                  selectedKey={formTimeSlot || undefined}
                  onSelectionChange={key => setFormTimeSlot(String(key))}
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
                onPress={() => handleCreateBooking(close)}
              >
                Create Booking
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

interface BookingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  bookings: Booking[];
  onAction: (action: string, booking: Booking) => void;
}

function BookingTabs({
  activeTab,
  onTabChange,
  bookings,
  onAction,
}: BookingTabsProps) {
  return (
    <Tabs
      aria-label="Booking views"
      selectedKey={activeTab}
      onSelectionChange={key => onTabChange(String(key))}
    >
      <Tabs.List aria-label="Booking views">
        <Tabs.Item id="all">All Bookings</Tabs.Item>
        <Tabs.Item id="today">Today</Tabs.Item>
        <Tabs.Item id="week">This Week</Tabs.Item>
      </Tabs.List>
      <Tabs.TabPanel id="all">
        <BookingTable bookings={bookings} onAction={onAction} />
      </Tabs.TabPanel>
      <Tabs.TabPanel id="today">
        <BookingTable bookings={bookings} onAction={onAction} />
      </Tabs.TabPanel>
      <Tabs.TabPanel id="week">
        <BookingTable bookings={bookings} onAction={onAction} />
      </Tabs.TabPanel>
    </Tabs>
  );
}

interface BookingTableProps {
  bookings: Booking[];
  onAction: (action: string, booking: Booking) => void;
}

function BookingTable({ bookings, onAction }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <SectionMessage>
        <SectionMessage.Title>No bookings found</SectionMessage.Title>
        <SectionMessage.Content>
          No bookings match your current filters.
        </SectionMessage.Content>
      </SectionMessage>
    );
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
              <Table.Cell>
                <Stack space={1}>
                  <Text weight="bold">{booking.customer}</Text>
                  <Text fontSize="xs" color="foreground-muted">
                    {booking.email}
                  </Text>
                </Stack>
              </Table.Cell>
              <Table.Cell>{booking.venue}</Table.Cell>
              <Table.Cell>{formatDate(booking.date)}</Table.Cell>
              <Table.Cell>{booking.timeSlot}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <ActionMenu.Item
                    id="view"
                    onAction={() => onAction('view', booking)}
                  >
                    View Details
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="edit"
                    onAction={() => onAction('edit', booking)}
                  >
                    Edit
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="cancel"
                    variant="destructive"
                    onAction={() => onAction('cancel', booking)}
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

interface DetailPanelProps {
  booking: Booking;
  onClose: () => void;
}

function DetailPanel({ booking, onClose }: DetailPanelProps) {
  return (
    <Stack space={3}>
      <Inline alignY="center" space={2}>
        <Headline level="3">Booking Details</Headline>
        <Split />
        <Button variant="ghost" size="icon" onPress={onClose}>
          ✕
        </Button>
      </Inline>

      <Divider />

      <Inline space={2} alignY="center">
        <Text weight="bold">{booking.id}</Text>
        <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
      </Inline>

      <Divider />

      <Stack space={1}>
        <Text weight="bold">Customer</Text>
        <Text>{booking.customer}</Text>
        <Text color="foreground-muted">{booking.email}</Text>
      </Stack>

      <Divider />

      <Stack space={1}>
        <Text weight="bold">Venue &amp; Schedule</Text>
        <Text>{booking.venue}</Text>
        <Text color="foreground-muted">
          {formatDate(booking.date)} · {booking.timeSlot}
        </Text>
      </Stack>

      {booking.notes && (
        <>
          <Divider />
          <Stack space={1}>
            <Text weight="bold">Notes</Text>
            <Text>{booking.notes}</Text>
          </Stack>
        </>
      )}

      <Divider />

      <Accordion allowsMultipleExpanded>
        <Accordion.Item id="payment">
          <Accordion.Header>Payment History</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <Text color="foreground-muted">No payment records on file.</Text>
              <Text fontSize="sm">Deposit: Pending</Text>
              <Text fontSize="sm">Balance due: —</Text>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="communication">
          <Accordion.Header>Communication Log</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <Text color="foreground-muted">No messages logged yet.</Text>
              <Text fontSize="sm">
                Confirmation email sent on booking creation.
              </Text>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
