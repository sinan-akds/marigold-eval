import { useState } from 'react';
import type { DateValue } from '@internationalized/date';
import {
  Accordion,
  Button,
  Card,
  Checkbox,
  Divider,
  FileField,
  DatePicker,
  Headline,
  Inline,
  Loader,
  NumberField,
  SectionMessage,
  Select,
  Stack,
  Switch,
  TagField,
  TextArea,
  TextField,
  useToast,
} from '@marigold/components';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  eventDate: DateValue | null;
  preferredTime: string;
  sessionTrack: string;
  dietaryRequirements: Set<string> | string[];
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topicsOfInterest: Set<string>;
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletterSubscription: boolean;
  accessibilityNeeds: boolean;
  accessibilityDetails: string;
  termsAgreed: boolean;
}

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

const topicsOfInterest = [
  'AI/ML',
  'Web Development',
  'Cloud',
  'Security',
  'DevOps',
  'Mobile',
  'Data Science',
];

const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const TestApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    profilePhoto: null,
    eventDate: null,
    preferredTime: '',
    sessionTrack: 'Technical',
    dietaryRequirements: [],
    numberOfGuests: 0,
    specialRequests: '',
    tshirtSize: 'M',
    topicsOfInterest: new Set(),
    emailUpdates: false,
    smsReminders: false,
    postEventSurvey: false,
    newsletterSubscription: false,
    accessibilityNeeds: false,
    accessibilityDetails: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (step === 2) {
      if (!formData.eventDate) {
        newErrors.eventDate = 'Event Date is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.termsAgreed) {
      setErrors({ termsAgreed: 'You must agree to the terms and conditions' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const confirmNum = `REG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setConfirmationNumber(confirmNum);
    setSubmissionComplete(true);
    setIsSubmitting(false);

    addToast({
      title: 'Registration submitted successfully',
      variant: 'success',
    });
  };

  const handleRegisterAnother = () => {
    setCurrentStep(1);
    setSubmissionComplete(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      profilePhoto: null,
      eventDate: null,
      preferredTime: '',
      sessionTrack: 'Technical',
      dietaryRequirements: [],
      numberOfGuests: 0,
      specialRequests: '',
      tshirtSize: 'M',
      topicsOfInterest: new Set(),
      emailUpdates: false,
      smsReminders: false,
      postEventSurvey: false,
      newsletterSubscription: false,
      accessibilityNeeds: false,
      accessibilityDetails: '',
      termsAgreed: false,
    });
    setErrors({});
  };

  if (isSubmitting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader mode="fullscreen" />
      </div>
    );
  }

  if (submissionComplete) {
    return (
      <Stack space={6} alignX="center">
        <SectionMessage variant="success">
          <SectionMessage.Title>Registration confirmed!</SectionMessage.Title>
        </SectionMessage>

        <Card>
          <Stack space={4} alignX="left">
            <Headline level={3}>Confirmation Details</Headline>
            <Stack space={2}>
              <div>
                <Headline level={5}>Registrant Name</Headline>
                <span>{formData.fullName}</span>
              </div>
              <div>
                <Headline level={5}>Email</Headline>
                <span>{formData.email}</span>
              </div>
              {formData.eventDate && (
                <div>
                  <Headline level={5}>Event Date</Headline>
                  <span>
                    {formData.eventDate.day}/{formData.eventDate.month}/
                    {formData.eventDate.year}
                  </span>
                </div>
              )}
              <div>
                <Headline level={5}>Confirmation Number</Headline>
                <span className="font-mono text-sm">{confirmationNumber}</span>
              </div>
            </Stack>
          </Stack>
        </Card>

        <Button variant="primary" onPress={handleRegisterAnother}>
          Register Another
        </Button>
      </Stack>
    );
  }

  const stepTitles = [
    'Personal Information',
    'Event Details',
    'Preferences',
    'Review & Confirm',
  ];

  return (
    <Stack alignX="center" space={6}>
      <Card>
        <Stack space={4}>
          <div>
            <Headline level={4}>
              Step {currentStep} of 4 — {stepTitles[currentStep - 1]}
            </Headline>
          </div>

          <Divider />

          {currentStep === 1 && (
            <Stack space={4}>
              <SectionMessage variant="info">
                <SectionMessage.Content>
                  Your information will only be used for this event.
                </SectionMessage.Content>
              </SectionMessage>

              <TextField
                label="Full Name"
                required
                value={formData.fullName}
                onChange={value => updateFormData('fullName', value)}
                error={!!errors.fullName}
                errorMessage={errors.fullName}
              />

              <TextField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={value => updateFormData('email', value)}
                error={!!errors.email}
                errorMessage={errors.email}
              />

              <TextField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={value => updateFormData('phone', value)}
              />

              <TextField
                label="Company / Organization"
                value={formData.company}
                onChange={value => updateFormData('company', value)}
              />

              <Select
                label="Job Title"
                value={formData.jobTitle}
                onSelectionChange={value =>
                  updateFormData('jobTitle', value as string)
                }
              >
                <Select.Option key="" textValue="">
                  Select a job title
                </Select.Option>
                {jobTitleSuggestions.map(job => (
                  <Select.Option key={job} textValue={job}>
                    {job}
                  </Select.Option>
                ))}
              </Select>

              <FileField
                label="Profile Photo"
                accept={['image/*']}
              />
            </Stack>
          )}

          {currentStep === 2 && (
            <Stack space={4}>
              <DatePicker
                label="Event Date"
                required
                value={formData.eventDate}
                onChange={value => updateFormData('eventDate', value)}
                error={!!errors.eventDate}
                errorMessage={errors.eventDate}
              />

              <TextField
                label="Preferred Time Slot"
                type="time"
                value={formData.preferredTime}
                onChange={value => updateFormData('preferredTime', value)}
              />

              <Select
                label="Session Track"
                value={formData.sessionTrack}
                onSelectionChange={value =>
                  updateFormData('sessionTrack', value as string)
                }
              >
                <Select.Option key="Technical" textValue="Technical">
                  Technical
                </Select.Option>
                <Select.Option key="Design" textValue="Design">
                  Design
                </Select.Option>
                <Select.Option key="Business" textValue="Business">
                  Business
                </Select.Option>
                <Select.Option key="Workshop" textValue="Workshop">
                  Workshop
                </Select.Option>
              </Select>

              <TagField
                label="Dietary Requirements"
                value={
                  formData.dietaryRequirements instanceof Set
                    ? Array.from(formData.dietaryRequirements)
                    : formData.dietaryRequirements
                }
                onChange={keys => {
                  updateFormData('dietaryRequirements', new Set(keys));
                }}
              >
                {dietaryOptions.map(option => (
                  <TagField.Option key={option} id={option}>
                    {option}
                  </TagField.Option>
                ))}
              </TagField>

              <NumberField
                label="Number of Guests"
                minValue={0}
                maxValue={5}
                value={formData.numberOfGuests}
                onChange={value => updateFormData('numberOfGuests', value || 0)}
              />

              <TextArea
                label="Special Requests"
                value={formData.specialRequests}
                onChange={value => updateFormData('specialRequests', value)}
              />
            </Stack>
          )}

          {currentStep === 3 && (
            <Stack space={4}>
              <Select
                label="T-Shirt Size"
                value={formData.tshirtSize}
                onSelectionChange={value =>
                  updateFormData('tshirtSize', value as string)
                }
              >
                {tshirtSizes.map(size => (
                  <Select.Option key={size} textValue={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>

              <TagField
                label="Topics of Interest"
                value={Array.from(formData.topicsOfInterest)}
                onChange={keys => {
                  updateFormData('topicsOfInterest', new Set(keys));
                }}
              >
                {topicsOfInterest.map(topic => (
                  <TagField.Option key={topic} id={topic}>
                    {topic}
                  </TagField.Option>
                ))}
              </TagField>

              <Checkbox.Group
                label="Communication Preferences"
                value={[
                  ...(formData.emailUpdates ? ['emailUpdates'] : []),
                  ...(formData.smsReminders ? ['smsReminders'] : []),
                  ...(formData.postEventSurvey ? ['postEventSurvey'] : []),
                  ...(formData.newsletterSubscription
                    ? ['newsletterSubscription']
                    : []),
                ]}
                onChange={selected => {
                  updateFormData('emailUpdates', selected.includes('emailUpdates'));
                  updateFormData('smsReminders', selected.includes('smsReminders'));
                  updateFormData('postEventSurvey', selected.includes('postEventSurvey'));
                  updateFormData(
                    'newsletterSubscription',
                    selected.includes('newsletterSubscription')
                  );
                }}
              >
                <Checkbox
                  value="emailUpdates"
                  label="Email updates about the event"
                />
                <Checkbox value="smsReminders" label="SMS reminders" />
                <Checkbox value="postEventSurvey" label="Post-event survey" />
                <Checkbox
                  value="newsletterSubscription"
                  label="Newsletter subscription"
                />
              </Checkbox.Group>

              <Stack space={2}>
                <Switch
                  label="I have accessibility requirements"
                  selected={formData.accessibilityNeeds}
                  onChange={value =>
                    updateFormData('accessibilityNeeds', value)
                  }
                />
                {formData.accessibilityNeeds && (
                  <TextArea
                    label="Accessibility Details"
                    value={formData.accessibilityDetails}
                    onChange={value =>
                      updateFormData('accessibilityDetails', value)
                    }
                  />
                )}
              </Stack>
            </Stack>
          )}

          {currentStep === 4 && (
            <Stack space={4}>
              <Accordion>
                <Accordion.Item>
                  <Accordion.Header>Personal Information</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2} alignX="left">
                      <div>
                        <strong>Name:</strong> {formData.fullName}
                      </div>
                      <div>
                        <strong>Email:</strong> {formData.email}
                      </div>
                      {formData.phone && (
                        <div>
                          <strong>Phone:</strong> {formData.phone}
                        </div>
                      )}
                      {formData.company && (
                        <div>
                          <strong>Company:</strong> {formData.company}
                        </div>
                      )}
                      {formData.jobTitle && (
                        <div>
                          <strong>Job Title:</strong> {formData.jobTitle}
                        </div>
                      )}
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item>
                  <Accordion.Header>Event Details</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2} alignX="left">
                      {formData.eventDate && (
                        <div>
                          <strong>Date:</strong>{' '}
                          {formData.eventDate.day}/{formData.eventDate.month}/
                          {formData.eventDate.year}
                        </div>
                      )}
                      {formData.preferredTime && (
                        <div>
                          <strong>Time:</strong> {formData.preferredTime}
                        </div>
                      )}
                      <div>
                        <strong>Track:</strong> {formData.sessionTrack}
                      </div>
                      <div>
                        <strong>Dietary Requirements:</strong>{' '}
                        {Array.from(formData.dietaryRequirements).join(', ') ||
                          'None'}
                      </div>
                      <div>
                        <strong>Guests:</strong> {formData.numberOfGuests}
                      </div>
                      {formData.specialRequests && (
                        <div>
                          <strong>Special Requests:</strong>{' '}
                          {formData.specialRequests}
                        </div>
                      )}
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item>
                  <Accordion.Header>Preferences</Accordion.Header>
                  <Accordion.Content>
                    <Stack space={2} alignX="left">
                      <div>
                        <strong>T-Shirt Size:</strong> {formData.tshirtSize}
                      </div>
                      <div>
                        <strong>Topics:</strong>{' '}
                        {Array.from(formData.topicsOfInterest).join(', ') ||
                          'None'}
                      </div>
                      <div>
                        <strong>Communication Preferences:</strong>
                        <ul className="ml-4 list-disc">
                          {formData.emailUpdates && <li>Email updates</li>}
                          {formData.smsReminders && <li>SMS reminders</li>}
                          {formData.postEventSurvey && <li>Post-event survey</li>}
                          {formData.newsletterSubscription && (
                            <li>Newsletter subscription</li>
                          )}
                          {!formData.emailUpdates &&
                            !formData.smsReminders &&
                            !formData.postEventSurvey &&
                            !formData.newsletterSubscription && (
                              <li>None selected</li>
                            )}
                        </ul>
                      </div>
                      {formData.accessibilityNeeds && (
                        <div>
                          <strong>Accessibility:</strong>{' '}
                          {formData.accessibilityDetails}
                        </div>
                      )}
                    </Stack>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>

              <Checkbox
                label="I agree to the terms and conditions"
                checked={formData.termsAgreed}
                onChange={value => updateFormData('termsAgreed', value)}
              />
              {errors.termsAgreed && (
                <div className="text-error-600 text-sm">{errors.termsAgreed}</div>
              )}
            </Stack>
          )}

          <Divider />

          <Inline space={2} alignX="right">
            <Button
              disabled={currentStep === 1}
              onPress={handleBack}
              variant="secondary"
            >
              Back
            </Button>
            {currentStep < 4 ? (
              <Button onPress={handleNext} variant="primary">
                Next
              </Button>
            ) : (
              <Button
                onPress={handleSubmit}
                variant="primary"
                disabled={!formData.termsAgreed}
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
