import React, { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Tiles,
  Text,
  Headline,
  Button,
  Card,
  Badge,
  Divider,
  TextField,
  Select,
  TextArea,
  SearchField,
  Switch,
  Dialog,
  DialogTrigger,
  Tooltip,
  TooltipTrigger,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Table,
  TableHeader,
  TableBody,
  Row,
  Cell,
  Column,
  Menu,
  MenuTrigger,
  Breadcrumbs,
  Item,
  ProgressBar,
} from '@marigold/components';

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';
type ProjectStatus = 'Active' | 'On Hold' | 'Completed';
type FileType = 'Document' | 'Image' | 'Spreadsheet';
type EventType = 'Meeting' | 'Deadline' | 'Social';
type Page = 'dashboard' | 'members' | 'projects' | 'calendar' | 'files' | 'settings';
type ViewMode = 'table' | 'cards';

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  joinedDate: string;
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

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer', status: 'Active', joinedDate: '2024-01-15', bio: 'Full-stack developer with 8 years of experience.' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', status: 'Active', joinedDate: '2024-02-20', bio: 'UI/UX designer passionate about user-centered design.' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'Manager', status: 'Active', joinedDate: '2023-11-05', bio: 'Project manager focused on agile methodologies.' },
  { id: '4', name: 'David Lee', email: 'david@example.com', role: 'Developer', status: 'On Leave', joinedDate: '2024-03-10', bio: 'Backend developer specializing in distributed systems.' },
  { id: '5', name: 'Emma Wilson', email: 'emma@example.com', role: 'QA', status: 'Active', joinedDate: '2024-04-01', bio: 'QA engineer with expertise in automated testing.' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'Designer', status: 'Active', joinedDate: '2024-05-12', bio: 'Graphic designer with a passion for brand identity.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: '2026-07-15', progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App MVP', lead: 'Bob Smith', members: 3, deadline: '2026-08-30', progress: 40, status: 'Active' },
  { id: '3', name: 'API Integration', lead: 'Carol Davis', members: 2, deadline: '2026-06-28', progress: 95, status: 'Active' },
  { id: '4', name: 'Design System v2', lead: 'Frank Miller', members: 5, deadline: '2026-09-15', progress: 20, status: 'On Hold' },
  { id: '5', name: 'Analytics Dashboard', lead: 'Emma Wilson', members: 3, deadline: '2026-05-31', progress: 100, status: 'Completed' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Project Proposal.pdf', type: 'Document', size: 2400000, uploadedBy: 'Alice Johnson', date: '2026-05-10' },
  { id: '2', name: 'Brand Guidelines.png', type: 'Image', size: 4700000, uploadedBy: 'Bob Smith', date: '2026-05-15' },
  { id: '3', name: 'Q2 Report.xlsx', type: 'Spreadsheet', size: 1200000, uploadedBy: 'Carol Davis', date: '2026-05-20' },
  { id: '4', name: 'Meeting Notes.docx', type: 'Document', size: 340000, uploadedBy: 'David Lee', date: '2026-05-25' },
  { id: '5', name: 'Team Photo.jpg', type: 'Image', size: 8900000, uploadedBy: 'Emma Wilson', date: '2026-06-01' },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', date: '2026-06-25', name: 'Sprint Planning', type: 'Meeting' },
  { id: '2', date: '2026-06-28', name: 'API Integration Deadline', type: 'Deadline' },
  { id: '3', date: '2026-06-30', name: 'Team Lunch', type: 'Social' },
  { id: '4', date: '2026-07-04', name: 'Design Review', type: 'Meeting' },
];

