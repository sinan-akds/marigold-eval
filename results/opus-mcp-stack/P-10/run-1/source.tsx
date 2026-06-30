import { useMemo, useState } from 'react';
import { parseDate } from '@internationalized/date';
import type { Selection } from '@marigold/components';
import {
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  Columns,
  ConfirmationProvider,
  ContextualHelp,
  DateField,
  DateFormat,
  Dialog,
  FileField,
  Form,
  Headline,
  Inline,
  Inset,
  Menu,
  ActionMenu,
  NumericFormat,
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
  Tiles,
  ToastProvider,
  ToggleButton,
  Tooltip,
  TopNavigation,
  TextArea,
  TextField,
  useConfirmation,
  useToast,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Types & seed data                                                   */
/* ------------------------------------------------------------------ */

type Role = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';

interface Member {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: MemberStatus;
  joined: string; // ISO yyyy-mm-dd
  bio: string;
}

interface Project {
  id: string;
  name: string;
  lead: string;
  members: number;
  deadline: string;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed';
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice.johnson@teamhub.dev',
    status: 'Active',
    joined: '2023-02-14',
    bio: 'Full-stack engineer focused on the platform core and CI tooling.',
  },
  {
    id: 'm2',
    name: 'Marcus Lee',
    role: 'Designer',
    email: 'marcus.lee@teamhub.dev',
    status: 'Active',
    joined: '2022-11-03',
    bio: 'Product designer owning the design system and onboarding flows.',
  },
  {
    id: 'm3',
    name: 'Priya Nair',
    role: 'Manager',
    email: 'priya.nair@teamhub.dev',
    status: 'On Leave',
    joined: '2021-06-21',
    bio: 'Engineering manager for the growth and retention squad.',
  },
  {
    id: 'm4',
    name: 'Tom Becker',
    role: 'Developer',
    email: 'tom.becker@teamhub.dev',
    status: 'Active',
    joined: '2023-08-30',
    bio: 'Backend developer working on billing and the public API.',
  },
  {
    id: 'm5',
    name: 'Sofia Rossi',
    role: 'QA',
    email: 'sofia.rossi@teamhub.dev',
    status: 'Active',
    joined: '2024-01-12',
    bio: 'QA engineer maintaining the end-to-end automation suite.',
  },
  {
    id: 'm6',
    name: 'David Kim',
    role: 'Designer',
    email: 'david.kim@teamhub.dev',
    status: 'On Leave',
    joined: '2022-04-05',
    bio: 'Brand and motion designer supporting marketing campaigns.',
  },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Atlas Redesign', lead: 'Marcus Lee', members: 5, deadline: '2026-07-15', progress: 75, status: 'Active' },
  { id: 'p2', name: 'Billing v2', lead: 'Tom Becker', members: 3, deadline: '2026-08-01', progress: 40, status: 'Active' },
  { id: 'p3', name: 'Mobile App', lead: 'Alice Johnson', members: 6, deadline: '2026-09-20', progress: 20, status: 'On Hold' },
  { id: 'p4', name: 'Data Pipeline', lead: 'Priya Nair', members: 4, deadline: '2026-06-30', progress: 100, status: 'Completed' },
  { id: 'p5', name: 'Onboarding Flow', lead: 'David Kim', members: 2, deadline: '2026-07-28', progress: 60, status: 'Active' },
];

const ACTIVITY = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'Atlas Redesign', date: '2026-05-28' },
  { id: 'a2', member: 'Tom Becker', action: 'Review', project: 'Billing v2', date: '2026-05-27' },
  { id: 'a3', member: 'Sofia Rossi', action: 'Deploy', project: 'Data Pipeline', date: '2026-05-26' },
  { id: 'a4', member: 'Marcus Lee', action: 'Commit', project: 'Onboarding Flow', date: '2026-05-25' },
  { id: 'a5', member: 'David Kim', action: 'Review', project: 'Mobile App', date: '2026-05-24' },
];

const EVENTS = [
  { id: 'e1', date: '2026-06-29', name: 'Sprint Planning', type: 'Meeting' },
  { id: 'e2', date: '2026-07-02', name: 'Design Review', type: 'Meeting' },
  { id: 'e3', date: '2026-07-15', name: 'Atlas Redesign Deadline', type: 'Deadline' },
  { id: 'e4', date: '2026-07-18', name: 'Team Summer BBQ', type: 'Social' },
];

