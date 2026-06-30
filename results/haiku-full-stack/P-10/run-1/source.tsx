'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Button,
  Menu,
  Stack,
  Inset,
  Headline,
  Text,
  Card,
  Tiles,
  Table,
  Dialog,
  TextField,
  Select,
  TextArea,
  Form,
  Badge,
  SearchField,
  Inline,
  Tabs,
  Switch,
  FileField,
  DateFormat,
  ActionBar,
  Checkbox,
  ToastProvider,
  useToast,
  Tooltip,
  SectionMessage,
  useConfirmation,
} from '@marigold/components';

type Member = {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  status: 'Active' | 'On Leave';
  joinedDate: Date;
};

type Project = {
  id: string;
  name: string;
  lead: string;
  members: number;
  deadline: Date;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed';
};

type FileItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: Date;
};

type ActivityItem = {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
};

const defaultMembers: Member[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2024, 0, 15),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Designer',
    status: 'Active',
    joinedDate: new Date(2024, 2, 20),
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    role: 'Manager',
    status: 'Active',
    joinedDate: new Date(2023, 11, 1),
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Developer',
    status: 'On Leave',
    joinedDate: new Date(2023, 9, 10),
  },
  {
    id: '5',
    name: 'Eve Wilson',
    email: 'eve@example.com',
    role: 'QA',
    status: 'Active',
    joinedDate: new Date(2024, 1, 5),
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2024, 3, 12),
  },
];

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    lead: 'Alice Johnson',
    members: 4,
    deadline: new Date(2026, 7, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mobile App',
    lead: 'Bob Smith',
    members: 5,
    deadline: new Date(2026, 8, 30),
    progress: 45,
    status: 'Active',
  },
  {
    id: '3',
    name: 'API Integration',
    lead: 'Carol Davis',
    members: 3,
    deadline: new Date(2026, 6, 20),
    progress: 100,
    status: 'Completed',
  },
  {
    id: '4',
    name: 'Design System',
    lead: 'David Brown',
    members: 2,
    deadline: new Date(2026, 9, 15),
    progress: 25,
    status: 'On Hold',
  },
  {
    id: '5',
    name: 'Analytics Dashboard',
    lead: 'Eve Wilson',
    members: 3,
    deadline: new Date(2026, 7, 31),
    progress: 60,
    status: 'Active',
  },
];

const defaultFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Roadmap.pdf',
    type: 'Documents',
    size: 2400000,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 5, 20),
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    type: 'Images',
    size: 3800000,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 5, 18),
  },
  {
    id: '3',
    name: 'Budget 2026.xlsx',
    type: 'Spreadsheets',
    size: 1200000,
    uploadedBy: 'Carol Davis',
    date: new Date(2026, 5, 15),
  },
  {
    id: '4',
    name: 'Design Guidelines.pdf',
    type: 'Documents',
    size: 5600000,
    uploadedBy: 'David Brown',
    date: new Date(2026, 5, 10),
  },
  {
    id: '5',
    name: 'Q2 Report.pptx',
    type: 'Documents',
    size: 4200000,
    uploadedBy: 'Eve Wilson',
    date: new Date(2026, 5, 8),
  },
];

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Website Redesign',
    date: new Date(2026, 5, 28),
  },
  {
    id: '2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Mobile App',
    date: new Date(2026, 5, 28),
  },
  {
    id: '3',
    member: 'Carol Davis',
    action: 'Deploy',
    project: 'Analytics Dashboard',
    date: new Date(2026, 5, 27),
  },
  {
    id: '4',
    member: 'Eve Wilson',
    action: 'Commit',
    project: 'Website Redesign',
    date: new Date(2026, 5, 26),
  },
  {
    id: '5',
    member: 'Frank Miller',
    action: 'Review',
    project: 'Mobile App',
    date: new Date(2026, 5, 25),
  },
];

const getStatusVariant = (status: string): 'success' | 'warning' | 'error' =>
  status === 'Active' ? 'success' : status === 'On Leave' ? 'warning' : 'error';

const getActionVariant = (action: string): 'info' | 'warning' | 'success' =>
  action === 'Commit' ? 'info' : action === 'Review' ? 'warning' : 'success';

