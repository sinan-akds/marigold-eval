import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  DatePicker,
  Dialog,
  Form,
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

// ── Data ──────────────────────────────────────────────────────────────────────

const upcomingEventsData = [
  { id: '1', name: 'Summer Music Festival', date: '2026-07-15', venue: 'Central Park', ticketsSold: 320, status: 'On Sale' },
  { id: '2', name: 'Tech Conference 2026', date: '2026-07-22', venue: 'Convention Center', ticketsSold: 180, status: 'On Sale' },
  { id: '3', name: 'Art Exhibition Opening', date: '2026-07-28', venue: 'City Gallery', ticketsSold: 0, status: 'Draft' },
  { id: '4', name: 'Jazz Night Under Stars', date: '2026-08-03', venue: 'Amphitheater', ticketsSold: 500, status: 'Sold Out' },
  { id: '5', name: 'Food & Wine Expo', date: '2026-08-10', venue: 'Exhibition Hall', ticketsSold: 245, status: 'On Sale' },
  { id: '6', name: 'Marathon 2026', date: '2026-08-17', venue: 'City Streets', ticketsSold: 604, status: 'Sold Out' },
];

const eventsData = [
  { id: '1', name: 'Summer Music Festival', date: '2026-07-15', location: 'New York', capacity: 500, status: 'On Sale' },
  { id: '2', name: 'Tech Conference 2026', date: '2026-07-22', location: 'San Francisco', capacity: 300, status: 'On Sale' },
  { id: '3', name: 'Art Exhibition Opening', date: '2026-07-28', location: 'Chicago', capacity: 150, status: 'Draft' },
  { id: '4', name: 'Jazz Night Under Stars', date: '2026-08-03', location: 'Los Angeles', capacity: 500, status: 'Sold Out' },
  { id: '5', name: 'Food & Wine Expo', date: '2026-08-10', location: 'Seattle', capacity: 400, status: 'On Sale' },
  { id: '6', name: 'Marathon 2026', date: '2026-08-17', location: 'Boston', capacity: 600, status: 'Sold Out' },
];

const attendeesData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2026-05-10' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-06-22' },
  { id: '4', name: 'David Brown', email: 'david@example.com', eventsAttended: 2, lastActive: '2026-04-01' },
  { id: '5', name: 'Emma Davis', email: 'emma@example.com', eventsAttended: 12, lastActive: '2026-06-18' },
  { id: '6', name: 'Frank Wilson', email: 'frank@example.com', eventsAttended: 1, lastActive: '2026-06-15' },
];

