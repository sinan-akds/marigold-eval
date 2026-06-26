import { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  RouterProvider,
  Breadcrumbs,
  Menu,
  Dialog,
  Table,
  Tabs,
  Accordion,
  Badge,
  SectionMessage,
  Switch,
  Tooltip,
  Stack,
  Inline,
  Columns,
  Inset,
  Card,
  Headline,
  Text,
  Button,
  TextField,
  SearchField,
  NumberField,
  TextArea,
  Select,
  DatePicker,
} from '@marigold/components';

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

type BadgeVariant = 'success' | 'warning' | 'error' | 'default' | 'info' | 'primary';

function statusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'On Sale':
    case 'Active':
      return 'success';
    case 'Draft':
    case 'Inactive':
      return 'warning';
    case 'Sold Out':
      return 'error';
    default:
      return 'default';
  }
}

// ── Dashboard ──────────────────────────────────────────────────────────────

const upcomingEvents = [
  { event: 'Summer Music Festival', date: 'Jun 28, 2026', venue: 'Madison Square Garden', tickets: 1200, status: 'On Sale' },
  { event: 'Tech Summit 2026', date: 'Jul 5, 2026', venue: 'Javits Convention Center', tickets: 450, status: 'On Sale' },
  { event: 'Art Expo NYC', date: 'Jul 12, 2026', venue: 'Gallery District', tickets: 0, status: 'Draft' },
  { event: 'Jazz Night Out', date: 'Jul 15, 2026', venue: 'Blue Note Club', tickets: 200, status: 'Sold Out' },
  { event: 'Food & Wine Festival', date: 'Jul 22, 2026', venue: 'Central Park', tickets: 890, status: 'On Sale' },
  { event: 'Comedy Showcase', date: 'Aug 1, 2026', venue: 'Laugh Factory', tickets: 110, status: 'Draft' },
];

function DashboardPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>
      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
      </SectionMessage>
      <Columns columns={[1, 1, 1, 1]} space={4}>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={1}>
              <Text>Total Events</Text>
              <Headline level={2}>24</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={1}>
              <Text>Tickets Sold</Text>
              <Headline level={2}>1,849</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={1}>
              <Inline space={1} alignY="center">
                <Text>Revenue</Text>
                <Tooltip.Trigger>
                  <Button variant="icon" aria-label="Revenue info">ⓘ</Button>
                  <Tooltip>Net revenue after fees and refunds</Tooltip>
                </Tooltip.Trigger>
              </Inline>
              <Headline level={2}>$45,230</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card stretch>
          <Inset space="square-regular">
            <Stack space={1}>
              <Text>Upcoming</Text>
              <Headline level={2}>8</Headline>
            </Stack>
          </Inset>
        </Card>
      </Columns>
      <Headline level={2}>Upcoming Events</Headline>
      <Table aria-label="Upcoming Events">
        <Table.Header>
          <Table.Column rowHeader>Event</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Venue</Table.Column>
          <Table.Column>Tickets Sold</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {upcomingEvents.map((row, i) => (
            <Table.Row key={i}>
              <Table.Cell>{row.event}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.venue}</Table.Cell>
              <Table.Cell>{row.tickets}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// ── Events ─────────────────────────────────────────────────────────────────

const allEvents = [
  { name: 'Summer Music Festival', date: 'Jun 28, 2026', location: 'New York, NY', capacity: 5000, status: 'On Sale' },
  { name: 'Tech Summit 2026', date: 'Jul 5, 2026', location: 'New York, NY', capacity: 800, status: 'On Sale' },
  { name: 'Art Expo NYC', date: 'Jul 12, 2026', location: 'Brooklyn, NY', capacity: 300, status: 'Draft' },
  { name: 'Jazz Night Out', date: 'Jul 15, 2026', location: 'Manhattan, NY', capacity: 200, status: 'Sold Out' },
  { name: 'Food & Wine Festival', date: 'Jul 22, 2026', location: 'Central Park, NY', capacity: 2000, status: 'On Sale' },
  { name: 'Comedy Showcase', date: 'Aug 1, 2026', location: 'Los Angeles, CA', capacity: 300, status: 'Draft' },
];

function EventsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      allEvents.filter(
        e =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          aria-label="Search events"
          placeholder="Search by name or location…"
          value={search}
          onChange={setSearch}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog closeButton size="medium">
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
      <Table aria-label="Events">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((row, i) => (
            <Table.Row key={i}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.location}</Table.Cell>
              <Table.Cell>{row.capacity}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// ── Attendees ──────────────────────────────────────────────────────────────

const allAttendees = [
  { name: 'Alice Müller', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-10' },
  { name: 'Bob Schneider', email: 'bob@example.com', eventsAttended: 12, lastActive: '2026-06-20' },
  { name: 'Carol Fischer', email: 'carol@example.com', eventsAttended: 3, lastActive: '2026-05-01' },
  { name: 'David Wagner', email: 'david@example.com', eventsAttended: 8, lastActive: '2026-06-15' },
  { name: 'Eva Becker', email: 'eva@example.com', eventsAttended: 1, lastActive: '2026-04-12' },
  { name: 'Frank Richter', email: 'frank@example.com', eventsAttended: 7, lastActive: '2026-06-22' },
];

const THIRTY_DAYS_AGO = new Date('2026-06-23');
THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

function isActive(lastActive: string) {
  return new Date(lastActive) >= THIRTY_DAYS_AGO;
}

function AttendeesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      allAttendees.filter(
        a =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          aria-label="Search attendees"
          placeholder="Search by name or email…"
          value={search}
          onChange={setSearch}
        />
        <Text>{filtered.length} attendees</Text>
      </Inline>
      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((row, i) => {
            const active = isActive(row.lastActive);
            return (
              <Table.Row key={i}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>{row.eventsAttended}</Table.Cell>
                <Table.Cell>{row.lastActive}</Table.Cell>
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

// ── Reports ────────────────────────────────────────────────────────────────

const topEventsByAttendance = [
  { event: 'Summer Music Festival', date: 'Jun 28, 2026', attendees: 4800, capacity: 5000, fillRate: '96%' },
  { event: 'Food & Wine Festival', date: 'Jul 22, 2026', attendees: 1750, capacity: 2000, fillRate: '88%' },
  { event: 'Tech Summit 2026', date: 'Jul 5, 2026', attendees: 720, capacity: 800, fillRate: '90%' },
  { event: 'Jazz Night Out', date: 'Jul 15, 2026', attendees: 200, capacity: 200, fillRate: '100%' },
];

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
            <Columns columns={[1, 1, 1, 1]} space={4}>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>Total Revenue</Text>
                    <Headline level={2}>$45,230</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>This Month</Text>
                    <Headline level={2}>$8,420</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>Avg per Event</Text>
                    <Headline level={2}>$1,885</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>Refunds</Text>
                    <Headline level={2}>$1,230</Headline>
                  </Stack>
                </Inset>
              </Card>
            </Columns>
            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue trending up</SectionMessage.Title>
              <SectionMessage.Content>Revenue is up 12% compared to last month.</SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={6}>
            <Columns columns={[1, 1, 1, 1]} space={4}>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>Total Attendees</Text>
                    <Headline level={2}>3,200</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>Repeat Visitors</Text>
                    <Headline level={2}>890</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>Avg per Event</Text>
                    <Headline level={2}>178</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card stretch>
                <Inset space="square-regular">
                  <Stack space={1}>
                    <Text>No-shows</Text>
                    <Headline level={2}>145</Headline>
                  </Stack>
                </Inset>
              </Card>
            </Columns>
            <Headline level={2}>Top Events by Attendance</Headline>
            <Table aria-label="Top Events by Attendance">
              <Table.Header>
                <Table.Column rowHeader>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Attendees</Table.Column>
                <Table.Column>Capacity</Table.Column>
                <Table.Column>Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body>
                {topEventsByAttendance.map((row, i) => (
                  <Table.Row key={i}>
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
              EventHub has hosted 24 events across multiple venues this year. Revenue is up 12% month-over-month,
              with a total of 3,200 attendees and a strong repeat-visitor rate of 28%. Upcoming capacity is solid,
              with 8 events scheduled and average fill rates above 88%.
            </Text>
            <Accordion>
              <Accordion.Item id="q1">
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  Q1 saw 6 events with a combined attendance of 820 and total revenue of $12,400.
                  The Winter Gala and New Year Kickoff were the top performers, each selling out within two weeks.
                  Repeat visitor rate reached 22%, up from 15% in the prior year.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q2">
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 delivered 9 events and $18,600 in revenue, driven by the Spring Music Series.
                  Average ticket price rose to $42, and the no-show rate dropped to 4.2%.
                  Three new venue partnerships were established in Q2, expanding capacity options.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="q3">
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  Q3 is on track for 9 events with projected revenue of $14,230.
                  Summer Music Festival alone accounts for 34% of projected Q3 revenue.
                  Attendee satisfaction scores averaged 4.6 out of 5 based on post-event surveys.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────

function SettingsPage() {
  const [orgName, setOrgName] = useState('Acme Events GmbH');
  const [contactEmail, setContactEmail] = useState('admin@acmeevents.com');
  const [currency, setCurrency] = useState('usd');
  const [timezone, setTimezone] = useState('cet');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

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
            {settingsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Settings saved successfully.</SectionMessage.Content>
              </SectionMessage>
            )}
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
              <Select.Option id="usd">USD</Select.Option>
              <Select.Option id="eur">EUR</Select.Option>
              <Select.Option id="gbp">GBP</Select.Option>
            </Select>
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={key => setTimezone(String(key))}
            >
              <Select.Option id="utc">UTC</Select.Option>
              <Select.Option id="cet">CET</Select.Option>
              <Select.Option id="est">EST</Select.Option>
              <Select.Option id="pst">PST</Select.Option>
            </Select>
            <Button
              variant="primary"
              onPress={() => {
                setSettingsSaved(true);
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {prefsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>Notification preferences saved.</SectionMessage.Content>
              </SectionMessage>
            )}
            <Stack space={2}>
              <Switch
                label="Email Notifications"
                selected={emailNotifs}
                onChange={setEmailNotifs}
              />
              <Text>Receive event updates and reminders via email.</Text>
            </Stack>
            <Stack space={2}>
              <Switch
                label="SMS Notifications"
                selected={smsNotifs}
                onChange={setSmsNotifs}
              />
              <Text>Get time-sensitive alerts sent directly to your phone.</Text>
            </Stack>
            <Stack space={2}>
              <Switch
                label="Weekly Digest"
                selected={weeklyDigest}
                onChange={setWeeklyDigest}
              />
              <Text>A weekly summary of event performance and key metrics.</Text>
            </Stack>
            <Stack space={2}>
              <Switch
                label="Marketing Emails"
                selected={marketingEmails}
                onChange={setMarketingEmails}
              />
              <Text>Product updates, tips, and promotional offers from EventHub.</Text>
            </Stack>
            <Button
              variant="primary"
              onPress={() => {
                setPrefsSaved(true);
              }}
            >
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────

export default function TestApp() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const pageLabel = PAGE_LABELS[currentPath] ?? 'Dashboard';

  function renderPage() {
    switch (currentPath) {
      case '/dashboard': return <DashboardPage />;
      case '/events': return <EventsPage />;
      case '/attendees': return <AttendeesPage />;
      case '/reports': return <ReportsPage />;
      case '/settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  }

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
            <TopNavigation.Middle aria-label="Breadcrumb navigation">
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={currentPath}>{pageLabel}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User menu">
              <Menu
                label="My Account"
                onAction={key => {
                  if (key === 'signout') setSignOutOpen(true);
                }}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space="square-regular">
              {renderPage()}
            </Inset>
          </AppLayout.Main>
        </AppLayout>

        <Dialog
          open={signOutOpen}
          onOpenChange={setSignOutOpen}
          closeButton
          size="xsmall"
        >
          {({ close }: { close: () => void }) => (
            <>
              <Dialog.Title>Sign out</Dialog.Title>
              <Dialog.Content>
                Are you sure you want to sign out?
              </Dialog.Content>
              <Dialog.Actions>
                <Button variant="secondary" slot="close">Cancel</Button>
                <Button variant="destructive" onPress={close}>Sign out</Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Sidebar.Provider>
    </RouterProvider>
  );
}
