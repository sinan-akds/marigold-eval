import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  Badge,
  Button,
  ComboBox,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  Form,
  Headline,
  Inline,
  Menu,
  SectionMessage,
  Select,
  Stack,
  Table,
  Tabs,
  TextArea,
  TextField,
  Text,
} from '@marigold/components';

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

const STATUS_VARIANT: Record<Status, 'success' | 'warning' | 'default'> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'default',
};

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string; // ISO YYYY-MM-DD
  timeSlot: string;
  status: Status;
  notes: string;
}

// The current date is fixed so the "Today" / "This Week" views and the
// capacity alert are deterministic.
const TODAY = '2026-06-27'; // Saturday
const WEEK_START = '2026-06-22'; // Monday
const WEEK_END = '2026-06-28'; // Sunday

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual shareholder meeting. Requires podium and projector.',
  },
  {
    id: 'BK-1002',
    customer: 'Bob Martin',
    email: 'bob.martin@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carla Reyes',
    email: 'carla.reyes@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Customer cancelled due to scheduling conflict.',
  },
  {
    id: 'BK-1004',
    customer: 'David Smith',
    email: 'dsmith@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-28',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Evening reception, catering arranged externally.',
  },
  {
    id: 'BK-1005',
    customer: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    venue: 'Workshop Studio',
    date: '2026-07-05',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Hands-on pottery workshop, max 20 attendees.',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Chen',
    email: 'frank.chen@example.com',
    venue: 'Conference Room B',
    date: '2026-06-15',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Quarterly board review.',
  },
  {
    id: 'BK-1007',
    customer: 'Grace Lee',
    email: 'grace.lee@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-23',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch photoshoot.',
  },
];

