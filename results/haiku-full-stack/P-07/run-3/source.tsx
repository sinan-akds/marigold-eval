import { useState, useMemo } from 'react';
import {
  Button,
  Stack,
  Inline,
  Columns,
  TextField,
  DatePicker,
  Select,
  Autocomplete,
  Table,
  Badge,
  Dialog,
  Drawer,
  Menu,
  ActionMenu,
  TextArea,
  Accordion,
  SectionMessage,
  Tabs,
  Text,
  Headline,
  Scrollable,
  AppLayout,
  Container,
} from '@marigold/components';
import { parseDate } from '@internationalized/date';

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

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

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK-001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: '2026-06-28',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Wedding reception',
  },
  {
    id: 'BK-002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Conference Room A',
    date: '2026-06-28',
    timeSlot: '14:00-17:00',
    status: 'Pending',
    notes: 'Client meeting',
  },
  {
    id: 'BK-003',
    customer: 'Mike Davis',
    email: 'mike@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-28',
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Team training',
  },
  {
    id: 'BK-004',
    customer: 'Emma Wilson',
    email: 'emma@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-27',
    timeSlot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Corporate event',
  },
  {
    id: 'BK-005',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Conference Room B',
    date: '2026-06-29',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Seminar',
  },
  {
    id: 'BK-006',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Main Hall',
    date: '2026-06-30',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Annual dinner',
  },
];

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [filterDate, setFilterDate] = useState<any>(null);
  const [filterVenue, setFilterVenue] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    venue: '',
    date: null as any,
    timeSlot: '',
    notes: '',
  });

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const weekAgoStr = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoFormatted = `${weekAgoStr.getFullYear()}-${String(weekAgoStr.getMonth() + 1).padStart(2, '0')}-${String(weekAgoStr.getDate()).padStart(2, '0')}`;

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (activeTab === 'today') {
      result = result.filter(b => b.date === todayStr);
    } else if (activeTab === 'week') {
      result = result.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate >= weekAgoStr && bookingDate <= today;
      });
    }

    if (filterDate) {
      const filterDateStr = `${filterDate.year}-${String(filterDate.month).padStart(2, '0')}-${String(filterDate.day).padStart(2, '0')}`;
      result = result.filter(b => b.date === filterDateStr);
    }

    if (filterVenue) {
      result = result.filter(b => b.venue.toLowerCase().includes(filterVenue.toLowerCase()));
    }

    if (filterStatus !== 'All') {
      result = result.filter(b => b.status === filterStatus);
    }

    return result;
  }, [bookings, filterDate, filterVenue, filterStatus, activeTab]);

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue('');
    setFilterStatus('All');
    setActiveTab('all');
  };

  const handleOpenNewBooking = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      venue: '',
      date: null,
      timeSlot: '',
      notes: '',
    });
    setShowNewBookingDialog(true);
  };

  const handleCreateBooking = () => {
    if (formData.customerName && formData.venue && formData.date && formData.timeSlot) {
      const newBooking: Booking = {
        id: `BK-${String(bookings.length + 1).padStart(3, '0')}`,
        customer: formData.customerName,
        email: formData.customerEmail,
        venue: formData.venue,
        date: `${formData.date.year}-${String(formData.date.month).padStart(2, '0')}-${String(formData.date.day).padStart(2, '0')}`,
        timeSlot: formData.timeSlot,
        status: 'Pending',
        notes: formData.notes,
      };
      setBookings([...bookings, newBooking]);
      setShowNewBookingDialog(false);
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailDrawerOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    alert(`Edit booking: ${booking.id}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'Cancelled' } : b
    ));
  };

  const getStatusVariant = (status: BookingStatus) => {
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

  const capacityAlerts = useMemo(() => {
    const mainHallBookings = filteredBookings.filter(
      b => b.venue === 'Main Hall' && b.date === todayStr && b.status !== 'Cancelled'
    ).length;
    const maxCapacity = 6;
    const remaining = maxCapacity - mainHallBookings;

    if (remaining <= 2 && remaining > 0) {
      return [
        {
          venue: 'Main Hall',
          remaining,
        },
      ];
    }
    return [];
  }, [filteredBookings]);

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={4}>
          <Headline level="1">Booking Management</Headline>

      {capacityAlerts.length > 0 && capacityAlerts.map(alert => (
        <SectionMessage key={alert.venue} variant="warning">
          <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
          <SectionMessage.Content>
            {alert.venue} has only {alert.remaining} slot{alert.remaining !== 1 ? 's' : ''} remaining for today.
          </SectionMessage.Content>
        </SectionMessage>
      ))}

      <Columns columns={[2, 2, 2, 'fit']} space={3} collapseAt="48em">
        <DatePicker
          label="Date"
          value={filterDate}
          onChange={setFilterDate}
          width={40}
        />
        <Autocomplete
          label="Venue"
          value={filterVenue}
          onChange={setFilterVenue}
          menuTrigger="focus"
        >
          {VENUES.map(venue => (
            <Autocomplete.Option key={venue} id={venue}>
              {venue}
            </Autocomplete.Option>
          ))}
        </Autocomplete>
        <Select
          label="Status"
          selectedKey={filterStatus}
          onSelectionChange={key => setFilterStatus(String(key))}
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Confirmed">Confirmed</Select.Option>
          <Select.Option id="Pending">Pending</Select.Option>
          <Select.Option id="Cancelled">Cancelled</Select.Option>
        </Select>
        <Button
          variant="secondary"
          onPress={handleClearFilters}
        >
          Clear Filters
        </Button>
      </Columns>

      <Inline space={3} alignY="input" alignX="between">
        <Tabs
          aria-label="booking-tabs"
          selectedKey={activeTab}
          onSelectionChange={key => setActiveTab(String(key))}
        >
          <Tabs.List aria-label="Booking views">
            <Tabs.Item id="all">All Bookings</Tabs.Item>
            <Tabs.Item id="today">Today</Tabs.Item>
            <Tabs.Item id="week">This Week</Tabs.Item>
          </Tabs.List>
        </Tabs>
        <Button
          variant="primary"
          onPress={handleOpenNewBooking}
        >
          New Booking
        </Button>
      </Inline>

          <Scrollable>
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
                      <Menu label="Actions" onAction={action => {
                        if (action === `view-${booking.id}`) handleViewDetails(booking);
                        else if (action === `edit-${booking.id}`) handleEditBooking(booking);
                        else if (action === `cancel-${booking.id}`) handleCancelBooking(booking.id);
                      }}>
                        <Menu.Item id={`view-${booking.id}`}>
                          View Details
                        </Menu.Item>
                        <Menu.Item id={`edit-${booking.id}`}>
                          Edit
                        </Menu.Item>
                        <Menu.Item id={`cancel-${booking.id}`} variant="destructive">
                          Cancel Booking
                        </Menu.Item>
                      </Menu>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Scrollable>

      <Dialog
        size="small"
        open={showNewBookingDialog}
        onOpenChange={setShowNewBookingDialog}
        closeButton
      >
        <Dialog.Title>Create New Booking</Dialog.Title>
        <Dialog.Content>
          <Stack space={3}>
            <TextField
              label="Customer Name"
              required
              value={formData.customerName}
              onChange={value => setFormData({ ...formData, customerName: value })}
              placeholder="Enter customer name"
            />
            <TextField
              label="Customer Email"
              type="email"
              value={formData.customerEmail}
              onChange={value => setFormData({ ...formData, customerEmail: value })}
              placeholder="Enter email address"
            />
            <Select
              label="Venue"
              required
              selectedKey={formData.venue}
              onSelectionChange={key => setFormData({ ...formData, venue: String(key) })}
            >
              {VENUES.map(venue => (
                <Select.Option key={venue} id={venue}>
                  {venue}
                </Select.Option>
              ))}
            </Select>
            <DatePicker
              label="Date"
              required
              value={formData.date}
              onChange={value => setFormData({ ...formData, date: value })}
            />
            <Select
              label="Time Slot"
              required
              selectedKey={formData.timeSlot}
              onSelectionChange={key => setFormData({ ...formData, timeSlot: String(key) })}
            >
              {TIME_SLOTS.map(slot => (
                <Select.Option key={slot} id={slot}>
                  {slot}
                </Select.Option>
              ))}
            </Select>
            <TextArea
              label="Notes"
              value={formData.notes}
              onChange={value => setFormData({ ...formData, notes: value })}
              placeholder="Optional notes about the booking"
              rows={4}
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
          >
            Create Booking
          </Button>
        </Dialog.Actions>
      </Dialog>

      <Drawer size="medium" open={detailDrawerOpen} closeButton>
        <Drawer.Title>
          {selectedBooking ? `Booking ${selectedBooking.id}` : 'Details'}
        </Drawer.Title>
        <Drawer.Content>
          {selectedBooking && (
            <Stack space={4}>
              <Inline space={2} alignY="center">
                <Headline level="4">Status:</Headline>
                <Badge variant={getStatusVariant(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </Inline>

              <Stack space={2}>
                <Headline level="4">Customer Information</Headline>
                <Stack space={1}>
                  <Text>
                    <Text weight="bold">Name:</Text> {selectedBooking.customer}
                  </Text>
                  <Text>
                    <Text weight="bold">Email:</Text> {selectedBooking.email}
                  </Text>
                </Stack>
              </Stack>

              <Stack space={2}>
                <Headline level="4">Booking Details</Headline>
                <Stack space={1}>
                  <Text>
                    <Text weight="bold">Venue:</Text> {selectedBooking.venue}
                  </Text>
                  <Text>
                    <Text weight="bold">Date:</Text> {selectedBooking.date}
                  </Text>
                  <Text>
                    <Text weight="bold">Time Slot:</Text> {selectedBooking.timeSlot}
                  </Text>
                </Stack>
              </Stack>

              {selectedBooking.notes && (
                <Stack space={2}>
                  <Headline level="4">Notes</Headline>
                  <Text>{selectedBooking.notes}</Text>
                </Stack>
              )}

              <Accordion>
                <Accordion.Item id="payment">
                  <Accordion.Header>Payment History</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>Payment Date: 2026-06-20</Text>
                      <Text>Amount: €500.00</Text>
                      <Text>Status: Completed</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item id="communication">
                  <Accordion.Header>Communication Log</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2}>
                      <Text>2026-06-21: Booking confirmation sent</Text>
                      <Text>2026-06-22: Customer confirmed attendance</Text>
                      <Text>2026-06-25: Reminder email sent</Text>
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            </Stack>
          )}
        </Drawer.Content>
        <Drawer.Actions>
          <Button
            variant="secondary"
            onPress={() => setDetailDrawerOpen(false)}
          >
            Close
          </Button>
        </Drawer.Actions>
      </Drawer>
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
