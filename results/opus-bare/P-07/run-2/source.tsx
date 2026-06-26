import { useState } from 'react';
import {
  Box,
  Stack,
  Inline,
  Headline,
  Text,
  Button,
  TextField,
  TextArea,
  Select,
  ComboBox,
  DatePicker,
  Table,
  Tabs,
  Dialog,
  Menu,
  Badge,
  Accordion,
} from '@marigold/components';
import {
  today,
  getLocalTimeZone,
  parseDate,
  startOfWeek,
  endOfWeek,
} from '@internationalized/date';

const TZ = getLocalTimeZone();
const TODAY = today(TZ);

const VENUES = [
  'Main Hall',
  'Conference Room A',
  'Conference Room B',
  'Rooftop Terrace',
  'Workshop Studio',
];

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

const statusVariant: Record<string, string> = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'neutral',
};

const initialBookings = [
  {
    id: 'BK-1001',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    venue: 'Main Hall',
    date: TODAY.toString(),
    timeSlot: '09:00-12:00',
    status: 'Confirmed',
    notes: 'VIP client — requires full AV setup and stage lighting.',
  },
  {
    id: 'BK-1002',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    venue: 'Conference Room A',
    date: TODAY.toString(),
    timeSlot: '12:00-15:00',
    status: 'Pending',
    notes: 'Awaiting deposit payment before confirmation.',
  },
  {
    id: 'BK-1003',
    customer: 'Carla Mendes',
    email: 'carla@example.com',
    venue: 'Rooftop Terrace',
    date: TODAY.add({ days: 1 }).toString(),
    timeSlot: '18:00-21:00',
    status: 'Confirmed',
    notes: 'Evening reception, catering arranged.',
  },
  {
    id: 'BK-1004',
    customer: 'David Lee',
    email: 'david@example.com',
    venue: 'Workshop Studio',
    date: TODAY.add({ days: 2 }).toString(),
    timeSlot: '15:00-18:00',
    status: 'Cancelled',
    notes: 'Customer cancelled due to scheduling conflict.',
  },
  {
    id: 'BK-1005',
    customer: 'Emma Brown',
    email: 'emma@example.com',
    venue: 'Conference Room B',
    date: TODAY.add({ days: 4 }).toString(),
    timeSlot: '09:00-12:00',
    status: 'Pending',
    notes: '',
  },
  {
    id: 'BK-1006',
    customer: 'Frank Miller',
    email: 'frank@example.com',
    venue: 'Main Hall',
    date: TODAY.add({ days: 10 }).toString(),
    timeSlot: '12:00-15:00',
    status: 'Confirmed',
    notes: 'Annual partner conference — recurring client.',
  },
];

const emptyDraft = {
  id: null,
  name: '',
  email: '',
  venue: '',
  date: null,
  timeSlot: '',
  notes: '',
};

const WEEK_START = startOfWeek(TODAY, 'en-US');
const WEEK_END = endOfWeek(TODAY, 'en-US');

