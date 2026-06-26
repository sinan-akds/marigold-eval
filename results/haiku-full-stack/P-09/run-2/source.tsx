import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Card,
  Stack,
  TextField,
  Button,
  Inline,
  Select,
  DatePicker,
  TimeField,
  Radio,
  Checkbox,
  Switch,
  TextArea,
  FileField,
  Accordion,
  SectionMessage,
  Loader,
  useToast,
  ToastProvider,
  Text,
  NumberField,
} from '@marigold/components';

interface RegistrationData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  photoFile: File | null;
  // Step 2
  eventDate: DateValue | null;
  timeSlot: any;
  sessionTrack: string;
  dietaryRequirements: Set<string>;
  guests: number;
  specialRequests: string;
  // Step 3
  tShirtSize: string;
  topicsOfInterest: Set<string>;
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletter: boolean;
  accessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const emptyData: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  photoFile: null,
  eventDate: null,
  timeSlot: null,
  sessionTrack: '',
  dietaryRequirements: new Set(),
  guests: 0,
  specialRequests: '',
  tShirtSize: '',
  topicsOfInterest: new Set(),
  emailUpdates: false,
  smsReminders: false,
  postEventSurvey: false,
  newsletter: false,
  accessibilityNeeds: false,
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

const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const topicSuggestions = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const tShirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <Stack space={4}>
    <Text weight="bold" fontSize="lg">
      Step {current} of {total} — {
        current === 1 && 'Personal Information'
      }
      {current === 2 && 'Event Details'}
      {current === 3 && 'Preferences'}
      {current === 4 && 'Review & Confirm'}
    </Text>
  </Stack>
);

const Step1 = ({
  data,
  onDataChange,
}: {
  data: RegistrationData;
  onDataChange: (data: RegistrationData) => void;
}) => (
  <Stack space={6}>
    <StepIndicator current={1} total={4} />
    <SectionMessage>
      <SectionMessage.Content>
        Your information will only be used for this event.
      </SectionMessage.Content>
    </SectionMessage>
    <TextField
      label="Full Name"
      required
      value={data.fullName}
      onChange={value =>
        onDataChange({ ...data, fullName: value || '' })
      }
    />
    <TextField
      label="Email"
      type="email"
      required
      value={data.email}
      onChange={value =>
        onDataChange({ ...data, email: value || '' })
      }
    />
    <TextField
      label="Phone Number"
      type="tel"
      value={data.phone}
      onChange={value => onDataChange({ ...data, phone: value || '' })}
    />
    <TextField
      label="Company / Organization"
      value={data.company}
      onChange={value =>
        onDataChange({ ...data, company: value || '' })
      }
    />
    <Select
      label="Job Title"
      selectedKey={data.jobTitle || undefined}
      onSelectionChange={key =>
        onDataChange({ ...data, jobTitle: key as string })
      }
    >
      {jobTitleSuggestions.map(title => (
        <Select.Option key={title} id={title}>
          {title}
        </Select.Option>
      ))}
    </Select>
    <FileField
      label="Profile Photo"
      accept={['image/*']}
    />
  </Stack>
);

const Step2 = ({
  data,
  onDataChange,
}: {
  data: RegistrationData;
  onDataChange: (data: RegistrationData) => void;
}) => {
  const handleDietaryChange = (key: string) => {
    const updated = new Set(data.dietaryRequirements);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    onDataChange({ ...data, dietaryRequirements: updated });
  };

  return (
    <Stack space={6}>
      <StepIndicator current={2} total={4} />
      <DatePicker
        label="Event Date"
        required
        value={data.eventDate || undefined}
        onChange={date => onDataChange({ ...data, eventDate: date })}
      />
      <TimeField
        label="Preferred Time Slot"
        value={data.timeSlot || undefined}
        onChange={time => onDataChange({ ...data, timeSlot: time })}
      />
      <Radio.Group
        label="Session Track"
        value={data.sessionTrack || undefined}
        onChange={value =>
          onDataChange({ ...data, sessionTrack: value as string })
        }
      >
        <Radio value="technical">Technical</Radio>
        <Radio value="design">Design</Radio>
        <Radio value="business">Business</Radio>
        <Radio value="workshop">Workshop</Radio>
      </Radio.Group>
      <Stack space={2}>
        <Text weight="bold" fontSize="sm">
          Dietary Requirements
        </Text>
        <Stack space={2}>
          {dietaryOptions.map(option => (
            <Checkbox
              key={option}
              value={option}
              label={option}
              checked={data.dietaryRequirements.has(option)}
              onChange={() => handleDietaryChange(option)}
            />
          ))}
        </Stack>
      </Stack>
      <NumberField
        label="Number of Guests"
        minValue={0}
        maxValue={5}
        value={data.guests}
        onChange={value =>
          onDataChange({ ...data, guests: value || 0 })
        }
      />
      <TextArea
        label="Special Requests"
        value={data.specialRequests}
        onChange={value =>
          onDataChange({ ...data, specialRequests: value || '' })
        }
      />
    </Stack>
  );
};

