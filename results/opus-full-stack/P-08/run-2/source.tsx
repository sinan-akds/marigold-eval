import { useMemo, useState } from 'react';
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
  DatePicker,
} from '@marigold/components';

/* -------------------------------------------------------------------------- */
/*                                    Data                                     */
/* -------------------------------------------------------------------------- */

const PAGES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

type EventStatus = 'On Sale' | 'Draft' | 'Sold Out';

const statusVariant: Record<EventStatus, 'success' | 'warning' | 'error'> = {
  'On Sale': 'success',
  Draft: 'warning',
  'Sold Out': 'error',
};

const upcomingEvents: {
  name: string;
  date: string;
  venue: string;
  sold: string;
  status: EventStatus;
}[] = [
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', venue: 'Riverside Park', sold: '1,240', status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Jul 18, 2026', venue: 'Convention Center', sold: '860', status: 'On Sale' },
  { name: 'Indie Film Night', date: 'Jul 22, 2026', venue: 'Grand Theatre', sold: '0', status: 'Draft' },
  { name: 'Food & Wine Expo', date: 'Aug 02, 2026', venue: 'Harbour Hall', sold: '2,000', status: 'Sold Out' },
  { name: 'Startup Pitch Day', date: 'Aug 09, 2026', venue: 'Innovation Hub', sold: '320', status: 'On Sale' },
  { name: 'Autumn Art Fair', date: 'Aug 15, 2026', venue: 'City Gallery', sold: '0', status: 'Draft' },
];

const eventsList: {
  name: string;
  date: string;
  location: string;
  capacity: string;
  status: EventStatus;
}[] = [
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', location: 'Riverside Park', capacity: '1,500', status: 'On Sale' },
  { name: 'Tech Conference 2026', date: 'Jul 18, 2026', location: 'Convention Center', capacity: '1,000', status: 'On Sale' },
  { name: 'Indie Film Night', date: 'Jul 22, 2026', location: 'Grand Theatre', capacity: '400', status: 'Draft' },
  { name: 'Food & Wine Expo', date: 'Aug 02, 2026', location: 'Harbour Hall', capacity: '2,000', status: 'Sold Out' },
  { name: 'Startup Pitch Day', date: 'Aug 09, 2026', location: 'Innovation Hub', capacity: '600', status: 'On Sale' },
  { name: 'Autumn Art Fair', date: 'Aug 15, 2026', location: 'City Gallery', capacity: '500', status: 'Draft' },
  { name: 'Winter Jazz Evening', date: 'Sep 03, 2026', location: 'Blue Note Club', capacity: '250', status: 'On Sale' },
];

const TODAY = new Date('2026-06-27');

