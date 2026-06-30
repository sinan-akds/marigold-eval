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
  Headline,
  Inline,
  SectionMessage,
  Scrollable,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

type Status = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
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

const TODAY = '2026-06-28';
const WEEK_END = '2026-07-04';

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2026-06-28',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Birthday party — arrange floral centerpieces.',
  },
  {
    id: 'BK-002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2026-06-28',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Q3 strategy meeting. AV equipment required.',
  },
  {
    id: 'BK-003',
    customer: 'Carol Davis',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-29',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Sunset cocktail networking event.',
  },
  {
    id: 'BK-004',
    customer: 'David Wilson',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-27',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Cancelled due to scheduling conflict.',
  },
  {
    id: 'BK-005',
    customer: 'Emma Brown',
    email: 'emma@example.com',
    venue: 'Conference Room B',
    date: '2026-06-30',
    timeSlot: '18:00-21:00',
    status: 'Pending',
    notes: 'Team-building workshop — need whiteboards.',
  },
  {
    id: 'BK-006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2026-07-01',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Product launch event. Press invited.',
  },
  {
    id: 'BK-007',
    customer: 'Grace Lee',
    email: 'grace@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-07-02',
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Cancelled due to weather forecast.',
  },
];

function statusVariant(status: Status): 'success' | 'warning' | 'default' {
  if (status === 'Confirmed') return 'success';
  if (status === 'Pending') return 'warning';
  return 'default';
}

function formatDateValue(dv: DateValue): string {
  return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
}

interface BookingTableProps {
  bookings: Booking[];
  onViewDetails: (b: Booking) => void;
  onCancelBooking: (id: string) => void;
}