const FILES = [
  { id: 'f1', name: 'Q2 Report.pdf', type: 'Documents', size: 2.4, by: 'Priya Nair', date: '2026-06-10' },
  { id: 'f2', name: 'Logo Pack.png', type: 'Images', size: 8.1, by: 'David Kim', date: '2026-06-12' },
  { id: 'f3', name: 'Budget.xlsx', type: 'Spreadsheets', size: 1.2, by: 'Tom Becker', date: '2026-06-15' },
  { id: 'f4', name: 'Roadmap.pdf', type: 'Documents', size: 3.7, by: 'Marcus Lee', date: '2026-06-18' },
  { id: 'f5', name: 'Hero Shot.png', type: 'Images', size: 12.5, by: 'Sofia Rossi', date: '2026-06-20' },
];

const MEMBER_STATUS_VARIANT: Record<MemberStatus, 'success' | 'warning'> = {
  Active: 'success',
  'On Leave': 'warning',
};

const ROLE_VARIANT: Record<Role, 'info' | 'primary' | 'success' | 'default'> = {
  Developer: 'info',
  Designer: 'primary',
  Manager: 'success',
  QA: 'default',
};

const ACTION_VARIANT: Record<string, 'info' | 'warning' | 'success'> = {
  Commit: 'info',
  Review: 'warning',
  Deploy: 'success',
};

const PROJECT_STATUS_VARIANT: Record<Project['status'], 'success' | 'warning' | 'info'> = {
  Active: 'success',
  'On Hold': 'warning',
  Completed: 'info',
};

const EVENT_VARIANT: Record<string, 'info' | 'warning' | 'success'> = {
  Meeting: 'info',
  Deadline: 'warning',
  Social: 'success',
};

const PAGES: { id: string; path: string; label: string }[] = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard' },
  { id: 'members', path: '/members', label: 'Members' },
  { id: 'projects', path: '/projects', label: 'Projects' },
  { id: 'calendar', path: '/calendar', label: 'Calendar' },
  { id: 'files', path: '/files', label: 'Files' },
  { id: 'settings', path: '/settings', label: 'Settings' },
];

const fmtDate = (iso: string) => <DateFormat value={new Date(`${iso}T00:00:00`)} dateStyle="medium" />;

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

