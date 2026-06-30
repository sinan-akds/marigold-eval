import { useState } from 'react';
import {
  ActionBar,
  ActionMenu,
  AppLayout,
  Aside,
  Badge,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  ContextualHelp,
  DateFormat,
  Dialog,
  Divider,
  FileField,
  Headline,
  Inline,
  Inset,
  Menu,
  NumericFormat,
  RouterProvider,
  SearchField,
  SectionMessage,
  Select,
  Sidebar,
  Split,
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

// ── Types ──────────────────────────────────────────────────────────────────────
type MemberRole = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';
type ProjectStatus = 'Active' | 'On Hold' | 'Completed';
type FileType = 'Documents' | 'Images' | 'Spreadsheets';

interface Member {
  id: string;
  name: string;
  role: MemberRole;
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
  status: ProjectStatus;
}

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedBy: string;
  date: Date;
}

// ── Initial data ───────────────────────────────────────────────────────────────
const INIT_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.com', status: 'Active', joined: new Date(2023, 2, 15), bio: 'Frontend developer with 5 years of React experience.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.com', status: 'Active', joined: new Date(2023, 5, 1), bio: 'UX/UI designer passionate about user-centered design.' },
  { id: '3', name: 'Carol White', role: 'Manager', email: 'carol@teamhub.com', status: 'Active', joined: new Date(2022, 11, 10), bio: 'Project manager with agile methodology expertise.' },
  { id: '4', name: 'David Brown', role: 'Developer', email: 'david@teamhub.com', status: 'On Leave', joined: new Date(2023, 8, 20), bio: 'Backend engineer specializing in distributed systems.' },
  { id: '5', name: 'Eve Davis', role: 'Designer', email: 'eve@teamhub.com', status: 'Active', joined: new Date(2024, 0, 8), bio: 'Graphic designer with brand identity focus.' },
  { id: '6', name: 'Frank Miller', role: 'Developer', email: 'frank@teamhub.com', status: 'Active', joined: new Date(2024, 3, 22), bio: 'Full-stack developer and open source contributor.' },
];

const INIT_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: new Date(2026, 7, 31), progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App', lead: 'Bob Smith', members: 3, deadline: new Date(2026, 9, 15), progress: 40, status: 'Active' },
  { id: '3', name: 'API Integration', lead: 'Carol White', members: 2, deadline: new Date(2026, 6, 10), progress: 100, status: 'Completed' },
  { id: '4', name: 'Analytics Dashboard', lead: 'David Brown', members: 5, deadline: new Date(2026, 8, 5), progress: 20, status: 'On Hold' },
  { id: '5', name: 'DevOps Pipeline', lead: 'Frank Miller', members: 3, deadline: new Date(2026, 11, 31), progress: 60, status: 'Active' },
];

const INIT_FILES: FileItem[] = [
  { id: '1', name: 'Design Guidelines.pdf', type: 'Documents', size: 2400000, uploadedBy: 'Bob Smith', date: new Date(2026, 4, 10) },
  { id: '2', name: 'Team Photo.jpg', type: 'Images', size: 5100000, uploadedBy: 'Alice Johnson', date: new Date(2026, 5, 2) },
  { id: '3', name: 'Q2 Report.xlsx', type: 'Spreadsheets', size: 890000, uploadedBy: 'Carol White', date: new Date(2026, 5, 15) },
  { id: '4', name: 'Meeting Notes.pdf', type: 'Documents', size: 320000, uploadedBy: 'Frank Miller', date: new Date(2026, 5, 20) },
  { id: '5', name: 'Logo.png', type: 'Images', size: 1200000, uploadedBy: 'Eve Davis', date: new Date(2026, 5, 25) },
];

const RECENT_ACTIVITY = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'Website Redesign', date: new Date(2026, 5, 25) },
  { id: 'a2', member: 'Bob Smith', action: 'Review', project: 'Mobile App', date: new Date(2026, 5, 24) },
  { id: 'a3', member: 'Carol White', action: 'Deploy', project: 'API Integration', date: new Date(2026, 5, 23) },
  { id: 'a4', member: 'Frank Miller', action: 'Commit', project: 'DevOps Pipeline', date: new Date(2026, 5, 22) },
  { id: 'a5', member: 'Eve Davis', action: 'Review', project: 'Analytics Dashboard', date: new Date(2026, 5, 21) },
];

