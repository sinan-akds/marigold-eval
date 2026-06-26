import { useState } from 'react';
import {
  Stack,
  TextField,
  Select,
  Textarea,
  Button,
  Box,
  Text,
} from '@marigold/components';

const TestApp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
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

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      // Reset form after showing success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <Box
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '$4',
        }}
      >
        <Stack space="$4" css={{ maxWidth: '400px', textAlign: 'center' }}>
          <Text variant="headlineXL" css={{ color: '$success' }}>
            ✓ Thank you!
          </Text>
          <Text>
            Your message has been sent successfully. We'll get back to you soon.
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '$4',
        backgroundColor: '$background',
      }}
    >
      <Stack
        space="$4"
        css={{
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <Text variant="headlineL">Contact Us</Text>

        <Stack space="$2">
          <Text variant="label">Name</Text>
          <TextField
            placeholder="Your name"
            value={formData.name}
            onChange={e => handleChange('name', e.currentTarget.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <Text id="name-error" css={{ color: '$danger', fontSize: '$sm' }}>
              {errors.name}
            </Text>
          )}
        </Stack>

        <Stack space="$2">
          <Text variant="label">Email</Text>
          <TextField
            placeholder="your.email@example.com"
            type="email"
            value={formData.email}
            onChange={e => handleChange('email', e.currentTarget.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <Text id="email-error" css={{ color: '$danger', fontSize: '$sm' }}>
              {errors.email}
            </Text>
          )}
        </Stack>

        <Stack space="$2">
          <Text variant="label">Subject</Text>
          <Select
            value={formData.subject}
            onChange={e => handleChange('subject', e.currentTarget.value)}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
          >
            <option value="">— Select a subject —</option>
            <option value="General">General</option>
            <option value="Support">Support</option>
            <option value="Feedback">Feedback</option>
          </Select>
          {errors.subject && (
            <Text
              id="subject-error"
              css={{ color: '$danger', fontSize: '$sm' }}
            >
              {errors.subject}
            </Text>
          )}
        </Stack>

        <Stack space="$2">
          <Text variant="label">Message</Text>
          <Textarea
            placeholder="Your message here..."
            value={formData.message}
            onChange={e => handleChange('message', e.currentTarget.value)}
            css={{ minHeight: '120px' }}
          />
        </Stack>

        <Button onPress={handleSubmit} css={{ marginTop: '$2' }}>
          Send Message
        </Button>
      </Stack>
    </Box>
  );
};

export default TestApp;
