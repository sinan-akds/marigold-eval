import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Inline,
  Text,
  Heading,
  Button,
  TextField,
  Textarea,
  Select,
  Item,
  Table,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Switch,
  Divider,
  Badge,
  TooltipTrigger,
  Tooltip,
  MenuTrigger,
  Menu,
} from '@marigold/components';

// ─── Types ───────────────────────────────────────────────────────────────────

type NavPage = 'Dashboard' | 'Members' | 'Projects' | 'Calendar' | 'Files' | 'Settings';
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
  status: ProjectStatus;
}

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedBy: string;
  date: string;
}

interface CalendarEvent {
  id: string;
  date: string;
  name: string;
  type: EventType;
}

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  description: string;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@team.com', status: 'Active', joined: '2024-01-15', bio: 'Full-stack developer with 5 years experience.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@team.com', status: 'Active', joined: '2024-02-20', bio: 'UX/UI designer focused on accessibility.' },
  { id: '3', name: 'Carol White', role: 'Manager', email: 'carol@team.com', status: 'Active', joined: '2023-11-01', bio: 'Project manager with agile expertise.' },
  { id: '4', name: 'David Brown', role: 'Developer', email: 'david@team.com', status: 'On Leave', joined: '2024-03-10', bio: 'Backend developer specializing in APIs.' },
  { id: '5', name: 'Eva Martinez', role: 'Designer', email: 'eva@team.com', status: 'Active', joined: '2024-04-05', bio: 'UI designer and design systems advocate.' },
  { id: '6', name: 'Frank Lee', role: 'QA', email: 'frank@team.com', status: 'Active', joined: '2024-05-15', bio: 'QA engineer with automation focus.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: '2026-07-31', progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App', lead: 'Bob Smith', members: 6, deadline: '2026-08-15', progress: 45, status: 'Active' },
  { id: '3', name: 'API Integration', lead: 'David Brown', members: 3, deadline: '2026-06-30', progress: 90, status: 'On Hold' },
  { id: '4', name: 'Analytics Dashboard', lead: 'Carol White', members: 5, deadline: '2026-09-01', progress: 100, status: 'Completed' },
  { id: '5', name: 'Security Audit', lead: 'Frank Lee', members: 2, deadline: '2026-07-15', progress: 30, status: 'Active' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Project Brief.pdf', type: 'Document', size: 2400000, uploadedBy: 'Alice Johnson', date: '2026-06-01' },
  { id: '2', name: 'Team Photo.jpg', type: 'Image', size: 4800000, uploadedBy: 'Bob Smith', date: '2026-06-05' },
  { id: '3', name: 'Budget.xlsx', type: 'Spreadsheet', size: 1200000, uploadedBy: 'Carol White', date: '2026-06-10' },
  { id: '4', name: 'Design Specs.pdf', type: 'Document', size: 8500000, uploadedBy: 'Eva Martinez', date: '2026-06-12' },
  { id: '5', name: 'Q2 Report.xlsx', type: 'Spreadsheet', size: 950000, uploadedBy: 'Frank Lee', date: '2026-06-15' },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', date: '2026-06-23', name: 'Sprint Planning', type: 'Meeting' },
  { id: '2', date: '2026-06-27', name: 'Website Redesign Deadline', type: 'Deadline' },
  { id: '3', date: '2026-06-30', name: 'Team Lunch', type: 'Social' },
  { id: '4', date: '2026-07-05', name: 'Q3 Kickoff', type: 'Meeting' },
];

