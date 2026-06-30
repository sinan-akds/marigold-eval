import { useState } from 'react';
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

type Errors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = 'Please enter a valid email address, e.g. name@example.com.';
    }
    if (!subject) {
      next.subject = 'Please choose a subject.';
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Inset space={8}>
        <Stack space={6}>
          <Stack space={1}>
            <Headline level={1}>Contact us</Headline>
            <Text variant="muted">
              Fill out the form below and our team will get back to you.
            </Text>
          </Stack>
          {submitted ? (
            <SectionMessage variant="success">
              <SectionMessage.Title>Message sent</SectionMessage.Title>
              <SectionMessage.Content>
                Thanks for reaching out, {name}. We have received your message
                and will get back to you soon.
              </SectionMessage.Content>
            </SectionMessage>
          ) : null}
          <Stack space={4}>
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={setName}
              error={!!errors.name}
              errorMessage={errors.name}
              width="full"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              error={!!errors.email}
              errorMessage={errors.email}
              width="full"
            />
            <Select
              label="Subject"
              name="subject"
              selectedKey={subject}
              onSelectionChange={key => setSubject(key as string)}
              error={!!errors.subject}
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
          </Stack>
          <Button variant="primary" type="submit">
            Send message
          </Button>
        </Stack>
      </Inset>
    </Form>
  );
};

export default TestApp;
