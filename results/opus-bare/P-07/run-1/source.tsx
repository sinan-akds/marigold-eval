import { useMemo, useState } from 'react';
import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  Badge,
  Box,
  Button,
  ComboBox,
  DatePicker,
  Dialog,
  Divider,
  Headline,
  Inline,
  Menu,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const STATUS_OPTIONS = ['All', 'Confirmed', 'Pending', 'Cancelled'];

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string; // ISO yyyy-mm-dd
  slot: string;
  status: Status;
  notes: string;
}

// Date helpers (kept as ISO strings so we can compare lexicographically)
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (base: Date, n: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const NOW = new Date();
const TODAY_ISO = toISO(NOW);
const WEEK_END_ISO = toISO(addDays(NOW, 6));

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: TODAY_ISO,
    slot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'VIP client, requires stage setup.',
  },
  {
    id: 'BK-1002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: TODAY_ISO,
    slot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: toISO(addDays(NOW, 2)),
    slot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled due to weather forecast.',
  },
  {
    id: 'BK-1004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: toISO(addDays(NOW, 4)),
    slot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Pottery workshop for 12 attendees.',
  },
  {
    id: 'BK-1005',
    customer: 'Eve Davis',
    email: 'eve@example.com',
    venue: 'Conference Room B',
    date: toISO(addDays(NOW, 10)),
    slot: '09:00-12:00',
    status: 'Pending',
    notes: 'Quarterly board meeting.',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: toISO(addDays(NOW, 1)),
    slot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Product launch event.',
  },
];

const STATUS_VARIANT: Record<Status, string> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'neutral',
};

