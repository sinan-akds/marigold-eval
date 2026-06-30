import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Columns,
  Dialog,
  DatePicker,
  Divider,
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

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

type StatusVariant = 'success' | 'warning' | 'info' | 'error' | 'default';

const eventStatusVariant: Record<string, StatusVariant> = {
  'On Sale': 'success',
  Draft: 'warning',
  'Sold Out': 'info',
};

const dashboardEvents = [
  { name: 'Summer Music Festival', date: '2026-07-04', venue: 'Riverside Park', sold: 1240, status: 'On Sale' },
  { name: 'Tech Conference 2026', date: '2026-07-12', venue: 'Convention Center', sold: 860, status: 'On Sale' },
  { name: 'Indie Film Night', date: '2026-07-18', venue: 'Grand Theatre', sold: 0, status: 'Draft' },
  { name: 'Food & Wine Expo', date: '2026-07-22', venue: 'Harbor Hall', sold: 540, status: 'On Sale' },
  { name: 'Championship Finals', date: '2026-07-25', venue: 'City Arena', sold: 5000, status: 'Sold Out' },
  { name: 'Autumn Art Fair', date: '2026-08-02', venue: 'Museum Plaza', sold: 0, status: 'Draft' },
];

const eventsData = [
  { name: 'Summer Music Festival', date: '2026-07-04', location: 'Riverside Park', capacity: 2000, status: 'On Sale' },
  { name: 'Tech Conference 2026', date: '2026-07-12', location: 'Convention Center', capacity: 1200, status: 'On Sale' },
  { name: 'Indie Film Night', date: '2026-07-18', location: 'Grand Theatre', capacity: 300, status: 'Draft' },
  { name: 'Food & Wine Expo', date: '2026-07-22', location: 'Harbor Hall', capacity: 800, status: 'On Sale' },
  { name: 'Championship Finals', date: '2026-07-25', location: 'City Arena', capacity: 5000, status: 'Sold Out' },
  { name: 'Autumn Art Fair', date: '2026-08-02', location: 'Museum Plaza', capacity: 600, status: 'Draft' },
  { name: 'Comedy Gala', date: '2026-08-09', location: 'Downtown Club', capacity: 450, status: 'On Sale' },
];

const TODAY = new Date('2026-06-27');

const isWithinLast30Days = (iso: string) => {
  const diffDays = (TODAY.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 30;
};

const attendeesData = [
  { name: 'Anna Schmidt', email: 'anna.schmidt@example.com', events: 12, lastActive: '2026-06-25' },
  { name: 'Max Weber', email: 'max.weber@example.com', events: 4, lastActive: '2026-06-20' },
  { name: 'Lena Fischer', email: 'lena.fischer@example.com', events: 7, lastActive: '2026-05-02' },
  { name: 'Tom Becker', email: 'tom.becker@example.com', events: 2, lastActive: '2026-06-15' },
  { name: 'Sara Klein', email: 'sara.klein@example.com', events: 9, lastActive: '2026-03-11' },
  { name: 'Jonas Wolf', email: 'jonas.wolf@example.com', events: 5, lastActive: '2026-06-26' },
];

const topEventsByAttendance = [
  { name: 'Championship Finals', date: '2026-05-25', attendees: 4980, capacity: 5000 },
  { name: 'Summer Music Festival', date: '2026-06-04', attendees: 1820, capacity: 2000 },
  { name: 'Tech Conference 2026', date: '2026-04-12', attendees: 1010, capacity: 1200 },
  { name: 'Food & Wine Expo', date: '2026-06-22', attendees: 690, capacity: 800 },
];

const PAGES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant={eventStatusVariant[status] ?? 'default'}>{status}</Badge>
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
  <Card p={4}>
    <Stack space={2}>
      <Inline space={1} alignY="center">
        <Text variant="muted" size="sm">
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
  </Card>
);

/* -------------------------------------------------------------------------- */
/* Pages                                                                      */
/* -------------------------------------------------------------------------- */

