import { useState } from 'react';
import {
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  Headline,
  Inline,
  Inset,
  Menu,
  SearchField,
  SectionMessage,
  Sidebar,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
  TopNavigation,
  Divider,
  Accordion,
  Switch,
  DateField,
  NumberField,
  Select,
  Tooltip,
  Tiles,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketsSold: number;
  status: 'On Sale' | 'Draft' | 'Sold Out';
  venue: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Summer Music Festival',
    date: '2024-07-15',
    location: 'Central Park',
    ticketsSold: 450,
    venue: 'Central Park',
    status: 'On Sale',
  },
  {
    id: '2',
    name: 'Tech Conference 2024',
    date: '2024-08-20',
    location: 'Convention Center',
    ticketsSold: 320,
    venue: 'Convention Center',
    status: 'On Sale',
  },
  {
    id: '3',
    name: 'Jazz Night',
    date: '2024-06-30',
    location: 'Blue Note Theater',
    ticketsSold: 0,
    venue: 'Blue Note Theater',
    status: 'Sold Out',
  },
  {
    id: '4',
    name: 'Art Exhibition Opening',
    date: '2024-07-05',
    location: 'Modern Art Museum',
    ticketsSold: 150,
    venue: 'Modern Art Museum',
    status: 'Draft',
  },
  {
    id: '5',
    name: 'Comedy Show Special',
    date: '2024-07-22',
    location: 'Comedy Club',
    ticketsSold: 280,
    venue: 'Comedy Club',
    status: 'On Sale',
  },
  {
    id: '6',
    name: 'Marathon 2024',
    date: '2024-09-10',
    location: 'City Streets',
    ticketsSold: 1200,
    venue: 'City Streets',
    status: 'On Sale',
  },
];

const mockAttendees: Attendee[] = [
  {
    id: 'a1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    eventsAttended: 5,
    lastActive: '2024-06-25',
    status: 'Active',
  },
  {
    id: 'a2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    eventsAttended: 3,
    lastActive: '2024-06-20',
    status: 'Active',
  },
  {
    id: 'a3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    eventsAttended: 8,
    lastActive: '2024-06-28',
    status: 'Active',
  },
  {
    id: 'a4',
    name: 'David Brown',
    email: 'david@example.com',
    eventsAttended: 1,
    lastActive: '2024-05-10',
    status: 'Inactive',
  },
  {
    id: 'a5',
    name: 'Emma Davis',
    email: 'emma@example.com',
    eventsAttended: 12,
    lastActive: '2024-06-27',
    status: 'Active',
  },
  {
    id: 'a6',
    name: 'Frank Miller',
    email: 'frank@example.com',
    eventsAttended: 2,
    lastActive: '2024-06-15',
    status: 'Active',
  },
];

