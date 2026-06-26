import { useState, useMemo } from 'react';
import {
  AppLayout,
  RouterProvider,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Tabs,
  Table,
  Badge,
  Card,
  Divider,
  Headline,
  Text,
  SectionMessage,
  Button,
  TextField,
  TextArea,
  Select,
  SearchField,
  Switch,
  FileField,
  Stack,
  Inline,
  Columns,
  Tiles,
  Inset,
  Dialog,
  Drawer,
  Menu,
  ActionMenu,
  Tooltip,
  ContextualHelp,
  ToastProvider,
  useToast,
  useConfirmation,
  DateFormat,
  NumericFormat,
} from '@marigold/components';

// ─── Types ───────────────────────────────────────────────────────────────────

type MemberRole = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';
type ProjectStatus = 'Active' | 'On Hold' | 'Completed';
type FileType = 'Document' | 'Image' | 'Spreadsheet';
type EventType = 'Meeting' | 'Deadline' | 'Social';

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
  memberCount: number;
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

interface CalendarEvent {
  id: string;
  date: Date;
  name: string;
  type: EventType;
}

interface MemberFormData {
  name: string;
  email: string;
  role: string;
  bio: string;
  startDate: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@team.com', status: 'Active', joined: new Date('2023-01-15'), bio: 'Full-stack developer with 8 years of experience in React and Node.js.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@team.com', status: 'Active', joined: new Date('2023-03-20'), bio: 'UX/UI designer specializing in design systems and accessibility.' },
  { id: '3', name: 'Carol White', role: 'Manager', email: 'carol@team.com', status: 'On Leave', joined: new Date('2022-11-10'), bio: 'Project manager with 10 years of agile and scrum expertise.' },
  { id: '4', name: 'David Lee', role: 'Developer', email: 'david@team.com', status: 'Active', joined: new Date('2023-06-01'), bio: 'Backend engineer focused on distributed systems and microservices.' },
  { id: '5', name: 'Emma Davis', role: 'QA', email: 'emma@team.com', status: 'Active', joined: new Date('2023-09-15'), bio: 'QA engineer with expertise in automated testing and CI/CD pipelines.' },
  { id: '6', name: 'Frank Miller', role: 'Designer', email: 'frank@team.com', status: 'Active', joined: new Date('2024-01-08'), bio: 'Product designer focused on user research and accessibility standards.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'TeamHub Platform', lead: 'Alice Johnson', memberCount: 5, deadline: new Date('2026-08-31'), progress: 65, status: 'Active' },
  { id: 'p2', name: 'Design System v2', lead: 'Bob Smith', memberCount: 3, deadline: new Date('2026-07-15'), progress: 80, status: 'Active' },
  { id: 'p3', name: 'API Gateway', lead: 'David Lee', memberCount: 4, deadline: new Date('2026-06-30'), progress: 100, status: 'Completed' },
  { id: 'p4', name: 'Mobile App', lead: 'Carol White', memberCount: 6, deadline: new Date('2026-09-01'), progress: 25, status: 'On Hold' },
  { id: 'p5', name: 'Analytics Dashboard', lead: 'Emma Davis', memberCount: 3, deadline: new Date('2026-07-31'), progress: 45, status: 'Active' },
];

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'Q2 Report.pdf', type: 'Document', size: 2400000, uploadedBy: 'Alice Johnson', date: new Date('2026-05-15') },
  { id: 'f2', name: 'Team Photo.png', type: 'Image', size: 5100000, uploadedBy: 'Bob Smith', date: new Date('2026-05-20') },
  { id: 'f3', name: 'Budget 2026.xlsx', type: 'Spreadsheet', size: 890000, uploadedBy: 'Carol White', date: new Date('2026-05-22') },
  { id: 'f4', name: 'Design Specs.pdf', type: 'Document', size: 3200000, uploadedBy: 'Bob Smith', date: new Date('2026-06-01') },
  { id: 'f5', name: 'Sprint Plan.xlsx', type: 'Spreadsheet', size: 450000, uploadedBy: 'Emma Davis', date: new Date('2026-06-10') },
];

