import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import { parseDate } from '@internationalized/date';
import {
  Button,
  Stack,
  Inline,
  Tabs,
  Table,
  TextField,
  Autocomplete,
  Select,
  Dialog,
  Form,
  TextArea,
  DatePicker,
  Drawer,
  Badge,
  SectionMessage,
  ActionMenu,
  Text,
  Headline,
  Accordion,
  DateFormat,
} from '@marigold/components';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: DateValue;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes: string;
}

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

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: parseDate('2026-06-25'),
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate event with 150 attendees',
  },
  {
    id: 'BK002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Conference Room A',
    date: parseDate('2026-06-22'),
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Team meeting preparation',
  },
  {
    id: 'BK003',
    customer: 'Mike Chen',
    email: 'mike@example.com',
    venue: 'Rooftop Terrace',
    date: parseDate('2026-06-28'),
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Evening gala dinner',
  },
  {
    id: 'BK004',
    customer: 'Emma Davis',
    email: 'emma@example.com',
    venue: 'Workshop Studio',
    date: parseDate('2026-06-22'),
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Training session (rescheduled)',
  },
  {
    id: 'BK005',
    customer: 'Robert Wilson',
    email: 'robert@example.com',
    venue: 'Conference Room B',
    date: parseDate('2026-06-26'),
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Client presentation',
  },
  {
    id: 'BK006',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Main Hall',
    date: parseDate('2026-06-30'),
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch event',
  },
];

const getStatusVariant = (
  status: 'Confirmed' | 'Pending' | 'Cancelled'
): 'success' | 'warning' | 'default' => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'default';
  }
};

const isToday = (date: DateValue): boolean => {
  const today = parseDate('2026-06-22');
  return (
    date.day === today.day &&
    date.month === today.month &&
    date.year === today.year
  );
};