const DashboardPage = () => (
  <Stack space={6}>
    <Headline level={1}>Dashboard Overview</Headline>
    <SectionMessage variant="info">
      <SectionMessage.Title>Welcome back!</SectionMessage.Title>
      <SectionMessage.Content>
        You have 3 events starting this week.
      </SectionMessage.Content>
    </SectionMessage>

    <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="48em">
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
      <Headline level={2}>Upcoming Events</Headline>
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
                <NumberField label="Capacity" minValue={0} />
                <TextArea label="Description" rows={3} />
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
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const filtered = eventsData.filter(
    event =>
      event.name.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>
      <Inline space={4} alignY="center" alignX="between">
        <SearchField
          label="Search events"
          aria-label="Search events by name or location"
          placeholder="Search by name or location"
          value={search}
          onChange={setSearch}
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

const AttendeesPage = () => {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const filtered = attendeesData.filter(
    attendee =>
      attendee.name.toLowerCase().includes(query) ||
      attendee.email.toLowerCase().includes(query)
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>
      <Inline space={4} alignY="center" alignX="between">
        <SearchField
          label="Search attendees"
          aria-label="Search attendees by name or email"
          placeholder="Search by name or email"
          value={search}
          onChange={setSearch}
          width={80}
        />
        <Text weight="medium">{filtered.length} attendees</Text>
      </Inline>

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
            const active = isWithinLast30Days(attendee.lastActive);
            return (
              <Table.Row key={attendee.email}>
                <Table.Cell>{attendee.name}</Table.Cell>
                <Table.Cell>{attendee.email}</Table.Cell>
                <Table.Cell>{attendee.events}</Table.Cell>
                <Table.Cell>{attendee.lastActive}</Table.Cell>
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
          <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="48em">
            <SummaryCard label="Total Revenue" value="$45,230" />
            <SummaryCard label="This Month" value="$8,420" />
            <SummaryCard label="Average per Event" value="$1,885" />
            <SummaryCard label="Refunds" value="$1,230" />
          </Columns>
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
          <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="48em">
            <SummaryCard label="Total Attendees" value="3,200" />
            <SummaryCard label="Repeat Visitors" value="890" />
            <SummaryCard label="Average per Event" value="178" />
            <SummaryCard label="No-shows" value="145" />
          </Columns>
          <Stack space={3}>
            <Headline level={2}>Top Events by Attendance</Headline>
            <Table aria-label="Top events by attendance" selectionMode="none">
              <Table.Header>
                <Table.Column rowHeader>Event</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Attendees</Table.Column>
                <Table.Column>Capacity</Table.Column>
                <Table.Column>Fill Rate</Table.Column>
              </Table.Header>
              <Table.Body>
                {topEventsByAttendance.map(event => (
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
            This overview summarizes performance across the year. Ticket sales
            and attendance have grown steadily each quarter, with the strongest
            results during the summer season. The sections below break down the
            highlights for each quarter.
          </Text>
          <Accordion allowsMultipleExpanded>
            <Accordion.Item id="q1">
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q1 saw 6 events and a steady ramp-up in ticket sales,
                  establishing a solid baseline for the rest of the year.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q2">
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q2 delivered our highest revenue yet, driven by the
                  Championship Finals selling out and strong festival presales.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q3">
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Q3 is on track to exceed targets, with several large outdoor
                  events scheduled and repeat-visitor numbers climbing.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

const SettingsPage = () => {
  const [generalSaved, setGeneralSaved] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketing, setMarketing] = useState(false);

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
            <Stack space={4}>
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
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Form
            onSubmit={e => {
              e.preventDefault();
              setPrefsSaved(true);
            }}
          >
            <Stack space={5}>
              {prefsSaved ? (
                <SectionMessage variant="success">
                  <SectionMessage.Title>Saved</SectionMessage.Title>
                  <SectionMessage.Content>
                    Preferences saved successfully.
                  </SectionMessage.Content>
                </SectionMessage>
              ) : null}
              <Stack space={1}>
                <Switch
                  label="Email Notifications"
                  selected={emailNotif}
                  onChange={setEmailNotif}
                />
                <Text variant="muted" size="sm">
                  Receive booking confirmations and event updates by email.
                </Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="SMS Notifications"
                  selected={smsNotif}
                  onChange={setSmsNotif}
                />
                <Text variant="muted" size="sm">
                  Get time-sensitive alerts sent to your phone.
                </Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Weekly Digest"
                  selected={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <Text variant="muted" size="sm">
                  A summary of your events and sales every Monday.
                </Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Marketing Emails"
                  selected={marketing}
                  onChange={setMarketing}
                />
                <Text variant="muted" size="sm">
                  Occasional news about features and promotions.
                </Text>
              </Stack>
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
      Need a hand? Browse our documentation or reach out to the support team and
      we&apos;ll get back to you within one business day.
    </Text>
  </Stack>
);

/* -------------------------------------------------------------------------- */
/* Shell                                                                      */
/* -------------------------------------------------------------------------- */

const TestApp = () => {
  const [page, setPage] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const navigate = (path: string) => setPage(path);

  const handleAccountAction = (key: React.Key) => {
    if (key === 'signout') {
      setSignOutOpen(true);
    }
  };

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
    <RouterProvider navigate={navigate}>
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
              <Sidebar.Item href="/help">Help &amp; Support</Sidebar.Item>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle aria-label="Breadcrumbs">
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={page}>
                  {PAGES[page] ?? 'Dashboard'}
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
            <Dialog.Title>Sign out</Dialog.Title>
            <Dialog.Content>
              Are you sure you want to sign out?
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="destructive" onPress={close}>
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
