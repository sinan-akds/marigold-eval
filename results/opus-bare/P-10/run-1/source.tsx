import type * as React from 'react';
import { useState, useEffect, useRef } from 'react';
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
  Switch,
  Table,
  Dialog,
  Calendar,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Helpers / primitives                                               */
/* ------------------------------------------------------------------ */

type Tone = 'info' | 'warning' | 'success' | 'neutral' | 'danger';

const TONES: Record<Tone, { bg: string; fg: string; border: string }> = {
  info: { bg: '#e0f2fe', fg: '#075985', border: '#bae6fd' },
  warning: { bg: '#fef3c7', fg: '#92400e', border: '#fde68a' },
  success: { bg: '#dcfce7', fg: '#166534', border: '#bbf7d0' },
  neutral: { bg: '#e5e7eb', fg: '#374151', border: '#d1d5db' },
  danger: { bg: '#fee2e2', fg: '#991b1b', border: '#fecaca' },
};

const Indicator = ({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) => (
  <Box
    css={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.6,
      backgroundColor: TONES[tone].bg,
      color: TONES[tone].fg,
      border: `1px solid ${TONES[tone].border}`,
    }}
  >
    {children}
  </Box>
);

const Surface = ({
  children,
  css,
  onClick,
}: {
  children: React.ReactNode;
  css?: Record<string, unknown>;
  onClick?: () => void;
}) => (
  <Box
    onClick={onClick}
    css={{
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      ...(css || {}),
    }}
  >
    {children}
  </Box>
);

