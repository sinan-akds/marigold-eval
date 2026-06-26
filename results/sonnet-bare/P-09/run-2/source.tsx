import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Combobox,
  DatePicker,
  Headline,
  Inline,
  Message,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextField,
  TimeField,
} from '@marigold/components';
import { FileTrigger, ListBoxItem } from 'react-aria-components';
import type { DateValue, TimeValue } from '@internationalized/date';

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
  dietary: string;
  numGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topics: string[];
  commPreferences: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
  agreedToTerms: boolean;
}

type ViewState =
  | { status: 'form'; step: number }
  | { status: 'loading' }
  | { status: 'success'; confirmationNumber: string; submittedData: FormData };

const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: null,
  timeSlot: null,
  sessionTrack: 'Technical',
  dietary: '',
  numGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topics: [],
  commPreferences: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
  agreedToTerms: false,
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

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];

const TOPIC_SUGGESTIONS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const COMM_OPTIONS = [
  { value: 'email_updates', label: 'Email updates about the event' },
  { value: 'sms_reminders', label: 'SMS reminders' },
  { value: 'post_event_survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function validateStep1(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  return errors;
}

function validateStep2(data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.eventDate) errors.eventDate = 'Event date is required';
  return errors;
}

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
}

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Stack space={2}>
      <Button variant="secondary" onPress={() => setIsOpen(prev => !prev)}>
        {title} {isOpen ? '▲' : '▼'}
      </Button>
      {isOpen && <Stack space={1}>{children}</Stack>}
    </Stack>
  );
}

