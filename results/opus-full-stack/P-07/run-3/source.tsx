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
  VisuallyHidden,
} from '@marigold/components';

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string; // ISO YYYY-MM-DD
  timeSlot: string;
  status: Status;
  notes?: string;
}

const TODAY = '2026-06-27';
const WEEK_START = '2026-06-22';
const WEEK_END = '2026-06-28';

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
    id: 'BK-1001',
    customer: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate keynote, AV setup requested.',
  },
  {
    id: 'BK-1002',
    customer: 'Bob Smith',
    email: 'bob.smith@example.com',
    venue: 'Conference Room A',
    date: '2026-06-27',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carol White',
    email: 'carol.white@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-24',
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled due to weather forecast.',
  },
  {
    id: 'BK-1004',
    customer: 'David Brown',
    email: 'david.brown@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-25',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-1005',
    customer: 'Eve Davis',
    email: 'eve.davis@example.com',
    venue: 'Conference Room B',
    date: '2026-07-03',
    timeSlot: '09:00-12:00',
    status: 'Pending',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Miller',
    email: 'frank.miller@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-1007',
    customer: 'Grace Lee',
    email: 'grace.lee@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-07-10',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
  },
  {
    id: 'BK-1008',
    customer: 'Henry Wilson',
    email: 'henry.wilson@example.com',
    venue: 'Main Hall',
    date: '2026-06-26',
    timeSlot: '18:00-21:00',
    status: 'Cancelled',
  },
];

const statusVariant = (status: Status): 'success' | 'warning' | 'default' => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
    default:
      return 'default';
  }
};

