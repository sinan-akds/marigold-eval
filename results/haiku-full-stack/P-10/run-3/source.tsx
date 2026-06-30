'use client';

import { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Button,
  Stack,
  Headline,
  Card,
  Columns,
  Inline,
  Table,
  Dialog,
  TextField,
  Select,
  SearchField,
  Badge,
  Tabs,
  Switch,
  DateField,
  TextArea,
  ActionMenu,
  Menu,
  SectionMessage,
  Breadcrumbs,
  Calendar,
  Tooltip,
  ToastProvider,
  useToast,
  Text,
  Tiles,
  Divider,
  NumberField,
  NumericFormat,
  DateFormat,
  ContextualHelp,
} from '@marigold/components';

type Member = {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  status: 'Active' | 'On Leave';
  joined: Date;
  bio?: string;
};

type Project = {
  id: string;
  name: string;
  lead: string;
  members: number;
  deadline: Date;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed';
};

type ActivityRecord = {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
};

type FileRecord = {
  id: string;
  name: string;
  type: 'Documents' | 'Images' | 'Spreadsheets';
  size: number;
  uploadedBy: string;
  date: Date;
};

const sampleMembers: Member[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@company.com', role: 'Developer', status: 'Active', joined: new Date(2024, 0, 15), bio: 'Backend specialist' },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'Designer', status: 'Active', joined: new Date(2024, 3, 1), bio: 'UI/UX designer' },
  { id: '3', name: 'Carol White', email: 'carol@company.com', role: 'Manager', status: 'Active', joined: new Date(2023, 6, 20), bio: 'Product manager' },
  { id: '4', name: 'David Brown', email: 'david@company.com', role: 'Developer', status: 'On Leave', joined: new Date(2024, 1, 10), bio: 'Frontend developer' },
  { id: '5', name: 'Eve Davis', email: 'eve@company.com', role: 'QA', status: 'Active', joined: new Date(2024, 2, 5), bio: 'QA engineer' },
  { id: '6', name: 'Frank Miller', email: 'frank@company.com', role: 'Developer', status: 'Active', joined: new Date(2023, 11, 1), bio: 'Full-stack developer' },
];

const sampleProjects: Project[] = [
  { id: 'p1', name: 'Platform Redesign', lead: 'Carol White', members: 5, deadline: new Date(2026, 7, 15), progress: 65, status: 'Active' },
  { id: 'p2', name: 'Mobile App v2.0', lead: 'Frank Miller', members: 4, deadline: new Date(2026, 8, 30), progress: 40, status: 'Active' },
  { id: 'p3', name: 'API Documentation', lead: 'Alice Johnson', members: 2, deadline: new Date(2026, 6, 10), progress: 85, status: 'Active' },
  { id: 'p4', name: 'Legacy System Migration', lead: 'David Brown', members: 3, deadline: new Date(2026, 9, 1), progress: 30, status: 'On Hold' },
  { id: 'p5', name: 'Q1 Infrastructure Upgrade', lead: 'Frank Miller', members: 6, deadline: new Date(2026, 3, 30), progress: 100, status: 'Completed' },
];

const sampleActivity: ActivityRecord[] = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'API Documentation', date: new Date(2026, 5, 28) },
  { id: 'a2', member: 'Bob Smith', action: 'Review', project: 'Platform Redesign', date: new Date(2026, 5, 27) },
  { id: 'a3', member: 'Frank Miller', action: 'Deploy', project: 'Mobile App v2.0', date: new Date(2026, 5, 27) },
  { id: 'a4', member: 'Eve Davis', action: 'Review', project: 'API Documentation', date: new Date(2026, 5, 26) },
  { id: 'a5', member: 'Carol White', action: 'Commit', project: 'Platform Redesign', date: new Date(2026, 5, 26) },
];

const sampleFiles: FileRecord[] = [
  { id: 'f1', name: 'Q2 Report.pdf', type: 'Documents', size: 2.4, uploadedBy: 'Carol White', date: new Date(2026, 5, 25) },
  { id: 'f2', name: 'Logo Design.png', type: 'Images', size: 0.8, uploadedBy: 'Bob Smith', date: new Date(2026, 5, 24) },
  { id: 'f3', name: 'Budget Forecast.xlsx', type: 'Spreadsheets', size: 1.2, uploadedBy: 'Carol White', date: new Date(2026, 5, 23) },
  { id: 'f4', name: 'Meeting Notes.docx', type: 'Documents', size: 0.3, uploadedBy: 'Alice Johnson', date: new Date(2026, 5, 22) },
  { id: 'f5', name: 'Team Photo.jpg', type: 'Images', size: 3.5, uploadedBy: 'Eve Davis', date: new Date(2026, 5, 20) },
];