function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [viewState, setViewState] = useState<ViewState>({ status: 'form', step: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [topicComboboxKey, setTopicComboboxKey] = useState(0);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    const strKey = key as string;
    if (errors[strKey]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[strKey];
        return next;
      });
    }
  };

  const handlePhotoSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      updateField('profilePhoto', file);
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addTopic = (topic: string) => {
    if (topic && !formData.topics.includes(topic)) {
      updateField('topics', [...formData.topics, topic]);
    }
    setTopicComboboxKey(k => k + 1);
  };

  const removeTopic = (topic: string) => {
    updateField('topics', formData.topics.filter(t => t !== topic));
  };

  const handleNext = () => {
    if (viewState.status !== 'form') return;
    const { step } = viewState;
    let newErrors: Record<string, string> = {};
    if (step === 1) newErrors = validateStep1(formData);
    if (step === 2) newErrors = validateStep2(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setViewState({ status: 'form', step: step + 1 });
  };

  const handleBack = () => {
    if (viewState.status !== 'form' || viewState.step <= 1) return;
    setErrors({});
    setViewState({ status: 'form', step: viewState.step - 1 });
  };

  const handleSubmit = () => {
    setViewState({ status: 'loading' });
    const captured = formData;
    setTimeout(() => {
      const confirmationNumber = `REG-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setViewState({ status: 'success', confirmationNumber, submittedData: captured });
    }, 1000);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setViewState({ status: 'form', step: 1 });
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl(null);
    setTopicComboboxKey(0);
  };

  useEffect(() => {
    if (viewState.status === 'success') {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [viewState.status]);

  if (viewState.status === 'loading') {
    return (
      <Card>
        <Stack space={4}>
          <Text>Processing your registration, please wait…</Text>
        </Stack>
      </Card>
    );
  }

  if (viewState.status === 'success') {
    const { submittedData, confirmationNumber } = viewState;
    const dateStr = submittedData.eventDate
      ? `${submittedData.eventDate.month}/${submittedData.eventDate.day}/${submittedData.eventDate.year}`
      : 'Not specified';
    return (
      <Stack space={4}>
        {showToast && (
          <Message variant="info">Registration submitted successfully</Message>
        )}
        <Card>
          <Stack space={4}>
            <Message variant="info">Registration confirmed!</Message>
            <Card>
              <Stack space={2}>
                <Text>Name: {submittedData.fullName}</Text>
                <Text>Email: {submittedData.email}</Text>
                <Text>Event Date: {dateStr}</Text>
                <Text>Confirmation Number: {confirmationNumber}</Text>
              </Stack>
            </Card>
            <Button variant="primary" onPress={handleReset}>
              Register Another
            </Button>
          </Stack>
        </Card>
      </Stack>
    );
  }

  const { step } = viewState;

  return (
    <Card>
      <Stack space={6}>
        <Stack space={1}>
          <Text>Step {step} of 4</Text>
          <Headline>{STEP_TITLES[step - 1]}</Headline>
        </Stack>

        {step === 1 && (
          <Stack space={4}>
            <TextField
              label="Full Name"
              value={formData.fullName}
              onChange={v => updateField('fullName', v)}
              isRequired
              errorMessage={errors.fullName}
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={v => updateField('email', v)}
              isRequired
              errorMessage={errors.email}
            />
            <TextField
              label="Phone Number"
              value={formData.phone}
              onChange={v => updateField('phone', v)}
            />
            <TextField
              label="Company / Organization"
              value={formData.company}
              onChange={v => updateField('company', v)}
            />
            <Combobox
              label="Job Title"
              allowsCustomValue
              inputValue={formData.jobTitle}
              onInputChange={v => updateField('jobTitle', v)}
              onSelectionChange={key => {
                if (key !== null) updateField('jobTitle', String(key));
              }}
            >
              {JOB_TITLE_SUGGESTIONS.map(title => (
                <ListBoxItem key={title} id={title}>
                  {title}
                </ListBoxItem>
              ))}
            </Combobox>
            <Stack space={2}>
              <Text>Profile Photo (optional)</Text>
              <FileTrigger acceptedFileTypes={['image/*']} onSelect={handlePhotoSelect}>
                <Button variant="secondary">Upload Photo</Button>
              </FileTrigger>
              {photoPreviewUrl && (
                <img
                  src={photoPreviewUrl}
                  alt="Profile photo preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                />
              )}
            </Stack>
            <Message variant="info">
              Your information will only be used for this event.
            </Message>
          </Stack>
        )}

        {step === 2 && (
          <Stack space={4}>
            <DatePicker
              label="Event Date"
              value={formData.eventDate}
              onChange={v => updateField('eventDate', v)}
              isRequired
              errorMessage={errors.eventDate}
            />
            <TimeField
              label="Preferred Time Slot"
              value={formData.timeSlot}
              onChange={v => updateField('timeSlot', v)}
            />
            <RadioGroup
              label="Session Track"
              value={formData.sessionTrack}
              onChange={v => updateField('sessionTrack', v)}
            >
              {['Technical', 'Design', 'Business', 'Workshop'].map(track => (
                <Radio key={track} value={track}>
                  {track}
                </Radio>
              ))}
            </RadioGroup>
            <Combobox
              label="Dietary Requirements"
              allowsCustomValue
              inputValue={formData.dietary}
              onInputChange={v => updateField('dietary', v)}
              onSelectionChange={key => {
                if (key !== null) updateField('dietary', String(key));
              }}
            >
              {DIETARY_OPTIONS.map(opt => (
                <ListBoxItem key={opt} id={opt}>
                  {opt}
                </ListBoxItem>
              ))}
            </Combobox>
            <NumberField
              label="Number of Guests"
              value={formData.numGuests}
              onChange={v => updateField('numGuests', v)}
              minValue={0}
              maxValue={5}
            />
            <Textarea
              label="Special Requests"
              value={formData.specialRequests}
              onChange={v => updateField('specialRequests', v)}
            />
          </Stack>
        )}

        {step === 3 && (
          <Stack space={4}>
            <Select
              label="T-Shirt Size"
              selectedKey={formData.tshirtSize || null}
              onSelectionChange={key => updateField('tshirtSize', String(key ?? ''))}
            >
              {TSHIRT_SIZES.map(size => (
                <ListBoxItem key={size} id={size}>
                  {size}
                </ListBoxItem>
              ))}
            </Select>
            <Stack space={2}>
              <Text>Topics of Interest</Text>
              <Combobox
                key={topicComboboxKey}
                label="Add a topic"
                onSelectionChange={key => {
                  if (key !== null) addTopic(String(key));
                }}
              >
                {TOPIC_SUGGESTIONS.filter(t => !formData.topics.includes(t)).map(topic => (
                  <ListBoxItem key={topic} id={topic}>
                    {topic}
                  </ListBoxItem>
                ))}
              </Combobox>
              {formData.topics.length > 0 && (
                <Inline space={2}>
                  {formData.topics.map(topic => (
                    <Inline key={topic} space={1}>
                      <Text>{topic}</Text>
                      <Button variant="secondary" onPress={() => removeTopic(topic)}>
                        ×
                      </Button>
                    </Inline>
                  ))}
                </Inline>
              )}
            </Stack>
            <CheckboxGroup
              label="Communication Preferences"
              value={formData.commPreferences}
              onChange={v => updateField('commPreferences', v)}
            >
              {COMM_OPTIONS.map(opt => (
                <Checkbox key={opt.value} value={opt.value}>
                  {opt.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
            <Switch
              isSelected={formData.hasAccessibilityNeeds}
              onChange={v => updateField('hasAccessibilityNeeds', v)}
            >
              I have accessibility requirements
            </Switch>
            {formData.hasAccessibilityNeeds && (
              <Textarea
                label="Accessibility Details"
                value={formData.accessibilityDetails}
                onChange={v => updateField('accessibilityDetails', v)}
              />
            )}
          </Stack>
        )}

        {step === 4 && (
          <Stack space={4}>
            <CollapsibleSection title="Personal Information">
              <Text>Name: {formData.fullName}</Text>
              <Text>Email: {formData.email}</Text>
              {formData.phone && <Text>Phone: {formData.phone}</Text>}
              {formData.company && <Text>Company: {formData.company}</Text>}
              {formData.jobTitle && <Text>Job Title: {formData.jobTitle}</Text>}
            </CollapsibleSection>
            <CollapsibleSection title="Event Details">
              <Text>
                Date:{' '}
                {formData.eventDate
                  ? `${formData.eventDate.month}/${formData.eventDate.day}/${formData.eventDate.year}`
                  : 'Not specified'}
              </Text>
              <Text>
                Time:{' '}
                {formData.timeSlot
                  ? `${String(formData.timeSlot.hour).padStart(2, '0')}:${String(formData.timeSlot.minute).padStart(2, '0')}`
                  : 'Not specified'}
              </Text>
              <Text>Track: {formData.sessionTrack}</Text>
              <Text>Dietary: {formData.dietary || 'None specified'}</Text>
              <Text>Guests: {formData.numGuests}</Text>
            </CollapsibleSection>
            <CollapsibleSection title="Preferences">
              <Text>T-Shirt Size: {formData.tshirtSize || 'Not selected'}</Text>
              <Text>
                Topics:{' '}
                {formData.topics.length > 0 ? formData.topics.join(', ') : 'None'}
              </Text>
              <Text>
                Communication:{' '}
                {formData.commPreferences.length > 0
                  ? formData.commPreferences.join(', ')
                  : 'None'}
              </Text>
              {formData.hasAccessibilityNeeds && (
                <Text>
                  Accessibility:{' '}
                  {formData.accessibilityDetails || 'Requirements noted'}
                </Text>
              )}
            </CollapsibleSection>
            <Checkbox
              isSelected={formData.agreedToTerms}
              onChange={v => updateField('agreedToTerms', v)}
            >
              I agree to the terms and conditions
            </Checkbox>
          </Stack>
        )}

        <Inline space={4}>
          <Button
            variant="secondary"
            onPress={handleBack}
            isDisabled={step === 1}
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
              isDisabled={!formData.agreedToTerms}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    </Card>
  );
}

export default RegistrationForm;