const BookingTable = ({
  bookings,
  onViewDetails,
  onCancelBooking,
}: BookingTableProps) => (
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
        {bookings.map(booking => (
          <Table.Row key={booking.id} id={booking.id}>
            <Table.Cell>{booking.id}</Table.Cell>
            <Table.Cell>{booking.customer}</Table.Cell>
            <Table.Cell>{booking.venue}</Table.Cell>
            <Table.Cell>{booking.date}</Table.Cell>
            <Table.Cell>{booking.timeSlot}</Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <ActionMenu>
                <ActionMenu.Item
                  id="view-details"
                  onAction={() => onViewDetails(booking)}
                >
                  View Details
                </ActionMenu.Item>
                <ActionMenu.Item id="edit">Edit</ActionMenu.Item>
                <ActionMenu.Item
                  id="cancel"
                  onAction={() => onCancelBooking(booking.id)}
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

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [activeTab, setActiveTab] = useState('all');

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'today' && b.date !== TODAY) return false;
    if (activeTab === 'this-week' && (b.date < TODAY || b.date > WEEK_END))
      return false;
    if (filterDate && b.date !== formatDateValue(filterDate)) return false;
    if (
      filterVenue &&
      !b.venue.toLowerCase().includes(filterVenue.toLowerCase())
    )
      return false;
    if (filterStatus !== 'all' && b.status.toLowerCase() !== filterStatus)
      return false;
    return true;
  });

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('all');
  };

  const handleViewDetails = (booking: Booking) => {
    setDetailBooking(booking);
    setDetailOpen(true);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id ? { ...b, status: 'Cancelled' as Status } : b
      )
    );
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={6}>
          {/* Page header */}
          <Inline alignX="between" alignY="center">
            <Headline level="1">Booking Management</Headline>
            <Dialog.Trigger>
              <Button variant="primary">New Booking</Button>
              <Dialog size="medium" closeButton>
                <Dialog.Title>New Booking</Dialog.Title>
                <Dialog.Content>
                  <Stack space={4}>
                    <TextField label="Customer Name" required />
                    <TextField label="Customer Email" type="email" />
                    <Select label="Venue" placeholder="Select venue">
                      {VENUES.map(v => (
                        <Select.Option id={v} key={v}>
                          {v}
                        </Select.Option>
                      ))}
                    </Select>
                    <DatePicker label="Date" />
                    <Select label="Time Slot" placeholder="Select time slot">
                      {TIME_SLOTS.map(s => (
                        <Select.Option id={s} key={s}>
                          {s}
                        </Select.Option>
                      ))}
                    </Select>
                    <TextArea label="Notes" rows={3} />
                  </Stack>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button slot="close">Cancel</Button>
                  <Button variant="primary" slot="close">
                    Create Booking
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Dialog.Trigger>
          </Inline>

          {/* Filter bar — Columns ensures one-per-cell, collapses on small screens */}
          <Columns columns={[1, 1, 1, 'fit']} space={4} collapseAt="40em">
            <DatePicker
              label="Date"
              value={filterDate ?? undefined}
              onChange={val => setFilterDate(val ?? null)}
            />
            <Autocomplete
              label="Venue"
              value={filterVenue}
              onChange={val => setFilterVenue(val)}
            >
              {VENUES.map(v => (
                <Autocomplete.Option id={v} key={v}>
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
            <Button onPress={handleClearFilters}>Clear Filters</Button>
          </Columns>

          {/* Capacity alert */}
          <SectionMessage variant="warning">
            <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
            <SectionMessage.Content>
              Main Hall has only 2 slots remaining for today.
            </SectionMessage.Content>
          </SectionMessage>

          {/* Tabs + Table */}
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(String(key))}
            aria-label="Booking views"
          >
            <Tabs.List aria-label="Booking views">
              <Tabs.Item id="all">All Bookings</Tabs.Item>
              <Tabs.Item id="today">Today</Tabs.Item>
              <Tabs.Item id="this-week">This Week</Tabs.Item>
            </Tabs.List>
            <Tabs.TabPanel id="all">
              <BookingTable
                bookings={filteredBookings}
                onViewDetails={handleViewDetails}
                onCancelBooking={handleCancelBooking}
              />
            </Tabs.TabPanel>
            <Tabs.TabPanel id="today">
              <BookingTable
                bookings={filteredBookings}
                onViewDetails={handleViewDetails}
                onCancelBooking={handleCancelBooking}
              />
            </Tabs.TabPanel>
            <Tabs.TabPanel id="this-week">
              <BookingTable
                bookings={filteredBookings}
                onViewDetails={handleViewDetails}
                onCancelBooking={handleCancelBooking}
              />
            </Tabs.TabPanel>
          </Tabs>
        </Stack>

        {/* Detail dialog — opened programmatically from row ActionMenu */}
        <Dialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          closeButton
          size="large"
        >
          {({ close }) => (
            <>
              <Dialog.Title>
                {detailBooking
                  ? `${detailBooking.id} — ${detailBooking.customer}`
                  : 'Booking Details'}
              </Dialog.Title>
              <Dialog.Content>
                {detailBooking && (
                  <Stack space={4}>
                    <Inline space={3} alignY="center">
                      <Text weight="bold">{detailBooking.id}</Text>
                      <Badge variant={statusVariant(detailBooking.status)}>
                        {detailBooking.status}
                      </Badge>
                    </Inline>

                    <Divider />

                    <Stack space={2}>
                      <Headline level="3">Customer Information</Headline>
                      <Text>{detailBooking.customer}</Text>
                      <Text>{detailBooking.email}</Text>
                    </Stack>

                    <Divider />

                    <Stack space={2}>
                      <Headline level="3">Venue &amp; Schedule</Headline>
                      <Text>{detailBooking.venue}</Text>
                      <Text>{detailBooking.date}</Text>
                      <Text>{detailBooking.timeSlot}</Text>
                    </Stack>

                    <Divider />

                    <Stack space={2}>
                      <Headline level="3">Notes</Headline>
                      <Text>
                        {detailBooking.notes || 'No notes provided.'}
                      </Text>
                    </Stack>

                    <Divider />

                    <Accordion allowsMultipleExpanded>
                      <Accordion.Item id="payment">
                        <Accordion.Header>Payment History</Accordion.Header>
                        <Accordion.Content>
                          <Stack space={2}>
                            <Text>€500.00 received — 2026-06-10</Text>
                            <Text>€150.00 deposit — 2026-05-28</Text>
                          </Stack>
                        </Accordion.Content>
                      </Accordion.Item>
                      <Accordion.Item id="comms">
                        <Accordion.Header>Communication Log</Accordion.Header>
                        <Accordion.Content>
                          <Stack space={2}>
                            <Text>2026-06-20: Confirmation email sent.</Text>
                            <Text>
                              2026-06-15: Customer requested AV equipment.
                            </Text>
                            <Text>2026-06-01: Initial inquiry received.</Text>
                          </Stack>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  </Stack>
                )}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={close}>Close</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
