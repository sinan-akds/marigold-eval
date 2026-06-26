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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <SectionMessage variant="success">
        <SectionMessage.Title>Message sent!</SectionMessage.Title>
        <SectionMessage.Content>
          Thank you for reaching out. We&apos;ll get back to you as soon as
          possible.
        </SectionMessage.Content>
      </SectionMessage>
    );
  }

  return (
    <Stack space={6}>
      <Headline level="1">Contact Us</Headline>
      <Form onSubmit={handleSubmit}>
        <Stack space={4}>
          <TextField
            label="Name"
            value={name}
            onChange={val => {
              setName(val);
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
            error={!!errors.name}
            errorMessage={errors.name}
          />
          <TextField
            label="Email"
            value={email}
            onChange={val => {
              setEmail(val);
              if (errors.email)
                setErrors(prev => ({ ...prev, email: undefined }));
            }}
            error={!!errors.email}
            errorMessage={errors.email}
          />
          <Select
            label="Subject"
            placeholder="Select a subject"
            selectedKey={subject || null}
            onSelectionChange={key => setSubject(key as string)}
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
          <Button variant="primary" type="submit">
            Send Message
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
};

export default TestApp;
