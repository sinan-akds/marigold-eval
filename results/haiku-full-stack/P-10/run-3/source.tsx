'use client';

import { useState, useMemo } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Button,
  Dialog,
  Table,
  Card,
  Badge,
  Stack,
  Inline,
  Columns,
  Inset,
  TextField,
  Select,
  TextArea,
  SearchField,
  Switch,
  Menu,
  Drawer,
  Tabs,
  Calendar,
  Text,
  Headline,
  SectionMessage,
  DateFormat,
  NumericFormat,
  Checkbox,
  ActionBar,
  RouterProvider,
} from '@marigold/components';
// Icon placeholders - using text instead

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  status: 'Active' | 'On Leave';
  joinedDate: string;
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

interface ActivityLog {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: string;
}

interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: string;
}

// Sample data
const initialMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Designer',
    status: 'Active',
    joinedDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    role: 'Manager',
    status: 'Active',
    joinedDate: '2024-01-10',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'Developer',
    status: 'On Leave',
    joinedDate: '2024-03-01',
  },
  {
    id: '5',
    name: 'Eve Martinez',
    email: 'eve@example.com',
    role: 'QA',
    status: 'Active',
    joinedDate: '2024-02-15',
  },
  {
    id: '6',
    name: 'Frank Brown',
    email: 'frank@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: '2024-03-10',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App',
    lead: 'Alice Johnson',
    members: 4,
    deadline: '2026-08-15',
    progress: 75,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Dashboard Redesign',
    lead: 'Bob Smith',
    members: 3,
    deadline: '2026-07-20',
    progress: 45,
    status: 'Active',
  },
  {
    id: '3',
    name: 'API Integration',
    lead: 'Alice Johnson',
    members: 2,
    deadline: '2026-06-30',
    progress: 90,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Legacy System Upgrade',
    lead: 'Carol Davis',
    members: 5,
    deadline: '2026-09-10',
    progress: 30,
    status: 'On Hold',
  },
  {
    id: '5',
    name: 'Documentation',
    lead: 'Eve Martinez',
    members: 2,
    deadline: '2026-07-01',
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
    date: '2026-06-23',
  },
  {
    id: '2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Dashboard Redesign',
    date: '2026-06-23',
  },
  {
    id: '3',
    member: 'Eve Martinez',
    action: 'Deploy',
    project: 'API Integration',
    date: '2026-06-22',
  },
  {
    id: '4',
    member: 'Frank Brown',
    action: 'Commit',
    project: 'Mobile App',
    date: '2026-06-21',
  },
  {
    id: '5',
    member: 'Carol Davis',
    action: 'Review',
    project: 'Legacy System Upgrade',
    date: '2026-06-20',
  },
];

const upcomingEvents = [
  {
    id: '1',
    date: '2026-06-25',
    name: 'Sprint Planning',
    type: 'Meeting' as const,
  },
  {
    id: '2',
    date: '2026-06-26',
    name: 'Project Deadline',
    type: 'Deadline' as const,
  },
  {
    id: '3',
    date: '2026-06-28',
    name: 'Team Lunch',
    type: 'Social' as const,
  },
  {
    id: '4',
    date: '2026-07-02',
    name: 'Quarterly Review',
    type: 'Meeting' as const,
  },
];

const filesData: FileRecord[] = [
  {
    id: '1',
    name: 'Q2 Report.pdf',
    type: 'Documents',
    size: 2.4,
    uploadedBy: 'Carol Davis',
    date: '2026-06-20',
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    type: 'Images',
    size: 4.1,
    uploadedBy: 'Alice Johnson',
    date: '2026-06-19',
  },
  {
    id: '3',
    name: 'Budget.xlsx',
    type: 'Spreadsheets',
    size: 1.8,
    uploadedBy: 'Carol Davis',
    date: '2026-06-18',
  },
  {
    id: '4',
    name: 'Design Assets.zip',
    type: 'Documents',
    size: 12.5,
    uploadedBy: 'Bob Smith',
    date: '2026-06-17',
  },
  {
    id: '5',
    name: 'Meeting Notes.docx',
    type: 'Documents',
    size: 0.5,
    uploadedBy: 'Eve Martinez',
    date: '2026-06-16',
  },
];

