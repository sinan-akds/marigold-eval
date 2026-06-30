import { useState } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  RouterProvider,
  Breadcrumbs,
  Menu,
  Tooltip,
  ContextualHelp,
  Headline,
  Text,
  Stack,
  Inline,
  Columns,
  Tiles,
  Divider,
  Inset,
  Scrollable,
  Card,
  Table,
  Badge,
  SectionMessage,
  Button,
  SearchField,
  Select,
  Switch,
  Dialog,
  Calendar,
  FileField,
  TextField,
  TextArea,
  DateField,
  NumericFormat,
  DateFormat,
  Tabs,
  ToastProvider,
  useToast,
} from '@marigold/components';
import {
  CalendarDate,
  getLocalTimeZone,
  type DateValue,
} from '@internationalized/date';

/* ------------------------------------------------------------------ */
/* Types & data                                                        */
/* ------------------------------------------------------------------ */

type MemberRole = 'Developer' | 'Designer' | 'Manager' | 'QA';
type MemberStatus = 'Active' | 'On Leave';

interface Member {
  id: string;
  name: string;
  role: MemberRole;
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

type FileCategory = 'Documents' | 'Images' | 'Spreadsheets';

interface FileItem {
  id: string;
  name: string;
  type: FileCategory;
  sizeMB: number;
  uploadedBy: string;
  date: Date;
}

type ActivityType = 'Commit' | 'Review' | 'Deploy';

interface Activity {
  id: string;
  member: string;
  action: ActivityType;
  project: string;
  date: Date;
}

type EventType = 'Meeting' | 'Deadline' | 'Social';

interface TeamEvent {
  id: string;
  date: Date;
  name: string;
  type: EventType;
}

const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.io',
    status: 'Active',
    joined: new Date(2024, 2, 12),
    bio: 'Front-end engineer focused on design systems and accessibility.',
  },
  {
    id: 'm2',
    name: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.io',
    status: 'On Leave',
    joined: new Date(2023, 10, 5),
    bio: 'Product designer with a passion for clean, usable interfaces.',
  },
  {
    id: 'm3',
    name: 'Carla Reyes',
    role: 'Manager',
    email: 'carla@teamhub.io',
    status: 'Active',
    joined: new Date(2022, 6, 21),
    bio: 'Engineering manager keeping projects on track and people happy.',
  },
  {
    id: 'm4',
    name: 'David Kim',
    role: 'Developer',
    email: 'david@teamhub.io',
    status: 'Active',
    joined: new Date(2024, 0, 30),
    bio: 'Back-end developer who loves scalable APIs and tidy databases.',
  },
  {
    id: 'm5',
    name: 'Emma Brown',
    role: 'Designer',
    email: 'emma@teamhub.io',
    status: 'Active',
    joined: new Date(2023, 4, 18),
    bio: 'Brand and visual designer crafting memorable experiences.',
  },
  {
    id: 'm6',
    name: 'Frank Müller',
    role: 'Manager',
    email: 'frank@teamhub.io',
    status: 'On Leave',
    joined: new Date(2021, 8, 2),
    bio: 'Delivery lead coordinating cross-functional teams.',
  },
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    lead: 'Carla Reyes',
    members: 6,
    deadline: new Date(2026, 6, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Mobile App',
    lead: 'David Kim',
    members: 4,
    deadline: new Date(2026, 7, 1),
    progress: 40,
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'API Migration',
    lead: 'Alice Johnson',
    members: 3,
    deadline: new Date(2026, 5, 30),
    progress: 90,
    status: 'On Hold',
  },
  {
    id: 'p4',
    name: 'Data Pipeline',
    lead: 'Bob Smith',
    members: 5,
    deadline: new Date(2026, 8, 10),
    progress: 100,
    status: 'Completed',
  },
  {
    id: 'p5',
    name: 'Brand Refresh',
    lead: 'Emma Brown',
    members: 2,
    deadline: new Date(2026, 6, 28),
    progress: 20,
    status: 'Active',
  },
];

