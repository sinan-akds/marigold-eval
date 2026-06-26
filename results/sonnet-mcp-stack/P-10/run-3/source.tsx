import React, { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  RouterProvider,
  Breadcrumbs,
  Table,
  Dialog,
  ConfirmationProvider,
  useConfirmation,
  Menu,
  ActionMenu,
  Badge,
  Card,
  Headline,
  Text,
  SectionMessage,
  Tabs,
  ToastProvider,
  useToast,
  Tooltip,
  ContextualHelp,
  Switch,
  Select,
  SearchField,
  TextField,
  TextArea,
  FileField,
  Stack,
  Inline,
  Columns,
  Tiles,
  Inset,
  DateFormat,
  NumericFormat,
  Button,
} from '@marigold/components';

// ─── Types ─────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  startDate: string;
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

interface SettingsState {
  teamName: string;
  description: string;
  timezone: string;
  dateFormat: string;
}

interface NotifState {
  newMember: boolean;
  deadline: boolean;
  digest: boolean;
  mention: boolean;
  calendar: boolean;
}

// ─── Initial Data ───────────────────────────────────────────────────────────

const initialMembers: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@team.io', status: 'Active', startDate: '2023-03-15', bio: 'Full-stack developer with 8 years of experience.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@team.io', status: 'Active', startDate: '2023-06-01', bio: 'UI/UX designer passionate about accessibility.' },
  { id: '3', name: 'Carol White', role: 'Manager', email: 'carol@team.io', status: 'Active', startDate: '2022-11-20', bio: 'Engineering manager with a focus on delivery.' },
  { id: '4', name: 'Dave Brown', role: 'Developer', email: 'dave@team.io', status: 'On Leave', startDate: '2024-01-10', bio: 'Backend specialist, Go and Rust enthusiast.' },
  { id: '5', name: 'Eve Davis', role: 'QA', email: 'eve@team.io', status: 'Active', startDate: '2024-04-22', bio: 'QA engineer ensuring product quality.' },
  { id: '6', name: 'Frank Lee', role: 'Developer', email: 'frank@team.io', status: 'Active', startDate: '2023-09-05', bio: 'Frontend developer, React specialist.' },
];