function Dashboard({ members, memberCount }: { members: Member[], memberCount: number }) {
  return (
    <Stack space={4}>
      <Headline level="2">Team Overview</Headline>

      <Tiles tilesWidth="12rem" space={4}>
        <Card>
          <Stack space={3} alignX="center">
            <Text size="lg" weight="bold">{memberCount}</Text>
            <Text>Members</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={3} alignX="center">
            <Text size="lg" weight="bold">5</Text>
            <Text>Active Projects</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={3} alignX="center">
            <Text size="lg" weight="bold">8</Text>
            <Text>Upcoming Deadlines</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={3} alignX="center">
            <Tooltip.Trigger>
              <Text size="lg" weight="bold">
                <NumericFormat value={342} />
              </Text>
              <Tooltip>Aggregate of all team members</Tooltip>
            </Tooltip.Trigger>
            <Text>Hours This Week</Text>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level="3">Recent Activity</Headline>
        <Table aria-label="Recent Activity">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {sampleActivity.map(record => (
              <Table.Row key={record.id}>
                <Table.Cell>{record.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={record.action === 'Commit' ? 'info' : record.action === 'Review' ? 'warning' : 'success'}>
                    {record.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{record.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={record.date} dateStyle="medium" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage>
        <SectionMessage.Title>Sprint 14 ends in 3 days</SectionMessage.Title>
        <SectionMessage.Content>Review the project board for outstanding tasks.</SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );
}

function MembersPage({ members, setMembers }: { members: Member[], setMembers: (m: Member[]) => void }) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<string | null>('Developer');
  const [formBio, setFormBio] = useState('');
  const { addToast } = useToast();

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || roleFilter === null || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, roleFilter]);

  const handleAddOrEditMember = () => {
    if (!formName || !formEmail || !formRole) return;

    if (editingMember) {
      const updated = {
        ...editingMember,
        name: formName,
        email: formEmail,
        role: formRole as any,
        bio: formBio,
      };
      setMembers(members.map(m => m.id === updated.id ? updated : m));
      addToast({ title: 'Member updated', variant: 'success' });
    } else {
      const newMember: Member = {
        id: String(Date.now()),
        name: formName,
        email: formEmail,
        role: formRole as any,
        status: 'Active',
        joined: new Date(),
        bio: formBio,
      };
      setMembers([...members, newMember]);
      addToast({ title: 'Member added', variant: 'success' });
    }

    setDialogOpen(false);
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Developer');
    setFormBio('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    addToast({ title: 'Member removed', variant: 'success' });
  };

  const openAddDialog = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Developer');
    setFormBio('');
    setDialogOpen(true);
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormRole(member.role);
    setFormBio(member.bio || '');
    setDialogOpen(true);
  };

  return (
    <Stack space={4}>
      <Headline level="2">Team Members</Headline>

      <Inline space={4} alignY="center">
        <SearchField placeholder="Search members..." value={searchTerm} onChange={setSearchTerm} />
        <Select label="Role" value={roleFilter ?? 'all'} onChange={(v: any) => setRoleFilter((v as string) ?? 'all')}>
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Inline space={2} alignY="center">
          <Button variant={viewMode === 'table' ? 'primary' : 'secondary'} size="small" onPress={() => setViewMode('table')}>Table</Button>
          <Button variant={viewMode === 'cards' ? 'primary' : 'secondary'} size="small" onPress={() => setViewMode('cards')}>Cards</Button>
        </Inline>
        <Dialog.Trigger open={dialogOpen} onOpenChange={setDialogOpen}>
          <Button variant="primary" onPress={openAddDialog}>Add Member</Button>
          <Dialog size="small">
            <Dialog.Title>{editingMember ? 'Edit Member' : 'Add Member'}</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField label="Full Name" value={formName} onChange={setFormName} required />
                <TextField label="Email" type="email" value={formEmail} onChange={setFormEmail} required />
                <Select label="Role" value={formRole ?? 'Developer'} onChange={(v: any) => setFormRole(v as string)}>
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <TextArea label="Bio" value={formBio} onChange={setFormBio} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button variant="primary" slot="close" onPress={handleAddOrEditMember}>
                {editingMember ? 'Update' : 'Add'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team Members">
          <Table.Header>
            <Table.Column rowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map(member => (
              <Table.Row key={member.id}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat value={member.joined} dateStyle="medium" />
                </Table.Cell>
                <Table.Cell>
                  <Inline space={2}>
                    <Button size="small" variant="secondary" onPress={() => openEditDialog(member)}>Edit</Button>
                    <Button size="small" variant="destructive" onPress={() => handleRemoveMember(member.id)}>Remove</Button>
                  </Inline>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="14rem" space={4}>
          {filteredMembers.map(member => (
            <Card key={member.id}>
              <Stack space={3}>
                <Text weight="bold">{member.name}</Text>
                <Badge variant="info">{member.role}</Badge>
                <Text size="sm">{member.email}</Text>
                <Inline space={2}>
                  <Button size="small" onPress={() => openEditDialog(member)}>Edit</Button>
                  <Button size="small" onPress={() => handleRemoveMember(member.id)}>Remove</Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}
    </Stack>
  );
}

function ProjectsPage({ projects, setProjects }: { projects: Project[], setProjects: (p: Project[]) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set<string>());

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  const handleArchiveSelected = () => {
    setProjects(projects.filter(p => !selectedRows.has(p.id)));
    setSelectedRows(new Set());
  };

  return (
    <Stack space={4}>
      <Inline space={4} alignY="center">
        <Headline level="2">Projects</Headline>
        <SearchField placeholder="Search projects..." value={searchTerm} onChange={setSearchTerm} />
        <Button variant="primary">New Project</Button>
      </Inline>

      {selectedRows.size > 0 && (
        <Inline space={4} alignY="center">
          <Text>{selectedRows.size} selected</Text>
          <Button variant="destructive" size="small" onPress={handleArchiveSelected}>Archive Selected</Button>
          <Button variant="secondary" size="small" onPress={() => setSelectedRows(new Set())}>Export</Button>
        </Inline>
      )}

      <Table aria-label="Projects" selectionMode="multiple">
        <Table.Header>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredProjects.map(project => (
            <Table.Row key={project.id}>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>{project.members}</Table.Cell>
              <Table.Cell>
                <DateFormat value={project.deadline} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>{project.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={project.status === 'Active' ? 'success' : project.status === 'On Hold' ? 'warning' : 'default'}>
                  {project.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function CalendarPage() {
  return (
    <Stack space={4}>
      <Headline level="2">Team Calendar</Headline>
      <Calendar />

      <Stack space={3}>
        <Headline level="3">Upcoming Events</Headline>
        <Stack space={2}>
          {[
            { date: new Date(2026, 5, 30), name: 'Sprint Planning', type: 'Meeting' },
            { date: new Date(2026, 6, 5), name: 'Q3 Kickoff', type: 'Meeting' },
            { date: new Date(2026, 6, 10), name: 'API v2.0 Release', type: 'Deadline' },
            { date: new Date(2026, 6, 15), name: 'Team Outing', type: 'Social' },
          ].map((event, idx) => (
            <Card key={idx}>
              <Inline space={4} alignY="center">
                <Text weight="bold">
                  <DateFormat value={event.date} dateStyle="medium" />
                </Text>
                <Text>{event.name}</Text>
                <Badge variant={event.type === 'Meeting' ? 'info' : event.type === 'Deadline' ? 'warning' : 'success'}>
                  {event.type}
                </Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

function FilesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [files, setFiles] = useState(sampleFiles);
  const { addToast } = useToast();

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || f.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, searchTerm, typeFilter]);

  return (
    <Stack space={4}>
      <Headline level="2">Shared Files</Headline>

      <Inline space={4} alignY="center">
        <SearchField placeholder="Search files..." value={searchTerm} onChange={setSearchTerm} />
        <Select label="Type" value={typeFilter} onChange={(v: any) => setTypeFilter(v as string)}>
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary">Upload</Button>
      </Inline>

      <Table aria-label="Files">
        <Table.Header>
          <Table.Column rowHeader>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column>Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredFiles.map(file => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={file.size} style="unit" unit="megabyte" unitDisplay="short" />
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={file.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu size="small">
                  <ActionMenu.Item id="download">Download</ActionMenu.Item>
                  <ActionMenu.Item id="rename">Rename</ActionMenu.Item>
                  <ActionMenu.Item id="delete" variant="destructive">Delete</ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

function SettingsPage({ teamName, setTeamName }: { teamName: string, setTeamName: (name: string) => void }) {
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifications, setNotifications] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    reminder: true,
  });
  const [integrations, setIntegrations] = useState({
    slack: true,
    github: false,
    jira: false,
  });
  const { addToast } = useToast();

  return (
    <Stack space={4}>
      <Headline level="2">Team Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField label="Team Name" value={teamName} onChange={setTeamName} />
            <TextArea label="Description" />
            <Select label="Default Timezone" value={timezone} onChange={(v: any) => setTimezone(v as string)}>
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select label="Date Format" value={dateFormat} onChange={(v: any) => setDateFormat(v as string)}>
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button variant="primary" onPress={() => addToast({ title: 'Settings updated', variant: 'success' })}>Save</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={3}>
            <Switch
              label="New member joins"
              selected={notifications.newMember}
              onChange={(v) => setNotifications({ ...notifications, newMember: v })}
            />
            <Text size="sm">Get notified when someone joins the team</Text>
            <Divider />

            <Switch
              label="Project deadline approaching"
              selected={notifications.deadline}
              onChange={(v) => setNotifications({ ...notifications, deadline: v })}
            />
            <Text size="sm">Reminder 3 days before deadline</Text>
            <Divider />

            <Switch
              label="Weekly digest"
              selected={notifications.digest}
              onChange={(v) => setNotifications({ ...notifications, digest: v })}
            />
            <Text size="sm">Summary of team activity every Monday</Text>
            <Divider />

            <Switch
              label="Mention notifications"
              selected={notifications.mention}
              onChange={(v) => setNotifications({ ...notifications, mention: v })}
            />
            <Text size="sm">When someone mentions you in a comment</Text>
            <Divider />

            <Switch
              label="Calendar reminders"
              selected={notifications.reminder}
              onChange={(v) => setNotifications({ ...notifications, reminder: v })}
            />
            <Text size="sm">15 minutes before scheduled events</Text>

            <Button variant="primary" onPress={() => addToast({ title: 'Preferences saved', variant: 'success' })}>Save Preferences</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="14rem" space={4}>
            {[
              { name: 'Slack', status: 'connected', description: 'Chat integration for team collaboration' },
              { name: 'GitHub', status: 'not-connected', description: 'Version control and code repository' },
              { name: 'Jira', status: 'not-connected', description: 'Issue tracking and project management' },
            ].map(int => (
              <Card key={int.name}>
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">{int.name}</Text>
                    <Badge variant={int.status === 'connected' ? 'success' : 'default'}>
                      {int.status === 'connected' ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </Inline>
                  <Text size="sm">{int.description}</Text>
                  <Button variant={int.status === 'connected' ? 'destructive' : 'primary'} size="small">
                    {int.status === 'connected' ? 'Disconnect' : 'Connect'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

type PageType = 'dashboard' | 'members' | 'projects' | 'calendar' | 'files' | 'settings';

const TestAppContent = ({ teamName, setTeamName, currentPage, setCurrentPage, members, setMembers, projects, setProjects }: any) => {
  const navItems: { id: PageType, label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'projects', label: 'Projects' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'files', label: 'Files' },
    { id: 'settings', label: 'Settings' },
  ];

  const pageTitle = navItems.find(item => item.id === currentPage)?.label || 'Dashboard';

  return (
    <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">{teamName}</Text>
            </Sidebar.Header>
            <Sidebar.Nav>
              {navItems.map((item, idx) => (
                <Stack key={item.id} space={0}>
                  {idx === 4 && <Sidebar.Separator />}
                  <Sidebar.Item
                    href="#"
                    active={currentPage === item.id}
                    onPress={() => setCurrentPage(item.id)}
                  >
                    {item.label}
                  </Sidebar.Item>
                </Stack>
              ))}
            </Sidebar.Nav>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="#">{teamName}</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">{pageTitle}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Tooltip.Trigger>
                <Menu label="John Doe">
                  <Menu.Item id="profile">Profile</Menu.Item>
                  <Menu.Item id="preferences">Preferences</Menu.Item>
                  <Menu.Item id="signout" variant="destructive">Sign Out</Menu.Item>
                </Menu>
                <Tooltip>Account settings</Tooltip>
              </Tooltip.Trigger>
              <ContextualHelp>
                <ContextualHelp.Title>Using TeamHub</ContextualHelp.Title>
                <ContextualHelp.Content>
                  Use the sidebar to navigate between sections. Each section provides different tools for managing your team.
                </ContextualHelp.Content>
              </ContextualHelp>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Stack space={4}>
              {currentPage === 'dashboard' && <Dashboard members={members} memberCount={members.length} />}
              {currentPage === 'members' && <MembersPage members={members} setMembers={setMembers} />}
              {currentPage === 'projects' && <ProjectsPage projects={projects} setProjects={setProjects} />}
              {currentPage === 'calendar' && <CalendarPage />}
              {currentPage === 'files' && <FilesPage />}
              {currentPage === 'settings' && <SettingsPage teamName={teamName} setTeamName={setTeamName} />}
            </Stack>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
  );
};

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [members, setMembers] = useState(sampleMembers);
  const [projects, setProjects] = useState(sampleProjects);
  const [teamName, setTeamName] = useState('TeamHub');

  return (
    <>
      <ToastProvider position="bottom-right" />
      <TestAppContent
        teamName={teamName}
        setTeamName={setTeamName}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        members={members}
        setMembers={setMembers}
        projects={projects}
        setProjects={setProjects}
      />
    </>
  );
};

export default TestApp;
