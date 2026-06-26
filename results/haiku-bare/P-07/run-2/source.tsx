import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  SelectItem,
  Tabs,
  TabsItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  Modal,
  Form,
  Label,
  Textarea,
  MenuTrigger,
  Menu,
  MenuItem,
  Stack,
  Alert,
  Heading,
  Text,
  Badge,
  Disclosure,
} from '@marigold/components';

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

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  notes?: string;
  paymentHistory?: string;
  communicationLog?: string;
}

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'BK001',
    customer: 'John Smith',
    email: 'john@example.com',
    venue: 'Main Hall',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Large corporate event',
    paymentHistory: 'Paid in full on 2026-06-10',
    communicationLog: 'Client confirmed attendance list',
  },
  {
    id: 'BK002',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    venue: 'Conference Room A',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Weekly team meeting',
    paymentHistory: 'Invoice sent',
    communicationLog: 'Awaiting confirmation',
  },
  {
    id: 'BK003',
    customer: 'Michael Chen',
    email: 'michael@example.com',
    venue: 'Rooftop Terrace',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Evening networking event',
    paymentHistory: 'Deposit received',
    communicationLog: 'Guest list submitted',
  },
  {
    id: 'BK004',
    customer: 'Emily Rodriguez',
    email: 'emily@example.com',
    venue: 'Workshop Studio',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Workshop rescheduled',
    paymentHistory: 'Refund processed',
    communicationLog: 'Cancellation confirmed',
  },
  {
    id: 'BK005',
    customer: 'David Thompson',
    email: 'david@example.com',
    venue: 'Conference Room B',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'Board meeting',
    paymentHistory: 'Credit card charged',
    communicationLog: 'All attendees confirmed',
  },
  {
    id: 'BK006',
    customer: 'Lisa Anderson',
    email: 'lisa@example.com',
    venue: 'Main Hall',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Product launch event',
    paymentHistory: 'Awaiting payment',
    communicationLog: 'Final details pending',
  },
];