const AppContent = () => {
  const { addToast } = useToast();
  const confirm = useConfirmation();

  const [path, setPath] = useState('/dashboard');
  const [teamName, setTeamName] = useState('TeamHub');

  // Members
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [memberView, setMemberView] = useState<'table' | 'cards'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  // Projects
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSelection, setProjectSelection] = useState<Selection>(new Set());

  // Files
  const [fileSearch, setFileSearch] = useState('');
  const [fileType, setFileType] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  // Settings
  const [draftTeamName, setDraftTeamName] = useState('TeamHub');
  const [description, setDescription] = useState('The central hub for our product team.');
  const [timezone, setTimezone] = useState<string>('CET');
  const [dateFormat, setDateFormat] = useState<string>('DD.MM.YYYY');
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    join: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    Slack: true,
    GitHub: false,
    Jira: false,
  });

  const currentPage = PAGES.find(p => p.path === path) ?? PAGES[0];
  const activeProjects = projects.filter(p => p.status === 'Active').length;

  /* ----- Members logic ----- */
  const filteredMembers = useMemo(
    () =>
      members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase());
        const matchesRole = roleFilter === 'all' || m.role === roleFilter;
        return matchesSearch && matchesRole;
      }),
    [members, memberSearch, roleFilter]
  );

  const openAddMember = () => {
    setEditing(null);
    setMemberDialogOpen(true);
  };

  const openEditMember = (member: Member) => {
    setEditing(member);
    setMemberDialogOpen(true);
  };

  const saveMember = (data: Record<string, FormDataEntryValue>) => {
    const next: Member = {
      id: editing?.id ?? `m${Date.now()}`,
      name: String(data.fullName ?? ''),
      email: String(data.email ?? ''),
      role: (String(data.role) as Role) || 'Developer',
      status: editing?.status ?? 'Active',
      joined: data.startDate ? String(data.startDate) : new Date().toISOString().slice(0, 10),
      bio: String(data.bio ?? ''),
    };
    if (editing) {
      setMembers(prev => prev.map(m => (m.id === editing.id ? next : m)));
      setSelectedMember(prev => (prev && prev.id === editing.id ? next : prev));
    } else {
      setMembers(prev => [...prev, next]);
    }
    setMemberDialogOpen(false);
  };

  const removeMember = async (member: Member) => {
    const confirmed = await confirm({
      variant: 'destructive',
      title: 'Remove member',
      content: `Are you sure you want to remove ${member.name}? This action cannot be undone.`,
      confirmationLabel: 'Remove',
    });
    if (confirmed) {
      setMembers(prev => prev.filter(m => m.id !== member.id));
      setSelectedMember(prev => (prev && prev.id === member.id ? null : prev));
    }
  };

  /* ----- Projects logic ----- */
  const filteredProjects = useMemo(
    () => projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase())),
    [projects, projectSearch]
  );

  const selectedProjectIds =
    projectSelection === 'all'
      ? filteredProjects.map(p => p.id)
      : Array.from(projectSelection).map(String);
  const selectedProjectCount = selectedProjectIds.length;

  const archiveSelected = () => {
    setProjects(prev => prev.filter(p => !selectedProjectIds.includes(p.id)));
    setProjectSelection(new Set());
    addToast({ title: 'Projects archived', variant: 'success' });
  };

  /* ----- Files logic ----- */
  const filteredFiles = useMemo(
    () =>
      FILES.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase());
        const matchesType = fileType === 'all' || f.type === fileType;
        return matchesSearch && matchesType;
      }),
    [fileSearch, fileType]
  );

  /* ---------------------------------------------------------------- */
  /* Page renderers                                                    */
  /* ---------------------------------------------------------------- */

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Tiles tilesWidth="200px" space={4} stretch equalHeight>
        <Card p={4}>
          <Stack space={1}>
            <Text color="text-muted">Members</Text>
            <Headline level={2}>{members.length}</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={1}>
            <Text color="text-muted">Active Projects</Text>
            <Headline level={2}>{activeProjects}</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={1}>
            <Text color="text-muted">Upcoming Deadlines</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={1}>
            <Inline space={1} alignY="center">
              <Text color="text-muted">Hours This Week</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" size="small" aria-label="About hours this week">
                  ⓘ
                </Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={2}>
              <NumericFormat value={342} />
            </Headline>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level={3}>Recent Activity</Headline>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body items={ACTIVITY}>
            {row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={ACTION_VARIANT[row.action]}>{row.action}</Badge>
                </Table.Cell>
                <Table.Cell>{row.project}</Table.Cell>
                <Table.Cell>{fmtDate(row.date)}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint 14 ends in 3 days</SectionMessage.Title>
        <SectionMessage.Content>
          Review the project board for outstanding tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  const renderMemberTable = () => (
    <Table aria-label="Team members" selectionMode="none">
      <Table.Header>
        <Table.Column rowHeader>Name</Table.Column>
        <Table.Column>Role</Table.Column>
        <Table.Column>Email</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Joined</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body items={filteredMembers}>
        {member => (
          <Table.Row key={member.id}>
            <Table.Cell>
              <Button variant="text" onPress={() => setSelectedMember(member)}>
                {member.name}
              </Button>
            </Table.Cell>
            <Table.Cell>{member.role}</Table.Cell>
            <Table.Cell>{member.email}</Table.Cell>
            <Table.Cell>
              <Badge variant={MEMBER_STATUS_VARIANT[member.status]}>{member.status}</Badge>
            </Table.Cell>
            <Table.Cell>{fmtDate(member.joined)}</Table.Cell>
            <Table.Cell>
              <Inline space={1} noWrap>
                <Button size="small" onPress={() => openEditMember(member)}>
                  Edit
                </Button>
                <Button size="small" variant="destructive" onPress={() => removeMember(member)}>
                  Remove
                </Button>
              </Inline>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );

  const renderMemberCards = () => (
    <Tiles tilesWidth="240px" space={4} stretch equalHeight>
      {filteredMembers.map(member => (
        <Card key={member.id} p={4}>
          <Stack space={2}>
            <Button variant="text" onPress={() => setSelectedMember(member)}>
              <Text weight="bold">{member.name}</Text>
            </Button>
            <Inline>
              <Badge variant={ROLE_VARIANT[member.role]}>{member.role}</Badge>
            </Inline>
            <Text size="small" color="text-muted">
              {member.email}
            </Text>
            <Inline space={2}>
              <Button size="small" onPress={() => alert(`Message ${member.name}`)}>
                Message
              </Button>
              <Button size="small" variant="secondary" onPress={() => setSelectedMember(member)}>
                Profile
              </Button>
            </Inline>
          </Stack>
        </Card>
      ))}
    </Tiles>
  );

  const renderMemberDetail = (member: Member) => (
    <Card p={4}>
      <Stack space={3}>
        <Inline alignX="between" alignY="center" space={2}>
          <Headline level={3}>{member.name}</Headline>
          <Button variant="ghost" size="small" onPress={() => setSelectedMember(null)} aria-label="Close details">
            ✕
          </Button>
        </Inline>
        <Inline space={2}>
          <Badge variant={ROLE_VARIANT[member.role]}>{member.role}</Badge>
          <Badge variant={MEMBER_STATUS_VARIANT[member.status]}>{member.status}</Badge>
        </Inline>
        <Stack space={1}>
          <Text color="text-muted" size="small">
            Email
          </Text>
          <Text>{member.email}</Text>
        </Stack>
        <Stack space={1}>
          <Text color="text-muted" size="small">
            Joined
          </Text>
          <Text>{fmtDate(member.joined)}</Text>
        </Stack>
        <Stack space={1}>
          <Text color="text-muted" size="small">
            Bio
          </Text>
          <Text>{member.bio}</Text>
        </Stack>
      </Stack>
    </Card>
  );

  const renderMembers = () => {
    const view = <Stack space={4}>{memberView === 'table' ? renderMemberTable() : renderMemberCards()}</Stack>;
    return (
      <Stack space={6}>
        <Headline level={1}>Team Members</Headline>
        <Inline space={3} alignY="bottom">
          <SearchField
            aria-label="Search members"
            placeholder="Search by name"
            value={memberSearch}
            onChange={setMemberSearch}
            width={64}
          />
          <Select
            aria-label="Filter by role"
            selectedKey={roleFilter}
            onSelectionChange={key => setRoleFilter(String(key))}
            width={48}
          >
            <Select.Option id="all">All Roles</Select.Option>
            <Select.Option id="Developer">Developer</Select.Option>
            <Select.Option id="Designer">Designer</Select.Option>
            <Select.Option id="Manager">Manager</Select.Option>
          </Select>
          <ToggleButton.Group
            aria-label="View mode"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([memberView])}
            onSelectionChange={keys => {
              const next = Array.from(keys)[0];
              if (next) setMemberView(next as 'table' | 'cards');
            }}
          >
            <ToggleButton id="table">Table</ToggleButton>
            <ToggleButton id="cards">Cards</ToggleButton>
          </ToggleButton.Group>
          <Button variant="primary" onPress={openAddMember}>
            Add Member
          </Button>
        </Inline>

        {selectedMember ? (
          <Columns columns={[2, 1]} space={6} collapseAt="55em">
            {view}
            {renderMemberDetail(selectedMember)}
          </Columns>
        ) : (
          view
        )}
      </Stack>
    );
  };

  const renderProjects = () => (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>
      <Inline space={3} alignY="bottom" alignX="between">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects"
          value={projectSearch}
          onChange={setProjectSearch}
          width={64}
        />
        <Button variant="primary" onPress={() => addToast({ title: 'New project created', variant: 'success' })}>
          New Project
        </Button>
      </Inline>

      {selectedProjectCount > 0 && (
        <Card p={3}>
          <Inline space={3} alignY="center" alignX="between">
            <Text weight="medium">{selectedProjectCount} selected</Text>
            <Inline space={2}>
              <Button variant="destructive" size="small" onPress={archiveSelected}>
                Archive Selected
              </Button>
              <Button
                variant="secondary"
                size="small"
                onPress={() => addToast({ title: 'Export started', variant: 'info' })}
              >
                Export
              </Button>
            </Inline>
          </Inline>
        </Card>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={projectSelection}
        onSelectionChange={setProjectSelection}
      >
        <Table.Header>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column alignX="right">Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column alignX="right">Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredProjects}>
          {project => (
            <Table.Row key={project.id}>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={project.members} />
              </Table.Cell>
              <Table.Cell>{fmtDate(project.deadline)}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={project.progress / 100} style="percent" />
              </Table.Cell>
              <Table.Cell>
                <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>{project.status}</Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Calendar aria-label="Team calendar" />
      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Stack space={2}>
          {EVENTS.map(event => (
            <Card key={event.id} p={3}>
              <Inline space={3} alignY="center" alignX="between">
                <Inline space={3} alignY="center">
                  <Text weight="medium">{fmtDate(event.date)}</Text>
                  <Text>{event.name}</Text>
                </Inline>
                <Badge variant={EVENT_VARIANT[event.type]}>{event.type}</Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderFiles = () => (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>
      <Inline space={3} alignY="bottom" alignX="between">
        <Inline space={3} alignY="bottom">
          <SearchField
            aria-label="Search files"
            placeholder="Search files"
            value={fileSearch}
            onChange={setFileSearch}
            width={64}
          />
          <Select
            aria-label="Filter by file type"
            selectedKey={fileType}
            onSelectionChange={key => setFileType(String(key))}
            width={48}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Documents">Documents</Select.Option>
            <Select.Option id="Images">Images</Select.Option>
            <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
          </Select>
        </Inline>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>
          Upload
        </Button>
      </Inline>

      <Table aria-label="Shared files">
        <Table.Header>
          <Table.Column rowHeader>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column alignX="right">Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body items={filteredFiles}>
          {file => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={file.size} style="unit" unit="megabyte" unitDisplay="short" />
              </Table.Cell>
              <Table.Cell>{file.by}</Table.Cell>
              <Table.Cell>{fmtDate(file.date)}</Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label={`Actions for ${file.name}`}>
                  <Menu.Item id="download" onAction={() => addToast({ title: `Downloading ${file.name}`, variant: 'info' })}>
                    Download
                  </Menu.Item>
                  <Menu.Item id="rename" onAction={() => addToast({ title: `Rename ${file.name}`, variant: 'info' })}>
                    Rename
                  </Menu.Item>
                  <Menu.Item
                    id="delete"
                    variant="destructive"
                    onAction={() => addToast({ title: `Deleted ${file.name}`, variant: 'warning' })}
                  >
                    Delete
                  </Menu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>
      <Tabs aria-label="Team settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Form
            onSubmit={e => {
              e.preventDefault();
              setTeamName(draftTeamName);
              addToast({ title: 'Settings updated.', variant: 'success' });
            }}
          >
            <Stack space={4} alignX="left">
              <TextField label="Team Name" value={draftTeamName} onChange={setDraftTeamName} width={80} />
              <TextArea label="Description" value={description} onChange={setDescription} width={80} rows={3} />
              <Select
                label="Default Timezone"
                selectedKey={timezone}
                onSelectionChange={key => setTimezone(String(key))}
                width={48}
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={dateFormat}
                onSelectionChange={key => setDateFormat(String(key))}
                width={48}
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Stack>
          </Form>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {(
              [
                { key: 'join', label: 'New member joins', desc: 'Get notified when someone joins the team' },
                { key: 'deadline', label: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
                { key: 'digest', label: 'Weekly digest', desc: 'Summary of team activity every Monday' },
                { key: 'mention', label: 'Mention notifications', desc: 'When someone mentions you in a comment' },
                { key: 'calendar', label: 'Calendar reminders', desc: '15 minutes before scheduled events' },
              ] as const
            ).map(item => (
              <Stack key={item.key} space={1}>
                <Switch
                  label={item.label}
                  selected={notifications[item.key]}
                  onChange={value => setNotifications(prev => ({ ...prev, [item.key]: value }))}
                />
                <Text size="small" color="text-muted">
                  {item.desc}
                </Text>
              </Stack>
            ))}
            <Button variant="primary" onPress={() => addToast({ title: 'Preferences saved.', variant: 'success' })}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="220px" space={4} stretch equalHeight>
            {(
              [
                { name: 'Slack', desc: 'Send team notifications to your Slack channels.' },
                { name: 'GitHub', desc: 'Link commits and pull requests to projects.' },
                { name: 'Jira', desc: 'Sync issues and sprints with Jira boards.' },
              ] as const
            ).map(item => {
              const connected = integrations[item.name];
              return (
                <Card key={item.name} p={4}>
                  <Stack space={3}>
                    <Inline space={2} alignY="center" alignX="between">
                      <Headline level={4}>{item.name}</Headline>
                      <Badge variant={connected ? 'success' : 'default'}>
                        {connected ? 'Connected' : 'Not connected'}
                      </Badge>
                    </Inline>
                    <Text size="small" color="text-muted">
                      {item.desc}
                    </Text>
                    {connected ? (
                      <Button
                        variant="secondary"
                        size="small"
                        onPress={async () => {
                          const ok = await confirm({
                            variant: 'destructive',
                            title: `Disconnect ${item.name}`,
                            content: `Are you sure you want to disconnect ${item.name}?`,
                            confirmationLabel: 'Disconnect',
                          });
                          if (ok) setIntegrations(prev => ({ ...prev, [item.name]: false }));
                        }}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="small"
                        onPress={() => setIntegrations(prev => ({ ...prev, [item.name]: true }))}
                      >
                        Connect
                      </Button>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (currentPage.id) {
      case 'members':
        return renderMembers();
      case 'projects':
        return renderProjects();
      case 'calendar':
        return renderCalendar();
      case 'files':
        return renderFiles();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  /* ---------------------------------------------------------------- */

  return (
    <>
      <ToastProvider position="bottom-right" />
      <RouterProvider navigate={setPath}>
        <Sidebar.Provider defaultOpen>
          <AppLayout>
            <AppLayout.Sidebar>
              <Sidebar.Header>
                <Text weight="bold" size="large">
                  {teamName}
                </Text>
              </Sidebar.Header>
              <Sidebar.Nav current={path}>
                <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
                <Sidebar.Item href="/members">Members</Sidebar.Item>
                <Sidebar.Item href="/projects">Projects</Sidebar.Item>
                <Sidebar.Item href="/calendar">Calendar</Sidebar.Item>
                <Sidebar.Item href="/files">Files</Sidebar.Item>
                <Sidebar.Separator />
                <Sidebar.Item href="/settings">Settings</Sidebar.Item>
              </Sidebar.Nav>
            </AppLayout.Sidebar>

            <AppLayout.Header>
              <TopNavigation>
                <TopNavigation.Start>
                  <Sidebar.Toggle />
                </TopNavigation.Start>
                <TopNavigation.Middle aria-label="Breadcrumb">
                  <Breadcrumbs>
                    <Breadcrumbs.Item href="/dashboard">{teamName}</Breadcrumbs.Item>
                    <Breadcrumbs.Item href={currentPage.path}>{currentPage.label}</Breadcrumbs.Item>
                  </Breadcrumbs>
                </TopNavigation.Middle>
                <TopNavigation.End aria-label="Account">
                  <Inline space={2} alignY="center">
                    <ContextualHelp>
                      <ContextualHelp.Title>Navigation help</ContextualHelp.Title>
                      <ContextualHelp.Content>
                        Use the sidebar to navigate between sections.
                      </ContextualHelp.Content>
                    </ContextualHelp>
                    <Tooltip.Trigger>
                      <Menu label="John Doe" variant="ghost" onAction={key => alert(`Account: ${String(key)}`)}>
                        <Menu.Item id="profile">Profile</Menu.Item>
                        <Menu.Item id="preferences">Preferences</Menu.Item>
                        <Menu.Item id="signout">Sign Out</Menu.Item>
                      </Menu>
                      <Tooltip>Account settings</Tooltip>
                    </Tooltip.Trigger>
                  </Inline>
                </TopNavigation.End>
              </TopNavigation>
            </AppLayout.Header>

            <AppLayout.Main>
              <Inset space={8}>{renderPage()}</Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>

      {/* Add / Edit member dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen} size="small" closeButton>
        {({ close }) => (
          <Form
            key={editing?.id ?? 'new'}
            onSubmit={e => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              saveMember(data);
            }}
          >
            <Dialog.Title>{editing ? 'Edit Member' : 'Add Member'}</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField label="Full Name" name="fullName" required defaultValue={editing?.name} />
                <TextField label="Email" name="email" type="email" required defaultValue={editing?.email} />
                <Select label="Role" name="role" defaultSelectedKey={editing?.role ?? 'Developer'}>
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <DateField
                  label="Start Date"
                  name="startDate"
                  defaultValue={editing ? parseDate(editing.joined) : undefined}
                />
                <TextArea label="Bio" name="bio" rows={3} defaultValue={editing?.bio} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editing ? 'Save' : 'Add'}
              </Button>
            </Dialog.Actions>
          </Form>
        )}
      </Dialog>

      {/* Upload files dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen} size="small" closeButton>
        {({ close }) => (
          <Form
            onSubmit={e => {
              e.preventDefault();
              addToast({ title: 'Files uploaded successfully.', variant: 'success' });
              close();
            }}
          >
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <FileField label="Files" name="files" multiple />
                <TextArea label="Description" name="description" rows={3} />
                <Select label="Category" name="category" defaultSelectedKey="Documents">
                  <Select.Option id="Documents">Documents</Select.Option>
                  <Select.Option id="Images">Images</Select.Option>
                  <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Dialog.Actions>
          </Form>
        )}
      </Dialog>
    </>
  );
};

const TestApp = () => (
  <ConfirmationProvider>
    <AppContent />
  </ConfirmationProvider>
);

export default TestApp;
