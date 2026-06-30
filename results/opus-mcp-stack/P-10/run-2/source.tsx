import { useState } from 'react';
import type { Key } from 'react';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import {
  ActionMenu,
  AppLayout,
  Aside,
  Badge,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  Columns,
  ContextualHelp,
  DateField,
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
  useToast,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type MemberStatus = 'active' | 'onleave';
type Role = 'Developer' | 'Designer' | 'Manager' | 'QA';

interface Member {
  id: string;
  name: string;
  role: Role;
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
  status: 'active' | 'onhold' | 'completed';
}

interface FileItem {
  id: string;
  name: string;
  type: 'Documents' | 'Images' | 'Spreadsheets';
  size: number; // MB
  uploadedBy: string;
  date: Date;
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.io',
    status: 'active',
    joined: new Date(2024, 0, 15),
    bio: 'Full-stack engineer focused on the billing platform.',
  },
  {
    id: 'm2',
    name: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.io',
    status: 'active',
    joined: new Date(2023, 10, 2),
    bio: 'Product designer who owns the design system.',
  },
  {
    id: 'm3',
    name: 'Carol White',
    role: 'Manager',
    email: 'carol@teamhub.io',
    status: 'onleave',
    joined: new Date(2022, 5, 20),
    bio: 'Engineering manager for the platform team.',
  },
  {
    id: 'm4',
    name: 'David Lee',
    role: 'Developer',
    email: 'david@teamhub.io',
    status: 'active',
    joined: new Date(2024, 2, 10),
    bio: 'Backend developer specialising in data pipelines.',
  },
  {
    id: 'm5',
    name: 'Eva Brown',
    role: 'QA',
    email: 'eva@teamhub.io',
    status: 'active',
    joined: new Date(2023, 7, 5),
    bio: 'Quality engineer keeping releases stable.',
  },
  {
    id: 'm6',
    name: 'Frank Green',
    role: 'Designer',
    email: 'frank@teamhub.io',
    status: 'onleave',
    joined: new Date(2024, 4, 12),
    bio: 'Brand and marketing designer.',
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Billing Revamp',
    lead: 'Alice Johnson',
    members: 5,
    deadline: new Date(2026, 6, 12),
    progress: 75,
    status: 'active',
  },
  {
    id: 'p2',
    name: 'Design System v2',
    lead: 'Bob Smith',
    members: 3,
    deadline: new Date(2026, 7, 1),
    progress: 40,
    status: 'active',
  },
  {
    id: 'p3',
    name: 'Mobile App',
    lead: 'David Lee',
    members: 6,
    deadline: new Date(2026, 8, 20),
    progress: 20,
    status: 'onhold',
  },
  {
    id: 'p4',
    name: 'Data Warehouse',
    lead: 'Eva Brown',
    members: 4,
    deadline: new Date(2026, 5, 30),
    progress: 100,
    status: 'completed',
  },
  {
    id: 'p5',
    name: 'Marketing Site',
    lead: 'Frank Green',
    members: 2,
    deadline: new Date(2026, 9, 15),
    progress: 60,
    status: 'active',
  },
];

const INITIAL_FILES: FileItem[] = [
  {
    id: 'f1',
    name: 'Q2 Report.pdf',
    type: 'Documents',
    size: 2.4,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 4, 28),
  },
  {
    id: 'f2',
    name: 'Logo Pack.zip',
    type: 'Images',
    size: 18.6,
    uploadedBy: 'Frank Green',
    date: new Date(2026, 5, 2),
  },
  {
    id: 'f3',
    name: 'Budget.xlsx',
    type: 'Spreadsheets',
    size: 0.8,
    uploadedBy: 'Carol White',
    date: new Date(2026, 5, 10),
  },
  {
    id: 'f4',
    name: 'Onboarding.docx',
    type: 'Documents',
    size: 1.2,
    uploadedBy: 'Eva Brown',
    date: new Date(2026, 5, 18),
  },
  {
    id: 'f5',
    name: 'Mockups.png',
    type: 'Images',
    size: 5.1,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 5, 22),
  },
];