// Dashboard Page
function DashboardPage({
  memberCount,
}: {
  memberCount: number;
}) {
  const summary = [
    { label: 'Members', value: memberCount },
    { label: 'Active Projects', value: 5 },
    { label: 'Upcoming Deadlines', value: 8 },
    { label: 'Hours This Week', value: 342, format: 'number' },
  ];

  return (
    <Stack space={6}>
      <Headline level={1}>Team Overview</Headline>

      <Columns columns={[1, 1, 1, 1]} space={4}>
        {summary.map(item => (
          <Card key={item.label}>
            <Stack space={2}>
              <Text size="small">
                {item.label}
              </Text>
              {item.format === 'number' ? (
                <Headline level={3}>
                  <NumericFormat value={item.value} />
                </Headline>
              ) : (
                <Headline level={3}>{item.value}</Headline>
              )}
              {item.label === 'Hours This Week' && (
                <div title="Aggregate of all team members">
                  <span>ℹ️</span>
                </div>
              )}
            </Stack>
          </Card>
        ))}
      </Columns>

      <Stack space={4}>
        <Headline level={2}>Recent Activity</Headline>
        <Table aria-label="Recent Activity">
          <Table.Header>
            <Table.Column rowHeader width={200}>
              Member
            </Table.Column>
            <Table.Column width={120}>Action</Table.Column>
            <Table.Column width={200}>Project</Table.Column>
            <Table.Column width={150}>Date</Table.Column>
          </Table.Header>
          <Table.Body items={activityData}>
            {item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.member}</Table.Cell>
                <Table.Cell>
                  <Badge
                    variant={
                      item.action === 'Commit'
                        ? 'info'
                        : item.action === 'Review'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {item.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{item.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat value={new Date(item.date)} />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        Sprint 14 ends in 3 days. Review the project board for outstanding
        tasks.
      </SectionMessage>
    </Stack>
  );
}

// Members Page
function MembersPage({
  members,
  onAddMember,
  onEditMember,
  onRemoveMember,
}: {
  members: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onEditMember: (member: TeamMember) => void;
  onRemoveMember: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailPanelMember, setDetailPanelMember] = useState<TeamMember | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer' as 'Developer' | 'Designer' | 'Manager' | 'QA',
    startDate: '',
  });

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, roleFilter]);

  const handleOpenAddDialog = () => {
    setEditingMember(null);
    setFormData({ name: '', email: '', role: 'Developer', startDate: '' });
    setAddDialogOpen(true);
  };

  const handleOpenEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      startDate: member.joinedDate,
    });
    setAddDialogOpen(true);
  };

  const handleSaveMember = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in required fields');
      return;
    }

    if (editingMember) {
      onEditMember({
        ...editingMember,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
    } else {
      const newMember: TeamMember = {
        id: Math.random().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Active',
        joinedDate:
          formData.startDate || new Date().toISOString().split('T')[0],
      };
      onAddMember(newMember);
    }
    setAddDialogOpen(false);
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Team Members</Headline>

      <Inline space={3}>
        <SearchField
          label="Search"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Select
          label="Role"
          defaultSelectedKey={roleFilter}
          onSelectionChange={role => setRoleFilter(role as string)}
        >
          <Select.Option id="all">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>

        <Inline space={2}>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            onPress={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'card' ? 'primary' : 'secondary'}
            onPress={() => setViewMode('card')}
          >
            Cards
          </Button>
        </Inline>

        <Dialog.Trigger open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <Button variant="primary" onPress={handleOpenAddDialog}>
            + Add Member
          </Button>
          <Dialog size="xsmall">
            <Dialog.Title>
              {editingMember ? 'Edit Member' : 'Add Member'}
            </Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e })}
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e })}
                />
                <Select
                  label="Role"
                  value={formData.role}
                  onSelectionChange={role =>
                    setFormData({ ...formData, role: role as any })
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
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e })}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                variant="secondary"
                slot="close"
                onPress={() => setAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  handleSaveMember();
                }}
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
            <Table.Column rowHeader width={200}>
              Name
            </Table.Column>
            <Table.Column width={150}>Role</Table.Column>
            <Table.Column width={250}>Email</Table.Column>
            <Table.Column width={100}>Status</Table.Column>
            <Table.Column width={150}>Joined</Table.Column>
            <Table.Column width={100}>Actions</Table.Column>
          </Table.Header>
          <Table.Body items={filteredMembers}>
            {member => (
              <Table.Row
                key={member.id}
                onAction={() => setDetailPanelMember(member)}
              >
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge
                    variant={member.status === 'Active' ? 'success' : 'warning'}
                  >
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat value={new Date(member.joinedDate)} />
                </Table.Cell>
                <Table.Cell>
                  <Menu label="Actions">
                    <Menu.Item
                      id="edit"
                      onAction={() => handleOpenEditDialog(member)}
                    >
                      ✎ Edit
                    </Menu.Item>
                    <Menu.Item
                      id="remove"
                      variant="destructive"
                      onAction={() => {
                        if (
                          window.confirm(
                            `Remove ${member.name} from the team?`
                          )
                        ) {
                          onRemoveMember(member.id);
                        }
                      }}
                    >
                      🗑 Remove
                    </Menu.Item>
                  </Menu>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      ) : (
        <Columns columns={[1, 1, 1]}>
          {filteredMembers.map(member => (
            <div
              key={member.id}
              onClick={() => setDetailPanelMember(member)}
              style={{ cursor: 'pointer' }}
            >
              <Card>
              <Stack space={3}>
                <Stack space={1}>
                  <Headline level={4}>{member.name}</Headline>
                  <Badge variant="default">{member.role}</Badge>
                </Stack>
                <Text size="small">{member.email}</Text>
                <Inline space={2}>
                  <Button variant="secondary" size="small">
                    Message
                  </Button>
                  <Button variant="secondary" size="small">
                    👤 Profile
                  </Button>
                </Inline>
              </Stack>
              </Card>
            </div>
          ))}
        </Columns>
      )}

      {detailPanelMember && (
        <Drawer.Trigger
          open={!!detailPanelMember}
          onOpenChange={open => {
            if (!open) setDetailPanelMember(null);
          }}
        >
          <Drawer size="medium" closeButton>
            <Inset space={4}>
              <Stack space={4}>
                <Headline level={2}>{detailPanelMember.name}</Headline>
                <Stack space={2}>
                  <Stack space={1}>
                    <Text size="small" weight="bold">
                      Email
                    </Text>
                    <Text>{detailPanelMember.email}</Text>
                  </Stack>
                  <Stack space={1}>
                    <Text size="small" weight="bold">
                      Role
                    </Text>
                    <Badge variant="default">{detailPanelMember.role}</Badge>
                  </Stack>
                  <Stack space={1}>
                    <Text size="small" weight="bold">
                      Status
                    </Text>
                    <Badge
                      variant={
                        detailPanelMember.status === 'Active'
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {detailPanelMember.status}
                    </Badge>
                  </Stack>
                  <Stack space={1}>
                    <Text size="small" weight="bold">
                      Joined Date
                    </Text>
                    <DateFormat
                      value={new Date(detailPanelMember.joinedDate)}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Inset>
          </Drawer>
        </Drawer.Trigger>
      )}
    </Stack>
  );
}