const RECENT_ACTIVITIES = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit' as const, project: 'TeamHub Platform', date: new Date('2026-05-28') },
  { id: 'a2', member: 'Bob Smith', action: 'Review' as const, project: 'Design System v2', date: new Date('2026-05-27') },
  { id: 'a3', member: 'David Lee', action: 'Deploy' as const, project: 'API Gateway', date: new Date('2026-05-26') },
  { id: 'a4', member: 'Emma Davis', action: 'Commit' as const, project: 'Analytics Dashboard', date: new Date('2026-05-25') },
  { id: 'a5', member: 'Frank Miller', action: 'Review' as const, project: 'Design System v2', date: new Date('2026-05-24') },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', date: new Date('2026-07-02'), name: 'Sprint Planning', type: 'Meeting' },
  { id: 'e2', date: new Date('2026-07-10'), name: 'Design System Deadline', type: 'Deadline' },
  { id: 'e3', date: new Date('2026-07-15'), name: 'Team Lunch', type: 'Social' },
  { id: 'e4', date: new Date('2026-07-22'), name: 'Quarterly Review', type: 'Meeting' },
];

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _idCounter = 200;
function genId(): string { return String(++_idCounter); }

function generateCalendar(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

function actionVariant(action: string): 'info' | 'warning' | 'success' {
  if (action === 'Commit') return 'info';
  if (action === 'Review') return 'warning';
  return 'success';
}

function projectStatusVariant(status: ProjectStatus): 'success' | 'warning' | 'info' {
  if (status === 'Completed') return 'success';
  if (status === 'On Hold') return 'warning';
  return 'info';
}

function eventTypeVariant(type: EventType): 'info' | 'warning' | 'success' {
  if (type === 'Meeting') return 'info';
  if (type === 'Deadline') return 'warning';
  return 'success';
}

// ─── MemberFormFields (external component to avoid re-creation issues) ────────

interface MemberFormFieldsProps {
  form: MemberFormData;
  onChange: (field: keyof MemberFormData, value: string) => void;
}

function MemberFormFields({ form, onChange }: MemberFormFieldsProps) {
  return (
    <Stack space={4}>
      <TextField
        label="Full Name"
        value={form.name}
        onChange={(val) => onChange('name', val as string)}
        required
        autoFocus
      />
      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={(val) => onChange('email', val as string)}
        required
      />
      <Select
        label="Role"
        selectedKey={form.role}
        onSelectionChange={(key) => onChange('role', String(key))}
      >
        <Select.Option id="Developer">Developer</Select.Option>
        <Select.Option id="Designer">Designer</Select.Option>
        <Select.Option id="Manager">Manager</Select.Option>
        <Select.Option id="QA">QA</Select.Option>
      </Select>
      <TextField
        label="Start Date"
        type="date"
        value={form.startDate}
        onChange={(val) => onChange('startDate', val as string)}
      />
      <TextArea
        label="Bio"
        value={form.bio}
        onChange={(val) => onChange('bio', val as string)}
        rows={3}
      />
    </Stack>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

function TeamHubApp() {
  // Navigation
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // Global data
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);

  // Settings
  const [teamName, setTeamName] = useState('TeamHub');
  const [teamDesc, setTeamDesc] = useState('Our amazing team management platform.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Notifications
  const [notifNewMember, setNotifNewMember] = useState(true);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifMentions, setNotifMentions] = useState(true);
  const [notifCalendar, setNotifCalendar] = useState(true);
  const [notifSaved, setNotifSaved] = useState(false);

  // Integrations
  const [slackConnected, setSlackConnected] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);
  const [jiraConnected, setJiraConnected] = useState(false);

  // Members page
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'cards'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState<MemberFormData>({ name: '', email: '', role: 'Developer', bio: '', startDate: '' });

  // Projects page
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectKeys, setSelectedProjectKeys] = useState<Set<string>>(new Set());

  // Files page
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const { addToast } = useToast();
  const confirm = useConfirmation();

  // Derived data
  const filteredMembers = useMemo(() =>
    members.filter(m => {
      const matchSearch = !memberSearch || m.name.toLowerCase().includes(memberSearch.toLowerCase());
      const matchRole = memberRoleFilter === 'all' || m.role === memberRoleFilter;
      return matchSearch && matchRole;
    }),
    [members, memberSearch, memberRoleFilter]
  );

  const filteredProjects = useMemo(() =>
    projects.filter(p => !projectSearch || p.name.toLowerCase().includes(projectSearch.toLowerCase())),
    [projects, projectSearch]
  );

  const filteredFiles = useMemo(() =>
    files.filter(f => {
      const matchSearch = !fileSearch || f.name.toLowerCase().includes(fileSearch.toLowerCase());
      const matchType = fileTypeFilter === 'all' || f.type === fileTypeFilter;
      return matchSearch && matchType;
    }),
    [files, fileSearch, fileTypeFilter]
  );

  // Handlers
  const updateMemberForm = (field: keyof MemberFormData, value: string) =>
    setMemberForm(prev => ({ ...prev, [field]: value }));

  const openAddMember = () => {
    setMemberForm({ name: '', email: '', role: 'Developer', bio: '', startDate: '' });
    setAddMemberOpen(true);
  };

  const openEditMember = (member: Member) => {
    setMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      bio: member.bio,
      startDate: member.joined.toISOString().split('T')[0],
    });
    setEditMember(member);
  };

  const handleAddMember = () => {
    if (!memberForm.name || !memberForm.email) return;
    const m: Member = {
      id: genId(),
      name: memberForm.name,
      email: memberForm.email,
      role: memberForm.role as MemberRole,
      status: 'Active',
      joined: memberForm.startDate ? new Date(memberForm.startDate) : new Date(),
      bio: memberForm.bio,
    };
    setMembers(prev => [...prev, m]);
    setAddMemberOpen(false);
  };

  const handleUpdateMember = () => {
    if (!editMember) return;
    setMembers(prev => prev.map(m =>
      m.id === editMember.id
        ? { ...m, name: memberForm.name, email: memberForm.email, role: memberForm.role as MemberRole, bio: memberForm.bio }
        : m
    ));
    setEditMember(null);
  };

  const handleRemoveMember = async (member: Member) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Remove Member',
        content: `Are you sure you want to remove ${member.name} from the team? This cannot be undone.`,
        confirmationLabel: 'Remove',
      });
      setMembers(prev => prev.filter(m => m.id !== member.id));
    } catch {
      // user cancelled
    }
  };

  const handleArchiveProjects = () => {
    setProjects(prev => prev.filter(p => !selectedProjectKeys.has(p.id)));
    setSelectedProjectKeys(new Set());
  };

  const handleDeleteFile = async (file: FileItem) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Delete File',
        content: `Delete "${file.name}"? This action cannot be undone.`,
        confirmationLabel: 'Delete',
      });
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } catch {
      // user cancelled
    }
  };

  const handleUpload = (close: () => void) => {
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
    close();
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const handleDisconnect = async (name: string, setter: (v: boolean) => void) => {
    try {
      await confirm({
        title: `Disconnect ${name}`,
        content: `Disconnect ${name} from TeamHub?`,
        confirmationLabel: 'Disconnect',
      });
      setter(false);
    } catch { /* cancelled */ }
  };

  // Calendar
  const calYear = 2026;
  const calMonth = 5; // June
  const calWeeks = generateCalendar(calYear, calMonth);

  // Member drawer content (reusable)
  const MemberDrawerContent = ({ member }: { member: Member }) => (
    <>
      <Drawer.Title>{member.name}</Drawer.Title>
      <Drawer.Content>
        <Stack space={3}>
          <Inline space={2} alignY="center">
            <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
            <Badge>{member.role}</Badge>
          </Inline>
          <Stack space={1}>
            <Text weight="bold">Email</Text>
            <Text>{member.email}</Text>
          </Stack>
          <Stack space={1}>
            <Text weight="bold">Joined</Text>
            <Text><DateFormat value={member.joined} dateStyle="long" /></Text>
          </Stack>
          <Stack space={1}>
            <Text weight="bold">Bio</Text>
            <Text>{member.bio}</Text>
          </Stack>
        </Stack>
      </Drawer.Content>
      <Drawer.Actions>
        <Button slot="close">Close</Button>
      </Drawer.Actions>
    </>
  );

  // ─── Page content ────────────────────────────────────────────────────────

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Tiles tilesWidth="200px" space={4} stretch>
        <Card p={4}>
          <Stack space={2}>
            <Text>Members</Text>
            <Headline level={2}>{members.length}</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text>Active Projects</Text>
            <Headline level={2}>5</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text>Upcoming Deadlines</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              <Text>Hours This Week</Text>
              <ContextualHelp>
                <ContextualHelp.Content>
                  Aggregate of all team members.
                </ContextualHelp.Content>
              </ContextualHelp>
            </Inline>
            <Headline level={2}><NumericFormat value={342} /></Headline>
          </Stack>
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
            {RECENT_ACTIVITIES.map(a => (
              <Table.Row key={a.id}>
                <Table.Cell>{a.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={actionVariant(a.action)}>{a.action}</Badge>
                </Table.Cell>
                <Table.Cell>{a.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={a.date} dateStyle="long" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
      </SectionMessage>
    </Stack>
  );

  const renderMembers = () => (
    <Stack space={6}>
      <Headline level={1}>Team Members</Headline>

      {/* Toolbar */}
      <Inline space={3} alignY="center">
        <SearchField
          label="Search members"
          placeholder="Search by name..."
          value={memberSearch}
          onChange={(val) => setMemberSearch(val as string)}
        />
        <Select
          label="Role"
          selectedKey={memberRoleFilter}
          onSelectionChange={(key) => setMemberRoleFilter(String(key))}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Inline space={1}>
          <Button
            variant={memberViewMode === 'table' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setMemberViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={memberViewMode === 'cards' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setMemberViewMode('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Button variant="primary" onPress={openAddMember}>Add Member</Button>
      </Inline>

      {/* Table View */}
      {memberViewMode === 'table' && (
        <Table aria-label="Team Members" selectionMode="none">
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
                    <Drawer.Trigger>
                      <Button size="small" variant="secondary">Details</Button>
                      <Drawer size="medium" aria-label={`${member.name} details`}>
                        <MemberDrawerContent member={member} />
                      </Drawer>
                    </Drawer.Trigger>
                    <Button size="small" variant="secondary" onPress={() => openEditMember(member)}>
                      Edit
                    </Button>
                    <Button size="small" variant="destructive" onPress={() => handleRemoveMember(member)}>
                      Remove
                    </Button>
                  </Inline>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Card View */}
      {memberViewMode === 'cards' && (
        <Tiles tilesWidth="280px" space={4} stretch>
          {filteredMembers.map(member => (
            <Card key={member.id} p={4}>
              <Stack space={3}>
                <Headline level={4}>{member.name}</Headline>
                <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                  {member.role}
                </Badge>
                <Text>{member.email}</Text>
                <Inline space={2}>
                  <Button size="small" variant="secondary">Message</Button>
                  <Drawer.Trigger>
                    <Button size="small">Profile</Button>
                    <Drawer size="medium" aria-label={`${member.name} profile`}>
                      <MemberDrawerContent member={member} />
                    </Drawer>
                  </Drawer.Trigger>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen} closeButton>
        {({ close }) => (
          <>
            <Dialog.Title>Add Member</Dialog.Title>
            <Dialog.Content>
              <MemberFormFields form={memberForm} onChange={updateMemberForm} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => { handleAddMember(); close(); }}>
                Add
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog
        open={!!editMember}
        onOpenChange={(open) => { if (!open) setEditMember(null); }}
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>Edit Member</Dialog.Title>
            <Dialog.Content>
              <MemberFormFields form={memberForm} onChange={updateMemberForm} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => { handleUpdateMember(); close(); }}>
                Update
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );

  const renderProjects = () => (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>

      <Inline space={3} alignY="center">
        <SearchField
          label="Search projects"
          placeholder="Search by name..."
          value={projectSearch}
          onChange={(val) => setProjectSearch(val as string)}
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      {selectedProjectKeys.size > 0 && (
        <Inline space={3} alignY="center">
          <Text>{selectedProjectKeys.size} project(s) selected</Text>
          <Button variant="secondary" onPress={handleArchiveProjects}>Archive Selected</Button>
          <Button variant="secondary" onPress={() => {
            addToast({ title: 'Export started', variant: 'info' });
            setSelectedProjectKeys(new Set());
          }}>Export</Button>
        </Inline>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedProjectKeys}
        onSelectionChange={(keys) => {
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
              <Table.Cell>{p.memberCount}</Table.Cell>
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
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>

      <Card p={4}>
        <Stack space={2}>
          <Headline level={2}>{MONTH_NAMES[calMonth]} {calYear}</Headline>
          <Stack space={1}>
            <Columns columns={[1,1,1,1,1,1,1]} space={1}>
              {DAY_NAMES.map(day => (
                <Text key={day} weight="bold" size="sm">{day}</Text>
              ))}
            </Columns>
            {calWeeks.map((week, wi) => (
              <Columns key={wi} columns={[1,1,1,1,1,1,1]} space={1}>
                {week.map((day, di) => (
                  <Card key={di} p={2}>
                    <Text size="sm">{day ?? ''}</Text>
                  </Card>
                ))}
              </Columns>
            ))}
          </Stack>
        </Stack>
      </Card>

      <Stack space={3}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={3}>
          {CALENDAR_EVENTS.map(ev => (
            <Card key={ev.id} p={3}>
              <Inline space={3} alignY="center">
                <Text weight="bold">
                  <DateFormat value={ev.date} dateStyle="medium" />
                </Text>
                <Text>{ev.name}</Text>
                <Badge variant={eventTypeVariant(ev.type)}>{ev.type}</Badge>
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

      <Inline space={3} alignY="center">
        <SearchField
          label="Search files"
          placeholder="Search by name..."
          value={fileSearch}
          onChange={(val) => setFileSearch(val as string)}
        />
        <Select
          label="Type"
          selectedKey={fileTypeFilter}
          onSelectionChange={(key) => setFileTypeFilter(String(key))}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Document">Documents</Select.Option>
          <Select.Option id="Image">Images</Select.Option>
          <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
        </Select>
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
              <Table.Cell>
                <NumericFormat
                  value={f.size / 1000000}
                  minimumFractionDigits={1}
                  maximumFractionDigits={1}
                />{' '}MB
              </Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={f.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <ActionMenu.Item id="download">Download</ActionMenu.Item>
                  <ActionMenu.Item id="rename">Rename</ActionMenu.Item>
                  <ActionMenu.Item id="delete" variant="destructive" onAction={() => handleDeleteFile(f)}>
                    Delete
                  </ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen} closeButton>
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <FileField label="Files" multiple />
                <TextField label="Description" placeholder="Describe the files..." />
                <Select label="Category" defaultSelectedKey="Document">
                  <Select.Option id="Document">Document</Select.Option>
                  <Select.Option id="Image">Image</Select.Option>
                  <Select.Option id="Spreadsheet">Spreadsheet</Select.Option>
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
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs aria-label="Team settings tabs">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField
              label="Team Name"
              value={teamName}
              onChange={(val) => setTeamName(val as string)}
            />
            <TextArea
              label="Description"
              value={teamDesc}
              onChange={(val) => setTeamDesc(val as string)}
              rows={3}
            />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={(key) => setTimezone(String(key))}
            >
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onSelectionChange={(key) => setDateFormat(String(key))}
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Inline space={3} alignY="center">
              <Button variant="primary" onPress={handleSaveSettings}>Save</Button>
              {settingsSaved && <Text>Settings updated.</Text>}
            </Inline>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={1}>
              <Switch label="New member joins" selected={notifNewMember} onChange={setNotifNewMember} />
              <Text size="sm">Get notified when someone joins the team</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Project deadline approaching" selected={notifDeadline} onChange={setNotifDeadline} />
              <Text size="sm">Reminder 3 days before deadline</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Weekly digest" selected={notifWeekly} onChange={setNotifWeekly} />
              <Text size="sm">Summary of team activity every Monday</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Mention notifications" selected={notifMentions} onChange={setNotifMentions} />
              <Text size="sm">When someone mentions you in a comment</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Calendar reminders" selected={notifCalendar} onChange={setNotifCalendar} />
              <Text size="sm">15 minutes before scheduled events</Text>
            </Stack>
            <Inline space={3} alignY="center">
              <Button variant="primary" onPress={handleSaveNotifications}>Save Preferences</Button>
              {notifSaved && <Text>Preferences saved.</Text>}
            </Inline>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="240px" space={4} stretch>
            {/* Slack */}
            <Card p={4}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level={4}>Slack</Headline>
                  <Badge variant={slackConnected ? 'success' : 'default'}>
                    {slackConnected ? 'Connected' : 'Not connected'}
                  </Badge>
                </Inline>
                <Text>Team communication and notifications.</Text>
                {slackConnected ? (
                  <Button
                    variant="secondary"
                    onPress={() => handleDisconnect('Slack', setSlackConnected)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="primary" onPress={() => setSlackConnected(true)}>Connect</Button>
                )}
              </Stack>
            </Card>

            {/* GitHub */}
            <Card p={4}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level={4}>GitHub</Headline>
                  <Badge variant={githubConnected ? 'success' : 'default'}>
                    {githubConnected ? 'Connected' : 'Not connected'}
                  </Badge>
                </Inline>
                <Text>Code repository and CI/CD integration.</Text>
                {githubConnected ? (
                  <Button
                    variant="secondary"
                    onPress={() => handleDisconnect('GitHub', setGithubConnected)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="primary" onPress={() => setGithubConnected(true)}>Connect</Button>
                )}
              </Stack>
            </Card>

            {/* Jira */}
            <Card p={4}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level={4}>Jira</Headline>
                  <Badge variant={jiraConnected ? 'success' : 'default'}>
                    {jiraConnected ? 'Connected' : 'Not connected'}
                  </Badge>
                </Inline>
                <Text>Project and issue tracking.</Text>
                {jiraConnected ? (
                  <Button
                    variant="secondary"
                    onPress={() => handleDisconnect('Jira', setJiraConnected)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="primary" onPress={() => setJiraConnected(true)}>Connect</Button>
                )}
              </Stack>
            </Card>
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard': return renderDashboard();
      case '/members': return renderMembers();
      case '/projects': return renderProjects();
      case '/calendar': return renderCalendar();
      case '/files': return renderFiles();
      case '/settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  // ─── Shell ───────────────────────────────────────────────────────────────

  return (
    <RouterProvider navigate={setCurrentPath}>
      <ToastProvider position="bottom-right" />
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Headline level={3}>{teamName}</Headline>
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
            <TopNavigation.Middle aria-label="Breadcrumb navigation">
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">TeamHub</Breadcrumbs.Item>
                {currentPath !== '/dashboard' && (
                  <Breadcrumbs.Item href={currentPath}>
                    {PAGE_LABELS[currentPath]}
                  </Breadcrumbs.Item>
                )}
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User account actions">
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={(key) => {
                      if (key === 'signout') addToast({ title: 'Signed out', variant: 'info' });
                    }}
                  >
                    <Menu.Item id="profile">Profile</Menu.Item>
                    <Menu.Item id="preferences">Preferences</Menu.Item>
                    <Menu.Item id="signout">Sign Out</Menu.Item>
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
            <Inset space={6}>
              {renderPage()}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
}

export default TeamHubApp;
