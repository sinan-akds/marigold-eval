import { useState } from 'react';
import {
  Button,
  Headline,
  Select,
  Stack,
  Text,
  TextArea,
  TextField,
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
  const [subject, setSubject] = useState<string | null>(null);
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
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <Stack space={6} alignX="center">
      <Stack space={5} width="100%">
        <Headline level={2}>Contact us</Headline>
        <Text>
          Have a question or some feedback? Fill out the form below and we'll
          get back to you.
        </Text>

        <Stack space={4}>
            <TextField
              label="Name"
              isRequired
              value={name}
              onChange={setName}
              error={Boolean(errors.name)}
              errorMessage={errors.name}
            />

            <TextField
              label="Email"
              type="email"
              isRequired
              value={email}
              onChange={setEmail}
              error={Boolean(errors.email)}
              errorMessage={errors.email}
            />

            <Select
              label="Subject"
              isRequired
              placeholder="Select a subject"
              selectedKey={subject}
              onSelectionChange={key =>
                setSubject(key === null ? null : String(key))
              }
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

            <Button variant="primary" onPress={handleSubmit}>
              Send message
            </Button>

            {submitted ? (
              <Text color="green">
                Thank you! Your message has been sent successfully.
              </Text>
            ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TestApp;
