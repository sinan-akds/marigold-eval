import React, { useState } from 'react';
import {
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Columns,
  ContextualHelp,
  DateFormat,
  Dialog,
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

// ─── Types ────────────────────────────────────────────────────────────────────

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
  type: 'Document' | 'Image' | 'Spreadsheet';
  size: number;
  uploadedBy: string;
  date: Date;
}

interface CalendarEvent {
  id: string;
  date: Date;
  name: string;
  type: 'Meeting' | 'Deadline' | 'Social';
}

interface ActivityRow {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
}

interface MemberFormData {
  name: string;
  email: string;
  role: string;
  startDate: string;
  bio: string;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.com', status: 'Active', joined: new Date(2022, 2, 15), bio: 'Full-stack developer with 5 years of experience in React and Node.js.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.com', status: 'Active', joined: new Date(2021, 8, 1), bio: 'UX/UI designer passionate about accessibility and user-centered design.' },
  { id: '3', name: 'Carol Williams', role: 'Manager', email: 'carol@teamhub.com', status: 'Active', joined: new Date(2020, 0, 10), bio: 'Project manager with expertise in agile and scrum methodologies.' },
  { id: '4', name: 'David Brown', role: 'Developer', email: 'david@teamhub.com', status: 'On Leave', joined: new Date(2022, 11, 5), bio: 'Backend developer specializing in distributed systems and databases.' },
  { id: '5', name: 'Emma Davis', role: 'QA', email: 'emma@teamhub.com', status: 'Active', joined: new Date(2023, 3, 20), bio: 'QA engineer focused on automated testing and quality processes.' },
  { id: '6', name: 'Frank Miller', role: 'Designer', email: 'frank@teamhub.com', status: 'Active', joined: new Date(2023, 6, 8), bio: 'Visual designer with a background in brand identity and motion graphics.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: new Date(2026, 7, 15), progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App', lead: 'Carol Williams', members: 3, deadline: new Date(2026, 9, 30), progress: 40, status: 'Active' },
  { id: '3', name: 'API Integration', lead: 'David Brown', members: 2, deadline: new Date(2026, 5, 20), progress: 90, status: 'On Hold' },
  { id: '4', name: 'Design System', lead: 'Bob Smith', members: 3, deadline: new Date(2026, 4, 1), progress: 100, status: 'Completed' },
  { id: '5', name: 'Analytics Dashboard', lead: 'Emma Davis', members: 2, deadline: new Date(2026, 8, 10), progress: 25, status: 'Active' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Project Brief.pdf', type: 'Document', size: 2400000, uploadedBy: 'Alice Johnson', date: new Date(2026, 4, 28) },
  { id: '2', name: 'Logo Assets.zip', type: 'Image', size: 8100000, uploadedBy: 'Bob Smith', date: new Date(2026, 5, 3) },
  { id: '3', name: 'Q2 Report.xlsx', type: 'Spreadsheet', size: 540000, uploadedBy: 'Carol Williams', date: new Date(2026, 5, 10) },
  { id: '4', name: 'Wireframes.pdf', type: 'Document', size: 1200000, uploadedBy: 'Frank Miller', date: new Date(2026, 5, 15) },
  { id: '5', name: 'User Research.xlsx', type: 'Spreadsheet', size: 320000, uploadedBy: 'Emma Davis', date: new Date(2026, 5, 18) },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', date: new Date(2026, 5, 23), name: 'Sprint Planning', type: 'Meeting' },
  { id: '2', date: new Date(2026, 5, 25), name: 'Design Review', type: 'Meeting' },
  { id: '3', date: new Date(2026, 5, 27), name: 'API Deadline', type: 'Deadline' },
  { id: '4', date: new Date(2026, 6, 2), name: 'Team Lunch', type: 'Social' },
];

const ACTIVITY_ROWS: ActivityRow[] = [
  { id: '1', member: 'Alice Johnson', action: 'Commit', project: 'Website Redesign', date: new Date(2026, 4, 28) },
  { id: '2', member: 'Bob Smith', action: 'Review', project: 'Design System', date: new Date(2026, 5, 1) },
  { id: '3', member: 'Carol Williams', action: 'Deploy', project: 'API Integration', date: new Date(2026, 5, 5) },
  { id: '4', member: 'Emma Davis', action: 'Commit', project: 'Analytics Dashboard', date: new Date(2026, 5, 10) },
  { id: '5', member: 'David Brown', action: 'Review', project: 'Mobile App', date: new Date(2026, 5, 15) },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const roleVariant = (role: string): 'info' | 'warning' | 'success' | 'default' => {
  if (role === 'Developer') return 'info';
  if (role === 'Designer') return 'warning';
  if (role === 'Manager') return 'success';
  return 'default';
};

const actionVariant = (action: string): 'info' | 'warning' | 'success' => {
  if (action === 'Commit') return 'info';
  if (action === 'Review') return 'warning';
  return 'success';
};

const statusVariant = (status: string): 'success' | 'warning' | 'info' | 'default' => {
  if (status === 'Active' || status === 'Completed') return 'success';
  if (status === 'On Leave' || status === 'On Hold') return 'warning';
  return 'info';
};

const eventTypeVariant = (type: string): 'info' | 'warning' | 'success' => {
  if (type === 'Meeting') return 'info';
  if (type === 'Deadline') return 'warning';
  return 'success';
};

const buildCalendarWeeks = (year: number, month: number): (Date | null)[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
};

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
  if (bytes >= 1000) return `${(bytes / 1000).toFixed(0)} KB`;
  return `${bytes} B`;
};

// ─── Member Form Dialog ───────────────────────────────────────────────────────

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: MemberFormData;
  onFormChange: (data: MemberFormData) => void;
  onSubmit: () => void;
}