const RECENT_ACTIVITY = [
  { id: '1', member: 'Alice Johnson', action: 'Commit' as const, project: 'Website Redesign', date: '2026-06-20' },
  { id: '2', member: 'Bob Smith', action: 'Review' as const, project: 'Mobile App', date: '2026-06-19' },
  { id: '3', member: 'David Brown', action: 'Deploy' as const, project: 'API Integration', date: '2026-06-18' },
  { id: '4', member: 'Eva Martinez', action: 'Commit' as const, project: 'Analytics Dashboard', date: '2026-06-18' },
  { id: '5', member: 'Frank Lee', action: 'Review' as const, project: 'Security Audit', date: '2026-06-17' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

const formatFileSize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
};

const actionVariant = (action: string): 'info' | 'warning' | 'success' =>
  action === 'Commit' ? 'info' : action === 'Review' ? 'warning' : 'success';

const statusVariant = (status: MemberStatus): 'success' | 'warning' =>
  status === 'Active' ? 'success' : 'warning';

const projectStatusVariant = (status: ProjectStatus): 'success' | 'warning' | 'info' =>
  status === 'Active' ? 'success' : status === 'On Hold' ? 'warning' : 'info';

const eventVariant = (type: EventType): 'info' | 'error' | 'success' =>
  type === 'Meeting' ? 'info' : type === 'Deadline' ? 'error' : 'success';

let nextId = 100;
const genId = () => String(++nextId);

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) => {
  if (!isOpen) return null;
  return (
    <Box
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <Box style={{ background: 'white', padding: 24, borderRadius: 8, maxWidth: 400, width: '90%' }}>
        <Stack space={4}>
          <Heading level={3}>Confirm</Heading>
          <Text>{message}</Text>
          <Inline space={2}>
            <Button variant="secondary" onPress={onCancel}>Cancel</Button>
            <Button variant="primary" onPress={onConfirm}>Confirm</Button>
          </Inline>
        </Stack>
      </Box>
    </Box>
  );
};

// ─── MemberFormDialog ─────────────────────────────────────────────────────────

interface MemberFormData {
  name: string;
  email: string;
  role: string;
  startDate: string;
  bio: string;
}

const emptyMemberForm = (): MemberFormData => ({ name: '', email: '', role: 'Developer', startDate: '', bio: '' });

interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MemberFormData) => void;
  initial?: MemberFormData;
  title: string;
}

const MemberFormDialog = ({ isOpen, onClose, onSubmit, initial, title }: MemberFormDialogProps) => {
  const [form, setForm] = useState<MemberFormData>(initial || emptyMemberForm());
  React.useEffect(() => { if (isOpen) setForm(initial || emptyMemberForm()); }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSubmit(form);
  };

  return (
    <Box
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <Box style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 420, maxWidth: 560, width: '90%' }}>
        <Stack space={4}>
          <Heading level={3}>{title}</Heading>
          <TextField
            label="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            isRequired
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            isRequired
          />
          <Select
            label="Role"
            selectedKey={form.role}
            onSelectionChange={(k) => setForm({ ...form, role: String(k) })}
          >
            <Item key="Developer">Developer</Item>
            <Item key="Designer">Designer</Item>
            <Item key="Manager">Manager</Item>
            <Item key="QA">QA</Item>
          </Select>
          <TextField
            label="Start Date"
            value={form.startDate}
            onChange={(v) => setForm({ ...form, startDate: v })}
            placeholder="YYYY-MM-DD"
          />
          <Textarea
            label="Bio"
            value={form.bio}
            onChange={(v) => setForm({ ...form, bio: v })}
          />
          <Inline space={2}>
            <Button variant="secondary" onPress={onClose}>Cancel</Button>
            <Button variant="primary" onPress={handleSubmit}>
              {title === 'Add Member' ? 'Add' : 'Save'}
            </Button>
          </Inline>
        </Stack>
      </Box>
    </Box>
  );
};

// ─── MemberDetailPanel ────────────────────────────────────────────────────────

interface MemberDetailPanelProps {
  member: Member | null;
  onClose: () => void;
}

const MemberDetailPanel = ({ member, onClose }: MemberDetailPanelProps) => {
  if (!member) return null;
  return (
    <Box
      style={{
        position: 'fixed', top: 0, right: 0, width: 320, height: '100vh',
        background: 'white', boxShadow: '-4px 0 16px rgba(0,0,0,0.12)',
        zIndex: 900, overflowY: 'auto', padding: 24,
      }}
    >
      <Stack space={4}>
        <Inline space={2} alignY="center">
          <Heading level={3}>{member.name}</Heading>
          <Button variant="secondary" onPress={onClose}>✕</Button>
        </Inline>
        <Divider />
        <Stack space={2}>
          <Text><strong>Role:</strong> {member.role}</Text>
          <Text><strong>Email:</strong> {member.email}</Text>
          <Text><strong>Status:</strong> {member.status}</Text>
          <Text><strong>Joined:</strong> {formatDate(member.joined)}</Text>
          {member.bio && <Text><strong>Bio:</strong> {member.bio}</Text>}
        </Stack>
      </Stack>
    </Box>
  );
};

