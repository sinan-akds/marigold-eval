'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  ComboBox,
  DateField,
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
  useToast,
  Accordion,
  ToastProvider,
} from '@marigold/components';
import { parseDate, parseTime, today } from '@internationalized/date';
import { Key } from '@react-types/shared';

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  profilePhoto: FileList | null;
  eventDate: string;
  preferredTime: string;
  sessionTrack: string;
  dietaryRequirements: string;
  numberOfGuests: number;
  specialRequests: string;
  tshirtSize: string;
  topics: Key[];
  communicationPreferences: string[];
  accessibilityNeeds: boolean;
  accessibilityDetails: string;
  agreeToTerms: boolean;
}

type Step = 1 | 2 | 3 | 4;

const initialData: RegistrationData = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  profilePhoto: null,
  eventDate: '',
  preferredTime: '',
  sessionTrack: '',
  dietaryRequirements: '',
  numberOfGuests: 0,
  specialRequests: '',
  tshirtSize: '',
  topics: [],
  communicationPreferences: [],
  accessibilityNeeds: false,
  accessibilityDetails: '',
  agreeToTerms: false,
};

const jobTitleSuggestions = [
  'Developer',
  'Designer',
  'Product Manager',
  'Engineering Manager',
  'CTO',
  'Other',
];

