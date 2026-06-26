import { useState } from 'react';
import {
  Box,
  Text,
  Headline,
  Button,
  TextField,
  TextArea,
  Select,
  SearchField,
  Switch,
  Table,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const cardCss = {
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '16px',
  backgroundColor: 'white',
};

const TONES: Record<string, { bg: string; fg: string }> = {
  info: { bg: '#dbeafe', fg: '#1e40af' },
  warning: { bg: '#fef3c7', fg: '#92400e' },
  success: { bg: '#dcfce7', fg: '#166534' },
  neutral: { bg: '#e2e8f0', fg: '#334155' },
};

const Indicator = ({
  tone = 'neutral',
  children,
}: {
  tone?: string;
  children: React.ReactNode;
}) => {
  const c = TONES[tone] ?? TONES.neutral;
  return (
    <Box
      css={{
        display: 'inline-block',
        backgroundColor: c.bg,
        color: c.fg,
        borderRadius: '999px',
        padding: '2px 10px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  );
};

const Banner = ({ children }: { children: React.ReactNode }) => (
  <Box
    css={{
      backgroundColor: '#dbeafe',
      color: '#1e3a8a',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      padding: '12px 16px',
    }}
  >
    {children}
  </Box>
);

const Toast = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <Box
      css={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#166534',
        color: 'white',
        padding: '12px 18px',
        borderRadius: '8px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      {message}
    </Box>
  );
};

const WithTooltip = ({
  text,
  block,
  children,
}: {
  text: string;
  block?: boolean;
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  return (
    <Box
      css={{
        position: 'relative',
        display: block ? 'block' : 'inline-block',
        width: block ? '100%' : 'auto',
      }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <Box
          css={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '6px',
            backgroundColor: '#0f172a',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 300,
          }}
        >
          {text}
        </Box>
      )}
    </Box>
  );
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  width = 480,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) => {
  if (!open) return null;
  return (
    <Box
      css={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <Box
        css={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: `${width}px`,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <Headline level={3}>{title}</Headline>
          <Button variant="text" onPress={onClose}>
            Close
          </Button>
        </Box>
        <Box css={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children}
        </Box>
        {footer && (
          <Box
            css={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '20px',
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const ActionMenu = ({
  label = '⋯',
  actions,
  onAction,
}: {
  label?: string;
  actions: { key: string; label: string }[];
  onAction: (key: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Box css={{ position: 'relative', display: 'inline-block' }}>
      <Button variant="text" onPress={() => setOpen((o) => !o)}>
        {label}
      </Button>
      {open && (
        <>
          <Box
            css={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <Box
            css={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '4px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zIndex: 100,
              minWidth: '150px',
              padding: '4px',
            }}
          >
            {actions.map((a) => (
              <Box key={a.key} css={{ display: 'block' }}>
                <Button
                  variant="text"
                  onPress={() => {
                    setOpen(false);
                    onAction(a.key);
                  }}
                >
                  {a.label}
                </Button>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) => (
  <Select
    label={label}
    aria-label={label}
    selectedKey={value}
    onSelectionChange={(k: React.Key) => onChange(String(k))}
  >
    {options.map((o) => (
      <Select.Option key={o.id} id={o.id}>
        {o.label}
      </Select.Option>
    ))}
  </Select>
);

const MonthCalendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const monthLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Box css={{ ...cardCss }}>
      <Box css={{ fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>
        {monthLabel}
      </Box>
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {weekdays.map((w) => (
          <Box
            key={w}
            css={{
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '12px',
              color: '#64748b',
              padding: '4px 0',
            }}
          >
            {w}
          </Box>
        ))}
        {cells.map((c, i) => (
          <Box
            key={i}
            css={{
              textAlign: 'center',
              padding: '10px 0',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: c === today ? '#4f46e5' : 'transparent',
              color: c === today ? 'white' : '#1e293b',
              fontWeight: c === today ? 700 : 400,
            }}
          >
            {c ?? ''}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Types & seed data                                                   */
/* ------------------------------------------------------------------ */

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joined: string;
  bio: string;
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

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  by: string;
  date: string;
}

const SEED_MEMBERS: Member[] = [
  { id: 'm1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: '2024-03-12', bio: 'Full-stack engineer focused on the platform core.' },
  { id: 'm2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.io', status: 'On Leave', joined: '2023-11-02', bio: 'Product designer, design systems enthusiast.' },
  { id: 'm3', name: 'Carol White', role: 'Manager', email: 'carol@teamhub.io', status: 'Active', joined: '2022-07-21', bio: 'Leads the Apollo program.' },
  { id: 'm4', name: 'David Brown', role: 'Developer', email: 'david@teamhub.io', status: 'Active', joined: '2024-01-15', bio: 'Backend developer, infrastructure & CI.' },
  { id: 'm5', name: 'Eva Green', role: 'QA', email: 'eva@teamhub.io', status: 'On Leave', joined: '2023-05-30', bio: 'Quality assurance and test automation.' },
  { id: 'm6', name: 'Frank Moore', role: 'Designer', email: 'frank@teamhub.io', status: 'Active', joined: '2024-06-01', bio: 'Brand and marketing design.' },
];

const ACTIVITY = [
  { member: 'Alice Johnson', action: 'Commit', project: 'Apollo', date: '2026-05-28' },
  { member: 'Bob Smith', action: 'Review', project: 'Helios', date: '2026-05-27' },
  { member: 'Carol White', action: 'Deploy', project: 'Apollo', date: '2026-05-26' },
  { member: 'David Brown', action: 'Commit', project: 'Zephyr', date: '2026-05-25' },
  { member: 'Eva Green', action: 'Review', project: 'Helios', date: '2026-05-24' },
];

const ACTION_TONE: Record<string, string> = {
  Commit: 'info',
  Review: 'warning',
  Deploy: 'success',
};

const SEED_PROJECTS: Project[] = [
  { id: 'p1', name: 'Apollo', lead: 'Carol White', members: 5, deadline: '2026-07-15', progress: 75, status: 'Active' },
  { id: 'p2', name: 'Helios', lead: 'Alice Johnson', members: 3, deadline: '2026-08-01', progress: 40, status: 'Active' },
  { id: 'p3', name: 'Zephyr', lead: 'David Brown', members: 4, deadline: '2026-06-30', progress: 90, status: 'On Hold' },
  { id: 'p4', name: 'Orion', lead: 'Frank Moore', members: 2, deadline: '2026-09-10', progress: 20, status: 'Active' },
  { id: 'p5', name: 'Atlas', lead: 'Bob Smith', members: 6, deadline: '2026-05-20', progress: 100, status: 'Completed' },
];

const PROJECT_TONE: Record<string, string> = {
  Active: 'info',
  'On Hold': 'warning',
  Completed: 'success',
};

const SEED_FILES: FileItem[] = [
  { id: 'f1', name: 'Roadmap.pdf', type: 'Documents', size: 2.4, by: 'Alice Johnson', date: '2026-06-10' },
  { id: 'f2', name: 'Logo.png', type: 'Images', size: 0.8, by: 'Bob Smith', date: '2026-06-12' },
  { id: 'f3', name: 'Budget.xlsx', type: 'Spreadsheets', size: 1.2, by: 'Carol White', date: '2026-06-14' },
  { id: 'f4', name: 'Mockups.png', type: 'Images', size: 5.6, by: 'David Brown', date: '2026-06-15' },
  { id: 'f5', name: 'Notes.docx', type: 'Documents', size: 0.3, by: 'Eva Green', date: '2026-06-18' },
];

const EVENTS = [
  { date: '2026-06-26', name: 'Sprint Planning', type: 'Meeting' },
  { date: '2026-06-28', name: 'Roadmap Deadline', type: 'Deadline' },
  { date: '2026-07-01', name: 'Design Review', type: 'Meeting' },
  { date: '2026-07-03', name: 'Team Happy Hour', type: 'Social' },
];

const EVENT_TONE: Record<string, string> = {
  Meeting: 'info',
  Deadline: 'warning',
  Social: 'success',
};

const ROLE_OPTIONS = [
  { id: 'Developer', label: 'Developer' },
  { id: 'Designer', label: 'Designer' },
  { id: 'Manager', label: 'Manager' },
  { id: 'QA', label: 'QA' },
];

const ROLE_FILTER_OPTIONS = [
  { id: 'all', label: 'All Roles' },
  { id: 'Developer', label: 'Developer' },
  { id: 'Designer', label: 'Designer' },
  { id: 'Manager', label: 'Manager' },
];

const FILE_FILTER_OPTIONS = [
  { id: 'All', label: 'All' },
  { id: 'Documents', label: 'Documents' },
  { id: 'Images', label: 'Images' },
  { id: 'Spreadsheets', label: 'Spreadsheets' },
];

const NAV_ITEMS = ['Dashboard', 'Members', 'Projects', 'Calendar', 'Files', 'Settings'];

/* ------------------------------------------------------------------ */
/* Main application                                                    */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  // shell
  const [page, setPage] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [teamName, setTeamName] = useState('TeamHub');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // members
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [memberView, setMemberView] = useState<'table' | 'cards'>('table');
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Developer', start: '', bio: '' });
  const [removeId, setRemoveId] = useState<string | null>(null);

  // projects
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', lead: '', deadline: '' });

  // files
  const [files, setFiles] = useState<FileItem[]>(SEED_FILES);
  const [fileSearch, setFileSearch] = useState('');
  const [fileFilter, setFileFilter] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({ count: 0, description: '', category: 'Documents' });

  // settings
  const [settingsTab, setSettingsTab] = useState<'general' | 'notifications' | 'integrations'>('general');
  const [teamDescription, setTeamDescription] = useState('A cross-functional product team.');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [notifications, setNotifications] = useState({
    newMember: true,
    deadline: true,
    weekly: false,
    mention: true,
    calendar: true,
  });
  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', connected: true, desc: 'Send team notifications to your Slack channels.' },
    { id: 'github', name: 'GitHub', connected: false, desc: 'Sync repositories, commits and pull requests.' },
    { id: 'jira', name: 'Jira', connected: false, desc: 'Link issues and track project progress.' },
  ]);
  const [disconnectId, setDisconnectId] = useState<string | null>(null);

  /* ---- derived ---- */
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
      (roleFilter === 'all' || m.role === roleFilter)
  );
  const selectedMember = members.find((m) => m.id === selectedMemberId) || null;
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );
  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(fileSearch.toLowerCase()) &&
      (fileFilter === 'All' || f.type === fileFilter)
  );

  /* ---- member handlers ---- */
  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', email: '', role: 'Developer', start: '', bio: '' });
    setFormOpen(true);
  };
  const openEdit = (m: Member) => {
    setEditingId(m.id);
    setForm({ name: m.name, email: m.email, role: m.role, start: m.joined, bio: m.bio });
    setFormOpen(true);
  };
  const submitMember = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? { ...m, name: form.name, email: form.email, role: form.role, joined: form.start || m.joined, bio: form.bio }
            : m
        )
      );
    } else {
      setMembers((prev) => [
        ...prev,
        {
          id: 'm' + Date.now(),
          name: form.name,
          email: form.email,
          role: form.role,
          status: 'Active',
          joined: form.start || today,
          bio: form.bio,
        },
      ]);
    }
    setFormOpen(false);
  };
  const confirmRemove = () => {
    if (removeId) {
      setMembers((prev) => prev.filter((m) => m.id !== removeId));
      if (selectedMemberId === removeId) setSelectedMemberId(null);
    }
    setRemoveId(null);
  };

  /* ---- project handlers ---- */
  const toggleProject = (id: string) =>
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  const archiveSelected = () => {
    setProjects((prev) => prev.filter((p) => !selectedProjects.includes(p.id)));
    setSelectedProjects([]);
  };
  const submitProject = () => {
    if (!projectForm.name.trim()) return;
    setProjects((prev) => [
      ...prev,
      {
        id: 'p' + Date.now(),
        name: projectForm.name,
        lead: projectForm.lead || 'Unassigned',
        members: 1,
        deadline: projectForm.deadline || new Date().toISOString().slice(0, 10),
        progress: 0,
        status: 'Active',
      },
    ]);
    setProjectFormOpen(false);
    setProjectForm({ name: '', lead: '', deadline: '' });
  };

  /* ---- file handlers ---- */
  const submitUpload = () => {
    if (uploadForm.count < 1) return;
    const today = new Date().toISOString().slice(0, 10);
    const ext =
      uploadForm.category === 'Images' ? 'png' : uploadForm.category === 'Spreadsheets' ? 'xlsx' : 'pdf';
    const added: FileItem[] = Array.from({ length: uploadForm.count }, (_, i) => ({
      id: 'f' + Date.now() + '-' + i,
      name: `Upload-${i + 1}.${ext}`,
      type: uploadForm.category,
      size: Math.round((i + 1) * 0.5 * 10) / 10,
      by: 'John Doe',
      date: today,
    }));
    setFiles((prev) => [...prev, ...added]);
    setUploadOpen(false);
    setUploadForm({ count: 0, description: '', category: 'Documents' });
    showToast('Files uploaded successfully.');
  };

  /* ---------------------------------------------------------------- */
  /* Page renderers                                                    */
  /* ---------------------------------------------------------------- */

  const renderDashboard = () => (
    <Box css={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Headline level={2}>Team Overview</Headline>

      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        <Box css={{ ...cardCss }}>
          <Box css={{ fontSize: '13px', color: '#64748b' }}>Members</Box>
          <Box css={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>
            {members.length}
          </Box>
        </Box>
        <Box css={{ ...cardCss }}>
          <Box css={{ fontSize: '13px', color: '#64748b' }}>Active Projects</Box>
          <Box css={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>5</Box>
        </Box>
        <Box css={{ ...cardCss }}>
          <Box css={{ fontSize: '13px', color: '#64748b' }}>Upcoming Deadlines</Box>
          <Box css={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>8</Box>
        </Box>
        <WithTooltip block text="Aggregate of all team members.">
          <Box css={{ ...cardCss }}>
            <Box css={{ fontSize: '13px', color: '#64748b' }}>Hours This Week</Box>
            <Box css={{ fontSize: '28px', fontWeight: 700, marginTop: '8px' }}>
              {(342).toLocaleString()}
            </Box>
          </Box>
        </WithTooltip>
      </Box>

      <Box css={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Headline level={3}>Recent Activity</Headline>
        <Table aria-label="Recent activity">
          <Table.Header>
            <Table.Column>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {ACTIVITY.map((a, i) => (
              <Table.Row key={i}>
                <Table.Cell>{a.member}</Table.Cell>
                <Table.Cell>
                  <Indicator tone={ACTION_TONE[a.action]}>{a.action}</Indicator>
                </Table.Cell>
                <Table.Cell>{a.project}</Table.Cell>
                <Table.Cell>{fmtDate(a.date)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>

      <Banner>
        Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
      </Banner>
    </Box>
  );

  const renderMembers = () => (
    <Box css={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <Box css={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Headline level={2}>Team Members</Headline>

        <Box css={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <Box css={{ minWidth: '200px' }}>
            <SearchField
              label="Search"
              aria-label="Search members by name"
              value={memberSearch}
              onChange={setMemberSearch}
            />
          </Box>
          <Box css={{ minWidth: '160px' }}>
            <SelectField
              label="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={ROLE_FILTER_OPTIONS}
            />
          </Box>
          <Box css={{ display: 'flex', gap: '4px' }}>
            <Button
              variant={memberView === 'table' ? 'primary' : 'secondary'}
              onPress={() => setMemberView('table')}
            >
              Table
            </Button>
            <Button
              variant={memberView === 'cards' ? 'primary' : 'secondary'}
              onPress={() => setMemberView('cards')}
            >
              Cards
            </Button>
          </Box>
          <Box css={{ marginLeft: 'auto' }}>
            <Button variant="primary" onPress={openAdd}>
              Add Member
            </Button>
          </Box>
        </Box>

        {memberView === 'table' ? (
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
              {filteredMembers.map((m) => (
                <Table.Row key={m.id}>
                  <Table.Cell>
                    <Button variant="text" onPress={() => setSelectedMemberId(m.id)}>
                      {m.name}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{m.role}</Table.Cell>
                  <Table.Cell>{m.email}</Table.Cell>
                  <Table.Cell>
                    <Indicator tone={m.status === 'Active' ? 'success' : 'warning'}>
                      {m.status}
                    </Indicator>
                  </Table.Cell>
                  <Table.Cell>{fmtDate(m.joined)}</Table.Cell>
                  <Table.Cell>
                    <ActionMenu
                      actions={[
                        { key: 'edit', label: 'Edit' },
                        { key: 'remove', label: 'Remove' },
                      ]}
                      onAction={(k) => (k === 'edit' ? openEdit(m) : setRemoveId(m.id))}
                    />
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
            {filteredMembers.map((m) => (
              <Box key={m.id} css={{ ...cardCss }}>
                <Button variant="text" onPress={() => setSelectedMemberId(m.id)}>
                  {m.name}
                </Button>
                <Box css={{ marginTop: '6px' }}>
                  <Indicator tone="neutral">{m.role}</Indicator>
                </Box>
                <Box css={{ marginTop: '8px', color: '#64748b', fontSize: '13px' }}>
                  {m.email}
                </Box>
                <Box css={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    onPress={() => showToast(`Message sent to ${m.name}.`)}
                  >
                    Message
                  </Button>
                  <Button variant="text" onPress={() => setSelectedMemberId(m.id)}>
                    Profile
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {selectedMember && (
        <Box css={{ width: '300px', flexShrink: 0, ...cardCss }}>
          <Box
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <Headline level={3}>{selectedMember.name}</Headline>
            <Button variant="text" onPress={() => setSelectedMemberId(null)}>
              Close
            </Button>
          </Box>
          <Box css={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Indicator tone="neutral">{selectedMember.role}</Indicator>
            <Box>
              <Box css={{ fontSize: '12px', color: '#64748b' }}>Email</Box>
              <Text>{selectedMember.email}</Text>
            </Box>
            <Box>
              <Box css={{ fontSize: '12px', color: '#64748b' }}>Status</Box>
              <Indicator tone={selectedMember.status === 'Active' ? 'success' : 'warning'}>
                {selectedMember.status}
              </Indicator>
            </Box>
            <Box>
              <Box css={{ fontSize: '12px', color: '#64748b' }}>Joined</Box>
              <Text>{fmtDate(selectedMember.joined)}</Text>
            </Box>
            <Box>
              <Box css={{ fontSize: '12px', color: '#64748b' }}>Bio</Box>
              <Text>{selectedMember.bio}</Text>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  const renderProjects = () => (
    <Box css={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Headline level={2}>Projects</Headline>

      <Box css={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
        <Box css={{ minWidth: '220px' }}>
          <SearchField
            label="Search"
            aria-label="Search projects by name"
            value={projectSearch}
            onChange={setProjectSearch}
          />
        </Box>
        <Box css={{ marginLeft: 'auto' }}>
          <Button variant="primary" onPress={() => setProjectFormOpen(true)}>
            New Project
          </Button>
        </Box>
      </Box>

      {selectedProjects.length > 0 && (
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: '8px',
            padding: '10px 14px',
          }}
        >
          <Box css={{ fontWeight: 600 }}>{selectedProjects.length} selected</Box>
          <Button variant="primary" onPress={archiveSelected}>
            Archive Selected
          </Button>
          <Button
            variant="secondary"
            onPress={() => showToast(`Exported ${selectedProjects.length} project(s).`)}
          >
            Export
          </Button>
        </Box>
      )}

      <Table aria-label="Projects">
        <Table.Header>
          <Table.Column>Select</Table.Column>
          <Table.Column>Project</Table.Column>
          <Table.Column>Lead</Table.Column>
          <Table.Column>Members</Table.Column>
          <Table.Column>Deadline</Table.Column>
          <Table.Column>Progress</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {filteredProjects.map((p) => (
            <Table.Row key={p.id}>
              <Table.Cell>
                <Switch
                  aria-label={`Select ${p.name}`}
                  isSelected={selectedProjects.includes(p.id)}
                  onChange={() => toggleProject(p.id)}
                />
              </Table.Cell>
              <Table.Cell>{p.name}</Table.Cell>
              <Table.Cell>{p.lead}</Table.Cell>
              <Table.Cell>{p.members.toLocaleString()}</Table.Cell>
              <Table.Cell>{fmtDate(p.deadline)}</Table.Cell>
              <Table.Cell>{p.progress}%</Table.Cell>
              <Table.Cell>
                <Indicator tone={PROJECT_TONE[p.status]}>{p.status}</Indicator>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );

  const renderCalendar = () => (
    <Box css={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Headline level={2}>Team Calendar</Headline>
      <MonthCalendar />
      <Box css={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Headline level={3}>Upcoming Events</Headline>
        <Box css={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {EVENTS.map((e, i) => (
            <Box
              key={i}
              css={{
                ...cardCss,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <Box css={{ width: '120px', color: '#64748b', fontSize: '13px' }}>
                {fmtDate(e.date)}
              </Box>
              <Box css={{ flex: '1 1 0', fontWeight: 600 }}>{e.name}</Box>
              <Indicator tone={EVENT_TONE[e.type]}>{e.type}</Indicator>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderFiles = () => (
    <Box css={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Headline level={2}>Shared Files</Headline>

      <Box css={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
        <Box css={{ minWidth: '200px' }}>
          <SearchField
            label="Search"
            aria-label="Search files by name"
            value={fileSearch}
            onChange={setFileSearch}
          />
        </Box>
        <Box css={{ minWidth: '160px' }}>
          <SelectField
            label="Type"
            value={fileFilter}
            onChange={setFileFilter}
            options={FILE_FILTER_OPTIONS}
          />
        </Box>
        <Box css={{ marginLeft: 'auto' }}>
          <Button variant="primary" onPress={() => setUploadOpen(true)}>
            Upload
          </Button>
        </Box>
      </Box>

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
          {filteredFiles.map((f) => (
            <Table.Row key={f.id}>
              <Table.Cell>{f.name}</Table.Cell>
              <Table.Cell>{f.type}</Table.Cell>
              <Table.Cell>
                {f.size.toLocaleString(undefined, { minimumFractionDigits: 1 })} MB
              </Table.Cell>
              <Table.Cell>{f.by}</Table.Cell>
              <Table.Cell>{fmtDate(f.date)}</Table.Cell>
              <Table.Cell>
                <ActionMenu
                  actions={[
                    { key: 'download', label: 'Download' },
                    { key: 'rename', label: 'Rename' },
                    { key: 'delete', label: 'Delete' },
                  ]}
                  onAction={(k) => {
                    if (k === 'delete') {
                      setFiles((prev) => prev.filter((x) => x.id !== f.id));
                    } else if (k === 'download') {
                      showToast(`Downloading ${f.name}…`);
                    } else {
                      showToast(`Rename ${f.name}.`);
                    }
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Box>
  );

  const renderSettings = () => (
    <Box css={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Headline level={2}>Team Settings</Headline>

      <Box css={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0' }}>
        {(['general', 'notifications', 'integrations'] as const).map((t) => (
          <Box
            key={t}
            css={{
              borderBottom: settingsTab === t ? '2px solid #4f46e5' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            <Button variant="text" onPress={() => setSettingsTab(t)}>
              {t === 'general' ? 'General' : t === 'notifications' ? 'Notifications' : 'Integrations'}
            </Button>
          </Box>
        ))}
      </Box>

      {settingsTab === 'general' && (
        <Box css={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px' }}>
          <TextField label="Team Name" value={teamName} onChange={setTeamName} />
          <TextArea label="Description" value={teamDescription} onChange={setTeamDescription} />
          <SelectField
            label="Default Timezone"
            value={timezone}
            onChange={setTimezone}
            options={[
              { id: 'UTC', label: 'UTC' },
              { id: 'CET', label: 'CET' },
              { id: 'EST', label: 'EST' },
              { id: 'PST', label: 'PST' },
            ]}
          />
          <SelectField
            label="Date Format"
            value={dateFormat}
            onChange={setDateFormat}
            options={[
              { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { id: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
              { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
          />
          <Box>
            <Button variant="primary" onPress={() => showToast('Settings updated.')}>
              Save
            </Button>
          </Box>
        </Box>
      )}

      {settingsTab === 'notifications' && (
        <Box css={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '560px' }}>
          {[
            { key: 'newMember', title: 'New member joins', desc: 'Get notified when someone joins the team' },
            { key: 'deadline', title: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
            { key: 'weekly', title: 'Weekly digest', desc: 'Summary of team activity every Monday' },
            { key: 'mention', title: 'Mention notifications', desc: 'When someone mentions you in a comment' },
            { key: 'calendar', title: 'Calendar reminders', desc: '15 minutes before scheduled events' },
          ].map((n) => (
            <Box
              key={n.key}
              css={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}
            >
              <Box>
                <Box css={{ fontWeight: 600 }}>{n.title}</Box>
                <Box css={{ color: '#64748b', fontSize: '13px' }}>{n.desc}</Box>
              </Box>
              <Switch
                aria-label={n.title}
                isSelected={(notifications as Record<string, boolean>)[n.key]}
                onChange={(v: boolean) => setNotifications((prev) => ({ ...prev, [n.key]: v }))}
              />
            </Box>
          ))}
          <Box>
            <Button variant="primary" onPress={() => showToast('Settings updated.')}>
              Save Preferences
            </Button>
          </Box>
        </Box>
      )}

      {settingsTab === 'integrations' && (
        <Box
          css={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {integrations.map((it) => (
            <Box key={it.id} css={{ ...cardCss, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Headline level={3}>{it.name}</Headline>
              <Indicator tone={it.connected ? 'success' : 'neutral'}>
                {it.connected ? 'Connected' : 'Not connected'}
              </Indicator>
              <Box css={{ color: '#64748b', fontSize: '13px' }}>{it.desc}</Box>
              <Box>
                {it.connected ? (
                  <Button variant="secondary" onPress={() => setDisconnectId(it.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onPress={() =>
                      setIntegrations((prev) =>
                        prev.map((x) => (x.id === it.id ? { ...x, connected: true } : x))
                      )
                    }
                  >
                    Connect
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderPage = () => {
    switch (page) {
      case 'Members':
        return renderMembers();
      case 'Projects':
        return renderProjects();
      case 'Calendar':
        return renderCalendar();
      case 'Files':
        return renderFiles();
      case 'Settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const disconnectTarget = integrations.find((i) => i.id === disconnectId);

  /* ---------------------------------------------------------------- */
  /* Shell                                                             */
  /* ---------------------------------------------------------------- */

  return (
    <Box css={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8fafc' }}>
      <Box css={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
        {/* Sidebar */}
        <Box
          css={{
            width: sidebarCollapsed ? '64px' : '220px',
            flexShrink: 0,
            borderRight: '1px solid #e2e8f0',
            backgroundColor: 'white',
            overflowY: 'auto',
            padding: '16px 8px',
            transition: 'width 0.15s ease',
          }}
        >
          <Box
            css={{
              fontWeight: 800,
              fontSize: '18px',
              padding: '0 8px 16px',
              color: '#4f46e5',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {sidebarCollapsed ? teamName.charAt(0) : teamName}
          </Box>

          {NAV_ITEMS.slice(0, 5).map((item) => (
            <Box
              key={item}
              css={{
                borderRadius: '8px',
                marginBottom: '4px',
                backgroundColor: page === item ? '#e0e7ff' : 'transparent',
              }}
            >
              <Button variant="text" onPress={() => setPage(item)}>
                {sidebarCollapsed ? item.charAt(0) : item}
              </Button>
            </Box>
          ))}

          <Box css={{ height: '1px', backgroundColor: '#e2e8f0', margin: '8px 8px' }} />

          <Box
            css={{
              borderRadius: '8px',
              backgroundColor: page === 'Settings' ? '#e0e7ff' : 'transparent',
            }}
          >
            <Button variant="text" onPress={() => setPage('Settings')}>
              {sidebarCollapsed ? 'S' : 'Settings'}
            </Button>
          </Box>
        </Box>

        {/* Right column */}
        <Box css={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0 }}>
          {/* Top navigation */}
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 20px',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: 'white',
            }}
          >
            <Button variant="text" onPress={() => setSidebarCollapsed((c) => !c)}>
              {sidebarCollapsed ? '☰ Expand' : '☰ Collapse'}
            </Button>

            <Box css={{ flex: '1 1 0', display: 'flex', justifyContent: 'center', gap: '6px', color: '#64748b' }}>
              <Text>{teamName}</Text>
              <Text>{'>'}</Text>
              <Box css={{ fontWeight: 600, color: '#1e293b' }}>{page}</Box>
            </Box>

            <Box css={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Account menu with tooltip */}
              <Box css={{ position: 'relative' }}>
                <WithTooltip text="Account settings">
                  <Button variant="secondary" onPress={() => setAccountOpen((o) => !o)}>
                    John Doe
                  </Button>
                </WithTooltip>
                {accountOpen && (
                  <>
                    <Box
                      css={{ position: 'fixed', inset: 0, zIndex: 99 }}
                      onClick={() => setAccountOpen(false)}
                    />
                    <Box
                      css={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        minWidth: '170px',
                        padding: '4px',
                      }}
                    >
                      {['Profile', 'Preferences', 'Sign Out'].map((opt) => (
                        <Box key={opt} css={{ display: 'block' }}>
                          <Button
                            variant="text"
                            onPress={() => {
                              setAccountOpen(false);
                              showToast(opt);
                            }}
                          >
                            {opt}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Box>

              {/* Help popover */}
              <Box css={{ position: 'relative' }}>
                <Button variant="text" onPress={() => setHelpOpen((o) => !o)}>
                  Help
                </Button>
                {helpOpen && (
                  <>
                    <Box
                      css={{ position: 'fixed', inset: 0, zIndex: 99 }}
                      onClick={() => setHelpOpen(false)}
                    />
                    <Box
                      css={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '4px',
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        width: '240px',
                        padding: '12px',
                      }}
                    >
                      <Text>Use the sidebar to navigate between sections.</Text>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          {/* Main scrollable content */}
          <Box css={{ flex: '1 1 0', overflowY: 'auto', padding: '24px' }}>{renderPage()}</Box>
        </Box>
      </Box>

      {/* Member add / edit dialog */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? 'Edit Member' : 'Add Member'}
        footer={
          <>
            <Button variant="secondary" onPress={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={submitMember}
              isDisabled={!form.name.trim() || !form.email.trim()}
            >
              {editingId ? 'Save' : 'Add'}
            </Button>
          </>
        }
      >
        <TextField
          label="Full Name"
          isRequired
          value={form.name}
          onChange={(v: string) => setForm((f) => ({ ...f, name: v }))}
        />
        <TextField
          label="Email"
          isRequired
          value={form.email}
          onChange={(v: string) => setForm((f) => ({ ...f, email: v }))}
        />
        <SelectField
          label="Role"
          value={form.role}
          onChange={(v) => setForm((f) => ({ ...f, role: v }))}
          options={ROLE_OPTIONS}
        />
        <TextField
          label="Start Date"
          value={form.start}
          onChange={(v: string) => setForm((f) => ({ ...f, start: v }))}
        />
        <TextArea
          label="Bio"
          value={form.bio}
          onChange={(v: string) => setForm((f) => ({ ...f, bio: v }))}
        />
      </Modal>

      {/* Remove member confirmation */}
      <Modal
        open={removeId !== null}
        onClose={() => setRemoveId(null)}
        title="Remove Member"
        width={400}
        footer={
          <>
            <Button variant="secondary" onPress={() => setRemoveId(null)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={confirmRemove}>
              Remove
            </Button>
          </>
        }
      >
        <Text>Are you sure you want to remove this member? This cannot be undone.</Text>
      </Modal>

      {/* New project dialog */}
      <Modal
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        title="New Project"
        footer={
          <>
            <Button variant="secondary" onPress={() => setProjectFormOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={submitProject}
              isDisabled={!projectForm.name.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        <TextField
          label="Project Name"
          isRequired
          value={projectForm.name}
          onChange={(v: string) => setProjectForm((f) => ({ ...f, name: v }))}
        />
        <TextField
          label="Lead"
          value={projectForm.lead}
          onChange={(v: string) => setProjectForm((f) => ({ ...f, lead: v }))}
        />
        <TextField
          label="Deadline"
          value={projectForm.deadline}
          onChange={(v: string) => setProjectForm((f) => ({ ...f, deadline: v }))}
        />
      </Modal>

      {/* Upload dialog */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Files"
        footer={
          <>
            <Button variant="secondary" onPress={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={submitUpload} isDisabled={uploadForm.count < 1}>
              Upload
            </Button>
          </>
        }
      >
        <Box css={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Box css={{ fontSize: '13px', fontWeight: 600 }}>Files (multiple allowed)</Box>
          <Box css={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
              variant="secondary"
              onPress={() => setUploadForm((f) => ({ ...f, count: f.count + 1 }))}
            >
              Choose Files
            </Button>
            <Text>{uploadForm.count} file(s) selected</Text>
          </Box>
        </Box>
        <TextArea
          label="Description"
          value={uploadForm.description}
          onChange={(v: string) => setUploadForm((f) => ({ ...f, description: v }))}
        />
        <SelectField
          label="Category"
          value={uploadForm.category}
          onChange={(v) => setUploadForm((f) => ({ ...f, category: v }))}
          options={[
            { id: 'Documents', label: 'Documents' },
            { id: 'Images', label: 'Images' },
            { id: 'Spreadsheets', label: 'Spreadsheets' },
          ]}
        />
      </Modal>

      {/* Disconnect confirmation */}
      <Modal
        open={disconnectId !== null}
        onClose={() => setDisconnectId(null)}
        title="Disconnect Integration"
        width={400}
        footer={
          <>
            <Button variant="secondary" onPress={() => setDisconnectId(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onPress={() => {
                setIntegrations((prev) =>
                  prev.map((x) => (x.id === disconnectId ? { ...x, connected: false } : x))
                );
                setDisconnectId(null);
              }}
            >
              Disconnect
            </Button>
          </>
        }
      >
        <Text>
          Are you sure you want to disconnect {disconnectTarget ? disconnectTarget.name : 'this integration'}?
        </Text>
      </Modal>

      <Toast message={toast} />
    </Box>
  );
};

export default TestApp;
