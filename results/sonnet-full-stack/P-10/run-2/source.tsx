import { useMemo, useState } from 'react';
import {
  ActionBar,
  ActionMenu,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  ContextualHelp,
  DateFormat,
  Dialog,
  Drawer,
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

// ---- Types ----
interface Member {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  email: string;
  status: 'Active' | 'On Leave';
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

interface FileItem {
  id: string;
  name: string;
  type: 'Documents' | 'Images' | 'Spreadsheets';
  size: string;
  uploadedBy: string;
  date: Date;
}

// ---- Static data ----
const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: new Date(2024, 1, 15), bio: 'Full-stack engineer focused on React and Node.' },
  { id: 'm2', name: 'Bob Martinez', role: 'Designer', email: 'bob@teamhub.io', status: 'Active', joined: new Date(2023, 8, 1), bio: 'UX/UI specialist with a passion for accessible design.' },
  { id: 'm3', name: 'Carol Davis', role: 'Manager', email: 'carol@teamhub.io', status: 'Active', joined: new Date(2023, 2, 20), bio: 'Project manager keeping everything on track.' },
  { id: 'm4', name: 'Dan Lee', role: 'Developer', email: 'dan@teamhub.io', status: 'On Leave', joined: new Date(2024, 5, 10), bio: 'Backend specialist with Go and Postgres expertise.' },
  { id: 'm5', name: 'Eva Chen', role: 'QA', email: 'eva@teamhub.io', status: 'Active', joined: new Date(2024, 3, 5), bio: 'QA engineer ensuring quality at every step.' },
  { id: 'm6', name: 'Frank Wilson', role: 'Developer', email: 'frank@teamhub.io', status: 'Active', joined: new Date(2022, 10, 12), bio: 'Frontend developer specialising in performance.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'TeamHub Redesign', lead: 'Carol Davis', members: 4, deadline: new Date(2026, 7, 15), progress: 75, status: 'Active' },
  { id: 'p2', name: 'API v2', lead: 'Alice Johnson', members: 3, deadline: new Date(2026, 9, 1), progress: 45, status: 'Active' },
  { id: 'p3', name: 'Mobile App', lead: 'Bob Martinez', members: 5, deadline: new Date(2026, 6, 30), progress: 90, status: 'Active' },
  { id: 'p4', name: 'Data Pipeline', lead: 'Dan Lee', members: 2, deadline: new Date(2026, 5, 15), progress: 100, status: 'Completed' },
  { id: 'p5', name: 'Security Audit', lead: 'Eva Chen', members: 3, deadline: new Date(2026, 8, 1), progress: 20, status: 'On Hold' },
];

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'Q2 Report.pdf', type: 'Documents', size: '2.4 MB', uploadedBy: 'Carol Davis', date: new Date(2026, 5, 1) },
  { id: 'f2', name: 'Brand Assets.png', type: 'Images', size: '8.1 MB', uploadedBy: 'Bob Martinez', date: new Date(2026, 5, 10) },
  { id: 'f3', name: 'Budget 2026.xlsx', type: 'Spreadsheets', size: '1.2 MB', uploadedBy: 'Carol Davis', date: new Date(2026, 4, 20) },
  { id: 'f4', name: 'Architecture.pdf', type: 'Documents', size: '5.7 MB', uploadedBy: 'Alice Johnson', date: new Date(2026, 5, 15) },
  { id: 'f5', name: 'Sprint 14 Retro.docx', type: 'Documents', size: '0.3 MB', uploadedBy: 'Frank Wilson', date: new Date(2026, 5, 25) },
];

const RECENT_ACTIVITY = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'API v2', date: new Date(2026, 5, 25) },
  { id: 'a2', member: 'Bob Martinez', action: 'Review', project: 'TeamHub Redesign', date: new Date(2026, 5, 26) },
  { id: 'a3', member: 'Carol Davis', action: 'Deploy', project: 'Mobile App', date: new Date(2026, 5, 27) },
  { id: 'a4', member: 'Dan Lee', action: 'Commit', project: 'Data Pipeline', date: new Date(2026, 5, 27) },
  { id: 'a5', member: 'Eva Chen', action: 'Review', project: 'Security Audit', date: new Date(2026, 5, 28) },
];