const Step3 = ({
  data,
  onDataChange,
}: {
  data: RegistrationData;
  onDataChange: (data: RegistrationData) => void;
}) => {
  const handleTopicsChange = (key: string) => {
    const updated = new Set(data.topicsOfInterest);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    onDataChange({ ...data, topicsOfInterest: updated });
  };

  return (
    <Stack space={6}>
      <StepIndicator current={3} total={4} />
      <Select
        label="T-Shirt Size"
        selectedKey={data.tShirtSize || undefined}
        onSelectionChange={key =>
          onDataChange({ ...data, tShirtSize: key as string })
        }
      >
        {tShirtSizes.map(size => (
          <Select.Option key={size} id={size}>
            {size}
          </Select.Option>
        ))}
      </Select>
      <Stack space={2}>
        <Text weight="bold" fontSize="sm">
          Topics of Interest
        </Text>
        <Stack space={2}>
          {topicSuggestions.map(topic => (
            <Checkbox
              key={topic}
              value={topic}
              label={topic}
              checked={data.topicsOfInterest.has(topic)}
              onChange={() => handleTopicsChange(topic)}
            />
          ))}
        </Stack>
      </Stack>
      <Stack space={2}>
        <Text weight="bold" fontSize="sm">
          Communication Preferences
        </Text>
        <Stack space={2}>
          <Checkbox
            value="email"
            label="Email updates about the event"
            checked={data.emailUpdates}
            onChange={checked =>
              onDataChange({ ...data, emailUpdates: checked })
            }
          />
          <Checkbox
            value="sms"
            label="SMS reminders"
            checked={data.smsReminders}
            onChange={checked =>
              onDataChange({ ...data, smsReminders: checked })
            }
          />
          <Checkbox
            value="survey"
            label="Post-event survey"
            checked={data.postEventSurvey}
            onChange={checked =>
              onDataChange({ ...data, postEventSurvey: checked })
            }
          />
          <Checkbox
            value="newsletter"
            label="Newsletter subscription"
            checked={data.newsletter}
            onChange={checked =>
              onDataChange({ ...data, newsletter: checked })
            }
          />
        </Stack>
      </Stack>
      <Stack space={2}>
        <Text weight="bold" fontSize="sm">
          Accessibility Needs
        </Text>
        <Switch
          label="I have accessibility requirements"
          defaultSelected={data.accessibilityNeeds}
          onChange={checked =>
            onDataChange({ ...data, accessibilityNeeds: checked })
          }
        />
        {data.accessibilityNeeds && (
          <TextArea
            label="Please describe your accessibility requirements"
            value={data.accessibilityDetails}
            onChange={value =>
              onDataChange({ ...data, accessibilityDetails: value || '' })
            }
          />
        )}
      </Stack>
    </Stack>
  );
};

const Step4 = ({
  data,
  termsAccepted,
  onTermsChange,
}: {
  data: RegistrationData;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}) => (
  <Stack space={6}>
    <StepIndicator current={4} total={4} />
    <Accordion>
      <Accordion.Item id="personal">
        <Accordion.Header>Personal Information</Accordion.Header>
        <Accordion.Content>
          <Stack space={2}>
            <Stack space={1}>
              <Text weight="bold" fontSize="sm">Name:</Text>
              <Text>{data.fullName}</Text>
            </Stack>
            <Stack space={1}>
              <Text weight="bold" fontSize="sm">Email:</Text>
              <Text>{data.email}</Text>
            </Stack>
            {data.phone && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Phone:</Text>
                <Text>{data.phone}</Text>
              </Stack>
            )}
            {data.company && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Company:</Text>
                <Text>{data.company}</Text>
              </Stack>
            )}
            {data.jobTitle && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Job Title:</Text>
                <Text>{data.jobTitle}</Text>
              </Stack>
            )}
          </Stack>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item id="event">
        <Accordion.Header>Event Details</Accordion.Header>
        <Accordion.Content>
          <Stack space={2}>
            {data.eventDate && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Date:</Text>
                <Text>
                  {data.eventDate.toDate?.('en-US').toLocaleDateString() ||
                    `${data.eventDate.month}/${data.eventDate.day}/${data.eventDate.year}`}
                </Text>
              </Stack>
            )}
            {data.timeSlot && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Time:</Text>
                <Text>{data.timeSlot.toString?.() || 'Selected'}</Text>
              </Stack>
            )}
            {data.sessionTrack && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Track:</Text>
                <Text>{data.sessionTrack}</Text>
              </Stack>
            )}
            {data.dietaryRequirements.size > 0 && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Dietary:</Text>
                <Text>{Array.from(data.dietaryRequirements).join(', ')}</Text>
              </Stack>
            )}
            <Stack space={1}>
              <Text weight="bold" fontSize="sm">Guests:</Text>
              <Text>{data.guests}</Text>
            </Stack>
            {data.specialRequests && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Special Requests:</Text>
                <Text>{data.specialRequests}</Text>
              </Stack>
            )}
          </Stack>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item id="preferences">
        <Accordion.Header>Preferences</Accordion.Header>
        <Accordion.Content>
          <Stack space={2}>
            {data.tShirtSize && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">T-Shirt Size:</Text>
                <Text>{data.tShirtSize}</Text>
              </Stack>
            )}
            {data.topicsOfInterest.size > 0 && (
              <Stack space={1}>
                <Text weight="bold" fontSize="sm">Topics:</Text>
                <Text>{Array.from(data.topicsOfInterest).join(', ')}</Text>
              </Stack>
            )}
            <Stack space={1}>
              <Text weight="bold" fontSize="sm">Communication:</Text>
              <Stack space={1}>
                {data.emailUpdates && <Text>✓ Email updates</Text>}
                {data.smsReminders && <Text>✓ SMS reminders</Text>}
                {data.postEventSurvey && <Text>✓ Post-event survey</Text>}
                {data.newsletter && <Text>✓ Newsletter</Text>}
              </Stack>
            </Stack>
          </Stack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Checkbox
      value="terms"
      label="I agree to the terms and conditions"
      checked={termsAccepted}
      onChange={val => onTermsChange(val)}
    />
  </Stack>
);

