import { useState } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Button,
  Stack,
  Inset,
  Headline,
  Card,
  Tiles,
  Text,
  Table,
  Badge,
  SearchField,
  Select,
  Dialog,
  TextField,
  TextArea,
  Menu,
  Drawer,
  ActionBar,
  Inline,
  useToast,
  DateFormat,
  NumericFormat,
  Tabs,
  Tooltip,
  SectionMessage,
  Switch,
} from '@marigold/components';

type Page = 'dashboard' | 'members' | 'projects' | 'calendar' | 'files' | 'settings';
type ViewMode = 'table' | 'cards';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  status: 'Active' | 'On Leave';
  joinedDate: Date;
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

interface ActivityLog {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: Date;
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2023, 0, 15),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Designer',
    status: 'Active',
    joinedDate: new Date(2023, 3, 20),
  },
  {
    id: '3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Manager',
    status: 'On Leave',
    joinedDate: new Date(2022, 6, 10),
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2023, 9, 5),
  },
  {
    id: '5',
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'QA',
    status: 'Active',
    joinedDate: new Date(2023, 2, 18),
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2023, 5, 12),
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    lead: 'Bob Smith',
    members: 4,
    deadline: new Date(2026, 7, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mobile App',
    lead: 'Alice Johnson',
    members: 5,
    deadline: new Date(2026, 8, 30),
    progress: 45,
    status: 'Active',
  },
  {
    id: '3',
    name: 'API Integration',
    lead: 'David Brown',
    members: 3,
    deadline: new Date(2026, 6, 20),
    progress: 90,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Dashboard V2',
    lead: 'Emma Davis',
    members: 2,
    deadline: new Date(2026, 9, 10),
    progress: 30,
    status: 'On Hold',
  },
  {
    id: '5',
    name: 'Legacy System Cleanup',
    lead: 'Frank Miller',
    members: 3,
    deadline: new Date(2026, 5, 30),
    progress: 100,
    status: 'Completed',
  },
];

const activityData: ActivityLog[] = [
  {
    id: '1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Mobile App',
    date: new Date(2026, 4, 28),
  },
  {
    id: '2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Website Redesign',
    date: new Date(2026, 4, 27),
  },
  {
    id: '3',
    member: 'David Brown',
    action: 'Deploy',
    project: 'API Integration',
    date: new Date(2026, 4, 26),
  },
  {
    id: '4',
    member: 'Emma Davis',
    action: 'Commit',
    project: 'Dashboard V2',
    date: new Date(2026, 4, 25),
  },
  {
    id: '5',
    member: 'Frank Miller',
    action: 'Review',
    project: 'Website Redesign',
    date: new Date(2026, 4, 24),
  },
];

const upcomingEvents = [
  {
    id: '1',
    date: new Date(2026, 5, 25),
    name: 'Sprint Planning',
    type: 'Meeting' as const,
  },
  {
    id: '2',
    date: new Date(2026, 5, 30),
    name: 'Project Deadline',
    type: 'Deadline' as const,
  },
  {
    id: '3',
    date: new Date(2026, 6, 5),
    name: 'Team Lunch',
    type: 'Social' as const,
  },
  {
    id: '4',
    date: new Date(2026, 6, 15),
    name: 'Review Meeting',
    type: 'Meeting' as const,
  },
];

const fileData: FileItem[] = [
  {
    id: '1',
    name: 'Q2 Report',
    type: 'Documents',
    size: 2400000,
    uploadedBy: 'Carol White',
    date: new Date(2026, 4, 20),
  },
  {
    id: '2',
    name: 'Team Photo',
    type: 'Images',
    size: 5200000,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 4, 18),
  },
  {
    id: '3',
    name: 'Budget Spreadsheet',
    type: 'Spreadsheets',
    size: 1800000,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 4, 15),
  },
  {
    id: '4',
    name: 'Product Mockup',
    type: 'Images',
    size: 8900000,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 4, 10),
  },
  {
    id: '5',
    name: 'Design Guidelines',
    type: 'Documents',
    size: 1200000,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 4, 5),
  },
];

const getActionVariant = (action: string) => {
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
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Active':
    case 'On Leave':
      return status === 'Active' ? 'success' : 'warning';
    case 'Completed':
      return 'success';
    case 'On Hold':
      return 'warning';
    default:
      return 'default';
  }
};

