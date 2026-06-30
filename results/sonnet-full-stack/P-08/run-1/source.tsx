import { useState } from 'react';
import {
  AppLayout,
  Inset,
  Stack,
  Inline,
  Split,
  Tiles,
  RouterProvider,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Tabs,
  Accordion,
  Headline,
  Text,
  Badge,
  Card,
  SectionMessage,
  TextField,
  TextArea,
  SearchField,
  Select,
  Switch,
  NumberField,
  DatePicker,
  Button,
  Dialog,
  Menu,
  Tooltip,
  Table,
} from '@marigold/components';

// ── Static data ───────────────────────────────────────────────────────────────

const upcomingEvents = [
  { id: '1', event: 'Tech Summit 2026', date: '2026-07-10', venue: 'Convention Center', tickets: 450, status: 'On Sale' },
  { id: '2', event: 'Music Festival', date: '2026-07-15', venue: 'City Park', tickets: 2000, status: 'Sold Out' },
  { id: '3', event: 'Design Workshop', date: '2026-07-18', venue: 'Creative Hub', tickets: 80, status: 'On Sale' },
  { id: '4', event: 'Startup Pitch Night', date: '2026-07-22', venue: 'Innovation Lab', tickets: 0, status: 'Draft' },
  { id: '5', event: 'Photography Expo', date: '2026-07-25', venue: 'Art Gallery', tickets: 320, status: 'On Sale' },
  { id: '6', event: 'Food & Wine Tasting', date: '2026-07-30', venue: 'Grand Hotel', tickets: 150, status: 'Sold Out' },
];

const allEvents = [
  { id: '1', name: 'Tech Summit 2026', date: '2026-07-10', location: 'San Francisco, CA', capacity: 500, status: 'On Sale' },
  { id: '2', name: 'Music Festival', date: '2026-07-15', location: 'Austin, TX', capacity: 2000, status: 'Sold Out' },
  { id: '3', name: 'Design Workshop', date: '2026-07-18', location: 'New York, NY', capacity: 100, status: 'On Sale' },
  { id: '4', name: 'Startup Pitch Night', date: '2026-07-22', location: 'Boston, MA', capacity: 200, status: 'Draft' },
  { id: '5', name: 'Photography Expo', date: '2026-07-25', location: 'Los Angeles, CA', capacity: 400, status: 'On Sale' },
  { id: '6', name: 'Food & Wine Tasting', date: '2026-07-30', location: 'Chicago, IL', capacity: 180, status: 'Sold Out' },
];

// Today: 2026-06-28. Active = last active within 30 days (>= 2026-05-29)
const attendees = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2026-06-15' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-04-10' },
  { id: '4', name: 'David Wilson', email: 'david@example.com', eventsAttended: 2, lastActive: '2026-06-25' },
  { id: '5', name: 'Eve Martinez', email: 'eve@example.com', eventsAttended: 12, lastActive: '2026-03-05' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', eventsAttended: 7, lastActive: '2026-06-01' },
];

const topAttendanceEvents = [
  { id: '1', event: 'Music Festival', date: '2026-06-01', attendees: 1980, capacity: 2000, fillRate: '99%' },
  { id: '2', event: 'Tech Summit 2025', date: '2026-03-15', attendees: 472, capacity: 500, fillRate: '94%' },
  { id: '3', event: 'Food & Wine Tasting', date: '2026-05-20', attendees: 168, capacity: 180, fillRate: '93%' },
  { id: '4', event: 'Photography Expo', date: '2026-04-05', attendees: 355, capacity: 400, fillRate: '89%' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'On Sale' ? 'success' :
    status === 'Sold Out' ? 'error' :
    status === 'Draft' ? 'warning' :
    status === 'Active' ? 'success' : 'warning';
  return <Badge variant={variant}>{status}</Badge>;
}

function isActiveAttendee(lastActive: string) {
  return new Date(lastActive) >= new Date('2026-05-29');
}

// ── Pages ─────────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>
      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
      </SectionMessage>
      <Tiles tilesWidth="180px" space={4} stretch>
        <Card>
          <Stack space={1}>
            <Text variant="muted">Total Events</Text>
            <Headline level={2}>24</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={1}>
            <Text variant="muted">Tickets Sold</Text>
            <Headline level={2}>1,849</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={1}>
            <Inline space={1} alignY="center">
              <Text variant="muted">Revenue</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" size="icon" aria-label="Revenue information">?</Button>
                <Tooltip>Net revenue after fees and refunds</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={2}>$45,230</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={1}>
            <Text variant="muted">Upcoming</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
      </Tiles>
      <Stack space={3}>
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
            {upcomingEvents.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.event}</Table.Cell>
                <Table.Cell>{row.date}</Table.Cell>
                <Table.Cell>{row.venue}</Table.Cell>
                <Table.Cell>{row.tickets}</Table.Cell>
                <Table.Cell><StatusBadge status={row.status} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );
}

