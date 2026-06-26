import { useState } from 'react';
import {
  TextField,
  TextArea,
  Select,
  Button,
  Stack,
  Heading,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setErrors({});

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Heading level={1} style={{ marginBottom: '1rem' }}>
        Contact Us
      </Heading>

      {submitted && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            backgroundColor: '#e6f7e6',
            border: '1px solid #4caf50',
            borderRadius: '4px',
            color: '#2e7d32',
          }}
        >
          <Text>Thank you! Your message has been sent successfully.</Text>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md" direction="column">
          <div>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
            {errors.name && (
              <Text
                style={{
                  color: '#d32f2f',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.name}
              </Text>
            )}
          </div>

          <div>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && (
              <Text
                style={{
                  color: '#d32f2f',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.email}
              </Text>
            )}
          </div>

          <div>
            <Select
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">-- Please select --</option>
              <option value="General">General</option>
              <option value="Support">Support</option>
              <option value="Feedback">Feedback</option>
            </Select>
            {errors.subject && (
              <Text
                style={{
                  color: '#d32f2f',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                }}
              >
                {errors.subject}
              </Text>
            )}
          </div>

          <div>
            <TextArea
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
            />
          </div>

          <Button type="submit" variant="primary">
            Send Message
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default TestApp;
