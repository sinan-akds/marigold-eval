import { useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  ComboBox,
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

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  eventDate: any;
  timeSlot: any;
  sessionTrack: string;
  dietary: string;
  numGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topics: string[];
  commPrefs: string[];
  hasAccessibility: boolean;
  accessibilityDetails: string;
  agreedToTerms: boolean;
}

const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  eventDate: null,
  timeSlot: null,
  sessionTrack: '',
  dietary: '',
  numGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topics: [],
  commPrefs: [],
  hasAccessibility: false,
  accessibilityDetails: '',
  agreedToTerms: false,
};

const STEP_TITLES = [
  'Personal Information',
  'Event Details',
  'Preferences',
  'Review & Confirm',
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateConfirmation() {
  return 'REG-' + String(Math.floor(Math.random() * 900000 + 100000));
}

// ── Step 1 ────────────────────────────────────────────────────────────────────
function Step1({
  form,
  errors,
  update,
}: {
  form: FormData;
  errors: Record<string, string>;
  update: (key: keyof FormData, value: any) => void;
}) {
  return (
    <Stack space={4}>
      <SectionMessage variant="info">
        <SectionMessage.Content>
          Your information will only be used for this event.
        </SectionMessage.Content>
      </SectionMessage>

      <TextField
        label="Full Name"
        required
        value={form.fullName}
        onChange={v => update('fullName', v)}
        error={!!errors.fullName}
        errorMessage={errors.fullName}
      />

      <TextField
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={v => update('email', v)}
        error={!!errors.email}
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
        allowsCustomValue
        value={form.jobTitle}
        onChange={v => update('jobTitle', v)}
        menuTrigger="focus"
      >
        <ComboBox.Option id="Developer">Developer</ComboBox.Option>
        <ComboBox.Option id="Designer">Designer</ComboBox.Option>
        <ComboBox.Option id="Product Manager">Product Manager</ComboBox.Option>
        <ComboBox.Option id="Engineering Manager">
          Engineering Manager
        </ComboBox.Option>
        <ComboBox.Option id="CTO">CTO</ComboBox.Option>
        <ComboBox.Option id="Other">Other</ComboBox.Option>
      </ComboBox>

      <FileField
        label="Profile Photo"
        accept={['image/*']}
      />
    </Stack>
  );
}

// ── Step 2 ────────────────────────────────────────────────────────────────────
function Step2({
  form,
  errors,
  update,
}: {
  form: FormData;
  errors: Record<string, string>;
  update: (key: keyof FormData, value: any) => void;
}) {
  return (
    <Stack space={4}>
      <DatePicker
        label="Event Date"
        required
        value={form.eventDate}
        onChange={d => update('eventDate', d)}
        error={!!errors.eventDate}
        errorMessage={errors.eventDate}
      />

      <TimeField
        label="Preferred Time Slot"
        value={form.timeSlot}
        onChange={t => update('timeSlot', t)}
      />

      <Radio.Group
        label="Session Track"
        value={form.sessionTrack}
        onChange={v => update('sessionTrack', v)}
      >
        <Radio value="Technical">Technical</Radio>
        <Radio value="Design">Design</Radio>
        <Radio value="Business">Business</Radio>
        <Radio value="Workshop">Workshop</Radio>
      </Radio.Group>

      <ComboBox
        label="Dietary Requirements"
        allowsCustomValue
        value={form.dietary}
        onChange={v => update('dietary', v)}
        menuTrigger="focus"
      >
        <ComboBox.Option id="None">None</ComboBox.Option>
        <ComboBox.Option id="Vegetarian">Vegetarian</ComboBox.Option>
        <ComboBox.Option id="Vegan">Vegan</ComboBox.Option>
        <ComboBox.Option id="Gluten-Free">Gluten-Free</ComboBox.Option>
        <ComboBox.Option id="Kosher">Kosher</ComboBox.Option>
        <ComboBox.Option id="Halal">Halal</ComboBox.Option>
      </ComboBox>

      <NumberField
        label="Number of Guests"
        value={form.numGuests}
        onChange={v => update('numGuests', v)}
        minValue={0}
        maxValue={5}
        width="1/4"
      />

      <TextArea
        label="Special Requests"
        value={form.specialRequests}
        onChange={v => update('specialRequests', v)}
      />
    </Stack>
  );
}

// ── Step 3 ────────────────────────────────────────────────────────────────────
function Step3({
  form,
  update,
}: {
  form: FormData;
  update: (key: keyof FormData, value: any) => void;
}) {
  return (
    <Stack space={4}>
      <Select
        label="T-Shirt Size"
        placeholder="Select a size"
        selectedKey={form.tshirtSize || null}
        onSelectionChange={key => update('tshirtSize', String(key))}
      >
        <Select.Option id="XS">XS</Select.Option>
        <Select.Option id="S">S</Select.Option>
        <Select.Option id="M">M</Select.Option>
        <Select.Option id="L">L</Select.Option>
        <Select.Option id="XL">XL</Select.Option>
        <Select.Option id="XXL">XXL</Select.Option>
      </Select>

      <TagField
        label="Topics of Interest"
        value={form.topics as any}
        onChange={(keys: any) => update('topics', Array.from(keys) as string[])}
      >
        <TagField.Option id="AI/ML">AI/ML</TagField.Option>
        <TagField.Option id="Web Development">Web Development</TagField.Option>
        <TagField.Option id="Cloud">Cloud</TagField.Option>
        <TagField.Option id="Security">Security</TagField.Option>
        <TagField.Option id="DevOps">DevOps</TagField.Option>
        <TagField.Option id="Mobile">Mobile</TagField.Option>
        <TagField.Option id="Data Science">Data Science</TagField.Option>
      </TagField>

      <Checkbox.Group
        label="Communication Preferences"
        value={form.commPrefs}
        onChange={values => update('commPrefs', values)}
      >
        <Checkbox value="email-updates" label="Email updates about the event" />
        <Checkbox value="sms-reminders" label="SMS reminders" />
        <Checkbox value="post-survey" label="Post-event survey" />
        <Checkbox value="newsletter" label="Newsletter subscription" />
      </Checkbox.Group>

      <Switch
        label="I have accessibility requirements"
        selected={form.hasAccessibility}
        onChange={checked => update('hasAccessibility', checked)}
      />

      {form.hasAccessibility && (
        <TextArea
          label="Accessibility Details"
          value={form.accessibilityDetails}
          onChange={v => update('accessibilityDetails', v)}
        />
      )}
    </Stack>
  );
}

// ── Step 4 (Review) ───────────────────────────────────────────────────────────
const COMM_LABELS: Record<string, string> = {
  'email-updates': 'Email updates about the event',
  'sms-reminders': 'SMS reminders',
  'post-survey': 'Post-event survey',
  newsletter: 'Newsletter subscription',
};

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Inline space={2}>
      <Text weight="bold">{label}</Text>
      <Text>{value}</Text>
    </Inline>
  );
}

