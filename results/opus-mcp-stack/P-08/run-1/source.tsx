import { useState } from 'react';
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
  DatePicker,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type StatusVariant = 'success' | 'warning' | 'info' | 'error' | 'default';

const eventStatusVariant: Record<string, StatusVariant> = {
  'On Sale': 'success',
  Draft: 'warning',
  'Sold Out': 'error',
};

interface EventRow {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  tickets: number;
  status: keyof typeof eventStatusVariant;
}

const events: EventRow[] = [
  {
    id: 'evt-1',
    name: 'Summer Music Festival',
    date: 'Jul 12, 2026',
    location: 'Berlin Arena',
    capacity: 5000,
    tickets: 4200,
    status: 'On Sale',
  },
  {
    id: 'evt-2',
    name: 'Tech Conference 2026',
    date: 'Aug 03, 2026',
    location: 'Munich Expo Center',
    capacity: 1200,
    tickets: 1200,
    status: 'Sold Out',
  },
  {
    id: 'evt-3',
    name: 'Indie Film Premiere',
    date: 'Jul 28, 2026',
    location: 'Hamburg Cinema Hall',
    capacity: 600,
    tickets: 180,
    status: 'Draft',
  },
  {
    id: 'evt-4',
    name: 'Startup Pitch Night',
    date: 'Jul 19, 2026',
    location: 'Cologne Hub',
    capacity: 400,
    tickets: 340,
    status: 'On Sale',
  },
  {
    id: 'evt-5',
    name: 'Jazz & Wine Evening',
    date: 'Sep 05, 2026',
    location: 'Frankfurt Riverside',
    capacity: 800,
    tickets: 800,
    status: 'Sold Out',
  },
  {
    id: 'evt-6',
    name: 'Charity Gala Dinner',
    date: 'Sep 21, 2026',
    location: 'Stuttgart Grand Hotel',
    capacity: 300,
    tickets: 95,
    status: 'Draft',
  },
  {
    id: 'evt-7',
    name: 'Marathon Kickoff',
    date: 'Oct 10, 2026',
    location: 'Leipzig City Park',
    capacity: 2500,
    tickets: 1730,
    status: 'On Sale',
  },
];

interface AttendeeRow {
  id: string;
  name: string;
  email: string;
  attended: number;
  lastActive: string; // ISO date
}

const attendees: AttendeeRow[] = [
  {
    id: 'att-1',
    name: 'Anna Schmidt',
    email: 'anna.schmidt@example.com',
    attended: 12,
    lastActive: '2026-06-22',
  },
  {
    id: 'att-2',
    name: 'Max Weber',
    email: 'max.weber@example.com',
    attended: 5,
    lastActive: '2026-06-18',
  },
  {
    id: 'att-3',
    name: 'Lena Fischer',
    email: 'lena.fischer@example.com',
    attended: 8,
    lastActive: '2026-03-04',
  },
  {
    id: 'att-4',
    name: 'Jonas Becker',
    email: 'jonas.becker@example.com',
    attended: 2,
    lastActive: '2026-06-10',
  },
  {
    id: 'att-5',
    name: 'Sophie Wagner',
    email: 'sophie.wagner@example.com',
    attended: 21,
    lastActive: '2025-12-15',
  },
  {
    id: 'att-6',
    name: 'Tim Hoffmann',
    email: 'tim.hoffmann@example.com',
    attended: 1,
    lastActive: '2026-06-25',
  },
  {
    id: 'att-7',
    name: 'Mara Klein',
    email: 'mara.klein@example.com',
    attended: 14,
    lastActive: '2026-02-01',
  },
];

const REFERENCE_DATE = new Date('2026-06-27');

