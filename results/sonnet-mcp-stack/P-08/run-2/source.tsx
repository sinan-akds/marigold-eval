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
  Divider,
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
  Tooltip,
  TopNavigation,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

const PAGE_LABELS: Record<Page, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  attendees: 'Attendees',
  reports: 'Reports',
  settings: 'Settings',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Four equal columns */
const FourCols = ({ children }: { children: React.ReactNode }) => {
  const items = Array.isArray(children) ? children : [children];
  const cols = items.map(() => 1 as number | 'fit');
  return (
    <Columns columns={cols} space={4}>
      {children}
    </Columns>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'On Sale') return <Badge variant="success">On Sale</Badge>;
  if (status === 'Sold Out') return <Badge variant="error">Sold Out</Badge>;
  if (status === 'Draft') return <Badge variant="warning">Draft</Badge>;
  return <Badge>{status}</Badge>;
};

// 30 days before 2026-06-23 = 2026-05-24
const isActive = (lastActiveDate: string) =>
  new Date(lastActiveDate) >= new Date('2026-05-24');

// ─── Data ─────────────────────────────────────────────────────────────────────

const upcomingEventsData = [
  { id: '1', event: 'Summer Music Fest',   date: 'Jul 14, 2026', venue: 'Central Park',      tickets: 450, status: 'On Sale'  },
  { id: '2', event: 'Tech Summit 2026',    date: 'Jul 20, 2026', venue: 'Convention Center', tickets: 320, status: 'On Sale'  },
  { id: '3', event: 'Art Expo Berlin',     date: 'Jul 28, 2026', venue: 'Gallery Hall',      tickets: 200, status: 'Sold Out' },
  { id: '4', event: 'Comedy Night',        date: 'Aug 3, 2026',  venue: 'The Laugh Factory', tickets: 95,  status: 'Draft'    },
  { id: '5', event: 'Jazz in the Park',    date: 'Aug 10, 2026', venue: 'Riverside Park',    tickets: 260, status: 'On Sale'  },
  { id: '6', event: 'Food & Wine Festival',date: 'Aug 17, 2026', venue: 'Downtown Square',   tickets: 544, status: 'Sold Out' },
];

const allEventsData = [
  { id: '1', name: 'Summer Music Fest',    date: 'Jul 14, 2026', location: 'Central Park, NYC',          capacity: 500, status: 'On Sale'  },
  { id: '2', name: 'Tech Summit 2026',     date: 'Jul 20, 2026', location: 'Convention Center, SF',       capacity: 400, status: 'On Sale'  },
  { id: '3', name: 'Art Expo Berlin',      date: 'Jul 28, 2026', location: 'Gallery Hall, Berlin',        capacity: 200, status: 'Sold Out' },
  { id: '4', name: 'Comedy Night',         date: 'Aug 3, 2026',  location: 'The Laugh Factory, LA',       capacity: 150, status: 'Draft'    },
  { id: '5', name: 'Jazz in the Park',     date: 'Aug 10, 2026', location: 'Riverside Park, Chicago',     capacity: 300, status: 'On Sale'  },
  { id: '6', name: 'Food & Wine Festival', date: 'Aug 17, 2026', location: 'Downtown Square, Austin',     capacity: 600, status: 'Sold Out' },
];

const attendeesData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', events: 5,  lastActive: '2026-06-15' },
  { id: '2', name: 'Bob Smith',     email: 'bob@example.com',   events: 3,  lastActive: '2026-06-20' },
  { id: '3', name: 'Carol White',   email: 'carol@example.com', events: 8,  lastActive: '2026-05-10' },
  { id: '4', name: 'David Brown',   email: 'david@example.com', events: 1,  lastActive: '2026-06-22' },
  { id: '5', name: 'Emma Davis',    email: 'emma@example.com',  events: 12, lastActive: '2026-04-30' },
  { id: '6', name: 'Frank Wilson',  email: 'frank@example.com', events: 4,  lastActive: '2026-06-18' },
];

