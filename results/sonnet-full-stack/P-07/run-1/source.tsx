import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  ActionMenu,
  AppLayout,
  Autocomplete,
  Badge,
  Button,
  Columns,
  DatePicker,
  Dialog,
  Divider,
  Drawer,
  Headline,
  Inline,
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

const TODAY = '2026-06-25';
const WEEK_START = '2026-06-22';
const WEEK_END = '2026-06-28';
const TOTAL_SLOTS_PER_DAY = 4;

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Schmidt',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate event — catering required.',
  },
  {
    id: 'BK-002',
    customer: 'Bob Müller',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-25',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit payment.',
  },
  {
    id: 'BK-003',
    customer: 'Carol Bauer',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-26',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Birthday party, decorations needed.',
  },
  {
    id: 'BK-004',
    customer: 'David Weber',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-27',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: '',
  },
  {
    id: 'BK-005',
    customer: 'Eva Fischer',
    email: 'eva@example.com',
    venue: 'Conference Room B',
    date: '2026-06-28',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Client product demo.',
  },
  {
    id: 'BK-006',
    customer: 'Frank Lehmann',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Annual company conference.',
  },
  {
    id: 'BK-007',
    customer: 'Greta Hoffmann',
    email: 'greta@example.com',
    venue: 'Main Hall',
    date: '2026-06-30',
    timeSlot: '18:00-21:00',
    status: 'Pending',
    notes: 'Gala dinner, AV setup required.',
  },
];

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

function statusVariant(status: BookingStatus): 'success' | 'warning' | 'default' {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'default';
}

