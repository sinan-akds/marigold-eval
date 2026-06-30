import { useState } from 'react';
import type { Key } from '@react-types/shared';
import {
  Accordion,
  Autocomplete,
  Button,
  Card,
  Checkbox,
  ComboBox,
  Container,
  DatePicker,
  Divider,
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

const STEPS = [
  { n: 1, title: 'Personal Information' },
  { n: 2, title: 'Event Details' },
  { n: 3, title: 'Preferences' },
  { n: 4, title: 'Review & Confirm' },
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
const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TOPICS = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];
const COMMS = [
  { id: 'email', label: 'Email updates about the event' },
  { id: 'sms', label: 'SMS reminders' },
  { id: 'survey', label: 'Post-event survey' },
  { id: 'newsletter', label: 'Newsletter subscription' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  photoName: string;
  photoUrl: string;
  eventDate: any;
  timeSlot: any;
  track: string;
  dietary: string;
  guests: number;
  specialRequests: string;
  tshirt: string;
  topics: Key[];
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
  photoName: '',
  photoUrl: '',
  eventDate: null,
  timeSlot: null,
  track: '',
  dietary: '',
  guests: 0,
  specialRequests: '',
  tshirt: '',
  topics: [],
  comms: [],
  accessibility: false,
  accessibilityDetails: '',
  agreed: false,
};

const TestApp = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const validateStep = (current: number) => {
    const next: { [k: string]: string } = {};
    if (current === 1) {
      if (!form.fullName.trim()) next.fullName = 'Full name is required.';
      if (!form.email.trim()) {
        next.email = 'Email is required.';
      } else if (!EMAIL_RE.test(form.email)) {
        next.email = 'Enter a valid email address.';
      }
    }
    if (current === 2) {
      if (!form.eventDate) next.eventDate = 'Event date is required.';
    }
    return next;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep(s => Math.min(4, s + 1));
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    setLoading(true);
    window.setTimeout(() => {
      const number = `EVT-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmation(number);
      setLoading(false);
      setSubmitted(true);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    }, 1000);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setErrors({});
    setStep(1);
    setSubmitted(false);
    setLoading(false);
    setConfirmation('');
  };

  // Capture the file selected through Marigold's FileField. The change event
  // from the underlying file input bubbles up to the FileField container.
  const photoCapture: any = {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement;
      const file = target.files && target.files[0];
      if (file && file.name !== form.photoName) {
        update('photoName', file.name);
        update('photoUrl', URL.createObjectURL(file));
      }
    },
  };

  const renderStep1 = () => (
    <Stack space={5}>
      <SectionMessage variant="info">
        <SectionMessage.Title>Privacy notice</SectionMessage.Title>
        <SectionMessage.Content>
          Your information will only be used for this event.
        </SectionMessage.Content>
      </SectionMessage>
      <TextField
        label="Full Name"
        value={form.fullName}
        onChange={value => update('fullName', value)}
        required
        error={Boolean(errors.fullName)}
        errorMessage={errors.fullName}
      />
      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={value => update('email', value)}
        required
        error={Boolean(errors.email)}
        errorMessage={errors.email}
      />
      <TextField
        label="Phone Number"
        type="tel"
        value={form.phone}
        onChange={value => update('phone', value)}
      />
      <TextField
        label="Company / Organization"
        value={form.company}
        onChange={value => update('company', value)}
      />
      <Autocomplete
        label="Job Title"
        description="Start typing to see suggestions."
        value={form.jobTitle}
        onChange={value => update('jobTitle', value)}
        menuTrigger="focus"
      >
        {JOB_TITLES.map(title => (
          <Autocomplete.Option key={title} id={title}>
            {title}
          </Autocomplete.Option>
        ))}
      </Autocomplete>
      <Stack space={2}>
        <FileField
          label="Profile Photo"
          accept={['image/*']}
          {...photoCapture}
        />
        {form.photoUrl ? (
          <img src={form.photoUrl} alt="Profile preview" width={96} height={96} />
        ) : null}
      </Stack>
    </Stack>
  );

  const renderStep2 = () => (
    <Stack space={5}>
      <DatePicker
        label="Event Date"
        value={form.eventDate}
        onChange={value => update('eventDate', value)}
        required
        error={Boolean(errors.eventDate)}
        errorMessage={errors.eventDate}
      />
      <TimeField
        label="Preferred Time Slot"
        value={form.timeSlot}
        onChange={value => update('timeSlot', value)}
      />
      <Radio.Group
        label="Session Track"
        value={form.track}
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
        description="Pick an option or type your own."
        allowsCustomValue
        menuTrigger="focus"
        value={form.dietary}
        onChange={value => update('dietary', value)}
      >
        {DIETARY.map(item => (
          <ComboBox.Option key={item} id={item}>
            {item}
          </ComboBox.Option>
        ))}
      </ComboBox>
      <NumberField
        label="Number of Guests"
        minValue={0}
        maxValue={5}
        value={form.guests}
        onChange={value => update('guests', Number.isNaN(value) ? 0 : value)}
        width="1/3"
      />
      <TextArea
        label="Special Requests"
        rows={4}
        value={form.specialRequests}
        onChange={value => update('specialRequests', value)}
      />
    </Stack>
  );

  const renderStep3 = () => (
    <Stack space={5}>
      <Select
        label="T-Shirt Size"
        selectedKey={form.tshirt || null}
        onSelectionChange={key => update('tshirt', key ? String(key) : '')}
        width="1/3"
      >
        {TSHIRT_SIZES.map(size => (
          <Select.Option key={size} id={size}>
            {size}
          </Select.Option>
        ))}
      </Select>
      <TagField
        label="Topics of Interest"
        description="Add topics that interest you."
        value={form.topics}
        onChange={keys => update('topics', Array.from(keys as Iterable<Key>))}
      >
        {TOPICS.map(topic => (
          <TagField.Option key={topic} id={topic}>
            {topic}
          </TagField.Option>
        ))}
      </TagField>
      <Checkbox.Group
        label="Communication Preferences"
        value={form.comms}
        onChange={value => update('comms', value as string[])}
      >
        {COMMS.map(option => (
          <Checkbox key={option.id} value={option.id} label={option.label} />
        ))}
      </Checkbox.Group>
      <Stack space={3}>
        <Switch
          label="I have accessibility requirements"
          selected={form.accessibility}
          onChange={value => update('accessibility', value)}
        />
        {form.accessibility ? (
          <TextArea
            label="Accessibility Needs"
            description="Tell us how we can support you."
            rows={3}
            value={form.accessibilityDetails}
            onChange={value => update('accessibilityDetails', value)}
          />
        ) : null}
      </Stack>
    </Stack>
  );

  const reviewRow = (label: string, value: string) => (
    <Inline space={2} alignY="center">
      <Text weight="bold">{label}:</Text>
      <Text>{value || '—'}</Text>
    </Inline>
  );

  const renderStep4 = () => (
    <Stack space={5}>
      <Accordion
        allowsMultipleExpanded
        defaultExpandedKeys={['personal', 'event', 'preferences']}
      >
        <Accordion.Item id="personal">
          <Accordion.Header>Personal Information</Accordion.Header>
          <Accordion.Content>
            <Stack space={1}>
              {reviewRow('Name', form.fullName)}
              {reviewRow('Email', form.email)}
              {reviewRow('Phone', form.phone)}
              {reviewRow('Company', form.company)}
              {reviewRow('Job Title', form.jobTitle)}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="event">
          <Accordion.Header>Event Details</Accordion.Header>
          <Accordion.Content>
            <Stack space={1}>
              {reviewRow(
                'Date',
                form.eventDate ? String(form.eventDate) : ''
              )}
              {reviewRow('Time', form.timeSlot ? String(form.timeSlot) : '')}
              {reviewRow('Track', form.track)}
              {reviewRow('Dietary', form.dietary)}
              {reviewRow('Guests', String(form.guests))}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item id="preferences">
          <Accordion.Header>Preferences</Accordion.Header>
          <Accordion.Content>
            <Stack space={1}>
              {reviewRow('T-Shirt Size', form.tshirt)}
              {reviewRow('Topics', form.topics.map(String).join(', '))}
              {reviewRow(
                'Communication',
                form.comms
                  .map(id => COMMS.find(c => c.id === id)?.label ?? id)
                  .join(', ')
              )}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      <Checkbox
        checked={form.agreed}
        onChange={value => update('agreed', value)}
        label="I agree to the terms and conditions"
      />
    </Stack>
  );

  const renderSuccess = () => (
    <Stack space={5}>
      <SectionMessage variant="success">
        <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
        <SectionMessage.Content>
          Thank you for registering. A confirmation has been generated below.
        </SectionMessage.Content>
      </SectionMessage>
      <Card variant="default" p={6} stretch>
        <Stack space={2}>
          <Headline level="2">Registration Summary</Headline>
          <Divider />
          {reviewRow('Name', form.fullName)}
          {reviewRow('Email', form.email)}
          {reviewRow('Event Date', form.eventDate ? String(form.eventDate) : '')}
          {reviewRow('Confirmation Number', confirmation)}
        </Stack>
      </Card>
      <Button variant="primary" onPress={handleReset}>
        Register Another
      </Button>
    </Stack>
  );

  const renderForm = () => {
    const active = STEPS[step - 1];
    return (
      <Stack space={6}>
        <Stack space={1}>
          <Text weight="bold" color="text-accent">
            Step {step} of 4
          </Text>
          <Headline level="2">
            Step {step} of 4 — {active.title}
          </Headline>
        </Stack>
        <Divider />
        {step === 1 ? renderStep1() : null}
        {step === 2 ? renderStep2() : null}
        {step === 3 ? renderStep3() : null}
        {step === 4 ? renderStep4() : null}
        <Divider />
        <Inline space={3} alignX="between" alignY="center">
          <Button
            variant="secondary"
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
              disabled={!form.agreed}
              onPress={handleSubmit}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    );
  };

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Container align="center">
        <Stack space={5}>
          <Headline level="1">Event Registration</Headline>
          <Card variant="default" p={7} stretch>
          {submitted ? (
            renderSuccess()
          ) : loading ? (
            <Stack space={4} alignX="center">
              <Loader />
              <Text>Submitting your registration…</Text>
            </Stack>
          ) : (
            renderForm()
          )}
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default TestApp;
