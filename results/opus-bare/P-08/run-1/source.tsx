import { useMemo, useState, type ReactNode } from 'react';
import {
  Box,
  Stack,
  Inline,
  Card,
  Headline,
  Text,
  Button,
  TextField,
  TextArea,
  NumberField,
  Select,
  Switch,
  DatePicker,
  SearchField,
  Tabs,
  Accordion,
  Table,
  Tooltip,
  Menu,
  Dialog,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

const PAGE_LABELS: Record<Page, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  attendees: 'Attendees',
  reports: 'Reports',
  settings: 'Settings',
};

const upcomingEvents = [
  { id: 'ue1', event: 'Summer Music Festival', date: '2026-07-04', venue: 'Riverside Park', sold: 1240, status: 'On Sale' },
  { id: 'ue2', event: 'Tech Conference 2026', date: '2026-07-12', venue: 'Convention Center', sold: 860, status: 'On Sale' },
  { id: 'ue3', event: 'Indie Film Night', date: '2026-07-18', venue: 'Downtown Cinema', sold: 0, status: 'Draft' },
  { id: 'ue4', event: 'Charity Gala Dinner', date: '2026-07-22', venue: 'Grand Ballroom', sold: 320, status: 'On Sale' },
  { id: 'ue5', event: 'Startup Pitch Night', date: '2026-07-25', venue: 'Innovation Hub', sold: 200, status: 'Sold Out' },
  { id: 'ue6', event: 'Comedy Showcase', date: '2026-07-29', venue: 'Laugh Theater', sold: 0, status: 'Draft' },
];

const eventsData = [
  { id: 'e1', name: 'Summer Music Festival', date: '2026-07-04', location: 'Riverside Park', capacity: 2000, status: 'On Sale' },
  { id: 'e2', name: 'Tech Conference 2026', date: '2026-07-12', location: 'Convention Center', capacity: 1000, status: 'On Sale' },
  { id: 'e3', name: 'Indie Film Night', date: '2026-07-18', location: 'Downtown Cinema', capacity: 150, status: 'Draft' },
  { id: 'e4', name: 'Charity Gala Dinner', date: '2026-07-22', location: 'Grand Ballroom', capacity: 400, status: 'On Sale' },
  { id: 'e5', name: 'Startup Pitch Night', date: '2026-07-25', location: 'Innovation Hub', capacity: 200, status: 'Sold Out' },
  { id: 'e6', name: 'Comedy Showcase', date: '2026-07-29', location: 'Laugh Theater', capacity: 300, status: 'Draft' },
  { id: 'e7', name: 'Jazz in the Park', date: '2026-08-02', location: 'Central Gardens', capacity: 800, status: 'On Sale' },
];

const attendeesData = [
  { id: 'a1', name: 'Alice Johnson', email: 'alice@example.com', attended: 12, lastActive: '2026-06-20' },
  { id: 'a2', name: 'Bob Smith', email: 'bob@example.com', attended: 5, lastActive: '2026-06-10' },
  { id: 'a3', name: 'Carol Williams', email: 'carol@example.com', attended: 8, lastActive: '2026-03-15' },
  { id: 'a4', name: 'David Brown', email: 'david@example.com', attended: 3, lastActive: '2026-06-24' },
  { id: 'a5', name: 'Eva Davis', email: 'eva@example.com', attended: 19, lastActive: '2026-01-08' },
  { id: 'a6', name: 'Frank Miller', email: 'frank@example.com', attended: 7, lastActive: '2026-06-01' },
  { id: 'a7', name: 'Grace Wilson', email: 'grace@example.com', attended: 2, lastActive: '2026-04-30' },
];

const topEventsByAttendance = [
  { id: 't1', event: 'Summer Music Festival', date: '2025-07-04', attendees: 1900, capacity: 2000, fill: '95%' },
  { id: 't2', event: 'Tech Conference 2025', date: '2025-09-12', attendees: 940, capacity: 1000, fill: '94%' },
  { id: 't3', event: 'New Year Concert', date: '2025-12-31', attendees: 760, capacity: 800, fill: '95%' },
  { id: 't4', event: 'Spring Food Fair', date: '2026-04-18', attendees: 520, capacity: 700, fill: '74%' },
];

const REF_DATE = new Date('2026-06-25').getTime();

const isAttendeeActive = (lastActive: string) => {
  const diffDays = (REF_DATE - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
};

/* ------------------------------------------------------------------ */
/* Shared presentational helpers                                       */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<string, string> = {
  'On Sale': '#16a34a',
  Draft: '#9ca3af',
  'Sold Out': '#dc2626',
  Active: '#16a34a',
  Inactive: '#d97706',
};

const StatusIndicator = ({ status }: { status: string }) => (
  <Inline space="xsmall" alignY="center">
    <Box
      css={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: STATUS_COLORS[status] ?? '#9ca3af',
        flexShrink: 0,
      }}
    />
    <Text>{status}</Text>
  </Inline>
);

