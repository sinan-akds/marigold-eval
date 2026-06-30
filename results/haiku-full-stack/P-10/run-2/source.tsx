'use client';

import React, { useState, useCallback } from 'react';
import {
  AppLayout,
  Sidebar,
  TopNavigation,
  Breadcrumbs,
  Button,
  TextField,
  Select,
  SearchField,
  Dialog,
  Stack,
  Inline,
  Columns,
  Tiles,
  Card,
  Badge,
  Table,
  Headline,
  Text,
  Menu,
  Tooltip,
  SectionMessage,
  Tabs,
  Switch,
  Checkbox,
  TextArea,
  FileField,
  Calendar,
  Drawer,
  ActionBar,
  DateFormat,
  NumericFormat,
  ContextualHelp,
  Toast,
  useConfirmation,
  I18nProvider,
  ToggleButton,
  Inset,
} from '@marigold/components';

type Member = {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  email: string;
  status: 'Active' | 'On Leave';
  joinedDate: Date;
  bio?: string;
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

type ActivityLog = {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
};

type CalendarEvent = {
  id: string;
  date: Date;
  name: string;
  type: 'Meeting' | 'Deadline' | 'Social';
};

type SharedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: Date;
};

type TeamSettings = {
  teamName: string;
  description: string;
  defaultTimezone: 'UTC' | 'CET' | 'EST' | 'PST';
  dateFormat: 'MM/DD/YYYY' | 'DD.MM.YYYY' | 'YYYY-MM-DD';
  notifications: {
    newMemberJoins: boolean;
    projectDeadlineApproaching: boolean;
    weeklyDigest: boolean;
    mentionNotifications: boolean;
    calendarReminders: boolean;
  };
  integrations: {
    slack: boolean;
    github: boolean;
    jira: boolean;
  };
};

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 0, 15),
    bio: 'Full-stack engineer with 5 years experience',
  },
  {
    id: '2',
    name: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 2, 10),
    bio: 'UX/UI designer focusing on accessibility',
  },
  {
    id: '3',
    name: 'Carol White',
    role: 'Manager',
    email: 'carol@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2023, 6, 20),
    bio: 'Product manager with agile expertise',
  },
  {
    id: '4',
    name: 'David Lee',
    role: 'Developer',
    email: 'david@teamhub.com',
    status: 'On Leave',
    joinedDate: new Date(2024, 1, 5),
    bio: 'Backend specialist in Node.js',
  },
  {
    id: '5',
    name: 'Emma Davis',
    role: 'QA',
    email: 'emma@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 3, 1),
    bio: 'Quality assurance and test automation',
  },
  {
    id: '6',
    name: 'Frank Miller',
    role: 'Developer',
    email: 'frank@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2023, 11, 8),
    bio: 'React specialist and performance expert',
  },
];

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Mobile App Redesign',
    lead: 'Carol White',
    members: 4,
    deadline: new Date(2026, 7, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'API v2 Development',
    lead: 'David Lee',
    members: 3,
    deadline: new Date(2026, 8, 30),
    progress: 60,
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'Performance Optimization',
    lead: 'Frank Miller',
    members: 2,
    deadline: new Date(2026, 6, 10),
    progress: 45,
    status: 'Active',
  },
  {
    id: 'p4',
    name: 'Security Audit',
    lead: 'Alice Johnson',
    members: 3,
    deadline: new Date(2026, 9, 5),
    progress: 30,
    status: 'On Hold',
  },
  {
    id: 'p5',
    name: 'Design System v3',
    lead: 'Bob Smith',
    members: 5,
    deadline: new Date(2026, 10, 20),
    progress: 100,
    status: 'Completed',
  },
];

