import { useState } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Columns,
  Dialog,
  Headline,
  Inline,
  Inset,
  Menu,
  NumberField,
  SearchField,
  SectionMessage,
  Sidebar,
  Stack,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
  TopNavigation,
  Tooltip,
  Select,
  Switch,
  Accordion,
} from '@marigold/components';

interface Event {
  id: string;
  name: string;
  date: string;
  location?: string;
  venue?: string;
  capacity?: number;
  status: 'On Sale' | 'Draft' | 'Sold Out';
  ticketsSold?: number;
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
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    orgName: 'My Organization',
    contactEmail: 'contact@example.com',
    defaultCurrency: 'usd',
    defaultTimezone: 'utc',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const upcomingEvents: Event[] = [
    {
      id: '1',
      name: 'Tech Conference 2025',
      date: '2025-07-15',
      venue: 'Convention Center A',
      ticketsSold: 450,
      status: 'On Sale',
    },
    {
      id: '2',
      name: 'Music Festival',
      date: '2025-08-20',
      venue: 'Central Park',
      ticketsSold: 1200,
      status: 'On Sale',
    },
    {
      id: '3',
      name: 'Business Meetup',
      date: '2025-07-10',
      venue: 'Downtown Hotel',
      ticketsSold: 85,
      status: 'On Sale',
    },
    {
      id: '4',
      name: 'Art Expo',
      date: '2025-09-05',
      venue: 'Gallery District',
      ticketsSold: 320,
      status: 'Sold Out',
    },
    {
      id: '5',
      name: 'Developer Workshop',
      date: '2025-08-01',
      venue: 'Tech Hub',
      ticketsSold: 120,
      status: 'Draft',
    },
    {
      id: '6',
      name: 'Charity Gala',
      date: '2025-10-12',
      venue: 'Grand Ballroom',
      ticketsSold: 280,
      status: 'On Sale',
    },
  ];

  const allEvents: Event[] = [
    {
      id: '1',
      name: 'Tech Conference 2025',
      date: '2025-07-15',
      location: 'Convention Center A',
      capacity: 500,
      status: 'On Sale',
    },
    {
      id: '2',
      name: 'Music Festival',
      date: '2025-08-20',
      location: 'Central Park',
      capacity: 2000,
      status: 'On Sale',
    },
    {
      id: '3',
      name: 'Business Meetup',
      date: '2025-07-10',
      location: 'Downtown Hotel',
      capacity: 100,
      status: 'On Sale',
    },
    {
      id: '4',
      name: 'Art Expo',
      date: '2025-09-05',
      location: 'Gallery District',
      capacity: 800,
      status: 'Sold Out',
    },
    {
      id: '5',
      name: 'Developer Workshop',
      date: '2025-08-01',
      location: 'Tech Hub',
      capacity: 150,
      status: 'Draft',
    },
    {
      id: '6',
      name: 'Charity Gala',
      date: '2025-10-12',
      location: 'Grand Ballroom',
      capacity: 300,
      status: 'On Sale',
    },
  ];

