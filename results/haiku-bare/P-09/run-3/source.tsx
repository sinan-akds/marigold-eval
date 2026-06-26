import { useState } from 'react';
import {
  Card,
  TextField,
  Button,
  Heading,
  FieldGroup,
  RadioGroup,
  Radio,
  Checkbox,
  Combobox,
  Badge,
  Toast,
  Loader,
  Box,
  Stack,
  Text,
} from '@marigold/components';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: File | null;
  eventDate: string;
  preferredTime: string;
  sessionTrack: string;
  dietaryRequirements: string[];
  numberOfGuests: string;
  specialRequests: string;
  tShirtSize: string;
  topicsOfInterest: string[];
  emailUpdates: boolean;
  smsReminders: boolean;
  postEventSurvey: boolean;
  newsletterSubscription: boolean;
  accessibilityNeeds: boolean;
  accessibilityDetails: string;
  agreeToTerms: boolean;
}

const initialFormData: FormData = {
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
  numberOfGuests: '0',
  specialRequests: '',
  tShirtSize: '',
  topicsOfInterest: [],
  emailUpdates: false,
  smsReminders: false,
  postEventSurvey: false,
  newsletterSubscription: false,
  accessibilityNeeds: false,
  accessibilityDetails: '',
  agreeToTerms: false,
};

const TestApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [confirmationNumber] = useState(
    `CONF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  );

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full Name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (stepNum === 2) {
      if (!formData.eventDate) {
        newErrors.eventDate = 'Event Date is required';
      }
    }

    if (stepNum === 4) {
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddDietaryRequirement = (value: string) => {
    if (value && !formData.dietaryRequirements.includes(value)) {
      handleInputChange('dietaryRequirements', [
        ...formData.dietaryRequirements,
        value,
      ]);
    }
  };

  const handleRemoveDietaryRequirement = (value: string) => {
    handleInputChange(
      'dietaryRequirements',
      formData.dietaryRequirements.filter((item) => item !== value)
    );
  };

  const handleAddTopic = (value: string) => {
    if (value && !formData.topicsOfInterest.includes(value)) {
      handleInputChange('topicsOfInterest', [
        ...formData.topicsOfInterest,
        value,
      ]);
    }
  };

  const handleRemoveTopic = (value: string) => {
    handleInputChange(
      'topicsOfInterest',
      formData.topicsOfInterest.filter((item) => item !== value)
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleInputChange('profilePhoto', file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSubmitted(true);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleRegisterAnother = () => {
    setStep(1);
    setFormData(initialFormData);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Stack gap="large" alignItems="center" style={{ padding: '40px 20px' }}>
        <Card style={{ maxWidth: '600px', width: '100%' }}>
          <Stack gap="medium">
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '20px',
              }}
            >
              <Text color="success" weight="bold" size="large">
                ✓ Registration confirmed!
              </Text>
            </Box>

            <Box
              style={{
                backgroundColor: '#e8f5e9',
                padding: '16px',
                borderRadius: '4px',
              }}
            >
              <Stack gap="small">
                <Text weight="bold">Registration Summary</Text>
                <Stack gap="xs">
                  <Text>
                    <strong>Name:</strong> {formData.fullName}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {formData.email}
                  </Text>
                  <Text>
                    <strong>Event Date:</strong> {formData.eventDate}
                  </Text>
                  <Text>
                    <strong>Confirmation Number:</strong> {confirmationNumber}
                  </Text>
                </Stack>
              </Stack>
            </Box>

            <Button onPress={handleRegisterAnother} variant="primary">
              Register Another
            </Button>
          </Stack>
        </Card>

        {showSuccessToast && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            Registration submitted successfully
          </div>
        )}
      </Stack>
    );
  }

  return (
    <Box style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ maxWidth: '600px', width: '100%' }}>
        <Stack gap="large">
          {/* Step indicator */}
          <Box>
            <Text size="small" color="muted">
              Step {step} of 4
            </Text>
            <Heading level={2} style={{ margin: '8px 0 0 0' }}>
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Event Details'}
              {step === 3 && 'Preferences'}
              {step === 4 && 'Review & Confirm'}
            </Heading>
          </Box>

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <Stack gap="medium">
              <Box
                style={{
                  backgroundColor: '#e3f2fd',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  borderLeft: '4px solid #1976d2',
                }}
              >
                <Text size="small">
                  Your information will only be used for this event.
                </Text>
              </Box>

              <TextField
                label="Full Name"
                isRequired
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
                errorMessage={errors.fullName}
                disabled={isLoading}
              />

              <TextField
                label="Email"
                isRequired
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                errorMessage={errors.email}
                disabled={isLoading}
              />

              <TextField
                label="Phone Number"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                disabled={isLoading}
              />

              <TextField
                label="Company / Organization"
                value={formData.company}
                onChange={(value) => handleInputChange('company', value)}
                disabled={isLoading}
              />

              <Combobox
                label="Job Title"
                items={[
                  'Developer',
                  'Designer',
                  'Product Manager',
                  'Engineering Manager',
                  'CTO',
                  'Other',
                ]}
                inputValue={formData.jobTitle}
                onInputChange={(value) => handleInputChange('jobTitle', value)}
                disabled={isLoading}
              />

              <Box>
                <Text size="small" weight="bold">
                  Profile Photo
                </Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  style={{ marginTop: '8px' }}
                />
                {formData.profilePhoto && (
                  <Box style={{ marginTop: '12px' }}>
                    <img
                      src={URL.createObjectURL(formData.profilePhoto)}
                      alt="Profile preview"
                      style={{
                        maxWidth: '150px',
                        maxHeight: '150px',
                        borderRadius: '4px',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          )}

          {/* Step 2: Event Details */}
          {step === 2 && (
            <Stack gap="medium">
              <TextField
                label="Event Date"
                isRequired
                type="date"
                value={formData.eventDate}
                onChange={(value) => handleInputChange('eventDate', value)}
                errorMessage={errors.eventDate}
                disabled={isLoading}
              />

              <TextField
                label="Preferred Time Slot"
                type="time"
                value={formData.preferredTime}
                onChange={(value) => handleInputChange('preferredTime', value)}
                disabled={isLoading}
              />

              <FieldGroup label="Session Track">
                <RadioGroup
                  value={formData.sessionTrack}
                  onChange={(value) => handleInputChange('sessionTrack', value)}
                  disabled={isLoading}
                >
                  <Radio value="Technical">Technical</Radio>
                  <Radio value="Design">Design</Radio>
                  <Radio value="Business">Business</Radio>
                  <Radio value="Workshop">Workshop</Radio>
                </RadioGroup>
              </FieldGroup>

              <Box>
                <Text size="small" weight="bold">
                  Dietary Requirements
                </Text>
                <Box style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <Combobox
                    items={[
                      'None',
                      'Vegetarian',
                      'Vegan',
                      'Gluten-Free',
                      'Kosher',
                      'Halal',
                    ]}
                    onSelectionChange={(value) => {
                      if (value) {
                        handleAddDietaryRequirement(value as string);
                      }
                    }}
                    placeholder="Select or type dietary requirement"
                    disabled={isLoading}
                  />
                </Box>
                <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {formData.dietaryRequirements.map((req) => (
                    <Badge
                      key={req}
                      onPress={() => handleRemoveDietaryRequirement(req)}
                    >
                      {req} ✕
                    </Badge>
                  ))}
                </Box>
              </Box>

              <TextField
                label="Number of Guests"
                type="number"
                min="0"
                max="5"
                value={formData.numberOfGuests}
                onChange={(value) => handleInputChange('numberOfGuests', value)}
                disabled={isLoading}
              />

              <TextField
                label="Special Requests"
                multiline
                rows={4}
                value={formData.specialRequests}
                onChange={(value) => handleInputChange('specialRequests', value)}
                disabled={isLoading}
              />
            </Stack>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <Stack gap="medium">
              <Combobox
                label="T-Shirt Size"
                items={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                inputValue={formData.tShirtSize}
                onInputChange={(value) => handleInputChange('tShirtSize', value)}
                disabled={isLoading}
              />

              <Box>
                <Text size="small" weight="bold">
                  Topics of Interest
                </Text>
                <Box style={{ marginTop: '8px', marginBottom: '8px' }}>
                  <Combobox
                    items={[
                      'AI/ML',
                      'Web Development',
                      'Cloud',
                      'Security',
                      'DevOps',
                      'Mobile',
                      'Data Science',
                    ]}
                    onSelectionChange={(value) => {
                      if (value) {
                        handleAddTopic(value as string);
                      }
                    }}
                    placeholder="Select topics of interest"
                    disabled={isLoading}
                  />
                </Box>
                <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {formData.topicsOfInterest.map((topic) => (
                    <Badge
                      key={topic}
                      onPress={() => handleRemoveTopic(topic)}
                    >
                      {topic} ✕
                    </Badge>
                  ))}
                </Box>
              </Box>

              <FieldGroup label="Communication Preferences">
                <Stack gap="small">
                  <Checkbox
                    checked={formData.emailUpdates}
                    onChange={(checked) =>
                      handleInputChange('emailUpdates', checked)
                    }
                    disabled={isLoading}
                  >
                    Email updates about the event
                  </Checkbox>
                  <Checkbox
                    checked={formData.smsReminders}
                    onChange={(checked) =>
                      handleInputChange('smsReminders', checked)
                    }
                    disabled={isLoading}
                  >
                    SMS reminders
                  </Checkbox>
                  <Checkbox
                    checked={formData.postEventSurvey}
                    onChange={(checked) =>
                      handleInputChange('postEventSurvey', checked)
                    }
                    disabled={isLoading}
                  >
                    Post-event survey
                  </Checkbox>
                  <Checkbox
                    checked={formData.newsletterSubscription}
                    onChange={(checked) =>
                      handleInputChange('newsletterSubscription', checked)
                    }
                    disabled={isLoading}
                  >
                    Newsletter subscription
                  </Checkbox>
                </Stack>
              </FieldGroup>

              <Box>
                <Checkbox
                  checked={formData.accessibilityNeeds}
                  onChange={(checked) =>
                    handleInputChange('accessibilityNeeds', checked)
                  }
                  disabled={isLoading}
                >
                  I have accessibility requirements
                </Checkbox>
                {formData.accessibilityNeeds && (
                  <Box style={{ marginTop: '12px' }}>
                    <TextField
                      label="Accessibility Details"
                      multiline
                      rows={4}
                      value={formData.accessibilityDetails}
                      onChange={(value) =>
                        handleInputChange('accessibilityDetails', value)
                      }
                      disabled={isLoading}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <Stack gap="medium">
              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px 16px',
                  borderRadius: '4px',
                }}
              >
                <Stack gap="small">
                  <Text weight="bold">Personal Information</Text>
                  <Stack gap="xs">
                    <Text>
                      <strong>Name:</strong> {formData.fullName}
                    </Text>
                    <Text>
                      <strong>Email:</strong> {formData.email}
                    </Text>
                    {formData.phone && (
                      <Text>
                        <strong>Phone:</strong> {formData.phone}
                      </Text>
                    )}
                    {formData.company && (
                      <Text>
                        <strong>Company:</strong> {formData.company}
                      </Text>
                    )}
                    {formData.jobTitle && (
                      <Text>
                        <strong>Job Title:</strong> {formData.jobTitle}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Box>

              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px 16px',
                  borderRadius: '4px',
                }}
              >
                <Stack gap="small">
                  <Text weight="bold">Event Details</Text>
                  <Stack gap="xs">
                    <Text>
                      <strong>Event Date:</strong> {formData.eventDate}
                    </Text>
                    {formData.preferredTime && (
                      <Text>
                        <strong>Time:</strong> {formData.preferredTime}
                      </Text>
                    )}
                    {formData.sessionTrack && (
                      <Text>
                        <strong>Track:</strong> {formData.sessionTrack}
                      </Text>
                    )}
                    {formData.dietaryRequirements.length > 0 && (
                      <Text>
                        <strong>Dietary:</strong>{' '}
                        {formData.dietaryRequirements.join(', ')}
                      </Text>
                    )}
                    <Text>
                      <strong>Guests:</strong> {formData.numberOfGuests}
                    </Text>
                    {formData.specialRequests && (
                      <Text>
                        <strong>Special Requests:</strong>{' '}
                        {formData.specialRequests}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Box>

              <Box
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px 16px',
                  borderRadius: '4px',
                }}
              >
                <Stack gap="small">
                  <Text weight="bold">Preferences</Text>
                  <Stack gap="xs">
                    {formData.tShirtSize && (
                      <Text>
                        <strong>T-Shirt Size:</strong> {formData.tShirtSize}
                      </Text>
                    )}
                    {formData.topicsOfInterest.length > 0 && (
                      <Text>
                        <strong>Topics:</strong>{' '}
                        {formData.topicsOfInterest.join(', ')}
                      </Text>
                    )}
                    {(formData.emailUpdates ||
                      formData.smsReminders ||
                      formData.postEventSurvey ||
                      formData.newsletterSubscription) && (
                      <Text>
                        <strong>Communications:</strong>{' '}
                        {[
                          formData.emailUpdates && 'Email',
                          formData.smsReminders && 'SMS',
                          formData.postEventSurvey && 'Survey',
                          formData.newsletterSubscription && 'Newsletter',
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </Text>
                    )}
                    {formData.accessibilityNeeds && (
                      <Text>
                        <strong>Accessibility:</strong>{' '}
                        {formData.accessibilityDetails}
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Box>

              {isLoading && (
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '20px',
                  }}
                >
                  <Loader />
                </Box>
              )}

              {!isLoading && (
                <Box>
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onChange={(checked) =>
                      handleInputChange('agreeToTerms', checked)
                    }
                  >
                    I agree to the terms and conditions
                  </Checkbox>
                  {errors.agreeToTerms && (
                    <Text color="error" size="small" style={{ marginTop: '4px' }}>
                      {errors.agreeToTerms}
                    </Text>
                  )}
                </Box>
              )}
            </Stack>
          )}

          {/* Navigation */}
          <Box
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              marginTop: '12px',
            }}
          >
            <Button
              onPress={handleBack}
              variant="secondary"
              disabled={step === 1 || isLoading}
            >
              Back
            </Button>
            <Button
              onPress={handleNext}
              variant="primary"
              disabled={isLoading}
            >
              {step === 4 ? 'Submit Registration' : 'Next'}
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default TestApp;