const getEventVariant = (type: string) => {
  switch (type) {
    case 'Meeting':
      return 'info';
    case 'Deadline':
      return 'warning';
    case 'Social':
      return 'success';
    default:
      return 'default';
  }
};

const DashboardPage = ({ memberCount }: { memberCount: number }) => (
  <Stack space={4}>
    <Headline level={1}>Team Overview</Headline>

    <Tiles tilesWidth="200px" space={3}>
      <Card p={4}>
        <Stack space={2} alignX="center">
          <Text weight="bold" size="lg">
            Members
          </Text>
          <Text size="xl" weight="bold">
            {memberCount}
          </Text>
        </Stack>
      </Card>
      <Card p={4}>
        <Stack space={2} alignX="center">
          <Text weight="bold" size="lg">
            Active Projects
          </Text>
          <Text size="xl" weight="bold">
            5
          </Text>
        </Stack>
      </Card>
      <Card p={4}>
        <Stack space={2} alignX="center">
          <Text weight="bold" size="lg">
            Upcoming Deadlines
          </Text>
          <Text size="xl" weight="bold">
            8
          </Text>
        </Stack>
      </Card>
      <Card p={4}>
        <Stack space={2} alignX="center">
          <Text weight="bold" size="lg">
            Hours This Week
            <Tooltip.Trigger>
              <span role="img" aria-label="info">
                {' '}
                ℹ️
              </span>
              <Tooltip>Aggregate of all team members.</Tooltip>
            </Tooltip.Trigger>
          </Text>
          <Text size="xl" weight="bold">
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
          {activityData.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.member}</Table.Cell>
              <Table.Cell>
                <Badge variant={getActionVariant(item.action)}>
                  {item.action}
                </Badge>
              </Table.Cell>
              <Table.Cell>{item.project}</Table.Cell>
              <Table.Cell>
                <DateFormat value={item.date} year="numeric" month="long" day="numeric" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>

    <SectionMessage variant="info">
      Sprint 14 ends in 3 days. Review the project board for outstanding
      tasks.
    </SectionMessage>
  </Stack>
);