const ACTIVITY = [
  {
    id: 'a1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Billing Revamp',
    date: new Date(2026, 4, 28),
  },
  {
    id: 'a2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Design System v2',
    date: new Date(2026, 4, 27),
  },
  {
    id: 'a3',
    member: 'David Lee',
    action: 'Deploy',
    project: 'Mobile App',
    date: new Date(2026, 4, 26),
  },
  {
    id: 'a4',
    member: 'Eva Brown',
    action: 'Commit',
    project: 'Data Warehouse',
    date: new Date(2026, 4, 25),
  },
  {
    id: 'a5',
    member: 'Frank Green',
    action: 'Review',
    project: 'Marketing Site',
    date: new Date(2026, 4, 24),
  },
] as const;

const EVENTS = [
  {
    id: 'e1',
    date: new Date(2026, 5, 29),
    name: 'Sprint Planning',
    type: 'Meeting',
  },
  {
    id: 'e2',
    date: new Date(2026, 6, 2),
    name: 'Billing Revamp Deadline',
    type: 'Deadline',
  },
  {
    id: 'e3',
    date: new Date(2026, 6, 5),
    name: 'Team Lunch',
    type: 'Social',
  },
  {
    id: 'e4',
    date: new Date(2026, 6, 9),
    name: 'Design Review',
    type: 'Meeting',
  },
] as const;

const ACTION_VARIANT: Record<string, 'info' | 'warning' | 'success'> = {
  Commit: 'info',
  Review: 'warning',
  Deploy: 'success',
};

const EVENT_VARIANT: Record<string, 'info' | 'warning' | 'success'> = {
  Meeting: 'info',
  Deadline: 'warning',
  Social: 'success',
};

const PROJECT_STATUS: Record<
  Project['status'],
  { label: string; variant: 'success' | 'warning' | 'info' }
> = {
  active: { label: 'Active', variant: 'success' },
  onhold: { label: 'On Hold', variant: 'warning' },
  completed: { label: 'Completed', variant: 'info' },
};

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/members', label: 'Members' },
  { path: '/projects', label: 'Projects' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/files', label: 'Files' },
  { path: '/settings', label: 'Settings' },
];

const pageLabel = (path: string) =>
  NAV_ITEMS.find(n => n.path === path)?.label ?? 'Dashboard';

const toCalendarDate = (d: Date) =>
  new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());

let idCounter = 100;
const nextId = (prefix: string) => `${prefix}${idCounter++}`;

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

const SummaryCard = ({
  label,
  children,
  help,
}: {
  label: string;
  children: React.ReactNode;
  help?: string;
}) => (
  <Card p={4}>
    <Stack space={1}>
      <Inline space={1} alignY="center">
        <Text size="sm" weight="medium">
          {label}
        </Text>
        {help ? (
          <ContextualHelp>
            <ContextualHelp.Content>{help}</ContextualHelp.Content>
          </ContextualHelp>
        ) : null}
      </Inline>
      <Headline level={2}>{children}</Headline>
    </Stack>
  </Card>
);