const topEventsData = [
  { id: '1', event: 'Summer Music Fest',    date: 'Jul 14, 2026', attendees: 450, capacity: 500, fillRate: '90%'  },
  { id: '2', event: 'Tech Summit 2026',     date: 'Jul 20, 2026', attendees: 320, capacity: 400, fillRate: '80%'  },
  { id: '3', event: 'Food & Wine Festival', date: 'Aug 17, 2026', attendees: 544, capacity: 600, fillRate: '91%'  },
  { id: '4', event: 'Art Expo Berlin',      date: 'Jul 28, 2026', attendees: 200, capacity: 200, fillRate: '100%' },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

const DashboardPage = () => (
  <Stack space={6}>
    <Headline level={2}>Dashboard Overview</Headline>
    <SectionMessage variant="info">
      <SectionMessage.Title>Welcome back!</SectionMessage.Title>
      <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
    </SectionMessage>
    <FourCols>
      <Card>
        <Stack space={2}>
          <Text>Total Events</Text>
          <Headline level={3}>24</Headline>
        </Stack>
      </Card>
      <Card>
        <Stack space={2}>
          <Text>Tickets Sold</Text>
          <Headline level={3}>1,849</Headline>
        </Stack>
      </Card>
      <Card>
        <Stack space={2}>
          <Inline alignX="between" alignY="center">
            <Text>Revenue</Text>
            <Tooltip.Trigger>
              <Button variant="icon" aria-label="Revenue details">ⓘ</Button>
              <Tooltip>Net revenue after fees and refunds</Tooltip>
            </Tooltip.Trigger>
          </Inline>
          <Headline level={3}>$45,230</Headline>
        </Stack>
      </Card>
      <Card>
        <Stack space={2}>
          <Text>Upcoming</Text>
          <Headline level={3}>8</Headline>
        </Stack>
      </Card>
    </FourCols>
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
          {upcomingEventsData.map(row => (
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

// ─── Events ───────────────────────────────────────────────────────────────────

interface EventsPageProps {
  search: string;
  onSearch: (v: string) => void;
}

const EventsPage = ({ search, onSearch }: EventsPageProps) => {
  const filtered = allEventsData.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={2}>Events</Headline>
      <Inline alignY="end" space={4}>
        <SearchField
          label="Search events"
          value={search}
          onChange={onSearch}
          placeholder="Search by name or location…"
          width={80}
        />
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
              <Table.Cell>{row.capacity}</Table.Cell>
              <Table.Cell><StatusBadge status={row.status} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

// ─── Attendees ────────────────────────────────────────────────────────────────

interface AttendeesPageProps {
  search: string;
  onSearch: (v: string) => void;
}

const AttendeesPage = ({ search, onSearch }: AttendeesPageProps) => {
  const filtered = attendeesData.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Headline level={2}>Attendees</Headline>
      <Inline alignY="end" space={4}>
        <SearchField
          label="Search attendees"
          value={search}
          onChange={onSearch}
          placeholder="Search by name or email…"
          width={80}
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
          {filtered.map(a => (
            <Table.Row key={a.id}>
              <Table.Cell>{a.name}</Table.Cell>
              <Table.Cell>{a.email}</Table.Cell>
              <Table.Cell>{a.events}</Table.Cell>
              <Table.Cell>{a.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={isActive(a.lastActive) ? 'success' : 'warning'}>
                  {isActive(a.lastActive) ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

// ─── Reports ──────────────────────────────────────────────────────────────────

const ReportsPage = () => (
  <Stack space={6}>
    <Headline level={2}>Reports</Headline>
    <Tabs>
      <Tabs.List aria-label="Report views">
        <Tabs.Item id="revenue">Revenue</Tabs.Item>
        <Tabs.Item id="attendance">Attendance</Tabs.Item>
        <Tabs.Item id="overview">Overview</Tabs.Item>
      </Tabs.List>

      <Tabs.TabPanel id="revenue">
        <Stack space={6}>
          <FourCols>
            <Card>
              <Stack space={2}><Text>Total Revenue</Text><Headline level={3}>$45,230</Headline></Stack>
            </Card>
            <Card>
              <Stack space={2}><Text>This Month</Text><Headline level={3}>$8,420</Headline></Stack>
            </Card>
            <Card>
              <Stack space={2}><Text>Average per Event</Text><Headline level={3}>$1,885</Headline></Stack>
            </Card>
            <Card>
              <Stack space={2}><Text>Refunds</Text><Headline level={3}>$1,230</Headline></Stack>
            </Card>
          </FourCols>
          <SectionMessage variant="success">
            <SectionMessage.Content>Revenue is up 12% compared to last month.</SectionMessage.Content>
          </SectionMessage>
        </Stack>
      </Tabs.TabPanel>

      <Tabs.TabPanel id="attendance">
        <Stack space={6}>
          <FourCols>
            <Card>
              <Stack space={2}><Text>Total Attendees</Text><Headline level={3}>3,200</Headline></Stack>
            </Card>
            <Card>
              <Stack space={2}><Text>Repeat Visitors</Text><Headline level={3}>890</Headline></Stack>
            </Card>
            <Card>
              <Stack space={2}><Text>Average per Event</Text><Headline level={3}>178</Headline></Stack>
            </Card>
            <Card>
              <Stack space={2}><Text>No-shows</Text><Headline level={3}>145</Headline></Stack>
            </Card>
          </FourCols>
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
                {topEventsData.map(row => (
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
        </Stack>
      </Tabs.TabPanel>

      <Tabs.TabPanel id="overview">
        <Stack space={4}>
          <Text>
            This report provides a quarterly summary of EventHub performance,
            covering revenue trends, attendee growth, and key outcomes across
            all managed events.
          </Text>
          <Accordion allowsMultipleExpanded>
            <Accordion.Item id="q1">
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q1 2026 saw strong growth with 8 events hosted, generating
                  $14,200 in revenue. Attendance averaged 165 per event, with
                  a 92% customer satisfaction rating. New venue partnerships
                  were established in Chicago and Austin.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q2">
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q2 2026 continued the upward trajectory with 10 events and
                  $18,600 in revenue. The Summer Music Fest was the standout
                  event, achieving 90% capacity fill. Digital ticket sales
                  grew by 34% compared to Q1.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q3">
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q3 2026 projections indicate 12 events with an estimated
                  $22,000 in revenue. The Food & Wine Festival and Tech Summit
                  are expected to drive the highest attendance figures for
                  the year.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

// ─── Settings ─────────────────────────────────────────────────────────────────

interface NotifSwitchProps {
  label: string;
  description: string;
  selected: boolean;
  onChange: (v: boolean) => void;
}

const NotifSwitch = ({ label, description, selected, onChange }: NotifSwitchProps) => (
  <Stack space={1}>
    <Switch label={label} selected={selected} onChange={onChange} />
    <Text>{description}</Text>
  </Stack>
);

interface SettingsPageProps {
  generalSaved: boolean;
  onSaveGeneral: () => void;
  notifSaved: boolean;
  onSaveNotif: () => void;
  emailNotif: boolean;
  onEmailNotif: (v: boolean) => void;
  smsNotif: boolean;
  onSmsNotif: (v: boolean) => void;
  weeklyDigest: boolean;
  onWeeklyDigest: (v: boolean) => void;
  marketingEmails: boolean;
  onMarketingEmails: (v: boolean) => void;
}

const SettingsPage = ({
  generalSaved,
  onSaveGeneral,
  notifSaved,
  onSaveNotif,
  emailNotif,
  onEmailNotif,
  smsNotif,
  onSmsNotif,
  weeklyDigest,
  onWeeklyDigest,
  marketingEmails,
  onMarketingEmails,
}: SettingsPageProps) => (
  <Stack space={6}>
    <Headline level={2}>Settings</Headline>
    <Tabs>
      <Tabs.List aria-label="Settings sections">
        <Tabs.Item id="general">General</Tabs.Item>
        <Tabs.Item id="notifications">Notifications</Tabs.Item>
      </Tabs.List>

      <Tabs.TabPanel id="general">
        <Stack space={6}>
          {generalSaved && (
            <SectionMessage variant="success">
              <SectionMessage.Content>Settings saved successfully.</SectionMessage.Content>
            </SectionMessage>
          )}
          <Stack space={4}>
            <TextField label="Organization Name" defaultValue="EventHub Inc." />
            <TextField label="Contact Email" type="email" defaultValue="admin@eventhub.com" />
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
          </Stack>
          <Inline>
            <Button variant="primary" onPress={onSaveGeneral}>Save Changes</Button>
          </Inline>
        </Stack>
      </Tabs.TabPanel>

      <Tabs.TabPanel id="notifications">
        <Stack space={6}>
          {notifSaved && (
            <SectionMessage variant="success">
              <SectionMessage.Content>Preferences saved successfully.</SectionMessage.Content>
            </SectionMessage>
          )}
          <Stack space={5}>
            <NotifSwitch
              label="Email Notifications"
              description="Receive event updates and reminders via email."
              selected={emailNotif}
              onChange={onEmailNotif}
            />
            <NotifSwitch
              label="SMS Notifications"
              description="Get text message alerts for urgent updates."
              selected={smsNotif}
              onChange={onSmsNotif}
            />
            <NotifSwitch
              label="Weekly Digest"
              description="A weekly summary of events and performance metrics."
              selected={weeklyDigest}
              onChange={onWeeklyDigest}
            />
            <NotifSwitch
              label="Marketing Emails"
              description="Promotional content and feature announcements."
              selected={marketingEmails}
              onChange={onMarketingEmails}
            />
          </Stack>
          <Inline>
            <Button variant="primary" onPress={onSaveNotif}>Save Preferences</Button>
          </Inline>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

// ─── App shell ────────────────────────────────────────────────────────────────

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [eventsSearch, setEventsSearch] = useState('');
  const [attendeesSearch, setAttendeesSearch] = useState('');
  const [generalSaved, setGeneralSaved] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const navigate = (path: string) => {
    const page = path.replace(/^\//, '') as Page;
    if (['dashboard', 'events', 'attendees', 'reports', 'settings'].includes(page)) {
      setCurrentPage(page);
    }
  };

  const handleMenuAction = (key: React.Key) => {
    if (key === 'signout') setSignOutOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'events':
        return <EventsPage search={eventsSearch} onSearch={setEventsSearch} />;
      case 'attendees':
        return <AttendeesPage search={attendeesSearch} onSearch={setAttendeesSearch} />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return (
          <SettingsPage
            generalSaved={generalSaved}
            onSaveGeneral={() => setGeneralSaved(true)}
            notifSaved={notifSaved}
            onSaveNotif={() => setNotifSaved(true)}
            emailNotif={emailNotif}
            onEmailNotif={setEmailNotif}
            smsNotif={smsNotif}
            onSmsNotif={setSmsNotif}
            weeklyDigest={weeklyDigest}
            onWeeklyDigest={setWeeklyDigest}
            marketingEmails={marketingEmails}
            onMarketingEmails={setMarketingEmails}
          />
        );
    }
  };

  const current = `/${currentPage}`;

  return (
    <RouterProvider navigate={navigate}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>

          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">EventHub</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={current}>
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
                <Breadcrumbs.Item href={current}>
                  {PAGE_LABELS[currentPage]}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu label="Account" onAction={handleMenuAction}>
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
      </Sidebar.Provider>

      {/* Sign-out confirmation (controlled dialog outside AppLayout so it always overlays) */}
      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen} size="small">
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
    </RouterProvider>
  );
};

export default TestApp;
