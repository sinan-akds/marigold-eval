import React, { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Text,
  Heading,
  Button,
  Dialog,
  DialogTrigger,
  TextField,
  NumberField,
  DatePicker,
  Select,
  Option,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Switch,
  Tooltip,
  TooltipTrigger,
  Divider,
  Menu,
  MenuTrigger,
  MenuItem,
  SearchField,
} from '@marigold/components';

type PageId = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

// ── Data ─────────────────────────────────────────────────────────────────────

const UPCOMING_EVENTS = [
  { id: 'ue1', event: 'Tech Summit 2024', date: 'Jun 15, 2024', venue: 'Convention Center', tickets: 850, status: 'On Sale' },
  { id: 'ue2', event: 'Music Festival', date: 'Jun 18, 2024', venue: 'City Park', tickets: 1200, status: 'On Sale' },
  { id: 'ue3', event: 'Art Exhibition', date: 'Jun 20, 2024', venue: 'Gallery Hall', tickets: 300, status: 'Draft' },
  { id: 'ue4', event: 'Startup Pitch Night', date: 'Jun 22, 2024', venue: 'Innovation Hub', tickets: 200, status: 'Sold Out' },
  { id: 'ue5', event: 'Food & Wine Expo', date: 'Jun 25, 2024', venue: 'Expo Center', tickets: 650, status: 'On Sale' },
  { id: 'ue6', event: 'City Marathon 2024', date: 'Jun 28, 2024', venue: 'City Streets', tickets: 2000, status: 'On Sale' },
];

const EVENTS_TABLE = [
  { id: 'ev1', name: 'Tech Summit 2024', date: 'Jun 15, 2024', location: 'New York, NY', capacity: 1000, status: 'On Sale' },
  { id: 'ev2', name: 'Music Festival', date: 'Jun 18, 2024', location: 'Austin, TX', capacity: 5000, status: 'On Sale' },
  { id: 'ev3', name: 'Art Exhibition', date: 'Jun 20, 2024', location: 'Chicago, IL', capacity: 400, status: 'Draft' },
  { id: 'ev4', name: 'Startup Pitch Night', date: 'Jun 22, 2024', location: 'San Francisco, CA', capacity: 250, status: 'Sold Out' },
  { id: 'ev5', name: 'Food & Wine Expo', date: 'Jun 25, 2024', location: 'Miami, FL', capacity: 800, status: 'On Sale' },
  { id: 'ev6', name: 'City Marathon 2024', date: 'Jun 28, 2024', location: 'Boston, MA', capacity: 3000, status: 'On Sale' },
];

const ATTENDEES_TABLE = [
  { id: 'at1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2024-06-10', status: 'Active' },
  { id: 'at2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 3, lastActive: '2024-06-01', status: 'Active' },
  { id: 'at3', name: 'Carol Williams', email: 'carol@example.com', eventsAttended: 8, lastActive: '2024-04-15', status: 'Inactive' },
  { id: 'at4', name: 'David Brown', email: 'david@example.com', eventsAttended: 1, lastActive: '2024-06-12', status: 'Active' },
  { id: 'at5', name: 'Eva Martinez', email: 'eva@example.com', eventsAttended: 12, lastActive: '2024-05-20', status: 'Inactive' },
  { id: 'at6', name: 'Frank Lee', email: 'frank@example.com', eventsAttended: 4, lastActive: '2024-06-08', status: 'Active' },
];

const TOP_ATTENDANCE = [
  { id: 'ta1', event: 'Music Festival', date: 'Jun 18, 2024', attendees: 4800, capacity: 5000, fillRate: '96%' },
  { id: 'ta2', event: 'City Marathon 2024', date: 'Jun 28, 2024', attendees: 2800, capacity: 3000, fillRate: '93%' },
  { id: 'ta3', event: 'Tech Summit 2024', date: 'Jun 15, 2024', attendees: 920, capacity: 1000, fillRate: '92%' },
  { id: 'ta4', event: 'Food & Wine Expo', date: 'Jun 25, 2024', attendees: 720, capacity: 800, fillRate: '90%' },
];

// ── Local UI primitives (wrapping Marigold components) ────────────────────────

function Banner({ variant, children }: { variant: 'info' | 'success'; children: React.ReactNode }) {
  const bg = variant === 'success' ? '#f0fdf4' : '#eff6ff';
  const border = variant === 'success' ? '#86efac' : '#93c5fd';
  const color = variant === 'success' ? '#166534' : '#1e40af';
  return (
    <Stack
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        padding: '12px 16px',
      }}
    >
      <Text style={{ color, fontSize: 14 }}>{children}</Text>
    </Stack>
  );
}