const initialFiles: FileItem[] = [
  {
    id: 'f1',
    name: 'Q2 Report.pdf',
    type: 'Documents',
    sizeMB: 2.4,
    uploadedBy: 'Carla Reyes',
    date: new Date(2026, 4, 20),
  },
  {
    id: 'f2',
    name: 'Logo.png',
    type: 'Images',
    sizeMB: 0.8,
    uploadedBy: 'Emma Brown',
    date: new Date(2026, 5, 1),
  },
  {
    id: 'f3',
    name: 'Budget.xlsx',
    type: 'Spreadsheets',
    sizeMB: 1.2,
    uploadedBy: 'Frank Müller',
    date: new Date(2026, 5, 10),
  },
  {
    id: 'f4',
    name: 'Roadmap.pdf',
    type: 'Documents',
    sizeMB: 3.1,
    uploadedBy: 'David Kim',
    date: new Date(2026, 5, 15),
  },
  {
    id: 'f5',
    name: 'Team Photo.jpg',
    type: 'Images',
    sizeMB: 5.6,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 5, 18),
  },
];

const activity: Activity[] = [
  {
    id: 'a1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'API Migration',
    date: new Date(2026, 4, 28),
  },
  {
    id: 'a2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Website Redesign',
    date: new Date(2026, 4, 27),
  },
  {
    id: 'a3',
    member: 'Carla Reyes',
    action: 'Deploy',
    project: 'Mobile App',
    date: new Date(2026, 4, 26),
  },
  {
    id: 'a4',
    member: 'David Kim',
    action: 'Commit',
    project: 'Data Pipeline',
    date: new Date(2026, 4, 25),
  },
  {
    id: 'a5',
    member: 'Emma Brown',
    action: 'Review',
    project: 'Brand Refresh',
    date: new Date(2026, 4, 24),
  },
];

const events: TeamEvent[] = [
  { id: 'e1', date: new Date(2026, 6, 2), name: 'Sprint Planning', type: 'Meeting' },
  { id: 'e2', date: new Date(2026, 6, 15), name: 'Website Launch', type: 'Deadline' },
  { id: 'e3', date: new Date(2026, 6, 20), name: 'Team Lunch', type: 'Social' },
  { id: 'e4', date: new Date(2026, 6, 25), name: 'Quarterly Review', type: 'Meeting' },
];

/* ------------------------------------------------------------------ */
/* Indicator helpers                                                   */
/* ------------------------------------------------------------------ */

const statusVariant = (s: MemberStatus) =>
  s === 'Active' ? 'success' : 'warning';

const activityVariant = (a: ActivityType) =>
  a === 'Commit' ? 'info' : a === 'Review' ? 'warning' : 'success';

const projectVariant = (s: ProjectStatus) =>
  s === 'Active' ? 'info' : s === 'On Hold' ? 'warning' : 'success';

const eventVariant = (t: EventType) =>
  t === 'Meeting' ? 'info' : t === 'Deadline' ? 'warning' : 'success';

const dateToCalendar = (d: Date) =>
  new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/projects': 'Projects',
  '/calendar': 'Calendar',
  '/files': 'Files',
  '/settings': 'Settings',
};

const ROLE_OPTIONS: MemberRole[] = ['Developer', 'Designer', 'Manager', 'QA'];

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

