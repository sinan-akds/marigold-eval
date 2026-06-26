'use client';
import { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Button,
  Stack,
  Inline,
  Headline,
  Text,
  Card,
  Table,
  Badge,
  Menu,
  Dialog,
  TextField,
  Select,
  TextArea,
  SearchField,
  Tabs,
  Checkbox,
  ActionBar,
  SectionMessage,
  ToastProvider,
  useToast,
  NumericFormat,
  DateFormat,
  Tiles,
  Inset,
  Tooltip,
} from '@marigold/components';
import { RouterProvider } from '@marigold/components';

interface Member {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  email: string;
  status: 'Active' | 'On Leave';
  joinDate: Date;
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

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: Date;
}

interface Event {
  id: string;
  date: Date;
  name: string;
  type: 'Meeting' | 'Deadline' | 'Social';
}

const Dashboard = ({ memberCount }: { memberCount: number }) => {
  const recentActivity = [
    { member: 'Alice Johnson', action: 'Commit', project: 'Website', date: new Date('2026-05-28') },
    { member: 'Bob Smith', action: 'Review', project: 'API', date: new Date('2026-05-27') },
    { member: 'Carol Davis', action: 'Deploy', project: 'Dashboard', date: new Date('2026-05-26') },
    { member: 'David Wilson', action: 'Commit', project: 'Mobile', date: new Date('2026-05-25') },
    { member: 'Eve Martinez', action: 'Review', project: 'Website', date: new Date('2026-05-24') },
  ];

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'Commit': return 'info';
      case 'Review': return 'warning';
      case 'Deploy': return 'success';
      default: return 'default';
    }
  };

  return (
    <Stack space={6}>
      <Headline level="2">Team Overview</Headline>

      <Tiles tilesWidth="200px" space={4}>
        <Card>
          <Stack space={2}>
            <Text size="small">Members</Text>
            <Text weight="bold" size="xl">{memberCount}</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="small">Active Projects</Text>
            <Text weight="bold" size="xl">5</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Text size="small">Upcoming Deadlines</Text>
            <Text weight="bold" size="xl">8</Text>
          </Stack>
        </Card>
        <Card>
          <Stack space={2}>
            <Inline space={1} alignY="center">
              <Text size="small">Hours This Week</Text>
              <Tooltip>
                <Tooltip.Trigger>?</Tooltip.Trigger>
              </Tooltip>
            </Inline>
            <Text weight="bold" size="xl">
              <NumericFormat value={342} />
            </Text>
          </Stack>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level="3">Recent Activity</Headline>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {recentActivity.map((row) => (
              <Table.Row key={row.member}>
                <Table.Cell>{row.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getActionVariant(row.action)}>
                    {row.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{row.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat
                    value={row.date}
                    year="numeric"
                    month="long"
                    day="numeric"
                  />
                </Table.Cell>
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
};

const Members = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Developer',
      email: 'alice@example.com',
      status: 'Active',
      joinDate: new Date('2023-01-15'),
      bio: 'Full-stack developer',
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'Designer',
      email: 'bob@example.com',
      status: 'Active',
      joinDate: new Date('2023-06-20'),
      bio: 'UI/UX designer',
    },
    {
      id: '3',
      name: 'Carol Davis',
      role: 'Manager',
      email: 'carol@example.com',
      status: 'Active',
      joinDate: new Date('2022-03-10'),
      bio: 'Project manager',
    },
    {
      id: '4',
      name: 'David Wilson',
      role: 'Developer',
      email: 'david@example.com',
      status: 'On Leave',
      joinDate: new Date('2023-09-05'),
      bio: 'Backend developer',
    },
    {
      id: '5',
      name: 'Eve Martinez',
      role: 'QA',
      email: 'eve@example.com',
      status: 'Active',
      joinDate: new Date('2024-01-12'),
      bio: 'QA engineer',
    },
    {
      id: '6',
      name: 'Frank Brown',
      role: 'Developer',
      email: 'frank@example.com',
      status: 'Active',
      joinDate: new Date('2024-02-01'),
      bio: 'Frontend developer',
    },
  ]);

  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const getRoleFromId = (id: string) => {
    switch (id) {
      case 'dev': return 'Developer';
      case 'des': return 'Designer';
      case 'mgr': return 'Manager';
      case 'qa': return 'QA';
      default: return null;
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const selectedRole = getRoleFromId(roleFilter);
      const matchesRole = roleFilter === 'all' || m.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, roleFilter]);

  const handleAddMember = (newMember: Omit<Member, 'id'>) => {
    const member: Member = {
      ...newMember,
      id: String(members.length + 1),
    };
    setMembers([...members, member]);
    addToast({ title: 'Member added successfully', variant: 'success' });
  };

  const handleEditMember = (updatedMember: Member) => {
    setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    setEditingMember(null);
    addToast({ title: 'Member updated', variant: 'success' });
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
    addToast({ title: 'Member removed', variant: 'success' });
  };

  return (
    <Stack space={4}>
      <Headline level="2">Team Members</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search members..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Select
          value={roleFilter}
          onSelectionChange={(value) => setRoleFilter(String(value))}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="dev">Developer</Select.Option>
          <Select.Option id="des">Designer</Select.Option>
          <Select.Option id="mgr">Manager</Select.Option>
          <Select.Option id="qa">QA</Select.Option>
        </Select>
        <Inline space={1} alignY="center">
          <Text size="small">View:</Text>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </Inline>
        <Dialog.Trigger>
          <Button variant="primary">Add Member</Button>
          <Dialog size="small">
            <Dialog.Title>{editingMember ? 'Edit Member' : 'Add Member'}</Dialog.Title>
            <MemberForm
              member={editingMember}
              onSubmit={(data) => {
                if (editingMember) {
                  handleEditMember({ ...editingMember, ...data });
                } else {
                  handleAddMember(data);
                }
              }}
            />
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team members">
          <Table.Header>
            <Table.Column>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map((member) => (
              <Table.Row key={member.id}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat
                    value={member.joinDate}
                    year="numeric"
                    month="long"
                    day="numeric"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Menu onAction={(action) => {
                    if (action === 'edit') {
                      setEditingMember(member);
                    } else if (action === 'remove') {
                      handleRemoveMember(member.id);
                    }
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
        <Tiles tilesWidth="220px" space={4}>
          {filteredMembers.map((member) => (
            <Card key={member.id}>
              <Stack space={3}>
                <Stack space={1}>
                  <Text weight="bold">{member.name}</Text>
                  <Badge variant="default">{member.role}</Badge>
                </Stack>
                <Text size="small">{member.email}</Text>
                <Inline space={2}>
                  <Button size="small" variant="secondary">Message</Button>
                  <Button size="small" variant="secondary">Profile</Button>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}
    </Stack>
  );
};

const MemberForm = ({
  member,
  onSubmit,
}: {
  member: Member | null;
  onSubmit: (data: Omit<Member, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'Developer',
    status: member?.status || 'Active',
    joinDate: member?.joinDate || new Date(),
    bio: member?.bio || '',
  });

  return (
    <>
      <Dialog.Content>
        <Stack space={3}>
          <TextField
            label="Full Name"
            required
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />
          <Select
            label="Role"
            value={formData.role}
            onSelectionChange={(value) =>
              setFormData({
                ...formData,
                role: value as 'Developer' | 'Designer' | 'Manager' | 'QA',
              })
            }
          >
            <Select.Option id="dev">Developer</Select.Option>
            <Select.Option id="des">Designer</Select.Option>
            <Select.Option id="mgr">Manager</Select.Option>
            <Select.Option id="qa">QA</Select.Option>
          </Select>
          <TextArea
            label="Bio"
            value={formData.bio}
            onChange={(value) => setFormData({ ...formData, bio: value })}
          />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button variant="secondary" slot="close">Cancel</Button>
        <Button
          variant="primary"
          onPress={() => onSubmit(formData)}
          slot="close"
        >
          {member ? 'Update' : 'Add'}
        </Button>
      </Dialog.Actions>
    </>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      lead: 'Alice Johnson',
      members: 5,
      deadline: new Date('2026-06-30'),
      progress: 75,
      status: 'Active',
    },
    {
      id: '2',
      name: 'API Integration',
      lead: 'David Wilson',
      members: 3,
      deadline: new Date('2026-07-15'),
      progress: 50,
      status: 'Active',
    },
    {
      id: '3',
      name: 'Mobile App v2',
      lead: 'Frank Brown',
      members: 4,
      deadline: new Date('2026-08-01'),
      progress: 25,
      status: 'Active',
    },
    {
      id: '4',
      name: 'Dashboard Redesign',
      lead: 'Bob Smith',
      members: 2,
      deadline: new Date('2026-05-30'),
      progress: 100,
      status: 'Completed',
    },
    {
      id: '5',
      name: 'Legacy System Migration',
      lead: 'Carol Davis',
      members: 6,
      deadline: new Date('2026-09-01'),
      progress: 30,
      status: 'On Hold',
    },
  ]);

  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [projects, searchTerm]
  );

  const handleArchive = () => {
    setProjects(
      projects.filter((p) => !selectedProjects.has(p.id))
    );
    setSelectedProjects(new Set());
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'info';
      case 'On Hold': return 'warning';
      case 'Completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <Stack space={4}>
      <Headline level="2">Projects</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search projects..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Dialog.Trigger>
          <Button variant="primary">New Project</Button>
          <Dialog size="small">
            <Dialog.Title>New Project</Dialog.Title>
            <Dialog.Content>
              <Text>Create a new project</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button variant="primary">Create</Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {selectedProjects.size > 0 && (
        <ActionBar>
          <Button variant="destructive" onPress={handleArchive}>
            Archive Selected
          </Button>
          <Button variant="secondary">Export</Button>
        </ActionBar>
      )}

      <Table aria-label="Projects">
        <Table.Header>
          <Table.Column width={32}>
            <Checkbox
              checked={selectedProjects.size === filteredProjects.length && filteredProjects.length > 0}
              onChange={(checked) => {
                if (checked) {
                  setSelectedProjects(new Set(filteredProjects.map((p) => p.id)));
                } else {
                  setSelectedProjects(new Set());
                }
              }}
            />
          </Table.Column>
          <Table.Column>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredProjects.map((project) => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onChange={(checked) => {
                    const newSelected = new Set(selectedProjects);
                    if (checked) {
                      newSelected.add(project.id);
                    } else {
                      newSelected.delete(project.id);
                    }
                    setSelectedProjects(newSelected);
                  }}
                />
              </Table.Cell>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={project.members} />
              </Table.Cell>
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

const Calendar = () => {
  const events: Event[] = [
    {
      id: '1',
      date: new Date('2026-06-25'),
      name: 'Team Standup',
      type: 'Meeting',
    },
    {
      id: '2',
      date: new Date('2026-06-28'),
      name: 'Sprint Review',
      type: 'Meeting',
    },
    {
      id: '3',
      date: new Date('2026-06-30'),
      name: 'Q2 Deadline',
      type: 'Deadline',
    },
    {
      id: '4',
      date: new Date('2026-07-05'),
      name: 'Team Lunch',
      type: 'Social',
    },
  ];

  const getEventVariant = (type: string) => {
    switch (type) {
      case 'Meeting': return 'info';
      case 'Deadline': return 'warning';
      case 'Social': return 'success';
      default: return 'default';
    }
  };

  return (
    <Stack space={4}>
      <Headline level="2">Team Calendar</Headline>

      <Card>
        <Text>Calendar view for June 2026</Text>
      </Card>

      <Stack space={2}>
        <Headline level="3">Upcoming Events</Headline>
        <Stack space={2}>
          {events.map((event) => (
            <Inline key={event.id} space={3} alignY="center">
              <DateFormat
                value={event.date}
                month="short"
                day="numeric"
              />
              <Text weight="bold">{event.name}</Text>
              <Badge variant={getEventVariant(event.type)}>
                {event.type}
              </Badge>
            </Inline>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const Files = () => {
  const { addToast } = useToast();
  const [files, setFiles] = useState<File[]>([
    {
      id: '1',
      name: 'project-proposal.pdf',
      type: 'Documents',
      size: 1024 * 500,
      uploadedBy: 'Alice Johnson',
      date: new Date('2026-05-20'),
    },
    {
      id: '2',
      name: 'team-photo.jpg',
      type: 'Images',
      size: 1024 * 1024 * 2.4,
      uploadedBy: 'Carol Davis',
      date: new Date('2026-05-19'),
    },
    {
      id: '3',
      name: 'budget.xlsx',
      type: 'Spreadsheets',
      size: 1024 * 256,
      uploadedBy: 'Frank Brown',
      date: new Date('2026-05-18'),
    },
    {
      id: '4',
      name: 'meeting-notes.docx',
      type: 'Documents',
      size: 1024 * 128,
      uploadedBy: 'Bob Smith',
      date: new Date('2026-05-17'),
    },
    {
      id: '5',
      name: 'design-system.png',
      type: 'Images',
      size: 1024 * 1024 * 3.5,
      uploadedBy: 'David Wilson',
      date: new Date('2026-05-16'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const getFileTypeFromId = (id: string) => {
    switch (id) {
      case 'doc': return 'Documents';
      case 'img': return 'Images';
      case 'spr': return 'Spreadsheets';
      default: return null;
    }
  };

  const filteredFiles = useMemo(
    () =>
      files.filter((f) => {
        const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
        const selectedType = getFileTypeFromId(typeFilter);
        const matchesType = typeFilter === 'all' || f.type === selectedType;
        return matchesSearch && matchesType;
      }),
    [files, searchTerm, typeFilter]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  };

  return (
    <Stack space={4}>
      <Headline level="2">Shared Files</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search files..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Select value={typeFilter} onSelectionChange={(v) => setTypeFilter(String(v))}>
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="doc">Documents</Select.Option>
          <Select.Option id="img">Images</Select.Option>
          <Select.Option id="spr">Spreadsheets</Select.Option>
        </Select>
        <Dialog.Trigger>
          <Button variant="primary">Upload</Button>
          <Dialog size="small">
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField label="File" type="file" />
                <TextArea label="Description" placeholder="File description" />
                <Select label="Category" defaultValue="doc">
                  <Select.Option id="doc">Documents</Select.Option>
                  <Select.Option id="img">Images</Select.Option>
                  <Select.Option id="spr">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">Cancel</Button>
              <Button
                variant="primary"
                onPress={() => {
                  addToast({
                    title: 'Files uploaded successfully',
                    variant: 'success',
                  });
                }}
                slot="close"
              >
                Upload
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Shared files">
        <Table.Header>
          <Table.Column>File Name</Table.Column>
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
              <Table.Cell>{formatFileSize(file.size)}</Table.Cell>
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
                <Menu onAction={(action) => {
                  if (action === 'delete') {
                    setFiles(files.filter((f) => f.id !== file.id));
                  }
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
};

const Settings = ({ teamName, onTeamNameChange }: { teamName: string; onTeamNameChange: (name: string) => void }) => {
  const { addToast } = useToast();
  const [localTeamName, setLocalTeamName] = useState(teamName);
  const [integrations, setIntegrations] = useState({
    slack: { name: 'Slack', connected: true },
    github: { name: 'GitHub', connected: false },
    jira: { name: 'Jira', connected: false },
  });

  return (
    <Stack space={4}>
      <Headline level="2">Team Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <Stack space={3}>
              <TextField
                label="Team Name"
                value={localTeamName}
                onChange={setLocalTeamName}
              />
              <TextArea
                label="Description"
                placeholder="Team description"
                defaultValue="We build amazing products"
              />
              <Select label="Default Timezone" defaultValue="utc">
                <Select.Option id="utc">UTC</Select.Option>
                <Select.Option id="cet">CET</Select.Option>
                <Select.Option id="est">EST</Select.Option>
                <Select.Option id="pst">PST</Select.Option>
              </Select>
              <Select label="Date Format" defaultValue="mdy">
                <Select.Option id="mdy">MM/DD/YYYY</Select.Option>
                <Select.Option id="dmy">DD.MM.YYYY</Select.Option>
                <Select.Option id="ymd">YYYY-MM-DD</Select.Option>
              </Select>
            </Stack>
            <Button
              variant="primary"
              onPress={() => {
                onTeamNameChange(localTeamName);
                addToast({ title: 'Settings updated', variant: 'success' });
              }}
            >
              Save
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={3}>
            <Checkbox
              label="New member joins"
              description="Get notified when someone joins the team"
              defaultChecked
            />
            <Checkbox
              label="Project deadline approaching"
              description="Reminder 3 days before deadline"
              defaultChecked
            />
            <Checkbox
              label="Weekly digest"
              description="Summary of team activity every Monday"
              defaultChecked
            />
            <Checkbox
              label="Mention notifications"
              description="When someone mentions you in a comment"
              defaultChecked
            />
            <Checkbox
              label="Calendar reminders"
              description="15 minutes before scheduled events"
              defaultChecked
            />
            <Button
              variant="primary"
              onPress={() => {
                addToast({ title: 'Preferences saved', variant: 'success' });
              }}
            >
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="240px" space={4}>
            {Object.entries(integrations).map(([key, integration]) => (
              <Card key={key}>
                <Stack space={3}>
                  <Stack space={1}>
                    <Text weight="bold">{integration.name}</Text>
                    <Badge
                      variant={integration.connected ? 'success' : 'default'}
                    >
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </Badge>
                  </Stack>
                  <Text size="small">
                    {integration.connected
                      ? `${integration.name} is connected to your account`
                      : `Connect ${integration.name} to sync data`}
                  </Text>
                  <Button
                    variant={integration.connected ? 'destructive' : 'primary'}
                    size="small"
                    onPress={() => {
                      if (integration.connected) {
                        setIntegrations({
                          ...integrations,
                          [key]: { ...integration, connected: false },
                        });
                        addToast({
                          title: `${integration.name} disconnected`,
                          variant: 'info',
                        });
                      } else {
                        setIntegrations({
                          ...integrations,
                          [key]: { ...integration, connected: true },
                        });
                        addToast({
                          title: `${integration.name} connected`,
                          variant: 'success',
                        });
                      }
                    }}
                  >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [teamName, setTeamName] = useState('TeamHub');
  const [_members] = useState<Member[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'Developer',
      email: 'alice@example.com',
      status: 'Active',
      joinDate: new Date('2023-01-15'),
      bio: 'Full-stack developer',
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'Designer',
      email: 'bob@example.com',
      status: 'Active',
      joinDate: new Date('2023-06-20'),
      bio: 'UI/UX designer',
    },
    {
      id: '3',
      name: 'Carol Davis',
      role: 'Manager',
      email: 'carol@example.com',
      status: 'Active',
      joinDate: new Date('2022-03-10'),
      bio: 'Project manager',
    },
    {
      id: '4',
      name: 'David Wilson',
      role: 'Developer',
      email: 'david@example.com',
      status: 'On Leave',
      joinDate: new Date('2023-09-05'),
      bio: 'Backend developer',
    },
    {
      id: '5',
      name: 'Eve Martinez',
      role: 'QA',
      email: 'eve@example.com',
      status: 'Active',
      joinDate: new Date('2024-01-12'),
      bio: 'QA engineer',
    },
    {
      id: '6',
      name: 'Frank Brown',
      role: 'Developer',
      email: 'frank@example.com',
      status: 'Active',
      joinDate: new Date('2024-02-01'),
      bio: 'Frontend developer',
    },
  ]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'projects', label: 'Projects' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'files', label: 'Files' },
  ];

  const getBreadcrumbs = () => {
    const labels: { [key: string]: string } = {
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
    <>
      <ToastProvider position="bottom-right" />
      <RouterProvider navigate={setCurrentPage}>
        <Sidebar.Provider defaultOpen>
          <AppLayout>
            <AppLayout.Sidebar>
              <Sidebar.Header>
                <Text weight="bold" size="large">
                  {teamName}
                </Text>
              </Sidebar.Header>
              <Sidebar.Nav current={currentPage}>
                {navItems.map((item) => (
                  <Sidebar.Item key={item.id} href={item.id}>
                    {item.label}
                  </Sidebar.Item>
                ))}
                <Sidebar.Separator />
                <Sidebar.Item href="settings">Settings</Sidebar.Item>
              </Sidebar.Nav>
            </AppLayout.Sidebar>

            <AppLayout.Header>
              <TopNavigation>
                <TopNavigation.Start>
                  <Sidebar.Toggle />
                </TopNavigation.Start>
                <TopNavigation.Middle aria-label="Page location">
                  <Breadcrumbs>
                    <Breadcrumbs.Item href="dashboard">TeamHub</Breadcrumbs.Item>
                    <Breadcrumbs.Item href={currentPage}>
                      {getBreadcrumbs()}
                    </Breadcrumbs.Item>
                  </Breadcrumbs>
                </TopNavigation.Middle>
                <TopNavigation.End aria-label="User actions">
                  <Menu label="John Doe">
                    <Menu.Item id="profile">Profile</Menu.Item>
                    <Menu.Item id="preferences">Preferences</Menu.Item>
                    <Menu.Item id="signout" variant="destructive">
                      Sign Out
                    </Menu.Item>
                  </Menu>
                  <Dialog.Trigger>
                    <Button variant="secondary" size="small">
                      Help
                    </Button>
                    <Dialog size="xsmall">
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
                </TopNavigation.End>
              </TopNavigation>
            </AppLayout.Header>

            <AppLayout.Main>
              <Inset space={4}>
                {currentPage === 'dashboard' && (
                  <Dashboard memberCount={_members.length} />
                )}
                {currentPage === 'members' && <Members />}
                {currentPage === 'projects' && <Projects />}
                {currentPage === 'calendar' && <Calendar />}
                {currentPage === 'files' && <Files />}
                {currentPage === 'settings' && (
                  <Settings
                    teamName={teamName}
                    onTeamNameChange={setTeamName}
                  />
                )}
              </Inset>
            </AppLayout.Main>
          </AppLayout>
        </Sidebar.Provider>
      </RouterProvider>
    </>
  );
};

export default TestApp;
