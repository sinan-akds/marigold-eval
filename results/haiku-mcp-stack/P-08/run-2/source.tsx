import { useState } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Headline,
  Table,
  Stack,
  Inline,
  SearchField,
  Button,
  Dialog,
  TextField,
  NumberField,
  TextArea,
  Select,
  Menu,
  SectionMessage,
  Card,
  Badge,
  Text,
  Tabs,
  Accordion,
  Columns,
  Switch,
  Inset,
} from '@marigold/components';

type Page =
  | 'dashboard'
  | 'events'
  | 'attendees'
  | 'reports'
  | 'settings';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  status: 'Draft' | 'On Sale' | 'Sold Out';
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
  status: 'Active' | 'Inactive';
}

const EventHub = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [eventSearch, setEventSearch] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [reportTab, setReportTab] = useState('revenue');
  const [settingsTab, setSettingsTab] = useState('general');
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
  });
  const [generalSettings, setGeneralSettings] = useState({
    orgName: 'Tech Events Inc.',
    email: 'contact@techevents.com',
    currency: 'usd',
    timezone: 'utc',
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    weekly: true,
    marketing: false,
  });

  const events: Event[] = [
    {
      id: '1',
      name: 'TechConf 2024',
      date: '2024-09-15',
      location: 'San Francisco',
      capacity: 500,
      status: 'On Sale',
    },
    {
      id: '2',
      name: 'Web Summit',
      date: '2024-10-20',
      location: 'New York',
      capacity: 800,
      status: 'On Sale',
    },
    {
      id: '3',
      name: 'React Workshop',
      date: '2024-08-30',
      location: 'Boston',
      capacity: 150,
      status: 'Draft',
    },
    {
      id: '4',
      name: 'AI Conference',
      date: '2024-11-10',
      location: 'Seattle',
      capacity: 600,
      status: 'Sold Out',
    },
    {
      id: '5',
      name: 'DevOps Summit',
      date: '2024-09-25',
      location: 'Austin',
      capacity: 400,
      status: 'On Sale',
    },
    {
      id: '6',
      name: 'Cloud Expo',
      date: '2024-10-15',
      location: 'Los Angeles',
      capacity: 700,
      status: 'On Sale',
    },
  ];


  const attendees: Attendee[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      eventsAttended: 5,
      lastActive: '2024-06-20',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      eventsAttended: 3,
      lastActive: '2024-06-18',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      eventsAttended: 2,
      lastActive: '2024-05-10',
      status: 'Inactive',
    },
    {
      id: '4',
      name: 'David Miller',
      email: 'david@example.com',
      eventsAttended: 8,
      lastActive: '2024-06-19',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      eventsAttended: 1,
      lastActive: '2024-06-15',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Frank Brown',
      email: 'frank@example.com',
      eventsAttended: 6,
      lastActive: '2024-04-30',
      status: 'Inactive',
    },
  ];

  const filteredEvents = events.filter(
    event =>
      event.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      event.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredAttendees = attendees.filter(
    attendee =>
      attendee.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      attendee.email.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const handleCreateEvent = () => {
    setFormData({ eventName: '', date: '', location: '', capacity: '', description: '' });
    setCreateEventOpen(true);
  };

  const handleSaveEvent = () => {
    setCreateEventOpen(false);
    setFormData({ eventName: '', date: '', location: '', capacity: '', description: '' });
  };

  const handleSaveSettings = () => {
    // Settings saved
  };

  const handleSaveNotifications = () => {
    // Notifications saved
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'events':
        return (
          <EventsPage
            events={filteredEvents}
            eventSearch={eventSearch}
            onSearchChange={setEventSearch}
            onCreateEvent={handleCreateEvent}
            createEventOpen={createEventOpen}
            onCreateEventOpenChange={setCreateEventOpen}
            formData={formData}
            onFormDataChange={setFormData}
            onSaveEvent={handleSaveEvent}
          />
        );
      case 'attendees':
        return (
          <AttendeesPage
            attendees={filteredAttendees}
            attendeeSearch={attendeeSearch}
            onSearchChange={setAttendeeSearch}
          />
        );
      case 'reports':
        return (
          <ReportsPage
            reportTab={reportTab}
            onReportTabChange={setReportTab}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settingsTab={settingsTab}
            onSettingsTabChange={setSettingsTab}
            generalSettings={generalSettings}
            onGeneralSettingsChange={setGeneralSettings}
            notificationPrefs={notificationPrefs}
            onNotificationPrefsChange={setNotificationPrefs}
            onSaveSettings={handleSaveSettings}
            onSaveNotifications={handleSaveNotifications}
          />
        );
      default:
        return null;
    }
  };

  const getPageLabel = (): string => {
    const labels: Record<Page, string> = {
      dashboard: 'Dashboard',
      events: 'Events',
      attendees: 'Attendees',
      reports: 'Reports',
      settings: 'Settings',
    };
    return labels[currentPage];
  };

  return (
    <Sidebar.Provider defaultOpen>
      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Text weight="bold" fontSize="lg">
              EventHub
            </Text>
          </Sidebar.Header>
          <Sidebar.Nav>
            <Sidebar.Item
              active={currentPage === 'dashboard'}
              onPress={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              active={currentPage === 'events'}
              onPress={() => setCurrentPage('events')}
            >
              Events
            </Sidebar.Item>
            <Sidebar.Item
              active={currentPage === 'attendees'}
              onPress={() => setCurrentPage('attendees')}
            >
              Attendees
            </Sidebar.Item>
            <Sidebar.Item
              active={currentPage === 'reports'}
              onPress={() => setCurrentPage('reports')}
            >
              Reports
            </Sidebar.Item>
            <Sidebar.Separator />
            <Sidebar.Item
              active={currentPage === 'settings'}
              onPress={() => setCurrentPage('settings')}
            >
              Settings
            </Sidebar.Item>
          </Sidebar.Nav>
          <Sidebar.Footer>
            <Sidebar.Item onPress={() => {}}>Help & Support</Sidebar.Item>
          </Sidebar.Footer>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation.Start>
            <Sidebar.Toggle />
          </TopNavigation.Start>
          <TopNavigation.Middle>
            <Breadcrumbs>
              <Breadcrumbs.Item href="#">EventHub</Breadcrumbs.Item>
              <Breadcrumbs.Item href="#">{getPageLabel()}</Breadcrumbs.Item>
            </Breadcrumbs>
          </TopNavigation.Middle>
          <TopNavigation.End>
            <Menu label="Account" onAction={action => {
              if (action === 'signout') {
                setSignOutConfirmOpen(true);
              }
            }}>
              <Menu.Item id="profile">Profile</Menu.Item>
              <Menu.Item id="signout">Sign out</Menu.Item>
            </Menu>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space={6}>
            {renderPage()}
          </Inset>
        </AppLayout.Main>
      </AppLayout>

      <Dialog.Trigger
        open={signOutConfirmOpen}
        onOpenChange={setSignOutConfirmOpen}
      >
        <Dialog role="alertdialog">
          <Dialog.Title>Confirm Sign Out</Dialog.Title>
          <Dialog.Content>
            Are you sure you want to sign out?
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" slot="close">
              Cancel
            </Button>
            <Button variant="destructive" slot="close">
              Sign out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Dialog.Trigger>
    </Sidebar.Provider>
  );
};

const DashboardPage = () => {
  const upcomingData = [
    { id: '1', event: 'TechConf 2024', date: '2024-09-15', venue: 'San Francisco', ticketsSold: 342, status: 'On Sale' },
    { id: '2', event: 'Web Summit', date: '2024-10-20', venue: 'New York', ticketsSold: 598, status: 'On Sale' },
    { id: '3', event: 'React Workshop', date: '2024-08-30', venue: 'Boston', ticketsSold: 145, status: 'Draft' },
    { id: '4', event: 'AI Conference', date: '2024-11-10', venue: 'Seattle', ticketsSold: 600, status: 'Sold Out' },
    { id: '5', event: 'DevOps Summit', date: '2024-09-25', venue: 'Austin', ticketsSold: 287, status: 'On Sale' },
    { id: '6', event: 'Cloud Expo', date: '2024-10-15', venue: 'Los Angeles', ticketsSold: 512, status: 'On Sale' },
  ];

  return (
    <Stack space={6}>
      <Headline level="2">Dashboard Overview</Headline>

      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>
          You have 3 events starting this week.
        </SectionMessage.Content>
      </SectionMessage>

      <Columns columns={[1, 1, 1, 1]} space={4}>
        <Card>
          <Stack space={2}>
            <Text variant="muted">Total Events</Text>
            <Headline level="3">24</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text variant="muted">Tickets Sold</Text>
            <Headline level="3">1,849</Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Inline space={2}>
              <div>
                <Text variant="muted">Revenue</Text>
                <Headline level="3">$45,230</Headline>
              </div>
            </Inline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text variant="muted">Upcoming</Text>
            <Headline level="3">8</Headline>
          </Stack>
        </Card>
      </Columns>

      <Stack space={3}>
        <Headline level="3">Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column rowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body items={upcomingData}>
            {item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.event}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.venue}</Table.Cell>
                <Table.Cell>{item.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge variant={
                    item.status === 'On Sale' ? 'success' :
                    item.status === 'Draft' ? 'warning' :
                    'info'
                  }>
                    {item.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );
};

interface EventsPageProps {
  events: Event[];
  eventSearch: string;
  onSearchChange: (value: string) => void;
  onCreateEvent: () => void;
  createEventOpen: boolean;
  onCreateEventOpenChange: (open: boolean) => void;
  formData: {
    eventName: string;
    date: string;
    location: string;
    capacity: string;
    description: string;
  };
  onFormDataChange: (data: any) => void;
  onSaveEvent: () => void;
}

const EventsPage = ({
  events,
  eventSearch,
  onSearchChange,
  onCreateEvent,
  createEventOpen,
  onCreateEventOpenChange,
  formData,
  onFormDataChange,
  onSaveEvent,
}: EventsPageProps) => {
  return (
    <Stack space={6}>
      <Headline level="2">Events</Headline>

      <Inline space={3} alignY="bottom">
        <div style={{ flex: 1 }}>
          <SearchField
            label="Search"
            value={eventSearch}
            onChange={onSearchChange}
            placeholder="Search by name or location..."
          />
        </div>
        <Dialog.Trigger open={createEventOpen} onOpenChange={onCreateEventOpenChange}>
          <Button variant="primary" onPress={onCreateEvent}>
            Create Event
          </Button>
          <Dialog size="small">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Event Name"
                  required
                  value={formData.eventName}
                  onChange={(value: string) =>
                    onFormDataChange({ ...formData, eventName: value })
                  }
                />
                <TextField
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(value: string) =>
                    onFormDataChange({ ...formData, date: value })
                  }
                />
                <TextField
                  label="Location"
                  value={formData.location}
                  onChange={(value: string) =>
                    onFormDataChange({ ...formData, location: value })
                  }
                />
                <NumberField
                  label="Capacity"
                  value={formData.capacity ? Number(formData.capacity) : undefined}
                  onChange={(value: number) =>
                    onFormDataChange({ ...formData, capacity: value.toString() })
                  }
                />
                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(value: string) =>
                    onFormDataChange({ ...formData, description: value })
                  }
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button
                variant="primary"
                slot="close"
                onPress={onSaveEvent}
              >
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={events}>
          {event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location}</Table.Cell>
              <Table.Cell>{event.capacity}</Table.Cell>
              <Table.Cell>
                <Badge variant={
                  event.status === 'On Sale' ? 'success' :
                  event.status === 'Draft' ? 'warning' :
                  'info'
                }>
                  {event.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

interface AttendeesPageProps {
  attendees: Attendee[];
  attendeeSearch: string;
  onSearchChange: (value: string) => void;
}

const AttendeesPage = ({
  attendees,
  attendeeSearch,
  onSearchChange,
}: AttendeesPageProps) => {
  return (
    <Stack space={6}>
      <Headline level="2">Attendees</Headline>

      <Inline space={3} alignY="bottom">
        <div style={{ flex: 1 }}>
          <SearchField
            label="Search"
            value={attendeeSearch}
            onChange={onSearchChange}
            placeholder="Search by name or email..."
          />
        </div>
        <Text variant="muted">{attendees.length} attendees</Text>
      </Inline>

      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Column rowHeader>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={attendees}>
          {attendee => (
            <Table.Row key={attendee.id}>
              <Table.Cell>{attendee.name}</Table.Cell>
              <Table.Cell>{attendee.email}</Table.Cell>
              <Table.Cell>{attendee.eventsAttended}</Table.Cell>
              <Table.Cell>{attendee.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={attendee.status === 'Active' ? 'success' : 'warning'}>
                  {attendee.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

interface ReportsPageProps {
  reportTab: string;
  onReportTabChange: (tab: string) => void;
}

const ReportsPage = ({ onReportTabChange }: ReportsPageProps) => {
  const topEventsByAttendance = [
    { id: '1', event: 'TechConf 2024', date: '2024-09-15', attendees: 485, capacity: 500, fillRate: '97%' },
    { id: '2', event: 'Web Summit', date: '2024-10-20', venue: 'New York', attendees: 750, capacity: 800, fillRate: '93%' },
    { id: '3', event: 'AI Conference', date: '2024-11-10', attendees: 600, capacity: 600, fillRate: '100%' },
    { id: '4', event: 'DevOps Summit', date: '2024-09-25', attendees: 380, capacity: 400, fillRate: '95%' },
  ];

  return (
    <Stack space={6}>
      <Headline level="2">Reports</Headline>

      <Tabs aria-label="Reports" onSelectionChange={k => onReportTabChange(String(k))}>
        <Tabs.List aria-label="Report Sections">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={6}>
            <Columns columns={[1, 1, 1, 1]} space={4}>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">Total Revenue</Text>
                  <Headline level="3">$45,230</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">This Month</Text>
                  <Headline level="3">$8,420</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">Average per Event</Text>
                  <Headline level="3">$1,885</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">Refunds</Text>
                  <Headline level="3">$1,230</Headline>
                </Stack>
              </Card>
            </Columns>

            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue is up 12% compared to last month.</SectionMessage.Title>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={6}>
            <Columns columns={[1, 1, 1, 1]} space={4}>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">Total Attendees</Text>
                  <Headline level="3">3,200</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">Repeat Visitors</Text>
                  <Headline level="3">890</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">Average per Event</Text>
                  <Headline level="3">178</Headline>
                </Stack>
              </Card>
              <Card>
                <Stack space={2}>
                  <Text variant="muted">No-shows</Text>
                  <Headline level="3">145</Headline>
                </Stack>
              </Card>
            </Columns>

            <Stack space={3}>
              <Headline level="3">Top Events by Attendance</Headline>
              <Table aria-label="Top Events by Attendance">
                <Table.Header>
                  <Table.Column rowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body items={topEventsByAttendance}>
                  {item => (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.event}</Table.Cell>
                      <Table.Cell>{item.date}</Table.Cell>
                      <Table.Cell>{item.attendees}</Table.Cell>
                      <Table.Cell>{item.capacity}</Table.Cell>
                      <Table.Cell>{item.fillRate}</Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="overview">
          <Stack space={6}>
            <Text>
              This comprehensive report provides an overview of key metrics across all quarters, highlighting trends, growth patterns, and performance indicators.
            </Text>

            <Accordion>
              <Accordion.Item>
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  Q1 showed strong initial growth with 8 events organized, attracting 750 total attendees. Revenue reached $12,450 with a 5% increase from the previous period.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  Q2 experienced accelerated growth with 12 events, 1,240 attendees, and revenue of $18,920. Customer satisfaction scores improved by 8%.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  Q3 continued the upward trend with 13 events generating 1,210 attendees and $13,860 in revenue. Market expansion initiatives began in new regions.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

interface SettingsPageProps {
  settingsTab: string;
  onSettingsTabChange: (tab: string) => void;
  generalSettings: {
    orgName: string;
    email: string;
    currency: string;
    timezone: string;
  };
  onGeneralSettingsChange: (settings: any) => void;
  notificationPrefs: {
    email: boolean;
    sms: boolean;
    weekly: boolean;
    marketing: boolean;
  };
  onNotificationPrefsChange: (prefs: any) => void;
  onSaveSettings: () => void;
  onSaveNotifications: () => void;
}

const SettingsPage = ({
  onSettingsTabChange,
  generalSettings,
  onGeneralSettingsChange,
  notificationPrefs,
  onNotificationPrefsChange,
  onSaveSettings,
  onSaveNotifications,
}: SettingsPageProps) => {
  const [savedGeneral, setSavedGeneral] = useState(false);
  const [savedNotifications, setSavedNotifications] = useState(false);

  const handleSaveGeneralSettings = () => {
    setSavedGeneral(true);
    onSaveSettings();
    setTimeout(() => setSavedGeneral(false), 3000);
  };

  const handleSaveNotificationSettings = () => {
    setSavedNotifications(true);
    onSaveNotifications();
    setTimeout(() => setSavedNotifications(false), 3000);
  };

  return (
    <Stack space={6}>
      <Headline level="2">Settings</Headline>

      <Tabs aria-label="Settings" onSelectionChange={k => onSettingsTabChange(String(k))}>
        <Tabs.List aria-label="Settings Sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={6}>
            {savedGeneral && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Settings saved successfully.</SectionMessage.Title>
              </SectionMessage>
            )}

            <Stack space={4}>
              <TextField
                label="Organization Name"
                value={generalSettings.orgName}
                onChange={(value: string) =>
                  onGeneralSettingsChange({ ...generalSettings, orgName: value })
                }
              />
              <TextField
                label="Contact Email"
                type="email"
                value={generalSettings.email}
                onChange={(value: string) =>
                  onGeneralSettingsChange({ ...generalSettings, email: value })
                }
              />
              <Select
                label="Default Currency"
                selectedKey={generalSettings.currency}
                onSelectionChange={(key: any) =>
                  onGeneralSettingsChange({ ...generalSettings, currency: String(key) })
                }
              >
                <Select.Option id="usd">USD</Select.Option>
                <Select.Option id="eur">EUR</Select.Option>
                <Select.Option id="gbp">GBP</Select.Option>
              </Select>
              <Select
                label="Default Timezone"
                selectedKey={generalSettings.timezone}
                onSelectionChange={(key: any) =>
                  onGeneralSettingsChange({ ...generalSettings, timezone: String(key) })
                }
              >
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>

              <Button variant="primary" onPress={handleSaveGeneralSettings}>
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={6}>
            {savedNotifications && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Notification preferences saved.</SectionMessage.Title>
              </SectionMessage>
            )}

            <Stack space={4}>
              <Stack space={2}>
                <Inline space={3} alignY="center">
                  <Switch
                    selected={notificationPrefs.email}
                    onChange={(value: boolean) =>
                      onNotificationPrefsChange({ ...notificationPrefs, email: value })
                    }
                  />
                  <Text>Email Notifications</Text>
                </Inline>
                <Text variant="muted" fontSize="xs">
                  Receive email updates about your events and attendees.
                </Text>
              </Stack>

              <Stack space={2}>
                <Inline space={3} alignY="center">
                  <Switch
                    selected={notificationPrefs.sms}
                    onChange={(value: boolean) =>
                      onNotificationPrefsChange({ ...notificationPrefs, sms: value })
                    }
                  />
                  <Text>SMS Notifications</Text>
                </Inline>
                <Text variant="muted" fontSize="xs">
                  Get text messages for important event updates.
                </Text>
              </Stack>

              <Stack space={2}>
                <Inline space={3} alignY="center">
                  <Switch
                    selected={notificationPrefs.weekly}
                    onChange={(value: boolean) =>
                      onNotificationPrefsChange({ ...notificationPrefs, weekly: value })
                    }
                  />
                  <Text>Weekly Digest</Text>
                </Inline>
                <Text variant="muted" fontSize="xs">
                  Receive a weekly summary of your event metrics.
                </Text>
              </Stack>

              <Stack space={2}>
                <Inline space={3} alignY="center">
                  <Switch
                    selected={notificationPrefs.marketing}
                    onChange={(value: boolean) =>
                      onNotificationPrefsChange({ ...notificationPrefs, marketing: value })
                    }
                  />
                  <Text>Marketing Emails</Text>
                </Inline>
                <Text variant="muted" fontSize="xs">
                  Receive news about new features and promotional offers.
                </Text>
              </Stack>

              <Button variant="primary" onPress={handleSaveNotificationSettings}>
                Save Preferences
              </Button>
            </Stack>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

export default EventHub;
