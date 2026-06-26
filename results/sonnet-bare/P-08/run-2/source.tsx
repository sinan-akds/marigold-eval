import { useState } from 'react';
import {
  Stack,
  Inline,
  Text,
  Heading,
  Button,
  TextField,
  Select,
  Textarea,
  Switch,
  Dialog,
  Table,
  Column,
  Row,
  Cell,
  TableBody,
  Badge,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  Divider,
  DatePicker,
  Breadcrumbs,
  Item,
  Menu,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
  Message,
  Disclosure,
} from '@marigold/components';

// ─── Data ─────────────────────────────────────────────────────────────────────

const upcomingEvents = [
  { id: 1, event: 'Tech Summit 2026', date: '2026-06-25', venue: 'Convention Center', tickets: 320, status: 'On Sale' },
  { id: 2, event: 'Music Festival', date: '2026-06-27', venue: 'City Park', tickets: 800, status: 'Sold Out' },
  { id: 3, event: 'Startup Meetup', date: '2026-06-28', venue: 'Innovation Hub', tickets: 95, status: 'On Sale' },
  { id: 4, event: 'Design Conference', date: '2026-06-29', venue: 'Art Gallery', tickets: 150, status: 'Draft' },
  { id: 5, event: 'Hackathon', date: '2026-07-01', venue: 'Tech Campus', tickets: 200, status: 'On Sale' },
  { id: 6, event: 'Product Launch', date: '2026-07-03', venue: 'Hotel Ballroom', tickets: 0, status: 'Draft' },
];

const allEvents = [
  { id: 1, name: 'Tech Summit 2026', date: '2026-06-25', location: 'Berlin', capacity: 500, status: 'On Sale' },
  { id: 2, name: 'Music Festival', date: '2026-06-27', location: 'Munich', capacity: 2000, status: 'Sold Out' },
  { id: 3, name: 'Startup Meetup', date: '2026-06-28', location: 'Hamburg', capacity: 120, status: 'On Sale' },
  { id: 4, name: 'Design Conference', date: '2026-06-29', location: 'Frankfurt', capacity: 300, status: 'Draft' },
  { id: 5, name: 'Hackathon', date: '2026-07-01', location: 'Berlin', capacity: 250, status: 'On Sale' },
  { id: 6, name: 'Product Launch', date: '2026-07-03', location: 'Cologne', capacity: 180, status: 'Draft' },
];

