import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Stack,
  Inline,
  Inset,
  Card,
  Headline,
  Text,
  SectionMessage,
  Loader,
  TextField,
  TextArea,
  NumberField,
  Select,
  DatePicker,
  TimeField,
  Checkbox,
  ComboBox,
  Radio,
  Switch,
  TagField,
  FileField,
  Accordion,
  Button,
  ToastProvider,
  useToast,
  Divider,
  Center,
  AppLayout,
  type TimeValue,
} from '@marigold/components';

// ── Types ──────────────────────────────────────────────────────────────────────

type FormData = {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhotoPreview: string;
  // Step 2
  eventDate: DateValue | null;
  timeSlot: TimeValue | null;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  // Step 3
  tshirtSize: string;
  topicsOfInterest: string[];
  communicationPrefs: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
  // Step 4
  termsAgreed: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

// ── Constants ──────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhotoPreview: '',
  eventDate: null,
  timeSlot: null,
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

const STEPS = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];
const TOPIC_OPTIONS = ['AI/ML', 'Web Development', 'Cloud', 'Security', 'DevOps', 'Mobile', 'Data Science'];
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const JOB_TITLES = ['Developer', 'Designer', 'Product Manager', 'Engineering Manager', 'CTO', 'Other'];

const COMM_PREFS = [
  { value: 'email-updates', label: 'Email updates about the event' },
  { value: 'sms-reminders', label: 'SMS reminders' },
  { value: 'post-survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

const SESSION_TRACKS = [
  { value: 'technical', label: 'Technical' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'workshop', label: 'Workshop' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const generateConfirmationNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'EVT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const formatDate = (date: DateValue | null): string => {
  if (!date) return '—';
  return `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
};

const formatTime = (time: TimeValue | null): string => {
  if (!time) return '—';
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ── Inner component (uses useToast) ────────────────────────────────────────────

const RegistrationForm = () => {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmNumber, setConfirmNumber] = useState('');
  const [reviewExpanded, setReviewExpanded] = useState<Set<string | number>>(
    new Set(['personal', 'event', 'preferences'])
  );

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (s: number): boolean => {
    const errs: FormErrors = {};
    if (s === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
      if (!formData.email.trim()) {
        errs.email = 'Email is required.';
      } else if (!isValidEmail(formData.email)) {
        errs.email = 'Please enter a valid email address.';
      }
    }
    if (s === 2) {
      if (!formData.eventDate) errs.eventDate = 'Event date is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate(step)) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!formData.termsAgreed) return;
    const num = generateConfirmationNumber();
    setConfirmNumber(num);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast({ title: 'Registration submitted successfully', variant: 'success' });
    }, 1000);
  };

  const handleReset = () => {
    setStep(1);
    setFormData(INITIAL_FORM);
    setErrors({});
    setLoading(false);
    setSubmitted(false);
    setConfirmNumber('');
    setReviewExpanded(new Set(['personal', 'event', 'preferences']));
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Center>
        <Inset space={8}>
          <Stack space={4} alignX="center">
            <Loader />
            <Text>Processing your registration…</Text>
          </Stack>
        </Inset>
      </Center>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Inset space={6}>
        <Stack space={6}>
          <SectionMessage variant="success">
            <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
            <SectionMessage.Content>
              Your registration has been successfully submitted.
            </SectionMessage.Content>
          </SectionMessage>

          <Card>
            <Inset spaceX="padding-regular" spaceY="padding-regular">
              <Stack space={3}>
                <Headline level="1">Registration Summary</Headline>
                <Stack space={2}>
                  <Inline space={2}>
                    <Text weight="bold">Name:</Text>
                    <Text>{formData.fullName}</Text>
                  </Inline>
                  <Inline space={2}>
                    <Text weight="bold">Email:</Text>
                    <Text>{formData.email}</Text>
                  </Inline>
                  <Inline space={2}>
                    <Text weight="bold">Event Date:</Text>
                    <Text>{formatDate(formData.eventDate)}</Text>
                  </Inline>
                  <Inline space={2}>
                    <Text weight="bold">Confirmation #:</Text>
                    <Text>{confirmNumber}</Text>
                  </Inline>
                </Stack>
              </Stack>
            </Inset>
          </Card>

          <Button variant="primary" onPress={handleReset}>
            Register Another
          </Button>
        </Stack>
      </Inset>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <Inset space={6}>
      <Card stretch>
        <Inset spaceX="padding-regular" spaceY="padding-regular">
          <Stack space={6}>

            {/* Header */}
            <Headline level="1">
              Step {step} of 4 — {STEPS[step - 1]}
            </Headline>

            <Divider />

            {/* ─── Step 1: Personal Information ─────────────────────────────── */}
            {step === 1 && (
              <Stack space={4}>
                <SectionMessage>
                  <SectionMessage.Title>Privacy Notice</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>

                <TextField
                  label="Full Name"
                  value={formData.fullName}
                  onChange={v => update('fullName', v)}
                  required
                  error={!!errors.fullName}
                  errorMessage={errors.fullName}
                />

                <TextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={v => update('email', v)}
                  required
                  error={!!errors.email}
                  errorMessage={errors.email}
                />

                <TextField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={v => update('phone', v)}
                />

                <TextField
                  label="Company / Organization"
                  value={formData.company}
                  onChange={v => update('company', v)}
                />

                <ComboBox
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={v => update('jobTitle', v as string)}
                  allowsCustomValue
                  menuTrigger="focus"
                >
                  {JOB_TITLES.map(t => (
                    <ComboBox.Option key={t} id={t}>{t}</ComboBox.Option>
                  ))}
                </ComboBox>

                <FileField
                  label="Profile Photo"
                  accept={['image/*']}
                  onDrop={async e => {
                    const fileItem = e.items.find(item => item.kind === 'file');
                    if (fileItem && fileItem.kind === 'file') {
                      const file = await fileItem.getFile();
                      update('profilePhotoPreview', URL.createObjectURL(file));
                    }
                  }}
                />

                {formData.profilePhotoPreview && (
                  <img
                    src={formData.profilePhotoPreview}
                    alt="Profile photo preview"
                    style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }}
                  />
                )}
              </Stack>
            )}

            {/* ─── Step 2: Event Details ─────────────────────────────────────── */}
            {step === 2 && (
              <Stack space={4}>
                <DatePicker
                  label="Event Date"
                  value={formData.eventDate}
                  onChange={v => update('eventDate', v)}
                  required
                  error={!!errors.eventDate}
                  errorMessage={errors.eventDate}
                />

                <TimeField
                  label="Preferred Time Slot"
                  value={formData.timeSlot}
                  onChange={v => update('timeSlot', v)}
                />

                <Radio.Group
                  label="Session Track"
                  value={formData.sessionTrack}
                  onChange={v => update('sessionTrack', v)}
                >
                  {SESSION_TRACKS.map(t => (
                    <Radio key={t.value} value={t.value}>{t.label}</Radio>
                  ))}
                </Radio.Group>

                <ComboBox
                  label="Dietary Requirements"
                  value={formData.dietaryRequirements}
                  onChange={v => update('dietaryRequirements', v as string)}
                  allowsCustomValue
                  menuTrigger="focus"
                >
                  {DIETARY_OPTIONS.map(opt => (
                    <ComboBox.Option key={opt} id={opt}>{opt}</ComboBox.Option>
                  ))}
                </ComboBox>

                <NumberField
                  label="Number of Guests"
                  value={formData.numberOfGuests}
                  onChange={v => update('numberOfGuests', v)}
                  minValue={0}
                  maxValue={5}
                  width="1/4"
                />

                <TextArea
                  label="Special Requests"
                  value={formData.specialRequests}
                  onChange={v => update('specialRequests', v)}
                  rows={3}
                />
              </Stack>
            )}

            {/* ─── Step 3: Preferences ──────────────────────────────────────── */}
            {step === 3 && (
              <Stack space={4}>
                <Select
                  label="T-Shirt Size"
                  selectedKey={formData.tshirtSize || null}
                  onSelectionChange={k => update('tshirtSize', k as string)}
                >
                  {TSHIRT_SIZES.map(s => (
                    <Select.Option key={s} id={s}>{s}</Select.Option>
                  ))}
                </Select>

                <TagField
                  label="Topics of Interest"
                  value={formData.topicsOfInterest}
                  onChange={v => update('topicsOfInterest', v as string[])}
                >
                  {TOPIC_OPTIONS.map(topic => (
                    <TagField.Option key={topic} id={topic}>{topic}</TagField.Option>
                  ))}
                </TagField>

                <Checkbox.Group
                  label="Communication Preferences"
                  value={formData.communicationPrefs}
                  onChange={v => update('communicationPrefs', v)}
                >
                  {COMM_PREFS.map(p => (
                    <Checkbox key={p.value} value={p.value} label={p.label} />
                  ))}
                </Checkbox.Group>

                <Stack space={2}>
                  <Switch
                    label="I have accessibility requirements"
                    selected={formData.hasAccessibilityNeeds}
                    onChange={v => update('hasAccessibilityNeeds', v)}
                  />
                  {formData.hasAccessibilityNeeds && (
                    <TextArea
                      label="Accessibility Details"
                      value={formData.accessibilityDetails}
                      onChange={v => update('accessibilityDetails', v)}
                      rows={3}
                      placeholder="Please describe your accessibility requirements"
                    />
                  )}
                </Stack>
              </Stack>
            )}

            {/* ─── Step 4: Review & Confirm ─────────────────────────────────── */}
            {step === 4 && (
              <Stack space={4}>
                <Accordion
                  expandedKeys={reviewExpanded}
                  onExpandedChange={keys => setReviewExpanded(keys as Set<string | number>)}
                >
                  <Accordion.Item id="personal">
                    <Accordion.Header>Personal Information</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Inline space={2}>
                          <Text weight="bold">Full Name:</Text>
                          <Text>{formData.fullName || '—'}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Email:</Text>
                          <Text>{formData.email || '—'}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Phone:</Text>
                          <Text>{formData.phone || '—'}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Company:</Text>
                          <Text>{formData.company || '—'}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Job Title:</Text>
                          <Text>{formData.jobTitle || '—'}</Text>
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
                          <Text>{formatDate(formData.eventDate)}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Time Slot:</Text>
                          <Text>{formatTime(formData.timeSlot)}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Session Track:</Text>
                          <Text>
                            {SESSION_TRACKS.find(t => t.value === formData.sessionTrack)?.label || '—'}
                          </Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Dietary Requirements:</Text>
                          <Text>{formData.dietaryRequirements || '—'}</Text>
                        </Inline>
                        <Inline space={2}>
                          <Text weight="bold">Number of Guests:</Text>
                          <Text>{formData.numberOfGuests}</Text>
                        </Inline>
                        {formData.specialRequests && (
                          <Stack space={1}>
                            <Text weight="bold">Special Requests:</Text>
                            <Text>{formData.specialRequests}</Text>
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item id="preferences">
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Inline space={2}>
                          <Text weight="bold">T-Shirt Size:</Text>
                          <Text>{formData.tshirtSize || '—'}</Text>
                        </Inline>
                        <Stack space={1}>
                          <Text weight="bold">Topics of Interest:</Text>
                          <Text>
                            {formData.topicsOfInterest.length > 0
                              ? formData.topicsOfInterest.join(', ')
                              : '—'}
                          </Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Communication Preferences:</Text>
                          <Text>
                            {formData.communicationPrefs.length > 0
                              ? formData.communicationPrefs
                                  .map(v => COMM_PREFS.find(p => p.value === v)?.label ?? v)
                                  .join(', ')
                              : '—'}
                          </Text>
                        </Stack>
                        {formData.hasAccessibilityNeeds && (
                          <Stack space={1}>
                            <Text weight="bold">Accessibility Needs:</Text>
                            <Text>{formData.accessibilityDetails || '—'}</Text>
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={formData.termsAgreed}
                  onChange={v => update('termsAgreed', v)}
                  required
                />
              </Stack>
            )}

            <Divider />

            {/* Navigation */}
            <Inline space={4}>
              <Button
                variant="secondary"
                onPress={handleBack}
                disabled={step === 1}
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
                  disabled={!formData.termsAgreed}
                >
                  Submit Registration
                </Button>
              )}
            </Inline>

          </Stack>
        </Inset>
      </Card>
    </Inset>
  );
};

// ── Default export ─────────────────────────────────────────────────────────────

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <AppLayout>
      <AppLayout.Main>
        <RegistrationForm />
      </AppLayout.Main>
    </AppLayout>
  </>
);

export default TestApp;
