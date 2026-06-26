'use client';

import { useState, useCallback } from 'react';
import {
  AppLayout,
  ActionBar,
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  Headline,
  Icon,
  Inline,
  Menu,
  SearchField,
  Select,
  Sidebar,
  Stack,
  Table,
  Tabs,
  Text,
  TextField,
  TextArea,
  Tiles,
  TopNavigation,
  Tooltip,
  Switch,
  Breadcrumbs,
  ActionMenu,
  Table as TableComponent,
  SectionMessage,
  useToast,
  ToastProvider,
  Calendar,
  Columns,
} from '@marigold/components';
import { Heart } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  email: string;
  status: 'Active' | 'On Leave';
  joinedDate: Date;
  bio?: string;
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

interface CalendarEvent {
  id: string;
  date: Date;
  name: string;
  type: 'Meeting' | 'Deadline' | 'Social';
}

interface SharedFile {
  id: string;
  name: string;
  type: 'Documents' | 'Images' | 'Spreadsheets';
  size: number;
  uploadedBy: string;
  date: Date;
}

interface ActivityRecord {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2025, 0, 15),
    bio: 'Full-stack developer',
  },
  {
    id: '2',
    name: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2025, 1, 20),
    bio: 'UX/UI specialist',
  },
  {
    id: '3',
    name: 'Carol Davis',
    role: 'Manager',
    email: 'carol@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 11, 1),
    bio: 'Project manager',
  },
  {
    id: '4',
    name: 'Diana Chen',
    role: 'Developer',
    email: 'diana@teamhub.com',
    status: 'On Leave',
    joinedDate: new Date(2024, 10, 10),
    bio: 'Backend specialist',
  },
  {
    id: '5',
    name: 'Eve Williams',
    role: 'QA',
    email: 'eve@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2025, 2, 5),
    bio: 'QA Engineer',
  },
  {
    id: '6',
    name: 'Frank Miller',
    role: 'Developer',
    email: 'frank@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 9, 18),
    bio: 'Frontend developer',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    lead: 'Bob Smith',
    members: 4,
    deadline: new Date(2026, 7, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: '2',
    name: 'API Integration',
    lead: 'Alice Johnson',
    members: 3,
    deadline: new Date(2026, 6, 30),
    progress: 45,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Dashboard Analytics',
    lead: 'Carol Davis',
    members: 5,
    deadline: new Date(2026, 5, 20),
    progress: 100,
    status: 'Completed',
  },
  {
    id: '4',
    name: 'Security Audit',
    lead: 'Frank Miller',
    members: 2,
    deadline: new Date(2026, 8, 10),
    progress: 60,
    status: 'Active',
  },
  {
    id: '5',
    name: 'User Research',
    lead: 'Bob Smith',
    members: 3,
    deadline: new Date(2026, 6, 15),
    progress: 30,
    status: 'On Hold',
  },
];

const initialFiles: SharedFile[] = [
  {
    id: '1',
    name: 'Project Guidelines.pdf',
    type: 'Documents',
    size: 2.4,
    uploadedBy: 'Carol Davis',
    date: new Date(2026, 5, 20),
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    type: 'Images',
    size: 5.8,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 5, 19),
  },
  {
    id: '3',
    name: 'Q2 Budget.xlsx',
    type: 'Spreadsheets',
    size: 1.2,
    uploadedBy: 'Carol Davis',
    date: new Date(2026, 5, 18),
  },
  {
    id: '4',
    name: 'Design System.pdf',
    type: 'Documents',
    size: 8.5,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 5, 17),
  },
  {
    id: '5',
    name: 'Team Schedule.xlsx',
    type: 'Spreadsheets',
    size: 0.8,
    uploadedBy: 'Carol Davis',
    date: new Date(2026, 5, 16),
  },
];

const recentActivity: ActivityRecord[] = [
  {
    id: '1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'API Integration',
    date: new Date(2026, 5, 21, 14, 30),
  },
  {
    id: '2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Mobile App Redesign',
    date: new Date(2026, 5, 21, 11, 15),
  },
  {
    id: '3',
    member: 'Frank Miller',
    action: 'Deploy',
    project: 'Security Audit',
    date: new Date(2026, 5, 21, 9, 0),
  },
  {
    id: '4',
    member: 'Eve Williams',
    action: 'Review',
    project: 'API Integration',
    date: new Date(2026, 5, 20, 16, 45),
  },
  {
    id: '5',
    member: 'Carol Davis',
    action: 'Deploy',
    project: 'Dashboard Analytics',
    date: new Date(2026, 5, 20, 13, 20),
  },
];

