import {
  useState,
  useEffect,
  useMemo,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  type Key,
} from 'react';
import {
  Box,
  Stack,
  Inline,
  Headline,
  Text,
  Button,
  TextField,
  TextArea,
  SearchField,
  Select,
  Switch,
  Table,
  Tabs,
  Dialog,
  Menu,
  Tooltip,
  Card,
  Calendar,
} from '@marigold/components';

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

type Tone = 'info' | 'warning' | 'success' | 'error' | 'neutral';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  info: { bg: '#dbeafe', fg: '#1e40af' },
  warning: { bg: '#fef3c7', fg: '#92400e' },
  success: { bg: '#dcfce7', fg: '#166534' },
  error: { bg: '#fee2e2', fg: '#991b1b' },
  neutral: { bg: '#e5e7eb', fg: '#374151' },
};

const Indicator = ({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) => {
  const c = TONES[tone];
  return (
    <Box
      css={{
        display: 'inline-block',
        backgroundColor: c.bg,
        color: c.fg,
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
};

const fmtNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const fmtSize = (mb: number) =>
  `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(mb)} MB`;

/* ------------------------------------------------------------------ *
 * Types & seed data
 * ------------------------------------------------------------------ */

type Member = {
  id: number;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joined: string;
  bio: string;
};

type Project = {
  id: number;
  name: string;
  lead: string;
  members: number;
  deadline: string;
  progress: number;
  status: 'Active' | 'On Hold' | 'Completed';
};

type FileItem = {
  id: number;
  name: string;
  type: 'Document' | 'Image' | 'Spreadsheet';
  size: number;
  uploadedBy: string;
  date: string;
};

const SEED_MEMBERS: Member[] = [
  { id: 1, name: 'Jane Cooper', role: 'Developer', email: 'jane@teamhub.io', status: 'Active', joined: '2024-03-12', bio: 'Front-end engineer focused on design systems.' },
  { id: 2, name: 'Robert Fox', role: 'Designer', email: 'robert@teamhub.io', status: 'On Leave', joined: '2023-11-05', bio: 'Product designer with a love for typography.' },
  { id: 3, name: 'Emily Davis', role: 'Manager', email: 'emily@teamhub.io', status: 'Active', joined: '2022-07-21', bio: 'Team lead coordinating delivery across squads.' },
  { id: 4, name: 'Michael Lee', role: 'Developer', email: 'michael@teamhub.io', status: 'Active', joined: '2024-01-30', bio: 'Back-end developer and database enthusiast.' },
  { id: 5, name: 'Sarah Kim', role: 'Designer', email: 'sarah@teamhub.io', status: 'Active', joined: '2023-09-14', bio: 'UX researcher turned interaction designer.' },
  { id: 6, name: 'David Park', role: 'QA', email: 'david@teamhub.io', status: 'On Leave', joined: '2024-05-02', bio: 'Quality engineer automating the test suite.' },
];

const SEED_PROJECTS: Project[] = [
  { id: 1, name: 'Apollo', lead: 'Jane Cooper', members: 5, deadline: '2026-07-15', progress: 75, status: 'Active' },
  { id: 2, name: 'Helios', lead: 'Emily Davis', members: 3, deadline: '2026-06-30', progress: 40, status: 'On Hold' },
  { id: 3, name: 'Orion', lead: 'Michael Lee', members: 6, deadline: '2026-08-01', progress: 90, status: 'Active' },
  { id: 4, name: 'Nova', lead: 'Sarah Kim', members: 4, deadline: '2026-05-20', progress: 100, status: 'Completed' },
  { id: 5, name: 'Titan', lead: 'Robert Fox', members: 2, deadline: '2026-09-10', progress: 20, status: 'Active' },
];

const SEED_FILES: FileItem[] = [
  { id: 1, name: 'Q2 Report.pdf', type: 'Document', size: 2.4, uploadedBy: 'Jane Cooper', date: '2026-05-20' },
  { id: 2, name: 'logo.png', type: 'Image', size: 0.8, uploadedBy: 'Robert Fox', date: '2026-05-18' },
  { id: 3, name: 'Budget.xlsx', type: 'Spreadsheet', size: 1.2, uploadedBy: 'Emily Davis', date: '2026-05-15' },
  { id: 4, name: 'Roadmap.docx', type: 'Document', size: 0.5, uploadedBy: 'Michael Lee', date: '2026-05-12' },
  { id: 5, name: 'team.jpg', type: 'Image', size: 3.1, uploadedBy: 'Sarah Kim', date: '2026-05-10' },
];

const ACTIVITY = [
  { id: 1, member: 'Jane Cooper', action: 'Commit', tone: 'info' as Tone, project: 'Apollo', date: '2026-05-28' },
  { id: 2, member: 'Robert Fox', action: 'Review', tone: 'warning' as Tone, project: 'Helios', date: '2026-05-27' },
  { id: 3, member: 'Emily Davis', action: 'Deploy', tone: 'success' as Tone, project: 'Orion', date: '2026-05-26' },
  { id: 4, member: 'Michael Lee', action: 'Commit', tone: 'info' as Tone, project: 'Nova', date: '2026-05-25' },
  { id: 5, member: 'Sarah Kim', action: 'Review', tone: 'warning' as Tone, project: 'Titan', date: '2026-05-24' },
];

const EVENTS = [
  { id: 1, date: '2026-06-26', name: 'Sprint Planning', type: 'Meeting', tone: 'info' as Tone },
  { id: 2, date: '2026-06-30', name: 'Helios Deadline', type: 'Deadline', tone: 'warning' as Tone },
  { id: 3, date: '2026-07-03', name: 'Team Lunch', type: 'Social', tone: 'success' as Tone },
  { id: 4, date: '2026-07-08', name: 'Design Review', type: 'Meeting', tone: 'info' as Tone },
];

const PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'members', label: 'Members' },
  { id: 'projects', label: 'Projects' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
];

const statusTone = (s: Member['status']): Tone => (s === 'Active' ? 'success' : 'warning');
const projectTone = (s: Project['status']): Tone =>
  s === 'Active' ? 'info' : s === 'On Hold' ? 'warning' : 'success';

/* ------------------------------------------------------------------ *
 * Member form (used by both Add and Edit)
 * ------------------------------------------------------------------ */

const MemberForm = ({
  initial,
  onSubmit,
  close,
}: {
  initial?: Member;
  onSubmit: (data: Omit<Member, 'id' | 'status'>) => void;
  close: () => void;
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState(initial?.role ?? 'Developer');
  const [start, setStart] = useState(initial?.joined ?? '');
  const [bio, setBio] = useState(initial?.bio ?? '');

  const valid = name.trim().length > 0 && email.trim().length > 0;

  return (
    <Stack space={4}>
      <Headline level="3">{initial ? 'Edit Member' : 'Add Member'}</Headline>
      <TextField label="Full Name" isRequired value={name} onChange={setName} />
      <TextField label="Email" type="email" isRequired value={email} onChange={setEmail} />
      <Select
        label="Role"
        selectedKey={role}
        onSelectionChange={(k) => setRole(String(k))}
      >
        <Select.Option id="Developer">Developer</Select.Option>
        <Select.Option id="Designer">Designer</Select.Option>
        <Select.Option id="Manager">Manager</Select.Option>
        <Select.Option id="QA">QA</Select.Option>
      </Select>
      <TextField
        label="Start Date"
        value={start}
        onChange={setStart}
        description="Format: YYYY-MM-DD"
      />
      <TextArea label="Bio" value={bio} onChange={setBio} />
      <Inline space={3} alignY="center">
        <Button
          variant="primary"
          disabled={!valid}
          onPress={() => {
            if (!valid) return;
            onSubmit({ name, email, role, joined: start || '2026-01-01', bio });
            close();
          }}
        >
          {initial ? 'Save' : 'Add'}
        </Button>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
      </Inline>
    </Stack>
  );
};

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

const SummaryCard = ({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: ReactNode;
  tooltip?: string;
}) => (
  <Card>
    <Box css={{ padding: '16px' }}>
      <Stack space={2}>
        <Inline space={2} alignY="center">
          <Text css={{ color: '#6b7280', fontSize: '13px' }}>{label}</Text>
          {tooltip ? (
            <Tooltip.Trigger>
              <Button variant="text" size="small">
                ?
              </Button>
              <Tooltip>{tooltip}</Tooltip>
            </Tooltip.Trigger>
          ) : null}
        </Inline>
        <Text css={{ fontSize: '28px', fontWeight: 700 }}>{value}</Text>
      </Stack>
    </Box>
  </Card>
);

const Dashboard = ({ memberCount }: { memberCount: number }) => (
  <Stack space={6}>
    <Headline level="2">Team Overview</Headline>

    <Box
      css={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      <SummaryCard label="Members" value={memberCount} />
      <SummaryCard label="Active Projects" value={5} />
      <SummaryCard label="Upcoming Deadlines" value={8} />
      <SummaryCard
        label="Hours This Week"
        value={fmtNumber(342)}
        tooltip="Aggregate of all team members."
      />
    </Box>

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
          {ACTIVITY.map((a) => (
            <Table.Row key={a.id} id={a.id}>
              <Table.Cell>{a.member}</Table.Cell>
              <Table.Cell>
                <Indicator tone={a.tone}>{a.action}</Indicator>
              </Table.Cell>
              <Table.Cell>{a.project}</Table.Cell>
              <Table.Cell>{fmtDate(a.date)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>

    <Box
      css={{
        backgroundColor: TONES.info.bg,
        color: TONES.info.fg,
        padding: '12px 16px',
        borderRadius: '8px',
      }}
    >
      <Text css={{ color: TONES.info.fg }}>
        Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
      </Text>
    </Box>
  </Stack>
);

/* ------------------------------------------------------------------ *
 * Members
 * ------------------------------------------------------------------ */

const MemberDetail = ({ member, onClose }: { member: Member; onClose: () => void }) => (
  <Box
    css={{
      width: '300px',
      flexShrink: 0,
      borderLeft: '1px solid #e5e7eb',
      paddingLeft: '16px',
    }}
  >
    <Stack space={3}>
      <Inline space={3} alignY="center" css={{ justifyContent: 'space-between' }}>
        <Headline level="3">{member.name}</Headline>
        <Button variant="text" onPress={onClose}>
          Close
        </Button>
      </Inline>
      <Indicator tone="neutral">{member.role}</Indicator>
      <Text>{member.email}</Text>
      <Inline space={2} alignY="center">
        <Text css={{ color: '#6b7280' }}>Status:</Text>
        <Indicator tone={statusTone(member.status)}>{member.status}</Indicator>
      </Inline>
      <Text css={{ color: '#6b7280' }}>Joined: {fmtDate(member.joined)}</Text>
      <Text>{member.bio}</Text>
    </Stack>
  </Box>
);

const Members = ({
  members,
  setMembers,
  viewMode,
  setViewMode,
  showToast,
}: {
  members: Member[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
  viewMode: 'table' | 'cards';
  setViewMode: (v: 'table' | 'cards') => void;
  showToast: (m: string) => void;
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      members.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) &&
          (roleFilter === 'all' || m.role === roleFilter)
      ),
    [members, search, roleFilter]
  );

  const selected = members.find((m) => m.id === selectedId) ?? null;

  const addMember = (data: Omit<Member, 'id' | 'status'>) => {
    const nextId = members.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    setMembers((prev) => [...prev, { ...data, id: nextId, status: 'Active' }]);
    showToast('Member added.');
  };

  const updateMember = (id: number, data: Omit<Member, 'id' | 'status'>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    showToast('Member updated.');
  };

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
    showToast('Member removed.');
  };

  return (
    <Stack space={5}>
      <Headline level="2">Team Members</Headline>

      <Inline space={3} alignY="bottom" css={{ flexWrap: 'wrap' }}>
        <Box css={{ minWidth: '220px' }}>
          <SearchField
            label="Search"
            aria-label="Search members by name"
            value={search}
            onChange={setSearch}
            placeholder="Search by name…"
          />
        </Box>
        <Box css={{ minWidth: '160px' }}>
          <Select
            label="Role"
            aria-label="Filter by role"
            selectedKey={roleFilter}
            onSelectionChange={(k) => setRoleFilter(String(k))}
          >
            <Select.Option id="all">All Roles</Select.Option>
            <Select.Option id="Developer">Developer</Select.Option>
            <Select.Option id="Designer">Designer</Select.Option>
            <Select.Option id="Manager">Manager</Select.Option>
          </Select>
        </Box>
        <Inline space={1} alignY="center">
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
        </Inline>
        <Dialog.Trigger>
          <Button variant="primary">Add Member</Button>
          <Dialog aria-label="Add member">
            {({ close }) => <MemberForm onSubmit={addMember} close={close} />}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Box css={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Box css={{ flex: 1, minWidth: 0 }}>
          {viewMode === 'table' ? (
            <Table
              aria-label="Team members table"
              onRowAction={(key) => setSelectedId(Number(key))}
            >
              <Table.Header>
                <Table.Column>Name</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Email</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Joined</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {filtered.map((m) => (
                  <Table.Row key={m.id} id={m.id}>
                    <Table.Cell>{m.name}</Table.Cell>
                    <Table.Cell>{m.role}</Table.Cell>
                    <Table.Cell>{m.email}</Table.Cell>
                    <Table.Cell>
                      <Indicator tone={statusTone(m.status)}>{m.status}</Indicator>
                    </Table.Cell>
                    <Table.Cell>{fmtDate(m.joined)}</Table.Cell>
                    <Table.Cell>
                      <Inline space={1} alignY="center">
                        <Dialog.Trigger>
                          <Button variant="text" size="small">
                            Edit
                          </Button>
                          <Dialog aria-label="Edit member">
                            {({ close }) => (
                              <MemberForm
                                initial={m}
                                onSubmit={(data) => updateMember(m.id, data)}
                                close={close}
                              />
                            )}
                          </Dialog>
                        </Dialog.Trigger>
                        <Dialog.Trigger>
                          <Button variant="text" size="small">
                            Remove
                          </Button>
                          <Dialog aria-label="Confirm removal">
                            {({ close }) => (
                              <Stack space={4}>
                                <Headline level="3">Remove member?</Headline>
                                <Text>
                                  Are you sure you want to remove {m.name}? This cannot be
                                  undone.
                                </Text>
                                <Inline space={3}>
                                  <Button
                                    variant="primary"
                                    onPress={() => {
                                      removeMember(m.id);
                                      close();
                                    }}
                                  >
                                    Remove
                                  </Button>
                                  <Button variant="secondary" onPress={close}>
                                    Cancel
                                  </Button>
                                </Inline>
                              </Stack>
                            )}
                          </Dialog>
                        </Dialog.Trigger>
                      </Inline>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <Box
              css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              {filtered.map((m) => (
                <Card key={m.id}>
                  <Box css={{ padding: '16px' }}>
                    <Stack space={3}>
                      <Box
                        css={{ cursor: 'pointer' }}
                        onClick={() => setSelectedId(m.id)}
                      >
                        <Headline level="4">{m.name}</Headline>
                      </Box>
                      <Indicator tone="neutral">{m.role}</Indicator>
                      <Text css={{ color: '#6b7280' }}>{m.email}</Text>
                      <Inline space={2}>
                        <Button
                          variant="secondary"
                          size="small"
                          onPress={() => showToast(`Message sent to ${m.name}.`)}
                        >
                          Message
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onPress={() => setSelectedId(m.id)}
                        >
                          Profile
                        </Button>
                      </Inline>
                    </Stack>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {selected ? (
          <MemberDetail member={selected} onClose={() => setSelectedId(null)} />
        ) : null}
      </Box>
    </Stack>
  );
};

/* ------------------------------------------------------------------ *
 * Projects
 * ------------------------------------------------------------------ */

const Projects = ({ showToast }: { showToast: (m: string) => void }) => {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<number>>(new Set());

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const onSelectionChange = (keys: 'all' | Set<Key>) => {
    if (keys === 'all') {
      setSelectedKeys(new Set(filtered.map((p) => p.id)));
    } else {
      setSelectedKeys(new Set(Array.from(keys).map((k) => Number(k))));
    }
  };

  const archiveSelected = () => {
    setProjects((prev) => prev.filter((p) => !selectedKeys.has(p.id)));
    showToast(`Archived ${selectedKeys.size} project(s).`);
    setSelectedKeys(new Set());
  };

  return (
    <Stack space={5}>
      <Headline level="2">Projects</Headline>

      <Inline space={3} alignY="bottom" css={{ flexWrap: 'wrap' }}>
        <Box css={{ minWidth: '220px' }}>
          <SearchField
            label="Search"
            aria-label="Search projects"
            value={search}
            onChange={setSearch}
            placeholder="Search projects…"
          />
        </Box>
        <Button variant="primary" onPress={() => showToast('New project created.')}>
          New Project
        </Button>
      </Inline>

      {selectedKeys.size > 0 ? (
        <Box
          css={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            backgroundColor: '#eff6ff',
            padding: '8px 16px',
            borderRadius: '8px',
          }}
        >
          <Text>{selectedKeys.size} selected</Text>
          <Button variant="primary" onPress={archiveSelected}>
            Archive Selected
          </Button>
          <Button variant="secondary" onPress={() => showToast('Export started.')}>
            Export
          </Button>
        </Box>
      ) : null}

      <Table
        aria-label="Projects table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      >
        <Table.Header>
          <Table.Column>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((p) => (
            <Table.Row key={p.id} id={p.id}>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members}</Table.Cell>
              <Table.Cell>{fmtDate(p.deadline)}</Table.Cell>
              <Table.Cell>{p.progress}%</Table.Cell>
              <Table.Cell>
                <Indicator tone={projectTone(p.status)}>{p.status}</Indicator>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

/* ------------------------------------------------------------------ *
 * Calendar
 * ------------------------------------------------------------------ */

const CalendarPage = () => (
  <Stack space={6}>
    <Headline level="2">Team Calendar</Headline>
    <Calendar aria-label="Team calendar" />
    <Stack space={3}>
      <Headline level="3">Upcoming Events</Headline>
      <Stack space={2}>
        {EVENTS.map((e) => (
          <Card key={e.id}>
            <Box css={{ padding: '12px 16px' }}>
              <Inline space={4} alignY="center" css={{ flexWrap: 'wrap' }}>
                <Text css={{ color: '#6b7280', minWidth: '140px' }}>{fmtDate(e.date)}</Text>
                <Text css={{ fontWeight: 600, flex: 1 }}>{e.name}</Text>
                <Indicator tone={e.tone}>{e.type}</Indicator>
              </Inline>
            </Box>
          </Card>
        ))}
      </Stack>
    </Stack>
  </Stack>
);

/* ------------------------------------------------------------------ *
 * Files
 * ------------------------------------------------------------------ */

const UploadForm = ({
  onUpload,
  close,
}: {
  onUpload: (name: string, type: FileItem['type']) => void;
  close: () => void;
}) => {
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FileItem['type']>('Document');

  return (
    <Stack space={4}>
      <Headline level="3">Upload Files</Headline>
      <TextField
        label="Files"
        value={fileName}
        onChange={setFileName}
        description="Select one or more files to upload"
        placeholder="report.pdf, notes.docx"
      />
      <TextField label="Description" value={description} onChange={setDescription} />
      <Select
        label="Category"
        selectedKey={category}
        onSelectionChange={(k) => setCategory(k as FileItem['type'])}
      >
        <Select.Option id="Document">Documents</Select.Option>
        <Select.Option id="Image">Images</Select.Option>
        <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
      </Select>
      <Inline space={3}>
        <Button
          variant="primary"
          onPress={() => {
            onUpload(fileName.trim() || 'Untitled file', category);
            close();
          }}
        >
          Upload
        </Button>
        <Button variant="secondary" onPress={close}>
          Cancel
        </Button>
      </Inline>
    </Stack>
  );
};

const Files = ({ showToast }: { showToast: (m: string) => void }) => {
  const [files, setFiles] = useState<FileItem[]>(SEED_FILES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = files.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'all' || f.type === typeFilter)
  );

  const handleUpload = (name: string, type: FileItem['type']) => {
    const nextId = files.reduce((max, f) => Math.max(max, f.id), 0) + 1;
    setFiles((prev) => [
      ...prev,
      { id: nextId, name, type, size: 1.0, uploadedBy: 'John Doe', date: '2026-06-25' },
    ]);
    showToast('Files uploaded successfully.');
  };

  const onAction = (key: string, file: FileItem) => {
    if (key === 'delete') {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      showToast(`Deleted ${file.name}.`);
    } else if (key === 'download') {
      showToast(`Downloading ${file.name}…`);
    } else if (key === 'rename') {
      showToast(`Rename ${file.name}.`);
    }
  };

  return (
    <Stack space={5}>
      <Headline level="2">Shared Files</Headline>

      <Inline space={3} alignY="bottom" css={{ flexWrap: 'wrap' }}>
        <Box css={{ minWidth: '220px' }}>
          <SearchField
            label="Search"
            aria-label="Search files"
            value={search}
            onChange={setSearch}
            placeholder="Search files…"
          />
        </Box>
        <Box css={{ minWidth: '160px' }}>
          <Select
            label="Type"
            aria-label="Filter by type"
            selectedKey={typeFilter}
            onSelectionChange={(k) => setTypeFilter(String(k))}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Document">Documents</Select.Option>
            <Select.Option id="Image">Images</Select.Option>
            <Select.Option id="Spreadsheet">Spreadsheets</Select.Option>
          </Select>
        </Box>
        <Dialog.Trigger>
          <Button variant="primary">Upload</Button>
          <Dialog aria-label="Upload files">
            {({ close }) => <UploadForm onUpload={handleUpload} close={close} />}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Table aria-label="Shared files table">
        <Table.Header>
          <Table.Column>File Name</Table.Column>
          <Table.Column>Type</Table.Column>
          <Table.Column>Size</Table.Column>
          <Table.Column>Uploaded By</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {filtered.map((f) => (
            <Table.Row key={f.id} id={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>{fmtSize(f.size)}</Table.Cell>
              <Table.Cell>{f.uploadedBy}</Table.Cell>
              <Table.Cell>{fmtDate(f.date)}</Table.Cell>
              <Table.Cell>
                <Menu label="Actions" onAction={(key) => onAction(String(key), f)}>
                  <Menu.Item id="download">Download</Menu.Item>
                  <Menu.Item id="rename">Rename</Menu.Item>
                  <Menu.Item id="delete">Delete</Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Stack>
  );
};

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

const NOTIFICATIONS = [
  { id: 'join', title: 'New member joins', desc: 'Get notified when someone joins the team' },
  { id: 'deadline', title: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
  { id: 'digest', title: 'Weekly digest', desc: 'Summary of team activity every Monday' },
  { id: 'mention', title: 'Mention notifications', desc: 'When someone mentions you in a comment' },
  { id: 'reminder', title: 'Calendar reminders', desc: '15 minutes before scheduled events' },
];

const Settings = ({
  teamName,
  setTeamName,
  showToast,
}: {
  teamName: string;
  setTeamName: (n: string) => void;
  showToast: (m: string) => void;
}) => {
  const [draftName, setDraftName] = useState(teamName);
  const [description, setDescription] = useState('Our cross-functional product team.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    join: true,
    deadline: true,
    digest: false,
    mention: true,
    reminder: false,
  });

  const [integrations, setIntegrations] = useState({
    Slack: true,
    GitHub: false,
    Jira: false,
  });

  const integrationData = [
    { name: 'Slack' as const, desc: 'Send team notifications to a Slack channel.' },
    { name: 'GitHub' as const, desc: 'Link commits and pull requests to projects.' },
    { name: 'Jira' as const, desc: 'Sync issues and sprint boards with Jira.' },
  ];

  return (
    <Stack space={5}>
      <Headline level="2">Team Settings</Headline>

      <Tabs aria-label="Team settings">
        <Tabs.List>
          <Tabs.Item id="general">General</Tabs.Item>
          <Tabs.Item id="notifications">Notifications</Tabs.Item>
          <Tabs.Item id="integrations">Integrations</Tabs.Item>
        </Tabs.List>

        <Tabs.TabPanel id="general">
          <Box css={{ paddingTop: '16px', maxWidth: '480px' }}>
            <Stack space={4}>
              <TextField label="Team Name" value={draftName} onChange={setDraftName} />
              <TextArea label="Description" value={description} onChange={setDescription} />
              <Select
                label="Default Timezone"
                selectedKey={timezone}
                onSelectionChange={(k) => setTimezone(String(k))}
              >
                <Select.Option id="UTC">UTC</Select.Option>
                <Select.Option id="CET">CET</Select.Option>
                <Select.Option id="EST">EST</Select.Option>
                <Select.Option id="PST">PST</Select.Option>
              </Select>
              <Select
                label="Date Format"
                selectedKey={dateFormat}
                onSelectionChange={(k) => setDateFormat(String(k))}
              >
                <Select.Option id="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
                <Select.Option id="DD.MM.YYYY">DD.MM.YYYY</Select.Option>
                <Select.Option id="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
              </Select>
              <Box>
                <Button
                  variant="primary"
                  onPress={() => {
                    setTeamName(draftName.trim() || teamName);
                    showToast('Settings updated.');
                  }}
                >
                  Save
                </Button>
              </Box>
            </Stack>
          </Box>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="notifications">
          <Box css={{ paddingTop: '16px', maxWidth: '560px' }}>
            <Stack space={4}>
              {NOTIFICATIONS.map((n) => (
                <Stack key={n.id} space={1}>
                  <Switch
                    isSelected={toggles[n.id]}
                    onChange={(v) => setToggles((prev) => ({ ...prev, [n.id]: v }))}
                  >
                    {n.title}
                  </Switch>
                  <Text css={{ color: '#6b7280', fontSize: '13px' }}>{n.desc}</Text>
                </Stack>
              ))}
              <Box>
                <Button variant="primary" onPress={() => showToast('Settings updated.')}>
                  Save Preferences
                </Button>
              </Box>
            </Stack>
          </Box>
        </Tabs.TabPanel>

        <Tabs.TabPanel id="integrations">
          <Box
            css={{
              paddingTop: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {integrationData.map((it) => {
              const connected = integrations[it.name];
              return (
                <Card key={it.name}>
                  <Box css={{ padding: '16px' }}>
                    <Stack space={3}>
                      <Headline level="4">{it.name}</Headline>
                      <Indicator tone={connected ? 'success' : 'neutral'}>
                        {connected ? 'Connected' : 'Not connected'}
                      </Indicator>
                      <Text css={{ color: '#6b7280' }}>{it.desc}</Text>
                      {connected ? (
                        <Dialog.Trigger>
                          <Button variant="secondary">Disconnect</Button>
                          <Dialog aria-label="Confirm disconnect">
                            {({ close }) => (
                              <Stack space={4}>
                                <Headline level="3">Disconnect {it.name}?</Headline>
                                <Text>
                                  Are you sure you want to disconnect {it.name}?
                                </Text>
                                <Inline space={3}>
                                  <Button
                                    variant="primary"
                                    onPress={() => {
                                      setIntegrations((prev) => ({
                                        ...prev,
                                        [it.name]: false,
                                      }));
                                      showToast(`${it.name} disconnected.`);
                                      close();
                                    }}
                                  >
                                    Disconnect
                                  </Button>
                                  <Button variant="secondary" onPress={close}>
                                    Cancel
                                  </Button>
                                </Inline>
                              </Stack>
                            )}
                          </Dialog>
                        </Dialog.Trigger>
                      ) : (
                        <Button
                          variant="primary"
                          onPress={() => {
                            setIntegrations((prev) => ({ ...prev, [it.name]: true }));
                            showToast(`${it.name} connected.`);
                          }}
                        >
                          Connect
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Card>
              );
            })}
          </Box>
        </Tabs.TabPanel>
      </Tabs>
    </Stack>
  );
};

/* ------------------------------------------------------------------ *
 * Shell
 * ------------------------------------------------------------------ */

const TestApp = () => {
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [teamName, setTeamName] = useState('TeamHub');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (m: string) => setToast(m);

  const currentLabel = PAGES.find((p) => p.id === page)?.label ?? '';

  return (
    <Box css={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        css={{
          width: collapsed ? '64px' : '220px',
          flexShrink: 0,
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          padding: '16px 8px',
          transition: 'width 0.15s ease',
          overflowY: 'auto',
        }}
      >
        <Stack space={4}>
          <Box css={{ padding: '0 8px' }}>
            <Headline level="3">{collapsed ? teamName[0] : teamName}</Headline>
          </Box>
          <Stack space={1}>
            {PAGES.map((p) => (
              <Box key={p.id}>
                {p.id === 'settings' ? (
                  <Box
                    css={{
                      borderTop: '1px solid #e5e7eb',
                      margin: '8px 4px',
                    }}
                  />
                ) : null}
                <Box
                  css={{
                    borderRadius: '6px',
                    backgroundColor: page === p.id ? '#dbeafe' : 'transparent',
                  }}
                >
                  <Button
                    variant="text"
                    onPress={() => setPage(p.id)}
                    css={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    <Text
                      css={{
                        fontWeight: page === p.id ? 700 : 400,
                        color: page === p.id ? '#1e40af' : undefined,
                      }}
                    >
                      {collapsed ? p.label[0] : p.label}
                    </Text>
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Main column */}
      <Box css={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {/* Top navigation */}
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '12px 24px',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <Button variant="secondary" onPress={() => setCollapsed((c) => !c)}>
            {collapsed ? '☰ Expand' : '☰ Collapse'}
          </Button>

          <Box css={{ flex: 1, textAlign: 'center' }}>
            <Text css={{ fontWeight: 600 }}>
              {teamName} › {currentLabel}
            </Text>
          </Box>

          <Inline space={2} alignY="center">
            <Tooltip.Trigger>
              <Menu
                label="John Doe"
                onAction={(key) => showToast(`Account: ${String(key)}`)}
              >
                <Menu.Item id="profile">Profile</Menu.Item>
                <Menu.Item id="preferences">Preferences</Menu.Item>
                <Menu.Item id="signout">Sign Out</Menu.Item>
              </Menu>
              <Tooltip>Account settings</Tooltip>
            </Tooltip.Trigger>

            <Dialog.Trigger>
              <Button variant="secondary">Help</Button>
              <Dialog aria-label="Help">
                {({ close }) => (
                  <Stack space={4}>
                    <Headline level="3">Help</Headline>
                    <Text>Use the sidebar to navigate between sections.</Text>
                    <Box>
                      <Button variant="primary" onPress={close}>
                        Got it
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Dialog>
            </Dialog.Trigger>
          </Inline>
        </Box>

        {/* Scrollable content */}
        <Box css={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {page === 'dashboard' && <Dashboard memberCount={members.length} />}
          {page === 'members' && (
            <Members
              members={members}
              setMembers={setMembers}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showToast={showToast}
            />
          )}
          {page === 'projects' && <Projects showToast={showToast} />}
          {page === 'calendar' && <CalendarPage />}
          {page === 'files' && <Files showToast={showToast} />}
          {page === 'settings' && (
            <Settings teamName={teamName} setTeamName={setTeamName} showToast={showToast} />
          )}
        </Box>
      </Box>

      {/* Toast */}
      {toast ? (
        <Box
          css={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#111827',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <Text css={{ color: '#ffffff' }}>{toast}</Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default TestApp;
