import React, { useState, useEffect, useCallback } from 'react';
import { FileTrigger } from 'react-aria-components';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Card,
  Button,
  TextField,
  NumberField,
  Textarea,
  Select,
  ComboBox,
  Checkbox,
  CheckboxGroup,
  Switch,
  DatePicker,
  Infobox,
  Badge,
  Spinner,
} from '@marigold/components';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  eventDate: any;
  timeSlot: string;
  sessionTrack: string;
  dietary: string;
  numGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topics: string[];
  commPrefs: string[];
  hasAccessibility: boolean;
  accessibilityDetails: string;
  agreeToTerms: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: null,
  timeSlot: '',
  sessionTrack: '',
  dietary: 'None',
  numGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topics: [],
  commPrefs: [],
  hasAccessibility: false,
  accessibilityDetails: '',
  agreeToTerms: false,
};

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const JOB_TITLE_SUGGESTIONS = ['Developer', 'Designer', 'Product Manager', 'Engineering Manager', 'CTO', 'Other'];
const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TOPIC_SUGGESTIONS = ['AI/ML', 'Web Development', 'Cloud', 'Security', 'DevOps', 'Mobile', 'Data Science'];
const SESSION_TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const formatDate = (date: any): string => {
  if (!date) return '—';
  if (typeof date.toString === 'function') return date.toString();
  return String(date);
};