function TestApp() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [teamName, setTeamName] = useState('TeamHub');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('All Roles');
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'cards'>('table');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [fileTypeFilter, setFileTypeFilter] = useState('All');
  const [fileSearch, setFileSearch] = useState('');
  const { addToast } = useToast();
  const confirm = useConfirmation();

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name
        .toLowerCase()
        .includes(memberSearch.toLowerCase());
      const matchesRole =
        memberRoleFilter === 'All Roles' || m.role === memberRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, memberSearch, memberRoleFilter]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.name
        .toLowerCase()
        .includes(fileSearch.toLowerCase());
      const matchesType = fileTypeFilter === 'All' || f.type === fileTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, fileSearch, fileTypeFilter]);

  const handleAddMember = (formData: FormData) => {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as
      | 'Developer'
      | 'Designer'
      | 'Manager'
      | 'QA';

    if (!fullName || !email || !role) return;

    const newMember: Member = {
      id: String(members.length + 1),
      name: fullName,
      email,
      role,
      status: 'Active',
      joinedDate: new Date(),
    };

    setMembers([...members, newMember]);
    addToast({
      title: 'Member added',
      variant: 'success',
    });
  };

  const handleEditMember = (formData: FormData) => {
    if (!editingMember) return;

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as
      | 'Developer'
      | 'Designer'
      | 'Manager'
      | 'QA';

    setMembers(
      members.map(m =>
        m.id === editingMember.id
          ? { ...m, name: fullName, email, role }
          : m
      )
    );
    setEditingMember(null);
    addToast({
      title: 'Member updated',
      variant: 'success',
    });
  };

  const handleRemoveMember = async (member: Member) => {
    await confirm({
      title: 'Remove member',
      content: `Are you sure you want to remove ${member.name}?`,
      confirmationLabel: 'Remove',
      variant: 'destructive',
    });
    setMembers(members.filter(m => m.id !== member.id));
    addToast({
      title: 'Member removed',
      variant: 'success',
    });
  };

  const handleArchiveProjects = () => {
    setProjects(
      projects.filter(p => !selectedProjects.has(p.id))
    );
    setSelectedProjects(new Set());
    addToast({
      title: 'Projects archived',
      variant: 'success',
    });
  };

  const handleSaveSettings = (formData: FormData) => {
    const newTeamName = formData.get('teamName') as string;
    setTeamName(newTeamName);
    addToast({
      title: 'Settings updated',
      variant: 'success',
    });
  };

  const handleUploadFiles = (formData: FormData) => {
    const fileList = formData.getAll('files') as File[];
    if (fileList.length > 0) {
      addToast({
        title: 'Files uploaded successfully',
        variant: 'success',
      });
    }
  };

  const Dashboard = () => (
    <Stack space={6}>
      <Headline level="1">Team Overview</Headline>

      <Tiles tilesWidth="150px" space={4}>
        <Card p={4}>
          <Stack space={2} alignX="center">
            <Text size="sm" weight="bold">
              Members
            </Text>
            <Text size="xl" weight="bold">
              {members.length}
            </Text>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2} alignX="center">
            <Text size="sm" weight="bold">
              Active Projects
            </Text>
            <Text size="xl" weight="bold">
              5
            </Text>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2} alignX="center">
            <Text size="sm" weight="bold">
              Upcoming Deadlines
            </Text>
            <Text size="xl" weight="bold">
              8
            </Text>
          </Stack>
        </Card>
        <Card p={4}>
          <Stack space={2} alignX="center">
            <Text size="sm" weight="bold">
              Hours This Week
            </Text>
            <Tooltip.Trigger>
              <Text size="xl" weight="bold">
                342
              </Text>
              <Tooltip>Aggregate of all team members.</Tooltip>
            </Tooltip.Trigger>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level="2">Recent Activity</Headline>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column rowHeader>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {defaultActivities.map(activity => (
              <Table.Row key={activity.id}>
                <Table.Cell>{activity.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getActionVariant(activity.action)}>
                    {activity.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{activity.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={activity.date} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint update</SectionMessage.Title>
        <SectionMessage.Content>
          Sprint 14 ends in 3 days. Review the project board for outstanding
          tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  const Members = () => (
    <Stack space={4}>
      <Headline level="1">Team Members</Headline>

      <Inline space={2} alignY="center">
        <SearchField
          placeholder="Search members..."
          onChange={setMemberSearch}
          value={memberSearch}
          width={32}
        />
        <Select
          value={memberRoleFilter}
          onChange={setMemberRoleFilter as any}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="developer">Developer</Select.Option>
          <Select.Option id="designer">Designer</Select.Option>
          <Select.Option id="manager">Manager</Select.Option>
          <Select.Option id="qa">QA</Select.Option>
        </Select>

        <Button
          variant={memberViewMode === 'table' ? 'primary' : 'secondary'}
          onPress={() => setMemberViewMode('table')}
        >
          Table
        </Button>
        <Button
          variant={memberViewMode === 'cards' ? 'primary' : 'secondary'}
          onPress={() => setMemberViewMode('cards')}
        >
          Cards
        </Button>

        <Dialog.Trigger>
          <Button variant="primary">Add Member</Button>
          <Dialog size="small">
            <Dialog.Title>Add New Member</Dialog.Title>
            <Dialog.Content>
              <Form onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddMember(formData);
                (e.currentTarget as any).closest('[role="dialog"]')?.querySelector('[slot="close"]')?.click?.();
              }}>
                <Stack space={3}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    required
                    autoFocus
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                  />
                  <Select label="Role" name="role" required>
                    <Select.Option id="dev">Developer</Select.Option>
                    <Select.Option id="designer">Designer</Select.Option>
                    <Select.Option id="manager">Manager</Select.Option>
                    <Select.Option id="qa">QA</Select.Option>
                  </Select>
                  <Inline space={2} alignX="right">
                    <Button variant="secondary" type="button" slot="close">
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Add
                    </Button>
                  </Inline>
                </Stack>
              </Form>
            </Dialog.Content>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {memberViewMode === 'table' ? (
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
            {filteredMembers.map(member => (
              <Table.Row key={member.id}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusVariant(member.status)}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat value={member.joinedDate} />
                </Table.Cell>
                <Table.Cell>
                  <Menu label="Actions" onAction={id => {
                    if (id === 'edit') setEditingMember(member);
                    if (id === 'remove') handleRemoveMember(member);
                  }}>
                    <Menu.Item id="edit">Edit</Menu.Item>
                    <Menu.Item id="remove" variant="destructive">Remove</Menu.Item>
                  </Menu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="200px" space={3}>
          {filteredMembers.map(member => (
            <Card key={member.id} p={3}>
              <Stack space={2}>
                <Text weight="bold">{member.name}</Text>
                <Badge variant="default">{member.role}</Badge>
                <Text size="sm">{member.email}</Text>
                <Inline space={1}>
                  <Button
                    variant="secondary"
                    size="small"
                    onPress={() => setSelectedMember(member)}
                  >
                    Profile
                  </Button>
                  <Button variant="secondary" size="small">
                    Message
                  </Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {editingMember && (
        <Dialog.Trigger>
          <div />
          <Dialog size="small">
            <Dialog.Title>Edit Member</Dialog.Title>
            <Dialog.Content>
              <Form onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleEditMember(formData);
              }}>
                <Stack space={3}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    defaultValue={editingMember.name}
                    required
                    autoFocus
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    defaultValue={editingMember.email}
                    required
                  />
                  <Select
                    label="Role"
                    name="role"
                    defaultValue={editingMember.role}
                    required
                  >
                    <Select.Option id="dev">Developer</Select.Option>
                    <Select.Option id="designer">Designer</Select.Option>
                    <Select.Option id="manager">Manager</Select.Option>
                    <Select.Option id="qa">QA</Select.Option>
                  </Select>
                  <Inline space={2} alignX="right">
                    <Button
                      variant="secondary"
                      type="button"
                      slot="close"
                      onPress={() => setEditingMember(null)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Update
                    </Button>
                  </Inline>
                </Stack>
              </Form>
            </Dialog.Content>
          </Dialog>
        </Dialog.Trigger>
      )}
    </Stack>
  );

  const Projects = () => (
    <Stack space={4}>
      <Inline alignY="center" alignX="between">
        <Headline level="1">Projects</Headline>
        <Dialog.Trigger>
          <Button variant="primary">New Project</Button>
          <Dialog size="small">
            <Dialog.Title>New Project</Dialog.Title>
            <Dialog.Content>
              <Text>Create a new project (placeholder)</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary">Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <SearchField
        placeholder="Search projects..."
        width={32}
      />

      {selectedProjects.size > 0 && (
        <ActionBar aria-label="Project actions">
          <ActionBar.Button onPress={handleArchiveProjects}>
            Archive Selected
          </ActionBar.Button>
          <ActionBar.Button>Export</ActionBar.Button>
        </ActionBar>
      )}

      <Table aria-label="Projects">
        <Table.Header>
          <Table.Column>
            <Checkbox
              checked={selectedProjects.size === projects.length && projects.length > 0}
              onChange={checked => {
                if (checked) {
                  setSelectedProjects(new Set(projects.map(p => p.id)));
                } else {
                  setSelectedProjects(new Set());
                }
              }}
            />
          </Table.Column>
          <Table.Column rowHeader>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column alignX="right">Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {projects.map(project => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onChange={checked => {
                    const next = new Set(selectedProjects);
                    if (checked) {
                      next.add(project.id);
                    } else {
                      next.delete(project.id);
                    }
                    setSelectedProjects(next);
                  }}
                />
              </Table.Cell>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>{project.members}</Table.Cell>
              <Table.Cell>
                <DateFormat value={project.deadline} />
              </Table.Cell>
              <Table.Cell alignX="right">{project.progress}%</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={
                    project.status === 'Active'
                      ? 'info'
                      : project.status === 'On Hold'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {project.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const Calendar = () => (
    <Stack space={4}>
      <Headline level="1">Team Calendar</Headline>

      <Card p={4}>
        <Text size="sm">Team calendar for {new Date().getFullYear()}</Text>
      </Card>

      <Stack space={2}>
        <Headline level="2">Upcoming Events</Headline>
        <Stack space={2}>
          {[
            { date: new Date(2026, 5, 30), name: 'Sprint Planning', type: 'Meeting' },
            { date: new Date(2026, 6, 5), name: 'Sprint 14 Deadline', type: 'Deadline' },
            { date: new Date(2026, 6, 10), name: 'Team Lunch', type: 'Social' },
            { date: new Date(2026, 6, 15), name: 'Client Presentation', type: 'Meeting' },
          ].map((event, i) => (
            <Inline key={i} alignY="center" space={2}>
              <DateFormat value={event.date} />
              <Text weight="bold">{event.name}</Text>
              <Badge variant={event.type === 'Meeting' ? 'info' : event.type === 'Deadline' ? 'warning' : 'success'}>
                {event.type}
              </Badge>
            </Inline>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  const Files = () => (
    <Stack space={4}>
      <Headline level="1">Shared Files</Headline>

      <Inline space={2} alignY="center">
        <SearchField
          placeholder="Search files..."
          onChange={setFileSearch}
          value={fileSearch}
          width={32}
        />
        <Select value={fileTypeFilter} onChange={setFileTypeFilter as any}>
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="doc">Documents</Select.Option>
          <Select.Option id="img">Images</Select.Option>
          <Select.Option id="sheet">Spreadsheets</Select.Option>
        </Select>

        <Dialog.Trigger>
          <Button variant="primary">Upload</Button>
          <Dialog size="small">
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Form onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUploadFiles(formData);
              }}>
                <Stack space={3}>
                  <FileField label="Files" name="files" multiple />
                  <TextArea label="Description" name="description" />
                  <Select label="Category" name="category">
                    <Select.Option id="doc">Documents</Select.Option>
                    <Select.Option id="img">Images</Select.Option>
                    <Select.Option id="sheet">Spreadsheets</Select.Option>
                  </Select>
                  <Inline space={2} alignX="right">
                    <Button variant="secondary" type="button" slot="close">
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Upload
                    </Button>
                  </Inline>
                </Stack>
              </Form>
            </Dialog.Content>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Files">
        <Table.Header>
          <Table.Column rowHeader>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column>Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredFiles.map(file => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={file.date} />
              </Table.Cell>
              <Table.Cell>
                <Menu label="File actions" onAction={id => {
                  console.log('File action:', id);
                }}>
                  <Menu.Item id="download">Download</Menu.Item>
                  <Menu.Item id="rename">Rename</Menu.Item>
                  <Menu.Item id="delete" variant="destructive">Delete</Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const Settings = () => (
    <Stack space={4}>
      <Headline level="1">Team Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List>
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Form onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSaveSettings(formData);
          }}>
            <Stack space={3}>
              <TextField
                label="Team Name"
                name="teamName"
                defaultValue={teamName}
              />
              <TextArea label="Description" />
              <Select label="Default Timezone">
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>
              <Select label="Date Format">
                <Select.Option id="mdy">MM/DD/YYYY</Select.Option>
                <Select.Option id="dmy">DD.MM.YYYY</Select.Option>
                <Select.Option id="ymd">YYYY-MM-DD</Select.Option>
              </Select>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Stack>
          </Form>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={3}>
              <Inline alignY="center" alignX="between">
                <Stack space={0.5}>
                  <Text weight="bold">New member joins</Text>
                  <Text size="sm">Get notified when someone joins the team</Text>
                </Stack>
                <Switch />
              </Inline>
              <Inline alignY="center" alignX="between">
                <Stack space={0.5}>
                  <Text weight="bold">Project deadline approaching</Text>
                  <Text size="sm">
                    Reminder 3 days before deadline
                  </Text>
                </Stack>
                <Switch />
              </Inline>
              <Inline alignY="center" alignX="between">
                <Stack space={0.5}>
                  <Text weight="bold">Weekly digest</Text>
                  <Text size="sm">
                    Summary of team activity every Monday
                  </Text>
                </Stack>
                <Switch />
              </Inline>
              <Inline alignY="center" alignX="between">
                <Stack space={0.5}>
                  <Text weight="bold">Mention notifications</Text>
                  <Text size="sm">
                    When someone mentions you in a comment
                  </Text>
                </Stack>
                <Switch />
              </Inline>
              <Inline alignY="center" alignX="between">
                <Stack space={0.5}>
                  <Text weight="bold">Calendar reminders</Text>
                  <Text size="sm">
                    15 minutes before scheduled events
                  </Text>
                </Stack>
                <Switch />
              </Inline>
            <Button variant="primary">Save Preferences</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="250px" space={3}>
            {[
              {
                name: 'Slack',
                status: 'connected',
                description: 'Send notifications to Slack',
              },
              {
                name: 'GitHub',
                status: 'not-connected',
                description: 'Sync repositories and workflows',
              },
              {
                name: 'Jira',
                status: 'not-connected',
                description: 'Link to issue tracking',
              },
            ].map(integration => (
              <Card key={integration.name} p={3}>
                <Stack space={2}>
                  <Inline alignY="center" space={1}>
                    <Text weight="bold">{integration.name}</Text>
                    <Badge
                      variant={
                        integration.status === 'connected'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {integration.status === 'connected'
                        ? 'Connected'
                        : 'Not Connected'}
                    </Badge>
                  </Inline>
                  <Text size="sm">{integration.description}</Text>
                  <Button
                    variant={
                      integration.status === 'connected'
                        ? 'secondary'
                        : 'primary'
                    }
                  >
                    {integration.status === 'connected'
                      ? 'Disconnect'
                      : 'Connect'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const pageContent = {
    Dashboard: <Dashboard />,
    Members: <Members />,
    Projects: <Projects />,
    Calendar: <Calendar />,
    Files: <Files />,
    Settings: <Settings />,
  };

  return (
    <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="lg">
                {teamName}
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav>
              {['Dashboard', 'Members', 'Projects', 'Calendar', 'Files'].map(
                page => (
                  <Sidebar.Item
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    active={currentPage === page}
                  >
                    {page}
                  </Sidebar.Item>
                )
              )}
              <Sidebar.Separator />
              <Sidebar.Item
                onPress={() => setCurrentPage('Settings')}
                active={currentPage === 'Settings'}
              >
                Settings
              </Sidebar.Item>
            </Sidebar.Nav>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle aria-label="Breadcrumbs">
              <Breadcrumbs>
                <Breadcrumbs.Item href="#">{teamName}</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">{currentPage}</Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu label="John Doe">
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="prefs">Preferences</Menu.Item>
                <Menu.Item id="signout" variant="destructive">
                  Sign Out
                </Menu.Item>
              </Menu>

              <Tooltip.Trigger>
                <Button variant="icon" size="small" aria-label="Help">
                  ?
                </Button>
                <Tooltip>Use the sidebar to navigate between sections.</Tooltip>
              </Tooltip.Trigger>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              {pageContent[currentPage as keyof typeof pageContent]}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
  );
}

export default TestApp;
