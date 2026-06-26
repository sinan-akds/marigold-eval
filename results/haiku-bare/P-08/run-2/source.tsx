import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  Tabs,
  Tab,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  Heading,
  Text,
  Banner,
  Switch,
  Select,
  SelectItem,
  MenuButton,
  Menu,
  MenuItem,
  Flex,
  Box,
  Stack,
  Popover,
  Content,
  Tooltip,
  Checkbox,
  Fieldset,
  Label,
  TextArea,
  DateField,
  NumberField,
} from '@marigold/components';

interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  ticketsSold: number;
  status: 'On Sale' | 'Draft' | 'Sold Out';
}

interface Attendee {
  id: number;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
}

interface CreatingEvent {
  name: string;
  date: string;
  location: string;
  capacity: string;
  description: string;
}

const EventHub = () => {
  const [currentPage, setCurrentPage] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [reportsTab, setReportsTab] = useState('revenue');
  const [settingsTab, setSettingsTab] = useState('general');
  const [newEvent, setNewEvent] = useState<CreatingEvent>({
    name: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
  });
  const [settingsForm, setSettingsForm] = useState({
    orgName: 'Tech Events Inc.',
    email: 'contact@techevents.com',
    currency: 'USD',
    timezone: 'UTC',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    weekly: true,
    marketing: false,
  });
  const [savedSettings, setSavedSettings] = useState(false);

  // Sample data
  const upcomingEvents: Event[] = [
    { id: 1, name: 'React Conference 2026', date: '2026-07-15', venue: 'Convention Center A', ticketsSold: 450, status: 'On Sale' },
    { id: 2, name: 'Web Dev Workshop', date: '2026-07-20', venue: 'Tech Hub Downtown', ticketsSold: 120, status: 'On Sale' },
    { id: 3, name: 'JavaScript Summit', date: '2026-08-05', venue: 'Grand Hotel', ticketsSold: 0, status: 'Draft' },
    { id: 4, name: 'TypeScript Bootcamp', date: '2026-08-10', venue: 'Education Center', ticketsSold: 250, status: 'Sold Out' },
    { id: 5, name: 'Node.js Workshop', date: '2026-08-15', venue: 'Convention Center B', ticketsSold: 180, status: 'On Sale' },
    { id: 6, name: 'Frontend Framework Expo', date: '2026-08-22', venue: 'Tech Hub Downtown', ticketsSold: 320, status: 'On Sale' },
  ];

  const allEvents: Event[] = [
    ...upcomingEvents,
    { id: 7, name: 'Rust in Web', date: '2026-06-10', venue: 'Virtual', ticketsSold: 280, status: 'Sold Out' },
    { id: 8, name: 'Python Data Science', date: '2026-06-12', venue: 'Tech Park', ticketsSold: 150, status: 'Sold Out' },
  ];

  const attendees: Attendee[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2026-06-18', status: 'Active' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-06-21', status: 'Active' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', eventsAttended: 2, lastActive: '2026-05-10', status: 'Inactive' },
    { id: 5, name: 'Eve Martinez', email: 'eve@example.com', eventsAttended: 12, lastActive: '2026-06-19', status: 'Active' },
    { id: 6, name: 'Frank Brown', email: 'frank@example.com', eventsAttended: 1, lastActive: '2026-04-15', status: 'Inactive' },
  ];

  const topEventsByAttendance = [
    { event: 'React Conference 2026', date: '2026-07-15', attendees: 420, capacity: 500, fillRate: '84%' },
    { event: 'JavaScript Summit', date: '2026-08-05', attendees: 380, capacity: 450, fillRate: '84%' },
    { event: 'TypeScript Bootcamp', date: '2026-08-10', attendees: 240, capacity: 250, fillRate: '96%' },
    { event: 'Frontend Framework Expo', date: '2026-08-22', attendees: 310, capacity: 350, fillRate: '89%' },
  ];

  const handleCreateEvent = () => {
    if (newEvent.name && newEvent.date) {
      console.log('Creating event:', newEvent);
      setNewEvent({ name: '', date: '', location: '', capacity: '', description: '' });
      setShowCreateEventDialog(false);
    }
  };

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 3000);
  };

  const filteredEvents = allEvents.filter(e =>
    e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.venue.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === 'On Sale') return 'success';
    if (status === 'Draft') return 'warning';
    if (status === 'Sold Out') return 'critical';
    return 'neutral';
  };

  const getAttendeeStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'warning';
  };

  const renderDashboard = () => (
    <Stack gap="large" padding="large">
      <Heading level="1">Dashboard Overview</Heading>
      <Banner variant="info">
        Welcome back! You have 3 events starting this week.
      </Banner>

      <Flex gap="large" wrap>
        <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <Stack gap="medium" padding="medium">
            <Text color="neutral" size="small">Total Events</Text>
            <Text size="large" weight="bold">24</Text>
          </Stack>
        </Card>
        <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <Stack gap="medium" padding="medium">
            <Text color="neutral" size="small">Tickets Sold</Text>
            <Text size="large" weight="bold">1,849</Text>
          </Stack>
        </Card>
        <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <Stack gap="medium" padding="medium">
            <Tooltip text="Net revenue after fees and refunds">
              <Text color="neutral" size="small">Revenue</Text>
            </Tooltip>
            <Text size="large" weight="bold">$45,230</Text>
          </Stack>
        </Card>
        <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <Stack gap="medium" padding="medium">
            <Text color="neutral" size="small">Upcoming</Text>
            <Text size="large" weight="bold">8</Text>
          </Stack>
        </Card>
      </Flex>

      <Box>
        <Heading level="2">Upcoming Events</Heading>
        <Table aria-label="Upcoming Events">
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Tickets Sold</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingEvents.map(event => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>{event.ticketsSold}</TableCell>
                <TableCell>
                  <Box
                    padding="small"
                    style={{
                      backgroundColor: getStatusColor(event.status) === 'success' ? '#e6f7e6' :
                                      getStatusColor(event.status) === 'critical' ? '#ffe6e6' : '#fff3e0',
                      color: getStatusColor(event.status) === 'success' ? '#2d6a2d' :
                             getStatusColor(event.status) === 'critical' ? '#cc0000' : '#cc7000',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    {event.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );

  const renderEvents = () => (
    <Stack gap="large" padding="large">
      <Heading level="1">Events</Heading>
      <Flex gap="medium">
        <TextField
          label="Search events"
          placeholder="Search by name or location"
          value={eventSearch}
          onChange={(value) => setEventSearch(value || '')}
          style={{ flex: 1 }}
        />
        <Button variant="primary" onPress={() => setShowCreateEventDialog(true)}>
          Create Event
        </Button>
      </Flex>

      <Box>
        <Table aria-label="Events">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map(event => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>500</TableCell>
                <TableCell>
                  <Box
                    padding="small"
                    style={{
                      backgroundColor: getStatusColor(event.status) === 'success' ? '#e6f7e6' :
                                      getStatusColor(event.status) === 'critical' ? '#ffe6e6' : '#fff3e0',
                      color: getStatusColor(event.status) === 'success' ? '#2d6a2d' :
                             getStatusColor(event.status) === 'critical' ? '#cc0000' : '#cc7000',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    {event.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {showCreateEventDialog && (
        <Dialog onClose={() => setShowCreateEventDialog(false)}>
          <Stack gap="medium" padding="large">
            <Heading level="2">Create Event</Heading>
            <TextField
              label="Event Name"
              isRequired
              placeholder="Event name"
              value={newEvent.name}
              onChange={(value) => setNewEvent({ ...newEvent, name: value || '' })}
            />
            <DateField
              label="Date"
              isRequired
              value={newEvent.date}
              onChange={(value) => setNewEvent({ ...newEvent, date: value || '' })}
            />
            <TextField
              label="Location"
              placeholder="Location"
              value={newEvent.location}
              onChange={(value) => setNewEvent({ ...newEvent, location: value || '' })}
            />
            <NumberField
              label="Capacity"
              placeholder="0"
              value={newEvent.capacity}
              onChange={(value) => setNewEvent({ ...newEvent, capacity: value || '' })}
            />
            <TextArea
              label="Description"
              placeholder="Event description"
              value={newEvent.description}
              onChange={(value) => setNewEvent({ ...newEvent, description: value || '' })}
            />
            <Flex gap="medium" justifyContent="flex-end">
              <Button variant="secondary" onPress={() => setShowCreateEventDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onPress={handleCreateEvent}>
                Create
              </Button>
            </Flex>
          </Stack>
        </Dialog>
      )}
    </Stack>
  );

  const renderAttendees = () => (
    <Stack gap="large" padding="large">
      <Heading level="1">Attendees</Heading>
      <Flex gap="medium" alignItems="center">
        <TextField
          label="Search attendees"
          placeholder="Search by name or email"
          value={attendeeSearch}
          onChange={(value) => setAttendeeSearch(value || '')}
          style={{ flex: 1 }}
        />
        <Text>{filteredAttendees.length} attendees</Text>
      </Flex>

      <Box>
        <Table aria-label="Attendees">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Events Attended</TableCell>
              <TableCell>Last Active</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendees.map(attendee => (
              <TableRow key={attendee.id}>
                <TableCell>{attendee.name}</TableCell>
                <TableCell>{attendee.email}</TableCell>
                <TableCell>{attendee.eventsAttended}</TableCell>
                <TableCell>{attendee.lastActive}</TableCell>
                <TableCell>
                  <Box
                    padding="small"
                    style={{
                      backgroundColor: attendee.status === 'Active' ? '#e6f7e6' : '#fff3e0',
                      color: attendee.status === 'Active' ? '#2d6a2d' : '#cc7000',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    {attendee.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );

  const renderReports = () => (
    <Stack gap="large" padding="large">
      <Heading level="1">Reports</Heading>
      <Tabs value={reportsTab} onChange={setReportsTab}>
        <Tab key="revenue" value="revenue">
          Revenue
        </Tab>
        <Tab key="attendance" value="attendance">
          Attendance
        </Tab>
        <Tab key="overview" value="overview">
          Overview
        </Tab>
      </Tabs>

      {reportsTab === 'revenue' && (
        <TabPanel>
          <Stack gap="large">
            <Banner variant="success">
              Revenue is up 12% compared to last month.
            </Banner>
            <Flex gap="large" wrap>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">Total Revenue</Text>
                  <Text size="large" weight="bold">$45,230</Text>
                </Stack>
              </Card>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">This Month</Text>
                  <Text size="large" weight="bold">$8,420</Text>
                </Stack>
              </Card>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">Average per Event</Text>
                  <Text size="large" weight="bold">$1,885</Text>
                </Stack>
              </Card>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">Refunds</Text>
                  <Text size="large" weight="bold">$1,230</Text>
                </Stack>
              </Card>
            </Flex>
          </Stack>
        </TabPanel>
      )}

      {reportsTab === 'attendance' && (
        <TabPanel>
          <Stack gap="large">
            <Flex gap="large" wrap>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">Total Attendees</Text>
                  <Text size="large" weight="bold">3,200</Text>
                </Stack>
              </Card>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">Repeat Visitors</Text>
                  <Text size="large" weight="bold">890</Text>
                </Stack>
              </Card>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">Average per Event</Text>
                  <Text size="large" weight="bold">178</Text>
                </Stack>
              </Card>
              <Card style={{ flex: '1 1 200px', minWidth: '180px' }}>
                <Stack gap="medium" padding="medium">
                  <Text color="neutral" size="small">No-shows</Text>
                  <Text size="large" weight="bold">145</Text>
                </Stack>
              </Card>
            </Flex>

            <Box>
              <Heading level="2">Top Events by Attendance</Heading>
              <Table aria-label="Top Events by Attendance">
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Attendees</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Fill Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topEventsByAttendance.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.event}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.attendees}</TableCell>
                      <TableCell>{item.capacity}</TableCell>
                      <TableCell>{item.fillRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </TabPanel>
      )}

      {reportsTab === 'overview' && (
        <TabPanel>
          <Stack gap="large">
            <Text>
              This comprehensive overview summarizes key performance indicators across all events and attendee segments for the current period. Our event management platform has facilitated strong growth in both revenue and attendance, with significant improvements in operational efficiency.
            </Text>

            <Fieldset legend="Q1 Summary">
              <Text>
                Q1 was marked by strong attendance growth with 12 successful events hosted across multiple venues. Total revenue reached $22,450 with an average attendance of 165 participants per event. Key highlights include the successful launch of the TypeScript Bootcamp series and expansion into new geographic markets.
              </Text>
            </Fieldset>

            <Fieldset legend="Q2 Summary">
              <Text>
                Q2 showed continued momentum with 13 events delivered and revenue increase to $23,780. The introduction of hybrid event formats expanded our reach, and ticket conversion rates improved by 8% compared to Q1. Customer satisfaction scores remained high at 4.6/5.0.
              </Text>
            </Fieldset>

            <Fieldset legend="Q3 Summary">
              <Text>
                Q3 planning is underway with 9 events confirmed and pipeline showing strong demand. Projected revenue for the quarter is $24,500 based on current booking trends. We are implementing new attendee engagement features and expanding our network of partner venues.
              </Text>
            </Fieldset>
          </Stack>
        </TabPanel>
      )}
    </Stack>
  );

  const renderSettings = () => (
    <Stack gap="large" padding="large">
      <Heading level="1">Settings</Heading>
      <Tabs value={settingsTab} onChange={setSettingsTab}>
        <Tab key="general" value="general">
          General
        </Tab>
        <Tab key="notifications" value="notifications">
          Notifications
        </Tab>
      </Tabs>

      {settingsTab === 'general' && (
        <TabPanel>
          <Stack gap="large" style={{ maxWidth: '400px' }}>
            {savedSettings && (
              <Banner variant="success">
                Settings saved successfully.
              </Banner>
            )}
            <TextField
              label="Organization Name"
              value={settingsForm.orgName}
              onChange={(value) => setSettingsForm({ ...settingsForm, orgName: value || '' })}
            />
            <TextField
              label="Contact Email"
              type="email"
              value={settingsForm.email}
              onChange={(value) => setSettingsForm({ ...settingsForm, email: value || '' })}
            />
            <Select
              label="Default Currency"
              value={settingsForm.currency}
              onChange={(value) => setSettingsForm({ ...settingsForm, currency: value || 'USD' })}
            >
              <SelectItem key="USD" value="USD">USD</SelectItem>
              <SelectItem key="EUR" value="EUR">EUR</SelectItem>
              <SelectItem key="GBP" value="GBP">GBP</SelectItem>
            </Select>
            <Select
              label="Default Timezone"
              value={settingsForm.timezone}
              onChange={(value) => setSettingsForm({ ...settingsForm, timezone: value || 'UTC' })}
            >
              <SelectItem key="UTC" value="UTC">UTC</SelectItem>
              <SelectItem key="CET" value="CET">CET</SelectItem>
              <SelectItem key="EST" value="EST">EST</SelectItem>
              <SelectItem key="PST" value="PST">PST</SelectItem>
            </Select>
            <Button variant="primary" onPress={handleSaveSettings}>
              Save Changes
            </Button>
          </Stack>
        </TabPanel>
      )}

      {settingsTab === 'notifications' && (
        <TabPanel>
          <Stack gap="large" style={{ maxWidth: '400px' }}>
            <Box>
              <Flex gap="medium" alignItems="center">
                <Switch
                  isSelected={notifications.email}
                  onChange={(selected) => setNotifications({ ...notifications, email: selected })}
                />
                <Stack gap="small">
                  <Text weight="bold">Email Notifications</Text>
                  <Text color="neutral" size="small">Receive email alerts for important events</Text>
                </Stack>
              </Flex>
            </Box>

            <Box>
              <Flex gap="medium" alignItems="center">
                <Switch
                  isSelected={notifications.sms}
                  onChange={(selected) => setNotifications({ ...notifications, sms: selected })}
                />
                <Stack gap="small">
                  <Text weight="bold">SMS Notifications</Text>
                  <Text color="neutral" size="small">Receive SMS for urgent notifications</Text>
                </Stack>
              </Flex>
            </Box>

            <Box>
              <Flex gap="medium" alignItems="center">
                <Switch
                  isSelected={notifications.weekly}
                  onChange={(selected) => setNotifications({ ...notifications, weekly: selected })}
                />
                <Stack gap="small">
                  <Text weight="bold">Weekly Digest</Text>
                  <Text color="neutral" size="small">Get a weekly summary of your events</Text>
                </Stack>
              </Flex>
            </Box>

            <Box>
              <Flex gap="medium" alignItems="center">
                <Switch
                  isSelected={notifications.marketing}
                  onChange={(selected) => setNotifications({ ...notifications, marketing: selected })}
                />
                <Stack gap="small">
                  <Text weight="bold">Marketing Emails</Text>
                  <Text color="neutral" size="small">Receive updates about new features and promotions</Text>
                </Stack>
              </Flex>
            </Box>

            <Button variant="primary" onPress={() => console.log('Preferences saved')}>
              Save Preferences
            </Button>
          </Stack>
        </TabPanel>
      )}
    </Stack>
  );

  const pages: { [key: string]: () => React.ReactNode } = {
    Dashboard: renderDashboard,
    Events: renderEvents,
    Attendees: renderAttendees,
    Reports: renderReports,
    Settings: renderSettings,
  };

  return (
    <Flex style={{ minHeight: '100vh' }} direction="column">
      {/* Top Bar */}
      <Box
        style={{
          borderBottom: '1px solid #e0e0e0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Flex gap="medium" alignItems="center">
          <Button
            variant="secondary"
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </Button>
          <Text>EventHub {currentPage !== 'Dashboard' ? `> ${currentPage}` : ''}</Text>
        </Flex>

        <Box>
          <MenuButton>
            Account ▼
            <Menu onAction={(key) => {
              if (key === 'signout') {
                setShowSignOutDialog(true);
              }
            }}>
              <MenuItem key="profile">Profile</MenuItem>
              <MenuItem key="signout">Sign out</MenuItem>
            </Menu>
          </MenuButton>
        </Box>
      </Box>

      {/* Main Layout */}
      <Flex style={{ flex: 1 }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <Box
            style={{
              width: '200px',
              borderRight: '1px solid #e0e0e0',
              padding: '16px',
              backgroundColor: '#f5f5f5',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Heading level="3" style={{ marginBottom: '24px' }}>EventHub</Heading>
            <Stack gap="small" style={{ flex: 1 }}>
              {['Dashboard', 'Events', 'Attendees', 'Reports'].map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'secondary'}
                  onPress={() => setCurrentPage(page)}
                  style={{ justifyContent: 'flex-start' }}
                >
                  {page}
                </Button>
              ))}
              <Box style={{ borderTop: '1px solid #d0d0d0', paddingTop: '16px', marginTop: '16px' }}>
                <Button
                  key="settings"
                  variant={currentPage === 'Settings' ? 'primary' : 'secondary'}
                  onPress={() => setCurrentPage('Settings')}
                  style={{ justifyContent: 'flex-start' }}
                >
                  Settings
                </Button>
              </Box>
            </Stack>

            <Box style={{ borderTop: '1px solid #d0d0d0', paddingTop: '16px', marginTop: '16px' }}>
              <Button
                variant="secondary"
                onPress={() => console.log('Help clicked')}
                style={{ justifyContent: 'flex-start', width: '100%' }}
              >
                Help & Support
              </Button>
            </Box>
          </Box>
        )}

        {/* Main Content */}
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          {pages[currentPage] && pages[currentPage]()}
        </Box>
      </Flex>

      {/* Sign Out Confirmation Dialog */}
      {showSignOutDialog && (
        <Dialog onClose={() => setShowSignOutDialog(false)}>
          <Stack gap="medium" padding="large">
            <Heading level="2">Confirm Sign Out</Heading>
            <Text>Are you sure you want to sign out?</Text>
            <Flex gap="medium" justifyContent="flex-end">
              <Button
                variant="secondary"
                onPress={() => setShowSignOutDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="critical"
                onPress={() => {
                  setShowSignOutDialog(false);
                  console.log('Signed out');
                }}
              >
                Sign out
              </Button>
            </Flex>
          </Stack>
        </Dialog>
      )}
    </Flex>
  );
};

export default EventHub;
