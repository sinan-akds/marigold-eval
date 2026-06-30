'use client';

import { useState } from 'react';
import {
  Stack,
  Inline,
  Columns,
  Table,
  Button,
  TextField,
  ComboBox,
  Select,
  Dialog,
  TextArea,
  Badge,
  Tabs,
  SectionMessage,
  Headline,
  Menu,
  ActionMenu,
  Accordion,
  Text,
  Scrollable,
  AppLayout,
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

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: '2025-06-28',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Wedding reception',
  },
  {
    id: 'BK002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Conference Room A',
    date: '2025-06-28',
    timeSlot: '14:00-15:00',
    status: 'Pending',
    notes: 'Team meeting',
  },
  {
    id: 'BK003',
    customer: 'Michael Chen',
    email: 'michael@example.com',
    venue: 'Rooftop Terrace',
    date: '2025-06-29',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Corporate event',
  },
  {
    id: 'BK004',
    customer: 'Emily Davis',
    email: 'emily@example.com',
    venue: 'Workshop Studio',
    date: '2025-06-28',
    timeSlot: '10:00-11:00',
    status: 'Cancelled',
    notes: 'Workshop session',
  },
  {
    id: 'BK005',
    customer: 'James Wilson',
    email: 'james@example.com',
    venue: 'Conference Room B',
    date: '2025-06-30',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Training session',
  },
  {
    id: 'BK006',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Main Hall',
    date: '2025-07-01',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch',
  },
];

