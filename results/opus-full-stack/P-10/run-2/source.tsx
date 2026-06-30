import { useState } from 'react';
import {
  ActionBar,
  ActionMenu,
  AppLayout,
  Aside,
  Badge,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  ContextualHelp,
  DateField,
  DateFormat,
  Dialog,
  Divider,
  FileField,
  Form,
  Headline,
  Inline,
  Menu,
  NumericFormat,
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
  RouterProvider,
  useToast,
} from '@marigold/components';
import type { Selection } from '@marigold/components';
import {
  parseDate,
  today,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date';

/* ------------------------------------------------------------------ */
/* Types & seed data                                                  */
/* ------------------------------------------------------------------ */

type Role = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';

interface Member {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: MemberStatus;
  joined: string; // ISO yyyy-mm-dd
  bio: string;
}

const SEED_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.io',
    status: 'Active',
    joined: '2024-03-15',
    bio: 'Full-stack engineer focused on the design system and tooling.',
  },
  {
    id: 'm2',
    name: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.io',
    status: 'On Leave',
    joined: '2023-11-02',
    bio: 'Product designer working on the new dashboard experience.',
  },
  {
    id: 'm3',
    name: 'Carol White',
    role: 'Manager',
    email: 'carol@teamhub.io',
    status: 'Active',
    joined: '2022-07-20',
    bio: 'Team lead coordinating roadmap and stakeholder communication.',
  },
  {
    id: 'm4',
    name: 'David Lee',
    role: 'Developer',
    email: 'david@teamhub.io',
    status: 'Active',
    joined: '2024-01-10',
    bio: 'Backend developer specialising in APIs and infrastructure.',
  },
  {
    id: 'm5',
    name: 'Eva Brown',
    role: 'QA',
    email: 'eva@teamhub.io',
    status: 'On Leave',
    joined: '2023-05-30',
    bio: 'Quality engineer maintaining the automated test suites.',
  },
  {
    id: 'm6',
    name: 'Frank Green',
    role: 'Designer',
    email: 'frank@teamhub.io',
    status: 'Active',
    joined: '2023-09-12',
    bio: 'Brand and motion designer crafting the visual language.',
  },
];

const ROLE_OPTIONS: Role[] = ['Developer', 'Designer', 'Manager', 'QA'];

const roleVariant: Record<Role, 'info' | 'primary' | 'warning' | 'default'> = {
  Developer: 'info',
  Designer: 'primary',
  Manager: 'warning',
  QA: 'default',
};

const isoToDate = (iso: string) => new Date(`${iso}T00:00:00`);

let nextId = 100;
const genId = () => `m${nextId++}`;

/* ------------------------------------------------------------------ */
/* Member add / edit dialog                                           */
/* ------------------------------------------------------------------ */

interface MemberFormProps {
  initial?: Member;
  onSave: (member: Member) => void;
  close: () => void;
}

const MemberForm = ({ initial, onSave, close }: MemberFormProps) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<Role>(initial?.role ?? 'Developer');
  const [start, setStart] = useState<DateValue | null>(
    initial?.joined ? parseDate(initial.joined) : null
  );
  const [bio, setBio] = useState(initial?.bio ?? '');
  const [submitted, setSubmitted] = useState(false);

  const nameMissing = name.trim() === '';
  const emailMissing = email.trim() === '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameMissing || emailMissing) {
      return;
    }
    onSave({
      id: initial?.id ?? genId(),
      name: name.trim(),
      email: email.trim(),
      role,
      status: initial?.status ?? 'Active',
      joined: start ? start.toString() : initial?.joined ?? '2024-01-01',
      bio: bio.trim(),
    });
    close();
  };

  return (
    <>
      <Dialog.Title>{initial ? 'Edit Member' : 'Add Member'}</Dialog.Title>
      <Dialog.Content>
        <Form onSubmit={handleSubmit}>
          <Stack space={4}>
            <TextField
              name="name"
              label="Full Name"
              value={name}
              onChange={setName}
              required
              error={submitted && nameMissing}
              errorMessage="Full Name is required."
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              error={submitted && emailMissing}
              errorMessage="Email is required."
            />
            <Select
              name="role"
              label="Role"
              selectedKey={role}
              onSelectionChange={key => setRole(key as Role)}
            >
              {ROLE_OPTIONS.map(r => (
                <Select.Option key={r} id={r}>
                  {r}
                </Select.Option>
              ))}
            </Select>
            <DateField
              label="Start Date"
              value={start}
              onChange={setStart}
            />
            <TextArea
              name="bio"
              label="Bio"
              rows={3}
              value={bio}
              onChange={setBio}
            />
            <Inline space={3} alignX="right">
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {initial ? 'Save' : 'Add'}
              </Button>
            </Inline>
          </Stack>
        </Form>
      </Dialog.Content>
    </>
  );
};