const Dashboard = () => (
  <Stack space={4}>
    <Headline level={2}>Dashboard Overview</Headline>
    <SectionMessage variant="info">
      <SectionMessage.Title>Welcome back!</SectionMessage.Title>
      <SectionMessage.Content>
        You have 3 events starting this week.
      </SectionMessage.Content>
    </SectionMessage>

    <Stack space={2}>
      <Headline level={3}>Summary</Headline>
      <Tiles space={4}>
        <Card>
          <Stack space={2}>
            <Text size="sm" color="muted">
              Total Events
            </Text>
            <Text size="lg" weight="bold">
              24
            </Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="sm" color="muted">
              Tickets Sold
            </Text>
            <Text size="lg" weight="bold">
              1,849
            </Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={1}>
            <Text size="sm" color="muted">
              Revenue
            </Text>
            <Inline space={2} alignY="center">
              <Text size="lg" weight="bold">
                $45,230
              </Text>
              <Tooltip.Trigger>
                <Button size="icon" variant="ghost">
                  ?
                </Button>
                <Tooltip>Net revenue after fees and refunds</Tooltip>
              </Tooltip.Trigger>
            </Inline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="sm" color="muted">
              Upcoming
            </Text>
            <Text size="lg" weight="bold">
              8
            </Text>
          </Stack>
        </Card>
      </Tiles>
    </Stack>

    <Stack space={2}>
      <Headline level={3}>Upcoming Events</Headline>
      <Table aria-label="Upcoming events">
        <Table.Header>
          <Table.Column rowHeader>Event</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Venue</Table.Column>
          <Table.Column>Tickets Sold</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={mockEvents}>
          {event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.venue}</Table.Cell>
              <Table.Cell>{event.ticketsSold}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={
                    event.status === 'On Sale'
                      ? 'success'
                      : event.status === 'Sold Out'
                        ? 'warning'
                        : 'info'
                  }
                >
                  {event.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  </Stack>
);

const Events = () => {
  const [searchText, setSearchText] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: null as any,
    location: '',
    capacity: '',
    description: '',
  });

  const filtered = mockEvents.filter(
    event =>
      event.name.toLowerCase().includes(searchText.toLowerCase()) ||
      event.location.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCreateEvent = () => {
    setFormData({ name: '', date: null, location: '', capacity: '', description: '' });
    setCreateDialogOpen(false);
  };

  return (
    <Stack space={4}>
      <Headline level={2}>Events</Headline>

      <Inline space={2} alignY="center">
        <SearchField
          placeholder="Search by name or location..."
          value={searchText}
          onChange={setSearchText}
          width={48}
        />
        <Dialog.Trigger dismissable={false}>
          <Button variant="primary">Create Event</Button>
          <Dialog size="small">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Event Name"
                  required
                  value={formData.name}
                  onChange={name => setFormData(prev => ({ ...prev, name }))}
                />
                <DateField
                  label="Date"
                  value={formData.date}
                  onChange={date => setFormData(prev => ({ ...prev, date }))}
                />
                <TextField
                  label="Location"
                  value={formData.location}
                  onChange={location => setFormData(prev => ({ ...prev, location }))}
                />
                <NumberField
                  label="Capacity"
                  value={formData.capacity ? parseInt(formData.capacity) : undefined}
                  onChange={capacity => setFormData(prev => ({ ...prev, capacity: capacity?.toString() || '' }))}
                />
                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={description => setFormData(prev => ({ ...prev, description }))}
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
                onPress={() => handleCreateEvent()}
              >
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events list">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filtered}>
          {event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell>500</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={
                    event.status === 'On Sale'
                      ? 'success'
                      : event.status === 'Sold Out'
                        ? 'error'
                        : 'info'
                  }
                >
                  {event.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const Attendees = () => {
  const [searchText, setSearchText] = useState('');

  const filtered = mockAttendees.filter(
    attendee =>
      attendee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Stack space={4}>
      <Headline level={2}>Attendees</Headline>

      <Inline space={2} alignY="center">
        <SearchField
          placeholder="Search by name or email..."
          value={searchText}
          onChange={setSearchText}
          width={48}
        />
        <Text size="sm" color="muted">
          {filtered.length} attendees
        </Text>
      </Inline>

      <Table aria-label="Attendees list">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filtered}>
          {attendee => (
            <Table.Row key={attendee.id}>
              <Table.Cell>{attendee.name}</Table.Cell>
              <Table.Cell>{attendee.email}</Table.Cell>
              <Table.Cell>{attendee.eventsAttended}</Table.Cell>
              <Table.Cell>{attendee.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={attendee.status === 'Active' ? 'success' : 'warning'}>
                  {attendee.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const Reports = () => {
  return (
    <Stack space={4}>
      <Headline level={2}>Reports</Headline>

      <Tabs aria-label="Report tabs">
        <Tabs.List aria-label="Reports">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Tiles space={4}>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    Total Revenue
                  </Text>
                  <Text size="lg" weight="bold">
                    $45,230
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    This Month
                  </Text>
                  <Text size="lg" weight="bold">
                    $8,420
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    Average per Event
                  </Text>
                  <Text size="lg" weight="bold">
                    $1,885
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    Refunds
                  </Text>
                  <Text size="lg" weight="bold">
                    $1,230
                  </Text>
                </Stack>
              </Card>
            </Tiles>

            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue is up 12%</SectionMessage.Title>
              <SectionMessage.Content>
                Revenue is up 12% compared to last month.
              </SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Tiles space={4}>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    Total Attendees
                  </Text>
                  <Text size="lg" weight="bold">
                    3,200
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    Repeat Visitors
                  </Text>
                  <Text size="lg" weight="bold">
                    890
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    Average per Event
                  </Text>
                  <Text size="lg" weight="bold">
                    178
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm" color="muted">
                    No-shows
                  </Text>
                  <Text size="lg" weight="bold">
                    145
                  </Text>
                </Stack>
              </Card>
            </Tiles>

            <Stack space={2}>
              <Headline level={3}>Top Events by Attendance</Headline>
              <Table aria-label="Top events by attendance">
                <Table.Header>
                  <Table.Column rowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body items={[
                  { id: '1', name: 'Marathon 2024', date: '2024-09-10', attendees: 890, capacity: 1000, fillRate: '89%' },
                  { id: '2', name: 'Summer Music Festival', date: '2024-07-15', attendees: 750, capacity: 1000, fillRate: '75%' },
                  { id: '3', name: 'Tech Conference 2024', date: '2024-08-20', attendees: 680, capacity: 800, fillRate: '85%' },
                  { id: '4', name: 'Comedy Show Special', date: '2024-07-22', attendees: 280, capacity: 300, fillRate: '93%' },
                ]}>
                  {row => (
                    <Table.Row key={row.id}>
                      <Table.Cell>{row.name}</Table.Cell>
                      <Table.Cell>{row.date}</Table.Cell>
                      <Table.Cell>{row.attendees}</Table.Cell>
                      <Table.Cell>{row.capacity}</Table.Cell>
                      <Table.Cell>{row.fillRate}</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="overview">
          <Stack space={4}>
            <Text>
              This quarterly report summarizes the performance of all events held throughout the period. We have seen
              significant growth in attendance and revenue, with strong customer satisfaction ratings. The data shows
              positive trends across all key metrics.
            </Text>

            <Accordion allowsMultipleExpanded>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  Q1 was a strong quarter with 8 events held. Total attendance was 1,200 with revenue of $15,000. Key
                  highlights include the successful launch of our new ticket platform and increased social media
                  engagement.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 exceeded expectations with 12 events and 1,500 attendees. Revenue reached $18,500. We expanded
                  our marketing efforts which resulted in higher ticket sales and improved customer retention.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  Q3 continues the upward trend with 10 events planned and strong pre-sales. Expected attendance is
                  1,500 with projected revenue of $11,730. We are focusing on premium events and partnerships to
                  increase average ticket value.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    digest: true,
    marketing: false,
  });

  return (
    <Stack space={4}>
      <Headline level={2}>Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <Stack space={3}>
              <TextField label="Organization Name" defaultValue="EventHub Inc." />
              <TextField label="Contact Email" type="email" defaultValue="contact@eventhub.com" />
              <Select label="Default Currency">
                <Select.Option id="usd">USD</Select.Option>
                <Select.Option id="eur">EUR</Select.Option>
                <Select.Option id="gbp">GBP</Select.Option>
              </Select>
              <Select label="Default Timezone">
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>
            </Stack>
            <Button variant="primary">
              Save Changes
            </Button>
            <SectionMessage variant="success" closeButton>
              <SectionMessage.Title>Settings saved successfully.</SectionMessage.Title>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={3}>
              <Stack space={1}>
                <Inline space={2} alignY="center">
                  <Switch
                    selected={notificationSettings.email}
                    onChange={email => setNotificationSettings(prev => ({ ...prev, email }))}
                  />
                  <Text weight="bold">Email Notifications</Text>
                </Inline>
                <Text size="sm" color="muted">
                  Receive email updates about your events
                </Text>
              </Stack>
              <Divider />

              <Stack space={1}>
                <Inline space={2} alignY="center">
                  <Switch
                    selected={notificationSettings.sms}
                    onChange={sms => setNotificationSettings(prev => ({ ...prev, sms }))}
                  />
                  <Text weight="bold">SMS Notifications</Text>
                </Inline>
                <Text size="sm" color="muted">
                  Get text messages for important updates
                </Text>
              </Stack>
              <Divider />

              <Stack space={1}>
                <Inline space={2} alignY="center">
                  <Switch
                    selected={notificationSettings.digest}
                    onChange={digest => setNotificationSettings(prev => ({ ...prev, digest }))}
                  />
                  <Text weight="bold">Weekly Digest</Text>
                </Inline>
                <Text size="sm" color="muted">
                  Receive a weekly summary of your events
                </Text>
              </Stack>
              <Divider />

              <Stack space={1}>
                <Inline space={2} alignY="center">
                  <Switch
                    selected={notificationSettings.marketing}
                    onChange={marketing => setNotificationSettings(prev => ({ ...prev, marketing }))}
                  />
                  <Text weight="bold">Marketing Emails</Text>
                </Inline>
                <Text size="sm" color="muted">
                  Receive promotional offers and updates
                </Text>
              </Stack>
            </Stack>
            <Button variant="primary">
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const pages: Record<Page, string> = {
    dashboard: 'Dashboard',
    events: 'Events',
    attendees: 'Attendees',
    reports: 'Reports',
    settings: 'Settings',
  };

  return (
    <Sidebar.Provider defaultOpen={sidebarOpen}>
      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Text weight="bold">EventHub</Text>
          </Sidebar.Header>
          <Sidebar.Nav current={`/${currentPage}`}>
            <Sidebar.Item href="/dashboard" onPress={() => setCurrentPage('dashboard')}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="/events" onPress={() => setCurrentPage('events')}>
              Events
            </Sidebar.Item>
            <Sidebar.Item href="/attendees" onPress={() => setCurrentPage('attendees')}>
              Attendees
            </Sidebar.Item>
            <Sidebar.Item href="/reports" onPress={() => setCurrentPage('reports')}>
              Reports
            </Sidebar.Item>
            <Sidebar.Separator />
            <Sidebar.Item href="/settings" onPress={() => setCurrentPage('settings')}>
              Settings
            </Sidebar.Item>
            <Sidebar.Footer>
              <Sidebar.Item href="#help">Help & Support</Sidebar.Item>
            </Sidebar.Footer>
          </Sidebar.Nav>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation.Start>
            <Sidebar.Toggle />
          </TopNavigation.Start>

          <TopNavigation.Middle>
            <Breadcrumbs>
              <Breadcrumbs.Item href="#home">EventHub</Breadcrumbs.Item>
              <Breadcrumbs.Item href={`#${currentPage}`}>{pages[currentPage]}</Breadcrumbs.Item>
            </Breadcrumbs>
          </TopNavigation.Middle>

          <TopNavigation.End>
            <Menu onAction={action => {
              if (action === 'signout') {
                setSignOutDialogOpen(true);
              }
            }} label="Account">
              <Menu.Item id="profile">Profile</Menu.Item>
              <Menu.Item id="signout" variant="destructive">
                Sign out
              </Menu.Item>
            </Menu>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space={4}>
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'events' && <Events />}
            {currentPage === 'attendees' && <Attendees />}
            {currentPage === 'reports' && <Reports />}
            {currentPage === 'settings' && <Settings />}
          </Inset>
        </AppLayout.Main>
      </AppLayout>

      <Dialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <Dialog.Title>Sign out</Dialog.Title>
        <Dialog.Content>
          Are you sure you want to sign out?
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onPress={() => setSignOutDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onPress={() => setSignOutDialogOpen(false)}>
            Sign out
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Sidebar.Provider>
  );
};

export default TestApp;