const initialProjects: Project[] = [
  { id: '1', name: 'WebApp Redesign', lead: 'Alice Johnson', members: 4, deadline: '2026-07-30', progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App v2', lead: 'Bob Smith', members: 3, deadline: '2026-08-15', progress: 40, status: 'Active' },
  { id: '3', name: 'API Gateway', lead: 'Carol White', members: 2, deadline: '2026-06-30', progress: 90, status: 'Active' },
  { id: '4', name: 'Analytics Dashboard', lead: 'Dave Brown', members: 2, deadline: '2026-05-01', progress: 100, status: 'Completed' },
  { id: '5', name: 'Auth Service', lead: 'Frank Lee', members: 3, deadline: '2026-09-01', progress: 20, status: 'On Hold' },
];

const initialFiles: FileItem[] = [
  { id: '1', name: 'Q2 Report.pdf', type: 'Documents', size: 2400000, uploadedBy: 'Carol White', date: '2026-06-10' },
  { id: '2', name: 'Logo Assets.zip', type: 'Images', size: 8700000, uploadedBy: 'Bob Smith', date: '2026-06-08' },
  { id: '3', name: 'Budget 2026.xlsx', type: 'Spreadsheets', size: 340000, uploadedBy: 'Alice Johnson', date: '2026-06-05' },
  { id: '4', name: 'Team Photo.jpg', type: 'Images', size: 1200000, uploadedBy: 'Eve Davis', date: '2026-05-30' },
  { id: '5', name: 'Sprint Notes.docx', type: 'Documents', size: 95000, uploadedBy: 'Frank Lee', date: '2026-05-28' },
];

const activityRows = [
  { id: '1', member: 'Alice Johnson', action: 'Commit', project: 'WebApp Redesign', date: new Date(2026, 4, 28) },
  { id: '2', member: 'Bob Smith', action: 'Review', project: 'Mobile App v2', date: new Date(2026, 4, 27) },
  { id: '3', member: 'Carol White', action: 'Deploy', project: 'API Gateway', date: new Date(2026, 4, 26) },
  { id: '4', member: 'Dave Brown', action: 'Commit', project: 'Analytics Dashboard', date: new Date(2026, 4, 25) },
  { id: '5', member: 'Eve Davis', action: 'Review', project: 'WebApp Redesign', date: new Date(2026, 4, 24) },
];

const calendarEvents = [
  { id: '1', date: new Date(2026, 5, 24), name: 'Sprint Review', type: 'Meeting' as const },
  { id: '2', date: new Date(2026, 5, 30), name: 'API Gateway Deadline', type: 'Deadline' as const },
  { id: '3', date: new Date(2026, 5, 27), name: 'Team Lunch', type: 'Social' as const },
  { id: '4', date: new Date(2026, 6, 3), name: 'Q3 Kickoff', type: 'Meeting' as const },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const actionVariant = (a: string): 'info' | 'warning' | 'success' => {
  if (a === 'Review') return 'warning';
  if (a === 'Deploy') return 'success';
  return 'info';
};

const statusVariant = (s: string): 'success' | 'warning' | 'info' => {
  if (s === 'Active' || s === 'Completed') return 'success';
  if (s === 'On Leave' || s === 'On Hold') return 'warning';
  return 'info';
};

const eventVariant = (t: string): 'info' | 'warning' | 'success' => {
  if (t === 'Deadline') return 'warning';
  if (t === 'Social') return 'success';
  return 'info';
};

const formatBytes = (b: number) => {
  if (b >= 1e6) return `${(b / 1e6).toFixed(1)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(0)} KB`;
  return `${b} B`;
};

const SafeDate: React.FC<{ value: string | Date; style?: Intl.DateTimeFormatOptions['dateStyle'] }> = ({ value, style = 'medium' }) => {
  const d = value instanceof Date ? value : new Date(value);
  if (!value || isNaN(d.getTime())) return <Text>—</Text>;
  return <DateFormat value={d} dateStyle={style} />;
};

let nextId = 100;
const newId = () => String(++nextId);

// ─── Member Form ────────────────────────────────────────────────────────────

interface MemberFormProps {
  initial?: Member;
  onSave: (data: Omit<Member, 'id' | 'status'>) => void;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ initial, onSave, onClose }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<string>(initial?.role ?? 'Developer');
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;
    onSave({ name, email, role, startDate, bio });
  };

  return (
    <Stack space={3}>
      <TextField label="Full Name" value={name} onChange={setName} required />
      <TextField label="Email" value={email} onChange={setEmail} required />
      <Select
        label="Role"
        selectedKey={role}
        onSelectionChange={k => setRole(String(k))}
        width="full"
      >
        <Select.Option id="Developer">Developer</Select.Option>
        <Select.Option id="Designer">Designer</Select.Option>
        <Select.Option id="Manager">Manager</Select.Option>
        <Select.Option id="QA">QA</Select.Option>
      </Select>
      <TextField label="Start Date" value={startDate} onChange={setStartDate} placeholder="YYYY-MM-DD" />
      <TextArea label="Bio" value={bio} onChange={setBio} rows={3} />
      <Inline space={2}>
        <Button variant="primary" onPress={handleSave}>
          {initial ? 'Update' : 'Add'}
        </Button>
        <Button variant="secondary" onPress={onClose}>Cancel</Button>
      </Inline>
    </Stack>
  );
};

// ─── Dashboard Page ──────────────────────────────────────────────────────────

