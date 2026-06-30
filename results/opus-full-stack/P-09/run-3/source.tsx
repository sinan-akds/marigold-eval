import { useCallback, useRef, useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  AppLayout,
  Button,
  Card,
  Inset,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  DatePicker,
  Divider,
  FileField,
  Form,
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
  type TimeValue,
} from '@marigold/components';

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

const JOB_TITLES = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];

const TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];

const DIETARY = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal'];

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TOPICS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const COMM_OPTIONS = [
  { value: 'email', label: 'Email updates about the event' },
  { value: 'sms', label: 'SMS reminders' },
  { value: 'survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  eventDate: DateValue | null;
  timeSlot: TimeValue | null;
  track: string;
  dietary: string;
  guests: number;
  specialRequests: string;
  shirtSize: string;
  topics: string[];
  comms: string[];
  accessibility: boolean;
  accessibilityDetails: string;
  agreed: boolean;
}

const INITIAL: FormState = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  eventDate: null,
  timeSlot: null,
  track: '',
  dietary: '',
  guests: 1,
  specialRequests: '',
  shirtSize: '',
  topics: [],
  comms: [],
  accessibility: false,
  accessibilityDetails: '',
  agreed: false,
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatDate = (d: DateValue | null) =>
  d ? `${d.year}-${pad(d.month)}-${pad(d.day)}` : '';

const formatTime = (t: TimeValue | null) =>
  t ? `${pad(t.hour)}:${pad(t.minute)}` : '';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Field = ({ label, value }: { label: string; value: string }) => (
  <Inline space={2} alignY="center">
    <Text weight="bold">{label}:</Text>
    <Text>{value && value.length ? value : '—'}</Text>
  </Inline>
);

const TestApp = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [photo, setPhoto] = useState<{ name: string; url: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const photoRef = useRef<{ name: string; url: string } | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setData(prev => ({ ...prev, [key]: value }));

  // Capture the file selected inside FileField (which manages its own state)
  // so the photo persists across steps and can be previewed.
  const handleFormChange = useCallback((event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target?.type === 'file' && target.files && target.files.length > 0) {
      const file = target.files[0];
      if (photoRef.current?.url) {
        URL.revokeObjectURL(photoRef.current.url);
      }
      const next = { name: file.name, url: URL.createObjectURL(file) };
      photoRef.current = next;
      setPhoto(next);
    }
  }, []);

  const setFormRef = useCallback(
    (node: HTMLFormElement | null) => {
      if (node) {
        node.addEventListener('change', handleFormChange);
      }
    },
    [handleFormChange]
  );

  const validateStep = (current: number) => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (current === 1) {
      if (!data.fullName.trim()) next.fullName = 'Full name is required.';
      if (!data.email.trim()) {
        next.email = 'Email is required.';
      } else if (!EMAIL_RE.test(data.email.trim())) {
        next.email = 'Enter a valid email address.';
      }
    }
    if (current === 2) {
      if (!data.eventDate) next.eventDate = 'Event date is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => Math.max(1, s - 1));
  };

  const handleNext = () => {
    if (step === 4) {
      handleSubmit();
      return;
    }
    if (validateStep(step)) {
      setStep(s => s + 1);
    }
  };

  const handleSubmit = () => {
    const conf = `EVT-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmation(conf);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    }, 1000);
  };

  const handleReset = () => {
    if (photoRef.current?.url) {
      URL.revokeObjectURL(photoRef.current.url);
    }
    photoRef.current = null;
    setData(INITIAL);
    setErrors({});
    setPhoto(null);
    setConfirmation('');
    setSubmitted(false);
    setStep(1);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <Stack space={4}>
          <SectionMessage variant="info">
            <SectionMessage.Content>
              Your information will only be used for this event.
            </SectionMessage.Content>
          </SectionMessage>
          <TextField
            label="Full Name"
            value={data.fullName}
            onChange={value => update('fullName', value)}
            required
            error={!!errors.fullName}
            errorMessage={errors.fullName}
            width="full"
          />
          <TextField
            label="Email"
            type="email"
            value={data.email}
            onChange={value => update('email', value)}
            required
            error={!!errors.email}
            errorMessage={errors.email}
            width="full"
          />
          <TextField
            label="Phone Number"
            type="tel"
            value={data.phone}
            onChange={value => update('phone', value)}
            width="full"
          />
          <TextField
            label="Company / Organization"
            value={data.company}
            onChange={value => update('company', value)}
            width="full"
          />
          <ComboBox
            label="Job Title"
            allowsCustomValue
            menuTrigger="focus"
            value={data.jobTitle}
            onChange={value => update('jobTitle', value)}
            width="full"
          >
            {JOB_TITLES.map(title => (
              <ComboBox.Option key={title} id={title}>
                {title}
              </ComboBox.Option>
            ))}
          </ComboBox>
          <FileField
            label="Profile Photo"
            accept={['image/*']}
            width="full"
          />
          {photo && (
            <Stack space={2}>
              <Text size="small">Selected: {photo.name}</Text>
              <img
                src={photo.url}
                alt="Profile preview"
                style={{
                  width: '96px',
                  height: '96px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                }}
              />
            </Stack>
          )}
        </Stack>
      );
    }

    if (step === 2) {
      return (
        <Stack space={4}>
          <DatePicker
            label="Event Date"
            value={data.eventDate}
            onChange={value => update('eventDate', value)}
            required
            error={!!errors.eventDate}
            errorMessage={errors.eventDate}
            width="full"
          />
          <TimeField
            label="Preferred Time Slot"
            value={data.timeSlot}
            onChange={value => update('timeSlot', value)}
            width="full"
          />
          <Radio.Group
            label="Session Track"
            value={data.track}
            onChange={value => update('track', value)}
          >
            {TRACKS.map(track => (
              <Radio key={track} value={track}>
                {track}
              </Radio>
            ))}
          </Radio.Group>
          <ComboBox
            label="Dietary Requirements"
            description="Pick a suggestion or type your own."
            allowsCustomValue
            menuTrigger="focus"
            value={data.dietary}
            onChange={value => update('dietary', value)}
            width="full"
          >
            {DIETARY.map(item => (
              <ComboBox.Option key={item} id={item}>
                {item}
              </ComboBox.Option>
            ))}
          </ComboBox>
          <NumberField
            label="Number of Guests"
            value={data.guests}
            onChange={value => update('guests', value)}
            minValue={0}
            maxValue={5}
            width="full"
          />
          <TextArea
            label="Special Requests"
            value={data.specialRequests}
            onChange={value => update('specialRequests', value)}
            width="full"
          />
        </Stack>
      );
    }

    if (step === 3) {
      return (
        <Stack space={4}>
          <Select
            label="T-Shirt Size"
            placeholder="Select a size"
            selectedKey={data.shirtSize || null}
            onSelectionChange={key => update('shirtSize', String(key))}
            width="full"
          >
            {SHIRT_SIZES.map(size => (
              <Select.Option key={size} id={size}>
                {size}
              </Select.Option>
            ))}
          </Select>
          <TagField
            label="Topics of Interest"
            description="Add topics that interest you."
            value={data.topics}
            onChange={keys => update('topics', keys.map(String))}
            width="full"
          >
            {TOPICS.map(topic => (
              <TagField.Option key={topic} id={topic}>
                {topic}
              </TagField.Option>
            ))}
          </TagField>
          <CheckboxGroup
            label="Communication Preferences"
            value={data.comms}
            onChange={value => update('comms', value)}
          >
            {COMM_OPTIONS.map(option => (
              <Checkbox
                key={option.value}
                value={option.value}
                label={option.label}
              />
            ))}
          </CheckboxGroup>
          <Switch
            label="I have accessibility requirements"
            selected={data.accessibility}
            onChange={value => update('accessibility', value)}
          />
          {data.accessibility && (
            <TextArea
              label="Accessibility Needs"
              value={data.accessibilityDetails}
              onChange={value => update('accessibilityDetails', value)}
              width="full"
            />
          )}
        </Stack>
      );
    }

    // Step 4 — Review & confirm
    const commLabels = data.comms
      .map(value => COMM_OPTIONS.find(option => option.value === value)?.label)
      .filter(Boolean)
      .join(', ');

    return (
      <Stack space={4}>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Personal Information</Accordion.Header>
            <Accordion.Content>
              <Stack space={2}>
                <Field label="Name" value={data.fullName} />
                <Field label="Email" value={data.email} />
                <Field label="Phone" value={data.phone} />
                <Field label="Company" value={data.company} />
                <Field label="Job Title" value={data.jobTitle} />
              </Stack>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Event Details</Accordion.Header>
            <Accordion.Content>
              <Stack space={2}>
                <Field label="Date" value={formatDate(data.eventDate)} />
                <Field label="Time" value={formatTime(data.timeSlot)} />
                <Field label="Track" value={data.track} />
                <Field label="Dietary" value={data.dietary} />
                <Field label="Guests" value={String(data.guests)} />
              </Stack>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Preferences</Accordion.Header>
            <Accordion.Content>
              <Stack space={2}>
                <Field label="T-Shirt Size" value={data.shirtSize} />
                <Field label="Topics" value={data.topics.join(', ')} />
                <Field label="Communication" value={commLabels} />
              </Stack>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <Divider />
        <Checkbox
          label="I agree to the terms and conditions"
          checked={data.agreed}
          onChange={value => update('agreed', value)}
        />
      </Stack>
    );
  };

  let content;

  if (submitting) {
    content = (
      <Card p="square-regular">
        <Stack space={4} alignX="center">
          <Loader />
          <Text>Submitting your registration…</Text>
        </Stack>
      </Card>
    );
  } else if (submitted) {
    content = (
      <Stack space={5}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            We've received your registration and emailed a copy of the details.
          </SectionMessage.Content>
        </SectionMessage>
        <Card p="square-regular" space="related">
          <Headline level={3}>Your Registration</Headline>
          <Stack space={2}>
            <Field label="Name" value={data.fullName} />
            <Field label="Email" value={data.email} />
            <Field label="Event Date" value={formatDate(data.eventDate)} />
            <Field label="Confirmation Number" value={confirmation} />
          </Stack>
        </Card>
        <Button variant="primary" onPress={handleReset}>
          Register Another
        </Button>
      </Stack>
    );
  } else {
    content = (
      <Card p="square-regular" space="related">
        <Stack space={5}>
          <Headline level={2}>
            {`Step ${step} of 4 — ${STEP_TITLES[step - 1]}`}
          </Headline>
          <Divider />
          <Form ref={setFormRef} onSubmit={event => event.preventDefault()}>
            {renderStep()}
          </Form>
          <Divider />
          <Inline space={3} alignX="between">
            <Button
              variant="secondary"
              onPress={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onPress={handleNext}
              disabled={step === 4 && !data.agreed}
            >
              {step === 4 ? 'Submit Registration' : 'Next'}
            </Button>
          </Inline>
        </Stack>
      </Card>
    );
  }

  return (
    <>
      <ToastProvider position="bottom-right" />
      <AppLayout>
        <AppLayout.Main>
          <Inset space="square-regular">
            <Stack space={5}>
              <Headline level={1}>Event Registration</Headline>
              {content}
            </Stack>
          </Inset>
        </AppLayout.Main>
      </AppLayout>
    </>
  );
};

export default TestApp;
