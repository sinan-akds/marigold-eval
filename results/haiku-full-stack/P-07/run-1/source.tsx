import React, { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Stack,
  Inline,
  Table,
  TextField,
  Select,
  DatePicker,
  Dialog,
  Menu,
  Tabs,
  TextArea,
  Text,
  Headline,
  ComboBox,
  Scrollable,
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
  paymentHistory?: string[];
  communicationLog?: string[];
}

const VENUES = ['Main Hall', 'Conference Room A', 'Conference Room B', 'Rooftop Terrace', 'Workshop Studio'];

const INITIAL_BOOKINGS: Booking[] = [
  { id: 'BK-001', customer: 'John Smith', email: 'john@example.com', venue: 'Main Hall', date: '2025-06-28', timeSlot: '09:00-12:00', status: 'Confirmed', notes: 'Corporate event', paymentHistory: ['Paid 50% on 2025-06-20', 'Final payment pending'], communicationLog: ['Initial booking confirmed', 'Sent reminder email'] },
  { id: 'BK-002', customer: 'Sarah Johnson', email: 'sarah@example.com', venue: 'Conference Room A', date: '2025-06-28', timeSlot: '12:00-15:00', status: 'Pending', notes: 'Team meeting', paymentHistory: ['Awaiting payment'], communicationLog: ['Booking awaiting confirmation'] },
  { id: 'BK-003', customer: 'Mike Wilson', email: 'mike@example.com', venue: 'Rooftop Terrace', date: '2025-06-27', timeSlot: '15:00-18:00', status: 'Confirmed', notes: 'Sunset party', paymentHistory: ['Paid in full on 2025-06-15'], communicationLog: ['Confirmed', 'Sent venue details'] },
  { id: 'BK-004', customer: 'Emma Davis', email: 'emma@example.com', venue: 'Workshop Studio', date: '2025-06-29', timeSlot: '09:00-12:00', status: 'Cancelled', notes: 'Client cancelled', paymentHistory: ['Refunded 100%'], communicationLog: ['Cancellation requested', 'Refund processed'] },
  { id: 'BK-005', customer: 'David Brown', email: 'david@example.com', venue: 'Main Hall', date: '2025-06-30', timeSlot: '18:00-21:00', status: 'Confirmed', notes: 'Wedding reception', paymentHistory: ['Deposit paid on 2025-06-10', 'Final payment 2025-07-15'], communicationLog: ['Venue tour completed', 'Menu finalized'] },
  { id: 'BK-006', customer: 'Lisa Anderson', email: 'lisa@example.com', venue: 'Conference Room B', date: '2025-06-28', timeSlot: '15:00-18:00', status: 'Pending', notes: 'Product launch', paymentHistory: ['Awaiting payment'], communicationLog: ['Initial inquiry received'] },
];

