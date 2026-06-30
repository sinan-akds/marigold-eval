import { useEffect, useRef, useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  Autocomplete,
  Button,
  Card,
  Center,
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
  Split,
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
import type { TimeValue } from '@marigold/components';

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

const DIETARY_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TOPIC_OPTIONS = [
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

const pad = (n: number) => String(n).padStart(2, '0');

const formatDate = (date: DateValue | null) =>
  date ? `${date.year}-${pad(date.month)}-${pad(date.day)}` : '—';

const formatTime = (time: TimeValue | null) =>
  time ? `${pad(time.hour)}:${pad(time.minute)}` : '—';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  const { addToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // Flow state
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  // Step 1 — Personal information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Step 2 — Event details
  const [eventDate, setEventDate] = useState<DateValue | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeValue | null>(null);
  const [track, setTrack] = useState('');
  const [dietary, setDietary] = useState('');
  const [guests, setGuests] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 3 — Preferences
  const [tshirt, setTshirt] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [comms, setComms] = useState<string[]>([]);
  const [accessibility, setAccessibility] = useState(false);
  const [accessibilityDetails, setAccessibilityDetails] = useState('');

  // Step 4 — Review & confirm
  const [agree, setAgree] = useState(false);

  const validateStep = (current: number) => {
    const e: Record<string, string> = {};
    if (current === 1) {
      if (!fullName.trim()) e.fullName = 'Please enter your full name.';
      if (!email.trim()) {
        e.email = 'Please enter your email address.';
      } else if (!EMAIL_RE.test(email.trim())) {
        e.email = 'Please enter a valid email address.';
      }
    }
    if (current === 2) {
      if (!eventDate) e.eventDate = 'Please choose an event date.';
    }
    return e;
  };

  const handleNext = () => {
    if (step < 4) {
      const e = validateStep(step);
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
      setErrors({});
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    window.setTimeout(() => {
      const code = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmation(code);
      setLoading(false);
      setSubmitted(true);
      addToast({
        title: 'Registration submitted successfully',
        variant: 'success',
      });
    }, 1000);
  };

  const handleReset = () => {
    setStep(1);
    setErrors({});
    setSubmitted(false);
    setConfirmation('');
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setJobTitle('');
    setPhotoName(null);
    setPhotoPreview(null);
    setEventDate(null);
    setTimeSlot(null);
    setTrack('');
    setDietary('');
    setGuests(0);
    setSpecialRequests('');
    setTshirt('');
    setTopics([]);
    setComms([]);
    setAccessibility(false);
    setAccessibilityDetails('');
    setAgree(false);
  };

  // Capture the selected profile photo from the FileField's underlying input.
  // We listen for the bubbling native change event instead of using an
  // onChange prop, since the form components manage their own values.
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const listener = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.type === 'file' && target.files && target.files[0]) {
        const file = target.files[0];
        if (file.type.startsWith('image/')) {
          setPhotoName(file.name);
          const reader = new FileReader();
          reader.onload = () => setPhotoPreview(reader.result as string);
          reader.readAsDataURL(file);
        }
      }
    };
    el.addEventListener('change', listener);
    return () => el.removeEventListener('change', listener);
  }, [step]);

  const commLabel = (value: string) =>
    COMM_OPTIONS.find(o => o.value === value)?.label ?? value;

  const renderReviewRow = (label: string, value: string) => (
    <Inline space={2} alignY="center">
      <Text weight="bold">{label}:</Text>
      <Text>{value || '—'}</Text>
    </Inline>
  );

  if (submitted) {
    return (
      <>
        <ToastProvider position="bottom-right" />
        <Center>
          <Card p="square-relaxed" space="related">
            <Stack space={6}>
              <Headline level={1}>Event Registration</Headline>
              <SectionMessage variant="success">
                <SectionMessage.Title>
                  Registration confirmed!
                </SectionMessage.Title>
                <SectionMessage.Content>
                  Thank you for registering. A confirmation has been generated
                  below.
                </SectionMessage.Content>
              </SectionMessage>

              <Card variant="default" p="square-regular">
                <Stack space={3}>
                  <Headline level={3}>Confirmation Summary</Headline>
                  <Divider />
                  {renderReviewRow('Name', fullName)}
                  {renderReviewRow('Email', email)}
                  {renderReviewRow('Event Date', formatDate(eventDate))}
                  {renderReviewRow('Confirmation Number', confirmation)}
                </Stack>
              </Card>

              <Button variant="primary" onPress={handleReset}>
                Register Another
              </Button>
            </Stack>
          </Card>
        </Center>
      </>
    );
  }

  return (
    <>
      <ToastProvider position="bottom-right" />
      {loading ? <Loader mode="fullscreen" /> : null}
      <Center>
        <Card p="square-relaxed" space="related">
          <Stack space={6}>
            <Stack space={1}>
              <Headline level={1}>Event Registration</Headline>
              <Headline level={2}>
                Step {step} of 4 — {STEP_TITLES[step - 1]}
              </Headline>
            </Stack>

            <Divider />

            <Form ref={formRef} onSubmit={e => e.preventDefault()}>
              {step === 1 && (
                <Stack space={5}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={fullName}
                    onChange={setFullName}
                    required
                    error={!!errors.fullName}
                    errorMessage={errors.fullName}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                    error={!!errors.email}
                    errorMessage={errors.email}
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
                  <Autocomplete
                    label="Job Title"
                    description="Choose a suggestion or type your own."
                    menuTrigger="focus"
                    value={jobTitle}
                    onChange={setJobTitle}
                  >
                    {JOB_TITLES.map(title => (
                      <Autocomplete.Option key={title} id={title}>
                        {title}
                      </Autocomplete.Option>
                    ))}
                  </Autocomplete>
                  <Stack space={2}>
                    <FileField label="Profile Photo" accept={['image/*']} />
                    {photoPreview ? (
                      <Inline space={2} alignY="center">
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          width={96}
                          height={96}
                        />
                        <Text fontSize="sm">{photoName}</Text>
                      </Inline>
                    ) : null}
                  </Stack>
                  <SectionMessage variant="info">
                    <SectionMessage.Title>Privacy</SectionMessage.Title>
                    <SectionMessage.Content>
                      Your information will only be used for this event.
                    </SectionMessage.Content>
                  </SectionMessage>
                </Stack>
              )}

              {step === 2 && (
                <Stack space={5}>
                  <DatePicker
                    label="Event Date"
                    value={eventDate}
                    onChange={setEventDate}
                    required
                    error={!!errors.eventDate}
                    errorMessage={errors.eventDate}
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
                    description="Search the list or type a custom value."
                    menuTrigger="focus"
                    allowsCustomValue
                    value={dietary}
                    onChange={setDietary}
                  >
                    {DIETARY_OPTIONS.map(option => (
                      <ComboBox.Option key={option} id={option}>
                        {option}
                      </ComboBox.Option>
                    ))}
                  </ComboBox>
                  <NumberField
                    label="Number of Guests"
                    minValue={0}
                    maxValue={5}
                    value={guests}
                    onChange={v => setGuests(Number.isNaN(v) ? 0 : v)}
                  />
                  <TextArea
                    label="Special Requests"
                    rows={4}
                    value={specialRequests}
                    onChange={setSpecialRequests}
                  />
                </Stack>
              )}

              {step === 3 && (
                <Stack space={5}>
                  <Select
                    label="T-Shirt Size"
                    placeholder="Select a size"
                    selectedKey={tshirt || null}
                    onSelectionChange={key => setTshirt(key ? String(key) : '')}
                  >
                    {TSHIRT_SIZES.map(size => (
                      <Select.Option key={size} id={size}>
                        {size}
                      </Select.Option>
                    ))}
                  </Select>
                  <TagField
                    label="Topics of Interest"
                    description="Add topics from the suggestions."
                    value={topics}
                    onChange={keys => setTopics(keys as string[])}
                  >
                    {TOPIC_OPTIONS.map(topic => (
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
                    {COMM_OPTIONS.map(option => (
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
                    {accessibility ? (
                      <TextArea
                        label="Accessibility Details"
                        rows={3}
                        value={accessibilityDetails}
                        onChange={setAccessibilityDetails}
                      />
                    ) : null}
                  </Stack>
                </Stack>
              )}

              {step === 4 && (
                <Stack space={5}>
                  <Accordion
                    allowsMultipleExpanded
                    defaultExpandedKeys={[
                      'personal',
                      'event',
                      'preferences',
                    ]}
                  >
                    <Accordion.Item id="personal">
                      <Accordion.Header>Personal Information</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          {renderReviewRow('Name', fullName)}
                          {renderReviewRow('Email', email)}
                          {renderReviewRow('Phone', phone)}
                          {renderReviewRow('Company', company)}
                          {renderReviewRow('Job Title', jobTitle)}
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item id="event">
                      <Accordion.Header>Event Details</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          {renderReviewRow('Date', formatDate(eventDate))}
                          {renderReviewRow('Time', formatTime(timeSlot))}
                          {renderReviewRow('Track', track)}
                          {renderReviewRow('Dietary', dietary)}
                          {renderReviewRow('Guests', String(guests))}
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                    <Accordion.Item id="preferences">
                      <Accordion.Header>Preferences</Accordion.Header>
                      <Accordion.Content>
                        <Stack space={2}>
                          {renderReviewRow('T-Shirt Size', tshirt)}
                          {renderReviewRow(
                            'Topics',
                            topics.join(', ')
                          )}
                          {renderReviewRow(
                            'Communication',
                            comms.map(commLabel).join(', ')
                          )}
                        </Stack>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>

                  <Divider />

                  <Checkbox
                    checked={agree}
                    onChange={setAgree}
                    label="I agree to the terms and conditions"
                  />
                </Stack>
              )}
            </Form>

            <Divider />

            <Inline space={3} alignY="center">
              <Button
                variant="secondary"
                onPress={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>
              <Split />
              <Button
                variant="primary"
                onPress={handleNext}
                disabled={step === 4 && !agree}
              >
                {step === 4 ? 'Submit Registration' : 'Next'}
              </Button>
            </Inline>
          </Stack>
        </Card>
      </Center>
    </>
  );
};

export default TestApp;
