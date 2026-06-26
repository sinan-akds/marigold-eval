import { useState, useEffect } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Card,
  Stack,
  Inline,
  Button,
  TextField,
  TextArea,
  Form,
  Select,
  DatePicker,
  NumberField,
  Checkbox,
  Switch,
  FileField,
  Autocomplete,
  ToastProvider,
  useToast,
  Headline,
  Text,
  SectionMessage,
  Accordion,
} from '@marigold/components';

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
  dietaryRequirements: string[];
  numGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: string[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletter: boolean;
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
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
  dietaryRequirements: [],
  numGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topicsOfInterest: [],
  emailUpdates: false,
  smsReminders: false,
  postEventSurvey: false,
  newsletter: false,
  hasAccessibilityNeeds: false,
  accessibilityDetails: '',
};

const JOB_TITLE_SUGGESTIONS = [
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

const TOPIC_SUGGESTIONS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

interface ValidationErrors {
  fullName?: string;
  email?: string;
  eventDate?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateStep = (step: number, data: FormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!data.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  } else if (step === 2) {
    if (!data.eventDate) {
      errors.eventDate = 'Event Date is required';
    }
  }

  return errors;
};

function SuccessView({
  data,
  onReset,
}: {
  data: FormData;
  onReset: () => void;
}) {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
        timeout: 5000,
      });
    }
  }, [isLoading, addToast]);

  if (isLoading) {
    return (
      <Card>
        <Stack space={4} alignX="center">
          <Text>Processing your registration...</Text>
        </Stack>
      </Card>
    );
  }

  const confirmationNumber = Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase();

  return (
    <Stack space={4}>
      <SectionMessage variant="success">
        <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
      </SectionMessage>

      <Card>
        <Stack space={3}>
          <Headline level={4}>Registration Summary</Headline>
          <Stack space={2}>
            <div>
              <Text weight="bold">Name</Text>
              <Text>{data.fullName}</Text>
            </div>
            <div>
              <Text weight="bold">Email</Text>
              <Text>{data.email}</Text>
            </div>
            <div>
              <Text weight="bold">Event Date</Text>
              <Text>
                {data.eventDate
                  ? `${data.eventDate.month}/${data.eventDate.day}/${data.eventDate.year}`
                  : 'Not specified'}
              </Text>
            </div>
            <div>
              <Text weight="bold">Confirmation Number</Text>
              <Text>{confirmationNumber}</Text>
            </div>
          </Stack>
        </Stack>
      </Card>

      <Button variant="primary" onPress={onReset}>
        Register Another
      </Button>
    </Stack>
  );
}

function Step1({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (updated: FormData) => void;
}) {
  return (
    <Stack space={4}>
      <SectionMessage variant="info">
        <SectionMessage.Title>
          Your information will only be used for this event.
        </SectionMessage.Title>
      </SectionMessage>

      <TextField
        label="Full Name"
        required
        value={data.fullName}
        onChange={(val) => onChange({ ...data, fullName: val })}
      />

      <TextField
        label="Email"
        type="email"
        required
        value={data.email}
        onChange={(val) => onChange({ ...data, email: val })}
      />

      <TextField
        label="Phone Number"
        value={data.phone}
        onChange={(val) => onChange({ ...data, phone: val })}
      />

      <TextField
        label="Company / Organization"
        value={data.company}
        onChange={(val) => onChange({ ...data, company: val })}
      />

      <Autocomplete
        label="Job Title"
        value={data.jobTitle}
        onChange={(val) => onChange({ ...data, jobTitle: val })}
        menuTrigger="focus"
      >
        {JOB_TITLE_SUGGESTIONS.map((title) => (
          <Autocomplete.Option key={title} id={title}>
            {title}
          </Autocomplete.Option>
        ))}
      </Autocomplete>

      <FileField
        label="Profile Photo"
        accept={['image/*']}
      />
    </Stack>
  );
}

