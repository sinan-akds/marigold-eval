import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Columns,
  DatePicker,
  Dialog,
  Headline,
  Inline,
  Inset,
  Menu,
  NumberField,
  RouterProvider,
  SearchField,
  SectionMessage,
  Select,
  Sidebar,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
  Tiles,
  Tooltip,
  TopNavigation,
} from '@marigold/components';

// ─── Data ────────────────────────────────────────────────────────────────────

const upcomingEventsData = [
  { id: '1', event: 'Summer Music Festival', date: '2026-07-15', venue: 'Central Park', ticketsSold: 842, status: 'On Sale' },
  { id: '2', event: 'Tech Conference 2026', date: '2026-07-22', venue: 'Convention Center', ticketsSold: 350, status: 'On Sale' },
  { id: '3', event: 'Art Exhibition Opening', date: '2026-07-28', venue: 'City Gallery', ticketsSold: 0, status: 'Draft' },
  { id: '4', event: 'Comedy Night Special', date: '2026-08-05', venue: 'The Laugh Factory', ticketsSold: 280, status: 'Sold Out' },
  { id: '5', event: 'Marathon 2026', date: '2026-08-10', venue: 'City Streets', ticketsSold: 1200, status: 'On Sale' },
  { id: '6', event: 'Jazz Evening', date: '2026-08-20', venue: 'Blue Note Club', ticketsSold: 95, status: 'Draft' },
];

const allEventsData = [
  { id: '1', name: 'Summer Music Festival', date: '2026-07-15', location: 'New York, NY', capacity: 1000, status: 'On Sale' },
  { id: '2', name: 'Tech Conference 2026', date: '2026-07-22', location: 'San Francisco, CA', capacity: 500, status: 'On Sale' },
  { id: '3', name: 'Art Exhibition Opening', date: '2026-07-28', location: 'Chicago, IL', capacity: 200, status: 'Draft' },
  { id: '4', name: 'Comedy Night Special', date: '2026-08-05', location: 'Los Angeles, CA', capacity: 300, status: 'Sold Out' },
  { id: '5', name: 'Marathon 2026', date: '2026-08-10', location: 'Boston, MA', capacity: 1500, status: 'On Sale' },
  { id: '6', name: 'Jazz Evening', date: '2026-08-20', location: 'New Orleans, LA', capacity: 120, status: 'Draft' },
];

const allAttendeesData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20', status: 'Active' as const },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2026-06-18', status: 'Active' as const },
  { id: '3', name: 'Carol White', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-05-01', status: 'Inactive' as const },
  { id: '4', name: 'David Brown', email: 'david@example.com', eventsAttended: 2, lastActive: '2026-06-22', status: 'Active' as const },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', eventsAttended: 6, lastActive: '2026-04-15', status: 'Inactive' as const },
  { id: '6', name: 'Frank Wilson', email: 'frank@example.com', eventsAttended: 1, lastActive: '2026-06-10', status: 'Active' as const },
];

