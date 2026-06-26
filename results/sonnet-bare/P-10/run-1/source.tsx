import React, { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogTrigger,
  Divider,
  Heading,
  Inline,
  Item,
  Menu,
  MenuTrigger,
  Message,
  Select,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextField,
  Tooltip,
  TooltipTrigger,
} from '@marigold/components';

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = 'dashboard' | 'members' | 'projects' | 'calendar' | 'files' | 'settings';
type MemberRole = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';
type ProjectStatus = 'Active' | 'On Hold' | 'Completed';
type ActivityType = 'Commit' | 'Review' | 'Deploy';
type EventType = 'Meeting' | 'Deadline' | 'Social';
type FileCategory = 'Document' | 'Image' | 'Spreadsheet';

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
  type: FileCategory;
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

interface ActivityItem {
  id: string;
  member: string;
  action: ActivityType;
  project: string;
  date: Date;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const makeId = () => Math.random().toString(36).slice(2, 9);

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Chen', role: 'Developer', email: 'alice@example.com', status: 'Active', joined: new Date(2024, 0, 15), bio: 'Full-stack developer with 5 years of experience in React and Node.js.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active', joined: new Date(2024, 2, 3), bio: 'UI/UX designer specialising in accessible, user-centred web applications.' },
  { id: '3', name: 'Carol Davis', role: 'Manager', email: 'carol@example.com', status: 'Active', joined: new Date(2023, 10, 20), bio: 'Project manager with a background in agile methodologies and team coaching.' },
  { id: '4', name: 'Dave Johnson', role: 'Developer', email: 'dave@example.com', status: 'On Leave', joined: new Date(2024, 1, 8), bio: 'Backend specialist focused on microservices, Kubernetes, and data pipelines.' },
  { id: '5', name: 'Eve Wilson', role: 'QA', email: 'eve@example.com', status: 'Active', joined: new Date(2024, 3, 25), bio: 'QA engineer with expertise in automated testing and CI/CD quality gates.' },
  { id: '6', name: 'Frank Brown', role: 'Designer', email: 'frank@example.com', status: 'Active', joined: new Date(2024, 5, 1), bio: 'Visual designer passionate about design systems and accessible interfaces.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Auth Service', lead: 'Alice Chen', memberCount: 3, deadline: new Date(2026, 6, 15), progress: 75, status: 'Active' },
  { id: '2', name: 'UI Redesign', lead: 'Bob Smith', memberCount: 4, deadline: new Date(2026, 7, 1), progress: 45, status: 'Active' },
  { id: '3', name: 'API Gateway', lead: 'Carol Davis', memberCount: 5, deadline: new Date(2026, 5, 30), progress: 90, status: 'Active' },
  { id: '4', name: 'Mobile App', lead: 'Dave Johnson', memberCount: 2, deadline: new Date(2026, 8, 15), progress: 20, status: 'On Hold' },
  { id: '5', name: 'Data Pipeline', lead: 'Eve Wilson', memberCount: 3, deadline: new Date(2026, 11, 31), progress: 100, status: 'Completed' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'requirements.pdf', type: 'Document', size: 2400000, uploadedBy: 'Alice Chen', date: new Date(2026, 5, 15) },
  { id: '2', name: 'logo.png', type: 'Image', size: 1200000, uploadedBy: 'Bob Smith', date: new Date(2026, 5, 16) },
  { id: '3', name: 'budget.xlsx', type: 'Spreadsheet', size: 856000, uploadedBy: 'Carol Davis', date: new Date(2026, 5, 17) },
  { id: '4', name: 'roadmap.pdf', type: 'Document', size: 3100000, uploadedBy: 'Dave Johnson', date: new Date(2026, 5, 18) },
  { id: '5', name: 'mockups.png', type: 'Image', size: 4500000, uploadedBy: 'Eve Wilson', date: new Date(2026, 5, 19) },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', date: new Date(2026, 5, 23), name: 'Sprint Review', type: 'Meeting' },
  { id: '2', date: new Date(2026, 5, 25), name: 'API v2 Launch', type: 'Deadline' },
  { id: '3', date: new Date(2026, 5, 28), name: 'Team Lunch', type: 'Social' },
  { id: '4', date: new Date(2026, 6, 2), name: 'Q3 Planning', type: 'Meeting' },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: '1', member: 'Alice Chen', action: 'Commit', project: 'auth-service', date: new Date(2026, 4, 28) },
  { id: '2', member: 'Bob Smith', action: 'Review', project: 'api-gateway', date: new Date(2026, 4, 29) },
  { id: '3', member: 'Carol Davis', action: 'Deploy', project: 'frontend', date: new Date(2026, 5, 1) },
  { id: '4', member: 'Dave Johnson', action: 'Commit', project: 'database', date: new Date(2026, 5, 5) },
  { id: '5', member: 'Eve Wilson', action: 'Review', project: 'mobile-app', date: new Date(2026, 5, 10) },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const fmtLongDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const fmtNumber = (n: number) => n.toLocaleString('en-US');

