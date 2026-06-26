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

const upcomingEventsData = [
  { id: '1', event: 'Summer Jazz Festival', date: '2026-07-15', venue: 'Central Park', ticketsSold: 312, status: 'On Sale' },
  { id: '2', event: 'Tech Conference 2026', date: '2026-07-18', venue: 'Convention Center', ticketsSold: 480, status: 'Sold Out' },
  { id: '3', event: 'Rock Night Live', date: '2026-07-20', venue: 'Stadium Arena', ticketsSold: 95, status: 'Draft' },
  { id: '4', event: 'Food & Wine Expo', date: '2026-07-22', venue: 'Exhibition Hall', ticketsSold: 220, status: 'On Sale' },
  { id: '5', event: 'Ballet Gala', date: '2026-07-25', venue: 'Opera House', ticketsSold: 150, status: 'On Sale' },
  { id: '6', event: 'Comedy Night', date: '2026-07-28', venue: 'Club Venue', ticketsSold: 80, status: 'Draft' },
];

const eventsListData = [
  { id: '1', name: 'Summer Jazz Festival', date: '2026-07-15', location: 'Central Park, NY', capacity: 400, status: 'On Sale' },
  { id: '2', name: 'Tech Conference 2026', date: '2026-07-18', location: 'Convention Center, SF', capacity: 500, status: 'Sold Out' },
  { id: '3', name: 'Rock Night Live', date: '2026-07-20', location: 'Stadium Arena, LA', capacity: 2000, status: 'Draft' },
  { id: '4', name: 'Food & Wine Expo', date: '2026-07-22', location: 'Exhibition Hall, Chicago', capacity: 300, status: 'On Sale' },
  { id: '5', name: 'Ballet Gala', date: '2026-07-25', location: 'Opera House, Boston', capacity: 200, status: 'On Sale' },
  { id: '6', name: 'Comedy Night', date: '2026-07-28', location: 'Club Venue, Austin', capacity: 150, status: 'Draft' },
];

const attendeesListData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2026-06-18' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-05-10' },
  { id: '4', name: 'David Brown', email: 'david@example.com', eventsAttended: 2, lastActive: '2026-06-22' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', eventsAttended: 12, lastActive: '2026-04-05' },
  { id: '6', name: 'Frank Lee', email: 'frank@example.com', eventsAttended: 1, lastActive: '2026-06-15' },
];

const topAttendanceData = [
  { id: '1', event: 'Tech Conference 2026', date: '2026-07-18', attendees: 480, capacity: 500, fillRate: '96%' },
  { id: '2', event: 'Summer Jazz Festival', date: '2026-07-15', attendees: 312, capacity: 400, fillRate: '78%' },
  { id: '3', event: 'Food & Wine Expo', date: '2026-07-22', attendees: 220, capacity: 300, fillRate: '73%' },
  { id: '4', event: 'Ballet Gala', date: '2026-07-25', attendees: 150, capacity: 200, fillRate: '75%' },
];

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  'On Sale': 'success',
  'Draft': 'warning',
  'Sold Out': 'error',
};

function StatusBadge({ status }: { status: string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? 'default'}>{status}</Badge>;
}

const NOW = new Date('2026-06-25');
const THIRTY_DAYS_AGO = new Date(NOW.getTime() - 30 * 24 * 60 * 60 * 1000);

function isRecentlyActive(dateStr: string) {
  return new Date(dateStr) >= THIRTY_DAYS_AGO;
}

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

function DashboardPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>
      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
      </SectionMessage>
      <Tiles tilesWidth="160px" space={4} stretch equalHeight>
        <Card p={4}>
          <Stack space={2}>
            <Text color="foreground-muted">Total Events</Text>
            <Headline level={2}>24</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text color="foreground-muted">Tickets Sold</Text>
            <Headline level={2}>1,849</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Inline alignY="center" space={2}>
              <Text color="foreground-muted">Revenue</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" aria-label="Revenue details">ⓘ</Button>
                <Tooltip>Net revenue after fees and refunds</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={2}>$45,230</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text color="foreground-muted">Upcoming</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
      </Tiles>
      <Headline level={2}>Upcoming Events</Headline>
      <div style={{ overflowX: 'auto' }}>
        <Table aria-label="Upcoming Events" selectionMode="single">
          <Table.Header>
            <Table.Column rowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEventsData.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.event}</Table.Cell>
                <Table.Cell>{row.date}</Table.Cell>
                <Table.Cell>{row.venue}</Table.Cell>
                <Table.Cell>{row.ticketsSold}</Table.Cell>
                <Table.Cell><StatusBadge status={row.status} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Stack>
  );
}

function EventsPage() {
  const [search, setSearch] = useState('');
  const filtered = eventsListData.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={4}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="center">
        <SearchField label="Search events" value={search} onChange={setSearch} />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="medium" closeButton>
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
      <div style={{ overflowX: 'auto' }}>
        <Table aria-label="Events" selectionMode="single">
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
      </div>
    </Stack>
  );
}