// ─── DashboardPage ────────────────────────────────────────────────────────────

interface DashboardPageProps {
  members: Member[];
}

const DashboardPage = ({ members }: DashboardPageProps) => (
  <Stack space={6}>
    <Heading level={1}>Team Overview</Heading>

    <Box
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
    >
      {/* Members card */}
      <Box style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
        <Stack space={2}>
          <Text style={{ color: '#718096', fontSize: 14 }}>Members</Text>
          <Heading level={2}>{formatNumber(members.length)}</Heading>
        </Stack>
      </Box>

      {/* Active Projects */}
      <Box style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
        <Stack space={2}>
          <Text style={{ color: '#718096', fontSize: 14 }}>Active Projects</Text>
          <Heading level={2}>{formatNumber(5)}</Heading>
        </Stack>
      </Box>

      {/* Upcoming Deadlines */}
      <Box style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
        <Stack space={2}>
          <Text style={{ color: '#718096', fontSize: 14 }}>Upcoming Deadlines</Text>
          <Heading level={2}>{formatNumber(8)}</Heading>
        </Stack>
      </Box>

      {/* Hours This Week */}
      <Box style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
        <Stack space={2}>
          <Inline space={1} alignY="center">
            <Text style={{ color: '#718096', fontSize: 14 }}>Hours This Week</Text>
            <TooltipTrigger>
              <Button variant="ghost">ⓘ</Button>
              <Tooltip>Aggregate of all team members.</Tooltip>
            </TooltipTrigger>
          </Inline>
          <Heading level={2}>{formatNumber(342)}</Heading>
        </Stack>
      </Box>
    </Box>

    <Stack space={3}>
      <Heading level={2}>Recent Activity</Heading>
      <Table aria-label="Recent Activity">
        <Table.Header>
          <Table.Column>Member</Table.Column>
          <Table.Column>Action</Table.Column>
          <Table.Column>Project</Table.Column>
          <Table.Column>Date</Table.Column>
        </Table.Header>
        <Table.Body>
          {RECENT_ACTIVITY.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.member}</Table.Cell>
              <Table.Cell>
                <Badge variant={actionVariant(row.action)}>{row.action}</Badge>
              </Table.Cell>
              <Table.Cell>{row.project}</Table.Cell>
              <Table.Cell>{formatDate(row.date)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>

    <Box style={{ background: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: 8, padding: 16 }}>
      <Inline space={2} alignY="center">
        <Text style={{ color: '#2b6cb0' }}>ℹ️</Text>
        <Text style={{ color: '#2b6cb0' }}>
          Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
        </Text>
      </Inline>
    </Box>
  </Stack>
);

// ─── MembersPage ──────────────────────────────────────────────────────────────

interface MembersPageProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  viewMode: 'table' | 'cards';
  setViewMode: React.Dispatch<React.SetStateAction<'table' | 'cards'>>;
}