const BANNER_STYLES: Record<string, { bg: string; border: string }> = {
  info: { bg: '#e0f2fe', border: '#0284c7' },
  success: { bg: '#dcfce7', border: '#16a34a' },
  warning: { bg: '#fef3c7', border: '#d97706' },
};

const Banner = ({
  variant = 'info',
  children,
}: {
  variant?: 'info' | 'success' | 'warning';
  children: ReactNode;
}) => {
  const s = BANNER_STYLES[variant];
  return (
    <Box
      css={{
        padding: '12px 16px',
        backgroundColor: s.bg,
        borderLeft: `4px solid ${s.border}`,
        borderRadius: 6,
      }}
    >
      <Text>{children}</Text>
    </Box>
  );
};

const SummaryCard = ({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) => (
  <Card>
    <Stack space="xsmall">
      <Inline space="xsmall" alignY="center">
        <Text>{label}</Text>
        {tooltip ? (
          <Tooltip.Trigger>
            <Button variant="text" css={{ minWidth: 0, padding: 0 }} aria-label={`${label} info`}>
              ⓘ
            </Button>
            <Tooltip>{tooltip}</Tooltip>
          </Tooltip.Trigger>
        ) : null}
      </Inline>
      <Text css={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>{value}</Text>
    </Stack>
  </Card>
);

const CardGrid = ({ children }: { children: ReactNode }) => (
  <Box
    css={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
    }}
  >
    {children}
  </Box>
);

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [page, setPage] = useState<Page>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const [eventSearch, setEventSearch] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');

  const [generalSaved, setGeneralSaved] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    if (!q) return eventsData;
    return eventsData.filter(
      (e) => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q),
    );
  }, [eventSearch]);

  const filteredAttendees = useMemo(() => {
    const q = attendeeSearch.trim().toLowerCase();
    if (!q) return attendeesData;
    return attendeesData.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
    );
  }, [attendeeSearch]);

  const navItems: { key: Page; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'events', label: 'Events' },
    { key: 'attendees', label: 'Attendees' },
    { key: 'reports', label: 'Reports' },
  ];

  const NavButton = ({ itemKey, label }: { itemKey: Page; label: string }) => {
    const active = page === itemKey;
    return (
      <Button
        variant={active ? 'primary' : 'text'}
        onPress={() => setPage(itemKey)}
        css={{
          width: '100%',
          justifyContent: collapsed ? 'center' : 'flex-start',
          backgroundColor: active ? '#1e40af' : 'transparent',
          color: active ? '#ffffff' : '#1f2937',
        }}
      >
        {collapsed ? label.charAt(0) : label}
      </Button>
    );
  };

  /* ---------------------------------------------------------------- */
  /* Pages                                                            */
  /* ---------------------------------------------------------------- */

  const renderDashboard = () => (
    <Stack space="large">
      <Headline level="1">Dashboard Overview</Headline>
      <Banner variant="info">Welcome back! You have 3 events starting this week.</Banner>

      <CardGrid>
        <SummaryCard label="Total Events" value="24" />
        <SummaryCard label="Tickets Sold" value="1,849" />
        <SummaryCard label="Revenue" value="$45,230" tooltip="Net revenue after fees and refunds" />
        <SummaryCard label="Upcoming" value="8" />
      </CardGrid>

      <Stack space="small">
        <Headline level="2">Upcoming Events</Headline>
        <Table aria-label="Upcoming events">
          <Table.Header>
            <Table.Column id="event" isRowHeader>
              Event
            </Table.Column>
            <Table.Column id="date">Date</Table.Column>
            <Table.Column id="venue">Venue</Table.Column>
            <Table.Column id="sold">Tickets Sold</Table.Column>
            <Table.Column id="status">Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEvents.map((row) => (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.event}</Table.Cell>
                <Table.Cell>{row.date}</Table.Cell>
                <Table.Cell>{row.venue}</Table.Cell>
                <Table.Cell>{row.sold.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  <StatusIndicator status={row.status} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  const renderEvents = () => (
    <Stack space="large">
      <Headline level="1">Events</Headline>

      <Inline space="medium" alignY="center">
        <Box css={{ flex: 1, maxWidth: 360 }}>
          <SearchField
            label="Search events"
            aria-label="Search events by name or location"
            value={eventSearch}
            onChange={setEventSearch}
            placeholder="Search by name or location"
          />
        </Box>
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog aria-label="Create event">
            {({ close }: { close: () => void }) => (
              <Stack space="medium">
                <Headline level="2">Create Event</Headline>
                <TextField label="Event Name" isRequired />
                <DatePicker label="Date" />
                <TextField label="Location" />
                <NumberField label="Capacity" minValue={0} />
                <TextArea label="Description" />
                <Inline space="small">
                  <Button variant="primary" onPress={close}>
                    Create
                  </Button>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                </Inline>
              </Stack>
            )}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events">
        <Table.Header>
          <Table.Column id="name" isRowHeader>
            Name
          </Table.Column>
          <Table.Column id="date">Date</Table.Column>
          <Table.Column id="location">Location</Table.Column>
          <Table.Column id="capacity">Capacity</Table.Column>
          <Table.Column id="status">Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredEvents.map((row) => (
            <Table.Row key={row.id} id={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.location}</Table.Cell>
              <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <StatusIndicator status={row.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderAttendees = () => (
    <Stack space="large">
      <Headline level="1">Attendees</Headline>

      <Box css={{ maxWidth: 360 }}>
        <SearchField
          label="Search attendees"
          aria-label="Search attendees by name or email"
          value={attendeeSearch}
          onChange={setAttendeeSearch}
          placeholder="Search by name or email"
        />
      </Box>

      <Text>{filteredAttendees.length} attendees</Text>

      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Column id="name" isRowHeader>
            Name
          </Table.Column>
          <Table.Column id="email">Email</Table.Column>
          <Table.Column id="attended">Events Attended</Table.Column>
          <Table.Column id="lastActive">Last Active</Table.Column>
          <Table.Column id="status">Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredAttendees.map((row) => {
            const status = isAttendeeActive(row.lastActive) ? 'Active' : 'Inactive';
            return (
              <Table.Row key={row.id} id={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>{row.attended}</Table.Cell>
                <Table.Cell>{row.lastActive}</Table.Cell>
                <Table.Cell>
                  <StatusIndicator status={status} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderReports = () => (
    <Stack space="large">
      <Headline level="1">Reports</Headline>

      <Tabs aria-label="Report views">
        <Tabs.List>
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space="large">
            <CardGrid>
              <SummaryCard label="Total Revenue" value="$45,230" />
              <SummaryCard label="This Month" value="$8,420" />
              <SummaryCard label="Average per Event" value="$1,885" />
              <SummaryCard label="Refunds" value="$1,230" />
            </CardGrid>
            <Banner variant="success">Revenue is up 12% compared to last month.</Banner>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space="large">
            <CardGrid>
              <SummaryCard label="Total Attendees" value="3,200" />
              <SummaryCard label="Repeat Visitors" value="890" />
              <SummaryCard label="Average per Event" value="178" />
              <SummaryCard label="No-shows" value="145" />
            </CardGrid>
            <Stack space="small">
              <Headline level="2">Top Events by Attendance</Headline>
              <Table aria-label="Top events by attendance">
                <Table.Header>
                  <Table.Column id="event" isRowHeader>
                    Event
                  </Table.Column>
                  <Table.Column id="date">Date</Table.Column>
                  <Table.Column id="attendees">Attendees</Table.Column>
                  <Table.Column id="capacity">Capacity</Table.Column>
                  <Table.Column id="fill">Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body>
                  {topEventsByAttendance.map((row) => (
                    <Table.Row key={row.id} id={row.id}>
                      <Table.Cell>{row.event}</Table.Cell>
                      <Table.Cell>{row.date}</Table.Cell>
                      <Table.Cell>{row.attendees.toLocaleString()}</Table.Cell>
                      <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
                      <Table.Cell>{row.fill}</Table.Cell>
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
              This quarter saw steady growth across ticket sales and attendance, with revenue
              outpacing the same period last year. The sections below summarize performance by
              quarter.
            </Text>
            <Accordion>
              <Accordion.Item id="q1" title="Q1 Summary">
                <Text>
                  Q1 delivered $12,400 in revenue across 6 events, driven by strong early-bird
                  ticket sales and a successful winter concert series.
                </Text>
              </Accordion.Item>
              <Accordion.Item id="q2" title="Q2 Summary">
                <Text>
                  Q2 revenue reached $15,800 with attendance up 9% quarter over quarter, led by
                  the spring food fair and several sold-out workshops.
                </Text>
              </Accordion.Item>
              <Accordion.Item id="q3" title="Q3 Summary">
                <Text>
                  Q3 is on track for a record $17,030 in revenue, anchored by the summer music
                  festival and a growing roster of upcoming events.
                </Text>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space="large">
      <Headline level="1">Settings</Headline>

      <Tabs aria-label="Settings sections">
        <Tabs.List>
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Box css={{ maxWidth: 480 }}>
            <Stack space="medium">
              {generalSaved ? <Banner variant="success">Settings saved successfully.</Banner> : null}
              <TextField label="Organization Name" defaultValue="EventHub Inc." />
              <TextField label="Contact Email" type="email" defaultValue="hello@eventhub.com" />
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
                <Button variant="primary" onPress={() => setGeneralSaved(true)}>
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </Box>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Box css={{ maxWidth: 560 }}>
            <Stack space="medium">
              {prefsSaved ? <Banner variant="success">Preferences saved successfully.</Banner> : null}
              <Stack space="xsmall">
                <Switch defaultSelected>Email Notifications</Switch>
                <Text css={{ color: '#6b7280' }}>Receive booking and event updates by email.</Text>
              </Stack>
              <Stack space="xsmall">
                <Switch>SMS Notifications</Switch>
                <Text css={{ color: '#6b7280' }}>Get time-sensitive alerts as text messages.</Text>
              </Stack>
              <Stack space="xsmall">
                <Switch defaultSelected>Weekly Digest</Switch>
                <Text css={{ color: '#6b7280' }}>A summary of activity delivered every Monday.</Text>
              </Stack>
              <Stack space="xsmall">
                <Switch>Marketing Emails</Switch>
                <Text css={{ color: '#6b7280' }}>News about features, tips, and promotions.</Text>
              </Stack>
              <Box>
                <Button variant="primary" onPress={() => setPrefsSaved(true)}>
                  Save Preferences
                </Button>
              </Box>
            </Stack>
          </Box>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return renderDashboard();
      case 'events':
        return renderEvents();
      case 'attendees':
        return renderAttendees();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /* Shell                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <Box css={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        css={{
          width: collapsed ? 72 : 240,
          flexShrink: 0,
          height: '100%',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          padding: 12,
        }}
      >
        <Inline space="small" alignY="center">
          <Button
            variant="text"
            aria-label="Toggle sidebar"
            onPress={() => setCollapsed((c) => !c)}
            css={{ minWidth: 0 }}
          >
            ☰
          </Button>
          {!collapsed ? (
            <Headline level="3" css={{ margin: 0 }}>
              EventHub
            </Headline>
          ) : null}
        </Inline>

        <Box css={{ height: 16 }} />

        <Stack space="xsmall">
          {navItems.map((item) => (
            <NavButton key={item.key} itemKey={item.key} label={item.label} />
          ))}
        </Stack>

        <Box css={{ height: 12 }} />
        <Box css={{ borderTop: '1px solid #e5e7eb' }} />
        <Box css={{ height: 12 }} />

        <NavButton itemKey="settings" label="Settings" />

        <Box css={{ flex: 1 }} />

        <Button
          variant="text"
          css={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          {collapsed ? '?' : 'Help & Support'}
        </Button>
      </Box>

      {/* Right side */}
      <Box css={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        {/* Top bar */}
        <Box
          css={{
            flexShrink: 0,
            height: 60,
            borderBottom: '1px solid #e5e7eb',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <Inline space="medium" alignY="center">
            <Button
              variant="text"
              aria-label="Toggle sidebar"
              onPress={() => setCollapsed((c) => !c)}
              css={{ minWidth: 0 }}
            >
              ☰
            </Button>
            <Inline space="xsmall" alignY="center">
              <Text css={{ color: '#6b7280' }}>EventHub</Text>
              <Text css={{ color: '#9ca3af' }}>›</Text>
              <Text css={{ fontWeight: 600 }}>{PAGE_LABELS[page]}</Text>
            </Inline>
          </Inline>

          <Menu
            label="Account"
            onAction={(key) => {
              if (key === 'signout') setSignOutOpen(true);
            }}
          >
            <Menu.Item id="profile">Profile</Menu.Item>
            <Menu.Item id="signout">Sign out</Menu.Item>
          </Menu>
        </Box>

        {/* Main content */}
        <Box css={{ flex: 1, overflow: 'auto', padding: 24 }}>{renderPage()}</Box>
      </Box>

      {/* Sign-out confirmation dialog (controlled) */}
      <Dialog.Trigger isOpen={signOutOpen} onOpenChange={setSignOutOpen}>
        <Button css={{ display: 'none' }}>_</Button>
        <Dialog aria-label="Confirm sign out">
          {({ close }: { close: () => void }) => (
            <Stack space="medium">
              <Headline level="2">Sign out</Headline>
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