const DashboardPage = ({ memberCount }: { memberCount: number }) => (
  <Stack space={6}>
    <Headline level={1}>Team Overview</Headline>
    <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="60em">
      <SummaryCard label="Members">{memberCount}</SummaryCard>
      <SummaryCard label="Active Projects">5</SummaryCard>
      <SummaryCard label="Upcoming Deadlines">8</SummaryCard>
      <SummaryCard label="Hours This Week" help="Aggregate of all team members.">
        <NumericFormat value={342} />
      </SummaryCard>
    </Columns>

    <Stack space={3}>
      <Headline level={3}>Recent Activity</Headline>
      <Table aria-label="Recent activity" selectionMode="none">
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
                <Badge variant={ACTION_VARIANT[row.action]}>{row.action}</Badge>
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
      <SectionMessage.Title>Sprint 14</SectionMessage.Title>
      <SectionMessage.Content>
        Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
      </SectionMessage.Content>
    </SectionMessage>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Members                                                             */
/* ------------------------------------------------------------------ */

interface MemberFormState {
  name: string;
  email: string;
  role: Role;
  startDate: CalendarDate | null;
  bio: string;
}

const emptyForm: MemberFormState = {
  name: '',
  email: '',
  role: 'Developer',
  startDate: null,
  bio: '',
};

const MemberDialog = ({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: Member | null;
  onSubmit: (form: MemberFormState) => void;
}) => {
  const [form, setForm] = useState<MemberFormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  // Re-seed the form whenever the dialog is (re)opened.
  const [lastOpen, setLastOpen] = useState(false);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setSubmitted(false);
      setForm(
        editing
          ? {
              name: editing.name,
              email: editing.email,
              role: editing.role,
              startDate: toCalendarDate(editing.joined),
              bio: editing.bio,
            }
          : emptyForm
      );
    }
  }

  const nameError = submitted && !form.name.trim();
  const emailError = submitted && !form.email.trim();

  const handleSubmit = (close: () => void) => {
    setSubmitted(true);
    if (!form.name.trim() || !form.email.trim()) {
      return;
    }
    onSubmit(form);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} closeButton size="small">
      {({ close }) => (
        <>
          <Dialog.Title>
            {editing ? 'Edit Member' : 'Add Member'}
          </Dialog.Title>
          <Dialog.Content>
            <Stack space={4}>
              <TextField
                label="Full Name"
                required
                value={form.name}
                onChange={value => setForm(f => ({ ...f, name: value }))}
                error={nameError}
                errorMessage="Full name is required."
              />
              <TextField
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={value => setForm(f => ({ ...f, email: value }))}
                error={emailError}
                errorMessage="Email is required."
              />
              <Select
                label="Role"
                selectedKey={form.role}
                onSelectionChange={key =>
                  setForm(f => ({ ...f, role: key as Role }))
                }
              >
                <Select.Option id="Developer">Developer</Select.Option>
                <Select.Option id="Designer">Designer</Select.Option>
                <Select.Option id="Manager">Manager</Select.Option>
                <Select.Option id="QA">QA</Select.Option>
              </Select>
              <DateField
                label="Start Date"
                value={form.startDate}
                onChange={value =>
                  setForm(f => ({ ...f, startDate: value as CalendarDate }))
                }
              />
              <TextArea
                label="Bio"
                value={form.bio}
                onChange={value => setForm(f => ({ ...f, bio: value }))}
              />
            </Stack>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button variant="primary" onPress={() => handleSubmit(close)}>
              {editing ? 'Save' : 'Add'}
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  );
};

