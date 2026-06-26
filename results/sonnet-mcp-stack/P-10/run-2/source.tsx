import { useState, useMemo } from 'react';
import {
  ActionMenu,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Columns,
  ContextualHelp,
  Dialog,
  Headline,
  Inline,
  Inset,
  Menu,
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
  TextField,
  TextArea,
  Tiles,
  Tooltip,
  ToastProvider,
  useConfirmation,
  useToast,
  TopNavigation,
} from '@marigold/components';

// --- Types ---
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
  sizeBytes: number;
  uploadedBy: string;
  date: string;
}

interface NotifSettings {
  newMember: boolean;
  deadline: boolean;
  digest: boolean;
  mention: boolean;
  calendar: boolean;
}

// --- Initial Data ---
const INIT_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: '2024-01-15', bio: 'Full-stack developer with 5 years of experience.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.io', status: 'Active', joined: '2024-03-01', bio: 'UX designer passionate about accessible interfaces.' },
  { id: '3', name: 'Carol Davis', role: 'Manager', email: 'carol@teamhub.io', status: 'Active', joined: '2023-09-10', bio: 'Project manager with a background in agile methodologies.' },
  { id: '4', name: 'David Lee', role: 'Developer', email: 'david@teamhub.io', status: 'On Leave', joined: '2024-06-01', bio: 'Frontend specialist focusing on React and TypeScript.' },
  { id: '5', name: 'Eva Martinez', role: 'Designer', email: 'eva@teamhub.io', status: 'Active', joined: '2024-02-20', bio: 'Visual designer with expertise in brand identity.' },
  { id: '6', name: 'Frank Wilson', role: 'Developer', email: 'frank@teamhub.io', status: 'Active', joined: '2023-11-05', bio: 'Backend engineer specializing in cloud infrastructure.' },
];

const INIT_PROJECTS: Project[] = [
  { id: 'p1', name: 'Project Alpha', lead: 'Alice Johnson', members: 4, deadline: '2026-07-15', progress: 75, status: 'Active' },
  { id: 'p2', name: 'Design System', lead: 'Bob Smith', members: 3, deadline: '2026-08-30', progress: 45, status: 'Active' },
  { id: 'p3', name: 'Mobile App', lead: 'Carol Davis', members: 5, deadline: '2026-06-30', progress: 90, status: 'Active' },
  { id: 'p4', name: 'API Refactor', lead: 'Frank Wilson', members: 2, deadline: '2026-09-15', progress: 20, status: 'On Hold' },
  { id: 'p5', name: 'Q1 Dashboard', lead: 'Eva Martinez', members: 3, deadline: '2026-05-01', progress: 100, status: 'Completed' },
];

const INIT_FILES: FileItem[] = [
  { id: 'f1', name: 'Q2 Report.pdf', type: 'Documents', sizeBytes: 2400000, uploadedBy: 'Carol Davis', date: '2026-06-01' },
  { id: 'f2', name: 'Brand Guide.figma', type: 'Documents', sizeBytes: 8700000, uploadedBy: 'Bob Smith', date: '2026-05-28' },
  { id: 'f3', name: 'Team Photo.jpg', type: 'Images', sizeBytes: 3200000, uploadedBy: 'Eva Martinez', date: '2026-05-20' },
  { id: 'f4', name: 'Budget 2026.xlsx', type: 'Spreadsheets', sizeBytes: 450000, uploadedBy: 'Carol Davis', date: '2026-05-15' },
  { id: 'f5', name: 'Product Roadmap.pdf', type: 'Documents', sizeBytes: 1800000, uploadedBy: 'Alice Johnson', date: '2026-05-10' },
];

const ACTIVITY = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'Project Alpha', date: '2026-06-01' },
  { id: 'a2', member: 'Bob Smith', action: 'Review', project: 'Design System', date: '2026-05-31' },
  { id: 'a3', member: 'Carol Davis', action: 'Deploy', project: 'Mobile App', date: '2026-05-30' },
  { id: 'a4', member: 'Frank Wilson', action: 'Commit', project: 'API Refactor', date: '2026-05-28' },
  { id: 'a5', member: 'Eva Martinez', action: 'Review', project: 'Q1 Dashboard', date: '2026-05-27' },
];

