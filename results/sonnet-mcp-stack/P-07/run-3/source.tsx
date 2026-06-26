import { useMemo, useState } from 'react';
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

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: Status;
  notes: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

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

const TODAY = '2026-06-23';
const WEEK_END = '2026-06-29';
const MAIN_HALL_CAPACITY = 4;

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-23',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Requires stage setup and full sound system.',
  },
  {
    id: 'BK-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-23',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Waiting for deposit confirmation.',
  },
  {
    id: 'BK-003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-24',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Outdoor ceremony — rain plan needed.',
  },
  {
    id: 'BK-004',
    customer: 'David Lee',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Cancelled by customer on short notice.',
  },
  {
    id: 'BK-005',
    customer: 'Emma Davis',
    email: 'emma@example.com',
    venue: 'Conference Room B',
    date: '2026-06-26',
    timeSlot: '18:00-21:00',
    status: 'Pending',
    notes: 'Corporate dinner, catering arrangement required.',
  },
  {
    id: 'BK-006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-23',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'VIP gala event.',
  },
  {
    id: 'BK-007',
    customer: 'Grace Wilson',
    email: 'grace@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-27',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: '',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusVariant(status: Status): 'success' | 'warning' | 'default' {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'default';
}

function dateValueToString(dv: DateValue): string {
  return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

const TestApp = () => {
  // filter bar
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // tabs
  const [activeTab, setActiveTab] = useState('all');
  // bookings
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  // detail panel
  const [detailId, setDetailId] = useState<string | null>(null);
  // new booking form
  const [formCustomer, setFormCustomer] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState<DateValue | null>(null);
  const [formTimeSlot, setFormTimeSlot] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // ── Derived ──

  const mainHallTodayCount = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'Cancelled'
  ).length;
  const mainHallRemaining = MAIN_HALL_CAPACITY - mainHallTodayCount;
  const showCapacityAlert = mainHallRemaining <= 2;

  const detailBooking = detailId ? bookings.find(b => b.id === detailId) ?? null : null;

  const filteredBookings = useMemo(() => {
    let result = bookings;
    if (activeTab === 'today') result = result.filter(b => b.date === TODAY);
    else if (activeTab === 'thisWeek') result = result.filter(b => b.date >= TODAY && b.date <= WEEK_END);
    if (filterDate) result = result.filter(b => b.date === dateValueToString(filterDate));
    if (filterVenue.trim()) result = result.filter(b => b.venue.toLowerCase().includes(filterVenue.toLowerCase()));
    if (filterStatus !== 'all') result = result.filter(b => b.status === filterStatus);
    return result;
  }, [bookings, activeTab, filterDate, filterVenue, filterStatus]);

  // ── Handlers ──

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('all');
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' as Status } : b));
  };

  const createBooking = (close: () => void) => {
    if (!formCustomer.trim()) return;
    const newId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const booking: Booking = {
      id: newId,
      customer: formCustomer,
      email: formEmail,
      venue: formVenue || 'Main Hall',
      date: formDate ? dateValueToString(formDate) : TODAY,
      timeSlot: formTimeSlot || '09:00-12:00',
      status: 'Pending',
      notes: formNotes,
    };
    setBookings(prev => [...prev, booking]);
    setFormCustomer(''); setFormEmail(''); setFormVenue('');
    setFormDate(null); setFormTimeSlot(''); setFormNotes('');
    close();
  };

  // ── Table renderer ──

  const bookingTable = (
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
        {filteredBookings.map(booking => (
          <Table.Row key={booking.id}>
            <Table.Cell>{booking.id}</Table.Cell>
            <Table.Cell>{booking.customer}</Table.Cell>
            <Table.Cell>{booking.venue}</Table.Cell>
            <Table.Cell>{booking.date}</Table.Cell>
            <Table.Cell>{booking.timeSlot}</Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu>
                <Menu.Item id="view" onAction={() => setDetailId(booking.id)}>
                  View Details
                </Menu.Item>
                <Menu.Item id="edit" onAction={() => setDetailId(booking.id)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  id="cancel"
                  variant="destructive"
                  onAction={() => cancelBooking(booking.id)}
                >
                  Cancel Booking
                </Menu.Item>
              </ActionMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  // ── Render ──

  return (
    <Stack space={6}>
      {/* Page header + New Booking */}
      <Inline space={4} alignX="between" alignY="center">
        <Headline level="1">Booking Management</Headline>
        <Dialog.Trigger>
          <Button variant="primary">New Booking</Button>
          <Dialog size="medium" closeButton>
            {({ close }: { close: () => void }) => (
              <>
                <Dialog.Title>New Booking</Dialog.Title>
                <Dialog.Content>
                  <Stack space={4}>
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
                      selectedKey={formVenue || null}
                      onSelectionChange={key => setFormVenue(String(key))}
                    >
                      {VENUES.map(v => (
                        <Select.Option key={v} id={v}>{v}</Select.Option>
                      ))}
                    </Select>
                    <DatePicker
                      label="Date"
                      value={formDate ?? undefined}
                      onChange={val => setFormDate(val ?? null)}
                    />
                    <Select
                      label="Time Slot"
                      selectedKey={formTimeSlot || null}
                      onSelectionChange={key => setFormTimeSlot(String(key))}
                    >
                      {TIME_SLOTS.map(ts => (
                        <Select.Option key={ts} id={ts}>{ts}</Select.Option>
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
                  <Button variant="secondary" slot="close">Cancel</Button>
                  <Button variant="primary" onPress={() => createBooking(close)}>
                    Create Booking
                  </Button>
                </Dialog.Actions>
              </>
            )}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {/* Filter bar */}
      <Inline space={4} alignY="input">
        <div style={{ width: '180px' }}>
          <DatePicker
            label="Filter by Date"
            value={filterDate ?? undefined}
            onChange={val => setFilterDate(val ?? null)}
          />
        </div>
        <div style={{ width: '200px' }}>
          <Autocomplete
            label="Search Venue"
            value={filterVenue}
            onChange={setFilterVenue}
          >
            {VENUES.map(v => (
              <Autocomplete.Option key={v} id={v}>{v}</Autocomplete.Option>
            ))}
          </Autocomplete>
        </div>
        <div style={{ width: '160px' }}>
          <Select
            label="Status"
            selectedKey={filterStatus}
            onSelectionChange={key => setFilterStatus(String(key))}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
        </div>
        <Button variant="secondary" onPress={clearFilters}>Clear Filters</Button>
      </Inline>

      {/* Main layout: table + optional detail panel */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left: table area */}
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>
          {/* Capacity alert */}
          {showCapacityAlert && (
            <div style={{ marginBottom: '1rem' }}>
              <SectionMessage>
                <SectionMessage.Title>Venue Nearly Full</SectionMessage.Title>
                <SectionMessage.Content>
                  Main Hall has only {mainHallRemaining} slot{mainHallRemaining !== 1 ? 's' : ''} remaining for today.
                </SectionMessage.Content>
              </SectionMessage>
            </div>
          )}

          {/* Tabs + table */}
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(String(key))}
          >
            <Tabs.List aria-label="Booking view">
              <Tabs.Item id="all">All Bookings</Tabs.Item>
              <Tabs.Item id="today">Today</Tabs.Item>
              <Tabs.Item id="thisWeek">This Week</Tabs.Item>
            </Tabs.List>
            <Tabs.TabPanel id="all">{bookingTable}</Tabs.TabPanel>
            <Tabs.TabPanel id="today">{bookingTable}</Tabs.TabPanel>
            <Tabs.TabPanel id="thisWeek">{bookingTable}</Tabs.TabPanel>
          </Tabs>
        </div>

        {/* Right: detail panel */}
        {detailBooking && (
          <div
            style={{
              flex: '1 1 340px',
              maxWidth: '400px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '1.25rem',
              backgroundColor: '#f9fafb',
            }}
          >
            <Stack space={4}>
              {/* Header */}
              <Inline space={4} alignX="between" alignY="center">
                <Stack space={1}>
                  <Text weight="bold">{detailBooking.id}</Text>
                  <Badge variant={statusVariant(detailBooking.status)}>
                    {detailBooking.status}
                  </Badge>
                </Stack>
                <Button variant="ghost" size="icon" onPress={() => setDetailId(null)}>
                  ✕
                </Button>
              </Inline>

              <Divider />

              {/* Customer */}
              <Stack space={1}>
                <Text weight="bold">Customer</Text>
                <Text>{detailBooking.customer}</Text>
                <Text>{detailBooking.email}</Text>
              </Stack>

              <Divider />

              {/* Venue & time */}
              <Stack space={1}>
                <Text weight="bold">Venue &amp; Date</Text>
                <Text>{detailBooking.venue}</Text>
                <Text>{detailBooking.date}</Text>
                <Text>{detailBooking.timeSlot}</Text>
              </Stack>

              {/* Notes */}
              {detailBooking.notes ? (
                <>
                  <Divider />
                  <Stack space={1}>
                    <Text weight="bold">Notes</Text>
                    <Text>{detailBooking.notes}</Text>
                  </Stack>
                </>
              ) : null}

              <Divider />

              {/* Collapsible sections */}
              <Accordion allowsMultipleExpanded>
                <Accordion.Item id="payment">
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>2026-06-01 — €500.00 deposit received</Text>
                      <Text>2026-06-10 — €1,000.00 balance pending</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="comms">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>2026-06-01 — Booking confirmation sent via email</Text>
                      <Text>2026-06-15 — Reminder sent, awaiting reply</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </div>
        )}
      </div>
    </Stack>
  );
};

export default TestApp;
