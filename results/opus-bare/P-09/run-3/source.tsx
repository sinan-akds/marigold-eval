import { useState } from 'react';
import { FileTrigger } from 'react-aria-components';
import {
  Box,
  Stack,
  Inline,
  Split,
  Card,
  Headline,
  Text,
  Button,
  Divider,
  TextField,
  TextArea,
  NumberField,
  Select,
  ComboBox,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  TimeField,
  Accordion,
} from '@marigold/components';

/* ---------- static option data ---------- */

const JOB_TITLES = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];

const TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];

const DIETARY = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TOPIC_SUGGESTIONS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const COMM_OPTIONS = [
  { id: 'email', label: 'Email updates about the event' },
  { id: 'sms', label: 'SMS reminders' },
  { id: 'survey', label: 'Post-event survey' },
  { id: 'newsletter', label: 'Newsletter subscription' },
];

const STEP_TITLES: Record<number, string> = {
  1: 'Personal Information',
  2: 'Event Details',
  3: 'Preferences',
  4: 'Review & Confirm',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialData = {
  // step 1
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  photoName: '',
  // step 2
  eventDate: null as any,
  timeSlot: null as any,
  track: '',
  dietary: '',
  guests: 0,
  specialRequests: '',
  // step 3
  tshirt: null as any,
  topics: [] as string[],
  comms: [] as string[],
  hasAccessibility: false,
  accessibilityDetails: '',
  // step 4
  agree: false,
};

type FormData = typeof initialData;

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [showToast, setShowToast] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  /* ---------- validation ---------- */

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!data.fullName.trim()) e.fullName = 'Full name is required';
      if (!data.email.trim()) e.email = 'Email is required';
      else if (!EMAIL_RE.test(data.email))
        e.email = 'Please enter a valid email address';
    }
    if (step === 2) {
      if (!data.eventDate) e.eventDate = 'Event date is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- navigation ---------- */

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step === 4) {
      handleSubmit();
      return;
    }
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const num =
        'EVT-' + Math.floor(100000 + Math.random() * 900000).toString();
      setConfirmationNumber(num);
      setSubmitting(false);
      setSubmitted(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 1000);
  };

  const resetAll = () => {
    setData(initialData);
    setErrors({});
    setPhotoPreview(null);
    setConfirmationNumber('');
    setSubmitted(false);
    setSubmitting(false);
    setStep(1);
  };

  /* ---------- helpers ---------- */

  const onPhotoSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    update('photoName', file.name);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const addTopic = (topic: string) => {
    if (topic && !data.topics.includes(topic))
      update('topics', [...data.topics, topic]);
  };

  const removeTopic = (topic: string) =>
    update('topics', data.topics.filter((t) => t !== topic));

  const commLabel = (id: string) =>
    COMM_OPTIONS.find((c) => c.id === id)?.label ?? id;

  /* ---------- step renderers ---------- */

  const renderStep1 = () => (
    <Stack space={4}>
      <Box
        css={{
          padding: '12px 16px',
          backgroundColor: '#e8f0fe',
          borderRadius: '6px',
          borderLeft: '4px solid #1a73e8',
        }}
      >
        <Text>Your information will only be used for this event.</Text>
      </Box>

      <TextField
        label="Full Name"
        required
        value={data.fullName}
        onChange={(v: string) => update('fullName', v)}
        error={!!errors.fullName}
        errorMessage={errors.fullName}
      />

      <TextField
        label="Email"
        type="email"
        required
        value={data.email}
        onChange={(v: string) => update('email', v)}
        error={!!errors.email}
        errorMessage={errors.email}
      />

      <TextField
        label="Phone Number"
        value={data.phone}
        onChange={(v: string) => update('phone', v)}
      />

      <TextField
        label="Company / Organization"
        value={data.company}
        onChange={(v: string) => update('company', v)}
      />

      <ComboBox
        label="Job Title"
        allowsCustomValue
        inputValue={data.jobTitle}
        onInputChange={(v: string) => update('jobTitle', v)}
      >
        {JOB_TITLES.map((t) => (
          <ComboBox.Item key={t} id={t}>
            {t}
          </ComboBox.Item>
        ))}
      </ComboBox>

      <Stack space={2}>
        <Text>Profile Photo</Text>
        <FileTrigger acceptedFileTypes={['image/*']} onSelect={onPhotoSelect}>
          <Button variant="secondary">Upload Image</Button>
        </FileTrigger>
        {data.photoName ? <Text>{data.photoName}</Text> : null}
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Profile preview"
            style={{ maxWidth: '120px', borderRadius: '8px' }}
          />
        ) : null}
      </Stack>
    </Stack>
  );

  const renderStep2 = () => (
    <Stack space={4}>
      <DatePicker
        label="Event Date"
        value={data.eventDate}
        onChange={(v: any) => update('eventDate', v)}
        error={!!errors.eventDate}
        errorMessage={errors.eventDate}
      />

      <TimeField
        label="Preferred Time Slot"
        value={data.timeSlot}
        onChange={(v: any) => update('timeSlot', v)}
      />

      <Radio.Group
        label="Session Track"
        value={data.track}
        onChange={(v: string) => update('track', v)}
      >
        {TRACKS.map((t) => (
          <Radio key={t} value={t}>
            {t}
          </Radio>
        ))}
      </Radio.Group>

      <ComboBox
        label="Dietary Requirements"
        allowsCustomValue
        inputValue={data.dietary}
        onInputChange={(v: string) => update('dietary', v)}
      >
        {DIETARY.map((d) => (
          <ComboBox.Item key={d} id={d}>
            {d}
          </ComboBox.Item>
        ))}
      </ComboBox>

      <NumberField
        label="Number of Guests"
        minValue={0}
        maxValue={5}
        value={data.guests}
        onChange={(v: number) => update('guests', Number.isNaN(v) ? 0 : v)}
      />

      <TextArea
        label="Special Requests"
        value={data.specialRequests}
        onChange={(v: string) => update('specialRequests', v)}
      />
    </Stack>
  );

  const renderStep3 = () => {
    const remaining = TOPIC_SUGGESTIONS.filter((t) => !data.topics.includes(t));
    return (
      <Stack space={4}>
        <Select
          label="T-Shirt Size"
          selectedKey={data.tshirt}
          onSelectionChange={(key) => update('tshirt', key as any)}
        >
          {TSHIRT_SIZES.map((s) => (
            <Select.Option key={s} id={s}>
              {s}
            </Select.Option>
          ))}
        </Select>

        <Stack space={2}>
          <Select
            label="Topics of Interest"
            placeholder="Add a topic"
            selectedKey={null}
            onSelectionChange={(key) => key && addTopic(String(key))}
          >
            {remaining.map((t) => (
              <Select.Option key={t} id={t}>
                {t}
              </Select.Option>
            ))}
          </Select>

          {data.topics.length > 0 ? (
            <Inline space={2}>
              {data.topics.map((t) => (
                <Box
                  key={t}
                  css={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    borderRadius: '16px',
                    padding: '2px 6px 2px 12px',
                  }}
                >
                  <Text>{t}</Text>
                  <Button
                    variant="text"
                    aria-label={`Remove ${t}`}
                    onPress={() => removeTopic(t)}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Inline>
          ) : null}
        </Stack>

        <Checkbox.Group
          label="Communication Preferences"
          value={data.comms}
          onChange={(v: string[]) => update('comms', v)}
        >
          {COMM_OPTIONS.map((c) => (
            <Checkbox key={c.id} value={c.id}>
              {c.label}
            </Checkbox>
          ))}
        </Checkbox.Group>

        <Stack space={2}>
          <Switch
            checked={data.hasAccessibility}
            onChange={(c: boolean) => update('hasAccessibility', c)}
          >
            I have accessibility requirements
          </Switch>
          {data.hasAccessibility ? (
            <TextArea
              label="Accessibility details"
              value={data.accessibilityDetails}
              onChange={(v: string) => update('accessibilityDetails', v)}
            />
          ) : null}
        </Stack>
      </Stack>
    );
  };

  const renderStep4 = () => (
    <Stack space={4}>
      <Accordion>
        <Accordion.Item id="personal" title="Personal Information">
          <Stack space={1}>
            <Text>Name: {data.fullName || '—'}</Text>
            <Text>Email: {data.email || '—'}</Text>
            <Text>Phone: {data.phone || '—'}</Text>
            <Text>Company: {data.company || '—'}</Text>
            <Text>Job Title: {data.jobTitle || '—'}</Text>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="event" title="Event Details">
          <Stack space={1}>
            <Text>
              Date: {data.eventDate ? data.eventDate.toString() : '—'}
            </Text>
            <Text>
              Time: {data.timeSlot ? data.timeSlot.toString() : '—'}
            </Text>
            <Text>Track: {data.track || '—'}</Text>
            <Text>Dietary: {data.dietary || '—'}</Text>
            <Text>Guests: {data.guests}</Text>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="prefs" title="Preferences">
          <Stack space={1}>
            <Text>T-Shirt Size: {data.tshirt || '—'}</Text>
            <Text>
              Topics: {data.topics.length ? data.topics.join(', ') : '—'}
            </Text>
            <Text>
              Communication:{' '}
              {data.comms.length
                ? data.comms.map(commLabel).join(', ')
                : '—'}
            </Text>
          </Stack>
        </Accordion.Item>
      </Accordion>

      <Divider />

      <Checkbox
        checked={data.agree}
        onChange={(c: boolean) => update('agree', c)}
      >
        I agree to the terms and conditions
      </Checkbox>
    </Stack>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  /* ---------- success view ---------- */

  const renderSuccess = () => (
    <Stack space={5}>
      <Box
        css={{
          padding: '12px 16px',
          backgroundColor: '#e6f4ea',
          borderRadius: '6px',
          borderLeft: '4px solid #1e8e3e',
        }}
      >
        <Text>Registration confirmed!</Text>
      </Box>

      <Card>
        <Box css={{ padding: '16px' }}>
          <Stack space={2}>
            <Headline level="4">Summary</Headline>
            <Text>Name: {data.fullName || '—'}</Text>
            <Text>Email: {data.email || '—'}</Text>
            <Text>
              Event Date: {data.eventDate ? data.eventDate.toString() : '—'}
            </Text>
            <Text>Confirmation Number: {confirmationNumber}</Text>
          </Stack>
        </Box>
      </Card>

      <Inline space={3}>
        <Button variant="primary" onPress={resetAll}>
          Register Another
        </Button>
      </Inline>
    </Stack>
  );

  const renderLoading = () => (
    <Stack space={3} alignX="center">
      <Text>Submitting your registration…</Text>
    </Stack>
  );

  /* ---------- body switch ---------- */

  let body;
  if (submitting) body = renderLoading();
  else if (submitted) body = renderSuccess();
  else
    body = (
      <Stack space={5}>
        <Headline level="3">
          {`Step ${step} of 4 — ${STEP_TITLES[step]}`}
        </Headline>

        <Divider />

        {renderCurrentStep()}

        <Divider />

        <Inline space={3} alignY="center">
          <Button
            variant="secondary"
            disabled={step === 1}
            onPress={goBack}
          >
            Back
          </Button>
          <Split />
          <Button
            variant="primary"
            disabled={step === 4 && !data.agree}
            onPress={goNext}
          >
            {step === 4 ? 'Submit Registration' : 'Next'}
          </Button>
        </Inline>
      </Stack>
    );

  return (
    <Box css={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
      <Card>
        <Box css={{ padding: '24px' }}>{body}</Box>
      </Card>

      {showToast ? (
        <Box
          css={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#323232',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
        >
          <Text>Registration submitted successfully</Text>
        </Box>
      ) : null}
    </Box>
  );
};

export default TestApp;
