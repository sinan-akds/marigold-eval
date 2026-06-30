'use client';

import { useState } from 'react';
import {
  Card,
  TextField,
  DateField,
  TimeField,
  Select,
  ComboBox,
  TextArea,
  Checkbox,
  Switch,
  FileField,
  TagField,
  Button,
  Inline,
  Stack,
  Inset,
  Headline,
  Text,
  SectionMessage,
  Loader,
  Accordion,
  ToastProvider,
  useToast,
} from '@marigold/components';
import { parseDate, parseTime } from '@internationalized/date';

interface FormData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  // Step 2
  eventDate: string;
  preferredTime: string;
  sessionTrack: string;
  dietaryRequirements: string[];
  numberOfGuests: number;
  specialRequests: string;
  // Step 3
  tShirtSize: string;
  topicsOfInterest: (string | number)[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletterSubscription: boolean;
  accessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const jobTitleOptions = [
  { id: 'developer', name: 'Developer' },
  { id: 'designer', name: 'Designer' },
  { id: 'product-manager', name: 'Product Manager' },
  { id: 'engineering-manager', name: 'Engineering Manager' },
  { id: 'cto', name: 'CTO' },
  { id: 'other', name: 'Other' },
];

const topicOptions = [
  { id: 'ai-ml', name: 'AI/ML' },
  { id: 'web-dev', name: 'Web Development' },
  { id: 'cloud', name: 'Cloud' },
  { id: 'security', name: 'Security' },
  { id: 'devops', name: 'DevOps' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'data-science', name: 'Data Science' },
];

const dietaryOptions = [
  { id: 'none', name: 'None' },
  { id: 'vegetarian', name: 'Vegetarian' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'gluten-free', name: 'Gluten-Free' },
  { id: 'kosher', name: 'Kosher' },
  { id: 'halal', name: 'Halal' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestAppInner = () => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    profilePhoto: null,
    eventDate: '',
    preferredTime: '',
    sessionTrack: '',
    dietaryRequirements: [],
    numberOfGuests: 0,
    specialRequests: '',
    tShirtSize: '',
    topicsOfInterest: [],
    emailUpdates: false,
    smsReminders: false,
    postEventSurvey: false,
    newsletterSubscription: false,
    accessibilityNeeds: false,
    accessibilityDetails: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const updateFormData = (key: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    setErrors({});
    return true;
  };

  const validateStep4 = (): boolean => {
    return termsAgreed;
  };

  const handleNextStep = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    if (step === 2) isValid = validateStep2();
    if (step === 3) isValid = validateStep3();

    if (isValid) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const confirmNum = Math.random().toString(36).substring(2, 10).toUpperCase();
    setConfirmationNumber(confirmNum);
    setSubmitted(true);
    setSubmitting(false);

    addToast({
      title: 'Registration submitted successfully',
      variant: 'success',
    });
  };

  const handleRegisterAnother = () => {
    setStep(1);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      profilePhoto: null,
      eventDate: '',
      preferredTime: '',
      sessionTrack: '',
      dietaryRequirements: [],
      numberOfGuests: 0,
      specialRequests: '',
      tShirtSize: '',
      topicsOfInterest: [],
      emailUpdates: false,
      smsReminders: false,
      postEventSurvey: false,
      newsletterSubscription: false,
      accessibilityNeeds: false,
      accessibilityDetails: '',
    });
    setSubmitted(false);
    setTermsAgreed(false);
    setPhotoPreview(null);
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-surface-default flex items-center justify-center p-4">
        <Card>
          <Inset space={8}>
            <Stack space={6}>
              {submitting ? (
                <>
                  <Loader size="large" />
                  <Text>Processing your registration...</Text>
                </>
              ) : (
                <Stack space={4}>
                  <SectionMessage variant="success">
                    <SectionMessage.Title>
                      Registration confirmed!
                    </SectionMessage.Title>
                    <SectionMessage.Content>
                      Your event registration has been successfully submitted.
                    </SectionMessage.Content>
                  </SectionMessage>

                  <Card>
                    <Inset space={6}>
                      <Stack space={4}>
                        <Headline level={3}>Registration Summary</Headline>
                        <Stack space={2}>
                          <Inline>
                            <Text weight="bold">Name:</Text>
                            <Text>{formData.fullName}</Text>
                          </Inline>
                          <Inline>
                            <Text weight="bold">Email:</Text>
                            <Text>{formData.email}</Text>
                          </Inline>
                          <Inline>
                            <Text weight="bold">Event Date:</Text>
                            <Text>{formData.eventDate}</Text>
                          </Inline>
                          <Inline>
                            <Text weight="bold">Confirmation #:</Text>
                            <Text>{confirmationNumber}</Text>
                          </Inline>
                        </Stack>
                      </Stack>
                    </Inset>
                  </Card>

                  <Button
                    onPress={handleRegisterAnother}
                    variant="primary"
                  >
                    Register Another
                  </Button>
                </Stack>
              )}
            </Stack>
          </Inset>
        </Card>
      </div>
    );
  }

  const stepTitles = [
    'Personal Information',
    'Event Details',
    'Preferences',
    'Review & Confirm',
  ];

  return (
    <div className="min-h-screen bg-bg-surface-default flex items-center justify-center p-4">
      <Card>
        <Inset space={8}>
          <Stack space={6}>
            <Stack space={2}>
              <Headline level={2}>
                Step {step} of 4 — {stepTitles[step - 1]}
              </Headline>
            </Stack>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <Stack space={4}>
                <SectionMessage variant="info">
                  <SectionMessage.Content>
                    Your information will only be used for this event.
                  </SectionMessage.Content>
                </SectionMessage>

                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={value => updateFormData('fullName', value)}
                  error={!!errors.fullName}
                  errorMessage={errors.fullName}
                  required
                  width="full"
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={value => updateFormData('email', value)}
                  error={!!errors.email}
                  errorMessage={errors.email}
                  required
                  width="full"
                />

                <TextField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={value => updateFormData('phone', value)}
                  width="full"
                />

                <TextField
                  label="Company / Organization"
                  name="company"
                  value={formData.company}
                  onChange={value => updateFormData('company', value)}
                  width="full"
                />

                <ComboBox
                  label="Job Title"
                  name="jobTitle"
                  selectedKey={formData.jobTitle || undefined}
                  onSelectionChange={key =>
                    updateFormData('jobTitle', key || '')
                  }
                  width="full"
                >
                  {jobTitleOptions.map(option => (
                    <ComboBox.Option key={option.id} id={option.id}>
                      {option.name}
                    </ComboBox.Option>
                  ))}
                </ComboBox>

                <FileField
                  label="Profile Photo"
                  name="profilePhoto"
                  accept={['image/*']}
                  width="full"
                />

                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
              </Stack>
            )}

            {/* Step 2: Event Details */}
            {step === 2 && (
              <Stack space={4}>
                <DateField
                  label="Event Date"
                  name="eventDate"
                  value={formData.eventDate ? parseDate(formData.eventDate) : undefined}
                  onChange={value => updateFormData('eventDate', value ? value.toString() : '')}
                  error={!!errors.eventDate}
                  errorMessage={errors.eventDate}
                  required
                  width="full"
                />

                <TimeField
                  label="Preferred Time Slot"
                  name="preferredTime"
                  value={formData.preferredTime ? parseTime(formData.preferredTime) : undefined}
                  onChange={value => updateFormData('preferredTime', value ? value.toString() : '')}
                  width="full"
                />

                <Select
                  label="Session Track"
                  name="sessionTrack"
                  selectedKey={formData.sessionTrack || undefined}
                  onSelectionChange={key =>
                    updateFormData('sessionTrack', key || '')
                  }
                  width="full"
                >
                  <Select.Option id="technical">Technical</Select.Option>
                  <Select.Option id="design">Design</Select.Option>
                  <Select.Option id="business">Business</Select.Option>
                  <Select.Option id="workshop">Workshop</Select.Option>
                </Select>

                <ComboBox
                  label="Dietary Requirements"
                  name="dietaryRequirements"
                  selectedKey={
                    formData.dietaryRequirements[0] || undefined
                  }
                  onSelectionChange={key => {
                    if (key) {
                      updateFormData('dietaryRequirements', [key]);
                    }
                  }}
                  width="full"
                >
                  {dietaryOptions.map(option => (
                    <ComboBox.Option key={option.id} id={option.id}>
                      {option.name}
                    </ComboBox.Option>
                  ))}
                </ComboBox>

                <TextField
                  label="Number of Guests"
                  name="numberOfGuests"
                  type="number"
                  inputMode="numeric"
                  value={formData.numberOfGuests.toString()}
                  onChange={value => {
                    const num = Math.min(
                      5,
                      Math.max(0, parseInt(value) || 0)
                    );
                    updateFormData('numberOfGuests', num);
                  }}
                  width="full"
                />

                <TextArea
                  label="Special Requests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={value => updateFormData('specialRequests', value)}
                  width="full"
                />
              </Stack>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <Stack space={4}>
                <Select
                  label="T-Shirt Size"
                  name="tShirtSize"
                  selectedKey={formData.tShirtSize || undefined}
                  onSelectionChange={key =>
                    updateFormData('tShirtSize', key || '')
                  }
                  width="full"
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
                  name="topicsOfInterest"
                  value={formData.topicsOfInterest}
                  onChange={keys => updateFormData('topicsOfInterest', keys)}
                  width="full"
                >
                  {topicOptions.map(option => (
                    <TagField.Option key={option.id} id={option.id}>
                      {option.name}
                    </TagField.Option>
                  ))}
                </TagField>

                <Stack space={2} alignX="left">
                  <Text weight="bold">Communication Preferences</Text>
                  <Checkbox
                    label="Email updates about the event"
                    checked={formData.emailUpdates}
                    onChange={value => updateFormData('emailUpdates', value)}
                  />
                  <Checkbox
                    label="SMS reminders"
                    checked={formData.smsReminders}
                    onChange={value => updateFormData('smsReminders', value)}
                  />
                  <Checkbox
                    label="Post-event survey"
                    checked={formData.postEventSurvey}
                    onChange={value => updateFormData('postEventSurvey', value)}
                  />
                  <Checkbox
                    label="Newsletter subscription"
                    checked={formData.newsletterSubscription}
                    onChange={value =>
                      updateFormData('newsletterSubscription', value)
                    }
                  />
                </Stack>

                <Stack space={2}>
                  <Switch
                    label="I have accessibility requirements"
                    selected={formData.accessibilityNeeds}
                    onChange={value => updateFormData('accessibilityNeeds', value)}
                  />
                  {formData.accessibilityNeeds && (
                    <TextArea
                      label="Accessibility Details"
                      name="accessibilityDetails"
                      value={formData.accessibilityDetails}
                      onChange={value =>
                        updateFormData('accessibilityDetails', value)
                      }
                      width="full"
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
                        <Inline>
                          <Text weight="bold">Full Name:</Text>
                          <Text>{formData.fullName}</Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Email:</Text>
                          <Text>{formData.email}</Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Phone:</Text>
                          <Text>{formData.phone || 'Not provided'}</Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Company:</Text>
                          <Text>{formData.company || 'Not provided'}</Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Job Title:</Text>
                          <Text>
                            {jobTitleOptions.find(
                              o => o.id === formData.jobTitle
                            )?.name || 'Not provided'}
                          </Text>
                        </Inline>
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item>
                    <Accordion.Header>Event Details</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Inline>
                          <Text weight="bold">Event Date:</Text>
                          <Text>{formData.eventDate}</Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Preferred Time:</Text>
                          <Text>{formData.preferredTime || 'Not provided'}</Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Session Track:</Text>
                          <Text>
                            {formData.sessionTrack
                              ?.charAt(0)
                              .toUpperCase() +
                              formData.sessionTrack?.slice(1) ||
                              'Not provided'}
                          </Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Dietary Requirements:</Text>
                          <Text>
                            {formData.dietaryRequirements.length > 0
                              ? dietaryOptions
                                  .filter(o =>
                                    formData.dietaryRequirements.includes(o.id)
                                  )
                                  .map(o => o.name)
                                  .join(', ')
                              : 'Not provided'}
                          </Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Number of Guests:</Text>
                          <Text>{formData.numberOfGuests}</Text>
                        </Inline>
                        {formData.specialRequests && (
                          <Inline>
                            <Text weight="bold">Special Requests:</Text>
                            <Text>{formData.specialRequests}</Text>
                          </Inline>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>

                  <Accordion.Item>
                    <Accordion.Header>Preferences</Accordion.Header>
                    <Accordion.Content>
                      <Stack space={2}>
                        <Inline>
                          <Text weight="bold">T-Shirt Size:</Text>
                          <Text>
                            {formData.tShirtSize?.toUpperCase() ||
                              'Not selected'}
                          </Text>
                        </Inline>
                        <Inline>
                          <Text weight="bold">Topics of Interest:</Text>
                          <Text>
                            {formData.topicsOfInterest.length > 0
                              ? topicOptions
                                  .filter(o =>
                                    formData.topicsOfInterest.includes(o.id)
                                  )
                                  .map(o => o.name)
                                  .join(', ')
                              : 'Not selected'}
                          </Text>
                        </Inline>
                        <Stack space={1}>
                          <Text weight="bold">Communication Preferences:</Text>
                          <Stack space={1}>
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
                        {formData.accessibilityNeeds && (
                          <Inline>
                            <Text weight="bold">Accessibility Details:</Text>
                            <Text>{formData.accessibilityDetails}</Text>
                          </Inline>
                        )}
                      </Stack>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion>

                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={termsAgreed}
                  onChange={setTermsAgreed}
                  required
                />
              </Stack>
            )}

            {/* Navigation */}
            <Inline space={2} alignX="right">
              <Button
                onPress={handlePreviousStep}
                disabled={step === 1}
                variant="secondary"
              >
                Back
              </Button>
              {step < 4 ? (
                <Button onPress={handleNextStep} variant="primary">
                  Next
                </Button>
              ) : (
                <Button
                  onPress={handleSubmit}
                  variant="primary"
                  disabled={!termsAgreed}
                  loading={submitting}
                >
                  Submit Registration
                </Button>
              )}
            </Inline>
          </Stack>
        </Inset>
      </Card>
    </div>
  );
};

const TestApp = () => (
  <>
    <ToastProvider />
    <TestAppInner />
  </>
);

export default TestApp;