// Calendar – June 2026, day=1 is Monday
const CAL_EVENTS = [
  { id: 'e1', day: 3, name: 'Team Standup', type: 'Meeting' as const },
  { id: 'e2', day: 12, name: 'Q2 Review', type: 'Meeting' as const },
  { id: 'e3', day: 18, name: 'Summer Party', type: 'Social' as const },
  { id: 'e4', day: 30, name: 'Alpha Deadline', type: 'Deadline' as const },
];

// June 2026 weeks (0 = empty cell)
const CAL_WEEKS = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 0, 0, 0, 0, 0],
];

const CAL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// --- Helpers ---
const fmt = (s: string) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(s));

const fmtNum = (n: number) => new Intl.NumberFormat('en-US').format(n);

const fmtBytes = (b: number) => {
  if (b >= 1_000_000) return `${(b / 1_000_000).toFixed(1)} MB`;
  if (b >= 1_000) return `${(b / 1_000).toFixed(0)} KB`;
  return `${b} B`;
};

const statusVariant = (s: string): 'success' | 'warning' | 'info' | 'default' => {
  if (s === 'Active' || s === 'Completed') return 'success';
  if (s === 'On Leave' || s === 'On Hold') return 'warning';
  return 'default';
};

const actionVariant = (a: string): 'success' | 'warning' | 'info' | 'default' => {
  if (a === 'Commit') return 'info';
  if (a === 'Review') return 'warning';
  if (a === 'Deploy') return 'success';
  return 'default';
};

const eventVariant = (t: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
  if (t === 'Meeting') return 'info';
  if (t === 'Social') return 'success';
  if (t === 'Deadline') return 'error';
  return 'default';
};

const capRole = (r: string) =>
  ({ developer: 'Developer', designer: 'Designer', manager: 'Manager', qa: 'QA' })[r] ?? r;

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

// ============================================================
// Dashboard
// ============================================================
function DashboardPage({ members }: { members: Member[] }) {
  return (
    <Stack space={6}>
      <Headline level={2}>Team Overview</Headline>
      <Tiles tilesWidth="200px" space={4} stretch>
        <Card p={4}>
          <Stack space={1}>
            <Text color="muted-foreground" size="sm">Members</Text>
            <Headline level={3}>{fmtNum(members.length)}</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={1}>
            <Text color="muted-foreground" size="sm">Active Projects</Text>
            <Headline level={3}>5</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={1}>
            <Text color="muted-foreground" size="sm">Upcoming Deadlines</Text>
            <Headline level={3}>8</Headline>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={1}>
            <Inline space={1} alignY="center">
              <Text color="muted-foreground" size="sm">Hours This Week</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" size="icon" aria-label="Hours info">ℹ</Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={3}>{fmtNum(342)}</Headline>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level={4}>Recent Activity</Headline>
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
                <Table.Cell>
                  <Badge variant={actionVariant(row.action)}>{row.action}</Badge>
                </Table.Cell>
                <Table.Cell>{row.project}</Table.Cell>
                <Table.Cell>{fmt(row.date)}</Table.Cell>
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
}

// ============================================================
// Members
// ============================================================
interface MembersPageProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  viewMode: 'table' | 'cards';
  setViewMode: (v: 'table' | 'cards') => void;
}

