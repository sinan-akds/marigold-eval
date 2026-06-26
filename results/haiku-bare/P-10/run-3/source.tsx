import React, { useState, useMemo } from 'react';
import {
  Box,
  Stack,
  Flex,
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTrigger,
  Heading,
  Text,
  Popover,
  PopoverTrigger,
  Card,
  Badge,
  Toast,
  ToastContainer,
  Checkbox,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Switch,
  Tooltip,
  TooltipTrigger,
  Icon,
  Indicator,
  FileField,
  TextArea,
  NumberField,
  DateField,
} from '@marigold/components';

interface Member {
  id: string;
  fullName: string;
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

interface ActivityLog {
  id: string;
  member: string;
  action: 'Commit' | 'Review' | 'Deploy';
  project: string;
  date: Date;
}

interface File {
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

type Page = 'dashboard' | 'members' | 'projects' | 'calendar' | 'files' | 'settings';

// Initial data
const initialMembers: Member[] = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    role: 'Developer',
    email: 'alice@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 0, 15),
    bio: 'Senior frontend developer with 5 years experience',
  },
  {
    id: '2',
    fullName: 'Bob Smith',
    role: 'Designer',
    email: 'bob@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 1, 20),
    bio: 'UI/UX designer specializing in web applications',
  },
  {
    id: '3',
    fullName: 'Carol White',
    role: 'Manager',
    email: 'carol@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2023, 6, 10),
    bio: 'Project manager and team lead',
  },
  {
    id: '4',
    fullName: 'David Brown',
    role: 'Developer',
    email: 'david@teamhub.com',
    status: 'On Leave',
    joinedDate: new Date(2023, 11, 5),
    bio: 'Backend developer',
  },
  {
    id: '5',
    fullName: 'Eve Davis',
    role: 'QA',
    email: 'eve@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 3, 1),
    bio: 'Quality assurance engineer',
  },
  {
    id: '6',
    fullName: 'Frank Miller',
    role: 'Developer',
    email: 'frank@teamhub.com',
    status: 'Active',
    joinedDate: new Date(2024, 2, 15),
    bio: 'Full stack developer',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Mobile App Redesign',
    lead: 'Alice Johnson',
    members: 4,
    deadline: new Date(2026, 7, 15),
    progress: 75,
    status: 'Active',
  },
  {
    id: '2',
    name: 'API Integration',
    lead: 'David Brown',
    members: 3,
    deadline: new Date(2026, 6, 30),
    progress: 45,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Dashboard Analytics',
    lead: 'Alice Johnson',
    members: 5,
    deadline: new Date(2026, 5, 20),
    progress: 100,
    status: 'Completed',
  },
  {
    id: '4',
    name: 'Documentation Update',
    lead: 'Carol White',
    members: 2,
    deadline: new Date(2026, 8, 1),
    progress: 30,
    status: 'On Hold',
  },
  {
    id: '5',
    name: 'Performance Optimization',
    lead: 'Frank Miller',
    members: 3,
    deadline: new Date(2026, 7, 1),
    progress: 60,
    status: 'Active',
  },
];

const initialActivities: ActivityLog[] = [
  {
    id: '1',
    member: 'Alice Johnson',
    action: 'Commit',
    project: 'Mobile App Redesign',
    date: new Date(2026, 4, 28),
  },
  {
    id: '2',
    member: 'Bob Smith',
    action: 'Review',
    project: 'API Integration',
    date: new Date(2026, 4, 27),
  },
  {
    id: '3',
    member: 'Frank Miller',
    action: 'Deploy',
    project: 'Dashboard Analytics',
    date: new Date(2026, 4, 26),
  },
  {
    id: '4',
    member: 'Eve Davis',
    action: 'Review',
    project: 'Mobile App Redesign',
    date: new Date(2026, 4, 25),
  },
  {
    id: '5',
    member: 'Carol White',
    action: 'Commit',
    project: 'Documentation Update',
    date: new Date(2026, 4, 24),
  },
];

