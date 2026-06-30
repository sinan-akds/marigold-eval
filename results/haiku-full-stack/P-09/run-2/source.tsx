'use client';

import { useState } from 'react';
import {
  AppLayout,
  Button,
  Card,
  Checkbox,
  ComboBox,
  DatePicker,
  FileField,
  Headline,
  Inline,
  Inset,
  Loader,
  NumberField,
  Radio,
  Select,
  SectionMessage,
  Stack,
  Switch,
  TagField,
  Text,
  TextArea,
  TextField,
  TimeField,
  Accordion,
  Center,
} from '@marigold/components';

type RegistrationData = {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  // Step 2
  eventDate: any;
  preferredTime: any;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  // Step 3
  tShirtSize: string;
  topicsOfInterest: string[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletterSubscription: boolean;
  accessibilityNeeded: boolean;
  accessibilityDetails: string;
};

const TestApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    profilePhoto: null,
    eventDate: null,
    preferredTime: null,
    sessionTrack: '',
    dietaryRequirements: '',
    numberOfGuests: 0,
    specialRequests: '',
    tShirtSize: '',
    topicsOfInterest: [],
    emailUpdates: false,
    smsReminders: false,
    postEventSurvey: false,
    newsletterSubscription: false,
    accessibilityNeeded: false,
    accessibilityDetails: '',
  });

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!formData.email.includes('@')) {
        errors.email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      if (!formData.eventDate) {
        errors.eventDate = 'Event date is required';
      }
    } else if (step === 4) {
      // Review step doesn't need validation, but terms checkbox is required on submit
      return true;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    // Generate confirmation number
    const confNum = 'EVT' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setConfirmationNumber(confNum);
    setSubmitted(true);
  };

  const handleRegisterAnother = () => {
    setSubmitted(false);
    setCurrentStep(1);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      profilePhoto: null,
      eventDate: null,
      preferredTime: null,
      sessionTrack: '',
      dietaryRequirements: '',
      numberOfGuests: 0,
      specialRequests: '',
      tShirtSize: '',
      topicsOfInterest: [],
      emailUpdates: false,
      smsReminders: false,
      postEventSurvey: false,
      newsletterSubscription: false,
      accessibilityNeeded: false,
      accessibilityDetails: '',
    });
  };

  if (isSubmitting) {
    return <Loader mode="fullscreen" />;
  }

  if (submitted) {
    return (
      <AppLayout>
        <AppLayout.Main>
          <Center>
            <Stack alignX="center" space={6}>
              <Headline level={1}>Event Registration</Headline>
              <Card>
          <Inset space={8}>
            <Stack space={6} alignX="center">
              <SectionMessage variant="success">
                <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
                <SectionMessage.Content>
                  Thank you for registering for our event.
                </SectionMessage.Content>
              </SectionMessage>

              <Card>
                <Inset space={6}>
                  <Stack space={4}>
                    <Headline level="3">Confirmation Details</Headline>
                    <Stack space={2}>
                      <Stack alignX="left">
                        <Text weight="bold">Name</Text>
                        <Text>{formData.fullName}</Text>
                      </Stack>
                      <Stack alignX="left">
                        <Text weight="bold">Email</Text>
                        <Text>{formData.email}</Text>
                      </Stack>
                      <Stack alignX="left">
                        <Text weight="bold">Event Date</Text>
                        <Text>
                          {formData.eventDate
                            ? `${formData.eventDate.day}/${formData.eventDate.month}/${formData.eventDate.year}`
                            : 'N/A'}
                        </Text>
                      </Stack>
                      <Stack alignX="left">
                        <Text weight="bold">Confirmation Number</Text>
                        <Text>{confirmationNumber}</Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Inset>
              </Card>

              <Button variant="primary" onPress={handleRegisterAnother}>
                Register Another
              </Button>
            </Stack>
          </Inset>
        </Card>
            </Stack>
          </Center>
        </AppLayout.Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppLayout.Main>
        <Center>
          <Stack alignX="center" space={4}>
            <Headline level={1}>Event Registration</Headline>
            <Card>
        <Inset space={8}>
          <Stack space={6}>
            {/* Step Header */}
            <Text weight="bold" fontSize="lg">
              Step {currentStep} of 4 — {getStepTitle(currentStep)}
            </Text>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <Stack space={4}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={(value) =>
                    setFormData({ ...formData, fullName: value })
                  }
                  error={!!validationErrors.fullName}
                  errorMessage={validationErrors.fullName}
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(value) =>
                    setFormData({ ...formData, email: value })
                  }
                  error={!!validationErrors.email}
                  errorMessage={validationErrors.email}
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value })
                  }
                />

                <TextField
                  label="Company / Organization"
                  name="company"
                  value={formData.company}
                  onChange={(value) =>
                    setFormData({ ...formData, company: value })
                  }
                />

                <ComboBox
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={(value) =>
                    setFormData({ ...formData, jobTitle: value })
                  }
                  menuTrigger="focus"
                >
                  <ComboBox.Option id="developer">Developer</ComboBox.Option>
                  <ComboBox.Option id="designer">Designer</ComboBox.Option>
                  <ComboBox.Option id="pm">Product Manager</ComboBox.Option>
                  <ComboBox.Option id="em">Engineering Manager</ComboBox.Option>
                  <ComboBox.Option id="cto">CTO</ComboBox.Option>
                  <ComboBox.Option id="other">Other</ComboBox.Option>
                </ComboBox>

                <FileField
                  label="Profile Photo"
                  name="profilePhoto"
                  accept={['image/*']}
                />

                <SectionMessage variant="info">
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>
              </Stack>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <Stack space={4}>
                <DatePicker
                  label="Event Date"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={(value) =>
                    setFormData({ ...formData, eventDate: value })
                  }
                  error={!!validationErrors.eventDate}
                  errorMessage={validationErrors.eventDate}
                />

                <TimeField
                  label="Preferred Time Slot"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={(value) =>
                    setFormData({ ...formData, preferredTime: value })
                  }
                />

                <Radio.Group
                  label="Session Track"
                  value={formData.sessionTrack}
                  onChange={(value) =>
                    setFormData({ ...formData, sessionTrack: value as string })
                  }
                >
                  <Radio value="technical">Technical</Radio>
                  <Radio value="design">Design</Radio>
                  <Radio value="business">Business</Radio>
                  <Radio value="workshop">Workshop</Radio>
                </Radio.Group>

                <ComboBox
                  label="Dietary Requirements"
                  name="dietaryRequirements"
                  value={formData.dietaryRequirements}
                  onChange={(value) =>
                    setFormData({ ...formData, dietaryRequirements: value })
                  }
                  menuTrigger="focus"
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
                  name="numberOfGuests"
                  minValue={0}
                  maxValue={5}
                  value={formData.numberOfGuests}
                  onChange={(value) =>
                    setFormData({ ...formData, numberOfGuests: value })
                  }
                />

                <TextArea
                  label="Special Requests"
                  name="specialRequests"
                  rows={4}
                  value={formData.specialRequests}
                  onChange={(value) =>
                    setFormData({ ...formData, specialRequests: value })
                  }
                />
              </Stack>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <Stack space={4}>
                <Select
                  label="T-Shirt Size"
                  value={formData.tShirtSize}
                  onChange={(value) =>
                    setFormData({ ...formData, tShirtSize: value as string })
                  }
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
                  value={formData.topicsOfInterest as any}
                  onChange={(keys) =>
                    setFormData({
                      ...formData,
                      topicsOfInterest: Array.from(keys as any),
                    })
                  }
                >
                  <TagField.Option id="aiml">AI/ML</TagField.Option>
                  <TagField.Option id="webdev">Web Development</TagField.Option>
                  <TagField.Option id="cloud">Cloud</TagField.Option>
                  <TagField.Option id="security">Security</TagField.Option>
                  <TagField.Option id="devops">DevOps</TagField.Option>
                  <TagField.Option id="mobile">Mobile</TagField.Option>
                  <TagField.Option id="datascience">Data Science</TagField.Option>
                </TagField>

                <Stack space={3}>
                  <Text weight="bold">Communication Preferences</Text>
                  <Checkbox
                    value="emailUpdates"
                    label="Email updates about the event"
                    checked={formData.emailUpdates}
                    onChange={(checked) =>
                      setFormData({ ...formData, emailUpdates: checked })
                    }
                  />
                  <Checkbox
                    value="smsReminders"
                    label="SMS reminders"
                    checked={formData.smsReminders}
                    onChange={(checked) =>
                      setFormData({ ...formData, smsReminders: checked })
                    }
                  />
                  <Checkbox
                    value="postEventSurvey"
                    label="Post-event survey"
                    checked={formData.postEventSurvey}
                    onChange={(checked) =>
                      setFormData({ ...formData, postEventSurvey: checked })
                    }
                  />
                  <Checkbox
                    value="newsletterSubscription"
                    label="Newsletter subscription"
                    checked={formData.newsletterSubscription}
                    onChange={(checked) =>
                      setFormData({
                        ...formData,
                        newsletterSubscription: checked,
                      })
                    }
                  />
                </Stack>

                <Stack space={3}>
                  <Switch
                    label="I have accessibility requirements"
                    selected={formData.accessibilityNeeded}
                    onChange={(checked) =>
                      setFormData({ ...formData, accessibilityNeeded: checked })
                    }
                  />

                  {formData.accessibilityNeeded && (
                    <TextArea
                      label="Accessibility Details"
                      name="accessibilityDetails"
                      rows={4}
                      value={formData.accessibilityDetails}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          accessibilityDetails: value,
                        })
                      }
                    />
                  )}
                </Stack>
              </Stack>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <Stack space={4}>
                <Accordion>
                  <Accordion.Item id="personal">
                    <Accordion.Header>Personal Information</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Stack space={1}>
                          <Text>
                            <Text weight="bold">Name:</Text> {formData.fullName}
                          </Text>
                          <Text>
                            <Text weight="bold">Email:</Text> {formData.email}
                          </Text>
                          {formData.phone && (
                            <Text>
                              <Text weight="bold">Phone:</Text> {formData.phone}
                            </Text>
                          )}
                          {formData.company && (
                            <Text>
                              <Text weight="bold">Company:</Text>{' '}
                              {formData.company}
                            </Text>
                          )}
                          {formData.jobTitle && (
                            <Text>
                              <Text weight="bold">Job Title:</Text>{' '}
                              {formData.jobTitle}
                            </Text>
                          )}
                        </Stack>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item id="event">
                    <Accordion.Header>Event Details</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Text>
                          <Text weight="bold">Date:</Text>{' '}
                          {formData.eventDate
                            ? `${formData.eventDate.day}/${formData.eventDate.month}/${formData.eventDate.year}`
                            : 'Not selected'}
                        </Text>
                        {formData.preferredTime && (
                          <Text>
                            <Text weight="bold">Time:</Text>{' '}
                            {formData.preferredTime.hour}:
                            {String(formData.preferredTime.minute).padStart(
                              2,
                              '0'
                            )}
                          </Text>
                        )}
                        {formData.sessionTrack && (
                          <Text>
                            <Text weight="bold">Track:</Text>{' '}
                            {formData.sessionTrack}
                          </Text>
                        )}
                        {formData.dietaryRequirements && (
                          <Text>
                            <Text weight="bold">Dietary:</Text>{' '}
                            {formData.dietaryRequirements}
                          </Text>
                        )}
                        <Text>
                          <Text weight="bold">Guests:</Text>{' '}
                          {formData.numberOfGuests}
                        </Text>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item id="preferences">
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        {formData.tShirtSize && (
                          <Text>
                            <Text weight="bold">T-Shirt Size:</Text>{' '}
                            {formData.tShirtSize}
                          </Text>
                        )}
                        {formData.topicsOfInterest.length > 0 && (
                          <Text>
                            <Text weight="bold">Topics:</Text>{' '}
                            {formData.topicsOfInterest.join(', ')}
                          </Text>
                        )}
                        <Stack space={1}>
                          <Text weight="bold">Communication Prefs:</Text>
                          {formData.emailUpdates && (
                            <Text>• Email updates about the event</Text>
                          )}
                          {formData.smsReminders && (
                            <Text>• SMS reminders</Text>
                          )}
                          {formData.postEventSurvey && (
                            <Text>• Post-event survey</Text>
                          )}
                          {formData.newsletterSubscription && (
                            <Text>• Newsletter subscription</Text>
                          )}
                        </Stack>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Checkbox
                  value="termsAndConditions"
                  label="I agree to the terms and conditions"
                  checked={
                    (localStorage.getItem('termsAccepted') === 'true') as any
                  }
                  onChange={(checked) => {
                    localStorage.setItem('termsAccepted', String(checked));
                  }}
                />
              </Stack>
            )}

            {/* Navigation */}
            <Inline space={2} alignX="right">
              <Button
                variant="secondary"
                disabled={currentStep === 1}
                onPress={handlePreviousStep}
              >
                Back
              </Button>
              {currentStep < 4 ? (
                <Button variant="primary" onPress={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={
                    localStorage.getItem('termsAccepted') !== 'true'
                  }
                  onPress={handleSubmit}
                >
                  Submit Registration
                </Button>
              )}
            </Inline>
          </Stack>
        </Inset>
      </Card>
            </Stack>
          </Center>
        </AppLayout.Main>
      </AppLayout>
    );
};

function getStepTitle(step: number): string {
  const titles = [
    'Personal Information',
    'Event Details',
    'Preferences',
    'Review & Confirm',
  ];
  return titles[step - 1] || '';
}

export default TestApp;
