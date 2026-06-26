'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  AppLayout,
  Aside,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Columns,
  DateFormat,
  DatePicker,
  Dialog,
  FileField,
  Form,
  Headline,
  Inset,
  Inline,
  Menu,
  NumericFormat,
  SearchField,
  Select,
  SectionMessage,
  Sidebar,
  Stack,
  Table,
  Tabs,
  Text,
  TextField,
  TextArea,
  Tiles,
  Toast,
  Tooltip,
  TopNavigation,
  useToast,
  ToastProvider,
} from '@marigold/components';

type Page = 'dashboard' | 'members' | 'projects' | 'calendar' | 'files' | 'settings';

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

interface Activity {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
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
    joinedDate: new Date(2023, 2, 20),
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    role: 'Manager',
    status: 'On Leave',
    joinedDate: new Date(2022, 6, 10),
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2023, 4, 5),
  },
  {
    id: '5',
    name: 'Emma Brown',
    email: 'emma@example.com',
    role: 'QA',
    status: 'Active',
    joinedDate: new Date(2023, 8, 12),
  },
  {
    id: '6',
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'Developer',
    status: 'Active',
    joinedDate: new Date(2024, 0, 8),
  },
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    lead: 'Alice Johnson',
    members: 4,
    deadline: new Date(2026, 7, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Mobile App',
    lead: 'David Wilson',
    members: 3,
    deadline: new Date(2026, 8, 30),
    progress: 60,
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'Backend API',
    lead: 'Alice Johnson',
    members: 2,
    deadline: new Date(2026, 6, 10),
    progress: 90,
    status: 'Active',
  },
  {
    id: 'p4',
    name: 'Design System',
    lead: 'Bob Smith',
    members: 5,
    deadline: new Date(2026, 9, 20),
    progress: 45,
    status: 'On Hold',
  },
  {
    id: 'p5',
    name: 'Documentation',
    lead: 'Carol Davis',
    members: 2,
    deadline: new Date(2026, 5, 30),
    progress: 100,
    status: 'Completed',
  },
];

const activities: Activity[] = [
  {
    id: 'a1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Website Redesign',
    date: new Date(2026, 5, 20, 14, 30),
  },
  {
    id: 'a2',
    member: 'David Wilson',
    action: 'Review',
    project: 'Mobile App',
    date: new Date(2026, 5, 19, 10, 15),
  },
  {
    id: 'a3',
    member: 'Emma Brown',
    action: 'Deploy',
    project: 'Backend API',
    date: new Date(2026, 5, 18, 16, 45),
  },
  {
    id: 'a4',
    member: 'Bob Smith',
    action: 'Review',
    project: 'Design System',
    date: new Date(2026, 5, 17, 11, 20),
  },
  {
    id: 'a5',
    member: 'Frank Miller',
    action: 'Commit',
    project: 'Website Redesign',
    date: new Date(2026, 5, 16, 9, 0),
  },
];

const calendarEvents: CalendarEvent[] = [
  {
    id: 'ce1',
    date: new Date(2026, 5, 24),
    name: 'Sprint Planning',
    type: 'Meeting',
  },
  {
    id: 'ce2',
    date: new Date(2026, 6, 2),
    name: 'Release Deadline',
    type: 'Deadline',
  },
  {
    id: 'ce3',
    date: new Date(2026, 6, 10),
    name: 'Team Lunch',
    type: 'Social',
  },
  {
    id: 'ce4',
    date: new Date(2026, 6, 15),
    name: 'Project Review',
    type: 'Meeting',
  },
];

const initialFiles: SharedFile[] = [
  {
    id: 'f1',
    name: 'Q2 Report.pdf',
    type: 'Documents',
    size: 2.4,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 5, 19),
  },
  {
    id: 'f2',
    name: 'Design.figma',
    type: 'Documents',
    size: 5.1,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 5, 18),
  },
  {
    id: 'f3',
    name: 'team-photo.jpg',
    type: 'Images',
    size: 0.8,
    uploadedBy: 'Carol Davis',
    date: new Date(2026, 5, 15),
  },
  {
    id: 'f4',
    name: 'Budget.xlsx',
    type: 'Spreadsheets',
    size: 1.2,
    uploadedBy: 'David Wilson',
    date: new Date(2026, 5, 14),
  },
  {
    id: 'f5',
    name: 'Presentation.pptx',
    type: 'Documents',
    size: 3.7,
    uploadedBy: 'Emma Brown',
    date: new Date(2026, 5, 12),
  },
];

