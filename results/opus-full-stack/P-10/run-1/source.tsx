import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone } from '@internationalized/date';
import {
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  Columns,
  ContextualHelp,
  DateField,
  DateFormat,
  Dialog,
  Divider,
  FileField,
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
  TextArea,
  TextField,
  Tiles,
  ToastProvider,
  Tooltip,
  TopNavigation,
  useConfirmation,
  useToast,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type Page =
  | 'dashboard'
  | 'members'
  | 'projects'
  | 'calendar'
  | 'files'
  | 'settings';

type Role = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';

interface Member {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: MemberStatus;
  joined: Date;
  bio: string;
}

interface Project {
  id: string;
  name: string;
  lead: string;
  members: number;
  deadline: Date;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed';
}

interface Activity {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
}

interface SharedFile {
  id: string;
  name: string;
  type: 'Document' | 'Image' | 'Spreadsheet';
  sizeMb: number;
  uploadedBy: string;
  date: Date;
}

interface EventItem {
  id: string;
  date: Date;
  name: string;
  type: 'Meeting' | 'Deadline' | 'Social';
}

const PAGES: { id: Page; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'members', label: 'Members' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
];

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.io',
    status: 'Active',
    joined: new Date(2024, 1, 12),
    bio: 'Full-stack engineer focused on the core platform.',
  },
  {
    id: 'm2',
    name: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.io',
    status: 'Active',
    joined: new Date(2023, 8, 3),
    bio: 'Product designer working on the new design language.',
  },
  {
    id: 'm3',
    name: 'Carol White',
    role: 'Manager',
    email: 'carol@teamhub.io',
    status: 'On Leave',
    joined: new Date(2022, 4, 21),
    bio: 'Engineering manager for the growth squad.',
  },
  {
    id: 'm4',
    name: 'David Lee',
    role: 'Developer',
    email: 'david@teamhub.io',
    status: 'Active',
    joined: new Date(2024, 10, 7),
    bio: 'Backend engineer specialising in data pipelines.',
  },
  {
    id: 'm5',
    name: 'Eva Green',
    role: 'Designer',
    email: 'eva@teamhub.io',
    status: 'Active',
    joined: new Date(2025, 2, 18),
    bio: 'Brand and motion designer.',
  },
  {
    id: 'm6',
    name: 'Frank Moore',
    role: 'Manager',
    email: 'frank@teamhub.io',
    status: 'On Leave',
    joined: new Date(2021, 11, 1),
    bio: 'Delivery lead coordinating cross-team projects.',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    lead: 'Alice Johnson',
    members: 4,
    deadline: new Date(2026, 6, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Mobile App',
    lead: 'Bob Smith',
    members: 6,
    deadline: new Date(2026, 8, 1),
    progress: 40,
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'API Platform',
    lead: 'Carol White',
    members: 3,
    deadline: new Date(2026, 5, 30),
    progress: 90,
    status: 'On Hold',
  },
  {
    id: 'p4',
    name: 'Data Migration',
    lead: 'David Lee',
    members: 5,
    deadline: new Date(2026, 4, 20),
    progress: 100,
    status: 'Completed',
  },
  {
    id: 'p5',
    name: 'Marketing Site',
    lead: 'Eva Green',
    members: 2,
    deadline: new Date(2026, 7, 10),
    progress: 60,
    status: 'Active',
  },
];

const ACTIVITY: Activity[] = [
  {
    id: 'a1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Website Redesign',
    date: new Date(2026, 4, 28),
  },
  {
    id: 'a2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Mobile App',
    date: new Date(2026, 4, 27),
  },
  {
    id: 'a3',
    member: 'David Lee',
    action: 'Deploy',
    project: 'API Platform',
    date: new Date(2026, 4, 26),
  },
  {
    id: 'a4',
    member: 'Eva Green',
    action: 'Commit',
    project: 'Marketing Site',
    date: new Date(2026, 4, 25),
  },
  {
    id: 'a5',
    member: 'Carol White',
    action: 'Review',
    project: 'Data Migration',
    date: new Date(2026, 4, 24),
  },
];

