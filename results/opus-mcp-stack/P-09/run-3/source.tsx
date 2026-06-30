import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  ComboBox,
  DatePicker,
  FileField,
  Form,
  Headline,
  Inline,
  Loader,
  NumberField,
  Radio,
  SectionMessage,
  Select,
  Split,
  Stack,
  Switch,
  TagField,
  Text,
  TextArea,
  TextField,
  TimeField,
  ToastProvider,
  useToast,
} from '@marigold/components';

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const JOB_TITLES = [
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

const TOPICS = [
  { id: 'ai-ml', name: 'AI/ML' },
  { id: 'web', name: 'Web Development' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'security', name: 'Security' },
  { id: 'devops', name: 'DevOps' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'data', name: 'Data Science' },
];

const COMMUNICATION_OPTIONS = [
  { value: 'email', label: 'Email updates about the event' },
  { value: 'sms', label: 'SMS reminders' },
  { value: 'survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pad = (n: number) => String(n).padStart(2, '0');

type Errors = {
  fullName?: string;
  email?: string;
  eventDate?: string;
};

const RegistrationForm = () => {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const clearError = (field: keyof Errors) =>
    setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev));

  // Step 1 — Personal information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  // Step 2 — Event details
  const [eventDate, setEventDate] = useState<DateValue | null>(null);
  const [timeSlot, setTimeSlot] = useState<any>(null);
  const [track, setTrack] = useState('');
  const [dietary, setDietary] = useState('');
  const [guests, setGuests] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 3 — Preferences
  const [tshirt, setTshirt] = useState<string | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [comms, setComms] = useState<string[]>([]);
  const [a11y, setA11y] = useState(false);
  const [a11yDetails, setA11yDetails] = useState('');

  // Step 4 — Confirm
  const [terms, setTerms] = useState(false);

  const dateText = eventDate
    ? `${eventDate.year}-${pad(eventDate.month)}-${pad(eventDate.day)}`
    : '—';
  const timeText = timeSlot
    ? `${pad(timeSlot.hour)}:${pad(timeSlot.minute)}`
    : '—';
  const topicNames = topics
    .map(id => TOPICS.find(t => t.id === id)?.name ?? String(id))
    .join(', ');
  const commNames = comms
    .map(v => COMMUNICATION_OPTIONS.find(c => c.value === v)?.label ?? v)
    .join(', ');

  const handlePhoto = (files: any) => {
    const list = files?.length ? files : files ? [files] : [];
    const file = list[0];
    if (file) {
      setPhotoName(file.name);
      try {
        setPhotoUrl(URL.createObjectURL(file));
      } catch {
        setPhotoUrl(null);
      }
    } else {
      setPhotoName(null);
      setPhotoUrl(null);
    }
  };

  const validateStep = (current: number): boolean => {
    const next: Errors = {};
    if (current === 1) {
      if (!fullName.trim()) next.fullName = 'Full name is required.';
      if (!email.trim()) {
        next.email = 'Email is required.';
      } else if (!EMAIL_RE.test(email.trim())) {
        next.email = 'Enter a valid email address.';
      }
    }
    if (current === 2) {
      if (!eventDate) next.eventDate = 'Event date is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (step < 4) {
      if (validateStep(step)) {
        setStep(step + 1);
      }
      return;
    }
    handleSubmit();
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    const code = `EVT-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.floor(
      Math.random() * 900 + 100
    )}`;
    setConfirmation(code);
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    }, 1000);
  };

  const handleReset = () => {
    setStep(1);
    setErrors({});
    setSubmitted(false);
    setLoading(false);
    setConfirmation('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setJobTitle('');
    setPhotoUrl(null);
    setPhotoName(null);
    setEventDate(null);
    setTimeSlot(null);
    setTrack('');
    setDietary('');
    setGuests(0);
    setSpecialRequests('');
    setTshirt(null);
    setTopics([]);
    setComms([]);
    setA11y(false);
    setA11yDetails('');
    setTerms(false);
  };

  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <Inline space={2} alignY="baseline">
      <Text weight="bold">{label}:</Text>
      <Text>{value || '—'}</Text>
    </Inline>
  );

  const renderForm = () => (
    <Stack space={6}>
      <Stack space={1}>
        <Text variant="muted" weight="medium">
          Step {step} of 4
        </Text>
        <Headline level={2}>{STEP_TITLES[step - 1]}</Headline>
      </Stack>

      <Form onSubmit={e => e.preventDefault()}>
        {step === 1 && (
          <Stack space={5}>
            <SectionMessage variant="info">
              <SectionMessage.Title>Privacy notice</SectionMessage.Title>
              <SectionMessage.Content>
                Your information will only be used for this event.
              </SectionMessage.Content>
            </SectionMessage>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={v => {
                setFullName(v);
                clearError('fullName');
              }}
              required
              error={!!errors.fullName}
              errorMessage={errors.fullName}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={v => {
                setEmail(v);
                clearError('email');
              }}
              required
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
              menuTrigger="focus"
              allowsCustomValue
              value={jobTitle}
              onChange={setJobTitle}
              description="Pick a suggestion or type your own."
            >
              {JOB_TITLES.map(title => (
                <ComboBox.Option key={title} id={title}>
                  {title}
                </ComboBox.Option>
              ))}
            </ComboBox>
            <FileField
              label="Profile Photo"
              accept={['image/*']}
              onChange={handlePhoto}
            />
            {photoUrl && (
              <Stack space={1}>
                <Text size="sm" variant="muted">
                  Preview ({photoName})
                </Text>
                <img
                  src={photoUrl}
                  alt="Profile preview"
                  style={{
                    width: 96,
                    height: 96,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md, 8px)',
                  }}
                />
              </Stack>
            )}
          </Stack>
        )}

        {step === 2 && (
          <Stack space={5}>
            <DatePicker
              label="Event Date"
              value={eventDate}
              onChange={v => {
                setEventDate(v);
                clearError('eventDate');
              }}
              required
              error={!!errors.eventDate}
              errorMessage={errors.eventDate}
            />
            <TimeField
              label="Preferred Time Slot"
              value={timeSlot}
              onChange={setTimeSlot}
            />
            <Radio.Group label="Session Track" value={track} onChange={setTrack}>
              {TRACKS.map(t => (
                <Radio key={t} value={t}>
                  {t}
                </Radio>
              ))}
            </Radio.Group>
            <ComboBox
              label="Dietary Requirements"
              menuTrigger="focus"
              allowsCustomValue
              value={dietary}
              onChange={setDietary}
              description="Search the list or type a custom requirement."
            >
              {DIETARY_OPTIONS.map(option => (
                <ComboBox.Option key={option} id={option}>
                  {option}
                </ComboBox.Option>
              ))}
            </ComboBox>
            <NumberField
              label="Number of Guests"
              value={guests}
              onChange={setGuests}
              minValue={0}
              maxValue={5}
              width="1/3"
            />
            <TextArea
              label="Special Requests"
              value={specialRequests}
              onChange={setSpecialRequests}
              rows={4}
            />
          </Stack>
        )}

        {step === 3 && (
          <Stack space={5}>
            <Select
              label="T-Shirt Size"
              selectedKey={tshirt}
              onSelectionChange={key => setTshirt(key as string)}
              placeholder="Select a size"
              width="1/3"
            >
              {TSHIRT_SIZES.map(size => (
                <Select.Option key={size} id={size}>
                  {size}
                </Select.Option>
              ))}
            </Select>
            <TagField
              label="Topics of Interest"
              value={topics}
              onChange={setTopics}
              description="Add topics as tags."
            >
              {TOPICS.map(topic => (
                <TagField.Option key={topic.id} id={topic.id}>
                  {topic.name}
                </TagField.Option>
              ))}
            </TagField>
            <Checkbox.Group
              label="Communication Preferences"
              value={comms}
              onChange={setComms}
            >
              {COMMUNICATION_OPTIONS.map(option => (
                <Checkbox
                  key={option.value}
                  value={option.value}
                  label={option.label}
                />
              ))}
            </Checkbox.Group>
            <Stack space={3}>
              <Switch
                label="I have accessibility requirements"
                selected={a11y}
                onChange={setA11y}
              />
              {a11y && (
                <TextArea
                  label="Accessibility Needs"
                  value={a11yDetails}
                  onChange={setA11yDetails}
                  rows={3}
                  description="Tell us how we can support you."
                />
              )}
            </Stack>
          </Stack>
        )}

        {step === 4 && (
          <Stack space={5}>
            <Accordion defaultExpandedKeys={['personal']}>
              <Accordion.Item id="personal">
                <Accordion.Header>Personal Information</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2}>
                    <SummaryRow label="Name" value={fullName} />
                    <SummaryRow label="Email" value={email} />
                    <SummaryRow label="Phone" value={phone} />
                    <SummaryRow label="Company" value={company} />
                    <SummaryRow label="Job Title" value={jobTitle} />
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="event">
                <Accordion.Header>Event Details</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2}>
                    <SummaryRow label="Date" value={dateText} />
                    <SummaryRow label="Time" value={timeText} />
                    <SummaryRow label="Track" value={track} />
                    <SummaryRow label="Dietary" value={dietary} />
                    <SummaryRow label="Guests" value={String(guests)} />
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="preferences">
                <Accordion.Header>Preferences</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2}>
                    <SummaryRow label="T-Shirt Size" value={tshirt ?? ''} />
                    <SummaryRow label="Topics" value={topicNames} />
                    <SummaryRow
                      label="Communication"
                      value={commNames}
                    />
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <Checkbox
              checked={terms}
              onChange={setTerms}
              label="I agree to the terms and conditions"
            />
          </Stack>
        )}
      </Form>

      <Inline space={3} alignY="center">
        <Button
          variant="secondary"
          onPress={handleBack}
          disabled={step === 1}
        >
          Back
        </Button>
        <Split />
        <Button
          variant="primary"
          onPress={handleNext}
          disabled={step === 4 && !terms}
        >
          {step === 4 ? 'Submit Registration' : 'Next'}
        </Button>
      </Inline>
    </Stack>
  );

  const renderSuccess = () => (
    <Stack space={6}>
      <SectionMessage variant="success">
        <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
        <SectionMessage.Content>
          Thanks for registering. We've sent the details to your email.
        </SectionMessage.Content>
      </SectionMessage>
      <Card>
        <Stack space={3}>
          <Headline level={3}>Your registration</Headline>
          <SummaryRow label="Name" value={fullName} />
          <SummaryRow label="Email" value={email} />
          <SummaryRow label="Event Date" value={dateText} />
          <SummaryRow label="Confirmation #" value={confirmation} />
        </Stack>
      </Card>
      <Inline alignX="left">
        <Button variant="primary" onPress={handleReset}>
          Register Another
        </Button>
      </Inline>
    </Stack>
  );

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: 'var(--spacing-6, 24px)',
      }}
    >
      <ToastProvider position="bottom-right" />
      <Card>
        {loading ? (
          <Stack space={4} alignX="center">
            <Loader />
            <Text variant="muted">Submitting your registration…</Text>
          </Stack>
        ) : submitted ? (
          renderSuccess()
        ) : (
          renderForm()
        )}
      </Card>
    </div>
  );
};

const TestApp = () => <RegistrationForm />;

export default TestApp;