const TABS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
];

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [venueFilter, setVenueFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tab, setTab] = useState<string>('all');

  // Overlays
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [detail, setDetail] = useState<Booking | null>(null);

  const clearFilters = () => {
    setDateFilter(null);
    setVenueFilter(null);
    setStatusFilter('all');
  };

  const filtered = bookings.filter(b => {
    if (dateFilter && b.date !== dateFilter.toString()) return false;
    if (venueFilter && b.venue !== venueFilter) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (tab === 'today' && b.date !== TODAY) return false;
    if (tab === 'week' && !(b.date >= WEEK_START && b.date <= WEEK_END))
      return false;
    return true;
  });

  // Capacity: 4 slots per venue per day. Count active (non-cancelled) bookings
  // for Main Hall today to derive remaining slots.
  const mainHallToday = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'Cancelled'
  ).length;
  const slotsRemaining = Math.max(0, TIME_SLOTS.length - mainHallToday);

  const handleSave = (data: Record<string, FormDataEntryValue>) => {
    const next: Booking = {
      id: editing ? editing.id : `BK-${1001 + bookings.length}`,
      customer: String(data.customer ?? ''),
      email: String(data.email ?? ''),
      venue: String(data.venue ?? ''),
      date: String(data.date ?? ''),
      timeSlot: String(data.timeSlot ?? ''),
      status: editing ? editing.status : 'Pending',
      notes: String(data.notes ?? ''),
    };

    if (editing) {
      setBookings(prev => prev.map(b => (b.id === editing.id ? next : b)));
    } else {
      setBookings(prev => [...prev, next]);
    }
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (booking: Booking) => {
    setEditing(booking);
    setFormOpen(true);
  };

  const renderTable = () => (
    <Table aria-label="Bookings" size="compact">
      <Table.Header>
        <Table.Column rowHeader>Booking ID</Table.Column>
        <Table.Column>Customer</Table.Column>
        <Table.Column>Venue</Table.Column>
        <Table.Column>Date</Table.Column>
        <Table.Column>Time Slot</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body items={filtered}>
        {(b: Booking) => (
          <Table.Row key={b.id}>
            <Table.Cell>{b.id}</Table.Cell>
            <Table.Cell>{b.customer}</Table.Cell>
            <Table.Cell>{b.venue}</Table.Cell>
            <Table.Cell>{b.date}</Table.Cell>
            <Table.Cell>{b.timeSlot}</Table.Cell>
            <Table.Cell>
              <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu aria-label={`Actions for ${b.id}`} variant="ghost">
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
        )}
      </Table.Body>
    </Table>
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Booking Management</Headline>

      {/* Filter bar */}
      <Inline space={4} alignY="bottom">
        <DatePicker
          label="Date"
          value={dateFilter}
          onChange={setDateFilter}
        />
        <ComboBox
          label="Venue"
          placeholder="Search venues"
          menuTrigger="focus"
          selectedKey={venueFilter}
          onSelectionChange={key => setVenueFilter(key ? String(key) : null)}
        >
          {VENUES.map(v => (
            <ComboBox.Option key={v} id={v}>
              {v}
            </ComboBox.Option>
          ))}
        </ComboBox>
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
      {slotsRemaining <= 2 && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity warning</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only {slotsRemaining} slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      {/* New booking action */}
      <Inline space={4} alignX="between" alignY="center">
        <Headline level={2}>Bookings</Headline>
        <Button variant="primary" onPress={openCreate}>
          New Booking
        </Button>
      </Inline>

      {/* Tabs + table */}
      <Tabs
        aria-label="Booking views"
        selectedKey={tab}
        onSelectionChange={key => setTab(String(key))}
      >
        <Tabs.List aria-label="Booking views">
          {TABS.map(t => (
            <Tabs.Item key={t.id} id={t.id}>
              {t.label}
            </Tabs.Item>
          ))}
        </Tabs.List>
        {TABS.map(t => (
          <Tabs.TabPanel key={t.id} id={t.id}>
            {renderTable()}
          </Tabs.TabPanel>
        ))}
      </Tabs>

      {/* New / Edit booking dialog */}
      <Dialog
        size="medium"
        closeButton
        open={formOpen}
        onOpenChange={setFormOpen}
      >
        {({ close }: { close: () => void }) => (
          <>
            <Dialog.Title>
              {editing ? 'Edit Booking' : 'New Booking'}
            </Dialog.Title>
            <Dialog.Content>
              <Form
                key={editing ? editing.id : 'new'}
                onSubmit={e => {
                  e.preventDefault();
                  const data = Object.fromEntries(
                    new FormData(e.currentTarget)
                  );
                  handleSave(data);
                  close();
                }}
              >
                <Stack space={4}>
                  <TextField
                    label="Customer Name"
                    name="customer"
                    required
                    defaultValue={editing?.customer}
                  />
                  <TextField
                    label="Customer Email"
                    name="email"
                    type="email"
                    defaultValue={editing?.email}
                  />
                  <Select
                    label="Venue"
                    name="venue"
                    placeholder="Select a venue"
                    defaultSelectedKey={editing?.venue}
                  >
                    {VENUES.map(v => (
                      <Select.Option key={v} id={v}>
                        {v}
                      </Select.Option>
                    ))}
                  </Select>
                  <DatePicker
                    label="Date"
                    name="date"
                    defaultValue={
                      editing?.date ? parseDate(editing.date) : undefined
                    }
                  />
                  <Select
                    label="Time Slot"
                    name="timeSlot"
                    placeholder="Select a time slot"
                    defaultSelectedKey={editing?.timeSlot}
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
                    rows={3}
                    defaultValue={editing?.notes}
                  />
                  <Inline space={3} alignX="right">
                    <Button variant="secondary" onPress={close}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      {editing ? 'Save Booking' : 'Create Booking'}
                    </Button>
                  </Inline>
                </Stack>
              </Form>
            </Dialog.Content>
          </>
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
                <Headline level={3}>{detail.id}</Headline>
                <Badge variant={STATUS_VARIANT[detail.status]}>
                  {detail.status}
                </Badge>
              </Inline>

              <Stack space={1}>
                <Text weight="bold">Customer</Text>
                <Text>{detail.customer}</Text>
                <Text color="text-secondary">{detail.email}</Text>
              </Stack>

              <Divider />

              <Stack space={1}>
                <Text weight="bold">Venue</Text>
                <Text>{detail.venue}</Text>
              </Stack>
              <Stack space={1}>
                <Text weight="bold">Date &amp; Time</Text>
                <Text>
                  {detail.date} · {detail.timeSlot}
                </Text>
              </Stack>

              <Divider />

              <Stack space={1}>
                <Text weight="bold">Notes</Text>
                <Text>{detail.notes || 'No notes provided.'}</Text>
              </Stack>

              <Accordion>
                <Accordion.Item id="payment">
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Text>
                      No payments recorded yet. Payment activity for this
                      booking will appear here.
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="communication">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Text>
                      No messages yet. Emails and notes exchanged with the
                      customer will appear here.
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          )}
        </Drawer.Content>
        <Drawer.Actions>
          <Button slot="close">Close</Button>
        </Drawer.Actions>
      </Drawer>
    </Stack>
  );
};

export default TestApp;