const INITIAL_FILES: SharedFile[] = [
  {
    id: 'f1',
    name: 'Q2 Report.pdf',
    type: 'Document',
    sizeMb: 2.4,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 4, 20),
  },
  {
    id: 'f2',
    name: 'Logo.png',
    type: 'Image',
    sizeMb: 0.8,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 4, 18),
  },
  {
    id: 'f3',
    name: 'Budget.xlsx',
    type: 'Spreadsheet',
    sizeMb: 1.2,
    uploadedBy: 'Carol White',
    date: new Date(2026, 4, 15),
  },
  {
    id: 'f4',
    name: 'Roadmap.pdf',
    type: 'Document',
    sizeMb: 3.1,
    uploadedBy: 'David Lee',
    date: new Date(2026, 4, 12),
  },
  {
    id: 'f5',
    name: 'Mockups.png',
    type: 'Image',
    sizeMb: 5.6,
    uploadedBy: 'Eva Green',
    date: new Date(2026, 4, 10),
  },
];

const EVENTS: EventItem[] = [
  {
    id: 'e1',
    date: new Date(2026, 5, 30),
    name: 'Sprint Planning',
    type: 'Meeting',
  },
  { id: 'e2', date: new Date(2026, 6, 3), name: 'Release v2.0', type: 'Deadline' },
  { id: 'e3', date: new Date(2026, 6, 5), name: 'Team Lunch', type: 'Social' },
  {
    id: 'e4',
    date: new Date(2026, 6, 9),
    name: 'Design Review',
    type: 'Meeting',
  },
];

const NOTIFICATION_SETTINGS: { id: string; label: string; description: string }[] =
  [
    {
      id: 'join',
      label: 'New member joins',
      description: 'Get notified when someone joins the team',
    },
    {
      id: 'deadline',
      label: 'Project deadline approaching',
      description: 'Reminder 3 days before deadline',
    },
    {
      id: 'digest',
      label: 'Weekly digest',
      description: 'Summary of team activity every Monday',
    },
    {
      id: 'mention',
      label: 'Mention notifications',
      description: 'When someone mentions you in a comment',
    },
    {
      id: 'calendar',
      label: 'Calendar reminders',
      description: '15 minutes before scheduled events',
    },
  ];

/* ------------------------------------------------------------------ */
/* Indicator helpers                                                   */
/* ------------------------------------------------------------------ */

const memberStatusVariant = (s: MemberStatus) =>
  s === 'Active' ? 'success' : 'warning';

const activityVariant = (a: Activity['action']) =>
  a === 'Commit' ? 'info' : a === 'Review' ? 'warning' : 'success';

const projectStatusVariant = (s: Project['status']) =>
  s === 'Active' ? 'info' : s === 'On Hold' ? 'warning' : 'success';

