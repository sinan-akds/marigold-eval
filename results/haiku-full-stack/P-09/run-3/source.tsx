'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Stack,
  Inline,
  TextField,
  Select,
  DatePicker,
  TimeField,
  FileField,
  NumberField,
  TextArea,
  Checkbox,
  Switch,
  Accordion,
  SectionMessage,
  Headline,
  Text,
  Autocomplete,
  ComboBox,
  TagField,
  useToast,
} from '@marigold/components';

interface RegistrationData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;

  // Step 2
  eventDate: any;
  timeSlot: any;
  sessionTrack: string;
  dietaryRequirements: string[];
  numGuests: number;
  specialRequests: string;

  // Step 3
  tShirtSize: string;
  topics: string[];
  communicationPrefs: string[];
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const INITIAL_DATA: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: null,
  timeSlot: null,
  sessionTrack: '',
  dietaryRequirements: [],
  numGuests: 0,
  specialRequests: '',
  tShirtSize: '',
  topics: [],
  communicationPrefs: [],
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
};

export default function TestApp() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { addToast } = useToast();

  const updateData = (field: keyof RegistrationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(data.email)) newErrors.email = 'Please enter a valid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.eventDate) newErrors.eventDate = 'Event date is required';
    if (!data.sessionTrack) newErrors.sessionTrack = 'Session track is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = (): boolean => {
    if (step === 1) return validateStep1();
    if (step === 2) return validateStep2();
    return true;
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      addToast({
        title: 'Please accept the terms and conditions',
        variant: 'warning',
      });
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setData(INITIAL_DATA);
    setErrors({});
    setSubmitted(false);
    setTermsAccepted(false);
  };

  if (submitted) {
    const confirmationNumber = Math.random().toString(36).substring(2, 9).toUpperCase();

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card variant="default">
          <Stack space={4} alignX="center">
            <SectionMessage variant="success">
              <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
              <SectionMessage.Content>
                Thank you for registering for our event.
              </SectionMessage.Content>
            </SectionMessage>

            <Stack space={2} alignX="center">
              <Headline level="5">Confirmation Details</Headline>
              <Card variant="default">
                <Stack space={2}>
                  <div>
                    <Text weight="bold">Name:</Text>
                    <Text>{data.fullName}</Text>
                  </div>
                  <div>
                    <Text weight="bold">Email:</Text>
                    <Text>{data.email}</Text>
                  </div>
                  <div>
                    <Text weight="bold">Event Date:</Text>
                    <Text>
                      {data.eventDate
                        ? `${data.eventDate.day}/${data.eventDate.month}/${data.eventDate.year}`
                        : 'N/A'}
                    </Text>
                  </div>
                  <div>
                    <Text weight="bold">Confirmation Number:</Text>
                    <Text>{confirmationNumber}</Text>
                  </div>
                </Stack>
              </Card>
            </Stack>

            <Button variant="primary" onPress={handleReset}>
              Register Another
            </Button>
          </Stack>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card variant="default">
        <Stack space={4}>
          {/* Step indicator */}
          <div>
            <Text size="small">Step {step} of 4</Text>
            <Headline level="4">
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Event Details'}
              {step === 3 && 'Preferences'}
              {step === 4 && 'Review & Confirm'}
            </Headline>
          </div>

          {/* Step content */}
          <Stack space={4}>
            {step === 1 && (
              <>
                <SectionMessage variant="info">
                  <SectionMessage.Title>Privacy Notice</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>

                <Stack space={2} alignX="left">
                  <TextField
                    label="Full Name"
                    required
                    value={data.fullName}
                    onChange={val => updateData('fullName', val)}
                    error={!!errors.fullName}
                    errorMessage={errors.fullName}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    required
                    value={data.email}
                    onChange={val => updateData('email', val)}
                    error={!!errors.email}
                    errorMessage={errors.email}
                  />
                  <TextField
                    label="Phone Number"
                    value={data.phone}
                    onChange={val => updateData('phone', val)}
                  />
                  <TextField
                    label="Company / Organization"
                    value={data.company}
                    onChange={val => updateData('company', val)}
                  />
                  <Autocomplete
                    label="Job Title"
                    value={data.jobTitle}
                    onChange={val => updateData('jobTitle', val)}
                  >
                    <Autocomplete.Option id="developer">Developer</Autocomplete.Option>
                    <Autocomplete.Option id="designer">Designer</Autocomplete.Option>
                    <Autocomplete.Option id="pm">Product Manager</Autocomplete.Option>
                    <Autocomplete.Option id="em">Engineering Manager</Autocomplete.Option>
                    <Autocomplete.Option id="cto">CTO</Autocomplete.Option>
                    <Autocomplete.Option id="other">Other</Autocomplete.Option>
                  </Autocomplete>
                  <FileField
                    label="Profile Photo"
                    accept={['image/*']}
                  />
                </Stack>
              </>
            )}

            {step === 2 && (
              <Stack space={2} alignX="left">
                <DatePicker
                  label="Event Date"
                  required
                  value={data.eventDate}
                  onChange={val => updateData('eventDate', val)}
                  error={!!errors.eventDate}
                  errorMessage={errors.eventDate}
                />
                <TimeField
                  label="Preferred Time Slot"
                  value={data.timeSlot}
                  onChange={val => updateData('timeSlot', val)}
                />
                <Select
                  label="Session Track"
                  required
                  selectedKey={data.sessionTrack}
                  onSelectionChange={key => updateData('sessionTrack', key)}
                  error={!!errors.sessionTrack}
                  errorMessage={errors.sessionTrack}
                >
                  <Select.Option id="technical">Technical</Select.Option>
                  <Select.Option id="design">Design</Select.Option>
                  <Select.Option id="business">Business</Select.Option>
                  <Select.Option id="workshop">Workshop</Select.Option>
                </Select>
                <ComboBox
                  label="Dietary Requirements"
                  selectedKey={data.dietaryRequirements[0] || ''}
                  onSelectionChange={key => {
                    if (key) {
                      updateData('dietaryRequirements', [String(key)]);
                    }
                  }}
                  allowsCustomValue
                  value={data.dietaryRequirements[0] || ''}
                  onChange={val => updateData('dietaryRequirements', val ? [val] : [])}
                >
                  <ComboBox.Option id="none">None</ComboBox.Option>
                  <ComboBox.Option id="vegetarian">Vegetarian</ComboBox.Option>
                  <ComboBox.Option id="vegan">Vegan</ComboBox.Option>
                  <ComboBox.Option id="glutenfree">Gluten-Free</ComboBox.Option>
                  <ComboBox.Option id="kosher">Kosher</ComboBox.Option>
                  <ComboBox.Option id="halal">Halal</ComboBox.Option>
                </ComboBox>
                <NumberField
                  label="Number of Guests"
                  value={data.numGuests}
                  onChange={val => updateData('numGuests', val)}
                  minValue={0}
                  maxValue={5}
                />
                <TextArea
                  label="Special Requests"
                  value={data.specialRequests}
                  onChange={val => updateData('specialRequests', val)}
                  rows={3}
                />
              </Stack>
            )}

            {step === 3 && (
              <Stack space={2} alignX="left">
                <Select
                  label="T-Shirt Size"
                  selectedKey={data.tShirtSize}
                  onSelectionChange={key => updateData('tShirtSize', key)}
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
                  value={data.topics}
                  onSelectionChange={(keys: any) => {
                    if (keys) {
                      updateData('topics', Array.from(keys as string[]));
                    }
                  }}
                >
                  <TagField.Option id="aiml">AI/ML</TagField.Option>
                  <TagField.Option id="web">Web Development</TagField.Option>
                  <TagField.Option id="cloud">Cloud</TagField.Option>
                  <TagField.Option id="security">Security</TagField.Option>
                  <TagField.Option id="devops">DevOps</TagField.Option>
                  <TagField.Option id="mobile">Mobile</TagField.Option>
                  <TagField.Option id="datascience">Data Science</TagField.Option>
                </TagField>

                <Stack space={2} alignX="left">
                  <Checkbox.Group
                    label="Communication Preferences"
                    value={data.communicationPrefs}
                    onChange={prefs => updateData('communicationPrefs', prefs)}
                  >
                    <Checkbox value="email" label="Email updates about the event" />
                    <Checkbox value="sms" label="SMS reminders" />
                    <Checkbox value="survey" label="Post-event survey" />
                    <Checkbox value="newsletter" label="Newsletter subscription" />
                  </Checkbox.Group>
                </Stack>

                <Switch
                  label="I have accessibility requirements"
                  selected={data.hasAccessibilityNeeds}
                  onChange={checked => updateData('hasAccessibilityNeeds', checked)}
                />

                {data.hasAccessibilityNeeds && (
                  <TextArea
                    label="Accessibility Details"
                    value={data.accessibilityDetails}
                    onChange={val => updateData('accessibilityDetails', val)}
                    rows={3}
                  />
                )}
              </Stack>
            )}

            {step === 4 && (
              <Stack space={3}>
                <Accordion>
                  <Accordion.Item>
                    <Accordion.Header>Personal Information</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={1}>
                        <div><Text weight="bold">Name:</Text> {data.fullName}</div>
                        <div><Text weight="bold">Email:</Text> {data.email}</div>
                        {data.phone && <div><Text weight="bold">Phone:</Text> {data.phone}</div>}
                        {data.company && <div><Text weight="bold">Company:</Text> {data.company}</div>}
                        {data.jobTitle && <div><Text weight="bold">Job Title:</Text> {data.jobTitle}</div>}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item>
                    <Accordion.Header>Event Details</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={1}>
                        <div>
                          <Text weight="bold">Date:</Text>{' '}
                          {data.eventDate
                            ? `${data.eventDate.day}/${data.eventDate.month}/${data.eventDate.year}`
                            : 'N/A'}
                        </div>
                        {data.timeSlot && (
                          <div>
                            <Text weight="bold">Time:</Text>{' '}
                            {data.timeSlot?.toString() || 'Not specified'}
                          </div>
                        )}
                        <div><Text weight="bold">Track:</Text> {data.sessionTrack}</div>
                        {data.dietaryRequirements.length > 0 && (
                          <div>
                            <Text weight="bold">Dietary:</Text> {data.dietaryRequirements.join(', ')}
                          </div>
                        )}
                        <div><Text weight="bold">Guests:</Text> {data.numGuests}</div>
                        {data.specialRequests && (
                          <div>
                            <Text weight="bold">Requests:</Text> {data.specialRequests}
                          </div>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item>
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={1}>
                        <div><Text weight="bold">T-Shirt Size:</Text> {data.tShirtSize || 'Not selected'}</div>
                        {data.topics.length > 0 && (
                          <div>
                            <Text weight="bold">Topics:</Text> {data.topics.join(', ')}
                          </div>
                        )}
                        {data.communicationPrefs.length > 0 && (
                          <div>
                            <Text weight="bold">Communication:</Text> {data.communicationPrefs.join(', ')}
                          </div>
                        )}
                        {data.hasAccessibilityNeeds && (
                          <div>
                            <Text weight="bold">Accessibility:</Text> {data.accessibilityDetails}
                          </div>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Checkbox.Group value={termsAccepted ? ['terms'] : []} onChange={v => setTermsAccepted(v.length > 0)}>
                  <Checkbox value="terms" label="I agree to the terms and conditions" />
                </Checkbox.Group>
              </Stack>
            )}
          </Stack>

          {/* Navigation buttons */}
          <Inline space={2} alignX="right">
            <Button
              disabled={step === 1}
              onPress={handleBack}
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
                loading={loading}
              >
                Submit Registration
              </Button>
            )}
          </Inline>
        </Stack>
      </Card>
    </div>
  );
}