const UPCOMING_EVENTS = [
  { id: 'e1', date: new Date(2026, 5, 30), name: 'Sprint Planning', type: 'Meeting' },
  { id: 'e2', date: new Date(2026, 6, 2), name: 'Q3 Kickoff', type: 'Meeting' },
  { id: 'e3', date: new Date(2026, 6, 10), name: 'Design Review Deadline', type: 'Deadline' },
  { id: 'e4', date: new Date(2026, 6, 15), name: 'Team Lunch', type: 'Social' },
];

const PAGE_NAMES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function memberStatusVariant(status: MemberStatus): 'success' | 'warning' {
  return status === 'Active' ? 'success' : 'warning';
}

function projectStatusVariant(status: ProjectStatus): 'success' | 'warning' | 'info' {
  if (status === 'Active') return 'success';
  if (status === 'On Hold') return 'warning';
  return 'info';
}

function actionVariant(action: string): 'info' | 'warning' | 'success' {
  if (action === 'Commit') return 'info';
  if (action === 'Review') return 'warning';
  return 'success';
}

function eventTypeVariant(type: string): 'info' | 'warning' | 'success' {
  if (type === 'Meeting') return 'info';
  if (type === 'Deadline') return 'warning';
  return 'success';
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${Math.round(bytes / 1_000)} KB`;
  return `${bytes} B`;
}

// ── Inner app (needs useToast / useConfirmation inside provider) ───────────────
interface TeamHubAppProps {
  currentPath: string;
}

function TeamHubApp({ currentPath }: TeamHubAppProps) {
  const { addToast } = useToast();
  const confirm = useConfirmation();

  // ── Shared state ──
  const [members, setMembers] = useState<Member[]>(INIT_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(INIT_PROJECTS);
  const [files, setFiles] = useState<FileItem[]>(INIT_FILES);
  const [teamName, setTeamName] = useState('TeamHub');

  // ── Members ──
  const [memberView, setMemberView] = useState<'table' | 'cards'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [mName, setMName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mRole, setMRole] = useState<string>('Developer');
  const [mStartDate, setMStartDate] = useState('');
  const [mBio, setMBio] = useState('');

  // ── Projects ──
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectKeys, setSelectedProjectKeys] = useState<Set<string>>(new Set());
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLead, setNewProjectLead] = useState('');

  // ── Files ──
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('Documents');

  // ── Settings ──
  const [settingsName, setSettingsName] = useState('TeamHub');
  const [settingsDesc, setSettingsDesc] = useState('Our collaborative team workspace.');
  const [settingsTimezone, setSettingsTimezone] = useState<string>('UTC');
  const [settingsDateFormat, setSettingsDateFormat] = useState<string>('MM/DD/YYYY');
  const [notif, setNotif] = useState({
    newMember: true,
    projectDeadline: true,
    weeklyDigest: false,
    mentions: true,
    calendarReminders: true,
  });
  const [integrations, setIntegrations] = useState({ slack: true, github: false, jira: false });

  // ── Filtered data ──
  const filteredMembers = members.filter(m => {
    const nameOk = m.name.toLowerCase().includes(memberSearch.toLowerCase());
    const roleOk = roleFilter === 'all' || m.role === roleFilter;
    return nameOk && roleOk;
  });

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredFiles = files.filter(f => {
    const nameOk = f.name.toLowerCase().includes(fileSearch.toLowerCase());
    const typeOk = fileTypeFilter === 'All' || f.type === fileTypeFilter;
    return nameOk && typeOk;
  });

  // ── Member handlers ──
  const openAddMember = () => {
    setEditingMember(null);
    setMName(''); setMEmail(''); setMRole('Developer'); setMStartDate(''); setMBio('');
    setMemberDialogOpen(true);
  };

  const openEditMember = (m: Member) => {
    setEditingMember(m);
    setMName(m.name); setMEmail(m.email); setMRole(m.role);
    setMStartDate(m.joined.toISOString().split('T')[0]);
    setMBio(m.bio);
    setMemberDialogOpen(true);
  };

  const saveMember = (close: () => void) => {
    if (!mName.trim() || !mEmail.trim()) return;
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id
        ? { ...m, name: mName, email: mEmail, role: mRole as MemberRole, bio: mBio }
        : m
      ));
      if (selectedMember?.id === editingMember.id) {
        setSelectedMember(prev => prev ? { ...prev, name: mName, email: mEmail, role: mRole as MemberRole, bio: mBio } : null);
      }
    } else {
      const newMember: Member = {
        id: String(Date.now()),
        name: mName,
        email: mEmail,
        role: mRole as MemberRole,
        status: 'Active',
        joined: mStartDate ? new Date(mStartDate) : new Date(),
        bio: mBio,
      };
      setMembers(prev => [...prev, newMember]);
    }
    close();
  };

  const removeMember = async (id: string) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Remove Member',
        content: 'Are you sure you want to remove this member? This action cannot be undone.',
        confirmationLabel: 'Remove',
      });
      setMembers(prev => prev.filter(m => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch { /* cancelled */ }
  };

  // ── Project handlers ──
  const handleArchiveProjects = () => {
    setProjects(prev => prev.filter(p => !selectedProjectKeys.has(p.id)));
    setSelectedProjectKeys(new Set());
  };

  const saveNewProject = (close: () => void) => {
    if (!newProjectName.trim()) return;
    setProjects(prev => [...prev, {
      id: String(Date.now()),
      name: newProjectName,
      lead: newProjectLead || 'Unassigned',
      members: 1,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      progress: 0,
      status: 'Active',
    }]);
    setNewProjectName(''); setNewProjectLead('');
    close();
  };

  // ── File handlers ──
  const deleteFile = async (id: string) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Delete File',
        content: 'Are you sure you want to delete this file?',
        confirmationLabel: 'Delete',
      });
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch { /* cancelled */ }
  };

  const handleUpload = (close: () => void) => {
    setFiles(prev => [...prev, {
      id: String(Date.now()),
      name: `Upload-${Date.now()}.${uploadCategory === 'Images' ? 'jpg' : uploadCategory === 'Spreadsheets' ? 'xlsx' : 'pdf'}`,
      type: uploadCategory as FileType,
      size: Math.floor(Math.random() * 5_000_000) + 100_000,
      uploadedBy: 'John Doe',
      date: new Date(),
    }]);
    setUploadDesc(''); setUploadCategory('Documents');
    close();
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  // ── Settings handlers ──
  const saveGeneralSettings = () => {
    setTeamName(settingsName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const disconnectIntegration = async (name: keyof typeof integrations) => {
    try {
      await confirm({
        variant: 'destructive',
        title: `Disconnect ${name.charAt(0).toUpperCase() + name.slice(1)}`,
        content: `Are you sure you want to disconnect ${name}?`,
        confirmationLabel: 'Disconnect',
      });
      setIntegrations(prev => ({ ...prev, [name]: false }));
    } catch { /* cancelled */ }
  };

  // ── Page renderers ─────────────────────────────────────────────────────────

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Tiles tilesWidth="220px" space={4} stretch>
        <Card>
          <Inset space={4}>
            <Stack space={1}>
              <Text size="sm">Members</Text>
              <Headline level={2}>{members.length}</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={1}>
              <Text size="sm">Active Projects</Text>
              <Headline level={2}>5</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={1}>
              <Text size="sm">Upcoming Deadlines</Text>
              <Headline level={2}>8</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={1}>
              <Inline space={1} alignY="center">
                <Text size="sm">Hours This Week</Text>
                <Tooltip.Trigger>
                  <Button variant="icon" aria-label="Hours info">i</Button>
                  <Tooltip>Aggregate of all team members.</Tooltip>
                </Tooltip.Trigger>
              </Inline>
              <Headline level={2}><NumericFormat value={342} /></Headline>
            </Stack>
          </Inset>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity" selectionMode="none">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {RECENT_ACTIVITY.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={actionVariant(row.action)}>{row.action}</Badge>
                </Table.Cell>
                <Table.Cell>{row.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={row.date} dateStyle="medium" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint 14 ending soon</SectionMessage.Title>
        <SectionMessage.Content>
          Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  const renderMembers = () => {
    const toolbar = (
      <Inline space={2} alignY="center">
        <SearchField
          aria-label="Search members"
          placeholder="Search members..."
          value={memberSearch}
          onChange={setMemberSearch}
        />
        <Select
          aria-label="Filter by role"
          selectedKey={roleFilter}
          onSelectionChange={k => setRoleFilter(String(k))}
          width="fit"
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Inline space={1}>
          <Button
            variant={memberView === 'table' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setMemberView('table')}
          >
            Table
          </Button>
          <Button
            variant={memberView === 'cards' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setMemberView('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Split />
        <Button variant="primary" onPress={openAddMember}>Add Member</Button>
      </Inline>
    );

    const mainContent = (
      <Stack space={4}>
        <Headline level={1}>Team Members</Headline>
        {toolbar}
        {memberView === 'table' ? (
          <Table
            aria-label="Team Members"
            selectionMode="single"
            onSelectionChange={keys => {
              if (keys === 'all') return;
              const arr = [...keys];
              const id = arr[0];
              setSelectedMember(id ? (members.find(m => m.id === String(id)) ?? null) : null);
            }}
          >
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
                  <Table.Cell>{m.name}</Table.Cell>
                  <Table.Cell>{m.role}</Table.Cell>
                  <Table.Cell>{m.email}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={memberStatusVariant(m.status)}>{m.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <DateFormat value={m.joined} dateStyle="medium" />
                  </Table.Cell>
                  <Table.Cell>
                    <ActionMenu>
                      <ActionMenu.Item id="edit" onAction={() => openEditMember(m)}>Edit</ActionMenu.Item>
                      <ActionMenu.Item id="remove" variant="destructive" onAction={() => removeMember(m.id)}>Remove</ActionMenu.Item>
                    </ActionMenu>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <Tiles tilesWidth="280px" space={4} stretch>
            {filteredMembers.map(m => (
              <Card key={m.id}>
                <Inset space={4}>
                  <Stack space={3}>
                    <Stack space={1}>
                      <Text weight="bold">{m.name}</Text>
                      <Badge variant={memberStatusVariant(m.status)}>{m.role}</Badge>
                      <Text size="sm">{m.email}</Text>
                    </Stack>
                    <Inline space={2}>
                      <Button size="small" variant="secondary" onPress={() => setSelectedMember(m)}>Profile</Button>
                      <Button size="small" variant="secondary" onPress={() => addToast({ title: `Message sent to ${m.name}`, variant: 'success' })}>Message</Button>
                    </Inline>
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Tiles>
        )}
      </Stack>
    );

    if (selectedMember) {
      return (
        <Aside side="right" sideWidth="320px" space={4}>
          {mainContent}
          <Card>
            <Inset space={4}>
              <Stack space={3}>
                <Inline alignX="between" alignY="center">
                  <Headline level={2}>{selectedMember.name}</Headline>
                  <Button size="small" variant="secondary" onPress={() => setSelectedMember(null)}>Close</Button>
                </Inline>
                <Divider />
                <Stack space={2}>
                  <Text size="sm"><Text weight="bold">Role: </Text>{selectedMember.role}</Text>
                  <Text size="sm"><Text weight="bold">Email: </Text>{selectedMember.email}</Text>
                  <Text size="sm"><Text weight="bold">Status: </Text>
                    <Badge variant={memberStatusVariant(selectedMember.status)}>{selectedMember.status}</Badge>
                  </Text>
                  <Text size="sm"><Text weight="bold">Joined: </Text>
                    <DateFormat value={selectedMember.joined} dateStyle="long" />
                  </Text>
                  <Text size="sm"><Text weight="bold">Bio: </Text>{selectedMember.bio}</Text>
                </Stack>
                <Inline space={2}>
                  <Button size="small" variant="primary" onPress={() => openEditMember(selectedMember)}>Edit</Button>
                  <Button size="small" variant="secondary" onPress={() => removeMember(selectedMember.id)}>Remove</Button>
                </Inline>
              </Stack>
            </Inset>
          </Card>
        </Aside>
      );
    }

    return mainContent;
  };

  const renderProjects = () => (
    <Stack space={4}>
      <Headline level={1}>Projects</Headline>
      <Inline space={2} alignY="center">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects..."
          value={projectSearch}
          onChange={setProjectSearch}
        />
        <Split />
        <Button variant="primary" onPress={() => setNewProjectOpen(true)}>New Project</Button>
      </Inline>

      {selectedProjectKeys.size > 0 && (
        <ActionBar>
          <ActionBar.Button onPress={handleArchiveProjects}>Archive Selected</ActionBar.Button>
          <ActionBar.Button onPress={() => { addToast({ title: 'Projects exported.', variant: 'success' }); setSelectedProjectKeys(new Set()); }}>Export</ActionBar.Button>
        </ActionBar>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedProjectKeys}
        onSelectionChange={keys => {
          if (keys === 'all') {
            setSelectedProjectKeys(new Set(filteredProjects.map(p => p.id)));
          } else {
            setSelectedProjectKeys(new Set([...keys].map(String)));
          }
        }}
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
            <Table.Row key={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>
                <DateFormat value={p.deadline} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>{p.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={projectStatusVariant(p.status)}>{p.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        closeButton
        size="small"
      >
        {({ close }) => (
          <>
            <Dialog.Title>New Project</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Project Name"
                  required
                  value={newProjectName}
                  onChange={setNewProjectName}
                />
                <TextField
                  label="Lead"
                  value={newProjectLead}
                  onChange={setNewProjectLead}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => saveNewProject(close)}>Create</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Calendar aria-label="Team Calendar" />
      <Stack space={3}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={2}>
          {UPCOMING_EVENTS.map(ev => (
            <Card key={ev.id}>
              <Inset space={3}>
                <Inline space={4} alignY="center">
                  <Text weight="bold">
                    <DateFormat value={ev.date} dateStyle="medium" />
                  </Text>
                  <Text>{ev.name}</Text>
                  <Badge variant={eventTypeVariant(ev.type)}>{ev.type}</Badge>
                </Inline>
              </Inset>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderFiles = () => (
    <Stack space={4}>
      <Headline level={1}>Shared Files</Headline>
      <Inline space={2} alignY="center">
        <SearchField
          aria-label="Search files"
          placeholder="Search files..."
          value={fileSearch}
          onChange={setFileSearch}
        />
        <Select
          aria-label="Filter by type"
          selectedKey={fileTypeFilter}
          onSelectionChange={k => setFileTypeFilter(String(k))}
          width="fit"
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Split />
        <Button variant="primary" onPress={() => setUploadOpen(true)}>Upload</Button>
      </Inline>

      <Table aria-label="Shared Files" selectionMode="none">
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
              <Table.Cell>{formatFileSize(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={f.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <ActionMenu.Item id="download" onAction={() => addToast({ title: `Downloading ${f.name}`, variant: 'info' })}>Download</ActionMenu.Item>
                  <ActionMenu.Item id="rename" onAction={() => addToast({ title: 'Rename coming soon', variant: 'info' })}>Rename</ActionMenu.Item>
                  <ActionMenu.Item id="delete" variant="destructive" onAction={() => deleteFile(f.id)}>Delete</ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        closeButton
        size="small"
      >
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <FileField label="Select Files" multiple />
                <TextField
                  label="Description"
                  value={uploadDesc}
                  onChange={setUploadDesc}
                />
                <Select
                  label="Category"
                  selectedKey={uploadCategory}
                  onSelectionChange={k => setUploadCategory(String(k))}
                >
                  <Select.Option id="Documents">Documents</Select.Option>
                  <Select.Option id="Images">Images</Select.Option>
                  <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => handleUpload(close)}>Upload</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={4}>
      <Headline level={1}>Team Settings</Headline>
      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Inset spaceY={4}>
            <Stack space={4}>
              <TextField
                label="Team Name"
                value={settingsName}
                onChange={setSettingsName}
              />
              <TextArea
                label="Description"
                value={settingsDesc}
                onChange={setSettingsDesc}
              />
              <Select
                label="Default Timezone"
                selectedKey={settingsTimezone}
                onSelectionChange={k => setSettingsTimezone(String(k))}
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={settingsDateFormat}
                onSelectionChange={k => setSettingsDateFormat(String(k))}
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" onPress={saveGeneralSettings}>Save</Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Inset spaceY={4}>
            <Stack space={4}>
              {[
                { key: 'newMember' as const, label: 'New member joins', desc: 'Get notified when someone joins the team' },
                { key: 'projectDeadline' as const, label: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
                { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of team activity every Monday' },
                { key: 'mentions' as const, label: 'Mention notifications', desc: 'When someone mentions you in a comment' },
                { key: 'calendarReminders' as const, label: 'Calendar reminders', desc: '15 minutes before scheduled events' },
              ].map(({ key, label, desc }) => (
                <Card key={key}>
                  <Inset space={3}>
                    <Inline alignX="between" alignY="center">
                      <Stack space={1}>
                        <Text weight="bold">{label}</Text>
                        <Text size="sm">{desc}</Text>
                      </Stack>
                      <Switch
                        aria-label={label}
                        selected={notif[key]}
                        onChange={v => setNotif(p => ({ ...p, [key]: v }))}
                      />
                    </Inline>
                  </Inset>
                </Card>
              ))}
              <Button variant="primary" onPress={() => addToast({ title: 'Notification preferences saved.', variant: 'success' })}>
                Save Preferences
              </Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Inset spaceY={4}>
            <Tiles tilesWidth="240px" space={4} stretch>
              {([
                { key: 'slack' as const, name: 'Slack', desc: 'Team messaging and collaboration.' },
                { key: 'github' as const, name: 'GitHub', desc: 'Code repository and version control.' },
                { key: 'jira' as const, name: 'Jira', desc: 'Project and issue tracking.' },
              ] as const).map(({ key, name, desc }) => (
                <Card key={key}>
                  <Inset space={4}>
                    <Stack space={3}>
                      <Inline alignX="between" alignY="center">
                        <Text weight="bold">{name}</Text>
                        <Badge variant={integrations[key] ? 'success' : 'default'}>
                          {integrations[key] ? 'Connected' : 'Not connected'}
                        </Badge>
                      </Inline>
                      <Text size="sm">{desc}</Text>
                      {integrations[key] ? (
                        <Button
                          variant="secondary"
                          onPress={() => disconnectIntegration(key)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onPress={() => setIntegrations(p => ({ ...p, [key]: true }))}
                        >
                          Connect
                        </Button>
                      )}
                    </Stack>
                  </Inset>
                </Card>
              ))}
            </Tiles>
          </Inset>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (currentPath) {
      case '/members': return renderMembers();
      case '/projects': return renderProjects();
      case '/calendar': return renderCalendar();
      case '/files': return renderFiles();
      case '/settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  const pageName = PAGE_NAMES[currentPath] ?? 'Dashboard';

  return (
    <>
      {/* Member add/edit dialog */}
      <Dialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        closeButton
        size="small"
      >
        {({ close }) => (
          <>
            <Dialog.Title>{editingMember ? 'Edit Member' : 'Add Member'}</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Full Name"
                  required
                  value={mName}
                  onChange={setMName}
                />
                <TextField
                  label="Email"
                  required
                  type="email"
                  value={mEmail}
                  onChange={setMEmail}
                />
                <Select
                  label="Role"
                  selectedKey={mRole}
                  onSelectionChange={k => setMRole(String(k))}
                >
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <TextField
                  label="Start Date"
                  type="date"
                  value={mStartDate}
                  onChange={setMStartDate}
                />
                <TextArea
                  label="Bio"
                  value={mBio}
                  onChange={setMBio}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => saveMember(close)}>
                {editingMember ? 'Update' : 'Add'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      <AppLayout>
        <AppLayout.Sidebar>
          <Sidebar.Header>
            <Text weight="bold">{teamName}</Text>
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
          <TopNavigation.Middle>
            <Breadcrumbs>
              <Breadcrumbs.Item href="/dashboard">{teamName}</Breadcrumbs.Item>
              <Breadcrumbs.Item href={currentPath}>{pageName}</Breadcrumbs.Item>
            </Breadcrumbs>
          </TopNavigation.Middle>
          <TopNavigation.End>
            <Inline space={2} alignY="center">
              <Tooltip.Trigger>
                <Menu
                  label="John Doe"
                  onAction={key => {
                    if (key === 'signout') addToast({ title: 'Signed out.', variant: 'info' });
                  }}
                >
                  <Menu.Item id="profile">Profile</Menu.Item>
                  <Menu.Item id="preferences">Preferences</Menu.Item>
                  <Menu.Item id="signout">Sign Out</Menu.Item>
                </Menu>
                <Tooltip>Account settings</Tooltip>
              </Tooltip.Trigger>
              <ContextualHelp>
                <ContextualHelp.Title>Help</ContextualHelp.Title>
                <ContextualHelp.Content>
                  <Text>Use the sidebar to navigate between sections.</Text>
                </ContextualHelp.Content>
              </ContextualHelp>
            </Inline>
          </TopNavigation.End>
        </AppLayout.Header>

        <AppLayout.Main>
          <Inset space={6}>
            {renderPage()}
          </Inset>
        </AppLayout.Main>
      </AppLayout>
    </>
  );
}

// ── Root export ────────────────────────────────────────────────────────────────
export default function TestApp() {
  const [currentPath, setCurrentPath] = useState('/dashboard');

  return (
    <>
      <ToastProvider position="bottom-right" />
      <RouterProvider navigate={setCurrentPath}>
        <Sidebar.Provider defaultOpen>
          <TeamHubApp currentPath={currentPath} />
        </Sidebar.Provider>
      </RouterProvider>
    </>
  );
}