const isActive = (lastActive: string) => {
  const diff =
    (REFERENCE_DATE.getTime() - new Date(lastActive).getTime()) /
    (1000 * 60 * 60 * 24);
  return diff <= 30;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

interface TopEventRow {
  id: string;
  name: string;
  date: string;
  attendees: number;
  capacity: number;
}

const topEvents: TopEventRow[] = [
  {
    id: 'top-1',
    name: 'Summer Music Festival',
    date: 'Jul 12, 2026',
    attendees: 4200,
    capacity: 5000,
  },
  {
    id: 'top-2',
    name: 'Tech Conference 2026',
    date: 'Aug 03, 2026',
    attendees: 1200,
    capacity: 1200,
  },
  {
    id: 'top-3',
    name: 'Marathon Kickoff',
    date: 'Oct 10, 2026',
    attendees: 1730,
    capacity: 2500,
  },
  {
    id: 'top-4',
    name: 'Jazz & Wine Evening',
    date: 'Sep 05, 2026',
    attendees: 800,
    capacity: 800,
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

/* ------------------------------------------------------------------ */
/* Reusable pieces                                                     */
/* ------------------------------------------------------------------ */

const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant={eventStatusVariant[status] ?? 'default'}>{status}</Badge>
);

const StatCard = ({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) => (
  <Card>
    <Inset space={4}>
      <Stack space={1}>
        <Inline space={1} alignY="center">
          <Text weight="medium" color="muted-foreground">
            {label}
          </Text>
          {tooltip ? (
            <Tooltip.Trigger>
              <Button variant="icon" size="small" aria-label={`${label} info`}>
                ⓘ
              </Button>
              <Tooltip>{tooltip}</Tooltip>
            </Tooltip.Trigger>
          ) : null}
        </Inline>
        <Headline level={2}>{value}</Headline>
      </Stack>
    </Inset>
  </Card>
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

    <Tiles tilesWidth="220px" space={4} stretch>
      <StatCard label="Total Events" value="24" />
      <StatCard label="Tickets Sold" value="1,849" />
      <StatCard
        label="Revenue"
        value="$45,230"
        tooltip="Net revenue after fees and refunds"
      />
      <StatCard label="Upcoming" value="8" />
    </Tiles>

    <Stack space={3}>
      <Headline level={2}>Upcoming Events</Headline>
      <Table aria-label="Upcoming events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Event</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Venue</Table.Column>
          <Table.Column alignX="right">Tickets Sold</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {events.map(event => (
            <Table.Row key={event.id}>
              <Table.Cell>
                <Text weight="medium">{event.name}</Text>
              </Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell alignX="right">
                {event.tickets.toLocaleString('en-US')}
              </Table.Cell>
              <Table.Cell>
                <StatusBadge status={event.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  </Stack>
);

const CreateEventDialog = () => (
  <Dialog.Trigger>
    <Button variant="primary">Create Event</Button>
    <Dialog size="medium" closeButton>
      {({ close }) => (
        <>
          <Dialog.Title>Create Event</Dialog.Title>
          <Dialog.Content>
            <Form>
              <Stack space={4}>
                <TextField label="Event Name" name="name" required />
                <DatePicker label="Date" name="date" />
                <TextField label="Location" name="location" />
                <NumberField label="Capacity" name="capacity" minValue={0} />
                <TextArea label="Description" name="description" rows={4} />
              </Stack>
            </Form>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button variant="primary" onPress={close}>
              Create
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  </Dialog.Trigger>
);

const EventsPage = () => {
  const [query, setQuery] = useState('');
  const term = query.trim().toLowerCase();
  const filtered = events.filter(
    event =>
      event.name.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term)
  );

  return (
    <Stack space={6}>
      <Inline alignX="between" alignY="center" space={4}>
        <Headline level={1}>Events</Headline>
        <CreateEventDialog />
      </Inline>

      <SearchField
        label="Search events"
        aria-label="Search events by name or location"
        placeholder="Search by name or location…"
        value={query}
        onChange={setQuery}
        width="full"
      />

      <Table aria-label="Events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column alignX="right">Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(event => (
            <Table.Row key={event.id}>
              <Table.Cell>
                <Text weight="medium">{event.name}</Text>
              </Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell alignX="right">
                {event.capacity.toLocaleString('en-US')}
              </Table.Cell>
              <Table.Cell>
                <StatusBadge status={event.status} />
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
  const term = query.trim().toLowerCase();
  const filtered = attendees.filter(
    attendee =>
      attendee.name.toLowerCase().includes(term) ||
      attendee.email.toLowerCase().includes(term)
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>

      <SearchField
        label="Search attendees"
        aria-label="Search attendees by name or email"
        placeholder="Search by name or email…"
        value={query}
        onChange={setQuery}
        width="full"
      />

      <Text weight="medium">{filtered.length} attendees</Text>

      <Table aria-label="Attendees" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column alignX="right">Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(attendee => {
            const active = isActive(attendee.lastActive);
            return (
              <Table.Row key={attendee.id}>
                <Table.Cell>
                  <Text weight="medium">{attendee.name}</Text>
                </Table.Cell>
                <Table.Cell>{attendee.email}</Table.Cell>
                <Table.Cell alignX="right">{attendee.attended}</Table.Cell>
                <Table.Cell>{formatDate(attendee.lastActive)}</Table.Cell>
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
      <Tabs.List aria-label="Reports views">
        <Tabs.Item id="revenue">Revenue</Tabs.Item>
        <Tabs.Item id="attendance">Attendance</Tabs.Item>
        <Tabs.Item id="overview">Overview</Tabs.Item>
      </Tabs.List>

      <Tabs.TabPanel id="revenue">
        <Stack space={6}>
          <Tiles tilesWidth="220px" space={4} stretch>
            <StatCard label="Total Revenue" value="$45,230" />
            <StatCard label="This Month" value="$8,420" />
            <StatCard label="Average per Event" value="$1,885" />
            <StatCard label="Refunds" value="$1,230" />
          </Tiles>
          <SectionMessage variant="success">
            <SectionMessage.Title>Revenue is up</SectionMessage.Title>
            <SectionMessage.Content>
              Revenue is up 12% compared to last month.
            </SectionMessage.Content>
          </SectionMessage>
        </Stack>
      </Tabs.TabPanel>

      <Tabs.TabPanel id="attendance">
        <Stack space={6}>
          <Tiles tilesWidth="220px" space={4} stretch>
            <StatCard label="Total Attendees" value="3,200" />
            <StatCard label="Repeat Visitors" value="890" />
            <StatCard label="Average per Event" value="178" />
            <StatCard label="No-shows" value="145" />
          </Tiles>
          <Stack space={3}>
            <Headline level={2}>Top Events by Attendance</Headline>
            <Table aria-label="Top events by attendance" selectionMode="none">
              <Table.Header>
                <Table.Column rowHeader>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column alignX="right">Attendees</Table.Column>
                <Table.Column alignX="right">Capacity</Table.Column>
                <Table.Column alignX="right">Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body>
                {topEvents.map(event => (
                  <Table.Row key={event.id}>
                    <Table.Cell>
                      <Text weight="medium">{event.name}</Text>
                    </Table.Cell>
                    <Table.Cell>{event.date}</Table.Cell>
                    <Table.Cell alignX="right">
                      {event.attendees.toLocaleString('en-US')}
                    </Table.Cell>
                    <Table.Cell alignX="right">
                      {event.capacity.toLocaleString('en-US')}
                    </Table.Cell>
                    <Table.Cell alignX="right">
                      {Math.round((event.attendees / event.capacity) * 100)}%
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
            This overview summarizes EventHub performance across the year.
            Ticket sales and attendance have grown steadily quarter over
            quarter, with revenue tracking ahead of projections. Expand a
            section below for the quarterly breakdown.
          </Text>
          <Accordion allowsMultipleExpanded defaultExpandedKeys={['q1']}>
            <Accordion.Item id="q1">
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q1 launched 6 events with 720 tickets sold. Revenue reached
                  $11,400, driven mostly by the winter conference series.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q2">
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q2 saw strong momentum with 9 events and 1,140 tickets sold.
                  The spring festival sold out within two weeks of going live.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q3">
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q3 is on pace to be the strongest quarter yet, led by the
                  Summer Music Festival and a packed schedule of community
                  events.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

const NotificationToggle = ({
  label,
  description,
  defaultSelected,
}: {
  label: string;
  description: string;
  defaultSelected?: boolean;
}) => (
  <Stack space={1}>
    <Switch label={label} defaultSelected={defaultSelected} />
    <Text color="muted-foreground">{description}</Text>
  </Stack>
);

const SettingsPage = () => {
  const [generalSaved, setGeneralSaved] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>

      <Tabs aria-label="Settings sections">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Form
            onSubmit={e => {
              e.preventDefault();
              setGeneralSaved(true);
            }}
          >
            <Stack space={4} alignX="left">
              {generalSaved ? (
                <SectionMessage variant="success">
                  <SectionMessage.Title>Saved</SectionMessage.Title>
                  <SectionMessage.Content>
                    Settings saved successfully.
                  </SectionMessage.Content>
                </SectionMessage>
              ) : null}
              <TextField
                label="Organization Name"
                name="org"
                defaultValue="EventHub Inc."
                width="full"
              />
              <TextField
                label="Contact Email"
                name="email"
                type="email"
                defaultValue="contact@eventhub.example"
                width="full"
              />
              <Select
                label="Default Currency"
                name="currency"
                defaultSelectedKey="usd"
                width="full"
              >
                <Select.Option id="usd">USD</Select.Option>
                <Select.Option id="eur">EUR</Select.Option>
                <Select.Option id="gbp">GBP</Select.Option>
              </Select>
              <Select
                label="Default Timezone"
                name="timezone"
                defaultSelectedKey="utc"
                width="full"
              >
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Stack>
          </Form>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Form
            onSubmit={e => {
              e.preventDefault();
              setPrefsSaved(true);
            }}
          >
            <Stack space={4} alignX="left">
              {prefsSaved ? (
                <SectionMessage variant="success">
                  <SectionMessage.Title>Saved</SectionMessage.Title>
                  <SectionMessage.Content>
                    Preferences saved successfully.
                  </SectionMessage.Content>
                </SectionMessage>
              ) : null}
              <NotificationToggle
                label="Email Notifications"
                description="Receive event updates and confirmations by email."
                defaultSelected
              />
              <NotificationToggle
                label="SMS Notifications"
                description="Get text message alerts for important changes."
              />
              <NotificationToggle
                label="Weekly Digest"
                description="A weekly summary of your events and sales."
                defaultSelected
              />
              <NotificationToggle
                label="Marketing Emails"
                description="Occasional news, tips, and product announcements."
              />
              <Button variant="primary" type="submit">
                Save Preferences
              </Button>
            </Stack>
          </Form>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

const HelpPage = () => (
  <Stack space={4}>
    <Headline level={1}>Help &amp; Support</Headline>
    <Text>
      Need a hand? Browse our documentation or contact the support team for
      assistance with events, attendees, and reporting.
    </Text>
  </Stack>
);

const PageContent = ({ path }: { path: string }) => {
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

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [path, setPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const title = PAGE_TITLES[path] ?? 'Dashboard';

  return (
    <RouterProvider navigate={href => setPath(href)}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" fontSize="lg">
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
              <Sidebar.Nav current={path}>
                <Sidebar.Item href="/help">Help &amp; Support</Sidebar.Item>
              </Sidebar.Nav>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle aria-label="Breadcrumb" alignX="center">
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={path}>{title}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User account">
              <Menu
                label="Account"
                onAction={key => {
                  if (key === 'signout') {
                    setSignOutOpen(true);
                  }
                }}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              <PageContent path={path} />
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      <Dialog
        role="alertdialog"
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
      >
        <Dialog.Title>Are you sure you want to sign out?</Dialog.Title>
        <Dialog.Actions>
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="primary" slot="close">
            Sign out
          </Button>
        </Dialog.Actions>
      </Dialog>
    </RouterProvider>
  );
};

export default TestApp;
