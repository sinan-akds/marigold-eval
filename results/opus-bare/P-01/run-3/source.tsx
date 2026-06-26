import { useState } from 'react';
import {
  Stack,
  Headline,
  Text,
  TextField,
  TextArea,
  Select,
  Button,
} from '@marigold/components';

type Errors = {
  name?: string;
  email?: string;
  subject?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};

    if (!name.trim()) {
      next.name = 'Please enter your name.';
    }

    if (!email.trim()) {
      next.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'Please enter a valid email address.';
    }

    if (!subject) {
      next.subject = 'Please choose a subject.';
    }

    return next;
  };

  const handleSubmit = () => {
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <Stack space={6} alignX="left">
      <Stack space={2}>
        <Headline level={1}>Contact us</Headline>
        <Text color="text-neutral-muted">
          Have a question or some feedback? Send us a message and we'll get back
          to you.
        </Text>
      </Stack>

      <Stack space={4}>
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          isRequired
          error={Boolean(errors.name)}
          errorMessage={errors.name}
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          isRequired
          error={Boolean(errors.email)}
          errorMessage={errors.email}
        />

        <Select
          label="Subject"
          placeholder="Select a subject"
          selectedKey={subject || null}
          onSelectionChange={key => setSubject(key ? String(key) : '')}
          isRequired
          error={Boolean(errors.subject)}
          errorMessage={errors.subject}
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
        />
      </Stack>

      <Button variant="primary" onPress={handleSubmit}>
        Send message
      </Button>

      {submitted && (
        <Text color="text-success" weight="bold">
          Thanks for reaching out! Your message has been sent.
        </Text>
      )}
    </Stack>
  );
};

export default TestApp;