const getStatusBadgeVariant = (status: string) => {
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const isToday = (dateString: string) => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const isThisWeek = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return date >= weekStart && date <= weekEnd;
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterVenue, setFilterVenue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customer: '',
    email: '',
    venue: '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  const filteredBookings = bookings.filter(booking => {
    let matches = true;

    if (filterDate) {
      matches = matches && booking.date === filterDate;
    }

    if (filterVenue) {
      matches = matches && booking.venue === filterVenue;
    }

    if (filterStatus !== 'All') {
      matches = matches && booking.status === filterStatus;
    }

    if (activeTab === 'today') {
      matches = matches && isToday(booking.date);
    } else if (activeTab === 'week') {
      matches = matches && isThisWeek(booking.date);
    }

    return matches;
  });

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterVenue(null);
    setFilterStatus('All');
    setActiveTab('all');
  };

  const handleCreateBooking = () => {
    if (
      newBooking.customer &&
      newBooking.email &&
      newBooking.venue &&
      newBooking.date &&
      newBooking.timeSlot
    ) {
      const booking: Booking = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        customer: newBooking.customer,
        email: newBooking.email,
        venue: newBooking.venue,
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        status: 'Pending',
        notes: newBooking.notes,
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
      setNewBookingOpen(false);
    }
  };

  const handleCancelBooking = (id: string) => {
    setBookings(
      bookings.map(b =>
        b.id === id ? { ...b, status: 'Cancelled' } : b
      )
    );
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailPanelOpen(true);
  };

  const venueCapacity = {
    'Main Hall': { capacity: 10, booked: 8 },
    'Conference Room A': { capacity: 5, booked: 4 },
    'Conference Room B': { capacity: 5, booked: 3 },
    'Rooftop Terrace': { capacity: 15, booked: 12 },
    'Workshop Studio': { capacity: 8, booked: 6 },
  } as Record<string, { capacity: number; booked: number }>;

  const mainHallRemaining =
    venueCapacity['Main Hall'].capacity -
    venueCapacity['Main Hall'].booked;
  const showCapacityAlert = mainHallRemaining <= 3;

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={4} alignX="stretch">
          <Stack space={3} alignX="stretch">
        <Headline level="1">Booking Management</Headline>

        {showCapacityAlert && (
          <SectionMessage variant="warning">
            <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
            <SectionMessage.Content>
              Main Hall has only {mainHallRemaining} slots remaining for today.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Columns columns={[1, 1, 1, 'fit']} space={3} collapseAt="50em">
          <TextField
            label="Filter by Date"
            type="date"
            value={filterDate}
            onChange={val => setFilterDate(val as string)}
          />
          <ComboBox
            label="Search Venue"
            onSelectionChange={key => setFilterVenue(key ? String(key) : null)}
            menuTrigger="focus"
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
            onSelectionChange={key =>
              setFilterStatus(key ? String(key) : 'All')
            }
          >
            <Select.Option id="All">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button variant="secondary" onPress={handleClearFilters}>
            Clear Filters
          </Button>
        </Columns>
      </Stack>

      <Stack space={3} alignX="stretch">
        <Inline space={2} alignY="center">
          <Dialog.Trigger>
            <Button variant="primary">New Booking</Button>
            <Dialog size="small">
              <Dialog.Title>Create New Booking</Dialog.Title>
              <Dialog.Content>
                <Stack space={3}>
                  <TextField
                    label="Customer Name"
                    required
                    value={newBooking.customer}
                    onChange={val =>
                      setNewBooking({
                        ...newBooking,
                        customer: val as string,
                      })
                    }
                  />
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={newBooking.email}
                    onChange={val =>
                      setNewBooking({
                        ...newBooking,
                        email: val as string,
                      })
                    }
                  />
                  <Select
                    label="Venue"
                    required
                    selectedKey={newBooking.venue}
                    onSelectionChange={key =>
                      setNewBooking({
                        ...newBooking,
                        venue: key ? String(key) : '',
                      })
                    }
                  >
                    {VENUES.map(venue => (
                      <Select.Option key={venue} id={venue}>
                        {venue}
                      </Select.Option>
                    ))}
                  </Select>
                  <TextField
                    label="Date"
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={val =>
                      setNewBooking({
                        ...newBooking,
                        date: val as string,
                      })
                    }
                  />
                  <Select
                    label="Time Slot"
                    required
                    selectedKey={newBooking.timeSlot}
                    onSelectionChange={key =>
                      setNewBooking({
                        ...newBooking,
                        timeSlot: key ? String(key) : '',
                      })
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
                    rows={3}
                    value={newBooking.notes}
                    onChange={val =>
                      setNewBooking({
                        ...newBooking,
                        notes: val as string,
                      })
                    }
                  />
                </Stack>
              </Dialog.Content>
              <Dialog.Actions>
                <Button variant="secondary" slot="close">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleCreateBooking}
                  slot="close"
                >
                  Create Booking
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Dialog.Trigger>

          <Tabs
            aria-label="Booking views"
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(key as string)}
          >
            <Tabs.List>
              <Tabs.Item id="all">All Bookings</Tabs.Item>
              <Tabs.Item id="today">Today</Tabs.Item>
              <Tabs.Item id="week">This Week</Tabs.Item>
            </Tabs.List>
          </Tabs>
        </Inline>

        <Scrollable>
          <Table aria-label="Bookings table" selectionMode="none">
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
                <Table.Row key={booking.id} id={booking.id}>
                  <Table.Cell>{booking.id}</Table.Cell>
                  <Table.Cell>{booking.customer}</Table.Cell>
                  <Table.Cell>{booking.venue}</Table.Cell>
                  <Table.Cell>{formatDate(booking.date)}</Table.Cell>
                  <Table.Cell>{booking.timeSlot}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <ActionMenu>
                      <ActionMenu.Item
                        id={`view-${booking.id}`}
                        onAction={() => handleViewDetails(booking)}
                      >
                        View Details
                      </ActionMenu.Item>
                      <ActionMenu.Item id={`edit-${booking.id}`}>Edit</ActionMenu.Item>
                      <ActionMenu.Item
                        id={`cancel-${booking.id}`}
                        onAction={() => handleCancelBooking(booking.id)}
                        variant="destructive"
                      >
                        Cancel Booking
                      </ActionMenu.Item>
                    </ActionMenu>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Scrollable>
      </Stack>

      {isDetailPanelOpen && selectedBooking && (
        <Stack space={4} alignX="stretch">
          <Inline space={2} alignX="between" alignY="center">
            <Headline level="3">Booking Details</Headline>
            <Button
              variant="ghost"
              size="small"
              onPress={() => setIsDetailPanelOpen(false)}
              aria-label="Close details panel"
            >
              ✕
            </Button>
          </Inline>

          <Stack space={3}>
            <Stack space={2}>
              <Headline level="5">Booking ID & Status</Headline>
              <Inline space={2}>
                <Text size="sm" weight="medium">
                  {selectedBooking.id}
                </Text>
                <Badge
                  variant={getStatusBadgeVariant(selectedBooking.status)}
                >
                  {selectedBooking.status}
                </Badge>
              </Inline>
            </Stack>

            <Stack space={2}>
              <Headline level="5">Customer Information</Headline>
              <Stack space={1}>
                <Text size="sm">
                  <Text weight="bold">Name:</Text> {selectedBooking.customer}
                </Text>
                <Text size="sm">
                  <Text weight="bold">Email:</Text> {selectedBooking.email}
                </Text>
              </Stack>
            </Stack>

            <Stack space={2}>
              <Headline level="5">Booking Details</Headline>
              <Stack space={1}>
                <Text size="sm">
                  <Text weight="bold">Venue:</Text> {selectedBooking.venue}
                </Text>
                <Text size="sm">
                  <Text weight="bold">Date:</Text>{' '}
                  {formatDate(selectedBooking.date)}
                </Text>
                <Text size="sm">
                  <Text weight="bold">Time:</Text> {selectedBooking.timeSlot}
                </Text>
              </Stack>
            </Stack>

            {selectedBooking.notes && (
              <Stack space={2}>
                <Headline level="5">Notes</Headline>
                <Text size="sm">{selectedBooking.notes}</Text>
              </Stack>
            )}

            <Accordion>
              <Accordion.Item>
                <Accordion.Header>Payment History</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2}>
                    <Text size="sm">
                      <Text weight="bold">Amount:</Text> $500.00
                    </Text>
                    <Text size="sm">
                      <Text weight="bold">Status:</Text> Paid
                    </Text>
                    <Text size="sm">
                      <Text weight="bold">Date:</Text> 2025-06-15
                    </Text>
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Communication Log</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2} asList>
                    <Text size="sm">
                      2025-06-20: Confirmation email sent
                    </Text>
                    <Text size="sm">2025-06-18: Booking confirmed</Text>
                    <Text size="sm">2025-06-15: Initial booking created</Text>
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Stack>
      )}
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