function EventsPage() {
  const [search, setSearch] = useState('');

  const filtered = allEvents.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Inline alignY="center">
        <Headline level={1}>Events</Headline>
        <Split />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="medium">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Event Name" required />
                <DatePicker label="Date" />
                <TextField label="Location" />
                <NumberField label="Capacity" defaultValue={100} />
                <TextArea label="Description" />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>
      <SearchField
        label="Search events"
        placeholder="Search by name or location..."
        value={search}
        onChange={setSearch}
      />
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
              <Table.Cell>{row.capacity}</Table.Cell>
              <Table.Cell><StatusBadge status={row.status} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function AttendeesPage() {
  const [search, setSearch] = useState('');

  const filtered = attendees.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline alignY="center">
        <SearchField
          label="Search attendees"
          placeholder="Search by name or email..."
          value={search}
          onChange={setSearch}
        />
        <Split />
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
                <StatusBadge status={isActiveAttendee(row.lastActive) ? 'Active' : 'Inactive'} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function ReportsPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Reports</Headline>
      <Tabs aria-label="Reports">
        <Tabs.List aria-label="Report views">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Tiles tilesWidth="160px" space={4} stretch>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">Total Revenue</Text>
                  <Headline level={2}>$45,230</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">This Month</Text>
                  <Headline level={2}>$8,420</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">Avg per Event</Text>
                  <Headline level={2}>$1,885</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">Refunds</Text>
                  <Headline level={2}>$1,230</Headline>
                </Stack>
              </Card>
            </Tiles>
            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue is up 12% compared to last month.</SectionMessage.Title>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Tiles tilesWidth="160px" space={4} stretch>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">Total Attendees</Text>
                  <Headline level={2}>3,200</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">Repeat Visitors</Text>
                  <Headline level={2}>890</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">Avg per Event</Text>
                  <Headline level={2}>178</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={1}>
                  <Text variant="muted">No-shows</Text>
                  <Headline level={2}>145</Headline>
                </Stack>
              </Card>
            </Tiles>
            <Table aria-label="Top Events by Attendance" selectionMode="none">
              <Table.Header>
                <Table.Column rowHeader>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Attendees</Table.Column>
                <Table.Column>Capacity</Table.Column>
                <Table.Column>Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body>
                {topAttendanceEvents.map(row => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.event}</Table.Cell>
                    <Table.Cell>{row.date}</Table.Cell>
                    <Table.Cell>{row.attendees}</Table.Cell>
                    <Table.Cell>{row.capacity}</Table.Cell>
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
              EventHub has delivered strong performance this year, with consistent growth in ticket
              sales, revenue, and attendee satisfaction across all event categories.
            </Text>
            <Accordion allowsMultipleExpanded>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q1 saw 6 major events with total revenue of $12,400. Attendance averaged 210
                    per event with a 91% satisfaction rate across all venues.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q2 was our strongest quarter with 8 events generating $18,650. The Music
                    Festival was a standout, selling out in under 48 hours after launch.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q3 is underway with 4 events scheduled. Early ticket sales indicate strong
                    demand for the Tech Summit and Photography Expo.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

function SettingsPage() {
  const [generalSaved, setGeneralSaved] = useState(false);
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
          <Stack space={4}>
            {generalSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Settings saved successfully.</SectionMessage.Title>
              </SectionMessage>
            )}
            <TextField label="Organization Name" defaultValue="EventHub Inc." />
            <TextField label="Contact Email" type="email" defaultValue="admin@eventhub.com" />
            <Select label="Default Currency" defaultSelectedKey="USD">
              <Select.Option id="USD">USD</Select.Option>
              <Select.Option id="EUR">EUR</Select.Option>
              <Select.Option id="GBP">GBP</Select.Option>
            </Select>
            <Select label="Default Timezone" defaultSelectedKey="UTC">
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Button variant="primary" onPress={() => setGeneralSaved(true)}>
              Save Changes
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {notifSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Notification preferences saved.</SectionMessage.Title>
              </SectionMessage>
            )}
            <Stack space={4}>
              <Stack space={1}>
                <Switch
                  label="Email Notifications"
                  selected={emailNotif}
                  onChange={setEmailNotif}
                />
                <Text variant="muted">Receive event updates and confirmations via email.</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="SMS Notifications"
                  selected={smsNotif}
                  onChange={setSmsNotif}
                />
                <Text variant="muted">Get text alerts for urgent event changes.</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Weekly Digest"
                  selected={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <Text variant="muted">A weekly summary of your events and performance.</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Marketing Emails"
                  selected={marketingEmails}
                  onChange={setMarketingEmails}
                />
                <Text variant="muted">Receive tips, product updates, and offers from EventHub.</Text>
              </Stack>
            </Stack>
            <Button variant="primary" onPress={() => setNotifSaved(true)}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────────

const PAGE_NAMES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

export default function TestApp() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const pageName = PAGE_NAMES[currentPath] ?? 'Dashboard';

  const renderPage = () => {
    switch (currentPath) {
      case '/events': return <EventsPage />;
      case '/attendees': return <AttendeesPage />;
      case '/reports': return <ReportsPage />;
      case '/settings': return <SettingsPage />;
      case '/help': return (
        <Stack space={4}>
          <Headline level={1}>Help &amp; Support</Headline>
          <Text>Contact our support team at support@eventhub.com for assistance.</Text>
        </Stack>
      );
      default: return <DashboardPage />;
    }
  };

  return (
    <RouterProvider navigate={setCurrentPath}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">EventHub</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={currentPath}>
              <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
              <Sidebar.Item href="/events">Events</Sidebar.Item>
              <Sidebar.Item href="/attendees">Attendees</Sidebar.Item>
              <Sidebar.Item href="/reports">Reports</Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item href="/settings">Settings</Sidebar.Item>
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Sidebar.Item href="/help">Help &amp; Support</Sidebar.Item>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={currentPath}>{pageName}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu
                label="My Account"
                variant="ghost"
                onAction={(key) => {
                  if (key === 'signout') setSignOutOpen(true);
                }}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              {renderPage()}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

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
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={close}>Sign out</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </RouterProvider>
  );
}