const initialFiles: File[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'Document',
    size: 2.4,
    uploadedBy: 'Carol White',
    date: new Date(2026, 4, 20),
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    type: 'Image',
    size: 5.1,
    uploadedBy: 'Alice Johnson',
    date: new Date(2026, 4, 18),
  },
  {
    id: '3',
    name: 'Budget Spreadsheet.xlsx',
    type: 'Spreadsheet',
    size: 1.8,
    uploadedBy: 'Carol White',
    date: new Date(2026, 4, 15),
  },
  {
    id: '4',
    name: 'Design System.pdf',
    type: 'Document',
    size: 8.2,
    uploadedBy: 'Bob Smith',
    date: new Date(2026, 4, 12),
  },
  {
    id: '5',
    name: 'Team Statistics.xlsx',
    type: 'Spreadsheet',
    size: 3.5,
    uploadedBy: 'Frank Miller',
    date: new Date(2026, 4, 10),
  },
];

const upcomingEvents: CalendarEvent[] = [
  {
    id: '1',
    date: new Date(2026, 5, 25),
    name: 'Q2 Retrospective',
    type: 'Meeting',
  },
  {
    id: '2',
    date: new Date(2026, 5, 28),
    name: 'Sprint 14 Deadline',
    type: 'Deadline',
  },
  {
    id: '3',
    date: new Date(2026, 6, 5),
    name: 'Team Lunch',
    type: 'Social',
  },
  {
    id: '4',
    date: new Date(2026, 6, 10),
    name: 'Mid-year Review',
    type: 'Meeting',
  },
];

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatFileSize = (bytes: number): string => {
  return `${bytes.toLocaleString('en-US', { maximumFractionDigits: 1 })} MB`;
};

