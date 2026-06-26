import { useState } from 'react';
import { TextField, Select, TextArea, Button, Stack, Inline, Text } from '@marigold/components';

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
}

const SUBJECTS = ['General', 'Support', 'Feedback'];

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!values.name.trim()) errs.name = 'Name is required.';
    if (!values.email.trim()) {
      errs.email = 'Email is required.';
    } else if (!validateEmail(values.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!values.subject) errs.subject = 'Please select a subject.';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Stack space={4}>
        <Text>Thank you! Your message has been sent successfully.</Text>
        <Button
          variant="primary"
          onPress={() => {
            setSubmitted(false);
            setValues({ name: '', email: '', subject: '', message: '' });
          }}
        >
          Send another message
        </Button>
      </Stack>
    );
  }

  return (
    <Stack space={4}>
      <TextField
        label="Name"
        value={values.name}
        onChange={(val) => setValues((v) => ({ ...v, name: val }))}
        error={!!errors.name}
        errorMessage={errors.name}
        isRequired
      />
      <TextField
        label="Email"
        type="email"
        value={values.email}
        onChange={(val) => setValues((v) => ({ ...v, email: val }))}
        error={!!errors.email}
        errorMessage={errors.email}
        isRequired
      />
      <Select
        label="Subject"
        selectedKey={values.subject}
        onSelectionChange={(key) => setValues((v) => ({ ...v, subject: String(key) }))}
        error={!!errors.subject}
        errorMessage={errors.subject}
        isRequired
      >
        {SUBJECTS.map((s) => (
          <Select.Option key={s} id={s}>
            {s}
          </Select.Option>
        ))}
      </Select>
      <TextArea
        label="Message"
        value={values.message}
        onChange={(val) => setValues((v) => ({ ...v, message: val }))}
      />
      <Inline>
        <Button variant="primary" onPress={handleSubmit}>
          Submit
        </Button>
      </Inline>
    </Stack>
  );
};

export default TestApp;