const initialActivityLog: ActivityLog[] = [
  {
    id: 'a1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Mobile App Redesign',
    date: new Date(2026, 5, 28, 14, 30),
  },
  {
    id: 'a2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'API v2 Development',
    date: new Date(2026, 5, 28, 10, 15),
  },
  {
    id: 'a3',
    member: 'Frank Miller',
    action: 'Deploy',
    project: 'Performance Optimization',
    date: new Date(2026, 5, 27, 16, 45),
  },
  {
    id: 'a4',
    member: 'Emma Davis',
    action: 'Review',
    project: 'Mobile App Redesign',
    date: new Date(2026, 5, 27, 11, 20),
  },
  {
    id: 'a5',
    member: 'Carol White',
    action: 'Commit',
    project: 'API v2 Development',
    date: new Date(2026, 5, 26, 9, 0),
  },
];

const initialEvents: CalendarEvent[] = [
  {
    id: 'e1',
    date: new Date(2026, 5, 30),
    name: 'Team Standup',
    type: 'Meeting',
  },
  {
    id: 'e2',
    date: new Date(2026, 6, 1),
    name: 'Sprint Review',
    type: 'Deadline',
  },
  {
    id: 'e3',
    date: new Date(2026, 6, 5),
    name: 'Team Lunch',
    type: 'Social',
  },
  {
    id: 'e4',
    date: new Date(2026, 6, 10),
    name: 'Design Review',
    type: 'Meeting',
  },
];

const initialFiles: SharedFile[] = [
  {
    id: 'f1',
    name: 'Q2 Report.pdf',
    type: 'PDF',
    size: 2.4,
    uploadedBy: 'Carol White',
    date: new Date(2026, 5, 25),
  },
  {
    id: 'f2',
    name: 'Brand Guidelines.figma',
    type: 'Design',
    size: 15.8,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 5, 20),
  },
  {
    id: 'f3',
    name: 'Budget.xlsx',
    type: 'Spreadsheet',
    size: 1.2,
    uploadedBy: 'Carol White',
    date: new Date(2026, 5, 18),
  },
  {
    id: 'f4',
    name: 'Team Photo.jpg',
    type: 'Image',
    size: 4.5,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 5, 15),
  },
  {
    id: 'f5',
    name: 'Project Plan.docx',
    type: 'Document',
    size: 0.8,
    uploadedBy: 'David Lee',
    date: new Date(2026, 5, 10),
  },
];

