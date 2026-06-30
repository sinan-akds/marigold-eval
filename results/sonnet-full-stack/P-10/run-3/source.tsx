import { useState } from 'react';
import { CalendarDate, type DateValue } from '@internationalized/date';
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
  Dialog,
  ConfirmationProvider,
  useConfirmation,
  Table,
  Badge,
  Card,
  Stack,
  Inline,
  Columns,
  Tiles,
  Headline,
  Text,
  TextField,
  TextArea,
  Select,
  SearchField,
  DateField,
  Switch,
  Tabs,
  Button,
  SectionMessage,
  NumericFormat,
  Inset,
  ToastProvider,
  useToast,
  Calendar,
  Divider,
} from '@marigold/components';

// ---- Types ----
interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joined: string;
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
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: string;
}
interface ActivityRow {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: string;
}

// ---- Initial Data ----
const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: '2023-03-15', bio: 'Full-stack developer with 5 years of experience.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.io', status: 'Active', joined: '2023-05-20', bio: 'UI/UX designer passionate about accessibility.' },
  { id: '3', name: 'Carol Williams', role: 'Manager', email: 'carol@teamhub.io', status: 'Active', joined: '2022-11-10', bio: 'Engineering manager with 10+ years of experience.' },
  { id: '4', name: 'David Lee', role: 'Developer', email: 'david@teamhub.io', status: 'On Leave', joined: '2024-01-08', bio: 'Backend developer specializing in distributed systems.' },
  { id: '5', name: 'Eva Martinez', role: 'QA', email: 'eva@teamhub.io', status: 'Active', joined: '2023-09-01', bio: 'QA engineer focused on automated testing.' },
  { id: '6', name: 'Frank Chen', role: 'Developer', email: 'frank@teamhub.io', status: 'Active', joined: '2024-02-14', bio: 'Frontend developer with React expertise.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Alpha Redesign', lead: 'Carol Williams', members: 4, deadline: '2026-07-30', progress: 75, status: 'Active' },
  { id: '2', name: 'Beta API', lead: 'Alice Johnson', members: 3, deadline: '2026-08-15', progress: 45, status: 'Active' },
  { id: '3', name: 'Gamma Dashboard', lead: 'Frank Chen', members: 5, deadline: '2026-06-30', progress: 90, status: 'On Hold' },
  { id: '4', name: 'Delta Mobile', lead: 'Bob Smith', members: 2, deadline: '2026-09-01', progress: 20, status: 'Active' },
  { id: '5', name: 'Epsilon Legacy', lead: 'David Lee', members: 3, deadline: '2026-05-01', progress: 100, status: 'Completed' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Design Specs.pdf', type: 'Documents', size: 2400000, uploadedBy: 'Bob Smith', date: '2026-05-15' },
  { id: '2', name: 'Team Photo.png', type: 'Images', size: 5100000, uploadedBy: 'Carol Williams', date: '2026-05-20' },
  { id: '3', name: 'Q2 Report.xlsx', type: 'Spreadsheets', size: 870000, uploadedBy: 'Alice Johnson', date: '2026-06-01' },
  { id: '4', name: 'API Documentation.pdf', type: 'Documents', size: 1300000, uploadedBy: 'Frank Chen', date: '2026-06-10' },
  { id: '5', name: 'Budget 2026.xlsx', type: 'Spreadsheets', size: 430000, uploadedBy: 'Carol Williams', date: '2026-06-15' },
];

const ACTIVITY: ActivityRow[] = [
  { id: '1', member: 'Alice Johnson', action: 'Commit', project: 'Alpha Redesign', date: '2026-05-28' },
  { id: '2', member: 'Bob Smith', action: 'Review', project: 'Beta API', date: '2026-06-01' },
  { id: '3', member: 'Carol Williams', action: 'Deploy', project: 'Alpha Redesign', date: '2026-06-05' },
  { id: '4', member: 'David Lee', action: 'Commit', project: 'Gamma Dashboard', date: '2026-06-10' },
  { id: '5', member: 'Eva Martinez', action: 'Review', project: 'Beta API', date: '2026-06-15' },
];

const EVENTS = [
  { id: '1', date: '2026-07-02', name: 'Sprint Planning', type: 'Meeting' as const },
  { id: '2', date: '2026-07-10', name: 'Project Beta Deadline', type: 'Deadline' as const },
  { id: '3', date: '2026-07-15', name: 'Team Lunch', type: 'Social' as const },
  { id: '4', date: '2026-07-22', name: 'Q3 Review', type: 'Meeting' as const },
];

