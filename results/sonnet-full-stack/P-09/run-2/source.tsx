import { useState } from 'react';
import type { DateValue, Time, ZonedDateTime, CalendarDateTime } from '@internationalized/date';

type TimeValue = Time | ZonedDateTime | CalendarDateTime;

import {
  Accordion,
  Autocomplete,
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

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  eventDate: DateValue | null;
  preferredTimeSlot: TimeValue | null;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: (string | number)[];
  communicationPreferences: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
  agreeToTerms: boolean;
}

const BLANK: FormState = {
  fullName: '',
  email: '',
  phone: '',
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
  agreeToTerms: false,
};

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COMM_LABELS: Record<string, string> = {
  email: 'Email updates',
  sms: 'SMS reminders',
  survey: 'Post-event survey',
  newsletter: 'Newsletter',
};

function makeConfirmationNumber() {
  return 'EVT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function formatDate(d: DateValue | null) {
  if (!d) return '—';
  return `${d.month}/${d.day}/${d.year}`;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Inline space={2}>
      <Text weight="bold">{label}</Text>
      <Text>{value || '—'}</Text>
    </Inline>
  );
}

const TestApp = () => {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(BLANK);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [confirmNum] = useState(makeConfirmationNumber);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const validate = (s: number) => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!form.email.trim()) e.email = 'Email is required.';
      else if (!EMAIL_RE.test(form.email)) e.email = 'Enter a valid email address.';
    }
    if (s === 2) {
      if (!form.eventDate) e.eventDate = 'Please select an event date.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate(step)) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setComplete(true);
      addToast({ title: 'Registration submitted successfully', variant: 'success', timeout: 5000 });
    }, 1000);
  };

  const handleReset = () => {
    setStep(1);
    setForm(BLANK);
    setErrors({});
    setComplete(false);
  };

  if (submitting) {
    return (
      <>
        <ToastProvider position="bottom-right" />
        <Inset space={8}>
          <Stack space={6}>
            <Headline level={1}>Event Registration</Headline>
            <Card>
              <Stack space={6} alignX="center">
                <Loader />
                <Text>Processing your registration…</Text>
              </Stack>
            </Card>
          </Stack>
        </Inset>
      </>
    );
  }

  if (complete) {
    return (
      <>
        <ToastProvider position="bottom-right" />
        <Inset space={8}>
          <Stack space={6}>
            <Headline level={1}>Event Registration</Headline>
            <SectionMessage variant="success">
              <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
              <SectionMessage.Content>
                Thank you for registering. We look forward to seeing you at the event.
              </SectionMessage.Content>
            </SectionMessage>
            <Card>
              <Stack space={4}>
                <Headline level={2}>Registration Summary</Headline>
                <Stack space={2}>
                  <ReviewRow label="Name:" value={form.fullName} />
                  <ReviewRow label="Email:" value={form.email} />
                  <ReviewRow label="Event Date:" value={formatDate(form.eventDate)} />
                  <ReviewRow label="Confirmation #:" value={confirmNum} />
                </Stack>
                <Button onPress={handleReset}>Register Another</Button>
              </Stack>
            </Card>
          </Stack>
        </Inset>
      </>
    );
  }

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Inset space={8}>
        <Stack space={6}>
          <Headline level={1}>Event Registration</Headline>
          <Card>
            <Stack space={6}>
              <Headline level={2}>
                Step {step} of 4 — {STEP_TITLES[step - 1]}
              </Headline>

              {step === 1 && (
                <Stack space={4}>
                  <TextField
                    label="Full Name"
                    required
                    value={form.fullName}
                    onChange={v => update('fullName', v)}
                    error={!!errors.fullName}
                    errorMessage={errors.fullName}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    onChange={v => update('email', v)}
                    error={!!errors.email}
                    errorMessage={errors.email}
                  />
                  <TextField
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={v => update('phone', v)}
                  />
                  <TextField
                    label="Company / Organization"
                    value={form.company}
                    onChange={v => update('company', v)}
                  />
                  <Autocomplete
                    label="Job Title"
                    value={form.jobTitle}
                    onChange={v => update('jobTitle', v)}
                    menuTrigger="focus"
                  >
                    <Autocomplete.Option id="Developer">Developer</Autocomplete.Option>
                    <Autocomplete.Option id="Designer">Designer</Autocomplete.Option>
                    <Autocomplete.Option id="Product Manager">Product Manager</Autocomplete.Option>
                    <Autocomplete.Option id="Engineering Manager">Engineering Manager</Autocomplete.Option>
                    <Autocomplete.Option id="CTO">CTO</Autocomplete.Option>
                    <Autocomplete.Option id="Other">Other</Autocomplete.Option>
                  </Autocomplete>
                  <FileField
                    label="Profile Photo"
                    accept={['image/*']}
                  />
                  <SectionMessage variant="info">
                    <SectionMessage.Title>Privacy notice</SectionMessage.Title>
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
                    value={form.eventDate}
                    onChange={v => update('eventDate', v)}
                    error={!!errors.eventDate}
                    errorMessage={errors.eventDate}
                  />
                  <TimeField
                    label="Preferred Time Slot"
                    value={form.preferredTimeSlot ?? undefined}
                    onChange={v => update('preferredTimeSlot', v)}
                  />
                  <Radio.Group
                    label="Session Track"
                    value={form.sessionTrack}
                    onChange={v => update('sessionTrack', v)}
                  >
                    <Radio value="Technical">Technical</Radio>
                    <Radio value="Design">Design</Radio>
                    <Radio value="Business">Business</Radio>
                    <Radio value="Workshop">Workshop</Radio>
                  </Radio.Group>
                  <ComboBox
                    label="Dietary Requirements"
                    allowsCustomValue
                    value={form.dietaryRequirements}
                    onChange={v => update('dietaryRequirements', v ?? '')}
                    onSelectionChange={key => {
                      if (key != null) update('dietaryRequirements', String(key));
                    }}
                  >
                    <ComboBox.Option id="None">None</ComboBox.Option>
                    <ComboBox.Option id="Vegetarian">Vegetarian</ComboBox.Option>
                    <ComboBox.Option id="Vegan">Vegan</ComboBox.Option>
                    <ComboBox.Option id="Gluten-Free">Gluten-Free</ComboBox.Option>
                    <ComboBox.Option id="Kosher">Kosher</ComboBox.Option>
                    <ComboBox.Option id="Halal">Halal</ComboBox.Option>
                  </ComboBox>
                  <NumberField
                    label="Number of Guests"
                    value={form.numberOfGuests}
                    onChange={v => update('numberOfGuests', v)}
                    minValue={0}
                    maxValue={5}
                  />
                  <TextArea
                    label="Special Requests"
                    value={form.specialRequests}
                    onChange={v => update('specialRequests', v)}
                  />
                </Stack>
              )}

              {step === 3 && (
                <Stack space={4}>
                  <Select
                    label="T-Shirt Size"
                    selectedKey={form.tshirtSize || null}
                    onSelectionChange={key => update('tshirtSize', String(key))}
                  >
                    <Select.Option id="XS">XS</Select.Option>
                    <Select.Option id="S">S</Select.Option>
                    <Select.Option id="M">M</Select.Option>
                    <Select.Option id="L">L</Select.Option>
                    <Select.Option id="XL">XL</Select.Option>
                    <Select.Option id="XXL">XXL</Select.Option>
                  </Select>
                  <TagField
                    label="Topics of Interest"
                    value={form.topicsOfInterest}
                    onChange={v => update('topicsOfInterest', v)}
                  >
                    <TagField.Option id="AI/ML">AI/ML</TagField.Option>
                    <TagField.Option id="Web Development">Web Development</TagField.Option>
                    <TagField.Option id="Cloud">Cloud</TagField.Option>
                    <TagField.Option id="Security">Security</TagField.Option>
                    <TagField.Option id="DevOps">DevOps</TagField.Option>
                    <TagField.Option id="Mobile">Mobile</TagField.Option>
                    <TagField.Option id="Data Science">Data Science</TagField.Option>
                  </TagField>
                  <Checkbox.Group
                    label="Communication Preferences"
                    value={form.communicationPreferences}
                    onChange={v => update('communicationPreferences', v)}
                  >
                    <Checkbox value="email" label="Email updates about the event" />
                    <Checkbox value="sms" label="SMS reminders" />
                    <Checkbox value="survey" label="Post-event survey" />
                    <Checkbox value="newsletter" label="Newsletter subscription" />
                  </Checkbox.Group>
                  <Stack space={3}>
                    <Switch
                      label="I have accessibility requirements"
                      selected={form.hasAccessibilityNeeds}
                      onChange={v => update('hasAccessibilityNeeds', v)}
                    />
                    {form.hasAccessibilityNeeds && (
                      <TextArea
                        label="Accessibility needs details"
                        value={form.accessibilityDetails}
                        onChange={v => update('accessibilityDetails', v)}
                      />
                    )}
                  </Stack>
                </Stack>
              )}

              {step === 4 && (
                <Stack space={4}>
                  <Accordion>
                    <Accordion.Item>
                      <Accordion.Header>Personal Information</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <ReviewRow label="Name:" value={form.fullName} />
                          <ReviewRow label="Email:" value={form.email} />
                          <ReviewRow label="Phone:" value={form.phone} />
                          <ReviewRow label="Company:" value={form.company} />
                          <ReviewRow label="Job Title:" value={form.jobTitle} />
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header>Event Details</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <ReviewRow label="Date:" value={formatDate(form.eventDate)} />
                          <ReviewRow
                            label="Time:"
                            value={form.preferredTimeSlot ? String(form.preferredTimeSlot) : '—'}
                          />
                          <ReviewRow label="Track:" value={form.sessionTrack} />
                          <ReviewRow label="Dietary:" value={form.dietaryRequirements} />
                          <ReviewRow label="Guests:" value={String(form.numberOfGuests)} />
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item>
                      <Accordion.Header>Preferences</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          <ReviewRow label="T-Shirt Size:" value={form.tshirtSize} />
                          <ReviewRow
                            label="Topics:"
                            value={
                              form.topicsOfInterest.length > 0
                                ? form.topicsOfInterest.join(', ')
                                : '—'
                            }
                          />
                          <ReviewRow
                            label="Communication:"
                            value={
                              form.communicationPreferences.length > 0
                                ? form.communicationPreferences.map(k => COMM_LABELS[k] ?? k).join(', ')
                                : '—'
                            }
                          />
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                  <Checkbox
                    label="I agree to the terms and conditions"
                    checked={form.agreeToTerms}
                    onChange={v => update('agreeToTerms', v)}
                    required
                  />
                </Stack>
              )}

              <Inline space={4} alignY="center">
                <Button onPress={handleBack} disabled={step === 1}>
                  Back
                </Button>
                <Split />
                {step < 4 ? (
                  <Button variant="primary" onPress={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onPress={handleSubmit}
                    disabled={!form.agreeToTerms}
                  >
                    Submit Registration
                  </Button>
                )}
              </Inline>
            </Stack>
          </Card>
        </Stack>
      </Inset>
    </>
  );
};

export default TestApp;
