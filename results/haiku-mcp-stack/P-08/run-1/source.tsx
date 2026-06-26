'use client';

import { useState } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Button,
  Menu,
  Dialog,
  TextField,
  TextArea,
  DatePicker,
  SearchField,
  Table,
  Stack,
  Inline,
  Card,
  Headline,
  Text,
  Badge,
  SectionMessage,
  Tabs,
  Accordion,
  Switch,
  Inset,
} from '@marigold/components';

type PageType = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';
type ReportsTab = 'revenue' | 'attendance' | 'overview';
type SettingsTab = 'general' | 'notifications';

const EventHub = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [reportsTab, setReportsTab] = useState<ReportsTab>('revenue');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('general');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    location: '',
    capacity: '',
    description: '',
  });

  const eventsData = [
    { id: 1, name: 'Summer Music Festival', date: '2025-07-15', location: 'Central Park', capacity: 500, status: 'On Sale' },
    { id: 2, name: 'Tech Conference 2025', date: '2025-08-20', location: 'Convention Center', capacity: 2000, status: 'On Sale' },
    { id: 3, name: 'Jazz Night', date: '2025-06-30', location: 'Blue Note Venue', capacity: 200, status: 'Sold Out' },
    { id: 4, name: 'Art Exhibition', date: '2025-07-01', location: 'Modern Art Museum', capacity: 300, status: 'Draft' },
    { id: 5, name: 'Comedy Show', date: '2025-07-10', location: 'Laugh Factory', capacity: 150, status: 'On Sale' },
    { id: 6, name: 'Film Festival', date: '2025-08-10', location: 'Cinema Plaza', capacity: 400, status: 'On Sale' },
  ];

  const upcomingEventsData = [
    { id: 1, name: 'Summer Music Festival', date: '2025-07-15', venue: 'Central Park', ticketsSold: 425, status: 'On Sale' },
    { id: 2, name: 'Tech Conference', date: '2025-08-20', venue: 'Convention Center', ticketsSold: 1800, status: 'On Sale' },
    { id: 3, name: 'Jazz Night', date: '2025-06-30', venue: 'Blue Note', ticketsSold: 200, status: 'Sold Out' },
    { id: 4, name: 'Comedy Show', date: '2025-07-10', venue: 'Laugh Factory', ticketsSold: 120, status: 'On Sale' },
    { id: 5, name: 'Art Exhibition', date: '2025-07-01', venue: 'Art Museum', ticketsSold: 85, status: 'Draft' },
    { id: 6, name: 'Film Festival', date: '2025-08-10', venue: 'Cinema Plaza', ticketsSold: 320, status: 'On Sale' },
  ];

  const attendeesData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2025-06-20', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 2, lastActive: '2025-05-15', status: 'Inactive' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', eventsAttended: 8, lastActive: '2025-06-19', status: 'Active' },
    { id: 4, name: 'David Brown', email: 'david@example.com', eventsAttended: 3, lastActive: '2025-06-21', status: 'Active' },
    { id: 5, name: 'Eva Green', email: 'eva@example.com', eventsAttended: 1, lastActive: '2025-04-10', status: 'Inactive' },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', eventsAttended: 6, lastActive: '2025-06-22', status: 'Active' },
  ];

  const filteredEvents = eventsData.filter(
    e => e.name.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
         e.location.toLowerCase().includes(eventSearchQuery.toLowerCase())
  );

  const filteredAttendees = attendeesData.filter(
    a => a.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
         a.email.toLowerCase().includes(attendeeSearchQuery.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'On Sale':
        return 'success';
      case 'Draft':
        return 'warning';
      case 'Sold Out':
        return 'error';
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleCreateEvent = () => {
    setNewEvent({
      name: '',
      location: '',
      capacity: '',
      description: '',
    });
  };

  const handleSignOut = async () => {
    setSignOutDialogOpen(false);
  };

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>

      <SectionMessage variant="info">
        Welcome back! You have 3 events starting this week.
      </SectionMessage>

      <Inline space={4}>
        <Card>
          <Stack space={2}>
            <Text size="small" variant="muted">
              Total Events
            </Text>
            <Text size="xl" weight="bold">
              24
            </Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="small" variant="muted">
              Tickets Sold
            </Text>
            <Text size="xl" weight="bold">
              1,849
            </Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              <Stack space={0}>
                <Text size="small" variant="muted">
                  Revenue
                </Text>
                <Text size="xl" weight="bold">
                  $45,230
                </Text>
              </Stack>
              <div title="Net revenue after fees and refunds">
                <Button variant="icon" size="icon" aria-label="Revenue info">
                  ⓘ
                </Button>
              </div>
            </Inline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="small" variant="muted">
              Upcoming
            </Text>
            <Text size="xl" weight="bold">
              8
            </Text>
          </Stack>
        </Card>
      </Inline>

      <Stack space={3}>
        <Headline level={2}>Upcoming Events</Headline>
        <Table aria-label="Upcoming events table">
          <Table.Header>
            <Table.Column rowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body items={upcomingEventsData}>
            {item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.venue}</Table.Cell>
                <Table.Cell>{item.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusVariant(item.status) as any}>{item.status}</Badge>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  const renderEvents = () => (
    <Stack space={4}>
      <Headline level={1}>Events</Headline>

      <Inline space={2} alignY="bottom">
        <SearchField
          placeholder="Search by name or location..."
          value={eventSearchQuery}
          onChange={setEventSearchQuery}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="small">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Event Name"
                  required
                  value={newEvent.name}
                  onChange={v => setNewEvent({ ...newEvent, name: v })}
                />
                <DatePicker
                  label="Date"
                />
                <TextField
                  label="Location"
                  value={newEvent.location}
                  onChange={v => setNewEvent({ ...newEvent, location: v })}
                />
                <TextField
                  label="Capacity"
                  type="number"
                  value={newEvent.capacity}
                  onChange={v => setNewEvent({ ...newEvent, capacity: v })}
                />
                <TextArea
                  label="Description"
                  rows={4}
                  value={newEvent.description}
                  onChange={v => setNewEvent({ ...newEvent, description: v })}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" onPress={handleCreateEvent} slot="close">
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events table">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredEvents}>
          {item => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.date}</Table.Cell>
              <Table.Cell>{item.location}</Table.Cell>
              <Table.Cell>{item.capacity}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(item.status) as any}>{item.status}</Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderAttendees = () => (
    <Stack space={4}>
      <Headline level={1}>Attendees</Headline>

      <Inline space={2} alignY="bottom">
        <SearchField
          placeholder="Search by name or email..."
          value={attendeeSearchQuery}
          onChange={setAttendeeSearchQuery}
        />
        <Text variant="muted">{filteredAttendees.length} attendees</Text>
      </Inline>

      <Table aria-label="Attendees table">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredAttendees}>
          {item => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.eventsAttended}</Table.Cell>
              <Table.Cell>{item.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(item.status) as any}>{item.status}</Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderReports = () => (
    <Stack space={4}>
      <Headline level={1}>Reports</Headline>

      <Tabs selectedKey={reportsTab} onSelectionChange={k => setReportsTab(k as ReportsTab)}>
        <Tabs.List aria-label="Report tabs">
          <Tabs.Item key="revenue" id="revenue">Revenue</Tabs.Item>
          <Tabs.Item key="attendance" id="attendance">Attendance</Tabs.Item>
          <Tabs.Item key="overview" id="overview">Overview</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Inline space={4}>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    Total Revenue
                  </Text>
                  <Text size="xl" weight="bold">
                    $45,230
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    This Month
                  </Text>
                  <Text size="xl" weight="bold">
                    $8,420
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    Average per Event
                  </Text>
                  <Text size="xl" weight="bold">
                    $1,885
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    Refunds
                  </Text>
                  <Text size="xl" weight="bold">
                    $1,230
                  </Text>
                </Stack>
              </Card>
            </Inline>
            <SectionMessage variant="success">
              Revenue is up 12% compared to last month.
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Inline space={4}>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    Total Attendees
                  </Text>
                  <Text size="xl" weight="bold">
                    3,200
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    Repeat Visitors
                  </Text>
                  <Text size="xl" weight="bold">
                    890
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    Average per Event
                  </Text>
                  <Text size="xl" weight="bold">
                    178
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="small" variant="muted">
                    No-shows
                  </Text>
                  <Text size="xl" weight="bold">
                    145
                  </Text>
                </Stack>
              </Card>
            </Inline>

            <Stack space={3}>
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
                  { event: 'Tech Conference', date: '2025-08-20', attendees: 1950, capacity: 2000, fillRate: '97.5%' },
                  { event: 'Summer Music Festival', date: '2025-07-15', attendees: 485, capacity: 500, fillRate: '97%' },
                  { event: 'Comedy Show', date: '2025-07-10', attendees: 145, capacity: 150, fillRate: '96.7%' },
                  { event: 'Film Festival', date: '2025-08-10', attendees: 375, capacity: 400, fillRate: '93.8%' },
                ]}>
                  {item => (
                    <Table.Row key={item.event}>
                      <Table.Cell>{item.event}</Table.Cell>
                      <Table.Cell>{item.date}</Table.Cell>
                      <Table.Cell>{item.attendees}</Table.Cell>
                      <Table.Cell>{item.capacity}</Table.Cell>
                      <Table.Cell>{item.fillRate}</Table.Cell>
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
              This quarter has been exceptional for event attendance and revenue. We've successfully hosted 24 events
              with an average fill rate of 94% across all venues. The combination of summer events and conference seasons
              has driven consistent growth in both ticket sales and attendee satisfaction.
            </Text>

            <Accordion>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  Q1 saw solid performance with 6 major events and an average attendance of 165 per event. The quarter was
                  focused on building momentum with early-season promotions that resulted in a 8% increase in repeat
                  visitors.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 performance exceeded expectations with 8 events generating $18,500 in revenue. The summer festival
                  season drove strong attendance and we saw a 15% increase in ticket sales compared to Q1.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  Q3 continues the positive trend with conference season bringing enterprise customers. We've already
                  booked 10 major events with strong early sales. Late summer festivals are performing exceptionally well.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={4}>
      <Headline level={1}>Settings</Headline>

      <Tabs selectedKey={settingsTab} onSelectionChange={k => setSettingsTab(k as SettingsTab)}>
        <Tabs.List aria-label="Settings tabs">
          <Tabs.Item key="general" id="general">General</Tabs.Item>
          <Tabs.Item key="notifications" id="notifications">Notifications</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField label="Organization Name" defaultValue="EventHub Inc." />
            <TextField label="Contact Email" type="email" defaultValue="support@eventhub.com" />

            <div>
              <Text weight="medium" size="small">
                Default Currency
              </Text>
              <Inline space={2}>
                <Button variant="secondary">USD</Button>
                <Button variant="secondary">EUR</Button>
                <Button variant="secondary">GBP</Button>
              </Inline>
            </div>

            <div>
              <Text weight="medium" size="small">
                Default Timezone
              </Text>
              <Inline space={2}>
                <Button variant="secondary">UTC</Button>
                <Button variant="secondary">CET</Button>
                <Button variant="secondary">EST</Button>
                <Button variant="secondary">PST</Button>
              </Inline>
            </div>

            <Button variant="primary">
              Save Changes
            </Button>

            <SectionMessage variant="success">Settings saved successfully.</SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Card>
              <Stack space={3}>
                <Inline space={3} alignY="center">
                  <Stack space={1}>
                    <Text weight="medium">Email Notifications</Text>
                    <Text size="small" variant="muted">
                      Receive email alerts for important events
                    </Text>
                  </Stack>
                  <Switch defaultSelected />
                </Inline>
              </Stack>
            </Card>

            <Card>
              <Stack space={3}>
                <Inline space={3} alignY="center">
                  <Stack space={1}>
                    <Text weight="medium">SMS Notifications</Text>
                    <Text size="small" variant="muted">
                      Get text messages for urgent updates
                    </Text>
                  </Stack>
                  <Switch />
                </Inline>
              </Stack>
            </Card>

            <Card>
              <Stack space={3}>
                <Inline space={3} alignY="center">
                  <Stack space={1}>
                    <Text weight="medium">Weekly Digest</Text>
                    <Text size="small" variant="muted">
                      Receive a weekly summary of your events
                    </Text>
                  </Stack>
                  <Switch defaultSelected />
                </Inline>
              </Stack>
            </Card>

            <Card>
              <Stack space={3}>
                <Inline space={3} alignY="center">
                  <Stack space={1}>
                    <Text weight="medium">Marketing Emails</Text>
                    <Text size="small" variant="muted">
                      Get updates about new features and offers
                    </Text>
                  </Stack>
                  <Switch />
                </Inline>
              </Stack>
            </Card>

            <Button variant="primary">
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const getBreadcrumbs = () => {
    const labels: Record<PageType, string> = {
      dashboard: 'Dashboard',
      events: 'Events',
      attendees: 'Attendees',
      reports: 'Reports',
      settings: 'Settings',
    };
    return labels[currentPage];
  };

  return (
    <Sidebar.Provider defaultOpen>
      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Headline level={2}>EventHub</Headline>
          </Sidebar.Header>
          <Sidebar.Nav current={currentPage}>
            <Sidebar.Item onPress={() => setCurrentPage('dashboard')} active={currentPage === 'dashboard'}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item onPress={() => setCurrentPage('events')} active={currentPage === 'events'}>
              Events
            </Sidebar.Item>
            <Sidebar.Item onPress={() => setCurrentPage('attendees')} active={currentPage === 'attendees'}>
              Attendees
            </Sidebar.Item>
            <Sidebar.Item onPress={() => setCurrentPage('reports')} active={currentPage === 'reports'}>
              Reports
            </Sidebar.Item>
            <Sidebar.Separator />
            <Sidebar.Item onPress={() => setCurrentPage('settings')} active={currentPage === 'settings'}>
              Settings
            </Sidebar.Item>
            <Sidebar.Separator />
          </Sidebar.Nav>
          <Sidebar.Footer>
            <Sidebar.Item onPress={() => {}}>Help & Support</Sidebar.Item>
          </Sidebar.Footer>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="#">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">{getBreadcrumbs()}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu label="Account" onAction={action => {
                if (action === 'signout') setSignOutDialogOpen(true);
              }}>
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </TopNavigation>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space={4}>
            {currentPage === 'dashboard' && renderDashboard()}
            {currentPage === 'events' && renderEvents()}
            {currentPage === 'attendees' && renderAttendees()}
            {currentPage === 'reports' && renderReports()}
            {currentPage === 'settings' && renderSettings()}
          </Inset>
        </AppLayout.Main>
      </AppLayout>

      {signOutDialogOpen && (
        <Dialog.Trigger dismissable={false}>
          <div />
          <Dialog size="small">
            <Dialog.Title>Are you sure you want to sign out?</Dialog.Title>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" slot="close" onPress={handleSignOut}>
                Sign out
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      )}
    </Sidebar.Provider>
  );
};

export default EventHub;
