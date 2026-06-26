'use client';

import { useState } from 'react';
import {
  Autocomplete,
  Badge,
  Button,
  Dialog,
  Drawer,
  Form,
  Inline,
  Inset,
  Select,
  SectionMessage,
  Stack,
  Table,
  Tabs,
  Text,
  TextField,
  TextArea,
  DatePicker,
  Accordion,
  Menu,
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
  notes: string;
  paymentHistory: string[];
  communicationLog: string[];
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
    id: 'BK-001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Wedding reception setup needed',
    paymentHistory: ['$5000 paid on 2026-06-01'],
    communicationLog: ['Confirmed on 2026-06-15', 'Reminder sent on 2026-06-22'],
  },
  {
    id: 'BK-002',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Conference Room A',
    date: '2026-06-23',
    timeSlot: '14:00-17:00',
    status: 'Pending',
    notes: 'Board meeting - catering needed',
    paymentHistory: ['Awaiting payment'],
    communicationLog: ['Booking requested on 2026-06-20'],
  },
  {
    id: 'BK-003',
    customer: 'Robert Brown',
    email: 'robert@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-24',
    timeSlot: '10:00-13:00',
    status: 'Confirmed',
    notes: 'Art workshop - materials provided',
    paymentHistory: ['$1500 paid on 2026-06-10'],
    communicationLog: [
      'Confirmed on 2026-06-12',
      'Materials list sent on 2026-06-18',
    ],
  },
  {
    id: 'BK-004',
    customer: 'Sarah Davis',
    email: 'sarah@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-20',
    timeSlot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Weather-related cancellation',
    paymentHistory: ['$3000 refunded on 2026-06-22'],
    communicationLog: [
      'Booking cancelled on 2026-06-22',
      'Refund processed',
    ],
  },
  {
    id: 'BK-005',
    customer: 'Michael Wilson',
    email: 'michael@example.com',
    venue: 'Conference Room B',
    date: '2026-06-26',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Annual conference - 200+ attendees',
    paymentHistory: ['$8000 paid on 2026-06-05'],
    communicationLog: [
      'Confirmed on 2026-06-08',
      'Final attendee count received on 2026-06-21',
    ],
  },
  {
    id: 'BK-006',
    customer: 'Emma Martinez',
    email: 'emma@example.com',
    venue: 'Main Hall',
    date: '2026-06-22',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Corporate event - special requests pending',
    paymentHistory: ['$2000 paid on 2026-06-15'],
    communicationLog: ['Booking confirmed on 2026-06-18'],
  },
];

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const isToday = (dateStr: string) => {
  const today = new Date();
  const bookingDate = new Date(dateStr);
  return (
    today.getFullYear() === bookingDate.getFullYear() &&
    today.getMonth() === bookingDate.getMonth() &&
    today.getDate() === bookingDate.getDate()
  );
};

