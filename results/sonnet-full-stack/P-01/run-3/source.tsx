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

interface FormErrors {
  name?: string;
  email?: string;
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
              name="name"
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
              name="email"
              type="email"
              value={email}
              onChange={val => {
                setEmail(val);
                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
              }}
              error={!!errors.email}
              errorMessage={errors.email}
            />
            <Select
              label="Subject"
              name="subject"
              selectedKey={subject}
              onSelectionChange={key => setSubject(key as string)}
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
              rows={5}
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