const isThisWeek = (date: DateValue): boolean => {
  const today = parseDate('2026-06-22');
  const startOfWeek = parseDate('2026-06-22');
  const endOfWeek = parseDate('2026-06-28');

  const dateNum =
    date.year * 10000 + date.month * 100 + date.day;
  const startNum =
    startOfWeek.year * 10000 + startOfWeek.month * 100 + startOfWeek.day;
  const endNum =
    endOfWeek.year * 10000 + endOfWeek.month * 100 + endOfWeek.day;

  return dateNum >= startNum && dateNum <= endNum;
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedTab, setSelectedTab] = useState<string | number>('all');
  const [filterDate, setFilterDate] = useState<DateValue | null>(null);
  const [filterVenue, setFilterVenue] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string | number>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const getFilteredBookings = (): Booking[] => {
    let filtered = bookings;

    if (selectedTab === 'today') {
      filtered = filtered.filter(b => isToday(b.date));
    } else if (selectedTab === 'week') {
      filtered = filtered.filter(b => isThisWeek(b.date));
    }

    if (filterDate) {
      filtered = filtered.filter(
        b =>
          b.date.day === filterDate.day &&
          b.date.month === filterDate.month &&
          b.date.year === filterDate.year
      );
    }

    if (filterVenue) {
      filtered = filtered.filter(b =>
        b.venue.toLowerCase().includes(filterVenue.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    return filtered;
  };

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('all');
  };

  const handleCreateBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formData.get('customerName') as string,
      email: formData.get('customerEmail') as string,
      venue: formData.get('venue') as string,
      date: parseDate(formData.get('date') as string),
      timeSlot: formData.get('timeSlot') as string,
      status: 'Pending',
      notes: formData.get('notes') as string,
    };

    setBookings([...bookings, newBooking]);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(
      bookings.map(b =>
        b.id === id ? { ...b, status: 'Cancelled' } : b
      )
    );
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const filteredBookings = getFilteredBookings();
  const today = parseDate('2026-06-22');
  const mainHallTodayCount = bookings.filter(
    b =>
      b.venue === 'Main Hall' &&
      b.date.day === today.day &&
      b.date.month === today.month &&
      b.date.year === today.year &&
      b.status !== 'Cancelled'
  ).length;

  const capacityWarning = mainHallTodayCount >= 2;

  return (
    <Stack space={5}>
      <Inline space={2}>
        <Headline level="1">Booking Management</Headline>
      </Inline>

      {capacityWarning && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
          <SectionMessage.Content>
            Main Hall has only {4 - mainHallTodayCount} slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      <Dialog.Trigger>
        <Button variant="primary">New Booking</Button>
        <Dialog size="small">
          <Dialog.Title>Create New Booking</Dialog.Title>
          <Dialog.Content>
            <Form onSubmit={handleCreateBooking}>
              <Stack space={3}>
                <TextField
                  label="Customer Name"
                  name="customerName"
                  required
                />
                <TextField
                  label="Customer Email"
                  name="customerEmail"
                  type="email"
                  required
                />
                <Select label="Venue" name="venue" required>
                  {VENUES.map(venue => (
                    <Select.Option key={venue} id={venue}>
                      {venue}
                    </Select.Option>
                  ))}
                </Select>
                <DatePicker label="Date" name="date" required />
                <Select label="Time Slot" name="timeSlot" required>
                  {TIME_SLOTS.map(slot => (
                    <Select.Option key={slot} id={slot}>
                      {slot}
                    </Select.Option>
                  ))}
                </Select>
                <TextArea
                  label="Notes"
                  name="notes"
                  rows={4}
                />
                <Inline space={2}>
                  <Button variant="primary" type="submit">
                    Create Booking
                  </Button>
                  <Button variant="secondary" slot="close">
                    Cancel
                  </Button>
                </Inline>
              </Stack>
            </Form>
          </Dialog.Content>
        </Dialog>
      </Dialog.Trigger>

      <Stack space={3}>
        <Headline level="3">Filters</Headline>
        <Stack space={2}>
          <Inline space={2}>
            <DatePicker
              label="Date"
              value={filterDate}
              onChange={setFilterDate}
            />
            <Autocomplete
              label="Venue"
              value={filterVenue}
              onChange={setFilterVenue}
            >
              {VENUES.map(venue => (
                <Autocomplete.Option key={venue} id={venue}>
                  {venue}
                </Autocomplete.Option>
              ))}
            </Autocomplete>
            <Select
              label="Status"
              value={filterStatus}
              onSelectionChange={setFilterStatus}
            >
              <Select.Option id="all">All</Select.Option>
              <Select.Option id="Confirmed">Confirmed</Select.Option>
              <Select.Option id="Pending">Pending</Select.Option>
              <Select.Option id="Cancelled">Cancelled</Select.Option>
            </Select>
            <Button
              variant="secondary"
              onPress={clearFilters}
            >
              Clear Filters
            </Button>
          </Inline>
        </Stack>
      </Stack>

      <Tabs
        aria-label="Booking views"
      >
        <Tabs.List aria-label="Views">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="all">
          <Stack space={3}>
            <Table aria-label="All bookings">
              <Table.Header>
                <Table.Column rowHeader>Booking ID</Table.Column>
                <Table.Column>Customer</Table.Column>
                <Table.Column>Venue</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Time Slot</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={filteredBookings}>
                {booking => (
                  <Table.Row key={booking.id}>
                    <Table.Cell>{booking.id}</Table.Cell>
                    <Table.Cell>{booking.customer}</Table.Cell>
                    <Table.Cell>{booking.venue}</Table.Cell>
                    <Table.Cell>
                      <DateFormat
                        value={new Date(
                          booking.date.year,
                          booking.date.month - 1,
                          booking.date.day
                        )}
                      />
                    </Table.Cell>
                    <Table.Cell>{booking.timeSlot}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <ActionMenu size="small">
                        <ActionMenu.Item
                          id="view"
                          onAction={() => {
                            setSelectedBooking(booking);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          View Details
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          id="edit"
                          onAction={() => {
                            setSelectedBooking(booking);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          Edit
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          id="cancel"
                          variant="destructive"
                          onAction={() =>
                            handleCancelBooking(booking.id)
                          }
                        >
                          Cancel Booking
                        </ActionMenu.Item>
                      </ActionMenu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="today">
          <Stack space={3}>
            <Table aria-label="Today's bookings">
              <Table.Header>
                <Table.Column rowHeader>Booking ID</Table.Column>
                <Table.Column>Customer</Table.Column>
                <Table.Column>Venue</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Time Slot</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={filteredBookings}>
                {booking => (
                  <Table.Row key={booking.id}>
                    <Table.Cell>{booking.id}</Table.Cell>
                    <Table.Cell>{booking.customer}</Table.Cell>
                    <Table.Cell>{booking.venue}</Table.Cell>
                    <Table.Cell>
                      <DateFormat
                        value={new Date(
                          booking.date.year,
                          booking.date.month - 1,
                          booking.date.day
                        )}
                      />
                    </Table.Cell>
                    <Table.Cell>{booking.timeSlot}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <ActionMenu size="small">
                        <ActionMenu.Item
                          id="view"
                          onAction={() => {
                            setSelectedBooking(booking);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          View Details
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          id="edit"
                          onAction={() => {
                            setSelectedBooking(booking);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          Edit
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          id="cancel"
                          variant="destructive"
                          onAction={() =>
                            handleCancelBooking(booking.id)
                          }
                        >
                          Cancel Booking
                        </ActionMenu.Item>
                      </ActionMenu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="week">
          <Stack space={3}>
            <Table aria-label="This week's bookings">
              <Table.Header>
                <Table.Column rowHeader>Booking ID</Table.Column>
                <Table.Column>Customer</Table.Column>
                <Table.Column>Venue</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Time Slot</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body items={filteredBookings}>
                {booking => (
                  <Table.Row key={booking.id}>
                    <Table.Cell>{booking.id}</Table.Cell>
                    <Table.Cell>{booking.customer}</Table.Cell>
                    <Table.Cell>{booking.venue}</Table.Cell>
                    <Table.Cell>
                      <DateFormat
                        value={new Date(
                          booking.date.year,
                          booking.date.month - 1,
                          booking.date.day
                        )}
                      />
                    </Table.Cell>
                    <Table.Cell>{booking.timeSlot}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <ActionMenu size="small">
                        <ActionMenu.Item
                          id="view"
                          onAction={() => {
                            setSelectedBooking(booking);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          View Details
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          id="edit"
                          onAction={() => {
                            setSelectedBooking(booking);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          Edit
                        </ActionMenu.Item>
                        <ActionMenu.Item
                          id="cancel"
                          variant="destructive"
                          onAction={() =>
                            handleCancelBooking(booking.id)
                          }
                        >
                          Cancel Booking
                        </ActionMenu.Item>
                      </ActionMenu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>

      <Drawer.Trigger>
        <div style={{ display: 'none' }} />
        {selectedBooking && (
          <Drawer closeButton>
            <Drawer.Title>Booking Details</Drawer.Title>
            <Drawer.Content>
              <Stack space={4}>
                <Stack space={2}>
                  <Text weight="bold">Booking ID: {selectedBooking.id}</Text>
                  <Badge variant={getStatusVariant(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </Stack>

                <Stack space={2}>
                  <Headline level="3">Customer Information</Headline>
                  <Text>Name: {selectedBooking.customer}</Text>
                  <Text>Email: {selectedBooking.email}</Text>
                </Stack>

                <Stack space={2}>
                  <Headline level="3">Booking Details</Headline>
                  <Text>Venue: {selectedBooking.venue}</Text>
                  <Text>
                    Date: <DateFormat
                      value={new Date(
                        selectedBooking.date.year,
                        selectedBooking.date.month - 1,
                        selectedBooking.date.day
                      )}
                    />
                  </Text>
                  <Text>Time Slot: {selectedBooking.timeSlot}</Text>
                </Stack>

                <Stack space={2}>
                  <Headline level="3">Notes</Headline>
                  <Text>{selectedBooking.notes || 'No notes'}</Text>
                </Stack>

                <Accordion>
                  <Accordion.Item id="payment">
                    <Accordion.Header>Payment History</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Text>Invoice Date: 2026-06-20</Text>
                        <Text>Amount: $2,500.00</Text>
                        <Text>Status: Paid</Text>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item id="communication">
                    <Accordion.Header>Communication Log</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Text>2026-06-22: Booking confirmation email sent</Text>
                        <Text>2026-06-20: Inquiry from customer received</Text>
                        <Text>2026-06-19: Availability confirmed</Text>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Inline space={2}>
                  <Button variant="secondary" onPress={() => setIsDetailsPanelOpen(false)}>
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onPress={() => {
                      handleDeleteBooking(selectedBooking.id);
                      setIsDetailsPanelOpen(false);
                    }}
                  >
                    Delete Booking
                  </Button>
                </Inline>
              </Stack>
            </Drawer.Content>
          </Drawer>
        )}
      </Drawer.Trigger>
    </Stack>
  );
};

export default TestApp;
