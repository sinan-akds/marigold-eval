'use client';

import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Stack,
  Inline,
  TextField,
  Select,
  Button,
  Table,
  Tabs,
  Dialog,
  Drawer,
  Menu,
  SectionMessage,
  TextArea,
  DatePicker,
  Autocomplete,
  Badge,
  Text,
  Headline,
  Accordion,
  Card,
} from '@marigold/components';

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes: string;
}

const VENUES = ['Main Hall', 'Conference Room A', 'Conference Room B', 'Rooftop Terrace', 'Workshop Studio'];

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: '2024-12-22',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate event, 150 guests',
  },
  {
    id: 'BK002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Conference Room A',
    date: '2024-12-22',
    timeSlot: '14:00-17:00',
    status: 'Pending',
    notes: 'Team meeting, refreshments required',
  },
  {
    id: 'BK003',
    customer: 'Michael Brown',
    email: 'michael@example.com',
    venue: 'Rooftop Terrace',
    date: '2024-12-21',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Wedding reception',
  },
  {
    id: 'BK004',
    customer: 'Emily Davis',
    email: 'emily@example.com',
    venue: 'Workshop Studio',
    date: '2024-12-22',
    timeSlot: '10:00-13:00',
    status: 'Cancelled',
    notes: 'Rescheduled to January',
  },
  {
    id: 'BK005',
    customer: 'David Wilson',
    email: 'david@example.com',
    venue: 'Conference Room B',
    date: '2024-12-22',
    timeSlot: '13:00-16:00',
    status: 'Confirmed',
    notes: 'Training session',
  },
  {
    id: 'BK006',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Main Hall',
    date: '2024-12-23',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch event',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'neutral';
    default:
      return 'neutral';
  }
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [filterDate, setFilterDate] = useState<DateValue | undefined>();
  const [filterVenue, setFilterVenue] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [tabView, setTabView] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    venue: '',
    date: undefined as DateValue | undefined,
    timeSlot: '',
    notes: '',
  });

  const today = '2024-12-22';
  const getDateRange = (type: string) => {
    if (type === 'today') return [today, today];
    if (type === 'week') {
      const endDate = new Date('2024-12-22');
      endDate.setDate(endDate.getDate() + 7);
      return [today, endDate.toISOString().split('T')[0]];
    }
    return [null, null];
  };

  const filteredBookings = bookings.filter((booking) => {
    const dateRange = getDateRange(tabView);
    let dateMatch = true;
    if (tabView === 'today' || tabView === 'week') {
      const [start, end] = dateRange;
      dateMatch = booking.date >= start! && booking.date <= end!;
    }

    const venueMatch = !filterVenue || booking.venue === filterVenue;
    const statusMatch = filterStatus === 'All' || booking.status === filterStatus;
    const customDateMatch = !filterDate || booking.date === `${filterDate.year}-${String(filterDate.month).padStart(2, '0')}-${String(filterDate.day).padStart(2, '0')}`;

    return dateMatch && venueMatch && statusMatch && customDateMatch;
  });

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  const handleCreateBooking = () => {
    if (newBooking.customerName && newBooking.venue && newBooking.date && newBooking.timeSlot) {
      const dateStr = `${newBooking.date.year}-${String(newBooking.date.month).padStart(2, '0')}-${String(newBooking.date.day).padStart(2, '0')}`;
      const booking: Booking = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        customer: newBooking.customerName,
        email: newBooking.customerEmail,
        venue: newBooking.venue,
        date: dateStr,
        timeSlot: newBooking.timeSlot,
        status: 'Pending',
        notes: newBooking.notes,
      };
      setBookings([...bookings, booking]);
      setNewBooking({ customerName: '', customerEmail: '', venue: '', date: undefined, timeSlot: '', notes: '' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleCancelBooking = () => {
    if (selectedBookingId) {
      setBookings(
        bookings.map((b) =>
          b.id === selectedBookingId ? { ...b, status: 'Cancelled' } : b,
        ),
      );
      setIsDetailsPanelOpen(false);
      setSelectedBookingId(null);
    }
  };

  const clearFilters = () => {
    setFilterDate(undefined);
    setFilterVenue('');
    setFilterStatus('All');
    setTabView('all');
  };

  const venueCapacity: { [key: string]: number } = {
    'Main Hall': 2,
    'Conference Room A': 5,
    'Conference Room B': 3,
    'Rooftop Terrace': 1,
    'Workshop Studio': 4,
  };

  const getNearlyFullVenue = () => {
    for (const [venue, remaining] of Object.entries(venueCapacity)) {
      if (remaining <= 2) {
        return { venue, remaining };
      }
    }
    return null;
  };

  const nearlyFull = getNearlyFullVenue();

  return (
    <Stack space="related">
      {nearlyFull && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
          <SectionMessage.Content>
            {nearlyFull.venue} has only {nearlyFull.remaining} slots remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      )}

      <Inline space="related" alignY="center">
        <Button onPress={() => setIsCreateDialogOpen(true)} variant="primary">
          New Booking
        </Button>
      </Inline>

      <Stack space="related">
        <Headline level="2">Filter Bookings</Headline>
        <Inline space="related">
          <DatePicker
            label="Date"
            value={filterDate}
            onChange={(date) => setFilterDate(date ?? undefined)}
          />
          <Autocomplete
            label="Venue"
            value={filterVenue}
            onSelectionChange={(key) => setFilterVenue(key as string)}
            items={VENUES.map((v) => ({ key: v, label: v }))}
          />
          <Select
            label="Status"
            value={filterStatus}
            onSelectionChange={(key) => setFilterStatus(key as string)}
          >
            <Select.Option id="All">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button onPress={clearFilters} variant="secondary">
            Clear Filters
          </Button>
        </Inline>
      </Stack>

      <Tabs selectedKey={tabView} onSelectionChange={(key) => setTabView(key as string)}>
        <Tabs.List>
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
      </Tabs>

      <Table>
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
          {filteredBookings.map((booking) => (
            <Table.Row key={booking.id}>
              <Table.Cell>{booking.id}</Table.Cell>
              <Table.Cell>{booking.customer}</Table.Cell>
              <Table.Cell>{booking.venue}</Table.Cell>
              <Table.Cell>{booking.date}</Table.Cell>
              <Table.Cell>{booking.timeSlot}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Menu
                  label="..."
                  onAction={(action) => {
                    if (action === 'details') {
                      setSelectedBookingId(booking.id);
                      setIsDetailsPanelOpen(true);
                    } else if (action === 'cancel') {
                      setBookings(
                        bookings.map((b) =>
                          b.id === booking.id ? { ...b, status: 'Cancelled' } : b,
                        ),
                      );
                    }
                  }}
                >
                  <Menu.Item id="details">View Details</Menu.Item>
                  <Menu.Item id="edit">Edit</Menu.Item>
                  <Menu.Item id="cancel" variant="destructive">
                    Cancel Booking
                  </Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <Stack space="related">
          <Headline>Create New Booking</Headline>
          <Stack space="related">
            <TextField
              label="Customer Name *"
              required
              value={newBooking.customerName}
              onChange={(value) =>
                setNewBooking({ ...newBooking, customerName: value })
              }
            />
            <TextField
              label="Customer Email"
              type="email"
              value={newBooking.customerEmail}
              onChange={(value) =>
                setNewBooking({ ...newBooking, customerEmail: value })
              }
            />
            <Select
              label="Venue *"
              required
              value={newBooking.venue}
              onSelectionChange={(key) =>
                setNewBooking({ ...newBooking, venue: key as string })
              }
            >
              {VENUES.map((v) => (
                <Select.Option key={v} id={v}>
                  {v}
                </Select.Option>
              ))}
            </Select>
            <DatePicker
              label="Date *"
              value={newBooking.date}
              onChange={(date) =>
                setNewBooking({
                  ...newBooking,
                  date: date ?? undefined,
                })
              }
            />
            <Select
              label="Time Slot *"
              required
              value={newBooking.timeSlot}
              onSelectionChange={(key) =>
                setNewBooking({ ...newBooking, timeSlot: key as string })
              }
            >
              <Select.Option id="09:00-12:00">09:00-12:00</Select.Option>
              <Select.Option id="12:00-15:00">12:00-15:00</Select.Option>
              <Select.Option id="15:00-18:00">15:00-18:00</Select.Option>
              <Select.Option id="18:00-21:00">18:00-21:00</Select.Option>
            </Select>
            <TextArea
              label="Notes"
              value={newBooking.notes}
              onChange={(value) => setNewBooking({ ...newBooking, notes: value })}
            />
            <Inline space="related">
              <Button
                onPress={() => setIsCreateDialogOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onPress={handleCreateBooking} variant="primary">
                Create Booking
              </Button>
            </Inline>
          </Stack>
        </Stack>
      </Dialog>

      {isDetailsPanelOpen && selectedBooking && (
        <Drawer>
          <Drawer.Title>{`Booking Details: ${selectedBooking.id}`}</Drawer.Title>
          <Drawer.Content>
            <Stack space="related">
              <Card>
                <Stack space="tight">
                  <Text>
                    <strong>Status:</strong> {selectedBooking.status}
                  </Text>
                </Stack>
              </Card>

              <Card>
                <Headline level="4">Customer Information</Headline>
                <Stack space="tight">
                  <Text>
                    <strong>Name:</strong> {selectedBooking.customer}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {selectedBooking.email}
                  </Text>
                </Stack>
              </Card>

              <Card>
                <Headline level="4">Booking Details</Headline>
                <Stack space="tight">
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
              </Card>

              {selectedBooking.notes && (
                <Card>
                  <Headline level="4">Notes</Headline>
                  <Text>{selectedBooking.notes}</Text>
                </Card>
              )}

              <Accordion>
                <Accordion.Item>
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Text>No payments recorded yet</Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item>
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Text>Booking confirmation sent on 2024-12-20</Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </Drawer.Content>
          <Drawer.Actions>
            <Button
              onPress={() => setIsDetailsPanelOpen(false)}
              variant="secondary"
              slot="close"
            >
              Close
            </Button>
            {selectedBooking.status !== 'Cancelled' && (
              <Button onPress={handleCancelBooking} variant="negative" slot="close">
                Cancel Booking
              </Button>
            )}
          </Drawer.Actions>
        </Drawer>
      )}
    </Stack>
  );
};

export default TestApp;
