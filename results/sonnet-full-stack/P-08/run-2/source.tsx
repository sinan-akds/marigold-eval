import { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Menu,
  Dialog,
  Table,
  Tabs,
  Badge,
  SectionMessage,
  Tooltip,
  Switch,
  Accordion,
  SearchField,
  TextField,
  Select,
  DatePicker,
  NumberField,
  TextArea,
  Stack,
  Inline,
  Tiles,
  Inset,
  Card,
  Headline,
  Text,
  Button,
  RouterProvider,
} from '@marigold/components';

// ─── Data ────────────────────────────────────────────────────────────────────

const dashboardEvents = [
  { id: '1', event: 'Summer Music Festival', date: 'Jul 15, 2026', venue: 'Central Park, NY', ticketsSold: 3421, status: 'On Sale' },
  { id: '2', event: 'Tech Conference 2026', date: 'Aug 3, 2026', venue: 'Convention Center, SF', ticketsSold: 890, status: 'On Sale' },
  { id: '3', event: 'Autumn Jazz Night', date: 'Sep 20, 2026', venue: 'Blue Note Club, NY', ticketsSold: 300, status: 'Sold Out' },
  { id: '4', event: 'Winter Wonderland', date: 'Dec 12, 2026', venue: 'Madison Square Garden, NY', ticketsSold: 0, status: 'Draft' },
  { id: '5', event: 'Spring Food Fest', date: 'Apr 5, 2027', venue: 'Riverside Park, Chicago', ticketsSold: 1245, status: 'On Sale' },
  { id: '6', event: 'Comedy Showcase', date: 'Oct 8, 2026', venue: 'Laugh Factory, Los Angeles', ticketsSold: 312, status: 'On Sale' },
];

const allEventsData = [
  { id: '1', name: 'Summer Music Festival', date: 'Jul 15, 2026', location: 'Central Park, NY', capacity: 5000, status: 'On Sale' },
  { id: '2', name: 'Tech Conference 2026', date: 'Aug 3, 2026', location: 'Convention Center, SF', capacity: 1200, status: 'On Sale' },
  { id: '3', name: 'Autumn Jazz Night', date: 'Sep 20, 2026', location: 'Blue Note Club, NY', capacity: 300, status: 'Sold Out' },
  { id: '4', name: 'Winter Wonderland', date: 'Dec 12, 2026', location: 'Madison Square Garden, NY', capacity: 8000, status: 'Draft' },
  { id: '5', name: 'Spring Food Fest', date: 'Apr 5, 2027', location: 'Riverside Park, Chicago', capacity: 2500, status: 'On Sale' },
  { id: '6', name: 'Comedy Showcase', date: 'Oct 8, 2026', location: 'Laugh Factory, Los Angeles', capacity: 500, status: 'On Sale' },
];

const allAttendeesData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: 'Jun 20, 2026', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: 'Jun 24, 2026', status: 'Active' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', eventsAttended: 8, lastActive: 'May 1, 2026', status: 'Inactive' },
  { id: '4', name: 'David Brown', email: 'david@example.com', eventsAttended: 2, lastActive: 'Jun 10, 2026', status: 'Active' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', eventsAttended: 12, lastActive: 'Mar 15, 2026', status: 'Inactive' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', eventsAttended: 1, lastActive: 'Jun 22, 2026', status: 'Active' },
];

