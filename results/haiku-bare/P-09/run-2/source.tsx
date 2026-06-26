import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TextField,
  Checkbox,
  Text,
  Heading,
  Banner,
  Select,
  Textarea,
  Stack,
  Inline,
  ComboBox,
  TagGroup,
  Tag,
  CheckboxGroup,
  Fieldset,
  Toggle,
  DateField,
  TimeField,
  RadioGroup,
  Radio,
} from '@marigold/components';
import { parseDate } from '@internationalized/date';

interface FormData {
  // Step 1 - Personal
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  profilePhotoPreview: string | null;

  // Step 2 - Event
  eventDate: string;
  preferredTime: string;
  sessionTrack: string;
  dietaryRequirements: string[];
  dietaryCustom: string;
  numberofGuests: number;
  specialRequests: string;

  // Step 3 - Preferences
  tShirtSize: string;
  topicsOfInterest: string[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletter: boolean;
  accessibilityNeeds: boolean;
  accessibilityDetails: string;

  // Step 4 - Review
  agreeTerms: boolean;
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

const dietaryOptions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
];

const generateConfirmationNumber = () => {
  return 'CONF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    profilePhoto: null,
    profilePhotoPreview: null,

    eventDate: '',
    preferredTime: '',
    sessionTrack: 'Technical',
    dietaryRequirements: [],
    dietaryCustom: '',
    numberofGuests: 0,
    specialRequests: '',

    tShirtSize: 'M',
    topicsOfInterest: [],
    emailUpdates: false,
    smsReminders: false,
    postEventSurvey: false,
    newsletter: false,
    accessibilityNeeds: false,
    accessibilityDetails: '',

    agreeTerms: false,
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    setErrors({});
    return true;
  };

  const validateStep4 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();

    if (isValid && step < 4) {
      setStep(step + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const confNumber = generateConfirmationNumber();
    setConfirmationNumber(confNumber);
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleRegisterAnother = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      profilePhoto: null,
      profilePhotoPreview: null,

      eventDate: '',
      preferredTime: '',
      sessionTrack: 'Technical',
      dietaryRequirements: [],
      dietaryCustom: '',
      numberofGuests: 0,
      specialRequests: '',

      tShirtSize: 'M',
      topicsOfInterest: [],
      emailUpdates: false,
      smsReminders: false,
      postEventSurvey: false,
      newsletter: false,
      accessibilityNeeds: false,
      accessibilityDetails: '',

      agreeTerms: false,
    });
    setStep(1);
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        {isLoading && (
          <Stack gap="lg">
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              <Text>Processing your registration...</Text>
            </div>
          </Stack>
        )}

        {!isLoading && (
          <Stack gap="lg">
            <Banner variant="success">Registration confirmed!</Banner>

            <Card>
              <CardHeader>
                <CardTitle>Registration Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Stack gap="md">
                  <div>
                    <Text weight="bold">Name</Text>
                    <Text>{formData.fullName}</Text>
                  </div>
                  <div>
                    <Text weight="bold">Email</Text>
                    <Text>{formData.email}</Text>
                  </div>
                  <div>
                    <Text weight="bold">Event Date</Text>
                    <Text>{formData.eventDate || 'Not specified'}</Text>
                  </div>
                  <div>
                    <Text weight="bold">Confirmation Number</Text>
                    <Text>{confirmationNumber}</Text>
                  </div>
                </Stack>
              </CardContent>
            </Card>

            <Button onPress={handleRegisterAnother} fullWidth>
              Register Another
            </Button>
          </Stack>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <CardHeader>
          <CardTitle>
            Step {step} of 4 —{' '}
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Event Details'}
            {step === 3 && 'Preferences'}
            {step === 4 && 'Review & Confirm'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="lg">
            {step === 1 && (
              <Stack gap="md">
                <Banner>Your information will only be used for this event.</Banner>

                <TextField
                  label="Full Name"
                  isRequired
                  value={formData.fullName}
                  onInput={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  errorMessage={errors.fullName}
                />

                <TextField
                  label="Email"
                  type="email"
                  isRequired
                  value={formData.email}
                  onInput={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  errorMessage={errors.email}
                />

                <TextField
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onInput={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <TextField
                  label="Company / Organization"
                  value={formData.company}
                  onInput={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />

                <ComboBox
                  label="Job Title"
                  items={jobTitleSuggestions}
                  selectedKey={formData.jobTitle || null}
                  onSelectionChange={(key) => {
                    setFormData({
                      ...formData,
                      jobTitle: key ? String(key) : '',
                    });
                  }}
                  inputValue={formData.jobTitle}
                  onInputChange={(value) => {
                    setFormData({ ...formData, jobTitle: value });
                  }}
                  allowsCustomValue
                >
                  {(item) => <ComboBox.Item>{item}</ComboBox.Item>}
                </ComboBox>

                <TextField
                  label="Profile Photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({
                          ...formData,
                          profilePhoto: file,
                          profilePhotoPreview: event.target?.result as string,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {formData.profilePhotoPreview && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img
                      src={formData.profilePhotoPreview}
                      alt="Profile preview"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                )}
              </Stack>
            )}

            {step === 2 && (
              <Stack gap="md">
                <DateField
                  label="Event Date"
                  isRequired
                  value={
                    formData.eventDate
                      ? parseDate(formData.eventDate)
                      : undefined
                  }
                  onChange={(date) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        eventDate: date.toString(),
                      });
                    }
                  }}
                  errorMessage={errors.eventDate}
                />

                <TimeField
                  label="Preferred Time Slot"
                  value={formData.preferredTime}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      preferredTime: e.target.value,
                    });
                  }}
                />

