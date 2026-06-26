import { useState } from 'react';
import {
  Button,
  Form,
  Select,
  SectionMessage,
  Stack,
  TextArea,
  TextField,
} from '@marigold/components';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Errors {
  name?: string;
  email?: string;
}

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    return newErrors;
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
      <SectionMessage variant="success">
        <SectionMessage.Title>Message sent!</SectionMessage.Title>
        <SectionMessage.Content>
          Thank you for reaching out. We'll get back to you as soon as possible.
        </SectionMessage.Content>
      </SectionMessage>
    );
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Stack space={4}>
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          error={!!errors.name}
          errorMessage={errors.name}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
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
        />
        <Button variant="primary" type="submit">
          Send Message
        </Button>
      </Stack>
    </Form>
  );
};

export default ContactForm;