const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    date: new Date(2026, 5, 25),
    name: 'Team Standup',
    type: 'Meeting',
  },
  {
    id: '2',
    date: new Date(2026, 5, 30),
    name: 'Project Deadline',
    type: 'Deadline',
  },
  {
    id: '3',
    date: new Date(2026, 6, 10),
    name: 'Team Outing',
    type: 'Social',
  },
  {
    id: '4',
    date: new Date(2026, 6, 15),
    name: 'Sprint Review',
    type: 'Meeting',
  },
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatFileSize(bytes: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(bytes) + ' MB';
}

type ActionType =
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'default'
  | undefined;

function getActionBadgeVariant(action: string): ActionType {
  switch (action) {
    case 'Commit':
      return 'info';
    case 'Review':
      return 'warning';
    case 'Deploy':
      return 'success';
    default:
      return 'default';
  }
}

function getStatusBadgeVariant(status: string): ActionType {
  switch (status) {
    case 'Active':
      return 'success';
    case 'On Leave':
      return 'warning';
    case 'On Hold':
      return 'warning';
    case 'Completed':
      return 'success';
    default:
      return 'default';
  }
}

export default function TeamHub() {
  const { addToast } = useToast();
  const [currentPage, setCurrentPage] = useState<
    | 'dashboard'
    | 'members'
    | 'projects'
    | 'calendar'
    | 'files'
    | 'settings'
  >('dashboard');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [files, setFiles] = useState<SharedFile[]>(initialFiles);
  const [teamName, setTeamName] = useState('TeamHub');
  const [memberViewMode, setMemberViewMode] = useState<'table' | 'card'>(
    'table'
  );
  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    role: 'Developer' as 'Developer' | 'Designer' | 'Manager' | 'QA',
    startDate: new Date().toISOString().split('T')[0],
    bio: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newMember: true,
    projectDeadline: true,
    weeklyDigest: true,
    mentions: true,
    calendarReminders: true,
  });

  const [generalSettings, setGeneralSettings] = useState({
    teamName,
    description: 'A collaborative team management tool',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(memberSearch.toLowerCase());
    const matchesRole =
      memberRoleFilter === 'all' || m.role === memberRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name
      .toLowerCase()
      .includes(fileSearch.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || f.type === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddOrEditMember = () => {
    if (!newMemberForm.name || !newMemberForm.email) {
      addToast({ title: 'Please fill in required fields', variant: 'warning' });
      return;
    }

    if (editingMember) {
      setMembers(
        members.map(m =>
          m.id === editingMember.id
            ? {
                ...m,
                name: newMemberForm.name,
                email: newMemberForm.email,
                role: newMemberForm.role,
                bio: newMemberForm.bio,
              }
            : m
        )
      );
      addToast({ title: 'Member updated', variant: 'success' });
    } else {
      setMembers([
        ...members,
        {
          id: Math.random().toString(),
          name: newMemberForm.name,
          email: newMemberForm.email,
          role: newMemberForm.role,
          status: 'Active',
          joinedDate: new Date(newMemberForm.startDate),
          bio: newMemberForm.bio,
        },
      ]);
      addToast({ title: 'Member added', variant: 'success' });
    }

    setAddMemberOpen(false);
    setEditingMember(null);
    setNewMemberForm({
      name: '',
      email: '',
      role: 'Developer',
      startDate: new Date().toISOString().split('T')[0],
      bio: '',
    });
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    addToast({ title: 'Member removed', variant: 'success' });
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setNewMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      startDate: member.joinedDate.toISOString().split('T')[0],
      bio: member.bio || '',
    });
    setAddMemberOpen(true);
  };

  const handleArchiveProjects = () => {
    setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
    setSelectedProjects([]);
    addToast({ title: 'Projects archived', variant: 'success' });
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    addToast({ title: 'File deleted', variant: 'success' });
  };

  const handleSaveSettings = () => {
    setTeamName(generalSettings.teamName);
    addToast({ title: 'Settings updated', variant: 'success' });
  };

  const renderDashboard = () => (
    <Stack space="section">
      <Headline level="1">Team Overview</Headline>

      <Tiles tilesWidth="200px" space="related" stretch>
        <Card p="square-regular" space="tight">
          <Text fontSize="sm" color="text-secondary-muted">
            Members
          </Text>
          <Text size="xl" weight="bold">
            {members.length}
          </Text>
        </Card>
        <Card p="square-regular" space="tight">
          <Text fontSize="sm" color="text-secondary-muted">
            Active Projects
          </Text>
          <Text size="xl" weight="bold">
            {projects.filter(p => p.status === 'Active').length}
          </Text>
        </Card>
        <Card p="square-regular" space="tight">
          <Text fontSize="sm" color="text-secondary-muted">
            Upcoming Deadlines
          </Text>
          <Text size="xl" weight="bold">
            {projects.filter(p => p.deadline > new Date()).length}
          </Text>
        </Card>
        <Card p="square-regular" space="tight">
          <Text fontSize="sm" color="text-secondary-muted">
            <Tooltip text="Aggregate of all team members">Hours This Week</Tooltip>
          </Text>
          <Text size="xl" weight="bold">
            {new Intl.NumberFormat('en-US').format(342)}
          </Text>
        </Card>
      </Tiles>

      <Stack space="tight">
        <Headline level="2">Recent Activity</Headline>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column width={150} rowHeader>
              Member
            </Table.Column>
            <Table.Column width={100}>Action</Table.Column>
            <Table.Column width={150}>Project</Table.Column>
            <Table.Column width={120}>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {recentActivity.map(activity => (
              <Table.Row key={activity.id}>
                <Table.Cell>{activity.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getActionBadgeVariant(activity.action)}>
                    {activity.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{activity.project}</Table.Cell>
                <Table.Cell>{formatDate(activity.date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info" title="Sprint Alert">
        Sprint 14 ends in 3 days. Review the project board for outstanding
        tasks.
      </SectionMessage>
    </Stack>
  );

  const renderMembers = () => (
    <Stack space="section">
      <Headline level="1">Team Members</Headline>

      <Inline space="related" alignY="center">
        <SearchField
          placeholder="Search members..."
          value={memberSearch}
          onChange={setMemberSearch}
        />
        <Select
          label="Role"
          value={memberRoleFilter}
          onSelectionChange={v => setMemberRoleFilter(v as string)}
          width="fit"
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Button
          variant="secondary"
          size="small"
          onPress={() =>
            setMemberViewMode(memberViewMode === 'table' ? 'card' : 'table')
          }
        >
          {memberViewMode === 'table' ? 'Cards' : 'Table'}
        </Button>
        <Dialog.Trigger open={addMemberOpen} onOpenChange={setAddMemberOpen}>
          <Button variant="primary">Add Member</Button>
          <Dialog size="small" closeButton>
            <Dialog.Title>
              {editingMember ? 'Edit Member' : 'Add Member'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space="related">
                <TextField
                  label="Full Name"
                  required
                  value={newMemberForm.name}
                  onChange={e =>
                    setNewMemberForm({
                      ...newMemberForm,
                      name: e as string,
                    })
                  }
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={newMemberForm.email}
                  onChange={e =>
                    setNewMemberForm({
                      ...newMemberForm,
                      email: e as string,
                    })
                  }
                />
                <Select
                  label="Role"
                  value={newMemberForm.role}
                  onSelectionChange={v =>
                    setNewMemberForm({
                      ...newMemberForm,
                      role: v as
                        | 'Developer'
                        | 'Designer'
                        | 'Manager'
                        | 'QA',
                    })
                  }
                >
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <TextField
                  label="Start Date"
                  type="date"
                  value={newMemberForm.startDate}
                  onChange={e =>
                    setNewMemberForm({
                      ...newMemberForm,
                      startDate: e as string,
                    })
                  }
                />
                <TextArea
                  label="Bio"
                  value={newMemberForm.bio}
                  onChange={e =>
                    setNewMemberForm({
                      ...newMemberForm,
                      bio: e as string,
                    })
                  }
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                variant="secondary"
                slot="close"
                onPress={() => {
                  setEditingMember(null);
                  setNewMemberForm({
                    name: '',
                    email: '',
                    role: 'Developer',
                    startDate: new Date().toISOString().split('T')[0],
                    bio: '',
                  });
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onPress={handleAddOrEditMember}>
                {editingMember ? 'Update' : 'Add'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {memberViewMode === 'table' ? (
        <Table aria-label="Team members table">
          <Table.Header>
            <Table.Column rowHeader width={150}>
              Name
            </Table.Column>
            <Table.Column width={100}>Role</Table.Column>
            <Table.Column width={180}>Email</Table.Column>
            <Table.Column width={100}>Status</Table.Column>
            <Table.Column width={130}>Joined</Table.Column>
            <Table.Column width={80}>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map(member => (
              <Table.Row key={member.id} onPress={() => setSelectedMember(member)}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(member.joinedDate)}</Table.Cell>
                <Table.Cell>
                  <ActionMenu>
                    <Menu.Item
                      id="edit"
                      onAction={() => handleEditMember(member)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      id="remove"
                      variant="destructive"
                      onAction={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Menu.Item>
                  </ActionMenu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="250px" space="related" stretch>
          {filteredMembers.map(member => (
            <Card
              key={member.id}
              p="square-regular"
              space="related"
              onClick={() => setSelectedMember(member)}
            >
              <Stack space="tight">
                <Headline level="3">{member.name}</Headline>
                <Badge variant="primary">{member.role}</Badge>
                <Text fontSize="sm">{member.email}</Text>
                <Inline space="tight">
                  <Button variant="primary" size="small">
                    Message
                  </Button>
                  <Button variant="secondary" size="small">
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

  const renderProjects = () => (
    <Stack space="section">
      <Headline level="1">Projects</Headline>

      <Inline space="related" alignY="center">
        <SearchField
          placeholder="Search projects..."
          value={projectSearch}
          onChange={setProjectSearch}
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      {selectedProjects.length > 0 && (
        <ActionBar>
          <Text>{selectedProjects.length} project(s) selected</Text>
          <Inline space="tight">
            <Button
              variant="secondary"
              size="small"
              onPress={() => setSelectedProjects([])}
            >
              Clear
            </Button>
            <Button
              variant="destructive"
              size="small"
              onPress={handleArchiveProjects}
            >
              Archive Selected
            </Button>
          </Inline>
        </ActionBar>
      )}

      <Table aria-label="Projects">
        <Table.Header>
          <Table.Column width={40}>
            <Checkbox
              value="all"
              checked={
                selectedProjects.length === filteredProjects.length &&
                filteredProjects.length > 0
              }
              onChange={() => {
                if (
                  selectedProjects.length === filteredProjects.length &&
                  filteredProjects.length > 0
                ) {
                  setSelectedProjects([]);
                } else {
                  setSelectedProjects(filteredProjects.map(p => p.id));
                }
              }}
            />
          </Table.Column>
          <Table.Column rowHeader width={150}>
            Project
          </Table.Column>
          <Table.Column width={120}>Lead</Table.Column>
          <Table.Column width={80} alignX="right">
            Members
          </Table.Column>
          <Table.Column width={120}>Deadline</Table.Column>
          <Table.Column width={90} alignX="right">
            Progress
          </Table.Column>
          <Table.Column width={100}>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredProjects.map(project => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <Checkbox
                  value={project.id}
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => {
                    if (selectedProjects.includes(project.id)) {
                      setSelectedProjects(
                        selectedProjects.filter(id => id !== project.id)
                      );
                    } else {
                      setSelectedProjects([...selectedProjects, project.id]);
                    }
                  }}
                />
              </Table.Cell>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell alignX="right">
                {new Intl.NumberFormat('en-US').format(project.members)}
              </Table.Cell>
              <Table.Cell>{formatDate(project.deadline)}</Table.Cell>
              <Table.Cell alignX="right">{project.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderCalendar = () => (
    <Stack space="section">
      <Headline level="1">Team Calendar</Headline>

      <Card p="square-regular">
        <Calendar aria-label="Team calendar" />
      </Card>

      <Stack space="tight">
        <Headline level="2">Upcoming Events</Headline>
        <Stack space="related">
          {calendarEvents.map(event => (
            <Card key={event.id} p="square-regular" space="tight">
              <Inline space="related" alignY="center">
                <Stack space="tight">
                  <Text weight="bold">{formatDate(event.date)}</Text>
                  <Text>{event.name}</Text>
                </Stack>
                <Badge
                  variant={
                    event.type === 'Meeting'
                      ? 'info'
                      : event.type === 'Deadline'
                        ? 'warning'
                        : 'primary'
                  }
                >
                  {event.type}
                </Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  const renderFiles = () => (
    <Stack space="section">
      <Headline level="1">Shared Files</Headline>

      <Inline space="related" alignY="center">
        <SearchField
          placeholder="Search files..."
          value={fileSearch}
          onChange={setFileSearch}
        />
        <Select
          label="File Type"
          value={fileTypeFilter}
          onSelectionChange={v => setFileTypeFilter(v as string)}
          width="fit"
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Dialog.Trigger>
          <Button variant="primary">Upload</Button>
          <Dialog size="small" closeButton>
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space="related">
                <TextField label="Description" />
                <Select label="Category" width="fit">
                  <Select.Option id="documents">Documents</Select.Option>
                  <Select.Option id="images">Images</Select.Option>
                  <Select.Option id="spreadsheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  addToast({
                    title: 'Files uploaded successfully',
                    variant: 'success',
                  });
                }}
              >
                Upload
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Shared files">
        <Table.Header>
          <Table.Column rowHeader width={200}>
            File Name
          </Table.Column>
          <Table.Column width={100}>Type</Table.Column>
          <Table.Column width={80} alignX="right">
            Size
          </Table.Column>
          <Table.Column width={120}>Uploaded By</Table.Column>
          <Table.Column width={120}>Date</Table.Column>
          <Table.Column width={80}>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredFiles.map(file => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell alignX="right">
                {formatFileSize(file.size)}
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>{formatDate(file.date)}</Table.Cell>
              <Table.Cell>
                <ActionMenu>
                  <Menu.Item id="download">Download</Menu.Item>
                  <Menu.Item id="rename">Rename</Menu.Item>
                  <Menu.Item
                    id="delete"
                    variant="destructive"
                    onAction={() => handleRemoveFile(file.id)}
                  >
                    Delete
                  </Menu.Item>
                </ActionMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );

  const renderSettings = () => (
    <Stack space="section">
      <Headline level="1">Team Settings</Headline>

      <Tabs aria-label="Settings">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space="related">
            <TextField
              label="Team Name"
              value={generalSettings.teamName}
              onChange={v =>
                setGeneralSettings({
                  ...generalSettings,
                  teamName: v as string,
                })
              }
            />
            <TextArea
              label="Description"
              value={generalSettings.description}
              onChange={v =>
                setGeneralSettings({
                  ...generalSettings,
                  description: v as string,
                })
              }
              rows={3}
            />
            <Select
              label="Default Timezone"
              value={generalSettings.timezone}
              onSelectionChange={v =>
                setGeneralSettings({
                  ...generalSettings,
                  timezone: v as string,
                })
              }
            >
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              value={generalSettings.dateFormat}
              onSelectionChange={v =>
                setGeneralSettings({
                  ...generalSettings,
                  dateFormat: v as string,
                })
              }
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
          <Stack space="related">
            <Card p="square-regular" space="related">
              <Inline space="related" alignY="center">
                <Stack space="tight">
                  <Text weight="bold">New member joins</Text>
                  <Text fontSize="sm" color="text-secondary-muted">
                    Get notified when someone joins the team
                  </Text>
                </Stack>
                <Switch
                  checked={notificationSettings.newMember}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      newMember: !notificationSettings.newMember,
                    })
                  }
                />
              </Inline>
            </Card>
            <Card p="square-regular" space="related">
              <Inline space="related" alignY="center">
                <Stack space="tight">
                  <Text weight="bold">Project deadline approaching</Text>
                  <Text fontSize="sm" color="text-secondary-muted">
                    Reminder 3 days before deadline
                  </Text>
                </Stack>
                <Switch
                  checked={notificationSettings.projectDeadline}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      projectDeadline: !notificationSettings.projectDeadline,
                    })
                  }
                />
              </Inline>
            </Card>
            <Card p="square-regular" space="related">
              <Inline space="related" alignY="center">
                <Stack space="tight">
                  <Text weight="bold">Weekly digest</Text>
                  <Text fontSize="sm" color="text-secondary-muted">
                    Summary of team activity every Monday
                  </Text>
                </Stack>
                <Switch
                  checked={notificationSettings.weeklyDigest}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyDigest: !notificationSettings.weeklyDigest,
                    })
                  }
                />
              </Inline>
            </Card>
            <Card p="square-regular" space="related">
              <Inline space="related" alignY="center">
                <Stack space="tight">
                  <Text weight="bold">Mention notifications</Text>
                  <Text fontSize="sm" color="text-secondary-muted">
                    When someone mentions you in a comment
                  </Text>
                </Stack>
                <Switch
                  checked={notificationSettings.mentions}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      mentions: !notificationSettings.mentions,
                    })
                  }
                />
              </Inline>
            </Card>
            <Card p="square-regular" space="related">
              <Inline space="related" alignY="center">
                <Stack space="tight">
                  <Text weight="bold">Calendar reminders</Text>
                  <Text fontSize="sm" color="text-secondary-muted">
                    15 minutes before scheduled events
                  </Text>
                </Stack>
                <Switch
                  checked={notificationSettings.calendarReminders}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      calendarReminders: !notificationSettings.calendarReminders,
                    })
                  }
                />
              </Inline>
            </Card>
            <Button variant="primary">Save Preferences</Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="280px" space="related">
            <Card p="square-regular" space="related">
              <Stack space="tight">
                <Inline space="tight" alignY="center">
                  <Headline level="3">Slack</Headline>
                  <Badge variant="success">Connected</Badge>
                </Inline>
                <Text fontSize="sm">
                  Sync team messages and notifications
                </Text>
                <Button variant="destructive" size="small">
                  Disconnect
                </Button>
              </Stack>
            </Card>
            <Card p="square-regular" space="related">
              <Stack space="tight">
                <Headline level="3">GitHub</Headline>
                <Badge variant="default">Not connected</Badge>
                <Text fontSize="sm">
                  Track repository activity and pull requests
                </Text>
                <Button variant="primary" size="small">
                  Connect
                </Button>
              </Stack>
            </Card>
            <Card p="square-regular" space="related">
              <Stack space="tight">
                <Headline level="3">Jira</Headline>
                <Badge variant="default">Not connected</Badge>
                <Text fontSize="sm">
                  Sync project management and issues
                </Text>
                <Button variant="primary" size="small">
                  Connect
                </Button>
              </Stack>
            </Card>
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );

  const pageContent = {
    dashboard: renderDashboard(),
    members: renderMembers(),
    projects: renderProjects(),
    calendar: renderCalendar(),
    files: renderFiles(),
    settings: renderSettings(),
  };

  const getBreadcrumbLabel = () => {
    const labels: Record<string, string> = {
      dashboard: 'Dashboard',
      members: 'Members',
      projects: 'Projects',
      calendar: 'Calendar',
      files: 'Files',
      settings: 'Settings',
    };
    return labels[currentPage] || 'Dashboard';
  };

  return (
    <ToastProvider position="bottom-right">
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="lg">
                {teamName}
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav>
              <Sidebar.Item
                href="#"
                isSelected={currentPage === 'dashboard'}
                onPress={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                isSelected={currentPage === 'members'}
                onPress={() => setCurrentPage('members')}
              >
                Members
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                isSelected={currentPage === 'projects'}
                onPress={() => setCurrentPage('projects')}
              >
                Projects
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                isSelected={currentPage === 'calendar'}
                onPress={() => setCurrentPage('calendar')}
              >
                Calendar
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                isSelected={currentPage === 'files'}
                onPress={() => setCurrentPage('files')}
              >
                Files
              </Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item
                href="#"
                isSelected={currentPage === 'settings'}
                onPress={() => setCurrentPage('settings')}
              >
                Settings
              </Sidebar.Item>
            </Sidebar.Nav>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="#" onPress={() => setCurrentPage('dashboard')}>
                  {teamName}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">
                  {getBreadcrumbLabel()}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu label="John Doe">
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="preferences">Preferences</Menu.Item>
                <Menu.Item id="signout" variant="destructive">
                  Sign Out
                </Menu.Item>
              </Menu>
              <Tooltip text="Use the sidebar to navigate between sections.">
                <Button variant="secondary" size="small">
                  Help
                </Button>
              </Tooltip>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <div style={{ padding: '2rem' }}>
              {pageContent[currentPage]}
            </div>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </ToastProvider>
  );
}
