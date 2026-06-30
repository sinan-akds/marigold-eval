import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  today,
  getLocalTimeZone,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  Badge,
  Button,
  ComboBox,
  DateFormat,
  DatePicker,
  Dialog,
  Divider,
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

/* ------------------------------------------------------------------ */
/* Data model                                                          */
/* ------------------------------------------------------------------ */

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: DateValue;
  timeSlot: string;
  status: Status;
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

const STATUS_OPTIONS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Confirmed', label: 'Confirmed' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Cancelled', label: 'Cancelled' },
];

const TODAY = today(getLocalTimeZone());

const statusVariant = (status: Status): 'success' | 'warning' | 'default' => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'default';
  }
};

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: TODAY,
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual shareholder meeting. Requires AV setup.',
  },
  {
    id: 'BK-1002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: TODAY,
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: TODAY.add({ days: 2 }),
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled by customer due to weather forecast.',
  },
  {
    id: 'BK-1004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Conference Room B',
    date: TODAY.add({ days: 3 }),
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Product launch rehearsal.',
  },
  {
    id: 'BK-1005',
    customer: 'Emma Davis',
    email: 'emma@example.com',
    venue: 'Workshop Studio',
    date: TODAY.add({ days: 10 }),
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Pottery workshop, 12 attendees.',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: TODAY.subtract({ days: 4 }),
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Charity gala dinner.',
  },
  {
    id: 'BK-1007',
    customer: 'Grace Lee',
    email: 'grace@example.com',
    venue: 'Main Hall',
    date: TODAY,
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Team offsite, catering requested.',
  },
];

/* ------------------------------------------------------------------ */
/* Booking form (shared for create & edit)                             */
/* ------------------------------------------------------------------ */

interface FormState {
  customer: string;
  email: string;
  venue: string | null;
  date: DateValue | null;
  timeSlot: string | null;
  notes: string;
}

const emptyForm: FormState = {
  customer: '',
  email: '',
  venue: null,
  date: null,
  timeSlot: null,
  notes: '',
};

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Booking | null;
  onSave: (data: FormState) => void;
}

const BookingFormDialog = ({
  open,
  onOpenChange,
  editing,
  onSave,
}: BookingFormDialogProps) => {
  const [data, setData] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [lastOpen, setLastOpen] = useState(false);

  // Sync the form fields whenever the dialog transitions to open.
  if (open && !lastOpen) {
    setLastOpen(true);
    setSubmitted(false);
    setData(
      editing
        ? {
            customer: editing.customer,
            email: editing.email,
            venue: editing.venue,
            date: editing.date,
            timeSlot: editing.timeSlot,
            notes: editing.notes,
          }
        : emptyForm
    );
  }
  if (!open && lastOpen) {
    setLastOpen(false);
  }

  const customerInvalid = submitted && data.customer.trim() === '';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (data.customer.trim() === '') {
      return;
    }
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} closeButton size="medium">
      <Dialog.Title>
        {editing ? `Edit booking ${editing.id}` : 'New Booking'}
      </Dialog.Title>
      <Dialog.Content>
        <Form onSubmit={handleSubmit}>
          <Stack space={4}>
            <TextField
              label="Customer Name"
              name="customer"
              required
              value={data.customer}
              onChange={value => setData(prev => ({ ...prev, customer: value }))}
              error={customerInvalid}
              errorMessage="Please enter the customer name."
            />
            <TextField
              label="Customer Email"
              name="email"
              type="email"
              value={data.email}
              onChange={value => setData(prev => ({ ...prev, email: value }))}
            />
            <Select
              label="Venue"
              placeholder="Select a venue"
              selectedKey={data.venue}
              onSelectionChange={key =>
                setData(prev => ({ ...prev, venue: key as string }))
              }
            >
              {VENUES.map(venue => (
                <Select.Option key={venue} id={venue}>
                  {venue}
                </Select.Option>
              ))}
            </Select>
            <DatePicker
              label="Date"
              value={data.date}
              onChange={value => setData(prev => ({ ...prev, date: value }))}
            />
            <Select
              label="Time Slot"
              placeholder="Select a time slot"
              selectedKey={data.timeSlot}
              onSelectionChange={key =>
                setData(prev => ({ ...prev, timeSlot: key as string }))
              }
            >
              {TIME_SLOTS.map(slot => (
                <Select.Option key={slot} id={slot}>
                  {slot}
                </Select.Option>
              ))}
            </Select>
            <TextArea
              label="Notes"
              value={data.notes}
              onChange={value => setData(prev => ({ ...prev, notes: value }))}
            />
            <Inline space={2} alignX="right">
              <Button variant="secondary" onPress={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editing ? 'Save Changes' : 'Create Booking'}
              </Button>
            </Inline>
          </Stack>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};

