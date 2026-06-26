import { useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  ComboBox,
  DatePicker,
  Divider,
  FileField,
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
import type { DateValue } from '@internationalized/date';

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  jobTitle: string;
  eventDate: DateValue | null;
  preferredTimeSlot: any;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: string[];
  communicationPreferences: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
  termsAccepted: boolean;
};

const INITIAL_STATE: FormState = {
  fullName: '',
  email: '',
  phoneNumber: '',
  company: '',
  jobTitle: '',
  eventDate: null,
  preferredTimeSlot: null,
  sessionTrack: '',
  dietaryRequirements: '',
  numberOfGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topicsOfInterest: [],
  communicationPreferences: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
  termsAccepted: false,
};

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

const DIETARY_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const SESSION_TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TOPICS = [
  { id: 'ai-ml', name: 'AI/ML' },
  { id: 'web-dev', name: 'Web Development' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'security', name: 'Security' },
  { id: 'devops', name: 'DevOps' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'data-science', name: 'Data Science' },
];

const COMM_PREFS = [
  { id: 'email-updates', label: 'Email updates about the event' },
  { id: 'sms-reminders', label: 'SMS reminders' },
  { id: 'post-event-survey', label: 'Post-event survey' },
  { id: 'newsletter', label: 'Newsletter subscription' },
];

