import { useMemo, useState } from 'react';
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

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-23',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Anniversary celebration with family.',
  },
  {
    id: 'BK-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-23',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Quarterly team meeting.',
  },
  {
    id: 'BK-003',
    customer: 'Carol Davis',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-24',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: '',
  },
  {
    id: 'BK-004',
    customer: 'David Lee',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-20',
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled due to scheduling conflict.',
  },
  {
    id: 'BK-005',
    customer: 'Emma Wilson',
    email: 'emma@example.com',
    venue: 'Conference Room B',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Product launch preparation.',
  },
  {
    id: 'BK-006',
    customer: 'Frank Brown',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-23',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Corporate networking event.',
  },
  {
    id: 'BK-007',
    customer: 'Grace Chen',
    email: 'grace@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-27',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: '',
  },
];

function statusVariant(s: BookingStatus): 'success' | 'warning' | 'default' {
  if (s === 'Confirmed') return 'success';
  if (s === 'Pending') return 'warning';
  return 'default';
}

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function getTodayStr() {
  const t = new Date();
  return t.toISOString().split('T')[0];
}

function getWeekBounds() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function dateValueToStr(dv: DateValue) {
  return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
}

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filter bar state
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [venueSearch, setVenueSearch] = useState('');
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Tab state
  const [activeTab, setActiveTab] = useState('all');

  // Overlay state
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  // New booking form
  const [newCustomer, setNewCustomer] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDate, setNewDate] = useState<DateValue | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit booking form
  const [editCustomer, setEditCustomer] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editTimeSlot, setEditTimeSlot] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const openEdit = (booking: Booking) => {
    setEditBooking(booking);
    setEditCustomer(booking.customer);
    setEditEmail(booking.email);
    setEditVenue(booking.venue);
    setEditTimeSlot(booking.timeSlot);
    setEditNotes(booking.notes);
  };

  const submitEdit = (close: () => void) => {
    if (!editBooking || !editCustomer.trim()) return;
    setBookings(prev =>
      prev.map(b =>
        b.id === editBooking.id
          ? { ...b, customer: editCustomer, email: editEmail, venue: editVenue, timeSlot: editTimeSlot, notes: editNotes }
          : b
      )
    );
    close();
  };

  const todayStr = getTodayStr();

  const filteredBookings = useMemo(() => {
    const { start, end } = getWeekBounds();
    return bookings.filter(b => {
      if (activeTab === 'today' && b.date !== todayStr) return false;
      if (activeTab === 'week') {
        const bd = new Date(b.date + 'T00:00:00');
        if (bd < start || bd > end) return false;
      }
      if (filterDate && b.date !== dateValueToStr(filterDate)) return false;
      if (filterVenue && !b.venue.toLowerCase().includes(filterVenue.toLowerCase())) return false;
      if (filterStatus !== 'All' && b.status !== filterStatus) return false;
      return true;
    });
  }, [bookings, activeTab, filterDate, filterVenue, filterStatus, todayStr]);

  const mainHallTodayCount = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === todayStr && b.status !== 'Cancelled'
  ).length;
  const mainHallRemaining = TIME_SLOTS.length - mainHallTodayCount;
  const showCapacityAlert = mainHallRemaining <= 2;

  const clearFilters = () => {
    setFilterDate(null);
    setVenueSearch('');
    setFilterVenue('');
    setFilterStatus('All');
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' as BookingStatus } : b))
    );
    if (detailBooking?.id === id) {
      setDetailBooking(prev => (prev ? { ...prev, status: 'Cancelled' } : prev));
    }
  };

  const submitNewBooking = (close: () => void) => {
    if (!newCustomer.trim()) return;
    const newId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const dateStr = newDate ? dateValueToStr(newDate) : todayStr;
    setBookings(prev => [
      ...prev,
      {
        id: newId,
        customer: newCustomer,
        email: newEmail,
        venue: newVenue || VENUES[0],
        date: dateStr,
        timeSlot: newTimeSlot || TIME_SLOTS[0],
        status: 'Pending',
        notes: newNotes,
      },
    ]);
    setNewCustomer('');
    setNewEmail('');
    setNewVenue('');
    setNewDate(null);
    setNewTimeSlot('');
    setNewNotes('');
    close();
  };

  const tableContent = (
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
        {filteredBookings.map(booking => (
          <Table.Row key={booking.id} id={booking.id}>
            <Table.Cell>
              <Text weight="medium">{booking.id}</Text>
            </Table.Cell>
            <Table.Cell>{booking.customer}</Table.Cell>
            <Table.Cell>{booking.venue}</Table.Cell>
            <Table.Cell>{formatDate(booking.date)}</Table.Cell>
            <Table.Cell>{booking.timeSlot}</Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariant(booking.status)}>{booking.status}</Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu>
                <Menu.Item id="view" onAction={() => setDetailBooking(booking)}>
                  View Details
                </Menu.Item>
                <Menu.Item id="edit" onAction={() => openEdit(booking)}>
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

  return (
    <Stack space={6}>
      {/* Header */}
      <Inline alignX="between" alignY="center" space={4}>
        <Headline level={2}>Booking Management</Headline>
        <Button variant="primary" onPress={() => setShowNewBooking(true)}>
          New Booking
        </Button>
      </Inline>

      {/* Filter Bar */}
      <Columns columns={[1, 1, 1, 'fit']} space={4} collapseAt="600px">
        <DatePicker
          label="Date"
          value={filterDate ?? undefined}
          onChange={val => setFilterDate(val ?? null)}
        />
        <Autocomplete
          label="Venue"
          value={venueSearch}
          onChange={val => {
            setVenueSearch(val);
            setFilterVenue(val);
          }}
          onSubmit={(key, val) => {
            const chosen = key ? String(key) : (val ?? '');
            setFilterVenue(chosen);
            setVenueSearch(chosen);
          }}
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
          onSelectionChange={k => setFilterStatus(String(k))}
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Confirmed">Confirmed</Select.Option>
          <Select.Option id="Pending">Pending</Select.Option>
          <Select.Option id="Cancelled">Cancelled</Select.Option>
        </Select>
        <Inline alignY="bottom" space={0}>
          <Button variant="secondary" onPress={clearFilters}>
            Clear Filters
          </Button>
        </Inline>
      </Columns>

      {/* Capacity Alert */}
      {showCapacityAlert && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Venue Nearly Full</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only {mainHallRemaining} slot
            {mainHallRemaining !== 1 ? 's' : ''} remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      {/* Tabs + Table */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={k => setActiveTab(String(k))}
        aria-label="Booking views"
      >
        <Tabs.List aria-label="Booking view options">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">{tableContent}</Tabs.TabPanel>
        <Tabs.TabPanel id="today">{tableContent}</Tabs.TabPanel>
        <Tabs.TabPanel id="week">{tableContent}</Tabs.TabPanel>
      </Tabs>

      {/* New Booking Dialog */}
      <Dialog
        open={showNewBooking}
        onOpenChange={setShowNewBooking}
        closeButton
        size="medium"
      >
        {({ close }) => (
          <>
            <Dialog.Title>New Booking</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  required
                  value={newCustomer}
                  onChange={setNewCustomer}
                />
                <TextField
                  label="Customer Email"
                  type="email"
                  value={newEmail}
                  onChange={setNewEmail}
                />
                <Select
                  label="Venue"
                  selectedKey={newVenue || null}
                  onSelectionChange={k => setNewVenue(String(k))}
                >
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker
                  label="Date"
                  value={newDate ?? undefined}
                  onChange={val => setNewDate(val ?? null)}
                />
                <Select
                  label="Time Slot"
                  selectedKey={newTimeSlot || null}
                  onSelectionChange={k => setNewTimeSlot(String(k))}
                >
                  {TIME_SLOTS.map(t => (
                    <Select.Option key={t} id={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  value={newNotes}
                  onChange={setNewNotes}
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" onPress={() => submitNewBooking(close)}>
                Create Booking
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog
        open={!!editBooking}
        onOpenChange={isOpen => { if (!isOpen) setEditBooking(null); }}
        closeButton
        size="medium"
      >
        {({ close }) => (
          <>
            <Dialog.Title>Edit Booking {editBooking?.id}</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  required
                  value={editCustomer}
                  onChange={setEditCustomer}
                />
                <TextField
                  label="Customer Email"
                  type="email"
                  value={editEmail}
                  onChange={setEditEmail}
                />
                <Select
                  label="Venue"
                  selectedKey={editVenue || null}
                  onSelectionChange={k => setEditVenue(String(k))}
                >
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  label="Time Slot"
                  selectedKey={editTimeSlot || null}
                  onSelectionChange={k => setEditTimeSlot(String(k))}
                >
                  {TIME_SLOTS.map(t => (
                    <Select.Option key={t} id={t}>
                      {t}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  value={editNotes}
                  onChange={setEditNotes}
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" onPress={() => submitEdit(close)}>
                Save Changes
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Detail Drawer */}
      {detailBooking && (
        <Drawer
          open={!!detailBooking}
          onOpenChange={isOpen => { if (!isOpen) setDetailBooking(null); }}
          closeButton
          size="medium"
        >
          <Drawer.Title>Booking {detailBooking.id}</Drawer.Title>
          <Drawer.Content>
            <Stack space={4}>
              <Inline space={2} alignY="center">
                <Text weight="bold">Status</Text>
                <Badge variant={statusVariant(detailBooking.status)}>
                  {detailBooking.status}
                </Badge>
              </Inline>

              <Stack space={2}>
                <Text weight="bold">Customer Information</Text>
                <Text>{detailBooking.customer}</Text>
                <Text>{detailBooking.email}</Text>
              </Stack>

              <Stack space={2}>
                <Text weight="bold">Venue &amp; Schedule</Text>
                <Text>{detailBooking.venue}</Text>
                <Text>
                  {formatDate(detailBooking.date)} · {detailBooking.timeSlot}
                </Text>
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
                      <Text>
                        Invoice #INV-2026-{detailBooking.id.slice(-3)} — €450.00 — Paid
                      </Text>
                      <Text>
                        Payment received on {formatDate(detailBooking.date)} via credit card.
                      </Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="comms">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>
                        Confirmation email sent to {detailBooking.email}.
                      </Text>
                      <Text>Reminder scheduled 24 hours before event.</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </Drawer.Content>
          <Drawer.Actions>
            <Button onPress={() => setDetailBooking(null)}>Close</Button>
            <Button
              variant="destructive"
              onPress={() => {
                cancelBooking(detailBooking.id);
                setDetailBooking(null);
              }}
            >
              Cancel Booking
            </Button>
          </Drawer.Actions>
        </Drawer>
      )}
    </Stack>
  );
};

export default TestApp;