const eventVariant = (t: EventItem['type']) =>
  t === 'Meeting' ? 'info' : t === 'Deadline' ? 'warning' : 'success';

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const { addToast } = useToast();
  const confirm = useConfirmation();

  const [page, setPage] = useState<Page>('dashboard');
  const [teamName, setTeamName] = useState('TeamHub');

  /* ---- members ---- */
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<Role>('Developer');
  const [formStart, setFormStart] = useState<DateValue | null>(null);
  const [formBio, setFormBio] = useState('');

  /* ---- projects ---- */
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );

  /* ---- files ---- */
  const [files, setFiles] = useState<SharedFile[]>(INITIAL_FILES);
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  /* ---- settings ---- */
  const [teamNameDraft, setTeamNameDraft] = useState('TeamHub');
  const [teamDescription, setTeamDescription] = useState(
    'A cross-functional product team.'
  );
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    join: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    slack: true,
    github: false,
    jira: false,
  });

  const currentLabel =
    PAGES.find(p => p.id === page)?.label ?? 'Dashboard';
  const selectedMember =
    members.find(m => m.id === selectedMemberId) ?? null;

  /* ------------------------------------------------------------------ */
  /* Member handlers                                                     */
  /* ------------------------------------------------------------------ */

  const openAddMember = () => {
    setEditingId(null);
    setFormName('');
    setFormEmail('');
    setFormRole('Developer');
    setFormStart(null);
    setFormBio('');
    setMemberDialogOpen(true);
  };

  const openEditMember = (m: Member) => {
    setEditingId(m.id);
    setFormName(m.name);
    setFormEmail(m.email);
    setFormRole(m.role);
    setFormStart(null);
    setFormBio(m.bio);
    setMemberDialogOpen(true);
  };

  const saveMember = () => {
    const joined = formStart
      ? formStart.toDate(getLocalTimeZone())
      : new Date();
    if (editingId) {
      setMembers(prev =>
        prev.map(m =>
          m.id === editingId
            ? {
                ...m,
                name: formName,
                email: formEmail,
                role: formRole,
                bio: formBio,
              }
            : m
        )
      );
    } else {
      setMembers(prev => [
        ...prev,
        {
          id: `m${Date.now()}`,
          name: formName,
          email: formEmail,
          role: formRole,
          status: 'Active',
          joined,
          bio: formBio,
        },
      ]);
    }
  };

  const removeMember = async (m: Member) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Remove member',
        content: `Are you sure you want to remove ${m.name}? This action cannot be undone.`,
        confirmationLabel: 'Remove',
      });
      setMembers(prev => prev.filter(x => x.id !== m.id));
      if (selectedMemberId === m.id) setSelectedMemberId(null);
    } catch {
      /* cancelled */
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(memberSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  /* ------------------------------------------------------------------ */
  /* Project handlers                                                    */
  /* ------------------------------------------------------------------ */

  const handleProjectSelection = (keys: 'all' | Set<React.Key>) => {
    if (keys === 'all') {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    } else {
      setSelectedProjects(new Set(Array.from(keys).map(String)));
    }
  };

  const archiveSelected = () => {
    setProjects(prev => prev.filter(p => !selectedProjects.has(p.id)));
    setSelectedProjects(new Set());
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  /* ------------------------------------------------------------------ */
  /* File handlers                                                       */
  /* ------------------------------------------------------------------ */

  const handleUpload = () => {
    setFiles(prev => [
      {
        id: `f${Date.now()}`,
        name: 'New Upload.pdf',
        type: 'Document',
        sizeMb: 1.5,
        uploadedBy: 'John Doe',
        date: new Date(),
      },
      ...prev,
    ]);
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name
      .toLowerCase()
      .includes(fileSearch.toLowerCase());
    const matchesType =
      fileTypeFilter === 'all' || f.type === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  /* ------------------------------------------------------------------ */
  /* Integration handlers                                                */
  /* ------------------------------------------------------------------ */

  const disconnectIntegration = async (key: string, name: string) => {
    try {
      await confirm({
        variant: 'destructive',
        title: `Disconnect ${name}`,
        content: `Are you sure you want to disconnect ${name}?`,
        confirmationLabel: 'Disconnect',
      });
      setIntegrations(prev => ({ ...prev, [key]: false }));
    } catch {
      /* cancelled */
    }
  };

  /* ------------------------------------------------------------------ */
  /* Page: Dashboard                                                     */
  /* ------------------------------------------------------------------ */

  const dashboard = (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Tiles tilesWidth="200px" space={4} stretch equalHeight>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text weight="bold">Members</Text>
              <Headline level={2}>{members.length}</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text weight="bold">Active Projects</Text>
              <Headline level={2}>5</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text weight="bold">Upcoming Deadlines</Text>
              <Headline level={2}>8</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Inline space={1} alignY="center">
                <Text weight="bold">Hours This Week</Text>
                <ContextualHelp>
                  <ContextualHelp.Content>
                    Aggregate of all team members.
                  </ContextualHelp.Content>
                </ContextualHelp>
              </Inline>
              <Headline level={2}>
                <NumericFormat value={342} />
              </Headline>
            </Stack>
          </Inset>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {ACTIVITY.map(a => (
              <Table.Row key={a.id}>
                <Table.Cell>{a.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={activityVariant(a.action)}>{a.action}</Badge>
                </Table.Cell>
                <Table.Cell>{a.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={a.date} dateStyle="medium" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint 14 ends in 3 days.</SectionMessage.Title>
        <SectionMessage.Content>
          Review the project board for outstanding tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  /* ------------------------------------------------------------------ */
  /* Page: Members                                                       */
  /* ------------------------------------------------------------------ */

  const memberToolbar = (
    <Inline space={3} alignY="center">
      <SearchField
        aria-label="Search members by name"
        placeholder="Search members…"
        value={memberSearch}
        onChange={setMemberSearch}
        width="auto"
      />
      <Select
        aria-label="Filter by role"
        selectedKey={roleFilter}
        onSelectionChange={key => setRoleFilter(String(key))}
        width="auto"
      >
        <Select.Option id="all">All Roles</Select.Option>
        <Select.Option id="Developer">Developer</Select.Option>
        <Select.Option id="Designer">Designer</Select.Option>
        <Select.Option id="Manager">Manager</Select.Option>
      </Select>
      <Select
        aria-label="View mode"
        selectedKey={viewMode}
        onSelectionChange={key => setViewMode(key as 'table' | 'cards')}
        width="auto"
      >
        <Select.Option id="table">Table view</Select.Option>
        <Select.Option id="cards">Card view</Select.Option>
      </Select>
      <Button variant="primary" onPress={openAddMember}>
        Add Member
      </Button>
    </Inline>
  );

  const memberTable = (
    <Table aria-label="Team members">
      <Table.Header>
        <Table.Column rowHeader>Name</Table.Column>
        <Table.Column>Role</Table.Column>
        <Table.Column>Email</Table.Column>
        <Table.Column>Status</Table.Column>
        <Table.Column>Joined</Table.Column>
        <Table.Column>Actions</Table.Column>
      </Table.Header>
      <Table.Body>
        {filteredMembers.map(m => (
          <Table.Row key={m.id}>
            <Table.Cell>
              <Button variant="link" onPress={() => setSelectedMemberId(m.id)}>
                {m.name}
              </Button>
            </Table.Cell>
            <Table.Cell>{m.role}</Table.Cell>
            <Table.Cell>{m.email}</Table.Cell>
            <Table.Cell>
              <Badge variant={memberStatusVariant(m.status)}>{m.status}</Badge>
            </Table.Cell>
            <Table.Cell>
              <DateFormat value={m.joined} dateStyle="medium" />
            </Table.Cell>
            <Table.Cell>
              <ActionMenu aria-label={`Actions for ${m.name}`}>
                <ActionMenu.Item
                  id="edit"
                  onAction={() => openEditMember(m)}
                >
                  Edit
                </ActionMenu.Item>
                <ActionMenu.Item
                  id="remove"
                  variant="destructive"
                  onAction={() => removeMember(m)}
                >
                  Remove
                </ActionMenu.Item>
              </ActionMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  const memberCards = (
    <Tiles tilesWidth="240px" space={4} stretch equalHeight>
      {filteredMembers.map(m => (
        <Card key={m.id}>
          <Inset space={4}>
            <Stack space={3}>
              <Button
                variant="link"
                onPress={() => setSelectedMemberId(m.id)}
              >
                {m.name}
              </Button>
              <Inline>
                <Badge variant="info">{m.role}</Badge>
              </Inline>
              <Text>{m.email}</Text>
              <Inline space={2}>
                <Button
                  size="small"
                  onPress={() =>
                    addToast({
                      title: `Message sent to ${m.name}`,
                      variant: 'info',
                    })
                  }
                >
                  Message
                </Button>
                <Button
                  size="small"
                  variant="secondary"
                  onPress={() => setSelectedMemberId(m.id)}
                >
                  Profile
                </Button>
              </Inline>
            </Stack>
          </Inset>
        </Card>
      ))}
    </Tiles>
  );

  const memberDetail = selectedMember && (
    <Card>
      <Inset space={4}>
        <Stack space={3}>
          <Inline space={3} alignX="between" alignY="center">
            <Headline level={3}>{selectedMember.name}</Headline>
            <Button
              variant="ghost"
              size="small"
              onPress={() => setSelectedMemberId(null)}
            >
              Close
            </Button>
          </Inline>
          <Divider />
          <Stack space={2}>
            <Text weight="bold">Role</Text>
            <Badge variant="info">{selectedMember.role}</Badge>
          </Stack>
          <Stack space={2}>
            <Text weight="bold">Email</Text>
            <Text>{selectedMember.email}</Text>
          </Stack>
          <Stack space={2}>
            <Text weight="bold">Status</Text>
            <Inline>
              <Badge variant={memberStatusVariant(selectedMember.status)}>
                {selectedMember.status}
              </Badge>
            </Inline>
          </Stack>
          <Stack space={2}>
            <Text weight="bold">Joined</Text>
            <Text>
              <DateFormat value={selectedMember.joined} dateStyle="long" />
            </Text>
          </Stack>
          <Stack space={2}>
            <Text weight="bold">Bio</Text>
            <Text>{selectedMember.bio}</Text>
          </Stack>
        </Stack>
      </Inset>
    </Card>
  );

  const membersList = (
    <Stack space={4}>
      {memberToolbar}
      {viewMode === 'table' ? memberTable : memberCards}
    </Stack>
  );

  const membersPage = (
    <Stack space={6}>
      <Headline level={1}>Team Members</Headline>
      {selectedMember ? (
        <Columns columns={[2, 1]} space={6} collapseAt="50em">
          {membersList}
          {memberDetail}
        </Columns>
      ) : (
        membersList
      )}

      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        {({ close }) => (
          <>
            <Dialog.Title>
              {editingId ? 'Edit Member' : 'Add Member'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  value={formName}
                  onChange={setFormName}
                  required
                  autoFocus
                />
                <TextField
                  label="Email"
                  type="email"
                  value={formEmail}
                  onChange={setFormEmail}
                  required
                />
                <Select
                  label="Role"
                  selectedKey={formRole}
                  onSelectionChange={key => setFormRole(key as Role)}
                >
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <DateField
                  label="Start Date"
                  value={formStart}
                  onChange={setFormStart}
                />
                <TextArea
                  label="Bio"
                  value={formBio}
                  onChange={setFormBio}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  if (!formName.trim() || !formEmail.trim()) return;
                  saveMember();
                  close();
                }}
              >
                {editingId ? 'Save' : 'Add'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );

  /* ------------------------------------------------------------------ */
  /* Page: Projects                                                      */
  /* ------------------------------------------------------------------ */

  const projectsPage = (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects…"
          value={projectSearch}
          onChange={setProjectSearch}
          width="auto"
        />
        <Button
          variant="primary"
          onPress={() =>
            addToast({ title: 'New project created', variant: 'success' })
          }
        >
          New Project
        </Button>
      </Inline>

      {selectedProjects.size > 0 && (
        <Card>
          <Inset space={3}>
            <Inline space={3} alignY="center">
              <Text weight="bold">
                {selectedProjects.size} selected
              </Text>
              <Button variant="destructive" onPress={archiveSelected}>
                Archive Selected
              </Button>
              <Button
                variant="secondary"
                onPress={() =>
                  addToast({ title: 'Projects exported', variant: 'info' })
                }
              >
                Export
              </Button>
            </Inline>
          </Inset>
        </Card>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedProjects}
        onSelectionChange={handleProjectSelection}
      >
        <Table.Header>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredProjects.map(p => (
            <Table.Row key={p.id} id={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={p.members} />
              </Table.Cell>
              <Table.Cell>
                <DateFormat value={p.deadline} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <NumericFormat
                  value={p.progress / 100}
                  style="percent"
                />
              </Table.Cell>
              <Table.Cell>
                <Badge variant={projectStatusVariant(p.status)}>
                  {p.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  /* ------------------------------------------------------------------ */
  /* Page: Calendar                                                      */
  /* ------------------------------------------------------------------ */

  const calendarPage = (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Calendar aria-label="Team calendar" />
      <Stack space={3}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={2}>
          {EVENTS.map(e => (
            <Card key={e.id}>
              <Inset space={3}>
                <Inline space={3} alignY="center" alignX="between">
                  <Inline space={3} alignY="center">
                    <Text weight="bold">
                      <DateFormat value={e.date} dateStyle="medium" />
                    </Text>
                    <Text>{e.name}</Text>
                  </Inline>
                  <Badge variant={eventVariant(e.type)}>{e.type}</Badge>
                </Inline>
              </Inset>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  /* ------------------------------------------------------------------ */
  /* Page: Files                                                         */
  /* ------------------------------------------------------------------ */

  const filesPage = (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search files"
          placeholder="Search files…"
          value={fileSearch}
          onChange={setFileSearch}
          width="auto"
        />
        <Select
          aria-label="Filter by file type"
          selectedKey={fileTypeFilter}
          onSelectionChange={key => setFileTypeFilter(String(key))}
          width="auto"
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Document">Documents</Select.Option>
          <Select.Option id="Image">Images</Select.Option>
          <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>
          Upload
        </Button>
      </Inline>

      <Table aria-label="Shared files">
        <Table.Header>
          <Table.Column rowHeader>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column>Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredFiles.map(f => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat
                  value={f.sizeMb}
                  style="unit"
                  unit="megabyte"
                  unitDisplay="short"
                />
              </Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={f.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label={`Actions for ${f.name}`}>
                  <ActionMenu.Item
                    id="download"
                    onAction={() =>
                      addToast({
                        title: `Downloading ${f.name}`,
                        variant: 'info',
                      })
                    }
                  >
                    Download
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="rename"
                    onAction={() =>
                      addToast({
                        title: `Renaming ${f.name}`,
                        variant: 'info',
                      })
                    }
                  >
                    Rename
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="delete"
                    variant="destructive"
                    onAction={() =>
                      setFiles(prev => prev.filter(x => x.id !== f.id))
                    }
                  >
                    Delete
                  </ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <FileField label="Files" multiple />
                <TextField label="Description" />
                <Select label="Category">
                  <Select.Option id="Document">Documents</Select.Option>
                  <Select.Option id="Image">Images</Select.Option>
                  <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  handleUpload();
                  close();
                }}
              >
                Upload
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );

  /* ------------------------------------------------------------------ */
  /* Page: Settings                                                      */
  /* ------------------------------------------------------------------ */

  const settingsPage = (
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>
      <Tabs aria-label="Team settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField
              label="Team Name"
              value={teamNameDraft}
              onChange={setTeamNameDraft}
            />
            <TextArea
              label="Description"
              value={teamDescription}
              onChange={setTeamDescription}
            />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={key => setTimezone(String(key))}
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
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Inline>
              <Button
                variant="primary"
                onPress={() => {
                  setTeamName(teamNameDraft);
                  addToast({ title: 'Settings updated.', variant: 'success' });
                }}
              >
                Save
              </Button>
            </Inline>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={5}>
            {NOTIFICATION_SETTINGS.map(n => (
              <Stack key={n.id} space={1}>
                <Switch
                  label={n.label}
                  selected={notifications[n.id]}
                  onChange={value =>
                    setNotifications(prev => ({ ...prev, [n.id]: value }))
                  }
                />
                <Text color="text-muted">{n.description}</Text>
              </Stack>
            ))}
            <Inline>
              <Button
                variant="primary"
                onPress={() =>
                  addToast({
                    title: 'Preferences saved.',
                    variant: 'success',
                  })
                }
              >
                Save Preferences
              </Button>
            </Inline>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="240px" space={4} stretch equalHeight>
            {[
              {
                key: 'slack',
                name: 'Slack',
                description: 'Send team notifications to your Slack channels.',
              },
              {
                key: 'github',
                name: 'GitHub',
                description: 'Link commits and pull requests to projects.',
              },
              {
                key: 'jira',
                name: 'Jira',
                description: 'Sync issues and sprints with your boards.',
              },
            ].map(integ => {
              const connected = integrations[integ.key];
              return (
                <Card key={integ.key}>
                  <Inset space={4}>
                    <Stack space={3}>
                      <Headline level={3}>{integ.name}</Headline>
                      <Inline>
                        <Badge variant={connected ? 'success' : 'default'}>
                          {connected ? 'Connected' : 'Not connected'}
                        </Badge>
                      </Inline>
                      <Text>{integ.description}</Text>
                      {connected ? (
                        <Inline>
                          <Button
                            variant="destructive-ghost"
                            onPress={() =>
                              disconnectIntegration(integ.key, integ.name)
                            }
                          >
                            Disconnect
                          </Button>
                        </Inline>
                      ) : (
                        <Inline>
                          <Button
                            variant="primary"
                            onPress={() =>
                              setIntegrations(prev => ({
                                ...prev,
                                [integ.key]: true,
                              }))
                            }
                          >
                            Connect
                          </Button>
                        </Inline>
                      )}
                    </Stack>
                  </Inset>
                </Card>
              );
            })}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  const pageContent =
    page === 'dashboard'
      ? dashboard
      : page === 'members'
        ? membersPage
        : page === 'projects'
          ? projectsPage
          : page === 'calendar'
            ? calendarPage
            : page === 'files'
              ? filesPage
              : settingsPage;

  return (
    <>
      <ToastProvider position="bottom-right" />
      <RouterProvider
        navigate={href => {
          const target = href.replace('/', '') as Page;
          if (PAGES.some(p => p.id === target)) {
            setPage(target);
          }
        }}
      >
        <Sidebar.Provider defaultOpen>
          <AppLayout>
            <AppLayout.Sidebar>
              <Sidebar.Header>
                <Text weight="bold" fontSize="lg">
                  {teamName}
                </Text>
              </Sidebar.Header>
              <Sidebar.Nav current={`/${page}`}>
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
              <TopNavigation.Start>
                <Sidebar.Toggle />
              </TopNavigation.Start>
              <TopNavigation.Middle aria-label="Breadcrumb">
                <Breadcrumbs>
                  <Breadcrumbs.Item href="/dashboard">
                    {teamName}
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item href={`/${page}`}>
                    {currentLabel}
                  </Breadcrumbs.Item>
                </Breadcrumbs>
              </TopNavigation.Middle>
              <TopNavigation.End aria-label="Account">
                <Inline space={2} alignY="center">
                  <Tooltip.Trigger>
                    <Menu
                      label="John Doe"
                      onAction={key =>
                        addToast({
                          title: `${String(key)}`,
                          variant: 'info',
                        })
                      }
                    >
                      <Menu.Item id="Profile">Profile</Menu.Item>
                      <Menu.Item id="Preferences">Preferences</Menu.Item>
                      <Menu.Item id="Sign Out">Sign Out</Menu.Item>
                    </Menu>
                    <Tooltip>Account settings</Tooltip>
                  </Tooltip.Trigger>
                  <ContextualHelp>
                    <ContextualHelp.Content>
                      Use the sidebar to navigate between sections.
                    </ContextualHelp.Content>
                  </ContextualHelp>
                </Inline>
              </TopNavigation.End>
            </AppLayout.Header>

            <AppLayout.Main>
              <Inset space={6}>{pageContent}</Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>
    </>
  );
};

export default TestApp;
