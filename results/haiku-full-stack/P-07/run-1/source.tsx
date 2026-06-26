import { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Button,
  DatePicker,
  Autocomplete,
  Select,
  Table,
  Tabs,
  Dialog,
  TextField,
  TextArea,
  Form,
  ActionMenu,
  Menu,
  Badge,
  SectionMessage,
  Drawer,
  Accordion,
  Headline,
  Text,
} from '@marigold/components';
import { parseDate } from '@internationalized/date';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes?: string;
}

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: '2026-06-22',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate event with 100 guests',
  },
  {
    id: 'BK002',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Conference Room A',
    date: '2026-06-22',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Team meeting setup',
  },
  {
    id: 'BK003',
    customer: 'Bob Wilson',
    email: 'bob@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-23',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Wedding reception',
  },
  {
    id: 'BK004',
    customer: 'Carol Davis',
    email: 'carol@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-24',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Original booking cancelled',
  },
  {
    id: 'BK005',
    customer: 'David Lee',
    email: 'david@example.com',
    venue: 'Conference Room B',
    date: '2026-06-25',
    timeSlot: '14:00-17:00',
    status: 'Confirmed',
    notes: 'Product launch presentation',
  },
  {
    id: 'BK006',
    customer: 'Emma Brown',
    email: 'emma@example.com',
    venue: 'Main Hall',
    date: '2026-06-26',
    timeSlot: '18:00-21:00',
    status: 'Pending',
    notes: 'Charity gala',
  },
];

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<any>(parseDate('2026-06-22'));
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const today = parseDate('2026-06-22');
  const weekStart = today;
  const weekEnd = parseDate('2026-06-28');

  const getDateString = (date: any) => {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  };

  const isWithinWeek = (dateStr: string) => {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    const date = { year, month, day };

    const isAfterOrEqualStart =
      date.year > weekStart.year ||
      (date.year === weekStart.year && date.month > weekStart.month) ||
      (date.year === weekStart.year && date.month === weekStart.month && date.day >= weekStart.day);

    const isBeforeOrEqualEnd =
      date.year < weekEnd.year ||
      (date.year === weekEnd.year && date.month < weekEnd.month) ||
      (date.year === weekEnd.year && date.month === weekEnd.month && date.day <= weekEnd.day);

    return isAfterOrEqualStart && isBeforeOrEqualEnd;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      let passesDateFilter = true;
      let passesVenueFilter = !selectedVenue || booking.venue === selectedVenue;
      let passesStatusFilter =
        selectedStatus === 'All' || booking.status === selectedStatus;

      if (activeTab === 'today') {
        passesDateFilter = booking.date === getDateString(today);
      } else if (activeTab === 'week') {
        passesDateFilter = isWithinWeek(booking.date);
      }

      return passesDateFilter && passesVenueFilter && passesStatusFilter;
    });
  }, [bookings, activeTab, selectedDate, selectedVenue, selectedStatus]);

  const venueCapacity: Record<string, number> = {
    'Main Hall': 2,
    'Conference Room A': 5,
    'Conference Room B': 3,
    'Rooftop Terrace': 4,
    'Workshop Studio': 6,
  };

  const todayBookingsForVenue = (venue: string) => {
    return bookings.filter(
      (b) => b.venue === venue && b.date === getDateString(today)
    ).length;
  };

  const checkCapacityAlert = () => {
    for (const venue of VENUES) {
      const remaining = venueCapacity[venue] - todayBookingsForVenue(venue);
      if (remaining <= 2 && remaining > 0) {
        return { venue, remaining };
      }
    }
    return null;
  };

  const capacityAlert = checkCapacityAlert();

  const handleNewBooking = (formData: any) => {
    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formData.customerName,
      email: formData.customerEmail,
      venue: formData.venue,
      date: formData.date,
      timeSlot: formData.timeSlot,
      status: 'Pending',
      notes: formData.notes,
    };
    setBookings([...bookings, newBooking]);
  };

  const handleMenuAction = (bookingId: string, action: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    switch (action) {
      case 'view':
        setSelectedBooking(booking);
        setIsDetailOpen(true);
        break;
      case 'cancel':
        setBookings(
          bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
          )
        );
        break;
      default:
        break;
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Stack space={4}>
      <Headline level="1">Booking Management</Headline>

      {capacityAlert && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
          <SectionMessage.Content>
            {capacityAlert.venue} has only {capacityAlert.remaining} slots
            remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      <Stack space={3}>
        <Headline level="3">Filters</Headline>
        <Inline space={3}>
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={(val) => setSelectedDate(val)}
          />
          <Autocomplete
            label="Venue"
            menuTrigger="focus"
            selectedKey={selectedVenue || undefined}
            onSelectionChange={(key) => setSelectedVenue(String(key) || '')}
          >
            {VENUES.map((venue) => (
              <Autocomplete.Option key={venue} id={venue}>
                {venue}
              </Autocomplete.Option>
            ))}
          </Autocomplete>
          <Select
            label="Status"
            selectedKey={selectedStatus}
            onSelectionChange={(key) => setSelectedStatus(String(key))}
          >
            <Select.Option id="All">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button
            variant="secondary"
            onPress={() => {
              setSelectedDate(parseDate('2026-06-22'));
              setSelectedVenue('');
              setSelectedStatus('All');
            }}
          >
            Clear Filters
          </Button>
        </Inline>
      </Stack>

      <Stack space={3}>
        <Inline space={2} alignY="center">
          <Headline level="3">Bookings</Headline>
          <Dialog.Trigger>
            <Button variant="primary">New Booking</Button>
            <Dialog size="small">
              {({ close }) => (
                <Form
                  onSubmit={(formData: any) => {
                    handleNewBooking(formData);
                    close();
                  }}
                >
                  <Dialog.Title>Create New Booking</Dialog.Title>
                  <Dialog.Content>
                    <Stack space={3}>
                      <TextField
                        name="customerName"
                        label="Customer Name"
                        required
                      />
                      <TextField
                        name="customerEmail"
                        label="Customer Email"
                        type="email"
                      />
                      <Select
                        name="venue"
                        label="Venue"
                        required
                      >
                        {VENUES.map((venue) => (
                          <Select.Option key={venue} id={venue}>
                            {venue}
                          </Select.Option>
                        ))}
                      </Select>
                      <DatePicker name="date" label="Date" required />
                      <Select
                        name="timeSlot"
                        label="Time Slot"
                        required
                      >
                        {TIME_SLOTS.map((slot) => (
                          <Select.Option key={slot} id={slot}>
                            {slot}
                          </Select.Option>
                        ))}
                      </Select>
                      <TextArea
                        name="notes"
                        label="Notes"
                        rows={3}
                      />
                    </Stack>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button variant="secondary" slot="close">
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Create Booking
                    </Button>
                  </Dialog.Actions>
                </Form>
              )}
            </Dialog>
          </Dialog.Trigger>
        </Inline>

        <Tabs
          aria-label="Booking views"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(String(key))}
        >
          <Tabs.List aria-label="View options">
            <Tabs.Item id="all">All Bookings</Tabs.Item>
            <Tabs.Item id="today">Today</Tabs.Item>
            <Tabs.Item id="week">This Week</Tabs.Item>
          </Tabs.List>
          <Tabs.TabPanel id="all">
            <Table aria-label="All bookings" size="compact">
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
                {(booking) => (
                  <Table.Row key={booking.id}>
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
                        <Menu.Item
                          id="view"
                          onAction={() => handleMenuAction(booking.id, 'view')}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item id="edit">
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          id="cancel"
                          variant="destructive"
                          onAction={() => handleMenuAction(booking.id, 'cancel')}
                        >
                          Cancel Booking
                        </Menu.Item>
                      </ActionMenu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Tabs.TabPanel>
          <Tabs.TabPanel id="today">
            <Table aria-label="Today's bookings" size="compact">
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
                {(booking) => (
                  <Table.Row key={booking.id}>
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
                        <Menu.Item
                          id="view"
                          onAction={() => handleMenuAction(booking.id, 'view')}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item id="edit">
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          id="cancel"
                          variant="destructive"
                          onAction={() => handleMenuAction(booking.id, 'cancel')}
                        >
                          Cancel Booking
                        </Menu.Item>
                      </ActionMenu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Tabs.TabPanel>
          <Tabs.TabPanel id="week">
            <Table aria-label="This week's bookings" size="compact">
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
                {(booking) => (
                  <Table.Row key={booking.id}>
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
                        <Menu.Item
                          id="view"
                          onAction={() => handleMenuAction(booking.id, 'view')}
                        >
                          View Details
                        </Menu.Item>
                        <Menu.Item id="edit">
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          id="cancel"
                          variant="destructive"
                          onAction={() => handleMenuAction(booking.id, 'cancel')}
                        >
                          Cancel Booking
                        </Menu.Item>
                      </ActionMenu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Tabs.TabPanel>
        </Tabs>
      </Stack>

      <Drawer.Trigger open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <div></div>
        <Drawer size="medium" closeButton>
          {selectedBooking && (
            <Stack space={4}>
              <Stack space={1}>
                <Headline level="2">{selectedBooking.id}</Headline>
                <Badge variant={statusVariant(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </Stack>

              <Stack space={2}>
                <Headline level="3">Customer Information</Headline>
                <Text>
                  <strong>Name:</strong> {selectedBooking.customer}
                </Text>
                <Text>
                  <strong>Email:</strong> {selectedBooking.email}
                </Text>
              </Stack>

              <Stack space={2}>
                <Headline level="3">Booking Details</Headline>
                <Text>
                  <strong>Venue:</strong> {selectedBooking.venue}
                </Text>
                <Text>
                  <strong>Date:</strong> {selectedBooking.date}
                </Text>
                <Text>
                  <strong>Time Slot:</strong> {selectedBooking.timeSlot}
                </Text>
              </Stack>

              {selectedBooking.notes && (
                <Stack space={2}>
                  <Headline level="3">Notes</Headline>
                  <Text>{selectedBooking.notes}</Text>
                </Stack>
              )}

              <Accordion>
                <Accordion.Item>
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Text>No payments recorded yet.</Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Text>Booking created on 2026-06-22</Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          )}
        </Drawer>
      </Drawer.Trigger>
    </Stack>
  );
};

export default TestApp;