const topEventsData = [
  { id: '1', event: 'Summer Music Festival', date: '2026-07-15', attendees: 842, capacity: 1000, fillRate: '84%' },
  { id: '2', event: 'Marathon 2026', date: '2026-08-10', attendees: 1200, capacity: 1500, fillRate: '80%' },
  { id: '3', event: 'Tech Conference 2026', date: '2026-07-22', attendees: 350, capacity: 500, fillRate: '70%' },
  { id: '4', event: 'Comedy Night Special', date: '2026-08-05', attendees: 280, capacity: 280, fillRate: '100%' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function EventStatusBadge({ status }: { status: string }) {
  if (status === 'On Sale') return <Badge variant="success">On Sale</Badge>;
  if (status === 'Draft') return <Badge variant="warning">Draft</Badge>;
  if (status === 'Sold Out') return <Badge variant="error">Sold Out</Badge>;
  return <Badge>{status}</Badge>;
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>
      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
      </SectionMessage>
      <Tiles tilesWidth="180px" space={4} stretch equalHeight>
        <Card p={4}>
          <Stack space={2}>
            <Text>Total Events</Text>
            <Headline level={2}>24</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text>Tickets Sold</Text>
            <Headline level={2}>1,849</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Tooltip.Trigger>
              <Text>Revenue</Text>
              <Tooltip>Net revenue after fees and refunds</Tooltip>
            </Tooltip.Trigger>
            <Headline level={2}>$45,230</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text>Upcoming</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
      </Tiles>
      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Table aria-label="Upcoming Events" selectionMode="none">
          <Table.Header>
            <Table.Column rowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEventsData.map(ev => (
              <Table.Row key={ev.id}>
                <Table.Cell>{ev.event}</Table.Cell>
                <Table.Cell>{ev.date}</Table.Cell>
                <Table.Cell>{ev.venue}</Table.Cell>
                <Table.Cell>{ev.ticketsSold}</Table.Cell>
                <Table.Cell><EventStatusBadge status={ev.status} /></Table.Cell>
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

  const filtered = allEventsData.filter(
    e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          aria-label="Search events"
          value={search}
          onChange={setSearch}
          placeholder="Search by name or location…"
          width={80}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="small">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Event Name" required />
                <DatePicker label="Date" />
                <TextField label="Location" />
                <NumberField label="Capacity" minValue={0} />
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
          {filtered.map(ev => (
            <Table.Row key={ev.id}>
              <Table.Cell>{ev.name}</Table.Cell>
              <Table.Cell>{ev.date}</Table.Cell>
              <Table.Cell>{ev.location}</Table.Cell>
              <Table.Cell>{ev.capacity}</Table.Cell>
              <Table.Cell><EventStatusBadge status={ev.status} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function AttendeesPage() {
  const [search, setSearch] = useState('');

  const filtered = allAttendeesData.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          aria-label="Search attendees"
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
          width={80}
        />
        <Text>{allAttendeesData.length} attendees</Text>
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
          {filtered.map(a => (
            <Table.Row key={a.id}>
              <Table.Cell>{a.name}</Table.Cell>
              <Table.Cell>{a.email}</Table.Cell>
              <Table.Cell>{a.eventsAttended}</Table.Cell>
              <Table.Cell>{a.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={a.status === 'Active' ? 'success' : 'warning'}>
                  {a.status}
                </Badge>
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
        <Tabs.List aria-label="Report sections">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={6}>
            <Tiles tilesWidth="160px" space={4} stretch equalHeight>
              <Card p={4}>
                <Stack space={2}>
                  <Text>Total Revenue</Text>
                  <Headline level={3}>$45,230</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text>This Month</Text>
                  <Headline level={3}>$8,420</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text>Average per Event</Text>
                  <Headline level={3}>$1,885</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text>Refunds</Text>
                  <Headline level={3}>$1,230</Headline>
                </Stack>
              </Card>
            </Tiles>
            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue Growth</SectionMessage.Title>
              <SectionMessage.Content>Revenue is up 12% compared to last month.</SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={6}>
            <Tiles tilesWidth="160px" space={4} stretch equalHeight>
              <Card p={4}>
                <Stack space={2}>
                  <Text>Total Attendees</Text>
                  <Headline level={3}>3,200</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text>Repeat Visitors</Text>
                  <Headline level={3}>890</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text>Average per Event</Text>
                  <Headline level={3}>178</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text>No-shows</Text>
                  <Headline level={3}>145</Headline>
                </Stack>
              </Card>
            </Tiles>
            <Stack space={3}>
              <Headline level={3}>Top Events by Attendance</Headline>
              <Table aria-label="Top Events by Attendance" selectionMode="none">
                <Table.Header>
                  <Table.Column rowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body>
                  {topEventsData.map(ev => (
                    <Table.Row key={ev.id}>
                      <Table.Cell>{ev.event}</Table.Cell>
                      <Table.Cell>{ev.date}</Table.Cell>
                      <Table.Cell>{ev.attendees}</Table.Cell>
                      <Table.Cell>{ev.capacity}</Table.Cell>
                      <Table.Cell>{ev.fillRate}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="overview">
          <Stack space={6}>
            <Text>
              This report provides a comprehensive overview of EventHub&apos;s performance across all quarters.
              Revenue is trending upward, attendance is growing, and customer satisfaction remains high.
            </Text>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  Q1 saw strong ticket sales driven by the Spring Festival and Tech Expo. Total revenue
                  reached $12,400 with an average fill rate of 78% across all events. New attendee
                  registrations increased by 15% compared to the previous year.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 continued the positive trend with revenue of $15,800. The Summer Concert Series
                  was particularly successful, selling out in under 48 hours. Repeat visitor rate
                  climbed to 32%, indicating strong brand loyalty among our attendee base.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  Q3 is shaping up to be our strongest quarter yet, with $17,030 in revenue already
                  recorded through mid-quarter. The upcoming Summer Music Festival and Marathon 2026
                  are projected to push total Q3 revenue well beyond $20,000.
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
  const [orgName, setOrgName] = useState('EventHub Inc.');
  const [contactEmail, setContactEmail] = useState('admin@eventhub.com');
  const [currency, setCurrency] = useState<string>('USD');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [generalSaved, setGeneralSaved] = useState(false);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  function handleSaveGeneral() {
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 4000);
  }

  function handleSaveNotif() {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 4000);
  }

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
            {generalSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Settings saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={4}>
              <TextField
                label="Organization Name"
                value={orgName}
                onChange={setOrgName}
              />
              <TextField
                label="Contact Email"
                type="email"
                value={contactEmail}
                onChange={setContactEmail}
              />
              <Select
                label="Default Currency"
                selectedKey={currency}
                onSelectionChange={key => setCurrency(String(key))}
              >
                <Select.Option id="USD">USD</Select.Option>
                <Select.Option id="EUR">EUR</Select.Option>
                <Select.Option id="GBP">GBP</Select.Option>
              </Select>
              <Select
                label="Default Timezone"
                selectedKey={timezone}
                onSelectionChange={key => setTimezone(String(key))}
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Button variant="primary" onPress={handleSaveGeneral}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={6}>
            {notifSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Preferences saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={5}>
              <Stack space={1}>
                <Switch label="Email Notifications" selected={emailNotif} onChange={setEmailNotif} />
                <Text>Receive email updates about your events and attendees.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="SMS Notifications" selected={smsNotif} onChange={setSmsNotif} />
                <Text>Get text message alerts for urgent event updates.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Weekly Digest" selected={weeklyDigest} onChange={setWeeklyDigest} />
                <Text>A weekly summary of your event performance and metrics.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Marketing Emails" selected={marketingEmails} onChange={setMarketingEmails} />
                <Text>Receive tips, best practices, and promotional content from EventHub.</Text>
              </Stack>
              <Button variant="primary" onPress={handleSaveNotif}>
                Save Preferences
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

function EventHub() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  function handleMenuAction(key: React.Key) {
    if (key === 'signout') setSignOutOpen(true);
  }

  function renderPage() {
    switch (currentPath) {
      case '/events': return <EventsPage />;
      case '/attendees': return <AttendeesPage />;
      case '/reports': return <ReportsPage />;
      case '/settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  }

  const pageLabel = PAGE_LABELS[currentPath] ?? 'Page';

  return (
    <div style={{ height: '100vh' }}>
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
                  <Breadcrumbs.Item href={currentPath}>{pageLabel}</Breadcrumbs.Item>
                </Breadcrumbs>
              </TopNavigation.Middle>
              <TopNavigation.End>
                <Menu label="My Account" onAction={handleMenuAction}>
                  <Menu.Item id="profile">Profile</Menu.Item>
                  <Menu.Item id="signout">Sign out</Menu.Item>
                </Menu>
                <Dialog.Trigger open={signOutOpen} onOpenChange={setSignOutOpen}>
                  <Dialog role="alertdialog">
                    <Dialog.Title>Sign Out</Dialog.Title>
                    <Dialog.Content>Are you sure you want to sign out?</Dialog.Content>
                    <Dialog.Actions>
                      <Button variant="secondary" slot="close">Cancel</Button>
                      <Button variant="primary" slot="close">Sign out</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Dialog.Trigger>
              </TopNavigation.End>
            </AppLayout.Header>

            <AppLayout.Main>
              <Inset space={6}>
                {renderPage()}
              </Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>
    </div>
  );
}

export default EventHub;