const isThisWeek = (dateStr: string) => {
  const today = new Date();
  const bookingDate = new Date(dateStr);
  const currentDay = today.getDay();
  const distance = bookingDate.getTime() - today.getTime();
  const daysAhead = Math.ceil(distance / (1000 * 60 * 60 * 24));
  const dayOfWeek = bookingDate.getDay();

  return (
    daysAhead >= 0 &&
    daysAhead <= 6 - currentDay &&
    dayOfWeek >= currentDay
  );
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterVenue, setFilterVenue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    customer: '',
    email: '',
    venue: '',
    date: null as any,
    timeSlot: '',
    notes: '',
  });

  const filteredBookings = bookings.filter(booking => {
    let matches = true;

    if (activeTab === 'today') {
      matches = matches && isToday(booking.date);
    } else if (activeTab === 'week') {
      matches = matches && isThisWeek(booking.date);
    }

    if (filterDate) {
      matches = matches && booking.date === filterDate;
    }

    if (filterVenue) {
      matches = matches && booking.venue === filterVenue;
    }

    if (filterStatus !== 'All') {
      matches = matches && booking.status === filterStatus;
    }

    return matches;
  });

  const handleCreateBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newBooking: Booking = {
      id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formData.get('customer') as string,
      email: formData.get('email') as string,
      venue: formData.get('venue') as string,
      date: newBookingData.date
        ? `${newBookingData.date.year}-${String(newBookingData.date.month).padStart(2, '0')}-${String(newBookingData.date.day).padStart(2, '0')}`
        : new Date().toISOString().split('T')[0],
      timeSlot: formData.get('timeSlot') as string,
      status: 'Pending',
      notes: formData.get('notes') as string,
      paymentHistory: ['Awaiting payment'],
      communicationLog: [
        `Booking created on ${new Date().toLocaleDateString()}`,
      ],
    };
    setBookings([...bookings, newBooking]);
    setNewBookingData({
      customer: '',
      email: '',
      venue: '',
      date: null,
      timeSlot: '',
      notes: '',
    });
  };

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue(null);
    setFilterStatus('All');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(
      bookings.map(b =>
        b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b
      )
    );
    setShowDetailPanel(false);
  };

  const venueCapacity: { [key: string]: number } = {
    'Main Hall': 2,
    'Conference Room A': 5,
    'Conference Room B': 3,
    'Rooftop Terrace': 1,
    'Workshop Studio': 4,
  };

  const checkCapacity = () => {
    const today = new Date().toISOString().split('T')[0];
    for (const venue of VENUES) {
      const todayBookings = bookings.filter(
        b => b.venue === venue && b.date === today && b.status !== 'Cancelled'
      );
      if (todayBookings.length >= venueCapacity[venue]) {
        return venue;
      }
    }
    return null;
  };

  const nearFullVenue = checkCapacity();

  return (
    <Stack space={6}>
      <Inset space={6}>
        <Stack space={6}>
          <Text weight="bold" size="large">
            Booking Management
          </Text>

          {nearFullVenue && (
            <SectionMessage variant="warning" closeButton>
              <SectionMessage.Title>Venue Capacity Alert</SectionMessage.Title>
              <SectionMessage.Content>
                {nearFullVenue} has only {venueCapacity[nearFullVenue] - bookings.filter(b => b.venue === nearFullVenue && b.date === new Date().toISOString().split('T')[0] && b.status !== 'Cancelled').length} slots remaining for today.
              </SectionMessage.Content>
            </SectionMessage>
          )}

          <Inline space={2}>
            <Dialog.Trigger>
              <Button variant="primary">New Booking</Button>
              <Dialog size="small">
                <Dialog.Title>Create New Booking</Dialog.Title>
                <Dialog.Content>
                  <Form onSubmit={handleCreateBooking}>
                    <Stack space={4} alignX="left">
                      <TextField
                        label="Customer Name"
                        name="customer"
                        required
                        autoFocus
                      />
                      <TextField
                        label="Customer Email"
                        name="email"
                        type="email"
                      />
                      <Select
                        label="Venue"
                        name="venue"
                        required
                        onSelectionChange={(key) =>
                          setNewBookingData({
                            ...newBookingData,
                            venue: key as string,
                          })
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
                        value={newBookingData.date}
                        onChange={date =>
                          setNewBookingData({ ...newBookingData, date })
                        }
                      />
                      <Select
                        label="Time Slot"
                        name="timeSlot"
                        required
                        onSelectionChange={(key) =>
                          setNewBookingData({
                            ...newBookingData,
                            timeSlot: key as string,
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
                        name="notes"
                        description="Optional booking notes"
                      />
                      <Inline space={2} alignX="right">
                        <Button variant="secondary" slot="close">
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit" slot="close">
                          Create Booking
                        </Button>
                      </Inline>
                    </Stack>
                  </Form>
                </Dialog.Content>
              </Dialog>
            </Dialog.Trigger>
          </Inline>

          <Stack space={4}>
            <Text weight="bold">Filters</Text>
            <Inline space={2}>
              <DatePicker
                label="Date"
                value={filterDate ? parseDate(filterDate) : null}
                onChange={(date) =>
                  setFilterDate(
                    date
                      ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
                      : null
                  )
                }
              />
              <Autocomplete
                label="Venue"
                placeholder="Search venues..."
                onSelectionChange={(key) =>
                  setFilterVenue(key as string | null)
                }
              >
                {VENUES.map(venue => (
                  <Autocomplete.Option key={venue} id={venue}>
                    {venue}
                  </Autocomplete.Option>
                ))}
              </Autocomplete>
              <Select
                label="Status"
                onSelectionChange={(key) => setFilterStatus(key as string)}
              >
                <Select.Option id="All">All</Select.Option>
                <Select.Option id="Confirmed">Confirmed</Select.Option>
                <Select.Option id="Pending">Pending</Select.Option>
                <Select.Option id="Cancelled">Cancelled</Select.Option>
              </Select>
              <Button variant="secondary" onPress={handleClearFilters}>
                Clear Filters
              </Button>
            </Inline>
          </Stack>

          <Tabs aria-label="booking-tabs" selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
            <Tabs.List aria-label="Booking views">
              <Tabs.Item id="all">All Bookings</Tabs.Item>
              <Tabs.Item id="today">Today</Tabs.Item>
              <Tabs.Item id="week">This Week</Tabs.Item>
            </Tabs.List>

            <Tabs.TabPanel id="all">
              <Stack space={4}>
                <Table aria-label="Bookings table">
                  <Table.Header>
                    <Table.Column>Booking ID</Table.Column>
                    <Table.Column>Customer</Table.Column>
                    <Table.Column>Venue</Table.Column>
                    <Table.Column>Date</Table.Column>
                    <Table.Column>Time Slot</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body items={filteredBookings}>
                    {filteredBookings.map(booking => (
                      <Table.Row key={booking.id}>
                        <Table.Cell>{booking.id}</Table.Cell>
                        <Table.Cell>{booking.customer}</Table.Cell>
                        <Table.Cell>{booking.venue}</Table.Cell>
                        <Table.Cell>{formatDate(booking.date)}</Table.Cell>
                        <Table.Cell>{booking.timeSlot}</Table.Cell>
                        <Table.Cell>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu label="..." size="small">
                            <Menu.Item
                              id="view"
                              onAction={() => {
                                setSelectedBooking(booking);
                                setShowDetailPanel(true);
                              }}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item id="edit">Edit</Menu.Item>
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
                    ))}
                  </Table.Body>
                </Table>
              </Stack>
            </Tabs.TabPanel>

            <Tabs.TabPanel id="today">
              <Stack space={4}>
                <Table aria-label="Today's bookings table">
                  <Table.Header>
                    <Table.Column>Booking ID</Table.Column>
                    <Table.Column>Customer</Table.Column>
                    <Table.Column>Venue</Table.Column>
                    <Table.Column>Date</Table.Column>
                    <Table.Column>Time Slot</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body items={filteredBookings}>
                    {filteredBookings.map(booking => (
                      <Table.Row key={booking.id}>
                        <Table.Cell>{booking.id}</Table.Cell>
                        <Table.Cell>{booking.customer}</Table.Cell>
                        <Table.Cell>{booking.venue}</Table.Cell>
                        <Table.Cell>{formatDate(booking.date)}</Table.Cell>
                        <Table.Cell>{booking.timeSlot}</Table.Cell>
                        <Table.Cell>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu label="..." size="small">
                            <Menu.Item
                              id="view"
                              onAction={() => {
                                setSelectedBooking(booking);
                                setShowDetailPanel(true);
                              }}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item id="edit">Edit</Menu.Item>
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
                    ))}
                  </Table.Body>
                </Table>
              </Stack>
            </Tabs.TabPanel>

            <Tabs.TabPanel id="week">
              <Stack space={4}>
                <Table aria-label="This week's bookings table">
                  <Table.Header>
                    <Table.Column>Booking ID</Table.Column>
                    <Table.Column>Customer</Table.Column>
                    <Table.Column>Venue</Table.Column>
                    <Table.Column>Date</Table.Column>
                    <Table.Column>Time Slot</Table.Column>
                    <Table.Column>Status</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body items={filteredBookings}>
                    {filteredBookings.map(booking => (
                      <Table.Row key={booking.id}>
                        <Table.Cell>{booking.id}</Table.Cell>
                        <Table.Cell>{booking.customer}</Table.Cell>
                        <Table.Cell>{booking.venue}</Table.Cell>
                        <Table.Cell>{formatDate(booking.date)}</Table.Cell>
                        <Table.Cell>{booking.timeSlot}</Table.Cell>
                        <Table.Cell>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Menu label="..." size="small">
                            <Menu.Item
                              id="view"
                              onAction={() => {
                                setSelectedBooking(booking);
                                setShowDetailPanel(true);
                              }}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item id="edit">Edit</Menu.Item>
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
                    ))}
                  </Table.Body>
                </Table>
              </Stack>
            </Tabs.TabPanel>
          </Tabs>
        </Stack>
      </Inset>

      {showDetailPanel && selectedBooking && (
        <Drawer.Trigger
          defaultOpen={true}
          onOpenChange={(open) => {
            if (!open) setShowDetailPanel(false);
          }}
        >
          <div />
          <Drawer>
            <Stack space={6}>
              <Stack space={2}>
                <Text weight="bold">Booking Details</Text>
                <Inline space={2}>
                  <Text>
                    <strong>ID:</strong> {selectedBooking.id}
                  </Text>
                  <Badge variant={getStatusVariant(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </Inline>
              </Stack>

              <Stack space={4}>
                <Stack space={1}>
                  <Text weight="bold">Customer Information</Text>
                  <Text>
                    <strong>Name:</strong> {selectedBooking.customer}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {selectedBooking.email}
                  </Text>
                </Stack>

                <Stack space={1}>
                  <Text weight="bold">Booking Details</Text>
                  <Text>
                    <strong>Venue:</strong> {selectedBooking.venue}
                  </Text>
                  <Text>
                    <strong>Date:</strong> {formatDate(selectedBooking.date)}
                  </Text>
                  <Text>
                    <strong>Time Slot:</strong> {selectedBooking.timeSlot}
                  </Text>
                </Stack>

                {selectedBooking.notes && (
                  <Stack space={1}>
                    <Text weight="bold">Notes</Text>
                    <Text>{selectedBooking.notes}</Text>
                  </Stack>
                )}

                <Accordion>
                  <Accordion.Item id="payment">
                    <Accordion.Header>
                      Payment History (
                      {selectedBooking.paymentHistory.length})
                    </Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        {selectedBooking.paymentHistory.map(
                          (payment, idx) => (
                            <Text key={idx}>{payment}</Text>
                          )
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="communication">
                    <Accordion.Header>
                      Communication Log (
                      {selectedBooking.communicationLog.length})
                    </Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        {selectedBooking.communicationLog.map((log, idx) => (
                          <Text key={idx}>{log}</Text>
                        ))}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Inline space={2} alignX="between">
                  <Button
                    variant="secondary"
                    onPress={() => setShowDetailPanel(false)}
                  >
                    Close
                  </Button>
                  {selectedBooking.status !== 'Cancelled' && (
                    <Button
                      variant="destructive"
                      onPress={() => {
                        handleCancelBooking(selectedBooking.id);
                        setShowDetailPanel(false);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Inline>
              </Stack>
            </Stack>
          </Drawer>
        </Drawer.Trigger>
      )}
    </Stack>
  );
};

export default TestApp;
