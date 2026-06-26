import { useState } from 'react';
import { TextField, Select, TextArea, Button, Stack, Inline, Text, Headline } from '@marigold/components';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TestApp = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!validateEmail(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setForm({ name: '', email: '', subject: 'General', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Stack space={4} alignX="left">
        <Headline level="2">Message Sent!</Headline>
        <Text>Thank you for reaching out. We'll get back to you soon.</Text>
        <Button variant="primary" onPress={handleReset}>
          Send another message
        </Button>
      </Stack>
    );
  }

  return (
    <Stack space={6} alignX="left">
      <Headline level="2">Contact Us</Headline>
      <Stack space={4}>
        <TextField
          label="Name"
          value={form.name}
          onChange={val => setForm(f => ({ ...f, name: val }))}
          required
          error={!!errors.name}
          errorMessage={errors.name}
        />
        <TextField
          label="Email"
          type="email"
          value={form.email}
          onChange={val => setForm(f => ({ ...f, email: val }))}
          required
          error={!!errors.email}
          errorMessage={errors.email}
        />
        <Select
          label="Subject"
          value={form.subject}
          onChange={val => setForm(f => ({ ...f, subject: val as string }))}
        >
          <Select.Option key="General">General</Select.Option>
          <Select.Option key="Support">Support</Select.Option>
          <Select.Option key="Feedback">Feedback</Select.Option>
        </Select>
        <TextArea
          label="Message"
          value={form.message}
          onChange={val => setForm(f => ({ ...f, message: val }))}
        />
        <Inline space={2}>
          <Button variant="primary" onPress={handleSubmit}>
            Submit
          </Button>
        </Inline>
      </Stack>
    </Stack>
  );
};

export default TestApp;