function Dashboard({ memberCount }: { memberCount: number }) {
  return (
    <Stack gap="large">
      <Heading level="1">Team Overview</Heading>

      {/* Summary Cards */}
      <Flex justifyContent="space-between" wrap="wrap" gap="medium">
        <Card>
          <Stack gap="small">
            <Text variant="headlineSmall">Members</Text>
            <Text variant="displaySmall">{memberCount}</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap="small">
            <Text variant="headlineSmall">Active Projects</Text>
            <Text variant="displaySmall">5</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap="small">
            <Text variant="headlineSmall">Upcoming Deadlines</Text>
            <Text variant="displaySmall">8</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap="small">
            <Text variant="headlineSmall">
              <TooltipTrigger>
                <Button variant="plain" size="small">
                  Hours This Week
                </Button>
                <Tooltip>Aggregate of all team members.</Tooltip>
              </TooltipTrigger>
            </Text>
            <Text variant="displaySmall">{(342).toLocaleString('en-US')}</Text>
          </Stack>
        </Card>
      </Flex>

      {/* Recent Activity Table */}
      <Stack gap="small">
        <Heading level="2">Recent Activity</Heading>
        <Table aria-label="Recent team activity">
          <TableHeader>
            <TableColumn>Member</TableColumn>
            <TableColumn>Action</TableColumn>
            <TableColumn>Project</TableColumn>
            <TableColumn>Date</TableColumn>
          </TableHeader>
          <TableBody>
            {initialActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.member}</TableCell>
                <TableCell>
                  <Indicator
                    variant={
                      activity.action === 'Commit'
                        ? 'info'
                        : activity.action === 'Review'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {activity.action}
                  </Indicator>
                </TableCell>
                <TableCell>{activity.project}</TableCell>
                <TableCell>{formatDate(activity.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      {/* Info Banner */}
      <Box
        style={{
          padding: '12px 16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          borderLeft: '4px solid #2196f3',
        }}
      >
        <Text>Sprint 14 ends in 3 days. Review the project board for outstanding tasks.</Text>
      </Box>
    </Stack>
  );
}

function Members({
  members,
  onAdd,
  onEdit,
  onRemove,
  selectedMember,
  onSelectMember,
}: {
  members: Member[];
  onAdd: (member: Member) => void;
  onEdit: (member: Member) => void;
  onRemove: (id: string) => void;
  selectedMember: Member | null;
  onSelectMember: (member: Member | null) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchTerm, roleFilter]);

  const handleAddMember = (member: Member) => {
    onAdd(member);
    setIsDialogOpen(false);
    setEditingMember(null);
    setToastMessage(`${member.fullName} added successfully`);
  };

  const handleEditMember = (member: Member) => {
    onEdit(member);
    setIsDialogOpen(false);
    setEditingMember(null);
    setToastMessage(`${member.fullName} updated successfully`);
  };

  const handleRemoveMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member && window.confirm(`Remove ${member.fullName}?`)) {
      onRemove(id);
      setToastMessage(`${member.fullName} removed`);
    }
  };

  return (
    <Stack gap="large">
      <Heading level="1">Team Members</Heading>

      {/* Toolbar */}
      <Flex justifyContent="space-between" gap="medium" wrap="wrap">
        <Flex gap="medium" flex={1}>
          <TextField
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={roleFilter} onChange={(value) => setRoleFilter(value as string)}>
            <option>All Roles</option>
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
            <option>QA</option>
          </Select>
          <Flex gap="small">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'card' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('card')}
            >
              Cards
            </Button>
          </Flex>
        </Flex>
        <DialogTrigger
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <Button variant="primary">Add Member</Button>
          <Dialog>
            <AddEditMemberForm
              member={editingMember}
              onSubmit={(member) =>
                editingMember ? handleEditMember(member) : handleAddMember(member)
              }
              onClose={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </DialogTrigger>
      </Flex>

      {/* Members Table View */}
      {viewMode === 'table' && (
        <Table aria-label="Team members table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Joined</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} onPress={() => onSelectMember(member)}>
                <TableCell>{member.fullName}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Indicator variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Indicator>
                </TableCell>
                <TableCell>{formatDate(member.joinedDate)}</TableCell>
                <TableCell>
                  <Flex gap="small">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setEditingMember(member);
                        setIsDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Members Card View */}
      {viewMode === 'card' && (
        <Flex wrap="wrap" gap="medium">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              style={{ flex: '1 1 calc(33.333% - 12px)', minWidth: '250px', cursor: 'pointer' }}
              onClick={() => onSelectMember(member)}
            >
              <Stack gap="medium">
                <Stack gap="small">
                  <Text variant="headlineSmall">{member.fullName}</Text>
                  <Indicator variant="info">{member.role}</Indicator>
                  <Text variant="bodySmall">{member.email}</Text>
                </Stack>
                <Flex gap="small">
                  <Button variant="secondary" size="small" flex={1}>
                    Message
                  </Button>
                  <Button variant="secondary" size="small" flex={1}>
                    Profile
                  </Button>
                </Flex>
              </Stack>
            </Card>
          ))}
        </Flex>
      )}

      {/* Detail Panel */}
      {selectedMember && (
        <Card
          style={{
            position: 'fixed',
            right: 0,
            top: '80px',
            width: '300px',
            height: 'calc(100vh - 80px)',
            overflowY: 'auto',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
            zIndex: 100,
          }}
        >
          <Stack gap="medium">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading level="2">Details</Heading>
              <Button variant="plain" size="small" onClick={() => onSelectMember(null)}>
                ✕
              </Button>
            </Flex>
            <Stack gap="small">
              <Text variant="bodySmall" style={{ color: '#666' }}>
                Name
              </Text>
              <Text variant="bodyMedium">{selectedMember.fullName}</Text>
            </Stack>
            <Stack gap="small">
              <Text variant="bodySmall" style={{ color: '#666' }}>
                Role
              </Text>
              <Text variant="bodyMedium">{selectedMember.role}</Text>
            </Stack>
            <Stack gap="small">
              <Text variant="bodySmall" style={{ color: '#666' }}>
                Email
              </Text>
              <Text variant="bodyMedium">{selectedMember.email}</Text>
            </Stack>
            <Stack gap="small">
              <Text variant="bodySmall" style={{ color: '#666' }}>
                Status
              </Text>
              <Indicator variant={selectedMember.status === 'Active' ? 'success' : 'warning'}>
                {selectedMember.status}
              </Indicator>
            </Stack>
            <Stack gap="small">
              <Text variant="bodySmall" style={{ color: '#666' }}>
                Joined
              </Text>
              <Text variant="bodyMedium">{formatDate(selectedMember.joinedDate)}</Text>
            </Stack>
            {selectedMember.bio && (
              <Stack gap="small">
                <Text variant="bodySmall" style={{ color: '#666' }}>
                  Bio
                </Text>
                <Text variant="bodySmall">{selectedMember.bio}</Text>
              </Stack>
            )}
          </Stack>
        </Card>
      )}

      {toastMessage && (
        <ToastContainer position="bottom-right">
          <Toast>{toastMessage}</Toast>
        </ToastContainer>
      )}
    </Stack>
  );
}

