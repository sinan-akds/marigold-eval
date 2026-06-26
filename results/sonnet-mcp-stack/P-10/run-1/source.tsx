import { useState } from 'react';
import {
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
  Tooltip,
  ToastProvider,
  TopNavigation,
  useConfirmation,
  useToast,
} from '@marigold/components';

// ─── Types ────────────────────────────────────────────────────────────────────

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

type ProjectStatus = 'Active' | 'On Hold' | 'Completed';

interface Project {
  id: string;
  name: string;
  lead: string;
  members: number;
  deadline: Date;
  progress: number;
  status: ProjectStatus;
}

type FileType = 'Document' | 'Image' | 'Spreadsheet';

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedBy: string;
  date: Date;
}

interface Activity {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialMembers: Member[] = [
  { id: 'm1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: new Date('2024-03-15'), bio: 'Full-stack developer with 5 years experience.' },
  { id: 'm2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.io', status: 'Active', joined: new Date('2024-05-01'), bio: 'UI/UX designer passionate about accessibility.' },
  { id: 'm3', name: 'Carol Davis', role: 'Manager', email: 'carol@teamhub.io', status: 'Active', joined: new Date('2023-11-10'), bio: 'Project manager with a background in agile.' },
  { id: 'm4', name: 'David Wilson', role: 'Developer', email: 'david@teamhub.io', status: 'On Leave', joined: new Date('2024-01-20'), bio: 'Backend engineer specializing in distributed systems.' },
  { id: 'm5', name: 'Emma Brown', role: 'QA', email: 'emma@teamhub.io', status: 'Active', joined: new Date('2024-07-08'), bio: 'QA engineer with expertise in automated testing.' },
  { id: 'm6', name: 'Frank Miller', role: 'Designer', email: 'frank@teamhub.io', status: 'Active', joined: new Date('2023-09-22'), bio: 'Visual designer focused on brand identity.' },
];

const initialProjects: Project[] = [
  { id: 'p1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: new Date('2026-07-15'), progress: 75, status: 'Active' },
  { id: 'p2', name: 'Mobile App', lead: 'Bob Smith', members: 3, deadline: new Date('2026-06-30'), progress: 45, status: 'Active' },
  { id: 'p3', name: 'API Integration', lead: 'Carol Davis', members: 5, deadline: new Date('2026-06-25'), progress: 90, status: 'Active' },
  { id: 'p4', name: 'Design System', lead: 'Emma Brown', members: 2, deadline: new Date('2026-08-01'), progress: 30, status: 'On Hold' },
  { id: 'p5', name: 'Data Analytics', lead: 'Frank Miller', members: 6, deadline: new Date('2026-07-20'), progress: 100, status: 'Completed' },
];

const initialFiles: FileItem[] = [
  { id: 'f1', name: 'Q2 Report.pdf', type: 'Document', size: 2516582, uploadedBy: 'Alice Johnson', date: new Date('2026-06-10') },
  { id: 'f2', name: 'Brand Assets.zip', type: 'Image', size: 16357785, uploadedBy: 'Bob Smith', date: new Date('2026-06-12') },
  { id: 'f3', name: 'Budget 2026.xlsx', type: 'Spreadsheet', size: 524288, uploadedBy: 'Carol Davis', date: new Date('2026-06-15') },
  { id: 'f4', name: 'Architecture Diagram.png', type: 'Image', size: 3355443, uploadedBy: 'David Wilson', date: new Date('2026-06-18') },
  { id: 'f5', name: 'Project Plan.docx', type: 'Document', size: 911360, uploadedBy: 'Emma Brown', date: new Date('2026-06-20') },
];

const recentActivity: Activity[] = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'Website Redesign', date: new Date('2026-05-28') },
  { id: 'a2', member: 'Bob Smith', action: 'Review', project: 'Mobile App', date: new Date('2026-05-30') },
  { id: 'a3', member: 'Carol Davis', action: 'Deploy', project: 'API Integration', date: new Date('2026-06-01') },
  { id: 'a4', member: 'David Wilson', action: 'Commit', project: 'Data Analytics', date: new Date('2026-06-05') },
  { id: 'a5', member: 'Emma Brown', action: 'Review', project: 'Design System', date: new Date('2026-06-10') },
];

const calendarEvents: Record<number, { name: string; type: 'Meeting' | 'Deadline' | 'Social' }[]> = {
  16: [{ name: 'Team Standup', type: 'Meeting' }],
  20: [{ name: 'Design Review', type: 'Meeting' }],
  23: [{ name: 'Sprint Review', type: 'Meeting' }],
  25: [{ name: 'Project Alpha Deadline', type: 'Deadline' }],
};

const upcomingEvents = [
  { date: new Date('2026-06-23'), name: 'Sprint Review', type: 'Meeting' as const },
  { date: new Date('2026-06-25'), name: 'Project Alpha Deadline', type: 'Deadline' as const },
  { date: new Date('2026-06-27'), name: 'Team Lunch', type: 'Social' as const },
  { date: new Date('2026-07-02'), name: 'Q3 Planning', type: 'Meeting' as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 100;
const genId = () => String(++nextId);

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const fmtShortDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const fmtFileSize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000).toFixed(0)} KB`;
};

const statusVariant = (s: MemberStatus): 'success' | 'warning' =>
  s === 'Active' ? 'success' : 'warning';

const projectStatusVariant = (s: ProjectStatus): 'success' | 'warning' | 'info' => {
  if (s === 'Active') return 'info';
  if (s === 'On Hold') return 'warning';
  return 'success';
};

const actionVariant = (a: string): 'info' | 'warning' | 'success' => {
  if (a === 'Commit') return 'info';
  if (a === 'Review') return 'warning';
  return 'success';
};

const eventVariant = (t: string): 'info' | 'error' | 'success' => {
  if (t === 'Meeting') return 'info';
  if (t === 'Deadline') return 'error';
  return 'success';
};

const pageLabel: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

// ─── Calendar weeks for June 2026 (starts Monday) ─────────────────────────────
const calendarWeeks: (number | null)[][] = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, null, null, null, null],
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage({ members }: { members: Member[] }) {
  return (
    <Stack space={8}>
      <Headline level={1}>Team Overview</Headline>

      <Columns columns={[1, 1, 1, 1]} space={4}>
        <Card p={6}>
          <Stack space={2}>
            <Text color="text-primary-muted">Members</Text>
            <Headline level={2}>{members.length}</Headline>
          </Stack>
        </Card>

        <Card p={6}>
          <Stack space={2}>
            <Text color="text-primary-muted">Active Projects</Text>
            <Headline level={2}>5</Headline>
          </Stack>
        </Card>

        <Card p={6}>
          <Stack space={2}>
            <Text color="text-primary-muted">Upcoming Deadlines</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>

        <Card p={6}>
          <Stack space={2}>
            <Inline space={2} alignY="center">
              <Text color="text-primary-muted">Hours This Week</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" size="icon" aria-label="Hours info">ℹ</Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={2}>
              <NumericFormat value={342} />
            </Headline>
          </Stack>
        </Card>
      </Columns>

      <Stack space={4}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity" selectionMode="none">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {recentActivity.map(a => (
              <Table.Row key={a.id} id={a.id}>
                <Table.Cell>{a.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={actionVariant(a.action)}>{a.action}</Badge>
                </Table.Cell>
                <Table.Cell>{a.project}</Table.Cell>
                <Table.Cell>{fmtShortDate(a.date)}</Table.Cell>
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
}

// ─── Member Form Fields (defined outside page to avoid remounting) ────────────

interface MemberFormState {
  name: string;
  email: string;
  role: Role;
  startDate: string;
  bio: string;
}

interface MemberFormFieldsProps {
  form: MemberFormState;
  setForm: (fn: (prev: MemberFormState) => MemberFormState) => void;
}

function MemberFormFields({ form, setForm }: MemberFormFieldsProps) {
  return (
    <Stack space={4}>
      <TextField label="Full Name" required value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
      <TextField label="Email" type="email" required value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
      <Select label="Role" selectedKey={form.role} onSelectionChange={k => setForm(f => ({ ...f, role: String(k) as Role }))}>
        <Select.Option id="Developer">Developer</Select.Option>
        <Select.Option id="Designer">Designer</Select.Option>
        <Select.Option id="Manager">Manager</Select.Option>
        <Select.Option id="QA">QA</Select.Option>
      </Select>
      <TextField label="Start Date" value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} placeholder="YYYY-MM-DD" />
      <TextArea label="Bio" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} />
    </Stack>
  );
}

// ─── Member Detail Panel ──────────────────────────────────────────────────────

function MemberDetail({ member, onClose }: { member: Member; onClose: () => void }) {
  return (
    <Card p={6}>
      <Stack space={4}>
        <Inline alignX="between" alignY="center" space={2}>
          <Headline level={3}>{member.name}</Headline>
          <Button variant="ghost" size="icon" aria-label="Close panel" onPress={onClose}>✕</Button>
        </Inline>
        <Badge variant={statusVariant(member.status)}>{member.status}</Badge>
        <Stack space={2}>
          <Text weight="bold">Role</Text>
          <Text>{member.role}</Text>
        </Stack>
        <Stack space={2}>
          <Text weight="bold">Email</Text>
          <Text>{member.email}</Text>
        </Stack>
        <Stack space={2}>
          <Text weight="bold">Joined</Text>
          <Text>{fmtDate(member.joined)}</Text>
        </Stack>
        <Stack space={2}>
          <Text weight="bold">Bio</Text>
          <Text>{member.bio}</Text>
        </Stack>
      </Stack>
    </Card>
  );
}

// ─── Members Page ─────────────────────────────────────────────────────────────

interface MembersPageProps {
  members: Member[];
  setMembers: (fn: (prev: Member[]) => Member[]) => void;
  memberView: 'table' | 'cards';
  setMemberView: (v: 'table' | 'cards') => void;
}

function MembersPage({ members, setMembers, memberView, setMemberView }: MembersPageProps) {
  const confirm = useConfirmation();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const emptyForm: MemberFormState = { name: '', email: '', role: 'Developer', startDate: '', bio: '' };
  const [form, setForm] = useState<MemberFormState>(emptyForm);

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => { setForm(emptyForm); setAddOpen(true); };

  const openEdit = (m: Member) => {
    setEditingMember(m);
    setForm({ name: m.name, email: m.email, role: m.role, startDate: m.joined.toISOString().slice(0, 10), bio: m.bio });
    setEditOpen(true);
  };

  const handleAdd = (close: () => void) => {
    if (!form.name || !form.email) return;
    const newMember: Member = {
      id: genId(),
      name: form.name,
      email: form.email,
      role: form.role,
      status: 'Active',
      joined: form.startDate ? new Date(form.startDate) : new Date(),
      bio: form.bio,
    };
    setMembers(prev => [...prev, newMember]);
    close();
  };

  const handleEdit = (close: () => void) => {
    if (!editingMember || !form.name || !form.email) return;
    setMembers(prev =>
      prev.map(m =>
        m.id === editingMember.id
          ? { ...m, name: form.name, email: form.email, role: form.role, bio: form.bio }
          : m
      )
    );
    if (selectedMember?.id === editingMember.id) {
      setSelectedMember(prev => prev ? { ...prev, name: form.name, email: form.email, role: form.role, bio: form.bio } : null);
    }
    close();
  };

  const handleRemove = async (memberId: string) => {
    try {
      await confirm({
        title: 'Remove Member',
        content: 'Are you sure you want to remove this team member? This action cannot be undone.',
        confirmationLabel: 'Remove',
        variant: 'destructive',
      });
      setMembers(prev => prev.filter(m => m.id !== memberId));
      if (selectedMember?.id === memberId) setSelectedMember(null);
    } catch {
      // cancelled
    }
  };

  const mainContent = (
    <Stack space={4}>
      <Inline space={4} alignY="center">
        <SearchField label="Search members" value={search} onChange={setSearch} />
        <Select label="Role" selectedKey={roleFilter} onSelectionChange={k => setRoleFilter(String(k))}>
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Inline space={1}>
          <Button
            variant={memberView === 'table' ? 'primary' : 'ghost'}
            onPress={() => setMemberView('table')}
          >
            Table
          </Button>
          <Button
            variant={memberView === 'cards' ? 'primary' : 'ghost'}
            onPress={() => setMemberView('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Button variant="primary" onPress={openAdd}>Add Member</Button>
      </Inline>

      {memberView === 'table' ? (
        <Table
          aria-label="Team Members"
          selectionMode="single"
          selectedKeys={selectedMember ? new Set([selectedMember.id]) : new Set()}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelectionChange={(keys: any) => {
            if (keys === 'all') return;
            const arr = Array.from(keys as Set<string>);
            setSelectedMember(arr.length > 0 ? (members.find(m => m.id === arr[0]) ?? null) : null);
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
              <Table.Row key={m.id} id={m.id}>
                <Table.Cell>{m.name}</Table.Cell>
                <Table.Cell>{m.role}</Table.Cell>
                <Table.Cell>{m.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant(m.status)}>{m.status}</Badge>
                </Table.Cell>
                <Table.Cell>{fmtDate(m.joined)}</Table.Cell>
                <Table.Cell>
                  <Inline space={2}>
                    <Button size="small" variant="ghost" onPress={() => openEdit(m)}>Edit</Button>
                    <Button size="small" variant="ghost" onPress={() => handleRemove(m.id)}>Remove</Button>
                  </Inline>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="280px" stretch space={4}>
          {filtered.map(m => (
            <Card key={m.id} p={4}>
              <Stack space={3}>
                <Inline alignX="between" alignY="center" space={2}>
                  <Text weight="bold">{m.name}</Text>
                  <Badge variant={statusVariant(m.status)}>{m.role}</Badge>
                </Inline>
                <Text>{m.email}</Text>
                <Inline space={2}>
                  <Button size="small" variant="ghost" onPress={() => openEdit(m)}>Message</Button>
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
    <Stack space={6}>
      <Headline level={1}>Team Members</Headline>

      {selectedMember ? (
        <Columns columns={[3, 1]} space={4}>
          {mainContent}
          <MemberDetail member={selectedMember} onClose={() => setSelectedMember(null)} />
        </Columns>
      ) : (
        mainContent
      )}

      {/* Add Member Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen} size="small">
        {({ close }) => (
          <>
            <Dialog.Title>Add Member</Dialog.Title>
            <Dialog.Content>
              <MemberFormFields form={form} setForm={setForm} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => handleAdd(close)}>Add</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen} size="small">
        {({ close }) => (
          <>
            <Dialog.Title>Edit Member</Dialog.Title>
            <Dialog.Content>
              <MemberFormFields form={form} setForm={setForm} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => handleEdit(close)}>Save</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────

interface ProjectsPageProps {
  projects: Project[];
  setProjects: (fn: (prev: Project[]) => Project[]) => void;
}

function ProjectsPage({ projects, setProjects }: ProjectsPageProps) {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleArchive = () => {
    setProjects(prev => prev.filter(p => !selectedKeys.has(p.id)));
    setSelectedKeys(new Set());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectionChange = (keys: any) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(filtered.map(p => p.id)));
    } else {
      setSelectedKeys(new Set(Array.from(keys as Set<string>).map(String)));
    }
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>

      <Inline space={4} alignY="center">
        <SearchField label="Search projects" value={search} onChange={setSearch} />
        <Button variant="primary" onPress={() => { setNewProjectName(''); setNewProjectOpen(true); }}>
          New Project
        </Button>
      </Inline>

      {selectedKeys.size > 0 && (
        <Inline space={4} alignY="center">
          <Text>{selectedKeys.size} project{selectedKeys.size !== 1 ? 's' : ''} selected</Text>
          <Button variant="ghost" onPress={handleArchive}>Archive Selected</Button>
          <Button variant="ghost">Export</Button>
        </Inline>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
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
            <Table.Row key={p.id} id={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>{fmtShortDate(p.deadline)}</Table.Cell>
              <Table.Cell>{p.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={projectStatusVariant(p.status)}>{p.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen} size="small">
        {({ close }) => (
          <>
            <Dialog.Title>New Project</Dialog.Title>
            <Dialog.Content>
              <TextField label="Project Name" required value={newProjectName} onChange={setNewProjectName} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close}>Cancel</Button>
              <Button
                variant="primary"
                onPress={() => {
                  if (!newProjectName) return;
                  setProjects(prev => [...prev, {
                    id: genId(), name: newProjectName, lead: 'Unassigned',
                    members: 0, deadline: new Date('2026-12-31'), progress: 0, status: 'Active',
                  }]);
                  close();
                }}
              >
                Create
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

// ─── Calendar Page ────────────────────────────────────────────────────────────

function CalendarPage() {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Stack space={8}>
      <Headline level={1}>Team Calendar</Headline>
      <Headline level={2}>June 2026</Headline>

      <Stack space={1}>
        <Columns columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
          {weekDays.map(d => (
            <Card key={d} p={2}>
              <Text weight="bold">{d}</Text>
            </Card>
          ))}
        </Columns>
        {calendarWeeks.map((week, wi) => (
          <Columns key={wi} columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
            {week.map((day, di) => (
              <Card key={di} p={2}>
                {day !== null && (
                  <Stack space={1}>
                    <Text weight="bold">{day}</Text>
                    {(calendarEvents[day] ?? []).map((e, i) => (
                      <Badge key={i} variant={eventVariant(e.type)}>{e.name}</Badge>
                    ))}
                  </Stack>
                )}
              </Card>
            ))}
          </Columns>
        ))}
      </Stack>

      <Stack space={4}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={3}>
          {upcomingEvents.map((e, i) => (
            <Card key={i} p={4}>
              <Inline space={4} alignY="center">
                <Text weight="bold">{fmtShortDate(e.date)}</Text>
                <Text>{e.name}</Text>
                <Badge variant={eventVariant(e.type)}>{e.type}</Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

// ─── Files Page ───────────────────────────────────────────────────────────────

interface FilesPageProps {
  files: FileItem[];
  setFiles: (fn: (prev: FileItem[]) => FileItem[]) => void;
}

function FilesPage({ files, setFiles }: FilesPageProps) {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState<FileType>('Document');

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || f.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleUpload = (close: () => void) => {
    const newFile: FileItem = {
      id: genId(),
      name: uploadDesc || 'Uploaded File',
      type: uploadCategory,
      size: 1048576,
      uploadedBy: 'John Doe',
      date: new Date(),
    };
    setFiles(prev => [...prev, newFile]);
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
    close();
  };

  const handleFileAction = (action: string, fileId: string) => {
    if (action === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={4} alignY="center">
        <SearchField label="Search files" value={search} onChange={setSearch} />
        <Select label="Type" selectedKey={typeFilter} onSelectionChange={k => setTypeFilter(String(k))}>
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Document">Documents</Select.Option>
          <Select.Option id="Image">Images</Select.Option>
          <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => { setUploadDesc(''); setUploadOpen(true); }}>Upload</Button>
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
          {filtered.map(f => (
            <Table.Row key={f.id} id={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>{fmtFileSize(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>{fmtShortDate(f.date)}</Table.Cell>
              <Table.Cell>
                <Menu
                  label="Actions"
                  variant="ghost"
                  onAction={key => handleFileAction(String(key), f.id)}
                >
                  <Menu.Item id="download">Download</Menu.Item>
                  <Menu.Item id="rename">Rename</Menu.Item>
                  <Menu.Item id="delete" variant="destructive">Delete</Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen} size="small">
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="File Description"
                  value={uploadDesc}
                  onChange={setUploadDesc}
                  placeholder="Enter file name or description"
                />
                <Select
                  label="Category"
                  selectedKey={uploadCategory}
                  onSelectionChange={k => setUploadCategory(String(k) as FileType)}
                >
                  <Select.Option id="Document">Document</Select.Option>
                  <Select.Option id="Image">Image</Select.Option>
                  <Select.Option id="Spreadsheet">Spreadsheet</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => handleUpload(close)}>Upload</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

interface SettingsPageProps {
  teamName: string;
  setTeamName: (name: string) => void;
}

function SettingsPage({ teamName, setTeamName }: SettingsPageProps) {
  const { addToast } = useToast();
  const confirm = useConfirmation();

  const [localTeamName, setLocalTeamName] = useState(teamName);
  const [description, setDescription] = useState('A collaborative team workspace.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const [notif, setNotif] = useState({
    newMember: true,
    deadline: true,
    weekly: false,
    mentions: true,
    calendar: true,
  });

  const [integrations, setIntegrations] = useState({
    slack: true,
    github: false,
    jira: false,
  });

  const handleSaveGeneral = () => {
    setTeamName(localTeamName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const handleSaveNotifications = () => {
    addToast({ title: 'Notification preferences saved.', variant: 'success' });
  };

  const handleDisconnect = async (service: string) => {
    try {
      await confirm({
        title: `Disconnect ${service}`,
        content: `Are you sure you want to disconnect ${service}? You will lose access to its features.`,
        confirmationLabel: 'Disconnect',
        variant: 'destructive',
      });
      setIntegrations(prev => ({ ...prev, [service.toLowerCase()]: false }));
    } catch {
      // cancelled
    }
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Inset spaceY={6}>
            <Stack space={6}>
              <TextField
                label="Team Name"
                value={localTeamName}
                onChange={setLocalTeamName}
              />
              <TextArea
                label="Description"
                value={description}
                onChange={setDescription}
              />
              <Select
                label="Default Timezone"
                selectedKey={timezone}
                onSelectionChange={k => setTimezone(String(k))}
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
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Inline>
                <Button variant="primary" onPress={handleSaveGeneral}>Save</Button>
              </Inline>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Inset spaceY={6}>
            <Stack space={6}>
              <Switch
                label="New member joins"
                description="Get notified when someone joins the team"
                selected={notif.newMember}
                onChange={v => setNotif(n => ({ ...n, newMember: v }))}
              />
              <Switch
                label="Project deadline approaching"
                description="Reminder 3 days before deadline"
                selected={notif.deadline}
                onChange={v => setNotif(n => ({ ...n, deadline: v }))}
              />
              <Switch
                label="Weekly digest"
                description="Summary of team activity every Monday"
                selected={notif.weekly}
                onChange={v => setNotif(n => ({ ...n, weekly: v }))}
              />
              <Switch
                label="Mention notifications"
                description="When someone mentions you in a comment"
                selected={notif.mentions}
                onChange={v => setNotif(n => ({ ...n, mentions: v }))}
              />
              <Switch
                label="Calendar reminders"
                description="15 minutes before scheduled events"
                selected={notif.calendar}
                onChange={v => setNotif(n => ({ ...n, calendar: v }))}
              />
              <Inline>
                <Button variant="primary" onPress={handleSaveNotifications}>Save Preferences</Button>
              </Inline>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Inset spaceY={6}>
            <Columns columns={[1, 1, 1]} space={4}>
              {([
                { key: 'slack' as const, name: 'Slack', desc: 'Send notifications and updates directly to Slack channels.' },
                { key: 'github' as const, name: 'GitHub', desc: 'Link commits and pull requests to projects automatically.' },
                { key: 'jira' as const, name: 'Jira', desc: 'Sync issues and sprints with your Jira workspace.' },
              ]).map(({ key, name, desc }) => {
                const connected = integrations[key];
                return (
                  <Card key={key} p={6}>
                    <Stack space={4}>
                      <Inline alignX="between" alignY="center" space={2}>
                        <Headline level={3}>{name}</Headline>
                        <Badge variant={connected ? 'success' : 'default'}>
                          {connected ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </Inline>
                      <Text>{desc}</Text>
                      {connected ? (
                        <Button variant="ghost" onPress={() => handleDisconnect(name)}>
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          onPress={() => setIntegrations(prev => ({ ...prev, [key]: true }))}
                        >
                          Connect
                        </Button>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Columns>
          </Inset>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [teamName, setTeamName] = useState('TeamHub');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [memberView, setMemberView] = useState<'table' | 'cards'>('table');

  const currentLabel = pageLabel[currentPage] ?? 'Dashboard';

  const renderPage = () => {
    switch (currentPage) {
      case '/dashboard':
        return <DashboardPage members={members} />;
      case '/members':
        return (
          <MembersPage
            members={members}
            setMembers={setMembers}
            memberView={memberView}
            setMemberView={setMemberView}
          />
        );
      case '/projects':
        return <ProjectsPage projects={projects} setProjects={setProjects} />;
      case '/calendar':
        return <CalendarPage />;
      case '/files':
        return <FilesPage files={files} setFiles={setFiles} />;
      case '/settings':
        return <SettingsPage teamName={teamName} setTeamName={setTeamName} />;
      default:
        return <DashboardPage members={members} />;
    }
  };

  return (
    <>
      <ToastProvider position="bottom-right" />
      <RouterProvider navigate={setCurrentPage}>
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
                  <Breadcrumbs.Item href={currentPage}>{currentLabel}</Breadcrumbs.Item>
                </Breadcrumbs>
              </TopNavigation.Middle>

              <TopNavigation.End>
                <Inline space={2} alignY="center">
                  <Tooltip.Trigger>
                    <Menu
                      label="John Doe"
                      onAction={key => {
                        if (key === 'settings') setCurrentPage('/settings');
                      }}
                    >
                      <Menu.Item id="profile">Profile</Menu.Item>
                      <Menu.Item id="preferences">Preferences</Menu.Item>
                      <Menu.Item id="signout" variant="destructive">Sign Out</Menu.Item>
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
              <Inset space={6}>
                {renderPage()}
              </Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>
    </>
  );
};

export default TestApp;
