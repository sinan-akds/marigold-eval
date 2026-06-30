import { useState } from 'react';
import { CalendarDate } from '@internationalized/date';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  RouterProvider,
  Breadcrumbs,
  Menu,
  ActionMenu,
  Tooltip,
  ContextualHelp,
  Stack,
  Inline,
  Columns,
  Tiles,
  Inset,
  Divider,
  Headline,
  Text,
  Badge,
  Card,
  Table,
  Tabs,
  Calendar,
  Button,
  ToggleButton,
  TextField,
  TextArea,
  Select,
  SearchField,
  Switch,
  FileField,
  DatePicker,
  Dialog,
  ActionBar,
  ToastProvider,
  useToast,
  DateFormat,
  NumericFormat,
  SectionMessage,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Types & helpers                                                     */
/* ------------------------------------------------------------------ */

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

interface FileEntry {
  id: string;
  name: string;
  type: 'Document' | 'Image' | 'Spreadsheet';
  sizeMB: number;
  uploadedBy: string;
  date: Date;
}

const PAGES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

const memberStatusVariant: Record<MemberStatus, any> = {
  Active: 'success',
  'On Leave': 'warning',
};

const projectStatusVariant: Record<Project['status'], any> = {
  Active: 'success',
  'On Hold': 'warning',
  Completed: 'info',
};

const activityVariant: Record<string, any> = {
  Commit: 'info',
  Review: 'warning',
  Deploy: 'success',
};

const eventVariant: Record<string, any> = {
  Meeting: 'info',
  Deadline: 'warning',
  Social: 'success',
};

const toDateValue = (d: Date | null) =>
  d ? new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate()) : null;

const fromDateValue = (dv: any): Date | null =>
  dv ? new Date(dv.year, dv.month - 1, dv.day) : null;

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'John Doe',
    role: 'Manager',
    email: 'john.doe@teamhub.io',
    status: 'Active',
    joined: new Date(2023, 0, 15),
    bio: 'Team lead coordinating roadmap and delivery.',
  },
  {
    id: 'm2',
    name: 'Anna Müller',
    role: 'Designer',
    email: 'anna.mueller@teamhub.io',
    status: 'Active',
    joined: new Date(2023, 4, 2),
    bio: 'Product designer focused on design systems.',
  },
  {
    id: 'm3',
    name: 'Tom Becker',
    role: 'Developer',
    email: 'tom.becker@teamhub.io',
    status: 'On Leave',
    joined: new Date(2022, 8, 20),
    bio: 'Full-stack engineer, currently on parental leave.',
  },
  {
    id: 'm4',
    name: 'Sara Klein',
    role: 'Developer',
    email: 'sara.klein@teamhub.io',
    status: 'Active',
    joined: new Date(2024, 1, 10),
    bio: 'Frontend engineer working on the dashboard.',
  },
  {
    id: 'm5',
    name: 'Liam Chen',
    role: 'QA',
    email: 'liam.chen@teamhub.io',
    status: 'Active',
    joined: new Date(2023, 10, 5),
    bio: 'Quality engineer maintaining the test suites.',
  },
  {
    id: 'm6',
    name: 'Maria Rossi',
    role: 'Designer',
    email: 'maria.rossi@teamhub.io',
    status: 'On Leave',
    joined: new Date(2024, 5, 18),
    bio: 'UX researcher running usability studies.',
  },
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Marketing Website',
    lead: 'Anna Müller',
    members: 4,
    deadline: new Date(2026, 6, 30),
    progress: 75,
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Mobile App',
    lead: 'Sara Klein',
    members: 6,
    deadline: new Date(2026, 8, 15),
    progress: 40,
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'Data Migration',
    lead: 'Tom Becker',
    members: 3,
    deadline: new Date(2026, 7, 1),
    progress: 10,
    status: 'On Hold',
  },
  {
    id: 'p4',
    name: 'Design System',
    lead: 'Maria Rossi',
    members: 5,
    deadline: new Date(2026, 5, 20),
    progress: 100,
    status: 'Completed',
  },
  {
    id: 'p5',
    name: 'API Platform',
    lead: 'Liam Chen',
    members: 4,
    deadline: new Date(2026, 9, 10),
    progress: 55,
    status: 'Active',
  },
];