/* ------------------------------------------------------------------ */
/* Detail drawer                                                       */
/* ------------------------------------------------------------------ */

interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
}

const DetailDrawer = ({ open, onOpenChange, booking }: DetailDrawerProps) => (
  <Drawer open={open} onOpenChange={onOpenChange} size="medium">
    <Drawer.Title>Booking Details</Drawer.Title>
    <Drawer.Content>
      {booking ? (
        <Stack space={6}>
          <Inline space={3} alignY="center">
            <Headline level={3}>{booking.id}</Headline>
            <Badge variant={statusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </Inline>

          <Stack space={2}>
            <Text weight="bold">Customer</Text>
            <Text>{booking.customer}</Text>
            <Text color="text-muted">{booking.email}</Text>
          </Stack>

          <Divider />

          <Stack space={2}>
            <Text weight="bold">Venue &amp; Schedule</Text>
            <Text>{booking.venue}</Text>
            <Text>
              <DateFormat value={booking.date.toDate(getLocalTimeZone())} dateStyle="full" />
            </Text>
            <Text>{booking.timeSlot}</Text>
          </Stack>

          <Divider />

          <Stack space={2}>
            <Text weight="bold">Notes</Text>
            <Text>{booking.notes || 'No notes for this booking.'}</Text>
          </Stack>

          <Accordion>
            <Accordion.Item id="payment">
              <Accordion.Header>Payment History</Accordion.Header>
              <Accordion.Content>
                <Stack space={1}>
                  <Text>Deposit — €250.00 — paid</Text>
                  <Text>Balance — €750.00 — due on event date</Text>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="communication">
              <Accordion.Header>Communication Log</Accordion.Header>
              <Accordion.Content>
                <Stack space={1}>
                  <Text>Booking confirmation email sent.</Text>
                  <Text>Reminder scheduled 24h before the event.</Text>
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
);

/* ------------------------------------------------------------------ */
/* Booking table                                                       */
/* ------------------------------------------------------------------ */

interface BookingTableProps {
  rows: Booking[];
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

const BookingTable = ({ rows, onView, onEdit, onCancel }: BookingTableProps) => {
  if (rows.length === 0) {
    return (
      <SectionMessage variant="info">
        <SectionMessage.Title>No bookings found</SectionMessage.Title>
        <SectionMessage.Content>
          Try adjusting the filters or create a new booking.
        </SectionMessage.Content>
      </SectionMessage>
    );
  }

  return (
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
          <Table.Row key={booking.id}>
            <Table.Cell>{booking.id}</Table.Cell>
            <Table.Cell>{booking.customer}</Table.Cell>
            <Table.Cell>{booking.venue}</Table.Cell>
            <Table.Cell>
              <DateFormat
                value={booking.date.toDate(getLocalTimeZone())}
                dateStyle="medium"
              />
            </Table.Cell>
            <Table.Cell>{booking.timeSlot}</Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu aria-label={`Actions for ${booking.id}`}>
                <Menu.Item id="view" onAction={() => onView(booking)}>
                  View Details
                </Menu.Item>
                <Menu.Item id="edit" onAction={() => onEdit(booking)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  id="cancel"
                  variant="destructive"
                  onAction={() => onCancel(booking)}
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
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Overlays
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const weekStart = startOfWeek(TODAY, 'en-US');
  const weekEnd = endOfWeek(TODAY, 'en-US');

  const getVisible = (tab: string): Booking[] =>
    bookings.filter(booking => {
      if (tab === 'today' && !isSameDay(booking.date, TODAY)) return false;
      if (
        tab === 'week' &&
        !(booking.date.compare(weekStart) >= 0 && booking.date.compare(weekEnd) <= 0)
      ) {
        return false;
      }
      if (filterDate && !isSameDay(booking.date, filterDate)) return false;
      if (filterVenue && booking.venue !== filterVenue) return false;
      if (filterStatus !== 'all' && booking.status !== filterStatus) return false;
      return true;
    });

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenue(null);
    setFilterStatus('all');
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (booking: Booking) => {
    setEditing(booking);
    setFormOpen(true);
  };

  const openDetail = (booking: Booking) => {
    setDetailBooking(booking);
    setDetailOpen(true);
  };

  const cancelBooking = (booking: Booking) => {
    setBookings(prev =>
      prev.map(item =>
        item.id === booking.id ? { ...item, status: 'Cancelled' } : item
      )
    );
  };

  const saveBooking = (data: FormState) => {
    if (editing) {
      setBookings(prev =>
        prev.map(item =>
          item.id === editing.id
            ? {
                ...item,
                customer: data.customer.trim(),
                email: data.email.trim(),
                venue: data.venue ?? item.venue,
                date: data.date ?? item.date,
                timeSlot: data.timeSlot ?? item.timeSlot,
                notes: data.notes,
              }
            : item
        )
      );
    } else {
      const nextNumber = 1001 + bookings.length;
      const newBooking: Booking = {
        id: `BK-${nextNumber}`,
        customer: data.customer.trim(),
        email: data.email.trim(),
        venue: data.venue ?? VENUES[0],
        date: data.date ?? TODAY,
        timeSlot: data.timeSlot ?? TIME_SLOTS[0],
        status: 'Pending',
        notes: data.notes,
      };
      setBookings(prev => [...prev, newBooking]);
    }
  };

  const renderTable = (tab: string) => (
    <BookingTable
      rows={getVisible(tab)}
      onView={openDetail}
      onEdit={openEdit}
      onCancel={cancelBooking}
    />
  );

  return (
    <Inset space={8}>
      <Stack space={6}>
        <Headline level={1}>Booking Management</Headline>

        {/* Filter bar */}
        <Inline space={4} alignY="input">
          <DatePicker
            label="Date"
            value={filterDate}
            onChange={setFilterDate}
            width={48}
          />
          <ComboBox
            label="Venue"
            placeholder="Search venues"
            menuTrigger="focus"
            selectedKey={filterVenue}
            onSelectionChange={key =>
              setFilterVenue(key === null ? null : String(key))
            }
            width={56}
          >
            {VENUES.map(venue => (
              <ComboBox.Option key={venue} id={venue}>
                {venue}
              </ComboBox.Option>
            ))}
          </ComboBox>
          <Select
            label="Status"
            selectedKey={filterStatus}
            onSelectionChange={key => setFilterStatus(String(key))}
            width={40}
          >
            {STATUS_OPTIONS.map(option => (
              <Select.Option key={option.id} id={option.id}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
          <Button variant="secondary" onPress={clearFilters}>
            Clear Filters
          </Button>
        </Inline>

        {/* Capacity alert */}
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity warning</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only 2 slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>

        {/* New booking action */}
        <Inline alignX="right">
          <Button variant="primary" onPress={openCreate}>
            New Booking
          </Button>
        </Inline>

        {/* Tabs + table */}
        <Tabs aria-label="Booking views">
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

      <BookingFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        onSave={saveBooking}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        booking={detailBooking}
      />
    </Inset>
  );
};

export default TestApp;
