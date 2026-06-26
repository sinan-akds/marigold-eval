import { useState } from 'react';
import {
  Stack,
  Inline,
  Headline,
  Text,
  Button,
  Table,
  Tabs,
  Select,
  ComboBox,
  DatePicker,
  TextField,
  TextArea,
  Dialog,
  Menu,
  Badge,
  Accordion,
  Card,
  Divider,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const STATUS_OPTIONS = ['All', 'Confirmed', 'Pending', 'Cancelled'];

// "Today" per the current date context.
const TODAY = '2026-06-25';
// Monday–Sunday range that contains TODAY.
const WEEK_START = '2026-06-22';
const WEEK_END = '2026-06-28';

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string; // ISO YYYY-MM-DD
  slot: string;
  status: Status;
  notes: string;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    customer: 'Alice Morgan',
    email: 'alice.morgan@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    slot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'VIP client — needs stage setup and AV check beforehand.',
  },
  {
    id: 'BK-1002',
    customer: 'Bruno Keller',
    email: 'bruno.keller@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    slot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carla Reyes',
    email: 'carla.reyes@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-26',
    slot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Outdoor catering arranged.',
  },
  {
    id: 'BK-1004',
    customer: 'David Okafor',
    email: 'david.okafor@example.com',
    venue: 'Conference Room B',
    date: '2026-06-23',
    slot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Customer cancelled due to schedule conflict.',
  },
  {
    id: 'BK-1005',
    customer: 'Elena Fischer',
    email: 'elena.fischer@example.com',
    venue: 'Workshop Studio',
    date: '2026-07-10',
    slot: '09:00-12:00',
    status: 'Pending',
    notes: 'Requested projector and 20 chairs.',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Lindqvist',
    email: 'frank.lindqvist@example.com',
    venue: 'Main Hall',
    date: '2026-06-22',
    slot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Annual shareholder meeting.',
  },
  {
    id: 'BK-1007',
    customer: 'Grace Nakamura',
    email: 'grace.nakamura@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    slot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Recurring weekly workshop.',
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

/* ------------------------------------------------------------------ */
/* New booking form (rendered inside the modal dialog)                 */
/* ------------------------------------------------------------------ */

interface NewBookingFormProps {
  onCreate: (booking: Omit<Booking, 'id' | 'status'>) => void;
  onClose: () => void;
}

const NewBookingForm = ({ onCreate, onClose }: NewBookingFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState<string | null>(null);
  const [date, setDate] = useState<any>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [nameError, setNameError] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    onCreate({
      customer: name.trim(),
      email: email.trim(),
      venue: venue ?? VENUES[0],
      date: date ? date.toString() : TODAY,
      slot: slot ?? TIME_SLOTS[0],
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <Stack space={5}>
      <Headline level="2">New Booking</Headline>

      <TextField
        label="Customer Name"
        value={name}
        onChange={(value) => {
          setName(value);
          if (value.trim()) setNameError(false);
        }}
        required
        error={nameError}
        errorMessage="Customer name is required."
      />

      <TextField
        label="Customer Email"
        type="email"
        value={email}
        onChange={setEmail}
      />

      <Select
        label="Venue"
        placeholder="Select a venue"
        selectedKey={venue ?? undefined}
        onSelectionChange={(key) => setVenue(key as string)}
      >
        {VENUES.map((v) => (
          <Select.Option key={v} id={v}>
            {v}
          </Select.Option>
        ))}
      </Select>

      <DatePicker label="Date" value={date} onChange={setDate} />

      <Select
        label="Time Slot"
        placeholder="Select a time slot"
        selectedKey={slot ?? undefined}
        onSelectionChange={(key) => setSlot(key as string)}
      >
        {TIME_SLOTS.map((s) => (
          <Select.Option key={s} id={s}>
            {s}
          </Select.Option>
        ))}
      </Select>

      <TextArea
        label="Notes"
        value={notes}
        onChange={setNotes}
        description="Optional"
      />

      <Inline space={3}>
        <Button variant="primary" onPress={handleSubmit}>
          Create Booking
        </Button>
        <Button variant="secondary" onPress={onClose}>
          Cancel
        </Button>
      </Inline>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Detail panel (right side)                                           */
/* ------------------------------------------------------------------ */

interface DetailPanelProps {
  booking: Booking;
  editing: boolean;
  onClose: () => void;
  onSaveNotes: (id: string, notes: string) => void;
}

const DetailPanel = ({
  booking,
  editing,
  onClose,
  onSaveNotes,
}: DetailPanelProps) => {
  const [draftNotes, setDraftNotes] = useState(booking.notes);

  return (
    <Card>
      <Stack space={4}>
        <Inline space={3} alignY="center">
          <Headline level="2">{booking.id}</Headline>
          <StatusBadge status={booking.status} />
        </Inline>

        <Button variant="text" onPress={onClose}>
          Close panel
        </Button>

        <Divider />

        <Stack space={1}>
          <Text weight="bold">Customer</Text>
          <Text>{booking.customer}</Text>
          <Text>{booking.email}</Text>
        </Stack>

        <Stack space={1}>
          <Text weight="bold">Venue & Schedule</Text>
          <Text>{booking.venue}</Text>
          <Text>
            {booking.date} · {booking.slot}
          </Text>
        </Stack>

        <Stack space={2}>
          <Text weight="bold">Notes</Text>
          {editing ? (
            <Stack space={2}>
              <TextArea
                label="Edit notes"
                value={draftNotes}
                onChange={setDraftNotes}
              />
              <Button
                variant="primary"
                onPress={() => onSaveNotes(booking.id, draftNotes)}
              >
                Save Notes
              </Button>
            </Stack>
          ) : (
            <Text>{booking.notes || 'No notes added.'}</Text>
          )}
        </Stack>

        <Divider />

        <Accordion>
          <Accordion.Item key="payment" id="payment" title="Payment History">
            <Stack space={1}>
              <Text>Deposit received — €250.00 (2026-06-10)</Text>
              <Text>Balance due — €500.00</Text>
            </Stack>
          </Accordion.Item>
          <Accordion.Item key="comms" id="comms" title="Communication Log">
            <Stack space={1}>
              <Text>2026-06-09 · Booking inquiry received.</Text>
              <Text>2026-06-10 · Confirmation email sent.</Text>
            </Stack>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Filters
  const [dateFilter, setDateFilter] = useState<any>(null);
  const [venueFilter, setVenueFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [resetKey, setResetKey] = useState(0);

  // Detail panel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const selectedBooking = bookings.find((b) => b.id === selectedId) ?? null;

  const clearFilters = () => {
    setDateFilter(null);
    setVenueFilter(null);
    setStatusFilter('All');
    setResetKey((k) => k + 1);
  };

  const addBooking = (data: Omit<Booking, 'id' | 'status'>) => {
    const nextId = `BK-${1001 + bookings.length}`;
    setBookings((prev) => [
      ...prev,
      { ...data, id: nextId, status: 'Pending' },
    ]);
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const saveNotes = (id: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, notes } : b))
    );
  };

  const handleAction = (key: string, booking: Booking) => {
    if (key === 'view') {
      setSelectedId(booking.id);
      setEditing(false);
    } else if (key === 'edit') {
      setSelectedId(booking.id);
      setEditing(true);
    } else if (key === 'cancel') {
      cancelBooking(booking.id);
    }
  };

  const filterRows = (tab: string): Booking[] => {
    const selectedDate = dateFilter ? dateFilter.toString() : null;
    return bookings.filter((b) => {
      if (selectedDate && b.date !== selectedDate) return false;
      if (venueFilter && b.venue !== venueFilter) return false;
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (tab === 'today' && b.date !== TODAY) return false;
      if (tab === 'week' && (b.date < WEEK_START || b.date > WEEK_END))
        return false;
      return true;
    });
  };

  const renderTable = (tab: string) => {
    const rows = filterRows(tab);
    return (
      <Stack space={2}>
        <Table aria-label="Bookings">
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
              <Table.Row key={b.id}>
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
                    label="⋯"
                    onAction={(key) => handleAction(String(key), b)}
                  >
                    <Menu.Item id="view">View Details</Menu.Item>
                    <Menu.Item id="edit">Edit</Menu.Item>
                    <Menu.Item id="cancel">Cancel Booking</Menu.Item>
                  </Menu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {rows.length === 0 && (
          <Text>No bookings match the current filters.</Text>
        )}
      </Stack>
    );
  };

  const mainColumn = (
    <Stack space={5}>
      <Inline space={3} alignY="center">
        <Headline level="1">Booking Management</Headline>
      </Inline>

      {/* Filter bar */}
      <Card>
        <Inline space={4} alignY="bottom">
          <DatePicker
            key={`date-${resetKey}`}
            label="Date"
            value={dateFilter}
            onChange={setDateFilter}
          />
          <ComboBox
            key={`venue-${resetKey}`}
            label="Venue"
            placeholder="Search venues"
            selectedKey={venueFilter ?? undefined}
            onSelectionChange={(key) =>
              setVenueFilter(key === null ? null : (key as string))
            }
          >
            {VENUES.map((v) => (
              <ComboBox.Option key={v} id={v}>
                {v}
              </ComboBox.Option>
            ))}
          </ComboBox>
          <Select
            label="Status"
            selectedKey={statusFilter}
            onSelectionChange={(key) => setStatusFilter(key as string)}
          >
            {STATUS_OPTIONS.map((s) => (
              <Select.Option key={s} id={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
          <Button variant="secondary" onPress={clearFilters}>
            Clear Filters
          </Button>
        </Inline>
      </Card>

      {/* Actions row + capacity alert */}
      <Inline space={3} alignY="center">
        <Dialog.Trigger>
          <Button variant="primary">New Booking</Button>
          <Dialog closeButton>
            {({ close }: { close: () => void }) => (
              <NewBookingForm onCreate={addBooking} onClose={close} />
            )}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Card>
        <Inline space={2} alignY="center">
          <Badge variant="warning">Capacity</Badge>
          <Text>Main Hall has only 2 slots remaining for today.</Text>
        </Inline>
      </Card>

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
  );

  return (
    <Stack space={6}>
      {selectedBooking ? (
        <Inline space={6} alignY="top">
          {mainColumn}
          <DetailPanel
            booking={selectedBooking}
            editing={editing}
            onClose={() => setSelectedId(null)}
            onSaveNotes={saveNotes}
          />
        </Inline>
      ) : (
        mainColumn
      )}
    </Stack>
  );
};

export default TestApp;