                <RadioGroup
                  label="Session Track"
                  value={formData.sessionTrack}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      sessionTrack: value,
                    });
                  }}
                >
                  <Radio value="Technical">Technical</Radio>
                  <Radio value="Design">Design</Radio>
                  <Radio value="Business">Business</Radio>
                  <Radio value="Workshop">Workshop</Radio>
                </RadioGroup>

                <ComboBox
                  label="Dietary Requirements"
                  items={dietaryOptions}
                  selectedKey={
                    formData.dietaryRequirements.length > 0
                      ? formData.dietaryRequirements[0]
                      : null
                  }
                  onSelectionChange={(key) => {
                    if (key) {
                      setFormData({
                        ...formData,
                        dietaryRequirements: [String(key)],
                      });
                    }
                  }}
                  allowsCustomValue
                  inputValue={formData.dietaryCustom}
                  onInputChange={(value) => {
                    setFormData({
                      ...formData,
                      dietaryCustom: value,
                    });
                  }}
                >
                  {(item) => <ComboBox.Item>{item}</ComboBox.Item>}
                </ComboBox>

                <TextField
                  label="Number of Guests"
                  type="number"
                  min="0"
                  max="5"
                  value={String(formData.numberofGuests)}
                  onInput={(e) => {
                    const num = Math.max(
                      0,
                      Math.min(5, parseInt(e.target.value) || 0)
                    );
                    setFormData({
                      ...formData,
                      numberofGuests: num,
                    });
                  }}
                />

                <Textarea
                  label="Special Requests"
                  value={formData.specialRequests}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      specialRequests: e.target.value,
                    });
                  }}
                />
              </Stack>
            )}

            {step === 3 && (
              <Stack gap="md">
                <Select
                  label="T-Shirt Size"
                  value={formData.tShirtSize}
                  onChangeValue={(value) => {
                    setFormData({
                      ...formData,
                      tShirtSize: value,
                    });
                  }}
                >
                  <Select.Option value="XS">XS</Select.Option>
                  <Select.Option value="S">S</Select.Option>
                  <Select.Option value="M">M</Select.Option>
                  <Select.Option value="L">L</Select.Option>
                  <Select.Option value="XL">XL</Select.Option>
                  <Select.Option value="XXL">XXL</Select.Option>
                </Select>

                <Fieldset legend="Topics of Interest">
                  <TagGroup
                    items={topicSuggestions.map((topic) => ({
                      id: topic,
                      name: topic,
                    }))}
                    onRemove={(key) => {
                      setFormData({
                        ...formData,
                        topicsOfInterest: formData.topicsOfInterest.filter(
                          (t) => t !== key
                        ),
                      });
                    }}
                  >
                    {(item) => (
                      <Tag
                        textValue={item.name}
                        onPress={() => {
                          if (
                            !formData.topicsOfInterest.includes(item.id)
                          ) {
                            setFormData({
                              ...formData,
                              topicsOfInterest: [
                                ...formData.topicsOfInterest,
                                item.id,
                              ],
                            });
                          }
                        }}
                      >
                        {item.name}
                      </Tag>
                    )}
                  </TagGroup>
                </Fieldset>

                <CheckboxGroup
                  label="Communication Preferences"
                  value={
                    [
                      formData.emailUpdates && 'email',
                      formData.smsReminders && 'sms',
                      formData.postEventSurvey && 'survey',
                      formData.newsletter && 'newsletter',
                    ].filter(Boolean) as string[]
                  }
                  onChange={(values) => {
                    setFormData({
                      ...formData,
                      emailUpdates: values.includes('email'),
                      smsReminders: values.includes('sms'),
                      postEventSurvey: values.includes('survey'),
                      newsletter: values.includes('newsletter'),
                    });
                  }}
                >
                  <Checkbox value="email">Email updates about the event</Checkbox>
                  <Checkbox value="sms">SMS reminders</Checkbox>
                  <Checkbox value="survey">Post-event survey</Checkbox>
                  <Checkbox value="newsletter">Newsletter subscription</Checkbox>
                </CheckboxGroup>

                <Fieldset legend="Accessibility">
                  <Toggle
                    isSelected={formData.accessibilityNeeds}
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        accessibilityNeeds: value,
                      });
                    }}
                  >
                    I have accessibility requirements
                  </Toggle>
                </Fieldset>

                {formData.accessibilityNeeds && (
                  <Textarea
                    label="Accessibility Details"
                    value={formData.accessibilityDetails}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        accessibilityDetails: e.target.value,
                      });
                    }}
                  />
                )}
              </Stack>
            )}

            {step === 4 && (
              <Stack gap="md">
                <Card variant="secondary">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      <Inline>
                        <Text weight="bold">Name:</Text>
                        <Text>{formData.fullName}</Text>
                      </Inline>
                      <Inline>
                        <Text weight="bold">Email:</Text>
                        <Text>{formData.email}</Text>
                      </Inline>
                      {formData.phone && (
                        <Inline>
                          <Text weight="bold">Phone:</Text>
                          <Text>{formData.phone}</Text>
                        </Inline>
                      )}
                      {formData.company && (
                        <Inline>
                          <Text weight="bold">Company:</Text>
                          <Text>{formData.company}</Text>
                        </Inline>
                      )}
                      {formData.jobTitle && (
                        <Inline>
                          <Text weight="bold">Job Title:</Text>
                          <Text>{formData.jobTitle}</Text>
                        </Inline>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="secondary">
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      <Inline>
                        <Text weight="bold">Date:</Text>
                        <Text>{formData.eventDate || 'Not specified'}</Text>
                      </Inline>
                      {formData.preferredTime && (
                        <Inline>
                          <Text weight="bold">Time:</Text>
                          <Text>{formData.preferredTime}</Text>
                        </Inline>
                      )}
                      <Inline>
                        <Text weight="bold">Track:</Text>
                        <Text>{formData.sessionTrack}</Text>
                      </Inline>
                      {formData.dietaryRequirements.length > 0 && (
                        <Inline>
                          <Text weight="bold">Dietary:</Text>
                          <Text>
                            {formData.dietaryRequirements.join(', ')}
                          </Text>
                        </Inline>
                      )}
                      <Inline>
                        <Text weight="bold">Guests:</Text>
                        <Text>{formData.numberofGuests}</Text>
                      </Inline>
                      {formData.specialRequests && (
                        <Inline>
                          <Text weight="bold">Special Requests:</Text>
                          <Text>{formData.specialRequests}</Text>
                        </Inline>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="secondary">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      <Inline>
                        <Text weight="bold">T-Shirt Size:</Text>
                        <Text>{formData.tShirtSize}</Text>
                      </Inline>
                      {formData.topicsOfInterest.length > 0 && (
                        <Inline>
                          <Text weight="bold">Topics:</Text>
                          <Text>{formData.topicsOfInterest.join(', ')}</Text>
                        </Inline>
                      )}
                      {(formData.emailUpdates ||
                        formData.smsReminders ||
                        formData.postEventSurvey ||
                        formData.newsletter) && (
                        <Inline>
                          <Text weight="bold">Comms:</Text>
                          <Text>
                            {[
                              formData.emailUpdates && 'Email',
                              formData.smsReminders && 'SMS',
                              formData.postEventSurvey && 'Survey',
                              formData.newsletter && 'Newsletter',
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </Inline>
                      )}
                    </Stack>
                  </CardContent>
                </Card>

                <Checkbox
                  isSelected={formData.agreeTerms}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      agreeTerms: value,
                    });
                  }}
                >
                  I agree to the terms and conditions
                </Checkbox>

                {errors.agreeTerms && (
                  <Text color="error">{errors.agreeTerms}</Text>
                )}
              </Stack>
            )}

            <Inline gap="md" justifyContent="space-between">
              <Button
                onPress={handleBack}
                isDisabled={step === 1}
                variant="secondary"
              >
                Back
              </Button>

              <Button
                onPress={
                  step === 4 ? handleSubmit : handleNext
                }
                isDisabled={step === 4 && !formData.agreeTerms}
              >
                {step === 4 ? 'Submit Registration' : 'Next'}
              </Button>
            </Inline>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestApp;