const fmtBytes = (bytes: number) => {
  if (bytes >= 1_000_000)
    return `${(bytes / 1_000_000).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`;
  return `${Math.round(bytes / 1000).toLocaleString('en-US')} KB`;
};

const memberStatusVariant = (s: MemberStatus) => (s === 'Active' ? 'success' : 'warning') as 'success' | 'warning';
const projectStatusVariant = (s: ProjectStatus): 'success' | 'warning' | 'info' =>
  s === 'Active' ? 'success' : s === 'On Hold' ? 'warning' : 'info';
const activityVariant = (a: ActivityType): 'info' | 'warning' | 'success' =>
  a === 'Commit' ? 'info' : a === 'Review' ? 'warning' : 'success';
const eventVariant = (e: EventType): 'info' | 'warning' | 'success' =>
  e === 'Meeting' ? 'info' : e === 'Deadline' ? 'warning' : 'success';

// ─── Member form ──────────────────────────────────────────────────────────────

interface MemberFormValues {
  name: string;
  email: string;
  role: MemberRole;
  startDate: string;
  bio: string;
}

function MemberForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: MemberFormValues;
  onSubmit: (v: MemberFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [v, setV] = useState<MemberFormValues>(initial);
  const set = (k: keyof MemberFormValues) => (val: string) => setV(prev => ({ ...prev, [k]: val }));

  return (
    <Stack space={4}>
      <TextField label="Full Name" value={v.name} onChange={set('name')} isRequired />
      <TextField label="Email" value={v.email} onChange={set('email')} isRequired />
      <Select
        label="Role"
        selectedKey={v.role}
        onSelectionChange={key => setV(prev => ({ ...prev, role: key as MemberRole }))}
      >
        <Item key="Developer">Developer</Item>
        <Item key="Designer">Designer</Item>
        <Item key="Manager">Manager</Item>
        <Item key="QA">QA</Item>
      </Select>
      <TextField label="Start Date" value={v.startDate} onChange={set('startDate')} />
      <TextField label="Bio" value={v.bio} onChange={set('bio')} />
      <Inline space={2}>
        <Button variant="primary" onPress={() => onSubmit(v)}>{submitLabel}</Button>
        <Button onPress={onCancel}>Cancel</Button>
      </Inline>
    </Stack>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────

function DashboardPage({ members, projects }: { members: Member[]; projects: Project[] }) {
  const activeProjects = projects.filter(p => p.status === 'Active').length;

  return (
    <Stack space={6}>
      <Heading level={1}>Team Overview</Heading>

      {/* Summary cards */}
      <Inline space={4}>
        <Card>
          <Stack space={1}>
            <Text>Members</Text>
            <Heading level={2}>{fmtNumber(members.length)}</Heading>
          </Stack>
        </Card>

        <Card>
          <Stack space={1}>
            <Text>Active Projects</Text>
            <Heading level={2}>{fmtNumber(activeProjects)}</Heading>
          </Stack>
        </Card>

        <Card>
          <Stack space={1}>
            <Text>Upcoming Deadlines</Text>
            <Heading level={2}>{fmtNumber(8)}</Heading>
          </Stack>
        </Card>

        <Card>
          <Stack space={1}>
            <TooltipTrigger>
              <Text>Hours This Week</Text>
              <Tooltip>Aggregate of all team members.</Tooltip>
            </TooltipTrigger>
            <Heading level={2}>{fmtNumber(342)}</Heading>
          </Stack>
        </Card>
      </Inline>

      {/* Recent Activity */}
      <Stack space={3}>
        <Heading level={2}>Recent Activity</Heading>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column key="member">Member</Table.Column>
            <Table.Column key="action">Action</Table.Column>
            <Table.Column key="project">Project</Table.Column>
            <Table.Column key="date">Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {RECENT_ACTIVITY.map(item => (
              <Table.Row key={item.id} textValue={item.member}>
                <Table.Cell>{item.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={activityVariant(item.action)}>{item.action}</Badge>
                </Table.Cell>
                <Table.Cell>{item.project}</Table.Cell>
                <Table.Cell>{fmtLongDate(item.date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      {/* Info banner */}
      <Message variant="info">
        Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
      </Message>
    </Stack>
  );
}

// ─── Members page ─────────────────────────────────────────────────────────────

function MembersPage({
  members,
  setMembers,
  viewMode,
  setViewMode,
  selectedMember,
  setSelectedMember,
}: {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  viewMode: 'table' | 'card';
  setViewMode: (m: 'table' | 'card') => void;
  selectedMember: Member | null;
  setSelectedMember: (m: Member | null) => void;
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      members.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || m.role === roleFilter;
        return matchSearch && matchRole;
      }),
    [members, search, roleFilter]
  );

  const addMember = (v: MemberFormValues) => {
    const m: Member = {
      id: makeId(),
      name: v.name,
      email: v.email,
      role: v.role,
      status: 'Active',
      joined: v.startDate ? new Date(v.startDate) : new Date(),
      bio: v.bio,
    };
    setMembers(prev => [...prev, m]);
  };

  const updateMember = (updated: Member) => {
    setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
    if (selectedMember?.id === updated.id) setSelectedMember(updated);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (selectedMember?.id === id) setSelectedMember(null);
    setConfirmRemoveId(null);
  };

  return (
    <Inline space={4} alignY="start">
      <Stack space={5} style={{ flex: 1, minWidth: 0 }}>
        <Heading level={1}>Team Members</Heading>

        {/* Toolbar */}
        <Inline space={3} alignY="center">
          <TextField
            label="Search"
            placeholder="Search by name…"
            value={search}
            onChange={setSearch}
          />
          <Select
            label="Role"
            selectedKey={roleFilter}
            onSelectionChange={key => setRoleFilter(key as string)}
          >
            <Item key="all">All Roles</Item>
            <Item key="Developer">Developer</Item>
            <Item key="Designer">Designer</Item>
            <Item key="Manager">Manager</Item>
            <Item key="QA">QA</Item>
          </Select>
          <Inline space={1}>
            <Button
              variant={viewMode === 'table' ? 'primary' : undefined}
              onPress={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'card' ? 'primary' : undefined}
              onPress={() => setViewMode('card')}
            >
              Cards
            </Button>
          </Inline>
          <DialogTrigger>
            <Button variant="primary">Add Member</Button>
            <Dialog>
              {({ close }: { close: () => void }) => (
                <Stack space={4}>
                  <Heading>Add Member</Heading>
                  <MemberForm
                    initial={{ name: '', email: '', role: 'Developer', startDate: '', bio: '' }}
                    onSubmit={v => { addMember(v); close(); }}
                    onCancel={close}
                    submitLabel="Add"
                  />
                </Stack>
              )}
            </Dialog>
          </DialogTrigger>
        </Inline>

        {/* Table view */}
        {viewMode === 'table' && (
          <Table
            aria-label="Team members"
            onRowAction={key => {
              const m = members.find(mb => mb.id === key);
              if (m) setSelectedMember(selectedMember?.id === m.id ? null : m);
            }}
          >
            <Table.Header>
              <Table.Column key="name">Name</Table.Column>
              <Table.Column key="role">Role</Table.Column>
              <Table.Column key="email">Email</Table.Column>
              <Table.Column key="status">Status</Table.Column>
              <Table.Column key="joined">Joined</Table.Column>
              <Table.Column key="actions">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {filtered.map(member => (
                <Table.Row key={member.id} textValue={member.name}>
                  <Table.Cell>{member.name}</Table.Cell>
                  <Table.Cell>{member.role}</Table.Cell>
                  <Table.Cell>{member.email}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={memberStatusVariant(member.status)}>{member.status}</Badge>
                  </Table.Cell>
                  <Table.Cell>{fmtDate(member.joined)}</Table.Cell>
                  <Table.Cell>
                    <Inline space={2}>
                      <DialogTrigger>
                        <Button>Edit</Button>
                        <Dialog>
                          {({ close }: { close: () => void }) => (
                            <Stack space={4}>
                              <Heading>Edit Member</Heading>
                              <MemberForm
                                initial={{
                                  name: member.name,
                                  email: member.email,
                                  role: member.role,
                                  startDate: member.joined.toISOString().split('T')[0],
                                  bio: member.bio,
                                }}
                                onSubmit={v => {
                                  updateMember({
                                    ...member,
                                    name: v.name,
                                    email: v.email,
                                    role: v.role,
                                    joined: v.startDate ? new Date(v.startDate) : member.joined,
                                    bio: v.bio,
                                  });
                                  close();
                                }}
                                onCancel={close}
                                submitLabel="Save"
                              />
                            </Stack>
                          )}
                        </Dialog>
                      </DialogTrigger>
                      {confirmRemoveId === member.id ? (
                        <Inline space={1}>
                          <Text>Remove?</Text>
                          <Button variant="primary" onPress={() => removeMember(member.id)}>Yes</Button>
                          <Button onPress={() => setConfirmRemoveId(null)}>No</Button>
                        </Inline>
                      ) : (
                        <Button onPress={() => setConfirmRemoveId(member.id)}>Remove</Button>
                      )}
                    </Inline>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}

        {/* Card view */}
        {viewMode === 'card' && (
          <Stack
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {filtered.map(member => (
              <Card key={member.id}>
                <Stack space={3}>
                  <Button
                    variant="ghost"
                    onPress={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                    style={{ textAlign: 'left', width: '100%', padding: 0 }}
                  >
                    <Stack space={1}>
                      <Heading level={3}>{member.name}</Heading>
                      <Badge variant="info">{member.role}</Badge>
                      <Text>{member.email}</Text>
                    </Stack>
                  </Button>
                  <Inline space={2}>
                    <DialogTrigger>
                      <Button>Message</Button>
                      <Dialog>
                        {({ close }: { close: () => void }) => (
                          <Stack space={4}>
                            <Heading>Message {member.name}</Heading>
                            <TextField label="Message" />
                            <Inline space={2}>
                              <Button variant="primary" onPress={close}>Send</Button>
                              <Button onPress={close}>Cancel</Button>
                            </Inline>
                          </Stack>
                        )}
                      </Dialog>
                    </DialogTrigger>
                    <DialogTrigger>
                      <Button>Edit</Button>
                      <Dialog>
                        {({ close }: { close: () => void }) => (
                          <Stack space={4}>
                            <Heading>Edit Member</Heading>
                            <MemberForm
                              initial={{
                                name: member.name,
                                email: member.email,
                                role: member.role,
                                startDate: member.joined.toISOString().split('T')[0],
                                bio: member.bio,
                              }}
                              onSubmit={v => {
                                updateMember({
                                  ...member,
                                  name: v.name,
                                  email: v.email,
                                  role: v.role,
                                  joined: v.startDate ? new Date(v.startDate) : member.joined,
                                  bio: v.bio,
                                });
                                close();
                              }}
                              onCancel={close}
                              submitLabel="Save"
                            />
                          </Stack>
                        )}
                      </Dialog>
                    </DialogTrigger>
                    {confirmRemoveId === member.id ? (
                      <Inline space={1}>
                        <Button variant="primary" onPress={() => removeMember(member.id)}>Yes</Button>
                        <Button onPress={() => setConfirmRemoveId(null)}>No</Button>
                      </Inline>
                    ) : (
                      <Button onPress={() => setConfirmRemoveId(member.id)}>Remove</Button>
                    )}
                  </Inline>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Detail panel */}
      {selectedMember && (
        <Card style={{ width: '280px', flexShrink: 0 }}>
          <Stack space={3}>
            <Inline alignY="center">
              <Heading level={3} style={{ flex: 1 }}>{selectedMember.name}</Heading>
              <Button onPress={() => setSelectedMember(null)}>×</Button>
            </Inline>
            <Badge variant={memberStatusVariant(selectedMember.status)}>{selectedMember.status}</Badge>
            <Stack space={1}>
              <Text><strong>Role:</strong> {selectedMember.role}</Text>
              <Text><strong>Email:</strong> {selectedMember.email}</Text>
              <Text><strong>Joined:</strong> {fmtDate(selectedMember.joined)}</Text>
            </Stack>
            {selectedMember.bio && <Text>{selectedMember.bio}</Text>}
          </Stack>
        </Card>
      )}
    </Inline>
  );
}

// ─── Projects page ────────────────────────────────────────────────────────────

function ProjectsPage({
  projects,
  setProjects,
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const archiveSelected = () => {
    setProjects(prev => prev.filter(p => !selectedKeys.has(p.id)));
    setSelectedKeys(new Set());
  };

  const handleSelectionChange = (keys: 'all' | Set<React.Key>) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(filtered.map(p => p.id)));
    } else {
      setSelectedKeys(new Set(Array.from(keys as Set<React.Key>).map(String)));
    }
  };

  return (
    <Stack space={5}>
      <Heading level={1}>Projects</Heading>

      <Inline space={3} alignY="center">
        <TextField
          label="Search"
          placeholder="Search projects…"
          value={search}
          onChange={setSearch}
        />
        <DialogTrigger>
          <Button variant="primary">New Project</Button>
          <Dialog>
            {({ close }: { close: () => void }) => (
              <Stack space={4}>
                <Heading>New Project</Heading>
                <TextField label="Project Name" />
                <TextField label="Lead" />
                <TextField label="Deadline" />
                <Inline space={2}>
                  <Button variant="primary" onPress={close}>Create</Button>
                  <Button onPress={close}>Cancel</Button>
                </Inline>
              </Stack>
            )}
          </Dialog>
        </DialogTrigger>
      </Inline>

      {selectedKeys.size > 0 && (
        <Inline space={3} alignY="center">
          <Text>{selectedKeys.size} selected</Text>
          <Button variant="primary" onPress={archiveSelected}>Archive Selected</Button>
          <Button
            onPress={() => {
              /* export stub */
            }}
          >
            Export
          </Button>
        </Inline>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        <Table.Header>
          <Table.Column key="name">Project</Table.Column>
          <Table.Column key="lead">Lead</Table.Column>
          <Table.Column key="members">Members</Table.Column>
          <Table.Column key="deadline">Deadline</Table.Column>
          <Table.Column key="progress">Progress</Table.Column>
          <Table.Column key="status">Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(p => (
            <Table.Row key={p.id} textValue={p.name}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.memberCount}</Table.Cell>
              <Table.Cell>{fmtDate(p.deadline)}</Table.Cell>
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
}

// ─── Calendar page ────────────────────────────────────────────────────────────

function CalendarPage() {
  const YEAR = 2026;
  const MONTH = 5; // June (0-indexed)
  const MONTH_LABEL = 'June 2026';
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(YEAR, MONTH, 1).getDay();
  const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
  const allCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (allCells.length % 7 !== 0) allCells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < allCells.length; i += 7) {
    weeks.push(allCells.slice(i, i + 7));
  }

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    CALENDAR_EVENTS.forEach(ev => {
      if (ev.date.getFullYear() === YEAR && ev.date.getMonth() === MONTH) {
        const d = ev.date.getDate();
        map[d] = [...(map[d] || []), ev];
      }
    });
    return map;
  }, []);

  const TODAY = 21;

  return (
    <Stack space={6}>
      <Heading level={1}>Team Calendar</Heading>

      <Card>
        <Stack space={3}>
          <Heading level={2}>{MONTH_LABEL}</Heading>

          {/* Day headers */}
          <Stack
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
            }}
          >
            {DAY_NAMES.map(d => (
              <Text key={d} style={{ textAlign: 'center', fontWeight: 'bold', padding: '4px' }}>
                {d}
              </Text>
            ))}
          </Stack>

          {/* Calendar grid */}
          {weeks.map((week, wi) => (
            <Stack
              key={wi}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
              }}
            >
              {week.map((day, di) => (
                <Stack
                  key={di}
                  space={1}
                  style={{
                    minHeight: '60px',
                    padding: '4px',
                    border: day === TODAY ? '2px solid' : '1px solid #e2e8f0',
                    borderRadius: '4px',
                  }}
                >
                  {day !== null && (
                    <>
                      <Text style={{ fontWeight: day === TODAY ? 'bold' : 'normal' }}>{day}</Text>
                      {(eventsByDay[day] || []).map(ev => (
                        <Badge key={ev.id} variant={eventVariant(ev.type)}>
                          {ev.name}
                        </Badge>
                      ))}
                    </>
                  )}
                </Stack>
              ))}
            </Stack>
          ))}
        </Stack>
      </Card>

      {/* Upcoming events */}
      <Stack space={3}>
        <Heading level={2}>Upcoming Events</Heading>
        {CALENDAR_EVENTS.map(ev => (
          <Inline key={ev.id} space={3} alignY="center">
            <Text style={{ minWidth: '100px' }}>{fmtDate(ev.date)}</Text>
            <Text>{ev.name}</Text>
            <Badge variant={eventVariant(ev.type)}>{ev.type}</Badge>
          </Inline>
        ))}
      </Stack>
    </Stack>
  );
}

// ─── Files page ───────────────────────────────────────────────────────────────

function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameName, setRenameName] = useState('');

  const filtered = useMemo(
    () =>
      files.filter(f => {
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === 'all' || f.type === typeFilter;
        return matchSearch && matchType;
      }),
    [files, search, typeFilter]
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setConfirmDeleteId(null);
  };

  const renameFile = (id: string) => {
    setFiles(prev => prev.map(f => (f.id === id ? { ...f, name: renameName } : f)));
    setRenameId(null);
    setRenameName('');
  };

  return (
    <Stack space={5}>
      <Heading level={1}>Shared Files</Heading>

      {toast && <Message variant="success">{toast}</Message>}

      <Inline space={3} alignY="center">
        <TextField
          label="Search"
          placeholder="Search files…"
          value={search}
          onChange={setSearch}
        />
        <Select
          label="Type"
          selectedKey={typeFilter}
          onSelectionChange={key => setTypeFilter(key as string)}
        >
          <Item key="all">All</Item>
          <Item key="Document">Documents</Item>
          <Item key="Image">Images</Item>
          <Item key="Spreadsheet">Spreadsheets</Item>
        </Select>
        <DialogTrigger>
          <Button variant="primary">Upload</Button>
          <Dialog>
            {({ close }: { close: () => void }) => (
              <Stack space={4}>
                <Heading>Upload Files</Heading>
                <TextField label="Description" />
                <Select label="Category" defaultSelectedKey="Document">
                  <Item key="Document">Document</Item>
                  <Item key="Image">Image</Item>
                  <Item key="Spreadsheet">Spreadsheet</Item>
                </Select>
                <Inline space={2}>
                  <Button
                    variant="primary"
                    onPress={() => {
                      close();
                      showToast('Files uploaded successfully.');
                    }}
                  >
                    Upload
                  </Button>
                  <Button onPress={close}>Cancel</Button>
                </Inline>
              </Stack>
            )}
          </Dialog>
        </DialogTrigger>
      </Inline>

      <Table aria-label="Shared files">
        <Table.Header>
          <Table.Column key="name">File Name</Table.Column>
          <Table.Column key="type">Type</Table.Column>
          <Table.Column key="size">Size</Table.Column>
          <Table.Column key="uploadedBy">Uploaded By</Table.Column>
          <Table.Column key="date">Date</Table.Column>
          <Table.Column key="actions">Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(file => (
            <Table.Row key={file.id} textValue={file.name}>
              <Table.Cell>
                {renameId === file.id ? (
                  <Inline space={1}>
                    <TextField
                      label="Name"
                      value={renameName}
                      onChange={setRenameName}
                    />
                    <Button onPress={() => renameFile(file.id)}>OK</Button>
                    <Button onPress={() => setRenameId(null)}>×</Button>
                  </Inline>
                ) : (
                  file.name
                )}
              </Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>{fmtBytes(file.size)}</Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>{fmtDate(file.date)}</Table.Cell>
              <Table.Cell>
                {confirmDeleteId === file.id ? (
                  <Inline space={1}>
                    <Text>Delete?</Text>
                    <Button variant="primary" onPress={() => deleteFile(file.id)}>Yes</Button>
                    <Button onPress={() => setConfirmDeleteId(null)}>No</Button>
                  </Inline>
                ) : (
                  <MenuTrigger>
                    <Button>Actions</Button>
                    <Menu
                      onAction={key => {
                        if (key === 'download') { /* download stub */ }
                        if (key === 'rename') {
                          setRenameId(file.id);
                          setRenameName(file.name);
                        }
                        if (key === 'delete') setConfirmDeleteId(file.id);
                      }}
                    >
                      <Item key="download">Download</Item>
                      <Item key="rename">Rename</Item>
                      <Item key="delete">Delete</Item>
                    </Menu>
                  </MenuTrigger>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

function SettingsPage({
  teamName,
  setTeamName,
}: {
  teamName: string;
  setTeamName: (n: string) => void;
}) {
  // General tab state
  const [localTeamName, setLocalTeamName] = useState(teamName);
  const [description, setDescription] = useState('A collaborative team workspace.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [generalSaved, setGeneralSaved] = useState(false);

  // Notifications tab state
  const [prefs, setPrefs] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Integrations tab state
  const [integrations, setIntegrations] = useState({
    slack: true,
    github: false,
    jira: false,
  });
  const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(null);

  const saveGeneral = () => {
    setTeamName(localTeamName);
    setGeneralSaved(true);
    setTimeout(() => setGeneralSaved(false), 3000);
  };

  const savePrefs = () => {
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 3000);
  };

  const toggleIntegration = (key: string) => {
    if (integrations[key as keyof typeof integrations]) {
      setConfirmDisconnect(key);
    } else {
      setIntegrations(prev => ({ ...prev, [key]: true }));
    }
  };

  const disconnect = (key: string) => {
    setIntegrations(prev => ({ ...prev, [key]: false }));
    setConfirmDisconnect(null);
  };

  return (
    <Stack space={5}>
      <Heading level={1}>Team Settings</Heading>

      <Tabs defaultSelectedKey="general">
        <Tabs.List>
          <Tabs.Tab id="general">General</Tabs.Tab>
          <Tabs.Tab id="notifications">Notifications</Tabs.Tab>
          <Tabs.Tab id="integrations">Integrations</Tabs.Tab>
        </Tabs.List>

        {/* General */}
        <Tabs.Panel id="general">
          <Stack space={4} style={{ paddingTop: '1rem' }}>
            {generalSaved && <Message variant="success">Settings updated.</Message>}
            <TextField
              label="Team Name"
              value={localTeamName}
              onChange={setLocalTeamName}
            />
            <TextField
              label="Description"
              value={description}
              onChange={setDescription}
            />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={key => setTimezone(key as string)}
            >
              <Item key="UTC">UTC</Item>
              <Item key="CET">CET</Item>
              <Item key="EST">EST</Item>
              <Item key="PST">PST</Item>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onSelectionChange={key => setDateFormat(key as string)}
            >
              <Item key="MM/DD/YYYY">MM/DD/YYYY</Item>
              <Item key="DD.MM.YYYY">DD.MM.YYYY</Item>
              <Item key="YYYY-MM-DD">YYYY-MM-DD</Item>
            </Select>
            <Button variant="primary" onPress={saveGeneral}>Save</Button>
          </Stack>
        </Tabs.Panel>

        {/* Notifications */}
        <Tabs.Panel id="notifications">
          <Stack space={4} style={{ paddingTop: '1rem' }}>
            {prefsSaved && <Message variant="success">Preferences saved.</Message>}
            {(
              [
                { key: 'newMember', label: 'New member joins', desc: 'Get notified when someone joins the team' },
                { key: 'deadline', label: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
                { key: 'digest', label: 'Weekly digest', desc: 'Summary of team activity every Monday' },
                { key: 'mention', label: 'Mention notifications', desc: 'When someone mentions you in a comment' },
                { key: 'calendar', label: 'Calendar reminders', desc: '15 minutes before scheduled events' },
              ] as { key: keyof typeof prefs; label: string; desc: string }[]
            ).map(({ key, label, desc }) => (
              <Inline key={key} space={3} alignY="center">
                <Switch
                  isSelected={prefs[key]}
                  onChange={(checked: boolean) => setPrefs(p => ({ ...p, [key]: checked }))}
                >
                  {label}
                </Switch>
                <Text>{desc}</Text>
              </Inline>
            ))}
            <Button variant="primary" onPress={savePrefs}>Save Preferences</Button>
          </Stack>
        </Tabs.Panel>

        {/* Integrations */}
        <Tabs.Panel id="integrations">
          <Stack
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              paddingTop: '1rem',
            }}
          >
            {(
              [
                { key: 'slack', name: 'Slack', desc: 'Team messaging and notifications.' },
                { key: 'github', name: 'GitHub', desc: 'Code repository and PR integration.' },
                { key: 'jira', name: 'Jira', desc: 'Project and issue tracking.' },
              ] as { key: keyof typeof integrations; name: string; desc: string }[]
            ).map(({ key, name, desc }) => (
              <Card key={key}>
                <Stack space={3}>
                  <Heading level={3}>{name}</Heading>
                  <Badge variant={integrations[key] ? 'success' : 'warning'}>
                    {integrations[key] ? 'Connected' : 'Not connected'}
                  </Badge>
                  <Text>{desc}</Text>
                  {confirmDisconnect === key ? (
                    <Inline space={1}>
                      <Text>Disconnect?</Text>
                      <Button variant="primary" onPress={() => disconnect(key)}>Yes</Button>
                      <Button onPress={() => setConfirmDisconnect(null)}>No</Button>
                    </Inline>
                  ) : (
                    <Button onPress={() => toggleIntegration(key)}>
                      {integrations[key] ? 'Disconnect' : 'Connect'}
                    </Button>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

// ─── Main TeamHub shell ────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Page; label: string; short: string }[] = [
  { id: 'dashboard', label: 'Dashboard', short: 'D' },
  { id: 'members', label: 'Members', short: 'M' },
  { id: 'projects', label: 'Projects', short: 'P' },
  { id: 'calendar', label: 'Calendar', short: 'C' },
  { id: 'files', label: 'Files', short: 'F' },
];

const TeamHub = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [teamName, setTeamName] = useState('TeamHub');
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'card'>('table');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const pageLabel: Record<Page, string> = {
    dashboard: 'Dashboard',
    members: 'Members',
    projects: 'Projects',
    calendar: 'Calendar',
    files: 'Files',
    settings: 'Settings',
  };

  return (
    <Inline
      alignY="stretch"
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <Stack
        space={0}
        style={{
          width: sidebarCollapsed ? '64px' : '220px',
          minHeight: '100%',
          borderRight: '1px solid #e2e8f0',
          overflow: 'hidden',
          transition: 'width 0.2s ease',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* App name */}
        <Stack
          space={0}
          style={{
            padding: '16px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {sidebarCollapsed ? (
            <Heading level={2}>T</Heading>
          ) : (
            <Heading level={2}>{teamName}</Heading>
          )}
        </Stack>

        {/* Navigation */}
        <Stack space={1} style={{ padding: '8px', flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'primary' : 'ghost'}
              onPress={() => setCurrentPage(item.id)}
              style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start' }}
            >
              {sidebarCollapsed ? item.short : item.label}
            </Button>
          ))}

          <Divider />

          <Button
            variant={currentPage === 'settings' ? 'primary' : 'ghost'}
            onPress={() => setCurrentPage('settings')}
            style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start' }}
          >
            {sidebarCollapsed ? 'S' : 'Settings'}
          </Button>
        </Stack>
      </Stack>

      {/* Main area */}
      <Stack
        space={0}
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top nav */}
        <Inline
          alignY="center"
          space={4}
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
        >
          {/* Sidebar toggle */}
          <Button onPress={() => setSidebarCollapsed(c => !c)} aria-label="Toggle sidebar">
            {sidebarCollapsed ? '→' : '←'}
          </Button>

          {/* Breadcrumb */}
          <Inline space={1} alignY="center" style={{ flex: 1 }}>
            <Text>{teamName}</Text>
            <Text>›</Text>
            <Text>{pageLabel[currentPage]}</Text>
          </Inline>

          {/* Right side */}
          <Inline space={2} alignY="center">
            {/* Account menu */}
            <TooltipTrigger>
              <MenuTrigger>
                <Button>John Doe</Button>
                <Menu
                  onAction={key => {
                    if (key === 'signout') alert('Signed out');
                  }}
                >
                  <Item key="profile">Profile</Item>
                  <Item key="preferences">Preferences</Item>
                  <Item key="signout">Sign Out</Item>
                </Menu>
              </MenuTrigger>
              <Tooltip>Account settings</Tooltip>
            </TooltipTrigger>

            {/* Help button */}
            <DialogTrigger>
              <Button aria-label="Help">?</Button>
              <Dialog>
                {({ close }: { close: () => void }) => (
                  <Stack space={3}>
                    <Heading>Help</Heading>
                    <Text>Use the sidebar to navigate between sections.</Text>
                    <Button onPress={close}>Close</Button>
                  </Stack>
                )}
              </Dialog>
            </DialogTrigger>
          </Inline>
        </Inline>

        {/* Content */}
        <Stack
          space={0}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
          }}
        >
          {currentPage === 'dashboard' && (
            <DashboardPage members={members} projects={projects} />
          )}
          {currentPage === 'members' && (
            <MembersPage
              members={members}
              setMembers={setMembers}
              viewMode={memberViewMode}
              setViewMode={setMemberViewMode}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
            />
          )}
          {currentPage === 'projects' && (
            <ProjectsPage projects={projects} setProjects={setProjects} />
          )}
          {currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'files' && <FilesPage />}
          {currentPage === 'settings' && (
            <SettingsPage teamName={teamName} setTeamName={setTeamName} />
          )}
        </Stack>
      </Stack>
    </Inline>
  );
};

export default TeamHub;
