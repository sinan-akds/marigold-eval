import React, { useState } from 'react';
import {
  Stack,
  Inline,
  Card,
  Button,
  TextField,
  Select,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  NumberField,
  Textarea,
  RadioGroup,
  Switch,
  Text,
  Headline,
  Infobox,
  Divider,
  ComboBox,
  FileTrigger,
} from '@marigold/components';
import type { DateValue } from '@internationalized/date';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  eventDate: DateValue | null;
  timeSlot: string;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string | null;
  topicsOfInterest: string[];
  communicationPreferences: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: null,
  timeSlot: '',
  sessionTrack: '',
  dietaryRequirements: '',
  numberOfGuests: 0,
  specialRequests: '',
  tshirtSize: null,
  topicsOfInterest: [],
  communicationPreferences: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
};

const JOB_TITLES = ['Developer', 'Designer', 'Product Manager', 'Engineering Manager', 'CTO', 'Other'];
const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];
const TOPICS = ['AI/ML', 'Web Development', 'Cloud', 'Security', 'DevOps', 'Mobile', 'Data Science'];
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const STEP_TITLES = ['Personal Information', 'Event Details', 'Preferences', 'Review & Confirm'];

function genConfirmNum(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'REG-';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const TestApp = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmNum, setConfirmNum] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [openSections, setOpenSections] = useState({ personal: true, event: true, prefs: true });
  const [agreed, setAgreed] = useState(false);

  const update = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) {
      setErrors(e => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    }
    if (s === 1) {
      if (!form.eventDate) e.eventDate = 'Event date is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => { if (validate(step)) setStep(s => s + 1); };
  const goBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (!agreed) return;
    setSubmitting(true);
    setTimeout(() => {
      setConfirmNum(genConfirmNum());
      setSubmitting(false);
      setSubmitted(true);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
    }, 1000);
  };

  const reset = () => {
    setStep(0);
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitting(false);
    setSubmitted(false);
    setConfirmNum('');
    setPhotoPreview(null);
    setAgreed(false);
    setToastVisible(false);
    setTopicInput('');
  };

  const addTopic = (t: string) => {
    if (t && !form.topicsOfInterest.includes(t)) {
      update('topicsOfInterest', [...form.topicsOfInterest, t]);
    }
    setTopicInput('');
  };

  const removeTopic = (t: string) => {
    update('topicsOfInterest', form.topicsOfInterest.filter(x => x !== t));
  };

  if (submitting) {
    return (
      <Card>
        <Stack space={6}>
          <Infobox variant="info">
            Processing your registration, please wait...
          </Infobox>
        </Stack>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Stack space={4}>
        {toastVisible && (
          <Infobox variant="success">
            Registration submitted successfully
          </Infobox>
        )}
        <Card>
          <Stack space={6}>
            <Infobox variant="success">
              Registration confirmed!
            </Infobox>
            <Stack space={3}>
              <Headline level={3}>Registration Summary</Headline>
              <Text>Name: {form.fullName}</Text>
              <Text>Email: {form.email}</Text>
              <Text>Event Date: {form.eventDate?.toString() ?? '—'}</Text>
              <Text>Confirmation Number: {confirmNum}</Text>
            </Stack>
            <Button variant="primary" onPress={reset}>
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
          Step {step + 1} of 4 — {STEP_TITLES[step]}
        </Headline>

        <Divider />

        {/* Step 1 — Personal Information */}
        {step === 0 && (
          <Stack space={4}>
            <TextField
              label="Full Name"
              value={form.fullName}
              onChange={v => update('fullName', v)}
              isRequired
              errorMessage={errors.fullName}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={v => update('email', v)}
              isRequired
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
            <ComboBox
              label="Job Title"
              inputValue={form.jobTitle}
              onInputChange={v => update('jobTitle', v)}
              onSelectionChange={k => { if (k) update('jobTitle', String(k)); }}
              allowsCustomValue
            >
              {JOB_TITLES.map(t => (
                <ComboBox.Option key={t}>{t}</ComboBox.Option>
              ))}
            </ComboBox>

            <Stack space={2}>
              <Text>Profile Photo (images only)</Text>
              <FileTrigger
                acceptedFileTypes={['image/*']}
                onSelect={(files: FileList | null) => {
                  if (files && files.length > 0) {
                    const file = Array.from(files)[0];
                    update('profilePhoto', file);
                    const reader = new FileReader();
                    reader.onload = e => setPhotoPreview(e.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <Button variant="secondary">Upload Photo</Button>
              </FileTrigger>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
            </Stack>

            <Infobox variant="info">
              Your information will only be used for this event.
            </Infobox>
          </Stack>
        )}

        {/* Step 2 — Event Details */}
        {step === 1 && (
          <Stack space={4}>
            <DatePicker
              label="Event Date"
              value={form.eventDate}
              onChange={v => update('eventDate', v)}
              isRequired
              errorMessage={errors.eventDate}
            />
            <TextField
              label="Preferred Time Slot"
              type="time"
              value={form.timeSlot}
              onChange={v => update('timeSlot', v)}
            />
            <RadioGroup
              label="Session Track"
              value={form.sessionTrack}
              onChange={v => update('sessionTrack', v)}
            >
              <RadioGroup.Radio value="technical">Technical</RadioGroup.Radio>
              <RadioGroup.Radio value="design">Design</RadioGroup.Radio>
              <RadioGroup.Radio value="business">Business</RadioGroup.Radio>
              <RadioGroup.Radio value="workshop">Workshop</RadioGroup.Radio>
            </RadioGroup>
            <ComboBox
              label="Dietary Requirements"
              inputValue={form.dietaryRequirements}
              onInputChange={v => update('dietaryRequirements', v)}
              onSelectionChange={k => { if (k) update('dietaryRequirements', String(k)); }}
              allowsCustomValue
            >
              {DIETARY_OPTIONS.map(o => (
                <ComboBox.Option key={o}>{o}</ComboBox.Option>
              ))}
            </ComboBox>
            <NumberField
              label="Number of Guests"
              value={form.numberOfGuests}
              onChange={v => update('numberOfGuests', v)}
              minValue={0}
              maxValue={5}
            />
            <Textarea
              label="Special Requests"
              value={form.specialRequests}
              onChange={v => update('specialRequests', v)}
            />
          </Stack>
        )}

        {/* Step 3 — Preferences */}
        {step === 2 && (
          <Stack space={4}>
            <Select
              label="T-Shirt Size"
              selectedKey={form.tshirtSize}
              onSelectionChange={k => update('tshirtSize', k ? String(k) : null)}
            >
              {TSHIRT_SIZES.map(s => (
                <Select.Option key={s}>{s}</Select.Option>
              ))}
            </Select>

            <Stack space={2}>
              <Text>Topics of Interest</Text>
              <ComboBox
                label="Add a topic"
                inputValue={topicInput}
                onInputChange={setTopicInput}
                onSelectionChange={k => { if (k) addTopic(String(k)); }}
              >
                {TOPICS.filter(t => !form.topicsOfInterest.includes(t)).map(t => (
                  <ComboBox.Option key={t}>{t}</ComboBox.Option>
                ))}
              </ComboBox>
              {form.topicsOfInterest.length > 0 && (
                <Inline space={2}>
                  {form.topicsOfInterest.map(t => (
                    <Inline key={t} space={1}>
                      <Text>{t}</Text>
                      <Button size="small" variant="ghost" onPress={() => removeTopic(t)}>
                        Remove
                      </Button>
                    </Inline>
                  ))}
                </Inline>
              )}
            </Stack>

            <CheckboxGroup
              label="Communication Preferences"
              value={form.communicationPreferences}
              onChange={v => update('communicationPreferences', v)}
            >
              <Checkbox value="email-updates">Email updates about the event</Checkbox>
              <Checkbox value="sms-reminders">SMS reminders</Checkbox>
              <Checkbox value="post-event-survey">Post-event survey</Checkbox>
              <Checkbox value="newsletter">Newsletter subscription</Checkbox>
            </CheckboxGroup>

            <Stack space={2}>
              <Switch
                isSelected={form.hasAccessibilityNeeds}
                onChange={v => update('hasAccessibilityNeeds', v)}
              >
                I have accessibility requirements
              </Switch>
              {form.hasAccessibilityNeeds && (
                <Textarea
                  label="Accessibility Details"
                  value={form.accessibilityDetails}
                  onChange={v => update('accessibilityDetails', v)}
                />
              )}
            </Stack>
          </Stack>
        )}

        {/* Step 4 — Review & Confirm */}
        {step === 3 && (
          <Stack space={4}>
            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setOpenSections(s => ({ ...s, personal: !s.personal }))}
              >
                {openSections.personal ? '▼' : '▶'} Personal Information
              </Button>
              {openSections.personal && (
                <Stack space={1}>
                  <Text>Name: {form.fullName || '—'}</Text>
                  <Text>Email: {form.email || '—'}</Text>
                  <Text>Phone: {form.phone || '—'}</Text>
                  <Text>Company: {form.company || '—'}</Text>
                  <Text>Job Title: {form.jobTitle || '—'}</Text>
                </Stack>
              )}
              <Divider />
            </Stack>

            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setOpenSections(s => ({ ...s, event: !s.event }))}
              >
                {openSections.event ? '▼' : '▶'} Event Details
              </Button>
              {openSections.event && (
                <Stack space={1}>
                  <Text>Date: {form.eventDate?.toString() ?? '—'}</Text>
                  <Text>Time Slot: {form.timeSlot || '—'}</Text>
                  <Text>Session Track: {form.sessionTrack || '—'}</Text>
                  <Text>Dietary Requirements: {form.dietaryRequirements || '—'}</Text>
                  <Text>Number of Guests: {form.numberOfGuests}</Text>
                </Stack>
              )}
              <Divider />
            </Stack>

            <Stack space={2}>
              <Button
                variant="ghost"
                onPress={() => setOpenSections(s => ({ ...s, prefs: !s.prefs }))}
              >
                {openSections.prefs ? '▼' : '▶'} Preferences
              </Button>
              {openSections.prefs && (
                <Stack space={1}>
                  <Text>T-Shirt Size: {form.tshirtSize || '—'}</Text>
                  <Text>Topics: {form.topicsOfInterest.join(', ') || '—'}</Text>
                  <Text>Communication: {form.communicationPreferences.join(', ') || '—'}</Text>
                </Stack>
              )}
              <Divider />
            </Stack>

            <Checkbox
              isSelected={agreed}
              onChange={setAgreed}
              isRequired
            >
              I agree to the terms and conditions
            </Checkbox>
          </Stack>
        )}

        <Divider />

        <Inline space={2}>
          <Button
            variant="secondary"
            onPress={goBack}
            isDisabled={step === 0}
          >
            Back
          </Button>
          {step < 3 ? (
            <Button variant="primary" onPress={goNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onPress={handleSubmit}
              isDisabled={!agreed}
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
