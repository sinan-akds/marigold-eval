import { useState } from 'react';
import {
  Button,
  Form,
  Inset,
  Select,
  Stack,
  TextField,
  TextArea,
  SectionMessage,
} from '@marigold/components';

const TestApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return (
    <Inset space={8}>
      <Stack space={6}>
        {submitted && (
          <SectionMessage variant="success">
            <SectionMessage.Title>Success!</SectionMessage.Title>
            <SectionMessage.Content>
              Your message has been sent successfully. We'll get back to you soon.
            </SectionMessage.Content>
          </SectionMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <Stack space={4}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={e => handleChange('name', e)}
              required
              error={!!errors.name}
              errorMessage={errors.name}
              description="Enter your full name."
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e)}
              required
              error={!!errors.email}
              errorMessage={errors.email}
              description="Enter a valid email address."
            />

            <Select
              label="Subject"
              name="subject"
              selectedKey={formData.subject}
              onSelectionChange={value => handleChange('subject', value as string)}
              required
              error={!!errors.subject}
              errorMessage={errors.subject}
              description="Choose the reason for your message."
            >
              <Select.Option id="general" key="general">
                General
              </Select.Option>
              <Select.Option id="support" key="support">
                Support
              </Select.Option>
              <Select.Option id="feedback" key="feedback">
                Feedback
              </Select.Option>
            </Select>

            <TextArea
              label="Message"
              name="message"
              value={formData.message}
              onChange={e => handleChange('message', e)}
              rows={5}
              description="Tell us more about your inquiry."
            />

            <Stack alignX="right">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Stack>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
