import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Flex,
  Form,
  Heading,
  Label,
  Menubar,
  MenuItem,
  Popover,
  Stack,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  Select,
  SelectValue,
  SelectListbox,
  SelectOption,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Inline,
  Checkbox,
  TextArea,
  ActionGroup,
  ActionButton,
  Message,
  Badge,
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

const sampleBookings: Booking[] = [
  {
    id: 'BK001',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Main Hall',
    date: '2026-06-22',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Wedding ceremony - 150 guests',
  },
  {
    id: 'BK002',
    customer: 'Michael Chen',
    email: 'michael@example.com',
    venue: 'Conference Room A',
    date: '2026-06-22',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Corporate team building event',
  },
  {
    id: 'BK003',
    customer: 'Emma Davis',
    email: 'emma@example.com',
    venue: 'Rooftop Terrace',
    date: '2026-06-23',
    timeSlot: '15:00-18:00',
    status: 'Confirmed',
    notes: 'Birthday party celebration',
  },
  {
    id: 'BK004',
    customer: 'James Wilson',
    email: 'james@example.com',
    venue: 'Workshop Studio',
    date: '2026-06-22',
    timeSlot: '18:00-21:00',
    status: 'Cancelled',
    notes: 'Pottery workshop (cancelled)',
  },
  {
    id: 'BK005',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Conference Room B',
    date: '2026-06-25',
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Quarterly board meeting',
  },
  {
    id: 'BK006',
    customer: 'Robert Martinez',
    email: 'robert@example.com',
    venue: 'Main Hall',
    date: '2026-06-24',
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Annual gala preparation',
  },
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'neutral';
    default:
      return 'info';
  }
};

