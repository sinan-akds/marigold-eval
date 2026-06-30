'use client';

import { useState } from 'react';
import {
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Columns,
  Dialog,
  Headline,
  Inset,
  Inline,
  Menu,
  NumberField,
  SearchField,
  Select,
  SectionMessage,
  Sidebar,
  Stack,
  Table,
  Tabs,
  Text,
  TextField,
  TextArea,
  TopNavigation,
  Tooltip,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketsSold: number;
  status: 'On Sale' | 'Draft' | 'Sold Out';
  venue: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  eventsAttended: number;
  lastActive: string;
}

const EventHub = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  // Dashboard state
  const [dashboardEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Summer Concert Series',
      date: '2024-07-15',
      location: 'Central Park',
      ticketsSold: 450,
      status: 'On Sale',
      venue: 'Central Park',
    },
    {
      id: '2',
      name: 'Tech Conference 2024',
      date: '2024-08-01',
      location: 'Convention Center',
      ticketsSold: 892,
      status: 'On Sale',
      venue: 'Convention Center',
    },
    {
      id: '3',
      name: 'Jazz Night',
      date: '2024-07-20',
      location: 'Blue Note',
      ticketsSold: 250,
      status: 'Sold Out',
      venue: 'Blue Note',
    },
    {
      id: '4',
      name: 'Art Exhibition Opening',
      date: '2024-09-10',
      location: 'Modern Art Museum',
      ticketsSold: 0,
      status: 'Draft',
      venue: 'Modern Art Museum',
    },
    {
      id: '5',
      name: 'Food Festival',
      date: '2024-08-05',
      location: 'Riverside Park',
      ticketsSold: 1200,
      status: 'On Sale',
      venue: 'Riverside Park',
    },
    {
      id: '6',
      name: 'Broadway Show',
      date: '2024-07-25',
      location: 'Theater District',
      ticketsSold: 567,
      status: 'On Sale',
      venue: 'Theater District',
    },
  ]);

  // Events page state
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Summer Concert Series',
      date: '2024-07-15',
      location: 'Central Park',
      ticketsSold: 450,
      status: 'On Sale',
      venue: 'Central Park',
    },
    {
      id: '2',
      name: 'Tech Conference 2024',
      date: '2024-08-01',
      location: 'Convention Center',
      ticketsSold: 892,
      status: 'On Sale',
      venue: 'Convention Center',
    },
    {
      id: '3',
      name: 'Jazz Night',
      date: '2024-07-20',
      location: 'Blue Note',
      ticketsSold: 250,
      status: 'Sold Out',
      venue: 'Blue Note',
    },
    {
      id: '4',
      name: 'Art Exhibition Opening',
      date: '2024-09-10',
      location: 'Modern Art Museum',
      ticketsSold: 0,
      status: 'Draft',
      venue: 'Modern Art Museum',
    },
    {
      id: '5',
      name: 'Food Festival',
      date: '2024-08-05',
      location: 'Riverside Park',
      ticketsSold: 1200,
      status: 'On Sale',
      venue: 'Riverside Park',
    },
    {
      id: '6',
      name: 'Broadway Show',
      date: '2024-07-25',
      location: 'Theater District',
      ticketsSold: 567,
      status: 'On Sale',
      venue: 'Theater District',
    },
  ]);
  const [eventSearch, setEventSearch] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    location: '',
    capacity: '',
    description: '',
  });

  // Attendees page state
  const [attendees] = useState<Attendee[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      eventsAttended: 5,
      lastActive: '2024-06-25',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      eventsAttended: 3,
      lastActive: '2024-06-20',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      eventsAttended: 8,
      lastActive: '2024-06-28',
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      eventsAttended: 2,
      lastActive: '2024-05-15',
    },
    {
      id: '5',
      name: 'Emma Brown',
      email: 'emma@example.com',
      eventsAttended: 6,
      lastActive: '2024-06-26',
    },
    {
      id: '6',
      name: 'Frank Miller',
      email: 'frank@example.com',
      eventsAttended: 1,
      lastActive: '2024-06-18',
    },
  ]);
  const [attendeeSearch, setAttendeeSearch] = useState('');

  // Settings state
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsNotifications, setSettingsNotifications] = useState(false);
  const [orgSettings, setOrgSettings] = useState({
    organizationName: 'EventHub Inc',
    contactEmail: 'contact@eventhub.com',
    defaultCurrency: 'USD',
    defaultTimezone: 'UTC',
  });

  const filteredEvents = events.filter(
    e =>
      e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredAttendees = attendees.filter(
    a =>
      a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const isActive = (lastActiveDateStr: string) => {
    const lastActive = new Date(lastActiveDateStr);
    const thirtyDaysAgo = new Date('2024-05-28');
    return lastActive >= thirtyDaysAgo;
  };

  const handleCreateEvent = () => {
    if (newEvent.name && newEvent.date) {
      const event: Event = {
        id: String(events.length + 1),
        name: newEvent.name,
        date: newEvent.date,
        location: newEvent.location,
        ticketsSold: 0,
        status: 'Draft',
        venue: newEvent.location,
      };
      setEvents([...events, event]);
      setNewEvent({ name: '', date: '', location: '', capacity: '', description: '' });
    }
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const getBreadcrumbs = () => {
    const titles: Record<Page, string> = {
      dashboard: 'Dashboard',
      events: 'Events',
      attendees: 'Attendees',
      reports: 'Reports',
      settings: 'Settings',
    };
    return titles[currentPage];
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Stack space="section">
            <Headline level="2">Dashboard Overview</Headline>
            <SectionMessage variant="info">
              Welcome back! You have 3 events starting this week.
            </SectionMessage>

            <Columns columns={[1, 1, 1, 1]} space="related">
              <Card p={4}>
                <Stack space="tight">
                  <Text fontSize="xs" color="muted">
                    Total Events
                  </Text>
                  <Text fontSize="2xl" weight="bold">
                    24
                  </Text>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space="tight">
                  <Text fontSize="xs" color="muted">
                    Tickets Sold
                  </Text>
                  <Text fontSize="2xl" weight="bold">
                    1,849
                  </Text>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space="tight">
                  <Tooltip.Trigger>
                    <Text fontSize="xs" color="muted">
                      Revenue
                    </Text>
                    <Tooltip>Net revenue after fees and refunds</Tooltip>
                  </Tooltip.Trigger>
                  <Text fontSize="2xl" weight="bold">
                    $45,230
                  </Text>
                </Stack>
              </Card>
              <Card p={4}>
                <Stack space="tight">
                  <Text fontSize="xs" color="muted">
                    Upcoming
                  </Text>
                  <Text fontSize="2xl" weight="bold">
                    8
                  </Text>
                </Stack>
              </Card>
            </Columns>

            <Stack space="tight">
              <Headline level="3">Upcoming Events</Headline>
              <Table aria-label="Upcoming Events">
                <Table.Header>
                  <Table.Column rowHeader>Event</Table.Column>
                  <Table.Column>Date</Table.Column>
                  <Table.Column>Venue</Table.Column>
                  <Table.Column>Tickets Sold</Table.Column>
                  <Table.Column>Status</Table.Column>
                </Table.Header>
                <Table.Body>
                  {dashboardEvents.map(event => (
                    <Table.Row key={event.id}>
                      <Table.Cell>
                        <Text weight="medium">{event.name}</Text>
                      </Table.Cell>
                      <Table.Cell>{event.date}</Table.Cell>
                      <Table.Cell>{event.venue}</Table.Cell>
                      <Table.Cell>{event.ticketsSold}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          variant={
                            event.status === 'On Sale'
                              ? 'success'
                              : event.status === 'Draft'
                                ? 'warning'
                                : 'error'
                          }
                        >
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

      case 'events':
        return (
          <Stack space="section">
            <Inline space="section" alignY="center">
              <Headline level="2">Events</Headline>
              <Dialog.Trigger>
                <Button variant="primary">Create Event</Button>
                <Dialog size="small" closeButton>
                  {({ close }) => (
                    <Stack space="section">
                      <Dialog.Title>Create Event</Dialog.Title>
                      <Dialog.Content>
                        <Stack space="section">
                          <TextField
                            label="Event Name"
                            required
                            value={newEvent.name}
                            onChange={value =>
                              setNewEvent({ ...newEvent, name: value })
                            }
                          />
                          <TextField
                            label="Date"
                            type="date"
                            value={newEvent.date}
                            onChange={value =>
                              setNewEvent({ ...newEvent, date: value })
                            }
                          />
                          <TextField
                            label="Location"
                            value={newEvent.location}
                            onChange={value =>
                              setNewEvent({ ...newEvent, location: value })
                            }
                          />
                          <NumberField
                            label="Capacity"
                            value={newEvent.capacity ? Number(newEvent.capacity) : undefined}
                            onChange={value =>
                              setNewEvent({
                                ...newEvent,
                                capacity: value !== null && value !== undefined ? String(value) : '',
                              })
                            }
                          />
                          <TextArea
                            label="Description"
                            value={newEvent.description}
                            onChange={value =>
                              setNewEvent({ ...newEvent, description: value })
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
                          onPress={() => {
                            handleCreateEvent();
                            close?.();
                          }}
                        >
                          Create
                        </Button>
                      </Dialog.Actions>
                    </Stack>
                  )}
                </Dialog>
              </Dialog.Trigger>
            </Inline>

            <SearchField
              label="Search events"
              value={eventSearch}
              onChange={setEventSearch}
            />

            <Table aria-label="Events list">
              <Table.Header>
                <Table.Column rowHeader>Name</Table.Column>
                <Table.Column>Date</Table.Column>
                <Table.Column>Location</Table.Column>
                <Table.Column>Capacity</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Header>
              <Table.Body>
                {filteredEvents.map(event => (
                  <Table.Row key={event.id}>
                    <Table.Cell>
                      <Text weight="medium">{event.name}</Text>
                    </Table.Cell>
                    <Table.Cell>{event.date}</Table.Cell>
                    <Table.Cell>{event.location}</Table.Cell>
                    <Table.Cell>-</Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant={
                          event.status === 'On Sale'
                            ? 'success'
                            : event.status === 'Draft'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {event.status}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        );

      case 'attendees':
        return (
          <Stack space="section">
            <Headline level="2">Attendees</Headline>

            <SearchField
              label="Search by name or email"
              value={attendeeSearch}
              onChange={setAttendeeSearch}
            />

            <Text fontSize="sm">
              <Text weight="bold" slot="inline">{filteredAttendees.length}</Text> attendees
            </Text>

            <Table aria-label="Attendees list">
              <Table.Header>
                <Table.Column rowHeader>Name</Table.Column>
                <Table.Column>Email</Table.Column>
                <Table.Column>Events Attended</Table.Column>
                <Table.Column>Last Active</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Header>
              <Table.Body>
                {filteredAttendees.map(attendee => (
                  <Table.Row key={attendee.id}>
                    <Table.Cell>
                      <Text weight="medium">{attendee.name}</Text>
                    </Table.Cell>
                    <Table.Cell>{attendee.email}</Table.Cell>
                    <Table.Cell>{attendee.eventsAttended}</Table.Cell>
                    <Table.Cell>{attendee.lastActive}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        variant={
                          isActive(attendee.lastActive) ? 'success' : 'warning'
                        }
                      >
                        {isActive(attendee.lastActive) ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        );

      case 'reports':
        return (
          <Stack space="section">
            <Headline level="2">Reports</Headline>
            <Tabs aria-label="Reports tabs">
              <Tabs.List aria-label="Report sections">
                <Tabs.Item id="revenue">Revenue</Tabs.Item>
                <Tabs.Item id="attendance">Attendance</Tabs.Item>
                <Tabs.Item id="overview">Overview</Tabs.Item>
              </Tabs.List>

              <Tabs.TabPanel id="revenue">
                <Stack space="section">
                  <Columns columns={[1, 1, 1, 1]} space="related">
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          Total Revenue
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          $45,230
                        </Text>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          This Month
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          $8,420
                        </Text>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          Average per Event
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          $1,885
                        </Text>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          Refunds
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          $1,230
                        </Text>
                      </Stack>
                    </Card>
                  </Columns>
                  <SectionMessage variant="success">
                    Revenue is up 12% compared to last month.
                  </SectionMessage>
                </Stack>
              </Tabs.TabPanel>

              <Tabs.TabPanel id="attendance">
                <Stack space="section">
                  <Columns columns={[1, 1, 1, 1]} space="related">
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          Total Attendees
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          3,200
                        </Text>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          Repeat Visitors
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          890
                        </Text>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          Average per Event
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          178
                        </Text>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space="tight">
                        <Text fontSize="xs" color="muted">
                          No-shows
                        </Text>
                        <Text fontSize="2xl" weight="bold">
                          145
                        </Text>
                      </Stack>
                    </Card>
                  </Columns>

                  <Table aria-label="Top Events by Attendance">
                    <Table.Header>
                      <Table.Column rowHeader>Event</Table.Column>
                      <Table.Column>Date</Table.Column>
                      <Table.Column>Attendees</Table.Column>
                      <Table.Column>Capacity</Table.Column>
                      <Table.Column>Fill Rate</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight="medium">Tech Conference 2024</Text>
                        </Table.Cell>
                        <Table.Cell>2024-08-01</Table.Cell>
                        <Table.Cell>892</Table.Cell>
                        <Table.Cell>1000</Table.Cell>
                        <Table.Cell>89.2%</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight="medium">Food Festival</Text>
                        </Table.Cell>
                        <Table.Cell>2024-08-05</Table.Cell>
                        <Table.Cell>1200</Table.Cell>
                        <Table.Cell>1500</Table.Cell>
                        <Table.Cell>80.0%</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight="medium">Summer Concert Series</Text>
                        </Table.Cell>
                        <Table.Cell>2024-07-15</Table.Cell>
                        <Table.Cell>450</Table.Cell>
                        <Table.Cell>500</Table.Cell>
                        <Table.Cell>90.0%</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>
                          <Text weight="medium">Broadway Show</Text>
                        </Table.Cell>
                        <Table.Cell>2024-07-25</Table.Cell>
                        <Table.Cell>567</Table.Cell>
                        <Table.Cell>600</Table.Cell>
                        <Table.Cell>94.5%</Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </Stack>
              </Tabs.TabPanel>

              <Tabs.TabPanel id="overview">
                <Stack space="section">
                  <Text>
                    This quarter has been highly successful with record attendance
                    and revenue across most events. We have seen a strong uptake in
                    tech and entertainment events, while food festivals continue to
                    drive significant engagement.
                  </Text>

                  <Tabs aria-label="Quarter summaries">
                    <Tabs.List aria-label="Quarters">
                      <Tabs.Item id="q1">Q1 Summary</Tabs.Item>
                      <Tabs.Item id="q2">Q2 Summary</Tabs.Item>
                      <Tabs.Item id="q3">Q3 Summary</Tabs.Item>
                    </Tabs.List>

                    <Tabs.TabPanel id="q1">
                      <Inset space="square-regular">
                        <Text>
                          Q1 saw moderate growth with 12 events and an average
                          attendance of 150 people per event. Revenue was steady at
                          $18,500 for the quarter.
                        </Text>
                      </Inset>
                    </Tabs.TabPanel>

                    <Tabs.TabPanel id="q2">
                      <Inset space="square-regular">
                        <Text>
                          Q2 marked a turning point with 18 events and significantly
                          increased attendance. Revenue jumped to $28,420 with strong
                          ticket sales for tech and entertainment categories.
                        </Text>
                      </Inset>
                    </Tabs.TabPanel>

                    <Tabs.TabPanel id="q3">
                      <Inset space="square-regular">
                        <Text>
                          Q3 is on track to be our best quarter yet with 24 events
                          already scheduled and trending towards $45,000+ in revenue
                          based on current booking rates.
                        </Text>
                      </Inset>
                    </Tabs.TabPanel>
                  </Tabs>
                </Stack>
              </Tabs.TabPanel>
            </Tabs>
          </Stack>
        );

      case 'settings':
        return (
          <Stack space="section">
            <Headline level="2">Settings</Headline>
            <Tabs aria-label="Settings tabs">
              <Tabs.List aria-label="Settings sections">
                <Tabs.Item id="general">General</Tabs.Item>
                <Tabs.Item id="notifications">Notifications</Tabs.Item>
              </Tabs.List>

              <Tabs.TabPanel id="general">
                <Stack space="section">
                  {settingsSaved && (
                    <SectionMessage variant="success">
                      Settings saved successfully.
                    </SectionMessage>
                  )}
                  <Stack space="regular">
                    <TextField
                      label="Organization Name"
                      value={orgSettings.organizationName}
                      onChange={value =>
                        setOrgSettings({
                          ...orgSettings,
                          organizationName: value,
                        })
                      }
                    />
                    <TextField
                      label="Contact Email"
                      type="email"
                      value={orgSettings.contactEmail}
                      onChange={value =>
                        setOrgSettings({
                          ...orgSettings,
                          contactEmail: value,
                        })
                      }
                    />
                    <Select
                      label="Default Currency"
                      selectedKey={orgSettings.defaultCurrency}
                      onSelectionChange={key =>
                        setOrgSettings({
                          ...orgSettings,
                          defaultCurrency: String(key),
                        })
                      }
                    >
                      <Select.Option id="USD">USD</Select.Option>
                      <Select.Option id="EUR">EUR</Select.Option>
                      <Select.Option id="GBP">GBP</Select.Option>
                    </Select>
                    <Select
                      label="Default Timezone"
                      selectedKey={orgSettings.defaultTimezone}
                      onSelectionChange={key =>
                        setOrgSettings({
                          ...orgSettings,
                          defaultTimezone: String(key),
                        })
                      }
                    >
                      <Select.Option id="UTC">UTC</Select.Option>
                      <Select.Option id="CET">CET</Select.Option>
                      <Select.Option id="EST">EST</Select.Option>
                      <Select.Option id="PST">PST</Select.Option>
                    </Select>
                  </Stack>
                  <Button variant="primary" onPress={handleSaveSettings}>
                    Save Changes
                  </Button>
                </Stack>
              </Tabs.TabPanel>

              <Tabs.TabPanel id="notifications">
                <Stack space="section">
                  {settingsNotifications && (
                    <SectionMessage variant="success">
                      Preferences saved successfully.
                    </SectionMessage>
                  )}
                  <Stack space="regular">
                    <Stack space="tight">
                      <Text weight="medium">Email Notifications</Text>
                      <Text fontSize="sm" color="muted">
                        Receive email updates about your events
                      </Text>
                    </Stack>
                    <Stack space="tight">
                      <Text weight="medium">SMS Notifications</Text>
                      <Text fontSize="sm" color="muted">
                        Get text message alerts for important updates
                      </Text>
                    </Stack>
                    <Stack space="tight">
                      <Text weight="medium">Weekly Digest</Text>
                      <Text fontSize="sm" color="muted">
                        Receive a summary of all events once per week
                      </Text>
                    </Stack>
                    <Stack space="tight">
                      <Text weight="medium">Marketing Emails</Text>
                      <Text fontSize="sm" color="muted">
                        Get promotional offers and product updates
                      </Text>
                    </Stack>
                  </Stack>
                  <Button
                    variant="primary"
                    onPress={() => setSettingsNotifications(true)}
                  >
                    Save Preferences
                  </Button>
                </Stack>
              </Tabs.TabPanel>
            </Tabs>
          </Stack>
        );

      default:
        return null;
    }
  };

  const navItems: { id: Page; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'events', label: 'Events' },
    { id: 'attendees', label: 'Attendees' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

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
            <Stack space="tight">
              {navItems.map(item => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'primary' : 'ghost'}
                  fullWidth
                  onPress={() => setCurrentPage(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Sidebar.Nav>
          <Sidebar.Separator />
          <Sidebar.Footer>
            <Button variant="ghost" fullWidth>
              Help & Support
            </Button>
          </Sidebar.Footer>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation.Start>
            <Sidebar.Toggle />
          </TopNavigation.Start>
          <TopNavigation.Middle>
            <Breadcrumbs size="small">
              <Breadcrumbs.Item href="#">EventHub</Breadcrumbs.Item>
              <Breadcrumbs.Item href="#">{getBreadcrumbs()}</Breadcrumbs.Item>
            </Breadcrumbs>
          </TopNavigation.Middle>
          <TopNavigation.End>
            <Menu label="Account" onAction={action => {
              if (action === 'signout') {
                setSignOutOpen(true);
              }
            }}>
              <Menu.Item id="profile">Profile</Menu.Item>
              <Menu.Item id="signout">Sign out</Menu.Item>
            </Menu>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space="square-regular">
            {renderPage()}
          </Inset>
        </AppLayout.Main>
      </AppLayout>

      <Dialog.Trigger
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
        dismissable={false}
      >
        <Dialog role="alertdialog" closeButton>
          {({ close }) => (
            <Stack space="section">
              <Dialog.Title>Confirm Sign Out</Dialog.Title>
              <Dialog.Content>
                Are you sure you want to sign out?
              </Dialog.Content>
              <Dialog.Actions>
                <Button variant="secondary" slot="close">
                  Cancel
                </Button>
                <Button variant="primary" onPress={close ? () => close() : undefined}>
                  Sign out
                </Button>
              </Dialog.Actions>
            </Stack>
          )}
        </Dialog>
      </Dialog.Trigger>
    </Sidebar.Provider>
  );
};

export default EventHub;
