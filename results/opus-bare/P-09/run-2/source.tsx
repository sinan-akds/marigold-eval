import { useState } from 'react';
import { FileTrigger } from 'react-aria-components';
import {
  Box,
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  TextField,
  TextArea,
  NumberField,
  Select,
  ComboBox,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Switch,
  DatePicker,
  TimeField,
} from '@marigold/components';

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const JOB_SUGGESTIONS = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];

const DIETARY_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];

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
  { value: 'email', label: 'Email updates about the event' },
  { value: 'sms', label: 'SMS reminders' },
  { value: 'survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reusable styled banner (Box renders a Marigold element, not raw HTML).
const Banner = ({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: 'info' | 'success';
}) => (
  <Box
    css={{
      padding: '12px 16px',
      borderRadius: '6px',
      border: '1px solid',
      borderColor: tone === 'success' ? '#3a9d5d' : '#3a6ea5',
      backgroundColor: tone === 'success' ? '#e7f6ec' : '#e8f0fb',
      color: tone === 'success' ? '#1f5c36' : '#1f3f66',
    }}
  >
    <Text>{children}</Text>
  </Box>
);

// Custom collapsible section so we don't depend on a specific Accordion API.
const CollapsibleSection = ({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box
      css={{
        border: '1px solid #d4d4d8',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
    >
      <Box
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: '#f4f4f5',
        }}
      >
        <Headline level={4}>{title}</Headline>
        <Button variant="text" onPress={() => setOpen((o) => !o)}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </Box>
      {open ? <Box css={{ padding: '12px' }}>{children}</Box> : null}
    </Box>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box css={{ display: 'flex', gap: '8px' }}>
    <Text css={{ fontWeight: 'bold' }}>{label}:</Text>
    <Text>{value === '' || value === undefined || value === null ? '—' : value}</Text>
  </Box>
);

const TestApp = () => {
  const [step, setStep] = useState(1);

  // Step 1 — Personal information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState('');

  // Step 2 — Event details
  const [eventDate, setEventDate] = useState<any>(null);
  const [timeSlot, setTimeSlot] = useState<any>(null);
  const [track, setTrack] = useState('');
  const [dietary, setDietary] = useState('');
  const [guests, setGuests] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 3 — Preferences
  const [tshirt, setTshirt] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [comms, setComms] = useState<string[]>([]);
  const [a11y, setA11y] = useState(false);
  const [a11yDetails, setA11yDetails] = useState('');

  // Step 4 — confirm
  const [agreed, setAgreed] = useState(false);

  // Submission state
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [toast, setToast] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!fullName.trim()) e.fullName = 'Full name is required.';
      if (!email.trim()) e.email = 'Email is required.';
      else if (!EMAIL_RE.test(email.trim()))
        e.email = 'Please enter a valid email address.';
    }
    if (s === 2) {
      if (!eventDate) e.eventDate = 'Event date is required.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      const conf =
        'EVT-' +
        Math.floor(100000 + Math.random() * 900000).toString();
      setConfirmation(conf);
      setLoading(false);
      setSubmitted(true);
      setToast(true);
      setTimeout(() => setToast(false), 4000);
    }, 1000);
  };

  const resetAll = () => {
    setStep(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setJobTitle('');
    setPhotoUrl(null);
    setPhotoName('');
    setEventDate(null);
    setTimeSlot(null);
    setTrack('');
    setDietary('');
    setGuests(0);
    setSpecialRequests('');
    setTshirt('');
    setTopics([]);
    setComms([]);
    setA11y(false);
    setA11yDetails('');
    setAgreed(false);
    setSubmitted(false);
    setLoading(false);
    setConfirmation('');
    setErrors({});
  };

  const addTopic = (t: string | null) => {
    if (!t) return;
    setTopics((prev) => (prev.includes(t) ? prev : [...prev, t]));
  };

  const removeTopic = (t: string) => {
    setTopics((prev) => prev.filter((x) => x !== t));
  };

  const dateLabel = eventDate ? eventDate.toString() : '';
  const timeLabel = timeSlot ? timeSlot.toString() : '';

  // ---- Success / loading view ----
  if (loading || submitted) {
    return (
      <Box css={{ maxWidth: '640px', margin: '40px auto', padding: '16px' }}>
        <Box
          css={{
            border: '1px solid #d4d4d8',
            borderRadius: '10px',
            padding: '24px',
            backgroundColor: '#ffffff',
          }}
        >
          {loading ? (
            <Stack space="medium" alignX="center">
              <Headline level={3}>Submitting your registration…</Headline>
              <Text>Please wait a moment.</Text>
            </Stack>
          ) : (
            <Stack space="large">
              <Banner tone="success">Registration confirmed!</Banner>
              <Box
                css={{
                  border: '1px solid #d4d4d8',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                }}
              >
                <Stack space="small">
                  <Headline level={4}>Registration Summary</Headline>
                  <Row label="Name" value={fullName} />
                  <Row label="Email" value={email} />
                  <Row label="Event Date" value={dateLabel} />
                  <Row label="Confirmation Number" value={confirmation} />
                </Stack>
              </Box>
              <Inline space="small">
                <Button variant="primary" onPress={resetAll}>
                  Register Another
                </Button>
              </Inline>
            </Stack>
          )}
        </Box>

        {toast ? (
          <Box
            css={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: '#1f5c36',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Text css={{ color: '#ffffff' }}>
              Registration submitted successfully
            </Text>
          </Box>
        ) : null}
      </Box>
    );
  }

  // ---- Form steps ----
  return (
    <Box css={{ maxWidth: '640px', margin: '40px auto', padding: '16px' }}>
      <Box
        css={{
          border: '1px solid #d4d4d8',
          borderRadius: '10px',
          padding: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        <Stack space="large">
          <Stack space="xxsmall">
            <Text css={{ color: '#71717a' }}>{`Step ${step} of 4`}</Text>
            <Headline level={2}>{`Step ${step} of 4 — ${
              STEP_TITLES[step - 1]
            }`}</Headline>
          </Stack>

          {/* STEP 1 */}
          {step === 1 ? (
            <Stack space="medium">
              <TextField
                label="Full Name"
                isRequired
                value={fullName}
                onChange={setFullName}
                error={!!errors.fullName}
                errorMessage={errors.fullName}
              />
              <TextField
                label="Email"
                type="email"
                isRequired
                value={email}
                onChange={setEmail}
                error={!!errors.email}
                errorMessage={errors.email}
              />
              <TextField
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
              />
              <TextField
                label="Company / Organization"
                value={company}
                onChange={setCompany}
              />
              <ComboBox
                label="Job Title"
                allowsCustomValue
                inputValue={jobTitle}
                onInputChange={setJobTitle}
              >
                {JOB_SUGGESTIONS.map((j) => (
                  <ComboBox.Item key={j} id={j}>
                    {j}
                  </ComboBox.Item>
                ))}
              </ComboBox>

              <Stack space="xsmall">
                <Text css={{ fontWeight: 'bold' }}>Profile Photo</Text>
                <Inline space="small" alignY="center">
                  <FileTrigger
                    acceptedFileTypes={['image/*']}
                    onSelect={(files) => {
                      if (files && files.length > 0) {
                        const f = files[0];
                        setPhotoName(f.name);
                        setPhotoUrl(URL.createObjectURL(f));
                      }
                    }}
                  >
                    <Button variant="secondary">Upload Image</Button>
                  </FileTrigger>
                  {photoName ? <Text>{photoName}</Text> : null}
                </Inline>
                {photoUrl ? (
                  // The single allowed raw element: photo preview.
                  <img
                    src={photoUrl}
                    alt="Profile preview"
                    style={{
                      width: '96px',
                      height: '96px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : null}
              </Stack>

              <Banner tone="info">
                Your information will only be used for this event.
              </Banner>
            </Stack>
          ) : null}

          {/* STEP 2 */}
          {step === 2 ? (
            <Stack space="medium">
              <Stack space="xsmall">
                <DatePicker
                  label="Event Date"
                  isRequired
                  value={eventDate}
                  onChange={setEventDate}
                  error={!!errors.eventDate}
                  errorMessage={errors.eventDate}
                />
                {errors.eventDate ? (
                  <Text css={{ color: '#b42318' }}>{errors.eventDate}</Text>
                ) : null}
              </Stack>

              <TimeField
                label="Preferred Time Slot"
                value={timeSlot}
                onChange={setTimeSlot}
              />

              <RadioGroup
                label="Session Track"
                value={track}
                onChange={setTrack}
              >
                {TRACKS.map((t) => (
                  <Radio key={t} value={t}>
                    {t}
                  </Radio>
                ))}
              </RadioGroup>

              <ComboBox
                label="Dietary Requirements"
                allowsCustomValue
                inputValue={dietary}
                onInputChange={setDietary}
              >
                {DIETARY_OPTIONS.map((d) => (
                  <ComboBox.Item key={d} id={d}>
                    {d}
                  </ComboBox.Item>
                ))}
              </ComboBox>

              <NumberField
                label="Number of Guests"
                minValue={0}
                maxValue={5}
                value={guests}
                onChange={(v: number) => setGuests(Number.isNaN(v) ? 0 : v)}
              />

              <TextArea
                label="Special Requests"
                value={specialRequests}
                onChange={setSpecialRequests}
              />
            </Stack>
          ) : null}

          {/* STEP 3 */}
          {step === 3 ? (
            <Stack space="medium">
              <Select
                label="T-Shirt Size"
                selectedKey={tshirt || null}
                onSelectionChange={(k) => setTshirt(String(k))}
              >
                {TSHIRT_SIZES.map((s) => (
                  <Select.Option key={s} id={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>

              <Stack space="xsmall">
                <ComboBox
                  label="Topics of Interest"
                  selectedKey={null}
                  onSelectionChange={(k) => addTopic(k ? String(k) : null)}
                >
                  {TOPIC_SUGGESTIONS.filter((t) => !topics.includes(t)).map(
                    (t) => (
                      <ComboBox.Item key={t} id={t}>
                        {t}
                      </ComboBox.Item>
                    )
                  )}
                </ComboBox>
                {topics.length > 0 ? (
                  <Inline space="small">
                    {topics.map((t) => (
                      <Box
                        key={t}
                        css={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '2px 4px 2px 10px',
                          borderRadius: '14px',
                          backgroundColor: '#e8e8f0',
                        }}
                      >
                        <Text>{t}</Text>
                        <Button
                          variant="text"
                          aria-label={`Remove ${t}`}
                          onPress={() => removeTopic(t)}
                        >
                          ✕
                        </Button>
                      </Box>
                    ))}
                  </Inline>
                ) : null}
              </Stack>

              <CheckboxGroup
                label="Communication Preferences"
                value={comms}
                onChange={setComms}
              >
                {COMM_OPTIONS.map((c) => (
                  <Checkbox key={c.value} value={c.value}>
                    {c.label}
                  </Checkbox>
                ))}
              </CheckboxGroup>

              <Stack space="xsmall">
                <Switch isSelected={a11y} onChange={setA11y}>
                  I have accessibility requirements
                </Switch>
                {a11y ? (
                  <TextArea
                    label="Accessibility Details"
                    value={a11yDetails}
                    onChange={setA11yDetails}
                  />
                ) : null}
              </Stack>
            </Stack>
          ) : null}

          {/* STEP 4 */}
          {step === 4 ? (
            <Stack space="medium">
              <CollapsibleSection title="Personal Information" defaultOpen>
                <Stack space="small">
                  <Row label="Name" value={fullName} />
                  <Row label="Email" value={email} />
                  <Row label="Phone" value={phone} />
                  <Row label="Company" value={company} />
                  <Row label="Job Title" value={jobTitle} />
                </Stack>
              </CollapsibleSection>

              <CollapsibleSection title="Event Details">
                <Stack space="small">
                  <Row label="Date" value={dateLabel} />
                  <Row label="Time" value={timeLabel} />
                  <Row label="Track" value={track} />
                  <Row label="Dietary" value={dietary} />
                  <Row label="Guests" value={String(guests)} />
                </Stack>
              </CollapsibleSection>

              <CollapsibleSection title="Preferences">
                <Stack space="small">
                  <Row label="T-Shirt Size" value={tshirt} />
                  <Row label="Topics" value={topics.join(', ')} />
                  <Row
                    label="Communication Preferences"
                    value={comms
                      .map(
                        (v) =>
                          COMM_OPTIONS.find((c) => c.value === v)?.label ?? v
                      )
                      .join(', ')}
                  />
                </Stack>
              </CollapsibleSection>

              <Checkbox isSelected={agreed} onChange={setAgreed}>
                I agree to the terms and conditions
              </Checkbox>
            </Stack>
          ) : null}

          {/* NAVIGATION */}
          <Box
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
            }}
          >
            <Button
              variant="secondary"
              isDisabled={step === 1}
              onPress={goBack}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button variant="primary" onPress={goNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                isDisabled={!agreed}
                onPress={handleSubmit}
              >
                Submit Registration
              </Button>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default TestApp;
