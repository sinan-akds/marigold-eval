'use client';

import { useState } from 'react';
import {
  Accordion,
  Autocomplete,
  Button,
  Card,
  Checkbox,
  ComboBox,
  DateField,
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
  useToast,
} from '@marigold/components';

interface RegistrationData {
  // Step 1
  fullName: string;
  email: string;
  phoneNumber: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  // Step 2
  eventDate: string;
  preferredTimeSlot: string;
  sessionTrack: string;
  dietaryRequirements: string;
  numberGuestsSuffix: number;
  specialRequests: string;
  // Step 3
  tshirtSize: string;
  topicsOfInterest: (string | number)[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletterSubscription: boolean;
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const jobTitleSuggestions = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
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

const TestApp = () => {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    jobTitle: '',
    profilePhoto: null,
    eventDate: '',
    preferredTimeSlot: '',
    sessionTrack: '',
    dietaryRequirements: '',
    numberGuestsSuffix: 0,
    specialRequests: '',
    tshirtSize: '',
    topicsOfInterest: [],
    emailUpdates: false,
    smsReminders: false,
    postEventSurvey: false,
    newsletterSubscription: false,
    hasAccessibilityNeeds: false,
    accessibilityDetails: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email must be valid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.eventDate) newErrors.eventDate = 'Event Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    setErrors({});
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getEventDateString = (): string => {
    return formData.eventDate || '';
  };

  const getTimeString = (): string => {
    return formData.preferredTimeSlot || '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setShowSuccess(true);
    setConfirmationNumber(
      `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    );
    addToast({
      title: 'Registration submitted successfully',
      variant: 'success',
      timeout: 5000,
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setShowSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      company: '',
      jobTitle: '',
      profilePhoto: null,
      eventDate: '',
      preferredTimeSlot: '',
      sessionTrack: '',
      dietaryRequirements: '',
      numberGuestsSuffix: 0,
      specialRequests: '',
      tshirtSize: '',
      topicsOfInterest: [],
      emailUpdates: false,
      smsReminders: false,
      postEventSurvey: false,
      newsletterSubscription: false,
      hasAccessibilityNeeds: false,
      accessibilityDetails: '',
    });
    setErrors({});
  };

  const [termsAgreed, setTermsAgreed] = useState(false);

  if (showSuccess) {
    return (
      <Stack space={4} alignX="center" alignY="center" stretch>
        {loading && <Loader mode="section" />}
        <Card>
          <Stack space={4}>
            <SectionMessage variant="success">
              <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
            </SectionMessage>
            <Card>
              <Stack space={2}>
                <Text weight="bold">Registration Summary</Text>
                <Text>Name: {formData.fullName}</Text>
                <Text>Email: {formData.email}</Text>
                <Text>Event Date: {getEventDateString()}</Text>
                <Text weight="bold">Confirmation Number: {confirmationNumber}</Text>
              </Stack>
            </Card>
            <Button variant="primary" fullWidth onPress={handleReset}>
              Register Another
            </Button>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack space={4} alignX="center" alignY="center" stretch>
      <Card>
        <Stack space={4}>
          <Headline level={3}>
            Step {currentStep} of 4 —{' '}
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Event Details'}
            {currentStep === 3 && 'Preferences'}
            {currentStep === 4 && 'Review & Confirm'}
          </Headline>

          <Form>
            {currentStep === 1 && (
              <Stack space={3}>
                <TextField
                  label="Full Name"
                  required
                  value={formData.fullName}
                  onChange={(value) =>
                    setFormData({ ...formData, fullName: value })
                  }
                  errorMessage={errors.fullName}
                />
                <TextField
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(value) =>
                    setFormData({ ...formData, email: value })
                  }
                  errorMessage={errors.email}
                />
                <TextField
                  label="Phone Number"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(value) =>
                    setFormData({ ...formData, phoneNumber: value })
                  }
                />
                <TextField
                  label="Company / Organization"
                  value={formData.company}
                  onChange={(value) =>
                    setFormData({ ...formData, company: value })
                  }
                />
                <Autocomplete
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={(value) =>
                    setFormData({ ...formData, jobTitle: value })
                  }
                  menuTrigger="focus"
                >
                  {jobTitleSuggestions.map((suggestion) => (
                    <Autocomplete.Option key={suggestion} id={suggestion}>
                      {suggestion}
                    </Autocomplete.Option>
                  ))}
                </Autocomplete>
                <FileField
                  label="Profile Photo"
                  accept={['image/*']}
                />
                <SectionMessage>
                  <SectionMessage.Title>Your Privacy</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>
              </Stack>
            )}

            {currentStep === 2 && (
              <Stack space={3}>
                <DateField
                  label="Event Date"
                  required
                  value={formData.eventDate as any}
                  onChange={(value: any) =>
                    setFormData({ ...formData, eventDate: value?.toString() || '' })
                  }
                  errorMessage={errors.eventDate}
                />
                <TimeField
                  label="Preferred Time Slot"
                  value={formData.preferredTimeSlot as any}
                  onChange={(value: any) =>
                    setFormData({ ...formData, preferredTimeSlot: value?.toString() || '' })
                  }
                />
                <Radio.Group
                  label="Session Track"
                  value={formData.sessionTrack}
                  onChange={(value) =>
                    setFormData({ ...formData, sessionTrack: value })
                  }
                >
                  <Radio id="technical" value="Technical">
                    Technical
                  </Radio>
                  <Radio id="design" value="Design">
                    Design
                  </Radio>
                  <Radio id="business" value="Business">
                    Business
                  </Radio>
                  <Radio id="workshop" value="Workshop">
                    Workshop
                  </Radio>
                </Radio.Group>
                <ComboBox
                  label="Dietary Requirements"
                  value={formData.dietaryRequirements}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      dietaryRequirements: value || '',
                    });
                  }}
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
                  minValue={0}
                  maxValue={5}
                  value={formData.numberGuestsSuffix}
                  onChange={(value) =>
                    setFormData({ ...formData, numberGuestsSuffix: value })
                  }
                />
                <TextArea
                  label="Special Requests"
                  value={formData.specialRequests}
                  onChange={(value) =>
                    setFormData({ ...formData, specialRequests: value })
                  }
                  rows={4}
                />
              </Stack>
            )}

            {currentStep === 3 && (
              <Stack space={3}>
                <Select
                  label="T-Shirt Size"
                  value={formData.tshirtSize}
                  onSelectionChange={(value) =>
                    setFormData({
                      ...formData,
                      tshirtSize: value as string,
                    })
                  }
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
                  value={formData.topicsOfInterest}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      topicsOfInterest: Array.from(value),
                    })
                  }
                >
                  {topicSuggestions.map((topic) => (
                    <TagField.Option key={topic} id={topic}>
                      {topic}
                    </TagField.Option>
                  ))}
                </TagField>
                <Checkbox.Group label="Communication Preferences">
                  <Checkbox
                    value="email"
                    checked={formData.emailUpdates}
                    onChange={(checked) =>
                      setFormData({ ...formData, emailUpdates: checked })
                    }
                    label="Email updates about the event"
                  />
                  <Checkbox
                    value="sms"
                    checked={formData.smsReminders}
                    onChange={(checked) =>
                      setFormData({ ...formData, smsReminders: checked })
                    }
                    label="SMS reminders"
                  />
                  <Checkbox
                    value="survey"
                    checked={formData.postEventSurvey}
                    onChange={(checked) =>
                      setFormData({ ...formData, postEventSurvey: checked })
                    }
                    label="Post-event survey"
                  />
                  <Checkbox
                    value="newsletter"
                    checked={formData.newsletterSubscription}
                    onChange={(checked) =>
                      setFormData({
                        ...formData,
                        newsletterSubscription: checked,
                      })
                    }
                    label="Newsletter subscription"
                  />
                </Checkbox.Group>
                <Stack space={2}>
                  <Switch
                    selected={formData.hasAccessibilityNeeds}
                    onChange={(selected) =>
                      setFormData({
                        ...formData,
                        hasAccessibilityNeeds: selected,
                      })
                    }
                    label="I have accessibility requirements"
                  />
                  {formData.hasAccessibilityNeeds && (
                    <TextArea
                      label="Accessibility Details"
                      value={formData.accessibilityDetails}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          accessibilityDetails: value,
                        })
                      }
                      rows={3}
                    />
                  )}
                </Stack>
              </Stack>
            )}

            {currentStep === 4 && (
              <Stack space={3}>
                <Accordion>
                  <Accordion.Item>
                    <Accordion.Header>Personal Information</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={1}>
                        <Text>Name: {formData.fullName}</Text>
                        <Text>Email: {formData.email}</Text>
                        {formData.phoneNumber && (
                          <Text>Phone: {formData.phoneNumber}</Text>
                        )}
                        {formData.company && (
                          <Text>Company: {formData.company}</Text>
                        )}
                        {formData.jobTitle && (
                          <Text>Job Title: {formData.jobTitle}</Text>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item>
                    <Accordion.Header>Event Details</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={1}>
                        <Text>Event Date: {getEventDateString()}</Text>
                        {formData.preferredTimeSlot && (
                          <Text>Time: {getTimeString()}</Text>
                        )}
                        {formData.sessionTrack && (
                          <Text>Track: {formData.sessionTrack}</Text>
                        )}
                        {formData.dietaryRequirements && (
                          <Text>
                            Dietary: {formData.dietaryRequirements}
                          </Text>
                        )}
                        <Text>Guests: {formData.numberGuestsSuffix}</Text>
                        {formData.specialRequests && (
                          <Text>
                            Special Requests: {formData.specialRequests}
                          </Text>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                  <Accordion.Item>
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={1}>
                        {formData.tshirtSize && (
                          <Text>T-Shirt Size: {formData.tshirtSize}</Text>
                        )}
                        {formData.topicsOfInterest.length > 0 && (
                          <Text>
                            Topics:{' '}
                            {Array.from(formData.topicsOfInterest).join(', ')}
                          </Text>
                        )}
                        <Text>
                          Email Updates: {formData.emailUpdates ? 'Yes' : 'No'}
                        </Text>
                        <Text>
                          SMS Reminders:{' '}
                          {formData.smsReminders ? 'Yes' : 'No'}
                        </Text>
                        <Text>
                          Post-Event Survey:{' '}
                          {formData.postEventSurvey ? 'Yes' : 'No'}
                        </Text>
                        <Text>
                          Newsletter:{' '}
                          {formData.newsletterSubscription ? 'Yes' : 'No'}
                        </Text>
                        {formData.hasAccessibilityNeeds && (
                          <Text>
                            Accessibility Needs:{' '}
                            {formData.accessibilityDetails}
                          </Text>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>
                <Checkbox
                  value="terms"
                  checked={termsAgreed}
                  onChange={(checked) => setTermsAgreed(checked)}
                  label="I agree to the terms and conditions"
                />
              </Stack>
            )}
          </Form>

          <Inline space={2} alignX="between">
            <Button
              disabled={currentStep === 1}
              onPress={handleBack}
              variant="secondary"
            >
              Back
            </Button>
            {currentStep < 4 ? (
              <Button variant="primary" onPress={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={!termsAgreed || loading}
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
  );
};

export default TestApp;