interface DashboardPageProps {
  members: Member[];
  projects: Project[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ members, projects }) => {
  const activeProjects = projects.filter(p => p.status === 'Active').length;

  return (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Columns columns={[1, 1, 1, 1]} space={4}>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text color="text-muted-foreground">Members</Text>
              <Headline level={2}>{members.length}</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text color="text-muted-foreground">Active Projects</Text>
              <Headline level={2}>{activeProjects}</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text color="text-muted-foreground">Upcoming Deadlines</Text>
              <Headline level={2}>8</Headline>
            </Stack>
          </Inset>
        </Card>
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Inline alignY="center" space={1}>
                <Text color="text-muted-foreground">Hours This Week</Text>
                <Tooltip.Trigger>
                  <Button variant="ghost" size="small" aria-label="Info">ℹ</Button>
                  <Tooltip>Aggregate of all team members.</Tooltip>
                </Tooltip.Trigger>
              </Inline>
              <Headline level={2}>
                <NumericFormat value={342} />
              </Headline>
            </Stack>
          </Inset>
        </Card>
      </Columns>

      <Stack space={2}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity" selectionMode="none">
          <Table.Header>
            <Table.Column>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {activityRows.map(row => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={actionVariant(row.action)}>{row.action}</Badge>
                </Table.Cell>
                <Table.Cell>{row.project}</Table.Cell>
                <Table.Cell>
                  <SafeDate value={row.date} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint Update</SectionMessage.Title>
        <SectionMessage.Content>
          Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );
};

// ─── Members Page ────────────────────────────────────────────────────────────

interface MembersPageProps {
  members: Member[];
  onAddMember: (m: Omit<Member, 'id' | 'status'>) => void;
  onEditMember: (m: Member) => void;
  onRemoveMember: (id: string) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (v: 'table' | 'card') => void;
  search: string;
  onSearchChange: (v: string) => void;
  roleFilter: string;
  onRoleFilterChange: (v: string) => void;
}

const MembersPage: React.FC<MembersPageProps> = ({
  members, onAddMember, onEditMember, onRemoveMember,
  viewMode, onViewModeChange, search, onSearchChange, roleFilter, onRoleFilterChange,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const confirm = useConfirmation();

  const filtered = useMemo(() =>
    members
      .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
      .filter(m => roleFilter === 'all' || m.role === roleFilter),
    [members, search, roleFilter]
  );

  const handleRemove = async (m: Member) => {
    try {
      await confirm({
        variant: 'destructive',
        title: `Remove ${m.name}?`,
        content: 'This member will be removed from the team.',
        confirmationLabel: 'Remove',
      });
      onRemoveMember(m.id);
    } catch {
      // cancelled
    }
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Team Members</Headline>

      {/* Toolbar */}
      <Inline space={2} alignY="center">
        <SearchField
          label="Search members"
          aria-label="Search members"
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name…"
        />
        <Select
          label="Role"
          aria-label="Filter by role"
          selectedKey={roleFilter}
          onSelectionChange={k => onRoleFilterChange(String(k))}
          width="fit"
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Button
          variant={viewMode === 'table' ? 'primary' : 'secondary'}
          onPress={() => onViewModeChange('table')}
        >
          Table
        </Button>
        <Button
          variant={viewMode === 'card' ? 'primary' : 'secondary'}
          onPress={() => onViewModeChange('card')}
        >
          Cards
        </Button>
        <Button variant="primary" onPress={() => setAddOpen(true)}>Add Member</Button>
      </Inline>

      {/* Table View */}
      {viewMode === 'table' && (
        <Table
          aria-label="Team Members"
          selectionMode="none"
          onRowAction={key => {
            const m = members.find(x => x.id === String(key));
            if (m) setDetailMember(m);
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
                <Table.Cell>
                  <SafeDate value={m.startDate} />
                </Table.Cell>
                <Table.Cell>
                  <ActionMenu>
                    <Menu.Item id="edit" onAction={() => setEditMember(m)}>Edit</Menu.Item>
                    <Menu.Item id="remove" variant="destructive" onAction={() => handleRemove(m)}>Remove</Menu.Item>
                  </ActionMenu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Card View */}
      {viewMode === 'card' && (
        <Tiles tilesWidth="280px" space={4} stretch>
          {filtered.map(m => (
            <Card key={m.id}>
              <Inset space={4}>
                <Stack space={2}>
                  <Button
                    variant="ghost"
                    onPress={() => setDetailMember(m)}
                    aria-label={`View ${m.name} profile`}
                  >
                    <Headline level={3}>{m.name}</Headline>
                  </Button>
                  <Badge variant="info">{m.role}</Badge>
                  <Text>{m.email}</Text>
                  <Inline space={2}>
                    <Button variant="secondary" size="small" onPress={() => setDetailMember(m)}>Profile</Button>
                    <Button variant="ghost" size="small" onPress={() => {}}>Message</Button>
                  </Inline>
                </Stack>
              </Inset>
            </Card>
          ))}
        </Tiles>
      )}

      {/* Add Member Dialog */}
      <Dialog
        size="small"
        closeButton
        open={addOpen}
        onOpenChange={setAddOpen}
      >
        {({ close }) => (
          <>
            <Dialog.Title>Add Member</Dialog.Title>
            <Dialog.Content>
              <MemberForm
                onSave={data => { onAddMember(data); close(); }}
                onClose={close}
              />
            </Dialog.Content>
          </>
        )}
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog
        size="small"
        closeButton
        open={editMember !== null}
        onOpenChange={o => !o && setEditMember(null)}
      >
        {({ close }) => (
          <>
            <Dialog.Title>Edit Member</Dialog.Title>
            <Dialog.Content>
              {editMember && (
                <MemberForm
                  initial={editMember}
                  onSave={data => {
                    onEditMember({ ...editMember, ...data });
                    close();
                    setEditMember(null);
                  }}
                  onClose={() => { close(); setEditMember(null); }}
                />
              )}
            </Dialog.Content>
          </>
        )}
      </Dialog>

      {/* Member Detail Dialog */}
      <Dialog
        size="small"
        closeButton
        open={detailMember !== null}
        onOpenChange={o => !o && setDetailMember(null)}
      >
        {({ close }) => (
          <>
            <Dialog.Title>{detailMember?.name}</Dialog.Title>
            <Dialog.Content>
              {detailMember && (
                <Stack space={3}>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Role:</Text>
                    <Text>{detailMember.role}</Text>
                  </Inline>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Email:</Text>
                    <Text>{detailMember.email}</Text>
                  </Inline>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Status:</Text>
                    <Badge variant={statusVariant(detailMember.status)}>{detailMember.status}</Badge>
                  </Inline>
                  <Inline space={2} alignY="center">
                    <Text weight="bold">Joined:</Text>
                    <SafeDate value={detailMember.startDate} />
                  </Inline>
                  {detailMember.bio && (
                    <Stack space={1}>
                      <Text weight="bold">Bio:</Text>
                      <Text>{detailMember.bio}</Text>
                    </Stack>
                  )}
                </Stack>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Close</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

// ─── Projects Page ───────────────────────────────────────────────────────────

interface ProjectsPageProps {
  projects: Project[];
  onProjectsChange: (p: Project[]) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onProjectsChange }) => {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = useMemo(() =>
    projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const handleArchive = () => {
    onProjectsChange(projects.filter(p => !selectedKeys.has(p.id)));
    setSelectedKeys(new Set());
  };

  const handleSelectionChange = (keys: 'all' | Set<React.Key>) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(filtered.map(p => p.id)));
    } else {
      setSelectedKeys(new Set(Array.from(keys).map(String)));
    }
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Projects</Headline>

      <Inline space={2} alignY="center">
        <SearchField
          label="Search projects"
          aria-label="Search projects"
          value={search}
          onChange={setSearch}
          placeholder="Search projects…"
        />
        <Button variant="primary" onPress={() => {}}>New Project</Button>
      </Inline>

      {selectedKeys.size > 0 && (
        <Inline space={2} alignY="center">
          <Text>{selectedKeys.size} selected</Text>
          <Button variant="destructive" onPress={handleArchive}>Archive Selected</Button>
          <Button variant="secondary" onPress={() => {}}>Export</Button>
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
            <Table.Row key={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>
                <SafeDate value={p.deadline} />
              </Table.Cell>
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
};

// ─── Calendar Page ───────────────────────────────────────────────────────────

const CalendarPage: React.FC = () => {
  const today = new Date(2026, 5, 23); // June 2026
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthName = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const getEvents = (day: number) =>
    calendarEvents.filter(e => e.date.getMonth() === month && e.date.getDate() === day);

  return (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Headline level={2}>{monthName}</Headline>

      <Card>
        <Inset space={4}>
          <Stack space={2}>
            {/* Day headers */}
            <Columns columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
              {dayNames.map(d => (
                <Text key={d} weight="bold" align="center">{d}</Text>
              ))}
            </Columns>
            {/* Weeks */}
            {weeks.map((week, wi) => (
              <Columns key={wi} columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
                {week.map((day, di) => (
                  <Card key={di}>
                    <Inset space={1}>
                      <Stack space={1}>
                        {day !== null ? (
                          <>
                            <Text weight={day === today.getDate() ? 'bold' : 'regular'}>
                              {day}
                            </Text>
                            {getEvents(day).map(e => (
                              <Badge key={e.id} variant={eventVariant(e.type)}>
                                {e.name}
                              </Badge>
                            ))}
                          </>
                        ) : (
                          <Text color="text-muted-foreground">‌</Text>
                        )}
                      </Stack>
                    </Inset>
                  </Card>
                ))}
              </Columns>
            ))}
          </Stack>
        </Inset>
      </Card>

      <Stack space={2}>
        <Headline level={2}>Upcoming Events</Headline>
        {calendarEvents.map(e => (
          <Card key={e.id}>
            <Inset space={3}>
              <Inline space={3} alignY="center">
                <SafeDate value={e.date} />
                <Text weight="medium">{e.name}</Text>
                <Badge variant={eventVariant(e.type)}>{e.type}</Badge>
              </Inline>
            </Inset>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

// ─── Files Page ──────────────────────────────────────────────────────────────

interface FilesPageProps {
  files: FileItem[];
  onFilesChange: (f: FileItem[]) => void;
}

const FilesPage: React.FC<FilesPageProps> = ({ files, onFilesChange }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Documents');
  const { addToast } = useToast();

  const filtered = useMemo(() =>
    files
      .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
      .filter(f => typeFilter === 'All' || f.type === typeFilter),
    [files, search, typeFilter]
  );

  const handleUpload = () => {
    const newFile: FileItem = {
      id: newId(),
      name: `Uploaded File.${uploadCategory === 'Images' ? 'png' : 'pdf'}`,
      type: uploadCategory,
      size: 512000,
      uploadedBy: 'John Doe',
      date: new Date().toISOString().split('T')[0],
    };
    onFilesChange([...files, newFile]);
    setUploadOpen(false);
    setUploadDesc('');
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  const handleDelete = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={2} alignY="center">
        <SearchField
          label="Search files"
          aria-label="Search files"
          value={search}
          onChange={setSearch}
          placeholder="Search files…"
        />
        <Select
          label="Type"
          aria-label="Filter by type"
          selectedKey={typeFilter}
          onSelectionChange={k => setTypeFilter(String(k))}
          width="fit"
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
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
          {filtered.map(f => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>{formatBytes(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <SafeDate value={f.date} />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <Menu.Item id="download" onAction={() => {}}>Download</Menu.Item>
                  <Menu.Item id="rename" onAction={() => {}}>Rename</Menu.Item>
                  <Menu.Item id="delete" variant="destructive" onAction={() => handleDelete(f.id)}>Delete</Menu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Upload Dialog */}
      <Dialog size="small" closeButton open={uploadOpen} onOpenChange={setUploadOpen}>
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <FileField label="Files" multiple />
                <TextArea
                  label="Description"
                  value={uploadDesc}
                  onChange={setUploadDesc}
                  rows={2}
                />
                <Select
                  label="Category"
                  selectedKey={uploadCategory}
                  onSelectionChange={k => setUploadCategory(String(k))}
                  width="full"
                >
                  <Select.Option id="Documents">Documents</Select.Option>
                  <Select.Option id="Images">Images</Select.Option>
                  <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => { handleUpload(); close(); }}>Upload</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

// ─── Settings Page ───────────────────────────────────────────────────────────

interface SettingsPageProps {
  settings: SettingsState;
  onSettingsChange: (s: SettingsState) => void;
  teamName: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onSettingsChange, teamName }) => {
  const [local, setLocal] = useState(settings);
  const [notifs, setNotifs] = useState<NotifState>({
    newMember: true, deadline: true, digest: false, mention: true, calendar: false,
  });
  const [integrations, setIntegrations] = useState({
    slack: true, github: false, jira: false,
  });
  const { addToast } = useToast();
  const confirm = useConfirmation();

  const handleSaveGeneral = () => {
    onSettingsChange(local);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const handleDisconnect = async (service: string) => {
    try {
      await confirm({
        variant: 'destructive',
        title: `Disconnect ${service}?`,
        content: `This will disconnect your ${service} integration.`,
        confirmationLabel: 'Disconnect',
      });
      setIntegrations(prev => ({ ...prev, [service.toLowerCase()]: false }));
    } catch {
      // cancelled
    }
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Inset space={4}>
            <Stack space={4}>
              <TextField
                label="Team Name"
                value={local.teamName}
                onChange={v => setLocal(prev => ({ ...prev, teamName: v }))}
              />
              <TextArea
                label="Description"
                value={local.description}
                onChange={v => setLocal(prev => ({ ...prev, description: v }))}
                rows={3}
              />
              <Select
                label="Default Timezone"
                selectedKey={local.timezone}
                onSelectionChange={k => setLocal(prev => ({ ...prev, timezone: String(k) }))}
                width="full"
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={local.dateFormat}
                onSelectionChange={k => setLocal(prev => ({ ...prev, dateFormat: String(k) }))}
                width="full"
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" onPress={handleSaveGeneral}>Save</Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Inset space={4}>
            <Stack space={4}>
              {([
                { key: 'newMember', label: 'New member joins', desc: 'Get notified when someone joins the team' },
                { key: 'deadline', label: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
                { key: 'digest', label: 'Weekly digest', desc: 'Summary of team activity every Monday' },
                { key: 'mention', label: 'Mention notifications', desc: 'When someone mentions you in a comment' },
                { key: 'calendar', label: 'Calendar reminders', desc: '15 minutes before scheduled events' },
              ] as { key: keyof NotifState; label: string; desc: string }[]).map(({ key, label, desc }) => (
                <Inline key={key} alignY="center" space={3}>
                  <Switch
                    label={label}
                    selected={notifs[key]}
                    onChange={v => setNotifs(prev => ({ ...prev, [key]: v }))}
                  />
                  <Text color="text-muted-foreground">{desc}</Text>
                </Inline>
              ))}
              <Button
                variant="primary"
                onPress={() => addToast({ title: 'Notification preferences saved.', variant: 'success' })}
              >
                Save Preferences
              </Button>
            </Stack>
          </Inset>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Inset space={4}>
            <Tiles tilesWidth="240px" space={4} stretch>
              {([
                {
                  key: 'slack', name: 'Slack',
                  desc: 'Get notified in Slack for team events and updates.',
                },
                {
                  key: 'github', name: 'GitHub',
                  desc: 'Sync commits, PRs and issues with your projects.',
                },
                {
                  key: 'jira', name: 'Jira',
                  desc: 'Link Jira tickets to your team projects.',
                },
              ]).map(({ key, name, desc }) => {
                const connected = integrations[key as keyof typeof integrations];
                return (
                  <Card key={key}>
                    <Inset space={4}>
                      <Stack space={3}>
                        <Inline alignY="center" space={2}>
                          <Headline level={3}>{name}</Headline>
                          <Badge variant={connected ? 'success' : 'default'}>
                            {connected ? 'Connected' : 'Not connected'}
                          </Badge>
                        </Inline>
                        <Text>{desc}</Text>
                        {connected ? (
                          <Button
                            variant="destructive"
                            onPress={() => handleDisconnect(name)}
                          >
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
                    </Inset>
                  </Card>
                );
              })}
            </Tiles>
          </Inset>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

// ─── App Root (with hooks) ───────────────────────────────────────────────────

const AppRoot: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [settings, setSettings] = useState<SettingsState>({
    teamName: 'TeamHub',
    description: 'Our amazing team.',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'card'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');

  const handleAddMember = (data: Omit<Member, 'id' | 'status'>) => {
    setMembers(prev => [...prev, { ...data, id: newId(), status: 'Active' }]);
  };

  const handleEditMember = (updated: Member) => {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const pageLabel: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/members': 'Members',
    '/projects': 'Projects',
    '/calendar': 'Calendar',
    '/files': 'Files',
    '/settings': 'Settings',
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage members={members} projects={projects} />;
      case '/members':
        return (
          <MembersPage
            members={members}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onRemoveMember={handleRemoveMember}
            viewMode={memberViewMode}
            onViewModeChange={setMemberViewMode}
            search={memberSearch}
            onSearchChange={setMemberSearch}
            roleFilter={memberRoleFilter}
            onRoleFilterChange={setMemberRoleFilter}
          />
        );
      case '/projects':
        return <ProjectsPage projects={projects} onProjectsChange={setProjects} />;
      case '/calendar':
        return <CalendarPage />;
      case '/files':
        return <FilesPage files={files} onFilesChange={setFiles} />;
      case '/settings':
        return (
          <SettingsPage
            settings={settings}
            onSettingsChange={s => { setSettings(s); }}
            teamName={settings.teamName}
          />
        );
      default:
        return <DashboardPage members={members} projects={projects} />;
    }
  };

  return (
    <RouterProvider navigate={setCurrentPath}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          {/* Sidebar */}
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="lg">{settings.teamName}</Text>
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

          {/* Top Navigation */}
          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">{settings.teamName}</Breadcrumbs.Item>
                <Breadcrumbs.Item href={currentPath}>
                  {pageLabel[currentPath] ?? 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={key => {
                      if (key === 'signout') alert('Signed out');
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

          {/* Main Content */}
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

// ─── TestApp ─────────────────────────────────────────────────────────────────

const TestApp = () => (
  <ConfirmationProvider>
    <ToastProvider position="bottom-right" />
    <AppRoot />
  </ConfirmationProvider>
);

export default TestApp;