const topAttendanceData = [
  { id: '1', name: 'Summer Music Festival', date: '2026-07-15', attendees: 480, capacity: 500, fillRate: '96%' },
  { id: '2', name: 'Marathon 2026', date: '2026-08-17', attendees: 604, capacity: 600, fillRate: '100%' },
  { id: '3', name: 'Tech Conference 2026', date: '2026-07-22', attendees: 275, capacity: 300, fillRate: '92%' },
  { id: '4', name: 'Food & Wine Expo', date: '2026-08-10', attendees: 360, capacity: 400, fillRate: '90%' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

function statusVariant(status: string): BadgeVariant {
  if (status === 'On Sale') return 'success';
  if (status === 'Draft') return 'warning';
  if (status === 'Sold Out') return 'error';
  return 'default';
}

function isActive(lastActive: string): boolean {
  const last = new Date(lastActive);
  const now = new Date('2026-06-23');
  return (now.getTime() - last.getTime()) / 86400000 <= 30;
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
      <Tiles space={4} tilesWidth="180px" stretch equalHeight>
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
              <Text>Revenue</Text>
              <Inline space={2} alignY="center">
                <Headline level={2}>$45,230</Headline>
                <Tooltip.Trigger>
                  <Button variant="icon" size="small" aria-label="Revenue info">ⓘ</Button>
                  <Tooltip>Net revenue after fees and refunds</Tooltip>
                </Tooltip.Trigger>
              </Inline>
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
            {upcomingEventsData.map(event => (
              <Table.Row key={event.id}>
                <Table.Cell>{event.name}</Table.Cell>
                <Table.Cell>{event.date}</Table.Cell>
                <Table.Cell>{event.venue}</Table.Cell>
                <Table.Cell>{event.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant(event.status)}>{event.status}</Badge>
                </Table.Cell>
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
  const filtered = eventsData.filter(
    e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="bottom">
        <SearchField
          label="Search events"
          placeholder="Search by name or location..."
          value={search}
          onChange={setSearch}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="medium">
            {({ close }) => (
              <>
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
                  <Button variant="primary" onPress={close}>Create</Button>
                </Dialog.Actions>
              </>
            )}
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
          {filtered.map(event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell>{event.capacity}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(event.status)}>{event.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function AttendeesPage() {
  const [search, setSearch] = useState('');
  const filtered = attendeesData.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="bottom">
        <SearchField
          label="Search attendees"
          placeholder="Search by name or email..."
          value={search}
          onChange={setSearch}
        />
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
          {filtered.map(attendee => {
            const active = isActive(attendee.lastActive);
            return (
              <Table.Row key={attendee.id}>
                <Table.Cell>{attendee.name}</Table.Cell>
                <Table.Cell>{attendee.email}</Table.Cell>
                <Table.Cell>{attendee.eventsAttended}</Table.Cell>
                <Table.Cell>{attendee.lastActive}</Table.Cell>
                <Table.Cell>
                  <Badge variant={active ? 'success' : 'warning'}>
                    {active ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function ReportsPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Reports</Headline>
      <Tabs aria-label="Reports tabs">
        <Tabs.List aria-label="Report sections">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="revenue">
          <Stack space={6}>
            <Tiles space={4} tilesWidth="160px" stretch equalHeight>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>Total Revenue</Text><Headline level={2}>$45,230</Headline></Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>This Month</Text><Headline level={2}>$8,420</Headline></Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>Avg per Event</Text><Headline level={2}>$1,885</Headline></Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>Refunds</Text><Headline level={2}>$1,230</Headline></Stack>
                </Inset>
              </Card>
            </Tiles>
            <SectionMessage variant="success">
              <SectionMessage.Content>Revenue is up 12% compared to last month.</SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="attendance">
          <Stack space={6}>
            <Tiles space={4} tilesWidth="160px" stretch equalHeight>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>Total Attendees</Text><Headline level={2}>3,200</Headline></Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>Repeat Visitors</Text><Headline level={2}>890</Headline></Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>Avg per Event</Text><Headline level={2}>178</Headline></Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}><Text>No-shows</Text><Headline level={2}>145</Headline></Stack>
                </Inset>
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
                  {topAttendanceData.map(row => (
                    <Table.Row key={row.id}>
                      <Table.Cell>{row.name}</Table.Cell>
                      <Table.Cell>{row.date}</Table.Cell>
                      <Table.Cell>{row.attendees}</Table.Cell>
                      <Table.Cell>{row.capacity}</Table.Cell>
                      <Table.Cell>{row.fillRate}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="overview">
          <Stack space={4}>
            <Text>
              This report provides a comprehensive overview of EventHub's performance across all
              quarters. Use the sections below to explore quarterly summaries and identify trends
              in attendance, revenue, and engagement.
            </Text>
            <Accordion>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q1 showed strong growth with 8 events hosted and total revenue of $12,400.
                    Average attendance was 156 per event, and customer satisfaction scores
                    reached an all-time high of 4.7/5.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q2 continued the momentum with 10 events generating $18,230 in revenue.
                    The summer festival was the highest-grossing event, selling out within
                    48 hours of tickets going live.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q3 is projected to exceed Q2 with 12 events planned. Early ticket sales
                    indicate strong demand, particularly for outdoor events and workshops.
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
  const [savedGeneral, setSavedGeneral] = useState(false);
  const [savedNotif, setSavedNotif] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>
      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="general">
          <Stack space={4}>
            {savedGeneral && (
              <SectionMessage variant="success">
                <SectionMessage.Content>Settings saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Form onSubmit={e => { e.preventDefault(); setSavedGeneral(true); }}>
              <Stack space={4}>
                <TextField label="Organization Name" defaultValue="EventHub Inc." />
                <TextField label="Contact Email" type="email" defaultValue="contact@eventhub.io" />
                <Select label="Default Currency" defaultSelectedKey="usd">
                  <Select.Option id="usd">USD</Select.Option>
                  <Select.Option id="eur">EUR</Select.Option>
                  <Select.Option id="gbp">GBP</Select.Option>
                </Select>
                <Select label="Default Timezone" defaultSelectedKey="utc">
                  <Select.Option id="utc">UTC</Select.Option>
                  <Select.Option id="cet">CET</Select.Option>
                  <Select.Option id="est">EST</Select.Option>
                  <Select.Option id="pst">PST</Select.Option>
                </Select>
                <Button variant="primary" type="submit">Save Changes</Button>
              </Stack>
            </Form>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {savedNotif && (
              <SectionMessage variant="success">
                <SectionMessage.Content>Preferences saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={4}>
              <Stack space={1}>
                <Switch label="Email Notifications" selected={emailNotif} onChange={(v: boolean) => setEmailNotif(v)} />
                <Text>Receive event updates and confirmations via email.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="SMS Notifications" selected={smsNotif} onChange={(v: boolean) => setSmsNotif(v)} />
                <Text>Get text message alerts for important events.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Weekly Digest" selected={weeklyDigest} onChange={(v: boolean) => setWeeklyDigest(v)} />
                <Text>A weekly summary of your event activity and statistics.</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Marketing Emails" selected={marketingEmails} onChange={(v: boolean) => setMarketingEmails(v)} />
                <Text>Promotional offers, new features, and product updates.</Text>
              </Stack>
            </Stack>
            <Button variant="primary" onPress={() => setSavedNotif(true)}>Save Preferences</Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

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

  const handleUserMenu = (action: React.Key) => {
    if (action === 'signout') setSignOutOpen(true);
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
              <Sidebar.Item href="/help">Help & Support</Sidebar.Item>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item>EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={currentPath}>
                  {PAGE_NAMES[currentPath] ?? 'Page'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User actions">
              <Menu label="Account" onAction={handleUserMenu}>
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              {currentPath === '/dashboard' && <DashboardPage />}
              {currentPath === '/events' && <EventsPage />}
              {currentPath === '/attendees' && <AttendeesPage />}
              {currentPath === '/reports' && <ReportsPage />}
              {currentPath === '/settings' && <SettingsPage />}
              {currentPath === '/help' && (
                <Stack space={4}>
                  <Headline level={1}>Help & Support</Headline>
                  <Text>Contact our support team for assistance with your events and tickets.</Text>
                </Stack>
              )}
            </Inset>
          </AppLayout.Main>
        </AppLayout>

        <Dialog size="xsmall" open={signOutOpen} onOpenChange={setSignOutOpen}>
          {({ close }) => (
            <>
              <Dialog.Title>Sign Out</Dialog.Title>
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
      </Sidebar.Provider>
    </RouterProvider>
  );
}
