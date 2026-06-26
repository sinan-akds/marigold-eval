import React, { useState, useMemo } from 'react';
import {
  Stack,
  HStack,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Heading,
  Text,
  Card,
  FieldGroup,
  Label,
  Select,
  SelectItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Columns,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Toast,
  Inline,
  Banner,
  Checkbox,
  Column,
  View,
  Tooltip,
  TooltipTrigger,
  IconButton,
} from '@marigold/components';

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: 'Developer' | 'Designer' | 'Manager' | 'QA';
  startDate: string;
  bio: string;
  status: 'Active' | 'On Leave';
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

interface UpcomingEvent {
  date: string;
  name: string;
  type: 'Meeting' | 'Deadline' | 'Social';
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  date: string;
}

const ROLES = ['Developer', 'Designer', 'Manager', 'QA'];

const DEFAULT_MEMBERS: TeamMember[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'alice@team.com', role: 'Developer', startDate: '2024-01-15', bio: 'Senior Frontend Dev', status: 'Active' },
  { id: '2', fullName: 'Bob Smith', email: 'bob@team.com', role: 'Manager', startDate: '2023-06-10', bio: 'Product Manager', status: 'Active' },
  { id: '3', fullName: 'Carol Davis', email: 'carol@team.com', role: 'Designer', startDate: '2024-03-20', bio: 'UX Designer', status: 'Active' },
  { id: '4', fullName: 'David Lee', email: 'david@team.com', role: 'Developer', startDate: '2023-09-05', bio: 'Backend Dev', status: 'On Leave' },
  { id: '5', fullName: 'Emma Wilson', email: 'emma@team.com', role: 'QA', startDate: '2024-02-01', bio: 'QA Engineer', status: 'Active' },
  { id: '6', fullName: 'Frank Brown', email: 'frank@team.com', role: 'Developer', startDate: '2023-11-12', bio: 'DevOps Engineer', status: 'Active' },
];

const DEFAULT_PROJECTS: Project[] = [
  { id: '1', name: 'Website Redesign', lead: 'Alice Johnson', members: 4, deadline: '2026-07-15', progress: 75, status: 'Active' },
  { id: '2', name: 'Mobile App', lead: 'Bob Smith', members: 6, deadline: '2026-08-01', progress: 60, status: 'Active' },
  { id: '3', name: 'API Refactor', lead: 'David Lee', members: 3, deadline: '2026-06-30', progress: 90, status: 'Active' },
  { id: '4', name: 'Dashboard Migration', lead: 'Carol Davis', members: 5, deadline: '2026-09-10', progress: 45, status: 'On Hold' },
  { id: '5', name: 'Legacy System Cleanup', lead: 'Frank Brown', members: 2, deadline: '2026-05-20', progress: 100, status: 'Completed' },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  { date: '2026-06-24', name: 'Team Standup', type: 'Meeting' },
  { date: '2026-06-28', name: 'Sprint 14 Ends', type: 'Deadline' },
  { date: '2026-07-05', name: 'Team Outing', type: 'Social' },
  { date: '2026-07-10', name: 'Mid-year Review', type: 'Meeting' },
];

const DEFAULT_FILES: UploadedFile[] = [
  { id: '1', name: 'Q2 Report.pdf', type: 'Documents', size: 2.4, uploadedBy: 'Alice Johnson', date: '2026-06-20' },
  { id: '2', name: 'Team Photo.jpg', type: 'Images', size: 5.8, uploadedBy: 'Carol Davis', date: '2026-06-18' },
  { id: '3', name: 'Budget.xlsx', type: 'Spreadsheets', size: 1.2, uploadedBy: 'Bob Smith', date: '2026-06-15' },
  { id: '4', name: 'Design System.pdf', type: 'Documents', size: 3.6, uploadedBy: 'Carol Davis', date: '2026-06-10' },
  { id: '5', name: 'Screenshots.png', type: 'Images', size: 7.2, uploadedBy: 'Emma Wilson', date: '2026-06-08' },
];

