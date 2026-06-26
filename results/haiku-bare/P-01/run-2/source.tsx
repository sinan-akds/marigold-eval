import { useState } from 'react';
import {
  Box,
  Button,
  Field,
  FieldGroup,
  Heading,
  Select,
  SelectOption,
  Stack,
  Text,
  Textarea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: '',
      email: '',
      subject: '',
      message: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please select a subject';
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.subject) {
      return;
    }

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Box p="large">
      <Stack space="large" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Heading level="1">Contact Us</Heading>

        {submitted && (
          <Box style={{ padding: '1rem', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            <Text style={{ color: '#155724' }}>
              Thank you! Your message has been sent successfully.
            </Text>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field
              label="Name"
              error={errors.name}
            >
              <TextField
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </Field>

            <Field
              label="Email"
              error={errors.email}
            >
              <TextField
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </Field>

            <Field
              label="Subject"
              error={errors.subject}
            >
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <SelectOption value="">Select a subject</SelectOption>
                <SelectOption value="general">General</SelectOption>
                <SelectOption value="support">Support</SelectOption>
                <SelectOption value="feedback">Feedback</SelectOption>
              </Select>
            </Field>

            <Field label="Message">
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message (optional)"
                rows={5}
              />
            </Field>

            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </FieldGroup>
        </form>
      </Stack>
    </Box>
  );
};

export default TestApp;
