import { useState } from 'react';
import {
  Box,
  Stack,
  Inline,
  Card,
  Button,
  Headline,
  Text,
  Divider,
  Table,
  Tabs,
  Dialog,
  Menu,
  SearchField,
  TextField,
  TextArea,
  NumberField,
  Select,
  DatePicker,
  Switch,
  Tooltip,
  Accordion,
} from '@marigold/components';

/* ---------------------------------------------------------------- helpers */

const STATUS_COLORS: Record<string, string> = {
  'On Sale': '#1f8a4c',
  Draft: '#6b7280',
  'Sold Out': '#c0392b',
  Active: '#1f8a4c',
  Inactive: '#d98324',
};

const StatusBadge = ({ status }: { status: string }) => (
  <Box
    styles={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '9999px',
      backgroundColor: STATUS_COLORS[status] || '#6b7280',
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: 600,
    }}
  >
    {status}
  </Box>
);

const Banner = ({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'success';
  children: React.ReactNode;
}) => (
  <Box
    styles={{
      padding: '12px 16px',
      borderRadius: '6px',
      backgroundColor: tone === 'success' ? '#e6f4ea' : '#e8f1fb',
      borderLeft: `4px solid ${tone === 'success' ? '#1f8a4c' : '#2563eb'}`,
    }}
  >
    <Text>{children}</Text>
  </Box>
);

const SummaryCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <Card>
    <Box styles={{ padding: '16px' }}>
      <Stack space="xsmall">
        <Inline space="xsmall" alignY="center">
          <Text>{label}</Text>
          {hint && (
            <Tooltip.Trigger>
              <Button variant="text" aria-label={`${label} info`}>
                ⓘ
              </Button>
              <Tooltip>{hint}</Tooltip>
            </Tooltip.Trigger>
          )}
        </Inline>
        <Headline level={2}>{value}</Headline>
      </Stack>
    </Box>
  </Card>
);

const CardsRow = ({ children }: { children: React.ReactNode }) => (
  <Box
    styles={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
    }}
  >
    {children}
  </Box>
);

/* ------------------------------------------------------------------- data */

const TODAY = new Date('2026-06-25T00:00:00');

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'events', label: 'Events' },
  { id: 'attendees', label: 'Attendees' },
  { id: 'reports', label: 'Reports' },
];

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  attendees: 'Attendees',
  reports: 'Reports',
  settings: 'Settings',
  help: 'Help & Support',
};

const UPCOMING_EVENTS = [
  { event: 'Summer Music Festival', date: 'Jul 12, 2026', venue: 'Central Park', sold: '3,200', status: 'On Sale' },
  { event: 'Tech Conference 2026', date: 'Aug 3, 2026', venue: 'Convention Center', sold: '540', status: 'On Sale' },
  { event: 'Art Expo', date: 'Jun 28, 2026', venue: 'Downtown Gallery', sold: '0', status: 'Draft' },
  { event: 'Food & Wine Night', date: 'Jul 1, 2026', venue: 'Riverside Hall', sold: '450', status: 'Sold Out' },
  { event: 'Charity Gala', date: 'Oct 5, 2026', venue: 'Grand Ballroom', sold: '210', status: 'On Sale' },
  { event: 'Jazz Evening', date: 'Jul 20, 2026', venue: 'Blue Note Club', sold: '250', status: 'Sold Out' },
];

const EVENTS = [
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', location: 'Central Park', capacity: '5,000', status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Aug 3, 2026', location: 'Convention Center', capacity: '1,200', status: 'On Sale' },
  { name: 'Art Expo', date: 'Jun 28, 2026', location: 'Downtown Gallery', capacity: '300', status: 'Draft' },
  { name: 'Food & Wine Night', date: 'Jul 1, 2026', location: 'Riverside Hall', capacity: '450', status: 'Sold Out' },
  { name: 'Startup Pitch Day', date: 'Sep 15, 2026', location: 'Innovation Hub', capacity: '200', status: 'Draft' },
  { name: 'Charity Gala', date: 'Oct 5, 2026', location: 'Grand Ballroom', capacity: '600', status: 'On Sale' },
  { name: 'Jazz Evening', date: 'Jul 20, 2026', location: 'Blue Note Club', capacity: '250', status: 'Sold Out' },
];