const MemberDialog = ({ open, onOpenChange, title, formData, onFormChange, onSubmit }: MemberDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange} closeButton size="medium">
    {({ close }) => (
      <>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Stack space={3}>
            <TextField
              label="Full Name"
              required
              value={formData.name}
              onChange={(v: string) => onFormChange({ ...formData, name: v })}
            />
            <TextField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(v: string) => onFormChange({ ...formData, email: v })}
            />
            <Select
              label="Role"
              selectedKey={formData.role}
              onSelectionChange={(k) => onFormChange({ ...formData, role: k as string })}
            >
              <Select.Option id="Developer">Developer</Select.Option>
              <Select.Option id="Designer">Designer</Select.Option>
              <Select.Option id="Manager">Manager</Select.Option>
              <Select.Option id="QA">QA</Select.Option>
            </Select>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(v: string) => onFormChange({ ...formData, startDate: v })}
            />
            <TextArea
              label="Bio"
              value={formData.bio}
              onChange={(v: string) => onFormChange({ ...formData, bio: v })}
              rows={3}
            />
          </Stack>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" slot="close">Cancel</Button>
          <Button variant="primary" onPress={() => { onSubmit(); close(); }}>
            {title === 'Add Member' ? 'Add' : 'Save'}
          </Button>
        </Dialog.Actions>
      </>
    )}
  </Dialog>
);

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const DashboardPage = ({ memberCount }: { memberCount: number }) => (
  <Stack space={6}>
    <Headline level={1}>Team Overview</Headline>

    <Tiles space={4} tilesWidth="200px">
      <Card p={4}>
        <Stack space={1}>
          <Text color="muted-foreground" size="sm">Members</Text>
          <Text weight="bold" size="xlarge">
            <NumericFormat value={memberCount} />
          </Text>
        </Stack>
      </Card>
      <Card p={4}>
        <Stack space={1}>
          <Text color="muted-foreground" size="sm">Active Projects</Text>
          <Text weight="bold" size="xlarge">
            <NumericFormat value={5} />
          </Text>
        </Stack>
      </Card>
      <Card p={4}>
        <Stack space={1}>
          <Text color="muted-foreground" size="sm">Upcoming Deadlines</Text>
          <Text weight="bold" size="xlarge">
            <NumericFormat value={8} />
          </Text>
        </Stack>
      </Card>
      <Card p={4}>
        <Stack space={1}>
          <Inline space={2} alignY="center">
            <Text color="muted-foreground" size="sm">Hours This Week</Text>
            <Tooltip.Trigger>
              <Button variant="ghost" aria-label="Hours info">i</Button>
              <Tooltip>Aggregate of all team members.</Tooltip>
            </Tooltip.Trigger>
          </Inline>
          <Text weight="bold" size="xlarge">
            <NumericFormat value={342} />
          </Text>
        </Stack>
      </Card>
    </Tiles>

    <Stack space={2}>
      <Headline level={2}>Recent Activity</Headline>
      <Table aria-label="Recent Activity">
        <Table.Header>
          <Table.Column rowHeader>Member</Table.Column>
          <Table.Column>Action</Table.Column>
          <Table.Column>Project</Table.Column>
          <Table.Column>Date</Table.Column>
        </Table.Header>
        <Table.Body>
          {ACTIVITY_ROWS.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.member}</Table.Cell>
              <Table.Cell>
                <Badge variant={actionVariant(row.action)}>{row.action}</Badge>
              </Table.Cell>
              <Table.Cell>{row.project}</Table.Cell>
              <Table.Cell>
                <DateFormat value={row.date} year="numeric" month="long" day="numeric" />
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

// ─── Members Page ─────────────────────────────────────────────────────────────

interface MembersPageProps {
  members: Member[];
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
  onAdd: () => void;
  onEdit: (member: Member) => void;
  onRemove: (member: Member) => void;
  onViewDetail: (member: Member) => void;
}

const MembersPage = ({
  members,
  viewMode,
  onViewModeChange,
  onAdd,
  onEdit,
  onRemove,
  onViewDetail,
}: MembersPageProps) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Stack space={4}>
      <Headline level={1}>Team Members</Headline>

      <Inline space={3} alignY="center">
        <SearchField
          label="Search members"
          aria-label="Search members"
          value={search}
          onChange={setSearch}
        />
        <Select
          label="Filter by role"
          selectedKey={roleFilter}
          onSelectionChange={(k) => setRoleFilter(k as string)}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Inline space={1}>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onPress={() => onViewModeChange('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'secondary'}
            onPress={() => onViewModeChange('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Button variant="primary" onPress={onAdd}>Add Member</Button>
      </Inline>

      {viewMode === 'table' ? (
        <Table
          aria-label="Team Members"
          selectionMode="single"
          onSelectionChange={(keys) => {
            if (keys !== 'all' && (keys as Set<React.Key>).size > 0) {
              const key = [...(keys as Set<React.Key>)][0] as string;
              const member = members.find(m => m.id === key);
              if (member) onViewDetail(member);
            }
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
                <Table.Cell>
                  <Badge variant={roleVariant(m.role)}>{m.role}</Badge>
                </Table.Cell>
                <Table.Cell>{m.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={m.status === 'Active' ? 'success' : 'warning'}>
                    {m.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat value={m.joined} year="numeric" month="long" day="numeric" />
                </Table.Cell>
                <Table.Cell>
                  <Inline space={1}>
                    <Button size="small" variant="secondary" onPress={() => onEdit(m)}>Edit</Button>
                    <Button size="small" variant="secondary" onPress={() => onRemove(m)}>Remove</Button>
                  </Inline>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles space={4} tilesWidth="280px">
          {filtered.map(m => (
            <Card key={m.id} p={4}>
              <Stack space={3}>
                <Stack space={1}>
                  <Text weight="bold">{m.name}</Text>
                  <Badge variant={roleVariant(m.role)}>{m.role}</Badge>
                  <Text size="sm" color="muted-foreground">{m.email}</Text>
                </Stack>
                <Inline space={2}>
                  <Button size="small" onPress={() => onViewDetail(m)}>Profile</Button>
                  <Button size="small" variant="secondary">Message</Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}
    </Stack>
  );
};

// ─── Projects Page ────────────────────────────────────────────────────────────

interface ProjectsPageProps {
  projects: Project[];
  onArchive: (ids: string[]) => void;
}

const ProjectsPage = ({ projects, onArchive }: ProjectsPageProps) => {
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectionChange = (keys: 'all' | Set<React.Key>) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(filtered.map(p => p.id)));
    } else {
      setSelectedKeys(new Set([...(keys as Set<React.Key>)].map(String)));
    }
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Projects</Headline>

      <Inline space={3} alignY="center">
        <SearchField
          label="Search projects"
          aria-label="Search projects"
          value={search}
          onChange={setSearch}
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      {selectedKeys.size > 0 && (
        <Inline space={2} alignY="center">
          <Text size="sm">{selectedKeys.size} project(s) selected</Text>
          <Button
            variant="secondary"
            onPress={() => {
              onArchive([...selectedKeys]);
              setSelectedKeys(new Set());
            }}
          >
            Archive Selected
          </Button>
          <Button variant="secondary">Export</Button>
        </Inline>
      )}

      <Table
        aria-label="Projects"
        selectionMode="multiple"
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
                <DateFormat value={p.deadline} year="numeric" month="long" day="numeric" />
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

// ─── Calendar Page ────────────────────────────────────────────────────────────

const CalendarPage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const weeks = buildCalendarWeeks(year, month);
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const eventsThisMonth = CALENDAR_EVENTS.filter(
    e => e.date.getFullYear() === year && e.date.getMonth() === month
  );

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    return eventsThisMonth.filter(e => e.date.getDate() === date.getDate());
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>

      <Stack space={2}>
        <Text weight="bold">{monthName}</Text>
        <Columns columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
          {dayHeaders.map(d => (
            <Text key={d} weight="bold" size="sm">{d}</Text>
          ))}
        </Columns>
        {weeks.map((week, wi) => (
          <Columns key={wi} columns={[1, 1, 1, 1, 1, 1, 1]} space={1}>
            {week.map((day, di) => {
              const events = getEventsForDay(day);
              return (
                <Card key={di} p={1}>
                  <Stack space={0}>
                    {day ? (
                      <>
                        <Text size="sm">{day.getDate()}</Text>
                        {events.map(e => (
                          <Badge key={e.id} variant={eventTypeVariant(e.type)}>
                            {e.name.length > 8 ? e.name.slice(0, 8) + '…' : e.name}
                          </Badge>
                        ))}
                      </>
                    ) : (
                      <Text size="sm" color="muted-foreground">-</Text>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </Columns>
        ))}
      </Stack>

      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        {CALENDAR_EVENTS.map(e => (
          <Inline key={e.id} space={3} alignY="center">
            <Text size="sm" color="muted-foreground">
              <DateFormat value={e.date} month="short" day="numeric" />
            </Text>
            <Text weight="medium">{e.name}</Text>
            <Badge variant={eventTypeVariant(e.type)}>{e.type}</Badge>
          </Inline>
        ))}
      </Stack>
    </Stack>
  );
};

// ─── Files Page ───────────────────────────────────────────────────────────────

interface FilesPageProps {
  files: FileItem[];
  onDelete: (id: string) => void;
  onUpload: (newFiles: FileItem[]) => void;
}

const FilesPage = ({ files, onDelete, onUpload }: FilesPageProps) => {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Document');

  const filtered = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUpload = (close: () => void) => {
    const ext = uploadCategory === 'Image' ? 'png' : uploadCategory === 'Spreadsheet' ? 'xlsx' : 'pdf';
    const newFile: FileItem = {
      id: String(Date.now()),
      name: `Uploaded File.${ext}`,
      type: uploadCategory as FileItem['type'],
      size: 512000,
      uploadedBy: 'John Doe',
      date: new Date(),
    };
    onUpload([newFile]);
    setUploadDesc('');
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
    close();
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={3} alignY="center">
        <SearchField
          label="Search files"
          aria-label="Search files"
          value={search}
          onChange={setSearch}
        />
        <Select
          label="File type"
          selectedKey={typeFilter}
          onSelectionChange={(k) => setTypeFilter(k as string)}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Document">Documents</Select.Option>
          <Select.Option id="Image">Images</Select.Option>
          <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => setIsUploadOpen(true)}>Upload</Button>
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
              <Table.Cell>{formatFileSize(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={f.date} year="numeric" month="long" day="numeric" />
              </Table.Cell>
              <Table.Cell>
                <Menu
                  label="Actions"
                  variant="ghost"
                  onAction={(action) => {
                    if (action === 'delete') onDelete(f.id);
                  }}
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

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen} closeButton size="medium">
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <FileField label="Choose files" multiple />
                <TextField
                  label="Description"
                  value={uploadDesc}
                  onChange={setUploadDesc}
                />
                <Select
                  label="Category"
                  selectedKey={uploadCategory}
                  onSelectionChange={(k) => setUploadCategory(k as string)}
                >
                  <Select.Option id="Document">Document</Select.Option>
                  <Select.Option id="Image">Image</Select.Option>
                  <Select.Option id="Spreadsheet">Spreadsheet</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button variant="primary" onPress={() => handleUpload(close)}>Upload</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Stack>
  );
};

// ─── Settings Page ────────────────────────────────────────────────────────────

interface SettingsPageProps {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}

const SettingsPage = ({ teamName, onTeamNameChange }: SettingsPageProps) => {
  const { addToast } = useToast();
  const [localName, setLocalName] = useState(teamName);
  const [description, setDescription] = useState('A collaborative team workspace');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const [notifNewMember, setNotifNewMember] = useState(true);
  const [notifDeadline, setNotifDeadline] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifMention, setNotifMention] = useState(true);
  const [notifCalendar, setNotifCalendar] = useState(false);

  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', connected: true, description: 'Get team notifications in Slack channels.' },
    { id: 'github', name: 'GitHub', connected: false, description: 'Link commits and PRs to your projects.' },
    { id: 'jira', name: 'Jira', connected: false, description: 'Sync issues and sprints with Jira boards.' },
  ]);
  const [confirmDisconnectId, setConfirmDisconnectId] = useState<string | null>(null);

  const handleSaveGeneral = () => {
    onTeamNameChange(localName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false } : i));
    setConfirmDisconnectId(null);
    addToast({ title: 'Integration disconnected.', variant: 'info' });
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs aria-label="Settings">
        <Tabs.List aria-label="Settings tabs">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField label="Team Name" value={localName} onChange={setLocalName} />
            <TextArea label="Description" value={description} onChange={setDescription} rows={3} />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onSelectionChange={(k) => setTimezone(k as string)}
            >
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onSelectionChange={(k) => setDateFormat(k as string)}
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button variant="primary" onPress={handleSaveGeneral}>Save</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={1}>
              <Switch label="New member joins" selected={notifNewMember} onChange={setNotifNewMember} />
              <Text size="sm" color="muted-foreground">Get notified when someone joins the team</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Project deadline approaching" selected={notifDeadline} onChange={setNotifDeadline} />
              <Text size="sm" color="muted-foreground">Reminder 3 days before deadline</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Weekly digest" selected={notifWeekly} onChange={setNotifWeekly} />
              <Text size="sm" color="muted-foreground">Summary of team activity every Monday</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Mention notifications" selected={notifMention} onChange={setNotifMention} />
              <Text size="sm" color="muted-foreground">When someone mentions you in a comment</Text>
            </Stack>
            <Stack space={1}>
              <Switch label="Calendar reminders" selected={notifCalendar} onChange={setNotifCalendar} />
              <Text size="sm" color="muted-foreground">15 minutes before scheduled events</Text>
            </Stack>
            <Button variant="primary" onPress={() => addToast({ title: 'Preferences saved.', variant: 'success' })}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Stack space={4}>
            <Tiles space={4} tilesWidth="240px">
              {integrations.map(integration => (
                <Card key={integration.id} p={4}>
                  <Stack space={3}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">{integration.name}</Text>
                      <Badge variant={integration.connected ? 'success' : 'default'}>
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </Inline>
                    <Text size="sm" color="muted-foreground">{integration.description}</Text>
                    {integration.connected ? (
                      <Button variant="secondary" onPress={() => setConfirmDisconnectId(integration.id)}>
                        Disconnect
                      </Button>
                    ) : (
                      <Button variant="primary">Connect</Button>
                    )}
                  </Stack>
                </Card>
              ))}
            </Tiles>

            <Dialog
              open={!!confirmDisconnectId}
              onOpenChange={() => setConfirmDisconnectId(null)}
              closeButton
              size="small"
              aria-label="Confirm disconnect"
            >
              {({ close }) => (
                <>
                  <Dialog.Title>Disconnect Integration</Dialog.Title>
                  <Dialog.Content>
                    <Text>
                      Are you sure you want to disconnect{' '}
                      {integrations.find(i => i.id === confirmDisconnectId)?.name}?
                    </Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button variant="secondary" slot="close">Cancel</Button>
                    <Button
                      variant="destructive"
                      onPress={() => {
                        if (confirmDisconnectId) handleDisconnect(confirmDisconnectId);
                        close();
                      }}
                    >
                      Disconnect
                    </Button>
                  </Dialog.Actions>
                </>
              )}
            </Dialog>
          </Stack>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

const TeamHub = () => {
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [membersViewMode, setMembersViewMode] = useState<'table' | 'cards'>('table');
  const [teamName, setTeamName] = useState('TeamHub');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberForm, setMemberForm] = useState<MemberFormData>({
    name: '', email: '', role: 'Developer', startDate: '', bio: '',
  });

  const handleOpenAdd = () => {
    setMemberForm({ name: '', email: '', role: 'Developer', startDate: '', bio: '' });
    setIsAddMemberOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      startDate: member.joined.toISOString().split('T')[0],
      bio: member.bio,
    });
    setEditingMember(member);
  };

  const handleAddMember = () => {
    const newMember: Member = {
      id: String(Date.now()),
      name: memberForm.name,
      email: memberForm.email,
      role: memberForm.role as Member['role'],
      status: 'Active',
      joined: memberForm.startDate ? new Date(memberForm.startDate) : new Date(),
      bio: memberForm.bio,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleEditMember = () => {
    if (!editingMember) return;
    setMembers(prev =>
      prev.map(m =>
        m.id === editingMember.id
          ? { ...m, name: memberForm.name, email: memberForm.email, role: memberForm.role as Member['role'], bio: memberForm.bio }
          : m
      )
    );
    setEditingMember(null);
  };

  const handleRemoveMember = () => {
    if (!memberToRemove) return;
    setMembers(prev => prev.filter(m => m.id !== memberToRemove.id));
    setMemberToRemove(null);
  };

  const pageTitle = PAGE_TITLES[currentPage] ?? 'Dashboard';

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
              <TopNavigation.Middle aria-label="Page breadcrumb">
                <Breadcrumbs>
                  <Breadcrumbs.Item href="/dashboard">TeamHub</Breadcrumbs.Item>
                  <Breadcrumbs.Item href={currentPage}>{pageTitle}</Breadcrumbs.Item>
                </Breadcrumbs>
              </TopNavigation.Middle>
              <TopNavigation.End aria-label="User actions">
                <Inline space={2} alignY="center">
                  <Tooltip.Trigger>
                    <Menu
                      label="John Doe"
                      onAction={(action) => {
                        if (action === 'sign-out') alert('Signing out…');
                      }}
                    >
                      <Menu.Item id="profile">Profile</Menu.Item>
                      <Menu.Item id="preferences">Preferences</Menu.Item>
                      <Menu.Item id="sign-out" variant="destructive">Sign Out</Menu.Item>
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
                {currentPage === '/dashboard' && (
                  <DashboardPage memberCount={members.length} />
                )}
                {currentPage === '/members' && (
                  <MembersPage
                    members={members}
                    viewMode={membersViewMode}
                    onViewModeChange={setMembersViewMode}
                    onAdd={handleOpenAdd}
                    onEdit={handleOpenEdit}
                    onRemove={setMemberToRemove}
                    onViewDetail={setSelectedMember}
                  />
                )}
                {currentPage === '/projects' && (
                  <ProjectsPage
                    projects={projects}
                    onArchive={(ids) => setProjects(prev => prev.filter(p => !ids.includes(p.id)))}
                  />
                )}
                {currentPage === '/calendar' && <CalendarPage />}
                {currentPage === '/files' && (
                  <FilesPage
                    files={files}
                    onDelete={(id) => setFiles(prev => prev.filter(f => f.id !== id))}
                    onUpload={(newFiles) => setFiles(prev => [...prev, ...newFiles])}
                  />
                )}
                {currentPage === '/settings' && (
                  <SettingsPage
                    teamName={teamName}
                    onTeamNameChange={setTeamName}
                  />
                )}
              </Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>

      {/* Member Detail Dialog */}
      <Dialog
        open={!!selectedMember}
        onOpenChange={() => setSelectedMember(null)}
        closeButton
        size="medium"
        aria-label={selectedMember?.name ?? 'Member details'}
      >
        {selectedMember && (
          <>
            <Dialog.Title>{selectedMember.name}</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Text weight="medium">Role:</Text>
                  <Badge variant={roleVariant(selectedMember.role)}>{selectedMember.role}</Badge>
                </Inline>
                <Inline space={2}>
                  <Text weight="medium">Email:</Text>
                  <Text>{selectedMember.email}</Text>
                </Inline>
                <Inline space={2} alignY="center">
                  <Text weight="medium">Status:</Text>
                  <Badge variant={selectedMember.status === 'Active' ? 'success' : 'warning'}>
                    {selectedMember.status}
                  </Badge>
                </Inline>
                <Inline space={2}>
                  <Text weight="medium">Joined:</Text>
                  <DateFormat value={selectedMember.joined} year="numeric" month="long" day="numeric" />
                </Inline>
                <Stack space={1}>
                  <Text weight="medium">Bio:</Text>
                  <Text>{selectedMember.bio}</Text>
                </Stack>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Close</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Add Member Dialog */}
      <MemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        title="Add Member"
        formData={memberForm}
        onFormChange={setMemberForm}
        onSubmit={handleAddMember}
      />

      {/* Edit Member Dialog */}
      <MemberDialog
        open={!!editingMember}
        onOpenChange={(open) => { if (!open) setEditingMember(null); }}
        title="Edit Member"
        formData={memberForm}
        onFormChange={setMemberForm}
        onSubmit={handleEditMember}
      />

      {/* Remove Member Confirmation */}
      <Dialog
        open={!!memberToRemove}
        onOpenChange={() => setMemberToRemove(null)}
        closeButton
        size="small"
        aria-label="Remove member confirmation"
      >
        {({ close }) => (
          <>
            <Dialog.Title>Remove Member</Dialog.Title>
            <Dialog.Content>
              <Text>
                Are you sure you want to remove {memberToRemove?.name}? This action cannot be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button
                variant="destructive"
                onPress={() => { handleRemoveMember(); close(); }}
              >
                Remove
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TeamHub;