function Step4({
  form,
  errors,
  update,
}: {
  form: FormData;
  errors: Record<string, string>;
  update: (key: keyof FormData, value: any) => void;
}) {
  return (
    <Stack space={6}>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>Personal Information</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <ReviewRow label="Full Name:" value={form.fullName || '—'} />
              <ReviewRow label="Email:" value={form.email || '—'} />
              <ReviewRow label="Phone:" value={form.phone || '—'} />
              <ReviewRow label="Company:" value={form.company || '—'} />
              <ReviewRow label="Job Title:" value={form.jobTitle || '—'} />
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Header>Event Details</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <ReviewRow
                label="Event Date:"
                value={form.eventDate ? String(form.eventDate) : '—'}
              />
              <ReviewRow
                label="Time Slot:"
                value={form.timeSlot ? String(form.timeSlot) : '—'}
              />
              <ReviewRow
                label="Session Track:"
                value={form.sessionTrack || '—'}
              />
              <ReviewRow
                label="Dietary Requirements:"
                value={form.dietary || '—'}
              />
              <ReviewRow
                label="Number of Guests:"
                value={String(form.numGuests)}
              />
              {form.specialRequests && (
                <Stack space={1}>
                  <Text weight="bold">Special Requests:</Text>
                  <Text>{form.specialRequests}</Text>
                </Stack>
              )}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Header>Preferences</Accordion.Header>
          <Accordion.Content>
            <Stack space={2}>
              <ReviewRow label="T-Shirt Size:" value={form.tshirtSize || '—'} />
              <Stack space={1}>
                <Text weight="bold">Topics of Interest:</Text>
                <Text>
                  {form.topics.length > 0 ? form.topics.join(', ') : '—'}
                </Text>
              </Stack>
              <Stack space={1}>
                <Text weight="bold">Communication Preferences:</Text>
                <Text>
                  {form.commPrefs.length > 0
                    ? form.commPrefs
                        .map(p => COMM_LABELS[p] ?? p)
                        .join(', ')
                    : 'None selected'}
                </Text>
              </Stack>
              {form.hasAccessibility && (
                <Stack space={1}>
                  <Text weight="bold">Accessibility Needs:</Text>
                  <Text>{form.accessibilityDetails || '—'}</Text>
                </Stack>
              )}
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>

      <Divider />

      <Checkbox
        label="I agree to the terms and conditions"
        required
        checked={form.agreedToTerms}
        onChange={checked => update('agreedToTerms', checked as boolean)}
        error={!!errors.agreedToTerms}
      />
    </Stack>
  );
}

