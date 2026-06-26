import React, { useState } from 'react';
import {
  Box,
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  Card,
  Divider,
  Table,
  Tabs,
  Accordion,
  Dialog,
  Menu,
  Tooltip,
  TextField,
  TextArea,
  NumberField,
  DatePicker,
  Select,
  Switch,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<string, string> = {
  'On Sale': '#15803d',
  Draft: '#6b7280',
  'Sold Out': '#dc2626',
  Active: '#15803d',
  Inactive: '#d97706',
};

function StatusIndicator({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? '#6b7280';
  return (
    <Inline space={2} alignY="center">
      <Box
        width="10px"
        height="10px"
        borderRadius="50%"
        backgroundColor={color}
        flex="0 0 auto"
      />
      <Text>{status}</Text>
    </Inline>
  );
}

type BannerTone = 'info' | 'success' | 'warning';

const BANNER_STYLES: Record<BannerTone, { bg: string; border: string }> = {
  info: { bg: '#eff6ff', border: '#3b82f6' },
  success: { bg: '#ecfdf5', border: '#10b981' },
  warning: { bg: '#fffbeb', border: '#f59e0b' },
};

function Banner({
  tone = 'info',
  title,
  children,
}: {
  tone?: BannerTone;
  title?: string;
  children: React.ReactNode;
}) {
  const s = BANNER_STYLES[tone];
  return (
    <Box
      padding={4}
      backgroundColor={s.bg}
      borderRadius="6px"
      borderLeftWidth="4px"
      borderLeftStyle="solid"
      borderLeftColor={s.border}
    >
      <Stack space={1}>
        {title ? <Text weight="bold">{title}</Text> : null}
        <Text>{children}</Text>
      </Stack>
    </Box>
  );
}

function SummaryCard({
  label,
  value,
  labelNode,
}: {
  label?: string;
  value: string | number;
  labelNode?: React.ReactNode;
}) {
  return (
    <Box flex="1" minWidth="180px">
      <Card>
        <Stack space={2}>
          {labelNode ?? <Text color="#6b7280">{label}</Text>}
          <Headline level={2}>{String(value)}</Headline>
        </Stack>
      </Card>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const upcomingEvents = [
  { id: 'u1', event: 'Summer Music Festival', date: '2026-07-02', venue: 'Riverside Park', tickets: 1200, status: 'On Sale' },
  { id: 'u2', event: 'Tech Conference 2026', date: '2026-07-08', venue: 'Convention Center', tickets: 850, status: 'On Sale' },
  { id: 'u3', event: 'Local Art Expo', date: '2026-07-12', venue: 'Downtown Gallery', tickets: 0, status: 'Draft' },
  { id: 'u4', event: 'Charity Gala Dinner', date: '2026-07-15', venue: 'Grand Hotel', tickets: 300, status: 'Sold Out' },
  { id: 'u5', event: 'Startup Pitch Night', date: '2026-07-19', venue: 'Innovation Hub', tickets: 220, status: 'On Sale' },
  { id: 'u6', event: 'Food & Wine Tasting', date: '2026-07-24', venue: 'Vineyard Estate', tickets: 410, status: 'On Sale' },
];

const eventsData = [
  { id: 'e1', name: 'Summer Music Festival', date: '2026-07-02', location: 'Riverside Park', capacity: 1500, status: 'On Sale' },
  { id: 'e2', name: 'Tech Conference 2026', date: '2026-07-08', location: 'Convention Center', capacity: 1000, status: 'On Sale' },
  { id: 'e3', name: 'Local Art Expo', date: '2026-07-12', location: 'Downtown Gallery', capacity: 250, status: 'Draft' },
  { id: 'e4', name: 'Charity Gala Dinner', date: '2026-07-15', location: 'Grand Hotel', capacity: 300, status: 'Sold Out' },
  { id: 'e5', name: 'Startup Pitch Night', date: '2026-07-19', location: 'Innovation Hub', capacity: 400, status: 'On Sale' },
  { id: 'e6', name: 'Food & Wine Tasting', date: '2026-07-24', location: 'Vineyard Estate', capacity: 500, status: 'On Sale' },
  { id: 'e7', name: 'Winter Jazz Evening', date: '2026-12-04', location: 'City Theatre', capacity: 600, status: 'Draft' },
];

const attendeesData = [
  { id: 'a1', name: 'Alice Johnson', email: 'alice@example.com', attended: 12, lastActive: '2026-06-20' },
  { id: 'a2', name: 'Bob Martinez', email: 'bob@example.com', attended: 5, lastActive: '2026-06-10' },
  { id: 'a3', name: 'Carol White', email: 'carol@example.com', attended: 8, lastActive: '2026-03-15' },
  { id: 'a4', name: 'David Chen', email: 'david@example.com', attended: 3, lastActive: '2026-06-23' },
  { id: 'a5', name: 'Eva Müller', email: 'eva@example.com', attended: 20, lastActive: '2026-01-30' },
  { id: 'a6', name: 'Frank Owusu', email: 'frank@example.com', attended: 7, lastActive: '2026-06-18' },
  { id: 'a7', name: 'Grace Park', email: 'grace@example.com', attended: 1, lastActive: '2026-05-02' },
];

const topEventsByAttendance = [
  { id: 't1', event: 'Summer Music Festival', date: '2026-07-02', attendees: 1180, capacity: 1500 },
  { id: 't2', event: 'Tech Conference 2026', date: '2026-07-08', attendees: 940, capacity: 1000 },
  { id: 't3', event: 'Food & Wine Tasting', date: '2026-07-24', attendees: 460, capacity: 500 },
  { id: 't4', event: 'Charity Gala Dinner', date: '2026-07-15', attendees: 300, capacity: 300 },
  { id: 't5', event: 'Startup Pitch Night', date: '2026-07-19', attendees: 250, capacity: 400 },
];

const TODAY = new Date('2026-06-25');
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function attendeeStatus(lastActive: string): 'Active' | 'Inactive' {
  const diff = TODAY.getTime() - new Date(lastActive).getTime();
  return diff <= THIRTY_DAYS ? 'Active' : 'Inactive';
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function DashboardPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Dashboard Overview</Headline>

      <Banner tone="info">
        Welcome back! You have 3 events starting this week.
      </Banner>

      <Inline space={4} alignY="stretch">
        <SummaryCard label="Total Events" value="24" />
        <SummaryCard label="Tickets Sold" value="1,849" />
        <SummaryCard
          value="$45,230"
          labelNode={
            <Inline space={1} alignY="center">
              <Text color="#6b7280">Revenue</Text>
              <Tooltip.Trigger>
                <Button variant="text" size="small">
                  ⓘ
                </Button>
                <Tooltip>Net revenue after fees and refunds</Tooltip>
              </Tooltip.Trigger>
            </Inline>
          }
        />
        <SummaryCard label="Upcoming" value="8" />
      </Inline>

      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column isRowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEvents.map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.event}</Table.Cell>
                <Table.Cell>{row.date}</Table.Cell>
                <Table.Cell>{row.venue}</Table.Cell>
                <Table.Cell>{row.tickets.toLocaleString()}</Table.Cell>
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
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

function CreateEventDialog() {
  return (
    <Dialog.Trigger>
      <Button variant="primary">Create Event</Button>
      <Dialog aria-label="Create Event">
        {({ close }: { close: () => void }) => (
          <Stack space={4}>
            <Headline level={2}>Create Event</Headline>
            <TextField label="Event Name" isRequired />
            <DatePicker label="Date" />
            <TextField label="Location" />
            <NumberField label="Capacity" minValue={0} />
            <TextArea label="Description" />
            <Inline space={3} alignX="right">
              <Button variant="text" onPress={close}>
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
  );
}

function EventsPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rows = eventsData.filter(
    (e) =>
      e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>

      <Inline space={4} alignY="bottom" alignX="left">
        <Box flex="1" maxWidth="360px">
          <TextField
            label="Search events"
            placeholder="Search by name or location"
            value={query}
            onChange={setQuery}
          />
        </Box>
        <CreateEventDialog />
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
          {rows.map((row) => (
            <Table.Row key={row.id}>
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
}

/* ------------------------------------------------------------------ */
/* Attendees                                                           */
/* ------------------------------------------------------------------ */

function AttendeesPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rows = attendeesData.filter(
    (a) =>
      a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>

      <Inline space={4} alignY="center">
        <Box flex="1" maxWidth="360px">
          <TextField
            label="Search attendees"
            placeholder="Search by name or email"
            value={query}
            onChange={setQuery}
          />
        </Box>
        <Text>{rows.length} attendees</Text>
      </Inline>

      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Column isRowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.attended}</Table.Cell>
              <Table.Cell>{row.lastActive}</Table.Cell>
              <Table.Cell>
                <StatusIndicator status={attendeeStatus(row.lastActive)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

function ReportsPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Reports</Headline>

      <Tabs aria-label="Reports views" defaultSelectedKey="revenue">
        <Tabs.List aria-label="Reports views">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={6}>
            <Inline space={4} alignY="stretch">
              <SummaryCard label="Total Revenue" value="$45,230" />
              <SummaryCard label="This Month" value="$8,420" />
              <SummaryCard label="Average per Event" value="$1,885" />
              <SummaryCard label="Refunds" value="$1,230" />
            </Inline>
            <Banner tone="success">
              Revenue is up 12% compared to last month.
            </Banner>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={6}>
            <Inline space={4} alignY="stretch">
              <SummaryCard label="Total Attendees" value="3,200" />
              <SummaryCard label="Repeat Visitors" value="890" />
              <SummaryCard label="Average per Event" value="178" />
              <SummaryCard label="No-shows" value="145" />
            </Inline>

            <Stack space={3}>
              <Headline level={3}>Top Events by Attendance</Headline>
              <Table aria-label="Top Events by Attendance">
                <Table.Header>
                  <Table.Column isRowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body>
                  {topEventsByAttendance.map((row) => (
                    <Table.Row key={row.id}>
                      <Table.Cell>{row.event}</Table.Cell>
                      <Table.Cell>{row.date}</Table.Cell>
                      <Table.Cell>{row.attendees.toLocaleString()}</Table.Cell>
                      <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
                      <Table.Cell>
                        {Math.round((row.attendees / row.capacity) * 100)}%
                      </Table.Cell>
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
              This overview summarizes EventHub performance across the year so
              far. Ticket sales and attendance have grown steadily quarter over
              quarter, with revenue trending upward and refund rates staying
              low. Expand a quarter below for the detailed summary.
            </Text>
            <Accordion>
              <Accordion.Item id="q1" title="Q1 Summary">
                <Text>
                  Q1 saw 6 events with 720 tickets sold and $11,200 in revenue.
                  Attendance was strongest for the Winter Jazz Evening.
                </Text>
              </Accordion.Item>
              <Accordion.Item id="q2" title="Q2 Summary">
                <Text>
                  Q2 delivered 9 events and $18,600 in revenue. Repeat-visitor
                  rates climbed as loyalty incentives launched mid-quarter.
                </Text>
              </Accordion.Item>
              <Accordion.Item id="q3" title="Q3 Summary">
                <Text>
                  Q3 is on track with several large festivals scheduled.
                  Projected revenue is $15,430 with high anticipated fill rates.
                </Text>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

function GeneralSettings() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack space={4}>
      {saved ? (
        <Banner tone="success">Settings saved successfully.</Banner>
      ) : null}
      <Box maxWidth="480px">
        <Stack space={4}>
          <TextField label="Organization Name" defaultValue="EventHub Inc." />
          <TextField
            label="Contact Email"
            type="email"
            defaultValue="contact@eventhub.com"
          />
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
            <Button variant="primary" onPress={() => setSaved(true)}>
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

function NotificationSettings() {
  const [saved, setSaved] = useState(false);
  const toggles = [
    { id: 'email', label: 'Email Notifications', desc: 'Receive event updates and alerts by email.', def: true },
    { id: 'sms', label: 'SMS Notifications', desc: 'Get time-sensitive alerts as text messages.', def: false },
    { id: 'digest', label: 'Weekly Digest', desc: 'A summary of activity delivered every Monday.', def: true },
    { id: 'marketing', label: 'Marketing Emails', desc: 'News about features and promotional offers.', def: false },
  ];
  return (
    <Stack space={4}>
      {saved ? (
        <Banner tone="success">Settings saved successfully.</Banner>
      ) : null}
      <Box maxWidth="520px">
        <Stack space={4}>
          {toggles.map((t) => (
            <Stack key={t.id} space={1}>
              <Switch defaultSelected={t.def}>{t.label}</Switch>
              <Text color="#6b7280">{t.desc}</Text>
            </Stack>
          ))}
          <Box>
            <Button variant="primary" onPress={() => setSaved(true)}>
              Save Preferences
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

function SettingsPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>
      <Tabs aria-label="Settings sections" defaultSelectedKey="general">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="general">
          <GeneralSettings />
        </Tabs.TabPanel>
        <Tabs.TabPanel id="notifications">
          <NotificationSettings />
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'events', label: 'Events' },
  { key: 'attendees', label: 'Attendees' },
  { key: 'reports', label: 'Reports' },
  { key: 'settings', label: 'Settings' },
];

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  attendees: 'Attendees',
  reports: 'Reports',
  settings: 'Settings',
  help: 'Help & Support',
};

function NavButton({
  active,
  collapsed,
  label,
  onPress,
}: {
  active: boolean;
  collapsed: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Box width="100%">
      <Button
        variant={active ? 'primary' : 'text'}
        width="100%"
        onPress={onPress}
      >
        {collapsed ? label.charAt(0) : label}
      </Button>
    </Box>
  );
}

const TestApp = () => {
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case 'events':
        return <EventsPage />;
      case 'attendees':
        return <AttendeesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return (
          <Stack space={4}>
            <Headline level={1}>Help & Support</Headline>
            <Text>
              Need a hand? Browse our documentation or contact the support team
              and we will get back to you within one business day.
            </Text>
          </Stack>
        );
      default:
        return <DashboardPage />;
    }
  };

  const onAccountAction = (key: React.Key) => {
    if (key === 'signout') {
      setSignOutOpen(true);
    }
  };

  return (
    <Box display="flex" height="100vh" width="100%">
      {/* Sidebar */}
      <Box
        width={collapsed ? '72px' : '240px'}
        flex="0 0 auto"
        height="100%"
        backgroundColor="#0f172a"
        padding={4}
        overflowY="auto"
      >
        <Stack space={5} height="100%">
          <Text weight="bold" color="#ffffff">
            {collapsed ? 'EH' : 'EventHub'}
          </Text>

          <Stack space={2}>
            {NAV_ITEMS.filter((n) => n.key !== 'settings').map((item) => (
              <NavButton
                key={item.key}
                active={page === item.key}
                collapsed={collapsed}
                label={item.label}
                onPress={() => setPage(item.key)}
              />
            ))}

            <Divider />

            <NavButton
              active={page === 'settings'}
              collapsed={collapsed}
              label="Settings"
              onPress={() => setPage('settings')}
            />
          </Stack>

          <Box marginTop="auto">
            <NavButton
              active={page === 'help'}
              collapsed={collapsed}
              label="Help & Support"
              onPress={() => setPage('help')}
            />
          </Box>
        </Stack>
      </Box>

      {/* Right column: top bar + main */}
      <Box display="flex" flexDirection="column" flex="1 1 auto" height="100%" minWidth="0">
        {/* Top bar */}
        <Box
          padding={4}
          borderBottomWidth="1px"
          borderBottomStyle="solid"
          borderBottomColor="#e5e7eb"
          flex="0 0 auto"
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Inline space={3} alignY="center">
              <Button
                variant="text"
                aria-label="Toggle sidebar"
                onPress={() => setCollapsed((c) => !c)}
              >
                ☰
              </Button>
            </Inline>

            <Inline space={2} alignY="center">
              <Text color="#6b7280">EventHub</Text>
              <Text color="#6b7280">›</Text>
              <Text weight="bold">{PAGE_LABELS[page]}</Text>
            </Inline>

            <Inline space={3} alignY="center">
              <Menu.Trigger>
                <Button variant="secondary">Account</Button>
                <Menu onAction={onAccountAction}>
                  <Menu.Item id="profile">Profile</Menu.Item>
                  <Menu.Item id="signout">Sign out</Menu.Item>
                </Menu>
              </Menu.Trigger>
            </Inline>
          </Box>
        </Box>

        {/* Main scrollable content */}
        <Box flex="1 1 auto" overflowY="auto" padding={6} minWidth="0">
          {renderPage()}
        </Box>
      </Box>

      {/* Sign out confirmation (controlled) */}
      <Dialog.Trigger isOpen={signOutOpen} onOpenChange={setSignOutOpen}>
        <Box display="none">
          <Button aria-label="sign out trigger">trigger</Button>
        </Box>
        <Dialog aria-label="Confirm sign out">
          {({ close }: { close: () => void }) => (
            <Stack space={4}>
              <Headline level={2}>Sign out</Headline>
              <Text>Are you sure you want to sign out?</Text>
              <Inline space={3} alignX="right">
                <Button variant="text" onPress={close}>
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
