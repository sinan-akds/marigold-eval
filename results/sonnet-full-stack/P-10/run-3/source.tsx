import React, { useState, useMemo } from 'react';
import {
  ActionBar,
  ActionMenu,
  AppLayout,
  Badge,
  Breadcrumbs,
  Button,
  Calendar,
  Card,
  ConfirmationProvider,
  ContextualHelp,
  DatePicker,
  Dialog,
  FileField,
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
  TextArea,
  TextField,
  Tiles,
  ToastProvider,
  ToggleButton,
  Tooltip,
  TopNavigation,
  useConfirmation,
  useToast,
} from '@marigold/components';

// --- Types ---

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joined: string;
  bio?: string;
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
  type: 'Documents' | 'Images' | 'Spreadsheets';
  size: number;
  uploadedBy: string;
  date: string;
}

// --- Initial Data ---

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: '2023-01-15', bio: 'Full-stack developer with 5 years of experience building scalable web apps.' },
  { id: '2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.io', status: 'Active', joined: '2023-03-20', bio: 'UI/UX designer passionate about intuitive user experiences.' },
  { id: '3', name: 'Carol White', role: 'Manager', email: 'carol@teamhub.io', status: 'Active', joined: '2022-11-08', bio: 'Project manager with 10 years of experience in agile teams.' },
  { id: '4', name: 'David Brown', role: 'Developer', email: 'david@teamhub.io', status: 'On Leave', joined: '2023-06-01', bio: 'Backend developer specializing in APIs and microservices.' },
  { id: '5', name: 'Eve Davis', role: 'QA', email: 'eve@teamhub.io', status: 'Active', joined: '2024-01-10', bio: 'QA engineer focused on test automation and quality processes.' },
  { id: '6', name: 'Frank Miller', role: 'Designer', email: 'frank@teamhub.io', status: 'Active', joined: '2023-09-15', bio: 'Graphic designer with expertise in brand identity and visual systems.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: '2026-08-15', progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App v2', lead: 'Carol White', members: 6, deadline: '2026-09-30', progress: 40, status: 'Active' },
  { id: '3', name: 'API Migration', lead: 'David Brown', members: 3, deadline: '2026-07-20', progress: 55, status: 'On Hold' },
  { id: '4', name: 'Design System', lead: 'Bob Smith', members: 5, deadline: '2026-10-01', progress: 60, status: 'Active' },
  { id: '5', name: 'Analytics Dashboard', lead: 'Frank Miller', members: 2, deadline: '2026-06-30', progress: 100, status: 'Completed' },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Q2 Report.pdf', type: 'Documents', size: 2.4 * 1024 * 1024, uploadedBy: 'Carol White', date: '2026-06-15' },
  { id: '2', name: 'Brand Guidelines.pdf', type: 'Documents', size: 5.1 * 1024 * 1024, uploadedBy: 'Bob Smith', date: '2026-06-10' },
  { id: '3', name: 'Team Photo.jpg', type: 'Images', size: 3.8 * 1024 * 1024, uploadedBy: 'Frank Miller', date: '2026-06-05' },
  { id: '4', name: 'Budget 2026.xlsx', type: 'Spreadsheets', size: 1.2 * 1024 * 1024, uploadedBy: 'Carol White', date: '2026-05-28' },
  { id: '5', name: 'Sprint Planning.xlsx', type: 'Spreadsheets', size: 0.8 * 1024 * 1024, uploadedBy: 'Alice Johnson', date: '2026-05-20' },
];

const RECENT_ACTIVITY = [
  { id: '1', member: 'Alice Johnson', action: 'Commit', project: 'Website Redesign', date: '2026-05-28' },
  { id: '2', member: 'Bob Smith', action: 'Review', project: 'Design System', date: '2026-06-01' },
  { id: '3', member: 'Carol White', action: 'Deploy', project: 'Mobile App v2', date: '2026-06-10' },
  { id: '4', member: 'David Brown', action: 'Commit', project: 'API Migration', date: '2026-06-15' },
  { id: '5', member: 'Eve Davis', action: 'Review', project: 'Website Redesign', date: '2026-06-20' },
];