const genConfirmation = () => `EVT-${Math.floor(100000 + Math.random() * 900000)}`;

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [openSections, setOpenSections] = useState({ personal: true, event: true, preferences: true });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmationNumber] = useState(genConfirmation);

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  const validateStep = (stepNum: number): boolean => {
    const errs: Record<string, string> = {};
    if (stepNum === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required.';
      if (!formData.email.trim()) errs.email = 'Email is required.';
      else if (!validateEmail(formData.email)) errs.email = 'Enter a valid email address.';
    }
    if (stepNum === 2) {
      if (!formData.eventDate) errs.eventDate = 'Event date is required.';
    }
    if (stepNum === 4) {
      if (!formData.agreeToTerms) errs.agreeToTerms = 'You must agree to the terms and conditions.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    await new Promise(res => setTimeout(res, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setShowToast(true);
  };

  const addTopic = (topic: string) => {
    if (topic && !formData.topics.includes(topic)) {
      update('topics', [...formData.topics, topic]);
    }
    setTopicInput('');
  };

  const removeTopic = (topic: string) => {
    update('topics', formData.topics.filter(t => t !== topic));
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ── Step 1: Personal Information ──────────────────────────────────────────

  const renderStep1 = () => (
    <Stack space={4}>
      <TextField
        label="Full Name"
        value={formData.fullName}
        onChange={(val: string) => update('fullName', val)}
        required
        error={!!errors.fullName}
        errorMessage={errors.fullName}
      />
      <TextField
        label="Email"
        value={formData.email}
        onChange={(val: string) => update('email', val)}
        type="email"
        required
        error={!!errors.email}
        errorMessage={errors.email}
      />
      <TextField
        label="Phone Number"
        value={formData.phone}
        onChange={(val: string) => update('phone', val)}
      />
      <TextField
        label="Company / Organization"
        value={formData.company}
        onChange={(val: string) => update('company', val)}
      />
      <ComboBox
        label="Job Title"
        allowsCustomValue
        inputValue={formData.jobTitle}
        onInputChange={(val: string) => update('jobTitle', val)}
        onSelectionChange={(key: React.Key | null) => {
          if (key != null) update('jobTitle', String(key));
        }}
      >
        {JOB_TITLE_SUGGESTIONS.map(t => (
          <ComboBox.Option key={t} id={t}>{t}</ComboBox.Option>
        ))}
      </ComboBox>
      <Stack space={2}>
        <Text>Profile Photo (images only)</Text>
        <FileTrigger
          acceptedFileTypes={['image/*']}
          onChange={(files: FileList | null) => {
            const file = files?.[0];
            if (file) {
              update('profilePhoto', file);
              if (photoPreview) URL.revokeObjectURL(photoPreview);
              setPhotoPreview(URL.createObjectURL(file));
            }
          }}
        >
          <Button variant="secondary">
            {formData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
          </Button>
        </FileTrigger>
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Profile preview"
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, display: 'block' }}
          />
        )}
      </Stack>
      <Infobox variant="info">
        Your information will only be used for this event.
      </Infobox>
    </Stack>
  );

  // ── Step 2: Event Details ─────────────────────────────────────────────────

  const renderStep2 = () => (
    <Stack space={4}>
      <DatePicker
        label="Event Date"
        value={formData.eventDate}
        onChange={(date: any) => update('eventDate', date)}
        required
        error={!!errors.eventDate}
        errorMessage={errors.eventDate}
      />
      <TextField
        label="Preferred Time Slot"
        value={formData.timeSlot}
        onChange={(val: string) => update('timeSlot', val)}
        type="time"
      />
      <Select
        label="Session Track"
        selectedKey={formData.sessionTrack || null}
        onSelectionChange={(key: React.Key) => update('sessionTrack', String(key))}
        placeholder="Select a track"
      >
        {SESSION_TRACKS.map(track => (
          <Select.Option key={track} id={track}>{track}</Select.Option>
        ))}
      </Select>
      <ComboBox
        label="Dietary Requirements"
        allowsCustomValue
        inputValue={formData.dietary}
        onInputChange={(val: string) => update('dietary', val)}
        onSelectionChange={(key: React.Key | null) => {
          if (key != null) update('dietary', String(key));
        }}
      >
        {DIETARY_OPTIONS.map(opt => (
          <ComboBox.Option key={opt} id={opt}>{opt}</ComboBox.Option>
        ))}
      </ComboBox>
      <NumberField
        label="Number of Guests"
        value={formData.numGuests}
        onChange={(val: number) => update('numGuests', isNaN(val) ? 0 : val)}
        minValue={0}
        maxValue={5}
      />
      <Textarea
        label="Special Requests (optional)"
        value={formData.specialRequests}
        onChange={(val: string) => update('specialRequests', val)}
      />
    </Stack>
  );

  // ── Step 3: Preferences ───────────────────────────────────────────────────

  const renderStep3 = () => (
    <Stack space={4}>
      <Select
        label="T-Shirt Size"
        selectedKey={formData.tshirtSize || null}
        onSelectionChange={(key: React.Key) => update('tshirtSize', String(key))}
        placeholder="Select a size"
      >
        {TSHIRT_SIZES.map(size => (
          <Select.Option key={size} id={size}>{size}</Select.Option>
        ))}
      </Select>

      <Stack space={2}>
        <Text>Topics of Interest</Text>
        <ComboBox
          label="Add a topic"
          inputValue={topicInput}
          onInputChange={setTopicInput}
          onSelectionChange={(key: React.Key | null) => {
            if (key != null) addTopic(String(key));
          }}
        >
          {TOPIC_SUGGESTIONS.filter(t => !formData.topics.includes(t)).map(t => (
            <ComboBox.Option key={t} id={t}>{t}</ComboBox.Option>
          ))}
        </ComboBox>
        {formData.topics.length > 0 && (
          <Inline space={2}>
            {formData.topics.map(topic => (
              <Inline key={topic} space={1}>
                <Badge>{topic}</Badge>
                <Button
                  variant="text"
                  onPress={() => removeTopic(topic)}
                  aria-label={`Remove ${topic}`}
                >
                  ×
                </Button>
              </Inline>
            ))}
          </Inline>
        )}
      </Stack>

      <CheckboxGroup
        label="Communication Preferences"
        value={formData.commPrefs}
        onChange={(vals: string[]) => update('commPrefs', vals)}
      >
        <Checkbox value="email">Email updates about the event</Checkbox>
        <Checkbox value="sms">SMS reminders</Checkbox>
        <Checkbox value="survey">Post-event survey</Checkbox>
        <Checkbox value="newsletter">Newsletter subscription</Checkbox>
      </CheckboxGroup>

      <Stack space={2}>
        <Switch
          isSelected={formData.hasAccessibility}
          onChange={(val: boolean) => update('hasAccessibility', val)}
        >
          I have accessibility requirements
        </Switch>
        {formData.hasAccessibility && (
          <Textarea
            label="Accessibility Details"
            value={formData.accessibilityDetails}
            onChange={(val: string) => update('accessibilityDetails', val)}
          />
        )}
      </Stack>
    </Stack>
  );

  // ── Step 4: Review & Confirm ──────────────────────────────────────────────

  const SectionCard = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: keyof typeof openSections;
    children: React.ReactNode;
  }) => (
    <Card>
      <Stack space={3}>
        <Button variant="text" onPress={() => toggleSection(sectionKey)}>
          <Inline space={2}>
            <Text>{openSections[sectionKey] ? '▼' : '▶'}</Text>
            <Text>{title}</Text>
          </Inline>
        </Button>
        {openSections[sectionKey] && children}
      </Stack>
    </Card>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <Inline space={2}>
      <Text>{label}:</Text>
      <Text>{value || '—'}</Text>
    </Inline>
  );

  const renderStep4 = () => (
    <Stack space={4}>
      <SectionCard title="Personal Information" sectionKey="personal">
        <Stack space={1}>
          <Row label="Name" value={formData.fullName} />
          <Row label="Email" value={formData.email} />
          <Row label="Phone" value={formData.phone} />
          <Row label="Company" value={formData.company} />
          <Row label="Job Title" value={formData.jobTitle} />
        </Stack>
      </SectionCard>

      <SectionCard title="Event Details" sectionKey="event">
        <Stack space={1}>
          <Row label="Date" value={formatDate(formData.eventDate)} />
          <Row label="Time" value={formData.timeSlot} />
          <Row label="Track" value={formData.sessionTrack} />
          <Row label="Dietary" value={formData.dietary} />
          <Row label="Guests" value={String(formData.numGuests)} />
          {formData.specialRequests && (
            <Row label="Special Requests" value={formData.specialRequests} />
          )}
        </Stack>
      </SectionCard>

      <SectionCard title="Preferences" sectionKey="preferences">
        <Stack space={1}>
          <Row label="T-Shirt Size" value={formData.tshirtSize} />
          <Row label="Topics" value={formData.topics.length > 0 ? formData.topics.join(', ') : '—'} />
          <Row
            label="Communication"
            value={formData.commPrefs.length > 0 ? formData.commPrefs.join(', ') : '—'}
          />
          {formData.hasAccessibility && (
            <Row label="Accessibility" value={formData.accessibilityDetails || 'Yes'} />
          )}
        </Stack>
      </SectionCard>

      <Stack space={1}>
        <Checkbox
          isSelected={formData.agreeToTerms}
          onChange={(val: boolean) => update('agreeToTerms', val)}
        >
          I agree to the terms and conditions
        </Checkbox>
        {errors.agreeToTerms && (
          <Text>{errors.agreeToTerms}</Text>
        )}
      </Stack>
    </Stack>
  );

  // ── Submission loading ────────────────────────────────────────────────────

  if (submitting) {
    return (
      <Card>
        <Stack space={4}>
          <Spinner />
          <Text>Submitting your registration…</Text>
        </Stack>
      </Card>
    );
  }

  // ── Success view ──────────────────────────────────────────────────────────

  if (submitted) {
    const handleRegisterAnother = () => {
      setFormData(INITIAL_FORM_DATA);
      setPhotoPreview(null);
      setErrors({});
      setStep(1);
      setSubmitted(false);
    };

    return (
      <Stack space={4}>
        {showToast && (
          <Infobox variant="success">
            Registration submitted successfully
          </Infobox>
        )}
        <Card>
          <Stack space={4}>
            <Infobox variant="success">
              Registration confirmed!
            </Infobox>
            <Card>
              <Stack space={2}>
                <Inline space={2}>
                  <Text>Name:</Text>
                  <Text>{formData.fullName}</Text>
                </Inline>
                <Inline space={2}>
                  <Text>Email:</Text>
                  <Text>{formData.email}</Text>
                </Inline>
                <Inline space={2}>
                  <Text>Event Date:</Text>
                  <Text>{formatDate(formData.eventDate)}</Text>
                </Inline>
                <Inline space={2}>
                  <Text>Confirmation #:</Text>
                  <Text>{confirmationNumber}</Text>
                </Inline>
              </Stack>
            </Card>
            <Button onPress={handleRegisterAnother}>Register Another</Button>
          </Stack>
        </Card>
      </Stack>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <Card>
      <Stack space={6}>
        <Stack space={1}>
          <Text>Step {step} of {STEP_TITLES.length}</Text>
          <Headline level={2}>{STEP_TITLES[step - 1]}</Headline>
        </Stack>

        {stepRenderers[step - 1]()}

        <Inline space={2}>
          <Button
            variant="secondary"
            onPress={handleBack}
            isDisabled={step === 1}
          >
            Back
          </Button>
          {step < 4 ? (
            <Button onPress={handleNext}>Next</Button>
          ) : (
            <Button
              onPress={handleSubmit}
              isDisabled={!formData.agreeToTerms}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
