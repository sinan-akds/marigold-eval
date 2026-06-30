import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import {
  Accordion,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  Form,
  Headline,
  Inline,
  Inset,
  Link,
  Menu,
  NumberField,
  NumericFormat,
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
  DatePicker,
  Tiles,
  Tooltip,
  TopNavigation,
  parseFormData,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type EventStatus = 'On Sale' | 'Draft' | 'Sold Out';

interface EventRow {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  status: EventStatus;
}

const statusVariant: Record<EventStatus, 'success' | 'warning' | 'error'> = {
  'On Sale': 'success',
  Draft: 'warning',
  'Sold Out': 'error',
};

const dashboardEvents: {
  id: string;
  name: string;
  date: string;
  venue: string;
  ticketsSold: number;
  status: EventStatus;
}[] = [
  { id: 'd1', name: 'Summer Music Festival', date: '2026-07-12', venue: 'Central Park', ticketsSold: 1200, status: 'On Sale' },
  { id: 'd2', name: 'Tech Conference 2026', date: '2026-07-18', venue: 'Convention Center', ticketsSold: 850, status: 'On Sale' },
  { id: 'd3', name: 'Jazz Night', date: '2026-07-05', venue: 'Blue Note Hall', ticketsSold: 320, status: 'Sold Out' },
  { id: 'd4', name: 'Startup Pitch Day', date: '2026-08-02', venue: 'Innovation Hub', ticketsSold: 0, status: 'Draft' },
  { id: 'd5', name: 'Food & Wine Expo', date: '2026-07-25', venue: 'Riverside Pavilion', ticketsSold: 540, status: 'On Sale' },
  { id: 'd6', name: 'Comedy Gala', date: '2026-07-09', venue: 'Grand Theater', ticketsSold: 600, status: 'Sold Out' },
  { id: 'd7', name: 'Art Workshop', date: '2026-08-10', venue: 'Studio 5', ticketsSold: 45, status: 'Draft' },
];

const initialEvents: EventRow[] = [
  { id: 'e1', name: 'Summer Music Festival', date: '2026-07-12', location: 'Central Park', capacity: 5000, status: 'On Sale' },
  { id: 'e2', name: 'Tech Conference 2026', date: '2026-07-18', location: 'Convention Center', capacity: 1000, status: 'On Sale' },
  { id: 'e3', name: 'Jazz Night', date: '2026-07-05', location: 'Blue Note Hall', capacity: 320, status: 'Sold Out' },
  { id: 'e4', name: 'Startup Pitch Day', date: '2026-08-02', location: 'Innovation Hub', capacity: 200, status: 'Draft' },
  { id: 'e5', name: 'Food & Wine Expo', date: '2026-07-25', location: 'Riverside Pavilion', capacity: 800, status: 'On Sale' },
  { id: 'e6', name: 'Comedy Gala', date: '2026-07-09', location: 'Grand Theater', capacity: 600, status: 'Sold Out' },
  { id: 'e7', name: 'Art Workshop', date: '2026-08-10', location: 'Studio 5', capacity: 50, status: 'Draft' },
];

interface AttendeeRow {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
}

const attendees: AttendeeRow[] = [
  { id: 'a1', name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 12, lastActive: '2026-06-20' },
  { id: 'a2', name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 5, lastActive: '2026-06-25' },
  { id: 'a3', name: 'Carol White', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-04-15' },
  { id: 'a4', name: 'David Brown', email: 'david@example.com', eventsAttended: 3, lastActive: '2026-06-10' },
  { id: 'a5', name: 'Eva Green', email: 'eva@example.com', eventsAttended: 20, lastActive: '2026-03-02' },
  { id: 'a6', name: 'Frank Miller', email: 'frank@example.com', eventsAttended: 7, lastActive: '2026-06-26' },
  { id: 'a7', name: 'Grace Lee', email: 'grace@example.com', eventsAttended: 1, lastActive: '2026-05-01' },
];

const TODAY = new Date('2026-06-27');

const isActive = (lastActive: string) => {
  const diffDays = (TODAY.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
};

const topEvents = [
  { id: 't1', name: 'Summer Music Festival', date: '2026-07-12', attendees: 4800, capacity: 5000, fillRate: '96%' },
  { id: 't2', name: 'Tech Conference 2026', date: '2026-07-18', attendees: 920, capacity: 1000, fillRate: '92%' },
  { id: 't3', name: 'Comedy Gala', date: '2026-07-09', attendees: 600, capacity: 600, fillRate: '100%' },
  { id: 't4', name: 'Food & Wine Expo', date: '2026-07-25', attendees: 640, capacity: 800, fillRate: '80%' },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const SummaryCard = ({
  label,
  value,
  info,
}: {
  label: string;
  value: ReactNode;
  info?: string;
}) => (
  <Card p={4} stretch>
    <Stack space={2}>
      <Inline space={1} alignY="center">
        <Text size="small" weight="medium">
          {label}
        </Text>
        {info ? (
          <Tooltip.Trigger>
            <Button variant="ghost" size="small" aria-label={`${label} info`}>
              ⓘ
            </Button>
            <Tooltip>{info}</Tooltip>
          </Tooltip.Trigger>
        ) : null}
      </Inline>
      <Headline level={2}>{value}</Headline>
    </Stack>
  </Card>
);

const EventStatusBadge = ({ status }: { status: EventStatus }) => (
  <Badge variant={statusVariant[status]}>{status}</Badge>
);

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const DashboardPage = () => (
  <Stack space={6}>
    <Headline level={1}>Dashboard Overview</Headline>
    <SectionMessage variant="info">
      <SectionMessage.Title>Welcome back!</SectionMessage.Title>
      <SectionMessage.Content>
        You have 3 events starting this week.
      </SectionMessage.Content>
    </SectionMessage>

    <Tiles space={4} tilesWidth="220px" stretch>
      <SummaryCard label="Total Events" value={<NumericFormat value={24} />} />
      <SummaryCard label="Tickets Sold" value={<NumericFormat value={1849} />} />
      <SummaryCard
        label="Revenue"
        value={<NumericFormat value={45230} style="currency" currency="USD" maximumFractionDigits={0} />}
        info="Net revenue after fees and refunds"
      />
      <SummaryCard label="Upcoming" value={<NumericFormat value={8} />} />
    </Tiles>

    <Stack space={3}>
      <Headline level={2}>Upcoming Events</Headline>
      <Table aria-label="Upcoming Events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Event</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Venue</Table.Column>
          <Table.Column alignX="right">Tickets Sold</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {dashboardEvents.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.venue}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={row.ticketsSold} />
              </Table.Cell>
              <Table.Cell>
                <EventStatusBadge status={row.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  </Stack>
);

const CreateEventDialog = ({
  onCreate,
}: {
  onCreate: (event: EventRow) => void;
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>, close: () => void) => {
    e.preventDefault();
    const data = parseFormData(e) as Record<string, string>;
    onCreate({
      id: `new-${Date.now()}`,
      name: data.name || 'Untitled Event',
      date: data.date || 'TBD',
      location: data.location || '—',
      capacity: data.capacity ? Number(data.capacity) : 0,
      status: 'Draft',
    });
    close();
  };

  return (
    <Dialog.Trigger>
      <Button variant="primary">Create Event</Button>
      <Dialog size="medium" closeButton>
        {({ close }) => (
          <Form onSubmit={e => handleSubmit(e, close)}>
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Event Name" name="name" required autoFocus />
                <DatePicker label="Date" name="date" />
                <TextField label="Location" name="location" />
                <NumberField label="Capacity" name="capacity" minValue={0} />
                <TextArea label="Description" name="description" rows={3} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Dialog.Actions>
          </Form>
        )}
      </Dialog>
    </Dialog.Trigger>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState<EventRow[]>(initialEvents);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? events.filter(
        e =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
      )
    : events;

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="center" alignX="between">
        <SearchField
          aria-label="Filter events by name or location"
          placeholder="Search events…"
          value={query}
          onChange={setQuery}
          width={72}
        />
        <CreateEventDialog
          onCreate={event => setEvents(prev => [...prev, event])}
        />
      </Inline>
      <Table aria-label="Events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column alignX="right">Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.date}</Table.Cell>
              <Table.Cell>{row.location}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={row.capacity} />
              </Table.Cell>
              <Table.Cell>
                <EventStatusBadge status={row.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const AttendeesPage = () => {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = q
    ? attendees.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      )
    : attendees;

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="center" alignX="between">
        <SearchField
          aria-label="Filter attendees by name or email"
          placeholder="Search attendees…"
          value={query}
          onChange={setQuery}
          width={72}
        />
        <Text weight="medium">{filtered.length} attendees</Text>
      </Inline>
      <Table aria-label="Attendees" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column alignX="right">Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(row => {
            const active = isActive(row.lastActive);
            return (
              <Table.Row key={row.id}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.email}</Table.Cell>
                <Table.Cell>
                  <NumericFormat value={row.eventsAttended} />
                </Table.Cell>
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
};

const ReportsPage = () => (
  <Stack space={6}>
    <Headline level={1}>Reports</Headline>
    <Tabs aria-label="Reports views">
      <Tabs.List aria-label="Report categories">
        <Tabs.Item id="revenue">Revenue</Tabs.Item>
        <Tabs.Item id="attendance">Attendance</Tabs.Item>
        <Tabs.Item id="overview">Overview</Tabs.Item>
      </Tabs.List>

      <Tabs.TabPanel id="revenue">
        <Stack space={6}>
          <Tiles space={4} tilesWidth="220px" stretch>
            <SummaryCard
              label="Total Revenue"
              value={<NumericFormat value={45230} style="currency" currency="USD" maximumFractionDigits={0} />}
            />
            <SummaryCard
              label="This Month"
              value={<NumericFormat value={8420} style="currency" currency="USD" maximumFractionDigits={0} />}
            />
            <SummaryCard
              label="Average per Event"
              value={<NumericFormat value={1885} style="currency" currency="USD" maximumFractionDigits={0} />}
            />
            <SummaryCard
              label="Refunds"
              value={<NumericFormat value={1230} style="currency" currency="USD" maximumFractionDigits={0} />}
            />
          </Tiles>
          <SectionMessage variant="success">
            <SectionMessage.Title>Revenue trending up</SectionMessage.Title>
            <SectionMessage.Content>
              Revenue is up 12% compared to last month.
            </SectionMessage.Content>
          </SectionMessage>
        </Stack>
      </Tabs.TabPanel>

      <Tabs.TabPanel id="attendance">
        <Stack space={6}>
          <Tiles space={4} tilesWidth="220px" stretch>
            <SummaryCard label="Total Attendees" value={<NumericFormat value={3200} />} />
            <SummaryCard label="Repeat Visitors" value={<NumericFormat value={890} />} />
            <SummaryCard label="Average per Event" value={<NumericFormat value={178} />} />
            <SummaryCard label="No-shows" value={<NumericFormat value={145} />} />
          </Tiles>
          <Stack space={3}>
            <Headline level={2}>Top Events by Attendance</Headline>
            <Table aria-label="Top Events by Attendance" selectionMode="none">
              <Table.Header>
                <Table.Column rowHeader>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column alignX="right">Attendees</Table.Column>
                <Table.Column alignX="right">Capacity</Table.Column>
                <Table.Column alignX="right">Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body>
                {topEvents.map(row => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.name}</Table.Cell>
                    <Table.Cell>{row.date}</Table.Cell>
                    <Table.Cell>
                      <NumericFormat value={row.attendees} />
                    </Table.Cell>
                    <Table.Cell>
                      <NumericFormat value={row.capacity} />
                    </Table.Cell>
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
            This overview summarizes performance across the year. Ticket sales
            and attendance have grown steadily quarter over quarter, with
            revenue consistently outpacing projections. Expand each section
            below for a detailed quarterly breakdown.
          </Text>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                The first quarter laid a strong foundation with 12 events and
                steady ticket sales, driven primarily by recurring community
                gatherings and early-bird promotions.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                The second quarter saw a 12% increase in revenue, boosted by two
                large festivals and improved sponsorship deals that expanded our
                reach into new audiences.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                The third quarter is projected to be the strongest yet, with
                several sold-out events already on the calendar and growing
                repeat-visitor numbers signalling strong retention.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

const GeneralSettings = () => {
  const [saved, setSaved] = useState(false);
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        setSaved(true);
      }}
    >
      <Stack space={4} alignX="left">
        {saved ? (
          <SectionMessage variant="success">
            <SectionMessage.Title>Saved</SectionMessage.Title>
            <SectionMessage.Content>
              Settings saved successfully.
            </SectionMessage.Content>
          </SectionMessage>
        ) : null}
        <TextField
          label="Organization Name"
          name="organization"
          defaultValue="EventHub Inc."
          width={96}
        />
        <TextField
          label="Contact Email"
          name="email"
          type="email"
          defaultValue="contact@eventhub.com"
          width={96}
        />
        <Select label="Default Currency" name="currency" defaultSelectedKey="USD" width={96}>
          <Select.Option id="USD">USD</Select.Option>
          <Select.Option id="EUR">EUR</Select.Option>
          <Select.Option id="GBP">GBP</Select.Option>
        </Select>
        <Select label="Default Timezone" name="timezone" defaultSelectedKey="UTC" width={96}>
          <Select.Option id="UTC">UTC</Select.Option>
          <Select.Option id="CET">CET</Select.Option>
          <Select.Option id="EST">EST</Select.Option>
          <Select.Option id="PST">PST</Select.Option>
        </Select>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Stack>
    </Form>
  );
};

const notificationOptions = [
  { id: 'email', label: 'Email Notifications', description: 'Receive event updates and alerts by email.', defaultSelected: true },
  { id: 'sms', label: 'SMS Notifications', description: 'Get time-sensitive alerts via text message.', defaultSelected: false },
  { id: 'digest', label: 'Weekly Digest', description: 'A weekly summary of activity across your events.', defaultSelected: true },
  { id: 'marketing', label: 'Marketing Emails', description: 'News, tips, and product announcements.', defaultSelected: false },
];

const NotificationSettings = () => {
  const [saved, setSaved] = useState(false);
  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        setSaved(true);
      }}
    >
      <Stack space={4} alignX="left">
        {saved ? (
          <SectionMessage variant="success">
            <SectionMessage.Title>Saved</SectionMessage.Title>
            <SectionMessage.Content>
              Preferences saved successfully.
            </SectionMessage.Content>
          </SectionMessage>
        ) : null}
        {notificationOptions.map(option => (
          <Stack key={option.id} space={1}>
            <Switch
              name={option.id}
              label={option.label}
              defaultSelected={option.defaultSelected}
            />
            <Text size="small">{option.description}</Text>
          </Stack>
        ))}
        <Button variant="primary" type="submit">
          Save Preferences
        </Button>
      </Stack>
    </Form>
  );
};

const SettingsPage = () => (
  <Stack space={6}>
    <Headline level={1}>Settings</Headline>
    <Tabs aria-label="Settings sections">
      <Tabs.List aria-label="Settings categories">
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

const HelpPage = () => (
  <Stack space={4}>
    <Headline level={1}>Help & Support</Headline>
    <Text>
      Need a hand? Browse our documentation or reach out to the support team and
      we'll get back to you within one business day.
    </Text>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const renderPage = (path: string) => {
  switch (path) {
    case '/events':
      return <EventsPage />;
    case '/attendees':
      return <AttendeesPage />;
    case '/reports':
      return <ReportsPage />;
    case '/settings':
      return <SettingsPage />;
    case '/help':
      return <HelpPage />;
    case '/dashboard':
    default:
      return <DashboardPage />;
  }
};

const TestApp = () => {
  const [path, setPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const handleAccountAction = (key: React.Key) => {
    if (key === 'signout') {
      setSignOutOpen(true);
    }
  };

  return (
    <RouterProvider navigate={setPath}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="large">
                EventHub
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav current={path}>
              <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
              <Sidebar.Item href="/events">Events</Sidebar.Item>
              <Sidebar.Item href="/attendees">Attendees</Sidebar.Item>
              <Sidebar.Item href="/reports">Reports</Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item href="/settings">Settings</Sidebar.Item>
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Link href="/help">Help &amp; Support</Link>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle aria-label="Breadcrumbs">
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={path}>
                  {pageTitles[path] ?? 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User actions">
              <Menu label="Account" onAction={handleAccountAction}>
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>{renderPage(path)}</Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      <Dialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        role="alertdialog"
        size="xsmall"
      >
        {({ close }) => (
          <>
            <Dialog.Title>Sign out</Dialog.Title>
            <Dialog.Content>
              Are you sure you want to sign out?
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" onPress={close}>
                Sign out
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </RouterProvider>
  );
};

export default TestApp;