const attendeesList: {
  name: string;
  email: string;
  attended: number;
  lastActive: string;
}[] = [
  { name: 'Anna Schmidt', email: 'anna.schmidt@example.com', attended: 12, lastActive: '2026-06-20' },
  { name: 'Max Weber', email: 'max.weber@example.com', attended: 5, lastActive: '2026-06-25' },
  { name: 'Lena Fischer', email: 'lena.fischer@example.com', attended: 8, lastActive: '2026-03-14' },
  { name: 'Tom Becker', email: 'tom.becker@example.com', attended: 3, lastActive: '2026-06-10' },
  { name: 'Sara Hoffmann', email: 'sara.hoffmann@example.com', attended: 21, lastActive: '2026-01-08' },
  { name: 'Paul Wagner', email: 'paul.wagner@example.com', attended: 7, lastActive: '2026-06-02' },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const isActive = (iso: string) => {
  const diffDays = (TODAY.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30;
};

const topEvents: {
  name: string;
  date: string;
  attendees: number;
  capacity: number;
}[] = [
  { name: 'Food & Wine Expo', date: 'Aug 02, 2026', attendees: 1980, capacity: 2000 },
  { name: 'Summer Music Festival', date: 'Jul 12, 2026', attendees: 1240, capacity: 1500 },
  { name: 'Tech Conference 2026', date: 'Jul 18, 2026', attendees: 860, capacity: 1000 },
  { name: 'Startup Pitch Day', date: 'Aug 09, 2026', attendees: 510, capacity: 600 },
];

/* -------------------------------------------------------------------------- */
/*                                Shared bits                                 */
/* -------------------------------------------------------------------------- */

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
    <Inset space={4}>
      <Stack space={2}>
        <Inline space={1} alignY="center">
          <Text variant="muted" fontSize="sm">
            {label}
          </Text>
          {tooltip ? (
            <Tooltip.Trigger>
              <Button variant="ghost" size="small" aria-label={`${label} info`}>
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

/* -------------------------------------------------------------------------- */
/*                                 Dashboard                                  */
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

    <Inline space={4}>
      <SummaryCard label="Total Events" value="24" />
      <SummaryCard label="Tickets Sold" value="1,849" />
      <SummaryCard
        label="Revenue"
        value="$45,230"
        tooltip="Net revenue after fees and refunds"
      />
      <SummaryCard label="Upcoming" value="8" />
    </Inline>

    <Stack space={3}>
      <Headline level={2}>Upcoming Events</Headline>
      <Table aria-label="Upcoming Events" selectionMode="none">
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
              <Table.Cell>{event.sold}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  </Stack>
);

/* -------------------------------------------------------------------------- */
/*                                  Events                                    */
/* -------------------------------------------------------------------------- */

const EventsPage = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventsList;
    return eventsList.filter(
      e =>
        e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Stack space={6}>
      <Headline level={1}>Events</Headline>

      <Inline space={4} alignY="input" alignX="between">
        <SearchField
          aria-label="Search events by name or location"
          placeholder="Search by name or location"
          value={query}
          onChange={setQuery}
          width={80}
        />

        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="medium" closeButton>
            {({ close }) => (
              <>
                <Dialog.Title>Create Event</Dialog.Title>
                <Dialog.Content>
                  <Form
                    id="create-event-form"
                    onSubmit={e => {
                      e.preventDefault();
                      close();
                    }}
                  >
                    <Stack space={4}>
                      <TextField label="Event Name" name="name" required />
                      <DatePicker label="Date" name="date" />
                      <TextField label="Location" name="location" />
                      <NumberField
                        label="Capacity"
                        name="capacity"
                        minValue={0}
                      />
                      <TextArea label="Description" name="description" rows={3} />
                    </Stack>
                  </Form>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" form="create-event-form">
                    Create
                  </Button>
                </Dialog.Actions>
              </>
            )}
          </Dialog>
        </Dialog.Trigger>
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
                <Badge variant={statusVariant[event.status]}>{event.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Attendees                                  */
/* -------------------------------------------------------------------------- */

const AttendeesPage = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return attendeesList;
    return attendeesList.filter(
      a =>
        a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Stack space={6}>
      <Headline level={1}>Attendees</Headline>

      <Inline space={4} alignY="input" alignX="between">
        <SearchField
          aria-label="Search attendees by name or email"
          placeholder="Search by name or email"
          value={query}
          onChange={setQuery}
          width={80}
        />
        <Text variant="muted">{filtered.length} attendees</Text>
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
            const active = isActive(attendee.lastActive);
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

/* -------------------------------------------------------------------------- */
/*                                  Reports                                   */
/* -------------------------------------------------------------------------- */

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
          <Inline space={4}>
            <SummaryCard label="Total Revenue" value="$45,230" />
            <SummaryCard label="This Month" value="$8,420" />
            <SummaryCard label="Average per Event" value="$1,885" />
            <SummaryCard label="Refunds" value="$1,230" />
          </Inline>
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
          <Inline space={4}>
            <SummaryCard label="Total Attendees" value="3,200" />
            <SummaryCard label="Repeat Visitors" value="890" />
            <SummaryCard label="Average per Event" value="178" />
            <SummaryCard label="No-shows" value="145" />
          </Inline>
          <Stack space={3}>
            <Headline level={2}>Top Events by Attendance</Headline>
            <Table aria-label="Top Events by Attendance" selectionMode="none">
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
            A consolidated look at how EventHub performed across the year. Ticket
            sales and attendance grew steadily each quarter, with the strongest
            momentum heading into the summer festival season.
          </Text>
          <Accordion allowsMultipleExpanded defaultExpandedKeys={['q1']}>
            <Accordion.Item id="q1">
              <Accordion.Header>Q1 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  The first quarter focused on rebuilding momentum after the
                  winter break, with 6 events and a 78% average fill rate.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q2">
              <Accordion.Header>Q2 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  Spring brought a 12% revenue increase, driven by strong demand
                  for conferences and a new series of community workshops.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="q3">
              <Accordion.Header>Q3 Summary</Accordion.Header>
              <Accordion.Content>
                <Text>
                  The summer festival season is projected to be the busiest yet,
                  with two events already sold out well ahead of schedule.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Tabs.TabPanel>
    </Tabs>
  </Stack>
);

/* -------------------------------------------------------------------------- */
/*                                 Settings                                   */
/* -------------------------------------------------------------------------- */

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
                name="organization"
                defaultValue="EventHub Inc."
                width={96}
              />
              <TextField
                label="Contact Email"
                name="email"
                type="email"
                defaultValue="hello@eventhub.com"
                width={96}
              />
              <Select
                label="Default Currency"
                name="currency"
                defaultSelectedKey="usd"
                width={64}
              >
                <Select.Option id="usd">USD</Select.Option>
                <Select.Option id="eur">EUR</Select.Option>
                <Select.Option id="gbp">GBP</Select.Option>
              </Select>
              <Select
                label="Default Timezone"
                name="timezone"
                defaultSelectedKey="utc"
                width={64}
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
            <Stack space={5} alignX="left">
              {prefsSaved ? (
                <SectionMessage variant="success">
                  <SectionMessage.Title>Saved</SectionMessage.Title>
                  <SectionMessage.Content>
                    Preferences saved successfully.
                  </SectionMessage.Content>
                </SectionMessage>
              ) : null}

              <Stack space={1}>
                <Switch label="Email Notifications" defaultSelected />
                <Text variant="muted" fontSize="sm">
                  Receive an email when an event status changes.
                </Text>
              </Stack>
              <Stack space={1}>
                <Switch label="SMS Notifications" />
                <Text variant="muted" fontSize="sm">
                  Get text alerts for urgent updates.
                </Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Weekly Digest" defaultSelected />
                <Text variant="muted" fontSize="sm">
                  A summary of activity delivered every Monday.
                </Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Marketing Emails" />
                <Text variant="muted" fontSize="sm">
                  News about features and promotions.
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

/* -------------------------------------------------------------------------- */
/*                                   Shell                                    */
/* -------------------------------------------------------------------------- */

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
            <Headline level={1}>Help &amp; Support</Headline>
            <Text>
              Need a hand? Browse our documentation or reach out to the support
              team and we'll get back to you shortly.
            </Text>
          </Stack>
        );
      default:
        return <DashboardPage />;
    }
  };

  return (
    <RouterProvider navigate={setPath}>
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
              <Link href="/help">Help &amp; Support</Link>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs aria-label="Breadcrumbs">
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={path}>{PAGES[path]}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
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
            <Inset space={6}>{renderPage()}</Inset>
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