interface MemberFormDialogProps {
  initial?: Member;
  onSave: (member: Member) => void;
  trigger: React.ReactNode;
}

const MemberFormDialog = ({ initial, onSave, trigger }: MemberFormDialogProps) => (
  <Dialog.Trigger>
    {trigger}
    <Dialog size="small" aria-label={initial ? 'Edit member' : 'Add member'}>
      {({ close }) => <MemberForm initial={initial} onSave={onSave} close={close} />}
    </Dialog>
  </Dialog.Trigger>
);

/* ------------------------------------------------------------------ */
/* Generic confirmation dialog                                        */
/* ------------------------------------------------------------------ */

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  trigger,
  title,
  message,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog.Trigger>
    {trigger}
    <Dialog size="xsmall" role="alertdialog" aria-label={title}>
      {({ close }) => (
        <>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="secondary" onPress={close}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onPress={() => {
                onConfirm();
                close();
              }}
            >
              {confirmLabel}
            </Button>
          </Dialog.Actions>
        </>
      )}
    </Dialog>
  </Dialog.Trigger>
);

/* ------------------------------------------------------------------ */
/* Dashboard page                                                     */
/* ------------------------------------------------------------------ */

interface SummaryCardProps {
  label: string;
  value: React.ReactNode;
  help?: string;
}

const SummaryCard = ({ label, value, help }: SummaryCardProps) => (
  <Card>
    <Stack space={2}>
      <Inline space={1} alignY="center">
        <Text size="sm" color="muted-foreground">
          {label}
        </Text>
        {help ? (
          <ContextualHelp>
            <ContextualHelp.Title>{label}</ContextualHelp.Title>
            <ContextualHelp.Content>{help}</ContextualHelp.Content>
          </ContextualHelp>
        ) : null}
      </Inline>
      <Headline level="2">{value}</Headline>
    </Stack>
  </Card>
);

type ActivityType = 'Commit' | 'Review' | 'Deploy';

const activityVariant: Record<ActivityType, 'info' | 'warning' | 'success'> = {
  Commit: 'info',
  Review: 'warning',
  Deploy: 'success',
};

const ACTIVITY: {
  id: string;
  member: string;
  action: ActivityType;
  project: string;
  date: string;
}[] = [
  { id: 'a1', member: 'Alice Johnson', action: 'Commit', project: 'Apollo', date: '2026-05-28' },
  { id: 'a2', member: 'David Lee', action: 'Deploy', project: 'Nebula', date: '2026-05-27' },
  { id: 'a3', member: 'Carol White', action: 'Review', project: 'Apollo', date: '2026-05-26' },
  { id: 'a4', member: 'Frank Green', action: 'Commit', project: 'Orion', date: '2026-05-25' },
  { id: 'a5', member: 'Eva Brown', action: 'Review', project: 'Nebula', date: '2026-05-24' },
];

const DashboardPage = ({ memberCount }: { memberCount: number }) => (
  <Stack space={6}>
    <Headline level="1">Team Overview</Headline>

    <Tiles tilesWidth="180px" space="group" stretch equalHeight>
      <SummaryCard label="Members" value={memberCount} />
      <SummaryCard label="Active Projects" value={5} />
      <SummaryCard label="Upcoming Deadlines" value={8} />
      <SummaryCard
        label="Hours This Week"
        value={<NumericFormat value={342} />}
        help="Aggregate of all team members."
      />
    </Tiles>

    <Stack space={3}>
      <Headline level="3">Recent Activity</Headline>
      <Table aria-label="Recent activity">
        <Table.Header>
          <Table.Column rowHeader>Member</Table.Column>
          <Table.Column>Action</Table.Column>
          <Table.Column>Project</Table.Column>
          <Table.Column>Date</Table.Column>
        </Table.Header>
        <Table.Body items={ACTIVITY}>
          {item => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.member}</Table.Cell>
              <Table.Cell>
                <Badge variant={activityVariant[item.action]}>{item.action}</Badge>
              </Table.Cell>
              <Table.Cell>{item.project}</Table.Cell>
              <Table.Cell>
                <DateFormat value={isoToDate(item.date)} dateStyle="medium" />
              </Table.Cell>
            </Table.Row>
          )}
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
/* Members page                                                       */
/* ------------------------------------------------------------------ */

