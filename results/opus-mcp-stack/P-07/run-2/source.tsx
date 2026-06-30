import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  Autocomplete,
  Badge,
  Button,
  DatePicker,
  Dialog,
  Drawer,
  Form,
  Headline,
  Inline,
  Inset,
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

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

// Fixed "today" so the relative-date tabs stay deterministic for the demo.
const TODAY = '2026-06-27';
const WEEK_END = '2026-07-03'; // TODAY .. TODAY + 6 days (inclusive)

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string; // YYYY-MM-DD
  slot: string;
  status: Status;
  notes?: string;
}

const STATUS_VARIANT: Record<Status, 'success' | 'warning' | 'default'> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'default',
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    slot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual shareholder meeting. Requires stage setup and A/V.',
  },
  {
    id: 'BK-1002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-27',
    slot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-29',
    slot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled due to weather forecast.',
  },
  {
    id: 'BK-1004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-30',
    slot: '18:00-21:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-1005',
    customer: 'Eve Davis',
    email: 'eve@example.com',
    venue: 'Conference Room B',
    date: '2026-07-05',
    slot: '09:00-12:00',
    status: 'Pending',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-07-10',
    slot: '12:00-15:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-1007',
    customer: 'Grace Lee',
    email: 'grace@example.com',
    venue: 'Conference Room A',
    date: '2026-06-27',
    slot: '15:00-18:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-1008',
    customer: 'Henry Wilson',
    email: 'henry@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-28',
    slot: '18:00-21:00',
    status: 'Pending',
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const dateToISO = (d: DateValue): string =>
  `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;

interface BookingForm {
  customer: string;
  email: string;
  venue: string;
  date: DateValue | null;
  slot: string;
  notes: string;
}

const EMPTY_FORM: BookingForm = {
  customer: '',
  email: '',
  venue: '',
  date: null,
  slot: '',
  notes: '',
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [venueQuery, setVenueQuery] = useState('');
  const [venueFilter, setVenueFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Tabs
  const [tab, setTab] = useState<string>('all');

  // Overlays
  const [detail, setDetail] = useState<Booking | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [nextId, setNextId] = useState(1009);

  /* ----------------------------- Filtering ------------------------------- */

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (venueFilter && b.venue !== venueFilter) return false;
    if (dateFilter && dateToISO(dateFilter) !== b.date) return false;
    if (tab === 'today' && b.date !== TODAY) return false;
    if (tab === 'week' && !(b.date >= TODAY && b.date <= WEEK_END)) return false;
    return true;
  });

  const clearFilters = () => {
    setDateFilter(null);
    setVenueQuery('');
    setVenueFilter(null);
    setStatusFilter('all');
  };

  /* ----------------------------- Row actions ----------------------------- */

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (b: Booking) => {
    setEditingId(b.id);
    setForm({
      customer: b.customer,
      email: b.email,
      venue: b.venue,
      date: parseDate(b.date),
      slot: b.slot,
      notes: b.notes ?? '',
    });
    setFormOpen(true);
  };

  const submitForm = (close: () => void) => {
    const dateStr = form.date ? dateToISO(form.date) : TODAY;
    if (editingId) {
      setBookings(prev =>
        prev.map(b =>
          b.id === editingId
            ? {
                ...b,
                customer: form.customer,
                email: form.email,
                venue: form.venue || b.venue,
                date: dateStr,
                slot: form.slot || b.slot,
                notes: form.notes,
              }
            : b
        )
      );
    } else {
      const id = `BK-${nextId}`;
      setNextId(n => n + 1);
      setBookings(prev => [
        {
          id,
          customer: form.customer,
          email: form.email,
          venue: form.venue || VENUES[0],
          date: dateStr,
          slot: form.slot || TIME_SLOTS[0],
          status: 'Pending',
          notes: form.notes,
        },
        ...prev,
      ]);
    }
    close();
  };

  /* ------------------------------- Table --------------------------------- */

  const renderTable = () => (
    <Table aria-label="Bookings" selectionMode="none">
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
        {filtered.map(b => (
          <Table.Row key={b.id} id={b.id}>
            <Table.Cell>{b.id}</Table.Cell>
            <Table.Cell>{b.customer}</Table.Cell>
            <Table.Cell>{b.venue}</Table.Cell>
            <Table.Cell>{b.date}</Table.Cell>
            <Table.Cell>{b.slot}</Table.Cell>
            <Table.Cell>
              <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu variant="ghost" aria-label={`Actions for ${b.id}`}>
                <Menu.Item id="view" onAction={() => setDetail(b)}>
                  View Details
                </Menu.Item>
                <Menu.Item id="edit" onAction={() => openEdit(b)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  id="cancel"
                  variant="destructive"
                  onAction={() => cancelBooking(b.id)}
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

  /* ------------------------------- Render -------------------------------- */

  return (
    <Inset space={6}>
      <Stack space={6}>
        <Inline alignX="between" alignY="center" space={4}>
          <Stack space={1}>
            <Headline level={1}>Booking Management</Headline>
            <Text>Manage venue rentals, availability and customer bookings.</Text>
          </Stack>
          <Button variant="primary" onPress={openNew}>
            New Booking
          </Button>
        </Inline>

        {/* Filter bar */}
        <Inline space={4} alignY="end">
          <DatePicker
            label="Date"
            value={dateFilter}
            onChange={value => setDateFilter(value)}
          />
          <Autocomplete
            label="Venue"
            menuTrigger="focus"
            value={venueQuery}
            onChange={value => {
              setVenueQuery(value);
              if (!value) setVenueFilter(null);
            }}
            onSubmit={(key: unknown) =>
              setVenueFilter(key ? String(key) : null)
            }
          >
            {VENUES.map(v => (
              <Autocomplete.Option key={v} id={v}>
                {v}
              </Autocomplete.Option>
            ))}
          </Autocomplete>
          <Select
            label="Status"
            selectedKey={statusFilter}
            onSelectionChange={key => setStatusFilter(String(key))}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button variant="secondary" onPress={clearFilters}>
            Clear Filters
          </Button>
        </Inline>

        {/* Capacity alert */}
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity alert</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only 2 slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>

        {/* Tabs + table */}
        <Tabs
          aria-label="Booking views"
          selectedKey={tab}
          onSelectionChange={key => setTab(String(key))}
        >
          <Tabs.List aria-label="Booking views">
            <Tabs.Item id="all">All Bookings</Tabs.Item>
            <Tabs.Item id="today">Today</Tabs.Item>
            <Tabs.Item id="week">This Week</Tabs.Item>
          </Tabs.List>
          <Tabs.TabPanel id="all">{renderTable()}</Tabs.TabPanel>
          <Tabs.TabPanel id="today">{renderTable()}</Tabs.TabPanel>
          <Tabs.TabPanel id="week">{renderTable()}</Tabs.TabPanel>
        </Tabs>
      </Stack>

      {/* New / Edit booking dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen} closeButton size="medium">
        {({ close }: { close: () => void }) => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              submitForm(close);
            }}
          >
            <Dialog.Title>
              {editingId ? `Edit ${editingId}` : 'New Booking'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Customer Name"
                  name="customer"
                  required
                  value={form.customer}
                  onChange={value => setForm(f => ({ ...f, customer: value }))}
                />
                <TextField
                  label="Customer Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={value => setForm(f => ({ ...f, email: value }))}
                />
                <Select
                  label="Venue"
                  selectedKey={form.venue || null}
                  onSelectionChange={key =>
                    setForm(f => ({ ...f, venue: String(key) }))
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
                  value={form.date}
                  onChange={value => setForm(f => ({ ...f, date: value }))}
                />
                <Select
                  label="Time Slot"
                  selectedKey={form.slot || null}
                  onSelectionChange={key =>
                    setForm(f => ({ ...f, slot: String(key) }))
                  }
                >
                  {TIME_SLOTS.map(s => (
                    <Select.Option key={s} id={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  name="notes"
                  value={form.notes}
                  onChange={value => setForm(f => ({ ...f, notes: value }))}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingId ? 'Save Changes' : 'Create Booking'}
              </Button>
            </Dialog.Actions>
          </Form>
        )}
      </Dialog>

      {/* Detail panel */}
      <Drawer
        open={!!detail}
        onOpenChange={open => {
          if (!open) setDetail(null);
        }}
      >
        <Drawer.Title>Booking Details</Drawer.Title>
        <Drawer.Content>
          {detail && (
            <Stack space={5}>
              <Inline space={3} alignY="center">
                <Text weight="bold">{detail.id}</Text>
                <Badge variant={STATUS_VARIANT[detail.status]}>
                  {detail.status}
                </Badge>
              </Inline>

              <Stack space={1}>
                <Text weight="bold">Customer</Text>
                <Text>{detail.customer}</Text>
                <Text>{detail.email || '—'}</Text>
              </Stack>

              <Stack space={1}>
                <Text weight="bold">Venue &amp; Schedule</Text>
                <Text>{detail.venue}</Text>
                <Text>
                  {detail.date} · {detail.slot}
                </Text>
              </Stack>

              <Stack space={1}>
                <Text weight="bold">Notes</Text>
                <Text>{detail.notes || 'No notes provided.'}</Text>
              </Stack>

              <Accordion>
                <Accordion.Item id="payment">
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    No payments have been recorded for this booking yet.
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="communication">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    No messages have been exchanged with this customer yet.
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          )}
        </Drawer.Content>
        <Drawer.Actions>
          <Button slot="close" variant="secondary">
            Close
          </Button>
        </Drawer.Actions>
      </Drawer>
    </Inset>
  );
};

export default TestApp;