// ---- Helpers ----
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toLocaleString('en-US', { maximumFractionDigits: 0 })} KB`;
  return `${bytes} B`;
}

function dateValueToStr(dv: DateValue | null): string {
  if (!dv) return new Date().toISOString().split('T')[0];
  return `${dv.year}-${String(dv.month).padStart(2, '0')}-${String(dv.day).padStart(2, '0')}`;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  members: 'Members',
  projects: 'Projects',
  calendar: 'Calendar',
  files: 'Files',
  settings: 'Settings',
};

// ---- Main App ----
function TeamHubInner() {
  const { addToast } = useToast();
  const confirm = useConfirmation();

  // Navigation
  const [currentPage, setCurrentPage] = useState('dashboard');
  const navigate = (href: string) => {
    const page = href.replace(/^\//, '') || 'dashboard';
    setCurrentPage(page);
  };

  // Members state
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [memberView, setMemberView] = useState<'table' | 'card'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRole, setMemberRole] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [mfName, setMfName] = useState('');
  const [mfEmail, setMfEmail] = useState('');
  const [mfRole, setMfRole] = useState('Developer');
  const [mfDate, setMfDate] = useState<DateValue | null>(null);
  const [mfBio, setMfBio] = useState('');

  // Projects state
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  // Files state
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [fileSearch, setFileSearch] = useState('');
  const [fileType, setFileType] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Documents');

  // Settings state
  const [teamName, setTeamName] = useState('TeamHub');
  const [teamDesc, setTeamDesc] = useState('A collaborative workspace for engineering teams.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifs, setNotifs] = useState({
    newMember: true, projectDeadline: true, weeklyDigest: false, mentions: true, calendarReminders: true,
  });
  const [integrations, setIntegrations] = useState({
    slack: true, github: false, jira: false,
  });

  // Filtered data
  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase());
    const matchRole = memberRole === 'all' || m.role === memberRole;
    return matchSearch && matchRole;
  });

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredFiles = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase());
    const matchType = fileType === 'All' || f.type === fileType;
    return matchSearch && matchType;
  });

  // Member form open
  const openAddMember = () => {
    setEditMember(null);
    setMfName(''); setMfEmail(''); setMfRole('Developer'); setMfDate(null); setMfBio('');
    setMemberFormOpen(true);
  };
  const openEditMember = (m: Member) => {
    setEditMember(m);
    setMfName(m.name); setMfEmail(m.email); setMfRole(m.role);
    const [y, mo, d] = m.joined.split('-').map(Number);
    setMfDate(new CalendarDate(y, mo, d));
    setMfBio(m.bio);
    setMemberFormOpen(true);
  };
  const saveMember = () => {
    if (!mfName.trim() || !mfEmail.trim()) return;
    if (editMember) {
      setMembers(prev => prev.map(m => m.id === editMember.id
        ? { ...m, name: mfName, email: mfEmail, role: mfRole, joined: dateValueToStr(mfDate), bio: mfBio }
        : m));
      if (selectedMember?.id === editMember.id) {
        setSelectedMember({ ...editMember, name: mfName, email: mfEmail, role: mfRole, joined: dateValueToStr(mfDate), bio: mfBio });
      }
    } else {
      const newMember: Member = {
        id: String(Date.now()), name: mfName, email: mfEmail, role: mfRole,
        status: 'Active', joined: dateValueToStr(mfDate), bio: mfBio,
      };
      setMembers(prev => [...prev, newMember]);
    }
    setMemberFormOpen(false);
  };
  const removeMember = async (id: string) => {
    try {
      await confirm({ variant: 'destructive', title: 'Remove Member', content: 'Are you sure you want to remove this member? This action cannot be undone.', confirmationLabel: 'Remove' });
      setMembers(prev => prev.filter(m => m.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch { /* cancelled */ }
  };

  const archiveSelected = () => {
    setProjects(prev => prev.filter(p => !selectedProjects.has(p.id)));
    setSelectedProjects(new Set());
  };

  const handleIntegrationToggle = async (key: 'slack' | 'github' | 'jira') => {
    if (integrations[key]) {
      try {
        await confirm({ variant: 'destructive', title: `Disconnect ${key.charAt(0).toUpperCase() + key.slice(1)}`, content: `Are you sure you want to disconnect ${key}?`, confirmationLabel: 'Disconnect' });
        setIntegrations(prev => ({ ...prev, [key]: false }));
      } catch { /* cancelled */ }
    } else {
      setIntegrations(prev => ({ ...prev, [key]: true }));
      addToast({ title: `${key.charAt(0).toUpperCase() + key.slice(1)} connected`, variant: 'success' });
    }
  };

  const actionBadge = (action: 'Commit' | 'Review' | 'Deploy') => {
    const map = { Commit: 'info', Review: 'warning', Deploy: 'success' } as const;
    return <Badge variant={map[action]}>{action}</Badge>;
  };

  const statusBadge = (status: 'Active' | 'On Leave') =>
    <Badge variant={status === 'Active' ? 'success' : 'warning'}>{status}</Badge>;

  const projectStatusBadge = (status: 'Active' | 'On Hold' | 'Completed') => {
    const map = { Active: 'success', 'On Hold': 'warning', Completed: 'info' } as const;
    return <Badge variant={map[status]}>{status}</Badge>;
  };

  const eventTypeBadge = (type: 'Meeting' | 'Deadline' | 'Social') => {
    const map = { Meeting: 'info', Deadline: 'warning', Social: 'success' } as const;
    return <Badge variant={map[type]}>{type}</Badge>;
  };

  // ---- Render Pages ----
  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>
      <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="40em">
        <Card>
          <Inset spaceX={4} spaceY={3}>
            <Stack space={1}>
              <Text weight="bold">Members</Text>
              <Headline level={2}>{members.length}</Headline>
              <Text size="sm" color="secondary">Total team members</Text>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset spaceX={4} spaceY={3}>
            <Stack space={1}>
              <Text weight="bold">Active Projects</Text>
              <Headline level={2}><NumericFormat value={5} /></Headline>
              <Text size="sm" color="secondary">Currently running</Text>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset spaceX={4} spaceY={3}>
            <Stack space={1}>
              <Text weight="bold">Upcoming Deadlines</Text>
              <Headline level={2}><NumericFormat value={8} /></Headline>
              <Text size="sm" color="secondary">In the next 30 days</Text>
            </Stack>
          </Inset>
        </Card>
        <Tooltip.Trigger>
          <Card>
            <Inset spaceX={4} spaceY={3}>
              <Stack space={1}>
                <Text weight="bold">Hours This Week</Text>
                <Headline level={2}><NumericFormat value={342} /></Headline>
                <Text size="sm" color="secondary">Team total</Text>
              </Stack>
            </Inset>
          </Card>
          <Tooltip>Aggregate of all team members.</Tooltip>
        </Tooltip.Trigger>
      </Columns>

      <Stack space={3}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {ACTIVITY.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.member}</Table.Cell>
                <Table.Cell>{actionBadge(row.action)}</Table.Cell>
                <Table.Cell>{row.project}</Table.Cell>
                <Table.Cell>{formatDate(row.date)}</Table.Cell>
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

  const renderMemberForm = () => (
    <Dialog open={memberFormOpen} onOpenChange={setMemberFormOpen} closeButton size="small">
      {({ close }) => (
        <>
          <Dialog.Title>{editMember ? 'Edit Member' : 'Add Member'}</Dialog.Title>
          <Dialog.Content>
            <Stack space={4}>
              <TextField label="Full Name" value={mfName} onChange={setMfName} required />
              <TextField label="Email" value={mfEmail} onChange={setMfEmail} required type="email" />
              <Select label="Role" selectedKey={mfRole} onSelectionChange={k => setMfRole(k as string)}>
                <Select.Option key="Developer" id="Developer">Developer</Select.Option>
                <Select.Option key="Designer" id="Designer">Designer</Select.Option>
                <Select.Option key="Manager" id="Manager">Manager</Select.Option>
                <Select.Option key="QA" id="QA">QA</Select.Option>
              </Select>
              <DateField label="Start Date" value={mfDate} onChange={setMfDate} />
              <TextArea label="Bio" value={mfBio} onChange={setMfBio} rows={3} />
            </Stack>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" onPress={close}>Cancel</Button>
            <Button variant="primary" onPress={() => { saveMember(); close(); }}>
              {editMember ? 'Save' : 'Add'}
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  );

  const renderMembers = () => {
    const detailPanel = selectedMember ? (
      <Card>
        <Inset spaceX={4} spaceY={4}>
          <Stack space={4}>
            <Inline alignX="between" alignY="center" space={2}>
              <Headline level={3}>{selectedMember.name}</Headline>
              <Button variant="ghost" size="small" onPress={() => setSelectedMember(null)}>✕</Button>
            </Inline>
            <Stack space={2}>
              <Inline space={2}><Text weight="bold">Role:</Text><Text>{selectedMember.role}</Text></Inline>
              <Inline space={2}><Text weight="bold">Email:</Text><Text>{selectedMember.email}</Text></Inline>
              <Inline space={2}><Text weight="bold">Status:</Text>{statusBadge(selectedMember.status)}</Inline>
              <Inline space={2}><Text weight="bold">Joined:</Text><Text>{formatDate(selectedMember.joined)}</Text></Inline>
              {selectedMember.bio && (
                <Stack space={1}>
                  <Text weight="bold">Bio:</Text>
                  <Text>{selectedMember.bio}</Text>
                </Stack>
              )}
            </Stack>
            <Inline space={2}>
              <Button variant="secondary" size="small" onPress={() => openEditMember(selectedMember)}>Edit</Button>
              <Button variant="destructive" size="small" onPress={() => removeMember(selectedMember.id)}>Remove</Button>
            </Inline>
          </Stack>
        </Inset>
      </Card>
    ) : null;

    return (
      <Stack space={4}>
        <Inline alignX="between" alignY="center" space={4}>
          <Headline level={1}>Team Members</Headline>
          <Button variant="primary" onPress={openAddMember}>Add Member</Button>
        </Inline>

        <Inline space={3} alignY="center">
          <SearchField aria-label="Search members" value={memberSearch} onChange={setMemberSearch} placeholder="Search by name…" />
          <Select aria-label="Filter by role" selectedKey={memberRole} onSelectionChange={k => setMemberRole(k as string)} width="fit">
            <Select.Option key="all" id="all">All Roles</Select.Option>
            <Select.Option key="Developer" id="Developer">Developer</Select.Option>
            <Select.Option key="Designer" id="Designer">Designer</Select.Option>
            <Select.Option key="Manager" id="Manager">Manager</Select.Option>
            <Select.Option key="QA" id="QA">QA</Select.Option>
          </Select>
          <Inline space={2}>
            <Button variant={memberView === 'table' ? 'primary' : 'secondary'} size="small" onPress={() => setMemberView('table')}>Table</Button>
            <Button variant={memberView === 'card' ? 'primary' : 'secondary'} size="small" onPress={() => setMemberView('card')}>Cards</Button>
          </Inline>
        </Inline>

        {renderMemberForm()}

        <Columns columns={selectedMember ? [3, 1] : [1]} space={4} collapseAt="60em">
          <Stack space={2}>
            {memberView === 'table' ? (
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
                  {filteredMembers.map(m => (
                    <Table.Row key={m.id} onAction={() => setSelectedMember(m)}>
                      <Table.Cell>{m.name}</Table.Cell>
                      <Table.Cell>{m.role}</Table.Cell>
                      <Table.Cell>{m.email}</Table.Cell>
                      <Table.Cell>{statusBadge(m.status)}</Table.Cell>
                      <Table.Cell>{formatDate(m.joined)}</Table.Cell>
                      <Table.Cell>
                        <ActionMenu>
                          <ActionMenu.Item id="edit" onAction={() => openEditMember(m)}>Edit</ActionMenu.Item>
                          <ActionMenu.Item id="remove" onAction={() => removeMember(m.id)}>Remove</ActionMenu.Item>
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
                    <Inset spaceX={4} spaceY={4}>
                      <Stack space={3}>
                        <Stack space={1}>
                          <Text weight="bold">{m.name}</Text>
                          <Badge variant="info">{m.role}</Badge>
                          <Text size="sm">{m.email}</Text>
                        </Stack>
                        <Inline space={2}>
                          <Button variant="secondary" size="small" onPress={() => setSelectedMember(m)}>Profile</Button>
                          <Button variant="ghost" size="small" onPress={() => addToast({ title: `Message sent to ${m.name}`, variant: 'success' })}>Message</Button>
                        </Inline>
                      </Stack>
                    </Inset>
                  </Card>
                ))}
              </Tiles>
            )}
          </Stack>
          {detailPanel}
        </Columns>
      </Stack>
    );
  };

  const renderProjects = () => (
    <Stack space={4}>
      <Inline alignX="between" alignY="center" space={4}>
        <Headline level={1}>Projects</Headline>
        <Button variant="primary" onPress={() => addToast({ title: 'New Project dialog coming soon', variant: 'info' })}>New Project</Button>
      </Inline>

      <SearchField aria-label="Search projects" value={projectSearch} onChange={setProjectSearch} placeholder="Search projects…" />

      {selectedProjects.size > 0 && (
        <Inline space={3} alignY="center">
          <Text weight="bold">{selectedProjects.size} selected</Text>
          <Button variant="destructive" size="small" onPress={archiveSelected}>Archive Selected</Button>
          <Button variant="secondary" size="small" onPress={() => { setSelectedProjects(new Set()); addToast({ title: 'Export started', variant: 'info' }); }}>Export</Button>
        </Inline>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedProjects}
        onSelectionChange={keys => {
          if (keys === 'all') {
            setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
          } else {
            setSelectedProjects(new Set(keys as Iterable<string>));
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
              <Table.Cell><NumericFormat value={p.members} /></Table.Cell>
              <Table.Cell>{formatDate(p.deadline)}</Table.Cell>
              <Table.Cell>{p.progress}%</Table.Cell>
              <Table.Cell>{projectStatusBadge(p.status)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Calendar aria-label="Team Calendar" />
      <Stack space={3}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={2}>
          {EVENTS.map(ev => (
            <Card key={ev.id}>
              <Inset spaceX={4} spaceY={3}>
                <Inline space={4} alignY="center">
                  <Text weight="bold" size="sm">{formatDate(ev.date)}</Text>
                  <Text>{ev.name}</Text>
                  {eventTypeBadge(ev.type)}
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
      <Inline alignX="between" alignY="center" space={4}>
        <Headline level={1}>Shared Files</Headline>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>Upload</Button>
      </Inline>

      <Inline space={3} alignY="center">
        <SearchField aria-label="Search files" value={fileSearch} onChange={setFileSearch} placeholder="Search files…" />
        <Select aria-label="Filter by type" selectedKey={fileType} onSelectionChange={k => setFileType(k as string)} width="fit">
          <Select.Option key="All" id="All">All</Select.Option>
          <Select.Option key="Documents" id="Documents">Documents</Select.Option>
          <Select.Option key="Images" id="Images">Images</Select.Option>
          <Select.Option key="Spreadsheets" id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
      </Inline>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen} closeButton size="small">
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextArea label="Description" value={uploadDesc} onChange={setUploadDesc} rows={3} />
                <Select label="Category" selectedKey={uploadCategory} onSelectionChange={k => setUploadCategory(k as string)}>
                  <Select.Option key="Documents" id="Documents">Documents</Select.Option>
                  <Select.Option key="Images" id="Images">Images</Select.Option>
                  <Select.Option key="Spreadsheets" id="Spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => {
                setFiles(prev => [...prev, {
                  id: String(Date.now()), name: `New File.${uploadCategory === 'Images' ? 'png' : uploadCategory === 'Spreadsheets' ? 'xlsx' : 'pdf'}`,
                  type: uploadCategory, size: 1024000, uploadedBy: 'John Doe', date: new Date().toISOString().split('T')[0],
                }]);
                setUploadDesc(''); setUploadOpen(false);
                addToast({ title: 'Files uploaded successfully.', variant: 'success' });
                close();
              }}>Upload</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

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
          {filteredFiles.map(f => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>{formatFileSize(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>{formatDate(f.date)}</Table.Cell>
              <Table.Cell>
                <ActionMenu onAction={async (key) => {
                  if (key === 'download') addToast({ title: `Downloading ${f.name}`, variant: 'info' });
                  else if (key === 'rename') addToast({ title: `Rename ${f.name}`, variant: 'info' });
                  else if (key === 'delete') {
                    try {
                      await confirm({ variant: 'destructive', title: 'Delete File', content: `Delete "${f.name}"? This cannot be undone.`, confirmationLabel: 'Delete' });
                      setFiles(prev => prev.filter(x => x.id !== f.id));
                    } catch { /* cancelled */ }
                  }
                }}>
                  <ActionMenu.Item id="download">Download</ActionMenu.Item>
                  <ActionMenu.Item id="rename">Rename</ActionMenu.Item>
                  <ActionMenu.Item id="delete">Delete</ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={4}>
      <Headline level={1}>Team Settings</Headline>
      <Tabs aria-label="Settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField label="Team Name" value={teamName} onChange={setTeamName} />
            <TextArea label="Description" value={teamDesc} onChange={setTeamDesc} rows={3} />
            <Select label="Default Timezone" selectedKey={timezone} onSelectionChange={k => setTimezone(k as string)} width="fit">
              <Select.Option key="UTC" id="UTC">UTC</Select.Option>
              <Select.Option key="CET" id="CET">CET</Select.Option>
              <Select.Option key="EST" id="EST">EST</Select.Option>
              <Select.Option key="PST" id="PST">PST</Select.Option>
            </Select>
            <Select label="Date Format" selectedKey={dateFormat} onSelectionChange={k => setDateFormat(k as string)} width="fit">
              <Select.Option key="MM/DD/YYYY" id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option key="DD.MM.YYYY" id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option key="YYYY-MM-DD" id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button variant="primary" onPress={() => addToast({ title: 'Settings updated.', variant: 'success' })}>Save</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {([
              { k: 'newMember' as const, label: 'New member joins', desc: 'Get notified when someone joins the team' },
              { k: 'projectDeadline' as const, label: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
              { k: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of team activity every Monday' },
              { k: 'mentions' as const, label: 'Mention notifications', desc: 'When someone mentions you in a comment' },
              { k: 'calendarReminders' as const, label: 'Calendar reminders', desc: '15 minutes before scheduled events' },
            ]).map(({ k, label, desc }) => (
              <Inline key={k} space={4} alignY="top" alignX="between">
                <Stack space={1}>
                  <Text weight="bold">{label}</Text>
                  <Text size="sm">{desc}</Text>
                </Stack>
                <Switch label={label} selected={notifs[k]} onChange={v => setNotifs(p => ({ ...p, [k]: v }))} />
              </Inline>
            ))}
            <Button variant="primary" onPress={() => addToast({ title: 'Preferences saved.', variant: 'success' })}>Save Preferences</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="280px" space={4} stretch>
            {([
              { key: 'slack' as const, name: 'Slack', desc: 'Team communication and notifications.' },
              { key: 'github' as const, name: 'GitHub', desc: 'Code repository and version control.' },
              { key: 'jira' as const, name: 'Jira', desc: 'Issue tracking and project management.' },
            ]).map(({ key, name, desc }) => (
              <Card key={key}>
                <Inset spaceX={4} spaceY={4}>
                  <Stack space={3}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">{name}</Text>
                      <Badge variant={integrations[key] ? 'success' : 'default'}>{integrations[key] ? 'Connected' : 'Not Connected'}</Badge>
                    </Inline>
                    <Text size="sm">{desc}</Text>
                    <Button
                      variant={integrations[key] ? 'destructive' : 'primary'}
                      size="small"
                      onPress={() => handleIntegrationToggle(key)}
                    >
                      {integrations[key] ? 'Disconnect' : 'Connect'}
                    </Button>
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const pageContent: Record<string, () => JSX.Element> = {
    dashboard: renderDashboard,
    members: renderMembers,
    projects: renderProjects,
    calendar: renderCalendar,
    files: renderFiles,
    settings: renderSettings,
  };

  return (
    <RouterProvider navigate={navigate}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">{teamName}</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={`/${currentPage}`}>
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
                <Breadcrumbs.Item href={`/${currentPage}`}>{PAGE_TITLES[currentPage] ?? currentPage}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={key => {
                      if (key === 'signout') addToast({ title: 'Signed out', variant: 'info' });
                      else if (key === 'profile') addToast({ title: 'Profile opened', variant: 'info' });
                      else if (key === 'preferences') addToast({ title: 'Preferences opened', variant: 'info' });
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
                    Use the sidebar to navigate between sections.
                  </ContextualHelp.Content>
                </ContextualHelp>
              </Inline>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset spaceX={6} spaceY={6}>
              {(pageContent[currentPage] ?? renderDashboard)()}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
}

const TestApp = () => (
  <ConfirmationProvider>
    <ToastProvider position="bottom-right" />
    <TeamHubInner />
  </ConfirmationProvider>
);

export default TestApp;