const initialFiles: FileEntry[] = [
  {
    id: 'f1',
    name: 'Q2 Roadmap.pdf',
    type: 'Document',
    sizeMB: 2.4,
    uploadedBy: 'John Doe',
    date: new Date(2026, 4, 12),
  },
  {
    id: 'f2',
    name: 'Hero Banner.png',
    type: 'Image',
    sizeMB: 5.1,
    uploadedBy: 'Anna Müller',
    date: new Date(2026, 4, 18),
  },
  {
    id: 'f3',
    name: 'Budget 2026.xlsx',
    type: 'Spreadsheet',
    sizeMB: 0.8,
    uploadedBy: 'Sara Klein',
    date: new Date(2026, 5, 1),
  },
  {
    id: 'f4',
    name: 'Brand Guidelines.pdf',
    type: 'Document',
    sizeMB: 12.3,
    uploadedBy: 'Maria Rossi',
    date: new Date(2026, 5, 9),
  },
  {
    id: 'f5',
    name: 'Team Photo.jpg',
    type: 'Image',
    sizeMB: 3.7,
    uploadedBy: 'Liam Chen',
    date: new Date(2026, 5, 21),
  },
];

const recentActivity = [
  {
    id: 'a1',
    member: 'Sara Klein',
    action: 'Commit',
    project: 'Mobile App',
    date: new Date(2026, 4, 28),
  },
  {
    id: 'a2',
    member: 'Tom Becker',
    action: 'Review',
    project: 'API Platform',
    date: new Date(2026, 4, 27),
  },
  {
    id: 'a3',
    member: 'Liam Chen',
    action: 'Deploy',
    project: 'Marketing Website',
    date: new Date(2026, 4, 26),
  },
  {
    id: 'a4',
    member: 'Anna Müller',
    action: 'Commit',
    project: 'Design System',
    date: new Date(2026, 4, 25),
  },
  {
    id: 'a5',
    member: 'John Doe',
    action: 'Review',
    project: 'Data Migration',
    date: new Date(2026, 4, 24),
  },
];

const upcomingEvents = [
  {
    id: 'e1',
    name: 'Sprint Planning',
    type: 'Meeting',
    date: new Date(2026, 5, 29),
  },
  { id: 'e2', name: 'Release v2.1', type: 'Deadline', date: new Date(2026, 6, 3) },
  { id: 'e3', name: 'Team Lunch', type: 'Social', date: new Date(2026, 6, 5) },
  {
    id: 'e4',
    name: 'Design Review',
    type: 'Meeting',
    date: new Date(2026, 6, 8),
  },
];