// ── Registration Form ─────────────────────────────────────────────────────────
function RegistrationForm() {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const update = (key: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      if (key in prev) {
        const next = { ...prev };
        delete next[key as string];
        return next;
      }
      return prev;
    });
  };

  const validate = (stepNum: number): boolean => {
    const errs: Record<string, string> = {};
    if (stepNum === 1) {
      if (!form.fullName.trim()) errs.fullName = 'Full name is required';
      if (!form.email.trim()) {
        errs.email = 'Email is required';
      } else if (!isValidEmail(form.email)) {
        errs.email = 'Please enter a valid email address';
      }
    }
    if (stepNum === 2) {
      if (!form.eventDate) errs.eventDate = 'Event date is required';
    }
    if (stepNum === 4) {
      if (!form.agreedToTerms)
        errs.agreedToTerms = 'You must agree to the terms and conditions';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate(step)) setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!validate(4)) return;
    setSubmitting(true);
    await new Promise(res => setTimeout(res, 1000));
    const conf = generateConfirmation();
    setConfirmationNumber(conf);
    setSubmitting(false);
    setSubmitted(true);
    addToast({
      title: 'Registration submitted successfully',
      variant: 'success',
      timeout: 5000,
    });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setStep(1);
    setSubmitted(false);
    setConfirmationNumber('');
  };

  if (submitting) {
    return (
      <Card>
        <Stack space={6} alignX="center">
          <Loader />
          <Text>Submitting your registration…</Text>
        </Stack>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Stack space={6}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you for registering. Your spot has been secured.
          </SectionMessage.Content>
        </SectionMessage>

        <Card>
          <Stack space={4}>
            <Headline level={3}>Registration Summary</Headline>
            <Divider />
            <Stack space={2}>
              <ReviewRow label="Name:" value={form.fullName} />
              <ReviewRow label="Email:" value={form.email} />
              <ReviewRow
                label="Event Date:"
                value={form.eventDate ? String(form.eventDate) : '—'}
              />
              <ReviewRow label="Confirmation #:" value={confirmationNumber} />
            </Stack>
            <Divider />
            <Button variant="primary" onPress={handleReset}>
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
        <Stack space={1}>
          <Text>Step {step} of 4 — {STEP_TITLES[step - 1]}</Text>
          <Headline level={1}>{STEP_TITLES[step - 1]}</Headline>
        </Stack>

        <Divider />

        {step === 1 && (
          <Step1 form={form} errors={errors} update={update} />
        )}
        {step === 2 && (
          <Step2 form={form} errors={errors} update={update} />
        )}
        {step === 3 && <Step3 form={form} update={update} />}
        {step === 4 && (
          <Step4 form={form} errors={errors} update={update} />
        )}

        <Divider />

        <Inline space={4}>
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
              disabled={!form.agreedToTerms}
              onPress={handleSubmit}
            >
              Submit Registration
            </Button>
          )}
        </Inline>
      </Stack>
    </Card>
  );
}

// ── Default Export ────────────────────────────────────────────────────────────
export default function TestApp() {
  return (
    <>
      <ToastProvider position="bottom-right" />
      <RegistrationForm />
    </>
  );
}