const getDateRange = (rangeType: string) => {
  const today = new Date('2026-06-22');
  const start = new Date(today);
  const end = new Date(today);

  if (rangeType === 'today') {
    return { start: formatDate(start), end: formatDate(end) };
  } else if (rangeType === 'week') {
    end.setDate(end.getDate() + 6);
    return { start: formatDate(start), end: formatDate(end) };
  }
  return { start: '', end: '' };
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const TestApp = () => {
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('all');
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState<string | null>(null);
  const [expandedPaymentHistory, setExpandedPaymentHistory] = useState(false);
  const [expandedCommunicationLog, setExpandedCommunicationLog] = useState(false);

  const [newBookingForm, setNewBookingForm] = useState({
    customer: '',
    email: '',
    venue: '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (activeTab === 'today') {
      const today = formatDate(new Date('2026-06-22'));
      filtered = filtered.filter((b) => b.date === today);
    } else if (activeTab === 'week') {
      const range = getDateRange('week');
      filtered = filtered.filter(
        (b) => b.date >= range.start && b.date <= range.end
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((b) => b.date === selectedDate);
    }

    if (selectedVenue) {
      filtered = filtered.filter((b) => b.venue === selectedVenue);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }

    return filtered;
  }, [bookings, selectedDate, selectedVenue, selectedStatus, activeTab]);

  const handleClearFilters = () => {
    setSelectedDate('');
    setSelectedVenue('');
    setSelectedStatus('All');
  };

  const handleCreateBooking = () => {
    if (newBookingForm.customer && newBookingForm.venue && newBookingForm.date && newBookingForm.timeSlot) {
      const newBooking: Booking = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        customer: newBookingForm.customer,
        email: newBookingForm.email,
        venue: newBookingForm.venue,
        date: newBookingForm.date,
        timeSlot: newBookingForm.timeSlot,
        status: 'Pending',
        notes: newBookingForm.notes,
      };
      setBookings([...bookings, newBooking]);
      setNewBookingForm({
        customer: '',
        email: '',
        venue: '',
        date: '',
        timeSlot: '',
        notes: '',
      });
      setShowNewBookingDialog(false);
    }
  };

  const handleCancelBooking = (id: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, status: 'Cancelled' as const } : b
      )
    );
  };

  const selectedBooking = bookings.find((b) => b.id === showDetailPanel);

  const todayBookings = bookings.filter(
    (b) => b.date === formatDate(new Date('2026-06-22'))
  );
  const mainHallToday = todayBookings.filter((b) => b.venue === 'Main Hall');
  const mainHallCapacity = 5;
  const mainHallRemaining = mainHallCapacity - mainHallToday.length;

  return (
    <Box padding="xl">
      <Stack gap="lg">
        {mainHallRemaining <= 2 && mainHallRemaining > 0 && (
          <Message variant="warning">
            Main Hall has only {mainHallRemaining} slots remaining for today.
          </Message>
        )}

        <Flex justifyContent="space-between" alignItems="center">
          <Heading level="1">Booking Management</Heading>
          <Button onPress={() => setShowNewBookingDialog(true)}>
            New Booking
          </Button>
        </Flex>

        <Flex
          gap="lg"
          alignItems="flex-end"
          wrap="wrap"
        >
          <Box minWidth={150}>
            <Label htmlFor="date-filter">Date</Label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontFamily: 'inherit',
              }}
            />
          </Box>

          <Box minWidth={200}>
            <Label>Venue</Label>
            <Select
              onSelectionChange={(value) =>
                setSelectedVenue(value ? String(value) : '')
              }
              value={selectedVenue}
            >
              <SelectValue />
              <SelectListbox>
                <SelectOption value="">All Venues</SelectOption>
                {VENUES.map((venue) => (
                  <SelectOption key={venue} value={venue}>
                    {venue}
                  </SelectOption>
                ))}
              </SelectListbox>
            </Select>
          </Box>

          <Box minWidth={150}>
            <Label>Status</Label>
            <Select
              onSelectionChange={(value) =>
                setSelectedStatus(value ? String(value) : 'All')
              }
              value={selectedStatus}
            >
              <SelectValue />
              <SelectListbox>
                <SelectOption value="All">All</SelectOption>
                <SelectOption value="Confirmed">Confirmed</SelectOption>
                <SelectOption value="Pending">Pending</SelectOption>
                <SelectOption value="Cancelled">Cancelled</SelectOption>
              </SelectListbox>
            </Select>
          </Box>

          <Button onPress={handleClearFilters} variant="secondary">
            Clear Filters
          </Button>
        </Flex>

        <Box>
          <TabsList>
            <TabsTrigger
              value="all"
              onPress={() => setActiveTab('all')}
              isSelected={activeTab === 'all'}
            >
              All Bookings
            </TabsTrigger>
            <TabsTrigger
              value="today"
              onPress={() => setActiveTab('today')}
              isSelected={activeTab === 'today'}
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="week"
              onPress={() => setActiveTab('week')}
              isSelected={activeTab === 'week'}
            >
              This Week
            </TabsTrigger>
          </TabsList>
        </Box>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Booking ID</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Venue</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Time Slot</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>{booking.venue}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.timeSlot}</TableCell>
                <TableCell>
                  <Badge color={getStatusBadgeColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Menubar>
                    <MenuItem onPress={() => setShowDetailPanel(booking.id)}>
                      View Details
                    </MenuItem>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem onPress={() => handleCancelBooking(booking.id)}>
                      Cancel Booking
                    </MenuItem>
                  </Menubar>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      {showNewBookingDialog && (
        <Dialog
          onOpenChange={() => setShowNewBookingDialog(false)}
          isOpen={showNewBookingDialog}
        >
          <DialogHeader>New Booking</DialogHeader>
          <DialogContent>
            <Stack gap="md">
              <Box>
                <Label htmlFor="customer-name">Customer Name *</Label>
                <TextField
                  id="customer-name"
                  value={newBookingForm.customer}
                  onChange={(e) =>
                    setNewBookingForm({
                      ...newBookingForm,
                      customer: e.currentTarget.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Label htmlFor="customer-email">Customer Email</Label>
                <TextField
                  id="customer-email"
                  type="email"
                  value={newBookingForm.email}
                  onChange={(e) =>
                    setNewBookingForm({
                      ...newBookingForm,
                      email: e.currentTarget.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Label>Venue *</Label>
                <Select
                  onSelectionChange={(value) =>
                    setNewBookingForm({
                      ...newBookingForm,
                      venue: value ? String(value) : '',
                    })
                  }
                  value={newBookingForm.venue}
                >
                  <SelectValue />
                  <SelectListbox>
                    {VENUES.map((venue) => (
                      <SelectOption key={venue} value={venue}>
                        {venue}
                      </SelectOption>
                    ))}
                  </SelectListbox>
                </Select>
              </Box>

              <Box>
                <Label htmlFor="booking-date">Date *</Label>
                <input
                  id="booking-date"
                  type="date"
                  value={newBookingForm.date}
                  onChange={(e) =>
                    setNewBookingForm({
                      ...newBookingForm,
                      date: e.target.value,
                    })
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontFamily: 'inherit',
                  }}
                />
              </Box>

              <Box>
                <Label>Time Slot *</Label>
                <Select
                  onSelectionChange={(value) =>
                    setNewBookingForm({
                      ...newBookingForm,
                      timeSlot: value ? String(value) : '',
                    })
                  }
                  value={newBookingForm.timeSlot}
                >
                  <SelectValue />
                  <SelectListbox>
                    {TIME_SLOTS.map((slot) => (
                      <SelectOption key={slot} value={slot}>
                        {slot}
                      </SelectOption>
                    ))}
                  </SelectListbox>
                </Select>
              </Box>

              <Box>
                <Label htmlFor="booking-notes">Notes</Label>
                <TextArea
                  id="booking-notes"
                  value={newBookingForm.notes}
                  onChange={(e) =>
                    setNewBookingForm({
                      ...newBookingForm,
                      notes: e.currentTarget.value,
                    })
                  }
                />
              </Box>

              <Flex gap="md" justifyContent="flex-end">
                <Button
                  variant="secondary"
                  onPress={() => setShowNewBookingDialog(false)}
                >
                  Cancel
                </Button>
                <Button onPress={handleCreateBooking}>Create Booking</Button>
              </Flex>
            </Stack>
          </DialogContent>
        </Dialog>
      )}

      {showDetailPanel && selectedBooking && (
        <Box
          position="fixed"
          right={0}
          top={0}
          width={400}
          height="100vh"
          backgroundColor="white"
          borderLeft="1px solid #e0e0e0"
          padding="lg"
          overflow="auto"
          zIndex={1000}
        >
          <Stack gap="lg">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading level="2">Booking Details</Heading>
              <Button
                variant="secondary"
                onPress={() => setShowDetailPanel(null)}
              >
                Close
              </Button>
            </Flex>

            <Box>
              <Text weight="bold">Booking ID</Text>
              <Text>{selectedBooking.id}</Text>
            </Box>

            <Box>
              <Text weight="bold">Status</Text>
              <Badge color={getStatusBadgeColor(selectedBooking.status)}>
                {selectedBooking.status}
              </Badge>
            </Box>

            <Box>
              <Heading level="3">Customer Information</Heading>
              <Stack gap="sm">
                <Box>
                  <Text weight="bold">Name</Text>
                  <Text>{selectedBooking.customer}</Text>
                </Box>
                <Box>
                  <Text weight="bold">Email</Text>
                  <Text>{selectedBooking.email}</Text>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Heading level="3">Booking Details</Heading>
              <Stack gap="sm">
                <Box>
                  <Text weight="bold">Venue</Text>
                  <Text>{selectedBooking.venue}</Text>
                </Box>
                <Box>
                  <Text weight="bold">Date</Text>
                  <Text>{selectedBooking.date}</Text>
                </Box>
                <Box>
                  <Text weight="bold">Time Slot</Text>
                  <Text>{selectedBooking.timeSlot}</Text>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Heading level="3">Notes</Heading>
              <Text>{selectedBooking.notes || 'No notes'}</Text>
            </Box>

            <Box>
              <Button
                onPress={() =>
                  setExpandedPaymentHistory(!expandedPaymentHistory)
                }
                variant="secondary"
              >
                {expandedPaymentHistory ? '▼' : '▶'} Payment History
              </Button>
              {expandedPaymentHistory && (
                <Box padding="md" backgroundColor="#f5f5f5">
                  <Text>
                    Payment received on 2026-06-20 for amount $450.00
                  </Text>
                </Box>
              )}
            </Box>

            <Box>
              <Button
                onPress={() =>
                  setExpandedCommunicationLog(!expandedCommunicationLog)
                }
                variant="secondary"
              >
                {expandedCommunicationLog ? '▼' : '▶'} Communication Log
              </Button>
              {expandedCommunicationLog && (
                <Box padding="md" backgroundColor="#f5f5f5">
                  <Stack gap="sm">
                    <Text>Email sent on 2026-06-20: Booking confirmation</Text>
                    <Text>Email sent on 2026-06-21: Invoice reminder</Text>
                  </Stack>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TestApp;