function AddEditMemberForm({
  member,
  onSubmit,
  onClose,
}: {
  member: Member | null;
  onSubmit: (member: Member) => void;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState(member?.fullName || '');
  const [email, setEmail] = useState(member?.email || '');
  const [role, setRole] = useState<Member['role']>(member?.role || 'Developer');
  const [bio, setBio] = useState(member?.bio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newMember: Member = {
      id: member?.id || Date.now().toString(),
      fullName,
      email,
      role,
      bio,
      status: member?.status || 'Active',
      joinedDate: member?.joinedDate || new Date(),
    };

    onSubmit(newMember);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="medium" style={{ padding: '20px' }}>
        <Heading level="2">{member ? 'Edit Member' : 'Add Member'}</Heading>

        <Stack gap="small">
          <Text variant="bodySmall">Full Name *</Text>
          <TextField
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            required
          />
        </Stack>

        <Stack gap="small">
          <Text variant="bodySmall">Email *</Text>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
        </Stack>

        <Stack gap="small">
          <Text variant="bodySmall">Role</Text>
          <Select value={role} onChange={(value) => setRole(value as Member['role'])}>
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
            <option>QA</option>
          </Select>
        </Stack>

        <Stack gap="small">
          <Text variant="bodySmall">Bio</Text>
          <TextArea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
        </Stack>

        <Flex gap="small" justifyContent="flex-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {member ? 'Update' : 'Add'}
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}

function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [projects, setProjects] = useState(initialProjects);
  const [toastMessage, setToastMessage] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  const handleArchive = () => {
    const remaining = projects.filter((p) => !selectedIds.has(p.id));
    setProjects(remaining);
    setSelectedIds(new Set());
    setToastMessage('Projects archived');
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <Stack gap="large">
      <Heading level="1">Projects</Heading>

      {/* Toolbar */}
      <Flex gap="medium">
        <TextField
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          flex={1}
        />
        <Button variant="primary">New Project</Button>
      </Flex>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Flex gap="medium" style={{ padding: '12px 16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <Text>{selectedIds.size} selected</Text>
          <Button variant="secondary" onClick={handleArchive}>
            Archive Selected
          </Button>
          <Button variant="secondary">Export</Button>
        </Flex>
      )}

      {/* Projects Table */}
      <Table aria-label="Projects table">
        <TableHeader>
          <TableColumn>
            <Checkbox
              isSelected={selectedIds.size === filteredProjects.length && filteredProjects.length > 0}
              onChange={() => {
                if (selectedIds.size === filteredProjects.length) {
                  setSelectedIds(new Set());
                } else {
                  setSelectedIds(new Set(filteredProjects.map((p) => p.id)));
                }
              }}
            />
          </TableColumn>
          <TableColumn>Project</TableColumn>
          <TableColumn>Lead</TableColumn>
          <TableColumn>Members</TableColumn>
          <TableColumn>Deadline</TableColumn>
          <TableColumn>Progress</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Checkbox
                  isSelected={selectedIds.has(project.id)}
                  onChange={() => toggleSelection(project.id)}
                />
              </TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.lead}</TableCell>
              <TableCell>{project.members}</TableCell>
              <TableCell>{formatDate(project.deadline)}</TableCell>
              <TableCell>{project.progress}%</TableCell>
              <TableCell>
                <Indicator
                  variant={
                    project.status === 'Active' ? 'info' : project.status === 'On Hold' ? 'warning' : 'success'
                  }
                >
                  {project.status}
                </Indicator>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {toastMessage && (
        <ToastContainer position="bottom-right">
          <Toast>{toastMessage}</Toast>
        </ToastContainer>
      )}
    </Stack>
  );
}