const CALENDAR_EVENTS = [
  { id: '1', date: '2026-06-28', name: 'Sprint Review', type: 'Meeting' as const },
  { id: '2', date: '2026-06-30', name: 'Q2 Deliverable', type: 'Deadline' as const },
  { id: '3', date: '2026-07-04', name: 'Team BBQ', type: 'Social' as const },
  { id: '4', date: '2026-07-10', name: 'Product Demo', type: 'Meeting' as const },
];

// --- Helpers ---

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const actionVariant = (action: string): 'info' | 'warning' | 'success' => {
  if (action === 'Commit') return 'info';
  if (action === 'Review') return 'warning';
  return 'success';
};

const eventVariant = (type: string): 'info' | 'error' | 'success' => {
  if (type === 'Meeting') return 'info';
  if (type === 'Deadline') return 'error';
  return 'success';
};

const projectStatusVariant = (status: string): 'success' | 'warning' | 'info' => {
  if (status === 'Active') return 'success';
  if (status === 'On Hold') return 'warning';
  return 'info';
};

let nextId = 100;
const genId = () => String(++nextId);

// --- Member Form Dialog ---

interface MemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Member | null;
  onSubmit: (data: Omit<Member, 'id'>) => void;
}

const MemberFormDialog = ({ open, onOpenChange, initial, onSubmit }: MemberFormProps) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState(initial?.role ?? 'Developer');
  const [startDate, setStartDate] = useState(initial?.joined ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');

  React.useEffect(() => {
    setName(initial?.name ?? '');
    setEmail(initial?.email ?? '');
    setRole(initial?.role ?? 'Developer');
    setStartDate(initial?.joined ?? '');
    setBio(initial?.bio ?? '');
  }, [initial, open]);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
      status: initial?.status ?? 'Active',
      joined: startDate || new Date().toISOString().split('T')[0],
      bio: bio.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="small" closeButton>
      <Dialog.Title>{initial ? 'Edit Member' : 'Add Member'}</Dialog.Title>
      <Dialog.Content>
        <Stack space={3}>
          <TextField
            label="Full Name"
            required
            value={name}
            onChange={setName}
            placeholder="Enter full name"
          />
          <TextField
            label="Email"
            required
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter email address"
          />
          <Select
            label="Role"
            selectedKey={role}
            onChange={(key) => setRole(key as string)}
          >
            <Select.Option id="Developer">Developer</Select.Option>
            <Select.Option id="Designer">Designer</Select.Option>
            <Select.Option id="Manager">Manager</Select.Option>
            <Select.Option id="QA">QA</Select.Option>
          </Select>
          <DatePicker
            label="Start Date"
            onChange={(date) => {
              if (date) {
                const d = date as { year: number; month: number; day: number };
                setStartDate(
                  `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
                );
              }
            }}
          />
          <TextArea
            label="Bio"
            value={bio}
            onChange={setBio}
            placeholder="Short bio..."
          />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="secondary" onPress={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="primary" onPress={handleSubmit}>
          {initial ? 'Save Changes' : 'Add'}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

// --- File Upload Dialog ---

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: FileItem[]) => void;
}

const FileUploadDialog = ({ open, onOpenChange, onUpload }: FileUploadDialogProps) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Documents');
  const { addToast } = useToast();

  const handleUpload = () => {
    const newFile: FileItem = {
      id: genId(),
      name: 'Uploaded File.pdf',
      type: category as FileItem['type'],
      size: 1.5 * 1024 * 1024,
      uploadedBy: 'John Doe',
      date: new Date().toISOString().split('T')[0],
    };
    onUpload([newFile]);
    onOpenChange(false);
    setDescription('');
    setCategory('Documents');
    addToast({ title: 'Files uploaded successfully.', variant: 'success' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} size="small" closeButton>
      <Dialog.Title>Upload Files</Dialog.Title>
      <Dialog.Content>
        <Stack space={3}>
          <FileField label="Select Files" multiple />
          <TextArea
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Optional description..."
          />
          <Select
            label="Category"
            selectedKey={category}
            onChange={(key) => setCategory(key as string)}
          >
            <Select.Option id="Documents">Documents</Select.Option>
            <Select.Option id="Images">Images</Select.Option>
            <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
          </Select>
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="secondary" onPress={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="primary" onPress={handleUpload}>
          Upload
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

// --- Member Detail Dialog ---

interface MemberDetailDialogProps {
  member: Member | null;
  onClose: () => void;
}

const MemberDetailDialog = ({ member, onClose }: MemberDetailDialogProps) => (
  <Dialog open={!!member} onOpenChange={(open) => !open && onClose()} size="small" closeButton>
    <Dialog.Title>{member?.name ?? ''}</Dialog.Title>
    <Dialog.Content>
      <Stack space={3}>
        <Inline space={2} alignY="center">
          <Text weight="bold">Role:</Text>
          {member && <Badge variant="info">{member.role}</Badge>}
        </Inline>
        <Inline space={2} alignY="center">
          <Text weight="bold">Email:</Text>
          <Text>{member?.email}</Text>
        </Inline>
        <Inline space={2} alignY="center">
          <Text weight="bold">Status:</Text>
          {member && (
            <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
              {member.status}
            </Badge>
          )}
        </Inline>
        <Inline space={2} alignY="center">
          <Text weight="bold">Joined:</Text>
          <Text>{member ? formatDate(member.joined) : ''}</Text>
        </Inline>
        {member?.bio && (
          <Stack space={1}>
            <Text weight="bold">Bio:</Text>
            <Text>{member.bio}</Text>
          </Stack>
        )}
      </Stack>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={onClose}>Close</Button>
    </Dialog.Actions>
  </Dialog>
);

// --- App Content ---

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('/dashboard');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [teamName, setTeamName] = useState('TeamHub');

  // Member dialogs
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [detailMember, setDetailMember] = useState<Member | null>(null);

  // Members filters
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  // Projects
  const [projectSearch, setProjectSearch] = useState('');
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  // Files
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);

  // Settings
  const [settingsTeamName, setSettingsTeamName] = useState(teamName);
  const [settingsDesc, setSettingsDesc] = useState('A collaborative team workspace.');
  const [settingsTz, setSettingsTz] = useState('UTC');
  const [settingsDateFmt, setSettingsDateFmt] = useState('MM/DD/YYYY');
  const [notifSettings, setNotifSettings] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });
  const [integrations, setIntegrations] = useState({
    slack: true,
    github: false,
    jira: false,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const { addToast } = useToast();
  const confirm = useConfirmation();

  const pageNames: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/members': 'Members',
    '/projects': 'Projects',
    '/calendar': 'Calendar',
    '/files': 'Files',
    '/settings': 'Settings',
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase());
      const matchRole = roleFilter === 'All Roles' || m.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [members, memberSearch, roleFilter]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase());
      const matchType = fileTypeFilter === 'All' || f.type === fileTypeFilter;
      return matchSearch && matchType;
    });
  }, [files, fileSearch, fileTypeFilter]);

  const handleAddMember = (data: Omit<Member, 'id'>) => {
    const newMember: Member = { ...data, id: genId() };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleEditMember = (data: Omit<Member, 'id'>) => {
    if (!editMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editMember.id ? { ...data, id: m.id } : m))
    );
    setEditMember(null);
  };

  const handleRemoveMember = async (member: Member) => {
    try {
      await confirm({
        variant: 'destructive',
        title: 'Remove Member',
        content: `Are you sure you want to remove ${member.name} from the team?`,
        confirmationLabel: 'Remove',
      });
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch {
      // cancelled
    }
  };

  const handleDisconnect = async (service: string) => {
    try {
      await confirm({
        variant: 'destructive',
        title: `Disconnect ${service}`,
        content: `Are you sure you want to disconnect ${service}?`,
        confirmationLabel: 'Disconnect',
      });
      setIntegrations((prev) => ({ ...prev, [service.toLowerCase()]: false }));
    } catch {
      // cancelled
    }
  };

  const handleSaveSettings = () => {
    setTeamName(settingsTeamName);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  // --- Dashboard Page ---
  const DashboardPage = (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>
      <Inline space={4} alignX="between">
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold" size="sm">Members</Text>
            <Text size="xl" weight="bold">{members.length}</Text>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold" size="sm">Active Projects</Text>
            <Text size="xl" weight="bold">5</Text>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2}>
            <Text weight="bold" size="sm">Upcoming Deadlines</Text>
            <Text size="xl" weight="bold">8</Text>
          </Stack>
        </Card>
        <Tooltip.Trigger>
          <Card p={4}>
            <Stack space={2}>
              <Text weight="bold" size="sm">Hours This Week</Text>
              <Text size="xl" weight="bold">
                {(342).toLocaleString()}
              </Text>
            </Stack>
          </Card>
          <Tooltip>Aggregate of all team members.</Tooltip>
        </Tooltip.Trigger>
      </Inline>

      <Stack space={3}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity" selectionMode="none">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {RECENT_ACTIVITY.map((row) => (
              <Table.Row key={row.id} id={row.id}>
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

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint 14 ends in 3 days.</SectionMessage.Title>
        <SectionMessage.Content>
          Review the project board for outstanding tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  // --- Members Page ---
  const MembersPage = (
    <Stack space={4}>
      <Headline level={1}>Team Members</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search members"
          placeholder="Search by name…"
          value={memberSearch}
          onChange={setMemberSearch}
        />
        <Select
          aria-label="Filter by role"
          selectedKey={roleFilter}
          onChange={(key) => setRoleFilter(key as string)}
        >
          <Select.Option id="All Roles">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <ToggleButton.Group
          selectionMode="single"
          selectedKeys={new Set([viewMode])}
          onSelectionChange={(keys) => {
            if (typeof keys === 'object') {
              const arr = [...(keys as Set<string>)];
              if (arr.length > 0) setViewMode(arr[0] as 'table' | 'card');
            }
          }}
        >
          <ToggleButton id="table">Table</ToggleButton>
          <ToggleButton id="card">Cards</ToggleButton>
        </ToggleButton.Group>
        <Button variant="primary" onPress={() => setAddMemberOpen(true)}>
          Add Member
        </Button>
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team Members" selectionMode="none">
          <Table.Header>
            <Table.Column rowHeader>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map((member) => (
              <Table.Row key={member.id} id={member.id}>
                <Table.Cell>
                  <Button variant="ghost" onPress={() => setDetailMember(member)}>
                    {member.name}
                  </Button>
                </Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(member.joined)}</Table.Cell>
                <Table.Cell>
                  <ActionMenu>
                    <ActionMenu.Item id="edit" onAction={() => setEditMember(member)}>
                      Edit
                    </ActionMenu.Item>
                    <ActionMenu.Item
                      id="remove"
                      variant="destructive"
                      onAction={() => handleRemoveMember(member)}
                    >
                      Remove
                    </ActionMenu.Item>
                  </ActionMenu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="280px" space={4}>
          {filteredMembers.map((member) => (
            <Card key={member.id} p={4}>
              <Stack space={3}>
                <Headline level="4">{member.name}</Headline>
                <Badge variant="info">{member.role}</Badge>
                <Text size="sm">{member.email}</Text>
                <Inline space={2}>
                  <Button size="small" onPress={() => {}} aria-label={`Message ${member.name}`}>
                    Message
                  </Button>
                  <Button
                    size="small"
                    variant="secondary"
                    onPress={() => setDetailMember(member)}
                    aria-label={`Profile of ${member.name}`}
                  >
                    Profile
                  </Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      <MemberFormDialog
        open={addMemberOpen}
        onOpenChange={setAddMemberOpen}
        onSubmit={handleAddMember}
      />
      <MemberFormDialog
        open={!!editMember}
        onOpenChange={(open) => { if (!open) setEditMember(null); }}
        initial={editMember}
        onSubmit={handleEditMember}
      />
      <MemberDetailDialog member={detailMember} onClose={() => setDetailMember(null)} />
    </Stack>
  );

  // --- Projects Page ---
  const [selectedProjectKeys, setSelectedProjectKeys] = useState<Set<string>>(new Set());

  const handleArchiveSelected = () => {
    setProjects((prev) => prev.filter((p) => !selectedProjectKeys.has(p.id)));
    setSelectedProjectKeys(new Set());
  };

  const ProjectsPage = (
    <Stack space={4}>
      <Headline level={1}>Projects</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search projects"
          placeholder="Search projects…"
          value={projectSearch}
          onChange={setProjectSearch}
        />
        <Button variant="primary" onPress={() => setNewProjectOpen(true)}>
          New Project
        </Button>
      </Inline>

      <Table
        aria-label="Projects"
        selectionMode="multiple"
        onSelectionChange={(keys) => {
          if (keys === 'all') {
            setSelectedProjectKeys(new Set(filteredProjects.map((p) => p.id)));
          } else {
            setSelectedProjectKeys(new Set(keys as Iterable<string>));
          }
        }}
        actionBar={() => (
          <ActionBar>
            <ActionBar.Button onPress={handleArchiveSelected}>
              Archive Selected
            </ActionBar.Button>
            <ActionBar.Button onPress={() => addToast({ title: 'Exporting selected projects…', variant: 'info' })}>
              Export
            </ActionBar.Button>
          </ActionBar>
        )}
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
          {filteredProjects.map((project) => (
            <Table.Row key={project.id} id={project.id}>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>{project.members}</Table.Cell>
              <Table.Cell>{formatDate(project.deadline)}</Table.Cell>
              <Table.Cell>{project.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={projectStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen} size="small" closeButton>
        <Dialog.Title>New Project</Dialog.Title>
        <Dialog.Content>
          <Stack space={3}>
            <TextField label="Project Name" required placeholder="Enter project name" />
            <TextField label="Lead" placeholder="Project lead" />
            <DatePicker label="Deadline" />
          </Stack>
        </Dialog.Content>
        <Dialog.Actions>
          <Button variant="secondary" onPress={() => setNewProjectOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={() => {
              setNewProjectOpen(false);
              addToast({ title: 'Project created.', variant: 'success' });
            }}
          >
            Create
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Stack>
  );

  // --- Calendar Page ---
  const CalendarPage = (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>
      <Calendar aria-label="Team Calendar" />
      <Stack space={3}>
        <Headline level={2}>Upcoming Events</Headline>
        <Stack space={2}>
          {CALENDAR_EVENTS.map((event) => (
            <Card key={event.id} p={3}>
              <Inline space={4} alignY="center">
                <Text weight="bold">{formatDate(event.date)}</Text>
                <Text>{event.name}</Text>
                <Badge variant={eventVariant(event.type)}>{event.type}</Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  // --- Files Page ---
  const FilesPage = (
    <Stack space={4}>
      <Headline level={1}>Shared Files</Headline>
      <Inline space={3} alignY="center">
        <SearchField
          aria-label="Search files"
          placeholder="Search files…"
          value={fileSearch}
          onChange={setFileSearch}
        />
        <Select
          aria-label="Filter by type"
          selectedKey={fileTypeFilter}
          onChange={(key) => setFileTypeFilter(key as string)}
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Button variant="primary" onPress={() => setUploadOpen(true)}>
          Upload
        </Button>
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
          {filteredFiles.map((file) => (
            <Table.Row key={file.id} id={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>{formatFileSize(file.size)}</Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>{formatDate(file.date)}</Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <ActionMenu.Item id="download" onAction={() => addToast({ title: `Downloading ${file.name}…`, variant: 'info' })}>
                    Download
                  </ActionMenu.Item>
                  <ActionMenu.Item id="rename" onAction={() => addToast({ title: 'Rename feature coming soon.', variant: 'info' })}>
                    Rename
                  </ActionMenu.Item>
                  <ActionMenu.Item
                    id="delete"
                    variant="destructive"
                    onAction={async () => {
                      try {
                        await confirm({
                          variant: 'destructive',
                          title: 'Delete File',
                          content: `Delete "${file.name}"? This cannot be undone.`,
                          confirmationLabel: 'Delete',
                        });
                        setFiles((prev) => prev.filter((f) => f.id !== file.id));
                      } catch {
                        // cancelled
                      }
                    }}
                  >
                    Delete
                  </ActionMenu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <FileUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={(newFiles) => setFiles((prev) => [...prev, ...newFiles])}
      />
    </Stack>
  );

  // --- Settings Page ---
  const SettingsPage = (
    <Stack space={4}>
      <Headline level={1}>Team Settings</Headline>
      <Tabs aria-label="Settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            {settingsSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Settings updated.</SectionMessage.Title>
              </SectionMessage>
            )}
            <TextField
              label="Team Name"
              value={settingsTeamName}
              onChange={setSettingsTeamName}
            />
            <TextArea
              label="Description"
              value={settingsDesc}
              onChange={setSettingsDesc}
            />
            <Select
              label="Default Timezone"
              selectedKey={settingsTz}
              onChange={(key) => setSettingsTz(key as string)}
            >
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              selectedKey={settingsDateFmt}
              onChange={(key) => setSettingsDateFmt(key as string)}
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button variant="primary" onPress={handleSaveSettings}>
              Save
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            {notifSaved && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Preferences saved.</SectionMessage.Title>
              </SectionMessage>
            )}
            <Card p={4}>
              <Stack space={4}>
                <Stack space={1}>
                  <Switch
                    label="New member joins"
                    selected={notifSettings.newMember}
                    onChange={(v) => setNotifSettings((n) => ({ ...n, newMember: v }))}
                  />
                  <Text size="sm" color="secondary">Get notified when someone joins the team</Text>
                </Stack>
                <Stack space={1}>
                  <Switch
                    label="Project deadline approaching"
                    selected={notifSettings.deadline}
                    onChange={(v) => setNotifSettings((n) => ({ ...n, deadline: v }))}
                  />
                  <Text size="sm" color="secondary">Reminder 3 days before deadline</Text>
                </Stack>
                <Stack space={1}>
                  <Switch
                    label="Weekly digest"
                    selected={notifSettings.digest}
                    onChange={(v) => setNotifSettings((n) => ({ ...n, digest: v }))}
                  />
                  <Text size="sm" color="secondary">Summary of team activity every Monday</Text>
                </Stack>
                <Stack space={1}>
                  <Switch
                    label="Mention notifications"
                    selected={notifSettings.mention}
                    onChange={(v) => setNotifSettings((n) => ({ ...n, mention: v }))}
                  />
                  <Text size="sm" color="secondary">When someone mentions you in a comment</Text>
                </Stack>
                <Stack space={1}>
                  <Switch
                    label="Calendar reminders"
                    selected={notifSettings.calendar}
                    onChange={(v) => setNotifSettings((n) => ({ ...n, calendar: v }))}
                  />
                  <Text size="sm" color="secondary">15 minutes before scheduled events</Text>
                </Stack>
              </Stack>
            </Card>
            <Button variant="primary" onPress={handleSaveNotifications}>
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="240px" space={4}>
            <Card p={4}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level="4">Slack</Headline>
                  <Badge variant="success">Connected</Badge>
                </Inline>
                <Text size="sm">Team messaging and notifications integration.</Text>
                <Button
                  variant="secondary"
                  onPress={() => handleDisconnect('Slack')}
                >
                  Disconnect
                </Button>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level="4">GitHub</Headline>
                  <Badge>Not Connected</Badge>
                </Inline>
                <Text size="sm">Source control and code review integration.</Text>
                <Button
                  variant="primary"
                  onPress={() => setIntegrations((i) => ({ ...i, github: true }))}
                >
                  Connect
                </Button>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level="4">Jira</Headline>
                  <Badge>Not Connected</Badge>
                </Inline>
                <Text size="sm">Project tracking and issue management.</Text>
                <Button
                  variant="primary"
                  onPress={() => setIntegrations((i) => ({ ...i, jira: true }))}
                >
                  Connect
                </Button>
              </Stack>
            </Card>
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const currentPageContent = {
    '/dashboard': DashboardPage,
    '/members': MembersPage,
    '/projects': ProjectsPage,
    '/calendar': CalendarPage,
    '/files': FilesPage,
    '/settings': SettingsPage,
  }[currentPage] ?? DashboardPage;

  return (
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
                <Breadcrumbs.Item href={currentPage}>
                  {pageNames[currentPage]}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Inline space={2} alignY="center">
                <Tooltip.Trigger>
                  <Menu
                    label="John Doe"
                    onAction={(key) => {
                      if (key === 'signout') {
                        addToast({ title: 'Signed out.', variant: 'info' });
                      }
                    }}
                  >
                    <Menu.Item id="profile">Profile</Menu.Item>
                    <Menu.Item id="preferences">Preferences</Menu.Item>
                    <Menu.Item id="signout" variant="destructive">
                      Sign Out
                    </Menu.Item>
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
            <Inset space={6}>{currentPageContent}</Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
};

const TestApp = () => (
  <ConfirmationProvider>
    <>
      <ToastProvider position="bottom-right" />
      <AppContent />
    </>
  </ConfirmationProvider>
);

export default TestApp;