function AttendeesPage() {
  const [search, setSearch] = useState('');
  const filtered = attendeesListData.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={4}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="center">
        <SearchField label="Search attendees" value={search} onChange={setSearch} />
        <Text>{filtered.length} attendees</Text>
      </Inline>
      <div style={{ overflowX: 'auto' }}>
        <Table aria-label="Attendees" selectionMode="single">
          <Table.Header>
            <Table.Column rowHeader>Name</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Events Attended</Table.Column>
            <Table.Column>Last Active</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {filtered.map(a => {
              const active = isRecentlyActive(a.lastActive);
              return (
                <Table.Row key={a.id}>
                  <Table.Cell>{a.name}</Table.Cell>
                  <Table.Cell>{a.email}</Table.Cell>
                  <Table.Cell>{a.eventsAttended}</Table.Cell>
                  <Table.Cell>{a.lastActive}</Table.Cell>
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
      </div>
    </Stack>
  );
}

function ReportsPage() {
  return (
    <Stack space={4}>
      <Headline level={1}>Reports</Headline>
      <Tabs aria-label="Reports">
        <Tabs.List aria-label="Report categories">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Tiles tilesWidth="160px" space={4} stretch equalHeight>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">Total Revenue</Text>
                  <Headline level={2}>$45,230</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">This Month</Text>
                  <Headline level={2}>$8,420</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">Average per Event</Text>
                  <Headline level={2}>$1,885</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">Refunds</Text>
                  <Headline level={2}>$1,230</Headline>
                </Stack>
              </Card>
            </Tiles>
            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue trend</SectionMessage.Title>
              <SectionMessage.Content>Revenue is up 12% compared to last month.</SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Tiles tilesWidth="160px" space={4} stretch equalHeight>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">Total Attendees</Text>
                  <Headline level={2}>3,200</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">Repeat Visitors</Text>
                  <Headline level={2}>890</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">Average per Event</Text>
                  <Headline level={2}>178</Headline>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space={2}>
                  <Text color="foreground-muted">No-shows</Text>
                  <Headline level={2}>145</Headline>
                </Stack>
              </Card>
            </Tiles>
            <Headline level={2}>Top Events by Attendance</Headline>
            <div style={{ overflowX: 'auto' }}>
              <Table aria-label="Top Events by Attendance" selectionMode="single">
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
                      <Table.Cell>{row.attendees}</Table.Cell>
                      <Table.Cell>{row.capacity}</Table.Cell>
                      <Table.Cell>{row.fillRate}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="overview">
          <Stack space={4}>
            <Text>
              EventHub has delivered strong performance across all metrics this quarter.
              Revenue growth continues to outpace targets, with strong attendance figures
              driving consistent results across all event categories.
            </Text>
            <Accordion allowsMultipleExpanded>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q1 delivered record ticket sales with 12 events generating $14,200 in net
                    revenue. Average attendance was 156 per event with a 78% overall fill rate.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q2 continued strong growth with 15 events and $18,600 in revenue. The Summer
                    Jazz Festival was the top performer with 98% capacity utilization.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q3 is on track to exceed targets with 8 events planned. Early ticket sales
                    show strong demand for upcoming festivals and industry conferences.
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
    <Stack space={4}>
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
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Settings saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <TextField label="Organization Name" defaultValue="EventHub Inc." />
            <TextField label="Contact Email" type="email" defaultValue="admin@eventhub.io" />
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
            <Button variant="primary" onPress={() => setGeneralSaved(true)}>
              Save Changes
            </Button>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {notifSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Preferences saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={3}>
              <Stack space={1}>
                <Switch
                  label="Email Notifications"
                  selected={emailNotif}
                  onChange={setEmailNotif}
                />
                <Text color="foreground-muted">Receive email notifications for events and updates</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="SMS Notifications"
                  selected={smsNotif}
                  onChange={setSmsNotif}
                />
                <Text color="foreground-muted">Receive SMS alerts for urgent event updates</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Weekly Digest"
                  selected={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <Text color="foreground-muted">Get a weekly summary of your events and performance</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Marketing Emails"
                  selected={marketingEmails}
                  onChange={setMarketingEmails}
                />
                <Text color="foreground-muted">Receive promotional content and product announcements</Text>
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

const TestApp = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const pageTitle = PAGE_TITLES[currentPath] ?? 'Dashboard';

  return (
    <RouterProvider navigate={setCurrentPath}>
      <Sidebar.Provider>
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
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={undefined as unknown as string}>{pageTitle}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu
                label="Account"
                onAction={key => {
                  if (key === 'sign-out') setSignOutOpen(true);
                }}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="sign-out">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space="square-regular">
              {currentPath === '/dashboard' && <DashboardPage />}
              {currentPath === '/events' && <EventsPage />}
              {currentPath === '/attendees' && <AttendeesPage />}
              {currentPath === '/reports' && <ReportsPage />}
              {currentPath === '/settings' && <SettingsPage />}
              {currentPath === '/help' && (
                <Stack space={4}>
                  <Headline level={1}>Help & Support</Headline>
                  <Text>Contact us at support@eventhub.io for assistance.</Text>
                </Stack>
              )}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      <Dialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        size="xsmall"
        closeButton
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
    </RouterProvider>
  );
};

export default TestApp;