const TestApp = () => {
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [tab, setTab] = useState('all');

  // Filter bar state
  const [filterDate, setFilterDate] = useState<any>(null);
  const [filterVenue, setFilterVenue] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Detail panel + form state
  const [detail, setDetail] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('new');
  const [draft, setDraft] = useState<any>(emptyDraft);
  const [nameError, setNameError] = useState(false);

  const inWeek = (dateStr: string) => {
    const d = parseDate(dateStr);
    return d.compare(WEEK_START) >= 0 && d.compare(WEEK_END) <= 0;
  };

  const getFiltered = (tabKey: string) =>
    bookings.filter((b) => {
      if (tabKey === 'today' && b.date !== TODAY.toString()) return false;
      if (tabKey === 'week' && !inWeek(b.date)) return false;
      if (filterDate && b.date !== filterDate.toString()) return false;
      if (filterVenue && b.venue !== filterVenue) return false;
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      return true;
    });

  const clearFilters = () => {
    setFilterDate(null);
    setFilterVenue(null);
    setFilterStatus('all');
  };

  const handleRowAction = (key: string, b: any) => {
    if (key === 'view') {
      setDetail(b);
    } else if (key === 'edit') {
      setFormMode('edit');
      setNameError(false);
      setDraft({
        id: b.id,
        name: b.customer,
        email: b.email,
        venue: b.venue,
        date: parseDate(b.date),
        timeSlot: b.timeSlot,
        notes: b.notes,
      });
      setFormOpen(true);
    } else if (key === 'cancel') {
      setBookings((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, status: 'Cancelled' } : x))
      );
      setDetail((d: any) =>
        d && d.id === b.id ? { ...d, status: 'Cancelled' } : d
      );
    }
  };

  const submitForm = (close: () => void) => {
    if (!draft.name.trim()) {
      setNameError(true);
      return;
    }
    const dateStr = draft.date ? draft.date.toString() : TODAY.toString();
    if (formMode === 'edit') {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === draft.id
            ? {
                ...b,
                customer: draft.name,
                email: draft.email,
                venue: draft.venue,
                date: dateStr,
                timeSlot: draft.timeSlot,
                notes: draft.notes,
              }
            : b
        )
      );
    } else {
      const num = 1000 + bookings.length + 1;
      setBookings((prev) => [
        ...prev,
        {
          id: `BK-${num}`,
          customer: draft.name,
          email: draft.email,
          venue: draft.venue || VENUES[0],
          date: dateStr,
          timeSlot: draft.timeSlot || TIME_SLOTS[0],
          status: 'Pending',
          notes: draft.notes,
        },
      ]);
    }
    close();
  };

  const renderTable = (tabKey: string) => {
    const rows = getFiltered(tabKey);
    return (
      <Table aria-label="Bookings">
        <Table.Header>
          <Table.Column>Booking ID</Table.Column>
          <Table.Column>Customer</Table.Column>
          <Table.Column>Venue</Table.Column>
          <Table.Column>Date</Table.Column>
          <Table.Column>Time Slot</Table.Column>
          <Table.Column>Status</Table.Column>
          <Table.Column>Actions</Table.Column>
        </Table.Header>
        <Table.Body>
          {rows.map((b) => (
            <Table.Row key={b.id} id={b.id}>
              <Table.Cell>{b.id}</Table.Cell>
              <Table.Cell>{b.customer}</Table.Cell>
              <Table.Cell>{b.venue}</Table.Cell>
              <Table.Cell>{b.date}</Table.Cell>
              <Table.Cell>{b.timeSlot}</Table.Cell>
              <Table.Cell>
                <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Menu
                  label="•••"
                  onAction={(key) => handleRowAction(String(key), b)}
                >
                  <Menu.Item id="view">View Details</Menu.Item>
                  <Menu.Item id="edit">Edit</Menu.Item>
                  <Menu.Item id="cancel">Cancel Booking</Menu.Item>
                </Menu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  };

  return (
    <Box css={{ padding: 24 }}>
      <Stack space="large">
        <Stack space="xsmall">
          <Headline level={1}>Booking Management</Headline>
          <Text>Manage venue rental bookings across all spaces.</Text>
        </Stack>

        {/* Filter bar */}
        <Inline space="small" alignY="bottom">
          <DatePicker
            label="Date"
            value={filterDate}
            onChange={setFilterDate}
          />
          <ComboBox
            label="Venue"
            selectedKey={filterVenue}
            onSelectionChange={setFilterVenue}
          >
            {VENUES.map((v) => (
              <ComboBox.Item key={v} id={v}>
                {v}
              </ComboBox.Item>
            ))}
          </ComboBox>
          <Select
            label="Status"
            selectedKey={filterStatus}
            onSelectionChange={(k) => setFilterStatus(String(k))}
          >
            <Select.Option id="all">All</Select.Option>
            <Select.Option id="Confirmed">Confirmed</Select.Option>
            <Select.Option id="Pending">Pending</Select.Option>
            <Select.Option id="Cancelled">Cancelled</Select.Option>
          </Select>
          <Button variant="secondary" onPress={clearFilters}>
            Clear Filters
          </Button>
        </Inline>

        {/* Capacity alert */}
        <Box
          css={{
            backgroundColor: '#FFF4E5',
            border: '1px solid #FFB74D',
            borderRadius: 6,
            padding: 12,
          }}
        >
          <Text>
            ⚠️ Main Hall has only 2 slots remaining for today.
          </Text>
        </Box>

        {/* New booking action */}
        <Inline space="small">
          <Dialog.Trigger
            isOpen={formOpen}
            onOpenChange={(o) => {
              setFormOpen(o);
              if (!o) setNameError(false);
            }}
          >
            <Button
              variant="primary"
              onPress={() => {
                setFormMode('new');
                setDraft(emptyDraft);
                setNameError(false);
              }}
            >
              New Booking
            </Button>
            <Dialog closeButton>
              {({ close }: { close: () => void }) => (
                <Stack space="medium">
                  <Headline level={2}>
                    {formMode === 'edit' ? 'Edit Booking' : 'New Booking'}
                  </Headline>
                  <TextField
                    label="Customer Name"
                    isRequired
                    value={draft.name}
                    onChange={(v) =>
                      setDraft((d: any) => ({ ...d, name: v }))
                    }
                    error={nameError}
                    errorMessage="Customer name is required"
                  />
                  <TextField
                    label="Customer Email"
                    type="email"
                    value={draft.email}
                    onChange={(v) =>
                      setDraft((d: any) => ({ ...d, email: v }))
                    }
                  />
                  <Select
                    label="Venue"
                    selectedKey={draft.venue || null}
                    onSelectionChange={(k) =>
                      setDraft((d: any) => ({ ...d, venue: String(k) }))
                    }
                  >
                    {VENUES.map((v) => (
                      <Select.Option key={v} id={v}>
                        {v}
                      </Select.Option>
                    ))}
                  </Select>
                  <DatePicker
                    label="Date"
                    value={draft.date}
                    onChange={(v) =>
                      setDraft((d: any) => ({ ...d, date: v }))
                    }
                  />
                  <Select
                    label="Time Slot"
                    selectedKey={draft.timeSlot || null}
                    onSelectionChange={(k) =>
                      setDraft((d: any) => ({ ...d, timeSlot: String(k) }))
                    }
                  >
                    {TIME_SLOTS.map((s) => (
                      <Select.Option key={s} id={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                  <TextArea
                    label="Notes"
                    value={draft.notes}
                    onChange={(v) =>
                      setDraft((d: any) => ({ ...d, notes: v }))
                    }
                  />
                  <Inline space="small">
                    <Button
                      variant="primary"
                      onPress={() => submitForm(close)}
                    >
                      {formMode === 'edit' ? 'Save Changes' : 'Create Booking'}
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

        {/* Tabs + table + detail panel */}
        <Box css={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Box css={{ flex: 1, minWidth: 0 }}>
            <Tabs
              selectedKey={tab}
              onSelectionChange={(k) => setTab(String(k))}
            >
              <Tabs.List aria-label="Booking views">
                <Tabs.Item id="all">All Bookings</Tabs.Item>
                <Tabs.Item id="today">Today</Tabs.Item>
                <Tabs.Item id="week">This Week</Tabs.Item>
              </Tabs.List>
              <Tabs.Panel id="all">{renderTable('all')}</Tabs.Panel>
              <Tabs.Panel id="today">{renderTable('today')}</Tabs.Panel>
              <Tabs.Panel id="week">{renderTable('week')}</Tabs.Panel>
            </Tabs>
          </Box>

          {detail && (
            <Box
              css={{
                width: 360,
                flexShrink: 0,
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 16,
                backgroundColor: '#fff',
              }}
            >
              <Stack space="medium">
                <Inline space="small" alignY="center">
                  <Headline level={3}>{detail.id}</Headline>
                  <Badge variant={statusVariant[detail.status]}>
                    {detail.status}
                  </Badge>
                </Inline>
                <Button variant="secondary" onPress={() => setDetail(null)}>
                  Close
                </Button>

                <Stack space="xsmall">
                  <Headline level={4}>Customer</Headline>
                  <Text>{detail.customer}</Text>
                  <Text>{detail.email}</Text>
                </Stack>

                <Stack space="xsmall">
                  <Headline level={4}>Venue &amp; Schedule</Headline>
                  <Text>{detail.venue}</Text>
                  <Text>
                    {detail.date} · {detail.timeSlot}
                  </Text>
                </Stack>

                <Stack space="xsmall">
                  <Headline level={4}>Notes</Headline>
                  <Text>{detail.notes || 'No notes provided.'}</Text>
                </Stack>

                <Accordion>
                  <Accordion.Item id="payment" title="Payment History">
                    <Text>
                      No payments recorded yet. A deposit invoice is pending.
                    </Text>
                  </Accordion.Item>
                  <Accordion.Item id="comm" title="Communication Log">
                    <Text>
                      No messages logged yet. Last contact: not available.
                    </Text>
                  </Accordion.Item>
                </Accordion>
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default TestApp;
