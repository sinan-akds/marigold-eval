import React, { useState, useMemo } from 'react';
import {
  Button,
  TextField,
  Dialog,
  Flex,
  Stack,
  Heading,
  Text,
  Card,
  Badge,
  Menu,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Checkbox,
  Select,
  Option,
  Banner,
  Table,
  TableHeader,
  TableBody,
  Row,
  Cell,
  HeaderCell,
  Tooltip,
} from '@marigold/components';

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'events' | 'attendees' | 'reports' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [attendeeSearchTerm, setAttendeeSearchTerm] = useState('');
  const [settingsTab, setSettingsTab] = useState('general');
  const [reportsTab, setReportsTab] = useState('revenue');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const eventTableData = [
    { id: 1, name: 'Tech Conference 2026', date: 'Jun 25, 2026', venue: 'Convention Center', ticketsSold: 450, status: 'On Sale' },
    { id: 2, name: 'Summer Festival', date: 'Jul 15, 2026', venue: 'Central Park', ticketsSold: 1200, status: 'On Sale' },
    { id: 3, name: 'Gala Dinner', date: 'Aug 10, 2026', venue: 'Grand Ballroom', ticketsSold: 280, status: 'Sold Out' },
    { id: 4, name: 'Workshop Series', date: 'Jul 22, 2026', venue: 'Tech Hub', ticketsSold: 0, status: 'Draft' },
    { id: 5, name: 'Art Exhibition', date: 'Sep 5, 2026', venue: 'Gallery District', ticketsSold: 156, status: 'On Sale' },
    { id: 6, name: 'Music Festival', date: 'Aug 20, 2026', venue: 'Riverside Amphitheater', ticketsSold: 890, status: 'On Sale' },
  ];

  const allAttendeeData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', eventsAttended: 5, lastActive: '2026-06-20', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', eventsAttended: 2, lastActive: '2026-05-15', status: 'Inactive' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', eventsAttended: 8, lastActive: '2026-06-21', status: 'Active' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', eventsAttended: 1, lastActive: '2026-06-19', status: 'Active' },
    { id: 5, name: 'Emma Martinez', email: 'emma@example.com', eventsAttended: 12, lastActive: '2026-06-22', status: 'Active' },
    { id: 6, name: 'Frank Brown', email: 'frank@example.com', eventsAttended: 3, lastActive: '2026-04-10', status: 'Inactive' },
  ];

  const filteredEvents = useMemo(() => {
    const term = eventSearchTerm.toLowerCase();
    return eventTableData.filter(e => e.name.toLowerCase().includes(term) || e.venue.toLowerCase().includes(term));
  }, [eventSearchTerm]);

  const filteredAttendees = useMemo(() => {
    const term = attendeeSearchTerm.toLowerCase();
    return allAttendeeData.filter(a => a.name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term));
  }, [attendeeSearchTerm]);

  const getStatusColor = (status: string) => {
    if (status === 'On Sale') return 'success';
    if (status === 'Sold Out') return 'warning';
    if (status === 'Draft') return 'neutral';
    return 'neutral';
  };

  const getAttendeeStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'warning';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Flex direction="row" height="100vh" width="100%" gap={0}>
      {/* Sidebar */}
      <Flex
        direction="column"
        width={sidebarOpen ? '250px' : '60px'}
        backgroundColor="neutral-100"
        borderRight="1px solid"
        borderColor="neutral-200"
        padding="16px"
        gap="24px"
        style={{
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          overflowY: 'auto',
        }}
      >
        <Heading level={1} size="small" truncate>
          {sidebarOpen ? 'EventHub' : 'EH'}
        </Heading>

        <Stack gap="8px" flex={1}>
          {['Dashboard', 'Events', 'Attendees', 'Reports'].map(page => (
            <Button
              key={page}
              variant={currentPage === page.toLowerCase() ? 'solid' : 'ghost'}
              onPress={() => setCurrentPage(page.toLowerCase() as any)}
              width="100%"
            >
              {sidebarOpen ? page : page[0]}
            </Button>
          ))}

          <div style={{ borderTop: '1px solid #ddd', margin: '8px 0' }} />

          <Button
            variant={currentPage === 'settings' ? 'solid' : 'ghost'}
            onPress={() => setCurrentPage('settings')}
            width="100%"
          >
            {sidebarOpen ? 'Settings' : 'S'}
          </Button>
        </Stack>

        <Button variant="ghost" width="100%">
          {sidebarOpen ? 'Help & Support' : '?'}
        </Button>
      </Flex>

      {/* Main Content */}
      <Flex direction="column" flex={1}>
        {/* Top Bar */}
        <Flex
          direction="row"
          alignItems="center"
          padding="16px"
          borderBottom="1px solid"
          borderColor="neutral-200"
          backgroundColor="white"
          gap="16px"
        >
          <Button
            variant="ghost"
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </Button>

          <Text flex={1}>
            EventHub {currentPage === 'dashboard' && '> Dashboard'}
            {currentPage === 'events' && '> Events'}
            {currentPage === 'attendees' && '> Attendees'}
            {currentPage === 'reports' && '> Reports'}
            {currentPage === 'settings' && '> Settings'}
          </Text>

          <Menu>
            <Button variant="ghost">👤 Account</Button>
            <MenuItem onPress={() => {}}>Profile</MenuItem>
            <MenuItem onPress={() => setShowSignOutDialog(true)}>Sign out</MenuItem>
          </Menu>
        </Flex>

        {/* Content Area */}
        <Flex
          direction="column"
          flex={1}
          padding="24px"
          gap="20px"
          style={{ overflowY: 'auto' }}
        >
          {currentPage === 'dashboard' && (
            <>
              <Heading level={2}>Dashboard Overview</Heading>

              <Banner variant="info">
                Welcome back! You have 3 events starting this week.
              </Banner>

              <Flex direction="row" gap="16px" wrap>
                {[
                  { label: 'Total Events', value: '24' },
                  { label: 'Tickets Sold', value: '1,849' },
                  { label: 'Revenue', value: '$45,230', hasTooltip: true },
                  { label: 'Upcoming', value: '8' },
                ].map((card, i) => (
                  <Card key={i} flex={1} minWidth="200px" padding="16px">
                    <Stack gap="8px">
                      <Text size="small" color="neutral-600">
                        {card.label}
                      </Text>
                      {card.hasTooltip ? (
                        <Tooltip title="Net revenue after fees and refunds">
                          <Heading level={3}>{card.value}</Heading>
                        </Tooltip>
                      ) : (
                        <Heading level={3}>{card.value}</Heading>
                      )}
                    </Stack>
                  </Card>
                ))}
              </Flex>

              <Stack gap="16px">
                <Heading level={3}>Upcoming Events</Heading>
                <Table aria-label="Upcoming Events">
                  <TableHeader>
                    <Row>
                      <HeaderCell>Event</HeaderCell>
                      <HeaderCell>Date</HeaderCell>
                      <HeaderCell>Venue</HeaderCell>
                      <HeaderCell>Tickets Sold</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                    </Row>
                  </TableHeader>
                  <TableBody>
                    {eventTableData.map(event => (
                      <Row key={event.id}>
                        <Cell>{event.name}</Cell>
                        <Cell>{event.date}</Cell>
                        <Cell>{event.venue}</Cell>
                        <Cell>{event.ticketsSold}</Cell>
                        <Cell>
                          <Badge variant={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </>
          )}

          {currentPage === 'events' && (
            <>
              <Heading level={2}>Events</Heading>

              <Flex direction="row" gap="16px" alignItems="center">
                <TextField
                  label="Search by name or location"
                  value={eventSearchTerm}
                  onChange={setEventSearchTerm}
                  placeholder="Search..."
                  flex={1}
                />
                <Button variant="solid" onPress={() => setShowCreateEventDialog(true)}>
                  Create Event
                </Button>
              </Flex>

              <Table aria-label="Events">
                <TableHeader>
                  <Row>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Date</HeaderCell>
                    <HeaderCell>Location</HeaderCell>
                    <HeaderCell>Capacity</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                  </Row>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map(event => (
                    <Row key={event.id}>
                      <Cell>{event.name}</Cell>
                      <Cell>{event.date}</Cell>
                      <Cell>{event.venue}</Cell>
                      <Cell>500</Cell>
                      <Cell>
                        <Badge variant={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {currentPage === 'attendees' && (
            <>
              <Heading level={2}>Attendees</Heading>

              <Flex direction="row" gap="16px" alignItems="center">
                <TextField
                  label="Search by name or email"
                  value={attendeeSearchTerm}
                  onChange={setAttendeeSearchTerm}
                  placeholder="Search..."
                  flex={1}
                />
                <Text>{filteredAttendees.length} attendees</Text>
              </Flex>

              <Table aria-label="Attendees">
                <TableHeader>
                  <Row>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Email</HeaderCell>
                    <HeaderCell>Events Attended</HeaderCell>
                    <HeaderCell>Last Active</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                  </Row>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map(attendee => (
                    <Row key={attendee.id}>
                      <Cell>{attendee.name}</Cell>
                      <Cell>{attendee.email}</Cell>
                      <Cell>{attendee.eventsAttended}</Cell>
                      <Cell>{attendee.lastActive}</Cell>
                      <Cell>
                        <Badge variant={getAttendeeStatusColor(attendee.status)}>
                          {attendee.status}
                        </Badge>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {currentPage === 'reports' && (
            <>
              <Heading level={2}>Reports</Heading>

              <TabList selectedKey={reportsTab} onSelectionChange={setReportsTab}>
                <Tab id="revenue">Revenue</Tab>
                <Tab id="attendance">Attendance</Tab>
                <Tab id="overview">Overview</Tab>
              </TabList>

              <TabPanel id="revenue">
                <Stack gap="16px">
                  <Flex direction="row" gap="16px" wrap>
                    {[
                      { label: 'Total Revenue', value: '$45,230' },
                      { label: 'This Month', value: '$8,420' },
                      { label: 'Average per Event', value: '$1,885' },
                      { label: 'Refunds', value: '$1,230' },
                    ].map((card, i) => (
                      <Card key={i} flex={1} minWidth="200px" padding="16px">
                        <Stack gap="8px">
                          <Text size="small" color="neutral-600">
                            {card.label}
                          </Text>
                          <Heading level={3}>{card.value}</Heading>
                        </Stack>
                      </Card>
                    ))}
                  </Flex>
                  <Banner variant="success">
                    Revenue is up 12% compared to last month.
                  </Banner>
                </Stack>
              </TabPanel>

              <TabPanel id="attendance">
                <Stack gap="16px">
                  <Flex direction="row" gap="16px" wrap>
                    {[
                      { label: 'Total Attendees', value: '3,200' },
                      { label: 'Repeat Visitors', value: '890' },
                      { label: 'Average per Event', value: '178' },
                      { label: 'No-shows', value: '145' },
                    ].map((card, i) => (
                      <Card key={i} flex={1} minWidth="200px" padding="16px">
                        <Stack gap="8px">
                          <Text size="small" color="neutral-600">
                            {card.label}
                          </Text>
                          <Heading level={3}>{card.value}</Heading>
                        </Stack>
                      </Card>
                    ))}
                  </Flex>

                  <Table aria-label="Top Events by Attendance">
                    <TableHeader>
                      <Row>
                        <HeaderCell>Event</HeaderCell>
                        <HeaderCell>Date</HeaderCell>
                        <HeaderCell>Attendees</HeaderCell>
                        <HeaderCell>Capacity</HeaderCell>
                        <HeaderCell>Fill Rate</HeaderCell>
                      </Row>
                    </TableHeader>
                    <TableBody>
                      {[
                        { event: 'Summer Festival', date: 'Jul 15, 2026', attendees: 1200, capacity: 1500, fill: '80%' },
                        { event: 'Music Festival', date: 'Aug 20, 2026', attendees: 890, capacity: 1000, fill: '89%' },
                        { event: 'Tech Conference 2026', date: 'Jun 25, 2026', attendees: 450, capacity: 500, fill: '90%' },
                        { event: 'Art Exhibition', date: 'Sep 5, 2026', attendees: 156, capacity: 300, fill: '52%' },
                      ].map((row, i) => (
                        <Row key={i}>
                          <Cell>{row.event}</Cell>
                          <Cell>{row.date}</Cell>
                          <Cell>{row.attendees}</Cell>
                          <Cell>{row.capacity}</Cell>
                          <Cell>{row.fill}</Cell>
                        </Row>
                      ))}
                    </TableBody>
                  </Table>
                </Stack>
              </TabPanel>

              <TabPanel id="overview">
                <Stack gap="16px">
                  <Text>
                    This quarter has seen strong growth across all event categories, with a 15% increase in ticket sales
                    and 22% growth in attendee engagement. The summer festival season contributed 40% of total revenue.
                  </Text>

                  {['Q1 Summary', 'Q2 Summary', 'Q3 Summary'].map(section => (
                    <Card key={section} padding="16px">
                      <Stack gap="8px">
                        <Button
                          variant="ghost"
                          onPress={() => toggleSection(section)}
                          width="100%"
                        >
                          {expandedSections[section] ? '▼' : '▶'} {section}
                        </Button>
                        {expandedSections[section] && (
                          <Text size="small" color="neutral-700">
                            {section === 'Q1 Summary'
                              ? 'Q1 2026 maintained steady growth with 18 events and $32,500 in revenue. Focus on winter conferences and indoor events.'
                              : section === 'Q2 Summary'
                              ? 'Q2 2026 showed strong performance with 22 events and $45,230 in revenue. Summer outdoor events began showing strong attendance.'
                              : 'Q3 2026 peaked with 25 events planned and projected $52,000 in revenue. Summer festival season continues strong.'
                            }
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </TabPanel>
            </>
          )}

          {currentPage === 'settings' && (
            <>
              <Heading level={2}>Settings</Heading>

              <TabList selectedKey={settingsTab} onSelectionChange={setSettingsTab}>
                <Tab id="general">General</Tab>
                <Tab id="notifications">Notifications</Tab>
              </TabList>

              <TabPanel id="general">
                <Card padding="24px">
                  <Stack gap="16px">
                    <TextField label="Organization Name" defaultValue="My Events Co." />
                    <TextField label="Contact Email" type="email" defaultValue="contact@example.com" />
                    <Select label="Default Currency" defaultSelectedKey="usd">
                      <Option key="usd">USD</Option>
                      <Option key="eur">EUR</Option>
                      <Option key="gbp">GBP</Option>
                    </Select>
                    <Select label="Default Timezone" defaultSelectedKey="utc">
                      <Option key="utc">UTC</Option>
                      <Option key="cet">CET</Option>
                      <Option key="est">EST</Option>
                      <Option key="pst">PST</Option>
                    </Select>
                    <Button
                      variant="solid"
                      onPress={() => {
                        // Show success banner
                      }}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </Card>
              </TabPanel>

              <TabPanel id="notifications">
                <Card padding="24px">
                  <Stack gap="16px">
                    {[
                      { label: 'Email Notifications', description: 'Receive email updates for event changes' },
                      { label: 'SMS Notifications', description: 'Get SMS alerts for important updates' },
                      { label: 'Weekly Digest', description: 'Receive a weekly summary of your events' },
                      { label: 'Marketing Emails', description: 'Opt-in to promotional content' },
                    ].map((item, i) => (
                      <Stack key={i} gap="4px">
                        <Checkbox defaultSelected>{item.label}</Checkbox>
                        <Text size="small" color="neutral-600">
                          {item.description}
                        </Text>
                      </Stack>
                    ))}
                    <Button variant="solid">Save Preferences</Button>
                  </Stack>
                </Card>
              </TabPanel>
            </>
          )}
        </Flex>
      </Flex>

      {/* Sign Out Confirmation Dialog */}
      <Dialog isOpen={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <Heading level={3}>Sign Out</Heading>
        <Text>Are you sure you want to sign out?</Text>
        <Flex direction="row" gap="8px">
          <Button variant="ghost" onPress={() => setShowSignOutDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="solid"
            onPress={() => {
              setShowSignOutDialog(false);
            }}
          >
            Sign out
          </Button>
        </Flex>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog isOpen={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <Heading level={3}>Create Event</Heading>
        <Stack gap="16px">
          <TextField label="Event Name" placeholder="Enter event name" />
          <TextField label="Date" type="date" />
          <TextField label="Location" placeholder="Enter location" />
          <TextField label="Capacity" type="number" placeholder="Enter capacity" />
          <TextField label="Description" placeholder="Enter description" isMultiLine rows={4} />
        </Stack>
        <Flex direction="row" gap="8px">
          <Button variant="ghost" onPress={() => setShowCreateEventDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="solid"
            onPress={() => {
              setShowCreateEventDialog(false);
            }}
          >
            Create
          </Button>
        </Flex>
      </Dialog>
    </Flex>
  );
};

export default TestApp;
