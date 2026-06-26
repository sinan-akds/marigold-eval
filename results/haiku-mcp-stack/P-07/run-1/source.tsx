'use client';

import { useState } from 'react';
import {
  Accordion,
  Autocomplete,
  Badge,
  Button,
  DatePicker,
  Dialog,
  Drawer,
  Form,
  Headline,
  Inline,
  Menu,
  SectionMessage,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

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

const venues = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const timeSlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const sampleBookings: Booking[] = [
  {
    id: 'BK001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate meeting, needs projector setup',
  },
  {
    id: 'BK002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Conference Room A',
    date: '2026-06-22',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Team workshop',
  },
  {
    id: 'BK003',
    customer: 'Michael Chen',
    email: 'michael@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-26',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Evening reception',
  },
  {
    id: 'BK004',
    customer: 'Emma Davis',
    email: 'emma@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-24',
    timeSlot: '09:00-12:00',
    status: 'Cancelled',
    notes: 'Rescheduled to next month',
  },
  {
    id: 'BK005',
    customer: 'Robert Wilson',
    email: 'robert@example.com',
    venue: 'Main Hall',
    date: '2026-06-27',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Gala dinner',
  },
  {
    id: 'BK006',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Conference Room B',
    date: '2026-06-22',
    timeSlot: '15:00-18:00',
    status: 'Pending',
    notes: 'Product launch presentation',
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

const getTabFilteredBookings = (
  bookings: Booking[],
  tabId: string
): Booking[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayStr = today.toISOString().split('T')[0];

  switch (tabId) {
    case 'today':
      return bookings.filter(b => b.date === todayStr);
    case 'week': {
      const weekStart = new Date(today);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekStartStr = weekStart.toISOString().split('T')[0];
      const weekEndStr = weekEnd.toISOString().split('T')[0];

      return bookings.filter(b => b.date >= weekStartStr && b.date <= weekEndStr);
    }
    default:
      return bookings;
  }
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [activeTab, setActiveTab] = useState('all');
  const [filterDate, setFilterDate] = useState<any>(null);
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    venue: '',
    date: null as any,
    timeSlot: '',
    notes: '',
  });

  const tabFilteredBookings = getTabFilteredBookings(bookings, activeTab);

  const filteredBookings = tabFilteredBookings.filter(booking => {
    if (filterStatus !== 'All' && booking.status !== filterStatus) {
      return false;
    }
    if (filterVenue && booking.venue !== filterVenue) {
      return false;
    }
    if (filterDate) {
      const filterDateStr = `${filterDate.year}-${String(filterDate.month).padStart(2, '0')}-${String(filterDate.day).padStart(2, '0')}`;
      if (booking.date !== filterDateStr) {
        return false;
      }
    }
    return true;
  });

  const getCapacityWarning = () => {
    const today = new Date().toISOString().split('T')[0];
    const mainHallBookingsToday = filteredBookings.filter(
      b => b.venue === 'Main Hall' && b.date === today
    ).length;
    const remainingSlots = 4 - mainHallBookingsToday;

    if (remainingSlots <= 2 && remainingSlots > 0) {
      return `Main Hall has only ${remainingSlots} slots remaining for today.`;
    }
    return null;
  };

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('All');
  };

  const handleCreateBooking = (e: any) => {
    e.preventDefault();

    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formData.customer,
      email: formData.email,
      venue: formData.venue,
      date: formData.date
        ? `${formData.date.year}-${String(formData.date.month).padStart(2, '0')}-${String(formData.date.day).padStart(2, '0')}`
        : '',
      timeSlot: formData.timeSlot,
      status: 'Confirmed',
      notes: formData.notes,
    };

    setBookings([...bookings, newBooking]);
    setIsDialogOpen(false);
    setFormData({
      customer: '',
      email: '',
      venue: '',
      date: null,
      timeSlot: '',
      notes: '',
    });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailOpen(true);
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
  };

  const capacityWarning = getCapacityWarning();

  return (
    <Stack space={4} stretch>
      <Headline level="1">Booking Management</Headline>

      <Inline space={2}>
        <DatePicker
          label="Date"
          value={filterDate}
          onChange={setFilterDate}
        />
        <Autocomplete
          label="Venue"
          items={venues}
          onSelectionChange={key => setFilterVenue(key as string)}
          selectedKey={filterVenue || undefined}
        />
        <Select
          label="Status"
          selectedKey={filterStatus}
          onSelectionChange={key => setFilterStatus(key as string)}
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Confirmed">Confirmed</Select.Option>
          <Select.Option id="Pending">Pending</Select.Option>
          <Select.Option id="Cancelled">Cancelled</Select.Option>
        </Select>
        <Button onPress={handleClearFilters} variant="secondary">
          Clear Filters
        </Button>
      </Inline>

      {capacityWarning && (
        <SectionMessage variant="warning">
          <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
          {capacityWarning}
        </SectionMessage>
      )}

      <Inline space={2}>
        <Dialog.Trigger>
          <Button variant="primary">New Booking</Button>
          <Dialog size="small">
            <Dialog.Title>Create New Booking</Dialog.Title>
            <Dialog.Content>
              <Form>
                <Stack space={3}>
                  <TextField
                    label="Customer Name"
                    required
                    value={formData.customer}
                    onChange={value =>
                      setFormData({ ...formData, customer: value })
                    }
                  />
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={formData.email}
                    onChange={value =>
                      setFormData({ ...formData, email: value })
                    }
                  />
                  <Select
                    label="Venue"
                    required
                    selectedKey={formData.venue}
                    onSelectionChange={key =>
                      setFormData({ ...formData, venue: key as string })
                    }
                  >
                    {venues.map(venue => (
                      <Select.Option key={venue} id={venue}>
                        {venue}
                      </Select.Option>
                    ))}
                  </Select>
                  <DatePicker
                    label="Date"
                    required
                    value={formData.date}
                    onChange={value =>
                      setFormData({ ...formData, date: value })
                    }
                  />
                  <Select
                    label="Time Slot"
                    required
                    selectedKey={formData.timeSlot}
                    onSelectionChange={key =>
                      setFormData({ ...formData, timeSlot: key as string })
                    }
                  >
                    {timeSlots.map(slot => (
                      <Select.Option key={slot} id={slot}>
                        {slot}
                      </Select.Option>
                    ))}
                  </Select>
                  <TextArea
                    label="Notes"
                    value={formData.notes}
                    onChange={value =>
                      setFormData({ ...formData, notes: value })
                    }
                  />
                </Stack>
              </Form>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={handleCreateBooking}
              >
                Create Booking
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Tabs aria-label="Booking Views" selectedKey={activeTab} onSelectionChange={setActiveTab}>
        <Tabs.List aria-label="Views">
          <Tabs.Item id="all">All Bookings</Tabs.Item>
          <Tabs.Item id="today">Today</Tabs.Item>
          <Tabs.Item id="week">This Week</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="all">
          <Table aria-label="Bookings" size="compact">
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
              {booking => (
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
                    <Menu label="..." onAction={action => {
                      if (action === 'view') {
                        handleViewDetails(booking);
                      } else if (action === 'edit') {
                        alert(`Edit booking ${booking.id}`);
                      } else if (action === 'cancel') {
                        handleDeleteBooking(booking.id);
                      }
                    }}>
                      <Menu.Item id="view">View Details</Menu.Item>
                      <Menu.Item id="edit">Edit</Menu.Item>
                      <Menu.Item id="cancel" variant="destructive">
                        Cancel Booking
                      </Menu.Item>
                    </Menu>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="today">
          <Table aria-label="Bookings Today" size="compact">
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
              {booking => (
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
                    <Menu label="..." onAction={action => {
                      if (action === 'view') {
                        handleViewDetails(booking);
                      } else if (action === 'edit') {
                        alert(`Edit booking ${booking.id}`);
                      } else if (action === 'cancel') {
                        handleDeleteBooking(booking.id);
                      }
                    }}>
                      <Menu.Item id="view">View Details</Menu.Item>
                      <Menu.Item id="edit">Edit</Menu.Item>
                      <Menu.Item id="cancel" variant="destructive">
                        Cancel Booking
                      </Menu.Item>
                    </Menu>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="week">
          <Table aria-label="Bookings This Week" size="compact">
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
              {booking => (
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
                    <Menu label="..." onAction={action => {
                      if (action === 'view') {
                        handleViewDetails(booking);
                      } else if (action === 'edit') {
                        alert(`Edit booking ${booking.id}`);
                      } else if (action === 'cancel') {
                        handleDeleteBooking(booking.id);
                      }
                    }}>
                      <Menu.Item id="view">View Details</Menu.Item>
                      <Menu.Item id="edit">Edit</Menu.Item>
                      <Menu.Item id="cancel" variant="destructive">
                        Cancel Booking
                      </Menu.Item>
                    </Menu>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Tabs.TabPanel>
      </Tabs>

      <Drawer.Trigger
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      >
        <div />
        <Drawer size="small">
          <Drawer.Title>
            Booking Details - {selectedBooking?.id}
          </Drawer.Title>
          <Drawer.Content>
            {selectedBooking && (
              <Stack space={4}>
                <Stack space={2}>
                  <Text variant="strong">Status</Text>
                  <Badge variant={getStatusVariant(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </Stack>

                <Stack space={2}>
                  <Text variant="strong">Customer Information</Text>
                  <Stack space={1}>
                    <Text>
                      <strong>Name:</strong> {selectedBooking.customer}
                    </Text>
                    <Text>
                      <strong>Email:</strong> {selectedBooking.email}
                    </Text>
                  </Stack>
                </Stack>

                <Stack space={2}>
                  <Text variant="strong">Booking Details</Text>
                  <Stack space={1}>
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
                </Stack>

                {selectedBooking.notes && (
                  <Stack space={2}>
                    <Text variant="strong">Notes</Text>
                    <Text>{selectedBooking.notes}</Text>
                  </Stack>
                )}

                <Accordion>
                  <Accordion.Item id="payment">
                    <Accordion.Header>Payment History</Accordion.Header>
                    <Stack space={2}>
                      <Text>Invoice #INV-001 - $500.00 - Paid on 2026-06-20</Text>
                      <Text>Deposit received - $250.00</Text>
                    </Stack>
                  </Accordion.Item>
                  <Accordion.Item id="communication">
                    <Accordion.Header>Communication Log</Accordion.Header>
                    <Stack space={2}>
                      <Text>2026-06-20: Initial inquiry from customer</Text>
                      <Text>2026-06-21: Confirmed booking details via email</Text>
                      <Text>2026-06-22: Sent payment invoice</Text>
                    </Stack>
                  </Accordion.Item>
                </Accordion>
              </Stack>
            )}
          </Drawer.Content>
          <Drawer.Actions>
            <Button variant="secondary" slot="close">
              Close
            </Button>
          </Drawer.Actions>
        </Drawer>
      </Drawer.Trigger>
    </Stack>
  );
};

export default TestApp;
