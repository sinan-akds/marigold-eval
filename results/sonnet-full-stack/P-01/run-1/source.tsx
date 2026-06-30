import { useState } from 'react';
import {
  Button,
  Form,
  Headline,
  SectionMessage,
  Select,
  Stack,
  TextArea,
  TextField,
} from '@marigold/components';

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const TestApp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) errs.message = 'Message is required.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('general');
    setMessage('');
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Stack space={4}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Message sent!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you for reaching out. We will get back to you shortly.
          </SectionMessage.Content>
        </SectionMessage>
        <Button variant="secondary" onPress={handleReset}>
          Send another message
        </Button>
      </Stack>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack space={4}>
        <Headline level="1">Contact Us</Headline>
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          required
          error={!!errors.name}
          errorMessage={errors.name}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          error={!!errors.email}
          errorMessage={errors.email}
        />
        <Select
          label="Subject"
          selectedKey={subject}
          onSelectionChange={key => setSubject(String(key))}
        >
          <Select.Option id="general">General</Select.Option>
          <Select.Option id="support">Support</Select.Option>
          <Select.Option id="feedback">Feedback</Select.Option>
        </Select>
        <TextArea
          label="Message"
          value={message}
          onChange={setMessage}
          rows={5}
          error={!!errors.message}
          errorMessage={errors.message}
        />
        <Button variant="primary" type="submit">
          Send Message
        </Button>
      </Stack>
    </Form>
  );
};

export default TestApp;