const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split('-').map(Number);
  const months = [
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
  return `${months[month - 1]} ${day}, ${year}`;
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [dateValue, setDateValue] = useState<DateValue | null>(null);
  const [venueQuery, setVenueQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tab, setTab] = useState<string>('all');

  // Overlays
  const [newOpen, setNewOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [nextId, setNextId] = useState(1009);

  const clearFilters = () => {
    setDateValue(null);
    setVenueQuery('');
    setStatusFilter('all');
  };

  const matchesFilters = (b: Booking) => {
    if (dateValue && b.date !== dateValue.toString()) return false;
    const query = venueQuery.trim().toLowerCase();
    if (query && !b.venue.toLowerCase().includes(query)) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  };

  const inRange = (b: Booking, range: string) => {
    if (range === 'today') return b.date === TODAY;
    if (range === 'week') return b.date >= WEEK_START && b.date <= WEEK_END;
    return true;
  };

  const visibleBookings = (range: string) =>
    bookings.filter(b => matchesFilters(b) && inRange(b, range));

  const handleRowAction = (action: string, booking: Booking) => {
    if (action === 'view') {
      setActiveBooking(booking);
      setDetailOpen(true);
    } else if (action === 'edit') {
      setActiveBooking(booking);
      setEditOpen(true);
    } else if (action === 'cancel') {
      setBookings(prev =>
        prev.map(b =>
          b.id === booking.id ? { ...b, status: 'Cancelled' } : b
        )
      );
    }
  };

  const createBooking = (data: Record<string, FormDataEntryValue>) => {
    const id = `BK-${nextId}`;
    setNextId(n => n + 1);
    const newBooking: Booking = {
      id,
      customer: String(data.customer ?? ''),
      email: String(data.email ?? ''),
      venue: String(data.venue ?? VENUES[0]),
      date: String(data.date ?? TODAY) || TODAY,
      timeSlot: String(data.timeSlot ?? TIME_SLOTS[0]),
      status: 'Pending',
      notes: data.notes ? String(data.notes) : undefined,
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (
    target: Booking,
    data: Record<string, FormDataEntryValue>
  ) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === target.id
          ? {
              ...b,
              customer: String(data.customer ?? b.customer),
              email: String(data.email ?? b.email),
              venue: String(data.venue ?? b.venue),
              date: String(data.date ?? b.date) || b.date,
              timeSlot: String(data.timeSlot ?? b.timeSlot),
              notes: data.notes ? String(data.notes) : undefined,
            }
          : b
      )
    );
  };

  const renderTable = (range: string) => {
    const rows = visibleBookings(range);
    return (
      <Stack space={3}>
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
            {rows.map(booking => (
              <Table.Row key={booking.id} id={booking.id}>
                <Table.Cell>{booking.id}</Table.Cell>
                <Table.Cell>{booking.customer}</Table.Cell>
                <Table.Cell>{booking.venue}</Table.Cell>
                <Table.Cell>{formatDate(booking.date)}</Table.Cell>
                <Table.Cell>{booking.timeSlot}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <ActionMenu
                    size="small"
                    aria-label={`Actions for ${booking.id}`}
                  >
                    <ActionMenu.Item
                      id="view"
                      onAction={() => handleRowAction('view', booking)}
                    >
                      View Details
                    </ActionMenu.Item>
                    <ActionMenu.Item
                      id="edit"
                      onAction={() => handleRowAction('edit', booking)}
                    >
                      Edit
                    </ActionMenu.Item>
                    <ActionMenu.Item
                      id="cancel"
                      variant="destructive"
                      onAction={() => handleRowAction('cancel', booking)}
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
        {rows.length === 0 ? (
          <Text color="text-muted">No bookings match the current filters.</Text>
        ) : null}
      </Stack>
    );
  };

  const bookingFormFields = (booking?: Booking) => (
    <Stack space={4}>
      <TextField
        label="Customer Name"
        name="customer"
        required
        defaultValue={booking?.customer}
      />
      <TextField
        label="Customer Email"
        name="email"
        type="email"
        defaultValue={booking?.email}
      />
      <Select
        label="Venue"
        name="venue"
        defaultSelectedKey={booking?.venue ?? VENUES[0]}
      >
        {VENUES.map(v => (
          <Select.Option key={v} id={v}>
            {v}
          </Select.Option>
        ))}
      </Select>
      <DatePicker label="Date" name="date" />
      <Select
        label="Time Slot"
        name="timeSlot"
        defaultSelectedKey={booking?.timeSlot ?? TIME_SLOTS[0]}
      >
        {TIME_SLOTS.map(slot => (
          <Select.Option key={slot} id={slot}>
            {slot}
          </Select.Option>
        ))}
      </Select>
      <TextArea label="Notes" name="notes" defaultValue={booking?.notes} />
    </Stack>
  );

  return (
    <Inset space={6}>
      <Stack space={6}>
        <Inline alignX="between" alignY="center" space={4}>
          <Headline level={1}>Booking Management</Headline>
          <Button variant="primary" onPress={() => setNewOpen(true)}>
            New Booking
          </Button>
        </Inline>

        {/* Filter bar */}
        <Inline space={4} alignY="bottom">
          <DatePicker
            label="Date"
            value={dateValue}
            onChange={setDateValue}
          />
          <Autocomplete
            label="Venue"
            menuTrigger="focus"
            value={venueQuery}
            onChange={setVenueQuery}
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
          <SectionMessage.Title>Limited availability</SectionMessage.Title>
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
          <Tabs.TabPanel id="all">{renderTable('all')}</Tabs.TabPanel>
          <Tabs.TabPanel id="today">{renderTable('today')}</Tabs.TabPanel>
          <Tabs.TabPanel id="week">{renderTable('week')}</Tabs.TabPanel>
        </Tabs>
      </Stack>

      {/* New booking dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen} closeButton size="small">
        {({ close }) => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              createBooking(data);
              close();
            }}
          >
            <Dialog.Title>New Booking</Dialog.Title>
            <Dialog.Content>{bookingFormFields()}</Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Booking
              </Button>
            </Dialog.Actions>
          </Form>
        )}
      </Dialog>

      {/* Edit booking dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
        closeButton
        size="small"
      >
        {({ close }) => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              if (activeBooking) updateBooking(activeBooking, data);
              close();
            }}
          >
            <Dialog.Title>Edit Booking</Dialog.Title>
            <Dialog.Content>
              {bookingFormFields(activeBooking ?? undefined)}
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Dialog.Actions>
          </Form>
        )}
      </Dialog>

      {/* Detail panel */}
      <Drawer.Trigger open={detailOpen} onOpenChange={setDetailOpen}>
        <VisuallyHidden>
          <Button aria-label="Open booking details">Details</Button>
        </VisuallyHidden>
        <Drawer size="medium">
        <Drawer.Title>Booking Details</Drawer.Title>
        <Drawer.Content>
          {activeBooking ? (
            <Stack space={6}>
              <Inline space={3} alignY="center">
                <Headline level={3}>{activeBooking.id}</Headline>
                <Badge variant={statusVariant(activeBooking.status)}>
                  {activeBooking.status}
                </Badge>
              </Inline>

              <Stack space={2}>
                <Text weight="bold">Customer</Text>
                <Text>{activeBooking.customer}</Text>
                <Text color="text-muted">{activeBooking.email}</Text>
              </Stack>

              <Stack space={2}>
                <Text weight="bold">Venue &amp; Schedule</Text>
                <Text>{activeBooking.venue}</Text>
                <Text>
                  {formatDate(activeBooking.date)} · {activeBooking.timeSlot}
                </Text>
              </Stack>

              <Stack space={2}>
                <Text weight="bold">Notes</Text>
                <Text>
                  {activeBooking.notes ?? 'No notes for this booking.'}
                </Text>
              </Stack>

              <Accordion>
                <Accordion.Item id="payment">
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>Deposit (30%) — Paid</Text>
                      <Text>Balance — Due on event date</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="communication">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>Confirmation email sent.</Text>
                      <Text>Reminder scheduled 24h before event.</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          ) : null}
        </Drawer.Content>
        <Drawer.Actions>
          <Button slot="close">Close</Button>
        </Drawer.Actions>
        </Drawer>
      </Drawer.Trigger>
    </Inset>
  );
};

export default TestApp;