const TestApp = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [reviewExpanded, setReviewExpanded] = useState<Set<string | number>>(
    new Set(['personal', 'event', 'prefs'])
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = (s: number): Partial<Record<keyof FormState, string>> => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
      if (!form.email.trim()) {
        errs.email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errs.email = 'Please enter a valid email address.';
      }
    }
    if (s === 2) {
      if (!form.eventDate) errs.eventDate = 'Event date is required.';
    }
    return errs;
  };

  const handleNext = async () => {
    const errs = validate(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (step < 4) {
      setStep(s => s + 1);
      return;
    }
    setSubmitting(true);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const confNum = 'REG-' + String(Math.floor(Math.random() * 900000 + 100000));
    setConfirmationNumber(confNum);
    setLoading(false);
    setSubmitting(false);
    setSubmitted(true);
    addToast({ title: 'Registration submitted successfully', variant: 'success' });
  };

  const handleBack = () => {
    if (step <= 1) return;
    setErrors({});
    setStep(s => s - 1);
  };

  const handleReset = () => {
    setStep(1);
    setForm(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
    setConfirmationNumber('');
  };

  const dateStr = form.eventDate
    ? `${form.eventDate.year}-${String(form.eventDate.month).padStart(2, '0')}-${String(form.eventDate.day).padStart(2, '0')}`
    : 'Not selected';

  const topicNames = form.topicsOfInterest
    .map(id => TOPICS.find(t => t.id === id)?.name ?? id)
    .join(', ');

  const commPrefLabels = form.communicationPreferences
    .map(id => COMM_PREFS.find(p => p.id === id)?.label ?? id)
    .join(', ');

  return (
    <>
      <ToastProvider position="bottom-right" />
      {loading && <Loader mode="fullscreen" />}

      <Stack role="main" space={6} aria-label="Event Registration">
        <Headline level={1}>Event Registration</Headline>

      {submitted ? (
        <Stack space={6}>
          <SectionMessage variant="success">
            <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
            <SectionMessage.Content>
              Your registration has been successfully submitted.
            </SectionMessage.Content>
          </SectionMessage>
          <Card>
            <Stack space={4}>
              <Headline level={3}>Registration Summary</Headline>
              <Stack space={3}>
                <Stack space={1}>
                  <Text weight="bold">Name</Text>
                  <Text>{form.fullName}</Text>
                </Stack>
                <Stack space={1}>
                  <Text weight="bold">Email</Text>
                  <Text>{form.email}</Text>
                </Stack>
                <Stack space={1}>
                  <Text weight="bold">Event Date</Text>
                  <Text>{dateStr}</Text>
                </Stack>
                <Stack space={1}>
                  <Text weight="bold">Confirmation Number</Text>
                  <Text>{confirmationNumber}</Text>
                </Stack>
              </Stack>
              <Divider />
              <Button variant="primary" onPress={handleReset}>
                Register Another
              </Button>
            </Stack>
          </Card>
        </Stack>
      ) : (
        <Card>
          <Stack space={6}>
            <Stack space={2}>
              <Text>
                Step {step} of 4 — {STEP_TITLES[step - 1]}
              </Text>
              <Divider />
            </Stack>

            {step === 1 && (
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  required
                  value={form.fullName}
                  onChange={val => update('fullName', val)}
                  error={!!errors.fullName}
                  errorMessage={errors.fullName}
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={val => update('email', val)}
                  error={!!errors.email}
                  errorMessage={errors.email}
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={val => update('phoneNumber', val)}
                />
                <TextField
                  label="Company / Organization"
                  value={form.company}
                  onChange={val => update('company', val)}
                />
                <TextField
                  label="Job Title"
                  value={form.jobTitle}
                  onChange={val => update('jobTitle', val)}
                />
                <FileField label="Profile Photo" accept={['image/*']} />
                <SectionMessage variant="info">
                  <SectionMessage.Title>Privacy Notice</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>
              </Stack>
            )}

            {step === 2 && (
              <Stack space={4}>
                <DatePicker
                  label="Event Date"
                  required
                  value={form.eventDate ?? undefined}
                  onChange={val => update('eventDate', val ?? null)}
                  error={!!errors.eventDate}
                  errorMessage={errors.eventDate}
                />
                <TimeField
                  label="Preferred Time Slot"
                  value={form.preferredTimeSlot}
                  onChange={val => update('preferredTimeSlot', val)}
                />
                <Radio.Group
                  label="Session Track"
                  value={form.sessionTrack}
                  onChange={val => update('sessionTrack', val)}
                >
                  {SESSION_TRACKS.map(track => (
                    <Radio key={track} value={track}>
                      {track}
                    </Radio>
                  ))}
                </Radio.Group>
                <ComboBox
                  label="Dietary Requirements"
                  allowsCustomValue
                  value={form.dietaryRequirements}
                  onChange={val => update('dietaryRequirements', val ?? '')}
                  onSelectionChange={key => {
                    if (key != null) update('dietaryRequirements', String(key));
                  }}
                >
                  {DIETARY_OPTIONS.map(opt => (
                    <ComboBox.Option key={opt} id={opt}>
                      {opt}
                    </ComboBox.Option>
                  ))}
                </ComboBox>
                <NumberField
                  label="Number of Guests"
                  minValue={0}
                  maxValue={5}
                  value={form.numberOfGuests}
                  onChange={val => update('numberOfGuests', val)}
                  width="1/4"
                />
                <TextArea
                  label="Special Requests"
                  value={form.specialRequests}
                  onChange={val => update('specialRequests', val)}
                  rows={4}
                />
              </Stack>
            )}

            {step === 3 && (
              <Stack space={4}>
                <Select
                  label="T-Shirt Size"
                  selectedKey={form.tshirtSize || null}
                  onSelectionChange={key => {
                    if (key != null) update('tshirtSize', String(key));
                  }}
                >
                  {TSHIRT_SIZES.map(size => (
                    <Select.Option key={size} id={size}>
                      {size}
                    </Select.Option>
                  ))}
                </Select>
                <TagField
                  label="Topics of Interest"
                  value={form.topicsOfInterest as any}
                  onSelectionChange={(keys: any) =>
                    update('topicsOfInterest', Array.from(keys as Iterable<string>))
                  }
                >
                  {TOPICS.map(topic => (
                    <TagField.Option key={topic.id} id={topic.id}>
                      {topic.name}
                    </TagField.Option>
                  ))}
                </TagField>
                <Checkbox.Group
                  label="Communication Preferences"
                  value={form.communicationPreferences}
                  onChange={(vals: string[]) =>
                    update('communicationPreferences', vals)
                  }
                >
                  {COMM_PREFS.map(pref => (
                    <Checkbox key={pref.id} value={pref.id} label={pref.label} />
                  ))}
                </Checkbox.Group>
                <Stack space={3}>
                  <Switch
                    label="I have accessibility requirements"
                    selected={form.hasAccessibilityNeeds}
                    onChange={(val: boolean) =>
                      update('hasAccessibilityNeeds', val)
                    }
                  />
                  {form.hasAccessibilityNeeds && (
                    <TextArea
                      label="Accessibility Details"
                      value={form.accessibilityDetails}
                      onChange={val => update('accessibilityDetails', val)}
                      rows={3}
                    />
                  )}
                </Stack>
              </Stack>
            )}

            {step === 4 && (
              <Stack space={4}>
                <Accordion
                  expandedKeys={reviewExpanded}
                  onExpandedChange={keys =>
                    setReviewExpanded(keys as Set<string | number>)
                  }
                >
                  <Accordion.Item id="personal">
                    <Accordion.Header>Personal Information</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={3}>
                        <Stack space={1}>
                          <Text weight="bold">Name</Text>
                          <Text>{form.fullName || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Email</Text>
                          <Text>{form.email || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Phone</Text>
                          <Text>{form.phoneNumber || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Company</Text>
                          <Text>{form.company || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Job Title</Text>
                          <Text>{form.jobTitle || '—'}</Text>
                        </Stack>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="event">
                    <Accordion.Header>Event Details</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={3}>
                        <Stack space={1}>
                          <Text weight="bold">Date</Text>
                          <Text>{dateStr}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Track</Text>
                          <Text>{form.sessionTrack || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Dietary Requirements</Text>
                          <Text>{form.dietaryRequirements || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Number of Guests</Text>
                          <Text>{form.numberOfGuests}</Text>
                        </Stack>
                        {form.specialRequests && (
                          <Stack space={1}>
                            <Text weight="bold">Special Requests</Text>
                            <Text>{form.specialRequests}</Text>
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item id="prefs">
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={3}>
                        <Stack space={1}>
                          <Text weight="bold">T-Shirt Size</Text>
                          <Text>{form.tshirtSize || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Topics of Interest</Text>
                          <Text>{topicNames || '—'}</Text>
                        </Stack>
                        <Stack space={1}>
                          <Text weight="bold">Communication Preferences</Text>
                          <Text>{commPrefLabels || '—'}</Text>
                        </Stack>
                        {form.hasAccessibilityNeeds && (
                          <Stack space={1}>
                            <Text weight="bold">Accessibility Needs</Text>
                            <Text>{form.accessibilityDetails || '—'}</Text>
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
                <Divider />
                <Checkbox.Group
                  value={form.termsAccepted ? ['agreed'] : []}
                  onChange={(vals: string[]) =>
                    update('termsAccepted', vals.includes('agreed'))
                  }
                >
                  <Checkbox value="agreed" label="I agree to the terms and conditions" />
                </Checkbox.Group>
              </Stack>
            )}

            <Divider />
            <Inline>
              <Button
                variant="secondary"
                onPress={handleBack}
              >
                Back
              </Button>
              <Split />
              <Button
                variant="primary"
                disabled={step === 4 && !form.termsAccepted}
                onPress={handleNext}
                loading={submitting}
              >
                {step === 4 ? 'Submit Registration' : 'Next'}
              </Button>
            </Inline>
          </Stack>
        </Card>
      )}

      </Stack>
    </>
  );
};

export default TestApp;
