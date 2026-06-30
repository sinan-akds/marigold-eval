import { useState } from 'react';
import { CalendarDate } from '@internationalized/date';
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
  Drawer,
  Form,
  Headline,
  Inline,
  Inset,
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

/* ------------------------------------------------------------------ */
/* Reference data                                                      */
/* ------------------------------------------------------------------ */

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const STATUS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'pending', label: 'Pending' },
  { id: 'cancelled', label: 'Cancelled' },
];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Fixed "today" so the Today / This Week tabs always have data to show.
const TODAY = new CalendarDate(2026, 6, 27);
const WEEK_START = new CalendarDate(2026, 6, 22);
const WEEK_END = new CalendarDate(2026, 6, 28);

const MAIN_HALL_DAILY_SLOTS = 4;

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: CalendarDate;
  slot: string;
  status: Status;
  notes: string;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customer: 'Anna Müller',
    email: 'anna.mueller@example.com',
    venue: 'Main Hall',
    date: new CalendarDate(2026, 6, 27),
    slot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual shareholder meeting. Requires podium and microphones.',
  },
  {
    id: 'BK-1002',
    customer: 'Tom Becker',
    email: 'tom.becker@example.com',
    venue: 'Conference Room A',
    date: new CalendarDate(2026, 6, 27),
    slot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Sara Klein',
    email: 'sara.klein@example.com',
    venue: 'Rooftop Terrace',
    date: new CalendarDate(2026, 6, 24),
    slot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Cancelled due to weather forecast.',
  },
  {
    id: 'BK-1004',
    customer: 'Jonas Weber',
    email: 'jonas.weber@example.com',
    venue: 'Workshop Studio',
    date: new CalendarDate(2026, 6, 28),
    slot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Pottery workshop, 12 participants.',
  },
  {
    id: 'BK-1005',
    customer: 'Lena Hofmann',
    email: 'lena.hofmann@example.com',
    venue: 'Conference Room B',
    date: new CalendarDate(2026, 7, 10),
    slot: '09:00-12:00',
    status: 'Pending',
    notes: 'Quarterly product review.',
  },
  {
    id: 'BK-1006',
    customer: 'Markus Schmidt',
    email: 'markus.schmidt@example.com',
    venue: 'Main Hall',
    date: new CalendarDate(2026, 6, 15),
    slot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Charity gala dinner.',
  },
  {
    id: 'BK-1007',
    customer: 'Petra Vogel',
    email: 'petra.vogel@example.com',
    venue: 'Main Hall',
    date: new CalendarDate(2026, 6, 27),
    slot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Corporate training session.',
  },
  {
    id: 'BK-1008',
    customer: 'David Fischer',
    email: 'david.fischer@example.com',
    venue: 'Rooftop Terrace',
    date: new CalendarDate(2026, 7, 5),
    slot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Customer requested a refund.',
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatDate = (d: CalendarDate) =>
  `${MONTHS[d.month - 1]} ${d.day}, ${d.year}`;

const statusVariant = (s: Status): 'success' | 'warning' | 'default' =>
  s === 'Confirmed' ? 'success' : s === 'Pending' ? 'warning' : 'default';

const isToday = (d: CalendarDate) => d.compare(TODAY) === 0;

const isThisWeek = (d: CalendarDate) =>
  d.compare(WEEK_START) >= 0 && d.compare(WEEK_END) <= 0;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [venueFilter, setVenueFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // View tab
  const [tab, setTab] = useState('all');

  // New / edit booking dialog
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fVenue, setFVenue] = useState<string | null>(null);
  const [fDate, setFDate] = useState<DateValue | null>(null);
  const [fSlot, setFSlot] = useState<string | null>(null);
  const [fNotes, setFNotes] = useState('');

  // Detail drawer
  const [detail, setDetail] = useState<Booking | null>(null);

  /* ---------- derived data ---------- */

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status.toLowerCase() !== statusFilter) {
      return false;
    }
    if (
      venueFilter.trim() &&
      !b.venue.toLowerCase().includes(venueFilter.trim().toLowerCase())
    ) {
      return false;
    }
    if (dateFilter && b.date.compare(dateFilter) !== 0) {
      return false;
    }
    return true;
  });

  const byTab = (current: string) =>
    filtered.filter(b =>
      current === 'today'
        ? isToday(b.date)
        : current === 'week'
          ? isThisWeek(b.date)
          : true
    );

  const mainHallTodayUsed = bookings.filter(
    b =>
      b.venue === 'Main Hall' &&
      b.date.compare(TODAY) === 0 &&
      b.status !== 'Cancelled'
  ).length;
  const mainHallRemaining = MAIN_HALL_DAILY_SLOTS - mainHallTodayUsed;
  const showCapacityAlert = mainHallRemaining > 0 && mainHallRemaining <= 2;

  /* ---------- actions ---------- */

  const clearFilters = () => {
    setDateFilter(null);
    setVenueFilter('');
    setStatusFilter('all');
  };

  const resetForm = () => {
    setFName('');
    setFEmail('');
    setFVenue(null);
    setFDate(null);
    setFSlot(null);
    setFNotes('');
  };

  const openCreate = () => {
    resetForm();
    setFormMode('create');
    setEditingId(null);
    setFormOpen(true);
  };

  const openEdit = (b: Booking) => {
    setFName(b.customer);
    setFEmail(b.email);
    setFVenue(b.venue);
    setFDate(new CalendarDate(b.date.year, b.date.month, b.date.day));
    setFSlot(b.slot);
    setFNotes(b.notes);
    setFormMode('edit');
    setEditingId(b.id);
    setFormOpen(true);
  };

  const cancelBooking = (id: string) =>
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fName.trim()) return;

    const date = fDate
      ? new CalendarDate(fDate.year, fDate.month, fDate.day)
      : TODAY;

    if (formMode === 'edit' && editingId) {
      setBookings(prev =>
        prev.map(b =>
          b.id === editingId
            ? {
                ...b,
                customer: fName.trim(),
                email: fEmail.trim(),
                venue: fVenue ?? b.venue,
                date,
                slot: fSlot ?? b.slot,
                notes: fNotes,
              }
            : b
        )
      );
    } else {
      const nextNum = 1000 + bookings.length + 1;
      setBookings(prev => [
        {
          id: `BK-${nextNum}`,
          customer: fName.trim(),
          email: fEmail.trim(),
          venue: fVenue ?? VENUES[0],
          date,
          slot: fSlot ?? SLOTS[0],
          status: 'Pending',
          notes: fNotes,
        },
        ...prev,
      ]);
    }
    setFormOpen(false);
  };

  /* ---------- table renderer ---------- */

  const renderTable = (rows: Booking[]) =>
    rows.length === 0 ? (
      <SectionMessage variant="info">
        <SectionMessage.Title>No bookings</SectionMessage.Title>
        <SectionMessage.Content>
          No bookings match the current filters.
        </SectionMessage.Content>
      </SectionMessage>
    ) : (
      <Scrollable>
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
          {rows.map(b => (
            <Table.Row key={b.id} id={b.id}>
              <Table.Cell>{b.id}</Table.Cell>
              <Table.Cell>{b.customer}</Table.Cell>
              <Table.Cell>{b.venue}</Table.Cell>
              <Table.Cell>{formatDate(b.date)}</Table.Cell>
              <Table.Cell>{b.slot}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
              </Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label={`Actions for booking ${b.id}`}>
                  <ActionMenu.Item id="view" onAction={() => setDetail(b)}>
                    View Details
                  </ActionMenu.Item>
                  <ActionMenu.Item id="edit" onAction={() => openEdit(b)}>
                    Edit
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="cancel"
                    variant="destructive"
                    onAction={() => cancelBooking(b.id)}
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

  /* ---------- render ---------- */

  return (
    <Inset space={6}>
      <Stack space={6}>
        <Inline alignX="between" alignY="center" space={4}>
          <Headline level={1}>Booking Management</Headline>
          <Button variant="primary" onPress={openCreate}>
            New Booking
          </Button>
        </Inline>

        {/* Filter bar */}
        <Columns columns={[1, 1, 1, 'fit']} space={4} collapseAt="48em">
          <DatePicker
            label="Date"
            value={dateFilter}
            onChange={setDateFilter}
          />
          <Autocomplete
            label="Venue"
            value={venueFilter}
            onChange={setVenueFilter}
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
            {STATUS_OPTIONS.map(opt => (
              <Select.Option key={opt.id} id={opt.id}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
          <Stack space={0} alignX="left">
            <Text>&nbsp;</Text>
            <Button variant="secondary" onPress={clearFilters}>
              Clear Filters
            </Button>
          </Stack>
        </Columns>

        {/* Capacity alert */}
        {showCapacityAlert ? (
          <SectionMessage variant="warning">
            <SectionMessage.Title>Capacity warning</SectionMessage.Title>
            <SectionMessage.Content>
              Main Hall has only {mainHallRemaining} slot
              {mainHallRemaining === 1 ? '' : 's'} remaining for today.
            </SectionMessage.Content>
          </SectionMessage>
        ) : null}

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
          <Tabs.TabPanel id="all">{renderTable(byTab('all'))}</Tabs.TabPanel>
          <Tabs.TabPanel id="today">
            {renderTable(byTab('today'))}
          </Tabs.TabPanel>
          <Tabs.TabPanel id="week">{renderTable(byTab('week'))}</Tabs.TabPanel>
        </Tabs>
      </Stack>

      {/* New / edit booking dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={setFormOpen}
        size="medium"
        closeButton
      >
        <Dialog.Title>
          {formMode === 'edit' ? 'Edit Booking' : 'New Booking'}
        </Dialog.Title>
        <Dialog.Content>
          <Form onSubmit={handleSubmit}>
            <Stack space={4}>
              <TextField
                label="Customer Name"
                value={fName}
                onChange={setFName}
                required
              />
              <TextField
                label="Customer Email"
                type="email"
                value={fEmail}
                onChange={setFEmail}
              />
              <Select
                label="Venue"
                placeholder="Select a venue"
                selectedKey={fVenue}
                onSelectionChange={key => setFVenue(String(key))}
              >
                {VENUES.map(v => (
                  <Select.Option key={v} id={v}>
                    {v}
                  </Select.Option>
                ))}
              </Select>
              <DatePicker label="Date" value={fDate} onChange={setFDate} />
              <Select
                label="Time Slot"
                placeholder="Select a time slot"
                selectedKey={fSlot}
                onSelectionChange={key => setFSlot(String(key))}
              >
                {SLOTS.map(s => (
                  <Select.Option key={s} id={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
              <TextArea
                label="Notes"
                value={fNotes}
                onChange={setFNotes}
                rows={3}
              />
              <Inline space={2}>
                <Button type="submit" variant="primary">
                  {formMode === 'edit' ? 'Save Changes' : 'Create Booking'}
                </Button>
                <Button
                  variant="secondary"
                  onPress={() => setFormOpen(false)}
                >
                  Cancel
                </Button>
              </Inline>
            </Stack>
          </Form>
        </Dialog.Content>
      </Dialog>

      {/* Detail drawer */}
      <Drawer.Trigger
        open={detail !== null}
        onOpenChange={open => {
          if (!open) setDetail(null);
        }}
      >
        <Drawer closeButton>
          <Drawer.Title>Booking Details</Drawer.Title>
          <Drawer.Content>
            {detail ? (
              <Stack space={5}>
                <Inline space={3} alignY="center">
                  <Text weight="bold" fontSize="lg">
                    {detail.id}
                  </Text>
                  <Badge variant={statusVariant(detail.status)}>
                    {detail.status}
                  </Badge>
                </Inline>

                <Divider />

                <Stack space={2}>
                  <Headline level={4}>Customer</Headline>
                  <Text>{detail.customer}</Text>
                  <Text variant="muted">{detail.email}</Text>
                </Stack>

                <Stack space={2}>
                  <Headline level={4}>Venue &amp; Schedule</Headline>
                  <Text>{detail.venue}</Text>
                  <Text variant="muted">
                    {formatDate(detail.date)} · {detail.slot}
                  </Text>
                </Stack>

                <Stack space={2}>
                  <Headline level={4}>Notes</Headline>
                  <Text>{detail.notes || 'No notes for this booking.'}</Text>
                </Stack>

                <Accordion allowsMultipleExpanded>
                  <Accordion.Item id="payment">
                    <Accordion.Header>Payment History</Accordion.Header>
                    <Accordion.Content>
                      <Text variant="muted">
                        No payments have been recorded for this booking yet.
                      </Text>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="communication">
                    <Accordion.Header>Communication Log</Accordion.Header>
                    <Accordion.Content>
                      <Text variant="muted">
                        No messages have been exchanged with this customer yet.
                      </Text>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
              </Stack>
            ) : null}
          </Drawer.Content>
          <Drawer.Actions>
            <Button slot="close" variant="secondary">
              Close
            </Button>
          </Drawer.Actions>
        </Drawer>
      </Drawer.Trigger>
    </Inset>
  );
};

export default TestApp;
