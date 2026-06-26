import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Flex,
  TextField,
  Checkbox,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Badge,
  Text,
  Tooltip,
  TooltipTrigger,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Divider,
  TextArea,
  NumberField,
  DateField,
  Banner,
} from '@marigold/components';

interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  ticketsSold: number;
  capacity: number;
  status: 'On Sale' | 'Draft' | 'Sold Out';
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
}

interface EventForm {
  name: string;
  date: string;
  location: string;
  capacity: string;
  description: string;
}

const EventHub = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [eventFormData, setEventFormData] = useState<EventForm>({
    name: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
  });
  const [showSettingsSaved, setShowSettingsSaved] = useState(false);
  const [searchEvents, setSearchEvents] = useState('');
  const [searchAttendees, setSearchAttendees] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    digest: true,
    marketing: false,
  });

  const upcomingEvents: Event[] = [
    {
      id: '1',
      name: 'Tech Conference 2026',
      date: '2026-07-15',
      venue: 'Convention Center',
      ticketsSold: 450,
      capacity: 500,
      status: 'On Sale',
    },
    {
      id: '2',
      name: 'Summer Music Festival',
      date: '2026-08-02',
      venue: 'Central Park',
      ticketsSold: 1200,
      capacity: 1200,
      status: 'Sold Out',
    },
    {
      id: '3',
      name: 'Business Networking Lunch',
      date: '2026-06-25',
      venue: 'Downtown Hotel',
      ticketsSold: 85,
      capacity: 150,
      status: 'On Sale',
    },
    {
      id: '4',
      name: 'Product Launch Event',
      date: '2026-07-01',
      venue: 'Innovation Hub',
      ticketsSold: 0,
      capacity: 200,
      status: 'Draft',
    },
    {
      id: '5',
      name: 'Charity Gala',
      date: '2026-07-20',
      venue: 'Grand Ballroom',
      ticketsSold: 320,
      capacity: 400,
      status: 'On Sale',
    },
    {
      id: '6',
      name: 'Webinar Series Kickoff',
      date: '2026-07-08',
      venue: 'Virtual',
      ticketsSold: 560,
      capacity: 1000,
      status: 'On Sale',
    },
  ];

  const allEvents: Event[] = [
    ...upcomingEvents,
    {
      id: '7',
      name: 'Workshop: React Basics',
      date: '2026-09-10',
      venue: 'Tech Hub',
      ticketsSold: 120,
      capacity: 80,
      status: 'Sold Out',
    },
    {
      id: '8',
      name: 'Annual Awards Dinner',
      date: '2026-10-15',
      venue: 'Heritage Manor',
      ticketsSold: 200,
      capacity: 250,
      status: 'On Sale',
    },
  ];

  const attendeeList: Attendee[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      eventsAttended: 5,
      lastActive: '2026-06-20',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      eventsAttended: 3,
      lastActive: '2026-06-10',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      eventsAttended: 8,
      lastActive: '2026-06-19',
      status: 'Active',
    },
    {
      id: '4',
      name: 'David Brown',
      email: 'david@example.com',
      eventsAttended: 2,
      lastActive: '2026-05-15',
      status: 'Inactive',
    },
    {
      id: '5',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      eventsAttended: 12,
      lastActive: '2026-06-21',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Frank Martinez',
      email: 'frank@example.com',
      eventsAttended: 1,
      lastActive: '2026-04-01',
      status: 'Inactive',
    },
  ];

  const filteredEvents = allEvents.filter((event) =>
    event.name.toLowerCase().includes(searchEvents.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchEvents.toLowerCase())
  );

  const filteredAttendees = attendeeList.filter((attendee) =>
    attendee.name.toLowerCase().includes(searchAttendees.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchAttendees.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      'On Sale': 'success',
      'Draft': 'info',
      'Sold Out': 'warning',
    };
    return colorMap[status] || 'info';
  };

  const handleCreateEvent = () => {
    setShowCreateEventDialog(false);
    setEventFormData({ name: '', date: '', location: '', capacity: '', description: '' });
  };

  const handleSaveSettings = () => {
    setShowSettingsSaved(true);
    setTimeout(() => setShowSettingsSaved(false), 3000);
  };

  const sidebarWidth = sidebarCollapsed ? '60px' : '220px';

  return (
    <Flex direction="column" width="100%" height="100vh">
      <Box as="header" padding="md" borderBottom="solid 1px" borderColor="border" backgroundColor="surface">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap="md">
            <Button
              variant="ghost"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              ☰
            </Button>
            <Heading size="md">EventHub {currentPage !== 'Dashboard' && `> ${currentPage}`}</Heading>
          </Flex>
          <MenuTrigger>
            <Button variant="ghost">👤</Button>
            <MenuContent>
              <MenuItem onPress={() => {}}>Profile</MenuItem>
              <MenuItem onPress={() => setShowSignOutDialog(true)}>Sign out</MenuItem>
            </MenuContent>
          </MenuTrigger>
        </Flex>
      </Box>

      <Flex gap="0" flex="1" minHeight="0">
        <Box
          as="aside"
          width={sidebarWidth}
          backgroundColor="surfaceInverted"
          overflowY="auto"
          transition="width 0.3s"
          display="flex"
          flexDirection="column"
          padding={sidebarCollapsed ? 'sm' : 'md'}
        >
          <Heading size="sm" marginBottom="lg" color="textInverted" textAlign={sidebarCollapsed ? 'center' : 'left'}>
            {!sidebarCollapsed && 'EventHub'}
          </Heading>
          <Flex direction="column" gap="sm" flex="1">
            {['Dashboard', 'Events', 'Attendees', 'Reports', 'Settings'].map((page, index) => (
              <Box key={page}>
                {index === 3 && <Divider marginY="sm" backgroundColor="border" />}
                <Button
                  variant={currentPage === page ? 'solid' : 'ghost'}
                  onPress={() => setCurrentPage(page)}
                  width="100%"
                  textAlign="left"
                  title={sidebarCollapsed ? page : undefined}
                >
                  {!sidebarCollapsed && page}
                </Button>
              </Box>
            ))}
          </Flex>
          <Box borderTop="solid 1px" borderColor="border" paddingTop="sm">
            <Button variant="ghost" width="100%" textAlign="left" title={sidebarCollapsed ? 'Help & Support' : undefined}>
              {!sidebarCollapsed && 'Help & Support'}
            </Button>
          </Box>
        </Box>

        <Box as="main" flex="1" overflowY="auto" padding="lg" backgroundColor="surface">
          {currentPage === 'Dashboard' && (
            <Flex direction="column" gap="lg">
              <Banner variant="info">Welcome back! You have 3 events starting this week.</Banner>
              <Flex gap="md" wrap="wrap">
                <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                  <Text size="sm" color="muted">Total Events</Text>
                  <Heading size="lg">24</Heading>
                </Box>
                <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                  <Text size="sm" color="muted">Tickets Sold</Text>
                  <Heading size="lg">1,849</Heading>
                </Box>
                <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                  <TooltipTrigger>
                    <Text size="sm" color="muted">
                      Revenue <Text as="span" color="muted">ℹ️</Text>
                    </Text>
                    <Tooltip>Net revenue after fees and refunds</Tooltip>
                  </TooltipTrigger>
                  <Heading size="lg">$45,230</Heading>
                </Box>
                <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                  <Text size="sm" color="muted">Upcoming</Text>
                  <Heading size="lg">8</Heading>
                </Box>
              </Flex>
              <Box>
                <Heading size="md" marginBottom="md">Upcoming Events</Heading>
                <Table aria-label="Upcoming events">
                  <TableHeader>
                    <Column>Event</Column>
                    <Column>Date</Column>
                    <Column>Venue</Column>
                    <Column>Tickets Sold</Column>
                    <Column>Status</Column>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <Row key={event.id}>
                        <Cell>{event.name}</Cell>
                        <Cell>{event.date}</Cell>
                        <Cell>{event.venue}</Cell>
                        <Cell>{event.ticketsSold}</Cell>
                        <Cell>
                          <Badge>{event.status}</Badge>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Flex>
          )}

          {currentPage === 'Events' && (
            <Flex direction="column" gap="lg">
              <Heading size="lg">Events</Heading>
              <Flex gap="md" alignItems="center">
                <TextField
                  label="Search events"
                  placeholder="Search by name or location..."
                  value={searchEvents}
                  onChange={setSearchEvents}
                  flex="1"
                />
                <DialogTrigger isOpen={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
                  <Button variant="solid">Create Event</Button>
                  <Dialog>
                    <Box padding="lg">
                      <Heading size="md" marginBottom="md">Create Event</Heading>
                      <Flex direction="column" gap="md">
                        <TextField
                          label="Event Name *"
                          placeholder="Enter event name"
                          value={eventFormData.name}
                          onChange={(val) => setEventFormData({ ...eventFormData, name: val })}
                          isRequired
                        />
                        <DateField
                          label="Date"
                          value={eventFormData.date}
                          onChange={(val) => setEventFormData({ ...eventFormData, date: val })}
                        />
                        <TextField
                          label="Location"
                          placeholder="Enter location"
                          value={eventFormData.location}
                          onChange={(val) => setEventFormData({ ...eventFormData, location: val })}
                        />
                        <NumberField
                          label="Capacity"
                          value={eventFormData.capacity ? parseInt(eventFormData.capacity) : undefined}
                          onChange={(val) => setEventFormData({ ...eventFormData, capacity: val?.toString() || '' })}
                        />
                        <TextArea
                          label="Description"
                          placeholder="Enter event description"
                          value={eventFormData.description}
                          onChange={(val) => setEventFormData({ ...eventFormData, description: val })}
                        />
                        <Flex gap="md" marginTop="md">
                          <Button variant="solid" onPress={handleCreateEvent}>
                            Create
                          </Button>
                          <Button variant="ghost" onPress={() => setShowCreateEventDialog(false)}>
                            Cancel
                          </Button>
                        </Flex>
                      </Flex>
                    </Box>
                  </Dialog>
                </DialogTrigger>
              </Flex>
              <Table aria-label="Events list">
                <TableHeader>
                  <Column>Name</Column>
                  <Column>Date</Column>
                  <Column>Location</Column>
                  <Column>Capacity</Column>
                  <Column>Status</Column>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <Row key={event.id}>
                      <Cell>{event.name}</Cell>
                      <Cell>{event.date}</Cell>
                      <Cell>{event.venue}</Cell>
                      <Cell>{event.capacity}</Cell>
                      <Cell>
                        <Badge>{event.status}</Badge>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </Flex>
          )}

          {currentPage === 'Attendees' && (
            <Flex direction="column" gap="lg">
              <Heading size="lg">Attendees</Heading>
              <Flex gap="md" alignItems="center">
                <TextField
                  label="Search attendees"
                  placeholder="Search by name or email..."
                  value={searchAttendees}
                  onChange={setSearchAttendees}
                  flex="1"
                />
                <Text color="muted">{filteredAttendees.length} attendees</Text>
              </Flex>
              <Table aria-label="Attendees list">
                <TableHeader>
                  <Column>Name</Column>
                  <Column>Email</Column>
                  <Column>Events Attended</Column>
                  <Column>Last Active</Column>
                  <Column>Status</Column>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map((attendee) => (
                    <Row key={attendee.id}>
                      <Cell>{attendee.name}</Cell>
                      <Cell>{attendee.email}</Cell>
                      <Cell>{attendee.eventsAttended}</Cell>
                      <Cell>{attendee.lastActive}</Cell>
                      <Cell>
                        <Badge>{attendee.status}</Badge>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </Flex>
          )}

          {currentPage === 'Reports' && (
            <Flex direction="column" gap="lg">
              <Heading size="lg">Reports</Heading>
              <Tabs>
                <TabList>
                  <Tab>Revenue</Tab>
                  <Tab>Attendance</Tab>
                  <Tab>Overview</Tab>
                </TabList>
                <TabPanel>
                  <Flex direction="column" gap="lg" marginTop="lg">
                    <Flex gap="md" wrap="wrap">
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">Total Revenue</Text>
                        <Heading size="lg">$45,230</Heading>
                      </Box>
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">This Month</Text>
                        <Heading size="lg">$8,420</Heading>
                      </Box>
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">Average per Event</Text>
                        <Heading size="lg">$1,885</Heading>
                      </Box>
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">Refunds</Text>
                        <Heading size="lg">$1,230</Heading>
                      </Box>
                    </Flex>
                    <Banner variant="success">Revenue is up 12% compared to last month.</Banner>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction="column" gap="lg" marginTop="lg">
                    <Flex gap="md" wrap="wrap">
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">Total Attendees</Text>
                        <Heading size="lg">3,200</Heading>
                      </Box>
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">Repeat Visitors</Text>
                        <Heading size="lg">890</Heading>
                      </Box>
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">Average per Event</Text>
                        <Heading size="lg">178</Heading>
                      </Box>
                      <Box flex="1" minWidth="200px" padding="md" border="solid 1px" borderColor="border" borderRadius="md">
                        <Text size="sm" color="muted">No-shows</Text>
                        <Heading size="lg">145</Heading>
                      </Box>
                    </Flex>
                    <Box>
                      <Heading size="md" marginBottom="md">Top Events by Attendance</Heading>
                      <Table aria-label="Top events by attendance">
                        <TableHeader>
                          <Column>Event</Column>
                          <Column>Date</Column>
                          <Column>Attendees</Column>
                          <Column>Capacity</Column>
                          <Column>Fill Rate</Column>
                        </TableHeader>
                        <TableBody>
                          <Row>
                            <Cell>Summer Music Festival</Cell>
                            <Cell>2026-08-02</Cell>
                            <Cell>1200</Cell>
                            <Cell>1200</Cell>
                            <Cell>100%</Cell>
                          </Row>
                          <Row>
                            <Cell>Tech Conference 2026</Cell>
                            <Cell>2026-07-15</Cell>
                            <Cell>450</Cell>
                            <Cell>500</Cell>
                            <Cell>90%</Cell>
                          </Row>
                          <Row>
                            <Cell>Webinar Series Kickoff</Cell>
                            <Cell>2026-07-08</Cell>
                            <Cell>560</Cell>
                            <Cell>1000</Cell>
                            <Cell>56%</Cell>
                          </Row>
                          <Row>
                            <Cell>Charity Gala</Cell>
                            <Cell>2026-07-20</Cell>
                            <Cell>320</Cell>
                            <Cell>400</Cell>
                            <Cell>80%</Cell>
                          </Row>
                        </TableBody>
                      </Table>
                    </Box>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction="column" gap="lg" marginTop="lg">
                    <Text>
                      This quarter we've successfully executed 24 events with strong attendance and revenue growth.
                      Key highlights include the record-breaking Summer Music Festival and the launch of our new
                      Webinar Series. Overall satisfaction scores have improved by 8%.
                    </Text>
                    <Box>
                      <Heading size="sm" marginBottom="md">Q1 Summary</Heading>
                      <Text size="sm">
                        Q1 saw the foundation for our growth with 8 events generated $12,450 in revenue. We
                        established key partnerships and built our attendee base to 800 users.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="sm" marginBottom="md">Q2 Summary</Heading>
                      <Text size="sm">
                        Q2 was transformative with 10 events and $18,920 in revenue. The Tech Conference was our
                        flagship event. Attendee count grew to 2,100 with strong repeat visitor rates of 45%.
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="sm" marginBottom="md">Q3 Summary</Heading>
                      <Text size="sm">
                        Q3 projection shows 6 planned events with estimated revenue of $13,860. Focus is on
                        consolidating growth and improving operational efficiency through process refinements.
                      </Text>
                    </Box>
                  </Flex>
                </TabPanel>
              </Tabs>
            </Flex>
          )}

          {currentPage === 'Settings' && (
            <Flex direction="column" gap="lg">
              <Heading size="lg">Settings</Heading>
              <Tabs>
                <TabList>
                  <Tab>General</Tab>
                  <Tab>Notifications</Tab>
                </TabList>
                <TabPanel>
                  <Flex direction="column" gap="md" marginTop="lg" maxWidth="500px">
                    <TextField
                      label="Organization Name"
                      placeholder="EventHub Inc"
                      defaultValue="EventHub Inc"
                    />
                    <TextField
                      label="Contact Email"
                      type="email"
                      placeholder="contact@eventhub.com"
                      defaultValue="contact@eventhub.com"
                    />
                    <Select label="Default Currency" defaultValue="usd">
                      <SelectItem>USD</SelectItem>
                      <SelectItem>EUR</SelectItem>
                      <SelectItem>GBP</SelectItem>
                    </Select>
                    <Select label="Default Timezone" defaultValue="utc">
                      <SelectItem>UTC</SelectItem>
                      <SelectItem>CET</SelectItem>
                      <SelectItem>EST</SelectItem>
                      <SelectItem>PST</SelectItem>
                    </Select>
                    <Button variant="solid" onPress={handleSaveSettings} marginTop="md">
                      Save Changes
                    </Button>
                    {showSettingsSaved && (
                      <Banner variant="success">Settings saved successfully.</Banner>
                    )}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex direction="column" gap="md" marginTop="lg" maxWidth="500px">
                    <Box>
                      <Checkbox
                        checked={notificationSettings.email}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, email: checked })}
                      >
                        Email Notifications
                      </Checkbox>
                      <Text size="sm" color="muted">Receive event updates and announcements via email</Text>
                    </Box>
                    <Box>
                      <Checkbox
                        checked={notificationSettings.sms}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, sms: checked })}
                      >
                        SMS Notifications
                      </Checkbox>
                      <Text size="sm" color="muted">Get critical alerts on your phone</Text>
                    </Box>
                    <Box>
                      <Checkbox
                        checked={notificationSettings.digest}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, digest: checked })}
                      >
                        Weekly Digest
                      </Checkbox>
                      <Text size="sm" color="muted">Receive a weekly summary of all your events</Text>
                    </Box>
                    <Box>
                      <Checkbox
                        checked={notificationSettings.marketing}
                        onChange={(checked) => setNotificationSettings({ ...notificationSettings, marketing: checked })}
                      >
                        Marketing Emails
                      </Checkbox>
                      <Text size="sm" color="muted">Learn about new features and promotional offers</Text>
                    </Box>
                    <Button variant="solid" onPress={handleSaveSettings} marginTop="md">
                      Save Preferences
                    </Button>
                  </Flex>
                </TabPanel>
              </Tabs>
            </Flex>
          )}
        </Box>
      </Flex>

      <DialogTrigger isOpen={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <Dialog>
          <Box padding="lg">
            <Heading size="md" marginBottom="md">Sign out</Heading>
            <Text marginBottom="lg">Are you sure you want to sign out?</Text>
            <Flex gap="md">
              <Button variant="solid" onPress={() => setShowSignOutDialog(false)}>
                Cancel
              </Button>
              <Button variant="ghost" onPress={() => setShowSignOutDialog(false)}>
                Sign out
              </Button>
            </Flex>
          </Box>
        </Dialog>
      </DialogTrigger>
    </Flex>
  );
};

export default EventHub;