function Calendar() {
  const currentMonth = 5; // June
  const currentYear = 2026;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(currentYear, currentMonth)
  );

  return (
    <Stack gap="large">
      <Heading level="1">Team Calendar</Heading>

      {/* Calendar Grid */}
      <Card>
        <Stack gap="medium">
          <Text variant="headlineSmall">{monthName}</Text>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Box key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {day}
              </Box>
            ))}
            {days.map((day, index) => (
              <Box
                key={index}
                style={{
                  padding: '8px',
                  textAlign: 'center',
                  backgroundColor: day ? '#f5f5f5' : 'transparent',
                  borderRadius: '4px',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {day}
              </Box>
            ))}
          </Box>
        </Stack>
      </Card>

      {/* Upcoming Events */}
      <Stack gap="medium">
        <Heading level="2">Upcoming Events</Heading>
        <Stack gap="small">
          {upcomingEvents.map((event) => (
            <Flex key={event.id} gap="medium" alignItems="center">
              <Stack gap="small" flex={1}>
                <Text variant="bodyMedium">{formatDate(event.date)}</Text>
                <Text variant="bodyMedium">{event.name}</Text>
              </Stack>
              <Indicator
                variant={
                  event.type === 'Meeting' ? 'info' : event.type === 'Deadline' ? 'warning' : 'success'
                }
              >
                {event.type}
              </Indicator>
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

function Files() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [files, setFiles] = useState(initialFiles);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === 'All' ||
        (typeFilter === 'Documents' && f.type === 'Document') ||
        (typeFilter === 'Images' && f.type === 'Image') ||
        (typeFilter === 'Spreadsheets' && f.type === 'Spreadsheet');
      return matchesSearch && matchesType;
    });
  }, [files, searchTerm, typeFilter]);

  const handleDelete = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file && window.confirm(`Delete ${file.name}?`)) {
      setFiles(files.filter((f) => f.id !== id));
      setToastMessage('File deleted');
    }
  };

  const handleUpload = () => {
    setToastMessage('Files uploaded successfully');
    setIsUploadDialogOpen(false);
  };

  return (
    <Stack gap="large">
      <Heading level="1">Shared Files</Heading>

      {/* Toolbar */}
      <Flex gap="medium" wrap="wrap">
        <TextField
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          flex={1}
        />
        <Select value={typeFilter} onChange={(value) => setTypeFilter(value as string)}>
          <option>All</option>
          <option>Documents</option>
          <option>Images</option>
          <option>Spreadsheets</option>
        </Select>
        <DialogTrigger isOpen={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <Button variant="primary">Upload</Button>
          <Dialog>
            <UploadDialog onUpload={handleUpload} onClose={() => setIsUploadDialogOpen(false)} />
          </Dialog>
        </DialogTrigger>
      </Flex>

      {/* Files Table */}
      <Table aria-label="Shared files table">
        <TableHeader>
          <TableColumn>File Name</TableColumn>
          <TableColumn>Type</TableColumn>
          <TableColumn>Size</TableColumn>
          <TableColumn>Uploaded By</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.type}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{file.uploadedBy}</TableCell>
              <TableCell>{formatDate(file.date)}</TableCell>
              <TableCell>
                <Flex gap="small">
                  <Button variant="secondary" size="small">
                    Download
                  </Button>
                  <Button variant="secondary" size="small">
                    Rename
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => handleDelete(file.id)}>
                    Delete
                  </Button>
                </Flex>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {toastMessage && (
        <ToastContainer position="bottom-right">
          <Toast>{toastMessage}</Toast>
        </ToastContainer>
      )}
    </Stack>
  );
}

function UploadDialog({ onUpload, onClose }: { onUpload: () => void; onClose: () => void }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Documents');

  return (
    <Stack gap="medium" style={{ padding: '20px' }}>
      <Heading level="2">Upload Files</Heading>

      <Stack gap="small">
        <Text variant="bodySmall">Files</Text>
        <FileField multiple />
      </Stack>

      <Stack gap="small">
        <Text variant="bodySmall">Description</Text>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="File description"
        />
      </Stack>

      <Stack gap="small">
        <Text variant="bodySmall">Category</Text>
        <Select value={category} onChange={(value) => setCategory(value as string)}>
          <option>Documents</option>
          <option>Images</option>
          <option>Spreadsheets</option>
          <option>Other</option>
        </Select>
      </Stack>

      <Flex gap="small" justifyContent="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onUpload}>
          Upload
        </Button>
      </Flex>
    </Stack>
  );
}

