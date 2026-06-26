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

type Errors = {
  name?: string;
  email?: string;
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!name.trim()) errs.name = 'Name is required.';
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Stack space={6}>
        <Headline level={2}>Contact Us</Headline>
        <SectionMessage variant="success">
          <SectionMessage.Title>Message sent successfully!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you for contacting us. We'll get back to you as soon as
            possible.
          </SectionMessage.Content>
        </SectionMessage>
      </Stack>
    );
  }

  return (
    <Stack space={6}>
      <Headline level={2}>Contact Us</Headline>
      <Form onSubmit={handleSubmit}>
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
            value={email}
            onChange={setEmail}
            error={!!errors.email}
            errorMessage={errors.email}
          />
          <Select
            label="Subject"
            placeholder="Choose a subject"
            selectedKey={subject || null}
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
    </Stack>
  );
};

export default ContactForm;
