import { useState } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Menu,
  Dialog,
  Button,
  Card,
  Headline,
  Text,
  TextField,
  TextArea,
  DateField,
  NumberField,
  SearchField,
  Select,
  Stack,
  Inline,
  Columns,
  Table,
  Badge,
  SectionMessage,
  Tabs,
  Accordion,
  Switch,
  Inset,
  RouterProvider,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  status: 'Draft' | 'On Sale' | 'Sold Out';
  ticketsSold: number;
}

interface AttendeeData {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
}

interface TableSearchState {
  events: string;
  attendees: string;
}

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [tableSearchState, setTableSearchState] = useState<TableSearchState>({
    events: '',
    attendees: '',
  });
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  const events: EventData[] = [
    {
      id: '1',
      name: 'Summer Festival',
      date: '2026-07-15',
      location: 'Central Park',
      capacity: 5000,
      status: 'On Sale',
      ticketsSold: 3200,
    },
    {
      id: '2',
      name: 'Tech Conference 2026',
      date: '2026-08-20',
      location: 'Convention Center',
      capacity: 2000,
      status: 'On Sale',
      ticketsSold: 1849,
    },
    {
      id: '3',
      name: 'Jazz Night',
      date: '2026-06-28',
      location: 'Downtown Theater',
      capacity: 800,
      status: 'Sold Out',
      ticketsSold: 800,
    },
    {
      id: '4',
      name: 'Art Exhibition Opening',
      date: '2026-07-10',
      location: 'Gallery District',
      capacity: 500,
      status: 'On Sale',
      ticketsSold: 245,
    },
    {
      id: '5',
      name: 'Marathon 2026',
      date: '2026-09-05',
      location: 'City Routes',
      capacity: 3000,
      status: 'Draft',
      ticketsSold: 0,
    },
    {
      id: '6',
      name: 'Food Festival',
      date: '2026-07-25',
      location: 'Riverside Park',
      capacity: 4000,
      status: 'On Sale',
      ticketsSold: 2156,
    },
  ];

  const upcomingEvents = events.slice(0, 6);

  const attendees: AttendeeData[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      eventsAttended: 8,
      lastActive: '2026-06-20',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      eventsAttended: 5,
      lastActive: '2026-06-15',
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      eventsAttended: 12,
      lastActive: '2026-06-01',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@example.com',
      eventsAttended: 3,
      lastActive: '2026-05-10',
    },
    {
      id: '5',
      name: 'David Martinez',
      email: 'david.m@example.com',
      eventsAttended: 15,
      lastActive: '2026-06-22',
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      eventsAttended: 2,
      lastActive: '2026-04-15',
    },
  ];

  const isActive = (lastActiveDate: string): boolean => {
    const lastDate = new Date(lastActiveDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastDate > thirtyDaysAgo;
  };

  const getStatusVariant = (
    status: string
  ): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    if (status === 'On Sale') return 'success';
    if (status === 'Sold Out') return 'default';
    return 'warning';
  };

  const getAttendeeStatusVariant = (
    active: boolean
  ): 'success' | 'warning' => {
    return active ? 'success' : 'warning';
  };

  const filteredEvents = events.filter(
    event =>
      event.name.toLowerCase().includes(tableSearchState.events.toLowerCase()) ||
      event.location
        .toLowerCase()
        .includes(tableSearchState.events.toLowerCase())
  );

  const filteredAttendees = attendees.filter(
    attendee =>
      attendee.name
        .toLowerCase()
        .includes(tableSearchState.attendees.toLowerCase()) ||
      attendee.email
        .toLowerCase()
        .includes(tableSearchState.attendees.toLowerCase())
  );

  const dashboardPage = (
    <Stack space={4}>
      <Headline level={2}>Dashboard Overview</Headline>

      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>
          You have 3 events starting this week.
        </SectionMessage.Content>
      </SectionMessage>

      <Columns columns={[1, 1, 1, 1]} space={3}>
        <Card>
          <Stack space={2}>
            <Text size="sm">Total Events</Text>
            <Headline level={3}>24</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="sm">Tickets Sold</Text>
            <Headline level={3}>1,849</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              <Text size="sm">Revenue</Text>
            </Inline>
            <Headline level={3}>$45,230</Headline>
            <Text size="xs">
              Net revenue after fees and refunds
            </Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="sm">Upcoming</Text>
            <Headline level={3}>8</Headline>
          </Stack>
        </Card>
      </Columns>

      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body items={upcomingEvents}>
            {upcomingEvents.map(event => (
              <Table.Row key={event.id}>
                <Table.Cell>{event.name}</Table.Cell>
                <Table.Cell>{event.date}</Table.Cell>
                <Table.Cell>{event.location}</Table.Cell>
                <Table.Cell>{event.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusVariant(event.status)}>
                    {event.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  const eventsPage = (
    <Stack space={4}>
      <Headline level={2}>Events</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          label="Search events"
          value={tableSearchState.events}
          onChange={e => setTableSearchState({ ...tableSearchState, events: e })}
          placeholder="Search by name or location..."
        />
        <Dialog.Trigger
          open={showCreateEventDialog}
          onOpenChange={setShowCreateEventDialog}
        >
          <Button variant="primary">Create Event</Button>
          <Dialog size="small">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField label="Event Name" required />
                <DateField label="Date" />
                <TextField label="Location" />
                <NumberField label="Capacity" />
                <TextArea label="Description" />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" slot="close">
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>
      <Table aria-label="Events Table">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredEvents}>
          {filteredEvents.map(event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell>{event.capacity}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(event.status)}>
                  {event.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const attendeesPage = (
    <Stack space={4}>
      <Headline level={2}>Attendees</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          label="Search attendees"
          value={tableSearchState.attendees}
          onChange={e =>
            setTableSearchState({ ...tableSearchState, attendees: e })
          }
          placeholder="Search by name or email..."
        />
        <Text>{filteredAttendees.length} attendees</Text>
      </Inline>
      <Table aria-label="Attendees Table">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredAttendees}>
          {filteredAttendees.map(attendee => (
            <Table.Row key={attendee.id}>
              <Table.Cell>{attendee.name}</Table.Cell>
              <Table.Cell>{attendee.email}</Table.Cell>
              <Table.Cell>{attendee.eventsAttended}</Table.Cell>
              <Table.Cell>{attendee.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={getAttendeeStatusVariant(
                    isActive(attendee.lastActive)
                  )}
                >
                  {isActive(attendee.lastActive) ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const reportsPage = (
    <Stack space={4}>
      <Headline level={2}>Reports</Headline>
      <Tabs aria-label="Reports">
        <Tabs.List>
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Columns columns={[1, 1, 1, 1]} space={3}>
              <Card>
                <Stack space={2}>
                  <Text size="sm">Total Revenue</Text>
                  <Headline level={3}>$45,230</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm">This Month</Text>
                  <Headline level={3}>$8,420</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm">Average per Event</Text>
                  <Headline level={3}>$1,885</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm">Refunds</Text>
                  <Headline level={3}>$1,230</Headline>
                </Stack>
              </Card>
            </Columns>
            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue Trend</SectionMessage.Title>
              <SectionMessage.Content>
                Revenue is up 12% compared to last month.
              </SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Columns columns={[1, 1, 1, 1]} space={3}>
              <Card>
                <Stack space={2}>
                  <Text size="sm">Total Attendees</Text>
                  <Headline level={3}>3,200</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm">Repeat Visitors</Text>
                  <Headline level={3}>890</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm">Average per Event</Text>
                  <Headline level={3}>178</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text size="sm">No-shows</Text>
                  <Headline level={3}>145</Headline>
                </Stack>
              </Card>
            </Columns>
            <Table aria-label="Top Events by Attendance">
              <Table.Header>
                <Table.Column>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Attendees</Table.Column>
                <Table.Column>Capacity</Table.Column>
                <Table.Column>Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body
                items={[
                  {
                    id: '1',
                    name: 'Summer Festival',
                    date: '2026-07-15',
                    attendees: 4800,
                    capacity: 5000,
                  },
                  {
                    id: '2',
                    name: 'Tech Conference',
                    date: '2026-08-20',
                    attendees: 1950,
                    capacity: 2000,
                  },
                  {
                    id: '3',
                    name: 'Jazz Night',
                    date: '2026-06-28',
                    attendees: 800,
                    capacity: 800,
                  },
                  {
                    id: '4',
                    name: 'Food Festival',
                    date: '2026-07-25',
                    attendees: 3600,
                    capacity: 4000,
                  },
                ]}
              >
                {[
                  {
                    id: '1',
                    name: 'Summer Festival',
                    date: '2026-07-15',
                    attendees: 4800,
                    capacity: 5000,
                  },
                  {
                    id: '2',
                    name: 'Tech Conference',
                    date: '2026-08-20',
                    attendees: 1950,
                    capacity: 2000,
                  },
                  {
                    id: '3',
                    name: 'Jazz Night',
                    date: '2026-06-28',
                    attendees: 800,
                    capacity: 800,
                  },
                  {
                    id: '4',
                    name: 'Food Festival',
                    date: '2026-07-25',
                    attendees: 3600,
                    capacity: 4000,
                  },
                ].map(item => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.date}</Table.Cell>
                    <Table.Cell>{item.attendees}</Table.Cell>
                    <Table.Cell>{item.capacity}</Table.Cell>
                    <Table.Cell>
                      {Math.round((item.attendees / item.capacity) * 100)}%
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="overview">
          <Stack space={4}>
            <Text>
              This quarter has shown strong growth across all metrics. Event
              attendance has increased by 28% year-over-year, and revenue is
              tracking ahead of projections.
            </Text>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  Q1 focused on launching our winter festival series. We
                  successfully attracted 12,000 attendees across 8 events and
                  generated $180,000 in revenue.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 marked our spring expansion with 15 events and 18,500
                  attendees. Revenue reached $245,000 with improved sponsorship
                  deals.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  Q3 is our peak season with summer events. Current projections
                  show 25,000+ attendees and $320,000+ in revenue from 20
                  planned events.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const settingsPage = (
    <Stack space={4}>
      <Headline level={2}>Settings</Headline>
      <Tabs aria-label="Settings">
        <Tabs.List>
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            {settingsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Success</SectionMessage.Title>
                <SectionMessage.Content>
                  Settings saved successfully.
                </SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={3}>
              <TextField label="Organization Name" />
              <TextField label="Contact Email" type="email" />
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
              <Button
                variant="primary"
                onPress={() => {
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 3000);
                }}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {notificationsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Success</SectionMessage.Title>
                <SectionMessage.Content>
                  Preferences saved successfully.
                </SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={3}>
              <Inline space={3} alignY="center">
                <Switch id="email" />
                <Stack space={1} alignX="left">
                  <Text weight="bold">Email Notifications</Text>
                  <Text size="sm">Receive updates via email</Text>
                </Stack>
              </Inline>
              <Inline space={3} alignY="center">
                <Switch id="sms" />
                <Stack space={1} alignX="left">
                  <Text weight="bold">SMS Notifications</Text>
                  <Text size="sm">Receive updates via SMS</Text>
                </Stack>
              </Inline>
              <Inline space={3} alignY="center">
                <Switch id="digest" />
                <Stack space={1} alignX="left">
                  <Text weight="bold">Weekly Digest</Text>
                  <Text size="sm">Get a weekly summary of events</Text>
                </Stack>
              </Inline>
              <Inline space={3} alignY="center">
                <Switch id="marketing" />
                <Stack space={1} alignX="left">
                  <Text weight="bold">Marketing Emails</Text>
                  <Text size="sm">Receive promotional offers</Text>
                </Stack>
              </Inline>
              <Button
                variant="primary"
                onPress={() => {
                  setNotificationsSaved(true);
                  setTimeout(() => setNotificationsSaved(false), 3000);
                }}
              >
                Save Preferences
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const getPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return dashboardPage;
      case 'events':
        return eventsPage;
      case 'attendees':
        return attendeesPage;
      case 'reports':
        return reportsPage;
      case 'settings':
        return settingsPage;
      default:
        return dashboardPage;
    }
  };

  const getBreadcrumbLabel = () => {
    const labels: Record<Page, string> = {
      dashboard: 'Dashboard',
      events: 'Events',
      attendees: 'Attendees',
      reports: 'Reports',
      settings: 'Settings',
    };
    return labels[currentPage];
  };

  const handleNavigate = (path: string) => {
    const pageMap: Record<string, Page> = {
      '/dashboard': 'dashboard',
      '/events': 'events',
      '/attendees': 'attendees',
      '/reports': 'reports',
      '/settings': 'settings',
    };
    setCurrentPage(pageMap[path] || 'dashboard');
  };

  return (
    <RouterProvider navigate={handleNavigate}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Headline level={3}>EventHub</Headline>
            </Sidebar.Header>
            <Sidebar.Nav current={`/${currentPage}`}>
              <Sidebar.Item href="/dashboard">
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="/events">
                Events
              </Sidebar.Item>
              <Sidebar.Item href="/attendees">
                Attendees
              </Sidebar.Item>
              <Sidebar.Item href="/reports">
                Reports
              </Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item href="/settings">
                Settings
              </Sidebar.Item>
              <Sidebar.Separator />
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Sidebar.Item href="#help">Help & Support</Sidebar.Item>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <nav aria-label="Breadcrumbs">
                <Breadcrumbs>
                  <Breadcrumbs.Item href="/dashboard">
                    EventHub
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item href="#">
                    {getBreadcrumbLabel()}
                  </Breadcrumbs.Item>
                </Breadcrumbs>
              </nav>
            </TopNavigation.Middle>
          <TopNavigation.End>
            <Dialog.Trigger
              open={signOutDialogOpen}
              onOpenChange={setSignOutDialogOpen}
            >
              <Menu label="Account">
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout" variant="destructive">
                  Sign out
                </Menu.Item>
              </Menu>
              <Dialog role="alertdialog">
                <Dialog.Title>Sign out</Dialog.Title>
                <Dialog.Content>
                  Are you sure you want to sign out?
                </Dialog.Content>
                <Dialog.Actions>
                  <Button variant="secondary" slot="close">
                    Cancel
                  </Button>
                  <Button variant="destructive" slot="close">
                    Sign out
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Dialog.Trigger>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space={4}>{getPageContent()}</Inset>
        </AppLayout.Main>
      </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
};

export default TestApp;