const MembersPage = ({
  members,
  onMembersChange,
}: {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
}) => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer' as Member['role'],
    startDate: null as any,
    bio: '',
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === 'All Roles' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddMember = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'error',
      });
      return;
    }

    const newMember: Member = {
      id: Math.random().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'Active',
      joinedDate: new Date(),
    };

    if (editingMember) {
      onMembersChange(
        members.map((m) => (m.id === editingMember.id ? { ...newMember, id: m.id } : m))
      );
      setEditingMember(null);
      addToast({
        title: 'Member Updated',
        description: `${formData.name} has been updated.`,
        variant: 'success',
      });
    } else {
      onMembersChange([...members, newMember]);
      addToast({
        title: 'Member Added',
        description: `${formData.name} has been added to the team.`,
        variant: 'success',
      });
    }

    setFormData({ name: '', email: '', role: 'Developer', startDate: null, bio: '' });
  };

  const handleRemoveMember = (id: string) => {
    const memberToRemove = members.find((m) => m.id === id);
    onMembersChange(members.filter((m) => m.id !== id));
    addToast({
      title: 'Member Removed',
      description: `${memberToRemove?.name} has been removed.`,
      variant: 'success',
    });
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      startDate: null,
      bio: '',
    });
  };

  const selectedMember = filteredMembers.find((m) => m.id === selectedMemberId);

  return (
    <Stack space={4}>
      <Headline level={1}>Team Members</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search members..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Select
          label="Role"
          selectedKey={roleFilter}
          onSelectionChange={(key) => setRoleFilter(key as string)}
        >
          <Select.Option id="All Roles">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <Button
          variant={viewMode === 'table' ? 'primary' : 'secondary'}
          onPress={() => setViewMode('table')}
        >
          Table
        </Button>
        <Button
          variant={viewMode === 'cards' ? 'primary' : 'secondary'}
          onPress={() => setViewMode('cards')}
        >
          Cards
        </Button>
        <Dialog.Trigger>
          <Button variant="primary">Add Member</Button>
          <Dialog size="small">
            <Dialog.Title>
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(val) =>
                    setFormData({ ...formData, name: val })
                  }
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(val) =>
                    setFormData({ ...formData, email: val })
                  }
                />
                <Select
                  label="Role"
                  selectedKey={formData.role}
                  onSelectionChange={(key) =>
                    setFormData({
                      ...formData,
                      role: key as Member['role'],
                    })
                  }
                >
                  <Select.Option id="Developer">Developer</Select.Option>
                  <Select.Option id="Designer">Designer</Select.Option>
                  <Select.Option id="Manager">Manager</Select.Option>
                  <Select.Option id="QA">QA</Select.Option>
                </Select>
                <TextArea
                  label="Bio"
                  value={formData.bio}
                  onChange={(val) =>
                    setFormData({ ...formData, bio: val })
                  }
                  rows={3}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  handleAddMember();
                }}
                slot="close"
              >
                {editingMember ? 'Update' : 'Add'}
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team Members">
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
              <Table.Row
                key={member.id}
              >
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStatusVariant(member.status)}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat
                    value={member.joinedDate}
                    year="numeric"
                    month="long"
                    day="numeric"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Menu>
                    <Menu.Item
                      id="edit"
                      onAction={() => openEditDialog(member)}
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
                  </Menu>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Tiles tilesWidth="250px" space={3}>
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
            >
              <Stack space={2}>
                <Headline level={3}>{member.name}</Headline>
                <Badge variant="default">{member.role}</Badge>
                <Text size="small">{member.email}</Text>
                <Button
                  size="small"
                  variant="secondary"
                  onPress={() => {
                    setSelectedMemberId(member.id);
                    setShowDetailPanel(true);
                  }}
                >
                  View Profile
                </Button>
                <Menu>
                  <Menu.Item
                    id="edit"
                    onAction={() => openEditDialog(member)}
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
                </Menu>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {showDetailPanel && selectedMember && (
        <Drawer>
            <Drawer.Title>{selectedMember.name}</Drawer.Title>
            <Stack space={3}>
              <Text>
                <strong>Role:</strong> {selectedMember.role}
              </Text>
              <Text>
                <strong>Email:</strong> {selectedMember.email}
              </Text>
              <Text>
                <strong>Status:</strong>{' '}
                <Badge variant={getStatusVariant(selectedMember.status)}>
                  {selectedMember.status}
                </Badge>
              </Text>
              <Text>
                <strong>Joined:</strong>{' '}
                <DateFormat
                  value={selectedMember.joinedDate}
                  year="numeric"
                  month="long"
                  day="numeric"
                />
              </Text>
            </Stack>
            <Drawer.Actions>
              <Button
                variant="secondary"
                onPress={() => setShowDetailPanel(false)}
              >
                Close
              </Button>
            </Drawer.Actions>
        </Drawer>
      )}
    </Stack>
  );
};