const MembersPage = ({ members, setMembers, viewMode, setViewMode }: MembersPageProps) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filtered = useMemo(() =>
    members.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || m.role === roleFilter;
      return matchSearch && matchRole;
    }),
    [members, search, roleFilter]
  );

  const handleAdd = (data: MemberFormData) => {
    setMembers(prev => [...prev, {
      id: genId(),
      name: data.name,
      email: data.email,
      role: data.role as MemberRole,
      status: 'Active',
      joined: data.startDate || new Date().toISOString().split('T')[0],
      bio: data.bio,
    }]);
    setAddOpen(false);
  };

  const handleEdit = (m: Member) => {
    setEditingMember(m);
    setEditOpen(true);
  };

  const handleEditSubmit = (data: MemberFormData) => {
    if (!editingMember) return;
    setMembers(prev => prev.map(m =>
      m.id === editingMember.id
        ? { ...m, name: data.name, email: data.email, role: data.role as MemberRole, joined: data.startDate || m.joined, bio: data.bio }
        : m
    ));
    setEditOpen(false);
    setEditingMember(null);
  };

  const handleRemove = (id: string) => setConfirmRemove(id);

  const doRemove = () => {
    if (!confirmRemove) return;
    setMembers(prev => prev.filter(m => m.id !== confirmRemove));
    if (selectedMember?.id === confirmRemove) setSelectedMember(null);
    setConfirmRemove(null);
  };

  return (
    <Stack space={4}>
      <Heading level={1}>Team Members</Heading>

      <Inline space={3} alignY="center">
        <TextField
          label="Search"
          value={search}
          onChange={setSearch}
          placeholder="Search by name..."
        />
        <Select
          label="Role"
          selectedKey={roleFilter}
          onSelectionChange={(k) => setRoleFilter(String(k))}
        >
          <Item key="all">All Roles</Item>
          <Item key="Developer">Developer</Item>
          <Item key="Designer">Designer</Item>
          <Item key="Manager">Manager</Item>
          <Item key="QA">QA</Item>
        </Select>
        <Inline space={1}>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onPress={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'secondary'}
            onPress={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Button variant="primary" onPress={() => setAddOpen(true)}>Add Member</Button>
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team Members">
          <Table.Header>
            <Table.Column>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filtered.map((m) => (
              <Table.Row key={m.id}>
                <Table.Cell>
                  <Button variant="ghost" onPress={() => setSelectedMember(m)}>{m.name}</Button>
                </Table.Cell>
                <Table.Cell>{m.role}</Table.Cell>
                <Table.Cell>{m.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant(m.status)}>{m.status}</Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(m.joined)}</Table.Cell>
                <Table.Cell>
                  <Inline space={1}>
                    <Button variant="secondary" onPress={() => handleEdit(m)}>Edit</Button>
                    <Button variant="secondary" onPress={() => handleRemove(m.id)}>Remove</Button>
                  </Inline>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Box
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}
        >
          {filtered.map((m) => (
            <Box
              key={m.id}
              style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}
            >
              <Stack space={3}>
                <Button variant="ghost" onPress={() => setSelectedMember(m)}>
                  <Heading level={3}>{m.name}</Heading>
                </Button>
                <Badge variant={m.role === 'Developer' ? 'info' : m.role === 'Designer' ? 'success' : m.role === 'Manager' ? 'warning' : 'neutral'}>
                  {m.role}
                </Badge>
                <Text>{m.email}</Text>
                <Inline space={2}>
                  <Button variant="secondary" onPress={() => handleEdit(m)}>Edit</Button>
                  <Button variant="ghost" onPress={() => setSelectedMember(m)}>Profile</Button>
                </Inline>
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      <MemberFormDialog
        isOpen={addOpen}
        title="Add Member"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <MemberFormDialog
        isOpen={editOpen}
        title="Edit Member"
        onClose={() => { setEditOpen(false); setEditingMember(null); }}
        onSubmit={handleEditSubmit}
        initial={editingMember ? {
          name: editingMember.name,
          email: editingMember.email,
          role: editingMember.role,
          startDate: editingMember.joined,
          bio: editingMember.bio,
        } : undefined}
      />

      <ConfirmDialog
        isOpen={confirmRemove !== null}
        message="Are you sure you want to remove this member?"
        onConfirm={doRemove}
        onCancel={() => setConfirmRemove(null)}
      />

      <MemberDetailPanel
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </Stack>
  );
};

// ─── ProjectsPage ─────────────────────────────────────────────────────────────

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const handleArchive = () => {
    setProjects(prev => prev.filter(p => !selectedKeys.has(p.id)));
    setSelectedKeys(new Set());
  };

  return (
    <Stack space={4}>
      <Heading level={1}>Projects</Heading>

      <Inline space={3} alignY="center">
        <TextField
          label="Search"
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
        />
        <Button variant="primary" onPress={() => {}}>New Project</Button>
      </Inline>

      {selectedKeys.size > 0 && (
        <Box style={{ background: '#fff8e1', border: '1px solid #ffd54f', borderRadius: 8, padding: 12 }}>
          <Inline space={3} alignY="center">
            <Text>{selectedKeys.size} selected</Text>
            <Button variant="secondary" onPress={handleArchive}>Archive Selected</Button>
            <Button variant="secondary" onPress={() => {}}>Export</Button>
          </Inline>
        </Box>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedKeys as any}
        onSelectionChange={(sel: any) => {
          if (sel === 'all') {
            setSelectedKeys(new Set(filtered.map(p => p.id)));
          } else {
            setSelectedKeys(new Set([...(sel as Iterable<string>)].map(String)));
          }
        }}
      >
        <Table.Header>
          <Table.Column>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((p) => (
            <Table.Row key={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>{formatDate(p.deadline)}</Table.Cell>
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
};

// ─── CalendarPage ─────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarPage = () => {
  const year = 2026;
  const month = 5; // June
  const daysInMonth = 30;
  const firstDay = new Date(year, month, 1).getDay(); // 1 = Monday

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  CALENDAR_EVENTS.filter(e => e.date.startsWith('2026-06')).forEach(e => {
    const d = parseInt(e.date.split('-')[2]);
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(e);
  });

  return (
    <Stack space={6}>
      <Heading level={1}>Team Calendar</Heading>

      <Box style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
        <Box style={{ background: '#4a5568', padding: '12px 16px' }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>June 2026</Text>
        </Box>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {DAYS_OF_WEEK.map(d => (
            <Box key={d} style={{ padding: '8px', textAlign: 'center', background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#718096' }}>{d}</Text>
            </Box>
          ))}
          {cells.map((day, i) => (
            <Box
              key={i}
              style={{
                minHeight: 72, padding: 6, border: '1px solid #f0f4f8',
                background: day ? 'white' : '#f7fafc',
              }}
            >
              {day && (
                <Stack space={1}>
                  <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{day}</Text>
                  {(eventsByDay[day] || []).map(e => (
                    <Badge key={e.id} variant={eventVariant(e.type)}>
                      {e.name}
                    </Badge>
                  ))}
                </Stack>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      <Stack space={3}>
        <Heading level={2}>Upcoming Events</Heading>
        <Stack space={2}>
          {CALENDAR_EVENTS.map(e => (
            <Box key={e.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
              <Inline space={3} alignY="center">
                <Text style={{ fontWeight: 'bold', minWidth: 120 }}>{formatDate(e.date)}</Text>
                <Text>{e.name}</Text>
                <Badge variant={eventVariant(e.type)}>{e.type}</Badge>
              </Inline>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

// ─── FilesPage ────────────────────────────────────────────────────────────────

const FilesPage = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCat, setUploadCat] = useState('Document');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  const filtered = useMemo(() =>
    files.filter(f => {
      const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || f.type === typeFilter;
      return matchSearch && matchType;
    }),
    [files, search, typeFilter]
  );

  const handleUpload = () => {
    const newFile: FileItem = {
      id: genId(),
      name: `Uploaded File.${uploadCat === 'Image' ? 'jpg' : uploadCat === 'Spreadsheet' ? 'xlsx' : 'pdf'}`,
      type: uploadCat as FileType,
      size: 1024000,
      uploadedBy: 'John Doe',
      date: new Date().toISOString().split('T')[0],
    };
    setFiles(prev => [...prev, newFile]);
    setUploadOpen(false);
    setUploadDesc('');
    setToast('Files uploaded successfully.');
    setTimeout(() => setToast(null), 3000);
  };

  const doDelete = () => {
    if (!confirmDelete) return;
    setFiles(prev => prev.filter(f => f.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const doRename = () => {
    if (!renameId || !renameName.trim()) return;
    setFiles(prev => prev.map(f => f.id === renameId ? { ...f, name: renameName } : f));
    setRenameId(null);
    setRenameName('');
  };

  return (
    <Stack space={4}>
      <Heading level={1}>Shared Files</Heading>

      <Inline space={3} alignY="center">
        <TextField
          label="Search"
          value={search}
          onChange={setSearch}
          placeholder="Search files..."
        />
        <Select
          label="Type"
          selectedKey={typeFilter}
          onSelectionChange={(k) => setTypeFilter(String(k))}
        >
          <Item key="All">All</Item>
          <Item key="Document">Documents</Item>
          <Item key="Image">Images</Item>
          <Item key="Spreadsheet">Spreadsheets</Item>
        </Select>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>Upload</Button>
      </Inline>

      <Table aria-label="Shared Files">
        <Table.Header>
          <Table.Column>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column>Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((f) => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>{formatFileSize(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>{formatDate(f.date)}</Table.Cell>
              <Table.Cell>
                <MenuTrigger>
                  <Button variant="secondary">Actions ▾</Button>
                  <Menu
                    onAction={(key) => {
                      if (key === 'delete') setConfirmDelete(f.id);
                      if (key === 'rename') { setRenameId(f.id); setRenameName(f.name); }
                    }}
                  >
                    <Item key="download">Download</Item>
                    <Item key="rename">Rename</Item>
                    <Item key="delete">Delete</Item>
                  </Menu>
                </MenuTrigger>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Upload dialog */}
      {uploadOpen && (
        <Box style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <Box style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 420 }}>
            <Stack space={4}>
              <Heading level={3}>Upload Files</Heading>
              <TextField label="Description" value={uploadDesc} onChange={setUploadDesc} />
              <Select
                label="Category"
                selectedKey={uploadCat}
                onSelectionChange={(k) => setUploadCat(String(k))}
              >
                <Item key="Document">Document</Item>
                <Item key="Image">Image</Item>
                <Item key="Spreadsheet">Spreadsheet</Item>
              </Select>
              <Inline space={2}>
                <Button variant="secondary" onPress={() => setUploadOpen(false)}>Cancel</Button>
                <Button variant="primary" onPress={handleUpload}>Upload</Button>
              </Inline>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Rename dialog */}
      {renameId && (
        <Box style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <Box style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 380 }}>
            <Stack space={4}>
              <Heading level={3}>Rename File</Heading>
              <TextField label="New Name" value={renameName} onChange={setRenameName} />
              <Inline space={2}>
                <Button variant="secondary" onPress={() => setRenameId(null)}>Cancel</Button>
                <Button variant="primary" onPress={doRename}>Rename</Button>
              </Inline>
            </Stack>
          </Box>
        </Box>
      )}

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        message="Are you sure you want to delete this file?"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Toast */}
      {toast && (
        <Box style={{ position: 'fixed', bottom: 24, right: 24, background: '#48bb78', color: 'white', padding: '12px 20px', borderRadius: 8, zIndex: 2000, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          <Text style={{ color: 'white' }}>{toast}</Text>
        </Box>
      )}
    </Stack>
  );
};

// ─── SettingsPage ─────────────────────────────────────────────────────────────

interface SettingsPageProps {
  teamName: string;
  setTeamName: (name: string) => void;
}

const SettingsPage = ({ teamName, setTeamName }: SettingsPageProps) => {
  const [localName, setLocalName] = useState(teamName);
  const [description, setDescription] = useState('A collaborative team workspace.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [generalSaved, setGeneralSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'slack', name: 'Slack', connected: true, description: 'Team messaging and notifications.' },
    { id: 'github', name: 'GitHub', connected: false, description: 'Code repository and version control.' },
    { id: 'jira', name: 'Jira', connected: false, description: 'Project and issue tracking.' },
  ]);
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);

  const handleSaveGeneral = () => {
    setTeamName(localName);
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 3000);
  };

  const handleSaveNotifs = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const toggleIntegration = (id: string) => {
    const intg = integrations.find(i => i.id === id);
    if (!intg) return;
    if (intg.connected) {
      setConfirmDisconnect(id);
    } else {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i));
    }
  };

  const doDisconnect = () => {
    if (!confirmDisconnect) return;
    setIntegrations(prev => prev.map(i => i.id === confirmDisconnect ? { ...i, connected: false } : i));
    setConfirmDisconnect(null);
  };

  const NOTIF_ITEMS: { key: keyof typeof notifs; label: string; desc: string }[] = [
    { key: 'newMember', label: 'New member joins', desc: 'Get notified when someone joins the team' },
    { key: 'deadline', label: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
    { key: 'digest', label: 'Weekly digest', desc: 'Summary of team activity every Monday' },
    { key: 'mention', label: 'Mention notifications', desc: 'When someone mentions you in a comment' },
    { key: 'calendar', label: 'Calendar reminders', desc: '15 minutes before scheduled events' },
  ];

  return (
    <Stack space={4}>
      <Heading level={1}>Team Settings</Heading>

      <Tabs>
        <TabList aria-label="Settings tabs">
          <Tab id="general">General</Tab>
          <Tab id="notifications">Notifications</Tab>
          <Tab id="integrations">Integrations</Tab>
        </TabList>

        <TabPanel id="general">
          <Stack space={4} style={{ paddingTop: 16 }}>
            <TextField label="Team Name" value={localName} onChange={setLocalName} />
            <Textarea label="Description" value={description} onChange={setDescription} />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={(k) => setTimezone(String(k))}
            >
              <Item key="UTC">UTC</Item>
              <Item key="CET">CET</Item>
              <Item key="EST">EST</Item>
              <Item key="PST">PST</Item>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onSelectionChange={(k) => setDateFormat(String(k))}
            >
              <Item key="MM/DD/YYYY">MM/DD/YYYY</Item>
              <Item key="DD.MM.YYYY">DD.MM.YYYY</Item>
              <Item key="YYYY-MM-DD">YYYY-MM-DD</Item>
            </Select>
            <Inline space={3} alignY="center">
              <Button variant="primary" onPress={handleSaveGeneral}>Save</Button>
              {generalSaved && <Text style={{ color: '#48bb78' }}>Settings updated.</Text>}
            </Inline>
          </Stack>
        </TabPanel>

        <TabPanel id="notifications">
          <Stack space={4} style={{ paddingTop: 16 }}>
            {NOTIF_ITEMS.map(({ key, label, desc }) => (
              <Box key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <Switch
                  isSelected={notifs[key]}
                  onChange={(v) => setNotifs(n => ({ ...n, [key]: v }))}
                >
                  {label}
                </Switch>
                <Text style={{ color: '#718096', fontSize: 14 }}>{desc}</Text>
              </Box>
            ))}
            <Inline space={3} alignY="center">
              <Button variant="primary" onPress={handleSaveNotifs}>Save Preferences</Button>
              {notifSaved && <Text style={{ color: '#48bb78' }}>Preferences saved.</Text>}
            </Inline>
          </Stack>
        </TabPanel>

        <TabPanel id="integrations">
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingTop: 16 }}>
            {integrations.map(intg => (
              <Box key={intg.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20 }}>
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Heading level={3}>{intg.name}</Heading>
                    <Badge variant={intg.connected ? 'success' : 'neutral'}>
                      {intg.connected ? 'Connected' : 'Not Connected'}
                    </Badge>
                  </Inline>
                  <Text>{intg.description}</Text>
                  <Button
                    variant={intg.connected ? 'secondary' : 'primary'}
                    onPress={() => toggleIntegration(intg.id)}
                  >
                    {intg.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Box>
        </TabPanel>
      </Tabs>

      <ConfirmDialog
        isOpen={confirmDisconnect !== null}
        message={`Are you sure you want to disconnect ${integrations.find(i => i.id === confirmDisconnect)?.name}?`}
        onConfirm={doDisconnect}
        onCancel={() => setConfirmDisconnect(null)}
      />
    </Stack>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavPage[] = ['Dashboard', 'Members', 'Projects', 'Calendar', 'Files'];

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  isOpen: boolean;
  teamName: string;
}

const Sidebar = ({ currentPage, onNavigate, isOpen, teamName }: SidebarProps) => (
  <Box
    style={{
      width: isOpen ? 220 : 56,
      flexShrink: 0,
      background: '#2d3748',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      overflow: 'hidden',
    }}
  >
    <Box style={{ padding: isOpen ? '20px 16px 16px' : '20px 8px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: isOpen ? 18 : 14, whiteSpace: 'nowrap' }}>
        {isOpen ? teamName : teamName.slice(0, 2).toUpperCase()}
      </Text>
    </Box>

    <Stack space={1} style={{ flex: 1, padding: '8px' }}>
      {NAV_ITEMS.map((page) => (
        <Box
          key={page}
          onClick={() => onNavigate(page)}
          style={{
            padding: '10px 12px',
            cursor: 'pointer',
            borderRadius: 6,
            background: currentPage === page ? 'rgba(255,255,255,0.15)' : 'transparent',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <Text style={{ color: 'white', fontSize: 14 }}>
            {isOpen ? page : page[0]}
          </Text>
        </Box>
      ))}
    </Stack>

    <Divider />

    <Box style={{ padding: '8px' }}>
      <Box
        onClick={() => onNavigate('Settings')}
        style={{
          padding: '10px 12px',
          cursor: 'pointer',
          borderRadius: 6,
          background: currentPage === 'Settings' ? 'rgba(255,255,255,0.15)' : 'transparent',
          whiteSpace: 'nowrap',
        }}
      >
        <Text style={{ color: 'white', fontSize: 14 }}>
          {isOpen ? 'Settings' : 'S'}
        </Text>
      </Box>
    </Box>
  </Box>
);

// ─── TopNav ───────────────────────────────────────────────────────────────────

interface TopNavProps {
  currentPage: NavPage;
  onToggleSidebar: () => void;
  teamName: string;
}

const TopNav = ({ currentPage, onToggleSidebar, teamName }: TopNavProps) => {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <Box
      style={{
        height: 56,
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 16,
        flexShrink: 0,
      }}
    >
      <Button variant="ghost" onPress={onToggleSidebar}>☰</Button>

      <Box style={{ flex: 1 }}>
        <Inline space={1} alignY="center">
          <Text style={{ color: '#718096' }}>{teamName}</Text>
          <Text style={{ color: '#718096' }}>›</Text>
          <Text style={{ fontWeight: 'bold' }}>{currentPage}</Text>
        </Inline>
      </Box>

      <Inline space={2} alignY="center">
        {/* Help popover */}
        <Box style={{ position: 'relative' }}>
          <Button variant="ghost" onPress={() => setHelpOpen(o => !o)}>?</Button>
          {helpOpen && (
            <Box
              style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 4,
                background: 'white', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: 12, minWidth: 240, zIndex: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Text>Use the sidebar to navigate between sections.</Text>
            </Box>
          )}
        </Box>

        {/* User account menu */}
        <TooltipTrigger>
          <MenuTrigger>
            <Button variant="secondary">John Doe ▾</Button>
            <Menu onAction={() => {}}>
              <Item key="profile">Profile</Item>
              <Item key="preferences">Preferences</Item>
              <Item key="signout">Sign Out</Item>
            </Menu>
          </MenuTrigger>
          <Tooltip>Account settings</Tooltip>
        </TooltipTrigger>
      </Inline>
    </Box>
  );
};

// ─── TestApp ──────────────────────────────────────────────────────────────────

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [teamName, setTeamName] = useState('TeamHub');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  return (
    <Box style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui, sans-serif', background: '#f7fafc' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        teamName={teamName}
      />

      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopNav
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          teamName={teamName}
        />

        <Box style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {currentPage === 'Dashboard' && <DashboardPage members={members} />}
          {currentPage === 'Members' && (
            <MembersPage
              members={members}
              setMembers={setMembers}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          {currentPage === 'Projects' && <ProjectsPage />}
          {currentPage === 'Calendar' && <CalendarPage />}
          {currentPage === 'Files' && <FilesPage />}
          {currentPage === 'Settings' && (
            <SettingsPage teamName={teamName} setTeamName={setTeamName} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TestApp;
