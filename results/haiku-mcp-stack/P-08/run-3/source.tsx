import { useState } from 'react';
import {
  Button,
  Stack,
  Inline,
  Columns,
  Heading,
  Text,
  TextField,
  Table,
  Card,
  Badge,
  Banner,
  Dialog,
  DialogTrigger,
  Tabs,
  Menu,
  MenuTrigger,
  MenuItem,
  Divider,
  Checkbox,
  Select,
  SelectItem,
  NumberField,
  Textarea,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';
type ReportsTab = 'revenue' | 'attendance' | 'overview';
type SettingsTab = 'general' | 'notifications';

const EventHub = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [reportsTab, setReportsTab] = useState<ReportsTab>('revenue');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [eventSearch, setEventSearch] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const upcomingEvents = [
    { id: 1, name: 'Tech Conference 2026', date: '2026-07-15', venue: 'Convention Center', ticketsSold: 450, status: 'On Sale' },
    { id: 2, name: 'Summer Music Festival', date: '2026-08-20', venue: 'Central Park', ticketsSold: 1200, status: 'On Sale' },
    { id: 3, name: 'Web Development Summit', date: '2026-07-25', venue: 'Downtown Hall', ticketsSold: 320, status: 'On Sale' },
    { id: 4, name: 'Product Launch Event', date: '2026-07-10', venue: 'Tech Hub', ticketsSold: 150, status: 'Draft' },
    { id: 5, name: 'Annual Gala Dinner', date: '2026-09-05', venue: 'Grand Ballroom', ticketsSold: 280, status: 'On Sale' },
    { id: 6, name: 'Art Exhibition Opening', date: '2026-07-01', venue: 'Art Museum', ticketsSold: 500, status: 'Sold Out' },
  ];

  const allEvents = [
    { id: 1, name: 'Tech Conference 2026', date: '2026-07-15', location: 'Convention Center', capacity: 1000, status: 'On Sale' },
    { id: 2, name: 'Summer Music Festival', date: '2026-08-20', location: 'Central Park', capacity: 2000, status: 'On Sale' },
    { id: 3, name: 'Web Development Summit', date: '2026-07-25', location: 'Downtown Hall', capacity: 800, status: 'On Sale' },
    { id: 4, name: 'Product Launch Event', date: '2026-07-10', location: 'Tech Hub', capacity: 500, status: 'Draft' },
    { id: 5, name: 'Annual Gala Dinner', date: '2026-09-05', location: 'Grand Ballroom', capacity: 300, status: 'On Sale' },
    { id: 6, name: 'Art Exhibition Opening', date: '2026-07-01', location: 'Art Museum', capacity: 1500, status: 'Sold Out' },
  ];

  const attendees = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', eventsAttended: 5, lastActive: '2026-06-20', status: 'Active' },
    { id: 2, name: 'Michael Chen', email: 'michael@example.com', eventsAttended: 12, lastActive: '2026-06-21', status: 'Active' },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', eventsAttended: 3, lastActive: '2026-05-10', status: 'Inactive' },
    { id: 4, name: 'James Wilson', email: 'james@example.com', eventsAttended: 8, lastActive: '2026-06-19', status: 'Active' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@example.com', eventsAttended: 2, lastActive: '2026-04-15', status: 'Inactive' },
    { id: 6, name: 'David Martinez', email: 'david@example.com', eventsAttended: 15, lastActive: '2026-06-22', status: 'Active' },
  ];

  const topEventsByAttendance = [
    { id: 1, event: 'Summer Music Festival', date: '2026-08-20', attendees: 1850, capacity: 2000, fillRate: '92.5%' },
    { id: 2, event: 'Tech Conference 2026', date: '2026-07-15', attendees: 890, capacity: 1000, fillRate: '89.0%' },
    { id: 3, event: 'Art Exhibition Opening', date: '2026-07-01', attendees: 1200, capacity: 1500, fillRate: '80.0%' },
    { id: 4, event: 'Web Development Summit', date: '2026-07-25', attendees: 650, capacity: 800, fillRate: '81.25%' },
  ];

  const filteredEvents = allEvents.filter(e =>
    e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    a.email.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const handleSignOut = () => {
    setSignOutOpen(false);
    alert('Signed out successfully');
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Sale':
        return 'info';
      case 'Draft':
        return 'warning';
      case 'Sold Out':
        return 'success';
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      default:
        return 'info';
    }
  };

  const renderDashboard = () => (
    <Stack space="large">
      <Heading level="1">Dashboard Overview</Heading>
      <Banner variant="info">
        Welcome back! You have 3 events starting this week.
      </Banner>

      <Columns columns={{ mobile: 1, tablet: 2, desktop: 4 }} space="large">
        <Card>
          <Stack space="small">
            <Text variant="label">Total Events</Text>
            <Text weight="bold">24</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space="small">
            <Text variant="label">Tickets Sold</Text>
            <Text weight="bold">1,849</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space="small">
            <Text variant="label">Revenue</Text>
            <Text weight="bold">$45,230</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space="small">
            <Text variant="label">Upcoming</Text>
            <Text weight="bold">8</Text>
          </Stack>
        </Card>
      </Columns>

      <Stack space="medium">
        <Heading level="2">Upcoming Events</Heading>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Event</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Venue</Table.HeaderCell>
              <Table.HeaderCell>Tickets Sold</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {upcomingEvents.map(event => (
              <Table.Row key={event.id}>
                <Table.Cell>{event.name}</Table.Cell>
                <Table.Cell>{event.date}</Table.Cell>
                <Table.Cell>{event.venue}</Table.Cell>
                <Table.Cell>{event.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusColor(event.status)}>{event.status}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  const renderEvents = () => (
    <Stack space="large">
      <Heading level="1">Events</Heading>

      <Inline space="medium" alignY="center">
        <TextField
          placeholder="Search by name or location..."
          value={eventSearch}
          onChange={setEventSearch}
        />
        <DialogTrigger onOpenChange={setCreateEventOpen}>
          <Button variant="primary">Create Event</Button>
          <Dialog>
            <Stack space="medium">
              <Heading level="2">Create Event</Heading>
              <TextField label="Event Name" required />
              <TextField type="date" label="Date" />
              <TextField label="Location" />
              <NumberField label="Capacity" />
              <Textarea label="Description" />
              <Inline space="medium">
                <Button variant="primary">Create</Button>
                <Button onPress={() => setCreateEventOpen(false)}>Cancel</Button>
              </Inline>
            </Stack>
          </Dialog>
        </DialogTrigger>
      </Inline>

      <Table aria-label="Events">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Capacity</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredEvents.map(event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell>{event.capacity}</Table.Cell>
              <Table.Cell>
                <Badge color={getStatusColor(event.status)}>{event.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderAttendees = () => (
    <Stack space="large">
      <Heading level="1">Attendees</Heading>

      <Inline space="medium" alignY="center">
        <TextField
          placeholder="Search by name or email..."
          value={attendeeSearch}
          onChange={setAttendeeSearch}
        />
        <Text>{filteredAttendees.length} attendees</Text>
      </Inline>

      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Events Attended</Table.HeaderCell>
            <Table.HeaderCell>Last Active</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredAttendees.map(attendee => (
            <Table.Row key={attendee.id}>
              <Table.Cell>{attendee.name}</Table.Cell>
              <Table.Cell>{attendee.email}</Table.Cell>
              <Table.Cell>{attendee.eventsAttended}</Table.Cell>
              <Table.Cell>{attendee.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge color={getStatusColor(attendee.status)}>{attendee.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderReports = () => (
    <Stack space="large">
      <Heading level="1">Reports</Heading>

      <Tabs selectedKey={reportsTab} onSelectionChange={(key) => setReportsTab(key as ReportsTab)}>
        <Tabs.Tab id="revenue" title="Revenue">
          <Stack space="large">
            <Columns columns={{ mobile: 1, tablet: 2, desktop: 4 }} space="large">
              <Card>
                <Stack space="small">
                  <Text variant="label">Total Revenue</Text>
                  <Text weight="bold">$45,230</Text>
                </Stack>
              </Card>
              <Card>
                <Stack space="small">
                  <Text variant="label">This Month</Text>
                  <Text weight="bold">$8,420</Text>
                </Stack>
              </Card>
              <Card>
                <Stack space="small">
                  <Text variant="label">Average per Event</Text>
                  <Text weight="bold">$1,885</Text>
                </Stack>
              </Card>
              <Card>
                <Stack space="small">
                  <Text variant="label">Refunds</Text>
                  <Text weight="bold">$1,230</Text>
                </Stack>
              </Card>
            </Columns>
            <Banner variant="success">Revenue is up 12% compared to last month.</Banner>
          </Stack>
        </Tabs.Tab>

        <Tabs.Tab id="attendance" title="Attendance">
          <Stack space="large">
            <Columns columns={{ mobile: 1, tablet: 2, desktop: 4 }} space="large">
              <Card>
                <Stack space="small">
                  <Text variant="label">Total Attendees</Text>
                  <Text weight="bold">3,200</Text>
                </Stack>
              </Card>
              <Card>
                <Stack space="small">
                  <Text variant="label">Repeat Visitors</Text>
                  <Text weight="bold">890</Text>
                </Stack>
              </Card>
              <Card>
                <Stack space="small">
                  <Text variant="label">Average per Event</Text>
                  <Text weight="bold">178</Text>
                </Stack>
              </Card>
              <Card>
                <Stack space="small">
                  <Text variant="label">No-shows</Text>
                  <Text weight="bold">145</Text>
                </Stack>
              </Card>
            </Columns>

            <Stack space="medium">
              <Heading level="2">Top Events by Attendance</Heading>
              <Table aria-label="Top Events by Attendance">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Event</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Attendees</Table.HeaderCell>
                    <Table.HeaderCell>Capacity</Table.HeaderCell>
                    <Table.HeaderCell>Fill Rate</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {topEventsByAttendance.map(event => (
                    <Table.Row key={event.id}>
                      <Table.Cell>{event.event}</Table.Cell>
                      <Table.Cell>{event.date}</Table.Cell>
                      <Table.Cell>{event.attendees}</Table.Cell>
                      <Table.Cell>{event.capacity}</Table.Cell>
                      <Table.Cell>{event.fillRate}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.Tab>

        <Tabs.Tab id="overview" title="Overview">
          <Stack space="large">
            <Text>
              This quarter has shown strong growth across all major metrics. Event attendance
              is up significantly, and revenue per event continues to increase. We're seeing
              particularly strong performance in the music and technology event categories.
            </Text>

            <Stack space="medium">
              <Heading level="3">Q1 Summary</Heading>
              <Text>
                Q1 was a strong start to the year with 8 major events organized and over
                1,200 attendees. Revenue exceeded projections by 8%.
              </Text>
            </Stack>

            <Stack space="medium">
              <Heading level="3">Q2 Summary</Heading>
              <Text>
                Q2 saw continued growth with 12 events and expanded marketing efforts.
                Repeat visitor rates improved by 15%.
              </Text>
            </Stack>

            <Stack space="medium">
              <Heading level="3">Q3 Summary</Heading>
              <Text>
                Q3 projections show seasonal peaks in summer events with expected capacity
                reaching 95% across our largest venues.
              </Text>
            </Stack>
          </Stack>
        </Tabs.Tab>
      </Tabs>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space="large">
      <Heading level="1">Settings</Heading>

      <Tabs selectedKey={settingsTab} onSelectionChange={(key) => setSettingsTab(key as SettingsTab)}>
        <Tabs.Tab id="general" title="General">
          <Stack space="medium">
            {settingsSaved && (
              <Banner variant="success">Settings saved successfully.</Banner>
            )}
            <TextField label="Organization Name" defaultValue="EventHub Inc." />
            <TextField label="Contact Email" type="email" defaultValue="contact@eventhub.com" />
            <Select label="Default Currency" defaultValue="usd">
              <SelectItem id="usd">USD</SelectItem>
              <SelectItem id="eur">EUR</SelectItem>
              <SelectItem id="gbp">GBP</SelectItem>
            </Select>
            <Select label="Default Timezone" defaultValue="utc">
              <SelectItem id="utc">UTC</SelectItem>
              <SelectItem id="cet">CET</SelectItem>
              <SelectItem id="est">EST</SelectItem>
              <SelectItem id="pst">PST</SelectItem>
            </Select>
            <Button variant="primary" onPress={handleSaveSettings}>
              Save Changes
            </Button>
          </Stack>
        </Tabs.Tab>

        <Tabs.Tab id="notifications" title="Notifications">
          <Stack space="medium">
            {notificationsSaved && (
              <Banner variant="success">Notification preferences saved.</Banner>
            )}
            <Stack space="small">
              <Inline space="medium" alignY="start">
                <Checkbox
                  isSelected={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <Stack space="xsmall">
                  <Text weight="bold">Email Notifications</Text>
                  <Text>Get notified about important event updates via email</Text>
                </Stack>
              </Inline>
            </Stack>

            <Stack space="small">
              <Inline space="medium" alignY="start">
                <Checkbox
                  isSelected={smsNotifications}
                  onChange={setSmsNotifications}
                />
                <Stack space="xsmall">
                  <Text weight="bold">SMS Notifications</Text>
                  <Text>Receive urgent updates via SMS</Text>
                </Stack>
              </Inline>
            </Stack>

            <Stack space="small">
              <Inline space="medium" alignY="start">
                <Checkbox
                  isSelected={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <Stack space="xsmall">
                  <Text weight="bold">Weekly Digest</Text>
                  <Text>Get a weekly summary of all event activities</Text>
                </Stack>
              </Inline>
            </Stack>

            <Stack space="small">
              <Inline space="medium" alignY="start">
                <Checkbox
                  isSelected={marketingEmails}
                  onChange={setMarketingEmails}
                />
                <Stack space="xsmall">
                  <Text weight="bold">Marketing Emails</Text>
                  <Text>Receive promotional offers and product updates</Text>
                </Stack>
              </Inline>
            </Stack>

            <Button variant="primary" onPress={handleSaveNotifications}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.Tab>
      </Tabs>
    </Stack>
  );

  return (
    <Stack direction="row" height="100vh" space="none">
      {/* Sidebar */}
      {sidebarOpen && (
        <Stack space="large" width="250px" style={{ padding: '1.5rem', borderRight: '1px solid var(--color-border)', overflow: 'auto' }}>
          <Heading level="1">EventHub</Heading>

          <Stack space="small">
            {(['dashboard', 'events', 'attendees', 'reports', 'settings'] as const).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'solid' : 'ghost'}
                width="100%"
                onPress={() => setCurrentPage(page)}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </Button>
            ))}
          </Stack>

          <Divider />

          <Button variant="ghost" width="100%">
            Help & Support
          </Button>
        </Stack>
      )}

      {/* Main Content */}
      <Stack direction="column" width="100%" space="none">
        {/* Top Bar */}
        <Inline space="medium" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            variant="ghost"
            size="small"
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </Button>

          <Text size="small">
            EventHub &gt; {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
          </Text>

          <MenuTrigger>
            <Button variant="ghost" size="small">👤</Button>
            <Menu onAction={(key) => {
              if (key === 'profile') {
                alert('Profile page');
              } else if (key === 'signout') {
                setSignOutOpen(true);
              }
            }}>
              <MenuItem id="profile">Profile</MenuItem>
              <MenuItem id="signout">Sign out</MenuItem>
            </Menu>
          </MenuTrigger>
        </Inline>

        {/* Sign Out Dialog */}
        {signOutOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <Card style={{ padding: '2rem', maxWidth: '400px' }}>
              <Stack space="medium">
                <Heading level="2">Confirm Sign Out</Heading>
                <Text>Are you sure you want to sign out?</Text>
                <Inline space="medium">
                  <Button variant="primary" onPress={handleSignOut}>Sign out</Button>
                  <Button variant="secondary" onPress={() => setSignOutOpen(false)}>Cancel</Button>
                </Inline>
              </Stack>
            </Card>
          </div>
        )}

        {/* Page Content */}
        <div style={{
          overflow: 'auto',
          flex: 1,
          padding: '1.5rem',
        }}>
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'events' && renderEvents()}
          {currentPage === 'attendees' && renderAttendees()}
          {currentPage === 'reports' && renderReports()}
          {currentPage === 'settings' && renderSettings()}
        </div>
      </Stack>
    </Stack>
  );
};

export default EventHub;