const NOTIFICATION_DEFS = [
  {
    id: 'newMember',
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
/* App                                                                 */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const { addToast } = useToast();

  /* navigation + global */
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [teamName, setTeamName] = useState('TeamHub');

  /* data */
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [files, setFiles] = useState<FileEntry[]>(initialFiles);

  /* members ui */
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  /* member dialog + form */
  const [memberDialog, setMemberDialog] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    id: string | null;
  }>({ open: false, mode: 'add', id: null });
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<Role>('Developer');
  const [formStartDate, setFormStartDate] = useState<any>(null);
  const [formBio, setFormBio] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>(
    {}
  );
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

  /* projects ui */
  const [projectSearch, setProjectSearch] = useState('');
  const [projectSelected, setProjectSelected] = useState<any>(new Set());

  /* files ui */
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  /* settings ui */
  const [teamNameDraft, setTeamNameDraft] = useState(teamName);
  const [descDraft, setDescDraft] = useState(
    'The product team building TeamHub.'
  );
  const [timezone, setTimezone] = useState('CET');
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    newMember: true,
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
  const [integrationToDisconnect, setIntegrationToDisconnect] = useState<
    string | null
  >(null);

  /* ---------------------------------------------------------------- */
  /* derived                                                          */
  /* ---------------------------------------------------------------- */

  const filteredMembers = members.filter(
    m =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
      (roleFilter === 'all' || m.role === roleFilter)
  );

  const selectedMember =
    members.find(m => m.id === selectedMemberId) ?? null;

  const filteredProjects = projects.filter(
    p =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.lead.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const typeMap: Record<string, string> = {
    Documents: 'Document',
    Images: 'Image',
    Spreadsheets: 'Spreadsheet',
  };
  const filteredFiles = files.filter(
    f =>
      f.name.toLowerCase().includes(fileSearch.toLowerCase()) &&
      (fileTypeFilter === 'all' || f.type === typeMap[fileTypeFilter])
  );

  /* ---------------------------------------------------------------- */
  /* member actions                                                   */
  /* ---------------------------------------------------------------- */

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormRole('Developer');
    setFormStartDate(null);
    setFormBio('');
    setFormErrors({});
  };

  const openAddMember = () => {
    resetForm();
    setMemberDialog({ open: true, mode: 'add', id: null });
  };

  const openEditMember = (m: Member) => {
    setFormName(m.name);
    setFormEmail(m.email);
    setFormRole(m.role);
    setFormStartDate(toDateValue(m.joined));
    setFormBio(m.bio);
    setFormErrors({});
    setMemberDialog({ open: true, mode: 'edit', id: m.id });
  };

  const closeMemberDialog = () => {
    setMemberDialog({ open: false, mode: 'add', id: null });
    resetForm();
  };

  const submitMember = () => {
    const errs: { name?: string; email?: string } = {};
    if (!formName.trim()) errs.name = 'Full name is required.';
    if (!formEmail.trim()) errs.email = 'Email is required.';
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const joined = fromDateValue(formStartDate) ?? new Date();

    if (memberDialog.mode === 'add') {
      const newMember: Member = {
        id: crypto.randomUUID(),
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        status: 'Active',
        joined,
        bio: formBio,
      };
      setMembers(prev => [...prev, newMember]);
      addToast({ title: 'Member added', variant: 'success' });
    } else {
      setMembers(prev =>
        prev.map(m =>
          m.id === memberDialog.id
            ? {
                ...m,
                name: formName.trim(),
                email: formEmail.trim(),
                role: formRole,
                joined,
                bio: formBio,
              }
            : m
        )
      );
      addToast({ title: 'Member updated', variant: 'success' });
    }
    closeMemberDialog();
  };

  const confirmRemoveMember = () => {
    if (!memberToRemove) return;
    const id = memberToRemove.id;
    setMembers(prev => prev.filter(m => m.id !== id));
    if (selectedMemberId === id) setSelectedMemberId(null);
    setMemberToRemove(null);
    addToast({ title: 'Member removed', variant: 'success' });
  };

  /* ---------------------------------------------------------------- */
  /* project actions                                                  */
  /* ---------------------------------------------------------------- */

  const selectedProjectIds = (): string[] =>
    projectSelected === 'all'
      ? filteredProjects.map(p => p.id)
      : Array.from(projectSelected as Set<string>);

  const archiveSelected = () => {
    const ids = selectedProjectIds();
    setProjects(prev => prev.filter(p => !ids.includes(p.id)));
    setProjectSelected(new Set());
    addToast({
      title: `${ids.length} project(s) archived`,
      variant: 'success',
    });
  };

  const exportSelected = () => {
    addToast({ title: 'Export started', variant: 'info' });
  };

  /* ---------------------------------------------------------------- */
  /* file actions                                                     */
  /* ---------------------------------------------------------------- */

  const handleUpload = () => {
    setUploadOpen(false);
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  const handleFileAction = (file: FileEntry, action: any) => {
    if (action === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== file.id));
      addToast({ title: `${file.name} deleted`, variant: 'success' });
    } else if (action === 'download') {
      addToast({ title: `Downloading ${file.name}`, variant: 'info' });
    } else if (action === 'rename') {
      addToast({ title: `Rename ${file.name}`, variant: 'info' });
    }
  };

  /* ---------------------------------------------------------------- */
  /* settings actions                                                 */
  /* ---------------------------------------------------------------- */

  const saveGeneral = () => {
    setTeamName(teamNameDraft.trim() || 'TeamHub');
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const savePreferences = () => {
    addToast({ title: 'Preferences saved.', variant: 'success' });
  };

  const confirmDisconnect = () => {
    if (!integrationToDisconnect) return;
    const key = integrationToDisconnect;
    setIntegrations(prev => ({ ...prev, [key]: false }));
    setIntegrationToDisconnect(null);
    addToast({ title: 'Integration disconnected', variant: 'success' });
  };

  /* ---------------------------------------------------------------- */
  /* page renderers                                                   */
  /* ---------------------------------------------------------------- */

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={2}>Team Overview</Headline>

      <Tiles space={4} tilesWidth="200px" stretch equalHeight>
        <Card>
          <Stack space={2}>
            <Text color="text-secondary-muted">Members</Text>
            <Headline level={3}>
              <NumericFormat value={members.length} />
            </Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text color="text-secondary-muted">Active Projects</Text>
            <Headline level={3}>
              <NumericFormat value={5} />
            </Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text color="text-secondary-muted">Upcoming Deadlines</Text>
            <Headline level={3}>
              <NumericFormat value={8} />
            </Headline>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Inline space={1} alignY="center">
              <Text color="text-secondary-muted">Hours This Week</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" size="small" aria-label="Hours info">
                  ⓘ
                </Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={3}>
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
          <Table.Body>
            {recentActivity.map(a => (
              <Table.Row key={a.id}>
                <Table.Cell>{a.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={activityVariant[a.action]}>{a.action}</Badge>
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
        <SectionMessage.Title>Sprint 14</SectionMessage.Title>
        <SectionMessage.Content>
          Sprint 14 ends in 3 days. Review the project board for outstanding
          tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  const renderMembersTable = () => (
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
              <Button variant="ghost" onPress={() => setSelectedMemberId(m.id)}>
                {m.name}
              </Button>
            </Table.Cell>
            <Table.Cell>
              <Badge variant="info">{m.role}</Badge>
            </Table.Cell>
            <Table.Cell>{m.email}</Table.Cell>
            <Table.Cell>
              <Badge variant={memberStatusVariant[m.status]}>{m.status}</Badge>
            </Table.Cell>
            <Table.Cell>
              <DateFormat value={m.joined} dateStyle="medium" />
            </Table.Cell>
            <Table.Cell>
              <ActionMenu size="small">
                <Menu.Item id="edit" onAction={() => openEditMember(m)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  id="remove"
                  variant="destructive"
                  onAction={() => setMemberToRemove(m)}
                >
                  Remove
                </Menu.Item>
              </ActionMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  const renderMembersCards = () => (
    <Tiles space={4} tilesWidth="260px" stretch equalHeight>
      {filteredMembers.map(m => (
        <Card key={m.id}>
          <Stack space={3}>
            <Button variant="ghost" onPress={() => setSelectedMemberId(m.id)}>
              <Headline level={4}>{m.name}</Headline>
            </Button>
            <Inline space={2} alignY="center">
              <Badge variant="info">{m.role}</Badge>
              <Badge variant={memberStatusVariant[m.status]}>{m.status}</Badge>
            </Inline>
            <Text color="text-secondary-muted">{m.email}</Text>
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
        </Card>
      ))}
    </Tiles>
  );

  const renderMemberDetail = () =>
    selectedMember ? (
      <Card>
        <Stack space={4}>
          <Inline alignX="between" alignY="center" space={2}>
            <Headline level={3}>{selectedMember.name}</Headline>
            <Button
              variant="ghost"
              size="small"
              aria-label="Close details"
              onPress={() => setSelectedMemberId(null)}
            >
              ✕
            </Button>
          </Inline>
          <Divider />
          <Stack space={1}>
            <Text weight="bold">Role</Text>
            <Badge variant="info">{selectedMember.role}</Badge>
          </Stack>
          <Stack space={1}>
            <Text weight="bold">Status</Text>
            <Badge variant={memberStatusVariant[selectedMember.status]}>
              {selectedMember.status}
            </Badge>
          </Stack>
          <Stack space={1}>
            <Text weight="bold">Email</Text>
            <Text>{selectedMember.email}</Text>
          </Stack>
          <Stack space={1}>
            <Text weight="bold">Joined</Text>
            <Text>
              <DateFormat value={selectedMember.joined} dateStyle="long" />
            </Text>
          </Stack>
          <Stack space={1}>
            <Text weight="bold">Bio</Text>
            <Text>{selectedMember.bio}</Text>
          </Stack>
          <Inline space={2}>
            <Button
              size="small"
              variant="primary"
              onPress={() => openEditMember(selectedMember)}
            >
              Edit
            </Button>
          </Inline>
        </Stack>
      </Card>
    ) : null;

  const renderMembersMain = () => (
    <Stack space={5}>
      <Headline level={2}>Team Members</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search members"
          placeholder="Search by name"
          value={memberSearch}
          onChange={setMemberSearch}
        />
        <Select
          aria-label="Filter by role"
          selectedKey={roleFilter}
          onSelectionChange={k => setRoleFilter(String(k))}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
        </Select>
        <ToggleButton.Group
          selectionMode="single"
          disallowEmptySelection
          aria-label="View mode"
          selectedKeys={[viewMode]}
          onSelectionChange={keys => {
            const v = Array.from(keys as Set<string>)[0];
            if (v) setViewMode(v as 'table' | 'cards');
          }}
        >
          <ToggleButton id="table">Table</ToggleButton>
          <ToggleButton id="cards">Cards</ToggleButton>
        </ToggleButton.Group>
        <Button variant="primary" onPress={openAddMember}>
          Add Member
        </Button>
      </Inline>
      {viewMode === 'table' ? renderMembersTable() : renderMembersCards()}
    </Stack>
  );

  const renderMembers = () =>
    selectedMember ? (
      <Columns columns={[2, 1]} space={6} collapseAt="60em">
        {renderMembersMain()}
        {renderMemberDetail()}
      </Columns>
    ) : (
      renderMembersMain()
    );

  const renderProjects = () => (
    <Stack space={5}>
      <Headline level={2}>Projects</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects"
          value={projectSearch}
          onChange={setProjectSearch}
        />
        <Button
          variant="primary"
          onPress={() =>
            addToast({ title: 'New project', variant: 'info' })
          }
        >
          New Project
        </Button>
      </Inline>
      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={projectSelected}
        onSelectionChange={setProjectSelected}
        actionBar={() => (
          <ActionBar>
            <ActionBar.Button onPress={archiveSelected}>
              Archive Selected
            </ActionBar.Button>
            <ActionBar.Button onPress={exportSelected}>
              Export
            </ActionBar.Button>
          </ActionBar>
        )}
      >
        <Table.Header>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column alignX="right">Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column alignX="right">Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredProjects.map(p => (
            <Table.Row key={p.id} id={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell alignX="right">
                <NumericFormat value={p.members} />
              </Table.Cell>
              <Table.Cell>
                <DateFormat value={p.deadline} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell alignX="right">{p.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={projectStatusVariant[p.status]}>
                  {p.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space={6}>
      <Headline level={2}>Team Calendar</Headline>
      <Calendar aria-label="Team calendar" />
      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Table aria-label="Upcoming events">
          <Table.Header>
            <Table.Column rowHeader>Date</Table.Column>
            <Table.Column>Event</Table.Column>
            <Table.Column>Type</Table.Column>
          </Table.Header>
          <Table.Body>
            {upcomingEvents.map(ev => (
              <Table.Row key={ev.id}>
                <Table.Cell>
                  <DateFormat value={ev.date} dateStyle="medium" />
                </Table.Cell>
                <Table.Cell>{ev.name}</Table.Cell>
                <Table.Cell>
                  <Badge variant={eventVariant[ev.type]}>{ev.type}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>
    </Stack>
  );

  const renderFiles = () => (
    <Stack space={5}>
      <Headline level={2}>Shared Files</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search files"
          placeholder="Search files"
          value={fileSearch}
          onChange={setFileSearch}
        />
        <Select
          aria-label="Filter by file type"
          selectedKey={fileTypeFilter}
          onSelectionChange={k => setFileTypeFilter(String(k))}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
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
        <Table.Body>
          {filteredFiles.map(f => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>
                <Badge>{f.type}</Badge>
              </Table.Cell>
              <Table.Cell alignX="right">
                <NumericFormat
                  value={f.sizeMB}
                  minimumFractionDigits={1}
                  maximumFractionDigits={1}
                />{' '}
                MB
              </Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={f.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu size="small">
                  <Menu.Item
                    id="download"
                    onAction={() => handleFileAction(f, 'download')}
                  >
                    Download
                  </Menu.Item>
                  <Menu.Item
                    id="rename"
                    onAction={() => handleFileAction(f, 'rename')}
                  >
                    Rename
                  </Menu.Item>
                  <Menu.Item
                    id="delete"
                    variant="destructive"
                    onAction={() => handleFileAction(f, 'delete')}
                  >
                    Delete
                  </Menu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={5}>
      <Headline level={2}>Team Settings</Headline>
      <Tabs aria-label="Team settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Inset space={4}>
            <Stack space={4} alignX="left">
              <TextField
                label="Team Name"
                value={teamNameDraft}
                onChange={setTeamNameDraft}
                width="1/2"
              />
              <TextArea
                label="Description"
                value={descDraft}
                onChange={setDescDraft}
                width="1/2"
              />
              <Select
                label="Default Timezone"
                selectedKey={timezone}
                onSelectionChange={k => setTimezone(String(k))}
                width="1/2"
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={dateFormat}
                onSelectionChange={k => setDateFormat(String(k))}
                width="1/2"
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" onPress={saveGeneral}>
                Save
              </Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Inset space={4}>
            <Stack space={5} alignX="left">
              {NOTIFICATION_DEFS.map(def => (
                <Stack space={1} key={def.id}>
                  <Switch
                    label={def.label}
                    selected={notifications[def.id]}
                    onChange={val =>
                      setNotifications(prev => ({ ...prev, [def.id]: val }))
                    }
                  />
                  <Text color="text-secondary-muted">{def.description}</Text>
                </Stack>
              ))}
              <Button variant="primary" onPress={savePreferences}>
                Save Preferences
              </Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Inset space={4}>
            <Tiles space={4} tilesWidth="240px" stretch equalHeight>
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
              ].map(intg => {
                const connected = integrations[intg.key];
                return (
                  <Card key={intg.key}>
                    <Stack space={3}>
                      <Inline space={2} alignY="center" alignX="between">
                        <Headline level={4}>{intg.name}</Headline>
                        <Badge variant={connected ? 'success' : 'default'}>
                          {connected ? 'Connected' : 'Not connected'}
                        </Badge>
                      </Inline>
                      <Text color="text-secondary-muted">
                        {intg.description}
                      </Text>
                      {connected ? (
                        <Button
                          variant="secondary"
                          onPress={() =>
                            setIntegrationToDisconnect(intg.key)
                          }
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onPress={() =>
                            setIntegrations(prev => ({
                              ...prev,
                              [intg.key]: true,
                            }))
                          }
                        >
                          Connect
                        </Button>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Tiles>
          </Inset>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (currentPath) {
      case '/members':
        return renderMembers();
      case '/projects':
        return renderProjects();
      case '/calendar':
        return renderCalendar();
      case '/files':
        return renderFiles();
      case '/settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const disconnectName = integrationToDisconnect
    ? integrationToDisconnect.charAt(0).toUpperCase() +
      integrationToDisconnect.slice(1)
    : '';

  /* ---------------------------------------------------------------- */
  /* render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <RouterProvider navigate={setCurrentPath}>
      <ToastProvider position="bottom-right" />
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="lg">
                {teamName}
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav current={currentPath}>
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
                <Breadcrumbs.Item href={currentPath}>
                  {PAGES[currentPath] ?? 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User actions">
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={key =>
                      addToast({
                        title: `${String(key)} selected`,
                        variant: 'info',
                      })
                    }
                  >
                    <Menu.Item id="profile">Profile</Menu.Item>
                    <Menu.Item id="preferences">Preferences</Menu.Item>
                    <Menu.Item id="signout">Sign Out</Menu.Item>
                  </Menu>
                  <Tooltip>Account settings</Tooltip>
                </Tooltip.Trigger>
                <ContextualHelp>
                  <ContextualHelp.Title>Navigation help</ContextualHelp.Title>
                  <ContextualHelp.Content>
                    Use the sidebar to navigate between sections.
                  </ContextualHelp.Content>
                </ContextualHelp>
              </Inline>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>{renderPage()}</Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      {/* Add / Edit member dialog */}
      <Dialog
        size="small"
        open={memberDialog.open}
        onOpenChange={open => {
          if (!open) closeMemberDialog();
        }}
      >
        <Dialog.Title>
          {memberDialog.mode === 'add' ? 'Add Member' : 'Edit Member'}
        </Dialog.Title>
        <Dialog.Content>
          <Stack space={4}>
            <TextField
              label="Full Name"
              value={formName}
              onChange={setFormName}
              required
              error={!!formErrors.name}
              errorMessage={formErrors.name}
            />
            <TextField
              label="Email"
              type="email"
              value={formEmail}
              onChange={setFormEmail}
              required
              error={!!formErrors.email}
              errorMessage={formErrors.email}
            />
            <Select
              label="Role"
              selectedKey={formRole}
              onSelectionChange={k => setFormRole(String(k) as Role)}
            >
              <Select.Option id="Developer">Developer</Select.Option>
              <Select.Option id="Designer">Designer</Select.Option>
              <Select.Option id="Manager">Manager</Select.Option>
              <Select.Option id="QA">QA</Select.Option>
            </Select>
            <DatePicker
              label="Start Date"
              value={formStartDate}
              onChange={setFormStartDate}
            />
            <TextArea label="Bio" value={formBio} onChange={setFormBio} />
          </Stack>
        </Dialog.Content>
        <Dialog.Actions>
          <Button slot="close">Cancel</Button>
          <Button variant="primary" onPress={submitMember}>
            {memberDialog.mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* Remove member confirmation */}
      <Dialog
        role="alertdialog"
        size="xsmall"
        open={!!memberToRemove}
        onOpenChange={open => {
          if (!open) setMemberToRemove(null);
        }}
      >
        <Dialog.Title>Remove member?</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to remove {memberToRemove?.name}? This action
            cannot be undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button slot="close">Cancel</Button>
          <Button variant="destructive" onPress={confirmRemoveMember}>
            Remove
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* Disconnect integration confirmation */}
      <Dialog
        role="alertdialog"
        size="xsmall"
        open={!!integrationToDisconnect}
        onOpenChange={open => {
          if (!open) setIntegrationToDisconnect(null);
        }}
      >
        <Dialog.Title>Disconnect {disconnectName}?</Dialog.Title>
        <Dialog.Content>
          <Text>
            Disconnecting {disconnectName} will stop syncing data. You can
            reconnect at any time.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button slot="close">Cancel</Button>
          <Button variant="destructive" onPress={confirmDisconnect}>
            Disconnect
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* Upload files dialog */}
      <Dialog
        size="small"
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      >
        <Dialog.Title>Upload Files</Dialog.Title>
        <Dialog.Content>
          <Stack space={4}>
            <FileField label="Files" multiple />
            <TextField label="Description" />
            <Select label="Category" defaultSelectedKey="Documents">
              <Select.Option id="Documents">Documents</Select.Option>
              <Select.Option id="Images">Images</Select.Option>
              <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
            </Select>
          </Stack>
        </Dialog.Content>
        <Dialog.Actions>
          <Button slot="close">Cancel</Button>
          <Button variant="primary" onPress={handleUpload}>
            Upload
          </Button>
        </Dialog.Actions>
      </Dialog>
    </RouterProvider>
  );
};

export default TestApp;
