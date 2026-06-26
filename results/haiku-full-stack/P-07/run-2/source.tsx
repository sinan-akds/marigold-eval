'use client';

import { useState, useMemo } from 'react';
import {
  Accordion,
  ActionMenu,
  Autocomplete,
  Badge,
  Button,
  Columns,
  Container,
  DatePicker,
  Dialog,
  Inline,
  Menu,
  SectionMessage,
  Select,
  Stack,
  Table,
  Text,
  TextField,
  TextArea,
  Tabs,
} from '@marigold/components';
import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';

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

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: '2025-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Corporate event',
  },
  {
    id: 'BK002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: '2025-06-22',
    timeSlot: '14:00-17:00',
    status: 'Pending',
    notes: 'Team meeting',
  },
  {
    id: 'BK003',
    customer: 'Carol White',
    email: 'carol@example.com',
    venue: 'Rooftop Terrace',
    date: '2025-06-23',
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Evening reception',
  },
  {
    id: 'BK004',
    customer: 'David Brown',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: '2025-06-24',
    timeSlot: '10:00-13:00',
    status: 'Cancelled',
    notes: 'Workshop - cancelled',
  },
  {
    id: 'BK005',
    customer: 'Eva Martinez',
    email: 'eva@example.com',
    venue: 'Conference Room B',
    date: '2025-06-25',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Training session',
  },
  {
    id: 'BK006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: '2025-06-26',
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: 'Annual conference',
  },
];

const getDateString = (date: DateValue | undefined): string => {
  if (!date) return '';
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};

const getToday = (): DateValue => {
  const today = new Date();
  return parseDate(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );
};

const getDateFromString = (dateStr: string): DateValue | null => {
  try {
    return parseDate(dateStr);
  } catch {
    return null;
  }
};

const isDateToday = (dateStr: string): boolean => {
  const today = getToday();
  const d = getDateFromString(dateStr);
  if (!d) return false;
  return d.year === today.year && d.month === today.month && d.day === today.day;
};