const UPCOMING_EVENTS = [
  { id: 'e1', date: new Date(2026, 6, 2), name: 'Sprint Planning', type: 'Meeting' },
  { id: 'e2', date: new Date(2026, 6, 8), name: 'Design Deadline', type: 'Deadline' },
  { id: 'e3', date: new Date(2026, 6, 15), name: 'Team Lunch', type: 'Social' },
  { id: 'e4', date: new Date(2026, 6, 22), name: 'Q3 Review', type: 'Meeting' },
];

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

// ---- Helpers ----
function buildCalendarWeeks(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  const startPad = (firstDay + 6) % 7;
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  while (days.length % 7 !== 0) days.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error';

function statusBadge(status: string): BadgeVariant {
  if (status === 'Active' || status === 'Completed') return 'success';
  if (status === 'On Leave' || status === 'On Hold') return 'warning';
  return 'default';
}

function actionBadge(action: string): BadgeVariant {
  if (action === 'Commit') return 'info';
  if (action === 'Review') return 'warning';
  if (action === 'Deploy') return 'success';
  return 'default';
}

function eventBadge(type: string): BadgeVariant {
  if (type === 'Meeting') return 'info';
  if (type === 'Deadline') return 'warning';
  if (type === 'Social') return 'success';
  return 'default';
}

// ---- Main component ----
const TestApp = () => {
  const { addToast } = useToast();
  const confirm = useConfirmation();

  const today = new Date();
  const calYear = today.getFullYear();
  const calMonth = today.getMonth();
  const calWeeks = buildCalendarWeeks(calYear, calMonth);

  // Navigation
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // Team name (updated via Settings)
  const [teamName, setTeamName] = useState('TeamHub');

  // Members
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [memberView, setMemberView] = useState<'table' | 'cards'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRole, setMemberRole] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<string>('Developer');
  const [formStartDate, setFormStartDate] = useState('');
  const [formBio, setFormBio] = useState('');

  // Projects
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectKeys, setSelectedProjectKeys] = useState<Set<string>>(new Set());

  // Files
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [fileSearch, setFileSearch] = useState('');
  const [fileType, setFileType] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Settings
  const [settingsTeamName, setSettingsTeamName] = useState('TeamHub');
  const [settingsDesc, setSettingsDesc] = useState('A collaborative workspace for our team.');
  const [settingsTimezone, setSettingsTimezone] = useState<string>('UTC');
  const [settingsDateFormat, setSettingsDateFormat] = useState<string>('MM/DD/YYYY');
  const [notifNewMember, setNotifNewMember] = useState(true);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifMention, setNotifMention] = useState(true);
  const [notifCalendar, setNotifCalendar] = useState(false);
  const [slackConnected, setSlackConnected] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);
  const [jiraConnected, setJiraConnected] = useState(false);

  // Derived
  const filteredMembers = useMemo(
    () => members.filter(m =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
      (memberRole === 'all' || m.role === memberRole)
    ),
    [members, memberSearch, memberRole]
  );

  const filteredProjects = useMemo(
    () => projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase())),
    [projects, projectSearch]
  );

  const filteredFiles = useMemo(
    () => files.filter(f =>
      f.name.toLowerCase().includes(fileSearch.toLowerCase()) &&
      (fileType === 'all' || f.type === fileType)
    ),
    [files, fileSearch, fileType]
  );

  // ---- Handlers ----
  const openAddDialog = () => {
    setEditingMember(null);
    setFormName(''); setFormEmail(''); setFormRole('Developer'); setFormStartDate(''); setFormBio('');
    setMemberDialogOpen(true);
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormRole(member.role);
    setFormStartDate(member.joined.toISOString().split('T')[0]);
    setFormBio(member.bio);
    setMemberDialogOpen(true);
  };

  const handleSaveMember = (close: () => void) => {
    if (!formName.trim() || !formEmail.trim()) return;
    if (editingMember) {
      setMembers(prev => prev.map(m =>
        m.id === editingMember.id
          ? { ...m, name: formName, email: formEmail, role: formRole as Member['role'], bio: formBio }
          : m
      ));
      setSelectedMember(prev =>
        prev?.id === editingMember.id
          ? { ...prev, name: formName, email: formEmail, role: formRole as Member['role'], bio: formBio }
          : prev
      );
    } else {
      setMembers(prev => [...prev, {
        id: `m${Date.now()}`,
        name: formName,
        email: formEmail,
        role: formRole as Member['role'],
        status: 'Active',
        joined: new Date(),
        bio: formBio,
      }]);
    }
    close();
  };

  const handleRemoveMember = async (id: string) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Remove Member',
        content: 'Are you sure you want to remove this team member? This action cannot be undone.',
        confirmationLabel: 'Remove',
      });
      setMembers(prev => prev.filter(m => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch {
      // user cancelled
    }
  };

  const handleArchiveProjects = () => {
    setProjects(prev => prev.filter(p => !selectedProjectKeys.has(p.id)));
    setSelectedProjectKeys(new Set());
  };

  const handleUploadFiles = (close: () => void) => {
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
    close();
  };

  const handleSaveSettings = () => {
    setTeamName(settingsTeamName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const handleDisconnect = async (name: string, setter: (v: boolean) => void) => {
    try {
      await confirm({
        variant: 'destructive',
        title: `Disconnect ${name}`,
        content: `Are you sure you want to disconnect ${name}?`,
        confirmationLabel: 'Disconnect',
      });
      setter(false);
    } catch {
      // user cancelled
    }
  };

  // ---- Page renderers ----
  const renderDashboard = () => (
    <Stack space={8}>
      <Headline level={1}>Team Overview</Headline>
      <Tiles tilesWidth="200px" space={4}>
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold">Members</Text>
            <Headline level={2}><NumericFormat value={members.length} /></Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold">Active Projects</Text>
            <Headline level={2}><NumericFormat value={5} /></Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold">Upcoming Deadlines</Text>
            <Headline level={2}><NumericFormat value={8} /></Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold">Hours This Week</Text>
            <Headline level={2}><NumericFormat value={342} /></Headline>
            <Tooltip.Trigger>
              <Button aria-label="Aggregate of all team members">About</Button>
              <Tooltip>Aggregate of all team members.</Tooltip>
            </Tooltip.Trigger>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={4}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {RECENT_ACTIVITY.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell><Text>{row.member}</Text></Table.Cell>
                <Table.Cell><Badge variant={actionBadge(row.action)}>{row.action}</Badge></Table.Cell>
                <Table.Cell><Text>{row.project}</Text></Table.Cell>
                <Table.Cell><DateFormat value={row.date} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <SectionMessage variant="info">
          <SectionMessage.Title>Sprint 14 Reminder</SectionMessage.Title>
          <SectionMessage.Content>
            Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
          </SectionMessage.Content>
        </SectionMessage>
      </Stack>
    </Stack>
  );

  const renderMembers = () => (
    <Stack space={6}>
      <Headline level={1}>Team Members</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          label="Search members"
          aria-label="Search members"
          value={memberSearch}
          onChange={setMemberSearch}
        />
        <Select
          label="Role"
          selectedKey={memberRole}
          onSelectionChange={k => setMemberRole(k as string)}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Inline space={2}>
          <Button
            variant={memberView === 'table' ? 'primary' : 'secondary'}
            onPress={() => setMemberView('table')}
          >
            Table
          </Button>
          <Button
            variant={memberView === 'cards' ? 'primary' : 'secondary'}
            onPress={() => setMemberView('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Button variant="primary" onPress={openAddDialog}>Add Member</Button>
      </Inline>

      {memberView === 'table' ? (
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
              <Table.Row key={member.id} id={member.id}>
                <Table.Cell>
                  <Button variant="secondary" onPress={() => setSelectedMember(member)}>
                    {member.name}
                  </Button>
                </Table.Cell>
                <Table.Cell><Text>{member.role}</Text></Table.Cell>
                <Table.Cell><Text>{member.email}</Text></Table.Cell>
                <Table.Cell>
                  <Badge variant={statusBadge(member.status)}>{member.status}</Badge>
                </Table.Cell>
                <Table.Cell><DateFormat value={member.joined} /></Table.Cell>
                <Table.Cell>
                  <ActionMenu>
                    <ActionMenu.Item id="edit" onAction={() => openEditDialog(member)}>Edit</ActionMenu.Item>
                    <ActionMenu.Item id="remove" variant="destructive" onAction={() => handleRemoveMember(member.id)}>Remove</ActionMenu.Item>
                  </ActionMenu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="280px" space={4}>
          {filteredMembers.map(member => (
            <Card key={member.id} p={4}>
              <Stack space={3}>
                <Text weight="bold">{member.name}</Text>
                <Badge variant={statusBadge(member.role)}>{member.role}</Badge>
                <Text>{member.email}</Text>
                <Inline space={2}>
                  <Button size="small" onPress={() => {}}>Message</Button>
                  <Button size="small" variant="primary" onPress={() => setSelectedMember(member)}>Profile</Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {/* Add / Edit dialog */}
      <Dialog
        size="small"
        closeButton
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
      >
        {({ close }: { close: () => void }) => (
          <>
            <Dialog.Title>{editingMember ? 'Edit Member' : 'Add Member'}</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  required
                  value={formName}
                  onChange={setFormName}
                />
                <TextField
                  label="Email"
                  required
                  type="email"
                  value={formEmail}
                  onChange={setFormEmail}
                />
                <Select
                  label="Role"
                  selectedKey={formRole}
                  onSelectionChange={k => setFormRole(k as string)}
                >
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <TextField
                  label="Start Date"
                  type="date"
                  value={formStartDate}
                  onChange={setFormStartDate}
                />
                <TextArea label="Bio" value={formBio} onChange={setFormBio} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => handleSaveMember(close)}>
                {editingMember ? 'Save' : 'Add'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Member detail drawer */}
      <Drawer open={!!selectedMember} size="small">
        <Drawer.Title>Member Details</Drawer.Title>
        <Drawer.Content>
          {selectedMember && (
            <Stack space={4}>
              <Headline level={3}>{selectedMember.name}</Headline>
              <Badge variant={statusBadge(selectedMember.role)}>{selectedMember.role}</Badge>
              <Stack space={2}>
                <Text>{selectedMember.email}</Text>
                <Inline space={2} alignY="center">
                  <Text>Status:</Text>
                  <Badge variant={statusBadge(selectedMember.status)}>{selectedMember.status}</Badge>
                </Inline>
                <Inline space={2} alignY="center">
                  <Text>Joined:</Text>
                  <DateFormat value={selectedMember.joined} />
                </Inline>
                {selectedMember.bio && <Text>{selectedMember.bio}</Text>}
              </Stack>
            </Stack>
          )}
        </Drawer.Content>
        <Drawer.Actions>
          <Button onPress={() => setSelectedMember(null)}>Close</Button>
          {selectedMember && (
            <Button
              variant="primary"
              onPress={() => {
                const m = selectedMember;
                setSelectedMember(null);
                openEditDialog(m);
              }}
            >
              Edit
            </Button>
          )}
        </Drawer.Actions>
      </Drawer>
    </Stack>
  );

  const renderProjects = () => (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          label="Search projects"
          aria-label="Search projects"
          value={projectSearch}
          onChange={setProjectSearch}
        />
        <Button variant="primary" onPress={() => {}}>New Project</Button>
      </Inline>
      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedProjectKeys}
        onSelectionChange={(keys) => {
          if (keys === 'all') {
            setSelectedProjectKeys(new Set(filteredProjects.map(p => p.id)));
          } else {
            setSelectedProjectKeys(keys as Set<string>);
          }
        }}
        actionBar={() => (
          <ActionBar>
            <ActionBar.Button onPress={handleArchiveProjects}>Archive Selected</ActionBar.Button>
            <ActionBar.Button onPress={() => {}}>Export</ActionBar.Button>
          </ActionBar>
        )}
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
          {filteredProjects.map(project => (
            <Table.Row key={project.id} id={project.id}>
              <Table.Cell><Text weight="bold">{project.name}</Text></Table.Cell>
              <Table.Cell><Text>{project.lead}</Text></Table.Cell>
              <Table.Cell><NumericFormat value={project.members} /></Table.Cell>
              <Table.Cell><DateFormat value={project.deadline} /></Table.Cell>
              <Table.Cell><Text>{project.progress}%</Text></Table.Cell>
              <Table.Cell>
                <Badge variant={statusBadge(project.status)}>{project.status}</Badge>
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
        <Stack space={4}>
          <Headline level={2}>{MONTH_NAMES[calMonth]} {calYear}</Headline>
          <Table aria-label={`${MONTH_NAMES[calMonth]} ${calYear} calendar`}>
            <Table.Header>
              {DAY_HEADERS.map(d => (
                <Table.Column key={d}>{d}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {calWeeks.map((week, wIdx) => (
                <Table.Row key={wIdx} id={`week-${wIdx}`}>
                  {week.map((day, dIdx) => (
                    <Table.Cell key={dIdx}>
                      {day !== null
                        ? day === today.getDate()
                          ? <Text weight="bold">{day}</Text>
                          : <Text>{day}</Text>
                        : null}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Stack>
      </Card>

      <Stack space={4}>
        <Headline level={2}>Upcoming Events</Headline>
        {UPCOMING_EVENTS.map(evt => (
          <Card key={evt.id} p={3}>
            <Inline space={4} alignY="center">
              <DateFormat value={evt.date} />
              <Text weight="bold">{evt.name}</Text>
              <Badge variant={eventBadge(evt.type)}>{evt.type}</Badge>
            </Inline>
          </Card>
        ))}
      </Stack>
    </Stack>
  );

  const renderFiles = () => (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>
      <Inline space={4} alignY="center">
        <SearchField
          label="Search files"
          aria-label="Search files"
          value={fileSearch}
          onChange={setFileSearch}
        />
        <Select
          label="File type"
          selectedKey={fileType}
          onSelectionChange={k => setFileType(k as string)}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => setUploadDialogOpen(true)}>Upload</Button>
      </Inline>

      <Table aria-label="Shared Files">
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
              <Table.Cell><Text weight="bold">{file.name}</Text></Table.Cell>
              <Table.Cell><Text>{file.type}</Text></Table.Cell>
              <Table.Cell><Text>{file.size}</Text></Table.Cell>
              <Table.Cell><Text>{file.uploadedBy}</Text></Table.Cell>
              <Table.Cell><DateFormat value={file.date} /></Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <ActionMenu.Item id="download" onAction={() => {}}>Download</ActionMenu.Item>
                  <ActionMenu.Item id="rename" onAction={() => {}}>Rename</ActionMenu.Item>
                  <ActionMenu.Item id="delete" variant="destructive" onAction={() => {}}>Delete</ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog
        size="small"
        closeButton
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      >
        {({ close }: { close: () => void }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <FileField label="Files" multiple />
                <TextField label="Description" />
                <Select label="Category">
                  <Select.Option id="Documents">Documents</Select.Option>
                  <Select.Option id="Images">Images</Select.Option>
                  <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => handleUploadFiles(close)}>Upload</Button>
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
          <Inset space={4}>
            <Stack space={5}>
              <TextField
                label="Team Name"
                value={settingsTeamName}
                onChange={setSettingsTeamName}
              />
              <TextArea
                label="Description"
                value={settingsDesc}
                onChange={setSettingsDesc}
              />
              <Select
                label="Default Timezone"
                selectedKey={settingsTimezone}
                onSelectionChange={k => setSettingsTimezone(k as string)}
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={settingsDateFormat}
                onSelectionChange={k => setSettingsDateFormat(k as string)}
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" onPress={handleSaveSettings}>Save</Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Inset space={4}>
            <Stack space={5}>
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
                <Switch label="Mention notifications" selected={notifMention} onChange={setNotifMention} />
                <Text size="sm">When someone mentions you in a comment</Text>
              </Stack>
              <Stack space={1}>
                <Switch label="Calendar reminders" selected={notifCalendar} onChange={setNotifCalendar} />
                <Text size="sm">15 minutes before scheduled events</Text>
              </Stack>
              <Button
                variant="primary"
                onPress={() => addToast({ title: 'Preferences saved.', variant: 'success' })}
              >
                Save Preferences
              </Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Inset space={4}>
            <Tiles tilesWidth="240px" space={4}>
              <Card p={4}>
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Slack</Text>
                    <Badge variant={slackConnected ? 'success' : 'default'}>
                      {slackConnected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </Inline>
                  <Text>Team messaging and notifications.</Text>
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

              <Card p={4}>
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">GitHub</Text>
                    <Badge variant={githubConnected ? 'success' : 'default'}>
                      {githubConnected ? 'Connected' : 'Not Connected'}
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

              <Card p={4}>
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Jira</Text>
                    <Badge variant={jiraConnected ? 'success' : 'default'}>
                      {jiraConnected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </Inline>
                  <Text>Issue tracking and project management.</Text>
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

  return (
    <RouterProvider navigate={setCurrentPath}>
      <ToastProvider position="bottom-right" />
      <Sidebar.Provider defaultOpen>
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
                {currentPath !== '/dashboard' && (
                  <Breadcrumbs.Item href={currentPath}>
                    {PAGE_LABELS[currentPath]}
                  </Breadcrumbs.Item>
                )}
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={(key) => {
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
                  <ContextualHelp.Title>Navigation Help</ContextualHelp.Title>
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
};

export default TestApp;