const statusVariant: Record<MemberStatus, 'success' | 'warning'> = {
  Active: 'success',
  'On Leave': 'warning',
};

interface MembersPageProps {
  members: Member[];
  onAdd: (m: Member) => void;
  onUpdate: (m: Member) => void;
  onRemove: (id: string) => void;
  viewMode: 'table' | 'cards';
  setViewMode: (v: 'table' | 'cards') => void;
}

const MemberDetail = ({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) => (
  <Card>
    <Stack space={3}>
      <Inline space={2} alignY="center" alignX="between">
        <Headline level="3">{member.name}</Headline>
        <Button variant="ghost" size="small" onPress={onClose}>
          Close
        </Button>
      </Inline>
      <Badge variant={roleVariant[member.role]}>{member.role}</Badge>
      <Divider />
      <Stack space={1}>
        <Text size="sm" color="muted-foreground">
          Email
        </Text>
        <Text>{member.email}</Text>
      </Stack>
      <Stack space={1}>
        <Text size="sm" color="muted-foreground">
          Status
        </Text>
        <Badge variant={statusVariant[member.status]}>{member.status}</Badge>
      </Stack>
      <Stack space={1}>
        <Text size="sm" color="muted-foreground">
          Joined
        </Text>
        <Text>
          <DateFormat value={isoToDate(member.joined)} dateStyle="medium" />
        </Text>
      </Stack>
      <Stack space={1}>
        <Text size="sm" color="muted-foreground">
          Bio
        </Text>
        <Text>{member.bio}</Text>
      </Stack>
    </Stack>
  </Card>
);

const MembersPage = ({
  members,
  onAdd,
  onUpdate,
  onRemove,
  viewMode,
  setViewMode,
}: MembersPageProps) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | Role>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const selectedMember = members.find(m => m.id === selectedId) ?? null;

  const editTrigger = (m: Member) => (
    <MemberFormDialog
      initial={m}
      onSave={onUpdate}
      trigger={
        <Button variant="secondary" size="small">
          Edit
        </Button>
      }
    />
  );

  const removeTrigger = (m: Member) => (
    <ConfirmDialog
      title="Remove member"
      message={`Are you sure you want to remove ${m.name}? This cannot be undone.`}
      confirmLabel="Remove"
      onConfirm={() => {
        onRemove(m.id);
        if (selectedId === m.id) {
          setSelectedId(null);
        }
      }}
      trigger={
        <Button variant="destructive" size="small">
          Remove
        </Button>
      }
    />
  );

  const main = (
    <Stack space={5}>
      <Headline level="1">Team Members</Headline>

      <Inline space={3} alignY="bottom">
        <SearchField
          label="Search"
          placeholder="Filter by name"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          width={64}
        />
        <Select
          label="Role"
          selectedKey={roleFilter}
          onSelectionChange={key => setRoleFilter(key as 'All' | Role)}
          width={48}
        >
          <Select.Option id="All">All Roles</Select.Option>
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
        <MemberFormDialog
          onSave={onAdd}
          trigger={<Button variant="primary">Add Member</Button>}
        />
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team members">
          <Table.Header>
            <Table.Column rowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body items={filtered}>
            {m => (
              <Table.Row key={m.id}>
                <Table.Cell>
                  <Button variant="link" onPress={() => setSelectedId(m.id)}>
                    {m.name}
                  </Button>
                </Table.Cell>
                <Table.Cell>{m.role}</Table.Cell>
                <Table.Cell>{m.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat value={isoToDate(m.joined)} dateStyle="medium" />
                </Table.Cell>
                <Table.Cell>
                  <Inline space={2} noWrap>
                    {editTrigger(m)}
                    {removeTrigger(m)}
                  </Inline>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="240px" space="group" stretch equalHeight>
          {filtered.map(m => (
            <Card key={m.id}>
              <Stack space={3}>
                <Button variant="link" onPress={() => setSelectedId(m.id)}>
                  <Headline level="4">{m.name}</Headline>
                </Button>
                <Badge variant={roleVariant[m.role]}>{m.role}</Badge>
                <Text size="sm" color="muted-foreground">
                  {m.email}
                </Text>
                <Inline space={2}>
                  <Button variant="secondary" size="small">
                    Message
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onPress={() => setSelectedId(m.id)}
                  >
                    Profile
                  </Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}
    </Stack>
  );

  if (selectedMember) {
    return (
      <Aside side="right" sideWidth="320px" space={6}>
        {main}
        <MemberDetail member={selectedMember} onClose={() => setSelectedId(null)} />
      </Aside>
    );
  }

  return main;
};

/* ------------------------------------------------------------------ */
/* Projects page                                                      */
/* ------------------------------------------------------------------ */

type ProjectStatus = 'Active' | 'On Hold' | 'Completed';

interface Project {
  id: string;
  name: string;
  lead: string;
  members: number;
  deadline: string;
  progress: number; // 0..1
  status: ProjectStatus;
}

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Apollo', lead: 'Carol White', members: 6, deadline: '2026-07-15', progress: 0.75, status: 'Active' },
  { id: 'p2', name: 'Nebula', lead: 'David Lee', members: 4, deadline: '2026-06-30', progress: 0.4, status: 'Active' },
  { id: 'p3', name: 'Orion', lead: 'Alice Johnson', members: 3, deadline: '2026-08-01', progress: 0.1, status: 'On Hold' },
  { id: 'p4', name: 'Helios', lead: 'Frank Green', members: 5, deadline: '2026-05-20', progress: 1, status: 'Completed' },
  { id: 'p5', name: 'Vega', lead: 'Bob Smith', members: 2, deadline: '2026-09-10', progress: 0.55, status: 'Active' },
];

const projectStatusVariant: Record<ProjectStatus, 'success' | 'warning' | 'info'> = {
  Active: 'success',
  'On Hold': 'warning',
  Completed: 'info',
};

const ProjectsPage = () => {
  const { addToast } = useToast();
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Selection>(new Set());

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedIds = (): string[] => {
    if (selected === 'all') {
      return filtered.map(p => p.id);
    }
    return Array.from(selected).map(String);
  };

  const archiveSelected = () => {
    const ids = new Set(selectedIds());
    setProjects(prev => prev.filter(p => !ids.has(p.id)));
    setSelected(new Set());
  };

  return (
    <Stack space={5}>
      <Headline level="1">Projects</Headline>

      <Inline space={3} alignY="bottom">
        <SearchField
          label="Search"
          placeholder="Filter projects"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          width={64}
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        actionBar={() => (
          <ActionBar>
            <ActionBar.Button onPress={archiveSelected}>
              Archive Selected
            </ActionBar.Button>
            <ActionBar.Button
              onPress={() =>
                addToast({
                  title: 'Export started',
                  description: `${selectedIds().length} project(s) exported.`,
                  variant: 'info',
                })
              }
            >
              Export
            </ActionBar.Button>
          </ActionBar>
        )}
      >
        <Table.Header>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column alignX="right">Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filtered}>
          {p => (
            <Table.Row key={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>
                <DateFormat value={isoToDate(p.deadline)} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <NumericFormat value={p.progress} style="percent" />
              </Table.Cell>
              <Table.Cell>
                <Badge variant={projectStatusVariant[p.status]}>{p.status}</Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Calendar page                                                      */
/* ------------------------------------------------------------------ */

type EventType = 'Meeting' | 'Deadline' | 'Social';

const eventVariant: Record<EventType, 'info' | 'warning' | 'success'> = {
  Meeting: 'info',
  Deadline: 'warning',
  Social: 'success',
};

const UPCOMING_EVENTS: {
  id: string;
  date: string;
  name: string;
  type: EventType;
}[] = [
  { id: 'e1', date: '2026-06-30', name: 'Sprint Planning', type: 'Meeting' },
  { id: 'e2', date: '2026-07-02', name: 'Apollo Release', type: 'Deadline' },
  { id: 'e3', date: '2026-07-05', name: 'Team Lunch', type: 'Social' },
  { id: 'e4', date: '2026-07-08', name: 'Design Review', type: 'Meeting' },
];

const CalendarPage = () => (
  <Stack space={6}>
    <Headline level="1">Team Calendar</Headline>
    <Calendar aria-label="Team calendar" defaultValue={today(getLocalTimeZone())} />

    <Stack space={3}>
      <Headline level="3">Upcoming Events</Headline>
      <Stack space={2}>
        {UPCOMING_EVENTS.map(ev => (
          <Card key={ev.id}>
            <Inline space={3} alignY="center" alignX="between">
              <Inline space={3} alignY="center">
                <Text weight="medium">
                  <DateFormat value={isoToDate(ev.date)} dateStyle="medium" />
                </Text>
                <Text>{ev.name}</Text>
              </Inline>
              <Badge variant={eventVariant[ev.type]}>{ev.type}</Badge>
            </Inline>
          </Card>
        ))}
      </Stack>
    </Stack>
  </Stack>
);

/* ------------------------------------------------------------------ */
/* Files page                                                         */
/* ------------------------------------------------------------------ */

type FileType = 'Document' | 'Image' | 'Spreadsheet';

interface SharedFile {
  id: string;
  name: string;
  type: FileType;
  sizeMB: number;
  uploadedBy: string;
  date: string;
}

const SEED_FILES: SharedFile[] = [
  { id: 'f1', name: 'Roadmap.pdf', type: 'Document', sizeMB: 2.4, uploadedBy: 'Carol White', date: '2026-05-20' },
  { id: 'f2', name: 'Logo.png', type: 'Image', sizeMB: 0.8, uploadedBy: 'Frank Green', date: '2026-05-18' },
  { id: 'f3', name: 'Budget.xlsx', type: 'Spreadsheet', sizeMB: 1.2, uploadedBy: 'Bob Smith', date: '2026-05-15' },
  { id: 'f4', name: 'Architecture.pdf', type: 'Document', sizeMB: 3.6, uploadedBy: 'Alice Johnson', date: '2026-05-12' },
  { id: 'f5', name: 'Mockups.png', type: 'Image', sizeMB: 5.1, uploadedBy: 'Frank Green', date: '2026-05-10' },
];

const FILE_TYPE_FILTERS: { id: string; label: string; type?: FileType }[] = [
  { id: 'All', label: 'All' },
  { id: 'Documents', label: 'Documents', type: 'Document' },
  { id: 'Images', label: 'Images', type: 'Image' },
  { id: 'Spreadsheets', label: 'Spreadsheets', type: 'Spreadsheet' },
];

const UploadDialog = ({ onUpload }: { onUpload: (files: SharedFile[]) => void }) => {
  return (
    <Dialog.Trigger>
      <Button variant="primary">Upload</Button>
      <Dialog size="small" aria-label="Upload files">
        {({ close }) => <UploadForm onUpload={onUpload} close={close} />}
      </Dialog>
    </Dialog.Trigger>
  );
};

const UploadForm = ({
  onUpload,
  close,
}: {
  onUpload: (files: SharedFile[]) => void;
  close: () => void;
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FileType>('Document');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const picked = data
      .getAll('files')
      .filter((v): v is File => v instanceof File && v.name !== '');
    const source: { name: string; size: number }[] = picked.length
      ? picked
      : [{ name: 'Untitled.pdf', size: 1_000_000 }];
    const rows: SharedFile[] = source.map((f, i) => ({
      id: `f${Date.now()}-${i}`,
      name: f.name,
      type: category,
      sizeMB: Math.max(0.1, Math.round((f.size / 1_000_000) * 10) / 10),
      uploadedBy: 'John Doe',
      date: today(getLocalTimeZone()).toString(),
    }));
    onUpload(rows);
    close();
  };

  return (
    <>
      <Dialog.Title>Upload Files</Dialog.Title>
      <Dialog.Content>
        <Form onSubmit={handleSubmit}>
          <Stack space={4}>
            <FileField label="Files" name="files" multiple />
            <TextField
              label="Description"
              value={description}
              onChange={setDescription}
            />
            <Select
              label="Category"
              selectedKey={category}
              onSelectionChange={key => setCategory(key as FileType)}
            >
              <Select.Option id="Document">Document</Select.Option>
              <Select.Option id="Image">Image</Select.Option>
              <Select.Option id="Spreadsheet">Spreadsheet</Select.Option>
            </Select>
            <Inline space={3} alignX="right">
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Upload
              </Button>
            </Inline>
          </Stack>
        </Form>
      </Dialog.Content>
    </>
  );
};

const FilesPage = () => {
  const { addToast } = useToast();
  const [files, setFiles] = useState<SharedFile[]>(SEED_FILES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const activeType = FILE_TYPE_FILTERS.find(f => f.id === typeFilter)?.type;
  const filtered = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = !activeType || f.type === activeType;
    return matchesSearch && matchesType;
  });

  const handleUpload = (rows: SharedFile[]) => {
    setFiles(prev => [...rows, ...prev]);
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  return (
    <Stack space={5}>
      <Headline level="1">Shared Files</Headline>

      <Inline space={3} alignY="bottom">
        <SearchField
          label="Search"
          placeholder="Filter files"
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
          {FILE_TYPE_FILTERS.map(f => (
            <Select.Option key={f.id} id={f.id}>
              {f.label}
            </Select.Option>
          ))}
        </Select>
        <UploadDialog onUpload={handleUpload} />
      </Inline>

      <Table aria-label="Shared files">
        <Table.Header>
          <Table.Column rowHeader>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column alignX="right">Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body items={filtered}>
          {f => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat
                  value={f.sizeMB}
                  style="unit"
                  unit="megabyte"
                  unitDisplay="short"
                  maximumFractionDigits={1}
                />
              </Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={isoToDate(f.date)} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <ActionMenu.Item
                    id="download"
                    onAction={() =>
                      addToast({ title: `Downloading ${f.name}`, variant: 'info' })
                    }
                  >
                    Download
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="rename"
                    onAction={() =>
                      addToast({ title: `Rename ${f.name}`, variant: 'info' })
                    }
                  >
                    Rename
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="delete"
                    variant="destructive"
                    onAction={() =>
                      setFiles(prev => prev.filter(x => x.id !== f.id))
                    }
                  >
                    Delete
                  </ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Settings page                                                      */
/* ------------------------------------------------------------------ */

interface SettingsPageProps {
  teamName: string;
  setTeamName: (name: string) => void;
}

const NOTIFICATION_SETTINGS = [
  { id: 'joins', title: 'New member joins', description: 'Get notified when someone joins the team', defaultOn: true },
  { id: 'deadline', title: 'Project deadline approaching', description: 'Reminder 3 days before deadline', defaultOn: true },
  { id: 'digest', title: 'Weekly digest', description: 'Summary of team activity every Monday', defaultOn: false },
  { id: 'mention', title: 'Mention notifications', description: 'When someone mentions you in a comment', defaultOn: true },
  { id: 'reminders', title: 'Calendar reminders', description: '15 minutes before scheduled events', defaultOn: false },
];

interface IntegrationState {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

const SEED_INTEGRATIONS: IntegrationState[] = [
  { id: 'slack', name: 'Slack', description: 'Send notifications to your team channels.', connected: true },
  { id: 'github', name: 'GitHub', description: 'Link commits and pull requests to projects.', connected: false },
  { id: 'jira', name: 'Jira', description: 'Sync issues and sprints with your boards.', connected: false },
];

const SettingsPage = ({ teamName, setTeamName }: SettingsPageProps) => {
  const { addToast } = useToast();
  const [description, setDescription] = useState('The TeamHub workspace.');
  const [timezone, setTimezone] = useState('CET');
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_SETTINGS.map(n => [n.id, n.defaultOn]))
  );
  const [integrations, setIntegrations] = useState<IntegrationState[]>(SEED_INTEGRATIONS);

  return (
    <Stack space={5}>
      <Headline level="1">Team Settings</Headline>

      <Tabs aria-label="Team settings">
        <Tabs.List aria-label="Team settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Form
            onSubmit={e => {
              e.preventDefault();
              addToast({ title: 'Settings updated.', variant: 'success' });
            }}
          >
            <Stack space={4}>
              <TextField
                label="Team Name"
                value={teamName}
                onChange={setTeamName}
                width={96}
              />
              <TextArea
                label="Description"
                rows={3}
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
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Stack>
          </Form>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Form
            onSubmit={e => {
              e.preventDefault();
              addToast({ title: 'Preferences saved.', variant: 'success' });
            }}
          >
            <Stack space={4}>
              {NOTIFICATION_SETTINGS.map(n => (
                <Stack key={n.id} space={1}>
                  <Switch
                    label={n.title}
                    selected={notifications[n.id]}
                    onChange={value =>
                      setNotifications(prev => ({ ...prev, [n.id]: value }))
                    }
                  />
                  <Text size="sm" color="muted-foreground">
                    {n.description}
                  </Text>
                </Stack>
              ))}
              <Button variant="primary" type="submit">
                Save Preferences
              </Button>
            </Stack>
          </Form>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="220px" space="group" stretch equalHeight>
            {integrations.map(integration => (
              <Card key={integration.id}>
                <Stack space={3}>
                  <Headline level="4">{integration.name}</Headline>
                  <Badge variant={integration.connected ? 'success' : 'default'}>
                    {integration.connected ? 'Connected' : 'Not connected'}
                  </Badge>
                  <Text size="sm" color="muted-foreground">
                    {integration.description}
                  </Text>
                  {integration.connected ? (
                    <ConfirmDialog
                      title={`Disconnect ${integration.name}`}
                      message={`Are you sure you want to disconnect ${integration.name}?`}
                      confirmLabel="Disconnect"
                      onConfirm={() =>
                        setIntegrations(prev =>
                          prev.map(i =>
                            i.id === integration.id ? { ...i, connected: false } : i
                          )
                        )
                      }
                      trigger={<Button variant="secondary">Disconnect</Button>}
                    />
                  ) : (
                    <Button
                      variant="primary"
                      onPress={() =>
                        setIntegrations(prev =>
                          prev.map(i =>
                            i.id === integration.id ? { ...i, connected: true } : i
                          )
                        )
                      }
                    >
                      Connect
                    </Button>
                  )}
                </Stack>
              </Card>
            ))}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

/* ------------------------------------------------------------------ */
/* Shell                                                              */
/* ------------------------------------------------------------------ */

type PageKey =
  | 'dashboard'
  | 'members'
  | 'projects'
  | 'calendar'
  | 'files'
  | 'settings';

const NAV_ITEMS: { id: PageKey; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'members', label: 'Members' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
];

const PAGE_LABEL: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  members: 'Members',
  projects: 'Projects',
  calendar: 'Calendar',
  files: 'Files',
  settings: 'Settings',
};

const TestApp = () => {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [teamName, setTeamName] = useState('TeamHub');
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const addMember = (m: Member) => setMembers(prev => [...prev, m]);
  const updateMember = (m: Member) =>
    setMembers(prev => prev.map(x => (x.id === m.id ? m : x)));
  const removeMember = (id: string) =>
    setMembers(prev => prev.filter(x => x.id !== id));

  const navigate = (path: string) => {
    const key = path.replace(/^\//, '') as PageKey;
    if (NAV_ITEMS.some(n => n.id === key)) {
      setPage(key);
    }
  };

  return (
    <RouterProvider navigate={navigate}>
      <ToastProvider />
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">{teamName}</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={`/${page}`}>
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
            <TopNavigation.Middle aria-label="Breadcrumb" alignX="center">
              <Breadcrumbs>
                <Breadcrumbs.Item href="/dashboard">{teamName}</Breadcrumbs.Item>
                <Breadcrumbs.Item href={`/${page}`}>
                  {PAGE_LABEL[page]}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End aria-label="User actions">
              <Inline space={2} alignY="center">
                <ContextualHelp>
                  <ContextualHelp.Title>Navigation</ContextualHelp.Title>
                  <ContextualHelp.Content>
                    Use the sidebar to navigate between sections.
                  </ContextualHelp.Content>
                </ContextualHelp>
                <Tooltip.Trigger>
                  <Menu label="John Doe">
                    <Menu.Item id="profile">Profile</Menu.Item>
                    <Menu.Item id="preferences">Preferences</Menu.Item>
                    <Menu.Item id="signout">Sign Out</Menu.Item>
                  </Menu>
                  <Tooltip>Account settings</Tooltip>
                </Tooltip.Trigger>
              </Inline>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            {page === 'dashboard' && <DashboardPage memberCount={members.length} />}
            {page === 'members' && (
              <MembersPage
                members={members}
                onAdd={addMember}
                onUpdate={updateMember}
                onRemove={removeMember}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            )}
            {page === 'projects' && <ProjectsPage />}
            {page === 'calendar' && <CalendarPage />}
            {page === 'files' && <FilesPage />}
            {page === 'settings' && (
              <SettingsPage teamName={teamName} setTeamName={setTeamName} />
            )}
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
};

export default TestApp;