const RECENT_ACTIVITY = [
  { id: '1', member: 'Alice Johnson', action: 'Commit' as const, project: 'Website Redesign', date: '2026-05-28' },
  { id: '2', member: 'Bob Smith', action: 'Review' as const, project: 'Mobile App MVP', date: '2026-06-01' },
  { id: '3', member: 'Carol Davis', action: 'Deploy' as const, project: 'API Integration', date: '2026-06-05' },
  { id: '4', member: 'Emma Wilson', action: 'Commit' as const, project: 'Analytics Dashboard', date: '2026-06-10' },
  { id: '5', member: 'Frank Miller', action: 'Review' as const, project: 'Design System v2', date: '2026-06-15' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _nextId = 100;
const genId = () => String(_nextId++);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const formatFileSize = (bytes: number) => {
  const mb = bytes / 1_000_000;
  return mb.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' MB';
};

const actionVariant = (action: 'Commit' | 'Review' | 'Deploy') => {
  if (action === 'Commit') return 'info';
  if (action === 'Review') return 'warning';
  return 'success';
};

const eventVariant = (type: EventType) => {
  if (type === 'Meeting') return 'info';
  if (type === 'Deadline') return 'error';
  return 'success';
};

const projectStatusVariant = (s: ProjectStatus) => {
  if (s === 'Active') return 'success';
  if (s === 'On Hold') return 'warning';
  return 'info';
};

const PAGE_LABELS: Record<Page, string> = {
  dashboard: 'Dashboard',
  members: 'Members',
  projects: 'Projects',
  calendar: 'Calendar',
  files: 'Files',
  settings: 'Settings',
};

// ─── MemberForm (shared add/edit form) ───────────────────────────────────────

interface MemberFormProps {
  initial?: Partial<Member>;
  onSubmit: (data: Omit<Member, 'id'>) => void;
  onCancel: () => void;
  submitLabel: string;
}

const MemberForm = ({ initial = {}, onSubmit, onCancel, submitLabel }: MemberFormProps) => {
  const [name, setName] = useState(initial.name ?? '');
  const [email, setEmail] = useState(initial.email ?? '');
  const [role, setRole] = useState<string>(initial.role ?? 'Developer');
  const [startDate, setStartDate] = useState(initial.joinedDate ?? '');
  const [bio, setBio] = useState(initial.bio ?? '');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role: role as Role,
      status: initial.status ?? 'Active',
      joinedDate: startDate || new Date().toISOString().slice(0, 10),
      bio: bio.trim(),
    });
  };

  return (
    <Stack space={4}>
      <TextField label="Full Name" value={name} onChange={setName} isRequired />
      <TextField label="Email" value={email} onChange={setEmail} isRequired />
      <Select
        label="Role"
        selectedKey={role}
        onSelectionChange={(k) => setRole(k as string)}
      >
        <Item key="Developer">Developer</Item>
        <Item key="Designer">Designer</Item>
        <Item key="Manager">Manager</Item>
        <Item key="QA">QA</Item>
      </Select>
      <TextField label="Start Date" value={startDate} onChange={setStartDate} placeholder="YYYY-MM-DD" />
      <TextArea label="Bio" value={bio} onChange={setBio} />
      <Inline space={2}>
        <Button onPress={onCancel}>Cancel</Button>
        <Button variant="primary" onPress={handleSubmit}>{submitLabel}</Button>
      </Inline>
    </Stack>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface DashboardPageProps {
  members: Member[];
  projects: Project[];
}

const DashboardPage = ({ members, projects }: DashboardPageProps) => {
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const hours = 342;

  return (
    <Stack space={8}>
      <Headline level={1}>Team Overview</Headline>

      {/* Summary cards */}
      <Inline space={4} style={{ alignItems: "stretch" }}>
        <Card style={{ flex: 1, padding: '16px' }}>
          <Stack space={2}>
            <Text weight="bold">Members</Text>
            <Headline level={2}>{members.length}</Headline>
          </Stack>
        </Card>
        <Card style={{ flex: 1, padding: '16px' }}>
          <Stack space={2}>
            <Text weight="bold">Active Projects</Text>
            <Headline level={2}>{activeProjects}</Headline>
          </Stack>
        </Card>
        <Card style={{ flex: 1, padding: '16px' }}>
          <Stack space={2}>
            <Text weight="bold">Upcoming Deadlines</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
        <Card style={{ flex: 1, padding: '16px' }}>
          <Stack space={2}>
            <Inline space={2}>
              <Text weight="bold" style={{ flex: 1 }}>Hours This Week</Text>
              <TooltipTrigger>
                <Button size="small" variant="ghost" aria-label="Info">ⓘ</Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </TooltipTrigger>
            </Inline>
            <Headline level={2}>{hours.toLocaleString('en-US')}</Headline>
          </Stack>
        </Card>
      </Inline>

      {/* Recent Activity */}
      <Stack space={4}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity">
          <TableHeader>
            <Column>Member</Column>
            <Column>Action</Column>
            <Column>Project</Column>
            <Column>Date</Column>
          </TableHeader>
          <TableBody>
            {RECENT_ACTIVITY.map(a => (
              <Row key={a.id} id={a.id}>
                <Cell>{a.member}</Cell>
                <Cell>
                  <Badge variant={actionVariant(a.action)}>{a.action}</Badge>
                </Cell>
                <Cell>{a.project}</Cell>
                <Cell>{formatDate(a.date)}</Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </Stack>

      {/* Info banner */}
      <Card style={{ background: '#e8f4fd', padding: '12px 16px', borderLeft: '4px solid #2196f3', borderRadius: '4px' }}>
        <Text>Sprint 14 ends in 3 days. Review the project board for outstanding tasks.</Text>
      </Card>
    </Stack>
  );
};

// ─── Members detail panel ─────────────────────────────────────────────────────

interface MemberDetailPanelProps {
  member: Member;
  onClose: () => void;
}

const MemberDetailPanel = ({ member, onClose }: MemberDetailPanelProps) => (
  <Card style={{ width: '280px', flexShrink: 0, padding: '20px', position: 'sticky', top: 0 }}>
    <Stack space={4}>
      <Inline space={2} style={{ alignItems: "center" }}>
        <Text weight="bold" style={{ flex: 1 }}>{member.name}</Text>
        <Button size="small" onPress={onClose}>✕</Button>
      </Inline>
      <Divider />
      <Stack space={2}>
        <Text size="small">Role</Text>
        <Badge variant="info">{member.role}</Badge>
      </Stack>
      <Stack space={2}>
        <Text size="small">Email</Text>
        <Text>{member.email}</Text>
      </Stack>
      <Stack space={2}>
        <Text size="small">Status</Text>
        <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
      </Stack>
      <Stack space={2}>
        <Text size="small">Joined</Text>
        <Text>{formatDate(member.joinedDate)}</Text>
      </Stack>
      {member.bio && (
        <Stack space={2}>
          <Text size="small">Bio</Text>
          <Text>{member.bio}</Text>
        </Stack>
      )}
    </Stack>
  </Card>
);

// ─── Members ──────────────────────────────────────────────────────────────────

interface MembersPageProps {
  members: Member[];
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onAdd: (data: Omit<Member, 'id'>) => void;
  onEdit: (id: string, data: Omit<Member, 'id'>) => void;
  onRemove: (id: string) => void;
  selectedMember: Member | null;
  onSelectMember: (m: Member | null) => void;
}

const MembersPage = ({
  members, view, onViewChange, onAdd, onEdit, onRemove, selectedMember, onSelectMember,
}: MembersPageProps) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = members;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') {
      list = list.filter(m => m.role === roleFilter);
    }
    return list;
  }, [members, search, roleFilter]);

  return (
    <Inline space={4} style={{ alignItems: "flex-start" }}>
      <Stack space={6} style={{ flex: 1, minWidth: 0 }}>
        <Headline level={1}>Team Members</Headline>

        {/* Toolbar */}
        <Inline space={3} style={{ alignItems: "center" }}>
          <SearchField
            aria-label="Search members"
            placeholder="Search by name…"
            value={search}
            onChange={setSearch}
          />
          <Select
            aria-label="Filter by role"
            selectedKey={roleFilter}
            onSelectionChange={(k) => setRoleFilter(k as string)}
          >
            <Item key="all">All Roles</Item>
            <Item key="Developer">Developer</Item>
            <Item key="Designer">Designer</Item>
            <Item key="Manager">Manager</Item>
            <Item key="QA">QA</Item>
          </Select>
          <Inline space={1}>
            <Button
              variant={view === 'table' ? 'primary' : 'secondary'}
              onPress={() => onViewChange('table')}
              size="small"
            >
              Table
            </Button>
            <Button
              variant={view === 'cards' ? 'primary' : 'secondary'}
              onPress={() => onViewChange('cards')}
              size="small"
            >
              Cards
            </Button>
          </Inline>
          <DialogTrigger>
            <Button variant="primary">Add Member</Button>
            <Dialog title="Add Member">
              {({ close }: { close: () => void }) => (
                <MemberForm
                  submitLabel="Add"
                  onSubmit={(data) => { onAdd(data); close(); }}
                  onCancel={close}
                />
              )}
            </Dialog>
          </DialogTrigger>
        </Inline>

        {/* Table view */}
        {view === 'table' && (
          <Table
            aria-label="Team Members"
            onRowAction={(key) => {
              const m = filtered.find(x => x.id === key);
              if (m) onSelectMember(m);
            }}
          >
            <TableHeader>
              <Column>Name</Column>
              <Column>Role</Column>
              <Column>Email</Column>
              <Column>Status</Column>
              <Column>Joined</Column>
              <Column>Actions</Column>
            </TableHeader>
            <TableBody>
              {filtered.map(m => (
                <Row key={m.id} id={m.id}>
                  <Cell>{m.name}</Cell>
                  <Cell>{m.role}</Cell>
                  <Cell>{m.email}</Cell>
                  <Cell>
                    <Badge variant={m.status === 'Active' ? 'success' : 'warning'}>{m.status}</Badge>
                  </Cell>
                  <Cell>{formatDate(m.joinedDate)}</Cell>
                  <Cell>
                    <Inline space={2}>
                      <DialogTrigger>
                        <Button size="small">Edit</Button>
                        <Dialog title={`Edit ${m.name}`}>
                          {({ close }: { close: () => void }) => (
                            <MemberForm
                              initial={m}
                              submitLabel="Save"
                              onSubmit={(data) => { onEdit(m.id, data); close(); }}
                              onCancel={close}
                            />
                          )}
                        </Dialog>
                      </DialogTrigger>
                      <DialogTrigger>
                        <Button size="small" variant="destructive">Remove</Button>
                        <Dialog title="Remove Member">
                          {({ close }: { close: () => void }) => (
                            <Stack space={4}>
                              <Text>Remove "{m.name}" from the team?</Text>
                              <Inline space={2}>
                                <Button onPress={close}>Cancel</Button>
                                <Button
                                  variant="destructive"
                                  onPress={() => { onRemove(m.id); close(); }}
                                >
                                  Remove
                                </Button>
                              </Inline>
                            </Stack>
                          )}
                        </Dialog>
                      </DialogTrigger>
                    </Inline>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Card view */}
        {view === 'cards' && (
          <Tiles tilesWidth="260px" space={4}>
            {filtered.map(m => (
              <Card
                key={m.id}
                style={{ padding: '16px', cursor: 'pointer' }}
                onClick={() => onSelectMember(m)}
              >
                <Stack space={3}>
                  <Text weight="bold">{m.name}</Text>
                  <Badge variant="info">{m.role}</Badge>
                  <Text size="small">{m.email}</Text>
                  <Inline space={2}>
                    <Button size="small" onPress={() => {}}>Message</Button>
                    <Button size="small" variant="secondary" onPress={() => onSelectMember(m)}>Profile</Button>
                  </Inline>
                </Stack>
              </Card>
            ))}
          </Tiles>
        )}
      </Stack>

      {/* Detail panel */}
      {selectedMember && (
        <MemberDetailPanel member={selectedMember} onClose={() => onSelectMember(null)} />
      )}
    </Inline>
  );
};

// ─── Projects ─────────────────────────────────────────────────────────────────

interface ProjectsPageProps {
  projects: Project[];
  onArchive: (ids: Set<string>) => void;
}

const ProjectsPage = ({ projects, onArchive }: ProjectsPageProps) => {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter(p => p.name.toLowerCase().includes(q) || p.lead.toLowerCase().includes(q));
  }, [projects, search]);

  const handleSelectionChange = (keys: unknown) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(filtered.map(p => p.id)));
    } else {
      setSelectedKeys(keys as Set<string>);
    }
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>

      <Inline space={3} style={{ alignItems: "center" }}>
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects…"
          value={search}
          onChange={setSearch}
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      {/* Bulk action bar */}
      {selectedKeys.size > 0 && (
        <Card style={{ background: '#f0f4ff', padding: '10px 16px' }}>
          <Inline space={3} style={{ alignItems: "center" }}>
            <Text>{selectedKeys.size} selected</Text>
            <Button
              variant="destructive"
              onPress={() => { onArchive(selectedKeys); setSelectedKeys(new Set()); }}
            >
              Archive Selected
            </Button>
            <Button variant="secondary" onPress={() => alert('Exporting…')}>Export</Button>
            <Button size="small" onPress={() => setSelectedKeys(new Set())}>Clear</Button>
          </Inline>
        </Card>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader>
          <Column>Project</Column>
          <Column>Lead</Column>
          <Column>Members</Column>
          <Column>Deadline</Column>
          <Column>Progress</Column>
          <Column>Status</Column>
        </TableHeader>
        <TableBody>
          {filtered.map(p => (
            <Row key={p.id} id={p.id}>
              <Cell>{p.name}</Cell>
              <Cell>{p.lead}</Cell>
              <Cell>{p.members}</Cell>
              <Cell>{formatDate(p.deadline)}</Cell>
              <Cell>
                <Inline space={2} style={{ alignItems: "center" }}>
                  <ProgressBar
                    aria-label={`${p.progress}%`}
                    value={p.progress}
                    maxValue={100}
                    style={{ width: '80px' }}
                  />
                  <Text size="small">{p.progress}%</Text>
                </Inline>
              </Cell>
              <Cell>
                <Badge variant={projectStatusVariant(p.status)}>{p.status}</Badge>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

// ─── Calendar ─────────────────────────────────────────────────────────────────

const CalendarPage = () => {
  const today = new Date(2026, 5, 23); // June 23 2026
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const eventsByDate: Record<string, CalendarEvent> = {};
  CALENDAR_EVENTS.forEach(e => { eventsByDate[e.date] = e; });

  const dayStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>

      <Card style={{ padding: '20px' }}>
        <Stack space={4}>
          <Text weight="bold">{monthName}</Text>
          <Stack space={1}>
            {/* Day headers */}
            <Inline space={0} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <Text key={d} weight="bold" style={{ textAlign: 'center', padding: '4px' }}>{d}</Text>
              ))}
            </Inline>
            {/* Weeks */}
            {weeks.map((week, wi) => (
              <Inline key={wi} space={0} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {week.map((day, di) => {
                  const ds = day ? dayStr(day) : '';
                  const evt = ds ? eventsByDate[ds] : undefined;
                  const isToday = day === today.getDate();
                  return (
                    <Stack
                      key={di}
                      space={1}
                      style={{
                        padding: '6px',
                        minHeight: '48px',
                        textAlign: 'center',
                        background: isToday ? '#dbeafe' : undefined,
                        borderRadius: '4px',
                      }}
                    >
                      {day !== null && (
                        <>
                          <Text size="small" weight={isToday ? 'bold' : undefined}>{day}</Text>
                          {evt && (
                            <Badge variant={eventVariant(evt.type)}>
                              {evt.type}
                            </Badge>
                          )}
                        </>
                      )}
                    </Stack>
                  );
                })}
              </Inline>
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* Upcoming events */}
      <Stack space={4}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={3}>
          {CALENDAR_EVENTS.map(e => (
            <Card key={e.id} style={{ padding: '12px 16px' }}>
              <Inline space={4} style={{ alignItems: "center" }}>
                <Text weight="bold" style={{ minWidth: '120px' }}>{formatDate(e.date)}</Text>
                <Text style={{ flex: 1 }}>{e.name}</Text>
                <Badge variant={eventVariant(e.type)}>{e.type}</Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

// ─── Files ────────────────────────────────────────────────────────────────────

// Upload dialog sub-component (defined before FilesPage to avoid forward reference)
const UploadDialog = ({ onUpload }: { onUpload: (desc: string, cat: string) => void }) => {
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Document');
  return (
    <DialogTrigger>
      <Button variant="primary">Upload</Button>
      <Dialog title="Upload Files">
        {({ close }: { close: () => void }) => (
          <Stack space={4}>
            <TextField label="Select file(s)" placeholder="Choose files to upload" />
            <TextField label="Description" value={desc} onChange={setDesc} />
            <Select label="Category" selectedKey={category} onSelectionChange={(k) => setCategory(k as string)}>
              <Item key="Document">Document</Item>
              <Item key="Image">Image</Item>
              <Item key="Spreadsheet">Spreadsheet</Item>
            </Select>
            <Inline space={2}>
              <Button onPress={close}>Cancel</Button>
              <Button variant="primary" onPress={() => { onUpload(desc, category); close(); }}>Upload</Button>
            </Inline>
          </Stack>
        )}
      </Dialog>
    </DialogTrigger>
  );
};

const FilesPage = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filtered = useMemo(() => {
    let list = files;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') {
      list = list.filter(f => f.type === typeFilter);
    }
    return list;
  }, [files, search, typeFilter]);

  const handleUpload = (desc: string, category: string) => {
    const newFile: FileItem = {
      id: genId(),
      name: `Uploaded File.${category === 'Document' ? 'pdf' : category === 'Image' ? 'png' : 'xlsx'}`,
      type: category as FileType,
      size: 1000000,
      uploadedBy: 'John Doe',
      date: '2026-06-23',
    };
    setFiles(prev => [newFile, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={3} style={{ alignItems: "center" }}>
        <SearchField
          aria-label="Search files"
          placeholder="Search files…"
          value={search}
          onChange={setSearch}
        />
        <Select
          aria-label="Filter by type"
          selectedKey={typeFilter}
          onSelectionChange={(k) => setTypeFilter(k as string)}
        >
          <Item key="all">All</Item>
          <Item key="Document">Documents</Item>
          <Item key="Image">Images</Item>
          <Item key="Spreadsheet">Spreadsheets</Item>
        </Select>
        <UploadDialog onUpload={handleUpload} />
      </Inline>

      {uploadSuccess && (
        <Card style={{ background: '#ecfdf5', padding: '12px 16px', borderLeft: '4px solid #10b981', borderRadius: '4px' }}>
          <Inline space={2} style={{ alignItems: "center" }}>
            <Text>Files uploaded successfully.</Text>
            <Button size="small" onPress={() => setUploadSuccess(false)}>✕</Button>
          </Inline>
        </Card>
      )}

      <Table aria-label="Shared Files">
        <TableHeader>
          <Column>File Name</Column>
          <Column>Type</Column>
          <Column>Size</Column>
          <Column>Uploaded By</Column>
          <Column>Date</Column>
          <Column>Actions</Column>
        </TableHeader>
        <TableBody>
          {filtered.map(f => (
            <Row key={f.id} id={f.id}>
              <Cell>{f.name}</Cell>
              <Cell>{f.type}</Cell>
              <Cell>{formatFileSize(f.size)}</Cell>
              <Cell>{f.uploadedBy}</Cell>
              <Cell>{formatDate(f.date)}</Cell>
              <Cell>
                <MenuTrigger>
                  <Button size="small">Actions ▾</Button>
                  <Menu onAction={(key) => {
                    if (key === 'delete') {
                      setFiles(prev => prev.filter(x => x.id !== f.id));
                    }
                  }}>
                    <Item key="download">Download</Item>
                    <Item key="rename">Rename</Item>
                    <Item key="delete">Delete</Item>
                  </Menu>
                </MenuTrigger>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

// ─── Settings ─────────────────────────────────────────────────────────────────

interface SettingsPageProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}

const SettingsPage = ({ teamName, onTeamNameChange }: SettingsPageProps) => {
  const [localTeamName, setLocalTeamName] = useState(teamName);
  const [description, setDescription] = useState('A high-performance cross-functional team.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [saveMsg, setSaveMsg] = useState('');
  const [notifSaveMsg, setNotifSaveMsg] = useState('');

  const [notifs, setNotifs] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: true,
  });

  const [integrations, setIntegrations] = useState({
    slack: true,
    github: false,
    jira: false,
  });
  const [confirmDisconnect, setConfirmDisconnect] = useState('');

  const handleSaveGeneral = () => {
    onTeamNameChange(localTeamName);
    setSaveMsg('Settings updated.');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleSaveNotifs = () => {
    setNotifSaveMsg('Preferences saved.');
    setTimeout(() => setNotifSaveMsg(''), 3000);
  };

  const toggleIntegration = (key: string) => {
    setIntegrations(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    setConfirmDisconnect('');
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>
      <Tabs>
        <TabList>
          <Tab id="general">General</Tab>
          <Tab id="notifications">Notifications</Tab>
          <Tab id="integrations">Integrations</Tab>
        </TabList>

        <TabPanel id="general">
          <Stack space={4} style={{ paddingTop: '16px' }}>
            <TextField label="Team Name" value={localTeamName} onChange={setLocalTeamName} />
            <TextArea label="Description" value={description} onChange={setDescription} />
            <Select label="Default Timezone" selectedKey={timezone} onSelectionChange={(k) => setTimezone(k as string)}>
              <Item key="UTC">UTC</Item>
              <Item key="CET">CET</Item>
              <Item key="EST">EST</Item>
              <Item key="PST">PST</Item>
            </Select>
            <Select label="Date Format" selectedKey={dateFormat} onSelectionChange={(k) => setDateFormat(k as string)}>
              <Item key="MM/DD/YYYY">MM/DD/YYYY</Item>
              <Item key="DD.MM.YYYY">DD.MM.YYYY</Item>
              <Item key="YYYY-MM-DD">YYYY-MM-DD</Item>
            </Select>
            <Inline space={3} style={{ alignItems: "center" }}>
              <Button variant="primary" onPress={handleSaveGeneral}>Save</Button>
              {saveMsg && <Text>{saveMsg}</Text>}
            </Inline>
          </Stack>
        </TabPanel>

        <TabPanel id="notifications">
          <Stack space={5} style={{ paddingTop: '16px' }}>
            {([
              ['newMember', 'New member joins', 'Get notified when someone joins the team'],
              ['deadline', 'Project deadline approaching', 'Reminder 3 days before deadline'],
              ['digest', 'Weekly digest', 'Summary of team activity every Monday'],
              ['mention', 'Mention notifications', 'When someone mentions you in a comment'],
              ['calendar', 'Calendar reminders', '15 minutes before scheduled events'],
            ] as [keyof typeof notifs, string, string][]).map(([key, label, desc]) => (
              <Inline key={key} space={4} style={{ alignItems: "center" }}>
                <Stack space={1} style={{ flex: 1 }}>
                  <Text weight="bold">{label}</Text>
                  <Text size="small">{desc}</Text>
                </Stack>
                <Switch
                  isSelected={notifs[key]}
                  onChange={(v) => setNotifs(prev => ({ ...prev, [key]: v }))}
                >
                  {notifs[key] ? 'On' : 'Off'}
                </Switch>
              </Inline>
            ))}
            <Inline space={3} style={{ alignItems: "center" }}>
              <Button variant="primary" onPress={handleSaveNotifs}>Save Preferences</Button>
              {notifSaveMsg && <Text>{notifSaveMsg}</Text>}
            </Inline>
          </Stack>
        </TabPanel>

        <TabPanel id="integrations">
          <Stack space={4} style={{ paddingTop: '16px' }}>
            <Inline space={4} style={{ alignItems: "stretch" }}>
              {([
                { key: 'slack', name: 'Slack', desc: 'Send notifications and updates to Slack channels.' },
                { key: 'github', name: 'GitHub', desc: 'Sync commits, PRs, and issues with your projects.' },
                { key: 'jira', name: 'Jira', desc: 'Link Jira issues and track project progress.' },
              ] as { key: keyof typeof integrations; name: string; desc: string }[]).map(({ key, name, desc }) => (
                <Card key={key} style={{ flex: 1, padding: '16px' }}>
                  <Stack space={3}>
                    <Inline space={2} style={{ alignItems: "center" }}>
                      <Text weight="bold" style={{ flex: 1 }}>{name}</Text>
                      <Badge variant={integrations[key] ? 'success' : 'warning'}>
                        {integrations[key] ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </Inline>
                    <Text size="small">{desc}</Text>
                    {integrations[key] ? (
                      confirmDisconnect === key ? (
                        <Stack space={2}>
                          <Text size="small">Disconnect {name}?</Text>
                          <Inline space={2}>
                            <Button size="small" onPress={() => setConfirmDisconnect('')}>Cancel</Button>
                            <Button size="small" variant="destructive" onPress={() => toggleIntegration(key)}>Disconnect</Button>
                          </Inline>
                        </Stack>
                      ) : (
                        <Button size="small" variant="secondary" onPress={() => setConfirmDisconnect(key)}>Disconnect</Button>
                      )
                    ) : (
                      <Button size="small" variant="primary" onPress={() => toggleIntegration(key)}>Connect</Button>
                    )}
                  </Stack>
                </Card>
              ))}
            </Inline>
          </Stack>
        </TabPanel>
      </Tabs>
    </Stack>
  );
};

// ─── App shell ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'members', label: 'Members' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'files', label: 'Files' },
];

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [membersView, setMembersView] = useState<ViewMode>('table');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [teamName, setTeamName] = useState('TeamHub');

  const handleAddMember = (data: Omit<Member, 'id'>) => {
    setMembers(prev => [...prev, { ...data, id: genId() }]);
  };

  const handleEditMember = (id: string, data: Omit<Member, 'id'>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    if (selectedMember?.id === id) {
      setSelectedMember({ ...selectedMember, ...data });
    }
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (selectedMember?.id === id) setSelectedMember(null);
  };

  const handleArchiveProjects = (ids: Set<string>) => {
    setProjects(prev => prev.filter(p => !ids.has(p.id)));
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage members={members} projects={projects} />;
      case 'members':
        return (
          <MembersPage
            members={members}
            view={membersView}
            onViewChange={setMembersView}
            onAdd={handleAddMember}
            onEdit={handleEditMember}
            onRemove={handleRemoveMember}
            selectedMember={selectedMember}
            onSelectMember={setSelectedMember}
          />
        );
      case 'projects':
        return <ProjectsPage projects={projects} onArchive={handleArchiveProjects} />;
      case 'calendar':
        return <CalendarPage />;
      case 'files':
        return <FilesPage />;
      case 'settings':
        return <SettingsPage teamName={teamName} onTeamNameChange={setTeamName} />;
      default:
        return null;
    }
  };

  return (
    <Inline
      style={{ alignItems: 'stretch', height: '100vh', overflow: 'hidden', display: 'flex' }}
    >
      {/* Sidebar */}
      <Stack
        style={{
          width: sidebarCollapsed ? '60px' : '220px',
          flexShrink: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#1e293b',
          color: '#fff',
          transition: 'width 0.2s',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* App name */}
        <Stack style={{ padding: '20px 16px 12px' }}>
          {!sidebarCollapsed && (
            <Text weight="bold" style={{ color: '#fff', fontSize: '18px' }}>{teamName}</Text>
          )}
          {sidebarCollapsed && (
            <Text weight="bold" style={{ color: '#fff', fontSize: '18px' }}>T</Text>
          )}
        </Stack>

        <Divider />

        {/* Nav items */}
        <Stack style={{ padding: '8px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'primary' : 'ghost'}
              onPress={() => navigate(item.id)}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                marginBottom: '2px',
                color: currentPage === item.id ? undefined : '#94a3b8',
              }}
            >
              {sidebarCollapsed ? item.label[0] : item.label}
            </Button>
          ))}

          <Divider style={{ margin: '8px 0' }} />

          <Button
            variant={currentPage === 'settings' ? 'primary' : 'ghost'}
            onPress={() => navigate('settings')}
            style={{
              width: '100%',
              justifyContent: 'flex-start',
              color: currentPage === 'settings' ? undefined : '#94a3b8',
            }}
          >
            {sidebarCollapsed ? 'S' : 'Settings'}
          </Button>
        </Stack>
      </Stack>

      {/* Main area */}
      <Stack
        style={{
          flex: 1,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top nav */}
        <Inline
          space={4}
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#fff',
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          {/* Sidebar toggle */}
          <Button
            size="small"
            variant="secondary"
            onPress={() => setSidebarCollapsed(c => !c)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </Button>

          {/* Breadcrumb */}
          <Stack style={{ flex: 1 }}>
            <Breadcrumbs>
              <Item key="home">{teamName}</Item>
              <Item key="current">{PAGE_LABELS[currentPage]}</Item>
            </Breadcrumbs>
          </Stack>

          {/* Account + Help */}
          <Inline space={2} style={{ alignItems: "center" }}>
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

            <DialogTrigger>
              <Button size="small" variant="secondary">?</Button>
              <Dialog title="Help">
                {({ close }: { close: () => void }) => (
                  <Stack space={4}>
                    <Text>Use the sidebar to navigate between sections.</Text>
                    <Button onPress={close}>Close</Button>
                  </Stack>
                )}
              </Dialog>
            </DialogTrigger>
          </Inline>
        </Inline>

        {/* Scrollable content */}
        <Stack
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {renderPage()}
        </Stack>
      </Stack>
    </Inline>
  );
};

export default TestApp;