const StatusBadge = ({ status }: { status: Status }) => (
  <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filter state
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [venueFilter, setVenueFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // New / edit booking dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fCustomer, setFCustomer] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fVenue, setFVenue] = useState<string | null>(null);
  const [fDate, setFDate] = useState<DateValue | null>(null);
  const [fSlot, setFSlot] = useState<string | null>(null);
  const [fNotes, setFNotes] = useState('');

  // Detail panel state
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  // -------------------------------------------------------------------------
  // Filtering
  // -------------------------------------------------------------------------
  const filterForTab = (tab: string) =>
    bookings.filter((b) => {
      if (tab === 'today' && b.date !== TODAY_ISO) return false;
      if (tab === 'week' && !(b.date >= TODAY_ISO && b.date <= WEEK_END_ISO))
        return false;
      if (dateFilter && b.date !== dateFilter.toString()) return false;
      if (venueFilter && b.venue !== venueFilter) return false;
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      return true;
    });

  const clearFilters = () => {
    setDateFilter(null);
    setVenueFilter(null);
    setStatusFilter('All');
  };

  // -------------------------------------------------------------------------
  // Capacity alert (Main Hall, today)
  // -------------------------------------------------------------------------
  const mainHallRemaining = useMemo(() => {
    const used = bookings.filter(
      (b) =>
        b.venue === 'Main Hall' &&
        b.date === TODAY_ISO &&
        b.status !== 'Cancelled',
    ).length;
    return TIME_SLOTS.length - used;
  }, [bookings]);

  // -------------------------------------------------------------------------
  // Dialog helpers
  // -------------------------------------------------------------------------
  const resetForm = () => {
    setFCustomer('');
    setFEmail('');
    setFVenue(null);
    setFDate(null);
    setFSlot(null);
    setFNotes('');
  };

  const openNew = () => {
    setEditingId(null);
    resetForm();
  };

  const openEdit = (b: Booking) => {
    setEditingId(b.id);
    setFCustomer(b.customer);
    setFEmail(b.email);
    setFVenue(b.venue);
    try {
      setFDate(parseDate(b.date));
    } catch {
      setFDate(null);
    }
    setFSlot(b.slot);
    setFNotes(b.notes);
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!fCustomer.trim()) return;
    if (editingId) {
      setBookings((bs) =>
        bs.map((b) =>
          b.id === editingId
            ? {
                ...b,
                customer: fCustomer,
                email: fEmail,
                venue: fVenue ?? b.venue,
                date: fDate ? fDate.toString() : b.date,
                slot: fSlot ?? b.slot,
                notes: fNotes,
              }
            : b,
        ),
      );
    } else {
      const newBooking: Booking = {
        id: `BK-${1000 + bookings.length + 1}`,
        customer: fCustomer,
        email: fEmail,
        venue: fVenue ?? VENUES[0],
        date: fDate ? fDate.toString() : TODAY_ISO,
        slot: fSlot ?? TIME_SLOTS[0],
        status: 'Pending',
        notes: fNotes,
      };
      setBookings((bs) => [...bs, newBooking]);
    }
  };

  const handleRowAction = (key: string, booking: Booking) => {
    if (key === 'view') {
      setDetailBooking(booking);
    } else if (key === 'edit') {
      openEdit(booking);
    } else if (key === 'cancel') {
      setBookings((bs) =>
        bs.map((b) =>
          b.id === booking.id ? { ...b, status: 'Cancelled' } : b,
        ),
      );
      setDetailBooking((d) =>
        d && d.id === booking.id ? { ...d, status: 'Cancelled' } : d,
      );
    }
  };

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  const renderTable = (tab: string) => {
    const rows = filterForTab(tab);
    return (
      <Table aria-label="Bookings" variant="default">
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
          {rows.map((b) => (
            <Table.Row key={b.id} id={b.id}>
              <Table.Cell>{b.id}</Table.Cell>
              <Table.Cell>{b.customer}</Table.Cell>
              <Table.Cell>{b.venue}</Table.Cell>
              <Table.Cell>{b.date}</Table.Cell>
              <Table.Cell>{b.slot}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={b.status} />
              </Table.Cell>
              <Table.Cell>
                <Menu
                  label="…"
                  onAction={(key) => handleRowAction(String(key), b)}
                >
                  <Menu.Item key="view" id="view">
                    View Details
                  </Menu.Item>
                  <Menu.Item key="edit" id="edit">
                    Edit
                  </Menu.Item>
                  <Menu.Item key="cancel" id="cancel">
                    Cancel Booking
                  </Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <Box css={{ padding: 32 }}>
      <Stack space={6}>
        <Headline level={1}>Booking Management</Headline>

        {/* Filter bar ------------------------------------------------------ */}
        <Inline space={4} alignY="bottom">
          <Box css={{ width: 200 }}>
            <DatePicker
              label="Date"
              value={dateFilter}
              onChange={setDateFilter}
            />
          </Box>
          <Box css={{ width: 240 }}>
            <ComboBox
              label="Venue"
              selectedKey={venueFilter}
              onSelectionChange={(key) =>
                setVenueFilter(key === null ? null : String(key))
              }
            >
              {VENUES.map((v) => (
                <ComboBox.Option key={v} id={v}>
                  {v}
                </ComboBox.Option>
              ))}
            </ComboBox>
          </Box>
          <Box css={{ width: 200 }}>
            <Select
              label="Status"
              selectedKey={statusFilter}
              onSelectionChange={(key) => setStatusFilter(String(key))}
            >
              {STATUS_OPTIONS.map((s) => (
                <Select.Option key={s} id={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </Box>
          <Button variant="secondary" onPress={clearFilters}>
            Clear Filters
          </Button>
        </Inline>

        {/* Capacity alert -------------------------------------------------- */}
        {mainHallRemaining > 0 && mainHallRemaining <= 2 && (
          <Box
            css={{
              backgroundColor: '#FFF4E5',
              border: '1px solid #FFB74D',
              borderRadius: 6,
              padding: 16,
            }}
          >
            <Text>
              ⚠️ Main Hall has only {mainHallRemaining} slots remaining for
              today.
            </Text>
          </Box>
        )}

        {/* New booking ----------------------------------------------------- */}
        <Inline space={4} alignY="center">
          <Dialog.Trigger isOpen={formOpen} onOpenChange={setFormOpen}>
            <Button variant="primary" onPress={openNew}>
              New Booking
            </Button>
            <Dialog closeButton aria-label="Booking form">
              {({ close }: { close: () => void }) => (
                <Stack space={4}>
                  <Headline level={2}>
                    {editingId ? 'Edit Booking' : 'New Booking'}
                  </Headline>
                  <TextField
                    label="Customer Name"
                    value={fCustomer}
                    onChange={setFCustomer}
                    isRequired
                  />
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={fEmail}
                    onChange={setFEmail}
                  />
                  <Select
                    label="Venue"
                    selectedKey={fVenue}
                    onSelectionChange={(key) => setFVenue(String(key))}
                  >
                    {VENUES.map((v) => (
                      <Select.Option key={v} id={v}>
                        {v}
                      </Select.Option>
                    ))}
                  </Select>
                  <DatePicker label="Date" value={fDate} onChange={setFDate} />
                  <Select
                    label="Time Slot"
                    selectedKey={fSlot}
                    onSelectionChange={(key) => setFSlot(String(key))}
                  >
                    {TIME_SLOTS.map((s) => (
                      <Select.Option key={s} id={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                  <TextArea
                    label="Notes"
                    value={fNotes}
                    onChange={setFNotes}
                  />
                  <Inline space={4} alignY="center">
                    <Button
                      variant="primary"
                      isDisabled={!fCustomer.trim()}
                      onPress={() => {
                        handleSubmit();
                        close();
                      }}
                    >
                      {editingId ? 'Save Changes' : 'Create Booking'}
                    </Button>
                    <Button variant="secondary" onPress={close}>
                      Cancel
                    </Button>
                  </Inline>
                </Stack>
              )}
            </Dialog>
          </Dialog.Trigger>
        </Inline>

        {/* Tabs + table ---------------------------------------------------- */}
        <Tabs aria-label="Booking views">
          <Tabs.List>
            <Tabs.Item key="all" id="all">
              All Bookings
            </Tabs.Item>
            <Tabs.Item key="today" id="today">
              Today
            </Tabs.Item>
            <Tabs.Item key="week" id="week">
              This Week
            </Tabs.Item>
          </Tabs.List>
          <Tabs.TabPanel key="all" id="all">
            {renderTable('all')}
          </Tabs.TabPanel>
          <Tabs.TabPanel key="today" id="today">
            {renderTable('today')}
          </Tabs.TabPanel>
          <Tabs.TabPanel key="week" id="week">
            {renderTable('week')}
          </Tabs.TabPanel>
        </Tabs>
      </Stack>

      {/* Detail panel ------------------------------------------------------ */}
      {detailBooking && (
        <Box
          css={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: 400,
            maxWidth: '90vw',
            backgroundColor: '#ffffff',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
            padding: 24,
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <Stack space={5}>
            <Inline space={4} alignY="center">
              <Headline level={2}>Booking Details</Headline>
            </Inline>

            <Inline space={3} alignY="center">
              <Text weight="bold">{detailBooking.id}</Text>
              <StatusBadge status={detailBooking.status} />
            </Inline>

            <Divider />

            <Stack space={2}>
              <Headline level={4}>Customer</Headline>
              <Text>{detailBooking.customer}</Text>
              <Text>{detailBooking.email}</Text>
            </Stack>

            <Stack space={2}>
              <Headline level={4}>Venue &amp; Schedule</Headline>
              <Text>{detailBooking.venue}</Text>
              <Text>
                {detailBooking.date} · {detailBooking.slot}
              </Text>
            </Stack>

            <Stack space={2}>
              <Headline level={4}>Notes</Headline>
              <Text>{detailBooking.notes || 'No notes provided.'}</Text>
            </Stack>

            <Divider />

            <Accordion>
              <Accordion.Item key="payment" id="payment" title="Payment History">
                <Text>
                  No payments recorded yet. A deposit invoice will appear here
                  once issued.
                </Text>
              </Accordion.Item>
              <Accordion.Item
                key="comm"
                id="comm"
                title="Communication Log"
              >
                <Text>
                  No messages logged yet. Customer correspondence will be
                  tracked here.
                </Text>
              </Accordion.Item>
            </Accordion>

            <Inline space={4} alignY="center">
              <Button
                variant="primary"
                onPress={() => {
                  openEdit(detailBooking);
                  setDetailBooking(null);
                }}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                onPress={() => setDetailBooking(null)}
              >
                Close
              </Button>
            </Inline>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TestApp;
