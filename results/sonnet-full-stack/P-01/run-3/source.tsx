import { useState } from 'react';
import {
  Button,
  Form,
  Headline,
  Inset,
  SectionMessage,
  Select,
  Stack,
  TextArea,
  TextField,
} from '@marigold/components';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!EMAIL_RE.test(email)) {
      e.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Inset space={8}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Message sent!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you for reaching out. We will get back to you shortly.
          </SectionMessage.Content>
        </SectionMessage>
      </Inset>
    );
  }

  return (
    <Inset space={8}>
      <Stack space={6}>
        <Headline level={1}>Contact Us</Headline>
        <Form onSubmit={handleSubmit}>
          <Stack space={4}>
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
              error={!!errors.message}
              errorMessage={errors.message}
            />
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default ContactForm;