const RECENT_ACTIVITY = [
  { member: 'Alice Johnson', action: 'Commit', project: 'Website Redesign', date: '2026-06-20', actionType: 'info' as const },
  { member: 'David Lee', action: 'Review', project: 'API Refactor', date: '2026-06-19', actionType: 'warning' as const },
  { member: 'Frank Brown', action: 'Deploy', project: 'Mobile App', date: '2026-06-19', actionType: 'success' as const },
  { member: 'Carol Davis', action: 'Commit', project: 'Dashboard Migration', date: '2026-06-18', actionType: 'info' as const },
  { member: 'Emma Wilson', action: 'Review', project: 'API Refactor', date: '2026-06-18', actionType: 'warning' as const },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

const formatFileSize = (mb: number) => {
  return `${mb.toFixed(1)} MB`;
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const DashboardPage = ({ memberCount }: { memberCount: number }) => {
  return (
    <Stack space="large">
      <Heading level="1">Team Overview</Heading>
      <Columns columns={4} gap="large">
        <Card>
          <Stack space="small">
            <Text size="small" color="muted">Members</Text>
            <Heading level="3">{memberCount}</Heading>
          </Stack>
        </Card>
        <Card>
          <Stack space="small">
            <Text size="small" color="muted">Active Projects</Text>
            <Heading level="3">5</Heading>
          </Stack>
        </Card>
        <Card>
          <Stack space="small">
            <Text size="small" color="muted">Upcoming Deadlines</Text>
            <Heading level="3">8</Heading>
          </Stack>
        </Card>
        <Card>
          <Stack space="small">
            <Text size="small" color="muted">Hours This Week</Text>
            <HStack space="small" alignY="center">
              <Heading level="3">{formatNumber(342)}</Heading>
              <TooltipTrigger>
                <IconButton aria-label="info" />
                <Tooltip>Aggregate of all team members.</Tooltip>
              </TooltipTrigger>
            </HStack>
          </Stack>
        </Card>
      </Columns>

      <Stack space="medium">
        <Heading level="2">Recent Activity</Heading>
        <Table aria-label="Recent activity table">
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {RECENT_ACTIVITY.map((activity) => (
              <TableRow key={`${activity.member}-${activity.date}`}>
                <TableCell>{activity.member}</TableCell>
                <TableCell>
                  <Badge variant={activity.actionType}>{activity.action}</Badge>
                </TableCell>
                <TableCell>{activity.project}</TableCell>
                <TableCell>{formatDate(activity.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>

      <Banner>Sprint 14 ends in 3 days. Review the project board for outstanding tasks.</Banner>
    </Stack>
  );
};

const MembersPage = ({ members, onMembersChange }: { members: TeamMember[]; onMembersChange: (members: TeamMember[]) => void }) => {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showDialog, setShowDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    fullName: '',
    email: '',
    role: 'Developer',
    startDate: '',
    bio: '',
    status: 'Active',
  });

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All Roles' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({ fullName: '', email: '', role: 'Developer', startDate: '', bio: '', status: 'Active' });
    }
    setShowDialog(true);
  };

  const handleSaveMember = () => {
    if (!formData.fullName || !formData.email || !formData.role) return;

    if (editingMember) {
      const updated = members.map((m) => (m.id === editingMember.id ? { ...editingMember, ...formData } as TeamMember : m));
      onMembersChange(updated);
    } else {
      const newMember: TeamMember = {
        id: String(Date.now()),
        fullName: formData.fullName || '',
        email: formData.email || '',
        role: (formData.role as any) || 'Developer',
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        bio: formData.bio || '',
        status: formData.status || 'Active',
      };
      onMembersChange([...members, newMember]);
    }
    setShowDialog(false);
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      onMembersChange(members.filter((m) => m.id !== id));
      setSelectedMember(null);
    }
  };

  return (
    <Stack space="large">
      <Heading level="1">Team Members</Heading>

      <HStack space="medium" alignY="center" wrap>
        <TextField placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} aria-label="Filter by role">
          <SelectItem key="all">All Roles</SelectItem>
          {ROLES.map((role) => (
            <SelectItem key={role}>{role}</SelectItem>
          ))}
        </Select>
        <HStack space="small">
          <Button variant={viewMode === 'table' ? 'primary' : 'secondary'} onPress={() => setViewMode('table')}>
            Table
          </Button>
          <Button variant={viewMode === 'card' ? 'primary' : 'secondary'} onPress={() => setViewMode('card')}>
            Cards
          </Button>
        </HStack>
        <Button variant="primary" onPress={() => handleOpenDialog()}>
          Add Member
        </Button>
      </HStack>

      {viewMode === 'table' ? (
        <Table aria-label="Team members table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} onPress={() => setSelectedMember(member)}>
                <TableCell>{member.fullName}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
                </TableCell>
                <TableCell>{formatDate(member.startDate)}</TableCell>
                <TableCell>
                  <HStack space="small">
                    <Button size="small" variant="secondary" onPress={() => handleOpenDialog(member)}>
                      Edit
                    </Button>
                    <Button size="small" variant="secondary" onPress={() => handleRemoveMember(member.id)}>
                      Remove
                    </Button>
                  </HStack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Columns columns={3} gap="large">
          {filteredMembers.map((member) => (
            <Card key={member.id} onPress={() => setSelectedMember(member)}>
              <Stack space="medium">
                <Heading level="4">{member.fullName}</Heading>
                <Badge>{member.role}</Badge>
                <Text>{member.email}</Text>
                <HStack space="small">
                  <Button size="small">Message</Button>
                  <Button size="small" variant="secondary">
                    Profile
                  </Button>
                </HStack>
              </Stack>
            </Card>
          ))}
        </Columns>
      )}

      {selectedMember && (
        <Card>
          <Stack space="medium">
            <HStack space="small" alignY="center">
              <Heading level="3">{selectedMember.fullName}</Heading>
              <Button size="small" onPress={() => setSelectedMember(null)}>
                Close
              </Button>
            </HStack>
            <Stack space="small">
              <Text><strong>Email:</strong> {selectedMember.email}</Text>
              <Text><strong>Role:</strong> {selectedMember.role}</Text>
              <Text><strong>Status:</strong> {selectedMember.status}</Text>
              <Text><strong>Joined:</strong> {formatDate(selectedMember.startDate)}</Text>
              <Text><strong>Bio:</strong> {selectedMember.bio}</Text>
            </Stack>
          </Stack>
        </Card>
      )}

      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <Stack space="medium">
              <Heading level="2">{editingMember ? 'Edit Member' : 'Add Member'}</Heading>
              <TextField
                label="Full Name"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                isRequired
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                isRequired
              />
              <Select
                label="Role"
                value={formData.role || 'Developer'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                aria-label="Select role"
              >
                {ROLES.map((role) => (
                  <SelectItem key={role}>{role}</SelectItem>
                ))}
              </Select>
              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <TextField
                label="Bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </Stack>
            <DialogActions>
              <Button variant="secondary" onPress={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onPress={handleSaveMember}>
                {editingMember ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </Stack>
  );
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [projects, searchQuery]);

  const handleToggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleArchive = () => {
    const archived = projects.filter((p) => !selectedRows.has(p.id));
    setProjects(archived);
    setSelectedRows(new Set());
  };

  return (
    <Stack space="large">
      <Heading level="1">Projects</Heading>

      <HStack space="medium" alignY="center">
        <TextField placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Button variant="primary">New Project</Button>
      </HStack>

      {selectedRows.size > 0 && (
        <HStack space="medium" padding="medium" background="muted">
          <Text>{selectedRows.size} project(s) selected</Text>
          <Button variant="primary" onPress={handleArchive}>
            Archive Selected
          </Button>
          <Button variant="secondary">Export</Button>
        </HStack>
      )}

      <Table aria-label="Projects table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                isSelected={selectedRows.size === filteredProjects.length && filteredProjects.length > 0}
                onChange={(isSelected) => {
                  if (isSelected) {
                    setSelectedRows(new Set(filteredProjects.map((p) => p.id)));
                  } else {
                    setSelectedRows(new Set());
                  }
                }}
                aria-label="Select all"
              />
            </TableCell>
            <TableCell>Project</TableCell>
            <TableCell>Lead</TableCell>
            <TableCell>Members</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Checkbox
                  isSelected={selectedRows.has(project.id)}
                  onChange={() => handleToggleRow(project.id)}
                  aria-label={`Select ${project.name}`}
                />
              </TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.lead}</TableCell>
              <TableCell>{project.members}</TableCell>
              <TableCell>{formatDate(project.deadline)}</TableCell>
              <TableCell>{project.progress}%</TableCell>
              <TableCell>
                <Badge variant={project.status === 'Active' ? 'info' : project.status === 'Completed' ? 'success' : 'warning'}>
                  {project.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

const CalendarPage = () => {
  const currentDate = new Date(2026, 5, 21);

  return (
    <Stack space="large">
      <Heading level="1">Team Calendar</Heading>
      <Card>
        <Text>Calendar placeholder for {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</Text>
      </Card>

      <Stack space="medium">
        <Heading level="2">Upcoming Events</Heading>
        <Stack space="small">
          {UPCOMING_EVENTS.map((event) => (
            <Card key={event.name}>
              <HStack space="medium" alignY="center">
                <Stack space="small" flex>
                  <Text>{formatDate(event.date)}</Text>
                  <Heading level="4">{event.name}</Heading>
                </Stack>
                <Badge variant={event.type === 'Meeting' ? 'info' : event.type === 'Deadline' ? 'warning' : 'success'}>{event.type}</Badge>
              </HStack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const FilesPage = () => {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || f.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, searchQuery, typeFilter]);

  const handleUpload = () => {
    setShowUploadDialog(false);
    setToastMessage('Files uploaded successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <Stack space="large">
      <Heading level="1">Shared Files</Heading>

      <HStack space="medium" alignY="center" wrap>
        <TextField placeholder="Search files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filter by file type">
          <SelectItem key="All">All</SelectItem>
          <SelectItem key="Documents">Documents</SelectItem>
          <SelectItem key="Images">Images</SelectItem>
          <SelectItem key="Spreadsheets">Spreadsheets</SelectItem>
        </Select>
        <Button variant="primary" onPress={() => setShowUploadDialog(true)}>
          Upload
        </Button>
      </HStack>

      <Table aria-label="Files table">
        <TableHead>
          <TableRow>
            <TableCell>File Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Uploaded By</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.type}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>{file.uploadedBy}</TableCell>
              <TableCell>{formatDate(file.date)}</TableCell>
              <TableCell>
                <Menu>
                  <MenuTrigger asChild>
                    <Button size="small" variant="secondary">
                      ⋮
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem onPress={() => {}}>Download</MenuItem>
                    <MenuItem onPress={() => {}}>Rename</MenuItem>
                    <MenuItem onPress={() => handleDelete(file.id)}>Delete</MenuItem>
                  </MenuContent>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showUploadDialog && (
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <Stack space="medium">
              <Heading level="2">Upload Files</Heading>
              <TextField label="Files" type="file" multiple />
              <TextField label="Description" />
              <Select aria-label="Select category">
                <SelectItem key="Documents">Documents</SelectItem>
                <SelectItem key="Images">Images</SelectItem>
                <SelectItem key="Spreadsheets">Spreadsheets</SelectItem>
              </Select>
            </Stack>
            <DialogActions>
              <Button variant="secondary" onPress={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onPress={handleUpload}>
                Upload
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}

      {toastMessage && <Toast>{toastMessage}</Toast>}
    </Stack>
  );
};

const SettingsPage = ({ teamName, onTeamNameChange }: { teamName: string; onTeamNameChange: (name: string) => void }) => {
  const [generalData, setGeneralData] = useState({
    teamName,
    description: 'Engineering Team',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    newMember: true,
    projectDeadline: true,
    weeklyDigest: false,
    mentions: true,
    calendarReminders: true,
  });
  const [toastMessage, setToastMessage] = useState('');

  const handleSaveGeneral = () => {
    onTeamNameChange(generalData.teamName);
    setToastMessage('Settings updated.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveNotifications = () => {
    setToastMessage('Preferences saved.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <Stack space="large">
      <Heading level="1">Team Settings</Heading>

      <Tabs aria-label="Settings tabs">
        <TabList>
          <Tab>General</Tab>
          <Tab>Notifications</Tab>
          <Tab>Integrations</Tab>
        </TabList>

        <TabPanel>
          <Stack space="medium">
            <TextField label="Team Name" value={generalData.teamName} onChange={(e) => setGeneralData({ ...generalData, teamName: e.target.value })} />
            <TextField label="Description" value={generalData.description} onChange={(e) => setGeneralData({ ...generalData, description: e.target.value })} />
            <Select
              label="Default Timezone"
              value={generalData.timezone}
              onChange={(e) => setGeneralData({ ...generalData, timezone: e.target.value })}
              aria-label="Select timezone"
            >
              <SelectItem key="UTC">UTC</SelectItem>
              <SelectItem key="CET">CET</SelectItem>
              <SelectItem key="EST">EST</SelectItem>
              <SelectItem key="PST">PST</SelectItem>
            </Select>
            <Select
              label="Date Format"
              value={generalData.dateFormat}
              onChange={(e) => setGeneralData({ ...generalData, dateFormat: e.target.value })}
              aria-label="Select date format"
            >
              <SelectItem key="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem key="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
              <SelectItem key="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </Select>
            <Button variant="primary" onPress={handleSaveGeneral}>
              Save
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel>
          <Stack space="medium">
            <HStack space="medium" alignY="center">
              <Switch isSelected={notificationPrefs.newMember} onChange={(isSelected) => setNotificationPrefs({ ...notificationPrefs, newMember: isSelected })} />
              <Stack space="small">
                <Text weight="bold">New member joins</Text>
                <Text size="small" color="muted">Get notified when someone joins the team</Text>
              </Stack>
            </HStack>
            <HStack space="medium" alignY="center">
              <Switch isSelected={notificationPrefs.projectDeadline} onChange={(isSelected) => setNotificationPrefs({ ...notificationPrefs, projectDeadline: isSelected })} />
              <Stack space="small">
                <Text weight="bold">Project deadline approaching</Text>
                <Text size="small" color="muted">Reminder 3 days before deadline</Text>
              </Stack>
            </HStack>
            <HStack space="medium" alignY="center">
              <Switch isSelected={notificationPrefs.weeklyDigest} onChange={(isSelected) => setNotificationPrefs({ ...notificationPrefs, weeklyDigest: isSelected })} />
              <Stack space="small">
                <Text weight="bold">Weekly digest</Text>
                <Text size="small" color="muted">Summary of team activity every Monday</Text>
              </Stack>
            </HStack>
            <HStack space="medium" alignY="center">
              <Switch isSelected={notificationPrefs.mentions} onChange={(isSelected) => setNotificationPrefs({ ...notificationPrefs, mentions: isSelected })} />
              <Stack space="small">
                <Text weight="bold">Mention notifications</Text>
                <Text size="small" color="muted">When someone mentions you in a comment</Text>
              </Stack>
            </HStack>
            <HStack space="medium" alignY="center">
              <Switch isSelected={notificationPrefs.calendarReminders} onChange={(isSelected) => setNotificationPrefs({ ...notificationPrefs, calendarReminders: isSelected })} />
              <Stack space="small">
                <Text weight="bold">Calendar reminders</Text>
                <Text size="small" color="muted">15 minutes before scheduled events</Text>
              </Stack>
            </HStack>
            <Button variant="primary" onPress={handleSaveNotifications}>
              Save Preferences
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel>
          <Columns columns={3} gap="large">
            <Card>
              <Stack space="medium">
                <Heading level="3">Slack</Heading>
                <Badge variant="success">Connected</Badge>
                <Text size="small">Integration with Slack for notifications and updates</Text>
                <Button variant="secondary">Disconnect</Button>
              </Stack>
            </Card>
            <Card>
              <Stack space="medium">
                <Heading level="3">GitHub</Heading>
                <Badge variant="muted">Not connected</Badge>
                <Text size="small">Track repository activity and pull requests</Text>
                <Button variant="primary">Connect</Button>
              </Stack>
            </Card>
            <Card>
              <Stack space="medium">
                <Heading level="3">Jira</Heading>
                <Badge variant="muted">Not connected</Badge>
                <Text size="small">Sync issues and project tracking</Text>
                <Button variant="primary">Connect</Button>
              </Stack>
            </Card>
          </Columns>
        </TabPanel>
      </Tabs>

      {toastMessage && <Toast>{toastMessage}</Toast>}
    </Stack>
  );
};

const TestApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [teamName, setTeamName] = useState('TeamHub');

  const navigationItems = [
    'Dashboard',
    'Members',
    'Projects',
    'Calendar',
    'Files',
    { label: 'Settings', divider: true },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage memberCount={members.length} />;
      case 'Members':
        return <MembersPage members={members} onMembersChange={setMembers} />;
      case 'Projects':
        return <ProjectsPage />;
      case 'Calendar':
        return <CalendarPage />;
      case 'Files':
        return <FilesPage />;
      case 'Settings':
        return <SettingsPage teamName={teamName} onTeamNameChange={setTeamName} />;
      default:
        return <DashboardPage memberCount={members.length} />;
    }
  };

  return (
    <HStack height="100vh">
      {sidebarOpen && (
        <Stack width="250px" background="muted" padding="large" borderRight="1px solid" borderColor="border" overflowY="auto">
          <Heading level="2" margin="0 0 large 0">
            {teamName}
          </Heading>
          <Stack space="small" flex>
            {navigationItems.map((item, idx) => {
              const isItem = typeof item === 'string';
              const label = isItem ? item : item.label;
              return (
                <div key={idx}>
                  {typeof item !== 'string' && item.divider && <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />}
                  <Button
                    variant={currentPage === label ? 'primary' : 'secondary'}
                    onPress={() => setCurrentPage(label)}
                    width="100%"
                    justifyContent="flexStart"
                  >
                    {label}
                  </Button>
                </div>
              );
            })}
          </Stack>
        </Stack>
      )}

      <Stack flex width="100%" overflowY="auto">
        <HStack
          padding="medium"
          borderBottom="1px solid"
          borderColor="border"
          alignY="center"
          space="medium"
          justifyContent="spaceBetween"
          background="white"
        >
          <HStack space="medium" alignY="center">
            <Button variant="secondary" onPress={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </Button>
            <Text size="small">{teamName} › {currentPage}</Text>
          </HStack>

          <HStack space="medium" alignY="center">
            <Menu>
              <MenuTrigger asChild>
                <TooltipTrigger>
                  <Button variant="secondary">John Doe</Button>
                  <Tooltip>Account settings</Tooltip>
                </TooltipTrigger>
              </MenuTrigger>
              <MenuContent>
                <MenuItem onPress={() => {}}>Profile</MenuItem>
                <MenuItem onPress={() => {}}>Preferences</MenuItem>
                <MenuItem onPress={() => {}}>Sign Out</MenuItem>
              </MenuContent>
            </Menu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">?</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Text>Use the sidebar to navigate between sections.</Text>
              </PopoverContent>
            </Popover>
          </HStack>
        </HStack>

        <Stack padding="large" flex overflowY="auto">
          {renderPage()}
        </Stack>
      </Stack>
    </HStack>
  );
};

export default TestApp;
