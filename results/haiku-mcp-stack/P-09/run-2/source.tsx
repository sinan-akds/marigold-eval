import { useState } from 'react';
import {
  Button,
  Card,
  Stack,
  Inline,
  TextField,
  Select,
  Checkbox,
  NumberField,
  TextArea,
  Switch,
  FileField,
  DateField,
  TimeField,
  TagField,
  Radio,
  SectionMessage,
  Headline,
  Text,
  Accordion,
  useToast,
  ToastProvider,
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
  eventDate: string;
  timeSlot: string;
  sessionTrack: string;
  dietaryRequirements: string[];
  numGuests: number;
  specialRequests: string;

  // Step 3
  tshirtSize: string;
  topicsOfInterest: string[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletterSubscription: boolean;
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const defaultData: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: '',
  timeSlot: '',
  sessionTrack: '',
  dietaryRequirements: [],
  numGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topicsOfInterest: [],
  emailUpdates: false,
  smsReminders: false,
  postEventSurvey: false,
  newsletterSubscription: false,
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
};

const jobTitleSuggestions = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];

const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const topicSuggestions = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(defaultData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const { addToast } = useToast();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!data.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!data.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (stepNum === 2) {
      if (!data.eventDate) newErrors.eventDate = 'Event Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const confirmation = `EVT-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    setConfirmationNumber(confirmation);
    setSubmitted(true);
    setLoading(false);
    addToast({
      title: 'Registration submitted successfully',
      variant: 'success',
      timeout: 5000,
    });
  };

  const handleRegisterAnother = () => {
    setStep(1);
    setData(defaultData);
    setSubmitted(false);
    setErrors({});
  };

  const updateData = (updates: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  if (submitted) {
    return (
      <Stack space={6} alignX="center">
        <Card variant="default" stretch>
          <Stack space={6} alignX="center" alignY="center">
            {loading ? (
              <div className="text-4xl animate-spin">⟳</div>
            ) : (
              <>
                <div className="text-6xl">✓</div>
                <SectionMessage variant="success">
                  <SectionMessage.Title>
                    Registration confirmed!
                  </SectionMessage.Title>
                  <SectionMessage.Content>
                    Thank you for registering for the event.
                  </SectionMessage.Content>
                </SectionMessage>

                <Card variant="default" stretch>
                  <Stack space={3}>
                    <Headline level={4}>Your Registration Summary</Headline>
                    <Stack space={2}>
                      <Inline alignX="between">
                        <Text weight="bold">Name:</Text>
                        <Text>{data.fullName}</Text>
                      </Inline>
                      <Inline alignX="between">
                        <Text weight="bold">Email:</Text>
                        <Text>{data.email}</Text>
                      </Inline>
                      <Inline alignX="between">
                        <Text weight="bold">Event Date:</Text>
                        <Text>{data.eventDate || 'Not specified'}</Text>
                      </Inline>
                      <Inline alignX="between">
                        <Text weight="bold">Confirmation #:</Text>
                        <Text weight="bold" className="text-primary-600">
                          {confirmationNumber}
                        </Text>
                      </Inline>
                    </Stack>
                  </Stack>
                </Card>

                <Button variant="primary" onPress={handleRegisterAnother}>
                  Register Another
                </Button>
              </>
            )}
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <ToastProvider position="bottom-right">
      <Stack space={6} alignX="center">
        <Card variant="default" stretch>
          <Stack space={6}>
            {/* Step Header */}
            <Stack space={2}>
              <Headline level={3}>
                Step {step} of 4 — {
                  step === 1
                    ? 'Personal Information'
                    : step === 2
                      ? 'Event Details'
                      : step === 3
                        ? 'Preferences'
                        : 'Review & Confirm'
                }
              </Headline>
              <Text variant="muted">
                {step === 1 && 'Tell us about yourself'}
                {step === 2 && 'Choose your event preferences'}
                {step === 3 && 'Select your preferences'}
                {step === 4 && 'Review your information before submitting'}
              </Text>
            </Stack>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <Stack space={4}>
                <SectionMessage variant="info">
                  <SectionMessage.Title>Privacy Notice</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>

                <TextField
                  label="Full Name"
                  required
                  value={data.fullName}
                  onChange={value => updateData({ fullName: value })}
                  errorMessage={errors.fullName}
                  placeholder="John Doe"
                />

                <TextField
                  label="Email"
                  required
                  type="email"
                  value={data.email}
                  onChange={value => updateData({ email: value })}
                  errorMessage={errors.email}
                  placeholder="john@example.com"
                />

                <TextField
                  label="Phone Number"
                  value={data.phone}
                  onChange={value => updateData({ phone: value })}
                  placeholder="+1 (555) 000-0000"
                />

                <TextField
                  label="Company / Organization"
                  value={data.company}
                  onChange={value => updateData({ company: value })}
                  placeholder="Your Company"
                />

                <ComboBoxWrapper
                  label="Job Title"
                  value={data.jobTitle}
                  onChange={value => updateData({ jobTitle: value })}
                  suggestions={jobTitleSuggestions}
                  placeholder="Select or type job title"
                />

                <FileField
                  label="Profile Photo"
                  accept={['image/*']}
                  onChange={files => {
                    if (files.length > 0) {
                      updateData({ profilePhoto: files[0] });
                    }
                  }}
                />
                {data.profilePhoto && (
                  <Stack space={2}>
                    <Text size="xs" variant="muted">
                      Photo selected: {data.profilePhoto.name}
                    </Text>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Step 2: Event Details */}
            {step === 2 && (
              <Stack space={4}>
                <DateField
                  label="Event Date"
                  required
                  value={data.eventDate}
                  onChange={value => updateData({ eventDate: value })}
                  errorMessage={errors.eventDate}
                />

                <TimeField
                  label="Preferred Time Slot"
                  value={data.timeSlot}
                  onChange={value => updateData({ timeSlot: value })}
                />

                <Select
                  label="Session Track"
                  value={data.sessionTrack}
                  onSelectionChange={value =>
                    updateData({ sessionTrack: value as string })
                  }
                >
                  <Select.Option id="technical">Technical</Select.Option>
                  <Select.Option id="design">Design</Select.Option>
                  <Select.Option id="business">Business</Select.Option>
                  <Select.Option id="workshop">Workshop</Select.Option>
                </Select>

                <TagField
                  label="Dietary Requirements"
                  placeholder="Select dietary needs..."
                  value={data.dietaryRequirements}
                  onSelectionChange={keys =>
                    updateData({
                      dietaryRequirements: keys.map(k => String(k)),
                    })
                  }
                >
                  {dietaryOptions.map(option => (
                    <TagField.Option key={option} id={option}>
                      {option}
                    </TagField.Option>
                  ))}
                </TagField>

                <NumberField
                  label="Number of Guests"
                  min={0}
                  max={5}
                  value={data.numGuests}
                  onChange={value => updateData({ numGuests: value ?? 0 })}
                />

                <TextArea
                  label="Special Requests"
                  value={data.specialRequests}
                  onChange={value => updateData({ specialRequests: value })}
                  placeholder="Any special accommodations or requests..."
                  rows={4}
                />
              </Stack>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <Stack space={4}>
                <Select
                  label="T-Shirt Size"
                  value={data.tshirtSize}
                  onSelectionChange={value =>
                    updateData({ tshirtSize: value as string })
                  }
                >
                  {tshirtSizes.map(size => (
                    <Select.Option key={size} id={size}>
                      {size}
                    </Select.Option>
                  ))}
                </Select>

                <TagField
                  label="Topics of Interest"
                  placeholder="Select topics..."
                  value={data.topicsOfInterest}
                  onSelectionChange={keys =>
                    updateData({ topicsOfInterest: keys.map(k => String(k)) })
                  }
                >
                  {topicSuggestions.map(topic => (
                    <TagField.Option key={topic} id={topic}>
                      {topic}
                    </TagField.Option>
                  ))}
                </TagField>

                <Stack space={3}>
                  <Headline level={5}>Communication Preferences</Headline>
                  <Checkbox
                    label="Email updates about the event"
                    value="emailUpdates"
                    checked={data.emailUpdates}
                    onChange={() =>
                      updateData({ emailUpdates: !data.emailUpdates })
                    }
                  />
                  <Checkbox
                    label="SMS reminders"
                    value="smsReminders"
                    checked={data.smsReminders}
                    onChange={() =>
                      updateData({ smsReminders: !data.smsReminders })
                    }
                  />
                  <Checkbox
                    label="Post-event survey"
                    value="postEventSurvey"
                    checked={data.postEventSurvey}
                    onChange={() =>
                      updateData({ postEventSurvey: !data.postEventSurvey })
                    }
                  />
                  <Checkbox
                    label="Newsletter subscription"
                    value="newsletterSubscription"
                    checked={data.newsletterSubscription}
                    onChange={() =>
                      updateData({
                        newsletterSubscription: !data.newsletterSubscription,
                      })
                    }
                  />
                </Stack>

                <Stack space={3}>
                  <Switch
                    label="I have accessibility requirements"
                    selected={data.hasAccessibilityNeeds}
                    onChange={() =>
                      updateData({
                        hasAccessibilityNeeds: !data.hasAccessibilityNeeds,
                      })
                    }
                  />
                  {data.hasAccessibilityNeeds && (
                    <TextArea
                      label="Accessibility Details"
                      value={data.accessibilityDetails}
                      onChange={value =>
                        updateData({ accessibilityDetails: value })
                      }
                      placeholder="Please describe your accessibility needs..."
                      rows={4}
                    />
                  )}
                </Stack>
              </Stack>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <Stack space={4}>
                <Accordion>
                  <Accordion.Item>
                    <Accordion.Header>Personal Information</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Inline alignX="between">
                          <Text weight="bold">Full Name:</Text>
                          <Text>{data.fullName}</Text>
                        </Inline>
                        <Inline alignX="between">
                          <Text weight="bold">Email:</Text>
                          <Text>{data.email}</Text>
                        </Inline>
                        {data.phone && (
                          <Inline alignX="between">
                            <Text weight="bold">Phone:</Text>
                            <Text>{data.phone}</Text>
                          </Inline>
                        )}
                        {data.company && (
                          <Inline alignX="between">
                            <Text weight="bold">Company:</Text>
                            <Text>{data.company}</Text>
                          </Inline>
                        )}
                        {data.jobTitle && (
                          <Inline alignX="between">
                            <Text weight="bold">Job Title:</Text>
                            <Text>{data.jobTitle}</Text>
                          </Inline>
                        )}
                        {data.profilePhoto && (
                          <Inline alignX="between">
                            <Text weight="bold">Profile Photo:</Text>
                            <Text size="xs" variant="muted">
                              {data.profilePhoto.name}
                            </Text>
                          </Inline>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item>
                    <Accordion.Header>Event Details</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        {data.eventDate && (
                          <Inline alignX="between">
                            <Text weight="bold">Event Date:</Text>
                            <Text>{data.eventDate}</Text>
                          </Inline>
                        )}
                        {data.timeSlot && (
                          <Inline alignX="between">
                            <Text weight="bold">Time Slot:</Text>
                            <Text>{data.timeSlot}</Text>
                          </Inline>
                        )}
                        {data.sessionTrack && (
                          <Inline alignX="between">
                            <Text weight="bold">Track:</Text>
                            <Text>{data.sessionTrack}</Text>
                          </Inline>
                        )}
                        {data.dietaryRequirements.length > 0 && (
                          <Inline alignX="between">
                            <Text weight="bold">Dietary:</Text>
                            <Text>{data.dietaryRequirements.join(', ')}</Text>
                          </Inline>
                        )}
                        <Inline alignX="between">
                          <Text weight="bold">Guests:</Text>
                          <Text>{data.numGuests}</Text>
                        </Inline>
                        {data.specialRequests && (
                          <Stack space={1}>
                            <Text weight="bold">Special Requests:</Text>
                            <Text size="sm">{data.specialRequests}</Text>
                          </Stack>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item>
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        {data.tshirtSize && (
                          <Inline alignX="between">
                            <Text weight="bold">T-Shirt Size:</Text>
                            <Text>{data.tshirtSize}</Text>
                          </Inline>
                        )}
                        {data.topicsOfInterest.length > 0 && (
                          <Stack space={1}>
                            <Text weight="bold">Topics:</Text>
                            <Text size="sm">
                              {data.topicsOfInterest.join(', ')}
                            </Text>
                          </Stack>
                        )}
                        <Stack space={1}>
                          <Text weight="bold">Preferences:</Text>
                          <Stack space={0.5}>
                            {data.emailUpdates && (
                              <Text size="sm">✓ Email updates</Text>
                            )}
                            {data.smsReminders && (
                              <Text size="sm">✓ SMS reminders</Text>
                            )}
                            {data.postEventSurvey && (
                              <Text size="sm">✓ Post-event survey</Text>
                            )}
                            {data.newsletterSubscription && (
                              <Text size="sm">✓ Newsletter</Text>
                            )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Checkbox
                  label="I agree to the terms and conditions"
                  value="termsAgreed"
                  checked={data.fullName !== ''}
                  onChange={() => {}}
                />
              </Stack>
            )}

            {/* Navigation Buttons */}
            <Inline alignX="between" space={4}>
              <Button
                disabled={step === 1}
                onPress={handleBack}
                variant="secondary"
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
                  loading={loading}
                  onPress={handleSubmit}
                >
                  Submit Registration
                </Button>
              )}
            </Inline>
          </Stack>
        </Card>
      </Stack>
    </ToastProvider>
  );
};

/* ComboBox-like wrapper using Select for job title autocomplete */
function ComboBoxWrapper({
  label,
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Stack space={2}>
      <Text size="sm" weight="bold">
        {label}
      </Text>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="border border-secondary-300 rounded px-2 py-2"
      />
      {isOpen && filtered.length > 0 && (
        <Stack
          space={1}
          className="border border-secondary-300 rounded bg-bg-body"
        >
          {filtered.map(suggestion => (
            <Text
              key={suggestion}
              size="sm"
              className="px-2 py-1 cursor-pointer hover:bg-primary-100"
              onClick={() => {
                onChange(suggestion);
                setInputValue(suggestion);
                setIsOpen(false);
              }}
            >
              {suggestion}
            </Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default TestApp;
