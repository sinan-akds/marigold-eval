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
  DatePicker,
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
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type EventStatus = 'On Sale' | 'Draft' | 'Sold Out';

const STATUS_VARIANT: Record<EventStatus, 'success' | 'warning' | 'error'> = {
  'On Sale': 'success',
  Draft: 'warning',
  'Sold Out': 'error',
};

const upcomingEvents: {
  name: string;
  date: string;
  venue: string;
  sold: number;
  status: EventStatus;
}[] = [
  { name: 'Summer Music Festival', date: 'Jul 4, 2026', venue: 'Olympia Park', sold: 1240, status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Jul 9, 2026', venue: 'Congress Center', sold: 480, status: 'On Sale' },
  { name: 'Indie Film Night', date: 'Jul 12, 2026', venue: 'Arthouse Cinema', sold: 0, status: 'Draft' },
  { name: 'Championship Final', date: 'Jul 15, 2026', venue: 'City Arena', sold: 5000, status: 'Sold Out' },
  { name: 'Food & Wine Expo', date: 'Jul 18, 2026', venue: 'Market Hall', sold: 320, status: 'On Sale' },
  { name: 'Comedy Special', date: 'Jul 22, 2026', venue: 'Theatre Royal', sold: 0, status: 'Draft' },
  { name: 'Jazz Evening', date: 'Jul 25, 2026', venue: 'Blue Note Club', sold: 210, status: 'Sold Out' },
];

const allEvents: {
  name: string;
  date: string;
  location: string;
  capacity: number;
  status: EventStatus;
}[] = [
  { name: 'Summer Music Festival', date: 'Jul 4, 2026', location: 'Munich', capacity: 5000, status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Jul 9, 2026', location: 'Berlin', capacity: 1200, status: 'On Sale' },
  { name: 'Indie Film Night', date: 'Jul 12, 2026', location: 'Hamburg', capacity: 300, status: 'Draft' },
  { name: 'Championship Final', date: 'Jul 15, 2026', location: 'Cologne', capacity: 5000, status: 'Sold Out' },
  { name: 'Food & Wine Expo', date: 'Jul 18, 2026', location: 'Stuttgart', capacity: 800, status: 'On Sale' },
  { name: 'Comedy Special', date: 'Jul 22, 2026', location: 'Frankfurt', capacity: 600, status: 'Draft' },
  { name: 'Jazz Evening', date: 'Jul 25, 2026', location: 'Leipzig', capacity: 250, status: 'Sold Out' },
];

const attendees: {
  name: string;
  email: string;
  attended: number;
  lastActive: string;
}[] = [
  { name: 'Anna Schmidt', email: 'anna.schmidt@example.com', attended: 12, lastActive: '2026-06-25' },
  { name: 'Max Weber', email: 'max.weber@example.com', attended: 8, lastActive: '2026-06-10' },
  { name: 'Lena Fischer', email: 'lena.fischer@example.com', attended: 5, lastActive: '2026-04-02' },
  { name: 'Tom Becker', email: 'tom.becker@example.com', attended: 3, lastActive: '2026-06-20' },
  { name: 'Julia Wagner', email: 'julia.wagner@example.com', attended: 15, lastActive: '2026-03-15' },
  { name: 'Paul Hoffmann', email: 'paul.hoffmann@example.com', attended: 2, lastActive: '2026-06-02' },
  { name: 'Sara Klein', email: 'sara.klein@example.com', attended: 7, lastActive: '2026-01-10' },
];

const topEvents = [
  { name: 'Championship Final', date: 'May 15, 2026', attendees: 4980, capacity: 5000 },
  { name: 'Summer Music Festival', date: 'Jun 4, 2026', attendees: 4120, capacity: 5000 },
  { name: 'Tech Conference 2026', date: 'Apr 9, 2026', attendees: 1080, capacity: 1200 },
  { name: 'Food & Wine Expo', date: 'Mar 18, 2026', attendees: 640, capacity: 800 },
  { name: 'Jazz Evening', date: 'Feb 25, 2026', attendees: 240, capacity: 250 },
];

const REFERENCE_DATE = new Date('2026-06-27');

const isAttendeeActive = (lastActive: string) => {
  const diff = REFERENCE_DATE.getTime() - new Date(lastActive).getTime();
  return diff <= 30 * 24 * 60 * 60 * 1000;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const PAGES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

const StatusBadge = ({ status }: { status: EventStatus }) => (
  <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
);

const SummaryCard = ({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) => (
  <Card p={5} stretch>
    <Stack space={2}>
      <Inline space={1} alignY="center">
        <Text weight="medium" size="sm">
          {label}
        </Text>
        {tooltip ? (
          <Tooltip.Trigger>
            <Button variant="ghost" size="small" aria-label={`More info about ${label}`}>
              ⓘ
            </Button>
            <Tooltip>{tooltip}</Tooltip>
          </Tooltip.Trigger>
        ) : null}
      </Inline>
      <Headline level={2}>{value}</Headline>
    </Stack>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
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

    <Tiles tilesWidth="200px" space={4} stretch equalHeight>
      <SummaryCard label="Total Events" value="24" />
      <SummaryCard label="Tickets Sold" value="1,849" />
      <SummaryCard
        label="Revenue"
        value="$45,230"
        tooltip="Net revenue after fees and refunds"
      />
      <SummaryCard label="Upcoming" value="8" />
    </Tiles>

    <Stack space={3}>
      <Headline level={3}>Upcoming Events</Headline>
      <Table aria-label="Upcoming events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Event</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Venue</Table.Column>
          <Table.Column>Tickets Sold</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {upcomingEvents.map(event => (
            <Table.Row key={event.name}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.venue}</Table.Cell>
              <Table.Cell>{event.sold.toLocaleString('en-US')}</Table.Cell>
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

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

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
                <DatePicker label="Date" />
                <TextField label="Location" name="location" />
                <NumberField label="Capacity" name="capacity" minValue={0} />
                <TextArea label="Description" name="description" rows={3} />
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
  const filtered = allEvents.filter(event => {
    const q = query.toLowerCase();
    return (
      event.name.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q)
    );
  });

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>

      <Inline space={4} alignY="center" alignX="between">
        <SearchField
          label="Search events"
          aria-label="Search events by name or location"
          placeholder="Search by name or location"
          value={query}
          onChange={setQuery}
          width={80}
        />
        <CreateEventDialog />
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
          {filtered.map(event => (
            <Table.Row key={event.name}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell>{event.capacity.toLocaleString('en-US')}</Table.Cell>
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

/* ------------------------------------------------------------------ */
/* Attendees                                                           */
/* ------------------------------------------------------------------ */

const AttendeesPage = () => {
  const [query, setQuery] = useState('');
  const filtered = attendees.filter(attendee => {
    const q = query.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(q) ||
      attendee.email.toLowerCase().includes(q)
    );
  });

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>

      <SearchField
        label="Search attendees"
        aria-label="Search attendees by name or email"
        placeholder="Search by name or email"
        value={query}
        onChange={setQuery}
        width={80}
      />

      <Text weight="medium">{filtered.length} attendees</Text>

      <Table aria-label="Attendees" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(attendee => {
            const active = isAttendeeActive(attendee.lastActive);
            return (
              <Table.Row key={attendee.email}>
                <Table.Cell>{attendee.name}</Table.Cell>
                <Table.Cell>{attendee.email}</Table.Cell>
                <Table.Cell>{attendee.attended}</Table.Cell>
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

/* ------------------------------------------------------------------ */
/* Reports                                                             */
/* ------------------------------------------------------------------ */

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
          <Tiles tilesWidth="200px" space={4} stretch equalHeight>
            <SummaryCard label="Total Revenue" value="$45,230" />
            <SummaryCard label="This Month" value="$8,420" />
            <SummaryCard label="Average per Event" value="$1,885" />
            <SummaryCard label="Refunds" value="$1,230" />
          </Tiles>
          <SectionMessage variant="success">
            <SectionMessage.Title>Trending up</SectionMessage.Title>
            <SectionMessage.Content>
              Revenue is up 12% compared to last month.
            </SectionMessage.Content>
          </SectionMessage>
        </Stack>
      </Tabs.TabPanel>

      <Tabs.TabPanel id="attendance">
        <Stack space={6}>
          <Tiles tilesWidth="200px" space={4} stretch equalHeight>
            <SummaryCard label="Total Attendees" value="3,200" />
            <SummaryCard label="Repeat Visitors" value="890" />
            <SummaryCard label="Average per Event" value="178" />
            <SummaryCard label="No-shows" value="145" />
          </Tiles>
          <Stack space={3}>
            <Headline level={3}>Top Events by Attendance</Headline>
            <Table aria-label="Top events by attendance" selectionMode="none">
              <Table.Header>
                <Table.Column rowHeader>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Attendees</Table.Column>
                <Table.Column>Capacity</Table.Column>
                <Table.Column>Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body>
                {topEvents.map(event => (
                  <Table.Row key={event.name}>
                    <Table.Cell>{event.name}</Table.Cell>
                    <Table.Cell>{event.date}</Table.Cell>
                    <Table.Cell>
                      {event.attendees.toLocaleString('en-US')}
                    </Table.Cell>
                    <Table.Cell>
                      {event.capacity.toLocaleString('en-US')}
                    </Table.Cell>
                    <Table.Cell>
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
            This overview summarizes EventHub performance across the year. Ticket
            sales and attendance have grown steadily each quarter, with revenue
            tracking ahead of last year's pace. Expand a section below for the
            detailed quarterly breakdown.
          </Text>
          <Accordion>
            <Accordion.Item id="q1">
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                Q1 saw 12 events and $9,800 in revenue. Attendance was steady
                with strong repeat-visitor numbers driven by the winter concert
                series.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q2">
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                Q2 delivered 18 events and $15,600 in revenue. The spring
                festivals attracted record audiences and a 12% month-over-month
                revenue increase.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q3">
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                Q3 is on track with 8 upcoming events. Early ticket sales suggest
                another strong quarter, led by the summer music festival.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const GeneralSettings = () => {
  const [saved, setSaved] = useState(false);

  return (
    <Stack space={4}>
      {saved ? (
        <SectionMessage variant="success">
          <SectionMessage.Title>Saved</SectionMessage.Title>
          <SectionMessage.Content>
            Settings saved successfully.
          </SectionMessage.Content>
        </SectionMessage>
      ) : null}
      <Form
        onSubmit={e => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <Stack space={4} alignX="left">
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
          <Select label="Default Currency" defaultSelectedKey="usd" width={96}>
            <Select.Option id="usd">USD</Select.Option>
            <Select.Option id="eur">EUR</Select.Option>
            <Select.Option id="gbp">GBP</Select.Option>
          </Select>
          <Select label="Default Timezone" defaultSelectedKey="utc" width={96}>
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
    </Stack>
  );
};

const NOTIFICATION_OPTIONS = [
  {
    id: 'email',
    label: 'Email Notifications',
    description: 'Receive event updates and reminders by email.',
  },
  {
    id: 'sms',
    label: 'SMS Notifications',
    description: 'Get time-sensitive alerts as text messages.',
  },
  {
    id: 'digest',
    label: 'Weekly Digest',
    description: 'A weekly summary of activity across your events.',
  },
  {
    id: 'marketing',
    label: 'Marketing Emails',
    description: 'News about features, tips, and special offers.',
  },
] as const;

const NotificationSettings = () => {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    email: true,
    sms: false,
    digest: true,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <Stack space={5}>
      {saved ? (
        <SectionMessage variant="success">
          <SectionMessage.Title>Saved</SectionMessage.Title>
          <SectionMessage.Content>
            Notification preferences saved successfully.
          </SectionMessage.Content>
        </SectionMessage>
      ) : null}

      <Stack space={4}>
        {NOTIFICATION_OPTIONS.map(option => (
          <Stack key={option.id} space={1}>
            <Switch
              label={option.label}
              selected={prefs[option.id]}
              onChange={value => {
                setPrefs(prev => ({ ...prev, [option.id]: value }));
                setSaved(false);
              }}
            />
            <Text size="sm">{option.description}</Text>
          </Stack>
        ))}
      </Stack>

      <Inline>
        <Button variant="primary" onPress={() => setSaved(true)}>
          Save Preferences
        </Button>
      </Inline>
    </Stack>
  );
};

const SettingsPage = () => (
  <Stack space={6}>
    <Headline level={1}>Settings</Headline>
    <Tabs aria-label="Settings sections">
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

/* ------------------------------------------------------------------ */
/* Help                                                                */
/* ------------------------------------------------------------------ */

const HelpPage = () => (
  <Stack space={4}>
    <Headline level={1}>Help &amp; Support</Headline>
    <Text>
      Need a hand? Browse our documentation or reach out to the support team and
      we will get back to you within one business day.
    </Text>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [page, setPage] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
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

  return (
    <RouterProvider navigate={setPage}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="lg">
                EventHub
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav current={page}>
              <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
              <Sidebar.Item href="/events">Events</Sidebar.Item>
              <Sidebar.Item href="/attendees">Attendees</Sidebar.Item>
              <Sidebar.Item href="/reports">Reports</Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item href="/settings">Settings</Sidebar.Item>
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Sidebar.Nav current={page}>
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
                <Breadcrumbs.Item href={page}>
                  {PAGES[page] ?? 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User actions">
              <Menu
                label="Account"
                variant="ghost"
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
            <Inset space={6}>{renderPage()}</Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      <Dialog
        role="alertdialog"
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
      >
        {({ close }) => (
          <>
            <Dialog.Title>Are you sure you want to sign out?</Dialog.Title>
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