const ATTENDEES_RAW = [
  { name: 'Alice Johnson', email: 'alice@example.com', attended: 12, lastActive: '2026-06-20' },
  { name: 'Bob Smith', email: 'bob@example.com', attended: 5, lastActive: '2026-06-01' },
  { name: 'Carol White', email: 'carol@example.com', attended: 8, lastActive: '2026-04-15' },
  { name: 'David Brown', email: 'david@example.com', attended: 3, lastActive: '2026-06-24' },
  { name: 'Eve Davis', email: 'eve@example.com', attended: 20, lastActive: '2026-03-10' },
  { name: 'Frank Miller', email: 'frank@example.com', attended: 7, lastActive: '2026-05-30' },
];

const ATTENDEES = ATTENDEES_RAW.map((a) => {
  const days = Math.round((TODAY.getTime() - new Date(a.lastActive).getTime()) / 86400000);
  return { ...a, status: days <= 30 ? 'Active' : 'Inactive' };
});

const TOP_EVENTS = [
  { event: 'Summer Music Festival', date: 'Jul 2025', attendees: '4,800', capacity: '5,000', fill: '96%' },
  { event: 'Tech Conference', date: 'Aug 2025', attendees: '1,100', capacity: '1,200', fill: '92%' },
  { event: 'Food & Wine Night', date: 'Jul 2025', attendees: '450', capacity: '450', fill: '100%' },
  { event: 'Charity Gala', date: 'Oct 2025', attendees: '520', capacity: '600', fill: '87%' },
];

/* -------------------------------------------------------------- component */