const ProjectsPage = ({ projects: initialProjects }: { projects: Project[] }) => {
  const { addToast } = useToast();
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleArchiveSelected = () => {
    setProjects(
      projects.filter((p) => !selectedIds.has(p.id))
    );
    addToast({
      title: 'Projects Archived',
      description: `${selectedIds.size} project(s) archived.`,
      variant: 'success',
    });
    setSelectedIds(new Set());
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Projects</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search projects..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      {selectedIds.size > 0 && (
        <ActionBar>
          <Text>
            {selectedIds.size} project{selectedIds.size !== 1 ? 's' : ''} selected
          </Text>
          <Button
            variant="destructive"
            onPress={handleArchiveSelected}
          >
            Archive Selected
          </Button>
        </ActionBar>
      )}

      <Table aria-label="Projects">
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
            <Table.Row key={project.id}>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>{project.members}</Table.Cell>
              <Table.Cell>
                <DateFormat
                  value={project.deadline}
                  year="numeric"
                  month="long"
                  day="numeric"
                />
              </Table.Cell>
              <Table.Cell>{project.progress}%</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const CalendarPage = () => (
  <Stack space={4}>
    <Headline level={1}>Team Calendar</Headline>

    <Card p={4}>
      <Text>Calendar view - Current month</Text>
    </Card>

    <Stack space={2}>
      <Headline level={2}>Upcoming Events</Headline>
      <Stack space={2}>
        {upcomingEvents.map((event) => (
          <Card key={event.id} p={3}>
            <Inline space={2}>
              <Stack space={1}>
                <Text weight="bold">
                  <DateFormat
                    value={event.date}
                    year="numeric"
                    month="long"
                    day="numeric"
                  />
                </Text>
                <Text>{event.name}</Text>
              </Stack>
              <Badge variant={getEventVariant(event.type)}>
                {event.type}
              </Badge>
            </Inline>
          </Card>
        ))}
      </Stack>
    </Stack>
  </Stack>
);

const FilesPage = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [files, setFiles] = useState(fileData);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || file.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    addToast({
      title: 'File Deleted',
      description: 'The file has been deleted.',
      variant: 'success',
    });
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search files..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Select
          label="Type"
          selectedKey={typeFilter}
          onSelectionChange={(key) => setTypeFilter(key as string)}
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Dialog.Trigger>
          <Button variant="primary">Upload</Button>
          <Dialog size="small">
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <Text>Select files to upload</Text>
                <Select label="Category" selectedKey="Documents" onSelectionChange={() => {}}>
                  <Select.Option id="Documents">Documents</Select.Option>
                  <Select.Option id="Images">Images</Select.Option>
                  <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
                </Select>
                <TextArea label="Description" rows={3} />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button
                variant="primary"
                slot="close"
                onPress={() =>
                  addToast({
                    title: 'Files uploaded successfully.',
                    variant: 'success',
                  })
                }
              >
                Upload
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
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
          {filteredFiles.map((file) => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat
                  value={file.size}
                  notation="compact"
                  style="unit"
                  unit="byte"
                  unitDisplay="narrow"
                />
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat
                  value={file.date}
                  year="numeric"
                  month="long"
                  day="numeric"
                />
              </Table.Cell>
              <Table.Cell>
                <Menu>
                  <Menu.Item id="download">Download</Menu.Item>
                  <Menu.Item id="rename">Rename</Menu.Item>
                  <Menu.Item
                    id="delete"
                    variant="destructive"
                    onAction={() => handleDelete(file.id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

const SettingsPage = ({ teamName, onTeamNameChange }: { teamName: string; onTeamNameChange: (name: string) => void }) => {
  const { addToast } = useToast();
  const [timezone, setTimezone] = useState<string>('UTC');
  const [dateFormat, setDateFormat] = useState<string>('MM/DD/YYYY');
  const [localTeamName, setLocalTeamName] = useState(teamName);
  const [notificationSettings, setNotificationSettings] = useState({
    newMember: true,
    projectDeadline: true,
    weeklyDigest: true,
    mentions: true,
    calendarReminders: false,
  });

  const handleSaveGeneral = () => {
    onTeamNameChange(localTeamName);
    addToast({
      title: 'Settings updated.',
      variant: 'success',
    });
  };

  const handleSaveNotifications = () => {
    addToast({
      title: 'Notification preferences saved.',
      variant: 'success',
    });
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
          <Stack space={3}>
            <TextField
              label="Team Name"
              value={localTeamName}
              onChange={setLocalTeamName}
            />
            <TextField label="Description" />
            <Select label="Default Timezone" selectedKey={timezone} onSelectionChange={(key) => setTimezone(key as string)}>
              <Select.Option id="UTC">UTC</Select.Option>
              <Select.Option id="CET">CET</Select.Option>
              <Select.Option id="EST">EST</Select.Option>
              <Select.Option id="PST">PST</Select.Option>
            </Select>
            <Select
              label="Date Format"
              selectedKey={dateFormat}
              onSelectionChange={(key) => setDateFormat(key as string)}
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button variant="primary" onPress={handleSaveGeneral}>
              Save
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={3}>
            <Switch
              label="New member joins"
              selected={notificationSettings.newMember}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  newMember: val,
                })
              }
            />
            <Text size="small">Get notified when someone joins the team</Text>

            <Switch
              label="Project deadline approaching"
              selected={notificationSettings.projectDeadline}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  projectDeadline: val,
                })
              }
            />
            <Text size="small">Reminder 3 days before deadline</Text>

            <Switch
              label="Weekly digest"
              selected={notificationSettings.weeklyDigest}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  weeklyDigest: val,
                })
              }
            />
            <Text size="small">Summary of team activity every Monday</Text>

            <Switch
              label="Mention notifications"
              selected={notificationSettings.mentions}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  mentions: val,
                })
              }
            />
            <Text size="small">When someone mentions you in a comment</Text>

            <Switch
              label="Calendar reminders"
              selected={notificationSettings.calendarReminders}
              onChange={(val) =>
                setNotificationSettings({
                  ...notificationSettings,
                  calendarReminders: val,
                })
              }
            />
            <Text size="small">15 minutes before scheduled events</Text>

            <Button
              variant="primary"
              onPress={handleSaveNotifications}
            >
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="250px" space={3}>
            <Card p={4}>
              <Stack space={2}>
                <Headline level={3}>Slack</Headline>
                <Badge variant="success">Connected</Badge>
                <Text size="small">Sync team messages</Text>
                <Button variant="secondary">Disconnect</Button>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={2}>
                <Headline level={3}>GitHub</Headline>
                <Badge variant="default">Not Connected</Badge>
                <Text size="small">Sync repositories</Text>
                <Button variant="primary">Connect</Button>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={2}>
                <Headline level={3}>Jira</Headline>
                <Badge variant="default">Not Connected</Badge>
                <Text size="small">Sync project issues</Text>
                <Button variant="primary">Connect</Button>
              </Stack>
            </Card>
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [members, setMembers] = useState(initialMembers);
  const [teamName, setTeamName] = useState('TeamHub');

  const getBreadcrumbLabel = () => {
    const labels: Record<Page, string> = {
      dashboard: 'Dashboard',
      members: 'Members',
      projects: 'Projects',
      calendar: 'Calendar',
      files: 'Files',
      settings: 'Settings',
    };
    return labels[currentPage];
  };

  return (
    <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>{teamName}</Sidebar.Header>
            <Sidebar.Nav>
              <Sidebar.Item
                href="#"
                aria-current={currentPage === 'dashboard'}
                onPress={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                aria-current={currentPage === 'members'}
                onPress={() => setCurrentPage('members')}
              >
                Members
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                aria-current={currentPage === 'projects'}
                onPress={() => setCurrentPage('projects')}
              >
                Projects
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                aria-current={currentPage === 'calendar'}
                onPress={() => setCurrentPage('calendar')}
              >
                Calendar
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                aria-current={currentPage === 'files'}
                onPress={() => setCurrentPage('files')}
              >
                Files
              </Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item
                href="#"
                aria-current={currentPage === 'settings'}
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
                <Breadcrumbs.Item href="#">TeamHub</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">
                  {getBreadcrumbLabel()}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Tooltip.Trigger>
                <Menu label="John Doe">
                  <Menu.Item id="profile">Profile</Menu.Item>
                  <Menu.Item id="preferences">Preferences</Menu.Item>
                  <Menu.Item id="signout">Sign Out</Menu.Item>
                </Menu>
                <Tooltip>Account settings</Tooltip>
              </Tooltip.Trigger>
              <Tooltip.Trigger>
                <Dialog.Trigger>
                  <Button variant="ghost" size="icon">
                    ?
                  </Button>
                  <Dialog size="small">
                    <Dialog.Title>Help</Dialog.Title>
                    <Dialog.Content>
                      <Text>
                        Use the sidebar to navigate between sections.
                      </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button variant="secondary" slot="close">
                        Close
                      </Button>
                    </Dialog.Actions>
                  </Dialog>
                </Dialog.Trigger>
                <Tooltip>Help</Tooltip>
              </Tooltip.Trigger>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={4}>
              {currentPage === 'dashboard' && (
                <DashboardPage memberCount={members.length} />
              )}
              {currentPage === 'members' && (
                <MembersPage
                  members={members}
                  onMembersChange={setMembers}
                />
              )}
              {currentPage === 'projects' && (
                <ProjectsPage projects={initialProjects} />
              )}
              {currentPage === 'calendar' && <CalendarPage />}
              {currentPage === 'files' && <FilesPage />}
              {currentPage === 'settings' && (
                <SettingsPage
                  teamName={teamName}
                  onTeamNameChange={setTeamName}
                />
              )}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
  );
};

export default TestApp;
