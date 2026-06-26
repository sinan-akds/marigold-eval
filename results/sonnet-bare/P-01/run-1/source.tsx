import { useState } from 'react';
import {
  Stack,
  TextField,
  Select,
  TextArea,
  Button,
  Text,
  Headline,
} from '@marigold/components';

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.subject) {
    errors.subject = 'Please select a subject.';
  }
  return errors;
}

const TestApp = () => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const newErrors = validate(values);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Stack space={4}>
        <Headline level={2}>Message Sent!</Headline>
        <Text>Thank you for reaching out. We'll get back to you soon.</Text>
        <Button
          variant="primary"
          onPress={() => {
            setValues({ name: '', email: '', subject: '', message: '' });
            setSubmitted(false);
          }}
        >
          Send another message
        </Button>
      </Stack>
    );
  }

  return (
    <Stack space={4}>
      <Headline level={2}>Contact Us</Headline>

      <Stack space={2}>
        <TextField
          label="Name"
          value={values.name}
          onChange={(val) => {
            setValues((v) => ({ ...v, name: val }));
            if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
          }}
          required
          error={!!errors.name}
          description={errors.name}
        />

        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={(val) => {
            setValues((v) => ({ ...v, email: val }));
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
          }}
          required
          error={!!errors.email}
          description={errors.email}
        />

        <Select
          label="Subject"
          selectedKey={values.subject}
          onSelectionChange={(key) => {
            setValues((v) => ({ ...v, subject: String(key) }));
            if (errors.subject) setErrors((e) => ({ ...e, subject: undefined }));
          }}
          error={!!errors.subject}
          description={errors.subject}
        >
          <Select.Option key="General">General</Select.Option>
          <Select.Option key="Support">Support</Select.Option>
          <Select.Option key="Feedback">Feedback</Select.Option>
        </Select>

        <TextArea
          label="Message"
          value={values.message}
          onChange={(val) => setValues((v) => ({ ...v, message: val }))}
        />

        <Button variant="primary" onPress={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default TestApp;
