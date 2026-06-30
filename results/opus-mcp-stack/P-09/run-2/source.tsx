import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  DatePicker,
  FileField,
  Headline,
  Inline,
  Loader,
  NumberField,
  Radio,
  RadioGroup,
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
import type { TimeValue } from '@marigold/components';

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

const TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];

const DIETARY = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TOPICS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const COMM_PREFS = [
  'Email updates about the event',
  'SMS reminders',
  'Post-event survey',
  'Newsletter subscription',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  photoName: '',
  photoUrl: null as string | null,
  eventDate: null as DateValue | null,
  timeSlot: null as TimeValue | null,
  track: '',
  dietary: '',
  guests: 0,
  specialRequests: '',
  shirtSize: null as string | null,
  topics: [] as string[],
  commPrefs: [] as string[],
  accessibility: false,
  accessibilityDetails: '',
  agreed: false,
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <Inline space={4} alignY="center">
    <Text weight="medium">{label}</Text>
    <Split />
    <Text>{value && value.length > 0 ? value : '—'}</Text>
  </Inline>
);

const RegistrationForm = () => {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const [form, setForm] = useState(initialState);
  const update = <K extends keyof typeof initialState>(
    key: K,
    value: (typeof initialState)[K]
  ) => setForm(prev => ({ ...prev, [key]: value }));

  const nameError = showErrors && form.fullName.trim().length === 0;
  const emailError = showErrors && !EMAIL_RE.test(form.email);
  const dateError = showErrors && form.eventDate == null;

  const validateStep = () => {
    if (step === 1) {
      return form.fullName.trim().length > 0 && EMAIL_RE.test(form.email);
    }
    if (step === 2) {
      return form.eventDate != null;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
      return;
    }
    if (!validateStep()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setShowErrors(false);
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setLoading(true);
    window.setTimeout(() => {
      const code =
        'REG-2026-' +
        Math.random().toString(36).slice(2, 7).toUpperCase();
      setConfirmation(code);
      setLoading(false);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    }, 1000);
  };

  const handleReset = () => {
    setForm(initialState);
    setStep(1);
    setShowErrors(false);
    setSubmitted(false);
    setLoading(false);
    setConfirmation('');
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      update('photoName', file.name);
      update('photoUrl', URL.createObjectURL(file));
    }
  };

  const formatDate = (date: DateValue | null) =>
    date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : '';

  const formatTime = (time: TimeValue | null) =>
    time
      ? `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
      : '';

  // --- Success view ---
  if (submitted) {
    return (
      <Card>
        {loading ? (
          <Stack space={6} alignX="center">
            <Loader />
            <Text>Submitting your registration…</Text>
          </Stack>
        ) : (
          <Stack space={6}>
            <SectionMessage variant="success">
              <SectionMessage.Title>
                Registration confirmed!
              </SectionMessage.Title>
              <SectionMessage.Content>
                Thank you for registering. A confirmation has been generated
                below.
              </SectionMessage.Content>
            </SectionMessage>

            <Card variant="default">
              <Stack space={3}>
                <Headline level={3}>Confirmation Summary</Headline>
                <ReviewRow label="Name" value={form.fullName} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow
                  label="Event Date"
                  value={formatDate(form.eventDate)}
                />
                <ReviewRow label="Confirmation Number" value={confirmation} />
              </Stack>
            </Card>

            <Inline space={3}>
              <Button variant="primary" onPress={handleReset}>
                Register Another
              </Button>
            </Inline>
          </Stack>
        )}
      </Card>
    );
  }

  // --- Step content ---
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Stack space={5}>
            <TextField
              label="Full Name"
              required
              value={form.fullName}
              onChange={value => update('fullName', value)}
              error={nameError}
              errorMessage="Please enter your full name."
            />
            <TextField
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={value => update('email', value)}
              error={emailError}
              errorMessage="Please enter a valid email address."
            />
            <TextField
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={value => update('phone', value)}
            />
            <TextField
              label="Company / Organization"
              value={form.company}
              onChange={value => update('company', value)}
            />
            <ComboBox
              label="Job Title"
              allowsCustomValue
              menuTrigger="focus"
              value={form.jobTitle}
              onChange={value => update('jobTitle', value)}
            >
              {JOB_TITLES.map(title => (
                <ComboBox.Option key={title} id={title}>
                  {title}
                </ComboBox.Option>
              ))}
            </ComboBox>

            <Stack space={2}>
              <div onChange={handlePhotoChange}>
                <FileField label="Profile Photo" accept={['image/*']} />
              </div>
              {form.photoUrl && (
                <Inline space={3} alignY="center">
                  <img
                    src={form.photoUrl}
                    alt="Profile preview"
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-surface, 8px)',
                    }}
                  />
                  <Text size="small" variant="muted">
                    {form.photoName}
                  </Text>
                </Inline>
              )}
            </Stack>

            <SectionMessage variant="info">
              <SectionMessage.Content>
                Your information will only be used for this event.
              </SectionMessage.Content>
            </SectionMessage>
          </Stack>
        );

      case 2:
        return (
          <Stack space={5}>
            <DatePicker
              label="Event Date"
              required
              value={form.eventDate}
              onChange={value => update('eventDate', value)}
              error={dateError}
              errorMessage="Please choose an event date."
            />
            <TimeField
              label="Preferred Time Slot"
              value={form.timeSlot}
              onChange={value => update('timeSlot', value)}
            />
            <RadioGroup
              label="Session Track"
              value={form.track}
              onChange={value => update('track', value)}
            >
              {TRACKS.map(track => (
                <Radio key={track} value={track}>
                  {track}
                </Radio>
              ))}
            </RadioGroup>
            <ComboBox
              label="Dietary Requirements"
              allowsCustomValue
              menuTrigger="focus"
              description="Choose an option or type your own."
              value={form.dietary}
              onChange={value => update('dietary', value)}
            >
              {DIETARY.map(option => (
                <ComboBox.Option key={option} id={option}>
                  {option}
                </ComboBox.Option>
              ))}
            </ComboBox>
            <NumberField
              label="Number of Guests"
              minValue={0}
              maxValue={5}
              width="1/4"
              value={form.guests}
              onChange={value =>
                update('guests', Number.isNaN(value) ? 0 : value)
              }
            />
            <TextArea
              label="Special Requests"
              rows={4}
              value={form.specialRequests}
              onChange={value => update('specialRequests', value)}
            />
          </Stack>
        );

      case 3:
        return (
          <Stack space={5}>
            <Select
              label="T-Shirt Size"
              selectedKey={form.shirtSize}
              onSelectionChange={key => update('shirtSize', key as string)}
            >
              {SHIRT_SIZES.map(size => (
                <Select.Option key={size} id={size}>
                  {size}
                </Select.Option>
              ))}
            </Select>
            <TagField
              label="Topics of Interest"
              placeholder="Add topics…"
              value={form.topics}
              onChange={value => update('topics', value.map(String))}
            >
              {TOPICS.map(topic => (
                <TagField.Option key={topic} id={topic}>
                  {topic}
                </TagField.Option>
              ))}
            </TagField>
            <CheckboxGroup
              label="Communication Preferences"
              value={form.commPrefs}
              onChange={value => update('commPrefs', value)}
            >
              {COMM_PREFS.map(pref => (
                <Checkbox key={pref} value={pref} label={pref} />
              ))}
            </CheckboxGroup>
            <Stack space={3}>
              <Switch
                label="I have accessibility requirements"
                selected={form.accessibility}
                onChange={value => update('accessibility', value)}
              />
              {form.accessibility && (
                <TextArea
                  label="Accessibility Details"
                  rows={3}
                  value={form.accessibilityDetails}
                  onChange={value => update('accessibilityDetails', value)}
                />
              )}
            </Stack>
          </Stack>
        );

      case 4:
        return (
          <Stack space={5}>
            <Accordion
              allowsMultipleExpanded
              defaultExpandedKeys={['personal', 'event', 'prefs']}
            >
              <Accordion.Item id="personal">
                <Accordion.Header>Personal Information</Accordion.Header>
                <Accordion.Content>
                  <Stack space={3}>
                    <ReviewRow label="Name" value={form.fullName} />
                    <ReviewRow label="Email" value={form.email} />
                    <ReviewRow label="Phone" value={form.phone} />
                    <ReviewRow label="Company" value={form.company} />
                    <ReviewRow label="Job Title" value={form.jobTitle} />
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="event">
                <Accordion.Header>Event Details</Accordion.Header>
                <Accordion.Content>
                  <Stack space={3}>
                    <ReviewRow
                      label="Date"
                      value={formatDate(form.eventDate)}
                    />
                    <ReviewRow label="Time" value={formatTime(form.timeSlot)} />
                    <ReviewRow label="Track" value={form.track} />
                    <ReviewRow label="Dietary" value={form.dietary} />
                    <ReviewRow label="Guests" value={String(form.guests)} />
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="prefs">
                <Accordion.Header>Preferences</Accordion.Header>
                <Accordion.Content>
                  <Stack space={3}>
                    <ReviewRow
                      label="T-Shirt Size"
                      value={form.shirtSize ?? ''}
                    />
                    <ReviewRow
                      label="Topics"
                      value={form.topics.join(', ')}
                    />
                    <ReviewRow
                      label="Communication"
                      value={form.commPrefs.join(', ')}
                    />
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>

            <Checkbox
              label="I agree to the terms and conditions"
              checked={form.agreed}
              onChange={value => update('agreed', value)}
            />
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <Stack space={6}>
        <Headline level={2}>
          {`Step ${step} of 4 — ${STEP_TITLES[step - 1]}`}
        </Headline>

        {renderStep()}

        <Inline space={3} alignY="center">
          <Button
            variant="secondary"
            disabled={step === 1}
            onPress={handleBack}
          >
            Back
          </Button>
          <Split />
          <Button
            variant="primary"
            disabled={step === 4 && !form.agreed}
            onPress={handleNext}
          >
            {step === 4 ? 'Submit Registration' : 'Next'}
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <div
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: 'var(--spacing-6, 24px)',
      }}
    >
      <RegistrationForm />
    </div>
  </>
);

export default TestApp;
