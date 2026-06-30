import { useMemo, useState, type Key } from 'react';
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
  Tooltip,
  TopNavigation,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type EventStatus = 'On Sale' | 'Draft' | 'Sold Out';

const statusVariant: Record<EventStatus, 'success' | 'warning' | 'info'> = {
  'On Sale': 'success',
  Draft: 'warning',
  'Sold Out': 'info',
};

const StatusBadge = ({ status }: { status: EventStatus }) => (
  <Badge variant={statusVariant[status]}>{status}</Badge>
);

const dashboardEvents: {
  name: string;
  date: string;
  venue: string;
  sold: string;
  status: EventStatus;
}[] = [
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', venue: 'Riverside Park', sold: '1,200', status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Jul 18, 2026', venue: 'Convention Center', sold: '850', status: 'On Sale' },
  { name: 'Indie Film Night', date: 'Jul 22, 2026', venue: 'The Grand Theatre', sold: '0', status: 'Draft' },
  { name: 'Championship Final', date: 'Jul 25, 2026', venue: 'City Stadium', sold: '40,000', status: 'Sold Out' },
  { name: 'Food & Wine Expo', date: 'Aug 02, 2026', venue: 'Harbour Hall', sold: '620', status: 'On Sale' },
  { name: 'Startup Pitch Day', date: 'Aug 09, 2026', venue: 'Innovation Hub', sold: '0', status: 'Draft' },
];

const eventsData: {
  name: string;
  date: string;
  location: string;
  capacity: string;
  status: EventStatus;
}[] = [
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', location: 'Berlin', capacity: '5,000', status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Jul 18, 2026', location: 'Munich', capacity: '1,200', status: 'On Sale' },
  { name: 'Indie Film Night', date: 'Jul 22, 2026', location: 'Hamburg', capacity: '300', status: 'Draft' },
  { name: 'Championship Final', date: 'Jul 25, 2026', location: 'Cologne', capacity: '40,000', status: 'Sold Out' },
  { name: 'Food & Wine Expo', date: 'Aug 02, 2026', location: 'Frankfurt', capacity: '900', status: 'On Sale' },
  { name: 'Startup Pitch Day', date: 'Aug 09, 2026', location: 'Berlin', capacity: '250', status: 'Draft' },
  { name: 'Jazz in the Park', date: 'Aug 15, 2026', location: 'Stuttgart', capacity: '2,000', status: 'On Sale' },
];

const TODAY = new Date('2026-06-27');

const attendeesData: {
  name: string;
  email: string;
  events: number;
  lastActive: string;
}[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', events: 12, lastActive: '2026-06-25' },
  { name: 'Bob Williams', email: 'bob@example.com', events: 5, lastActive: '2026-06-10' },
  { name: 'Carol Martinez', email: 'carol@example.com', events: 3, lastActive: '2026-04-15' },
  { name: 'David Chen', email: 'david@example.com', events: 8, lastActive: '2026-06-20' },
  { name: 'Eve Thompson', email: 'eve@example.com', events: 1, lastActive: '2026-03-02' },
  { name: 'Frank Müller', email: 'frank@example.com', events: 9, lastActive: '2026-06-01' },
];

