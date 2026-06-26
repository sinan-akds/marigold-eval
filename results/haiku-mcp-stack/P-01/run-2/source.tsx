import { useState } from 'react';
import {
  Button,
  Form,
  Inset,
  Select,
  SectionMessage,
  Stack,
  TextArea,
  TextField,
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
      errors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject) {
      errors.subject = 'Subject is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleFieldChange = (field: string, value: string) => {
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
    <Inset space={8}>
      <Stack space={6} alignX="left">
        {submitted && (
          <SectionMessage variant="success" closeButton>
            <SectionMessage.Title>Thank you!</SectionMessage.Title>
            <SectionMessage.Content>
              Your message has been received. We'll get back to you soon.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Form onSubmit={handleSubmit} validationErrors={validationErrors}>
          <Stack space={4} alignX="left">
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={val => handleFieldChange('name', val)}
              required
              width="full"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={val => handleFieldChange('email', val)}
              required
              width="full"
            />

            <Select
              label="Subject"
              name="subject"
              selectedKey={formData.subject}
              onSelectionChange={key =>
                handleFieldChange('subject', key as string)
              }
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
              onChange={val => handleFieldChange('message', val)}
              rows={6}
              width="full"
            />

            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
