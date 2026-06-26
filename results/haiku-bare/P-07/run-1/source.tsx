import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Dialog,
  ModalOverlay,
  Heading,
  ComboBox,
  Item,
  Select,
  DateField,
  TextArea,
  Badge,
  ActionMenu,
  MenuTrigger,
  Menu,
  MenuSection,
  MenuItem,
  Flex,
  Box,
  Stack,
  Divider,
  Content,
  Header,
  Footer,
  Disclosure,
} from "@marigold/components";
import {
  parseDate,
  today,
  isAfter,
  isSameDay,
  isLastDayOfWeek,
  startOfWeek,
} from "@internationalized/date";

interface Booking {
  id: string;
  customer: string;
  email: string;
  venue: string;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  notes: string;
}

const VENUES = [
  "Main Hall",
  "Conference Room A",
  "Conference Room B",
  "Rooftop Terrace",
  "Workshop Studio",
];

const TIME_SLOTS = ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"];

const SAMPLE_BOOKINGS: Booking[] = [
  {
    id: "BK001",
    customer: "John Smith",
    email: "john@example.com",
    venue: "Main Hall",
    date: "2026-06-25",
    timeSlot: "09:00-12:00",
    status: "Confirmed",
    notes: "Annual conference setup",
  },
  {
    id: "BK002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    venue: "Conference Room A",
    date: "2026-06-21",
    timeSlot: "14:00-17:00",
    status: "Confirmed",
    notes: "Team meeting",
  },
  {
    id: "BK003",
    customer: "Mike Davis",
    email: "mike@example.com",
    venue: "Rooftop Terrace",
    date: "2026-06-22",
    timeSlot: "18:00-21:00",
    status: "Pending",
    notes: "Evening event",
  },
  {
    id: "BK004",
    customer: "Emma Wilson",
    email: "emma@example.com",
    venue: "Workshop Studio",
    date: "2026-06-21",
    timeSlot: "10:00-13:00",
    status: "Confirmed",
    notes: "Art workshop",
  },
  {
    id: "BK005",
    customer: "David Brown",
    email: "david@example.com",
    venue: "Conference Room B",
    date: "2026-06-23",
    timeSlot: "09:00-12:00",
    status: "Cancelled",
    notes: "Rescheduled to next month",
  },
  {
    id: "BK006",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    venue: "Main Hall",
    date: "2026-06-25",
    timeSlot: "12:00-15:00",
    status: "Pending",
    notes: "Waiting for payment confirmation",
  },
];

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "Confirmed":
      return "success";
    case "Pending":
      return "warning";
    case "Cancelled":
      return "neutral";
    default:
      return "neutral";
  }
};

const getWeekDateRange = (date: typeof today) => {
  const weekStart = startOfWeek(date, "en-US");
  const weekEnd = weekStart.add({ days: 6 });
  return { start: weekStart, end: weekEnd };
};