const dietarySuggestions = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Kosher',
  'Halal',
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
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [data, setData] = useState<RegistrationData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const { addToast } = useToast();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateData = (field: keyof RegistrationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setValidationErrors([]);
  };

  const validateStep = (step: Step): boolean => {
    const errors: string[] = [];

    if (step === 1) {
      if (!data.fullName.trim()) errors.push('Full Name is required');
      if (!data.email.trim()) errors.push('Email is required');
      if (data.email.trim() && !data.email.includes('@')) {
        errors.push('Email must be valid');
      }
    } else if (step === 2) {
      if (!data.eventDate) errors.push('Event Date is required');
      if (!data.sessionTrack) errors.push('Session Track is required');
      if (!data.dietaryRequirements) errors.push('Dietary Requirements is required');
    } else if (step === 3) {
      if (!data.tshirtSize) errors.push('T-Shirt Size is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((currentStep + 1) as Step);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    if (!data.agreeToTerms) {
      setValidationErrors(['You must agree to the terms and conditions']);
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);

    const confNum = `CONF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setConfirmationNumber(confNum);
    setSubmitted(true);

    addToast({
      title: 'Registration submitted successfully',
      variant: 'success',
      timeout: 5000,
    });
  };

  const handleRegisterAnother = () => {
    setCurrentStep(1);
    setData(initialData);
    setSubmitted(false);
    setValidationErrors([]);
  };

  if (submitted) {
    return (
      <>
        <ToastProvider position="bottom-right" />
        <Inset space={8}>
          <Card>
            <Inset space={8}>
              {loading && <Loader />}
              {!loading && (
                <Stack space={6} alignX="center">
                    <SectionMessage variant="success">
                        <SectionMessage.Title>
                          Registration confirmed!
                        </SectionMessage.Title>
                        <SectionMessage.Content>
                          Thank you for registering for our event.
                        </SectionMessage.Content>
                      </SectionMessage>

                      <Card>
                        <Inset space={6}>
                          <Stack space={4} alignX="left">
                            <Text weight="bold">Confirmation Summary</Text>
                            <Stack space={2} alignX="left">
                              <Text>
                                <Text weight="bold" as="span">Name:</Text> {data.fullName}
                              </Text>
                              <Text>
                                <Text weight="bold" as="span">Email:</Text> {data.email}
                              </Text>
                              <Text>
                                <Text weight="bold" as="span">Event Date:</Text> {data.eventDate}
                              </Text>
                              <Text>
                                <Text weight="bold" as="span">Confirmation #:</Text> {confirmationNumber}
                              </Text>
                            </Stack>
                          </Stack>
                        </Inset>
                      </Card>

                      <Button
                        variant="primary"
                        onPress={handleRegisterAnother}
                      >
                        Register Another
                      </Button>
                </Stack>
              )}
            </Inset>
          </Card>
        </Inset>
      </>
    );
  }

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Inset space={8}>
        <Card>
          <Inset space={8}>
            <Stack space={6}>
                <Text weight="bold" fontSize="sm">
                  Step {currentStep} of 4
                </Text>
                <Headline level={2}>
                  {currentStep === 1 && 'Personal Information'}
                  {currentStep === 2 && 'Event Details'}
                  {currentStep === 3 && 'Preferences'}
                  {currentStep === 4 && 'Review & Confirm'}
                </Headline>

                <Form>
                  <Stack space={6}>
                    {validationErrors.length > 0 && (
                      <SectionMessage variant="error">
                        <SectionMessage.Title>
                          Please fix the following errors:
                        </SectionMessage.Title>
                        <SectionMessage.Content>
                          <Stack space={1} alignX="left">
                            {validationErrors.map((error, idx) => (
                              <Text key={idx}>{error}</Text>
                            ))}
                          </Stack>
                        </SectionMessage.Content>
                      </SectionMessage>
                    )}

                    {currentStep === 1 && (
                      <Stack space={4}>
                        <TextField
                          label="Full Name"
                          name="fullName"
                          type="text"
                          required
                          value={data.fullName}
                          onChange={value =>
                            updateData('fullName', value)
                          }
                          width="full"
                        />
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          required
                          value={data.email}
                          onChange={value => updateData('email', value)}
                          width="full"
                        />
                        <TextField
                          label="Phone Number"
                          name="phone"
                          type="tel"
                          value={data.phone}
                          onChange={value => updateData('phone', value)}
                          width="full"
                        />
                        <TextField
                          label="Company / Organization"
                          name="company"
                          type="text"
                          value={data.company}
                          onChange={value =>
                            updateData('company', value)
                          }
                          width="full"
                        />
                        <ComboBox
                          label="Job Title"
                          menuTrigger="focus"
                          value={data.jobTitle}
                          onChange={value =>
                            updateData('jobTitle', value)
                          }
                          width="full"
                        >
                          {jobTitleSuggestions.map(title => (
                            <ComboBox.Option key={title} id={title}>
                              {title}
                            </ComboBox.Option>
                          ))}
                        </ComboBox>
                        <FileField
                          label="Profile Photo"
                          accept={['image/*']}
                          name="profilePhoto"
                        />

                        <SectionMessage variant="info">
                          <SectionMessage.Content>
                            Your information will only be used for this event.
                          </SectionMessage.Content>
                        </SectionMessage>
                      </Stack>
                    )}

                    {currentStep === 2 && (
                      <Stack space={4}>
                        <DateField
                          label="Event Date"
                          value={
                            data.eventDate
                              ? parseDate(data.eventDate)
                              : undefined
                          }
                          onChange={date => {
                            if (date) {
                              updateData(
                                'eventDate',
                                `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
                              );
                            }
                          }}
                          required
                          width="full"
                        />
                        <TimeField
                          label="Preferred Time Slot"
                          value={
                            data.preferredTime
                              ? parseTime(data.preferredTime)
                              : undefined
                          }
                          onChange={time => {
                            if (time) {
                              updateData(
                                'preferredTime',
                                `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
                              );
                            }
                          }}
                          width="full"
                        />
                        <Radio.Group
                          label="Session Track"
                          value={data.sessionTrack}
                          onChange={value =>
                            updateData('sessionTrack', value)
                          }
                          required
                        >
                          <Radio value="technical">Technical</Radio>
                          <Radio value="design">Design</Radio>
                          <Radio value="business">Business</Radio>
                          <Radio value="workshop">Workshop</Radio>
                        </Radio.Group>

                        <ComboBox
                          label="Dietary Requirements"
                          menuTrigger="focus"
                          value={data.dietaryRequirements}
                          onChange={value =>
                            updateData('dietaryRequirements', value)
                          }
                          width="full"
                          required
                        >
                          {dietarySuggestions.map(dietary => (
                            <ComboBox.Option key={dietary} id={dietary}>
                              {dietary}
                            </ComboBox.Option>
                          ))}
                        </ComboBox>

                        <NumberField
                          label="Number of Guests"
                          minValue={0}
                          maxValue={5}
                          value={data.numberOfGuests}
                          onChange={value =>
                            updateData('numberOfGuests', value)
                          }
                          width="full"
                        />
                        <TextArea
                          label="Special Requests"
                          name="specialRequests"
                          value={data.specialRequests}
                          onChange={value =>
                            updateData('specialRequests', value)
                          }
                          rows={4}
                          width="full"
                        />
                      </Stack>
                    )}

                    {currentStep === 3 && (
                      <Stack space={4}>
                        <Select
                          label="T-Shirt Size"
                          selectedKey={data.tshirtSize}
                          onSelectionChange={value =>
                            updateData('tshirtSize', String(value))
                          }
                          width="full"
                          required
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
                          value={data.topics}
                          onChange={keys => updateData('topics', keys)}
                          width="full"
                        >
                          {topicSuggestions.map(topic => (
                            <TagField.Option key={topic} id={topic}>
                              {topic}
                            </TagField.Option>
                          ))}
                        </TagField>

                        <Checkbox.Group
                          label="Communication Preferences"
                          value={data.communicationPreferences}
                          onChange={values =>
                            updateData('communicationPreferences', values)
                          }
                        >
                          <Checkbox
                            value="email"
                            label="Email updates about the event"
                          />
                          <Checkbox value="sms" label="SMS reminders" />
                          <Checkbox value="survey" label="Post-event survey" />
                          <Checkbox
                            value="newsletter"
                            label="Newsletter subscription"
                          />
                        </Checkbox.Group>

                        <Stack space={2}>
                          <Switch
                            label="I have accessibility requirements"
                            selected={data.accessibilityNeeds}
                            onChange={value =>
                              updateData('accessibilityNeeds', value)
                            }
                          />
                          {data.accessibilityNeeds && (
                            <TextArea
                              label="Accessibility Details"
                              name="accessibilityDetails"
                              value={data.accessibilityDetails}
                              onChange={value =>
                                updateData(
                                  'accessibilityDetails',
                                  value
                                )
                              }
                              rows={3}
                              width="full"
                            />
                          )}
                        </Stack>
                      </Stack>
                    )}

                    {currentStep === 4 && (
                      <Stack space={4}>
                        <Accordion>
                          <Accordion.Item>
                            <Accordion.Header>
                              Personal Information
                            </Accordion.Header>
                            <Accordion.Content>
                              <Stack space={2} alignX="left">
                                <Text>
                                  <Text weight="bold" as="span">Name:</Text> {data.fullName}
                                </Text>
                                <Text>
                                  <Text weight="bold" as="span">Email:</Text> {data.email}
                                </Text>
                                {data.phone && (
                                  <Text>
                                    <Text weight="bold" as="span">Phone:</Text> {data.phone}
                                  </Text>
                                )}
                                {data.company && (
                                  <Text>
                                    <Text weight="bold" as="span">Company:</Text> {data.company}
                                  </Text>
                                )}
                                {data.jobTitle && (
                                  <Text>
                                    <Text weight="bold" as="span">Job Title:</Text> {data.jobTitle}
                                  </Text>
                                )}
                              </Stack>
                            </Accordion.Content>
                          </Accordion.Item>

                          <Accordion.Item>
                            <Accordion.Header>Event Details</Accordion.Header>
                            <Accordion.Content>
                              <Stack space={2} alignX="left">
                                <Text>
                                  <Text weight="bold" as="span">Date:</Text> {data.eventDate}
                                </Text>
                                {data.preferredTime && (
                                  <Text>
                                    <Text weight="bold" as="span">Time:</Text> {data.preferredTime}
                                  </Text>
                                )}
                                <Text>
                                  <Text weight="bold" as="span">Track:</Text> {data.sessionTrack}
                                </Text>
                                <Text>
                                  <Text weight="bold" as="span">Dietary:</Text> {data.dietaryRequirements}
                                </Text>
                                <Text>
                                  <Text weight="bold" as="span">Guests:</Text> {data.numberOfGuests}
                                </Text>
                              </Stack>
                            </Accordion.Content>
                          </Accordion.Item>

                          <Accordion.Item>
                            <Accordion.Header>Preferences</Accordion.Header>
                            <Accordion.Content>
                              <Stack space={2} alignX="left">
                                <Text>
                                  <Text weight="bold" as="span">T-Shirt Size:</Text> {data.tshirtSize.toUpperCase()}
                                </Text>
                                {data.topics.length > 0 && (
                                  <Text>
                                    <Text weight="bold" as="span">Topics:</Text> {Array.from(data.topics).join(', ')}
                                  </Text>
                                )}
                                {data.communicationPreferences.length > 0 && (
                                  <Text>
                                    <Text weight="bold" as="span">Communication:</Text> {data.communicationPreferences.join(', ')}
                                  </Text>
                                )}
                              </Stack>
                            </Accordion.Content>
                          </Accordion.Item>
                        </Accordion>

                        <Checkbox
                          value="terms"
                          label="I agree to the terms and conditions"
                          checked={data.agreeToTerms}
                          onChange={value =>
                            updateData('agreeToTerms', value)
                          }
                        />
                      </Stack>
                    )}

                    <Inline space={4} alignX="left">
                      <Button
                        variant="secondary"
                        onPress={handleBack}
                        disabled={currentStep === 1}
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
                          onPress={handleSubmit}
                          loading={loading}
                          disabled={!data.agreeToTerms || loading}
                        >
                          Submit Registration
                        </Button>
                      )}
                    </Inline>
                  </Stack>
                </Form>
              </Stack>
            </Inset>
          </Card>
      </Inset>
    </>
  );
};

export default TestApp;
