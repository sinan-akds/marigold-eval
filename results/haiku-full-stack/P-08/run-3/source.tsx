'use client';

import { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Menu,
  Dialog,
  Button,
  Card,
  Stack,
  Inline,
  Inset,
  Table,
  SearchField,
  TextField,
  NumberField,
  Badge,
  SectionMessage,
  Headline,
  Text,
  Tabs,
  Accordion,
  Switch,
  Container,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const getBreadcrumb = () => {
    const labels: Record<Page, string> = {
      dashboard: 'Dashboard',
      events: 'Events',
      attendees: 'Attendees',
      reports: 'Reports',
      settings: 'Settings',
    };
    return labels[currentPage];
  };

  const pageMap: Record<Page, string> = {
    dashboard: '/dashboard',
    events: '/events',
    attendees: '/attendees',
    reports: '/reports',
    settings: '/settings',
  };

  return (
    <Sidebar.Provider defaultOpen>
      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Text weight="bold" size="sm">
              EventHub
            </Text>
          </Sidebar.Header>
          <Sidebar.Nav current={pageMap[currentPage]}>
            <Sidebar.Item
              href="/dashboard"
              onPress={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="/events"
              onPress={() => setCurrentPage('events')}
            >
              Events
            </Sidebar.Item>
            <Sidebar.Item
              href="/attendees"
              onPress={() => setCurrentPage('attendees')}
            >
              Attendees
            </Sidebar.Item>
            <Sidebar.Item
              href="/reports"
              onPress={() => setCurrentPage('reports')}
            >
              Reports
            </Sidebar.Item>
            <Sidebar.Separator />
            <Sidebar.Item
              href="/settings"
              onPress={() => setCurrentPage('settings')}
            >
              Settings
            </Sidebar.Item>
          </Sidebar.Nav>
          <Sidebar.Footer>
            <Sidebar.Item href="#help" onPress={() => {}}>
              Help & Support
            </Sidebar.Item>
          </Sidebar.Footer>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation.Start>
            <Sidebar.Toggle />
          </TopNavigation.Start>
          <TopNavigation.Middle>
            <nav>
              <Breadcrumbs>
                <Breadcrumbs.Item href="#">
                  EventHub
                </Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">{getBreadcrumb()}</Breadcrumbs.Item>
              </Breadcrumbs>
            </nav>
          </TopNavigation.Middle>
          <TopNavigation.End>
            <Menu label="Account" onAction={(action) => {
              if (action === 'signout') {
                setSignOutOpen(true);
              }
            }}>
              <Menu.Item id="profile">Profile</Menu.Item>
              <Menu.Item id="signout">Sign out</Menu.Item>
            </Menu>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Container>
            <Inset space="square-regular">
              {currentPage === 'dashboard' && <DashboardPage />}
              {currentPage === 'events' && <EventsPage />}
              {currentPage === 'attendees' && <AttendeesPage />}
              {currentPage === 'reports' && <ReportsPage />}
              {currentPage === 'settings' && <SettingsPage />}
            </Inset>
          </Container>
        </AppLayout.Main>
      </AppLayout>

      <Dialog
        size="small"
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
      >
        {({ close }) => (
          <>
            <Dialog.Title>Sign out</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to sign out?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" onPress={close}>
                Sign out
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Sidebar.Provider>
  );
};

const DashboardPage = () => {
  return (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>
      <SectionMessage variant="info">
        <SectionMessage.Content>
          Welcome back! You have 3 events starting this week.
        </SectionMessage.Content>
      </SectionMessage>

      <Inline space={4} alignY="top">
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">Total Events</Text>
              <Text weight="bold" size="lg">24</Text>
            </Stack>
          </Inset>
        </Card>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">Tickets Sold</Text>
              <Text weight="bold" size="lg">1,849</Text>
            </Stack>
          </Inset>
        </Card>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">Revenue</Text>
              <Text weight="bold" size="lg">$45,230</Text>
            </Stack>
          </Inset>
        </Card>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">Upcoming</Text>
              <Text weight="bold" size="lg">8</Text>
            </Stack>
          </Inset>
        </Card>
      </Inline>

      <Stack space={4}>
        <Headline level={2}>Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column rowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body items={upcomingEventsData}>
            {(item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.event}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.venue}</Table.Cell>
                <Table.Cell>{item.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge variant={item.statusVariant}>{item.status}</Badge>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );
};

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
  });

  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCreateEvent = () => {
    setFormData({
      name: '',
      location: '',
      capacity: '',
    });
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          label="Search Events"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={setSearchTerm}
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
                  value={formData.name}
                  onChange={(val) =>
                    setFormData({ ...formData, name: val })
                  }
                />
                <TextField
                  label="Location"
                  value={formData.location}
                  onChange={(val) =>
                    setFormData({ ...formData, location: val })
                  }
                />
                <NumberField
                  label="Capacity"
                  value={formData.capacity ? Number(formData.capacity) : undefined}
                  onChange={(val) =>
                    setFormData({ ...formData, capacity: val?.toString() || '' })
                  }
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" onPress={handleCreateEvent}>
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events Table">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredEvents}>
          {(item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.date}</Table.Cell>
              <Table.Cell>{item.location}</Table.Cell>
              <Table.Cell>{item.capacity}</Table.Cell>
              <Table.Cell>
                <Badge variant={item.statusVariant}>{item.status}</Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const AttendeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendees = useMemo(() => {
    return attendeesData.filter((attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <Stack space={4}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          label="Search Attendees"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Text size="sm" variant="muted">
          {filteredAttendees.length} attendees
        </Text>
      </Inline>

      <Table aria-label="Attendees Table">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredAttendees}>
          {(item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.eventsAttended}</Table.Cell>
              <Table.Cell>{item.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={item.statusVariant}>{item.status}</Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const ReportsPage = () => {
  const [selectedTab, setSelectedTab] = useState('revenue');

  return (
    <Stack space={4}>
      <Headline level={1}>Reports</Headline>
      <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(String(key))}>
        <Tabs.List aria-label="Reports">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Inline space={4} alignY="top">
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">Total Revenue</Text>
                    <Text weight="bold" size="lg">$45,230</Text>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">This Month</Text>
                    <Text weight="bold" size="lg">$8,420</Text>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">Avg per Event</Text>
                    <Text weight="bold" size="lg">$1,885</Text>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">Refunds</Text>
                    <Text weight="bold" size="lg">$1,230</Text>
                  </Stack>
                </Inset>
              </Card>
            </Inline>
            <SectionMessage variant="success">
              <SectionMessage.Content>
                Revenue is up 12% compared to last month.
              </SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Inline space={4} alignY="top">
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">Total Attendees</Text>
                    <Text weight="bold" size="lg">3,200</Text>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">Repeat Visitors</Text>
                    <Text weight="bold" size="lg">890</Text>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">Avg per Event</Text>
                    <Text weight="bold" size="lg">178</Text>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">No-shows</Text>
                    <Text weight="bold" size="lg">145</Text>
                  </Stack>
                </Inset>
              </Card>
            </Inline>

            <Stack space={4}>
              <Headline level={2}>Top Events by Attendance</Headline>
              <Table aria-label="Top Events by Attendance">
                <Table.Header>
                  <Table.Column rowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body items={topEventsByAttendance}>
                  {(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.event}</Table.Cell>
                      <Table.Cell>{item.date}</Table.Cell>
                      <Table.Cell>{item.attendees}</Table.Cell>
                      <Table.Cell>{item.capacity}</Table.Cell>
                      <Table.Cell>{item.fillRate}%</Table.Cell>
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
              This report provides a comprehensive overview of all event activities, attendance patterns, and revenue metrics across your entire event portfolio. Use this data to identify trends, optimize future events, and make informed business decisions.
            </Text>
            <Accordion>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  In the first quarter, we hosted 8 events with an average attendance of 180 people per event. Total revenue reached $15,040 with a 98% ticket fulfillment rate. The most popular event was the Spring Networking Conference with 320 attendees.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 showed strong growth with 12 events generating $18,920 in revenue. We introduced online streaming for 4 events, expanding our reach to international audiences. Average attendance increased to 210 people per event.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  The third quarter was our most successful with 16 events and $45,230 total revenue. We implemented advanced ticketing features and saw a 25% increase in repeat attendees. The highlight was our flagship Summer Festival with 450 attendees.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

const SettingsPage = () => {
  const [selectedTab, setSelectedTab] = useState('general');
  const [generalData, setGeneralData] = useState({
    orgName: 'Acme Events Inc.',
    email: 'contact@acmeevents.com',
    currency: 'USD',
    timezone: 'UTC',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    digest: true,
    marketing: false,
  });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSaveGeneral = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Settings</Headline>
      <Tabs selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(String(key))}>
        <Tabs.List aria-label="Settings">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            {showSaveSuccess && (
              <SectionMessage variant="success">
                <SectionMessage.Content>
                  Settings saved successfully.
                </SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={3}>
              <TextField
                label="Organization Name"
                value={generalData.orgName}
                onChange={(val) =>
                  setGeneralData({ ...generalData, orgName: val })
                }
              />
              <TextField
                label="Contact Email"
                type="email"
                value={generalData.email}
                onChange={(val) =>
                  setGeneralData({ ...generalData, email: val })
                }
              />
              <TextField
                label="Default Currency"
                value={generalData.currency}
                onChange={(val) =>
                  setGeneralData({ ...generalData, currency: val })
                }
              />
              <TextField
                label="Default Timezone"
                value={generalData.timezone}
                onChange={(val) =>
                  setGeneralData({ ...generalData, timezone: val })
                }
              />
            </Stack>
            <Button variant="primary" onPress={handleSaveGeneral}>
              Save Changes
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={3}>
              <Inline space={3} alignY="center">
                <Switch
                  selected={notificationSettings.email}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      email: !notificationSettings.email,
                    })
                  }
                />
                <Stack space={0.5}>
                  <Text weight="bold">Email Notifications</Text>
                  <Text size="sm" variant="muted">
                    Receive email updates about your events
                  </Text>
                </Stack>
              </Inline>
              <Inline space={3} alignY="center">
                <Switch
                  selected={notificationSettings.sms}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      sms: !notificationSettings.sms,
                    })
                  }
                />
                <Stack space={0.5}>
                  <Text weight="bold">SMS Notifications</Text>
                  <Text size="sm" variant="muted">
                    Get text messages for important updates
                  </Text>
                </Stack>
              </Inline>
              <Inline space={3} alignY="center">
                <Switch
                  selected={notificationSettings.digest}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      digest: !notificationSettings.digest,
                    })
                  }
                />
                <Stack space={0.5}>
                  <Text weight="bold">Weekly Digest</Text>
                  <Text size="sm" variant="muted">
                    Get a weekly summary of your events
                  </Text>
                </Stack>
              </Inline>
              <Inline space={3} alignY="center">
                <Switch
                  selected={notificationSettings.marketing}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      marketing: !notificationSettings.marketing,
                    })
                  }
                />
                <Stack space={0.5}>
                  <Text weight="bold">Marketing Emails</Text>
                  <Text size="sm" variant="muted">
                    Receive special offers and promotional content
                  </Text>
                </Stack>
              </Inline>
            </Stack>
            <Button variant="primary" onPress={() => {
              setShowSaveSuccess(true);
              setTimeout(() => setShowSaveSuccess(false), 3000);
            }}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

// Data fixtures
const upcomingEventsData = [
  { id: 1, event: 'Tech Summit 2024', date: '2024-07-15', venue: 'Convention Center', ticketsSold: 450, status: 'On Sale', statusVariant: 'info' as const },
  { id: 2, event: 'Jazz Night', date: '2024-07-20', venue: 'Concert Hall', ticketsSold: 280, status: 'On Sale', statusVariant: 'info' as const },
  { id: 3, event: 'Startup Pitch Competition', date: '2024-07-22', venue: 'Innovation Hub', ticketsSold: 120, status: 'Draft', statusVariant: 'warning' as const },
  { id: 4, event: 'Annual Gala', date: '2024-08-01', venue: 'Grand Hotel', ticketsSold: 500, status: 'Sold Out', statusVariant: 'success' as const },
  { id: 5, event: 'Workshop Series', date: '2024-08-05', venue: 'Community Center', ticketsSold: 200, status: 'On Sale', statusVariant: 'info' as const },
  { id: 6, event: 'Film Festival Opening', date: '2024-08-10', venue: 'Art Theater', ticketsSold: 350, status: 'On Sale', statusVariant: 'info' as const },
];

const eventsData = [
  { id: 1, name: 'Tech Summit 2024', date: '2024-07-15', location: 'Convention Center', capacity: 500, status: 'On Sale', statusVariant: 'info' as const },
  { id: 2, name: 'Jazz Night', date: '2024-07-20', location: 'Concert Hall', capacity: 300, status: 'On Sale', statusVariant: 'info' as const },
  { id: 3, name: 'Startup Pitch Competition', date: '2024-07-22', location: 'Innovation Hub', capacity: 150, status: 'Draft', statusVariant: 'warning' as const },
  { id: 4, name: 'Annual Gala', date: '2024-08-01', location: 'Grand Hotel', capacity: 500, status: 'Sold Out', statusVariant: 'success' as const },
  { id: 5, name: 'Workshop Series', date: '2024-08-05', location: 'Community Center', capacity: 200, status: 'On Sale', statusVariant: 'info' as const },
  { id: 6, name: 'Film Festival Opening', date: '2024-08-10', location: 'Art Theater', capacity: 400, status: 'On Sale', statusVariant: 'info' as const },
];

const attendeesData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2024-07-10', status: 'Active', statusVariant: 'success' as const },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 2, lastActive: '2024-06-15', status: 'Inactive', statusVariant: 'warning' as const },
  { id: 3, name: 'Carol White', email: 'carol@example.com', eventsAttended: 8, lastActive: '2024-07-12', status: 'Active', statusVariant: 'success' as const },
  { id: 4, name: 'David Brown', email: 'david@example.com', eventsAttended: 3, lastActive: '2024-07-08', status: 'Active', statusVariant: 'success' as const },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', eventsAttended: 1, lastActive: '2024-05-20', status: 'Inactive', statusVariant: 'warning' as const },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', eventsAttended: 6, lastActive: '2024-07-11', status: 'Active', statusVariant: 'success' as const },
];

const topEventsByAttendance = [
  { id: 1, event: 'Summer Festival', date: '2024-07-15', attendees: 450, capacity: 500, fillRate: 90 },
  { id: 2, event: 'Tech Summit 2024', date: '2024-07-18', attendees: 380, capacity: 400, fillRate: 95 },
  { id: 3, event: 'Jazz Night', date: '2024-07-20', attendees: 280, capacity: 300, fillRate: 93 },
  { id: 4, event: 'Annual Gala', date: '2024-08-01', attendees: 420, capacity: 500, fillRate: 84 },
];

export default TestApp;
