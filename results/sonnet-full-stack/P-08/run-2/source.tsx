import { useState } from 'react';
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
  Headline,
  Inline,
  Inset,
  Menu,
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

const upcomingEvents = [
  { id: '1', event: 'Summer Music Fest', date: 'Jul 15, 2026', venue: 'Central Park, NYC', sold: 1200, status: 'On Sale' },
  { id: '2', event: 'Tech Conf 2026', date: 'Aug 2, 2026', venue: 'SF Convention Center', sold: 480, status: 'On Sale' },
  { id: '3', event: 'Art Expo', date: 'Aug 10, 2026', venue: 'Downtown Gallery', sold: 80, status: 'Draft' },
  { id: '4', event: 'Rock Night', date: 'Aug 20, 2026', venue: 'The Forum, LA', sold: 3000, status: 'Sold Out' },
  { id: '5', event: 'Startup Summit', date: 'Sep 5, 2026', venue: 'WeWork, NYC', sold: 290, status: 'On Sale' },
  { id: '6', event: 'Jazz Evening', date: 'Sep 12, 2026', venue: 'Blue Note, Chicago', sold: 100, status: 'Draft' },
];

const eventsTableData = [
  { id: '1', name: 'Summer Music Fest', date: 'Jul 15, 2026', location: 'Central Park, NYC', capacity: 3000, status: 'On Sale' },
  { id: '2', name: 'Tech Conf 2026', date: 'Aug 2, 2026', location: 'SF Convention Center', capacity: 500, status: 'On Sale' },
  { id: '3', name: 'Art Expo', date: 'Aug 10, 2026', location: 'Downtown Gallery', capacity: 200, status: 'Draft' },
  { id: '4', name: 'Rock Night', date: 'Aug 20, 2026', location: 'The Forum, LA', capacity: 3000, status: 'Sold Out' },
  { id: '5', name: 'Startup Summit', date: 'Sep 5, 2026', location: 'WeWork, NYC', capacity: 300, status: 'On Sale' },
  { id: '6', name: 'Jazz Evening', date: 'Sep 12, 2026', location: 'Blue Note, Chicago', capacity: 150, status: 'Draft' },
];

const attendeesData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', attended: 5, lastActive: 'Jun 20, 2026', daysAgo: 8 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', attended: 3, lastActive: 'Jun 10, 2026', daysAgo: 18 },
  { id: '3', name: 'Carol White', email: 'carol@example.com', attended: 8, lastActive: 'Jun 25, 2026', daysAgo: 3 },
  { id: '4', name: 'David Brown', email: 'david@example.com', attended: 1, lastActive: 'Apr 1, 2026', daysAgo: 88 },
  { id: '5', name: 'Emma Davis', email: 'emma@example.com', attended: 4, lastActive: 'Jun 15, 2026', daysAgo: 13 },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', attended: 2, lastActive: 'Mar 15, 2026', daysAgo: 105 },
];

const topEventsData = [
  { id: '1', event: 'Summer Music Fest', date: 'Jun 15, 2026', attendees: 2800, capacity: 3000, fillRate: '93%' },
  { id: '2', event: 'Tech Conf 2026', date: 'Aug 2, 2026', attendees: 480, capacity: 500, fillRate: '96%' },
  { id: '3', event: 'Art Expo', date: 'Aug 10, 2026', attendees: 180, capacity: 200, fillRate: '90%' },
  { id: '4', event: 'Jazz Evening', date: 'Sep 12, 2026', attendees: 140, capacity: 150, fillRate: '93%' },
];

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/attendees': 'Attendees',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
};

function statusVariant(status: string): 'success' | 'warning' | 'error' {
  if (status === 'On Sale') return 'success';
  if (status === 'Sold Out') return 'error';
  return 'warning';
}

