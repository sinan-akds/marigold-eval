import { useState } from 'react';
import type { DateValue, TimeValue } from '@internationalized/date';
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
  profilePhoto: File | null;
  profilePhotoPreview: string | null;
  eventDate: DateValue | null;
  preferredTimeSlot: TimeValue | null;
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
}

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  profilePhotoPreview: null,
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDate = (d: DateValue | null) =>
  d ? `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}` : '—';

const formatTime = (t: TimeValue | null) =>
  t ? `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}` : '—';

const RegistrationForm = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNumber] = useState(
    () => 'EVT-' + Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const k = key as string;
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
      if (!form.email.trim()) errs.email = 'Email is required.';
      else if (!EMAIL_RE.test(form.email)) errs.email = 'Please enter a valid email address.';
    }
    if (step === 2 && !form.eventDate) errs.eventDate = 'Event date is required.';
    if (step === 4 && !form.termsAccepted) errs.termsAccepted = 'You must agree to the terms and conditions.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < 4) {
      setStep(s => s + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        addToast({ title: 'Registration submitted successfully', variant: 'success' });
      }, 1200);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStep(1);
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitting) {
    return (
      <Card>
        <Stack space={6} alignX="center">
          <Loader />
          <Text>Processing your registration…</Text>
        </Stack>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
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
            <Stack alignX="left">
              <Button variant="primary" onPress={handleReset}>
                Register Another
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Card>
      <Stack space={6}>
        <Headline level={3}>
          Step {step} of 4 — {STEP_TITLES[step - 1]}
        </Headline>

        {step === 1 && (
          <Stack space={4}>
            <TextField
              label="Full Name"
              value={form.fullName}
              onChange={val => update('fullName', val)}
              required
              error={!!errors.fullName}
              errorMessage={errors.fullName}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={val => update('email', val)}
              required
              error={!!errors.email}
              errorMessage={errors.email}
            />
            <TextField
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={val => update('phone', val)}
            />
            <TextField
              label="Company / Organization"
              value={form.company}
              onChange={val => update('company', val)}
            />
            <ComboBox
              label="Job Title"
              value={form.jobTitle}
              onChange={val => update('jobTitle', val ?? '')}
            >
              <ComboBox.Option id="developer">Developer</ComboBox.Option>
              <ComboBox.Option id="designer">Designer</ComboBox.Option>
              <ComboBox.Option id="pm">Product Manager</ComboBox.Option>
              <ComboBox.Option id="em">Engineering Manager</ComboBox.Option>
              <ComboBox.Option id="cto">CTO</ComboBox.Option>
              <ComboBox.Option id="other">Other</ComboBox.Option>
            </ComboBox>
            <FileField
              label="Profile Photo"
              accept={['image/*']}
              onChange={(files: any) => {
                const file: File | undefined =
                  Array.isArray(files) ? files[0] : files?.[0];
                if (file) {
                  setForm(prev => ({
                    ...prev,
                    profilePhoto: file,
                    profilePhotoPreview: URL.createObjectURL(file),
                  }));
                }
              }}
            />
            {form.profilePhotoPreview && (
              <img
                src={form.profilePhotoPreview}
                alt="Profile photo preview"
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%' }}
              />
            )}
            <SectionMessage variant="info">
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
              value={form.eventDate}
              onChange={val => update('eventDate', val)}
              required
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
              <Radio value="technical">Technical</Radio>
              <Radio value="design">Design</Radio>
              <Radio value="business">Business</Radio>
              <Radio value="workshop">Workshop</Radio>
            </Radio.Group>
            <ComboBox
              label="Dietary Requirements"
              value={form.dietaryRequirements}
              onChange={val => update('dietaryRequirements', val ?? '')}
            >
              <ComboBox.Option id="none">None</ComboBox.Option>
              <ComboBox.Option id="vegetarian">Vegetarian</ComboBox.Option>
              <ComboBox.Option id="vegan">Vegan</ComboBox.Option>
              <ComboBox.Option id="gluten-free">Gluten-Free</ComboBox.Option>
              <ComboBox.Option id="kosher">Kosher</ComboBox.Option>
              <ComboBox.Option id="halal">Halal</ComboBox.Option>
            </ComboBox>
            <NumberField
              label="Number of Guests"
              value={form.numberOfGuests}
              onChange={val => update('numberOfGuests', val)}
              minValue={0}
              maxValue={5}
            />
            <TextArea
              label="Special Requests"
              value={form.specialRequests}
              onChange={val => update('specialRequests', val)}
              rows={3}
            />
          </Stack>
        )}

        {step === 3 && (
          <Stack space={4}>
            <Select
              label="T-Shirt Size"
              selectedKey={form.tshirtSize || null}
              onSelectionChange={key => update('tshirtSize', (key ?? '') as string)}
            >
              <Select.Option id="xs">XS</Select.Option>
              <Select.Option id="s">S</Select.Option>
              <Select.Option id="m">M</Select.Option>
              <Select.Option id="l">L</Select.Option>
              <Select.Option id="xl">XL</Select.Option>
              <Select.Option id="xxl">XXL</Select.Option>
            </Select>
            <TagField
              label="Topics of Interest"
              value={form.topicsOfInterest as any}
              onChange={keys => update('topicsOfInterest', [...(keys as Iterable<string>)])}
            >
              <TagField.Option id="ai-ml">AI/ML</TagField.Option>
              <TagField.Option id="web-dev">Web Development</TagField.Option>
              <TagField.Option id="cloud">Cloud</TagField.Option>
              <TagField.Option id="security">Security</TagField.Option>
              <TagField.Option id="devops">DevOps</TagField.Option>
              <TagField.Option id="mobile">Mobile</TagField.Option>
              <TagField.Option id="data-science">Data Science</TagField.Option>
            </TagField>
            <Checkbox.Group
              label="Communication Preferences"
              value={form.communicationPreferences}
              onChange={vals => update('communicationPreferences', vals)}
            >
              <Checkbox value="email-updates" label="Email updates about the event" />
              <Checkbox value="sms-reminders" label="SMS reminders" />
              <Checkbox value="post-event-survey" label="Post-event survey" />
              <Checkbox value="newsletter" label="Newsletter subscription" />
            </Checkbox.Group>
            <Switch
              label="I have accessibility requirements"
              selected={form.hasAccessibilityNeeds}
              onChange={(val: boolean) => update('hasAccessibilityNeeds', val)}
            />
            {form.hasAccessibilityNeeds && (
              <TextArea
                label="Accessibility Requirements Details"
                value={form.accessibilityDetails}
                onChange={val => update('accessibilityDetails', val)}
                rows={3}
              />
            )}
          </Stack>
        )}

        {step === 4 && (
          <Stack space={6}>
            <Accordion>
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
                      <Text>{form.tshirtSize ? form.tshirtSize.toUpperCase() : '—'}</Text>
                    </Inline>
                    <Inline space={2}>
                      <Text weight="bold">Topics:</Text>
                      <Text>{form.topicsOfInterest.length ? form.topicsOfInterest.join(', ') : '—'}</Text>
                    </Inline>
                    <Inline space={2}>
                      <Text weight="bold">Communication:</Text>
                      <Text>{form.communicationPreferences.length ? form.communicationPreferences.join(', ') : '—'}</Text>
                    </Inline>
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>

            <Checkbox
              label="I agree to the terms and conditions"
              checked={form.termsAccepted}
              onChange={(val: boolean) => update('termsAccepted', val)}
              required
              error={!!errors.termsAccepted}
              errorMessage={errors.termsAccepted}
            />
          </Stack>
        )}

        <Inline space={4}>
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
            disabled={step === 4 && !form.termsAccepted}
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
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
      <Stack space={6}>
        <Headline level={2}>Event Registration</Headline>
        <RegistrationForm />
      </Stack>
    </div>
  </>
);

export default TestApp;