const Grid = ({
  min = '240px',
  gap = '16px',
  children,
}: {
  min?: string;
  gap?: string;
  children: React.ReactNode;
}) => (
  <Box
    css={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${min}, 1fr))`,
      gap,
    }}
  >
    {children}
  </Box>
);

const Spread = ({
  children,
  align = 'center',
}: {
  children: React.ReactNode;
  align?: string;
}) => (
  <Box
    css={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: align,
      gap: '16px',
      flexWrap: 'wrap',
    }}
  >
    {children}
  </Box>
);

const Line = () => <Box css={{ height: '1px', backgroundColor: '#e5e7eb', width: '100%' }} />;

const Muted = ({ children }: { children: React.ReactNode }) => (
  <Box css={{ color: '#6b7280', fontSize: '0.875rem' }}>{children}</Box>
);

const Strong = ({ children }: { children: React.ReactNode }) => (
  <Box css={{ fontWeight: 600 }}>{children}</Box>
);

/* Custom hover tooltip (built only from Box so it always renders) */
const InfoTip = ({ label, children }: { label: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <Box
      css={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <Box
          css={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#111827',
            color: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            fontSize: '0.75rem',
            zIndex: 3000,
            pointerEvents: 'none',
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
};

/* Custom dropdown / menu / popover (built from Box + Button) */
const Dropdown = ({
  label,
  variant = 'secondary',
  align = 'left',
  tip,
  fullWidth = false,
  triggerCss,
  children,
}: {
  label: React.ReactNode;
  variant?: string;
  align?: 'left' | 'right';
  tip?: string;
  fullWidth?: boolean;
  triggerCss?: Record<string, unknown>;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  let trigger = (
    <Button
      variant={variant}
      onPress={() => setOpen((o) => !o)}
      css={{
        ...(fullWidth ? { width: '100%', justifyContent: 'space-between' } : {}),
        ...(triggerCss || {}),
      }}
    >
      {label}
    </Button>
  );
  if (tip) trigger = <InfoTip label={tip}>{trigger}</InfoTip>;

  return (
    <Box css={{ position: 'relative', display: fullWidth ? 'block' : 'inline-block' }}>
      {trigger}
      {open && (
        <>
          <Box onClick={close} css={{ position: 'fixed', inset: 0, zIndex: 1500 }} />
          <Box
            css={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              [align === 'right' ? 'right' : 'left']: 0,
              zIndex: 1600,
              minWidth: '210px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
              padding: '6px',
            }}
          >
            {typeof children === 'function' ? children(close) : children}
          </Box>
        </>
      )}
    </Box>
  );
};

const DropdownItem = ({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) => (
  <Button
    variant="text"
    onPress={onPress}
    css={{ width: '100%', justifyContent: 'flex-start' }}
  >
    {children}
  </Button>
);

/* Custom select (built from the dropdown) */
const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <Stack space={1}>
    {label ? <Strong>{label}</Strong> : null}
    <Dropdown label={value || 'Select…'} variant="secondary" fullWidth>
      {(close) => (
        <Stack space={0}>
          {options.map((o) => (
            <DropdownItem
              key={o}
              onPress={() => {
                onChange(o);
                close();
              }}
            >
              {o}
            </DropdownItem>
          ))}
        </Stack>
      )}
    </Dropdown>
  </Stack>
);

/* Controlled dialog wrapper — children is a render fn receiving close() */
const DialogButton = ({
  trigger,
  title,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  children: (close: () => void) => React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Trigger isOpen={open} onOpenChange={setOpen}>
      {trigger}
      <Dialog aria-label={title}>
        <Box css={{ minWidth: '440px', maxWidth: '92vw' }}>{children(() => setOpen(false))}</Box>
      </Dialog>
    </Dialog.Trigger>
  );
};

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                 */
/* ------------------------------------------------------------------ */

const fmtDate = (d: Date) =>
  d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

const fmtNumber = (n: number) => n.toLocaleString();

const toInputDate = (d: Date) => {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

/* ------------------------------------------------------------------ */
/* Domain data                                                        */
/* ------------------------------------------------------------------ */

type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joined: Date;
  bio: string;
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

type FileItem = {
  id: string;
  name: string;
  type: 'Documents' | 'Images' | 'Spreadsheets';
  size: number; // MB
  uploadedBy: string;
  date: Date;
};

const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'Alice Johnson', role: 'Developer', email: 'alice@teamhub.io', status: 'Active', joined: new Date('2023-02-14'), bio: 'Full-stack engineer focused on the design system.' },
  { id: 'm2', name: 'Bob Smith', role: 'Designer', email: 'bob@teamhub.io', status: 'Active', joined: new Date('2022-11-03'), bio: 'Product designer with a love for accessible UI.' },
  { id: 'm3', name: 'Carla Mendes', role: 'Manager', email: 'carla@teamhub.io', status: 'On Leave', joined: new Date('2021-06-21'), bio: 'Engineering manager for the platform team.' },
  { id: 'm4', name: 'David Lee', role: 'Developer', email: 'david@teamhub.io', status: 'Active', joined: new Date('2023-09-01'), bio: 'Backend developer, infrastructure enthusiast.' },
  { id: 'm5', name: 'Emma Wilson', role: 'Designer', email: 'emma@teamhub.io', status: 'Active', joined: new Date('2024-01-15'), bio: 'UX researcher and interaction designer.' },
  { id: 'm6', name: 'Frank Müller', role: 'QA', email: 'frank@teamhub.io', status: 'On Leave', joined: new Date('2022-04-12'), bio: 'Quality engineer keeping the bugs away.' },
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Marigold Migration', lead: 'Alice Johnson', members: 5, deadline: new Date('2026-07-15'), progress: 75, status: 'Active' },
  { id: 'p2', name: 'Mobile Redesign', lead: 'Bob Smith', members: 4, deadline: new Date('2026-08-02'), progress: 40, status: 'Active' },
  { id: 'p3', name: 'Billing Overhaul', lead: 'Carla Mendes', members: 3, deadline: new Date('2026-06-30'), progress: 90, status: 'On Hold' },
  { id: 'p4', name: 'Analytics Pipeline', lead: 'David Lee', members: 6, deadline: new Date('2026-09-10'), progress: 20, status: 'Active' },
  { id: 'p5', name: 'Onboarding Flow', lead: 'Emma Wilson', members: 2, deadline: new Date('2026-05-20'), progress: 100, status: 'Completed' },
];

const INITIAL_FILES: FileItem[] = [
  { id: 'f1', name: 'Roadmap.pdf', type: 'Documents', size: 2.4, uploadedBy: 'Alice Johnson', date: new Date('2026-05-28') },
  { id: 'f2', name: 'Logo.png', type: 'Images', size: 0.8, uploadedBy: 'Bob Smith', date: new Date('2026-06-01') },
  { id: 'f3', name: 'Budget.xlsx', type: 'Spreadsheets', size: 1.2, uploadedBy: 'Carla Mendes', date: new Date('2026-06-05') },
  { id: 'f4', name: 'Designs.png', type: 'Images', size: 5.6, uploadedBy: 'Emma Wilson', date: new Date('2026-06-10') },
  { id: 'f5', name: 'Spec.docx', type: 'Documents', size: 0.5, uploadedBy: 'David Lee', date: new Date('2026-06-18') },
];

const RECENT_ACTIVITY: { member: string; action: 'Commit' | 'Review' | 'Deploy'; project: string; date: Date }[] = [
  { member: 'Alice Johnson', action: 'Commit', project: 'Marigold Migration', date: new Date('2026-05-28') },
  { member: 'David Lee', action: 'Deploy', project: 'Analytics Pipeline', date: new Date('2026-06-02') },
  { member: 'Bob Smith', action: 'Review', project: 'Mobile Redesign', date: new Date('2026-06-05') },
  { member: 'Emma Wilson', action: 'Commit', project: 'Onboarding Flow', date: new Date('2026-06-09') },
  { member: 'Carla Mendes', action: 'Review', project: 'Billing Overhaul', date: new Date('2026-06-12') },
];

const UPCOMING_EVENTS: { date: Date; name: string; type: 'Meeting' | 'Deadline' | 'Social' }[] = [
  { date: new Date('2026-06-26'), name: 'Sprint Planning', type: 'Meeting' },
  { date: new Date('2026-06-30'), name: 'Billing Overhaul Due', type: 'Deadline' },
  { date: new Date('2026-07-03'), name: 'Team Lunch', type: 'Social' },
  { date: new Date('2026-07-08'), name: 'Design Review', type: 'Meeting' },
];

const ROLE_OPTIONS = ['Developer', 'Designer', 'Manager', 'QA'];
const ROLE_FILTER_OPTIONS = ['All Roles', 'Developer', 'Designer', 'Manager'];

const ROLE_TONE: Record<string, Tone> = {
  Developer: 'info',
  Designer: 'success',
  Manager: 'warning',
  QA: 'neutral',
};
const STATUS_TONE: Record<string, Tone> = { Active: 'success', 'On Leave': 'warning' };
const PROJECT_TONE: Record<string, Tone> = { Active: 'success', 'On Hold': 'warning', Completed: 'info' };
const ACTION_TONE: Record<string, Tone> = { Commit: 'info', Review: 'warning', Deploy: 'success' };
const EVENT_TONE: Record<string, Tone> = { Meeting: 'info', Deadline: 'warning', Social: 'success' };

const NAV_ITEMS = ['Dashboard', 'Members', 'Projects', 'Calendar', 'Files', 'Settings'];

/* ------------------------------------------------------------------ */
/* Member form (shared by add + edit)                                 */
/* ------------------------------------------------------------------ */

function MemberForm({
  member,
  onSave,
  onClose,
}: {
  member: Member | null;
  onSave: (data: Omit<Member, 'id'> & { id?: string }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(member?.name ?? '');
  const [email, setEmail] = useState(member?.email ?? '');
  const [role, setRole] = useState(member?.role ?? 'Developer');
  const [startDate, setStartDate] = useState(member ? toInputDate(member.joined) : '');
  const [bio, setBio] = useState(member?.bio ?? '');
  const [submitted, setSubmitted] = useState(false);

  const nameInvalid = submitted && !name.trim();
  const emailInvalid = submitted && !email.trim();

  const submit = () => {
    setSubmitted(true);
    if (!name.trim() || !email.trim()) return;
    const joined = startDate ? new Date(startDate) : new Date();
    onSave({
      id: member?.id,
      name: name.trim(),
      email: email.trim(),
      role,
      bio,
      joined,
      status: member?.status ?? 'Active',
    });
    onClose();
  };

  return (
    <Stack space={4}>
      <Headline level="2">{member ? 'Edit Member' : 'Add Member'}</Headline>
      <TextField
        label="Full Name"
        value={name}
        onChange={setName}
        isRequired
        error={nameInvalid}
        errorMessage="Full name is required"
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        isRequired
        error={emailInvalid}
        errorMessage="Email is required"
      />
      <SelectField label="Role" value={role} options={ROLE_OPTIONS} onChange={setRole} />
      <TextField label="Start Date" type="date" value={startDate} onChange={setStartDate} />
      <TextArea label="Bio" value={bio} onChange={setBio} />
      <Spread>
        <Box />
        <Inline space={2}>
          <Button variant="text" onPress={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onPress={submit}>
            {member ? 'Save' : 'Add'}
          </Button>
        </Inline>
      </Spread>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* Main application                                                   */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const idRef = useRef(1000);
  const newId = (prefix: string) => `${prefix}${++idRef.current}`;

  /* shell */
  const [page, setPage] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);

  /* members */
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  /* projects */
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<Set<string> | 'all'>(new Set());

  /* files */
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [fileSearch, setFileSearch] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('All');

  /* settings */
  const [teamName, setTeamName] = useState('TeamHub');
  const [teamDesc, setTeamDesc] = useState('The home for our amazing team.');
  const [timezone, setTimezone] = useState('CET');
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');
  const [notifications, setNotifications] = useState({
    newMember: true,
    deadline: true,
    digest: false,
    mention: true,
    calendar: false,
  });
  const [integrations, setIntegrations] = useState({
    Slack: true,
    GitHub: false,
    Jira: false,
  });
  const [settingsTab, setSettingsTab] = useState('General');

  /* toast */
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);
  const showToast = (msg: string) => setToast(msg);

  /* member operations */
  const addMember = (data: Omit<Member, 'id'> & { id?: string }) => {
    if (data.id) {
      setMembers((ms) => ms.map((m) => (m.id === data.id ? ({ ...m, ...data } as Member) : m)));
    } else {
      setMembers((ms) => [...ms, { ...(data as Member), id: newId('m') }]);
    }
  };
  const removeMember = (id: string) => {
    setMembers((ms) => ms.filter((m) => m.id !== id));
    setSelectedMemberId((cur) => (cur === id ? null : cur));
  };

  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null;

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
      (roleFilter === 'All Roles' || m.role === roleFilter)
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.lead.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(fileSearch.toLowerCase()) &&
      (fileTypeFilter === 'All' || f.type === fileTypeFilter)
  );

  const selectedProjectCount =
    selectedProjects === 'all' ? filteredProjects.length : selectedProjects.size;

  const archiveSelected = () => {
    setProjects((ps) =>
      selectedProjects === 'all'
        ? ps.filter((p) => !filteredProjects.some((fp) => fp.id === p.id))
        : ps.filter((p) => !(selectedProjects as Set<string>).has(p.id))
    );
    setSelectedProjects(new Set());
  };

  /* ---------------------------------------------------------------- */
  /* Sidebar                                                          */
  /* ---------------------------------------------------------------- */

  const NavButton = ({ label }: { label: string }) => {
    const active = page === label;
    return (
      <Button
        variant={active ? 'primary' : 'text'}
        onPress={() => setPage(label)}
        css={{
          width: '100%',
          justifyContent: 'flex-start',
          ...(active ? {} : { color: '#374151' }),
        }}
      >
        {collapsed ? label.charAt(0) : label}
      </Button>
    );
  };

  const sidebar = (
    <Box
      css={{
        width: collapsed ? '68px' : '232px',
        flexShrink: 0,
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        height: '100%',
        padding: '16px 12px',
        boxSizing: 'border-box',
        transition: 'width 0.15s ease',
      }}
    >
      <Stack space={4}>
        <Box css={{ padding: '8px 8px', fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
          {collapsed ? 'TH' : teamName}
        </Box>
        <Stack space={1}>
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <NavButton key={item} label={item} />
          ))}
          <Box css={{ height: '1px', backgroundColor: '#334155', margin: '8px 4px' }} />
          <NavButton label="Settings" />
        </Stack>
      </Stack>
    </Box>
  );

  /* ---------------------------------------------------------------- */
  /* Top navigation                                                   */
  /* ---------------------------------------------------------------- */

  const topNav = (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '12px 20px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0,
      }}
    >
      <Inline space={3} alignY="center">
        <Button variant="text" onPress={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
          ☰
        </Button>
      </Inline>

      <Box css={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Inline space={2} alignY="center">
          <Muted>{teamName}</Muted>
          <Muted>›</Muted>
          <Strong>{page}</Strong>
        </Inline>
      </Box>

      <Inline space={2} alignY="center">
        <Dropdown label="John Doe" align="right" tip="Account settings" variant="secondary">
          {(close) => (
            <Stack space={0}>
              <DropdownItem onPress={() => { showToast('Opening profile…'); close(); }}>
                Profile
              </DropdownItem>
              <DropdownItem onPress={() => { showToast('Opening preferences…'); close(); }}>
                Preferences
              </DropdownItem>
              <DropdownItem onPress={() => { showToast('Signed out'); close(); }}>
                Sign Out
              </DropdownItem>
            </Stack>
          )}
        </Dropdown>

        <Dropdown label="?" align="right" variant="text">
          <Box css={{ padding: '10px', maxWidth: '240px' }}>
            <Text>Use the sidebar to navigate between sections.</Text>
          </Box>
        </Dropdown>
      </Inline>
    </Box>
  );

  /* ---------------------------------------------------------------- */
  /* Dashboard page                                                   */
  /* ---------------------------------------------------------------- */

  const dashboard = (
    <Stack space={6}>
      <Headline level="1">Team Overview</Headline>

      <Grid min="200px">
        <Surface>
          <Stack space={2}>
            <Muted>Members</Muted>
            <Box css={{ fontSize: '2rem', fontWeight: 700 }}>{fmtNumber(members.length)}</Box>
          </Stack>
        </Surface>
        <Surface>
          <Stack space={2}>
            <Muted>Active Projects</Muted>
            <Box css={{ fontSize: '2rem', fontWeight: 700 }}>{fmtNumber(5)}</Box>
          </Stack>
        </Surface>
        <Surface>
          <Stack space={2}>
            <Muted>Upcoming Deadlines</Muted>
            <Box css={{ fontSize: '2rem', fontWeight: 700 }}>{fmtNumber(8)}</Box>
          </Stack>
        </Surface>
        <Surface>
          <Stack space={2}>
            <Spread>
              <Muted>Hours This Week</Muted>
              <InfoTip label="Aggregate of all team members.">
                <Box
                  css={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '9999px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'help',
                  }}
                  tabIndex={0}
                >
                  i
                </Box>
              </InfoTip>
            </Spread>
            <Box css={{ fontSize: '2rem', fontWeight: 700 }}>{fmtNumber(342)}</Box>
          </Stack>
        </Surface>
      </Grid>

      <Surface css={{ padding: '0', overflow: 'hidden' }}>
        <Box css={{ padding: '16px 20px' }}>
          <Headline level="3">Recent Activity</Headline>
        </Box>
        <Table aria-label="Recent Activity">
          <Table.Header>
            <Table.Column>Member</Table.Column>
            <Table.Column>Action</Table.Column>
            <Table.Column>Project</Table.Column>
            <Table.Column>Date</Table.Column>
          </Table.Header>
          <Table.Body>
            {RECENT_ACTIVITY.map((a, i) => (
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
      </Surface>

      <Box
        css={{
          backgroundColor: TONES.info.bg,
          color: TONES.info.fg,
          border: `1px solid ${TONES.info.border}`,
          borderRadius: '10px',
          padding: '14px 18px',
        }}
      >
        Sprint 14 ends in 3 days. Review the project board for outstanding tasks.
      </Box>
    </Stack>
  );

  /* ---------------------------------------------------------------- */
  /* Members page                                                     */
  /* ---------------------------------------------------------------- */

  const membersTable = (
    <Surface css={{ padding: 0, overflow: 'hidden' }}>
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
          {filteredMembers.map((m) => (
            <Table.Row key={m.id}>
              <Table.Cell>
                <Button variant="text" onPress={() => setSelectedMemberId(m.id)}>
                  {m.name}
                </Button>
              </Table.Cell>
              <Table.Cell>
                <Indicator tone={ROLE_TONE[m.role] ?? 'neutral'}>{m.role}</Indicator>
              </Table.Cell>
              <Table.Cell>{m.email}</Table.Cell>
              <Table.Cell>
                <Indicator tone={STATUS_TONE[m.status]}>{m.status}</Indicator>
              </Table.Cell>
              <Table.Cell>{fmtDate(m.joined)}</Table.Cell>
              <Table.Cell>
                <Inline space={1}>
                  <DialogButton
                    title="Edit member"
                    trigger={<Button variant="text">Edit</Button>}
                  >
                    {(close) => (
                      <MemberForm member={m} onSave={addMember} onClose={close} />
                    )}
                  </DialogButton>
                  <DialogButton
                    title="Remove member"
                    trigger={<Button variant="text">Remove</Button>}
                  >
                    {(close) => (
                      <Stack space={4}>
                        <Headline level="2">Remove member</Headline>
                        <Text>
                          Are you sure you want to remove {m.name}? This action cannot be undone.
                        </Text>
                        <Spread>
                          <Box />
                          <Inline space={2}>
                            <Button variant="text" onPress={close}>
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              onPress={() => {
                                removeMember(m.id);
                                close();
                              }}
                            >
                              Remove
                            </Button>
                          </Inline>
                        </Spread>
                      </Stack>
                    )}
                  </DialogButton>
                </Inline>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Surface>
  );

  const membersCards = (
    <Grid min="280px">
      {filteredMembers.map((m) => (
        <Surface key={m.id}>
          <Stack space={3}>
            <Button variant="text" onPress={() => setSelectedMemberId(m.id)} css={{ justifyContent: 'flex-start' }}>
              <Strong>{m.name}</Strong>
            </Button>
            <Box>
              <Indicator tone={ROLE_TONE[m.role] ?? 'neutral'}>{m.role}</Indicator>
            </Box>
            <Muted>{m.email}</Muted>
            <Inline space={2}>
              <Button variant="secondary" onPress={() => showToast(`Message sent to ${m.name}`)}>
                Message
              </Button>
              <Button variant="text" onPress={() => setSelectedMemberId(m.id)}>
                Profile
              </Button>
            </Inline>
          </Stack>
        </Surface>
      ))}
    </Grid>
  );

  const detailPanel = selectedMember && (
    <Box
      css={{
        width: '320px',
        flexShrink: 0,
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        height: 'fit-content',
      }}
    >
      <Stack space={4}>
        <Spread>
          <Headline level="3">Member Details</Headline>
          <Button variant="text" onPress={() => setSelectedMemberId(null)} aria-label="Close details">
            ✕
          </Button>
        </Spread>
        <Line />
        <Stack space={1}>
          <Muted>Name</Muted>
          <Strong>{selectedMember.name}</Strong>
        </Stack>
        <Stack space={1}>
          <Muted>Role</Muted>
          <Box>
            <Indicator tone={ROLE_TONE[selectedMember.role] ?? 'neutral'}>
              {selectedMember.role}
            </Indicator>
          </Box>
        </Stack>
        <Stack space={1}>
          <Muted>Email</Muted>
          <Text>{selectedMember.email}</Text>
        </Stack>
        <Stack space={1}>
          <Muted>Status</Muted>
          <Box>
            <Indicator tone={STATUS_TONE[selectedMember.status]}>{selectedMember.status}</Indicator>
          </Box>
        </Stack>
        <Stack space={1}>
          <Muted>Joined</Muted>
          <Text>{fmtDate(selectedMember.joined)}</Text>
        </Stack>
        <Stack space={1}>
          <Muted>Bio</Muted>
          <Text>{selectedMember.bio}</Text>
        </Stack>
      </Stack>
    </Box>
  );

  const membersPage = (
    <Stack space={5}>
      <Headline level="1">Team Members</Headline>

      <Spread align="flex-end">
        <Inline space={3} alignY="end">
          <Box css={{ minWidth: '220px' }}>
            <SearchField
              label="Search"
              aria-label="Search members"
              placeholder="Search by name"
              value={memberSearch}
              onChange={setMemberSearch}
            />
          </Box>
          <Box css={{ minWidth: '180px' }}>
            <SelectField
              label="Role"
              value={roleFilter}
              options={ROLE_FILTER_OPTIONS}
              onChange={setRoleFilter}
            />
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
        </Inline>

        <DialogButton
          title="Add member"
          trigger={<Button variant="primary">Add Member</Button>}
        >
          {(close) => <MemberForm member={null} onSave={addMember} onClose={close} />}
        </DialogButton>
      </Spread>

      <Box css={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <Box css={{ flex: 1, minWidth: 0 }}>
          {filteredMembers.length === 0 ? (
            <Surface>
              <Muted>No members match your filters.</Muted>
            </Surface>
          ) : viewMode === 'table' ? (
            membersTable
          ) : (
            membersCards
          )}
        </Box>
        {detailPanel}
      </Box>
    </Stack>
  );

  /* ---------------------------------------------------------------- */
  /* Projects page                                                    */
  /* ---------------------------------------------------------------- */

  const projectsPage = (
    <Stack space={5}>
      <Headline level="1">Projects</Headline>

      <Spread align="flex-end">
        <Box css={{ minWidth: '260px' }}>
          <SearchField
            label="Search"
            aria-label="Search projects"
            placeholder="Search projects"
            value={projectSearch}
            onChange={setProjectSearch}
          />
        </Box>
        <DialogButton
          title="New project"
          trigger={<Button variant="primary">New Project</Button>}
        >
          {(close) => <NewProjectForm onCreate={(p) => setProjects((ps) => [...ps, p])} onClose={close} makeId={() => newId('p')} />}
        </DialogButton>
      </Spread>

      {selectedProjectCount > 0 && (
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            padding: '12px 16px',
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: '10px',
          }}
        >
          <Strong>{selectedProjectCount} selected</Strong>
          <Inline space={2}>
            <Button variant="secondary" onPress={() => showToast('Projects exported')}>
              Export
            </Button>
            <Button variant="primary" onPress={archiveSelected}>
              Archive Selected
            </Button>
          </Inline>
        </Box>
      )}

      <Surface css={{ padding: 0, overflow: 'hidden' }}>
        <Table
          aria-label="Projects"
          selectionMode="multiple"
          selectedKeys={selectedProjects}
          onSelectionChange={(keys: Set<string> | 'all') => setSelectedProjects(keys)}
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
            {filteredProjects.map((p) => (
              <Table.Row key={p.id} id={p.id}>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>{p.lead}</Table.Cell>
                <Table.Cell>{fmtNumber(p.members)}</Table.Cell>
                <Table.Cell>{fmtDate(p.deadline)}</Table.Cell>
                <Table.Cell>{p.progress}%</Table.Cell>
                <Table.Cell>
                  <Indicator tone={PROJECT_TONE[p.status]}>{p.status}</Indicator>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Surface>
    </Stack>
  );

  /* ---------------------------------------------------------------- */
  /* Calendar page                                                    */
  /* ---------------------------------------------------------------- */

  const calendarPage = (
    <Stack space={6}>
      <Headline level="1">Team Calendar</Headline>
      <Surface>
        <Calendar aria-label="Team calendar" />
      </Surface>
      <Stack space={3}>
        <Headline level="3">Upcoming Events</Headline>
        <Stack space={2}>
          {UPCOMING_EVENTS.map((e, i) => (
            <Surface key={i} css={{ padding: '14px 18px' }}>
              <Spread>
                <Inline space={4} alignY="center">
                  <Strong>{fmtDate(e.date)}</Strong>
                  <Text>{e.name}</Text>
                </Inline>
                <Indicator tone={EVENT_TONE[e.type]}>{e.type}</Indicator>
              </Spread>
            </Surface>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );

  /* ---------------------------------------------------------------- */
  /* Files page                                                       */
  /* ---------------------------------------------------------------- */

  const filesPage = (
    <Stack space={5}>
      <Headline level="1">Shared Files</Headline>

      <Spread align="flex-end">
        <Inline space={3} alignY="end">
          <Box css={{ minWidth: '220px' }}>
            <SearchField
              label="Search"
              aria-label="Search files"
              placeholder="Search files"
              value={fileSearch}
              onChange={setFileSearch}
            />
          </Box>
          <Box css={{ minWidth: '180px' }}>
            <SelectField
              label="Type"
              value={fileTypeFilter}
              options={['All', 'Documents', 'Images', 'Spreadsheets']}
              onChange={setFileTypeFilter}
            />
          </Box>
        </Inline>

        <DialogButton title="Upload files" trigger={<Button variant="primary">Upload</Button>}>
          {(close) => (
            <UploadForm
              onUpload={(file) => {
                setFiles((fs) => [...fs, file]);
                showToast('Files uploaded successfully.');
              }}
              onClose={close}
              makeId={() => newId('f')}
            />
          )}
        </DialogButton>
      </Spread>

      <Surface css={{ padding: 0, overflow: 'hidden' }}>
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
            {filteredFiles.map((f) => (
              <Table.Row key={f.id}>
                <Table.Cell>{f.name}</Table.Cell>
                <Table.Cell>{f.type}</Table.Cell>
                <Table.Cell>{`${f.size.toLocaleString(undefined, { maximumFractionDigits: 1 })} MB`}</Table.Cell>
                <Table.Cell>{f.uploadedBy}</Table.Cell>
                <Table.Cell>{fmtDate(f.date)}</Table.Cell>
                <Table.Cell>
                  <Dropdown label="⋯" variant="text" align="right">
                    {(close) => (
                      <Stack space={0}>
                        <DropdownItem onPress={() => { showToast(`Downloading ${f.name}`); close(); }}>
                          Download
                        </DropdownItem>
                        <DropdownItem onPress={() => { showToast(`Renaming ${f.name}`); close(); }}>
                          Rename
                        </DropdownItem>
                        <DropdownItem
                          onPress={() => {
                            setFiles((fs) => fs.filter((x) => x.id !== f.id));
                            close();
                          }}
                        >
                          Delete
                        </DropdownItem>
                      </Stack>
                    )}
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Surface>
    </Stack>
  );

  /* ---------------------------------------------------------------- */
  /* Settings page                                                    */
  /* ---------------------------------------------------------------- */

  const notifConfig: { key: keyof typeof notifications; title: string; desc: string }[] = [
    { key: 'newMember', title: 'New member joins', desc: 'Get notified when someone joins the team' },
    { key: 'deadline', title: 'Project deadline approaching', desc: 'Reminder 3 days before deadline' },
    { key: 'digest', title: 'Weekly digest', desc: 'Summary of team activity every Monday' },
    { key: 'mention', title: 'Mention notifications', desc: 'When someone mentions you in a comment' },
    { key: 'calendar', title: 'Calendar reminders', desc: '15 minutes before scheduled events' },
  ];

  const integrationConfig: { key: keyof typeof integrations; desc: string }[] = [
    { key: 'Slack', desc: 'Send team notifications to your Slack channels.' },
    { key: 'GitHub', desc: 'Link pull requests and commits to projects.' },
    { key: 'Jira', desc: 'Sync issues and sprints with Jira boards.' },
  ];

  const settingsPage = (
    <Stack space={5}>
      <Headline level="1">Team Settings</Headline>

      <Inline space={1}>
        {['General', 'Notifications', 'Integrations'].map((t) => (
          <Button
            key={t}
            variant={settingsTab === t ? 'primary' : 'text'}
            onPress={() => setSettingsTab(t)}
          >
            {t}
          </Button>
        ))}
      </Inline>
      <Line />

      {settingsTab === 'General' && (
        <Surface>
          <Stack space={4}>
            <TextField label="Team Name" value={teamName} onChange={setTeamName} />
            <TextArea label="Description" value={teamDesc} onChange={setTeamDesc} />
            <SelectField
              label="Default Timezone"
              value={timezone}
              options={['UTC', 'CET', 'EST', 'PST']}
              onChange={setTimezone}
            />
            <SelectField
              label="Date Format"
              value={dateFormat}
              options={['MM/DD/YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD']}
              onChange={setDateFormat}
            />
            <Box>
              <Button variant="primary" onPress={() => showToast('Settings updated.')}>
                Save
              </Button>
            </Box>
          </Stack>
        </Surface>
      )}

      {settingsTab === 'Notifications' && (
        <Surface>
          <Stack space={4}>
            {notifConfig.map((n) => (
              <Box key={n.key}>
                <Spread>
                  <Stack space={0}>
                    <Strong>{n.title}</Strong>
                    <Muted>{n.desc}</Muted>
                  </Stack>
                  <Switch
                    aria-label={n.title}
                    isSelected={notifications[n.key]}
                    onChange={(v: boolean) =>
                      setNotifications((s) => ({ ...s, [n.key]: v }))
                    }
                  />
                </Spread>
              </Box>
            ))}
            <Box>
              <Button variant="primary" onPress={() => showToast('Preferences saved.')}>
                Save Preferences
              </Button>
            </Box>
          </Stack>
        </Surface>
      )}

      {settingsTab === 'Integrations' && (
        <Grid min="260px">
          {integrationConfig.map((it) => {
            const connected = integrations[it.key];
            return (
              <Surface key={it.key}>
                <Stack space={3}>
                  <Spread>
                    <Headline level="3">{it.key}</Headline>
                    <Indicator tone={connected ? 'success' : 'neutral'}>
                      {connected ? 'Connected' : 'Not connected'}
                    </Indicator>
                  </Spread>
                  <Muted>{it.desc}</Muted>
                  {connected ? (
                    <DialogButton
                      title={`Disconnect ${it.key}`}
                      trigger={<Button variant="secondary">Disconnect</Button>}
                    >
                      {(close) => (
                        <Stack space={4}>
                          <Headline level="2">Disconnect {it.key}</Headline>
                          <Text>Are you sure you want to disconnect {it.key}?</Text>
                          <Spread>
                            <Box />
                            <Inline space={2}>
                              <Button variant="text" onPress={close}>
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                onPress={() => {
                                  setIntegrations((s) => ({ ...s, [it.key]: false }));
                                  close();
                                }}
                              >
                                Disconnect
                              </Button>
                            </Inline>
                          </Spread>
                        </Stack>
                      )}
                    </DialogButton>
                  ) : (
                    <Box>
                      <Button
                        variant="primary"
                        onPress={() => setIntegrations((s) => ({ ...s, [it.key]: true }))}
                      >
                        Connect
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Surface>
            );
          })}
        </Grid>
      )}
    </Stack>
  );

  /* ---------------------------------------------------------------- */
  /* Page switch                                                      */
  /* ---------------------------------------------------------------- */

  const pages: Record<string, React.ReactNode> = {
    Dashboard: dashboard,
    Members: membersPage,
    Projects: projectsPage,
    Calendar: calendarPage,
    Files: filesPage,
    Settings: settingsPage,
  };

  return (
    <Box css={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', fontFamily: 'inherit' }}>
      {sidebar}
      <Box css={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {topNav}
        <Box css={{ flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#f9fafb' }}>
          {pages[page]}
        </Box>
      </Box>

      {toast && (
        <Box
          css={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#111827',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 5000,
          }}
        >
          {toast}
        </Box>
      )}
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* New project form                                                   */
/* ------------------------------------------------------------------ */

function NewProjectForm({
  onCreate,
  onClose,
  makeId,
}: {
  onCreate: (p: Project) => void;
  onClose: () => void;
  makeId: () => string;
}) {
  const [name, setName] = useState('');
  const [lead, setLead] = useState('');
  const [memberCount, setMemberCount] = useState('1');
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState('0');
  const [status, setStatus] = useState<'Active' | 'On Hold' | 'Completed'>('Active');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    if (!name.trim()) return;
    onCreate({
      id: makeId(),
      name: name.trim(),
      lead: lead.trim() || 'Unassigned',
      members: Number(memberCount) || 1,
      deadline: deadline ? new Date(deadline) : new Date(),
      progress: Math.max(0, Math.min(100, Number(progress) || 0)),
      status,
    });
    onClose();
  };

  return (
    <Stack space={4}>
      <Headline level="2">New Project</Headline>
      <TextField
        label="Project Name"
        value={name}
        onChange={setName}
        isRequired
        error={submitted && !name.trim()}
        errorMessage="Project name is required"
      />
      <TextField label="Lead" value={lead} onChange={setLead} />
      <TextField label="Members" type="number" value={memberCount} onChange={setMemberCount} />
      <TextField label="Deadline" type="date" value={deadline} onChange={setDeadline} />
      <TextField label="Progress (%)" type="number" value={progress} onChange={setProgress} />
      <SelectField
        label="Status"
        value={status}
        options={['Active', 'On Hold', 'Completed']}
        onChange={(v) => setStatus(v as 'Active' | 'On Hold' | 'Completed')}
      />
      <Spread>
        <Box />
        <Inline space={2}>
          <Button variant="text" onPress={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onPress={submit}>
            Create
          </Button>
        </Inline>
      </Spread>
    </Stack>
  );
}

/* ------------------------------------------------------------------ */
/* Upload form                                                        */
/* ------------------------------------------------------------------ */

function UploadForm({
  onUpload,
  onClose,
  makeId,
}: {
  onUpload: (f: FileItem) => void;
  onClose: () => void;
  makeId: () => string;
}) {
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Documents');

  const submit = () => {
    onUpload({
      id: makeId(),
      name: fileName.trim() || description.trim() || 'Untitled file',
      type: category as FileItem['type'],
      size: 1.2,
      uploadedBy: 'John Doe',
      date: new Date(),
    });
    onClose();
  };

  return (
    <Stack space={4}>
      <Headline level="2">Upload Files</Headline>
      <TextField
        label="Files"
        type="file"
        multiple
        onChange={(v: string) => setFileName(v.split(/[\\/]/).pop() || v)}
      />
      <TextField label="Description" value={description} onChange={setDescription} />
      <SelectField
        label="Category"
        value={category}
        options={['Documents', 'Images', 'Spreadsheets', 'Other']}
        onChange={setCategory}
      />
      <Spread>
        <Box />
        <Inline space={2}>
          <Button variant="text" onPress={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onPress={submit}>
            Upload
          </Button>
        </Inline>
      </Spread>
    </Stack>
  );
}

export default TestApp;
