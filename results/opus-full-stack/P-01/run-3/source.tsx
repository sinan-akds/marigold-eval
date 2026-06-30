import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Button,
  Form,
  Headline,
  Inset,
  SectionMessage,
  Select,
  Stack,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!name.trim()) {
      next.name = 'Please enter your name.';
    }

    if (!email.trim()) {
      next.email = 'Please enter your email address.';
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Enter a valid email address, e.g. name@example.com.';
    }

    if (!subject) {
      next.subject = 'Please choose a subject.';
    }

    return next;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setSubmitted(Object.keys(next).length === 0);
  };

  return (
    <Inset space={8}>
      <Stack space={6}>
        <Stack space={2}>
          <Headline level={1}>Contact us</Headline>
          <Text color="text-secondary">
            Send us a message and we'll get back to you as soon as possible.
          </Text>
        </Stack>

        {submitted ? (
          <SectionMessage variant="info">
            <SectionMessage.Title>Message sent</SectionMessage.Title>
            <SectionMessage.Content>
              Thanks for reaching out, {name}. We've received your message and
              will reply to {email} shortly.
            </SectionMessage.Content>
          </SectionMessage>
        ) : null}

        <Form onSubmit={handleSubmit} validationBehavior="aria">
          <Stack space={4} alignX="left">
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={value => {
                setName(value);
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              required
              error={Boolean(errors.name)}
              errorMessage={errors.name}
              width="full"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={value => {
                setEmail(value);
                setErrors(prev => ({ ...prev, email: undefined }));
              }}
              required
              error={Boolean(errors.email)}
              errorMessage={errors.email}
              width="full"
            />

            <Select
              label="Subject"
              name="subject"
              placeholder="Choose a subject"
              selectedKey={subject}
              onSelectionChange={key => {
                setSubject(key as string);
                setErrors(prev => ({ ...prev, subject: undefined }));
              }}
              required
              error={Boolean(errors.subject)}
              errorMessage={errors.subject}
              width="full"
            >
              <Select.Option id="general">General</Select.Option>
              <Select.Option id="support">Support</Select.Option>
              <Select.Option id="feedback">Feedback</Select.Option>
            </Select>

            <TextArea
              label="Message"
              name="message"
              value={message}
              onChange={setMessage}
              rows={6}
              width="full"
            />

            <Button variant="primary" type="submit">
              Send message
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