const TestApp = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [signOutOpen, setSignOutOpen] = useState(false);

  const [eventsSearch, setEventsSearch] = useState('');
  const [attendeesSearch, setAttendeesSearch] = useState('');

  const [generalSaved, setGeneralSaved] = useState(false);
  const [orgName, setOrgName] = useState('EventHub Inc.');
  const [contactEmail, setContactEmail] = useState('admin@eventhub.com');

  const [notifSaved, setNotifSaved] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const pageName = pageNames[currentPath] ?? 'EventHub';

  const filteredEvents = eventsTableData.filter(
    e =>
      e.name.toLowerCase().includes(eventsSearch.toLowerCase()) ||
      e.location.toLowerCase().includes(eventsSearch.toLowerCase())
  );

  const filteredAttendees = attendeesData.filter(
    a =>
      a.name.toLowerCase().includes(attendeesSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(attendeesSearch.toLowerCase())
  );

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level="1">Dashboard Overview</Headline>
      <SectionMessage variant="info">
        <SectionMessage.Title>Welcome back!</SectionMessage.Title>
        <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
      </SectionMessage>
      <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="40em">
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text>Total Events</Text>
              <Headline level="2">24</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text>Tickets Sold</Text>
              <Headline level="2">1,849</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Inline space={2} alignY="center">
                <Text>Revenue</Text>
                <Tooltip.Trigger>
                  <Button variant="secondary" size="small">ⓘ</Button>
                  <Tooltip>Net revenue after fees and refunds</Tooltip>
                </Tooltip.Trigger>
              </Inline>
              <Headline level="2">$45,230</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text>Upcoming</Text>
              <Headline level="2">8</Headline>
            </Stack>
          </Inset>
        </Card>
      </Columns>
      <Stack space={3}>
        <Headline level="2">Upcoming Events</Headline>
        <Table aria-label="Upcoming Events">
          <Table.Header>
            <Table.Column rowHeader>Event</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column>Venue</Table.Column>
            <Table.Column>Tickets Sold</Table.Column>
            <Table.Column>Status</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEvents.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.event}</Table.Cell>
                <Table.Cell>{row.date}</Table.Cell>
                <Table.Cell>{row.venue}</Table.Cell>
                <Table.Cell>{row.sold.toLocaleString()}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
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
      <Headline level="1">Events</Headline>
      <Inline space={4} alignY="input">
        <SearchField
          label="Search events"
          value={eventsSearch}
          onChange={setEventsSearch}
        />
        <Dialog.Trigger>
          <Button variant="primary">Create Event</Button>
          <Dialog size="medium">
            <Dialog.Title>Create Event</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Event Name" required />
                <DatePicker label="Date" />
                <TextField label="Location" />
                <TextField label="Capacity" type="number" />
                <TextArea label="Description" rows={3} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button variant="primary" slot="close">Create</Button>
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
              <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderAttendees = () => (
    <Stack space={6}>
      <Headline level="1">Attendees</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          label="Search attendees"
          value={attendeesSearch}
          onChange={setAttendeesSearch}
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
          {filteredAttendees.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.email}</Table.Cell>
              <Table.Cell>{row.attended}</Table.Cell>
              <Table.Cell>{row.lastActive}</Table.Cell>
              <Table.Cell>
                <Badge variant={row.daysAgo <= 30 ? 'success' : 'warning'}>
                  {row.daysAgo <= 30 ? 'Active' : 'Inactive'}
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
      <Headline level="1">Reports</Headline>
      <Tabs aria-label="Reports tabs">
        <Tabs.List aria-label="Report sections">
          <Tabs.Item id="revenue">Revenue</Tabs.Item>
          <Tabs.Item id="attendance">Attendance</Tabs.Item>
          <Tabs.Item id="overview">Overview</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="revenue">
          <Stack space={6}>
            <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="40em">
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>Total Revenue</Text>
                    <Headline level="3">$45,230</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>This Month</Text>
                    <Headline level="3">$8,420</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>Avg per Event</Text>
                    <Headline level="3">$1,885</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>Refunds</Text>
                    <Headline level="3">$1,230</Headline>
                  </Stack>
                </Inset>
              </Card>
            </Columns>
            <SectionMessage variant="success">
              <SectionMessage.Title>Revenue is up 12% compared to last month.</SectionMessage.Title>
            </SectionMessage>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="attendance">
          <Stack space={6}>
            <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="40em">
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>Total Attendees</Text>
                    <Headline level="3">3,200</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>Repeat Visitors</Text>
                    <Headline level="3">890</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>Avg per Event</Text>
                    <Headline level="3">178</Headline>
                  </Stack>
                </Inset>
              </Card>
              <Card>
                <Inset space={4}>
                  <Stack space={2}>
                    <Text>No-shows</Text>
                    <Headline level="3">145</Headline>
                  </Stack>
                </Inset>
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
                <Table.Body>
                  {topEventsData.map(row => (
                    <Table.Row key={row.id}>
                      <Table.Cell>{row.event}</Table.Cell>
                      <Table.Cell>{row.date}</Table.Cell>
                      <Table.Cell>{row.attendees.toLocaleString()}</Table.Cell>
                      <Table.Cell>{row.capacity.toLocaleString()}</Table.Cell>
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
              EventHub had a strong performance this year with growing attendance and revenue across all
              event categories. Key highlights include increased repeat visitors and high fill rates.
            </Text>
            <Accordion>
              <Accordion.Item>
                <Accordion.Header>Q1 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q1 saw 8 events with a total of 1,200 attendees. Revenue reached $12,400, driven by
                    the Spring Music Festival and Tech Kickoff. Average fill rate was 78%.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q2 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q2 delivered the highest revenue quarter at $18,500 across 9 events. The Summer Music
                    Fest sold out for the first time, bringing 3,000 attendees and significant media coverage.
                  </Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item>
                <Accordion.Header>Q3 Summary</Accordion.Header>
                <Accordion.Content>
                  <Text>
                    Q3 is focused on expanding to new venues with 7 events planned. Early ticket sales
                    indicate strong demand, particularly for the Rock Night and Startup Summit events.
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
      <Headline level="1">Settings</Headline>
      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
        </Tabs.List>
        <Tabs.TabPanel id="general">
          <Stack space={6}>
            {generalSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Settings saved successfully.</SectionMessage.Title>
              </SectionMessage>
            )}
            <Stack space={4}>
              <TextField
                label="Organization Name"
                value={orgName}
                onChange={setOrgName}
              />
              <TextField
                label="Contact Email"
                type="email"
                value={contactEmail}
                onChange={setContactEmail}
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
            </Stack>
            <Button variant="primary" onPress={() => setGeneralSaved(true)}>
              Save Changes
            </Button>
          </Stack>
        </Tabs.TabPanel>
        <Tabs.TabPanel id="notifications">
          <Stack space={6}>
            {notifSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Preferences saved successfully.</SectionMessage.Title>
              </SectionMessage>
            )}
            <Stack space={4}>
              <Stack space={1}>
                <Switch
                  label="Email Notifications"
                  selected={emailNotifs}
                  onChange={setEmailNotifs}
                />
                <Text size="xs">Receive event updates and alerts via email.</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="SMS Notifications"
                  selected={smsNotifs}
                  onChange={setSmsNotifs}
                />
                <Text size="xs">Get text messages for critical event updates.</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Weekly Digest"
                  selected={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <Text size="xs">Receive a weekly summary of your events and stats.</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Marketing Emails"
                  selected={marketingEmails}
                  onChange={setMarketingEmails}
                />
                <Text size="xs">Stay informed about new features and promotions.</Text>
              </Stack>
            </Stack>
            <Button variant="primary" onPress={() => setNotifSaved(true)}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (currentPath) {
      case '/events': return renderEvents();
      case '/attendees': return renderAttendees();
      case '/reports': return renderReports();
      case '/settings': return renderSettings();
      default: return renderDashboard();
    }
  };

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
                <Breadcrumbs.Item href={currentPath}>{pageName}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu
                label="Account"
                onAction={action => {
                  if (action === 'signout') setSignOutOpen(true);
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
      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen} size="small">
        {({ close }) => (
          <>
            <Dialog.Title>Sign out</Dialog.Title>
            <Dialog.Content>
              <Text>Are you sure you want to sign out?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={close}>Sign out</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </RouterProvider>
  );
};

export default TestApp;
