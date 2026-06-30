import { useState } from 'react';
import {
  Form,
  TextField,
  Select,
  TextArea,
  Button,
  Stack,
  Inset,
  SectionMessage,
  Headline,
  Text,
  AppLayout,
} from '@marigold/components';

const TestApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: 'General',
      message: '',
    });
  };

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Inset space={8}>
          <Stack space={6}>
            <Stack space={2}>
              <Headline>Contact Us</Headline>
              <Text>We'd love to hear from you. Send us a message!</Text>
            </Stack>

            {submitted && (
              <SectionMessage variant="success">
                Thank you for your message! We'll get back to you soon.
              </SectionMessage>
            )}

            <Form>
              <Stack space={4}>
                <TextField
                  label="Name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(value) => handleFieldChange('name', value)}
                  error={!!errors.name}
                  errorMessage={errors.name}
                  type="text"
                />

                <TextField
                  label="Email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(value) => handleFieldChange('email', value)}
                  error={!!errors.email}
                  errorMessage={errors.email}
                  type="email"
                />

                <Select
                  label="Subject"
                  name="subject"
                  selectedKey={formData.subject}
                  onChange={(value) =>
                    handleFieldChange('subject', String(value))
                  }
                >
                  <Select.Option key="general">General</Select.Option>
                  <Select.Option key="support">Support</Select.Option>
                  <Select.Option key="feedback">Feedback</Select.Option>
                </Select>

                <TextArea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={(value) => handleFieldChange('message', value)}
                  rows={6}
                />

                <Button onPress={handleSubmit}>
                  Send Message
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
