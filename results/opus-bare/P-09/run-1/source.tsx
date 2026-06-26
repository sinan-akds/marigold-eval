import { useState } from 'react';
import {
  Box,
  Stack,
  Inline,
  Card,
  Headline,
  Text,
  Button,
  TextField,
  TextArea,
  NumberField,
  Select,
  ComboBox,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Switch,
  DatePicker,
  TimeField,
  Accordion,
  FileField,
} from '@marigold/components';

const JOB_TITLES = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];
const DIETARY = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];
const TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];
const TSHIRT = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
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

const STEP_TITLES: Record<number, string> = {
  1: 'Personal Information',
  2: 'Event Details',
  3: 'Preferences',
  4: 'Review & Confirm',
};

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

const pillCss = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: '#eef2ff',
  border: '1px solid #c7d2fe',
  borderRadius: '16px',
  padding: '2px 4px 2px 12px',
};

const Banner = ({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: 'info' | 'success';
}) => (
  <Box
    css={{
      backgroundColor: tone === 'success' ? '#e6f4ea' : '#e8f1fb',
      border: '1px solid',
      borderColor: tone === 'success' ? '#34a853' : '#1a73e8',
      borderRadius: '6px',
      padding: '12px 16px',
    }}
  >
    <Text>{children}</Text>
  </Box>
);

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  // Step 1 — Personal information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  // Step 2 — Event details
  const [eventDate, setEventDate] = useState<any>(null);
  const [timeSlot, setTimeSlot] = useState<any>(null);
  const [track, setTrack] = useState('');
  const [dietary, setDietary] = useState('');
  const [guests, setGuests] = useState(0);
  const [special, setSpecial] = useState('');

  // Step 3 — Preferences
  const [tshirt, setTshirt] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [comms, setComms] = useState<string[]>([]);
  const [a11y, setA11y] = useState(false);
  const [a11yDetails, setA11yDetails] = useState('');

  // Step 4 — Review & confirm
  const [terms, setTerms] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [toast, setToast] = useState(false);

  const handlePhoto = (value: any) => {
    if (!value) return;
    let file: any;
    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      file = value[0];
    } else if (Array.isArray(value)) {
      file = value[0];
    } else if (value.target && value.target.files) {
      file = value.target.files[0];
    } else {
      file = value[0] ?? value;
    }
    if (file && file.name) {
      setPhotoName(file.name);
      try {
        setPhotoURL(URL.createObjectURL(file));
      } catch {
        setPhotoURL('');
      }
    }
  };

  const step1Valid = fullName.trim() !== '' && emailValid(email);
  const step2Valid = eventDate != null;
  const canProceed = step === 1 ? step1Valid : step === 2 ? step2Valid : true;

  const handleNext = () => {
    if (!canProceed) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => {
    setShowErrors(false);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    if (!terms) return;
    setSubmitting(true);
    setTimeout(() => {
      const num =
        'REG-' +
        Date.now().toString(36).toUpperCase() +
        '-' +
        Math.floor(Math.random() * 9000 + 1000);
      setConfirmation(num);
      setSubmitting(false);
      setSubmitted(true);
      setToast(true);
      setTimeout(() => setToast(false), 4000);
    }, 1000);
  };

  const resetAll = () => {
    setStep(1);
    setShowErrors(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setJobTitle('');
    setPhotoName('');
    setPhotoURL('');
    setEventDate(null);
    setTimeSlot(null);
    setTrack('');
    setDietary('');
    setGuests(0);
    setSpecial('');
    setTshirt('');
    setTopics([]);
    setComms([]);
    setA11y(false);
    setA11yDetails('');
    setTerms(false);
    setSubmitting(false);
    setSubmitted(false);
    setConfirmation('');
    setToast(false);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <Stack space={5}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            isRequired
            isInvalid={showErrors && fullName.trim() === ''}
            errorMessage={
              showErrors && fullName.trim() === ''
                ? 'Full name is required.'
                : undefined
            }
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            isRequired
            isInvalid={showErrors && !emailValid(email)}
            errorMessage={
              showErrors && !emailValid(email)
                ? 'Enter a valid email address.'
                : undefined
            }
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
            {JOB_TITLES.map((j) => (
              <ComboBox.Item key={j} id={j}>
                {j}
              </ComboBox.Item>
            ))}
          </ComboBox>
          <Stack space={2}>
            <FileField
              label="Profile Photo"
              accept="image/*"
              acceptedFileTypes={['image/*']}
              onChange={handlePhoto}
              onSelect={handlePhoto}
            />
            {photoURL ? (
              <img
                src={photoURL}
                alt={photoName || 'Profile preview'}
                style={{ maxWidth: '120px', borderRadius: '8px' }}
              />
            ) : null}
          </Stack>
          <Banner tone="info">
            Your information will only be used for this event.
          </Banner>
        </Stack>
      );
    }

    if (step === 2) {
      return (
        <Stack space={5}>
          <DatePicker
            label="Event Date"
            value={eventDate}
            onChange={setEventDate}
            isRequired
            isInvalid={showErrors && eventDate == null}
            errorMessage={
              showErrors && eventDate == null
                ? 'Event date is required.'
                : undefined
            }
          />
          <TimeField
            label="Preferred Time Slot"
            value={timeSlot}
            onChange={setTimeSlot}
          />
          <RadioGroup label="Session Track" value={track} onChange={setTrack}>
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
            {DIETARY.map((d) => (
              <ComboBox.Item key={d} id={d}>
                {d}
              </ComboBox.Item>
            ))}
          </ComboBox>
          <NumberField
            label="Number of Guests"
            value={guests}
            onChange={(v: number) => setGuests(Number.isNaN(v) ? 0 : v)}
            minValue={0}
            maxValue={5}
          />
          <TextArea
            label="Special Requests"
            value={special}
            onChange={setSpecial}
          />
        </Stack>
      );
    }

    if (step === 3) {
      return (
        <Stack space={5}>
          <Select
            label="T-Shirt Size"
            placeholder="Select a size"
            selectedKey={tshirt || null}
            onSelectionChange={(k: any) => setTshirt(String(k))}
          >
            {TSHIRT.map((s) => (
              <Select.Option key={s} id={s}>
                {s}
              </Select.Option>
            ))}
          </Select>

          <Stack space={2}>
            <Text>Topics of Interest</Text>
            <Inline space={2}>
              {topics.length === 0 ? (
                <Text>No topics added yet.</Text>
              ) : (
                topics.map((t) => (
                  <Box key={t} css={pillCss}>
                    <Text>{t}</Text>
                    <Button
                      variant="text"
                      aria-label={`Remove ${t}`}
                      onPress={() =>
                        setTopics(topics.filter((x) => x !== t))
                      }
                    >
                      ×
                    </Button>
                  </Box>
                ))
              )}
            </Inline>
            <Inline space={2}>
              {TOPIC_SUGGESTIONS.filter((s) => !topics.includes(s)).map((s) => (
                <Button
                  key={s}
                  variant="secondary"
                  onPress={() => setTopics([...topics, s])}
                >
                  + {s}
                </Button>
              ))}
            </Inline>
          </Stack>

          <CheckboxGroup
            label="Communication Preferences"
            value={comms}
            onChange={setComms}
          >
            {COMM_OPTIONS.map((o) => (
              <Checkbox key={o.value} value={o.value}>
                {o.label}
              </Checkbox>
            ))}
          </CheckboxGroup>

          <Stack space={2}>
            <Switch isSelected={a11y} onChange={setA11y}>
              I have accessibility requirements
            </Switch>
            {a11y ? (
              <TextArea
                label="Accessibility details"
                value={a11yDetails}
                onChange={setA11yDetails}
              />
            ) : null}
          </Stack>
        </Stack>
      );
    }

    // step 4
    return (
      <Stack space={5}>
        <Accordion defaultExpandedKeys={['personal', 'event', 'prefs']}>
          <Accordion.Item key="personal" id="personal" title="Personal Information">
            <Stack space={1}>
              <Text>Name: {fullName || '—'}</Text>
              <Text>Email: {email || '—'}</Text>
              <Text>Phone: {phone || '—'}</Text>
              <Text>Company: {company || '—'}</Text>
              <Text>Job Title: {jobTitle || '—'}</Text>
            </Stack>
          </Accordion.Item>
          <Accordion.Item key="event" id="event" title="Event Details">
            <Stack space={1}>
              <Text>Date: {eventDate ? eventDate.toString() : '—'}</Text>
              <Text>Time: {timeSlot ? timeSlot.toString() : '—'}</Text>
              <Text>Track: {track || '—'}</Text>
              <Text>Dietary: {dietary || '—'}</Text>
              <Text>Guests: {guests}</Text>
            </Stack>
          </Accordion.Item>
          <Accordion.Item key="prefs" id="prefs" title="Preferences">
            <Stack space={1}>
              <Text>T-Shirt Size: {tshirt || '—'}</Text>
              <Text>Topics: {topics.length ? topics.join(', ') : '—'}</Text>
              <Text>
                Communication:{' '}
                {comms.length
                  ? comms
                      .map(
                        (c) =>
                          COMM_OPTIONS.find((o) => o.value === c)?.label ?? c
                      )
                      .join(', ')
                  : '—'}
              </Text>
            </Stack>
          </Accordion.Item>
        </Accordion>

        <Checkbox isSelected={terms} onChange={setTerms}>
          I agree to the terms and conditions
        </Checkbox>
      </Stack>
    );
  };

  let body;
  if (submitted) {
    body = (
      <Card>
        <Stack space={5}>
          <Banner tone="success">Registration confirmed!</Banner>
          <Box
            css={{
              border: '1px solid #d0d7de',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <Stack space={2}>
              <Headline level={3}>Registration Summary</Headline>
              <Text>Name: {fullName || '—'}</Text>
              <Text>Email: {email || '—'}</Text>
              <Text>Event Date: {eventDate ? eventDate.toString() : '—'}</Text>
              <Text>Confirmation Number: {confirmation}</Text>
            </Stack>
          </Box>
          <Button variant="primary" onPress={resetAll}>
            Register Another
          </Button>
        </Stack>
      </Card>
    );
  } else if (submitting) {
    body = (
      <Card>
        <Box css={{ padding: '40px', textAlign: 'center' }}>
          <Stack space={3} alignX="center">
            <Text>Submitting your registration…</Text>
          </Stack>
        </Box>
      </Card>
    );
  } else {
    body = (
      <Card>
        <Stack space={5}>
          <Headline level={2}>
            {`Step ${step} of 4 — ${STEP_TITLES[step]}`}
          </Headline>

          {renderStep()}

          <Box
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
            }}
          >
            <Button
              variant="secondary"
              onPress={handleBack}
              isDisabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button variant="primary" onPress={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                onPress={handleSubmit}
                isDisabled={!terms || submitting}
              >
                Submit Registration
              </Button>
            )}
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <Box css={{ maxWidth: '760px', margin: '0 auto', padding: '24px' }}>
      {body}
      {toast ? (
        <Box
          css={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#323232',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          Registration submitted successfully
        </Box>
      ) : null}
    </Box>
  );
};

export default TestApp;
