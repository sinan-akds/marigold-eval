import { useState } from 'react';
import {
  Button,
  Form,
  Inset,
  Stack,
  TextField,
  TextArea,
  Select,
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
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitted(false);
      return;
    }

    setValidationErrors({});
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Inset space="square-regular">
      <Stack space={6} alignX="left">
        {submitted && (
          <SectionMessage variant="success">
            <SectionMessage.Title>
              Thank you for contacting us!
            </SectionMessage.Title>
            <SectionMessage.Content>
              Your message has been received. We'll get back to you shortly.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Form onSubmit={handleSubmit} validationErrors={validationErrors}>
          <Inset space="square-regular">
            <Stack space={4} alignX="left">
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={value => handleFieldChange('name', value)}
                required
                width="full"
                errorMessage={validationErrors.name}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={value => handleFieldChange('email', value)}
                required
                width="full"
                errorMessage={validationErrors.email}
              />

              <Select
                label="Subject"
                name="subject"
                selectedKey={formData.subject || null}
                onSelectionChange={key =>
                  handleFieldChange('subject', key as string)
                }
                required
                width="full"
                description={validationErrors.subject}
              >
                <Select.Option id="general">General</Select.Option>
                <Select.Option id="support">Support</Select.Option>
                <Select.Option id="feedback">Feedback</Select.Option>
              </Select>

              <TextArea
                label="Message"
                name="message"
                value={formData.message}
                onChange={value => handleFieldChange('message', value)}
                required
                width="full"
                rows={6}
                errorMessage={validationErrors.message}
              />

              <Button variant="primary" type="submit">
                Send Message
              </Button>
            </Stack>
          </Inset>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
