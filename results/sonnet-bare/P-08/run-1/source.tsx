import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Inline,
  Text,
  Heading,
  Button,
  TextField,
  SearchField,
  Select,
  Switch,
  Table,
  Tabs,
  Badge,
  Divider,
  Banner,
  Tooltip,
  TooltipTrigger,
  NumberField,
  Textarea,
} from '@marigold/components';

// ─── Static data ─────────────────────────────────────────────────────────────

const UPCOMING_EVENTS = [
  { id: 1, name: 'Spring Music Festival', date: '2025-04-12', venue: 'Central Park', tickets: 320, status: 'On Sale' },
  { id: 2, name: 'Tech Conference 2025', date: '2025-04-18', venue: 'Convention Center', tickets: 540, status: 'On Sale' },
  { id: 3, name: 'Art Exhibition Opening', date: '2025-04-22', venue: 'City Gallery', tickets: 150, status: 'Sold Out' },
  { id: 4, name: 'Marathon City Run', date: '2025-04-28', venue: 'Riverside Park', tickets: 800, status: 'On Sale' },
  { id: 5, name: 'Comedy Night Live', date: '2025-05-03', venue: 'The Grand Hall', tickets: 0, status: 'Draft' },
  { id: 6, name: 'Jazz in the Square', date: '2025-05-10', venue: 'Town Square', tickets: 210, status: 'On Sale' },
];

const EVENTS_LIST = [
  { id: 1, name: 'Spring Music Festival', date: '2025-04-12', location: 'Central Park, NY', capacity: 500, status: 'On Sale' },
  { id: 2, name: 'Tech Conference 2025', date: '2025-04-18', location: 'Convention Center, LA', capacity: 600, status: 'On Sale' },
  { id: 3, name: 'Art Exhibition Opening', date: '2025-04-22', location: 'City Gallery, Chicago', capacity: 150, status: 'Sold Out' },
  { id: 4, name: 'Marathon City Run', date: '2025-04-28', location: 'Riverside Park, Boston', capacity: 1000, status: 'On Sale' },
  { id: 5, name: 'Comedy Night Live', date: '2025-05-03', location: 'The Grand Hall, SF', capacity: 300, status: 'Draft' },
  { id: 6, name: 'Jazz in the Square', date: '2025-05-10', location: 'Town Square, Austin', capacity: 400, status: 'On Sale' },
  { id: 7, name: 'Wine & Dine Gala', date: '2025-05-15', location: 'Rooftop Venue, Miami', capacity: 200, status: 'Draft' },
];

const ATTENDEES_LIST = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2025-04-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2025-03-15' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', eventsAttended: 8, lastActive: '2025-04-08' },
  { id: 4, name: 'David Brown', email: 'david@example.com', eventsAttended: 1, lastActive: '2024-12-01' },
  { id: 5, name: 'Eva Martinez', email: 'eva@example.com', eventsAttended: 4, lastActive: '2025-04-11' },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', eventsAttended: 2, lastActive: '2025-01-20' },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', eventsAttended: 6, lastActive: '2025-04-09' },
];

const ATTENDANCE_TOP = [
  { id: 1, event: 'Marathon City Run', date: '2025-04-28', attendees: 980, capacity: 1000, fillRate: '98%' },
  { id: 2, event: 'Tech Conference 2025', date: '2025-04-18', attendees: 540, capacity: 600, fillRate: '90%' },
  { id: 3, event: 'Spring Music Festival', date: '2025-04-12', attendees: 320, capacity: 500, fillRate: '64%' },
  { id: 4, event: 'Jazz in the Square', date: '2025-05-10', attendees: 210, capacity: 400, fillRate: '53%' },
];

// Determine active status: last active within 30 days of today (using a fixed reference)
const THIRTY_DAYS_AGO = '2025-03-13';
function isActive(lastActive: string) {
  return lastActive >= THIRTY_DAYS_AGO;
}