const TeamHub = () => {
  const { addToast } = useToast();

  // Shell
  const [page, setPage] = useState('/dashboard');
  const [teamName, setTeamName] = useState('TeamHub');

  // Members
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Member dialog
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fRole, setFRole] = useState<MemberRole>('Developer');
  const [fStart, setFStart] = useState<DateValue | null>(null);
  const [fBio, setFBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Projects
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [npName, setNpName] = useState('');
  const [npLead, setNpLead] = useState('');

  // Files
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [fileSearch, setFileSearch] = useState('');
  const [fileType, setFileType] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadCategory, setUploadCategory] = useState<FileCategory>(
    'Documents'
  );

  // Settings
  const [settingsTeamName, setSettingsTeamName] = useState('TeamHub');
  const [settingsDesc, setSettingsDesc] = useState(
    'A place where our team plans, builds and ships together.'
  );
  const [timezone, setTimezone] = useState('CET');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifications, setNotifications] = useState({
    joins: true,
    deadline: true,
    digest: false,
    mention: true,
    reminders: false,
  });
  const [integrations, setIntegrations] = useState({
    slack: true,
    github: false,
    jira: false,
  });

  // Confirmation dialog
  const [confirm, setConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  /* ----- member helpers ----- */

  const openAddMember = () => {
    setEditingId(null);
    setFName('');
    setFEmail('');
    setFRole('Developer');
    setFStart(null);
    setFBio('');
    setSubmitted(false);
    setMemberDialogOpen(true);
  };

  const openEditMember = (m: Member) => {
    setEditingId(m.id);
    setFName(m.name);
    setFEmail(m.email);
    setFRole(m.role);
    setFStart(dateToCalendar(m.joined));
    setFBio(m.bio);
    setSubmitted(false);
    setMemberDialogOpen(true);
  };

  const saveMember = () => {
    setSubmitted(true);
    if (!fName.trim() || !fEmail.trim()) {
      return;
    }
    const joined = fStart
      ? fStart.toDate(getLocalTimeZone())
      : new Date();

    if (editingId) {
      setMembers(prev =>
        prev.map(m =>
          m.id === editingId
            ? { ...m, name: fName, email: fEmail, role: fRole, joined, bio: fBio }
            : m
        )
      );
      setSelectedMember(prev =>
        prev && prev.id === editingId
          ? { ...prev, name: fName, email: fEmail, role: fRole, joined, bio: fBio }
          : prev
      );
    } else {
      setMembers(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: fName,
          email: fEmail,
          role: fRole,
          status: 'Active',
          joined,
          bio: fBio,
        },
      ]);
    }
    setMemberDialogOpen(false);
  };

  const removeMember = (m: Member) => {
    setConfirm({
      title: 'Remove member',
      message: `Are you sure you want to remove ${m.name}? This action cannot be undone.`,
      onConfirm: () => {
        setMembers(prev => prev.filter(x => x.id !== m.id));
        setSelectedMember(prev => (prev && prev.id === m.id ? null : prev));
        setConfirm(null);
      },
    });
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(memberSearch.trim().toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  /* ----- project helpers ----- */

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.trim().toLowerCase())
  );

  const archiveSelected = () => {
    setProjects(prev => prev.filter(p => !selectedProjects.has(p.id)));
    setSelectedProjects(new Set());
  };

  const addProject = () => {
    if (!npName.trim()) return;
    setProjects(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: npName,
        lead: npLead || 'Unassigned',
        members: 1,
        deadline: new Date(),
        progress: 0,
        status: 'Active',
      },
    ]);
    setNpName('');
    setNpLead('');
    setNewProjectOpen(false);
  };

  /* ----- file helpers ----- */

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name
      .toLowerCase()
      .includes(fileSearch.trim().toLowerCase());
    const matchesType = fileType === 'all' || f.type === fileType;
    return matchesSearch && matchesType;
  });

  const doUpload = () => {
    setFiles(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: 'New Upload.pdf',
        type: uploadCategory,
        sizeMB: 1.0,
        uploadedBy: 'John Doe',
        date: new Date(),
      },
    ]);
    setUploadDesc('');
    setUploadCategory('Documents');
    setUploadOpen(false);
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  /* ---------------------------------------------------------------- */
  /* Page renderers                                                    */
  /* ---------------------------------------------------------------- */

  const renderDashboard = () => (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Columns columns={[1, 1, 1, 1]} space={4} collapseAt="60em">
        <Card p="square-regular">
          <Stack space={1}>
            <Text color="text-secondary">Members</Text>
            <Headline level={2}>{members.length}</Headline>
          </Stack>
        </Card>
        <Card p="square-regular">
          <Stack space={1}>
            <Text color="text-secondary">Active Projects</Text>
            <Headline level={2}>5</Headline>
          </Stack>
        </Card>
        <Card p="square-regular">
          <Stack space={1}>
            <Text color="text-secondary">Upcoming Deadlines</Text>
            <Headline level={2}>8</Headline>
          </Stack>
        </Card>
        <Card p="square-regular">
          <Stack space={1}>
            <Inline space={1} alignY="center">
              <Text color="text-secondary">Hours This Week</Text>
              <Tooltip.Trigger>
                <Button variant="ghost" aria-label="About hours this week">
                  ?
                </Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </Tooltip.Trigger>
            </Inline>
            <Headline level={2}>
              <NumericFormat value={342} />
            </Headline>
          </Stack>
        </Card>
      </Columns>

      <Stack space={3}>
        <Headline level={3}>Recent Activity</Headline>
        <Scrollable>
          <Table aria-label="Recent activity">
            <Table.Header>
              <Table.Column rowHeader>Member</Table.Column>
              <Table.Column>Action</Table.Column>
              <Table.Column>Project</Table.Column>
              <Table.Column>Date</Table.Column>
            </Table.Header>
            <Table.Body>
              {activity.map(a => (
                <Table.Row key={a.id}>
                  <Table.Cell>{a.member}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={activityVariant(a.action)}>{a.action}</Badge>
                  </Table.Cell>
                  <Table.Cell>{a.project}</Table.Cell>
                  <Table.Cell>
                    <DateFormat value={a.date} dateStyle="medium" />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Scrollable>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint 14</SectionMessage.Title>
        <SectionMessage.Content>
          Sprint 14 ends in 3 days. Review the project board for outstanding
          tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  const memberDetail = selectedMember && (
    <Card p="square-relaxed">
      <Stack space={3}>
        <Inline space={3} alignX="between" alignY="center">
          <Headline level={3}>{selectedMember.name}</Headline>
          <Button
            variant="ghost"
            size="small"
            onPress={() => setSelectedMember(null)}
          >
            Close
          </Button>
        </Inline>
        <Badge variant="info">{selectedMember.role}</Badge>
        <Divider />
        <Stack space={2}>
          <Stack space={0}>
            <Text color="text-secondary" fontSize="xs">
              Email
            </Text>
            <Text>{selectedMember.email}</Text>
          </Stack>
          <Stack space={0}>
            <Text color="text-secondary" fontSize="xs">
              Status
            </Text>
            <Badge variant={statusVariant(selectedMember.status)}>
              {selectedMember.status}
            </Badge>
          </Stack>
          <Stack space={0}>
            <Text color="text-secondary" fontSize="xs">
              Joined
            </Text>
            <Text>
              <DateFormat value={selectedMember.joined} dateStyle="long" />
            </Text>
          </Stack>
          <Stack space={0}>
            <Text color="text-secondary" fontSize="xs">
              Bio
            </Text>
            <Text>{selectedMember.bio}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const membersTable = (
    <Scrollable>
      <Table aria-label="Team members">
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
            <Table.Row key={m.id}>
              <Table.Cell>
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => setSelectedMember(m)}
                >
                  {m.name}
                </Button>
              </Table.Cell>
              <Table.Cell>{m.role}</Table.Cell>
              <Table.Cell>{m.email}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant(m.status)}>{m.status}</Badge>
              </Table.Cell>
              <Table.Cell>
                <DateFormat value={m.joined} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <Menu
                  label="Actions"
                  onAction={key => {
                    if (key === 'edit') openEditMember(m);
                    if (key === 'remove') removeMember(m);
                  }}
                >
                  <Menu.Item id="edit">Edit</Menu.Item>
                  <Menu.Item id="remove" variant="destructive">
                    Remove
                  </Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Scrollable>
  );

  const membersCards = (
    <Tiles tilesWidth="260px" space={4} stretch>
      {filteredMembers.map(m => (
        <Card key={m.id} p="square-regular">
          <Stack space={3}>
            <Stack space={1} alignX="left">
              <Headline level={4}>{m.name}</Headline>
              <Badge variant="info">{m.role}</Badge>
              <Text color="text-secondary" fontSize="sm">
                {m.email}
              </Text>
            </Stack>
            <Inline space={2}>
              <Button
                variant="secondary"
                size="small"
                onPress={() =>
                  addToast({
                    title: `Message sent to ${m.name}`,
                    variant: 'info',
                  })
                }
              >
                Message
              </Button>
              <Button
                variant="primary"
                size="small"
                onPress={() => setSelectedMember(m)}
              >
                Profile
              </Button>
            </Inline>
          </Stack>
        </Card>
      ))}
    </Tiles>
  );

  const membersBody = (
    <Stack space={5}>
      <Headline level={1}>Team Members</Headline>
      <Inline space={3} alignY="bottom">
        <SearchField
          aria-label="Search members"
          placeholder="Search by name"
          value={memberSearch}
          onChange={setMemberSearch}
        />
        <Select
          aria-label="Filter by role"
          selectedKey={roleFilter}
          onChange={key => setRoleFilter(String(key))}
          width="fit"
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
        </Select>
        <Select
          aria-label="View mode"
          selectedKey={viewMode}
          onChange={key => setViewMode(String(key))}
          width="fit"
        >
          <Select.Option id="table">Table view</Select.Option>
          <Select.Option id="cards">Card view</Select.Option>
        </Select>
        <Button variant="primary" onPress={openAddMember}>
          Add Member
        </Button>
      </Inline>
      {viewMode === 'table' ? membersTable : membersCards}
    </Stack>
  );

  const renderMembers = () =>
    selectedMember ? (
      <Columns columns={[2, 1]} space={6} collapseAt="60em">
        {membersBody}
        {memberDetail}
      </Columns>
    ) : (
      membersBody
    );

  const selectionToKeys = (
    keys: 'all' | Set<React.Key>
  ): Set<string> => {
    if (keys === 'all') {
      return new Set(filteredProjects.map(p => p.id));
    }
    return new Set(Array.from(keys).map(String));
  };

  const renderProjects = () => (
    <Stack space={5}>
      <Headline level={1}>Projects</Headline>
      <Inline space={3} alignY="bottom" alignX="between">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects"
          value={projectSearch}
          onChange={setProjectSearch}
        />
        <Button variant="primary" onPress={() => setNewProjectOpen(true)}>
          New Project
        </Button>
      </Inline>

      {selectedProjects.size > 0 && (
        <Card p="square-snug">
          <Inline space={3} alignY="center">
            <Text weight="medium">{selectedProjects.size} selected</Text>
            <Button variant="secondary" size="small" onPress={archiveSelected}>
              Archive Selected
            </Button>
            <Button
              variant="secondary"
              size="small"
              onPress={() =>
                addToast({ title: 'Projects exported', variant: 'success' })
              }
            >
              Export
            </Button>
          </Inline>
        </Card>
      )}

      <Scrollable>
        <Table
          aria-label="Projects"
          selectionMode="multiple"
          selectedKeys={selectedProjects}
          onSelectionChange={keys =>
            setSelectedProjects(selectionToKeys(keys as 'all' | Set<React.Key>))
          }
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
                  <Badge variant={projectVariant(p.status)}>{p.status}</Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Scrollable>
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Scrollable>
        <Calendar aria-label="Team calendar" />
      </Scrollable>
      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Stack space={2}>
          {events.map(ev => (
            <Card key={ev.id} p="square-snug">
              <Inline space={3} alignY="center">
                <Text weight="medium">
                  <DateFormat value={ev.date} dateStyle="medium" />
                </Text>
                <Text>{ev.name}</Text>
                <Badge variant={eventVariant(ev.type)}>{ev.type}</Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderFiles = () => (
    <Stack space={5}>
      <Headline level={1}>Shared Files</Headline>
      <Inline space={3} alignY="bottom">
        <SearchField
          aria-label="Search files"
          placeholder="Search files"
          value={fileSearch}
          onChange={setFileSearch}
        />
        <Select
          aria-label="Filter by file type"
          selectedKey={fileType}
          onChange={key => setFileType(String(key))}
          width="fit"
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

      <Scrollable>
        <Table aria-label="Shared files">
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
                <Table.Cell>
                  <NumericFormat
                    value={f.sizeMB}
                    minimumFractionDigits={1}
                    maximumFractionDigits={1}
                  />{' '}
                  MB
                </Table.Cell>
                <Table.Cell>{f.uploadedBy}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={f.date} dateStyle="medium" />
                </Table.Cell>
                <Table.Cell>
                  <Menu
                    label="Actions"
                    onAction={key =>
                      addToast({
                        title: `${String(key)} – ${f.name}`,
                        variant: 'info',
                      })
                    }
                  >
                    <Menu.Item id="download">Download</Menu.Item>
                    <Menu.Item id="rename">Rename</Menu.Item>
                    <Menu.Item id="delete" variant="destructive">
                      Delete
                    </Menu.Item>
                  </Menu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Scrollable>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space={5}>
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
              value={settingsTeamName}
              onChange={setSettingsTeamName}
              width="fit"
            />
            <TextArea
              label="Description"
              value={settingsDesc}
              onChange={setSettingsDesc}
              rows={3}
            />
            <Select
              label="Default Timezone"
              selectedKey={timezone}
              onChange={key => setTimezone(String(key))}
              width="fit"
            >
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onChange={key => setDateFormat(String(key))}
              width="fit"
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button
              variant="primary"
              onPress={() => {
                setTeamName(settingsTeamName);
                addToast({ title: 'Settings updated.', variant: 'success' });
              }}
            >
              Save
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={0}>
              <Switch
                label="New member joins"
                selected={notifications.joins}
                onChange={v => setNotifications(n => ({ ...n, joins: v }))}
              />
              <Text color="text-secondary" fontSize="sm">
                Get notified when someone joins the team
              </Text>
            </Stack>
            <Stack space={0}>
              <Switch
                label="Project deadline approaching"
                selected={notifications.deadline}
                onChange={v => setNotifications(n => ({ ...n, deadline: v }))}
              />
              <Text color="text-secondary" fontSize="sm">
                Reminder 3 days before deadline
              </Text>
            </Stack>
            <Stack space={0}>
              <Switch
                label="Weekly digest"
                selected={notifications.digest}
                onChange={v => setNotifications(n => ({ ...n, digest: v }))}
              />
              <Text color="text-secondary" fontSize="sm">
                Summary of team activity every Monday
              </Text>
            </Stack>
            <Stack space={0}>
              <Switch
                label="Mention notifications"
                selected={notifications.mention}
                onChange={v => setNotifications(n => ({ ...n, mention: v }))}
              />
              <Text color="text-secondary" fontSize="sm">
                When someone mentions you in a comment
              </Text>
            </Stack>
            <Stack space={0}>
              <Switch
                label="Calendar reminders"
                selected={notifications.reminders}
                onChange={v => setNotifications(n => ({ ...n, reminders: v }))}
              />
              <Text color="text-secondary" fontSize="sm">
                15 minutes before scheduled events
              </Text>
            </Stack>
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
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Columns columns={[1, 1, 1]} space={4} collapseAt="60em">
            <IntegrationCard
              name="Slack"
              connected={integrations.slack}
              description="Send team notifications to your Slack channels."
              onToggle={() => {
                if (integrations.slack) {
                  setConfirm({
                    title: 'Disconnect Slack',
                    message:
                      'Are you sure you want to disconnect Slack? Notifications will stop.',
                    onConfirm: () => {
                      setIntegrations(i => ({ ...i, slack: false }));
                      setConfirm(null);
                    },
                  });
                } else {
                  setIntegrations(i => ({ ...i, slack: true }));
                }
              }}
            />
            <IntegrationCard
              name="GitHub"
              connected={integrations.github}
              description="Link commits and pull requests to your projects."
              onToggle={() => {
                if (integrations.github) {
                  setConfirm({
                    title: 'Disconnect GitHub',
                    message:
                      'Are you sure you want to disconnect GitHub?',
                    onConfirm: () => {
                      setIntegrations(i => ({ ...i, github: false }));
                      setConfirm(null);
                    },
                  });
                } else {
                  setIntegrations(i => ({ ...i, github: true }));
                }
              }}
            />
            <IntegrationCard
              name="Jira"
              connected={integrations.jira}
              description="Sync issues and sprints with your team board."
              onToggle={() => {
                if (integrations.jira) {
                  setConfirm({
                    title: 'Disconnect Jira',
                    message: 'Are you sure you want to disconnect Jira?',
                    onConfirm: () => {
                      setIntegrations(i => ({ ...i, jira: false }));
                      setConfirm(null);
                    },
                  });
                } else {
                  setIntegrations(i => ({ ...i, jira: true }));
                }
              }}
            />
          </Columns>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const renderPage = () => {
    switch (page) {
      case '/members':
        return renderMembers();
      case '/projects':
        return renderProjects();
      case '/calendar':
        return renderCalendar();
      case '/files':
        return renderFiles();
      case '/settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  /* ---------------------------------------------------------------- */

  return (
    <RouterProvider navigate={setPage}>
      <ToastProvider position="bottom-right" />
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" fontSize="lg">
                {teamName}
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav current={page}>
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
                <Breadcrumbs.Item href="/dashboard">
                  {teamName}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item href={page}>
                  {PAGE_TITLES[page] ?? 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={key =>
                      addToast({
                        title: `${String(key)} selected`,
                        variant: 'info',
                      })
                    }
                  >
                    <Menu.Item id="profile">Profile</Menu.Item>
                    <Menu.Item id="preferences">Preferences</Menu.Item>
                    <Menu.Item id="signout">Sign Out</Menu.Item>
                  </Menu>
                  <Tooltip>Account settings</Tooltip>
                </Tooltip.Trigger>
                <ContextualHelp>
                  <ContextualHelp.Title>Navigation</ContextualHelp.Title>
                  <ContextualHelp.Content>
                    Use the sidebar to navigate between sections.
                  </ContextualHelp.Content>
                </ContextualHelp>
              </Inline>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space="square-relaxed">{renderPage()}</Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>

      {/* Add / Edit member dialog */}
      <Dialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        size="small"
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>
              {editingId ? 'Edit Member' : 'Add Member'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  required
                  value={fName}
                  onChange={setFName}
                  error={submitted && !fName.trim()}
                  errorMessage="Full name is required."
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={fEmail}
                  onChange={setFEmail}
                  error={submitted && !fEmail.trim()}
                  errorMessage="Email is required."
                />
                <Select
                  label="Role"
                  selectedKey={fRole}
                  onChange={key => setFRole(String(key) as MemberRole)}
                >
                  {ROLE_OPTIONS.map(r => (
                    <Select.Option key={r} id={r}>
                      {r}
                    </Select.Option>
                  ))}
                </Select>
                <DateField
                  label="Start Date"
                  value={fStart}
                  onChange={setFStart}
                />
                <TextArea
                  label="Bio"
                  value={fBio}
                  onChange={setFBio}
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" onPress={saveMember}>
                {editingId ? 'Save' : 'Add'}
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* New project dialog */}
      <Dialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        size="small"
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>New Project</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <TextField
                  label="Project Name"
                  required
                  value={npName}
                  onChange={setNpName}
                />
                <TextField label="Lead" value={npLead} onChange={setNpLead} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" onPress={addProject}>
                Create
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Upload dialog */}
      <Dialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        size="small"
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
                <FileField label="Files" multiple />
                <TextField
                  label="Description"
                  value={uploadDesc}
                  onChange={setUploadDesc}
                />
                <Select
                  label="Category"
                  selectedKey={uploadCategory}
                  onChange={key =>
                    setUploadCategory(String(key) as FileCategory)
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
              <Button variant="primary" onPress={doUpload}>
                Upload
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog
        open={confirm !== null}
        onOpenChange={open => {
          if (!open) setConfirm(null);
        }}
        role="alertdialog"
        size="xsmall"
      >
        <Dialog.Title>{confirm?.title}</Dialog.Title>
        <Dialog.Content>
          <Text>{confirm?.message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onPress={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onPress={() => confirm?.onConfirm()}>
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </RouterProvider>
  );
};

interface IntegrationCardProps {
  name: string;
  connected: boolean;
  description: string;
  onToggle: () => void;
}

const IntegrationCard = ({
  name,
  connected,
  description,
  onToggle,
}: IntegrationCardProps) => (
  <Card p="square-regular">
    <Stack space={3}>
      <Inline space={2} alignY="center" alignX="between">
        <Headline level={4}>{name}</Headline>
        <Badge variant={connected ? 'success' : 'default'}>
          {connected ? 'Connected' : 'Not connected'}
        </Badge>
      </Inline>
      <Text color="text-secondary" fontSize="sm">
        {description}
      </Text>
      <Button
        variant={connected ? 'secondary' : 'primary'}
        size="small"
        onPress={onToggle}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </Stack>
  </Card>
);

const TestApp = () => <TeamHub />;

export default TestApp;
