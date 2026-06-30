import { useState } from 'react';
import {
  Button,
  Form,
  Headline,
  Inset,
  Select,
  Stack,
  Text,
  TextField,
  TextArea,
  SectionMessage,
} from '@marigold/components';

const TestApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject) {
      errors.subject = 'Please select a subject';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Inset space={8}>
        <Stack space={6}>
          <Headline level={1}>Contact Us</Headline>

          {submitted && (
            <SectionMessage variant="success">
              <SectionMessage.Title>Thank you!</SectionMessage.Title>
              <SectionMessage.Content>
                Your message has been sent successfully. We'll get back to you
                soon.
              </SectionMessage.Content>
            </SectionMessage>
          )}

          <Stack space={4}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={value => handleInputChange('name', value)}
              error={!!validationErrors.name}
              errorMessage={validationErrors.name}
              required
              width="full"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={value => handleInputChange('email', value)}
              error={!!validationErrors.email}
              errorMessage={validationErrors.email}
              required
              width="full"
            />

            <Select
              label="Subject"
              name="subject"
              selectedKey={formData.subject}
              onSelectionChange={key => handleInputChange('subject', key || '')}
              error={!!validationErrors.subject}
              errorMessage={validationErrors.subject}
              required
              width="full"
            >
              <Select.Option id="general">General</Select.Option>
              <Select.Option id="support">Support</Select.Option>
              <Select.Option id="feedback">Feedback</Select.Option>
            </Select>

            <TextArea
              label="Message"
              name="message"
              value={formData.message}
              onChange={value => handleInputChange('message', value)}
              rows={5}
              width="full"
            />
          </Stack>

          <Button variant="primary" type="submit">
            Send Message
          </Button>
        </Stack>
      </Inset>
    </Form>
  );
};

export default TestApp;
