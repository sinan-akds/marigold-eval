import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
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
} from '@marigold/components';

const upcomingDashboard = [
  { id: '1', event: 'Summer Music Festival', date: 'Jul 15, 2026', venue: 'Central Park', tickets: 1200, status: 'On Sale' },
  { id: '2', event: 'Tech Innovation Summit', date: 'Jul 18, 2026', venue: 'Convention Center', tickets: 450, status: 'On Sale' },
  { id: '3', event: 'Jazz in the Park', date: 'Jul 20, 2026', venue: 'Riverside Amphitheater', tickets: 0, status: 'Draft' },
  { id: '4', event: 'Comedy Night Extravaganza', date: 'Jul 22, 2026', venue: 'The Grand Theater', tickets: 800, status: 'Sold Out' },
  { id: '5', event: 'Food & Wine Festival', date: 'Jul 25, 2026', venue: 'Exhibition Hall', tickets: 320, status: 'On Sale' },
  { id: '6', event: 'Startup Pitch Night', date: 'Aug 1, 2026', venue: 'Innovation Hub', tickets: 150, status: 'Draft' },
];

const eventsData = [
  { id: '1', name: 'Summer Music Festival', date: 'Jul 15, 2026', location: 'Central Park, NYC', capacity: 2000, status: 'On Sale' },
  { id: '2', name: 'Tech Innovation Summit', date: 'Jul 18, 2026', location: 'Convention Center, SF', capacity: 500, status: 'On Sale' },
  { id: '3', name: 'Jazz in the Park', date: 'Jul 20, 2026', location: 'Riverside Amphitheater', capacity: 300, status: 'Draft' },
  { id: '4', name: 'Comedy Night Extravaganza', date: 'Jul 22, 2026', location: 'The Grand Theater, LA', capacity: 800, status: 'Sold Out' },
  { id: '5', name: 'Food & Wine Festival', date: 'Jul 25, 2026', location: 'Exhibition Hall, Chicago', capacity: 1500, status: 'On Sale' },
  { id: '6', name: 'Startup Pitch Night', date: 'Aug 1, 2026', location: 'Innovation Hub, Austin', capacity: 200, status: 'Draft' },
];

const attendeesData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', events: 5, lastActive: '2026-06-20' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', events: 3, lastActive: '2026-06-25' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', events: 8, lastActive: '2026-05-10' },
  { id: '4', name: 'David Brown', email: 'david@example.com', events: 2, lastActive: '2026-06-28' },
  { id: '5', name: 'Emma Davis', email: 'emma@example.com', events: 12, lastActive: '2026-04-15' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', events: 1, lastActive: '2026-06-15' },
];

const topAttendance = [
  { id: '1', event: 'Summer Music Festival', date: 'Jul 15, 2026', attendees: 1200, capacity: 2000, fillRate: '60%' },
  { id: '2', event: 'Comedy Night Extravaganza', date: 'Jul 22, 2026', attendees: 800, capacity: 800, fillRate: '100%' },
  { id: '3', event: 'Tech Innovation Summit', date: 'Jul 18, 2026', attendees: 450, capacity: 500, fillRate: '90%' },
  { id: '4', event: 'Food & Wine Festival', date: 'Jul 25, 2026', attendees: 320, capacity: 1500, fillRate: '21%' },
];

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

const statusVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  if (status === 'On Sale' || status === 'Active') return 'success';
  if (status === 'Sold Out') return 'error';
  if (status === 'Inactive') return 'warning';
  return 'default';
};

const isActive = (lastActive: string): boolean => {
  return new Date(lastActive) >= new Date('2026-05-29');
};