const Dashboard = ({ members }: { members: Member[] }) => (
  <Stack space={6}>
    <Headline level={1}>Team Overview</Headline>

    <Tiles tilesWidth="200px" space={3}>
      <Card>
        <Stack space={2} alignX="center">
          <Text as="div" align="center">
            Members
          </Text>
          <Headline level={2} align="center">
            {members.length}
          </Headline>
        </Stack>
      </Card>
      <Card>
        <Stack space={2} alignX="center">
          <Text as="div" align="center">
            Active Projects
          </Text>
          <Headline level={2} align="center">
            5
          </Headline>
        </Stack>
      </Card>
      <Card>
        <Stack space={2} alignX="center">
          <Text as="div" align="center">
            Upcoming Deadlines
          </Text>
          <Headline level={2} align="center">
            8
          </Headline>
        </Stack>
      </Card>
      <Card>
        <Stack space={2} alignX="center">
          <Text as="div" align="center">
            Hours This Week
          </Text>
          <Headline level={2} align="center">
            <Tooltip.Trigger>
              <NumericFormat value={342} />
              <Tooltip>Aggregate of all team members.</Tooltip>
            </Tooltip.Trigger>
          </Headline>
        </Stack>
      </Card>
    </Tiles>

    <Stack space={2}>
      <Headline level={2}>Recent Activity</Headline>
      <Table aria-label="Recent activity log">
        <Table.Header>
          <Table.Column rowHeader>Member</Table.Column>
          <Table.Column>Action</Table.Column>
          <Table.Column>Project</Table.Column>
          <Table.Column>Date</Table.Column>
        </Table.Header>
        <Table.Body>
          {initialActivityLog.map(log => (
            <Table.Row key={log.id}>
              <Table.Cell>{log.member}</Table.Cell>
              <Table.Cell>
                <Badge
                  variant={
                    log.action === 'Commit'
                      ? 'info'
                      : log.action === 'Review'
                        ? 'warning'
                        : 'success'
                  }
                >
                  {log.action}
                </Badge>
              </Table.Cell>
              <Table.Cell>{log.project}</Table.Cell>
              <Table.Cell>
                <DateFormat value={log.date} dateStyle="medium" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
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

const Members = ({ members, setMembers }: { members: Member[]; setMembers: (m: Member[]) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const confirm = useConfirmation();

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddMember = (formData: Partial<Member>) => {
    const newMember: Member = {
      id: String(members.length + 1),
      name: formData.name || '',
      role: formData.role as Member['role'],
      email: formData.email || '',
      status: 'Active',
      joinedDate: formData.joinedDate || new Date(),
      bio: formData.bio,
    };
    setMembers([...members, newMember]);
    setShowDialog(false);
  };

  const handleEditMember = (formData: Partial<Member>) => {
    if (editingMember) {
      setMembers(
        members.map(m =>
          m.id === editingMember.id ? { ...m, ...formData } : m
        )
      );
      setEditingMember(null);
      setShowDialog(false);
    }
  };

  const handleRemoveMember = async (id: string) => {
    try {
      await confirm({
        title: 'Remove Member',
        content: 'Are you sure you want to remove this member?',
        confirmationLabel: 'Remove',
        variant: 'destructive',
      });
      setMembers(members.filter(m => m.id !== id));
    } catch {
      // Cancelled
    }
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Team Members</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search members..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Select label="" value={roleFilter} onChange={(val: string | number | null) => setRoleFilter(String(val))}>
          <Select.Option id="All Roles">All Roles</Select.Option>
          <Select.Option id="Developer">Developer</Select.Option>
          <Select.Option id="Designer">Designer</Select.Option>
          <Select.Option id="Manager">Manager</Select.Option>
          <Select.Option id="QA">QA</Select.Option>
        </Select>
        <ToggleButton
          onPress={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
        >
          {viewMode === 'table' ? 'Cards' : 'Table'}
        </ToggleButton>
        <Dialog.Trigger open={showDialog} onOpenChange={setShowDialog}>
          <Button variant="primary">
            + Add Member
          </Button>
          <MemberDialog
            member={editingMember}
            onSubmit={
              editingMember ? handleEditMember : handleAddMember
            }
            onClose={() => {
              setShowDialog(false);
              setEditingMember(null);
            }}
          />
        </Dialog.Trigger>
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
          <Table.Body>
            {filteredMembers.map(member => (
              <Table.Row key={member.id}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>
                  <Badge variant="default">{member.role}</Badge>
                </Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>
                  <Badge
                    variant={
                      member.status === 'Active' ? 'success' : 'warning'
                    }
                  >
                    {member.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <DateFormat value={member.joinedDate} dateStyle="medium" />
                </Table.Cell>
                <Table.Cell>
                  <Menu label="" onAction={id => {
                    if (id === 'edit') {
                      setEditingMember(member);
                      setShowDialog(true);
                    } else if (id === 'remove') {
                      handleRemoveMember(member.id);
                    }
                  }}>
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
      ) : (
        <Tiles tilesWidth="280px" space={3} stretch>
          {filteredMembers.map(member => (
            <Card key={member.id}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Headline level={3}>{member.name}</Headline>
                  <Badge variant="default">{member.role}</Badge>
                </Inline>
                <Text>{member.email}</Text>
                <Inline space={2}>
                  <Button size="small" variant="secondary" onPress={() => setSelectedMember(member)}>
                    Profile
                  </Button>
                  <Menu label="" onAction={id => {
                    if (id === 'edit') {
                      setEditingMember(member);
                      setShowDialog(true);
                    } else if (id === 'remove') {
                      handleRemoveMember(member.id);
                    }
                  }}>
                    <Menu.Item id="edit">Edit</Menu.Item>
                    <Menu.Item id="remove" variant="destructive">
                      Remove
                    </Menu.Item>
                  </Menu>
                </Inline>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {selectedMember && (
        <Drawer.Trigger>
          <Drawer size="medium">
            <Drawer.Title>{selectedMember.name}</Drawer.Title>
            <Drawer.Content>
              <Stack space={3}>
                <Stack space={1}>
                  <Text weight="bold">Email:</Text>
                  <Text>{selectedMember.email}</Text>
                </Stack>
                <Stack space={1}>
                  <Text weight="bold">Role:</Text>
                  <Text>{selectedMember.role}</Text>
                </Stack>
                <Stack space={1}>
                  <Text weight="bold">Status:</Text>
                  <Badge
                    variant={
                      selectedMember.status === 'Active' ? 'success' : 'warning'
                    }
                  >
                    {selectedMember.status}
                  </Badge>
                </Stack>
                <Stack space={1}>
                  <Text weight="bold">Joined:</Text>
                  <DateFormat
                    value={selectedMember.joinedDate}
                    dateStyle="long"
                  />
                </Stack>
                {selectedMember.bio && (
                  <Stack space={1}>
                    <Text weight="bold">Bio:</Text>
                    <Text>{selectedMember.bio}</Text>
                  </Stack>
                )}
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button slot="close">Close</Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      )}
    </Stack>
  );
};

const MemberDialog = ({
  member,
  onSubmit,
  onClose,
}: {
  member: Member | null;
  onSubmit: (data: Partial<Member>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<Member>>(
    member || { name: '', email: '', role: 'Developer', joinedDate: new Date() }
  );

  return (
    <Dialog size="medium">
      <Dialog.Title>{member ? 'Edit Member' : 'Add Member'}</Dialog.Title>
      <Dialog.Content>
        <Stack space={3}>
          <TextField
            label="Full Name"
            required
            value={formData.name || ''}
            onChange={e => setFormData({ ...formData, name: e })}
          />
          <TextField
            label="Email"
            type="email"
            required
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e })}
          />
          <Select
            label="Role"
            value={formData.role || 'Developer'}
            onChange={v => setFormData({ ...formData, role: v as Member['role'] })}
          >
            <Select.Option id="Developer">Developer</Select.Option>
            <Select.Option id="Designer">Designer</Select.Option>
            <Select.Option id="Manager">Manager</Select.Option>
            <Select.Option id="QA">QA</Select.Option>
          </Select>
          <TextArea
            label="Bio"
            placeholder="Optional bio..."
            value={formData.bio || ''}
            onChange={e => setFormData({ ...formData, bio: e })}
          />
        </Stack>
      </Dialog.Content>
      <Dialog.Actions>
        <Button slot="close">Cancel</Button>
        <Button
          variant="primary"
          slot="close"
          onPress={() => onSubmit(formData)}
        >
          {member ? 'Update' : 'Add'}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const Projects = ({ projects, setProjects }: { projects: Project[]; setProjects: (p: Project[]) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const confirm = useConfirmation();

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArchive = async () => {
    try {
      await confirm({
        title: 'Archive Selected',
        content: 'Are you sure you want to archive the selected projects?',
        confirmationLabel: 'Archive',
        variant: 'destructive',
      });
      setProjects(
        projects.filter(p => !selectedIds.has(p.id))
      );
      setSelectedIds(new Set());
    } catch {
      // Cancelled
    }
  };

  return (
    <Stack space={4}>
      <Inline space={2} alignY="center">
        <Headline level={1}>Projects</Headline>
        <SearchField
          placeholder="Search projects..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Button variant="primary">
          + New Project
        </Button>
      </Inline>

      {selectedIds.size > 0 && (
        <ActionBar>
          <ActionBar.Button onPress={handleArchive}>
            Archive Selected ({selectedIds.size})
          </ActionBar.Button>
          <ActionBar.Button
            onPress={() => {
              // Export logic here
            }}
          >
            Export
          </ActionBar.Button>
        </ActionBar>
      )}

      <Table
        aria-label="Projects list"
        selectionMode="multiple"
        selectedKeys={selectedIds}
        onSelectionChange={keys => setSelectedIds(new Set(Array.from(keys).map(k => String(k))))}
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
};

const TeamCalendar = () => {
  const currentMonth = new Date(2026, 5);

  return (
    <Stack space={4}>
      <Headline level={1}>Team Calendar</Headline>

      <Columns columns={[1, 1]} collapseAt="tablet">
        <Calendar
          aria-label="Team calendar"
          visibleDuration={{ months: 1 }}
        />

        <Stack space={2}>
          <Headline level={2}>Upcoming Events</Headline>
          {initialEvents.map(event => (
            <Card key={event.id}>
              <Inline space={3} alignY="center">
                <Stack space={1}>
                  <DateFormat value={event.date} dateStyle="medium" />
                  <Text weight="bold">{event.name}</Text>
                </Stack>
                <Badge
                  variant={
                    event.type === 'Meeting'
                      ? 'info'
                      : event.type === 'Deadline'
                        ? 'warning'
                        : 'default'
                  }
                >
                  {event.type}
                </Badge>
              </Inline>
            </Card>
          ))}
        </Stack>
      </Columns>
    </Stack>
  );
};

const Files = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [files, setFiles] = useState(initialFiles);

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === 'All' ||
      (typeFilter === 'Documents' && ['PDF', 'Document'].includes(f.type)) ||
      (typeFilter === 'Images' && f.type === 'Image') ||
      (typeFilter === 'Spreadsheets' && f.type === 'Spreadsheet');
    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    setShowUploadDialog(false);
    // Toast would show here
  };

  return (
    <Stack space={4}>
      <Headline level={1}>Shared Files</Headline>

      <Inline space={2}>
        <SearchField
          placeholder="Search files..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Select label="" value={typeFilter} onChange={(val: string | number | null) => setTypeFilter(String(val))}>
          <Select.Option id="All">All</Select.Option>
          <Select.Option id="Documents">Documents</Select.Option>
          <Select.Option id="Images">Images</Select.Option>
          <Select.Option id="Spreadsheets">Spreadsheets</Select.Option>
        </Select>
        <Dialog.Trigger open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <Button variant="primary">
            + Upload
          </Button>
          <Dialog size="medium">
            <Dialog.Title>Upload Files</Dialog.Title>
            <Dialog.Content>
              <Stack space={3}>
                <FileField label="Select files" multiple />
                <TextField
                  label="Description"
                  placeholder="Optional description..."
                />
                <Select label="Category">
                  <Select.Option id="general">General</Select.Option>
                  <Select.Option id="docs">Documents</Select.Option>
                  <Select.Option id="design">Design</Select.Option>
                </Select>
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close" onPress={handleUpload}>
                Upload
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Dialog.Trigger>
      </Inline>

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
          {filteredFiles.map(file => (
            <Table.Row key={file.id}>
              <Table.Cell>{file.name}</Table.Cell>
              <Table.Cell>{file.type}</Table.Cell>
              <Table.Cell>
                <NumericFormat value={file.size} notation="compact" /> MB
              </Table.Cell>
              <Table.Cell>{file.uploadedBy}</Table.Cell>
              <Table.Cell>
                <DateFormat value={file.date} dateStyle="medium" />
              </Table.Cell>
              <Table.Cell>
                <Menu label="" onAction={id => {
                  if (id === 'download') {
                    // Download logic
                  } else if (id === 'rename') {
                    // Rename logic
                  } else if (id === 'delete') {
                    setFiles(files.filter(f => f.id !== file.id));
                  }
                }}>
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

const Settings = ({ settings, setSettings }: { settings: TeamSettings; setSettings: (s: TeamSettings) => void }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [showToast, setShowToast] = useState(false);

  return (
    <Stack space={4}>
      <Headline level={1}>Team Settings</Headline>

      <Tabs aria-label="Settings tabs" onSelectionChange={(key: string | number) => setActiveTab(String(key))}>
        <Tabs.List aria-label="Tabs">
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Stack space={4}>
            <TextField
              label="Team Name"
              value={settings.teamName}
              onChange={v =>
                setSettings({ ...settings, teamName: v })
              }
            />
            <TextArea
              label="Description"
              value={settings.description}
              onChange={v =>
                setSettings({ ...settings, description: v })
              }
            />
            <Select
              label="Default Timezone"
              value={settings.defaultTimezone}
              onChange={v =>
                setSettings({
                  ...settings,
                  defaultTimezone: v as TeamSettings['defaultTimezone'],
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
              value={settings.dateFormat}
              onChange={v =>
                setSettings({
                  ...settings,
                  dateFormat: v as TeamSettings['dateFormat'],
                })
              }
            >
              <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
              <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
              <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
            </Select>
            <Button
              variant="primary"
              onPress={() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
            >
              Save Settings
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Stack space={3}>
            <Switch
              label="New member joins"
              selected={settings.notifications.newMemberJoins}
              onChange={v =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    newMemberJoins: v,
                  },
                })
              }
            />
            <Text>Get notified when someone joins the team</Text>

            <Switch
              label="Project deadline approaching"
              selected={settings.notifications.projectDeadlineApproaching}
              onChange={v =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    projectDeadlineApproaching: v,
                  },
                })
              }
            />
            <Text>Reminder 3 days before deadline</Text>

            <Switch
              label="Weekly digest"
              selected={settings.notifications.weeklyDigest}
              onChange={v =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    weeklyDigest: v,
                  },
                })
              }
            />
            <Text>Summary of team activity every Monday</Text>

            <Switch
              label="Mention notifications"
              selected={settings.notifications.mentionNotifications}
              onChange={v =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    mentionNotifications: v,
                  },
                })
              }
            />
            <Text>When someone mentions you in a comment</Text>

            <Switch
              label="Calendar reminders"
              selected={settings.notifications.calendarReminders}
              onChange={v =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    calendarReminders: v,
                  },
                })
              }
            />
            <Text>15 minutes before scheduled events</Text>

            <Button
              variant="primary"
              onPress={() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
            >
              Save Preferences
            </Button>
          </Stack>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Tiles tilesWidth="250px" space={3}>
            <IntegrationCard
              name="Slack"
              description="Connect your team Slack workspace"
              connected={settings.integrations.slack}
              onToggle={() =>
                setSettings({
                  ...settings,
                  integrations: {
                    ...settings.integrations,
                    slack: !settings.integrations.slack,
                  },
                })
              }
            />
            <IntegrationCard
              name="GitHub"
              description="Sync with GitHub repositories"
              connected={settings.integrations.github}
              onToggle={() =>
                setSettings({
                  ...settings,
                  integrations: {
                    ...settings.integrations,
                    github: !settings.integrations.github,
                  },
                })
              }
            />
            <IntegrationCard
              name="Jira"
              description="Connect with Jira projects"
              connected={settings.integrations.jira}
              onToggle={() =>
                setSettings({
                  ...settings,
                  integrations: {
                    ...settings.integrations,
                    jira: !settings.integrations.jira,
                  },
                })
              }
            />
          </Tiles>
        </Tabs.TabPanel>
      </Tabs>

      {showToast && (
        <SectionMessage variant="success">
          <SectionMessage.Title>Settings updated</SectionMessage.Title>
        </SectionMessage>
      )}
    </Stack>
  );
};

const IntegrationCard = ({
  name,
  description,
  connected,
  onToggle,
}: {
  name: string;
  description: string;
  connected: boolean;
  onToggle: () => void;
}) => {
  const confirm = useConfirmation();

  const handleDisconnect = async () => {
    try {
      await confirm({
        title: `Disconnect ${name}`,
        content: `Are you sure you want to disconnect ${name}?`,
        confirmationLabel: 'Disconnect',
        variant: 'destructive',
      });
      onToggle();
    } catch {
      // Cancelled
    }
  };

  return (
    <Card>
      <Stack space={2}>
        <Headline level={3}>{name}</Headline>
        <Text>{description}</Text>
        <Stack space={1}>
          {connected ? (
            <Badge variant="success">Connected</Badge>
          ) : (
            <Badge variant="default">Not connected</Badge>
          )}
        </Stack>
        {connected ? (
          <Button
            variant="secondary"
            onPress={handleDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <Button variant="primary" onPress={onToggle}>
            Connect
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default function TestApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [members, setMembers] = useState(initialMembers);
  const [projects, setProjects] = useState(initialProjects);
  const [settings, setSettings] = useState<TeamSettings>({
    teamName: 'TeamHub',
    description: 'High-performing product team',
    defaultTimezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      newMemberJoins: true,
      projectDeadlineApproaching: true,
      weeklyDigest: true,
      mentionNotifications: true,
      calendarReminders: true,
    },
    integrations: {
      slack: true,
      github: false,
      jira: false,
    },
  });

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'projects', label: 'Projects' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'files', label: 'Files' },
  ];

  const getPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard members={members} />;
      case 'members':
        return <Members members={members} setMembers={setMembers} />;
      case 'projects':
        return <Projects projects={projects} setProjects={setProjects} />;
      case 'calendar':
        return <TeamCalendar />;
      case 'files':
        return <Files />;
      case 'settings':
        return <Settings settings={settings} setSettings={setSettings} />;
      default:
        return <Dashboard members={members} />;
    }
  };

  const getBreadcrumbLabel = () => {
    const item = navigationItems.find(i => i.id === currentPage);
    return item ? item.label : 'Dashboard';
  };

  return (
    <I18nProvider locale="en-US">
      <Sidebar.Provider defaultOpen>
        <AppLayout>
          <AppLayout.Sidebar>
            <Sidebar.Header>
              <Text weight="bold" size="large">
                {settings.teamName}
              </Text>
            </Sidebar.Header>
            <Sidebar.Nav>
              {navigationItems.map(item => (
                <Sidebar.Item
                  key={item.id}
                  active={currentPage === item.id}
                  onPress={() => setCurrentPage(item.id)}
                >
                  {item.label}
                </Sidebar.Item>
              ))}
            </Sidebar.Nav>
            <Sidebar.Footer>
              <Sidebar.Item
                active={currentPage === 'settings'}
                onPress={() => setCurrentPage('settings')}
              >
                Settings
              </Sidebar.Item>
            </Sidebar.Footer>
          </AppLayout.Sidebar>

          <AppLayout.Header>
            <TopNavigation.Start>
              <Sidebar.Toggle />
            </TopNavigation.Start>
            <TopNavigation.Middle>
              <Breadcrumbs>
                <Breadcrumbs.Item href="#">{settings.teamName}</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#">
                  {getBreadcrumbLabel()}
                </Breadcrumbs.Item>
              </Breadcrumbs>
            </TopNavigation.Middle>
            <TopNavigation.End>
              <Menu label="John Doe" onAction={() => {}}>
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="preferences">Preferences</Menu.Item>
                <Menu.Item id="signout" variant="destructive">
                  Sign Out
                </Menu.Item>
              </Menu>
              <Tooltip.Trigger>
                <Button variant="ghost" size="small">
                  ℹ️
                </Button>
                <Tooltip>Use the sidebar to navigate between sections.</Tooltip>
              </Tooltip.Trigger>
            </TopNavigation.End>
          </AppLayout.Header>

          <AppLayout.Main>
            <Inset space="square-relaxed">
              {getPageContent()}
            </Inset>
          </AppLayout.Main>
        </AppLayout>
      </Sidebar.Provider>
    </I18nProvider>
  );
}