const TestApp: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterVenue, setFilterVenue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [tabSelection, setTabSelection] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newBooking, setNewBooking] = useState({
    customer: '',
    email: '',
    venue: '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  const getStatusVariant = (status: string) => {
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

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const weekStart = today;
  const weekEnd = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);

  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Tab filtering
    if (tabSelection === 'today') {
      result = result.filter(b => b.date === todayStr);
    } else if (tabSelection === 'week') {
      const weekEndStr = weekEnd.toISOString().split('T')[0];
      result = result.filter(
        b => b.date >= todayStr && b.date <= weekEndStr
      );
    }

    // Date filter
    if (filterDate) {
      result = result.filter(b => b.date === filterDate);
    }

    // Venue filter
    if (filterVenue) {
      result = result.filter(b => b.venue === filterVenue);
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(b => b.status === filterStatus);
    }

    return result;
  }, [bookings, tabSelection, filterDate, filterVenue, filterStatus]);

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue(null);
    setFilterStatus('all');
  };

  const handleCreateBooking = () => {
    if (!newBooking.customer || !newBooking.email || !newBooking.venue || !newBooking.date || !newBooking.timeSlot) {
      return;
    }

    const booking: Booking = {
      id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
      customer: newBooking.customer,
      email: newBooking.email,
      venue: newBooking.venue,
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      status: 'Pending',
      notes: newBooking.notes,
      paymentHistory: ['Awaiting payment'],
      communicationLog: ['Booking created'],
    };

    setBookings([...bookings, booking]);
    setNewBooking({
      customer: '',
      email: '',
      venue: '',
      date: '',
      timeSlot: '',
      notes: '',
    });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
    ));
  };

  const handleEditBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
    }
  };

  // Capacity alert
  const mainHallTodayCount = bookings.filter(
    b => b.venue === 'Main Hall' && b.date === todayStr && b.status !== 'Cancelled'
  ).length;
  const maxCapacity = 6;
  const remainingSlots = maxCapacity - mainHallTodayCount;
  const showCapacityAlert = remainingSlots <= 2 && remainingSlots > 0;

  return (
    <Stack space="regular">
      <Headline level="1">Booking Management</Headline>

      {showCapacityAlert && (
        <Text>
          ⚠️ Main Hall has only {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining for today.
        </Text>
      )}

      <Stack space="tight">
        <Headline level="2">Filters</Headline>
        <Inline space="group" alignY="center" noWrap>
          <DatePicker
            label="Date"
            value={filterDate ? parseDate(filterDate) : null}
            onChange={(date) => setFilterDate(date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : null)}
          />
          <ComboBox
            label="Venue"
            menuTrigger="focus"
            onSelectionChange={(key) => setFilterVenue(key ? String(key) : null)}
          >
            {VENUES.map(venue => (
              <ComboBox.Option key={venue} id={venue}>
                {venue}
              </ComboBox.Option>
            ))}
          </ComboBox>
          <Select
            label="Status"
            value={filterStatus}
            onSelectionChange={(key) => setFilterStatus(String(key))}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button variant="secondary" onPress={handleClearFilters}>
            Clear Filters
          </Button>
        </Inline>
      </Stack>

      <Stack space="tight">
        <Headline level="2">Bookings</Headline>
        <Tabs aria-label="booking tabs">
          <Tabs.List aria-label="Booking views">
            <Tabs.Item id="all">All Bookings</Tabs.Item>
            <Tabs.Item id="today">Today</Tabs.Item>
            <Tabs.Item id="week">This Week</Tabs.Item>
          </Tabs.List>
          <Tabs.TabPanel id="all">
            <Stack space="regular">
              <Dialog.Trigger>
                <Button variant="primary">New Booking</Button>
                <Dialog size="medium">
                  <Dialog.Title>Create New Booking</Dialog.Title>
                  <Dialog.Content>
                    <Stack space="regular">
                      <TextField
                        label="Customer Name"
                        required
                        value={newBooking.customer}
                        onChange={(val) => setNewBooking({ ...newBooking, customer: val })}
                      />
                      <TextField
                        label="Customer Email"
                        type="email"
                        value={newBooking.email}
                        onChange={(val) => setNewBooking({ ...newBooking, email: val })}
                      />
                      <Select
                        label="Venue"
                        value={newBooking.venue}
                        onSelectionChange={(key) => setNewBooking({ ...newBooking, venue: String(key) })}
                      >
                        {VENUES.map(venue => (
                          <Select.Option key={venue} id={venue}>
                            {venue}
                          </Select.Option>
                        ))}
                      </Select>
                      <DatePicker
                        label="Date"
                        value={newBooking.date ? parseDate(newBooking.date) : null}
                        onChange={(date) =>
                          setNewBooking({
                            ...newBooking,
                            date: date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : '',
                          })
                        }
                      />
                      <Select
                        label="Time Slot"
                        value={newBooking.timeSlot}
                        onSelectionChange={(key) => setNewBooking({ ...newBooking, timeSlot: String(key) })}
                      >
                        <Select.Option id="09:00-12:00">09:00-12:00</Select.Option>
                        <Select.Option id="12:00-15:00">12:00-15:00</Select.Option>
                        <Select.Option id="15:00-18:00">15:00-18:00</Select.Option>
                        <Select.Option id="18:00-21:00">18:00-21:00</Select.Option>
                      </Select>
                      <TextArea
                        label="Notes (optional)"
                        value={newBooking.notes}
                        onChange={(val) => setNewBooking({ ...newBooking, notes: val })}
                        rows={4}
                      />
                    </Stack>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button variant="secondary" slot="close">
                      Cancel
                    </Button>
                    <Button variant="primary" onPress={handleCreateBooking}>
                      Create Booking
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Dialog.Trigger>
              <Scrollable>
                <Table aria-label="Bookings Table" size="compact">
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
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu variant="ghost" size="icon" label="Actions">
                            <Menu.Item
                              id="view"
                              onAction={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item
                              id="edit"
                              onAction={() => handleEditBooking(booking.id)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              id="cancel"
                              variant="destructive"
                              onAction={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Menu.Item>
                          </Menu>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Scrollable>
            </Stack>
          </Tabs.TabPanel>
          <Tabs.TabPanel id="today">
            <Stack space="regular">
              <Dialog.Trigger>
                <Button variant="primary">New Booking</Button>
                <Dialog size="medium">
                  <Dialog.Title>Create New Booking</Dialog.Title>
                  <Dialog.Content>
                    <Stack space="regular">
                      <TextField
                        label="Customer Name"
                        required
                        value={newBooking.customer}
                        onChange={(val) => setNewBooking({ ...newBooking, customer: val })}
                      />
                      <TextField
                        label="Customer Email"
                        type="email"
                        value={newBooking.email}
                        onChange={(val) => setNewBooking({ ...newBooking, email: val })}
                      />
                      <Select
                        label="Venue"
                        value={newBooking.venue}
                        onSelectionChange={(key) => setNewBooking({ ...newBooking, venue: String(key) })}
                      >
                        {VENUES.map(venue => (
                          <Select.Option key={venue} id={venue}>
                            {venue}
                          </Select.Option>
                        ))}
                      </Select>
                      <DatePicker
                        label="Date"
                        value={newBooking.date ? parseDate(newBooking.date) : null}
                        onChange={(date) =>
                          setNewBooking({
                            ...newBooking,
                            date: date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : '',
                          })
                        }
                      />
                      <Select
                        label="Time Slot"
                        value={newBooking.timeSlot}
                        onSelectionChange={(key) => setNewBooking({ ...newBooking, timeSlot: String(key) })}
                      >
                        <Select.Option id="09:00-12:00">09:00-12:00</Select.Option>
                        <Select.Option id="12:00-15:00">12:00-15:00</Select.Option>
                        <Select.Option id="15:00-18:00">15:00-18:00</Select.Option>
                        <Select.Option id="18:00-21:00">18:00-21:00</Select.Option>
                      </Select>
                      <TextArea
                        label="Notes (optional)"
                        value={newBooking.notes}
                        onChange={(val) => setNewBooking({ ...newBooking, notes: val })}
                        rows={4}
                      />
                    </Stack>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button variant="secondary" slot="close">
                      Cancel
                    </Button>
                    <Button variant="primary" onPress={handleCreateBooking}>
                      Create Booking
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Dialog.Trigger>
              <Scrollable>
                <Table aria-label="Bookings Table" size="compact">
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
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu variant="ghost" size="icon" label="Actions">
                            <Menu.Item
                              id="view"
                              onAction={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item
                              id="edit"
                              onAction={() => handleEditBooking(booking.id)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              id="cancel"
                              variant="destructive"
                              onAction={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Menu.Item>
                          </Menu>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Scrollable>
            </Stack>
          </Tabs.TabPanel>
          <Tabs.TabPanel id="week">
            <Stack space="regular">
              <Dialog.Trigger>
                <Button variant="primary">New Booking</Button>
                <Dialog size="medium">
                  <Dialog.Title>Create New Booking</Dialog.Title>
                  <Dialog.Content>
                    <Stack space="regular">
                      <TextField
                        label="Customer Name"
                        required
                        value={newBooking.customer}
                        onChange={(val) => setNewBooking({ ...newBooking, customer: val })}
                      />
                      <TextField
                        label="Customer Email"
                        type="email"
                        value={newBooking.email}
                        onChange={(val) => setNewBooking({ ...newBooking, email: val })}
                      />
                      <Select
                        label="Venue"
                        value={newBooking.venue}
                        onSelectionChange={(key) => setNewBooking({ ...newBooking, venue: String(key) })}
                      >
                        {VENUES.map(venue => (
                          <Select.Option key={venue} id={venue}>
                            {venue}
                          </Select.Option>
                        ))}
                      </Select>
                      <DatePicker
                        label="Date"
                        value={newBooking.date ? parseDate(newBooking.date) : null}
                        onChange={(date) =>
                          setNewBooking({
                            ...newBooking,
                            date: date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : '',
                          })
                        }
                      />
                      <Select
                        label="Time Slot"
                        value={newBooking.timeSlot}
                        onSelectionChange={(key) => setNewBooking({ ...newBooking, timeSlot: String(key) })}
                      >
                        <Select.Option id="09:00-12:00">09:00-12:00</Select.Option>
                        <Select.Option id="12:00-15:00">12:00-15:00</Select.Option>
                        <Select.Option id="15:00-18:00">15:00-18:00</Select.Option>
                        <Select.Option id="18:00-21:00">18:00-21:00</Select.Option>
                      </Select>
                      <TextArea
                        label="Notes (optional)"
                        value={newBooking.notes}
                        onChange={(val) => setNewBooking({ ...newBooking, notes: val })}
                        rows={4}
                      />
                    </Stack>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button variant="secondary" slot="close">
                      Cancel
                    </Button>
                    <Button variant="primary" onPress={handleCreateBooking}>
                      Create Booking
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Dialog.Trigger>
              <Scrollable>
                <Table aria-label="Bookings Table" size="compact">
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
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu variant="ghost" size="icon" label="Actions">
                            <Menu.Item
                              id="view"
                              onAction={() => handleViewDetails(booking)}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item
                              id="edit"
                              onAction={() => handleEditBooking(booking.id)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Item
                              id="cancel"
                              variant="destructive"
                              onAction={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Menu.Item>
                          </Menu>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </Scrollable>
            </Stack>
          </Tabs.TabPanel>
        </Tabs>
      </Stack>

      {selectedBooking && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedBooking(null)}>
          <Dialog.Title>Booking Details</Dialog.Title>
          <Dialog.Content>
            <Stack space="regular">
              <Stack space="tight">
                <Text variant="strong">Booking ID: {selectedBooking.id}</Text>
                <Badge variant={getStatusVariant(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </Stack>

              <Stack space="tight">
                <Headline level="3">Customer Information</Headline>
                <Text>Name: {selectedBooking.customer}</Text>
                <Text>Email: {selectedBooking.email}</Text>
              </Stack>

              <Stack space="tight">
                <Headline level="3">Venue & Timing</Headline>
                <Text>Venue: {selectedBooking.venue}</Text>
                <Text>Date: {selectedBooking.date}</Text>
                <Text>Time: {selectedBooking.timeSlot}</Text>
              </Stack>

              {selectedBooking.notes && (
                <Stack space="tight">
                  <Headline level="3">Notes</Headline>
                  <Text>{selectedBooking.notes}</Text>
                </Stack>
              )}

              <Stack space="tight">
                <Headline level="3">Payment History</Headline>
                {selectedBooking.paymentHistory?.map((entry, idx) => (
                  <Text key={idx}>• {entry}</Text>
                ))}
              </Stack>

              <Stack space="tight">
                <Headline level="3">Communication Log</Headline>
                {selectedBooking.communicationLog?.map((entry, idx) => (
                  <Text key={idx}>• {entry}</Text>
                ))}
              </Stack>
            </Stack>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" slot="close">
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      )}
    </Stack>
  );
};

export default TestApp;