function Step2({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (updated: FormData) => void;
}) {
  return (
    <Stack space={4}>
      <DatePicker
        label="Event Date"
        required
        value={data.eventDate}
        onChange={(date) => onChange({ ...data, eventDate: date })}
      />

      <TextField
        label="Preferred Time Slot"
        type="time"
        value={data.timeSlot}
        onChange={(val) => onChange({ ...data, timeSlot: val })}
      />

      <Select
        label="Session Track"
        value={data.sessionTrack}
        onSelectionChange={(key) =>
          onChange({ ...data, sessionTrack: key as string })
        }
      >
        <Select.Option id="technical">Technical</Select.Option>
        <Select.Option id="design">Design</Select.Option>
        <Select.Option id="business">Business</Select.Option>
        <Select.Option id="workshop">Workshop</Select.Option>
      </Select>

      <Autocomplete
        label="Dietary Requirements"
        value={
          data.dietaryRequirements.length > 0
            ? data.dietaryRequirements[0]
            : ''
        }
        onChange={(val) => {
          if (val) {
            onChange({ ...data, dietaryRequirements: [val] });
          }
        }}
        menuTrigger="focus"
      >
        {DIETARY_OPTIONS.map((diet) => (
          <Autocomplete.Option key={diet} id={diet}>
            {diet}
          </Autocomplete.Option>
        ))}
      </Autocomplete>

      <NumberField
        label="Number of Guests"
        minValue={0}
        maxValue={5}
        value={data.numGuests}
        onChange={(val) => onChange({ ...data, numGuests: val })}
      />

      <TextArea
        label="Special Requests"
        value={data.specialRequests}
        onChange={(val) => onChange({ ...data, specialRequests: val })}
      />
    </Stack>
  );
}

function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (updated: FormData) => void;
}) {
  return (
    <Stack space={4}>
      <Select
        label="T-Shirt Size"
        value={data.tshirtSize}
        onSelectionChange={(key) =>
          onChange({ ...data, tshirtSize: key as string })
        }
      >
        <Select.Option id="xs">XS</Select.Option>
        <Select.Option id="s">S</Select.Option>
        <Select.Option id="m">M</Select.Option>
        <Select.Option id="l">L</Select.Option>
        <Select.Option id="xl">XL</Select.Option>
        <Select.Option id="xxl">XXL</Select.Option>
      </Select>

      <div>
        <Text weight="bold">Topics of Interest</Text>
        <Checkbox.Group
          value={data.topicsOfInterest}
          onChange={(values) =>
            onChange({ ...data, topicsOfInterest: values as string[] })
          }
        >
          <Stack space={2}>
            {TOPIC_SUGGESTIONS.map((topic) => (
              <Checkbox key={topic} value={topic} label={topic} />
            ))}
          </Stack>
        </Checkbox.Group>
      </div>

      <div>
        <Text weight="bold">Communication Preferences</Text>
        <Checkbox.Group
          value={
            [
              data.emailUpdates && 'email',
              data.smsReminders && 'sms',
              data.postEventSurvey && 'survey',
              data.newsletter && 'newsletter',
            ].filter(Boolean) as string[]
          }
          onChange={(values) =>
            onChange({
              ...data,
              emailUpdates: values.includes('email'),
              smsReminders: values.includes('sms'),
              postEventSurvey: values.includes('survey'),
              newsletter: values.includes('newsletter'),
            })
          }
        >
          <Stack space={2}>
            <Checkbox
              value="email"
              label="Email updates about the event"
            />
            <Checkbox value="sms" label="SMS reminders" />
            <Checkbox value="survey" label="Post-event survey" />
            <Checkbox value="newsletter" label="Newsletter subscription" />
          </Stack>
        </Checkbox.Group>
      </div>

      <div>
        <Stack space={2}>
          <Switch
            label="I have accessibility requirements"
            selected={data.hasAccessibilityNeeds}
            onChange={(checked) =>
              onChange({ ...data, hasAccessibilityNeeds: checked })
            }
          />
          {data.hasAccessibilityNeeds && (
            <TextArea
              label="Accessibility Details"
              value={data.accessibilityDetails}
              onChange={(val) =>
                onChange({ ...data, accessibilityDetails: val })
              }
            />
          )}
        </Stack>
      </div>
    </Stack>
  );
}

