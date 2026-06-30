import { useMemo, useState } from 'react';
import type { DateValue } from '@internationalized/date';
import type { TimeValue } from '@marigold/components';
import {
  Accordion,
  Button,
  Card,
  Center,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  DatePicker,
  FileField,
  Form,
  Headline,
  Inline,
  Inset,
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
type Key = string | number;

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

const DIETARY_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const TRACKS = ['Technical', 'Design', 'Business', 'Workshop'];

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

const COMMUNICATION_OPTIONS = [
  { value: 'email', label: 'Email updates about the event' },
  { value: 'sms', label: 'SMS reminders' },
  { value: 'survey', label: 'Post-event survey' },
  { value: 'newsletter', label: 'Newsletter subscription' },
];

const formatDate = (date: DateValue | null) =>
  date
    ? date.toDate('UTC').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

const formatTime = (time: TimeValue | null) =>
  time
    ? `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
    : '—';

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <Inline space={2} alignY="center">
    <Text weight="bold">{label}:</Text>
    <Text>{value && value.length > 0 ? value : '—'}</Text>
  </Inline>
);

const RegistrationForm = () => {
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  // Step 1 — Personal information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Step 2 — Event details
  const [eventDate, setEventDate] = useState<DateValue | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeValue | null>(null);
  const [track, setTrack] = useState('');
  const [dietary, setDietary] = useState('');
  const [guests, setGuests] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 3 — Preferences
  const [tshirtSize, setTshirtSize] = useState<string>('');
  const [topics, setTopics] = useState<Key[]>([]);
  const [comms, setComms] = useState<string[]>([]);
  const [accessibility, setAccessibility] = useState(false);
  const [accessibilityDetails, setAccessibilityDetails] = useState('');

  // Step 4 — Confirm
  const [agreed, setAgreed] = useState(false);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    setPhotoUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const goBack = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 4) {
      setStep(s => s + 1);
      return;
    }

    // Final submission
    setSubmitting(true);
    window.setTimeout(() => {
      const confirmation = `EVT-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;
      setConfirmationNumber(confirmation);
      setSubmitting(false);
      setSubmitted(true);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    }, 1000);
  };

  const resetFlow = () => {
    setStep(1);
    setSubmitted(false);
    setSubmitting(false);
    setConfirmationNumber('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setJobTitle('');
    setPhotoName('');
    setPhotoUrl(prev => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setEventDate(null);
    setTimeSlot(null);
    setTrack('');
    setDietary('');
    setGuests(0);
    setSpecialRequests('');
    setTshirtSize('');
    setTopics([]);
    setComms([]);
    setAccessibility(false);
    setAccessibilityDetails('');
    setAgreed(false);
  };

  const commsLabels = useMemo(
    () =>
      comms
        .map(v => COMMUNICATION_OPTIONS.find(o => o.value === v)?.label ?? v)
        .join(', '),
    [comms]
  );

  // --- Success view ---
  if (submitting || submitted) {
    return (
      <Inset space={8}>
        <Center maxWidth="40rem">
          <Card>
            <Inset space={8}>
              {submitting ? (
                <Stack space={4} alignX="center">
                  <Loader>Submitting your registration…</Loader>
                </Stack>
              ) : (
                <Stack space={6}>
                  <SectionMessage variant="success">
                    <SectionMessage.Title>
                      Registration confirmed!
                    </SectionMessage.Title>
                    <SectionMessage.Content>
                      Thanks for registering. A confirmation has been generated
                      below.
                    </SectionMessage.Content>
                  </SectionMessage>

                  <Card variant="default">
                    <Inset space={6}>
                      <Stack space={3}>
                        <Headline level={3}>Your Confirmation</Headline>
                        <SummaryRow label="Name" value={fullName} />
                        <SummaryRow label="Email" value={email} />
                        <SummaryRow
                          label="Event Date"
                          value={formatDate(eventDate)}
                        />
                        <SummaryRow
                          label="Confirmation Number"
                          value={confirmationNumber}
                        />
                      </Stack>
                    </Inset>
                  </Card>

                  <Inline space={3} alignX="center">
                    <Button variant="primary" onPress={resetFlow}>
                      Register Another
                    </Button>
                  </Inline>
                </Stack>
              )}
            </Inset>
          </Card>
        </Center>
      </Inset>
    );
  }

  // --- Form view ---
  return (
    <Inset space={8}>
      <Center maxWidth="44rem">
        <Card>
          <Inset space={8}>
            <Form onSubmit={handleSubmit} validationBehavior="native">
              <Stack space={6}>
                <Headline level={2}>
                  Step {step} of 4 — {STEP_TITLES[step - 1]}
                </Headline>

                {step === 1 && (
                  <Stack space={5}>
                    <SectionMessage variant="info">
                      <SectionMessage.Content>
                        Your information will only be used for this event.
                      </SectionMessage.Content>
                    </SectionMessage>

                    <TextField
                      label="Full Name"
                      name="fullName"
                      value={fullName}
                      onChange={setFullName}
                      required
                    />
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                    />
                    <TextField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                    />
                    <TextField
                      label="Company / Organization"
                      name="company"
                      value={company}
                      onChange={setCompany}
                    />
                    <ComboBox
                      label="Job Title"
                      menuTrigger="focus"
                      allowsCustomValue
                      value={jobTitle}
                      onChange={setJobTitle}
                    >
                      {JOB_TITLES.map(title => (
                        <ComboBox.Option key={title} id={title}>
                          {title}
                        </ComboBox.Option>
                      ))}
                    </ComboBox>
                    <Stack space={2}>
                      <FileField
                        label="Profile Photo"
                        accept={['image/*']}
                        // FileField forwards extra props to its container, so the
                        // native file input's change event bubbles up here.
                        {...({ onChange: handlePhotoChange } as Record<
                          string,
                          unknown
                        >)}
                      />
                      {photoUrl && (
                        <Inline space={3} alignY="center">
                          <img
                            src={photoUrl}
                            alt="Profile preview"
                            style={{
                              width: '64px',
                              height: '64px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-md, 8px)',
                            }}
                          />
                          <Text size="small">{photoName}</Text>
                        </Inline>
                      )}
                    </Stack>
                  </Stack>
                )}

                {step === 2 && (
                  <Stack space={5}>
                    <DatePicker
                      label="Event Date"
                      value={eventDate}
                      onChange={setEventDate}
                      required
                    />
                    <TimeField
                      label="Preferred Time Slot"
                      value={timeSlot}
                      onChange={setTimeSlot}
                    />
                    <Radio.Group
                      label="Session Track"
                      value={track}
                      onChange={setTrack}
                    >
                      {TRACKS.map(t => (
                        <Radio key={t} value={t}>
                          {t}
                        </Radio>
                      ))}
                    </Radio.Group>
                    <ComboBox
                      label="Dietary Requirements"
                      menuTrigger="focus"
                      allowsCustomValue
                      value={dietary}
                      onChange={setDietary}
                      description="Search or type your own requirement."
                    >
                      {DIETARY_OPTIONS.map(option => (
                        <ComboBox.Option key={option} id={option}>
                          {option}
                        </ComboBox.Option>
                      ))}
                    </ComboBox>
                    <NumberField
                      label="Number of Guests"
                      value={guests}
                      onChange={setGuests}
                      minValue={0}
                      maxValue={5}
                      width="1/3"
                    />
                    <TextArea
                      label="Special Requests"
                      value={specialRequests}
                      onChange={setSpecialRequests}
                      rows={4}
                    />
                  </Stack>
                )}

                {step === 3 && (
                  <Stack space={5}>
                    <Select
                      label="T-Shirt Size"
                      selectedKey={tshirtSize || null}
                      onSelectionChange={key => setTshirtSize(key as string)}
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
                      value={topics}
                      onChange={setTopics}
                      description="Add topics you're interested in."
                    >
                      {TOPICS.map(topic => (
                        <TagField.Option key={topic} id={topic}>
                          {topic}
                        </TagField.Option>
                      ))}
                    </TagField>
                    <CheckboxGroup
                      label="Communication Preferences"
                      value={comms}
                      onChange={setComms}
                    >
                      {COMMUNICATION_OPTIONS.map(option => (
                        <Checkbox
                          key={option.value}
                          value={option.value}
                          label={option.label}
                        />
                      ))}
                    </CheckboxGroup>
                    <Stack space={3}>
                      <Switch
                        label="I have accessibility requirements"
                        selected={accessibility}
                        onChange={setAccessibility}
                      />
                      {accessibility && (
                        <TextArea
                          label="Accessibility Details"
                          value={accessibilityDetails}
                          onChange={setAccessibilityDetails}
                          rows={3}
                        />
                      )}
                    </Stack>
                  </Stack>
                )}

                {step === 4 && (
                  <Stack space={5}>
                    <Accordion defaultExpandedKeys={['personal']}>
                      <Accordion.Item id="personal">
                        <Accordion.Header>
                          Personal Information
                        </Accordion.Header>
                        <Accordion.Content>
                          <Stack space={2}>
                            <SummaryRow label="Name" value={fullName} />
                            <SummaryRow label="Email" value={email} />
                            <SummaryRow label="Phone" value={phone} />
                            <SummaryRow label="Company" value={company} />
                            <SummaryRow label="Job Title" value={jobTitle} />
                          </Stack>
                        </Accordion.Content>
                      </Accordion.Item>
                      <Accordion.Item id="event">
                        <Accordion.Header>Event Details</Accordion.Header>
                        <Accordion.Content>
                          <Stack space={2}>
                            <SummaryRow
                              label="Date"
                              value={formatDate(eventDate)}
                            />
                            <SummaryRow
                              label="Time"
                              value={formatTime(timeSlot)}
                            />
                            <SummaryRow label="Track" value={track} />
                            <SummaryRow label="Dietary" value={dietary} />
                            <SummaryRow
                              label="Guests"
                              value={String(guests)}
                            />
                          </Stack>
                        </Accordion.Content>
                      </Accordion.Item>
                      <Accordion.Item id="preferences">
                        <Accordion.Header>Preferences</Accordion.Header>
                        <Accordion.Content>
                          <Stack space={2}>
                            <SummaryRow
                              label="T-Shirt Size"
                              value={tshirtSize}
                            />
                            <SummaryRow
                              label="Topics"
                              value={topics.join(', ')}
                            />
                            <SummaryRow
                              label="Communication"
                              value={commsLabels}
                            />
                          </Stack>
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>

                    <Checkbox
                      checked={agreed}
                      onChange={setAgreed}
                      label="I agree to the terms and conditions"
                    />
                  </Stack>
                )}

                <Inline space={3} alignX="between" alignY="center">
                  <Button
                    type="button"
                    variant="secondary"
                    onPress={goBack}
                    disabled={step === 1}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={step === 4 && !agreed}
                  >
                    {step === 4 ? 'Submit Registration' : 'Next'}
                  </Button>
                </Inline>
              </Stack>
            </Form>
          </Inset>
        </Card>
      </Center>
    </Inset>
  );
};

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <RegistrationForm />
  </>
);

export default TestApp;
