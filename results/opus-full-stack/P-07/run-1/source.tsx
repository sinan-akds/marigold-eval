import { useState } from 'react';
import {
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';
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

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
];

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

const tz = getLocalTimeZone();
const TODAY = today(tz);

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
    date: TODAY,
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual shareholder meeting. Requires projector and microphone.',
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
    customer: 'Carla Mendes',
    email: 'carla@example.com',
    venue: 'Rooftop Terrace',
    date: TODAY.add({ days: 2 }),
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Evening reception, catering arranged.',
  },
  {
    id: 'BK-1004',
    customer: 'David Lee',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: TODAY.add({ days: 4 }),
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled by customer due to scheduling conflict.',
  },
  {
    id: 'BK-1005',
    customer: 'Emma Wilson',
    email: 'emma@example.com',
    venue: 'Conference Room B',
    date: TODAY.add({ days: 12 }),
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Tentative hold for product workshop.',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Müller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: TODAY.add({ days: 20 }),
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Corporate gala dinner.',
  },
];

const formatDate = (date: DateValue) =>
  date.toDate(tz).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filter state
  const [dateFilter, setDateFilter] = useState<DateValue | null>(null);
  const [venueQuery, setVenueQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Overlay state
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  const clearFilters = () => {
    setDateFilter(null);
    setVenueQuery('');
    setStatusFilter('all');
  };

  const filterByTab = (tab: string) =>
    bookings.filter(booking => {
      // Tab filter
      if (tab === 'today' && booking.date.compare(TODAY) !== 0) {
        return false;
      }
      if (tab === 'week') {
        const diff = booking.date.compare(TODAY);
        if (diff < 0 || diff > 6) {
          return false;
        }
      }
      // Date filter
      if (dateFilter && booking.date.compare(dateFilter) !== 0) {
        return false;
      }
      // Venue filter
      if (
        venueQuery.trim() !== '' &&
        !booking.venue.toLowerCase().includes(venueQuery.trim().toLowerCase())
      ) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }
      return true;
    });

  const cancelBooking = (id: string) =>
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );

  const addBooking = (booking: Booking) =>
    setBookings(prev => [...prev, booking]);

  const saveEdit = (updated: Booking) =>
    setBookings(prev => prev.map(b => (b.id === updated.id ? updated : b)));

  const renderTable = (tab: string) => {
    const rows = filterByTab(tab);
    return (
      <Scrollable>
      <Table aria-label="Bookings" variant="rounded">
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
                <Badge variant={STATUS_VARIANT[booking.status]}>
                  {booking.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label={`Actions for ${booking.id}`}>
                  <ActionMenu.Item
                    id="view"
                    onAction={() => setDetailBooking(booking)}
                  >
                    View Details
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="edit"
                    onAction={() => setEditBooking(booking)}
                  >
                    Edit
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="cancel"
                    variant="destructive"
                    onAction={() => cancelBooking(booking.id)}
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

  return (
    <Stack space={6}>
      <Inline space={4} alignX="between" alignY="center">
        <Headline level="1">Booking Management</Headline>
        <NewBookingDialog
          onCreate={addBooking}
          existingCount={bookings.length}
        />
      </Inline>

      {/* Filter bar */}
      <Inline space={4} alignY="bottom">
        <DatePicker
          label="Date"
          value={dateFilter}
          onChange={setDateFilter}
          width={48}
        />
        <Autocomplete
          label="Venue"
          value={venueQuery}
          onChange={setVenueQuery}
          onSubmit={(key: string | number | null) => {
            if (key != null) {
              setVenueQuery(String(key));
            }
          }}
          width={64}
        >
          {VENUES.map(venue => (
            <Autocomplete.Option key={venue} id={venue}>
              {venue}
            </Autocomplete.Option>
          ))}
        </Autocomplete>
        <Select
          label="Status"
          selectedKey={statusFilter}
          onSelectionChange={key => setStatusFilter(String(key))}
          width={48}
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
        <SectionMessage.Title>Capacity warning</SectionMessage.Title>
        <SectionMessage.Content>
          Main Hall has only 2 slots remaining for today.
        </SectionMessage.Content>
      </SectionMessage>

      {/* Tabs + table */}
      <Tabs aria-label="Booking views" defaultSelectedKey="all">
        <Tabs.List aria-label="Booking views">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">{renderTable('all')}</Tabs.TabPanel>
        <Tabs.TabPanel id="today">{renderTable('today')}</Tabs.TabPanel>
        <Tabs.TabPanel id="week">{renderTable('week')}</Tabs.TabPanel>
      </Tabs>

      {/* Detail panel */}
      <Drawer.Trigger
        open={detailBooking != null}
        onOpenChange={open => {
          if (!open) {
            setDetailBooking(null);
          }
        }}
      >
        <Drawer closeButton>
        <Drawer.Title>Booking Details</Drawer.Title>
        <Drawer.Content>
          {detailBooking ? (
            <Stack space={5}>
              <Inline space={3} alignY="center">
                <Headline level="3">{detailBooking.id}</Headline>
                <Badge variant={STATUS_VARIANT[detailBooking.status]}>
                  {detailBooking.status}
                </Badge>
              </Inline>

              <Stack space={1}>
                <Text weight="bold">Customer</Text>
                <Text>{detailBooking.customer}</Text>
                <Text variant="muted">{detailBooking.email}</Text>
              </Stack>

              <Stack space={1}>
                <Text weight="bold">Venue &amp; Schedule</Text>
                <Text>{detailBooking.venue}</Text>
                <Text variant="muted">
                  {formatDate(detailBooking.date)} · {detailBooking.timeSlot}
                </Text>
              </Stack>

              <Stack space={1}>
                <Text weight="bold">Notes</Text>
                <Text>{detailBooking.notes || 'No notes provided.'}</Text>
              </Stack>

              <Accordion allowsMultipleExpanded>
                <Accordion.Item id="payment">
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Text>
                      No payments recorded yet. Invoice will be generated once
                      the booking is confirmed.
                    </Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="communication">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Text>
                      No messages exchanged yet. Customer correspondence will
                      appear here.
                    </Text>
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

      {/* Edit dialog */}
      {editBooking ? (
        <EditBookingDialog
          booking={editBooking}
          onClose={() => setEditBooking(null)}
          onSave={saveEdit}
        />
      ) : null}
    </Stack>
  );
};

interface NewBookingDialogProps {
  onCreate: (booking: Booking) => void;
  existingCount: number;
}

const NewBookingDialog = ({ onCreate, existingCount }: NewBookingDialogProps) => (
  <Dialog.Trigger>
    <Button variant="primary">New Booking</Button>
    <Dialog size="medium" closeButton>
      {({ close }: { close: () => void }) => (
        <>
          <Dialog.Title>New Booking</Dialog.Title>
          <Dialog.Content>
            <Form
              id="new-booking-form"
              onSubmit={event => {
                event.preventDefault();
                const data = Object.fromEntries(
                  new FormData(event.currentTarget)
                ) as Record<string, string>;

                let date: DateValue = TODAY;
                if (data.date) {
                  try {
                    date = parseDate(data.date);
                  } catch {
                    date = TODAY;
                  }
                }

                onCreate({
                  id: `BK-${1001 + existingCount}`,
                  customer: data.customer ?? '',
                  email: data.email ?? '',
                  venue: data.venue || VENUES[0],
                  date,
                  timeSlot: data.timeSlot || TIME_SLOTS[0],
                  status: 'Pending',
                  notes: data.notes ?? '',
                });
                close();
              }}
            >
              <Stack space={4}>
                <TextField label="Customer Name" name="customer" required />
                <TextField label="Customer Email" name="email" type="email" />
                <Select label="Venue" name="venue" defaultSelectedKey={VENUES[0]}>
                  {VENUES.map(venue => (
                    <Select.Option key={venue} id={venue}>
                      {venue}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker label="Date" name="date" />
                <Select
                  label="Time Slot"
                  name="timeSlot"
                  defaultSelectedKey={TIME_SLOTS[0]}
                >
                  {TIME_SLOTS.map(slot => (
                    <Select.Option key={slot} id={slot}>
                      {slot}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea label="Notes" name="notes" rows={3} />
              </Stack>
            </Form>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="new-booking-form">
              Create Booking
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  </Dialog.Trigger>
);

interface EditBookingDialogProps {
  booking: Booking;
  onClose: () => void;
  onSave: (booking: Booking) => void;
}

const EditBookingDialog = ({
  booking,
  onClose,
  onSave,
}: EditBookingDialogProps) => {
  const [customer, setCustomer] = useState(booking.customer);
  const [status, setStatus] = useState<string>(booking.status);

  return (
    <Dialog
      size="small"
      closeButton
      open
      onOpenChange={open => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Title>Edit Booking {booking.id}</Dialog.Title>
      <Dialog.Content>
        <Form
          id="edit-booking-form"
          onSubmit={event => {
            event.preventDefault();
            onSave({ ...booking, customer, status: status as Status });
            onClose();
          }}
        >
          <Stack space={4}>
            <TextField
              label="Customer Name"
              value={customer}
              onChange={setCustomer}
              required
            />
            <Select
              label="Status"
              selectedKey={status}
              onSelectionChange={key => setStatus(String(key))}
            >
              <Select.Option id="Confirmed">Confirmed</Select.Option>
              <Select.Option id="Pending">Pending</Select.Option>
              <Select.Option id="Cancelled">Cancelled</Select.Option>
            </Select>
          </Stack>
        </Form>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="secondary" onPress={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" form="edit-booking-form">
          Save Changes
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default TestApp;