const isDateThisWeek = (dateStr: string): boolean => {
  const today = getToday();
  const d = getDateFromString(dateStr);
  if (!d) return false;

  const todayTime = new Date(today.year, today.month - 1, today.day).getTime();
  const dTime = new Date(d.year, d.month - 1, d.day).getTime();
  const daysDiff = (dTime - todayTime) / (1000 * 60 * 60 * 24);

  const dayOfWeek = new Date(today.year, today.month - 1, today.day).getDay();
  const daysToEndOfWeek = 6 - dayOfWeek;

  return daysDiff >= 0 && daysDiff <= daysToEndOfWeek;
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [filterDate, setFilterDate] = useState<DateValue | undefined>();
  const [filterVenue, setFilterVenue] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTab, setSelectedTab] = useState<string | number>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    venue: '',
    date: undefined as DateValue | undefined,
    timeSlot: '',
    notes: '',
  });

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (selectedTab === 'today') {
      result = result.filter(b => isDateToday(b.date));
    } else if (selectedTab === 'week') {
      result = result.filter(b => isDateThisWeek(b.date));
    }

    if (filterDate) {
      const filterDateStr = getDateString(filterDate);
      result = result.filter(b => b.date === filterDateStr);
    }

    if (filterVenue) {
      result = result.filter(b =>
        b.venue.toLowerCase().includes(filterVenue.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      result = result.filter(b => b.status === filterStatus);
    }

    return result;
  }, [bookings, selectedTab, filterDate, filterVenue, filterStatus]);

  const nearlyFullVenues = useMemo(() => {
    const today = getToday();
    const todayStr = getDateString(today);

    const venueCounts: Record<string, number> = {};
    bookings
      .filter(
        b =>
          b.date === todayStr && b.status !== 'Cancelled'
      )
      .forEach(b => {
        venueCounts[b.venue] = (venueCounts[b.venue] || 0) + 1;
      });

    const slotsPerVenue = 4;
    return Object.entries(venueCounts)
      .filter(([, count]) => count >= slotsPerVenue - 2)
      .map(([venue, count]) => ({
        venue,
        remaining: slotsPerVenue - count,
      }));
  }, [bookings]);

  const handleAddBooking = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.venue || !formData.date || !formData.timeSlot) {
      alert('Please fill in all required fields');
      return;
    }

    const newBooking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      customer: formData.customerName,
      email: formData.customerEmail,
      venue: formData.venue,
      date: getDateString(formData.date),
      timeSlot: formData.timeSlot,
      status: 'Pending',
      notes: formData.notes,
    };

    setBookings([...bookings, newBooking]);
    setFormData({
      customerName: '',
      customerEmail: '',
      venue: '',
      date: undefined,
      timeSlot: '',
      notes: '',
    });
  };

  const handleCancelBooking = (id: string) => {
    setBookings(
      bookings.map(b =>
        b.id === id ? { ...b, status: 'Cancelled' } : b
      )
    );
    setIsDetailsPanelOpen(false);
    setSelectedBooking(null);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsPanelOpen(true);
  };

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

  return (
    <Container>
      <Stack space={6}>
        <Stack space={4}>
          <Text variant="heading" size="lg">
            Booking Management
          </Text>

          {nearlyFullVenues.length > 0 && (
            <SectionMessage variant="warning">
              <SectionMessage.Title>Capacity Alert</SectionMessage.Title>
              <SectionMessage.Content>
                {nearlyFullVenues.map((item, idx) => (
                  <Text key={idx}>
                    {item.venue} has only {item.remaining} slot{item.remaining !== 1 ? 's' : ''} remaining for today.
                  </Text>
                ))}
              </SectionMessage.Content>
            </SectionMessage>
          )}
        </Stack>

        <Stack space={4}>
          <Text weight="bold">Filter Bookings</Text>
          <Columns columns={[1, 1, 1, 1]} collapseAt="tablet" space={3}>
            <DatePicker
              label="Date"
              value={filterDate}
              onChange={(val) => setFilterDate(val || undefined)}
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
              onSelectionChange={(key) => setFilterStatus(String(key))}
            >
              <Select.Option id="All">All</Select.Option>
              <Select.Option id="Confirmed">Confirmed</Select.Option>
              <Select.Option id="Pending">Pending</Select.Option>
              <Select.Option id="Cancelled">Cancelled</Select.Option>
            </Select>
            <Button
              variant="secondary"
              onPress={() => {
                setFilterDate(undefined);
                setFilterVenue('');
                setFilterStatus('All');
              }}
            >
              Clear Filters
            </Button>
          </Columns>
        </Stack>

        <Stack space={4}>
          <Inline space={4} alignY="center">
            <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
              <Tabs.List aria-label="Booking views">
                <Tabs.Item id="all">All Bookings</Tabs.Item>
                <Tabs.Item id="today">Today</Tabs.Item>
                <Tabs.Item id="week">This Week</Tabs.Item>
              </Tabs.List>
            </Tabs>
            <Dialog.Trigger>
              <Button variant="primary">New Booking</Button>
              <Dialog size="medium">
                {({ close }) => (
                  <>
                    <Dialog.Title>Create New Booking</Dialog.Title>
                    <Dialog.Content>
                      <Stack space={4}>
                        <TextField
                          label="Customer Name"
                          required
                          value={formData.customerName}
                          onChange={(val) =>
                            setFormData({ ...formData, customerName: val })
                          }
                        />
                        <TextField
                          label="Customer Email"
                          type="email"
                          value={formData.customerEmail}
                          onChange={(val) =>
                            setFormData({ ...formData, customerEmail: val })
                          }
                        />
                        <Select
                          label="Venue"
                          selectedKey={formData.venue}
                          onSelectionChange={(key) =>
                            setFormData({ ...formData, venue: String(key) })
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
                          value={formData.date}
                          onChange={(val) =>
                            setFormData({ ...formData, date: val || undefined })
                          }
                        />
                        <Select
                          label="Time Slot"
                          selectedKey={formData.timeSlot}
                          onSelectionChange={(key) =>
                            setFormData({ ...formData, timeSlot: String(key) })
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
                          value={formData.notes}
                          onChange={(val) =>
                            setFormData({ ...formData, notes: val })
                          }
                        />
                      </Stack>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button
                        variant="secondary"
                        slot="close"
                        onPress={close}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onPress={() => {
                          handleAddBooking();
                          close();
                        }}
                      >
                        Create Booking
                      </Button>
                    </Dialog.Actions>
                  </>
                )}
              </Dialog>
            </Dialog.Trigger>
          </Inline>
        </Stack>

        <Table aria-label="Bookings table" size="compact">
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
            {(booking: Booking) => (
              <Table.Row key={booking.id}>
                <Table.Cell>
                  <Text weight="medium">{booking.id}</Text>
                </Table.Cell>
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
                  <ActionMenu>
                    <Menu.Item
                      id="view"
                      onAction={() => handleViewDetails(booking)}
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
                  </ActionMenu>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Stack>

      {selectedBooking && isDetailsPanelOpen && (
        <Dialog
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
          size="medium"
        >
          {({ close }) => (
            <>
              <Dialog.Title>Booking Details</Dialog.Title>
              <Dialog.Content>
                <Stack space={6}>
                  <Inline space={2}>
                    <Text weight="medium">{selectedBooking.id}</Text>
                    <Badge variant={getStatusVariant(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </Inline>

                  <Stack space={3}>
                    <Stack space={1}>
                      <Text weight="bold" size="sm">
                        Customer Information
                      </Text>
                      <Text>{selectedBooking.customer}</Text>
                      <Text size="sm" color="muted-foreground">
                        {selectedBooking.email}
                      </Text>
                    </Stack>
                  </Stack>

                  <Stack space={3}>
                    <Stack space={1}>
                      <Text weight="bold" size="sm">
                        Venue & Time
                      </Text>
                      <Text>{selectedBooking.venue}</Text>
                      <Text size="sm" color="muted-foreground">
                        {selectedBooking.date} at {selectedBooking.timeSlot}
                      </Text>
                    </Stack>
                  </Stack>

                  {selectedBooking.notes && (
                    <Stack space={3}>
                      <Stack space={1}>
                        <Text weight="bold" size="sm">
                          Notes
                        </Text>
                        <Text>{selectedBooking.notes}</Text>
                      </Stack>
                    </Stack>
                  )}

                  <Accordion>
                    <Accordion.Item id="payment">
                      <Accordion.Header>Payment History</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <Text size="sm">
                            Invoice: INV-{selectedBooking.id}
                          </Text>
                          <Text size="sm" color="muted-foreground">
                            Amount: €500.00
                          </Text>
                          <Text size="sm" color="muted-foreground">
                            Status: Paid on 2025-06-20
                          </Text>
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item id="communication">
                      <Accordion.Header>Communication Log</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <Text size="sm">
                            Confirmation email sent on 2025-06-22
                          </Text>
                          <Text size="sm" color="muted-foreground">
                            Reminder sent on 2025-06-24
                          </Text>
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </Stack>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  variant="secondary"
                  slot="close"
                >
                  Close
                </Button>
                {selectedBooking.status !== 'Cancelled' && (
                  <Button
                    variant="destructive"
                    onPress={() => {
                      handleCancelBooking(selectedBooking.id);
                      close();
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      )}
    </Container>
  );
};

export default TestApp;
