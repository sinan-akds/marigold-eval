'use client';

import { useState } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Menu,
  Dialog,
  Headline,
  Stack,
  Inline,
  Card,
  Badge,
  Table,
  TextField,
  SearchField,
  Button,
  SectionMessage,
  Tabs,
  Switch,
  DateField,
  TextArea,
  Select,
  NumberField,
  Form,
  Text,
  Columns,
  Inset,
} from '@marigold/components';

type Page = 'dashboard' | 'events' | 'attendees' | 'reports' | 'settings';

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const [eventsSearchQuery, setEventsSearchQuery] = useState('');
  const [attendeesSearchQuery, setAttendeeSearchQuery] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    sms: false,
    weekly: true,
    marketing: false,
  });

  const events = [
    { id: 1, name: 'Tech Summit 2025', date: '2025-07-15', venue: 'Convention Center', ticketsSold: 1200, status: 'On Sale' },
    { id: 2, name: 'Jazz Night', date: '2025-08-22', venue: 'Royal Theater', ticketsSold: 450, status: 'On Sale' },
    { id: 3, name: 'Art Exhibition', date: '2025-09-05', venue: 'Museum of Art', ticketsSold: 0, status: 'Draft' },
    { id: 4, name: 'Music Festival', date: '2025-06-30', venue: 'Central Park', ticketsSold: 3200, status: 'Sold Out' },
    { id: 5, name: 'Product Launch', date: '2025-07-10', venue: 'Tech Hub', ticketsSold: 890, status: 'On Sale' },
    { id: 6, name: 'Charity Gala', date: '2025-08-15', venue: 'Grand Ballroom', ticketsSold: 280, status: 'On Sale' },
  ];

  const upcomingEvents = [
    { id: 1, event: 'Tech Summit 2025', date: '2025-07-15', venue: 'Convention Center', ticketsSold: 1200, status: 'On Sale' },
    { id: 2, event: 'Jazz Night', date: '2025-08-22', venue: 'Royal Theater', ticketsSold: 450, status: 'On Sale' },
    { id: 3, event: 'Product Launch', date: '2025-07-10', venue: 'Tech Hub', ticketsSold: 890, status: 'On Sale' },
    { id: 4, event: 'Charity Gala', date: '2025-08-15', venue: 'Grand Ballroom', ticketsSold: 280, status: 'On Sale' },
    { id: 5, event: 'Music Festival', date: '2025-06-30', venue: 'Central Park', ticketsSold: 3200, status: 'Sold Out' },
    { id: 6, event: 'Web Design Conference', date: '2025-09-20', venue: 'Design Center', ticketsSold: 650, status: 'On Sale' },
  ];

  const attendees = [
    { id: 1, name: 'Anna Schmidt', email: 'anna@example.com', eventsAttended: 5, lastActive: '2025-06-25', status: 'Active' },
    { id: 2, name: 'Max Weber', email: 'max@example.com', eventsAttended: 3, lastActive: '2025-06-20', status: 'Active' },
    { id: 3, name: 'Lena Fischer', email: 'lena@example.com', eventsAttended: 8, lastActive: '2025-06-28', status: 'Active' },
    { id: 4, name: 'Bruno Martinez', email: 'bruno@example.com', eventsAttended: 2, lastActive: '2025-05-15', status: 'Inactive' },
    { id: 5, name: 'Sophie Laurent', email: 'sophie@example.com', eventsAttended: 12, lastActive: '2025-06-27', status: 'Active' },
    { id: 6, name: 'James Wilson', email: 'james@example.com', eventsAttended: 1, lastActive: '2025-04-10', status: 'Inactive' },
  ];

  const topEventsByAttendance = [
    { event: 'Tech Summit 2025', date: '2025-07-15', attendees: 890, capacity: 1000, fillRate: '89%' },
    { event: 'Music Festival', date: '2025-06-30', attendees: 2500, capacity: 3000, fillRate: '83%' },
    { event: 'Charity Gala', date: '2025-08-15', attendees: 280, capacity: 300, fillRate: '93%' },
    { event: 'Jazz Night', date: '2025-08-22', attendees: 450, capacity: 500, fillRate: '90%' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'On Sale':
      case 'Active':
        return 'success';
      case 'Draft':
        return 'info';
      case 'Sold Out':
      case 'Inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(eventsSearchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(eventsSearchQuery.toLowerCase())
  );

  const filteredAttendees = attendees.filter(a =>
    a.name.toLowerCase().includes(attendeesSearchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(attendeesSearchQuery.toLowerCase())
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Stack space={6}>
            <Headline level={2}>Dashboard Overview</Headline>
            <SectionMessage variant="success">
              <SectionMessage.Title>Welcome back!</SectionMessage.Title>
              <SectionMessage.Content>You have 3 events starting this week.</SectionMessage.Content>
            </SectionMessage>

            <Stack space={4}>
              <Headline level={3} size="level-3">Summary Cards</Headline>
              <Columns columns={[1, 1, 1, 1]} space={4}>
                <Card>
                  <Inset space={3}>
                    <Stack space={2} alignX="left">
                      <Text variant="muted">Total Events</Text>
                      <Headline level={4} size="level-1">24</Headline>
                    </Stack>
                  </Inset>
                </Card>
                <Card>
                  <Inset space={3}>
                    <Stack space={2} alignX="left">
                      <Text variant="muted">Tickets Sold</Text>
                      <Headline level={4} size="level-1">1,849</Headline>
                    </Stack>
                  </Inset>
                </Card>
                <Card>
                  <Inset space={3}>
                    <Stack space={2} alignX="left">
                      <Text variant="muted">Revenue</Text>
                      <Headline level={4} size="level-1">$45,230</Headline>
                    </Stack>
                  </Inset>
                </Card>
                <Card>
                  <Inset space={3}>
                    <Stack space={2} alignX="left">
                      <Text variant="muted">Upcoming</Text>
                      <Headline level={4} size="level-1">8</Headline>
                    </Stack>
                  </Inset>
                </Card>
              </Columns>
            </Stack>

            <Stack space={4}>
              <Headline level={3} size="level-3">Upcoming Events</Headline>
              <Table aria-label="Upcoming Events" selectionMode="none">
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
                      <Table.Cell>{row.ticketsSold}</Table.Cell>
                      <Table.Cell>
                        <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
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
          <Stack space={6}>
            <Inline alignY="center" space={4} alignX="between">
              <Headline level={2}>Events</Headline>
              <Dialog.Trigger>
                <Button variant="primary">Create Event</Button>
                <Dialog size="medium">
                  <Dialog.Title>Create Event</Dialog.Title>
                  <Dialog.Content>
                    <Form onSubmit={(e) => {
                      e.preventDefault();
                    }}>
                      <Stack space={4}>
                        <TextField label="Event Name" required />
                        <DateField label="Date" required />
                        <TextField label="Location" />
                        <NumberField label="Capacity" />
                        <TextArea label="Description" />
                      </Stack>
                      <Dialog.Actions>
                        <Button variant="secondary" slot="close">Cancel</Button>
                        <Button variant="primary" type="submit">Create</Button>
                      </Dialog.Actions>
                    </Form>
                  </Dialog.Content>
                </Dialog>
              </Dialog.Trigger>
            </Inline>

            <SearchField
              label="Search Events"
              value={eventsSearchQuery}
              onChange={setEventsSearchQuery}
              placeholder="Search by name or location..."
            />

            <Table aria-label="Events" selectionMode="none">
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
                    <Table.Cell>{row.venue}</Table.Cell>
                    <Table.Cell>500</Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        );

      case 'attendees':
        return (
          <Stack space={6}>
            <Headline level={2}>Attendees</Headline>
            <SearchField
              label="Search Attendees"
              value={attendeesSearchQuery}
              onChange={setAttendeeSearchQuery}
              placeholder="Search by name or email..."
            />
            <Text variant="muted">{filteredAttendees.length} attendees</Text>

            <Table aria-label="Attendees" selectionMode="none">
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
                    <Table.Cell>{row.eventsAttended}</Table.Cell>
                    <Table.Cell>{row.lastActive}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Stack>
        );

      case 'reports':
        return (
          <Stack space={6}>
            <Headline level={2}>Reports</Headline>
            <Tabs aria-label="Reports" onSelectionChange={() => {}}>
              <Tabs.List aria-label="Report Tabs">
                <Tabs.Item id="revenue">Revenue</Tabs.Item>
                <Tabs.Item id="attendance">Attendance</Tabs.Item>
                <Tabs.Item id="overview">Overview</Tabs.Item>
              </Tabs.List>

              <Tabs.TabPanel id="revenue">
                <Stack space={6}>
                  <Columns columns={[1, 1, 1, 1]} space={4}>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">Total Revenue</Text>
                          <Headline level={4} size="level-1">$45,230</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">This Month</Text>
                          <Headline level={4} size="level-1">$8,420</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">Average per Event</Text>
                          <Headline level={4} size="level-1">$1,885</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">Refunds</Text>
                          <Headline level={4} size="level-1">$1,230</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                  </Columns>
                  <SectionMessage variant="success">
                    <SectionMessage.Title>Revenue Increase</SectionMessage.Title>
                    <SectionMessage.Content>Revenue is up 12% compared to last month.</SectionMessage.Content>
                  </SectionMessage>
                </Stack>
              </Tabs.TabPanel>

              <Tabs.TabPanel id="attendance">
                <Stack space={6}>
                  <Columns columns={[1, 1, 1, 1]} space={4}>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">Total Attendees</Text>
                          <Headline level={4} size="level-1">3,200</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">Repeat Visitors</Text>
                          <Headline level={4} size="level-1">890</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">Average per Event</Text>
                          <Headline level={4} size="level-1">178</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                    <Card>
                      <Inset space={3}>
                        <Stack space={2} alignX="left">
                          <Text variant="muted">No-shows</Text>
                          <Headline level={4} size="level-1">145</Headline>
                        </Stack>
                      </Inset>
                    </Card>
                  </Columns>

                  <Headline level={3} size="level-3">Top Events by Attendance</Headline>
                  <Table aria-label="Top Events by Attendance" selectionMode="none">
                    <Table.Header>
                      <Table.Column rowHeader>Event</Table.Column>
                      <Table.Column>Date</Table.Column>
                      <Table.Column>Attendees</Table.Column>
                      <Table.Column>Capacity</Table.Column>
                      <Table.Column>Fill Rate</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {topEventsByAttendance.map((row, idx) => (
                        <Table.Row key={idx}>
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
                    This quarter has seen strong growth across all event categories with a 15% increase in overall attendance and a 12% growth in revenue compared to the same period last year.
                  </Text>

                  <Text weight="medium">Q1 Summary</Text>
                  <Text>
                    Q1 started strong with 8 major events generating $12,500 in revenue and attracting 800 attendees. The Product Launch event was our top performer with 890 attendees.
                  </Text>

                  <Text weight="medium">Q2 Summary</Text>
                  <Text>
                    Q2 showed continued momentum with 6 events and $15,800 revenue. The Music Festival was a standout with 2,500 attendees and a 83% fill rate.
                  </Text>

                  <Text weight="medium">Q3 Summary</Text>
                  <Text>
                    Q3 is shaping up to be our strongest quarter yet with 10 planned events and projected revenue of $18,930. Early bookings indicate strong interest across all categories.
                  </Text>
                </Stack>
              </Tabs.TabPanel>
            </Tabs>
          </Stack>
        );

      case 'settings':
        return (
          <Stack space={6}>
            <Headline level={2}>Settings</Headline>
            <Tabs aria-label="Settings" onSelectionChange={() => {}}>
              <Tabs.List aria-label="Settings Tabs">
                <Tabs.Item id="general">General</Tabs.Item>
                <Tabs.Item id="notifications">Notifications</Tabs.Item>
              </Tabs.List>

              <Tabs.TabPanel id="general">
                <Stack space={4}>
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                  }}>
                    <Stack space={4}>
                      <TextField label="Organization Name" />
                      <TextField label="Contact Email" type="email" />
                      <Select label="Default Currency">
                        <Select.Option id="usd">USD</Select.Option>
                        <Select.Option id="eur">EUR</Select.Option>
                        <Select.Option id="gbp">GBP</Select.Option>
                      </Select>
                      <Select label="Default Timezone">
                        <Select.Option id="utc">UTC</Select.Option>
                        <Select.Option id="cet">CET</Select.Option>
                        <Select.Option id="est">EST</Select.Option>
                        <Select.Option id="pst">PST</Select.Option>
                      </Select>
                      <Button variant="primary" type="submit">Save Changes</Button>
                    </Stack>
                  </Form>
                  <SectionMessage variant="success">
                    <SectionMessage.Title>Settings saved</SectionMessage.Title>
                    <SectionMessage.Content>Your settings have been saved successfully.</SectionMessage.Content>
                  </SectionMessage>
                </Stack>
              </Tabs.TabPanel>

              <Tabs.TabPanel id="notifications">
                <Stack space={4}>
                  <Inline alignY="center" space={4} alignX="between">
                    <Stack space={1} alignX="left">
                      <Text weight="medium">Email Notifications</Text>
                      <Text variant="muted" size="small">Receive important updates via email</Text>
                    </Stack>
                    <Switch
                      label=""
                      selected={notificationPreferences.email}
                      onChange={(checked) =>
                        setNotificationPreferences(p => ({ ...p, email: checked }))
                      }
                    />
                  </Inline>

                  <Inline alignY="center" space={4} alignX="between">
                    <Stack space={1} alignX="left">
                      <Text weight="medium">SMS Notifications</Text>
                      <Text variant="muted" size="small">Get alerts via text message</Text>
                    </Stack>
                    <Switch
                      label=""
                      selected={notificationPreferences.sms}
                      onChange={(checked) =>
                        setNotificationPreferences(p => ({ ...p, sms: checked }))
                      }
                    />
                  </Inline>

                  <Inline alignY="center" space={4} alignX="between">
                    <Stack space={1} alignX="left">
                      <Text weight="medium">Weekly Digest</Text>
                      <Text variant="muted" size="small">Get a summary of weekly events</Text>
                    </Stack>
                    <Switch
                      label=""
                      selected={notificationPreferences.weekly}
                      onChange={(checked) =>
                        setNotificationPreferences(p => ({ ...p, weekly: checked }))
                      }
                    />
                  </Inline>

                  <Inline alignY="center" space={4} alignX="between">
                    <Stack space={1} alignX="left">
                      <Text weight="medium">Marketing Emails</Text>
                      <Text variant="muted" size="small">Promotional offers and announcements</Text>
                    </Stack>
                    <Switch
                      label=""
                      selected={notificationPreferences.marketing}
                      onChange={(checked) =>
                        setNotificationPreferences(p => ({ ...p, marketing: checked }))
                      }
                    />
                  </Inline>

                  <Button variant="primary">Save Preferences</Button>
                </Stack>
              </Tabs.TabPanel>
            </Tabs>
          </Stack>
        );

      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'events':
        return 'Events';
      case 'attendees':
        return 'Attendees';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      default:
        return 'EventHub';
    }
  };

  return (
    <Sidebar.Provider defaultOpen>
      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Headline level={3} size="level-3">EventHub</Headline>
          </Sidebar.Header>
          <Sidebar.Nav current={`/${currentPage}`}>
            <Sidebar.Item
              href="/dashboard"
              onPress={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="/events"
              onPress={() => setCurrentPage('events')}
            >
              Events
            </Sidebar.Item>
            <Sidebar.Item
              href="/attendees"
              onPress={() => setCurrentPage('attendees')}
            >
              Attendees
            </Sidebar.Item>
            <Sidebar.Item
              href="/reports"
              onPress={() => setCurrentPage('reports')}
            >
              Reports
            </Sidebar.Item>
            <Sidebar.Separator />
            <Sidebar.Item
              href="/settings"
              onPress={() => setCurrentPage('settings')}
            >
              Settings
            </Sidebar.Item>
            <Sidebar.Footer>
              <Sidebar.Item href="/help">
                Help & Support
              </Sidebar.Item>
            </Sidebar.Footer>
          </Sidebar.Nav>
        </AppLayout.Sidebar>

        <AppLayout.Header>
          <TopNavigation.Start>
            <Sidebar.Toggle />
          </TopNavigation.Start>
          <TopNavigation.Middle>
            <Breadcrumbs>
              <Breadcrumbs.Item href="#home">EventHub</Breadcrumbs.Item>
              <Breadcrumbs.Item href={`#${currentPage}`}>{getPageTitle()}</Breadcrumbs.Item>
            </Breadcrumbs>
          </TopNavigation.Middle>
          <TopNavigation.End>
            <Menu
              label="Account"
              onAction={(key) => {
                if (key === 'signout') {
                  setShowSignOutDialog(true);
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
            {renderPage()}
          </Inset>
        </AppLayout.Main>
      </AppLayout>

      {showSignOutDialog && (
        <Dialog.Trigger open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
          <Dialog role="alertdialog" size="small">
            <Dialog.Title>Sign out</Dialog.Title>
            <Dialog.Content>
              Are you sure you want to sign out?
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="destructive">Sign out</Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      )}
    </Sidebar.Provider>
  );
};

export default TestApp;