const SuccessView = ({ data, onReset }: { data: RegistrationData; onReset: () => void }) => {
  const confirmationNumber = Math.random()
    .toString(36)
    .substring(2, 9)
    .toUpperCase();

  return (
    <Stack space={6} alignX="center">
      <SectionMessage>
        <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
      </SectionMessage>
      <Card>
        <Stack space={4}>
          <div>
            <Text weight="bold" fontSize="lg">
              {data.fullName}
            </Text>
            <Text fontSize="sm">{data.email}</Text>
          </div>
          {data.eventDate && (
            <div>
              <Text weight="bold" fontSize="sm">Event Date:</Text>
              <Text>
                {data.eventDate.toDate?.('en-US').toLocaleDateString() ||
                  `${data.eventDate.month}/${data.eventDate.day}/${data.eventDate.year}`}
              </Text>
            </div>
          )}
          <div>
            <Text weight="bold" fontSize="sm">Confirmation Number:</Text>
            <Text fontSize="lg" weight="extrabold">
              {confirmationNumber}
            </Text>
          </div>
        </Stack>
      </Card>
      <Button variant="primary" onPress={() => onReset()}>
        Register Another
      </Button>
    </Stack>
  );
};

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(emptyData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showLoadingBriefly, setShowLoadingBriefly] = useState(false);
  const { addToast } = useToast();

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!data.fullName.trim()) {
        addToast({
          title: 'Validation Error',
          description: 'Full name is required',
          variant: 'error',
        });
        return false;
      }
      if (!data.email.trim() || !validateEmail(data.email)) {
        addToast({
          title: 'Validation Error',
          description: 'Valid email is required',
          variant: 'error',
        });
        return false;
      }
    } else if (step === 2) {
      if (!data.eventDate) {
        addToast({
          title: 'Validation Error',
          description: 'Event date is required',
          variant: 'error',
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      addToast({
        title: 'Validation Error',
        description: 'You must accept the terms and conditions',
        variant: 'error',
      });
      return;
    }
    setIsSubmitting(true);
    setShowLoadingBriefly(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowLoadingBriefly(false);
    setSubmitted(true);
    addToast({
      title: 'Success',
      description: 'Registration submitted successfully',
      variant: 'success',
    });
  };

  const handleReset = () => {
    setStep(1);
    setData(emptyData);
    setTermsAccepted(false);
    setIsSubmitting(false);
    setSubmitted(false);
    setShowLoadingBriefly(false);
  };

  if (showLoadingBriefly) {
    return <Loader mode="fullscreen" />;
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
        <Card>
          <SuccessView data={data} onReset={handleReset} />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
      <Card>
        <Stack space={8}>
          {step === 1 && <Step1 data={data} onDataChange={setData} />}
          {step === 2 && <Step2 data={data} onDataChange={setData} />}
          {step === 3 && <Step3 data={data} onDataChange={setData} />}
          {step === 4 && (
            <Step4
              data={data}
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
            />
          )}
          <Inline space={4} alignX="right">
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
                disabled={!termsAccepted || isSubmitting}
                onPress={handleSubmit}
                loading={isSubmitting}
              >
                Submit Registration
              </Button>
            )}
          </Inline>
        </Stack>
      </Card>
      <ToastProvider position="bottom-right" />
    </div>
  );
};

export default TestApp;