const MemberDetail = ({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) => (
  <Card p={4}>
    <Stack space={3}>
      <Inline alignX="between" alignY="center" space={2}>
        <Headline level={3}>{member.name}</Headline>
        <Button variant="text" size="small" onPress={onClose}>
          Close
        </Button>
      </Inline>
      <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
        {member.status === 'active' ? 'Active' : 'On Leave'}
      </Badge>
      <Stack space={1}>
        <Text weight="medium">Role</Text>
        <Text>{member.role}</Text>
      </Stack>
      <Stack space={1}>
        <Text weight="medium">Email</Text>
        <Text>{member.email}</Text>
      </Stack>
      <Stack space={1}>
        <Text weight="medium">Joined</Text>
        <Text>
          <DateFormat value={member.joined} dateStyle="medium" />
        </Text>
      </Stack>
      <Stack space={1}>
        <Text weight="medium">Bio</Text>
        <Text>{member.bio}</Text>
      </Stack>
    </Stack>
  </Card>
);

const MembersPage = ({
  members,
  viewMode,
  setViewMode,
  onAdd,
  onEdit,
  onRemove,
}: {
  members: Member[];
  viewMode: 'table' | 'cards';
  setViewMode: (v: 'table' | 'cards') => void;
  onAdd: () => void;
  onEdit: (m: Member) => void;
  onRemove: (m: Member) => void;
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = members.filter(m => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selected = members.find(m => m.id === selectedId) ?? null;

  const tableView = (
    <Table
      aria-label="Team members"
      selectionMode="single"
      selectedKeys={selectedId ? [selectedId] : []}
      onSelectionChange={keys => {
        if (keys === 'all') return;
        const first = [...keys][0];
        setSelectedId(first ? String(first) : null);
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
              <Badge variant={m.status === 'active' ? 'success' : 'warning'}>
                {m.status === 'active' ? 'Active' : 'On Leave'}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <DateFormat value={m.joined} dateStyle="medium" />
            </Table.Cell>
            <Table.Cell>
              <ActionMenu variant="ghost">
                <Menu.Item id="edit" onAction={() => onEdit(m)}>
                  Edit
                </Menu.Item>
                <Menu.Item
                  id="remove"
                  variant="destructive"
                  onAction={() => onRemove(m)}
                >
                  Remove
                </Menu.Item>
              </ActionMenu>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );

  const cardsView = (
    <Tiles tilesWidth="280px" space={4} equalHeight>
      {filtered.map(m => (
        <Card key={m.id} p={4}>
          <Stack space={3}>
            <Headline level={4}>{m.name}</Headline>
            <Inline space={2} alignY="center">
              <Badge variant="info">{m.role}</Badge>
            </Inline>
            <Text size="sm">{m.email}</Text>
            <Inline space={2}>
              <Button
                size="small"
                variant="secondary"
                onPress={() => alert(`Message ${m.name}`)}
              >
                Message
              </Button>
              <Button size="small" onPress={() => setSelectedId(m.id)}>
                Profile
              </Button>
            </Inline>
          </Stack>
        </Card>
      ))}
    </Tiles>
  );

  const dataView = (
    <Stack space={3}>{viewMode === 'table' ? tableView : cardsView}</Stack>
  );

  return (
    <Stack space={6}>
      <Headline level={1}>Team Members</Headline>

      <Inline space={3} alignY="bottom" alignX="left">
        <SearchField
          label="Search"
          aria-label="Search members by name"
          placeholder="Search by name"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          width={64}
        />
        <Select
          label="Role"
          selectedKey={roleFilter}
          onSelectionChange={key => setRoleFilter(String(key))}
          width={48}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
        </Select>
        <Select
          label="View"
          selectedKey={viewMode}
          onSelectionChange={key => setViewMode(key as 'table' | 'cards')}
          width={40}
        >
          <Select.Option id="table">Table</Select.Option>
          <Select.Option id="cards">Cards</Select.Option>
        </Select>
        <Button variant="primary" onPress={onAdd}>
          Add Member
        </Button>
      </Inline>

      {selected ? (
        <Aside space={5} side="right" sideWidth="340px">
          {dataView}
          <MemberDetail member={selected} onClose={() => setSelectedId(null)} />
        </Aside>
      ) : (
        dataView
      )}
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const ProjectsPage = ({
  projects,
  setProjects,
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const selectedCount = selectedKeys.size;

  const archiveSelected = () => {
    setProjects(prev => prev.filter(p => !selectedKeys.has(p.id)));
    setSelectedKeys(new Set());
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>

      <Inline space={3} alignY="bottom">
        <SearchField
          label="Search"
          aria-label="Search projects"
          placeholder="Search projects"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          width={64}
        />
        <Button variant="primary" onPress={() => alert('New project')}>
          New Project
        </Button>
      </Inline>

      {selectedCount > 0 ? (
        <Card p={3}>
          <Inline space={3} alignY="center" alignX="left">
            <Text weight="medium">{selectedCount} selected</Text>
            <Button size="small" variant="destructive" onPress={archiveSelected}>
              Archive Selected
            </Button>
            <Button
              size="small"
              variant="secondary"
              onPress={() =>
                addToast({ title: 'Export started', variant: 'info' })
              }
            >
              Export
            </Button>
          </Inline>
        </Card>
      ) : null}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={keys => {
          if (keys === 'all') {
            setSelectedKeys(new Set(filtered.map(p => p.id)));
          } else {
            setSelectedKeys(keys as Set<Key>);
          }
        }}
      >
        <Table.Header>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column alignX="right">Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column alignX="right">Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(p => (
            <Table.Row key={p.id} id={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={p.members} />
              </Table.Cell>
              <Table.Cell>
                <DateFormat value={p.deadline} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <NumericFormat value={p.progress / 100} style="percent" />
              </Table.Cell>
              <Table.Cell>
                <Badge variant={PROJECT_STATUS[p.status].variant}>
                  {PROJECT_STATUS[p.status].label}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

const CalendarPage = () => (
  <Stack space={6}>
    <Headline level={1}>Team Calendar</Headline>
    <Calendar aria-label="Team calendar" />
    <Stack space={3}>
      <Headline level={3}>Upcoming Events</Headline>
      <Table aria-label="Upcoming events" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>Date</Table.Column>
          <Table.Column>Event</Table.Column>
          <Table.Column>Type</Table.Column>
        </Table.Header>
        <Table.Body>
          {EVENTS.map(e => (
            <Table.Row key={e.id}>
              <Table.Cell>
                <DateFormat value={e.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>{e.name}</Table.Cell>
              <Table.Cell>
                <Badge variant={EVENT_VARIANT[e.type]}>{e.type}</Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

const UploadDialog = ({
  open,
  onOpenChange,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpload: (name: string, category: FileItem['type']) => void;
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FileItem['type']>('Documents');

  const [lastOpen, setLastOpen] = useState(false);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setDescription('');
      setCategory('Documents');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} closeButton size="small">
      {({ close }) => (
        <>
          <Dialog.Title>Upload Files</Dialog.Title>
          <Dialog.Content>
            <Stack space={4}>
              <FileField label="Files" multiple />
              <TextField
                label="Description"
                value={description}
                onChange={setDescription}
              />
              <Select
                label="Category"
                selectedKey={category}
                onSelectionChange={key =>
                  setCategory(key as FileItem['type'])
                }
              >
                <Select.Option id="Documents">Documents</Select.Option>
                <Select.Option id="Images">Images</Select.Option>
                <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
              </Select>
            </Stack>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={() => {
                onUpload(description.trim() || 'Untitled file', category);
                close();
              }}
            >
              Upload
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  );
};

const FilesPage = ({
  files,
  setFiles,
}: {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered = files.filter(f => {
    const matchesSearch = f.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUpload = (name: string, category: FileItem['type']) => {
    setFiles(prev => [
      {
        id: nextId('f'),
        name,
        type: category,
        size: 1.2,
        uploadedBy: 'John Doe',
        date: new Date(),
      },
      ...prev,
    ]);
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  const handleRowAction = (file: FileItem, action: Key) => {
    if (action === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== file.id));
    } else if (action === 'download') {
      addToast({ title: `Downloading ${file.name}`, variant: 'info' });
    } else if (action === 'rename') {
      addToast({ title: `Rename ${file.name}`, variant: 'info' });
    }
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={3} alignY="bottom">
        <SearchField
          label="Search"
          aria-label="Search files"
          placeholder="Search files"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          width={64}
        />
        <Select
          label="Type"
          selectedKey={typeFilter}
          onSelectionChange={key => setTypeFilter(String(key))}
          width={48}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>
          Upload
        </Button>
      </Inline>

      <Table aria-label="Shared files" selectionMode="none">
        <Table.Header>
          <Table.Column rowHeader>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column alignX="right">Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map(f => (
            <Table.Row key={f.id} id={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat
                  value={f.size}
                  style="unit"
                  unit="megabyte"
                  unitDisplay="short"
                />
              </Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={f.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu
                  variant="ghost"
                  onAction={key => handleRowAction(f, key)}
                >
                  <Menu.Item id="download">Download</Menu.Item>
                  <Menu.Item id="rename">Rename</Menu.Item>
                  <Menu.Item id="delete" variant="destructive">
                    Delete
                  </Menu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const NOTIFICATIONS = [
  {
    id: 'joins',
    title: 'New member joins',
    desc: 'Get notified when someone joins the team',
  },
  {
    id: 'deadline',
    title: 'Project deadline approaching',
    desc: 'Reminder 3 days before deadline',
  },
  {
    id: 'digest',
    title: 'Weekly digest',
    desc: 'Summary of team activity every Monday',
  },
  {
    id: 'mention',
    title: 'Mention notifications',
    desc: 'When someone mentions you in a comment',
  },
  {
    id: 'calendar',
    title: 'Calendar reminders',
    desc: '15 minutes before scheduled events',
  },
];

interface Integration {
  id: string;
  name: string;
  connected: boolean;
  description: string;
}

const SettingsPage = ({
  teamName,
  setTeamName,
}: {
  teamName: string;
  setTeamName: (v: string) => void;
}) => {
  const { addToast } = useToast();
  const [draftName, setDraftName] = useState(teamName);
  const [description, setDescription] = useState(
    'A team that builds great software together.'
  );
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    joins: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'slack',
      name: 'Slack',
      connected: true,
      description: 'Send team notifications to your Slack channels.',
    },
    {
      id: 'github',
      name: 'GitHub',
      connected: false,
      description: 'Link commits and pull requests to projects.',
    },
    {
      id: 'jira',
      name: 'Jira',
      connected: false,
      description: 'Sync issues and sprints with your boards.',
    },
  ]);

  const [disconnectTarget, setDisconnectTarget] = useState<Integration | null>(
    null
  );

  const saveGeneral = () => {
    setTeamName(draftName.trim() || teamName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const toggleConnection = (integration: Integration) => {
    if (integration.connected) {
      setDisconnectTarget(integration);
    } else {
      setIntegrations(prev =>
        prev.map(i => (i.id === integration.id ? { ...i, connected: true } : i))
      );
    }
  };

  const confirmDisconnect = () => {
    if (disconnectTarget) {
      setIntegrations(prev =>
        prev.map(i =>
          i.id === disconnectTarget.id ? { ...i, connected: false } : i
        )
      );
    }
    setDisconnectTarget(null);
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs aria-label="Team settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField
              label="Team Name"
              value={draftName}
              onChange={setDraftName}
              width={96}
            />
            <TextArea
              label="Description"
              value={description}
              onChange={setDescription}
              width={96}
            />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={key => setTimezone(String(key))}
              width={48}
            >
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onSelectionChange={key => setDateFormat(String(key))}
              width={48}
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Inline>
              <Button variant="primary" onPress={saveGeneral}>
                Save
              </Button>
            </Inline>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {NOTIFICATIONS.map(n => (
              <div key={n.id}>
                <Inline alignX="between" alignY="center" space={4}>
                  <Stack space={0}>
                    <Text weight="medium">{n.title}</Text>
                    <Text size="sm">{n.desc}</Text>
                  </Stack>
                  <Switch
                    aria-label={n.title}
                    selected={notifications[n.id]}
                    onChange={value =>
                      setNotifications(prev => ({ ...prev, [n.id]: value }))
                    }
                  />
                </Inline>
                <Divider />
              </div>
            ))}
            <Inline>
              <Button
                variant="primary"
                onPress={() =>
                  addToast({
                    title: 'Preferences saved.',
                    variant: 'success',
                  })
                }
              >
                Save Preferences
              </Button>
            </Inline>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Columns columns={[1, 1, 1]} space={4} collapseAt="50em">
            {integrations.map(i => (
              <Card key={i.id} p={4}>
                <Stack space={3}>
                  <Inline alignX="between" alignY="center" space={2}>
                    <Headline level={4}>{i.name}</Headline>
                    <Badge variant={i.connected ? 'success' : 'default'}>
                      {i.connected ? 'Connected' : 'Not connected'}
                    </Badge>
                  </Inline>
                  <Text size="sm">{i.description}</Text>
                  <Inline>
                    <Button
                      size="small"
                      variant={i.connected ? 'secondary' : 'primary'}
                      onPress={() => toggleConnection(i)}
                    >
                      {i.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </Inline>
                </Stack>
              </Card>
            ))}
          </Columns>
        </Tabs.TabPanel>
      </Tabs>

      <Dialog
        role="alertdialog"
        open={disconnectTarget !== null}
        onOpenChange={open => {
          if (!open) setDisconnectTarget(null);
        }}
      >
        <Dialog.Title>Disconnect {disconnectTarget?.name}?</Dialog.Title>
        <Dialog.Content>
          This will stop syncing with {disconnectTarget?.name}. You can
          reconnect at any time.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onPress={() => setDisconnectTarget(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onPress={confirmDisconnect}>
            Disconnect
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [path, setPath] = useState('/dashboard');
  const [teamName, setTeamName] = useState('TeamHub');

  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'cards'>(
    'table'
  );
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);

  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  const openAddMember = () => {
    setEditingMember(null);
    setMemberDialogOpen(true);
  };
  const openEditMember = (m: Member) => {
    setEditingMember(m);
    setMemberDialogOpen(true);
  };

  const submitMember = (form: MemberFormState) => {
    const joined = form.startDate
      ? form.startDate.toDate(getLocalTimeZone())
      : new Date();
    if (editingMember) {
      setMembers(prev =>
        prev.map(m =>
          m.id === editingMember.id
            ? {
                ...m,
                name: form.name,
                email: form.email,
                role: form.role,
                bio: form.bio,
                joined,
              }
            : m
        )
      );
    } else {
      setMembers(prev => [
        ...prev,
        {
          id: nextId('m'),
          name: form.name,
          email: form.email,
          role: form.role,
          bio: form.bio,
          joined,
          status: 'active',
        },
      ]);
    }
  };

  const confirmRemove = () => {
    if (removeTarget) {
      setMembers(prev => prev.filter(m => m.id !== removeTarget.id));
    }
    setRemoveTarget(null);
  };

  const navigate = (to: string) => setPath(to);

  let page: React.ReactNode = null;
  if (path === '/members') {
    page = (
      <MembersPage
        members={members}
        viewMode={memberViewMode}
        setViewMode={setMemberViewMode}
        onAdd={openAddMember}
        onEdit={openEditMember}
        onRemove={setRemoveTarget}
      />
    );
  } else if (path === '/projects') {
    page = <ProjectsPage projects={projects} setProjects={setProjects} />;
  } else if (path === '/calendar') {
    page = <CalendarPage />;
  } else if (path === '/files') {
    page = <FilesPage files={files} setFiles={setFiles} />;
  } else if (path === '/settings') {
    page = <SettingsPage teamName={teamName} setTeamName={setTeamName} />;
  } else {
    page = <DashboardPage memberCount={members.length} />;
  }

  return (
    <>
      <ToastProvider position="bottom-right" />
      <RouterProvider navigate={navigate}>
        <Sidebar.Provider defaultOpen>
          <AppLayout>
            <AppLayout.Sidebar>
              <Sidebar.Header>
                <Text weight="bold" size="lg">
                  {teamName}
                </Text>
              </Sidebar.Header>
              <Sidebar.Nav current={path}>
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
              <TopNavigation.Middle aria-label="Breadcrumbs">
                <Breadcrumbs>
                  <Breadcrumbs.Item href="/dashboard">
                    {teamName}
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item href={path}>
                    {pageLabel(path)}
                  </Breadcrumbs.Item>
                </Breadcrumbs>
              </TopNavigation.Middle>
              <TopNavigation.End>
                <Inline space={2} alignY="center">
                  <Tooltip.Trigger>
                    <Menu label="John Doe">
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
              <Inset space={6}>{page}</Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>

      <MemberDialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        editing={editingMember}
        onSubmit={submitMember}
      />

      <Dialog
        role="alertdialog"
        open={removeTarget !== null}
        onOpenChange={open => {
          if (!open) setRemoveTarget(null);
        }}
      >
        <Dialog.Title>Remove {removeTarget?.name}?</Dialog.Title>
        <Dialog.Content>
          This will permanently remove {removeTarget?.name} from the team. This
          action cannot be undone.
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onPress={() => setRemoveTarget(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onPress={confirmRemove}>
            Remove
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
};

export default TestApp;