  const attendees: Attendee[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      eventsAttended: 5,
      lastActive: '2025-06-20',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      eventsAttended: 2,
      lastActive: '2025-05-15',
      status: 'Inactive',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      eventsAttended: 8,
      lastActive: '2025-06-22',
      status: 'Active',
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      eventsAttended: 1,
      lastActive: '2025-04-10',
      status: 'Inactive',
    },
    {
      id: '5',
      name: 'Emma Brown',
      email: 'emma@example.com',
      eventsAttended: 6,
      lastActive: '2025-06-19',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Frank Miller',
      email: 'frank@example.com',
      eventsAttended: 3,
      lastActive: '2025-06-18',
      status: 'Active',
    },
  ];

  const getStatusVariant = (
    status: 'On Sale' | 'Draft' | 'Sold Out' | 'Active' | 'Inactive'
  ) => {
    if (status === 'On Sale') return 'info';
    if (status === 'Draft') return 'warning';
    if (status === 'Sold Out') return 'error';
    if (status === 'Active') return 'success';
    if (status === 'Inactive') return 'warning';
    return 'default';
  };

  const filteredEvents = allEvents.filter(
    event =>
      event.name.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      (event.location &&
        event.location.toLowerCase().includes(eventSearchQuery.toLowerCase()))
  );

  const filteredAttendees = attendees.filter(
    attendee =>
      attendee.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(attendeeSearchQuery.toLowerCase())
  );

  const handleSignOut = () => {
    setIsSignOutOpen(false);
    setCurrentPage('dashboard');
    alert('You have been signed out.');
  };

  const handleSaveGeneralSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveNotificationSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={2}>Dashboard Overview</Headline>

      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>
          You have 3 events starting this week.
        </SectionMessage.Content>
      </SectionMessage>

      <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="60em">
        <Card>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">
                Total Events
              </Text>
              <Text size="xl" weight="bold">
                24
              </Text>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">
                Tickets Sold
              </Text>
              <Text size="xl" weight="bold">
                1,849
              </Text>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">
                Revenue
              </Text>
              <Inline alignY="center" space={2}>
                <Text size="xl" weight="bold">
                  $45,230
                </Text>
                <Tooltip.Trigger>
                  <span>ℹ️</span>
                  <Tooltip>Net revenue after fees and refunds</Tooltip>
                </Tooltip.Trigger>
              </Inline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space="square-regular">
            <Stack space={2}>
              <Text size="sm" variant="muted">
                Upcoming
              </Text>
              <Text size="xl" weight="bold">
                8
              </Text>
            </Stack>
          </Inset>
        </Card>
      </Columns>

      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEvents.map(event => (
              <Table.Row key={event.id}>
                <Table.Cell>{event.name}</Table.Cell>
                <Table.Cell>{event.date}</Table.Cell>
                <Table.Cell>{event.venue}</Table.Cell>
                <Table.Cell>{event.ticketsSold}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusVariant(event.status)}>
                    {event.status}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  const renderEvents = () => (
    <Stack space={6}>
      <Headline level={2}>Events</Headline>

      <Inline space={4} alignY="input">
        <SearchField
          label="Search"
          placeholder="Search by name or location"
          value={eventSearchQuery}
          onChange={setEventSearchQuery}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="small">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Event Name" required />
                <TextField label="Date" type="date" />
                <TextField label="Location" />
                <NumberField label="Capacity" />
                <TextArea label="Description" rows={3} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" slot="close">
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Events">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Location</Table.Column>
          <Table.Column>Capacity</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredEvents.map(event => (
            <Table.Row key={event.id}>
              <Table.Cell>{event.name}</Table.Cell>
              <Table.Cell>{event.date}</Table.Cell>
              <Table.Cell>{event.location || '-'}</Table.Cell>
              <Table.Cell>{event.capacity || '-'}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(event.status)}>
                  {event.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderAttendees = () => (
    <Stack space={6}>
      <Inline space={4} alignY="center">
        <Headline level={2}>Attendees</Headline>
        <Text size="sm" variant="muted">
          {filteredAttendees.length} attendees
        </Text>
      </Inline>

      <SearchField
        label="Search"
        placeholder="Search by name or email"
        value={attendeeSearchQuery}
        onChange={setAttendeeSearchQuery}
      />

      <Table aria-label="Attendees">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Email</Table.Column>
          <Table.Column>Events Attended</Table.Column>
          <Table.Column>Last Active</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredAttendees.map(attendee => (
            <Table.Row key={attendee.id}>
              <Table.Cell>{attendee.name}</Table.Cell>
              <Table.Cell>{attendee.email}</Table.Cell>
              <Table.Cell>{attendee.eventsAttended}</Table.Cell>
              <Table.Cell>{attendee.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(attendee.status)}>
                  {attendee.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderReports = () => (
    <Stack space={6}>
      <Headline level={2}>Reports</Headline>

      <Tabs aria-label="Reports">
        <Tabs.List aria-label="Report tabs">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="revenue">
          <Stack space={4}>
            <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="60em">
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      Total Revenue
                    </Text>
                    <Text size="xl" weight="bold">
                      $45,230
                    </Text>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      This Month
                    </Text>
                    <Text size="xl" weight="bold">
                      $8,420
                    </Text>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      Average per Event
                    </Text>
                    <Text size="xl" weight="bold">
                      $1,885
                    </Text>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      Refunds
                    </Text>
                    <Text size="xl" weight="bold">
                      $1,230
                    </Text>
                  </Stack>
                </Inset>
              </Card>
            </Columns>

            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue is up 12%</SectionMessage.Title>
              <SectionMessage.Content>
                compared to last month.
              </SectionMessage.Content>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="attendance">
          <Stack space={4}>
            <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="60em">
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      Total Attendees
                    </Text>
                    <Text size="xl" weight="bold">
                      3,200
                    </Text>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      Repeat Visitors
                    </Text>
                    <Text size="xl" weight="bold">
                      890
                    </Text>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      Average per Event
                    </Text>
                    <Text size="xl" weight="bold">
                      178
                    </Text>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space="square-regular">
                  <Stack space={2}>
                    <Text size="sm" variant="muted">
                      No-shows
                    </Text>
                    <Text size="xl" weight="bold">
                      145
                    </Text>
                  </Stack>
                </Inset>
              </Card>
            </Columns>

            <Stack space={3}>
              <Headline level={3}>Top Events by Attendance</Headline>
              <Table aria-label="Top Events by Attendance">
                <Table.Header>
                  <Table.Column>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Attendees</Table.Column>
                  <Table.Column>Capacity</Table.Column>
                  <Table.Column>Fill Rate</Table.Column>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Music Festival</Table.Cell>
                    <Table.Cell>2025-08-20</Table.Cell>
                    <Table.Cell>1850</Table.Cell>
                    <Table.Cell>2000</Table.Cell>
                    <Table.Cell>92.5%</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Tech Conference</Table.Cell>
                    <Table.Cell>2025-07-15</Table.Cell>
                    <Table.Cell>480</Table.Cell>
                    <Table.Cell>500</Table.Cell>
                    <Table.Cell>96%</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Charity Gala</Table.Cell>
                    <Table.Cell>2025-10-12</Table.Cell>
                    <Table.Cell>285</Table.Cell>
                    <Table.Cell>300</Table.Cell>
                    <Table.Cell>95%</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Art Expo</Table.Cell>
                    <Table.Cell>2025-09-05</Table.Cell>
                    <Table.Cell>750</Table.Cell>
                    <Table.Cell>800</Table.Cell>
                    <Table.Cell>93.75%</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Stack>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="overview">
          <Stack space={4}>
            <Text>
              This quarter has been exceptional for EventHub. We've hosted 24
              events with strong attendance and revenue growth across all
              categories.
            </Text>

            <Accordion>
              <Accordion.Item>
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q1 focused on establishing foundational events in the local
                    community. We successfully launched 8 events with a combined
                    attendance of 1,200 participants. Average revenue per event
                    was $1,650.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q2 saw expansion into regional markets. We organized 9 events
                    with 1,800 attendees and achieved an average revenue of $1,950
                    per event. This was our strongest quarter to date.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q3 is ramping up with 7 scheduled events already booked. Early
                    indicators suggest we'll exceed Q2 performance with projected
                    attendance of 2,100 and average revenue of $2,150 per event.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={6}>
      <Headline level={2}>Settings</Headline>

      <Tabs aria-label="Settings">
        <Tabs.List aria-label="Settings tabs">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <Stack space={3}>
              <TextField
                label="Organization Name"
                value={generalSettings.orgName}
                onChange={e =>
                  setGeneralSettings({
                    ...generalSettings,
                    orgName: e as unknown as string,
                  })
                }
              />
              <TextField
                label="Contact Email"
                type="email"
                value={generalSettings.contactEmail}
                onChange={e =>
                  setGeneralSettings({
                    ...generalSettings,
                    contactEmail: e as unknown as string,
                  })
                }
              />
              <Select
                label="Default Currency"
                selectedKey={generalSettings.defaultCurrency}
                onSelectionChange={key =>
                  setGeneralSettings({
                    ...generalSettings,
                    defaultCurrency: key as string,
                  })
                }
              >
                <Select.Option id="usd">USD ($)</Select.Option>
                <Select.Option id="eur">EUR (€)</Select.Option>
                <Select.Option id="gbp">GBP (£)</Select.Option>
              </Select>
              <Select
                label="Default Timezone"
                selectedKey={generalSettings.defaultTimezone}
                onSelectionChange={key =>
                  setGeneralSettings({
                    ...generalSettings,
                    defaultTimezone: key as string,
                  })
                }
              >
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>
            </Stack>

            <Button variant="primary" onPress={handleSaveGeneralSettings}>
              Save Changes
            </Button>

            {settingsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Settings saved successfully</SectionMessage.Title>
              </SectionMessage>
            )}
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={3}>
              <Stack space={1}>
                <Switch
                  label="Email Notifications"
                  selected={notificationSettings.emailNotifications}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications:
                        !notificationSettings.emailNotifications,
                    })
                  }
                />
                <Text size="sm" variant="muted">
                  Receive email updates about your events
                </Text>
              </Stack>

              <Stack space={1}>
                <Switch
                  label="SMS Notifications"
                  selected={notificationSettings.smsNotifications}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: !notificationSettings.smsNotifications,
                    })
                  }
                />
                <Text size="sm" variant="muted">
                  Receive SMS alerts for critical updates
                </Text>
              </Stack>

              <Stack space={1}>
                <Switch
                  label="Weekly Digest"
                  selected={notificationSettings.weeklyDigest}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyDigest: !notificationSettings.weeklyDigest,
                    })
                  }
                />
                <Text size="sm" variant="muted">
                  Get a weekly summary of your event analytics
                </Text>
              </Stack>

              <Stack space={1}>
                <Switch
                  label="Marketing Emails"
                  selected={notificationSettings.marketingEmails}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: !notificationSettings.marketingEmails,
                    })
                  }
                />
                <Text size="sm" variant="muted">
                  Receive promotional offers and feature announcements
                </Text>
              </Stack>
            </Stack>

            <Button
              variant="primary"
              onPress={handleSaveNotificationSettings}
            >
              Save Preferences
            </Button>

            {settingsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Settings saved successfully</SectionMessage.Title>
              </SectionMessage>
            )}
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const getBreadcrumb = () => {
    switch (currentPage) {
      case 'events':
        return 'Events';
      case 'attendees':
        return 'Attendees';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <Sidebar.Provider defaultOpen>
      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Text weight="bold" size="lg">
              EventHub
            </Text>
          </Sidebar.Header>
          <Sidebar.Nav>
            <Sidebar.Item
              href="#dashboard"
              onPress={() => setCurrentPage('dashboard')}
              active={currentPage === 'dashboard'}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="#events"
              onPress={() => setCurrentPage('events')}
              active={currentPage === 'events'}
            >
              Events
            </Sidebar.Item>
            <Sidebar.Item
              href="#attendees"
              onPress={() => setCurrentPage('attendees')}
              active={currentPage === 'attendees'}
            >
              Attendees
            </Sidebar.Item>
            <Sidebar.Item
              href="#reports"
              onPress={() => setCurrentPage('reports')}
              active={currentPage === 'reports'}
            >
              Reports
            </Sidebar.Item>

            <Sidebar.Separator />

            <Sidebar.Item
              href="#settings"
              onPress={() => setCurrentPage('settings')}
              active={currentPage === 'settings'}
            >
              Settings
            </Sidebar.Item>
          </Sidebar.Nav>
          <Sidebar.Footer>
            <Sidebar.Item href="#">Help & Support</Sidebar.Item>
          </Sidebar.Footer>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation.Start>
            <Sidebar.Toggle />
          </TopNavigation.Start>

          <TopNavigation.Middle>
            <Inline space={1} alignY="center">
              <Text size="sm">EventHub</Text>
              <Text size="sm" variant="muted">
                &gt;
              </Text>
              <Text size="sm">{getBreadcrumb()}</Text>
            </Inline>
          </TopNavigation.Middle>

          <TopNavigation.End>
            <Menu label="Account" onAction={action => {
              if (action === 'signout') {
                setIsSignOutOpen(true);
              }
            }}>
              <Menu.Item id="profile">Profile</Menu.Item>
              <Menu.Item id="signout">Sign out</Menu.Item>
            </Menu>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space="square-regular">
            {currentPage === 'dashboard' && renderDashboard()}
            {currentPage === 'events' && renderEvents()}
            {currentPage === 'attendees' && renderAttendees()}
            {currentPage === 'reports' && renderReports()}
            {currentPage === 'settings' && renderSettings()}
          </Inset>
        </AppLayout.Main>
      </AppLayout>

      <Dialog
        open={isSignOutOpen}
        onOpenChange={setIsSignOutOpen}
        role="alertdialog"
      >
        <Dialog.Title>Are you sure you want to sign out?</Dialog.Title>
        <Dialog.Actions>
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="destructive" onPress={handleSignOut}>
            Sign out
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Sidebar.Provider>
  );
};

export default EventHub;