const TestApp = () => {
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const eventQuery = eventSearch.toLowerCase();
  const filteredEvents = EVENTS.filter(
    (e) =>
      e.name.toLowerCase().includes(eventQuery) ||
      e.location.toLowerCase().includes(eventQuery)
  );

  const attendeeQuery = attendeeSearch.toLowerCase();
  const filteredAttendees = ATTENDEES.filter(
    (a) =>
      a.name.toLowerCase().includes(attendeeQuery) ||
      a.email.toLowerCase().includes(attendeeQuery)
  );

  /* ------------------------------------------------------------- sidebar */

  const NavButton = ({ id, label }: { id: string; label: string }) => (
    <Button
      variant={page === id ? 'primary' : 'text'}
      onPress={() => setPage(id)}
    >
      {collapsed ? label.charAt(0) : label}
    </Button>
  );

  const sidebar = (
    <Box
      styles={{
        width: collapsed ? '72px' : '240px',
        height: '100vh',
        backgroundColor: '#f4f5f7',
        borderRight: '1px solid #e0e0e0',
        padding: '16px 12px',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <Stack space="medium">
        <Inline space="xsmall" alignY="center">
          <Button variant="text" aria-label="Toggle sidebar" onPress={() => setCollapsed((c) => !c)}>
            ☰
          </Button>
          {!collapsed && <Headline level={3}>EventHub</Headline>}
        </Inline>

        <Divider />

        <Stack space="xsmall">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.id} id={item.id} label={item.label} />
          ))}
        </Stack>

        <Divider />

        <NavButton id="settings" label="Settings" />

        <Box styles={{ marginTop: '24px' }}>
          <NavButton id="help" label="Help & Support" />
        </Box>
      </Stack>
    </Box>
  );

  /* -------------------------------------------------------------- topbar */

  const topbar = (
    <Box
      styles={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
      }}
    >
      <Button variant="text" aria-label="Toggle sidebar" onPress={() => setCollapsed((c) => !c)}>
        ☰
      </Button>

      <Inline space="xsmall" alignY="center">
        <Text>EventHub</Text>
        <Text>›</Text>
        <Text>{PAGE_LABELS[page]}</Text>
      </Inline>

      <Menu label="Account">
        <Menu.Item id="profile">Profile</Menu.Item>
        <Menu.Item id="signout" onAction={() => setSignOutOpen(true)}>
          Sign out
        </Menu.Item>
      </Menu>
    </Box>
  );

  /* ----------------------------------------------------------- dashboard */

  const dashboard = (
    <Stack space="large">
      <Headline level={1}>Dashboard Overview</Headline>
      <Banner>Welcome back! You have 3 events starting this week.</Banner>

      <CardsRow>
        <SummaryCard label="Total Events" value="24" />
        <SummaryCard label="Tickets Sold" value="1,849" />
        <SummaryCard label="Revenue" value="$45,230" hint="Net revenue after fees and refunds" />
        <SummaryCard label="Upcoming" value="8" />
      </CardsRow>

      <Stack space="small">
        <Headline level={2}>Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column isRowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {UPCOMING_EVENTS.map((e) => (
              <Table.Row key={e.event} id={e.event}>
                <Table.Cell>{e.event}</Table.Cell>
                <Table.Cell>{e.date}</Table.Cell>
                <Table.Cell>{e.venue}</Table.Cell>
                <Table.Cell>{e.sold}</Table.Cell>
                <Table.Cell>
                  <StatusBadge status={e.status} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  /* -------------------------------------------------------------- events */

  const events = (
    <Stack space="large">
      <Headline level={1}>Events</Headline>

      <Inline space="medium" alignY="bottom">
        <SearchField
          label="Search events"
          aria-label="Search events by name or location"
          value={eventSearch}
          onChange={setEventSearch}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog aria-label="Create Event" closeButton>
            {({ close }: { close: () => void }) => (
              <Stack space="medium">
                <Headline level={2}>Create Event</Headline>
                <Stack space="small">
                  <TextField label="Event Name" required />
                  <DatePicker label="Date" />
                  <TextField label="Location" />
                  <NumberField label="Capacity" minValue={0} />
                  <TextArea label="Description" />
                </Stack>
                <Inline space="small">
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button variant="primary" onPress={close}>
                    Create
                  </Button>
                </Inline>
              </Stack>
            )}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredEvents.map((e) => (
            <Table.Row key={e.name} id={e.name}>
              <Table.Cell>{e.name}</Table.Cell>
              <Table.Cell>{e.date}</Table.Cell>
              <Table.Cell>{e.location}</Table.Cell>
              <Table.Cell>{e.capacity}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={e.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  /* ----------------------------------------------------------- attendees */

  const attendees = (
    <Stack space="large">
      <Headline level={1}>Attendees</Headline>

      <SearchField
        label="Search attendees"
        aria-label="Search attendees by name or email"
        value={attendeeSearch}
        onChange={setAttendeeSearch}
      />

      <Text>{filteredAttendees.length} attendees</Text>

      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredAttendees.map((a) => (
            <Table.Row key={a.email} id={a.email}>
              <Table.Cell>{a.name}</Table.Cell>
              <Table.Cell>{a.email}</Table.Cell>
              <Table.Cell>{a.attended}</Table.Cell>
              <Table.Cell>{a.lastActive}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={a.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  /* ------------------------------------------------------------- reports */

  const reports = (
    <Stack space="large">
      <Headline level={1}>Reports</Headline>

      <Tabs aria-label="Report views" defaultSelectedKey="revenue">
        <Tabs.List aria-label="Report views">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space="large">
            <CardsRow>
              <SummaryCard label="Total Revenue" value="$45,230" />
              <SummaryCard label="This Month" value="$8,420" />
              <SummaryCard label="Average per Event" value="$1,885" />
              <SummaryCard label="Refunds" value="$1,230" />
            </CardsRow>
            <Banner tone="success">Revenue is up 12% compared to last month.</Banner>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space="large">
            <CardsRow>
              <SummaryCard label="Total Attendees" value="3,200" />
              <SummaryCard label="Repeat Visitors" value="890" />
              <SummaryCard label="Average per Event" value="178" />
              <SummaryCard label="No-shows" value="145" />
            </CardsRow>
            <Stack space="small">
              <Headline level={2}>Top Events by Attendance</Headline>
              <Table aria-label="Top Events by Attendance">
                <Table.Header>
                  <Table.Column isRowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body>
                  {TOP_EVENTS.map((e) => (
                    <Table.Row key={e.event} id={e.event}>
                      <Table.Cell>{e.event}</Table.Cell>
                      <Table.Cell>{e.date}</Table.Cell>
                      <Table.Cell>{e.attendees}</Table.Cell>
                      <Table.Cell>{e.capacity}</Table.Cell>
                      <Table.Cell>{e.fill}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="overview">
          <Stack space="medium">
            <Text>
              This overview summarizes EventHub performance across the year, covering revenue
              trends, attendance growth, and operational highlights by quarter.
            </Text>
            <Accordion>
              <Accordion.Item id="q1" title="Q1 Summary">
                <Text>
                  Q1 saw steady ticket sales with a strong start in March driven by early-bird
                  promotions and two sold-out venues.
                </Text>
              </Accordion.Item>
              <Accordion.Item id="q2" title="Q2 Summary">
                <Text>
                  Q2 revenue grew 12% quarter-over-quarter, led by the Summer Music Festival and
                  expanded marketing campaigns.
                </Text>
              </Accordion.Item>
              <Accordion.Item id="q3" title="Q3 Summary">
                <Text>
                  Q3 focused on corporate events and conferences, improving repeat-visitor rates
                  while keeping no-shows below target.
                </Text>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  /* ------------------------------------------------------------ settings */

  const settings = (
    <Stack space="large">
      <Headline level={1}>Settings</Headline>

      <Tabs aria-label="Settings sections" defaultSelectedKey="general">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space="medium">
            {settingsSaved && <Banner tone="success">Settings saved successfully.</Banner>}
            <TextField label="Organization Name" defaultValue="EventHub Inc." />
            <TextField label="Contact Email" type="email" defaultValue="contact@eventhub.com" />
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
            <Box>
              <Button variant="primary" onPress={() => setSettingsSaved(true)}>
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space="large">
            <Stack space="xsmall">
              <Switch defaultSelected>Email Notifications</Switch>
              <Text>Receive important account updates by email.</Text>
            </Stack>
            <Stack space="xsmall">
              <Switch>SMS Notifications</Switch>
              <Text>Get text message alerts for urgent events.</Text>
            </Stack>
            <Stack space="xsmall">
              <Switch defaultSelected>Weekly Digest</Switch>
              <Text>A weekly summary of your events and sales.</Text>
            </Stack>
            <Stack space="xsmall">
              <Switch>Marketing Emails</Switch>
              <Text>News, tips, and product announcements.</Text>
            </Stack>
            <Box>
              <Button variant="primary">Save Preferences</Button>
            </Box>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  /* ---------------------------------------------------------------- help */

  const help = (
    <Stack space="medium">
      <Headline level={1}>Help &amp; Support</Headline>
      <Text>
        Need a hand? Browse our documentation, contact support, or reach out to your account
        manager for assistance with EventHub.
      </Text>
    </Stack>
  );

  const PAGES: Record<string, React.ReactNode> = {
    dashboard,
    events,
    attendees,
    reports,
    settings,
    help,
  };

  /* --------------------------------------------------------------- shell */

  return (
    <Box styles={{ display: 'flex', height: '100vh', width: '100%' }}>
      {sidebar}

      <Box styles={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {topbar}
        <Box styles={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {PAGES[page]}
        </Box>
      </Box>

      {/* Sign-out confirmation (controlled) */}
      <Dialog.Trigger isOpen={signOutOpen} onOpenChange={setSignOutOpen}>
        <Button styles={{ display: 'none' }} aria-hidden>
          sign-out
        </Button>
        <Dialog aria-label="Confirm sign out">
          {({ close }: { close: () => void }) => (
            <Stack space="medium">
              <Headline level={2}>Sign out</Headline>
              <Text>Are you sure you want to sign out?</Text>
              <Inline space="small">
                <Button variant="secondary" onPress={close}>
                  Cancel
                </Button>
                <Button variant="primary" onPress={close}>
                  Sign out
                </Button>
              </Inline>
            </Stack>
          )}
        </Dialog>
      </Dialog.Trigger>
    </Box>
  );
};

export default TestApp;