function BookingTable({
  bookings,
  onViewDetails,
}: {
  bookings: Booking[];
  onViewDetails: (b: Booking) => void;
}) {
  return (
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
          {bookings.map(b => (
            <Table.Row key={b.id} id={b.id}>
              <Table.Cell>{b.id}</Table.Cell>
              <Table.Cell>{b.customer}</Table.Cell>
              <Table.Cell>{b.venue}</Table.Cell>
              <Table.Cell>{b.date}</Table.Cell>
              <Table.Cell>{b.timeSlot}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(b.status)}>{b.status}</Badge>
              </Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label={`Actions for booking ${b.id}`}>
                  <ActionMenu.Item id="view" onAction={() => onViewDetails(b)}>
                    View Details
                  </ActionMenu.Item>
                  <ActionMenu.Item id="edit" onAction={() => {}}>
                    Edit
                  </ActionMenu.Item>
                  <ActionMenu.Item id="cancel" onAction={() => {}}>
                    Cancel Booking
                  </ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
  );
}

export default function TestApp() {
  const [activeTab, setActiveTab] = useState('all');
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const mainHallTodayCount = SAMPLE_BOOKINGS.filter(
    b => b.venue === 'Main Hall' && b.date === TODAY && b.status !== 'Cancelled'
  ).length;
  const mainHallRemaining = TOTAL_SLOTS_PER_DAY - mainHallTodayCount;
  const showCapacityAlert = mainHallRemaining <= 2;

  const handleViewDetails = (b: Booking) => {
    setSelectedBooking(b);
    setDetailOpen(true);
  };

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('all');
  };

  const filteredBookings = SAMPLE_BOOKINGS.filter(b => {
    if (activeTab === 'today' && b.date !== TODAY) return false;
    if (
      activeTab === 'week' &&
      (b.date < WEEK_START || b.date > WEEK_END)
    )
      return false;

    if (filterDate) {
      const dateStr = [
        String(filterDate.year),
        String(filterDate.month).padStart(2, '0'),
        String(filterDate.day).padStart(2, '0'),
      ].join('-');
      if (b.date !== dateStr) return false;
    }

    if (
      filterVenue &&
      !b.venue.toLowerCase().includes(filterVenue.toLowerCase())
    )
      return false;

    if (
      filterStatus !== 'all' &&
      b.status.toLowerCase() !== filterStatus.toLowerCase()
    )
      return false;

    return true;
  });

  return (
    <AppLayout>
    <AppLayout.Main>
    <Stack space={6}>
      {/* Page header */}
      <Inline alignX="between" alignY="center">
        <Headline level={1}>Booking Management</Headline>
        <Dialog.Trigger>
          <Button variant="primary">New Booking</Button>
          <Dialog size="medium">
            <Dialog.Title>New Booking</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Customer Name" required />
                <TextField label="Customer Email" type="email" />
                <Select label="Venue">
                  {VENUES.map(v => (
                    <Select.Option key={v} id={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker label="Date" />
                <Select label="Time Slot">
                  {TIME_SLOTS.map(ts => (
                    <Select.Option key={ts} id={ts}>
                      {ts}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea label="Notes" />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" slot="close">
                Create Booking
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {/* Capacity alert */}
      {showCapacityAlert && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Venue Nearly Full</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only {mainHallRemaining} slot
            {mainHallRemaining !== 1 ? 's' : ''} remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      {/* Filter bar */}
      <Columns columns={[1, 1, 1, 'fit']} space={4} collapseAt="48em">
        <DatePicker
          label="Filter by Date"
          value={filterDate}
          onChange={setFilterDate}
        />
        <Autocomplete
          label="Search Venue"
          value={filterVenue}
          onChange={setFilterVenue}
          menuTrigger="focus"
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
          onSelectionChange={key => setFilterStatus(String(key))}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="confirmed">Confirmed</Select.Option>
          <Select.Option id="pending">Pending</Select.Option>
          <Select.Option id="cancelled">Cancelled</Select.Option>
        </Select>
        <Button variant="secondary" onPress={clearFilters}>
          Clear Filters
        </Button>
      </Columns>

      {/* Tabs + table */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(String(key))}
        aria-label="Booking views"
      >
        <Tabs.List aria-label="Booking views">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">
          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
          />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="today">
          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
          />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="week">
          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
          />
        </Tabs.TabPanel>
      </Tabs>

      {/* Detail drawer (controlled, opened from row menu) */}
      {detailOpen && (
      <Drawer.Trigger open={detailOpen} onOpenChange={setDetailOpen}>
        <Drawer>
          <Drawer.Title>
            Booking {selectedBooking?.id ?? ''}
          </Drawer.Title>
          <Drawer.Content>
            {selectedBooking && (
              <Stack space={4}>
                <Inline space={2} alignY="center">
                  <Text weight="bold">Status</Text>
                  <Badge variant={statusVariant(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </Inline>
                <Divider />
                <Stack space={2}>
                  <Text weight="bold">Customer Information</Text>
                  <Text>{selectedBooking.customer}</Text>
                  <Text>{selectedBooking.email}</Text>
                </Stack>
                <Divider />
                <Stack space={2}>
                  <Text weight="bold">Venue &amp; Schedule</Text>
                  <Text>{selectedBooking.venue}</Text>
                  <Text>{selectedBooking.date}</Text>
                  <Text>{selectedBooking.timeSlot}</Text>
                </Stack>
                {selectedBooking.notes && (
                  <>
                    <Divider />
                    <Stack space={2}>
                      <Text weight="bold">Notes</Text>
                      <Text>{selectedBooking.notes}</Text>
                    </Stack>
                  </>
                )}
                <Divider />
                <Accordion>
                  <Accordion.Item id="payment">
                    <Accordion.Header>Payment History</Accordion.Header>
                    <Accordion.Content>
                      <Text>No payment records found.</Text>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="comms">
                    <Accordion.Header>Communication Log</Accordion.Header>
                    <Accordion.Content>
                      <Text>No communications logged yet.</Text>
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
      </Drawer.Trigger>
      )}
    </Stack>
    </AppLayout.Main>
    </AppLayout>
  );
}