const isActive = (lastActive: string) => {
  const diffDays = (TODAY.getTime() - new Date(lastActive).getTime()) / 86_400_000;
  return diffDays <= 30;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const topEvents = [
  { name: 'Championship Final', date: 'Jul 25, 2026', attendees: 38500, capacity: 40000 },
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', attendees: 4600, capacity: 5000 },
  { name: 'Jazz in the Park', date: 'Aug 15, 2026', attendees: 1750, capacity: 2000 },
  { name: 'Tech Conference 2026', date: 'Jul 18, 2026', attendees: 980, capacity: 1200 },
];

/* ------------------------------------------------------------------ */
/* Summary card                                                        */
/* ------------------------------------------------------------------ */

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
    <Inset space="square-relaxed">
      <Stack space={2}>
        <Inline space={1} alignY="center">
          <Text size="sm" color="text-muted">
            {label}
          </Text>
          {hint ? (
            <Tooltip.Trigger>
              <Button variant="ghost" size="small" aria-label={`${label} info`}>
                ⓘ
              </Button>
              <Tooltip>{hint}</Tooltip>
            </Tooltip.Trigger>
          ) : null}
        </Inline>
        <Text size="3xl" weight="bold">
          {value}
        </Text>
      </Stack>
    </Inset>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

const DashboardPage = () => (
  <Stack space={6}>
    <Headline level={2}>Dashboard Overview</Headline>

    <SectionMessage variant="info">
      <SectionMessage.Title>Welcome back!</SectionMessage.Title>
      <SectionMessage.Content>
        You have 3 events starting this week.
      </SectionMessage.Content>
    </SectionMessage>

    <Columns columns={[1, 1, 1, 1]} space={5} collapseAt="900px">
      <SummaryCard label="Total Events" value="24" />
      <SummaryCard label="Tickets Sold" value="1,849" />
      <SummaryCard
        label="Revenue"
        value="$45,230"
        hint="Net revenue after fees and refunds"
      />
      <SummaryCard label="Upcoming" value="8" />
    </Columns>

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
          {dashboardEvents.map(event => (
            <Table.Row key={event.name}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.venue}</Table.Cell>
              <Table.Cell>{event.sold}</Table.Cell>
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

const EventsPage = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventsData;
    return eventsData.filter(
      e =>
        e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Stack space={6}>
      <Headline level={2}>Events</Headline>

      <Inline space={4} alignY="bottom" alignX="between">
        <SearchField
          label="Search events"
          aria-label="Search events by name or location"
          placeholder="Search by name or location"
          value={query}
          onChange={setQuery}
          width="80"
        />
        <Button variant="primary" onPress={() => setOpen(true)}>
          Create Event
        </Button>
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
              <Table.Cell>{event.capacity}</Table.Cell>
              <Table.Cell>
                <StatusBadge status={event.status} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={open} onOpenChange={setOpen} closeButton size="medium">
        {({ close }) => (
          <>
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Form>
                <Stack space={4}>
                  <TextField label="Event Name" required autoFocus />
                  <DatePicker label="Date" />
                  <TextField label="Location" />
                  <NumberField label="Capacity" minValue={0} />
                  <TextArea label="Description" rows={4} />
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
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Attendees                                                           */
/* ------------------------------------------------------------------ */

const AttendeesPage = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attendeesData;
    return attendeesData.filter(
      a =>
        a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Stack space={6}>
      <Headline level={2}>Attendees</Headline>

      <SearchField
        label="Search attendees"
        aria-label="Search attendees by name or email"
        placeholder="Search by name or email"
        value={query}
        onChange={setQuery}
        width="80"
      />

      <Text weight="medium">
        {filtered.length} {filtered.length === 1 ? 'attendee' : 'attendees'}
      </Text>

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
            const active = isActive(attendee.lastActive);
            return (
              <Table.Row key={attendee.email}>
                <Table.Cell>{attendee.name}</Table.Cell>
                <Table.Cell>{attendee.email}</Table.Cell>
                <Table.Cell>{attendee.events}</Table.Cell>
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
    <Headline level={2}>Reports</Headline>
    <Tabs aria-label="Reports views">
      <Tabs.List aria-label="Report categories">
        <Tabs.Item id="revenue">Revenue</Tabs.Item>
        <Tabs.Item id="attendance">Attendance</Tabs.Item>
        <Tabs.Item id="overview">Overview</Tabs.Item>
      </Tabs.List>

      <Tabs.TabPanel id="revenue">
        <Stack space={6}>
          <Columns columns={[1, 1, 1, 1]} space={5} collapseAt="900px">
            <SummaryCard label="Total Revenue" value="$45,230" />
            <SummaryCard label="This Month" value="$8,420" />
            <SummaryCard label="Average per Event" value="$1,885" />
            <SummaryCard label="Refunds" value="$1,230" />
          </Columns>
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
          <Columns columns={[1, 1, 1, 1]} space={5} collapseAt="900px">
            <SummaryCard label="Total Attendees" value="3,200" />
            <SummaryCard label="Repeat Visitors" value="890" />
            <SummaryCard label="Average per Event" value="178" />
            <SummaryCard label="No-shows" value="145" />
          </Columns>
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
                    <Table.Cell>{event.attendees.toLocaleString('en-US')}</Table.Cell>
                    <Table.Cell>{event.capacity.toLocaleString('en-US')}</Table.Cell>
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
            This overview summarizes EventHub performance across the year so far.
            Ticket sales and attendance have grown steadily each quarter, driven
            by larger venues and an expanding catalogue of recurring events.
          </Text>
          <Accordion>
            <Accordion.Item>
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                The first quarter focused on rebuilding momentum after the winter
                break, with 6 events and strong early-bird ticket demand.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                The second quarter delivered record revenue, led by the Tech
                Conference and a sold-out Championship Final.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item>
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                The third quarter is on track to beat all previous numbers, with
                several festivals already approaching capacity.
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

const notificationSettings = [
  { id: 'email', label: 'Email Notifications', description: 'Receive event updates and alerts by email.' },
  { id: 'sms', label: 'SMS Notifications', description: 'Get time-sensitive alerts via text message.' },
  { id: 'digest', label: 'Weekly Digest', description: 'A summary of activity delivered every Monday.' },
  { id: 'marketing', label: 'Marketing Emails', description: 'News about features and promotional offers.' },
];

const SettingsPage = () => {
  const [savedGeneral, setSavedGeneral] = useState(false);
  const [savedPrefs, setSavedPrefs] = useState(false);

  return (
    <Stack space={6}>
      <Headline level={2}>Settings</Headline>
      <Tabs aria-label="Settings sections">
        <Tabs.List aria-label="Settings categories">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            {savedGeneral ? (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>
                  Settings saved successfully.
                </SectionMessage.Content>
              </SectionMessage>
            ) : null}
            <Form>
              <Stack space={4}>
                <TextField label="Organization Name" defaultValue="EventHub Inc." />
                <TextField
                  label="Contact Email"
                  type="email"
                  defaultValue="hello@eventhub.com"
                />
                <Select label="Default Currency" defaultSelectedKey="usd" width="80">
                  <Select.Option id="usd">USD</Select.Option>
                  <Select.Option id="eur">EUR</Select.Option>
                  <Select.Option id="gbp">GBP</Select.Option>
                </Select>
                <Select label="Default Timezone" defaultSelectedKey="utc" width="80">
                  <Select.Option id="utc">UTC</Select.Option>
                  <Select.Option id="cet">CET</Select.Option>
                  <Select.Option id="est">EST</Select.Option>
                  <Select.Option id="pst">PST</Select.Option>
                </Select>
                <Inline>
                  <Button variant="primary" onPress={() => setSavedGeneral(true)}>
                    Save Changes
                  </Button>
                </Inline>
              </Stack>
            </Form>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={5}>
            {savedPrefs ? (
              <SectionMessage variant="success">
                <SectionMessage.Title>Saved</SectionMessage.Title>
                <SectionMessage.Content>
                  Preferences saved successfully.
                </SectionMessage.Content>
              </SectionMessage>
            ) : null}
            <Stack space={4}>
              {notificationSettings.map(setting => (
                <Stack key={setting.id} space={1}>
                  <Switch label={setting.label} />
                  <Text size="sm" color="text-muted">
                    {setting.description}
                  </Text>
                </Stack>
              ))}
            </Stack>
            <Inline>
              <Button variant="primary" onPress={() => setSavedPrefs(true)}>
                Save Preferences
              </Button>
            </Inline>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

const TestApp = () => {
  const [path, setPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const renderPage = () => {
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
        return (
          <Stack space={4}>
            <Headline level={2}>Help &amp; Support</Headline>
            <Text>
              Need a hand? Browse our documentation or reach out to the support
              team and we'll get back to you within one business day.
            </Text>
          </Stack>
        );
      default:
        return <DashboardPage />;
    }
  };

  const handleUserAction = (key: Key) => {
    if (key === 'signout') {
      setSignOutOpen(true);
    }
  };

  return (
    <RouterProvider navigate={(href: string) => setPath(href)}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="lg">
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
            <TopNavigation.Middle>
              <Breadcrumbs aria-label="Breadcrumbs">
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={path}>
                  {pageTitles[path] ?? 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu label="Account" onAction={handleUserAction}>
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space="square-relaxed">{renderPage()}</Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      <Dialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        role="alertdialog"
        size="xsmall"
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
