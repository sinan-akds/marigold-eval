import React, { useState } from 'react';
import {
  Card,
  Heading,
  Button,
  TextField,
  TextArea,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  DateField,
  TimeField,
  Combobox,
  ComboboxItem,
  ComboboxSection,
  FileInput,
  Inset,
  Badge,
  Stack,
  HStack,
  VStack,
  Banner,
  Toast,
  Columns,
  Text,
  Switch,
} from '@marigold/components';

interface RegistrationData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  photo: File | null;

  // Step 2
  eventDate: string;
  preferredTime: string;
  sessionTrack: string;
  dietaryRequirements: string[];
  numGuests: number;
  specialRequests: string;

  // Step 3
  tshirtSize: string;
  topicsOfInterest: string[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletter: boolean;
  hasAccessibilityNeeds: boolean;
  accessibilityDetails: string;
}

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [confirmNumber, setConfirmNumber] = useState('');

  const [data, setData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    photo: null,
    eventDate: '',
    preferredTime: '',
    sessionTrack: 'Technical',
    dietaryRequirements: [],
    numGuests: 0,
    specialRequests: '',
    tshirtSize: 'M',
    topicsOfInterest: [],
    emailUpdates: false,
    smsReminders: false,
    postEventSurvey: false,
    newsletter: false,
    hasAccessibilityNeeds: false,
    accessibilityDetails: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(data.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!data.eventDate) newErrors.eventDate = 'Event Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    setErrors({});
    return true;
  };

  const validateStep4 = (): boolean => {
    setErrors({});
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    else if (step === 4) isValid = validateStep4();

    if (isValid) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setConfirmNumber('EVT-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    setTimeout(() => {
      setShowToast(true);
    }, 1000);
  };

  const handleReset = () => {
    setStep(1);
    setSubmitted(false);
    setShowToast(false);
    setData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      photo: null,
      eventDate: '',
      preferredTime: '',
      sessionTrack: 'Technical',
      dietaryRequirements: [],
      numGuests: 0,
      specialRequests: '',
      tshirtSize: 'M',
      topicsOfInterest: [],
      emailUpdates: false,
      smsReminders: false,
      postEventSurvey: false,
      newsletter: false,
      hasAccessibilityNeeds: false,
      accessibilityDetails: '',
    });
    setPhotoPreview(null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setData({ ...data, photo: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTopic = (topic: string) => {
    if (topic && !data.topicsOfInterest.includes(topic)) {
      setData({
        ...data,
        topicsOfInterest: [...data.topicsOfInterest, topic],
      });
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setData({
      ...data,
      topicsOfInterest: data.topicsOfInterest.filter((t) => t !== topic),
    });
  };

  const handleDietaryChange = (value: string[]) => {
    setData({ ...data, dietaryRequirements: value });
  };

  if (submitted) {
    return (
      <Card>
        <Inset space="lg">
          <VStack gap="lg">
            <VStack gap="md" alignItems="center">
              <Heading level="2">Registration Submitted!</Heading>
              <Banner>Registration confirmed!</Banner>
            </VStack>

            <Card>
              <VStack gap="md">
                <HStack gap="sm">
                  <Text weight="bold">Confirmation Number:</Text>
                  <Badge>{confirmNumber}</Badge>
                </HStack>
                <HStack gap="sm">
                  <Text weight="bold">Name:</Text>
                  <Text>{data.fullName}</Text>
                </HStack>
                <HStack gap="sm">
                  <Text weight="bold">Email:</Text>
                  <Text>{data.email}</Text>
                </HStack>
                <HStack gap="sm">
                  <Text weight="bold">Event Date:</Text>
                  <Text>{data.eventDate}</Text>
                </HStack>
              </VStack>
            </Card>

            <Button onPress={handleReset}>Register Another</Button>
          </VStack>
        </Inset>
      </Card>
    );
  }

  const stepTitles = [
    'Personal Information',
    'Event Details',
    'Preferences',
    'Review & Confirm',
  ];

  return (
    <Card>
      <Inset space="lg">
        <VStack gap="lg">
          <VStack gap="md">
            <Heading level="3">
              Step {step} of 4 — {stepTitles[step - 1]}
            </Heading>
          </VStack>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <VStack gap="lg">
              <Banner>Your information will only be used for this event.</Banner>

              <TextField
                label="Full Name *"
                value={data.fullName}
                onChange={(value) => setData({ ...data, fullName: value })}
                isInvalid={!!errors.fullName}
                errorMessage={errors.fullName}
              />

              <TextField
                label="Email *"
                type="email"
                value={data.email}
                onChange={(value) => setData({ ...data, email: value })}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
              />

              <TextField
                label="Phone Number"
                type="tel"
                value={data.phone}
                onChange={(value) => setData({ ...data, phone: value })}
              />

              <TextField
                label="Company / Organization"
                value={data.company}
                onChange={(value) => setData({ ...data, company: value })}
              />

              <Combobox
                label="Job Title"
                value={data.jobTitle}
                onSelectionChange={(value) =>
                  setData({ ...data, jobTitle: value?.toString() || '' })
                }
              >
                <ComboboxItem>Developer</ComboboxItem>
                <ComboboxItem>Designer</ComboboxItem>
                <ComboboxItem>Product Manager</ComboboxItem>
                <ComboboxItem>Engineering Manager</ComboboxItem>
                <ComboboxItem>CTO</ComboboxItem>
                <ComboboxItem>Other</ComboboxItem>
              </Combobox>

              <VStack gap="sm">
                <Text weight="bold">Profile Photo</Text>
                <FileInput onChange={handlePhotoChange} />
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    style={{ maxWidth: '150px', height: 'auto' }}
                  />
                )}
              </VStack>
            </VStack>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <VStack gap="lg">
              <DateField
                label="Event Date *"
                value={data.eventDate}
                onChange={(value) => setData({ ...data, eventDate: value })}
                isInvalid={!!errors.eventDate}
                errorMessage={errors.eventDate}
              />

              <TimeField
                label="Preferred Time Slot"
                value={data.preferredTime}
                onChange={(value) => setData({ ...data, preferredTime: value })}
              />

              <RadioGroup
                label="Session Track"
                value={data.sessionTrack}
                onChange={(value) => setData({ ...data, sessionTrack: value })}
              >
                <Radio value="Technical">Technical</Radio>
                <Radio value="Design">Design</Radio>
                <Radio value="Business">Business</Radio>
                <Radio value="Workshop">Workshop</Radio>
              </RadioGroup>

              <Combobox
                label="Dietary Requirements"
                selectedKey={data.dietaryRequirements[0]}
                onSelectionChange={(value) => {
                  if (value) {
                    setData({ ...data, dietaryRequirements: [value.toString()] });
                  }
                }}
              >
                <ComboboxItem>None</ComboboxItem>
                <ComboboxItem>Vegetarian</ComboboxItem>
                <ComboboxItem>Vegan</ComboboxItem>
                <ComboboxItem>Gluten-Free</ComboboxItem>
                <ComboboxItem>Kosher</ComboboxItem>
                <ComboboxItem>Halal</ComboboxItem>
              </Combobox>

              <TextField
                label="Number of Guests"
                type="number"
                value={data.numGuests.toString()}
                onChange={(value) =>
                  setData({ ...data, numGuests: Math.min(5, Math.max(0, parseInt(value) || 0)) })
                }
              />

              <TextArea
                label="Special Requests"
                value={data.specialRequests}
                onChange={(value) => setData({ ...data, specialRequests: value })}
              />
            </VStack>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <VStack gap="lg">
              <Select
                label="T-Shirt Size"
                selectedKey={data.tshirtSize}
                onSelectionChange={(value) => setData({ ...data, tshirtSize: value.toString() })}
              >
                <SelectItem>XS</SelectItem>
                <SelectItem>S</SelectItem>
                <SelectItem>M</SelectItem>
                <SelectItem>L</SelectItem>
                <SelectItem>XL</SelectItem>
                <SelectItem>XXL</SelectItem>
              </Select>

              <VStack gap="sm">
                <Text weight="bold">Topics of Interest</Text>
                <Combobox
                  label="Add a topic"
                  onSelectionChange={(value) => {
                    if (value) handleAddTopic(value.toString());
                  }}
                >
                  <ComboboxItem>AI/ML</ComboboxItem>
                  <ComboboxItem>Web Development</ComboboxItem>
                  <ComboboxItem>Cloud</ComboboxItem>
                  <ComboboxItem>Security</ComboboxItem>
                  <ComboboxItem>DevOps</ComboboxItem>
                  <ComboboxItem>Mobile</ComboboxItem>
                  <ComboboxItem>Data Science</ComboboxItem>
                </Combobox>
                {data.topicsOfInterest.length > 0 && (
                  <HStack gap="sm" wrap="wrap">
                    {data.topicsOfInterest.map((topic) => (
                      <Badge key={topic}>
                        {topic}
                        <Button
                          size="small"
                          variant="plain"
                          onPress={() => handleRemoveTopic(topic)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </HStack>
                )}
              </VStack>

              <CheckboxGroup label="Communication Preferences">
                <Checkbox
                  checked={data.emailUpdates}
                  onChange={(checked) => setData({ ...data, emailUpdates: checked })}
                >
                  Email updates about the event
                </Checkbox>
                <Checkbox
                  checked={data.smsReminders}
                  onChange={(checked) => setData({ ...data, smsReminders: checked })}
                >
                  SMS reminders
                </Checkbox>
                <Checkbox
                  checked={data.postEventSurvey}
                  onChange={(checked) => setData({ ...data, postEventSurvey: checked })}
                >
                  Post-event survey
                </Checkbox>
                <Checkbox
                  checked={data.newsletter}
                  onChange={(checked) => setData({ ...data, newsletter: checked })}
                >
                  Newsletter subscription
                </Checkbox>
              </CheckboxGroup>

              <VStack gap="sm">
                <Switch
                  checked={data.hasAccessibilityNeeds}
                  onChange={(checked) =>
                    setData({ ...data, hasAccessibilityNeeds: checked })
                  }
                >
                  I have accessibility requirements
                </Switch>
                {data.hasAccessibilityNeeds && (
                  <TextArea
                    label="Accessibility Details"
                    value={data.accessibilityDetails}
                    onChange={(value) =>
                      setData({ ...data, accessibilityDetails: value })
                    }
                  />
                )}
              </VStack>
            </VStack>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <VStack gap="lg">
              <Card>
                <VStack gap="lg">
                  <Heading level="4">Personal Information</Heading>
                  <VStack gap="sm">
                    <HStack gap="sm">
                      <Text weight="bold">Name:</Text>
                      <Text>{data.fullName}</Text>
                    </HStack>
                    <HStack gap="sm">
                      <Text weight="bold">Email:</Text>
                      <Text>{data.email}</Text>
                    </HStack>
                    {data.phone && (
                      <HStack gap="sm">
                        <Text weight="bold">Phone:</Text>
                        <Text>{data.phone}</Text>
                      </HStack>
                    )}
                    {data.company && (
                      <HStack gap="sm">
                        <Text weight="bold">Company:</Text>
                        <Text>{data.company}</Text>
                      </HStack>
                    )}
                    {data.jobTitle && (
                      <HStack gap="sm">
                        <Text weight="bold">Job Title:</Text>
                        <Text>{data.jobTitle}</Text>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </Card>

              <Card>
                <VStack gap="lg">
                  <Heading level="4">Event Details</Heading>
                  <VStack gap="sm">
                    <HStack gap="sm">
                      <Text weight="bold">Date:</Text>
                      <Text>{data.eventDate}</Text>
                    </HStack>
                    {data.preferredTime && (
                      <HStack gap="sm">
                        <Text weight="bold">Time:</Text>
                        <Text>{data.preferredTime}</Text>
                      </HStack>
                    )}
                    <HStack gap="sm">
                      <Text weight="bold">Track:</Text>
                      <Text>{data.sessionTrack}</Text>
                    </HStack>
                    {data.dietaryRequirements.length > 0 && (
                      <HStack gap="sm">
                        <Text weight="bold">Dietary:</Text>
                        <Text>{data.dietaryRequirements.join(', ')}</Text>
                      </HStack>
                    )}
                    <HStack gap="sm">
                      <Text weight="bold">Guests:</Text>
                      <Text>{data.numGuests}</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </Card>

              <Card>
                <VStack gap="lg">
                  <Heading level="4">Preferences</Heading>
                  <VStack gap="sm">
                    <HStack gap="sm">
                      <Text weight="bold">T-Shirt Size:</Text>
                      <Text>{data.tshirtSize}</Text>
                    </HStack>
                    {data.topicsOfInterest.length > 0 && (
                      <VStack gap="sm">
                        <Text weight="bold">Topics:</Text>
                        <HStack gap="sm" wrap="wrap">
                          {data.topicsOfInterest.map((topic) => (
                            <Badge key={topic}>{topic}</Badge>
                          ))}
                        </HStack>
                      </VStack>
                    )}
                    <Text weight="bold">Communication:</Text>
                    <VStack gap="xs">
                      {data.emailUpdates && <Text>• Email updates</Text>}
                      {data.smsReminders && <Text>• SMS reminders</Text>}
                      {data.postEventSurvey && <Text>• Post-event survey</Text>}
                      {data.newsletter && <Text>• Newsletter</Text>}
                    </VStack>
                  </VStack>
                </VStack>
              </Card>

              <Checkbox
                checked={errors['agreeTerms'] !== undefined}
                onChange={(checked) => {
                  if (checked) {
                    const newErrors = { ...errors };
                    delete newErrors['agreeTerms'];
                    setErrors(newErrors);
                  } else {
                    setErrors({ ...errors, agreeTerms: 'You must agree to terms' });
                  }
                }}
              >
                I agree to the terms and conditions *
              </Checkbox>
            </VStack>
          )}

          {/* Navigation */}
          <HStack gap="md" justifyContent="space-between">
            <Button
              variant="secondary"
              onPress={() => setStep(step - 1)}
              isDisabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button onPress={handleNext}>Next</Button>
            ) : (
              <Button
                onPress={handleSubmit}
                isDisabled={errors['agreeTerms'] !== undefined}
              >
                Submit Registration
              </Button>
            )}
          </HStack>
        </VStack>
      </Inset>

      {showToast && (
        <Toast onClose={() => setShowToast(false)}>
          Registration submitted successfully
        </Toast>
      )}
    </Card>
  );
};

export default TestApp;