function Settings({
  teamName,
  onTeamNameChange,
}: {
  teamName: string;
  onTeamNameChange: (name: string) => void;
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState('');
  const [generalSettings, setGeneralSettings] = useState({
    teamName,
    description: 'Our amazing team',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });

  const [notifications, setNotifications] = useState({
    newMember: true,
    deadline: false,
    weeklyDigest: true,
    mentions: true,
    calendarReminders: false,
  });

  const handleSaveGeneral = () => {
    onTeamNameChange(generalSettings.teamName);
    setToastMessage('Settings updated.');
  };

  const handleSaveNotifications = () => {
    setToastMessage('Notification preferences saved.');
  };

  return (
    <Stack gap="large">
      <Heading level="1">Team Settings</Heading>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="notifications">Notifications</Tab>
          <Tab value="integrations">Integrations</Tab>
        </TabList>

        <TabPanel value="general">
          <Stack gap="medium">
            <Stack gap="small">
              <Text variant="bodySmall">Team Name</Text>
              <TextField
                value={generalSettings.teamName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, teamName: e.target.value })}
              />
            </Stack>

            <Stack gap="small">
              <Text variant="bodySmall">Description</Text>
              <TextArea
                value={generalSettings.description}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, description: e.target.value })
                }
              />
            </Stack>

            <Stack gap="small">
              <Text variant="bodySmall">Default Timezone</Text>
              <Select
                value={generalSettings.timezone}
                onChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value as string })}
              >
                <option>UTC</option>
                <option>CET</option>
                <option>EST</option>
                <option>PST</option>
              </Select>
            </Stack>

            <Stack gap="small">
              <Text variant="bodySmall">Date Format</Text>
              <Select
                value={generalSettings.dateFormat}
                onChange={(value) =>
                  setGeneralSettings({ ...generalSettings, dateFormat: value as string })
                }
              >
                <option>MM/DD/YYYY</option>
                <option>DD.MM.YYYY</option>
                <option>YYYY-MM-DD</option>
              </Select>
            </Stack>

            <Button variant="primary" onClick={handleSaveGeneral}>
              Save
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel value="notifications">
          <Stack gap="medium">
            <Flex alignItems="center" justifyContent="space-between">
              <Stack gap="small" flex={1}>
                <Text variant="bodyMedium">New member joins</Text>
                <Text variant="bodySmall">Get notified when someone joins the team</Text>
              </Stack>
              <Switch
                isSelected={notifications.newMember}
                onChange={(isSelected) => setNotifications({ ...notifications, newMember: isSelected })}
              />
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Stack gap="small" flex={1}>
                <Text variant="bodyMedium">Project deadline approaching</Text>
                <Text variant="bodySmall">Reminder 3 days before deadline</Text>
              </Stack>
              <Switch
                isSelected={notifications.deadline}
                onChange={(isSelected) => setNotifications({ ...notifications, deadline: isSelected })}
              />
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Stack gap="small" flex={1}>
                <Text variant="bodyMedium">Weekly digest</Text>
                <Text variant="bodySmall">Summary of team activity every Monday</Text>
              </Stack>
              <Switch
                isSelected={notifications.weeklyDigest}
                onChange={(isSelected) => setNotifications({ ...notifications, weeklyDigest: isSelected })}
              />
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Stack gap="small" flex={1}>
                <Text variant="bodyMedium">Mention notifications</Text>
                <Text variant="bodySmall">When someone mentions you in a comment</Text>
              </Stack>
              <Switch
                isSelected={notifications.mentions}
                onChange={(isSelected) => setNotifications({ ...notifications, mentions: isSelected })}
              />
            </Flex>

            <Flex alignItems="center" justifyContent="space-between">
              <Stack gap="small" flex={1}>
                <Text variant="bodyMedium">Calendar reminders</Text>
                <Text variant="bodySmall">15 minutes before scheduled events</Text>
              </Stack>
              <Switch
                isSelected={notifications.calendarReminders}
                onChange={(isSelected) =>
                  setNotifications({ ...notifications, calendarReminders: isSelected })
                }
              />
            </Flex>

            <Button variant="primary" onClick={handleSaveNotifications}>
              Save Preferences
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel value="integrations">
          <Flex gap="medium" wrap="wrap">
            <IntegrationCard
              name="Slack"
              description="Connect your Slack workspace for notifications"
              isConnected={true}
            />
            <IntegrationCard
              name="GitHub"
              description="Sync repositories and pull requests"
              isConnected={false}
            />
            <IntegrationCard
              name="Jira"
              description="Integrate with Jira for project management"
              isConnected={false}
            />
          </Flex>
        </TabPanel>
      </Tabs>

      {toastMessage && (
        <ToastContainer position="bottom-right">
          <Toast>{toastMessage}</Toast>
        </ToastContainer>
      )}
    </Stack>
  );
}