function Step4({ data }: { data: FormData }) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(
    new Set()
  );

  return (
    <Stack space={4}>
      <Accordion
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
      >
        <Accordion.Item id="personal">
          <Accordion.Header>Personal Information</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <div>
                <Text weight="bold">Name</Text>
                <Text>{data.fullName}</Text>
              </div>
              <div>
                <Text weight="bold">Email</Text>
                <Text>{data.email}</Text>
              </div>
              <div>
                <Text weight="bold">Phone</Text>
                <Text>{data.phone || 'Not provided'}</Text>
              </div>
              <div>
                <Text weight="bold">Company</Text>
                <Text>{data.company || 'Not provided'}</Text>
              </div>
              <div>
                <Text weight="bold">Job Title</Text>
                <Text>{data.jobTitle || 'Not provided'}</Text>
              </div>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="event">
          <Accordion.Header>Event Details</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <div>
                <Text weight="bold">Event Date</Text>
                <Text>
                  {data.eventDate
                    ? `${data.eventDate.month}/${data.eventDate.day}/${data.eventDate.year}`
                    : 'Not specified'}
                </Text>
              </div>
              <div>
                <Text weight="bold">Preferred Time Slot</Text>
                <Text>{data.timeSlot || 'Not specified'}</Text>
              </div>
              <div>
                <Text weight="bold">Session Track</Text>
                <Text>{data.sessionTrack || 'Not specified'}</Text>
              </div>
              <div>
                <Text weight="bold">Dietary Requirements</Text>
                <Text>
                  {data.dietaryRequirements.length > 0
                    ? data.dietaryRequirements.join(', ')
                    : 'None'}
                </Text>
              </div>
              <div>
                <Text weight="bold">Number of Guests</Text>
                <Text>{data.numGuests}</Text>
              </div>
              <div>
                <Text weight="bold">Special Requests</Text>
                <Text>{data.specialRequests || 'None'}</Text>
              </div>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="preferences">
          <Accordion.Header>Preferences</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <div>
                <Text weight="bold">T-Shirt Size</Text>
                <Text>{data.tshirtSize || 'Not selected'}</Text>
              </div>
              <div>
                <Text weight="bold">Topics of Interest</Text>
                <Text>
                  {data.topicsOfInterest.length > 0
                    ? data.topicsOfInterest.join(', ')
                    : 'None'}
                </Text>
              </div>
              <div>
                <Text weight="bold">Communication Preferences</Text>
                <Stack space={1}>
                  {data.emailUpdates && <Text>• Email updates</Text>}
                  {data.smsReminders && <Text>• SMS reminders</Text>}
                  {data.postEventSurvey && <Text>• Post-event survey</Text>}
                  {data.newsletter && <Text>• Newsletter subscription</Text>}
                  {!data.emailUpdates &&
                    !data.smsReminders &&
                    !data.postEventSurvey &&
                    !data.newsletter && <Text>None selected</Text>}
                </Stack>
              </div>
              {data.hasAccessibilityNeeds && (
                <div>
                  <Text weight="bold">Accessibility Needs</Text>
                  <Text>{data.accessibilityDetails}</Text>
                </div>
              )}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}

export default function TestApp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showSuccess, setShowSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleNext = () => {
    const errors = validateStep(step, formData);
    if (Object.keys(errors).length > 0) {
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (!agreedToTerms) {
      return;
    }
    setShowSuccess(true);
  };

  const handleReset = () => {
    setStep(1);
    setFormData(INITIAL_FORM_DATA);
    setShowSuccess(false);
    setAgreedToTerms(false);
  };

  if (showSuccess) {
    return (
      <>
        <ToastProvider position="bottom-right" />
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
          <SuccessView data={formData} onReset={handleReset} />
        </div>
      </>
    );
  }

  return (
    <>
      <ToastProvider position="bottom-right" />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
        <Card>
          <Form onSubmit={step === 4 ? handleSubmit : () => {}}>
            <Stack space={6}>
              <div>
                <Text variant="muted">
                  Step {step} of 4 — {step === 1
                    ? 'Personal Information'
                    : step === 2
                      ? 'Event Details'
                      : step === 3
                        ? 'Preferences'
                        : 'Review & Confirm'}
                </Text>
              </div>

              {step === 1 && (
                <Step1 data={formData} onChange={setFormData} />
              )}
              {step === 2 && (
                <Step2 data={formData} onChange={setFormData} />
              )}
              {step === 3 && (
                <Step3 data={formData} onChange={setFormData} />
              )}
              {step === 4 && <Step4 data={formData} />}

              {step === 4 && (
                <Checkbox
                  value="terms"
                  label="I agree to the terms and conditions"
                  checked={agreedToTerms}
                  onChange={(val) => setAgreedToTerms(!!val)}
                />
              )}

              <Inline space={2} alignX="between">
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
                    disabled={!agreedToTerms}
                  >
                    Submit Registration
                  </Button>
                )}
              </Inline>
            </Stack>
          </Form>
        </Card>
      </div>
    </>
  );
}
