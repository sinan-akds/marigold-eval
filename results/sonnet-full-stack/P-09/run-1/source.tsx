import { useState } from 'react';
import type { DateValue, Time, CalendarDateTime, ZonedDateTime } from '@internationalized/date';
import type { Key } from '@react-types/shared';
import {
  Accordion,
  Button,
  Card,
  Center,
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

// FormData stores all multi-step form values so they persist across steps
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  eventDate: DateValue | null;
  timeSlot: Time | CalendarDateTime | ZonedDateTime | null;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: Key[];
  communicationPreferences: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const STEPS = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  eventDate: null,
  timeSlot: null,
  sessionTrack: '',
  dietaryRequirements: '',
  numberOfGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topicsOfInterest: [],
  communicationPreferences: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
};

function makeConfirmationNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = 'EVT-';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function RegistrationForm() {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationNumber] = useState(makeConfirmationNumber);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [jobTitleValue, setJobTitleValue] = useState('');
  const [dietaryValue, setDietaryValue] = useState('');

  function updateForm<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Please enter a valid email address.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {};
    if (!formData.eventDate) e.eventDate = 'Event date is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(s => Math.min(s + 1, 4));
  }

  function handleBack() {
    setErrors({});
    setCurrentStep(s => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!termsAccepted) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    addToast({ title: 'Registration submitted successfully', variant: 'success' });
  }

  function handleReset() {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setSubmitted(false);
    setTermsAccepted(false);
    setJobTitleValue('');
    setDietaryValue('');
  }

  if (loading) {
    return (
      <Card>
        <Stack space={6} alignX="center">
          <Loader />
          <Text>Processing your registration…</Text>
        </Stack>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Stack space={6}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            Your event registration has been successfully submitted.
          </SectionMessage.Content>
        </SectionMessage>
        <Card>
          <Stack space={4}>
            <Headline level={3}>Registration Summary</Headline>
            <Stack space={2}>
              <Inline space={2} alignY="center">
                <Text weight="bold">Name:</Text>
                <Text>{formData.fullName}</Text>
              </Inline>
              <Inline space={2} alignY="center">
                <Text weight="bold">Email:</Text>
                <Text>{formData.email}</Text>
              </Inline>
              <Inline space={2} alignY="center">
                <Text weight="bold">Event Date:</Text>
                <Text>
                  {formData.eventDate
                    ? `${formData.eventDate.month}/${formData.eventDate.day}/${formData.eventDate.year}`
                    : '—'}
                </Text>
              </Inline>
              <Inline space={2} alignY="center">
                <Text weight="bold">Confirmation #:</Text>
                <Text>{confirmationNumber}</Text>
              </Inline>
            </Stack>
            <Button variant="primary" onPress={handleReset}>
              Register Another
            </Button>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Card>
      <Stack space={6}>
        <Headline level={2}>
          Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1]}
        </Headline>

        {currentStep === 1 && (
          <Stack space={4}>
            <SectionMessage variant="info">
              <SectionMessage.Title>Privacy</SectionMessage.Title>
              <SectionMessage.Content>
                Your information will only be used for this event.
              </SectionMessage.Content>
            </SectionMessage>
            <TextField
              label="Full Name"
              required
              value={formData.fullName}
              onChange={v => updateForm('fullName', v)}
              error={!!errors.fullName}
              errorMessage={errors.fullName}
            />
            <TextField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={v => updateForm('email', v)}
              error={!!errors.email}
              errorMessage={errors.email}
            />
            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={v => updateForm('phone', v)}
            />
            <TextField
              label="Company / Organization"
              value={formData.company}
              onChange={v => updateForm('company', v)}
            />
            <ComboBox
              label="Job Title"
              value={jobTitleValue}
              onChange={v => {
                const val = v ?? '';
                setJobTitleValue(val);
                updateForm('jobTitle', val);
              }}
              onSelectionChange={key => {
                if (key != null) {
                  const val = String(key);
                  setJobTitleValue(val);
                  updateForm('jobTitle', val);
                }
              }}
              allowsCustomValue
              menuTrigger="focus"
            >
              <ComboBox.Option id="Developer">Developer</ComboBox.Option>
              <ComboBox.Option id="Designer">Designer</ComboBox.Option>
              <ComboBox.Option id="Product Manager">Product Manager</ComboBox.Option>
              <ComboBox.Option id="Engineering Manager">Engineering Manager</ComboBox.Option>
              <ComboBox.Option id="CTO">CTO</ComboBox.Option>
              <ComboBox.Option id="Other">Other</ComboBox.Option>
            </ComboBox>
            <FileField
              label="Profile Photo"
              accept={['image/*']}
            />
          </Stack>
        )}

        {currentStep === 2 && (
          <Stack space={4}>
            <DatePicker
              label="Event Date"
              required
              value={formData.eventDate ?? undefined}
              onChange={v => updateForm('eventDate', v)}
              error={!!errors.eventDate}
              errorMessage={errors.eventDate}
            />
            <TimeField
              label="Preferred Time Slot"
              value={formData.timeSlot ?? undefined}
              onChange={v => updateForm('timeSlot', v)}
            />
            <Radio.Group
              label="Session Track"
              value={formData.sessionTrack}
              onChange={v => updateForm('sessionTrack', v)}
            >
              <Radio value="Technical">Technical</Radio>
              <Radio value="Design">Design</Radio>
              <Radio value="Business">Business</Radio>
              <Radio value="Workshop">Workshop</Radio>
            </Radio.Group>
            <ComboBox
              label="Dietary Requirements"
              value={dietaryValue}
              onChange={v => {
                const val = v ?? '';
                setDietaryValue(val);
                updateForm('dietaryRequirements', val);
              }}
              onSelectionChange={key => {
                if (key != null) {
                  const val = String(key);
                  setDietaryValue(val);
                  updateForm('dietaryRequirements', val);
                }
              }}
              allowsCustomValue
              menuTrigger="focus"
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
              minValue={0}
              maxValue={5}
              value={formData.numberOfGuests}
              onChange={v => updateForm('numberOfGuests', v)}
            />
            <TextArea
              label="Special Requests"
              value={formData.specialRequests}
              onChange={v => updateForm('specialRequests', v)}
              rows={3}
            />
          </Stack>
        )}

        {currentStep === 3 && (
          <Stack space={4}>
            <Select
              label="T-Shirt Size"
              selectedKey={formData.tshirtSize || null}
              onSelectionChange={key => updateForm('tshirtSize', String(key))}
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
              value={formData.topicsOfInterest}
              onChange={keys => updateForm('topicsOfInterest', keys)}
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
              value={formData.communicationPreferences}
              onChange={v => updateForm('communicationPreferences', v)}
            >
              <Checkbox value="email-updates" label="Email updates about the event" />
              <Checkbox value="sms-reminders" label="SMS reminders" />
              <Checkbox value="post-event-survey" label="Post-event survey" />
              <Checkbox value="newsletter" label="Newsletter subscription" />
            </Checkbox.Group>
            <Switch
              label="I have accessibility requirements"
              selected={formData.hasAccessibilityNeeds}
              onChange={v => updateForm('hasAccessibilityNeeds', v)}
            />
            {formData.hasAccessibilityNeeds && (
              <TextArea
                label="Accessibility Details"
                value={formData.accessibilityDetails}
                onChange={v => updateForm('accessibilityDetails', v)}
                rows={3}
              />
            )}
          </Stack>
        )}

        {currentStep === 4 && (
          <Stack space={6}>
            <Accordion
              allowsMultipleExpanded
              defaultExpandedKeys={['personal', 'event', 'preferences']}
            >
              <Accordion.Item id="personal">
                <Accordion.Header>Personal Information</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Name:</Text>
                      <Text>{formData.fullName || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Email:</Text>
                      <Text>{formData.email || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Phone:</Text>
                      <Text>{formData.phone || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Company:</Text>
                      <Text>{formData.company || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
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
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Date:</Text>
                      <Text>
                        {formData.eventDate
                          ? `${formData.eventDate.month}/${formData.eventDate.day}/${formData.eventDate.year}`
                          : '—'}
                      </Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Time:</Text>
                      <Text>
                        {formData.timeSlot
                          ? `${String(formData.timeSlot.hour).padStart(2, '0')}:${String(formData.timeSlot.minute).padStart(2, '0')}`
                          : '—'}
                      </Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Track:</Text>
                      <Text>{formData.sessionTrack || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Dietary:</Text>
                      <Text>{formData.dietaryRequirements || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Guests:</Text>
                      <Text>{String(formData.numberOfGuests)}</Text>
                    </Inline>
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item id="preferences">
                <Accordion.Header>Preferences</Accordion.Header>
                <Accordion.Content>
                  <Stack space={2}>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">T-Shirt Size:</Text>
                      <Text>{formData.tshirtSize || '—'}</Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Topics:</Text>
                      <Text>
                        {formData.topicsOfInterest.length > 0
                          ? formData.topicsOfInterest.join(', ')
                          : '—'}
                      </Text>
                    </Inline>
                    <Inline space={2} alignY="center">
                      <Text weight="bold">Communication:</Text>
                      <Text>
                        {formData.communicationPreferences.length > 0
                          ? formData.communicationPreferences.join(', ')
                          : '—'}
                      </Text>
                    </Inline>
                  </Stack>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
            <Checkbox
              label="I agree to the terms and conditions"
              checked={termsAccepted}
              onChange={v => setTermsAccepted(v)}
            />
          </Stack>
        )}

        <Inline space={4} alignX="between">
          <Button
            variant="secondary"
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < 4 ? (
            <Button variant="primary" onPress={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={handleSubmit}
              disabled={!termsAccepted}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    </Card>
  );
}

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <Center maxWidth="xlarge" space={6}>
      <Headline level={1}>Event Registration</Headline>
      <RegistrationForm />
    </Center>
  </>
);

export default TestApp;