const TestApp = () => {
  const [filterDate, setFilterDate] = useState<typeof today | null>(null);
  const [filterVenue, setFilterVenue] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [bookings, setBookings] = useState<Booking[]>(SAMPLE_BOOKINGS);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [newBooking, setNewBooking] = useState({
    customer: "",
    email: "",
    venue: "",
    date: "",
    timeSlot: "",
    notes: "",
  });

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (selectedTab === "today") {
      result = result.filter((b) => isSameDay(parseDate(b.date), today()));
    } else if (selectedTab === "week") {
      const { start, end } = getWeekDateRange(today());
      result = result.filter((b) => {
        const bookingDate = parseDate(b.date);
        return (
          !isAfter(bookingDate, end) &&
          !isAfter(start, bookingDate)
        );
      });
    }

    if (filterDate) {
      result = result.filter((b) => isSameDay(parseDate(b.date), filterDate));
    }

    if (filterVenue) {
      result = result.filter((b) => b.venue === filterVenue);
    }

    if (filterStatus !== "All") {
      result = result.filter((b) => b.status === filterStatus);
    }

    return result;
  }, [bookings, selectedTab, filterDate, filterVenue, filterStatus]);

  const venueCapacity = useMemo(() => {
    const todayStr = today().toString();
    const counts: Record<string, number> = {};
    VENUES.forEach((v) => (counts[v] = 0));
    bookings.forEach((b) => {
      if (b.date === todayStr && b.status !== "Cancelled") {
        counts[b.venue] = (counts[b.venue] || 0) + 1;
      }
    });
    return counts;
  }, [bookings]);

  const handleCreateBooking = () => {
    if (
      !newBooking.customer ||
      !newBooking.venue ||
      !newBooking.date ||
      !newBooking.timeSlot
    ) {
      return;
    }

    const booking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      customer: newBooking.customer,
      email: newBooking.email,
      venue: newBooking.venue,
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      status: "Pending",
      notes: newBooking.notes,
    };

    setBookings([...bookings, booking]);
    setNewBooking({
      customer: "",
      email: "",
      venue: "",
      date: "",
      timeSlot: "",
      notes: "",
    });
    setIsDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilterDate(null);
    setFilterVenue(null);
    setFilterStatus("All");
  };

  const handleActionMenu = (action: string, booking: Booking) => {
    if (action === "view") {
      setSelectedBooking(booking);
      setIsPanelOpen(true);
    } else if (action === "cancel") {
      setBookings(
        bookings.map((b) =>
          b.id === booking.id ? { ...b, status: "Cancelled" } : b
        )
      );
    }
  };

  const hasNearlyFullVenue = Object.entries(venueCapacity).some(
    ([_, count]) => count >= 3
  );
  const almostFullVenue = Object.entries(venueCapacity).find(
    ([_, count]) => count >= 3
  );

  return (
    <Stack gap="lg" padding="lg">
      {hasNearlyFullVenue && almostFullVenue && (
        <Box
          bg="warning"
          padding="md"
          borderRadius="sm"
          style={{ color: "#fff", fontSize: "14px" }}
        >
          {almostFullVenue[0]} has only{" "}
          {4 - almostFullVenue[1]} slots remaining for today.
        </Box>
      )}

      <Flex gap="md" flexWrap="wrap" alignItems="flex-end">
        <DateField
          label="Filter by Date"
          value={filterDate}
          onChange={setFilterDate}
        />

        <ComboBox
          label="Venue"
          selectedKey={filterVenue}
          onSelectionChange={(key) => setFilterVenue(key as string)}
        >
          {VENUES.map((venue) => (
            <Item key={venue}>{venue}</Item>
          ))}
        </ComboBox>

        <Select
          label="Status"
          selectedKey={filterStatus}
          onSelectionChange={(key) => setFilterStatus(key as string)}
        >
          <Item key="All">All</Item>
          <Item key="Confirmed">Confirmed</Item>
          <Item key="Pending">Pending</Item>
          <Item key="Cancelled">Cancelled</Item>
        </Select>

        <Button onPress={handleClearFilters}>Clear Filters</Button>
      </Flex>

      <Flex justifyContent="space-between" alignItems="center">
        <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
          <TabList>
            <Tab key="all">All Bookings</Tab>
            <Tab key="today">Today</Tab>
            <Tab key="week">This Week</Tab>
          </TabList>
        </Tabs>

        <Button onPress={() => setIsDialogOpen(true)}>New Booking</Button>
      </Flex>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Booking ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Venue</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time Slot</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
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
                <Badge color={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <MenuTrigger>
                  <Button>…</Button>
                  <ModalOverlay>
                    <Dialog>
                      <Content>
                        <Menu onAction={(key) => handleActionMenu(key as string, booking)}>
                          <MenuItem key="view">View Details</MenuItem>
                          <MenuItem key="edit">Edit</MenuItem>
                          <MenuItem key="cancel">Cancel Booking</MenuItem>
                        </Menu>
                      </Content>
                    </Dialog>
                  </ModalOverlay>
                </MenuTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isDialogOpen && (
        <ModalOverlay
          isDismissable
          onDismiss={() => {
            setIsDialogOpen(false);
            setNewBooking({
              customer: "",
              email: "",
              venue: "",
              date: "",
              timeSlot: "",
              notes: "",
            });
          }}
        >
          <Dialog>
            <Header>
              <Heading>New Booking</Heading>
            </Header>
            <Content>
              <Stack gap="md">
                <TextField
                  label="Customer Name *"
                  value={newBooking.customer}
                  onChange={(v) =>
                    setNewBooking({ ...newBooking, customer: v })
                  }
                />

                <TextField
                  label="Customer Email"
                  type="email"
                  value={newBooking.email}
                  onChange={(v) => setNewBooking({ ...newBooking, email: v })}
                />

                <ComboBox
                  label="Venue *"
                  selectedKey={newBooking.venue}
                  onSelectionChange={(key) =>
                    setNewBooking({ ...newBooking, venue: key as string })
                  }
                >
                  {VENUES.map((venue) => (
                    <Item key={venue}>{venue}</Item>
                  ))}
                </ComboBox>

                <TextField
                  label="Date *"
                  type="date"
                  value={newBooking.date}
                  onChange={(v) => setNewBooking({ ...newBooking, date: v })}
                />

                <Select
                  label="Time Slot *"
                  selectedKey={newBooking.timeSlot}
                  onSelectionChange={(key) =>
                    setNewBooking({ ...newBooking, timeSlot: key as string })
                  }
                >
                  {TIME_SLOTS.map((slot) => (
                    <Item key={slot}>{slot}</Item>
                  ))}
                </Select>

                <TextArea
                  label="Notes"
                  value={newBooking.notes}
                  onChange={(v) => setNewBooking({ ...newBooking, notes: v })}
                />
              </Stack>
            </Content>
            <Footer>
              <Button
                variant="plain"
                onPress={() => {
                  setIsDialogOpen(false);
                  setNewBooking({
                    customer: "",
                    email: "",
                    venue: "",
                    date: "",
                    timeSlot: "",
                    notes: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onPress={handleCreateBooking}>
                Create Booking
              </Button>
            </Footer>
          </Dialog>
        </ModalOverlay>
      )}

      {isPanelOpen && selectedBooking && (
        <Box
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            width: "400px",
            background: "#f5f5f5",
            padding: "20px",
            overflowY: "auto",
            borderLeft: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          <Button onPress={() => setIsPanelOpen(false)}>Close</Button>

          <Stack gap="md" style={{ marginTop: "20px" }}>
            <div>
              <strong>Booking ID:</strong> {selectedBooking.id}
            </div>
            <Badge color={getStatusColor(selectedBooking.status)}>
              {selectedBooking.status}
            </Badge>

            <Divider />

            <div>
              <strong>Customer Information</strong>
              <div style={{ marginTop: "8px" }}>
                <div>{selectedBooking.customer}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {selectedBooking.email}
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <strong>Venue & Date</strong>
              <div style={{ marginTop: "8px" }}>
                <div>{selectedBooking.venue}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {selectedBooking.date} {selectedBooking.timeSlot}
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <strong>Notes</strong>
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                {selectedBooking.notes || "—"}
              </div>
            </div>

            <Divider />

            <Disclosure title="Payment History">
              <Stack gap="sm" style={{ paddingLeft: "12px" }}>
                <div style={{ fontSize: "12px" }}>
                  No payments recorded yet.
                </div>
              </Stack>
            </Disclosure>

            <Disclosure title="Communication Log">
              <Stack gap="sm" style={{ paddingLeft: "12px" }}>
                <div style={{ fontSize: "12px" }}>
                  Booking confirmation email sent on 2026-06-21.
                </div>
              </Stack>
            </Disclosure>
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default TestApp;