// ─── Badge variants ───────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  'On Sale': 'success',
  'Active': 'success',
  'Draft': 'warning',
  'Inactive': 'warning',
  'Sold Out': 'error',
};

function StatusBadge({ status }: { status: string }) {
  const variant: 'success' | 'warning' | 'error' = STATUS_VARIANT[status] ?? 'warning';
  return <Badge variant={variant}>{status}</Badge>;
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <Box
      style={{
        flex: 1,
        padding: '20px 24px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        background: '#fff',
        minWidth: 140,
      }}
    >
      <Stack space={1}>
        {tooltip ? (
          <TooltipTrigger>
            <Button variant="quiet">
              <Text>{label} ⓘ</Text>
            </Button>
            <Tooltip>{tooltip}</Tooltip>
          </TooltipTrigger>
        ) : (
          <Text>{label}</Text>
        )}
        <Heading level={3}>{value}</Heading>
      </Stack>
    </Box>
  );
}

// ─── Modal overlay ────────────────────────────────────────────────────────────

function ModalOverlay({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />
      <Box
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          minWidth: 380,
          maxWidth: 520,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        <Stack space={4}>
          <Heading level={3}>{title}</Heading>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <Stack space={6}>
      <Heading level={2}>Dashboard Overview</Heading>
      <Banner variant="info">
        Welcome back! You have 3 events starting this week.
      </Banner>
      <Box style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <SummaryCard label="Total Events" value="24" />
        <SummaryCard label="Tickets Sold" value="1,849" />
        <SummaryCard label="Revenue" value="$45,230" tooltip="Net revenue after fees and refunds" />
        <SummaryCard label="Upcoming" value="8" />
      </Box>
      <Stack space={2}>
        <Heading level={3}>Upcoming Events</Heading>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {UPCOMING_EVENTS.map((ev) => (
              <Table.Row key={ev.id}>
                <Table.Cell>{ev.name}</Table.Cell>
                <Table.Cell>{ev.date}</Table.Cell>
                <Table.Cell>{ev.venue}</Table.Cell>
                <Table.Cell>{ev.tickets}</Table.Cell>
                <Table.Cell><StatusBadge status={ev.status} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );
}

// ─── Events ───────────────────────────────────────────────────────────────────

function EventsPage() {
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState<number>(100);
  const [description, setDescription] = useState('');

  const filtered = useMemo(
    () =>
      EVENTS_LIST.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  function closeCreate() {
    setCreateOpen(false);
    setName(''); setDate(''); setLocation(''); setCapacity(100); setDescription('');
  }

  return (
    <>
      <Stack space={6}>
        <Heading level={2}>Events</Heading>
        <Box style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <SearchField label="Search events" value={search} onChange={setSearch} />
          <Button variant="primary" onPress={() => setCreateOpen(true)}>Create Event</Button>
        </Box>
        <Table aria-label="Events list">
          <Table.Header>
            <Table.Column>Name</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Location</Table.Column>
            <Table.Column>Capacity</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {filtered.map((ev) => (
              <Table.Row key={ev.id}>
                <Table.Cell>{ev.name}</Table.Cell>
                <Table.Cell>{ev.date}</Table.Cell>
                <Table.Cell>{ev.location}</Table.Cell>
                <Table.Cell>{ev.capacity}</Table.Cell>
                <Table.Cell><StatusBadge status={ev.status} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <ModalOverlay open={createOpen} onClose={closeCreate} title="Create Event">
        <Stack space={3}>
          <TextField label="Event Name" isRequired value={name} onChange={setName} />
          <TextField label="Date" type="date" value={date} onChange={setDate} />
          <TextField label="Location" value={location} onChange={setLocation} />
          <NumberField label="Capacity" value={capacity} onChange={setCapacity} />
          <Textarea label="Description" value={description} onChange={setDescription} />
          <Inline space={2}>
            <Button variant="primary" onPress={closeCreate}>Create</Button>
            <Button onPress={closeCreate}>Cancel</Button>
          </Inline>
        </Stack>
      </ModalOverlay>
    </>
  );
}

// ─── Attendees ────────────────────────────────────────────────────────────────

function AttendeesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      ATTENDEES_LIST.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Stack space={6}>
      <Heading level={2}>Attendees</Heading>
      <Box style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <SearchField label="Search attendees" value={search} onChange={setSearch} />
        <Text>{filtered.length} attendees</Text>
      </Box>
      <Table aria-label="Attendees list">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((a) => (
            <Table.Row key={a.id}>
              <Table.Cell>{a.name}</Table.Cell>
              <Table.Cell>{a.email}</Table.Cell>
              <Table.Cell>{a.eventsAttended}</Table.Cell>
              <Table.Cell>{a.lastActive}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={isActive(a.lastActive) ? 'Active' : 'Inactive'} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────

function RevenueTab() {
  return (
    <Stack space={6}>
      <Box style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <SummaryCard label="Total Revenue" value="$45,230" />
        <SummaryCard label="This Month" value="$8,420" />
        <SummaryCard label="Average per Event" value="$1,885" />
        <SummaryCard label="Refunds" value="$1,230" />
      </Box>
      <Banner variant="success">Revenue is up 12% compared to last month.</Banner>
    </Stack>
  );
}

function AttendanceTab() {
  return (
    <Stack space={6}>
      <Box style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <SummaryCard label="Total Attendees" value="3,200" />
        <SummaryCard label="Repeat Visitors" value="890" />
        <SummaryCard label="Average per Event" value="178" />
        <SummaryCard label="No-shows" value="145" />
      </Box>
      <Stack space={2}>
        <Heading level={3}>Top Events by Attendance</Heading>
        <Table aria-label="Top events by attendance">
          <Table.Header>
            <Table.Column>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Attendees</Table.Column>
            <Table.Column>Capacity</Table.Column>
            <Table.Column>Fill Rate</Table.Column>
          </Table.Header>
          <Table.Body>
            {ATTENDANCE_TOP.map((ev) => (
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
  );
}

function OverviewTab() {
  const [open, setOpen] = useState<Record<string, boolean>>({ q1: false, q2: false, q3: false });
  const toggle = (key: string) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      id: 'q1',
      title: 'Q1 Summary',
      body: 'Q1 saw strong ticket sales driven by the Spring Music Festival and the Art Exhibition. Total revenue reached $10,200, a 5% increase year-over-year.',
    },
    {
      id: 'q2',
      title: 'Q2 Summary',
      body: 'Q2 introduced two new event categories and saw a 20% rise in repeat attendees. The Marathon City Run sold out for the first time.',
    },
    {
      id: 'q3',
      title: 'Q3 Summary',
      body: 'Q3 was the strongest quarter on record with revenue of $18,500. The Tech Conference attracted attendees from 12 countries.',
    },
  ];

  return (
    <Stack space={4}>
      <Text>
        This report provides a comprehensive overview of EventHub performance across all tracked quarters.
        Revenue and attendance metrics have shown consistent growth, with Q3 demonstrating the strongest results.
      </Text>
      {sections.map(({ id, title, body }) => (
        <Box key={id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          <Box
            style={{
              padding: '12px 16px',
              background: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button variant="quiet" onPress={() => toggle(id)}>
              {title} {open[id] ? '▲' : '▼'}
            </Button>
          </Box>
          {open[id] && (
            <Box style={{ padding: '12px 16px' }}>
              <Text>{body}</Text>
            </Box>
          )}
        </Box>
      ))}
    </Stack>
  );
}

function ReportsPage() {
  return (
    <Stack space={6}>
      <Heading level={2}>Reports</Heading>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab id="revenue">Revenue</Tabs.Tab>
          <Tabs.Tab id="attendance">Attendance</Tabs.Tab>
          <Tabs.Tab id="overview">Overview</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="revenue">
          <Box style={{ paddingTop: 24 }}><RevenueTab /></Box>
        </Tabs.Panel>
        <Tabs.Panel id="attendance">
          <Box style={{ paddingTop: 24 }}><AttendanceTab /></Box>
        </Tabs.Panel>
        <Tabs.Panel id="overview">
          <Box style={{ paddingTop: 24 }}><OverviewTab /></Box>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────

function GeneralTab() {
  const [orgName, setOrgName] = useState('EventHub Inc.');
  const [email, setEmail] = useState('contact@eventhub.com');
  const [currency, setCurrency] = useState<string>('USD');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Stack space={4}>
      <TextField label="Organization Name" value={orgName} onChange={setOrgName} />
      <TextField label="Contact Email" type="email" value={email} onChange={setEmail} />
      <Select
        label="Default Currency"
        selectedKey={currency}
        onSelectionChange={(k) => setCurrency(String(k))}
      >
        <Select.Option id="USD">USD</Select.Option>
        <Select.Option id="EUR">EUR</Select.Option>
        <Select.Option id="GBP">GBP</Select.Option>
      </Select>
      <Select
        label="Default Timezone"
        selectedKey={timezone}
        onSelectionChange={(k) => setTimezone(String(k))}
      >
        <Select.Option id="UTC">UTC</Select.Option>
        <Select.Option id="CET">CET</Select.Option>
        <Select.Option id="EST">EST</Select.Option>
        <Select.Option id="PST">PST</Select.Option>
      </Select>
      {saved && <Banner variant="success">Settings saved successfully.</Banner>}
      <Button variant="primary" onPress={handleSave}>Save Changes</Button>
    </Stack>
  );
}

function NotificationsTab() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const rows = [
    { label: 'Email Notifications', desc: 'Receive event updates and confirmations via email.', value: emailNotif, onChange: setEmailNotif },
    { label: 'SMS Notifications', desc: 'Get text alerts for urgent event changes.', value: smsNotif, onChange: setSmsNotif },
    { label: 'Weekly Digest', desc: 'A summary of your events and stats every Monday.', value: weeklyDigest, onChange: setWeeklyDigest },
    { label: 'Marketing Emails', desc: 'News, tips, and product updates from EventHub.', value: marketing, onChange: setMarketing },
  ];

  return (
    <Stack space={4}>
      {rows.map(({ label, desc, value, onChange }) => (
        <Box
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f3f4f6',
            gap: 16,
          }}
        >
          <Stack space={1}>
            <Text>{label}</Text>
            <Text>{desc}</Text>
          </Stack>
          <Switch isSelected={value} onChange={onChange} />
        </Box>
      ))}
      {saved && <Banner variant="success">Preferences saved successfully.</Banner>}
      <Button variant="primary" onPress={handleSave}>Save Preferences</Button>
    </Stack>
  );
}

function SettingsPage() {
  return (
    <Stack space={6}>
      <Heading level={2}>Settings</Heading>
      <Tabs>
        <Tabs.List>
          <Tabs.Tab id="general">General</Tabs.Tab>
          <Tabs.Tab id="notifications">Notifications</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="general">
          <Box style={{ paddingTop: 24 }}><GeneralTab /></Box>
        </Tabs.Panel>
        <Tabs.Panel id="notifications">
          <Box style={{ paddingTop: 24 }}><NotificationsTab /></Box>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────

type Page = 'Dashboard' | 'Events' | 'Attendees' | 'Reports' | 'Settings';

const NAV_MAIN: Page[] = ['Dashboard', 'Events', 'Attendees', 'Reports'];

function pageComponent(page: Page) {
  switch (page) {
    case 'Dashboard': return <DashboardPage />;
    case 'Events': return <EventsPage />;
    case 'Attendees': return <AttendeesPage />;
    case 'Reports': return <ReportsPage />;
    case 'Settings': return <SettingsPage />;
  }
}

function SidebarNav({
  items,
  current,
  collapsed,
  onNavigate,
}: {
  items: Page[];
  current: Page;
  collapsed: boolean;
  onNavigate: (p: Page) => void;
}) {
  return (
    <Stack space={1}>
      {items.map((item) => {
        const active = current === item;
        return (
          <Box
            key={item}
            style={{
              borderRadius: 6,
              background: active ? 'rgba(129,140,248,0.2)' : 'transparent',
            }}
          >
            <Button
              variant="quiet"
              onPress={() => onNavigate(item)}
              aria-current={active ? 'page' : undefined}
            >
              {collapsed ? item[0] : item}
            </Button>
          </Box>
        );
      })}
    </Stack>
  );
}

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <Box style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>

      {/* ── Sidebar ── */}
      <Box
        style={{
          width: sidebarWidth,
          minHeight: '100vh',
          background: '#1e1b4b',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* App name */}
        <Box style={{ padding: '20px 16px', color: '#fff' }}>
          {collapsed
            ? <Text>E</Text>
            : <Heading level={2}>EventHub</Heading>
          }
        </Box>

        {/* Main nav */}
        <Box style={{ padding: '0 8px', flex: 1 }}>
          <SidebarNav
            items={NAV_MAIN}
            current={currentPage}
            collapsed={collapsed}
            onNavigate={setCurrentPage}
          />
          <Box style={{ margin: '12px 0' }}>
            <Divider />
          </Box>
          <Box
            style={{
              borderRadius: 6,
              background: currentPage === 'Settings' ? 'rgba(129,140,248,0.2)' : 'transparent',
            }}
          >
            <Button
              variant="quiet"
              onPress={() => setCurrentPage('Settings')}
              aria-current={currentPage === 'Settings' ? 'page' : undefined}
            >
              {collapsed ? 'S' : 'Settings'}
            </Button>
          </Box>
        </Box>

        {/* Help at bottom */}
        <Box style={{ padding: '16px 8px' }}>
          <Button variant="quiet">
            {collapsed ? '?' : 'Help & Support'}
          </Button>
        </Box>
      </Box>

      {/* ── Right side ── */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <Box
          style={{
            height: 60,
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 16,
            flexShrink: 0,
          }}
        >
          <Button variant="quiet" onPress={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar">
            {collapsed ? '▶' : '◀'}
          </Button>

          <Box style={{ flex: 1 }}>
            <Inline space={1}>
              <Text>EventHub</Text>
              <Text>{'>'}</Text>
              <Text>{currentPage}</Text>
            </Inline>
          </Box>

          {/* User account dropdown */}
          <Box style={{ position: 'relative' }}>
            <Button variant="quiet" onPress={() => setAccountMenuOpen((v) => !v)}>
              Account ▾
            </Button>
            {accountMenuOpen && (
              <Box
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  minWidth: 140,
                  zIndex: 200,
                }}
              >
                <Stack space={0}>
                  <Box style={{ padding: '8px 0' }}>
                    <Button
                      variant="quiet"
                      onPress={() => setAccountMenuOpen(false)}
                    >
                      Profile
                    </Button>
                  </Box>
                  <Box style={{ padding: '8px 0' }}>
                    <Button
                      variant="quiet"
                      onPress={() => {
                        setAccountMenuOpen(false);
                        setSignOutOpen(true);
                      }}
                    >
                      Sign out
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Scrollable content */}
        <Box style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          {pageComponent(currentPage)}
        </Box>
      </Box>

      {/* ── Sign-out dialog ── */}
      <ModalOverlay open={signOutOpen} onClose={() => setSignOutOpen(false)} title="Sign out">
        <Text>Are you sure you want to sign out?</Text>
        <Inline space={2}>
          <Button onPress={() => setSignOutOpen(false)}>Cancel</Button>
          <Button variant="primary" onPress={() => setSignOutOpen(false)}>Sign out</Button>
        </Inline>
      </ModalOverlay>

    </Box>
  );
};

export default TestApp;
