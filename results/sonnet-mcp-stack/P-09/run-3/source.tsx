import { useState } from 'react';
import type { DateValue, TimeValue } from '@internationalized/date';
import type { Key } from '@react-types/shared';
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  ComboBox,
  DatePicker,
  FileField,
  Headline,
  Inline,
  Inset,
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

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  eventDate: DateValue | null;
  timeSlot: TimeValue | null;
  sessionTrack: string;
  dietary: string;
  numGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topics: Key[];
  commPrefs: string[];
  hasAccessibility: boolean;
  accessibilityDetails: string;
  agreedToTerms: boolean;
}

const STEPS = [
  { id: 1, title: 'Personal Information' },
  { id: 2, title: 'Event Details' },
  { id: 3, title: 'Preferences' },
  { id: 4, title: 'Review & Confirm' },
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

const TOPIC_OPTIONS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COMM_PREFS = [
  { value: 'email-updates', label: 'Email updates about the event' },
  { value: 'sms-reminders', label: 'SMS reminders' },
  { value: 'post-survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

const INITIAL_DATA: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  eventDate: null,
  timeSlot: null,
  sessionTrack: '',
  dietary: '',
  numGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topics: [],
  commPrefs: [],
  hasAccessibility: false,
  accessibilityDetails: '',
  agreedToTerms: false,
};

function generateConfirmation(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'EVT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function formatDate(date: DateValue | null): string {
  if (!date) return '—';
  return `${String(date.month).padStart(2, '0')}/${String(date.day).padStart(2, '0')}/${date.year}`;
}

function formatTime(time: TimeValue | null): string {
  if (!time) return '—';
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

function RegistrationForm() {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber] = useState(() => generateConfirmation());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);

  const updateField = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      if (!formData.eventDate) {
        newErrors.eventDate = 'Event date is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.agreedToTerms) return;
    setSubmitting(true);
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    setSubmitting(false);
    setSubmitted(true);
    addToast({ title: 'Registration submitted successfully', variant: 'success' });
  };

  const handleReset = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setFormData(INITIAL_DATA);
    setErrors({});
  };

  if (submitting) {
    return (
      <Card>
        <Stack space={4} alignX="center">
          <Loader />
          <Text>Submitting your registration…</Text>
        </Stack>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Stack space={4}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            Your registration has been successfully submitted.
          </SectionMessage.Content>
        </SectionMessage>
        <Card>
          <Stack space={4}>
            <Headline level={3}>Registration Summary</Headline>
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
                <Text>{confirmationNumber}</Text>
              </Inline>
            </Stack>
          </Stack>
        </Card>
        <Stack alignX="left">
          <Button variant="primary" onPress={handleReset}>
            Register Another
          </Button>
        </Stack>
      </Stack>
    );
  }

  const step = STEPS[currentStep - 1];

  return (
    <Card>
      <Stack space={6}>
        {/* Step header */}
        <Stack space={1}>
          <Text>
            Step {currentStep} of {STEPS.length} — {step.title}
          </Text>
          <Headline level={2}>{step.title}</Headline>
        </Stack>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Stack space={4}>
            <TextField
              label="Full Name"
              required
              value={formData.fullName}
              onChange={v => updateField('fullName', v)}
              error={!!errors.fullName}
              errorMessage={errors.fullName}
            />
            <TextField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={v => updateField('email', v)}
              error={!!errors.email}
              errorMessage={errors.email}
            />
            <TextField
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={v => updateField('phone', v)}
            />
            <TextField
              label="Company / Organization"
              value={formData.company}
              onChange={v => updateField('company', v)}
            />
            <ComboBox
              label="Job Title"
              value={formData.jobTitle}
              onChange={v => updateField('jobTitle', v)}
              menuTrigger="focus"
            >
              {JOB_TITLES.map(title => (
                <ComboBox.Option key={title} id={title}>
                  {title}
                </ComboBox.Option>
              ))}
            </ComboBox>
            <FileField label="Profile Photo" accept={['image/*']} />
            <SectionMessage variant="info">
              <SectionMessage.Content>
                Your information will only be used for this event.
              </SectionMessage.Content>
            </SectionMessage>
          </Stack>
        )}

        {/* Step 2: Event Details */}
        {currentStep === 2 && (
          <Stack space={4}>
            <DatePicker
              label="Event Date"
              required
              value={formData.eventDate ?? undefined}
              onChange={v => updateField('eventDate', v ?? null)}
              error={!!errors.eventDate}
              errorMessage={errors.eventDate}
            />
            <TimeField
              label="Preferred Time Slot"
              value={formData.timeSlot ?? undefined}
              onChange={v => updateField('timeSlot', v)}
            />
            <Radio.Group
              label="Session Track"
              value={formData.sessionTrack}
              onChange={v => updateField('sessionTrack', v)}
            >
              <Radio value="technical">Technical</Radio>
              <Radio value="design">Design</Radio>
              <Radio value="business">Business</Radio>
              <Radio value="workshop">Workshop</Radio>
            </Radio.Group>
            <ComboBox
              label="Dietary Requirements"
              value={formData.dietary}
              onChange={v => updateField('dietary', v)}
              menuTrigger="focus"
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
              value={formData.numGuests}
              onChange={v => updateField('numGuests', v)}
            />
            <TextArea
              label="Special Requests"
              value={formData.specialRequests}
              onChange={v => updateField('specialRequests', v)}
              rows={4}
            />
          </Stack>
        )}

        {/* Step 3: Preferences */}
        {currentStep === 3 && (
          <Stack space={4}>
            <Select
              label="T-Shirt Size"
              selectedKey={formData.tshirtSize || null}
              onSelectionChange={k => updateField('tshirtSize', String(k))}
            >
              {TSHIRT_SIZES.map(size => (
                <Select.Option key={size} id={size}>
                  {size}
                </Select.Option>
              ))}
            </Select>
            <TagField
              label="Topics of Interest"
              value={formData.topics}
              onChange={keys => updateField('topics', keys)}
            >
              {TOPIC_OPTIONS.map(topic => (
                <TagField.Option key={topic} id={topic}>
                  {topic}
                </TagField.Option>
              ))}
            </TagField>
            <Checkbox.Group
              label="Communication Preferences"
              value={formData.commPrefs}
              onChange={vals => updateField('commPrefs', vals)}
            >
              {COMM_PREFS.map(pref => (
                <Checkbox key={pref.value} value={pref.value} label={pref.label} />
              ))}
            </Checkbox.Group>
            <Stack space={3}>
              <Inline space={3} alignY="center">
                <Switch
                  selected={formData.hasAccessibility}
                  onChange={v => updateField('hasAccessibility', v)}
                  aria-label="I have accessibility requirements"
                />
                <Text>I have accessibility requirements</Text>
              </Inline>
              {formData.hasAccessibility && (
                <TextArea
                  label="Accessibility Details"
                  value={formData.accessibilityDetails}
                  onChange={v => updateField('accessibilityDetails', v)}
                  rows={3}
                />
              )}
            </Stack>
          </Stack>
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <Stack space={6}>
            <Accordion>
              <Accordion.Item id="personal">
                <Accordion.Header>Personal Information</Accordion.Header>
                <Accordion.Content>
                  <Inset space={2}>
                    <Stack space={2}>
                      <Inline space={2}>
                        <Text weight="bold">Name:</Text>
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
                  </Inset>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item id="event">
                <Accordion.Header>Event Details</Accordion.Header>
                <Accordion.Content>
                  <Inset space={2}>
                    <Stack space={2}>
                      <Inline space={2}>
                        <Text weight="bold">Date:</Text>
                        <Text>{formatDate(formData.eventDate)}</Text>
                      </Inline>
                      <Inline space={2}>
                        <Text weight="bold">Time:</Text>
                        <Text>{formatTime(formData.timeSlot)}</Text>
                      </Inline>
                      <Inline space={2}>
                        <Text weight="bold">Track:</Text>
                        <Text>
                          {formData.sessionTrack
                            ? formData.sessionTrack.charAt(0).toUpperCase() +
                              formData.sessionTrack.slice(1)
                            : '—'}
                        </Text>
                      </Inline>
                      <Inline space={2}>
                        <Text weight="bold">Dietary:</Text>
                        <Text>{formData.dietary || '—'}</Text>
                      </Inline>
                      <Inline space={2}>
                        <Text weight="bold">Guests:</Text>
                        <Text>{formData.numGuests}</Text>
                      </Inline>
                      {formData.specialRequests && (
                        <Stack space={1}>
                          <Text weight="bold">Special Requests:</Text>
                          <Text>{formData.specialRequests}</Text>
                        </Stack>
                      )}
                    </Stack>
                  </Inset>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item id="preferences">
                <Accordion.Header>Preferences</Accordion.Header>
                <Accordion.Content>
                  <Inset space={2}>
                    <Stack space={2}>
                      <Inline space={2}>
                        <Text weight="bold">T-Shirt Size:</Text>
                        <Text>{formData.tshirtSize || '—'}</Text>
                      </Inline>
                      <Stack space={1}>
                        <Text weight="bold">Topics:</Text>
                        <Text>
                          {formData.topics.length > 0
                            ? formData.topics.map(String).join(', ')
                            : '—'}
                        </Text>
                      </Stack>
                      <Stack space={1}>
                        <Text weight="bold">Communication Preferences:</Text>
                        {formData.commPrefs.length > 0 ? (
                          formData.commPrefs.map(val => {
                            const pref = COMM_PREFS.find(p => p.value === val);
                            return <Text key={val}>{pref?.label ?? val}</Text>;
                          })
                        ) : (
                          <Text>—</Text>
                        )}
                      </Stack>
                      <Inline space={2}>
                        <Text weight="bold">Accessibility Needs:</Text>
                        <Text>
                          {formData.hasAccessibility
                            ? formData.accessibilityDetails || 'Yes (no details provided)'
                            : 'None'}
                        </Text>
                      </Inline>
                    </Stack>
                  </Inset>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>

            <Checkbox
              label="I agree to the terms and conditions"
              checked={formData.agreedToTerms}
              onChange={v => updateField('agreedToTerms', v)}
            />
          </Stack>
        )}

        {/* Navigation */}
        <Inline space={3}>
          <Button
            variant="secondary"
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Split />
          {currentStep < 4 ? (
            <Button variant="primary" onPress={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={handleSubmit}
              disabled={!formData.agreedToTerms}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    </Card>
  );
}

const TestApp = () => {
  return (
    <Stack space={0}>
      <ToastProvider position="bottom-right" />
      <Inset space={8}>
        <RegistrationForm />
      </Inset>
    </Stack>
  );
};

export default TestApp;