function IntegrationCard({
  name,
  description,
  isConnected,
}: {
  name: string;
  description: string;
  isConnected: boolean;
}) {
  const [connected, setConnected] = useState(isConnected);

  const handleToggle = () => {
    if (connected && window.confirm(`Disconnect ${name}?`)) {
      setConnected(false);
    } else if (!connected) {
      setConnected(true);
    }
  };

  return (
    <Card style={{ flex: '1 1 calc(33.333% - 12px)', minWidth: '250px' }}>
      <Stack gap="medium">
        <Flex alignItems="center" gap="medium">
          <Text variant="headlineSmall">{name}</Text>
          <Indicator variant={connected ? 'success' : 'warning'}>
            {connected ? 'Connected' : 'Not connected'}
          </Indicator>
        </Flex>
        <Text variant="bodySmall">{description}</Text>
        <Button variant={connected ? 'secondary' : 'primary'} onClick={handleToggle}>
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </Stack>
    </Card>
  );
}

function TestApp() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [members, setMembers] = useState(initialMembers);
  const [teamName, setTeamName] = useState('TeamHub');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'projects', label: 'Projects' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'files', label: 'Files' },
    { id: 'settings', label: 'Settings', divider: true },
  ];

  const handleAddMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const handleEditMember = (member: Member) => {
    setMembers(members.map((m) => (m.id === member.id ? member : m)));
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const getBreadcrumb = (): string => {
    const page = navigationItems.find((item) => item.id === currentPage);
    return `${teamName} > ${page?.label || ''}`;
  };

  return (
    <Flex
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Sidebar */}
      <Box
        style={{
          width: sidebarOpen ? '250px' : '0px',
          backgroundColor: '#2c3e50',
          color: 'white',
          overflowY: 'auto',
          transition: 'width 0.3s',
          borderRight: '1px solid #34495e',
        }}
      >
        {sidebarOpen && (
          <Stack
            gap="medium"
            style={{
              padding: '20px',
              height: '100%',
            }}
          >
            <Heading level="1" style={{ color: 'white', marginBottom: '20px' }}>
              {teamName}
            </Heading>

            <Stack gap="small">
              {navigationItems.map((item) => (
                <Stack key={item.id}>
                  {item.divider && <Box style={{ borderTop: '1px solid #34495e', margin: '16px 0' }} />}
                  <Button
                    variant={currentPage === item.id ? 'primary' : 'plain'}
                    onClick={() => setCurrentPage(item.id as Page)}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      backgroundColor: currentPage === item.id ? '#3498db' : 'transparent',
                      color: 'white',
                    }}
                  >
                    {item.label}
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </Box>

      {/* Main Content */}
      <Flex direction="column" flex={1}>
        {/* Top Navigation */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          gap="medium"
          style={{
            padding: '12px 20px',
            backgroundColor: 'white',
            borderBottom: '1px solid #e0e0e0',
            height: '60px',
          }}
        >
          <Button variant="plain" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </Button>

          <Text>{getBreadcrumb()}</Text>

          <Flex gap="medium" alignItems="center">
            <PopoverTrigger>
              <TooltipTrigger>
                <Button variant="plain">?</Button>
                <Tooltip>Use the sidebar to navigate between sections.</Tooltip>
              </TooltipTrigger>
              <Popover>
                <Text style={{ padding: '12px' }}>
                  Use the sidebar to navigate between sections.
                </Text>
              </Popover>
            </PopoverTrigger>

            <Menu>
              <TooltipTrigger>
                <Button variant="plain">Account settings</Button>
                <Tooltip>Account settings</Tooltip>
              </TooltipTrigger>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Preferences</MenuItem>
              <MenuItem>Sign Out</MenuItem>
            </Menu>
          </Flex>
        </Flex>

        {/* Page Content */}
        <Box
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {currentPage === 'dashboard' && <Dashboard memberCount={members.length} />}
          {currentPage === 'members' && (
            <Members
              members={members}
              onAdd={handleAddMember}
              onEdit={handleEditMember}
              onRemove={handleRemoveMember}
              selectedMember={selectedMember}
              onSelectMember={setSelectedMember}
            />
          )}
          {currentPage === 'projects' && <Projects />}
          {currentPage === 'calendar' && <Calendar />}
          {currentPage === 'files' && <Files />}
          {currentPage === 'settings' && (
            <Settings teamName={teamName} onTeamNameChange={setTeamName} />
          )}
        </Box>
      </Flex>
    </Flex>
  );
}

export default TestApp;