const getActionVariant = (action: string) => {
  if (action === 'Commit') return 'info' as const;
  if (action === 'Review') return 'warning' as const;
  return 'success' as const;
};

const getStatusVariant = (status: string) => {
  if (status === 'Active') return 'success' as const;
  if (status === 'On Leave') return 'warning' as const;
  if (status === 'On Hold') return 'warning' as const;
  if (status === 'Completed') return 'success' as const;
  return 'default' as const;
};

const Dashboard = ({ memberCount }: { memberCount: number }) => {
  return (
    <Stack space={5}>
      <Headline level={2}>Team Overview</Headline>

      <Tiles columns="4">
        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text size="sm" color="muted-foreground">
                Members
              </Text>
              <Text size="lg" weight="bold">
                {memberCount}
              </Text>
            </Stack>
          </Inset>
        </Card>

        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text size="sm" color="muted-foreground">
                Active Projects
              </Text>
              <Text size="lg" weight="bold">
                5
              </Text>
            </Stack>
          </Inset>
        </Card>

        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Text size="sm" color="muted-foreground">
                Upcoming Deadlines
              </Text>
              <Text size="lg" weight="bold">
                8
              </Text>
            </Stack>
          </Inset>
        </Card>

        <Card>
          <Inset space={4}>
            <Stack space={2}>
              <Inline space={1} alignY="baseline">
                <Text size="sm" color="muted-foreground">
                  Hours This Week
                </Text>
                <Tooltip.Trigger trigger="hover">
                  <Button variant="icon" size="icon">
                    <span>ⓘ</span>
                  </Button>
                  <Tooltip>Aggregate of all team members.</Tooltip>
                </Tooltip.Trigger>
              </Inline>
              <Text size="lg" weight="bold">
                <NumericFormat value={342} />
              </Text>
            </Stack>
          </Inset>
        </Card>
      </Tiles>

      <Stack space={3}>
        <Headline level={3}>Recent Activity</Headline>
        <Table aria-label="Recent Activity">
          <Table.Header>
            <Table.Column>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {activities.map(activity => (
              <Table.Row key={activity.id}>
                <Table.Cell>{activity.member}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getActionVariant(activity.action)}>
                    {activity.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{activity.project}</Table.Cell>
                <Table.Cell>
                  <DateFormat
                    value={activity.date}
                    dateStyle="medium"
                    timeStyle="short"
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Stack>

      <SectionMessage variant="info">
        <SectionMessage.Title>Sprint 14 Status</SectionMessage.Title>
        <SectionMessage.Content>
          Sprint 14 ends in 3 days. Review the project board for outstanding
          tasks.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );
};

const MembersPage = ({
  members,
  onMembersChange,
}: {
  members: Member[];
  onMembersChange: (members: Member[]) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === 'All Roles' || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const handleAddMember = (formData: FormData) => {
    const newMember: Member = {
      id: Math.random().toString(),
      name: formData.get('fullName') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as Member['role'],
      status: 'Active',
      joinedDate: new Date(formData.get('startDate') as string),
    };
    onMembersChange([...members, newMember]);
    setAddDialogOpen(false);
  };

  const handleEditMember = (formData: FormData) => {
    if (!editingMember) return;
    const updated = members.map(m =>
      m.id === editingMember.id
        ? {
            ...m,
            name: formData.get('fullName') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as Member['role'],
            joinedDate: new Date(formData.get('startDate') as string),
          }
        : m,
    );
    onMembersChange(updated);
    setEditingMember(null);
  };

  const handleRemoveMember = (id: string) => {
    onMembersChange(members.filter(m => m.id !== id));
  };

  const MemberForm = ({
    member,
    onSubmit,
  }: {
    member?: Member;
    onSubmit: (data: FormData) => void;
  }) => (
    <Form onSubmit={onSubmit}>
      <Stack space={3}>
        <TextField
          name="fullName"
          label="Full Name"
          defaultValue={member?.name}
          required
          autoFocus
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          defaultValue={member?.email}
          required
        />
        <Select
          name="role"
          label="Role"
          defaultSelectedKey={member?.role}
          required
        >
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <TextField
          name="startDate"
          label="Start Date"
          type="date"
          defaultValue={
            member
              ? member.joinedDate.toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]
          }
        />
        <TextField
          name="bio"
          label="Bio"
          defaultValue={member?.name}
        />
        <Inline space={2} justifyX="end">
          <Button variant="secondary" slot="close">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {member ? 'Update' : 'Add'}
          </Button>
        </Inline>
      </Stack>
    </Form>
  );

  return (
    <Stack space={5}>
      <Headline level={2}>Team Members</Headline>

      <Inline space={3} alignY="center">
        <SearchField
          placeholder="Search by name..."
          value={searchQuery}
          onChange={setSearchQuery}
          width="fit"
        />
        <Select
          label="Role"
          defaultSelectedKey={roleFilter}
          onSelectionChange={setRoleFilter}
          width="fit"
        >
          <Select.Option id="All Roles">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>

        <Button
          variant="ghost"
          size="small"
          onPress={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
        >
          {viewMode === 'table' ? 'Card View' : 'Table View'}
        </Button>

        <Dialog.Trigger open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <Button variant="primary">Add Member</Button>
          <Dialog size="small">
            <Dialog.Title>Add New Member</Dialog.Title>
            <Dialog.Content>
              <MemberForm onSubmit={handleAddMember} />
            </Dialog.Content>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      {viewMode === 'table' ? (
        <Table aria-label="Team Members">
          <Table.Header>
            <Table.Column>Name</Table.Column>
            <Table.Column>Role</Table.Column>
            <Table.Column>Email</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Joined</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map(member => (
              <Table.Row
                key={member.id}
                onPress={() => setSelectedMember(member)}
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
                  <DateFormat value={member.joinedDate} dateStyle="medium" />
                </Table.Cell>
                <Table.Cell>
                  <Menu label="Actions">
                    <Menu.Item
                      id="edit"
                      onAction={() => setEditingMember(member)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      id="remove"
                      variant="destructive"
                      onAction={() => {
                        if (confirm('Remove this member?')) {
                          handleRemoveMember(member.id);
                        }
                      }}
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
        <Tiles columns="3">
          {filteredMembers.map(member => (
            <Card key={member.id} onPress={() => setSelectedMember(member)}>
              <Inset space={4}>
                <Stack space={3}>
                  <Stack space={1}>
                    <Text weight="bold">{member.name}</Text>
                    <Badge variant="default">{member.role}</Badge>
                  </Stack>
                  <Text size="sm">{member.email}</Text>
                  <Inline space={2}>
                    <Button variant="ghost" size="small">
                      Message
                    </Button>
                    <Button variant="ghost" size="small">
                      Profile
                    </Button>
                  </Inline>
                </Stack>
              </Inset>
            </Card>
          ))}
        </Tiles>
      )}

      {editingMember && (
        <Dialog.Trigger open={true} onOpenChange={open => !open && setEditingMember(null)}>
          <Dialog size="small">
            <Dialog.Title>Edit Member</Dialog.Title>
            <Dialog.Content>
              <MemberForm
                member={editingMember}
                onSubmit={data => {
                  handleEditMember(data);
                  setEditingMember(null);
                }}
              />
            </Dialog.Content>
          </Dialog>
        </Dialog.Trigger>
      )}

      {selectedMember && (
        <Aside>
          <Inset space={4}>
            <Stack space={4}>
              <Button variant="ghost" onPress={() => setSelectedMember(null)}>
                ← Back
              </Button>
              <Stack space={2}>
                <Headline level={3}>{selectedMember.name}</Headline>
                <Badge variant={getStatusVariant(selectedMember.status)}>
                  {selectedMember.status}
                </Badge>
              </Stack>
              <Stack space={2}>
                <Text weight="bold">Email</Text>
                <Text>{selectedMember.email}</Text>
              </Stack>
              <Stack space={2}>
                <Text weight="bold">Role</Text>
                <Text>{selectedMember.role}</Text>
              </Stack>
              <Stack space={2}>
                <Text weight="bold">Joined</Text>
                <DateFormat
                  value={selectedMember.joinedDate}
                  dateStyle="long"
                />
              </Stack>
            </Stack>
          </Inset>
        </Aside>
      )}
    </Stack>
  );
};

const ProjectsPage = ({
  projects,
  onProjectsChange,
}: {
  projects: Project[];
  onProjectsChange: (projects: Project[]) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(),
  );

  const filteredProjects = useMemo(() => {
    return projects.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [projects, searchQuery]);

  const handleArchiveSelected = () => {
    const remaining = projects.filter(p => !selectedProjects.has(p.id));
    onProjectsChange(remaining);
    setSelectedProjects(new Set());
  };

  return (
    <Stack space={5}>
      <Inline space={3} alignY="center">
        <Headline level={2}>Projects</Headline>
      </Inline>

      <Inline space={3} alignY="center">
        <SearchField
          placeholder="Search projects..."
          value={searchQuery}
          onChange={setSearchQuery}
          width="fit"
        />
        <Button variant="primary">New Project</Button>
      </Inline>

      {selectedProjects.size > 0 && (
        <Inline space={3}>
          <Button variant="destructive-ghost" onPress={handleArchiveSelected}>
            Archive Selected
          </Button>
          <Button
            variant="secondary"
            onPress={() => setSelectedProjects(new Set())}
          >
            Clear Selection
          </Button>
        </Inline>
      )}

      <Table aria-label="Projects" selectionMode="multiple">
        <Table.Header>
          <Table.Column>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body
          selectedKeys={Array.from(selectedProjects)}
          onSelectionChange={keys => setSelectedProjects(new Set(keys))}
        >
          {filteredProjects.map(project => (
            <Table.Row key={project.id}>
              <Table.Cell>{project.name}</Table.Cell>
              <Table.Cell>{project.lead}</Table.Cell>
              <Table.Cell>{project.members}</Table.Cell>
              <Table.Cell>
                <DateFormat value={project.deadline} dateStyle="medium" />
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

const CalendarPage = () => {
  const today = new Date(2026, 5, 22);

  return (
    <Stack space={5}>
      <Headline level={2}>Team Calendar</Headline>

      <Card>
        <Inset space={4}>
          <Stack space={3}>
            <Text weight="bold">
              {today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <Text size="sm" color="muted-foreground">
              Calendar view coming soon
            </Text>
          </Stack>
        </Inset>
      </Card>

      <Stack space={3}>
        <Headline level={3}>Upcoming Events</Headline>
        <Stack space={2}>
          {calendarEvents.slice(0, 4).map(event => (
            <Card key={event.id}>
              <Inset space={3}>
                <Inline space={3} alignY="center">
                  <Stack space={1} flex={1}>
                    <DateFormat value={event.date} dateStyle="medium" />
                    <Text weight="bold">{event.name}</Text>
                  </Stack>
                  <Badge variant="default">{event.type}</Badge>
                </Inline>
              </Inset>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const FilesPage = ({
  files,
  onFilesChange,
}: {
  files: SharedFile[];
  onFilesChange: (files: SharedFile[]) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('All');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { addToast } = useToast();

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        fileTypeFilter === 'All' || file.type === fileTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, searchQuery, fileTypeFilter]);

  const handleUpload = (formData: FormData) => {
    const fileInput = formData.get('files') as File | null;
    if (fileInput) {
      const newFile: SharedFile = {
        id: Math.random().toString(),
        name: fileInput.name,
        type: fileTypeFilter === 'All' ? 'Documents' : (fileTypeFilter as SharedFile['type']),
        size: fileInput.size / (1024 * 1024),
        uploadedBy: 'Current User',
        date: new Date(),
      };
      onFilesChange([newFile, ...files]);
      setUploadDialogOpen(false);
      addToast({ title: 'Files uploaded successfully.', variant: 'success' });
    }
  };

  return (
    <Stack space={5}>
      <Headline level={2}>Shared Files</Headline>

      <Inline space={3} alignY="center">
        <SearchField
          placeholder="Search files..."
          value={searchQuery}
          onChange={setSearchQuery}
          width="fit"
        />
        <Select
          label="File Type"
          defaultSelectedKey={fileTypeFilter}
          onSelectionChange={setFileTypeFilter}
          width="fit"
        >
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>

        <Dialog.Trigger open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <Button variant="primary">Upload</Button>
          <Dialog size="small">
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Form onSubmit={handleUpload}>
                <Stack space={3}>
                  <FileField name="files" label="Select Files" multiple />
                  <TextArea
                    name="description"
                    label="Description"
                    placeholder="Add description..."
                  />
                  <Select name="category" label="Category">
                    <Select.Option id="Documents">Documents</Select.Option>
                    <Select.Option id="Images">Images</Select.Option>
                    <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
                  </Select>
                  <Inline space={2} justifyX="end">
                    <Button variant="secondary" slot="close">
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

      <Table aria-label="Shared Files">
        <Table.Header>
          <Table.Column>File Name</Table.Column>
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
                <NumericFormat value={file.size} maximumFractionDigits={1} />
                {' '}
                MB
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={file.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <Menu label="Actions">
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
    </Stack>
  );
};

const SettingsPage = ({
  teamName,
  onTeamNameChange,
}: {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}) => {
  const { addToast } = useToast();
  const [notificationPrefs, setNotificationPrefs] = useState({
    newMember: true,
    deadline: false,
    weeklyDigest: true,
    mentions: true,
    calendarReminders: false,
  });

  const handleGeneralSave = (formData: FormData) => {
    const newTeamName = formData.get('teamName') as string;
    onTeamNameChange(newTeamName);
    addToast({ title: 'Settings updated.', variant: 'success' });
  };

  return (
    <Stack space={5}>
      <Headline level={2}>Team Settings</Headline>

      <Tabs aria-label="Settings tabs">
        <Tabs.List aria-label="Settings">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <Form onSubmit={handleGeneralSave}>
              <Stack space={3}>
                <TextField
                  name="teamName"
                  label="Team Name"
                  defaultValue={teamName}
                />
                <TextField name="description" label="Description" />
                <Select name="timezone" label="Default Timezone">
                  <Select.Option id="UTC">UTC</Select.Option>
                  <Select.Option id="CET">CET</Select.Option>
                  <Select.Option id="EST">EST</Select.Option>
                  <Select.Option id="PST">PST</Select.Option>
                </Select>
                <Select name="dateFormat" label="Date Format">
                  <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                  <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                  <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
                </Select>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={4}>
            <Stack space={3}>
              <Inline space={3} alignY="start">
                <Checkbox
                  checked={notificationPrefs.newMember}
                  onChange={checked =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      newMember: checked,
                    })
                  }
                />
                <Stack space={1}>
                  <Text weight="bold">New member joins</Text>
                  <Text size="sm" color="muted-foreground">
                    Get notified when someone joins the team
                  </Text>
                </Stack>
              </Inline>

              <Inline space={3} alignY="start">
                <Checkbox
                  checked={notificationPrefs.deadline}
                  onChange={checked =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      deadline: checked,
                    })
                  }
                />
                <Stack space={1}>
                  <Text weight="bold">Project deadline approaching</Text>
                  <Text size="sm" color="muted-foreground">
                    Reminder 3 days before deadline
                  </Text>
                </Stack>
              </Inline>

              <Inline space={3} alignY="start">
                <Checkbox
                  checked={notificationPrefs.weeklyDigest}
                  onChange={checked =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      weeklyDigest: checked,
                    })
                  }
                />
                <Stack space={1}>
                  <Text weight="bold">Weekly digest</Text>
                  <Text size="sm" color="muted-foreground">
                    Summary of team activity every Monday
                  </Text>
                </Stack>
              </Inline>

              <Inline space={3} alignY="start">
                <Checkbox
                  checked={notificationPrefs.mentions}
                  onChange={checked =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      mentions: checked,
                    })
                  }
                />
                <Stack space={1}>
                  <Text weight="bold">Mention notifications</Text>
                  <Text size="sm" color="muted-foreground">
                    When someone mentions you in a comment
                  </Text>
                </Stack>
              </Inline>

              <Inline space={3} alignY="start">
                <Checkbox
                  checked={notificationPrefs.calendarReminders}
                  onChange={checked =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      calendarReminders: checked,
                    })
                  }
                />
                <Stack space={1}>
                  <Text weight="bold">Calendar reminders</Text>
                  <Text size="sm" color="muted-foreground">
                    15 minutes before scheduled events
                  </Text>
                </Stack>
              </Inline>
            </Stack>

            <Button
              variant="primary"
              onPress={() =>
                addToast({
                  title: 'Notification preferences saved.',
                  variant: 'success',
                })
              }
            >
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles columns="3">
            <Card>
              <Inset space={4}>
                <Stack space={3}>
                  <Stack space={1}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Slack</Text>
                      <Badge variant="success">Connected</Badge>
                    </Inline>
                    <Text size="sm" color="muted-foreground">
                      Receive notifications in Slack
                    </Text>
                  </Stack>
                  <Button
                    variant="destructive-ghost"
                    size="small"
                    onPress={() => {
                      if (confirm('Disconnect from Slack?')) {
                        addToast({
                          title: 'Disconnected from Slack.',
                          variant: 'success',
                        });
                      }
                    }}
                  >
                    Disconnect
                  </Button>
                </Stack>
              </Inset>
            </Card>

            <Card>
              <Inset space={4}>
                <Stack space={3}>
                  <Stack space={1}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">GitHub</Text>
                      <Badge variant="default">Not Connected</Badge>
                    </Inline>
                    <Text size="sm" color="muted-foreground">
                      Sync repository activity
                    </Text>
                  </Stack>
                  <Button variant="primary" size="small">
                    Connect
                  </Button>
                </Stack>
              </Inset>
            </Card>

            <Card>
              <Inset space={4}>
                <Stack space={3}>
                  <Stack space={1}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Jira</Text>
                      <Badge variant="default">Not Connected</Badge>
                    </Inline>
                    <Text size="sm" color="muted-foreground">
                      Track issues and sprints
                    </Text>
                  </Stack>
                  <Button variant="primary" size="small">
                    Connect
                  </Button>
                </Stack>
              </Inset>
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
  const [projects, setProjects] = useState(initialProjects);
  const [files, setFiles] = useState(initialFiles);
  const [teamName, setTeamName] = useState('TeamHub');

  const getBreadcrumbItems = () => {
    const items: Array<{ label: string; page: Page }> = [
      { label: 'TeamHub', page: 'dashboard' },
    ];

    const pageLabels: Record<Page, string> = {
      dashboard: 'Dashboard',
      members: 'Members',
      projects: 'Projects',
      calendar: 'Calendar',
      files: 'Files',
      settings: 'Settings',
    };

    if (currentPage !== 'dashboard') {
      items.push({ label: pageLabels[currentPage], page: currentPage });
    }

    return items;
  };

  return (
    <ToastProvider position="bottom-right">
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold">{teamName}</Text>
            </Sidebar.Header>
            <Sidebar.Nav current={currentPage}>
              <Sidebar.Item
                href="#"
                id="dashboard"
                onPress={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                id="members"
                onPress={() => setCurrentPage('members')}
              >
                Members
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                id="projects"
                onPress={() => setCurrentPage('projects')}
              >
                Projects
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                id="calendar"
                onPress={() => setCurrentPage('calendar')}
              >
                Calendar
              </Sidebar.Item>
              <Sidebar.Item
                href="#"
                id="files"
                onPress={() => setCurrentPage('files')}
              >
                Files
              </Sidebar.Item>
              <Sidebar.Separator />
              <Sidebar.Item
                href="#"
                id="settings"
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

            <TopNavigation.Middle aria-label="Breadcrumbs">
              <Breadcrumbs>
                {getBreadcrumbItems().map((item, idx) => (
                  <Breadcrumbs.Item
                    key={idx}
                    href="#"
                    onPress={() => setCurrentPage(item.page)}
                  >
                    {item.label}
                  </Breadcrumbs.Item>
                ))}
              </Breadcrumbs>
            </TopNavigation.Middle>

            <TopNavigation.End aria-label="User Menu">
              <Tooltip.Trigger trigger="hover">
                <Menu label="John Doe">
                  <Menu.Item id="profile">Profile</Menu.Item>
                  <Menu.Item id="preferences">Preferences</Menu.Item>
                  <Menu.Item id="signout" variant="destructive">
                    Sign Out
                  </Menu.Item>
                </Menu>
                <Tooltip>Account settings</Tooltip>
              </Tooltip.Trigger>

              <Tooltip.Trigger trigger="hover">
                <Button
                  variant="icon"
                  size="icon"
                  onPress={() => {
                    alert('Use the sidebar to navigate between sections.');
                  }}
                >
                  ?
                </Button>
                <Tooltip>
                  Use the sidebar to navigate between sections.
                </Tooltip>
              </Tooltip.Trigger>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space={4}>
              {currentPage === 'dashboard' && (
                <Dashboard memberCount={members.length} />
              )}
              {currentPage === 'members' && (
                <MembersPage
                  members={members}
                  onMembersChange={setMembers}
                />
              )}
              {currentPage === 'projects' && (
                <ProjectsPage
                  projects={projects}
                  onProjectsChange={setProjects}
                />
              )}
              {currentPage === 'calendar' && <CalendarPage />}
              {currentPage === 'files' && (
                <FilesPage files={files} onFilesChange={setFiles} />
              )}
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
    </ToastProvider>
  );
};

export default TestApp;
