import { useState } from 'react';
import type { DateValue, TimeValue } from '@internationalized/date';
import {
  Stack,
  Inline,
  Card,
  Headline,
  Text,
  SectionMessage,
  Loader,
  Badge,
  Button,
  TextField,
  TextArea,
  Select,
  ComboBox,
  Autocomplete,
  DatePicker,
  TimeField,
  Radio,
  NumberField,
  FileField,
  TagField,
  Checkbox,
  Switch,
  Accordion,
  ToastProvider,
  useToast,
  Divider,
  Inset,
} from '@marigold/components';

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  eventDate: DateValue | null;
  timeSlot: TimeValue | null;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: (string | number)[];
  communicationPrefs: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
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
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateConfirmationNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'EVT-';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatDate(date: DateValue | null) {
  if (!date) return 'Not specified';
  return `${String(date.day).padStart(2, '0')}/${String(date.month).padStart(2, '0')}/${date.year}`;
}

function formatTime(time: TimeValue | null) {
  if (!time) return 'Not specified';
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

function RegistrationForm() {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [accordionKeys, setAccordionKeys] = useState<Set<string | number>>(
    new Set(['personal', 'eventDetails', 'preferences'])
  );

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required.';
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    if (s === 2) {
      if (!formData.eventDate) newErrors.eventDate = 'Event date is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    if (!termsAccepted) return;
    const confNum = generateConfirmationNumber();
    setConfirmationNumber(confNum);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      addToast({ title: 'Registration submitted successfully', variant: 'success' });
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setFormData(initialFormData);
    setErrors({});
    setTermsAccepted(false);
    setIsSubmitting(false);
    setIsSuccess(false);
    setConfirmationNumber('');
    setPhotoPreview(null);
    setAccordionKeys(new Set(['personal', 'eventDetails', 'preferences']));
  };

  if (isSubmitting) {
    return (
      <Card>
        <Inset space={10}>
          <Stack space={4} alignX="center">
            <Loader />
            <Text>Processing your registration…</Text>
          </Stack>
        </Inset>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card>
        <Inset space={6}>
          <Stack space={6}>
            <SectionMessage variant="success">
              <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
              <SectionMessage.Content>
                Your registration has been successfully submitted.
              </SectionMessage.Content>
            </SectionMessage>
            <Card>
              <Inset space={4}>
                <Stack space={3}>
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
                    <Badge>{confirmationNumber}</Badge>
                  </Inline>
                </Stack>
              </Inset>
            </Card>
            <Button variant="primary" onPress={handleReset}>
              Register Another
            </Button>
          </Stack>
        </Inset>
      </Card>
    );
  }

  const renderStep1 = () => (
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
      <Autocomplete
        label="Job Title"
        value={formData.jobTitle}
        onChange={v => updateField('jobTitle', v ?? '')}
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
        onChange={(files: any) => {
          const list: FileList | null = files;
          if (list && list.length > 0) {
            const file = list[0];
            updateField('profilePhoto', file);
            setPhotoPreview(URL.createObjectURL(file));
          } else {
            updateField('profilePhoto', null);
            setPhotoPreview(null);
          }
        }}
      />
      {photoPreview && (
        <img
          src={photoPreview}
          alt="Profile photo preview"
          style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
        />
      )}
      <SectionMessage variant="info">
        <SectionMessage.Title>Privacy Notice</SectionMessage.Title>
        <SectionMessage.Content>
          Your information will only be used for this event.
        </SectionMessage.Content>
      </SectionMessage>
    </Stack>
  );

  const renderStep2 = () => (
    <Stack space={4}>
      <DatePicker
        label="Event Date"
        required
        value={formData.eventDate}
        onChange={v => updateField('eventDate', v)}
        error={!!errors.eventDate}
        errorMessage={errors.eventDate}
      />
      <TimeField
        label="Preferred Time Slot"
        value={formData.timeSlot ?? undefined}
        onChange={(v: TimeValue) => updateField('timeSlot', v)}
      />
      <Radio.Group
        label="Session Track"
        value={formData.sessionTrack}
        onChange={v => updateField('sessionTrack', v)}
      >
        <Radio value="Technical">Technical</Radio>
        <Radio value="Design">Design</Radio>
        <Radio value="Business">Business</Radio>
        <Radio value="Workshop">Workshop</Radio>
      </Radio.Group>
      <ComboBox
        label="Dietary Requirements"
        value={formData.dietaryRequirements}
        onChange={v => updateField('dietaryRequirements', v ?? '')}
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
        value={formData.numberOfGuests}
        onChange={v => updateField('numberOfGuests', v)}
        minValue={0}
        maxValue={5}
        width="1/3"
      />
      <TextArea
        label="Special Requests"
        value={formData.specialRequests}
        onChange={v => updateField('specialRequests', v)}
        rows={3}
      />
    </Stack>
  );

  const renderStep3 = () => (
    <Stack space={4}>
      <Select
        label="T-Shirt Size"
        selectedKey={formData.tshirtSize || null}
        onSelectionChange={k => updateField('tshirtSize', k as string)}
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
        onChange={keys => updateField('topicsOfInterest', keys)}
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
        value={formData.communicationPrefs}
        onChange={v => updateField('communicationPrefs', v)}
      >
        <Checkbox value="email-updates" label="Email updates about the event" />
        <Checkbox value="sms-reminders" label="SMS reminders" />
        <Checkbox value="post-event-survey" label="Post-event survey" />
        <Checkbox value="newsletter" label="Newsletter subscription" />
      </Checkbox.Group>
      <Switch
        label="I have accessibility requirements"
        selected={formData.hasAccessibilityNeeds}
        onChange={(v: boolean) => updateField('hasAccessibilityNeeds', v)}
      />
      {formData.hasAccessibilityNeeds && (
        <TextArea
          label="Accessibility Details"
          value={formData.accessibilityDetails}
          onChange={v => updateField('accessibilityDetails', v)}
          rows={3}
        />
      )}
    </Stack>
  );

  const renderStep4 = () => (
    <Stack space={4}>
      <Accordion
        expandedKeys={accordionKeys}
        onExpandedChange={setAccordionKeys}
        allowsMultipleExpanded
      >
        <Accordion.Item id="personal">
          <Accordion.Header>Personal Information</Accordion.Header>
          <Accordion.Content>
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
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="eventDetails">
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
                <Text>{formData.sessionTrack || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Dietary Requirements:</Text>
                <Text>{formData.dietaryRequirements || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Number of Guests:</Text>
                <Text>{formData.numberOfGuests}</Text>
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
                <Text>{formData.tshirtSize || '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Topics:</Text>
                <Text>{formData.topicsOfInterest.length > 0 ? formData.topicsOfInterest.join(', ') : '—'}</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Communication:</Text>
                <Text>{formData.communicationPrefs.length > 0 ? formData.communicationPrefs.join(', ') : '—'}</Text>
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Divider />
      <Checkbox
        value="terms"
        checked={termsAccepted}
        onChange={() => setTermsAccepted(v => !v)}
        label="I agree to the terms and conditions"
        required
      />
    </Stack>
  );

  return (
    <Card>
      <Inset space={6}>
        <Stack space={6}>
          <Stack space={1}>
            <Text variant="muted">Step {step} of 4</Text>
            <Headline level={2}>{STEP_TITLES[step - 1]}</Headline>
          </Stack>
          <Divider />
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          <Divider />
          <Inline alignX="between">
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
                disabled={!termsAccepted}
              >
                Submit Registration
              </Button>
            )}
          </Inline>
        </Stack>
      </Inset>
    </Card>
  );
}

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <RegistrationForm />
  </>
);

export default TestApp;
