import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  Heading,
  TextField,
  Select,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Flex,
  Text,
  Checkbox,
  Toast,
  Textarea,
  ComboBox,
  Item,
  MenuButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Indicator,
  ActionGroup,
  ActionGroupItem,
  Banner,
  HStack,
  VStack,
  Stack,
  FileInput,
} from '@marigold/components';

const TestApp = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teamName, setTeamName] = useState('TeamHub');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Members state
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.com', status: 'Active', joined: new Date(2024, 0, 15) },
    { id: 2, name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.com', status: 'Active', joined: new Date(2024, 2, 22) },
    { id: 3, name: 'Carol White', role: 'Manager', email: 'carol@teamhub.com', status: 'On Leave', joined: new Date(2023, 11, 10) },
    { id: 4, name: 'David Lee', role: 'Developer', email: 'david@teamhub.com', status: 'Active', joined: new Date(2024, 4, 5) },
    { id: 5, name: 'Eva Martinez', role: 'QA', email: 'eva@teamhub.com', status: 'Active', joined: new Date(2024, 3, 18) },
    { id: 6, name: 'Frank Brown', role: 'Developer', email: 'frank@teamhub.com', status: 'Active', joined: new Date(2023, 8, 20) },
  ]);

  const [memberSearch, setMemberSearch] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('All Roles');
  const [memberViewMode, setMemberViewMode] = useState('table');
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Developer', startDate: '', bio: '' });

  // Projects state
  const [projects, setProjects] = useState([
    { id: 1, name: 'Mobile App', lead: 'Alice Johnson', members: 4, deadline: new Date(2026, 7, 15), progress: 65, status: 'Active' },
    { id: 2, name: 'API Redesign', lead: 'David Lee', members: 3, deadline: new Date(2026, 6, 20), progress: 40, status: 'Active' },
    { id: 3, name: 'Dashboard UI', lead: 'Bob Smith', members: 5, deadline: new Date(2026, 5, 30), progress: 75, status: 'Active' },
    { id: 4, name: 'Documentation', lead: 'Carol White', members: 2, deadline: new Date(2026, 8, 10), progress: 30, status: 'On Hold' },
    { id: 5, name: 'Infrastructure', lead: 'Frank Brown', members: 3, deadline: new Date(2026, 4, 25), progress: 100, status: 'Completed' },
  ]);
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [projectSearch, setProjectSearch] = useState('');

  // Files state
  const [files, setFiles] = useState([
    { id: 1, name: 'Q2 Report.pdf', type: 'Documents', size: 2.4, uploadedBy: 'Alice Johnson', date: new Date(2026, 4, 15) },
    { id: 2, name: 'Logo.png', type: 'Images', size: 0.8, uploadedBy: 'Bob Smith', date: new Date(2026, 4, 10) },
    { id: 3, name: 'Budget.xlsx', type: 'Spreadsheets', size: 1.2, uploadedBy: 'Carol White', date: new Date(2026, 4, 8) },
    { id: 4, name: 'Design Brief.pdf', type: 'Documents', size: 3.5, uploadedBy: 'Eva Martinez', date: new Date(2026, 4, 5) },
    { id: 5, name: 'Team Photo.jpg', type: 'Images', size: 5.1, uploadedBy: 'Frank Brown', date: new Date(2026, 3, 28) },
  ]);
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('All');
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

  // Settings state
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notificationPrefs, setNotificationPrefs] = useState({
    newMember: true,
    deadline: true,
    weekly: false,
    mention: true,
    calendar: true,
  });
  const [integrations, setIntegrations] = useState({
    slack: { name: 'Slack', connected: true },
    github: { name: 'GitHub', connected: false },
    jira: { name: 'Jira', connected: false },
  });

  // Localization helpers
  const formatDate = (date) => {
    const opts = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', opts);
  };

  const formatFileSize = (sizeInMB) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  // Member filtering
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase());
      const matchesRole = memberRoleFilter === 'All Roles' || m.role === memberRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, memberSearch, memberRoleFilter]);

  // Project filtering
  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.name.toLowerCase().includes(projectSearch.toLowerCase()));
  }, [projects, projectSearch]);

  // File filtering
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(fileSearch.toLowerCase());
      const matchesType = fileTypeFilter === 'All' || f.type === fileTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, fileSearch, fileTypeFilter]);

  // Member dialog handlers
  const openMemberDialog = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        startDate: member.joined.toISOString().split('T')[0],
        bio: '',
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', role: 'Developer', startDate: '', bio: '' });
    }
    setShowMemberDialog(true);
  };

  const saveMember = () => {
    if (!formData.name || !formData.email) return;

    if (editingMember) {
      setMembers(members.map(m =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              joined: formData.startDate ? new Date(formData.startDate) : m.joined,
            }
          : m
      ));
    } else {
      const newMember = {
        id: Math.max(...members.map(m => m.id), 0) + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Active',
        joined: formData.startDate ? new Date(formData.startDate) : new Date(),
      };
      setMembers([...members, newMember]);
    }
    setShowMemberDialog(false);
  };

  const removeMember = (id) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  // Project handlers
  const toggleProjectSelection = (id) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
  };

  const archiveSelectedProjects = () => {
    setProjects(projects.filter(p => !selectedProjects.has(p.id)));
    setSelectedProjects(new Set());
  };

  // File handlers
  const removeFile = (id) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(f => f.id !== id));
    }
  };

  const handleFileUpload = () => {
    setToastMessage('Files uploaded successfully.');
    setShowToast(true);
    setShowFileUploadDialog(false);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Integration handlers
  const toggleIntegration = (key) => {
    const integration = integrations[key];
    if (integration.connected) {
      if (confirm(`Disconnect ${integration.name}?`)) {
        setIntegrations({
          ...integrations,
          [key]: { ...integration, connected: false },
        });
      }
    } else {
      setIntegrations({
        ...integrations,
        [key]: { ...integration, connected: true },
      });
    }
  };

  // Dashboard page
  const DashboardPage = () => (
    <VStack gap="xl">
      <Heading level={1}>Team Overview</Heading>

      <HStack gap="md" wrap>
        <Card>
          <VStack gap="sm">
            <Text variant="body">{members.length}</Text>
            <Text>Members</Text>
          </VStack>
        </Card>
        <Card>
          <VStack gap="sm">
            <Text variant="body">5</Text>
            <Text>Active Projects</Text>
          </VStack>
        </Card>
        <Card>
          <VStack gap="sm">
            <Text variant="body">8</Text>
            <Text>Upcoming Deadlines</Text>
          </VStack>
        </Card>
        <Card>
          <VStack gap="sm">
            <Flex gap="xs" alignItems="center">
              <Text variant="body">342</Text>
              <Tooltip text="Aggregate of all team members.">
                <Text>ℹ</Text>
              </Tooltip>
            </Flex>
            <Text>Hours This Week</Text>
          </VStack>
        </Card>
      </HStack>

      <VStack gap="md">
        <Heading level={2}>Recent Activity</Heading>
        <Table aria-label="Recent Activity">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Member</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
              <TableHeaderCell>Project</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice Johnson</TableCell>
              <TableCell>
                <Indicator variant="info">Commit</Indicator>
              </TableCell>
              <TableCell>Mobile App</TableCell>
              <TableCell>{formatDate(new Date(2026, 4, 20))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>David Lee</TableCell>
              <TableCell>
                <Indicator variant="warning">Review</Indicator>
              </TableCell>
              <TableCell>API Redesign</TableCell>
              <TableCell>{formatDate(new Date(2026, 4, 19))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Frank Brown</TableCell>
              <TableCell>
                <Indicator variant="success">Deploy</Indicator>
              </TableCell>
              <TableCell>Dashboard UI</TableCell>
              <TableCell>{formatDate(new Date(2026, 4, 18))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bob Smith</TableCell>
              <TableCell>
                <Indicator variant="info">Commit</Indicator>
              </TableCell>
              <TableCell>Mobile App</TableCell>
              <TableCell>{formatDate(new Date(2026, 4, 17))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Carol White</TableCell>
              <TableCell>
                <Indicator variant="warning">Review</Indicator>
              </TableCell>
              <TableCell>Documentation</TableCell>
              <TableCell>{formatDate(new Date(2026, 4, 16))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </VStack>

      <Banner>Sprint 14 ends in 3 days. Review the project board for outstanding tasks.</Banner>
    </VStack>
  );

  // Members page
  const MembersPage = () => (
    <VStack gap="xl">
      <Heading level={1}>Team Members</Heading>

      <HStack gap="md" wrap>
        <TextField
          label="Search Members"
          placeholder="Filter by name..."
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
        />
        <Select
          label="Role"
          value={memberRoleFilter}
          onChange={(value) => setMemberRoleFilter(value)}
        >
          <Item>All Roles</Item>
          <Item>Developer</Item>
          <Item>Designer</Item>
          <Item>Manager</Item>
          <Item>QA</Item>
        </Select>
        <Flex gap="xs" alignItems="flex-end">
          <Button onPress={() => setMemberViewMode(memberViewMode === 'table' ? 'cards' : 'table')}>
            {memberViewMode === 'table' ? 'Card View' : 'Table View'}
          </Button>
        </Flex>
        <Button variant="primary" onPress={() => openMemberDialog()}>
          Add Member
        </Button>
      </HStack>

      {memberViewMode === 'table' ? (
        <Table aria-label="Team Members">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Joined</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Button variant="plain" onPress={() => setSelectedMemberDetail(member)}>
                    {member.name}
                  </Button>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Indicator variant={member.status === 'Active' ? 'success' : 'warning'}>
                    {member.status}
                  </Indicator>
                </TableCell>
                <TableCell>{formatDate(member.joined)}</TableCell>
                <TableCell>
                  <HStack gap="xs">
                    <Button variant="plain" onPress={() => openMemberDialog(member)}>
                      Edit
                    </Button>
                    <Button variant="plain" onPress={() => removeMember(member.id)}>
                      Remove
                    </Button>
                  </HStack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <VStack gap="lg">
          {Array.from({ length: Math.ceil(filteredMembers.length / 3) }).map((_, rowIdx) => (
            <HStack key={rowIdx} gap="md" wrap>
              {filteredMembers.slice(rowIdx * 3, rowIdx * 3 + 3).map((member) => (
                <Card key={member.id} style={{ flex: '1 1 calc(33.333% - 16px)', minWidth: '200px' }}>
                  <VStack gap="md">
                    <Button variant="plain" onPress={() => setSelectedMemberDetail(member)}>
                      <Text weight="bold">{member.name}</Text>
                    </Button>
                    <Indicator variant="info">{member.role}</Indicator>
                    <Text>{member.email}</Text>
                    <HStack gap="sm">
                      <Button variant="primary" onPress={() => openMemberDialog(member)}>
                        Message
                      </Button>
                      <Button variant="primary" onPress={() => setSelectedMemberDetail(member)}>
                        Profile
                      </Button>
                    </HStack>
                  </VStack>
                </Card>
              ))}
            </HStack>
          ))}
        </VStack>
      )}

      {showMemberDialog && (
        <Dialog
          title={editingMember ? 'Edit Member' : 'Add Member'}
          onDismiss={() => setShowMemberDialog(false)}
        >
          <VStack gap="md">
            <TextField
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            >
              <Item>Developer</Item>
              <Item>Designer</Item>
              <Item>Manager</Item>
              <Item>QA</Item>
            </Select>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Textarea
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <HStack gap="md">
              <Button variant="primary" onPress={saveMember}>
                {editingMember ? 'Update' : 'Add'}
              </Button>
              <Button onPress={() => setShowMemberDialog(false)}>
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Dialog>
      )}

      {selectedMemberDetail && (
        <Dialog
          title={selectedMemberDetail.name}
          onDismiss={() => setSelectedMemberDetail(null)}
        >
          <VStack gap="md">
            <Stack>
              <Text weight="bold">Role</Text>
              <Text>{selectedMemberDetail.role}</Text>
            </Stack>
            <Stack>
              <Text weight="bold">Email</Text>
              <Text>{selectedMemberDetail.email}</Text>
            </Stack>
            <Stack>
              <Text weight="bold">Status</Text>
              <Text>{selectedMemberDetail.status}</Text>
            </Stack>
            <Stack>
              <Text weight="bold">Joined</Text>
              <Text>{formatDate(selectedMemberDetail.joined)}</Text>
            </Stack>
          </VStack>
        </Dialog>
      )}
    </VStack>
  );

  // Projects page
  const ProjectsPage = () => (
    <VStack gap="xl">
      <Heading level={1}>Projects</Heading>

      <HStack gap="md">
        <TextField
          label="Search Projects"
          placeholder="Filter by name..."
          value={projectSearch}
          onChange={(e) => setProjectSearch(e.target.value)}
        />
        <Button variant="primary">New Project</Button>
      </HStack>

      {selectedProjects.size > 0 && (
        <HStack gap="md">
          <Button variant="critical" onPress={archiveSelectedProjects}>
            Archive Selected
          </Button>
          <Button>Export</Button>
        </HStack>
      )}

      <Table aria-label="Projects">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>
              <Checkbox
                checked={selectedProjects.size === filteredProjects.length && filteredProjects.length > 0}
                onChange={(checked) => {
                  if (checked) {
                    setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
                  } else {
                    setSelectedProjects(new Set());
                  }
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Lead</TableHeaderCell>
            <TableHeaderCell>Members</TableHeaderCell>
            <TableHeaderCell>Deadline</TableHeaderCell>
            <TableHeaderCell>Progress</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Checkbox
                  checked={selectedProjects.has(project.id)}
                  onChange={() => toggleProjectSelection(project.id)}
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
                    project.status === 'Active'
                      ? 'success'
                      : project.status === 'On Hold'
                      ? 'warning'
                      : 'info'
                  }
                >
                  {project.status}
                </Indicator>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </VStack>
  );

  // Calendar page (simplified)
  const CalendarPage = () => (
    <VStack gap="xl">
      <Heading level={1}>Team Calendar</Heading>

      <Card>
        <Text>Calendar for June 2026</Text>
      </Card>

      <VStack gap="md">
        <Heading level={2}>Upcoming Events</Heading>
        <Table aria-label="Upcoming Events">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Event</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{formatDate(new Date(2026, 5, 25))}</TableCell>
              <TableCell>Team Standup</TableCell>
              <TableCell>
                <Indicator variant="info">Meeting</Indicator>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{formatDate(new Date(2026, 5, 28))}</TableCell>
              <TableCell>Project Alpha Deadline</TableCell>
              <TableCell>
                <Indicator variant="warning">Deadline</Indicator>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{formatDate(new Date(2026, 6, 2))}</TableCell>
              <TableCell>Team Lunch</TableCell>
              <TableCell>
                <Indicator variant="success">Social</Indicator>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{formatDate(new Date(2026, 6, 5))}</TableCell>
              <TableCell>Sprint Planning</TableCell>
              <TableCell>
                <Indicator variant="info">Meeting</Indicator>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </VStack>
    </VStack>
  );

  // Files page
  const FilesPage = () => (
    <VStack gap="xl">
      <Heading level={1}>Shared Files</Heading>

      <HStack gap="md" wrap>
        <TextField
          label="Search Files"
          placeholder="Filter by name..."
          value={fileSearch}
          onChange={(e) => setFileSearch(e.target.value)}
        />
        <Select
          label="Type"
          value={fileTypeFilter}
          onChange={(value) => setFileTypeFilter(value)}
        >
          <Item>All</Item>
          <Item>Documents</Item>
          <Item>Images</Item>
          <Item>Spreadsheets</Item>
        </Select>
        <Button variant="primary" onPress={() => setShowFileUploadDialog(true)}>
          Upload
        </Button>
      </HStack>

      <Table aria-label="Files">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>File Name</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Size</TableHeaderCell>
            <TableHeaderCell>Uploaded By</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
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
                <HStack gap="xs">
                  <Button variant="plain">Download</Button>
                  <Button variant="plain">Rename</Button>
                  <Button variant="plain" onPress={() => removeFile(file.id)}>
                    Delete
                  </Button>
                </HStack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showFileUploadDialog && (
        <Dialog
          title="Upload Files"
          onDismiss={() => setShowFileUploadDialog(false)}
        >
          <VStack gap="md">
            <FileInput label="Files" />
            <Textarea
              label="Description"
              placeholder="Optional description..."
            />
            <Select label="Category">
              <Item>Documents</Item>
              <Item>Images</Item>
              <Item>Spreadsheets</Item>
              <Item>Other</Item>
            </Select>
            <HStack gap="md">
              <Button variant="primary" onPress={handleFileUpload}>
                Upload
              </Button>
              <Button onPress={() => setShowFileUploadDialog(false)}>
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Dialog>
      )}

      {showToast && (
        <Toast>{toastMessage}</Toast>
      )}
    </VStack>
  );

  // Settings page
  const SettingsPage = () => (
    <VStack gap="xl">
      <Heading level={1}>Team Settings</Heading>

      <Tabs>
        <TabList>
          <Tab>General</Tab>
          <Tab>Notifications</Tab>
          <Tab>Integrations</Tab>
        </TabList>

        <TabPanel>
          <VStack gap="md">
            <TextField
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Team description..."
            />
            <Select
              label="Default Timezone"
              value={timezone}
              onChange={(value) => setTimezone(value)}
            >
              <Item>UTC</Item>
              <Item>CET</Item>
              <Item>EST</Item>
              <Item>PST</Item>
            </Select>
            <Select
              label="Date Format"
              value={dateFormat}
              onChange={(value) => setDateFormat(value)}
            >
              <Item>MM/DD/YYYY</Item>
              <Item>DD.MM.YYYY</Item>
              <Item>YYYY-MM-DD</Item>
            </Select>
            <Button
              variant="primary"
              onPress={() => {
                setToastMessage('Settings updated.');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
            >
              Save
            </Button>
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack gap="md">
            <HStack gap="md" alignItems="center">
              <Checkbox
                checked={notificationPrefs.newMember}
                onChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, newMember: checked })
                }
              />
              <VStack gap="xs">
                <Text weight="bold">New member joins</Text>
                <Text size="sm">Get notified when someone joins the team</Text>
              </VStack>
            </HStack>

            <HStack gap="md" alignItems="center">
              <Checkbox
                checked={notificationPrefs.deadline}
                onChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, deadline: checked })
                }
              />
              <VStack gap="xs">
                <Text weight="bold">Project deadline approaching</Text>
                <Text size="sm">Reminder 3 days before deadline</Text>
              </VStack>
            </HStack>

            <HStack gap="md" alignItems="center">
              <Checkbox
                checked={notificationPrefs.weekly}
                onChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, weekly: checked })
                }
              />
              <VStack gap="xs">
                <Text weight="bold">Weekly digest</Text>
                <Text size="sm">Summary of team activity every Monday</Text>
              </VStack>
            </HStack>

            <HStack gap="md" alignItems="center">
              <Checkbox
                checked={notificationPrefs.mention}
                onChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, mention: checked })
                }
              />
              <VStack gap="xs">
                <Text weight="bold">Mention notifications</Text>
                <Text size="sm">When someone mentions you in a comment</Text>
              </VStack>
            </HStack>

            <HStack gap="md" alignItems="center">
              <Checkbox
                checked={notificationPrefs.calendar}
                onChange={(checked) =>
                  setNotificationPrefs({ ...notificationPrefs, calendar: checked })
                }
              />
              <VStack gap="xs">
                <Text weight="bold">Calendar reminders</Text>
                <Text size="sm">15 minutes before scheduled events</Text>
              </VStack>
            </HStack>

            <Button
              variant="primary"
              onPress={() => {
                setToastMessage('Notification preferences saved.');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
              }}
            >
              Save Preferences
            </Button>
          </VStack>
        </TabPanel>

        <TabPanel>
          <VStack gap="lg">
            {Object.entries(integrations).map(([key, integration]) => (
              <Card key={key}>
                <VStack gap="md">
                  <Text weight="bold">{integration.name}</Text>
                  <Indicator variant={integration.connected ? 'success' : 'warning'}>
                    {integration.connected ? 'Connected' : 'Not Connected'}
                  </Indicator>
                  <Text size="sm">
                    {integration.name} integration for team collaboration
                  </Text>
                  <Button
                    variant={integration.connected ? 'critical' : 'primary'}
                    onPress={() => toggleIntegration(key)}
                  >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </VStack>
              </Card>
            ))}
          </VStack>
        </TabPanel>
      </Tabs>

      {showToast && (
        <Toast>{toastMessage}</Toast>
      )}
    </VStack>
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'projects', label: 'Projects' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'files', label: 'Files' },
    { id: 'settings', label: 'Settings' },
  ];

  const currentPageLabel = navItems.find(item => item.id === currentPage)?.label || 'Dashboard';

  return (
    <Flex direction="row" minHeight="100vh">
      {sidebarOpen && (
        <Box width="250px" backgroundColor="gray-100" padding="lg" minHeight="100vh" overflow="auto">
          <VStack gap="xl">
            <Heading level={2}>{teamName}</Heading>
            <VStack gap="md">
              {navItems.slice(0, 5).map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'primary' : 'plain'}
                  onPress={() => setCurrentPage(item.id)}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
            <Box height="1px" backgroundColor="gray-300" />
            <VStack gap="md">
              {navItems.slice(5).map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'primary' : 'plain'}
                  onPress={() => setCurrentPage(item.id)}
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
          </VStack>
        </Box>
      )}

      <Flex direction="column" flex={1}>
        <Box backgroundColor="gray-50" padding="md" borderBottom="1px solid" borderColor="gray-300">
          <HStack gap="md" alignItems="center">
            <Button variant="plain" onPress={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </Button>
            <Text weight="bold">{teamName} &gt; {currentPageLabel}</Text>
            <Box flex={1} />
            <HStack gap="md" alignItems="center">
              <Tooltip text="Use the sidebar to navigate between sections.">
                <Button variant="plain">?</Button>
              </Tooltip>
              <MenuButton label="John Doe" tooltip="Account settings">
                <Menu>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Preferences</MenuItem>
                  <MenuItem>Sign Out</MenuItem>
                </Menu>
              </MenuButton>
            </HStack>
          </HStack>
        </Box>

        <Box padding="xl" overflow="auto" flex={1}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'members' && <MembersPage />}
          {currentPage === 'projects' && <ProjectsPage />}
          {currentPage === 'calendar' && <CalendarPage />}
          {currentPage === 'files' && <FilesPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </Box>
      </Flex>
    </Flex>
  );
};

export default TestApp;