function StatusChip({ status }: { status: string }) {
  const isPositive = status === 'On Sale' || status === 'Active';
  const isWarning = status === 'Sold Out' || status === 'Inactive';
  const bg = isPositive ? '#dcfce7' : isWarning ? '#fef3c7' : '#f3f4f6';
  const color = isPositive ? '#166534' : isWarning ? '#92400e' : '#374151';
  return (
    <Text
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {status}
    </Text>
  );
}

function StatCard({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <Stack
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 16,
        flex: 1,
        minWidth: 140,
        background: '#fff',
      }}
    >
      <Inline style={{ alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 13, color: '#6b7280' }}>{label}</Text>
        {tooltip && (
          <TooltipTrigger>
            <Button
              variant="text"
              style={{ padding: '0 2px', minWidth: 'auto', fontSize: 12, lineHeight: 1 }}
            >
              ⓘ
            </Button>
            <Tooltip>{tooltip}</Tooltip>
          </TooltipTrigger>
        )}
      </Inline>
      <Text style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{value}</Text>
    </Stack>
  );
}

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Stack style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
      <Button
        variant="text"
        onPress={() => setOpen(o => !o)}
        style={{ textAlign: 'left', padding: '12px 16px', width: '100%', fontWeight: 600 }}
      >
        {open ? '▾' : '▸'} {title}
      </Button>
      {open && (
        <Stack style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb' }}>
          {children}
        </Stack>
      )}
    </Stack>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <Stack space={6}>
      <Heading level={1}>Dashboard Overview</Heading>
      <Banner variant="info">Welcome back! You have 3 events starting this week.</Banner>
      <Inline style={{ gap: 16, flexWrap: 'wrap' }}>
        <StatCard label="Total Events" value="24" />
        <StatCard label="Tickets Sold" value="1,849" />
        <StatCard label="Revenue" value="$45,230" tooltip="Net revenue after fees and refunds" />
        <StatCard label="Upcoming" value="8" />
      </Inline>
      <Heading level={2}>Upcoming Events</Heading>
      <Table aria-label="Upcoming Events">
        <TableHeader>
          <Column id="event" isRowHeader>Event</Column>
          <Column id="date">Date</Column>
          <Column id="venue">Venue</Column>
          <Column id="tickets">Tickets Sold</Column>
          <Column id="status">Status</Column>
        </TableHeader>
        <TableBody>
          {UPCOMING_EVENTS.map(r => (
            <Row key={r.id} id={r.id}>
              <Cell>{r.event}</Cell>
              <Cell>{r.date}</Cell>
              <Cell>{r.venue}</Cell>
              <Cell>{r.tickets}</Cell>
              <Cell><StatusChip status={r.status} /></Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}

// ── Events ────────────────────────────────────────────────────────────────────

function EventsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      EVENTS_TABLE.filter(
        e =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.location.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Stack space={4}>
      <Heading level={1}>Events</Heading>
      <Inline style={{ gap: 12, alignItems: 'flex-end' }}>
        <Stack style={{ flex: 1 }}>
          <SearchField
            label="Search events"
            value={search}
            onChange={setSearch}
            placeholder="Search by name or location…"
          />
        </Stack>
        <DialogTrigger>
          <Button variant="primary">Create Event</Button>
          <Dialog>
            {({ close }: { close: () => void }) => (
              <Stack space={4} style={{ padding: 24, minWidth: 420 }}>
                <Heading level={2}>Create Event</Heading>
                <TextField label="Event Name" isRequired />
                <DatePicker label="Date" />
                <TextField label="Location" />
                <NumberField label="Capacity" minValue={0} />
                <TextField label="Description" />
                <Inline style={{ gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                  <Button onPress={close}>Cancel</Button>
                  <Button variant="primary" onPress={close}>Create</Button>
                </Inline>
              </Stack>
            )}
          </Dialog>
        </DialogTrigger>
      </Inline>
      <Table aria-label="Events">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
          <Column id="date">Date</Column>
          <Column id="location">Location</Column>
          <Column id="capacity">Capacity</Column>
          <Column id="status">Status</Column>
        </TableHeader>
        <TableBody>
          {filtered.map(r => (
            <Row key={r.id} id={r.id}>
              <Cell>{r.name}</Cell>
              <Cell>{r.date}</Cell>
              <Cell>{r.location}</Cell>
              <Cell>{r.capacity}</Cell>
              <Cell><StatusChip status={r.status} /></Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}

// ── Attendees ─────────────────────────────────────────────────────────────────

function AttendeesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      ATTENDEES_TABLE.filter(
        a =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <Stack space={4}>
      <Heading level={1}>Attendees</Heading>
      <Inline style={{ gap: 12, alignItems: 'flex-end' }}>
        <Stack style={{ flex: 1 }}>
          <SearchField
            label="Search attendees"
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email…"
          />
        </Stack>
        <Text style={{ paddingBottom: 6, whiteSpace: 'nowrap' }}>{filtered.length} attendees</Text>
      </Inline>
      <Table aria-label="Attendees">
        <TableHeader>
          <Column id="name" isRowHeader>Name</Column>
          <Column id="email">Email</Column>
          <Column id="eventsAttended">Events Attended</Column>
          <Column id="lastActive">Last Active</Column>
          <Column id="status">Status</Column>
        </TableHeader>
        <TableBody>
          {filtered.map(r => (
            <Row key={r.id} id={r.id}>
              <Cell>{r.name}</Cell>
              <Cell>{r.email}</Cell>
              <Cell>{r.eventsAttended}</Cell>
              <Cell>{r.lastActive}</Cell>
              <Cell><StatusChip status={r.status} /></Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────

function ReportsPage() {
  return (
    <Stack space={4}>
      <Heading level={1}>Reports</Heading>
      <Tabs>
        <TabList aria-label="Report types">
          <Tab id="revenue">Revenue</Tab>
          <Tab id="attendance">Attendance</Tab>
          <Tab id="overview">Overview</Tab>
        </TabList>

        <TabPanel id="revenue">
          <Stack space={4} style={{ paddingTop: 16 }}>
            <Inline style={{ gap: 16, flexWrap: 'wrap' }}>
              <StatCard label="Total Revenue" value="$45,230" />
              <StatCard label="This Month" value="$8,420" />
              <StatCard label="Average per Event" value="$1,885" />
              <StatCard label="Refunds" value="$1,230" />
            </Inline>
            <Banner variant="success">Revenue is up 12% compared to last month.</Banner>
          </Stack>
        </TabPanel>

        <TabPanel id="attendance">
          <Stack space={4} style={{ paddingTop: 16 }}>
            <Inline style={{ gap: 16, flexWrap: 'wrap' }}>
              <StatCard label="Total Attendees" value="3,200" />
              <StatCard label="Repeat Visitors" value="890" />
              <StatCard label="Average per Event" value="178" />
              <StatCard label="No-shows" value="145" />
            </Inline>
            <Heading level={2}>Top Events by Attendance</Heading>
            <Table aria-label="Top Events by Attendance">
              <TableHeader>
                <Column id="event" isRowHeader>Event</Column>
                <Column id="date">Date</Column>
                <Column id="attendees">Attendees</Column>
                <Column id="capacity">Capacity</Column>
                <Column id="fillRate">Fill Rate</Column>
              </TableHeader>
              <TableBody>
                {TOP_ATTENDANCE.map(r => (
                  <Row key={r.id} id={r.id}>
                    <Cell>{r.event}</Cell>
                    <Cell>{r.date}</Cell>
                    <Cell>{r.attendees}</Cell>
                    <Cell>{r.capacity}</Cell>
                    <Cell>{r.fillRate}</Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </TabPanel>

        <TabPanel id="overview">
          <Stack space={4} style={{ paddingTop: 16 }}>
            <Text>
              This report provides a comprehensive overview of event performance across all quarters.
              Overall metrics show strong growth in attendance and revenue with consistent improvement
              in fill rates throughout the year.
            </Text>
            <CollapsibleSection title="Q1 Summary">
              <Text>
                Q1 hosted 6 events generating $12,300 in revenue. Average attendance was 145 per
                event with a fill rate of 82%, setting a strong foundation for the year.
              </Text>
            </CollapsibleSection>
            <CollapsibleSection title="Q2 Summary">
              <Text>
                Q2 showed significant growth with 8 events and $18,450 in revenue. The Music
                Festival was the standout, achieving 96% capacity and becoming our highest-grossing
                single event to date.
              </Text>
            </CollapsibleSection>
            <CollapsibleSection title="Q3 Summary">
              <Text>
                Q3 projections indicate continued growth with 10 events planned and an expected
                revenue of $22,000 based on current ticket sales trends and pre-registration numbers.
              </Text>
            </CollapsibleSection>
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

function SettingsPage() {
  const [orgName, setOrgName] = useState('Acme Events Co.');
  const [contactEmail, setContactEmail] = useState('admin@acmeevents.com');
  const [currency, setCurrency] = useState<string>('USD');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [generalSaved, setGeneralSaved] = useState(false);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  function saveGeneral() {
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 3000);
  }

  function savePrefs() {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  }

  return (
    <Stack space={4}>
      <Heading level={1}>Settings</Heading>
      <Tabs>
        <TabList aria-label="Settings sections">
          <Tab id="general">General</Tab>
          <Tab id="notifications">Notifications</Tab>
        </TabList>

        <TabPanel id="general">
          <Stack space={4} style={{ paddingTop: 16, maxWidth: 480 }}>
            {generalSaved && <Banner variant="success">Settings saved successfully.</Banner>}
            <TextField label="Organization Name" value={orgName} onChange={setOrgName} />
            <TextField label="Contact Email" type="email" value={contactEmail} onChange={setContactEmail} />
            <Select
              label="Default Currency"
              selectedKey={currency}
              onSelectionChange={key => setCurrency(key as string)}
            >
              <Option id="USD">USD</Option>
              <Option id="EUR">EUR</Option>
              <Option id="GBP">GBP</Option>
            </Select>
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={key => setTimezone(key as string)}
            >
              <Option id="UTC">UTC</Option>
              <Option id="CET">CET</Option>
              <Option id="EST">EST</Option>
              <Option id="PST">PST</Option>
            </Select>
            <Button variant="primary" onPress={saveGeneral}>Save Changes</Button>
          </Stack>
        </TabPanel>

        <TabPanel id="notifications">
          <Stack space={4} style={{ paddingTop: 16, maxWidth: 480 }}>
            {prefsSaved && <Banner variant="success">Preferences saved successfully.</Banner>}

            <Stack space={1}>
              <Switch isSelected={emailNotif} onChange={setEmailNotif}>
                Email Notifications
              </Switch>
              <Text style={{ fontSize: 13, color: '#6b7280' }}>
                Receive notifications about events and updates via email.
              </Text>
            </Stack>

            <Stack space={1}>
              <Switch isSelected={smsNotif} onChange={setSmsNotif}>
                SMS Notifications
              </Switch>
              <Text style={{ fontSize: 13, color: '#6b7280' }}>
                Get text message alerts for important event reminders.
              </Text>
            </Stack>

            <Stack space={1}>
              <Switch isSelected={weeklyDigest} onChange={setWeeklyDigest}>
                Weekly Digest
              </Switch>
              <Text style={{ fontSize: 13, color: '#6b7280' }}>
                Receive a weekly summary of event performance and insights.
              </Text>
            </Stack>

            <Stack space={1}>
              <Switch isSelected={marketing} onChange={setMarketing}>
                Marketing Emails
              </Switch>
              <Text style={{ fontSize: 13, color: '#6b7280' }}>
                Get product updates, tips, and promotional offers from EventHub.
              </Text>
            </Stack>

            <Button variant="primary" onPress={savePrefs}>Save Preferences</Button>
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'events', label: 'Events' },
  { id: 'attendees', label: 'Attendees' },
  { id: 'reports', label: 'Reports' },
];

const PAGE_LABEL: Record<PageId, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  attendees: 'Attendees',
  reports: 'Reports',
  settings: 'Settings',
};

export default function TestApp() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  const sidebarWidth = collapsed ? 56 : 220;

  return (
    <Inline
      style={{
        height: '100vh',
        overflow: 'hidden',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        gap: 0,
      }}
    >
      {/* ── Sidebar ─────────────────────────────────── */}
      <Stack
        style={{
          width: sidebarWidth,
          minHeight: '100vh',
          borderRight: '1px solid #e5e7eb',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.2s ease',
          background: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <Stack style={{ padding: '18px 14px 12px', borderBottom: '1px solid #e5e7eb' }}>
          <Text style={{ fontWeight: 700, fontSize: collapsed ? 14 : 17, color: '#111827', textAlign: collapsed ? 'center' : 'left' }}>
            {collapsed ? 'E' : 'EventHub'}
          </Text>
        </Stack>

        <Stack style={{ flex: 1, paddingTop: 8 }}>
          {NAV_ITEMS.map(item => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'primary' : 'text'}
              onPress={() => setCurrentPage(item.id)}
              style={{
                width: '100%',
                textAlign: collapsed ? 'center' : 'left',
                padding: collapsed ? '10px 0' : '10px 16px',
                borderRadius: 0,
                justifyContent: collapsed ? 'center' : 'flex-start',
                fontSize: 14,
              }}
            >
              {collapsed ? item.label[0] : item.label}
            </Button>
          ))}

          <Divider />

          <Button
            variant={currentPage === 'settings' ? 'primary' : 'text'}
            onPress={() => setCurrentPage('settings')}
            style={{
              width: '100%',
              textAlign: collapsed ? 'center' : 'left',
              padding: collapsed ? '10px 0' : '10px 16px',
              borderRadius: 0,
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: 14,
            }}
          >
            {collapsed ? 'S' : 'Settings'}
          </Button>
        </Stack>

        <Stack style={{ borderTop: '1px solid #e5e7eb' }}>
          <Button
            variant="text"
            style={{
              width: '100%',
              textAlign: collapsed ? 'center' : 'left',
              padding: collapsed ? '12px 0' : '12px 16px',
              borderRadius: 0,
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: 14,
            }}
          >
            {collapsed ? '?' : 'Help & Support'}
          </Button>
        </Stack>
      </Stack>

      {/* ── Main ──────────────────────────────────────── */}
      <Stack
        style={{
          flex: 1,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <Inline
          style={{
            height: 56,
            borderBottom: '1px solid #e5e7eb',
            padding: '0 16px',
            alignItems: 'center',
            display: 'flex',
            gap: 12,
            flexShrink: 0,
            background: '#fff',
            flexWrap: 'nowrap',
          }}
        >
          <Button
            variant="text"
            onPress={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </Button>

          <Inline style={{ flex: 1, alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
            <Text style={{ color: '#6b7280', fontSize: 14 }}>EventHub</Text>
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>›</Text>
            <Text style={{ fontWeight: 600, fontSize: 14 }}>{PAGE_LABEL[currentPage]}</Text>
          </Inline>

          <MenuTrigger>
            <Button variant="secondary">Account ▾</Button>
            <Menu
              onAction={key => {
                if (key === 'signout') setSignOutOpen(true);
              }}
            >
              <MenuItem id="profile">Profile</MenuItem>
              <MenuItem id="signout">Sign out</MenuItem>
            </Menu>
          </MenuTrigger>
        </Inline>

        {/* Scrollable content */}
        <Stack style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'events' && <EventsPage />}
          {currentPage === 'attendees' && <AttendeesPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </Stack>
      </Stack>

      {/* ── Sign-out dialog (controlled) ──────────────── */}
      <DialogTrigger isOpen={signOutOpen} onOpenChange={setSignOutOpen}>
        <Button aria-hidden style={{ display: 'none' }}>hidden</Button>
        <Dialog>
          {({ close }: { close: () => void }) => (
            <Stack space={4} style={{ padding: 24, minWidth: 360 }}>
              <Heading level={2}>Sign Out</Heading>
              <Text>Are you sure you want to sign out?</Text>
              <Inline style={{ gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <Button onPress={close}>Cancel</Button>
                <Button variant="primary" onPress={close}>Sign out</Button>
              </Inline>
            </Stack>
          )}
        </Dialog>
      </DialogTrigger>
    </Inline>
  );
}