const getStatusColor = (status: string): 'success' | 'warning' | 'neutral' => {
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
  const [filterDate, setFilterDate] = useState('');
  const [filterVenue, setFilterVenue] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    venue: '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const getWeekRange = () => {
    const start = weekStart.toISOString().split('T')[0];
    const end = weekEnd.toISOString().split('T')[0];
    return { start, end };
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Tab filtering
    if (selectedTab === 'today') {
      result = result.filter((b) => b.date === todayStr);
    } else if (selectedTab === 'week') {
      const { start, end } = getWeekRange();
      result = result.filter((b) => b.date >= start && b.date <= end);
    }

    // Date filter
    if (filterDate) {
      result = result.filter((b) => b.date === filterDate);
    }

    // Venue filter
    if (filterVenue) {
      result = result.filter((b) => b.venue === filterVenue);
    }

    // Status filter
    if (filterStatus !== 'All') {
      result = result.filter((b) => b.status === filterStatus);
    }

    return result;
  }, [bookings, selectedTab, filterDate, filterVenue, filterStatus]);

  const capacityAlerts = useMemo(() => {
    const alerts: string[] = [];
    const venueCounts: { [key: string]: number } = {};

    bookings
      .filter(
        (b) =>
          b.date === todayStr && (b.status === 'Confirmed' || b.status === 'Pending')
      )
      .forEach((b) => {
        venueCounts[b.venue] = (venueCounts[b.venue] || 0) + 1;
      });

    Object.entries(venueCounts).forEach(([venue, count]) => {
      if (count >= 3) {
        const remaining = 5 - count;
        if (remaining <= 2) {
          alerts.push(
            `${venue} has only ${remaining} slot${remaining === 1 ? '' : 's'} remaining for today.`
          );
        }
      }
    });

    return alerts;
  }, [bookings, todayStr]);

  const handleCreateBooking = () => {
    if (formData.customer && formData.venue && formData.date && formData.timeSlot) {
      const newBooking: Booking = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        customer: formData.customer,
        email: formData.email,
        venue: formData.venue,
        date: formData.date,
        timeSlot: formData.timeSlot,
        status: 'Pending',
        notes: formData.notes,
      };
      setBookings([...bookings, newBooking]);
      setFormData({
        customer: '',
        email: '',
        venue: '',
        date: '',
        timeSlot: '',
        notes: '',
      });
      setIsModalOpen(false);
    }
  };

  const handleCancelBooking = (id: string) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPanelOpen(true);
  };

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterVenue('');
    setFilterStatus('All');
  };

  return (
    <Box padding="xl">
      <Stack gap="lg">
        {/* Header */}
        <Box>
          <Heading level={1}>Booking Management</Heading>
        </Box>

        {/* Capacity Alerts */}
        {capacityAlerts.length > 0 && (
          <Stack gap="sm">
            {capacityAlerts.map((alert, idx) => (
              <Alert key={idx} variant="info">
                {alert}
              </Alert>
            ))}
          </Stack>
        )}

        {/* Filter Bar */}
        <Box
          display="flex"
          gap="md"
          paddingY="md"
          borderBottom="1px solid"
          borderBottomColor="border"
        >
          <TextField
            label="Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            width="auto"
          />
          <Select
            label="Venue"
            value={filterVenue}
            onChange={(val) => setFilterVenue(val)}
            width="auto"
          >
            <SelectItem key="" value="">
              All Venues
            </SelectItem>
            {VENUES.map((venue) => (
              <SelectItem key={venue} value={venue}>
                {venue}
              </SelectItem>
            ))}
          </Select>
          <Select
            label="Status"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            width="auto"
          >
            <SelectItem key="All" value="All">
              All
            </SelectItem>
            <SelectItem key="Confirmed" value="Confirmed">
              Confirmed
            </SelectItem>
            <SelectItem key="Pending" value="Pending">
              Pending
            </SelectItem>
            <SelectItem key="Cancelled" value="Cancelled">
              Cancelled
            </SelectItem>
          </Select>
          <Button variant="ghost" onPress={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        {/* Action Bar */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Button variant="primary" onPress={() => setIsModalOpen(true)}>
              New Booking
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box>
          <Tabs
            value={selectedTab}
            onChange={(val) => setSelectedTab(val)}
            variant="underline"
          >
            <TabsItem key="all" title="All Bookings" value="all" />
            <TabsItem key="today" title="Today" value="today" />
            <TabsItem key="week" title="This Week" value="week" />
          </Tabs>
        </Box>

        {/* Bookings Table */}
        <Box overflow="auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Venue</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time Slot</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.venue}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.timeSlot}</TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MenuTrigger>
                      <Button variant="ghost" size="small">
                        ⋯
                      </Button>
                      <Menu onAction={(action) => {
                        if (action === 'view') {
                          handleViewDetails(booking);
                        } else if (action === 'cancel') {
                          handleCancelBooking(booking.id);
                        }
                      }}>
                        <MenuItem key="view">View Details</MenuItem>
                        <MenuItem key="edit">Edit</MenuItem>
                        <MenuItem key="cancel">Cancel Booking</MenuItem>
                      </Menu>
                    </MenuTrigger>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Stack>

      {/* New Booking Modal */}
      <Modal
        title="Create New Booking"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <Dialog>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateBooking();
            }}
          >
            <Stack gap="md">
              <TextField
                label="Customer Name"
                value={formData.customer}
                onChange={(e) =>
                  setFormData({ ...formData, customer: e.target.value })
                }
                required
              />
              <TextField
                label="Customer Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Select
                label="Venue"
                value={formData.venue}
                onChange={(val) => setFormData({ ...formData, venue: val })}
                required
              >
                <SelectItem key="" value="">
                  Select a Venue
                </SelectItem>
                {VENUES.map((venue) => (
                  <SelectItem key={venue} value={venue}>
                    {venue}
                  </SelectItem>
                ))}
              </Select>
              <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Select
                label="Time Slot"
                value={formData.timeSlot}
                onChange={(val) => setFormData({ ...formData, timeSlot: val })}
                required
              >
                <SelectItem key="" value="">
                  Select Time Slot
                </SelectItem>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </Select>
              <Textarea
                label="Notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
              <Box display="flex" gap="md" justifyContent="flex-end">
                <Button
                  variant="ghost"
                  onPress={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create Booking
                </Button>
              </Box>
            </Stack>
          </Form>
        </Dialog>
      </Modal>

      {/* Detail Panel */}
      {isPanelOpen && selectedBooking && (
        <Box
          position="fixed"
          right={0}
          top={0}
          height="100vh"
          width="400px"
          backgroundColor="bg"
          borderLeft="1px solid"
          borderLeftColor="border"
          padding="lg"
          overflow="auto"
          zIndex={1000}
        >
          <Stack gap="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Heading level={2}>Booking Details</Heading>
              <Button
                variant="ghost"
                onPress={() => setIsPanelOpen(false)}
              >
                ✕
              </Button>
            </Box>

            <Box borderBottom="1px solid" borderBottomColor="border" paddingBottom="md">
              <Stack gap="sm">
                <Box>
                  <Label>Booking ID</Label>
                  <Text>{selectedBooking.id}</Text>
                </Box>
                <Box>
                  <Label>Status</Label>
                  <Badge color={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </Badge>
                </Box>
              </Stack>
            </Box>

            <Box borderBottom="1px solid" borderBottomColor="border" paddingBottom="md">
              <Heading level={3}>Customer Information</Heading>
              <Stack gap="sm">
                <Box>
                  <Label>Name</Label>
                  <Text>{selectedBooking.customer}</Text>
                </Box>
                <Box>
                  <Label>Email</Label>
                  <Text>{selectedBooking.email}</Text>
                </Box>
              </Stack>
            </Box>

            <Box borderBottom="1px solid" borderBottomColor="border" paddingBottom="md">
              <Heading level={3}>Venue & Schedule</Heading>
              <Stack gap="sm">
                <Box>
                  <Label>Venue</Label>
                  <Text>{selectedBooking.venue}</Text>
                </Box>
                <Box>
                  <Label>Date</Label>
                  <Text>{selectedBooking.date}</Text>
                </Box>
                <Box>
                  <Label>Time Slot</Label>
                  <Text>{selectedBooking.timeSlot}</Text>
                </Box>
              </Stack>
            </Box>

            {selectedBooking.notes && (
              <Box borderBottom="1px solid" borderBottomColor="border" paddingBottom="md">
                <Heading level={3}>Notes</Heading>
                <Text>{selectedBooking.notes}</Text>
              </Box>
            )}

            <Disclosure title="Payment History">
              <Text>{selectedBooking.paymentHistory}</Text>
            </Disclosure>

            <Disclosure title="Communication Log">
              <Text>{selectedBooking.communicationLog}</Text>
            </Disclosure>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default TestApp;