// Projects Page
function ProjectsPage({
  projects,
  onArchiveProjects,
}: {
  projects: Project[];
  onArchiveProjects: (ids: string[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set<string>());

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  return (
    <Stack space={6}>
      <Headline level={1}>Projects</Headline>

      <Inline space={3}>
        <SearchField
          label="Search"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Dialog.Trigger>
          <Button variant="primary">
            + New Project
          </Button>
          <Dialog size="xsmall">
            <Dialog.Title>Create New Project</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField label="Project Name" />
                <TextField label="Lead" />
                <TextField label="Deadline" type="date" />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" slot="close">
                Create
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {selectedRows.size > 0 && (
        <ActionBar>
          <Button
            variant="destructive"
            onPress={() => {
              onArchiveProjects(Array.from(selectedRows));
              setSelectedRows(new Set());
            }}
          >
            Archive Selected ({selectedRows.size})
          </Button>
          <Button variant="secondary">Export</Button>
        </ActionBar>
      )}

      <Table aria-label="Projects">
        <Table.Header>
          <Table.Column>
            <Checkbox
              aria-label="Select all"
              checked={
                selectedRows.size === filteredProjects.length &&
                filteredProjects.length > 0
              }
              indeterminate={
                selectedRows.size > 0 &&
                selectedRows.size < filteredProjects.length
              }
              onChange={checked => {
                if (checked) {
                  setSelectedRows(new Set(filteredProjects.map(p => p.id)));
                } else {
                  setSelectedRows(new Set());
                }
              }}
            />
          </Table.Column>
          <Table.Column rowHeader width={200}>
            Project
          </Table.Column>
          <Table.Column width={150}>Lead</Table.Column>
          <Table.Column width={100}>Members</Table.Column>
          <Table.Column width={150}>Deadline</Table.Column>
          <Table.Column width={100}>Progress</Table.Column>
          <Table.Column width={100}>Status</Table.Column>
        </Table.Header>
        <Table.Body items={filteredProjects}>
          {project => (
            <Table.Row key={project.id}>
              <Table.Cell>
                <Checkbox
                  aria-label={`Select ${project.name}`}
                  checked={selectedRows.has(project.id)}
                  onChange={checked => {
                    const newSelected = new Set(selectedRows);
                    if (checked) {
                      newSelected.add(project.id);
                    } else {
                      newSelected.delete(project.id);
                    }
                    setSelectedRows(newSelected);
                  }}
                />
              </Table.Cell>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>{project.members}</Table.Cell>
              <Table.Cell>
                <DateFormat value={new Date(project.deadline)} />
              </Table.Cell>
              <Table.Cell>{project.progress}%</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={
                    project.status === 'Active'
                      ? 'primary'
                      : project.status === 'On Hold'
                        ? 'warning'
                        : 'success'
                  }
                >
                  {project.status}
                </Badge>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// Calendar Page
function CalendarPage() {
  return (
    <Stack space={6}>
      <Headline level={1}>Team Calendar</Headline>

      <Columns columns={[1, 1]} space={4}>
        <Calendar
          aria-label="Team Calendar"
        />

        <Stack space={4}>
          <Headline level={2}>Upcoming Events</Headline>
          <Stack space={2}>
            {upcomingEvents.map(event => (
              <Card key={event.id}>
                <Stack space={2}>
                  <DateFormat value={new Date(event.date)} />
                  <Text weight="bold">{event.name}</Text>
                  <Badge
                    variant={
                      event.type === 'Meeting'
                        ? 'info'
                        : event.type === 'Deadline'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {event.type}
                  </Badge>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Columns>
    </Stack>
  );
}

// Files Page
function FilesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const filteredFiles = useMemo(() => {
    return filesData.filter(f => {
      const matchesSearch = f.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === 'all' ||
        f.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);

  return (
    <Stack space={6}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={3}>
        <SearchField
          label="Search"
          placeholder="Search files..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Select
          label="Type"
          defaultSelectedKey={typeFilter}
          onSelectionChange={type => setTypeFilter(type as string)}
        >
          <Select.Option id="all">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>

        <Dialog.Trigger open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <Button variant="primary">
            + Upload
          </Button>
          <Dialog size="xsmall">
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <TextField
                  label="Files"
                  type="file"
                />
                <TextArea
                  label="Description"
                  placeholder="File description..."
                />
                <Select label="Category">
                  <Select.Option id="docs">Documents</Select.Option>
                  <Select.Option id="images">Images</Select.Option>
                  <Select.Option id="sheets">Spreadsheets</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                variant="secondary"
                slot="close"
                onPress={() => setUploadDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                slot="close"
                onPress={() => {
                  setUploadDialogOpen(false);
                  alert('Files uploaded successfully.');
                }}
              >
                Upload
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Shared Files">
        <Table.Header>
          <Table.Column rowHeader width={250}>
            File Name
          </Table.Column>
          <Table.Column width={120}>Type</Table.Column>
          <Table.Column width={100}>Size</Table.Column>
          <Table.Column width={150}>Uploaded By</Table.Column>
          <Table.Column width={150}>Date</Table.Column>
          <Table.Column width={100}>Actions</Table.Column>
        </Table.Header>
        <Table.Body items={filteredFiles}>
          {file => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={file.size} /> MB
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={new Date(file.date)} />
              </Table.Cell>
              <Table.Cell>
                <Menu label="Actions">
                  <Menu.Item id="download">
                    ⬇ Download
                  </Menu.Item>
                  <Menu.Item id="rename">
                    ✎ Rename
                  </Menu.Item>
                  <Menu.Item
                    id="delete"
                    variant="destructive"
                  >
                    🗑 Delete
                  </Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Stack>
  );
}

// Settings Page
function SettingsPage({
  teamName,
  onUpdateSettings,
}: {
  teamName: string;
  onUpdateSettings: (newName: string) => void;
}) {
  const [newTeamName, setNewTeamName] = useState(teamName);
  const [notifications, setNotifications] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mentions: true,
    calendar: true,
  });

  return (
    <Stack space={6}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs>
        <Tabs.List>
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <Stack space={3}>
              <TextField
                label="Team Name"
                value={newTeamName}
                onChange={setNewTeamName}
              />
              <TextArea
                label="Description"
                placeholder="Team description..."
              />
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
            </Stack>
            <Button
              variant="primary"
              onPress={() => {
                onUpdateSettings(newTeamName);
                alert('Settings updated.');
              }}
            >
              Save
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={3}>
              <Stack space={1}>
                <Switch
                  label="New member joins"
                  selected={notifications.newMember}
                  onChange={() =>
                    setNotifications(prev => ({
                      ...prev,
                      newMember: !prev.newMember,
                    }))
                  }
                />
                <Text size="small">Get notified when someone joins the team</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Project deadline approaching"
                  selected={notifications.deadline}
                  onChange={() =>
                    setNotifications(prev => ({
                      ...prev,
                      deadline: !prev.deadline,
                    }))
                  }
                />
                <Text size="small">Reminder 3 days before deadline</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Weekly digest"
                  selected={notifications.digest}
                  onChange={() =>
                    setNotifications(prev => ({
                      ...prev,
                      digest: !prev.digest,
                    }))
                  }
                />
                <Text size="small">Summary of team activity every Monday</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Mention notifications"
                  selected={notifications.mentions}
                  onChange={() =>
                    setNotifications(prev => ({
                      ...prev,
                      mentions: !prev.mentions,
                    }))
                  }
                />
                <Text size="small">When someone mentions you in a comment</Text>
              </Stack>
              <Stack space={1}>
                <Switch
                  label="Calendar reminders"
                  selected={notifications.calendar}
                  onChange={() =>
                    setNotifications(prev => ({
                      ...prev,
                      calendar: !prev.calendar,
                    }))
                  }
                />
                <Text size="small">15 minutes before scheduled events</Text>
              </Stack>
            </Stack>
            <Button
              variant="primary"
              onPress={() => alert('Preferences saved.')}
            >
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Columns columns={[1, 1, 1]} space={4}>
            <Card>
              <Stack space={3}>
                <Headline level={4}>Slack</Headline>
                <Badge variant="success">Connected</Badge>
                <Text size="small">
                  Sync team notifications to Slack channels
                </Text>
                <Button variant="destructive" size="small">
                  Disconnect
                </Button>
              </Stack>
            </Card>
            <Card>
              <Stack space={3}>
                <Headline level={4}>GitHub</Headline>
                <Badge variant="default">Not connected</Badge>
                <Text size="small">Link repositories and track commits</Text>
                <Button variant="primary" size="small">
                  Connect
                </Button>
              </Stack>
            </Card>
            <Card>
              <Stack space={3}>
                <Headline level={4}>Jira</Headline>
                <Badge variant="default">Not connected</Badge>
                <Text size="small">Sync projects and track issues</Text>
                <Button variant="primary" size="small">
                  Connect
                </Button>
              </Stack>
            </Card>
          </Columns>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
}

// Main TeamHub App
export default function TestApp() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [members, setMembers] = useState(initialMembers);
  const [projects, setProjects] = useState(initialProjects);
  const [teamName, setTeamName] = useState('TeamHub');

  const handleAddMember = (member: TeamMember) => {
    setMembers([...members, member]);
  };

  const handleEditMember = (member: TeamMember) => {
    setMembers(members.map(m => (m.id === member.id ? member : m)));
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleArchiveProjects = (ids: string[]) => {
    setProjects(projects.filter(p => !ids.includes(p.id)));
  };

  const pageLabel: { [key: string]: string } = {
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
        return <DashboardPage memberCount={members.length} />;
      case '/members':
        return (
          <MembersPage
            members={members}
            onAddMember={handleAddMember}
            onEditMember={handleEditMember}
            onRemoveMember={handleRemoveMember}
          />
        );
      case '/projects':
        return (
          <ProjectsPage
            projects={projects}
            onArchiveProjects={handleArchiveProjects}
          />
        );
      case '/calendar':
        return <CalendarPage />;
      case '/files':
        return <FilesPage />;
      case '/settings':
        return (
          <SettingsPage
            teamName={teamName}
            onUpdateSettings={setTeamName}
          />
        );
      default:
        return <DashboardPage memberCount={members.length} />;
    }
  };

  return (
    <RouterProvider navigate={setCurrentPath}>
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>{teamName}</Sidebar.Header>
            <Sidebar.Nav current={currentPath}>
              <Sidebar.Item href="/dashboard">Dashboard</Sidebar.Item>
              <Sidebar.Item href="/members">Members</Sidebar.Item>
              <Sidebar.Item href="/projects">Projects</Sidebar.Item>
              <Sidebar.Item href="/calendar">Calendar</Sidebar.Item>
              <Sidebar.Item href="/files">Files</Sidebar.Item>
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Sidebar.Item href="/settings">
                ⚙ Settings
              </Sidebar.Item>
            </Sidebar.Footer>
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
                <Breadcrumbs.Item href={currentPath}>
                  {pageLabel[currentPath] || 'Dashboard'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <div title="Account settings">
                <Menu label="John Doe">
                  <Menu.Item id="profile">
                    👤 Profile
                  </Menu.Item>
                  <Menu.Item id="preferences">
                    ⚙ Preferences
                  </Menu.Item>
                  <Menu.Item
                    id="signout"
                    variant="destructive"
                  >
                    Sign Out
                  </Menu.Item>
                </Menu>
              </div>
              <Dialog.Trigger>
                <Button variant="secondary" size="small">
                  <span>ℹ️</span>
                </Button>
                <Dialog size="xsmall">
                  <Dialog.Content>
                  <Stack space={2}>
                    <Text weight="bold">Help</Text>
                    <Text size="small">
                      Use the sidebar to navigate between sections.
                    </Text>
                  </Stack>
                  </Dialog.Content>
                </Dialog>
              </Dialog.Trigger>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={6}>
              {renderPage()}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </RouterProvider>
  );
}