const attendees = [
  { id: 1, name: 'Alice Müller', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20' },
  { id: 2, name: 'Bob Schmidt', email: 'bob@example.com', eventsAttended: 2, lastActive: '2026-05-10' },
  { id: 3, name: 'Clara Becker', email: 'clara@example.com', eventsAttended: 8, lastActive: '2026-06-18' },
  { id: 4, name: 'David Wagner', email: 'david@example.com', eventsAttended: 1, lastActive: '2026-04-01' },
  { id: 5, name: 'Emma Fischer', email: 'emma@example.com', eventsAttended: 4, lastActive: '2026-06-22' },
  { id: 6, name: 'Felix Braun', email: 'felix@example.com', eventsAttended: 3, lastActive: '2026-03-15' },
];

const topEvents = [
  { event: 'Music Festival', date: '2026-06-27', attendees: 1850, capacity: 2000, fillRate: '93%' },
  { event: 'Tech Summit 2026', date: '2026-06-25', attendees: 480, capacity: 500, fillRate: '96%' },
  { event: 'Hackathon', date: '2026-07-01', attendees: 220, capacity: 250, fillRate: '88%' },
  { event: 'Startup Meetup', date: '2026-06-28', attendees: 110, capacity: 120, fillRate: '92%' },
];

const isActive = (lastActive: string) => {
  const d = new Date(lastActive);
  const now = new Date('2026-06-22');
  return (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 30;
};

const statusVariant = (status: string) => {
  if (status === 'On Sale') return 'success' as const;
  if (status === 'Sold Out') return 'error' as const;
  return 'warning' as const;
};

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) => {
  const inner = (
    <Stack space={2}>
      <Text>{label}</Text>
      <Heading level={3}>{value}</Heading>
    </Stack>
  );

  const wrapped = (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, minWidth: 140 }}>
      {inner}
    </div>
  );

  if (tooltip) {
    return (
      <TooltipTrigger>
        {wrapped}
        <Tooltip>{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  }
  return wrapped;
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const DashboardPage = () => (
  <Stack space={6}>
    <Heading level={1}>Dashboard Overview</Heading>
    <Message variant="info">Welcome back! You have 3 events starting this week.</Message>
    <Inline space={4}>
      <SummaryCard label="Total Events" value="24" />
      <SummaryCard label="Tickets Sold" value="1,849" />
      <SummaryCard label="Revenue" value="$45,230" tooltip="Net revenue after fees and refunds" />
      <SummaryCard label="Upcoming" value="8" />
    </Inline>
    <Heading level={2}>Upcoming Events</Heading>
    <Table aria-label="Upcoming Events">
      <Column>Event</Column>
      <Column>Date</Column>
      <Column>Venue</Column>
      <Column>Tickets Sold</Column>
      <Column>Status</Column>
      <TableBody>
        {upcomingEvents.map(row => (
          <Row key={row.id}>
            <Cell>{row.event}</Cell>
            <Cell>{row.date}</Cell>
            <Cell>{row.venue}</Cell>
            <Cell>{row.tickets}</Cell>
            <Cell>
              <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  </Stack>
);

// ─── Events ───────────────────────────────────────────────────────────────────

const EventsPage = () => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');

  const filtered = allEvents.filter(
    e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setOpen(false);
    setEventName('');
    setLocation('');
    setCapacity('');
    setDescription('');
  };

  return (
    <Stack space={6}>
      <Heading level={1}>Events</Heading>
      <Inline space={4}>
        <TextField
          label="Search"
          placeholder="Search by name or location"
          value={search}
          onChange={setSearch}
        />
        <Button variant="primary" onPress={() => setOpen(true)}>
          Create Event
        </Button>
      </Inline>
      <Table aria-label="Events">
        <Column>Name</Column>
        <Column>Date</Column>
        <Column>Location</Column>
        <Column>Capacity</Column>
        <Column>Status</Column>
        <TableBody>
          {filtered.map(row => (
            <Row key={row.id}>
              <Cell>{row.name}</Cell>
              <Cell>{row.date}</Cell>
              <Cell>{row.location}</Cell>
              <Cell>{row.capacity}</Cell>
              <Cell>
                <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen} title="Create Event">
        <Stack space={4}>
          <TextField label="Event Name" required value={eventName} onChange={setEventName} />
          <DatePicker label="Date" />
          <TextField label="Location" value={location} onChange={setLocation} />
          <TextField label="Capacity" type="number" value={capacity} onChange={setCapacity} />
          <Textarea label="Description" value={description} onChange={setDescription} />
          <Inline space={3}>
            <Button variant="primary" onPress={handleCreate}>
              Create
            </Button>
            <Button variant="ghost" onPress={() => setOpen(false)}>
              Cancel
            </Button>
          </Inline>
        </Stack>
      </Dialog>
    </Stack>
  );
};

// ─── Attendees ────────────────────────────────────────────────────────────────

const AttendeesPage = () => {
  const [search, setSearch] = useState('');

  const filtered = attendees.filter(
    a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack space={6}>
      <Heading level={1}>Attendees</Heading>
      <Inline space={4}>
        <TextField
          label="Search"
          placeholder="Search by name or email"
          value={search}
          onChange={setSearch}
        />
        <Text>{filtered.length} attendees</Text>
      </Inline>
      <Table aria-label="Attendees">
        <Column>Name</Column>
        <Column>Email</Column>
        <Column>Events Attended</Column>
        <Column>Last Active</Column>
        <Column>Status</Column>
        <TableBody>
          {filtered.map(row => (
            <Row key={row.id}>
              <Cell>{row.name}</Cell>
              <Cell>{row.email}</Cell>
              <Cell>{row.eventsAttended}</Cell>
              <Cell>{row.lastActive}</Cell>
              <Cell>
                <Badge variant={isActive(row.lastActive) ? 'success' : 'warning'}>
                  {isActive(row.lastActive) ? 'Active' : 'Inactive'}
                </Badge>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

// ─── Reports ──────────────────────────────────────────────────────────────────

const ReportsPage = () => (
  <Stack space={6}>
    <Heading level={1}>Reports</Heading>
    <Tabs>
      <TabList>
        <Tab id="revenue">Revenue</Tab>
        <Tab id="attendance">Attendance</Tab>
        <Tab id="overview">Overview</Tab>
      </TabList>
      <TabPanel id="revenue">
        <Stack space={4}>
          <Inline space={4}>
            <SummaryCard label="Total Revenue" value="$45,230" />
            <SummaryCard label="This Month" value="$8,420" />
            <SummaryCard label="Average per Event" value="$1,885" />
            <SummaryCard label="Refunds" value="$1,230" />
          </Inline>
          <Message variant="success">Revenue is up 12% compared to last month.</Message>
        </Stack>
      </TabPanel>
      <TabPanel id="attendance">
        <Stack space={4}>
          <Inline space={4}>
            <SummaryCard label="Total Attendees" value="3,200" />
            <SummaryCard label="Repeat Visitors" value="890" />
            <SummaryCard label="Average per Event" value="178" />
            <SummaryCard label="No-shows" value="145" />
          </Inline>
          <Heading level={2}>Top Events by Attendance</Heading>
          <Table aria-label="Top Events by Attendance">
            <Column>Event</Column>
            <Column>Date</Column>
            <Column>Attendees</Column>
            <Column>Capacity</Column>
            <Column>Fill Rate</Column>
            <TableBody>
              {topEvents.map(row => (
                <Row key={row.event}>
                  <Cell>{row.event}</Cell>
                  <Cell>{row.date}</Cell>
                  <Cell>{row.attendees}</Cell>
                  <Cell>{row.capacity}</Cell>
                  <Cell>{row.fillRate}</Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </TabPanel>
      <TabPanel id="overview">
        <Stack space={4}>
          <Text>
            This report provides a quarterly summary of event performance, revenue trends, and
            attendee engagement across all managed events.
          </Text>
          <Disclosure title="Q1 Summary">
            <Text>
              Q1 saw strong growth with 8 events held across 5 cities. Total revenue reached
              $12,400 with an average fill rate of 85%.
            </Text>
          </Disclosure>
          <Disclosure title="Q2 Summary">
            <Text>
              Q2 performance exceeded targets. Revenue grew by 18% quarter-over-quarter,
              driven by two sold-out festivals and increased repeat visitor rates.
            </Text>
          </Disclosure>
          <Disclosure title="Q3 Summary">
            <Text>
              Q3 is on track with 6 events planned. Early ticket sales indicate strong demand,
              particularly for the Tech Summit and annual Design Conference.
            </Text>
          </Disclosure>
        </Stack>
      </TabPanel>
    </Tabs>
  </Stack>
);

// ─── Settings ─────────────────────────────────────────────────────────────────

const SettingsPage = () => {
  const [orgName, setOrgName] = useState('Reservix GmbH');
  const [contactEmail, setContactEmail] = useState('admin@reservix.de');
  const [currency, setCurrency] = useState('EUR');
  const [timezone, setTimezone] = useState('CET');
  const [saved, setSaved] = useState(false);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);

  return (
    <Stack space={6}>
      <Heading level={1}>Settings</Heading>
      <Tabs>
        <TabList>
          <Tab id="general">General</Tab>
          <Tab id="notifications">Notifications</Tab>
        </TabList>
        <TabPanel id="general">
          <Stack space={4}>
            <TextField label="Organization Name" value={orgName} onChange={setOrgName} />
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
              <Item key="USD">USD</Item>
              <Item key="EUR">EUR</Item>
              <Item key="GBP">GBP</Item>
            </Select>
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={key => setTimezone(String(key))}
            >
              <Item key="UTC">UTC</Item>
              <Item key="CET">CET</Item>
              <Item key="EST">EST</Item>
              <Item key="PST">PST</Item>
            </Select>
            {saved && <Message variant="success">Settings saved successfully.</Message>}
            <Button variant="primary" onPress={() => setSaved(true)}>
              Save Changes
            </Button>
          </Stack>
        </TabPanel>
        <TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={1}>
              <Switch isSelected={emailNotifs} onChange={setEmailNotifs}>
                Email Notifications
              </Switch>
              <Text size="small">Receive event updates and alerts via email.</Text>
            </Stack>
            <Stack space={1}>
              <Switch isSelected={smsNotifs} onChange={setSmsNotifs}>
                SMS Notifications
              </Switch>
              <Text size="small">Get critical alerts sent to your mobile number.</Text>
            </Stack>
            <Stack space={1}>
              <Switch isSelected={weeklyDigest} onChange={setWeeklyDigest}>
                Weekly Digest
              </Switch>
              <Text size="small">A weekly summary of your event activity.</Text>
            </Stack>
            <Stack space={1}>
              <Switch isSelected={marketing} onChange={setMarketing}>
                Marketing Emails
              </Switch>
              <Text size="small">Receive news, tips, and product announcements.</Text>
            </Stack>
            {prefSaved && <Message variant="success">Preferences saved.</Message>}
            <Button variant="primary" onPress={() => setPrefSaved(true)}>
              Save Preferences
            </Button>
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  );
};

// ─── Shell ────────────────────────────────────────────────────────────────────

type Page = 'Dashboard' | 'Events' | 'Attendees' | 'Reports' | 'Settings';

const mainNavItems: Page[] = ['Dashboard', 'Events', 'Attendees', 'Reports'];

const TestApp = () => {
  const [page, setPage] = useState<Page>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'Dashboard': return <DashboardPage />;
      case 'Events': return <EventsPage />;
      case 'Attendees': return <AttendeesPage />;
      case 'Reports': return <ReportsPage />;
      case 'Settings': return <SettingsPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          style={{
            width: 220,
            flexShrink: 0,
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            background: '#fafafa',
          }}
        >
          <div style={{ padding: '16px 16px 8px' }}>
            <Heading level={3}>EventHub</Heading>
          </div>
          <Stack space={0}>
            {mainNavItems.map(item => (
              <div
                key={item}
                style={{
                  background: page === item ? '#e0e7ff' : 'transparent',
                  borderLeft: page === item ? '3px solid #4f46e5' : '3px solid transparent',
                }}
              >
                <Button variant="ghost" onPress={() => setPage(item)}>
                  {item}
                </Button>
              </div>
            ))}
          </Stack>
          <Divider />
          <div
            style={{
              background: page === 'Settings' ? '#e0e7ff' : 'transparent',
              borderLeft: page === 'Settings' ? '3px solid #4f46e5' : '3px solid transparent',
            }}
          >
            <Button variant="ghost" onPress={() => setPage('Settings')}>
              Settings
            </Button>
          </div>
          <div style={{ marginTop: 'auto', padding: '8px 0' }}>
            <Button variant="ghost">Help &amp; Support</Button>
          </div>
        </div>
      )}

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderBottom: '1px solid #e5e7eb',
            gap: 12,
            background: '#fff',
          }}
        >
          <Button variant="ghost" onPress={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? '◀' : '▶'}
          </Button>
          <div style={{ flex: 1 }}>
            <Breadcrumbs>
              <Item key="hub">EventHub</Item>
              <Item key="page">{page}</Item>
            </Breadcrumbs>
          </div>
          <MenuTrigger>
            <Button variant="ghost">Account ▾</Button>
            <Menu onAction={key => { if (key === 'signout') setSignOutOpen(true); }}>
              <Item key="profile">Profile</Item>
              <Item key="signout">Sign out</Item>
            </Menu>
          </MenuTrigger>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {renderPage()}
        </div>
      </div>

      {/* Sign-out dialog */}
      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen} title="Sign Out">
        <Stack space={4}>
          <Text>Are you sure you want to sign out?</Text>
          <Inline space={3}>
            <Button variant="ghost" onPress={() => setSignOutOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => setSignOutOpen(false)}>
              Sign out
            </Button>
          </Inline>
        </Stack>
      </Dialog>
    </div>
  );
};

export default TestApp;