const topAttendanceData = [
  { id: '1', event: 'Summer Music Festival', date: 'Jul 15, 2026', attendees: 4200, capacity: 5000, fillRate: '84%' },
  { id: '2', event: 'Tech Conference 2026', date: 'Aug 3, 2026', attendees: 1100, capacity: 1200, fillRate: '92%' },
  { id: '3', event: 'Spring Food Fest', date: 'Apr 5, 2026', attendees: 2300, capacity: 2500, fillRate: '92%' },
  { id: '4', event: 'Comedy Showcase', date: 'Oct 8, 2026', attendees: 480, capacity: 500, fillRate: '96%' },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const getStatusVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'On Sale': return 'success';
    case 'Sold Out': return 'error';
    case 'Draft': return 'warning';
    case 'Active': return 'success';
    case 'Inactive': return 'warning';
    default: return 'default';
  }
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const DashboardPage = () => (
  <Stack space={6}>
    <Headline level={1}>Dashboard Overview</Headline>
    <SectionMessage variant="info">
      <SectionMessage.Title>Welcome back!</SectionMessage.Title>
      <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
    </SectionMessage>
    <Tiles tilesWidth="180px" space={4} stretch>
      <Card>
        <Inset space={4}>
          <Stack space={2}>
            <Text>Total Events</Text>
            <Headline level={2}>24</Headline>
          </Stack>
        </Inset>
      </Card>
      <Card>
        <Inset space={4}>
          <Stack space={2}>
            <Text>Tickets Sold</Text>
            <Headline level={2}>1,849</Headline>
          </Stack>
        </Inset>
      </Card>
      <Card>
        <Inset space={4}>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              <Text>Revenue</Text>
              <Tooltip.Trigger>
                <Button variant="ghost">ⓘ</Button>
                <Tooltip>Net revenue after fees and refunds</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={2}>$45,230</Headline>
          </Stack>
        </Inset>
      </Card>
      <Card>
        <Inset space={4}>
          <Stack space={2}>
            <Text>Upcoming</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Inset>
      </Card>
    </Tiles>
    <Headline level={2}>Upcoming Events</Headline>
    <Table aria-label="Upcoming Events" selectionMode="none">
      <Table.Header>
        <Table.Column rowHeader>Event</Table.Column>
        <Table.Column>Date</Table.Column>
        <Table.Column>Venue</Table.Column>
        <Table.Column>Tickets Sold</Table.Column>
        <Table.Column>Status</Table.Column>
      </Table.Header>
      <Table.Body>
        {dashboardEvents.map(row => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.event}</Table.Cell>
            <Table.Cell>{row.date}</Table.Cell>
            <Table.Cell>{row.venue}</Table.Cell>
            <Table.Cell>{row.ticketsSold}</Table.Cell>
            <Table.Cell>
              <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </Stack>
);

// ─── Events ──────────────────────────────────────────────────────────────────

const EventsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => allEventsData.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>
      <Inline alignX="between" alignY="center" space={4}>
        <SearchField label="Search events" value={search} onChange={setSearch} />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="medium">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Event Name" required />
                <DatePicker label="Date" />
                <TextField label="Location" />
                <NumberField label="Capacity" />
                <TextArea label="Description" />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button variant="primary" slot="close">Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>
      <Table aria-label="Events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.location}</Table.Cell>
              <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

// ─── Attendees ───────────────────────────────────────────────────────────────

const AttendeesPage = () => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => allAttendeesData.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline alignX="between" alignY="center" space={4}>
        <SearchField label="Search attendees" value={search} onChange={setSearch} />
        <Text>{filtered.length} attendees</Text>
      </Inline>
      <Table aria-label="Attendees" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.eventsAttended}</Table.Cell>
              <Table.Cell>{row.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

// ─── Reports ─────────────────────────────────────────────────────────────────

const ReportsPage = () => (
  <Stack space={6}>
    <Headline level={1}>Reports</Headline>
    <Tabs aria-label="Reports">
      <Tabs.List aria-label="Report sections">
        <Tabs.Item id="revenue">Revenue</Tabs.Item>
        <Tabs.Item id="attendance">Attendance</Tabs.Item>
        <Tabs.Item id="overview">Overview</Tabs.Item>
      </Tabs.List>
      <Tabs.TabPanel id="revenue">
        <Stack space={6}>
          <Tiles tilesWidth="160px" space={4} stretch>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>Total Revenue</Text>
                  <Headline level={2}>$45,230</Headline>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>This Month</Text>
                  <Headline level={2}>$8,420</Headline>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>Avg per Event</Text>
                  <Headline level={2}>$1,885</Headline>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>Refunds</Text>
                  <Headline level={2}>$1,230</Headline>
                </Stack>
              </Inset>
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
        <Stack space={6}>
          <Tiles tilesWidth="160px" space={4} stretch>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>Total Attendees</Text>
                  <Headline level={2}>3,200</Headline>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>Repeat Visitors</Text>
                  <Headline level={2}>890</Headline>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>Avg per Event</Text>
                  <Headline level={2}>178</Headline>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset space={4}>
                <Stack space={2}>
                  <Text>No-shows</Text>
                  <Headline level={2}>145</Headline>
                </Stack>
              </Inset>
            </Card>
          </Tiles>
          <Headline level={2}>Top Events by Attendance</Headline>
          <Table aria-label="Top Events by Attendance" selectionMode="none">
            <Table.Header>
              <Table.Column rowHeader>Event</Table.Column>
              <Table.Column>Date</Table.Column>
              <Table.Column>Attendees</Table.Column>
              <Table.Column>Capacity</Table.Column>
              <Table.Column>Fill Rate</Table.Column>
            </Table.Header>
            <Table.Body>
              {topAttendanceData.map(row => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.event}</Table.Cell>
                  <Table.Cell>{row.date}</Table.Cell>
                  <Table.Cell>{row.attendees.toLocaleString()}</Table.Cell>
                  <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
                  <Table.Cell>{row.fillRate}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Stack>
      </Tabs.TabPanel>
      <Tabs.TabPanel id="overview">
        <Stack space={4}>
          <Text>
            This report provides a comprehensive overview of EventHub performance across all quarters.
            Key metrics show consistent growth in attendance, revenue, and event volume throughout the year.
          </Text>
          <Accordion allowsMultipleExpanded>
            <Accordion.Item id="q1">
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q1 2026 saw strong performance with 6 major events and over 12,000 total attendees.
                  Revenue reached $14,200, exceeding the quarterly target by 8%. New venue partnerships
                  in New York and Chicago drove significant growth.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q2">
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q2 2026 continued the upward trend with 8 events and 15,400 attendees. Revenue grew
                  to $18,600, up 31% from Q1. The Summer Music Festival was the standout event,
                  selling out within 48 hours of opening.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q3">
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q3 2026 projections indicate continued growth. Upcoming events include Tech Conference
                  2026 and Autumn Jazz Night. Early ticket sales suggest Q3 revenue will surpass $20,000
                  for the first time.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

// ─── Settings ────────────────────────────────────────────────────────────────

const SettingsPage = () => {
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>
      <Tabs aria-label="Settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="general">
          <Stack space={6}>
            {settingsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Settings saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={4}>
              <TextField label="Organization Name" defaultValue="EventHub Inc." />
              <TextField label="Contact Email" type="email" defaultValue="admin@eventhub.com" />
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
              <Button variant="primary" onPress={() => setSettingsSaved(true)}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="notifications">
          <Stack space={6}>
            {notifSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Preferences saved</SectionMessage.Title>
                <SectionMessage.Content>Your notification preferences have been saved.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={4}>
              <Stack space={1}>
                <Switch label="Email Notifications" selected={emailNotif} onChange={setEmailNotif} />
                <Text>Receive email notifications for new orders and event updates.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="SMS Notifications" selected={smsNotif} onChange={setSmsNotif} />
                <Text>Get SMS alerts for critical event changes and reminders.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Weekly Digest" selected={weeklyDigest} onChange={setWeeklyDigest} />
                <Text>Receive a weekly summary of your events and performance metrics.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Marketing Emails" selected={marketingEmails} onChange={setMarketingEmails} />
                <Text>Stay updated with tips, offers, and EventHub news.</Text>
              </Stack>
              <Button variant="primary" onPress={() => setNotifSaved(true)}>
                Save Preferences
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

// ─── App Shell ───────────────────────────────────────────────────────────────

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const pageNames: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/events': 'Events',
    '/attendees': 'Attendees',
    '/reports': 'Reports',
    '/settings': 'Settings',
    '/help': 'Help & Support',
  };

  const currentPageName = pageNames[currentPage] ?? 'Dashboard';

  return (
    <RouterProvider navigate={(href) => setCurrentPage(href === '/' ? '/dashboard' : href)}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">EventHub</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={currentPage}>
              <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
              <Sidebar.Item href="/events">Events</Sidebar.Item>
              <Sidebar.Item href="/attendees">Attendees</Sidebar.Item>
              <Sidebar.Item href="/reports">Reports</Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item href="/settings">Settings</Sidebar.Item>
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Sidebar.Item href="/help">Help & Support</Sidebar.Item>
            </Sidebar.Footer>
          </AppLayout.Sidebar>
          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="/">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={currentPage}>{currentPageName}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu
                label="Account"
                onAction={(key) => {
                  if (key === 'signout') setSignOutOpen(true);
                }}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
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
                      <Button variant="secondary" onPress={close}>Cancel</Button>
                      <Button variant="primary" onPress={close}>Sign out</Button>
                    </Dialog.Actions>
                  </>
                )}
              </Dialog>
            </TopNavigation.End>
          </AppLayout.Header>
          <AppLayout.Main>
            <Inset space={6}>
              {currentPage === '/dashboard' && <DashboardPage />}
              {currentPage === '/events' && <EventsPage />}
              {currentPage === '/attendees' && <AttendeesPage />}
              {currentPage === '/reports' && <ReportsPage />}
              {currentPage === '/settings' && <SettingsPage />}
              {currentPage === '/help' && (
                <Stack space={4}>
                  <Headline level={1}>Help & Support</Headline>
                  <Text>Contact us at support@eventhub.com for assistance.</Text>
                </Stack>
              )}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
};

export default TestApp;