function MembersPage({ members, setMembers, viewMode, setViewMode }: MembersPageProps) {
  const confirm = useConfirmation();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'developer', startDate: '', bio: '' });

  const filtered = useMemo(() => {
    return members.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || m.role.toLowerCase() === roleFilter;
      return matchSearch && matchRole;
    });
  }, [members, search, roleFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', role: 'developer', startDate: '', bio: '' });
    setDialogOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({ name: m.name, email: m.email, role: m.role.toLowerCase(), startDate: m.joined, bio: m.bio });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editing) {
      setMembers(prev => prev.map(m => m.id === editing.id
        ? { ...m, name: form.name, email: form.email, role: capRole(form.role), joined: form.startDate || m.joined, bio: form.bio }
        : m));
      if (selectedMember?.id === editing.id) {
        setSelectedMember(m => m ? { ...m, name: form.name, email: form.email, role: capRole(form.role), joined: form.startDate || m.joined, bio: form.bio } : null);
      }
    } else {
      const newM: Member = {
        id: String(Date.now()),
        name: form.name,
        email: form.email,
        role: capRole(form.role),
        status: 'Active',
        joined: form.startDate || new Date().toISOString().split('T')[0],
        bio: form.bio,
      };
      setMembers(prev => [...prev, newM]);
    }
    setDialogOpen(false);
  };

  const handleRemove = async (id: string) => {
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

  const listContent = (
    <Stack space={4}>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search members"
          placeholder="Search by name…"
          value={search}
          onChange={setSearch}
        />
        <Select
          aria-label="Filter by role"
          selectedKey={roleFilter}
          onSelectionChange={k => setRoleFilter(String(k))}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="developer">Developer</Select.Option>
          <Select.Option id="designer">Designer</Select.Option>
          <Select.Option id="manager">Manager</Select.Option>
        </Select>
        <Button variant={viewMode === 'table' ? 'primary' : 'secondary'} onPress={() => setViewMode('table')}>Table</Button>
        <Button variant={viewMode === 'cards' ? 'primary' : 'secondary'} onPress={() => setViewMode('cards')}>Cards</Button>
        <Button variant="primary" onPress={openAdd}>Add Member</Button>
      </Inline>

      {viewMode === 'table' ? (
        <Table
          aria-label="Team Members"
          selectionMode="single"
          onSelectionChange={keys => {
            if (keys === 'all') return;
            const id = [...keys][0] as string | undefined;
            setSelectedMember(id ? (members.find(m => m.id === id) ?? null) : null);
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
            {filtered.map(m => (
              <Table.Row key={m.id}>
                <Table.Cell>{m.name}</Table.Cell>
                <Table.Cell>{m.role}</Table.Cell>
                <Table.Cell>{m.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant(m.status)}>{m.status}</Badge>
                </Table.Cell>
                <Table.Cell>{fmt(m.joined)}</Table.Cell>
                <Table.Cell>
                  <Inline space={2}>
                    <Button size="small" variant="secondary" onPress={() => openEdit(m)}>Edit</Button>
                    <Button size="small" variant="destructive-ghost" onPress={() => handleRemove(m.id)}>Remove</Button>
                  </Inline>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="260px" space={4} stretch>
          {filtered.map(m => (
            <Card key={m.id} p={4}>
              <Stack space={3}>
                <Stack space={1}>
                  <Button variant="link" onPress={() => setSelectedMember(m)}>
                    <Text weight="bold">{m.name}</Text>
                  </Button>
                  <Badge variant={actionVariant(m.role === 'Developer' ? 'Commit' : m.role === 'Designer' ? 'Review' : 'Deploy')}>
                    {m.role}
                  </Badge>
                </Stack>
                <Text size="sm" color="muted-foreground">{m.email}</Text>
                <Inline space={2}>
                  <Button size="small" variant="secondary" onPress={() => alert(`Message ${m.name}`)}>Message</Button>
                  <Button size="small" variant="ghost" onPress={() => setSelectedMember(m)}>Profile</Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}
    </Stack>
  );

  return (
    <Stack space={4}>
      <Headline level={2}>Team Members</Headline>

      {selectedMember ? (
        <Columns columns={[6, 4]} space={6}>
          {listContent}
          <Card p={4}>
            <Stack space={4}>
              <Inline alignX="between" alignY="top">
                <Headline level={4}>{selectedMember.name}</Headline>
                <Button variant="ghost" size="small" onPress={() => setSelectedMember(null)}>✕</Button>
              </Inline>
              <Stack space={2}>
                <Text weight="bold">Role</Text>
                <Badge variant={statusVariant(selectedMember.status)}>{selectedMember.role}</Badge>
              </Stack>
              <Stack space={2}>
                <Text weight="bold">Email</Text>
                <Text>{selectedMember.email}</Text>
              </Stack>
              <Stack space={2}>
                <Text weight="bold">Status</Text>
                <Badge variant={statusVariant(selectedMember.status)}>{selectedMember.status}</Badge>
              </Stack>
              <Stack space={2}>
                <Text weight="bold">Joined</Text>
                <Text>{fmt(selectedMember.joined)}</Text>
              </Stack>
              {selectedMember.bio && (
                <Stack space={2}>
                  <Text weight="bold">Bio</Text>
                  <Text>{selectedMember.bio}</Text>
                </Stack>
              )}
              <Inline space={2}>
                <Button size="small" variant="secondary" onPress={() => openEdit(selectedMember)}>Edit</Button>
                <Button size="small" variant="destructive-ghost" onPress={() => handleRemove(selectedMember.id)}>Remove</Button>
              </Inline>
            </Stack>
          </Card>
        </Columns>
      ) : listContent}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} size="small" closeButton>
        {({ close }) => (
          <>
            <Dialog.Title>{editing ? 'Edit Member' : 'Add Member'}</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  value={form.name}
                  onChange={v => setForm(p => ({ ...p, name: v }))}
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={v => setForm(p => ({ ...p, email: v }))}
                  required
                />
                <Select
                  label="Role"
                  selectedKey={form.role}
                  onSelectionChange={k => setForm(p => ({ ...p, role: String(k) }))}
                >
                  <Select.Option id="developer">Developer</Select.Option>
                  <Select.Option id="designer">Designer</Select.Option>
                  <Select.Option id="manager">Manager</Select.Option>
                  <Select.Option id="qa">QA</Select.Option>
                </Select>
                <TextField
                  label="Start Date"
                  type="date"
                  value={form.startDate}
                  onChange={v => setForm(p => ({ ...p, startDate: v }))}
                />
                <TextArea
                  label="Bio"
                  value={form.bio}
                  onChange={v => setForm(p => ({ ...p, bio: v }))}
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => { handleSubmit(); if (form.name.trim() && form.email.trim()) close(); }}>
                {editing ? 'Save' : 'Add'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

// ============================================================
// Projects
// ============================================================
function ProjectsPage() {
  const confirm = useConfirmation();
  const [projects, setProjects] = useState<Project[]>(INIT_PROJECTS);
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const handleArchive = async () => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Archive Selected',
        content: `Archive ${selectedKeys.size} selected project(s)?`,
        confirmationLabel: 'Archive',
      });
      setProjects(prev => prev.filter(p => !selectedKeys.has(p.id)));
      setSelectedKeys(new Set());
    } catch { /* cancelled */ }
  };

  return (
    <Stack space={4}>
      <Headline level={2}>Projects</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects…"
          value={search}
          onChange={setSearch}
        />
        <Button variant="primary" onPress={() => alert('New project dialog')}>New Project</Button>
      </Inline>

      {selectedKeys.size > 0 && (
        <Card p={3}>
          <Inline space={3} alignY="center">
            <Text>{selectedKeys.size} selected</Text>
            <Button variant="secondary" onPress={handleArchive}>Archive Selected</Button>
            <Button variant="secondary" onPress={() => { alert('Exporting…'); setSelectedKeys(new Set()); }}>Export</Button>
          </Inline>
        </Card>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={keys => {
          if (keys === 'all') {
            setSelectedKeys(new Set(filtered.map(p => p.id)));
          } else {
            setSelectedKeys(new Set(keys as Iterable<string>));
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
          {filtered.map(p => (
            <Table.Row key={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>{fmt(p.deadline)}</Table.Cell>
              <Table.Cell>{p.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// ============================================================
// Calendar
// ============================================================
function CalendarPage() {
  const eventsByDay = useMemo(() => {
    const map: Record<number, typeof CAL_EVENTS> = {};
    CAL_EVENTS.forEach(e => {
      if (!map[e.day]) map[e.day] = [];
      map[e.day].push(e);
    });
    return map;
  }, []);

  return (
    <Stack space={6}>
      <Headline level={2}>Team Calendar</Headline>
      <Card p={4}>
        <Stack space={3}>
          <Headline level={4}>June 2026</Headline>
          <Columns columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
            {CAL_DAYS.map(d => (
              <Card key={d} p={2}>
                <Text weight="bold" size="sm">{d}</Text>
              </Card>
            ))}
          </Columns>
          {CAL_WEEKS.map((week, wi) => (
            <Columns key={wi} columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
              {week.map((day, di) => (
                <Card key={di} p={2}>
                  <Stack space={1}>
                    {day > 0 ? (
                      <>
                        <Text size="sm">{day}</Text>
                        {(eventsByDay[day] ?? []).map(e => (
                          <Badge key={e.id} variant={eventVariant(e.type)}>
                            {e.name}
                          </Badge>
                        ))}
                      </>
                    ) : (
                      <Text size="sm" color="muted-foreground"> </Text>
                    )}
                  </Stack>
                </Card>
              ))}
            </Columns>
          ))}
        </Stack>
      </Card>

      <Stack space={3}>
        <Headline level={4}>Upcoming Events</Headline>
        {CAL_EVENTS.map(e => (
          <Card key={e.id} p={3}>
            <Inline space={3} alignY="center">
              <Text weight="bold">June {e.day}, 2026</Text>
              <Text>{e.name}</Text>
              <Badge variant={eventVariant(e.type)}>{e.type}</Badge>
            </Inline>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}

// ============================================================
// Files
// ============================================================
function FilesPage() {
  const { addToast } = useToast();
  const [files, setFiles] = useState<FileItem[]>(INIT_FILES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('documents');

  const filtered = useMemo(() => {
    return files.filter(f => {
      const matchS = f.name.toLowerCase().includes(search.toLowerCase());
      const matchT = typeFilter === 'all' || f.type.toLowerCase() === typeFilter;
      return matchS && matchT;
    });
  }, [files, search, typeFilter]);

  const handleUpload = () => {
    const newFiles: FileItem[] = [
      { id: String(Date.now()), name: 'New Document.pdf', type: 'Documents', sizeBytes: 1200000, uploadedBy: 'John Doe', date: new Date().toISOString().split('T')[0] },
      { id: String(Date.now() + 1), name: 'New Spreadsheet.xlsx', type: 'Spreadsheets', sizeBytes: 320000, uploadedBy: 'John Doe', date: new Date().toISOString().split('T')[0] },
    ];
    setFiles(prev => [...prev, ...newFiles]);
    setUploadOpen(false);
    setUploadDesc('');
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  return (
    <Stack space={4}>
      <Headline level={2}>Shared Files</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search files"
          placeholder="Search files…"
          value={search}
          onChange={setSearch}
        />
        <Select
          aria-label="Filter by type"
          selectedKey={typeFilter}
          onSelectionChange={k => setTypeFilter(String(k))}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="documents">Documents</Select.Option>
          <Select.Option id="images">Images</Select.Option>
          <Select.Option id="spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>Upload</Button>
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
          {filtered.map(f => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>{fmtBytes(f.sizeBytes)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>{fmt(f.date)}</Table.Cell>
              <Table.Cell>
                <ActionMenu aria-label={`Actions for ${f.name}`}>
                  <Menu.Item id="download" onAction={() => alert(`Downloading ${f.name}`)}>Download</Menu.Item>
                  <Menu.Item id="rename" onAction={() => alert(`Renaming ${f.name}`)}>Rename</Menu.Item>
                  <Menu.Item id="delete" variant="destructive" onAction={() => setFiles(p => p.filter(x => x.id !== f.id))}>Delete</Menu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen} size="small" closeButton>
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <Card p={4}>
                  <Stack space={2} alignX="center">
                    <Text color="muted-foreground">Click Upload to add sample files</Text>
                    <Text size="sm" color="muted-foreground">(Accepts multiple files)</Text>
                  </Stack>
                </Card>
                <TextField
                  label="Description"
                  value={uploadDesc}
                  onChange={setUploadDesc}
                  placeholder="Optional description…"
                />
                <Select
                  label="Category"
                  selectedKey={uploadCategory}
                  onSelectionChange={k => setUploadCategory(String(k))}
                >
                  <Select.Option id="documents">Documents</Select.Option>
                  <Select.Option id="images">Images</Select.Option>
                  <Select.Option id="spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={handleUpload}>Upload</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

// ============================================================
// Settings
// ============================================================
interface SettingsPageProps {
  teamName: string;
  setTeamName: (n: string) => void;
}

function SettingsPage({ teamName, setTeamName }: SettingsPageProps) {
  const { addToast } = useToast();
  const confirm = useConfirmation();
  const [localName, setLocalName] = useState(teamName);
  const [description, setDescription] = useState('A collaborative team workspace.');
  const [timezone, setTimezone] = useState('cet');
  const [dateFormat, setDateFormat] = useState('iso');
  const [notifs, setNotifs] = useState<NotifSettings>({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', description: 'Team messaging and collaboration.', connected: true },
    { id: 'github', name: 'GitHub', description: 'Version control and code review.', connected: false },
    { id: 'jira', name: 'Jira', description: 'Issue tracking and project management.', connected: false },
  ]);

  const handleSaveGeneral = () => {
    setTeamName(localName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const handleSaveNotifs = () => {
    addToast({ title: 'Notification preferences saved.', variant: 'success' });
  };

  const handleIntegrationToggle = async (id: string, connected: boolean) => {
    if (connected) {
      try {
        await confirm({
          variant: 'destructive',
          title: 'Disconnect Integration',
          content: 'Are you sure you want to disconnect this integration?',
          confirmationLabel: 'Disconnect',
        });
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false } : i));
      } catch { /* cancelled */ }
    } else {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i));
    }
  };

  return (
    <Stack space={4}>
      <Headline level={2}>Team Settings</Headline>
      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Inset spaceY={4}>
            <Stack space={4}>
              <TextField
                label="Team Name"
                value={localName}
                onChange={setLocalName}
              />
              <TextField
                label="Description"
                value={description}
                onChange={setDescription}
              />
              <Select
                label="Default Timezone"
                selectedKey={timezone}
                onSelectionChange={k => setTimezone(String(k))}
              >
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={dateFormat}
                onSelectionChange={k => setDateFormat(String(k))}
              >
                <Select.Option id="mdy">MM/DD/YYYY</Select.Option>
                <Select.Option id="dmy">DD.MM.YYYY</Select.Option>
                <Select.Option id="iso">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" onPress={handleSaveGeneral}>Save</Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Inset spaceY={4}>
            <Stack space={4}>
              <Stack space={3}>
                <Switch
                  label="New member joins"
                  description="Get notified when someone joins the team"
                  selected={notifs.newMember}
                  onChange={v => setNotifs(p => ({ ...p, newMember: v }))}
                />
                <Switch
                  label="Project deadline approaching"
                  description="Reminder 3 days before deadline"
                  selected={notifs.deadline}
                  onChange={v => setNotifs(p => ({ ...p, deadline: v }))}
                />
                <Switch
                  label="Weekly digest"
                  description="Summary of team activity every Monday"
                  selected={notifs.digest}
                  onChange={v => setNotifs(p => ({ ...p, digest: v }))}
                />
                <Switch
                  label="Mention notifications"
                  description="When someone mentions you in a comment"
                  selected={notifs.mention}
                  onChange={v => setNotifs(p => ({ ...p, mention: v }))}
                />
                <Switch
                  label="Calendar reminders"
                  description="15 minutes before scheduled events"
                  selected={notifs.calendar}
                  onChange={v => setNotifs(p => ({ ...p, calendar: v }))}
                />
              </Stack>
              <Button variant="primary" onPress={handleSaveNotifs}>Save Preferences</Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Inset spaceY={4}>
            <Tiles tilesWidth="220px" space={4} stretch>
              {integrations.map(intg => (
                <Card key={intg.id} p={4}>
                  <Stack space={3}>
                    <Inline alignX="between" alignY="center">
                      <Text weight="bold">{intg.name}</Text>
                      <Badge variant={intg.connected ? 'success' : 'default'}>
                        {intg.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </Inline>
                    <Text size="sm" color="muted-foreground">{intg.description}</Text>
                    <Button
                      variant={intg.connected ? 'destructive-ghost' : 'secondary'}
                      onPress={() => handleIntegrationToggle(intg.id, intg.connected)}
                    >
                      {intg.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Tiles>
          </Inset>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ============================================================
// Main App
// ============================================================
const TestApp = () => {
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [members, setMembers] = useState<Member[]>(INIT_MEMBERS);
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'cards'>('table');
  const [teamName, setTeamName] = useState('TeamHub');

  const handleNavigate = (path: string) => {
    if (path === '/' || path === '') path = '/dashboard';
    setCurrentPage(path);
  };

  const pageLabel = PAGE_LABELS[currentPage] ?? '';

  return (
    <RouterProvider navigate={handleNavigate}>
      <ToastProvider position="bottom-right" />
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">{teamName}</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={currentPage}>
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
                <Breadcrumbs.Item href={currentPage}>{pageLabel}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={key => alert(`Action: ${key}`)}
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
                    <Text>Use the sidebar to navigate between sections.</Text>
                  </ContextualHelp.Content>
                </ContextualHelp>
              </Inline>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              {currentPage === '/dashboard' && (
                <DashboardPage members={members} />
              )}
              {currentPage === '/members' && (
                <MembersPage
                  members={members}
                  setMembers={setMembers}
                  viewMode={memberViewMode}
                  setViewMode={setMemberViewMode}
                />
              )}
              {currentPage === '/projects' && <ProjectsPage />}
              {currentPage === '/calendar' && <CalendarPage />}
              {currentPage === '/files' && <FilesPage />}
              {currentPage === '/settings' && (
                <SettingsPage teamName={teamName} setTeamName={setTeamName} />
              )}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
};

export default TestApp;