const EventHub = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [eventSearch, setEventSearch] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const currentPageName = pageNames[currentPath] ?? 'Dashboard';

  const filteredEvents = eventsData.filter(
    e =>
      !eventSearch ||
      e.name.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.location.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredAttendees = attendeesData.filter(
    a =>
      !attendeeSearch ||
      a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  return (
    <RouterProvider navigate={setCurrentPath}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">EventHub</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={currentPath}>
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
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">EventHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href={currentPath}>{currentPageName}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu
                label="User Account"
                onAction={action => {
                  if (action === 'signout') setSignOutOpen(true);
                }}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="signout">Sign out</Menu.Item>
              </Menu>
              <Dialog open={signOutOpen} onOpenChange={setSignOutOpen} size="small">
                {({ close }) => (
                  <>
                    <Dialog.Title>Sign Out</Dialog.Title>
                    <Dialog.Content>
                      <Text>Are you sure you want to sign out?</Text>
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
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              {/* ── Dashboard ── */}
              {currentPath === '/dashboard' && (
                <Stack space={6}>
                  <Headline level={1}>Dashboard Overview</Headline>
                  <SectionMessage variant="info">
                    <SectionMessage.Title>Welcome back!</SectionMessage.Title>
                    <SectionMessage.Content>
                      You have 3 events starting this week.
                    </SectionMessage.Content>
                  </SectionMessage>
                  <Tiles tilesWidth="180px" space={4} stretch>
                    <Card p={4}>
                      <Stack space={1}>
                        <Text>Total Events</Text>
                        <Headline level={2}>24</Headline>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space={1}>
                        <Text>Tickets Sold</Text>
                        <Headline level={2}>1,849</Headline>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space={1}>
                        <Inline space={1} alignY="center">
                          <Text>Revenue</Text>
                          <Tooltip.Trigger>
                            <Button variant="icon" aria-label="Revenue details">
                              ℹ
                            </Button>
                            <Tooltip>Net revenue after fees and refunds</Tooltip>
                          </Tooltip.Trigger>
                        </Inline>
                        <Headline level={2}>$45,230</Headline>
                      </Stack>
                    </Card>
                    <Card p={4}>
                      <Stack space={1}>
                        <Text>Upcoming</Text>
                        <Headline level={2}>8</Headline>
                      </Stack>
                    </Card>
                  </Tiles>
                  <Stack space={3}>
                    <Headline level={3}>Upcoming Events</Headline>
                    <Table aria-label="Upcoming Events">
                      <Table.Header>
                        <Table.Column rowHeader>Event</Table.Column>
                        <Table.Column>Date</Table.Column>
                        <Table.Column>Venue</Table.Column>
                        <Table.Column>Tickets Sold</Table.Column>
                        <Table.Column>Status</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {upcomingDashboard.map(row => (
                          <Table.Row key={row.id}>
                            <Table.Cell>{row.event}</Table.Cell>
                            <Table.Cell>{row.date}</Table.Cell>
                            <Table.Cell>{row.venue}</Table.Cell>
                            <Table.Cell>{row.tickets}</Table.Cell>
                            <Table.Cell>
                              <Badge variant={statusVariant(row.status)}>
                                {row.status}
                              </Badge>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Stack>
                </Stack>
              )}

              {/* ── Events ── */}
              {currentPath === '/events' && (
                <Stack space={6}>
                  <Headline level={1}>Events</Headline>
                  <Inline space={4} alignY="center">
                    <SearchField
                      aria-label="Search events by name or location"
                      value={eventSearch}
                      onChange={setEventSearch}
                    />
                    <Dialog.Trigger>
                      <Button variant="primary">Create Event</Button>
                      <Dialog size="medium">
                        <Dialog.Title>Create Event</Dialog.Title>
                        <Dialog.Content>
                          <Stack space={4}>
                            <TextField label="Event Name" required />
                            <TextField label="Date" type="date" />
                            <TextField label="Location" />
                            <NumberField label="Capacity" minValue={0} />
                            <TextArea label="Description" rows={4} />
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
                      <Table.Column rowHeader>Name</Table.Column>
                      <Table.Column>Date</Table.Column>
                      <Table.Column>Location</Table.Column>
                      <Table.Column>Capacity</Table.Column>
                      <Table.Column>Status</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {filteredEvents.map(row => (
                        <Table.Row key={row.id}>
                          <Table.Cell>{row.name}</Table.Cell>
                          <Table.Cell>{row.date}</Table.Cell>
                          <Table.Cell>{row.location}</Table.Cell>
                          <Table.Cell>{row.capacity}</Table.Cell>
                          <Table.Cell>
                            <Badge variant={statusVariant(row.status)}>
                              {row.status}
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Stack>
              )}

              {/* ── Attendees ── */}
              {currentPath === '/attendees' && (
                <Stack space={6}>
                  <Headline level={1}>Attendees</Headline>
                  <Inline space={4} alignY="center">
                    <SearchField
                      aria-label="Search attendees by name or email"
                      value={attendeeSearch}
                      onChange={setAttendeeSearch}
                    />
                    <Text>{filteredAttendees.length} attendees</Text>
                  </Inline>
                  <Table aria-label="Attendees">
                    <Table.Header>
                      <Table.Column rowHeader>Name</Table.Column>
                      <Table.Column>Email</Table.Column>
                      <Table.Column>Events Attended</Table.Column>
                      <Table.Column>Last Active</Table.Column>
                      <Table.Column>Status</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {filteredAttendees.map(row => {
                        const active = isActive(row.lastActive);
                        return (
                          <Table.Row key={row.id}>
                            <Table.Cell>{row.name}</Table.Cell>
                            <Table.Cell>{row.email}</Table.Cell>
                            <Table.Cell>{row.events}</Table.Cell>
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
              )}

              {/* ── Reports ── */}
              {currentPath === '/reports' && (
                <Stack space={4}>
                  <Headline level={1}>Reports</Headline>
                  <Tabs aria-label="Reports">
                    <Tabs.List aria-label="Report sections">
                      <Tabs.Item id="revenue">Revenue</Tabs.Item>
                      <Tabs.Item id="attendance">Attendance</Tabs.Item>
                      <Tabs.Item id="overview">Overview</Tabs.Item>
                    </Tabs.List>
                    <Tabs.TabPanel id="revenue">
                      <Stack space={4}>
                        <Tiles tilesWidth="180px" space={4} stretch>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>Total Revenue</Text>
                              <Headline level={3}>$45,230</Headline>
                            </Stack>
                          </Card>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>This Month</Text>
                              <Headline level={3}>$8,420</Headline>
                            </Stack>
                          </Card>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>Avg per Event</Text>
                              <Headline level={3}>$1,885</Headline>
                            </Stack>
                          </Card>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>Refunds</Text>
                              <Headline level={3}>$1,230</Headline>
                            </Stack>
                          </Card>
                        </Tiles>
                        <SectionMessage variant="success">
                          <SectionMessage.Title>Revenue Trending Up</SectionMessage.Title>
                          <SectionMessage.Content>
                            Revenue is up 12% compared to last month.
                          </SectionMessage.Content>
                        </SectionMessage>
                      </Stack>
                    </Tabs.TabPanel>
                    <Tabs.TabPanel id="attendance">
                      <Stack space={4}>
                        <Tiles tilesWidth="180px" space={4} stretch>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>Total Attendees</Text>
                              <Headline level={3}>3,200</Headline>
                            </Stack>
                          </Card>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>Repeat Visitors</Text>
                              <Headline level={3}>890</Headline>
                            </Stack>
                          </Card>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>Avg per Event</Text>
                              <Headline level={3}>178</Headline>
                            </Stack>
                          </Card>
                          <Card p={4}>
                            <Stack space={1}>
                              <Text>No-shows</Text>
                              <Headline level={3}>145</Headline>
                            </Stack>
                          </Card>
                        </Tiles>
                        <Table aria-label="Top Events by Attendance">
                          <Table.Header>
                            <Table.Column rowHeader>Event</Table.Column>
                            <Table.Column>Date</Table.Column>
                            <Table.Column>Attendees</Table.Column>
                            <Table.Column>Capacity</Table.Column>
                            <Table.Column>Fill Rate</Table.Column>
                          </Table.Header>
                          <Table.Body>
                            {topAttendance.map(row => (
                              <Table.Row key={row.id}>
                                <Table.Cell>{row.event}</Table.Cell>
                                <Table.Cell>{row.date}</Table.Cell>
                                <Table.Cell>{row.attendees}</Table.Cell>
                                <Table.Cell>{row.capacity}</Table.Cell>
                                <Table.Cell>{row.fillRate}</Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table>
                      </Stack>
                    </Tabs.TabPanel>
                    <Tabs.TabPanel id="overview">
                      <Stack space={4}>
                        <Text>
                          EventHub has shown strong performance this quarter with growing
                          attendance and revenue across all event categories. Total revenue
                          reached $45,230 with a 12% increase month over month. Attendance
                          metrics are up 8% year to date.
                        </Text>
                        <Accordion allowsMultipleExpanded>
                          <Accordion.Item id="q1">
                            <Accordion.Header>Q1 Summary</Accordion.Header>
                            <Accordion.Content>
                              <Text>
                                Q1 saw 6 events with 800 total attendees. Revenue reached
                                $12,000, driven by the Winter Gala which sold out two weeks
                                before the event.
                              </Text>
                            </Accordion.Content>
                          </Accordion.Item>
                          <Accordion.Item id="q2">
                            <Accordion.Header>Q2 Summary</Accordion.Header>
                            <Accordion.Content>
                              <Text>
                                Q2 delivered strong results with 8 events and 1,200 total
                                attendees. The Spring Music Festival was the top performer at
                                95% capacity fill rate.
                              </Text>
                            </Accordion.Content>
                          </Accordion.Item>
                          <Accordion.Item id="q3">
                            <Accordion.Header>Q3 Summary</Accordion.Header>
                            <Accordion.Content>
                              <Text>
                                Q3 is projected to be the strongest quarter yet with 10 events
                                planned. Early ticket sales indicate high demand, particularly
                                for the Summer Music Festival.
                              </Text>
                            </Accordion.Content>
                          </Accordion.Item>
                        </Accordion>
                      </Stack>
                    </Tabs.TabPanel>
                  </Tabs>
                </Stack>
              )}

              {/* ── Settings ── */}
              {currentPath === '/settings' && (
                <Stack space={4}>
                  <Headline level={1}>Settings</Headline>
                  <Tabs aria-label="Settings">
                    <Tabs.List aria-label="Settings sections">
                      <Tabs.Item id="general">General</Tabs.Item>
                      <Tabs.Item id="notifications">Notifications</Tabs.Item>
                    </Tabs.List>
                    <Tabs.TabPanel id="general">
                      <Stack space={4}>
                        {settingsSaved && (
                          <SectionMessage variant="success">
                            <SectionMessage.Title>Saved</SectionMessage.Title>
                            <SectionMessage.Content>
                              Settings saved successfully.
                            </SectionMessage.Content>
                          </SectionMessage>
                        )}
                        <TextField
                          label="Organization Name"
                          defaultValue="My Organization"
                        />
                        <TextField
                          label="Contact Email"
                          type="email"
                          defaultValue="contact@example.com"
                        />
                        <Select label="Default Currency" defaultSelectedKey="usd">
                          <Select.Option id="usd">USD</Select.Option>
                          <Select.Option id="eur">EUR</Select.Option>
                          <Select.Option id="gbp">GBP</Select.Option>
                        </Select>
                        <Select label="Default Timezone" defaultSelectedKey="utc">
                          <Select.Option id="utc">UTC</Select.Option>
                          <Select.Option id="cet">CET</Select.Option>
                          <Select.Option id="est">EST</Select.Option>
                          <Select.Option id="pst">PST</Select.Option>
                        </Select>
                        <Button
                          variant="primary"
                          onPress={() => setSettingsSaved(true)}
                        >
                          Save Changes
                        </Button>
                      </Stack>
                    </Tabs.TabPanel>
                    <Tabs.TabPanel id="notifications">
                      <Stack space={4}>
                        {notificationsSaved && (
                          <SectionMessage variant="success">
                            <SectionMessage.Title>Saved</SectionMessage.Title>
                            <SectionMessage.Content>
                              Notification preferences saved.
                            </SectionMessage.Content>
                          </SectionMessage>
                        )}
                        <Stack space={3}>
                          <Stack space={1}>
                            <Switch
                              label="Email Notifications"
                              selected={emailNotif}
                              onChange={setEmailNotif}
                            />
                            <Text fontSize="xs">Receive event updates and confirmations via email</Text>
                          </Stack>
                          <Stack space={1}>
                            <Switch
                              label="SMS Notifications"
                              selected={smsNotif}
                              onChange={setSmsNotif}
                            />
                            <Text fontSize="xs">Get text message alerts for important updates</Text>
                          </Stack>
                          <Stack space={1}>
                            <Switch
                              label="Weekly Digest"
                              selected={weeklyDigest}
                              onChange={setWeeklyDigest}
                            />
                            <Text fontSize="xs">A weekly summary of your events and metrics</Text>
                          </Stack>
                          <Stack space={1}>
                            <Switch
                              label="Marketing Emails"
                              selected={marketingEmails}
                              onChange={setMarketingEmails}
                            />
                            <Text fontSize="xs">Promotional content and feature announcements</Text>
                          </Stack>
                        </Stack>
                        <Button
                          variant="primary"
                          onPress={() => setNotificationsSaved(true)}
                        >
                          Save Preferences
                        </Button>
                      </Stack>
                    </Tabs.TabPanel>
                  </Tabs>
                </Stack>
              )}

              {/* ── Help & Support ── */}
              {currentPath === '/help' && (
                <Stack space={4}>
                  <Headline level={1}>Help &amp; Support</Headline>
                  <Text>
                    For assistance, contact our support team at support@eventhub.com
                    or browse our online documentation.
                  </Text>
                </Stack>
              )}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
};

export default EventHub;
