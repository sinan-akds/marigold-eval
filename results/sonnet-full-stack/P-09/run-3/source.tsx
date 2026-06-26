import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  AppLayout,
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

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const JOB_TITLE_SUGGESTIONS = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];
const SESSION_TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];
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
const COMM_PREF_OPTIONS = [
  { value: 'email-updates', label: 'Email updates about the event' },
  { value: 'sms-reminders', label: 'SMS reminders' },
  { value: 'post-survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  eventDate: DateValue | null;
  preferredTimeSlot: TimeValue | null;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: (string | number)[];
  communicationPrefs: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
  termsAgreed: boolean;
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: null,
  preferredTimeSlot: null,
  sessionTrack: '',
  dietaryRequirements: '',
  numberOfGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topicsOfInterest: [],
  communicationPrefs: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
  termsAgreed: false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateConfirmationNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = () => chars[Math.floor(Math.random() * chars.length)];
  return `EVT-${rand()}${rand()}${rand()}${rand()}-${rand()}${rand()}${rand()}${rand()}`;
}

function formatDate(d: DateValue | null): string {
  if (!d) return '—';
  return `${d.month}/${d.day}/${d.year}`;
}

function formatTime(t: TimeValue | null): string {
  if (!t) return '—';
  const h = t.hour;
  const m = String(t.minute).padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${period}`;
}

// ---------------------------------------------------------------------------
// Success View
// ---------------------------------------------------------------------------

interface SuccessViewProps {
  form: FormState;
  confirmationNumber: string;
  onReset: () => void;
}

function SuccessView({ form, confirmationNumber, onReset }: SuccessViewProps) {
  return (
    <Stack space={6}>
      <SectionMessage variant="success">
        <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
        <SectionMessage.Content>
          Your registration has been successfully submitted. Check your email for details.
        </SectionMessage.Content>
      </SectionMessage>
      <Card>
        <Stack space={4}>
          <Headline level={3}>Registration Summary</Headline>
          <Stack space={2}>
            <Inline space={2}>
              <Text weight="bold">Name:</Text>
              <Text>{form.fullName}</Text>
            </Inline>
            <Inline space={2}>
              <Text weight="bold">Email:</Text>
              <Text>{form.email}</Text>
            </Inline>
            <Inline space={2}>
              <Text weight="bold">Event Date:</Text>
              <Text>{formatDate(form.eventDate)}</Text>
            </Inline>
            <Inline space={2}>
              <Text weight="bold">Confirmation Number:</Text>
              <Text>{confirmationNumber}</Text>
            </Inline>
          </Stack>
          <Button variant="primary" onPress={onReset}>
            Register Another
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Personal Information
// ---------------------------------------------------------------------------

interface Step1Props {
  form: FormState;
  errors: Record<string, string>;
  photoPreviewUrl: string | null;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onPhotoCapture: (url: string) => void;
}

function Step1({ form, errors, photoPreviewUrl, onChange, onPhotoCapture }: Step1Props) {
  return (
    <Stack space={4}>
      <TextField
        label="Full Name"
        required
        value={form.fullName}
        onChange={(v) => onChange('fullName', v)}
        error={!!errors.fullName}
        errorMessage={errors.fullName}
      />
      <TextField
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(v) => onChange('email', v)}
        error={!!errors.email}
        errorMessage={errors.email}
      />
      <TextField
        label="Phone Number"
        type="tel"
        value={form.phone}
        onChange={(v) => onChange('phone', v)}
      />
      <TextField
        label="Company / Organization"
        value={form.company}
        onChange={(v) => onChange('company', v)}
      />
      <ComboBox
        label="Job Title"
        allowsCustomValue
        value={form.jobTitle}
        onChange={(v) => onChange('jobTitle', v)}
      >
        {JOB_TITLE_SUGGESTIONS.map((t) => (
          <ComboBox.Option key={t} id={t}>
            {t}
          </ComboBox.Option>
        ))}
      </ComboBox>
      <FileField
        label="Profile Photo"
        accept={['image/*']}
        onDrop={async (e) => {
          const fileItems = e.items.filter((item: any) => item.kind === 'file');
          if (fileItems.length > 0) {
            const file = await (fileItems[0] as any).getFile();
            onChange('profilePhoto', file);
            onPhotoCapture(URL.createObjectURL(file));
          }
        }}
      />
      {photoPreviewUrl && (
        <img
          src={photoPreviewUrl}
          alt="Profile photo preview"
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: '50%',
            display: 'block',
          }}
        />
      )}
      <SectionMessage variant="info">
        <SectionMessage.Content>
          Your information will only be used for this event.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Event Details
// ---------------------------------------------------------------------------

interface Step2Props {
  form: FormState;
  errors: Record<string, string>;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function Step2({ form, errors, onChange }: Step2Props) {
  return (
    <Stack space={4}>
      <DatePicker
        label="Event Date"
        required
        value={form.eventDate}
        onChange={(v) => onChange('eventDate', v)}
        error={!!errors.eventDate}
        errorMessage={errors.eventDate}
      />
      <TimeField
        label="Preferred Time Slot"
        value={form.preferredTimeSlot}
        onChange={(v) => onChange('preferredTimeSlot', v)}
      />
      <RadioGroup
        label="Session Track"
        value={form.sessionTrack}
        onChange={(v) => onChange('sessionTrack', v)}
      >
        {SESSION_TRACKS.map((track) => (
          <Radio key={track} value={track}>
            {track}
          </Radio>
        ))}
      </RadioGroup>
      <ComboBox
        label="Dietary Requirements"
        allowsCustomValue
        menuTrigger="focus"
        value={form.dietaryRequirements}
        onChange={(v) => onChange('dietaryRequirements', v)}
      >
        {DIETARY_OPTIONS.map((d) => (
          <ComboBox.Option key={d} id={d}>
            {d}
          </ComboBox.Option>
        ))}
      </ComboBox>
      <NumberField
        label="Number of Guests"
        minValue={0}
        maxValue={5}
        value={form.numberOfGuests}
        onChange={(v) => onChange('numberOfGuests', v)}
        width="1/4"
      />
      <TextArea
        label="Special Requests"
        value={form.specialRequests}
        onChange={(v) => onChange('specialRequests', v)}
        rows={4}
      />
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Preferences
// ---------------------------------------------------------------------------

interface Step3Props {
  form: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function Step3({ form, onChange }: Step3Props) {
  return (
    <Stack space={4}>
      <Select
        label="T-Shirt Size"
        selectedKey={form.tshirtSize || null}
        onSelectionChange={(k) => onChange('tshirtSize', String(k))}
        placeholder="Select a size"
      >
        {TSHIRT_SIZES.map((s) => (
          <Select.Option key={s} id={s}>
            {s}
          </Select.Option>
        ))}
      </Select>
      <TagField
        label="Topics of Interest"
        value={form.topicsOfInterest}
        onChange={(keys) => onChange('topicsOfInterest', keys)}
      >
        {TOPIC_SUGGESTIONS.map((t) => (
          <TagField.Option key={t} id={t}>
            {t}
          </TagField.Option>
        ))}
      </TagField>
      <CheckboxGroup
        label="Communication Preferences"
        value={form.communicationPrefs}
        onChange={(v) => onChange('communicationPrefs', v)}
      >
        {COMM_PREF_OPTIONS.map((p) => (
          <Checkbox key={p.value} value={p.value} label={p.label} />
        ))}
      </CheckboxGroup>
      <Switch
        label="I have accessibility requirements"
        selected={form.hasAccessibilityNeeds}
        onChange={(v: boolean) => onChange('hasAccessibilityNeeds', v)}
      />
      {form.hasAccessibilityNeeds && (
        <TextArea
          label="Accessibility Details"
          value={form.accessibilityDetails}
          onChange={(v) => onChange('accessibilityDetails', v)}
          rows={3}
          description="Please describe your accessibility needs."
        />
      )}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Review & Confirm
// ---------------------------------------------------------------------------

interface Step4Props {
  form: FormState;
  errors: Record<string, string>;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function Step4({ form, errors, onChange }: Step4Props) {
  const commLabels = form.communicationPrefs
    .map((v) => COMM_PREF_OPTIONS.find((o) => o.value === v)?.label ?? v)
    .join(', ');

  return (
    <Stack space={6}>
      <Accordion variant="card">
        <Accordion.Item id="personal">
          <Accordion.Header>Personal Information</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <Inline space={2}>
                <Text weight="bold">Name:</Text>
                <Text>{form.fullName || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Email:</Text>
                <Text>{form.email || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Phone:</Text>
                <Text>{form.phone || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Company:</Text>
                <Text>{form.company || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Job Title:</Text>
                <Text>{form.jobTitle || '—'}</Text>
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="event">
          <Accordion.Header>Event Details</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <Inline space={2}>
                <Text weight="bold">Date:</Text>
                <Text>{formatDate(form.eventDate)}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Time:</Text>
                <Text>{formatTime(form.preferredTimeSlot)}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Track:</Text>
                <Text>{form.sessionTrack || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Dietary:</Text>
                <Text>{form.dietaryRequirements || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Guests:</Text>
                <Text>{String(form.numberOfGuests)}</Text>
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="preferences">
          <Accordion.Header>Preferences</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <Inline space={2}>
                <Text weight="bold">T-Shirt Size:</Text>
                <Text>{form.tshirtSize || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Topics:</Text>
                <Text>
                  {form.topicsOfInterest.length > 0
                    ? form.topicsOfInterest.join(', ')
                    : '—'}
                </Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Communication:</Text>
                <Text>{commLabels || '—'}</Text>
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <Checkbox
        label="I agree to the terms and conditions"
        required
        checked={form.termsAgreed}
        onChange={(v: boolean) => onChange('termsAgreed', v)}
        error={!!errors.termsAgreed}
      />
      {errors.termsAgreed && <Text>{errors.termsAgreed}</Text>}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Main Registration Form
// ---------------------------------------------------------------------------

function RegistrationForm() {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validateStep(s: number): Record<string, string> {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
      if (!form.email.trim()) errs.email = 'Email address is required.';
      else if (!validateEmail(form.email)) errs.email = 'Please enter a valid email address.';
    }
    if (s === 2) {
      if (!form.eventDate) errs.eventDate = 'Event date is required.';
    }
    return errs;
  }

  function handleNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
  }

  async function handleSubmit() {
    if (!form.termsAgreed) {
      setErrors({ termsAgreed: 'You must agree to the terms and conditions.' });
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const confNum = generateConfirmationNumber();
    setConfirmationNumber(confNum);
    setIsSubmitting(false);
    setIsSubmitted(true);
    addToast({ title: 'Registration submitted successfully', variant: 'success' });
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setPhotoPreviewUrl(null);
    setErrors({});
    setStep(1);
    setIsSubmitted(false);
    setConfirmationNumber('');
  }

  if (isSubmitting) {
    return (
      <Card>
        <Stack space={6} alignX="center">
          <Text>Submitting your registration…</Text>
          <Loader />
        </Stack>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <SuccessView
        form={form}
        confirmationNumber={confirmationNumber}
        onReset={handleReset}
      />
    );
  }

  return (
    <Card>
      <Stack space={6}>
        {/* Step header */}
        <Stack space={1}>
          <Text>
            Step {step} of {STEP_TITLES.length}
          </Text>
          <Headline level={2}>
            {STEP_TITLES[step - 1]}
          </Headline>
        </Stack>

        {/* Step content */}
        {step === 1 && (
          <Step1
            form={form}
            errors={errors}
            photoPreviewUrl={photoPreviewUrl}
            onChange={updateForm}
            onPhotoCapture={setPhotoPreviewUrl}
          />
        )}
        {step === 2 && (
          <Step2 form={form} errors={errors} onChange={updateForm} />
        )}
        {step === 3 && (
          <Step3 form={form} onChange={updateForm} />
        )}
        {step === 4 && (
          <Step4 form={form} errors={errors} onChange={updateForm} />
        )}

        {/* Navigation */}
        <Inline space={4} alignX="right">
          <Button variant="secondary" onPress={handleBack} disabled={step === 1}>
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
              disabled={!form.termsAgreed}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

export default function TestApp() {
  return (
    <>
      <ToastProvider position="bottom-right" />
      <AppLayout>
        <AppLayout.Main>
          <Stack space={6}>
            <Headline level={1}>Event Registration</Headline>
            <RegistrationForm />
          </Stack>
        </AppLayout.Main>
      </AppLayout>
    </>
  );
}
