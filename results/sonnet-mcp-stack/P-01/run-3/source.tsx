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

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!values.name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!values.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!EMAIL_RE.test(values.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!values.message.trim()) {
      newErrors.message = 'Message is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <Inset space={8}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Message sent!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you for reaching out. We'll get back to you as soon as
            possible.
          </SectionMessage.Content>
        </SectionMessage>
      </Inset>
    );
  }

  return (
    <Inset space={8}>
      <Form onSubmit={handleSubmit} noValidate>
        <Stack space={6}>
          <Headline level={2}>Contact Us</Headline>
          <TextField
            label="Name"
            name="name"
            value={values.name}
            onChange={val => {
              setValues(v => ({ ...v, name: val }));
              setErrors(e => ({ ...e, name: undefined }));
            }}
            error={!!errors.name}
            errorMessage={errors.name}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={val => {
              setValues(v => ({ ...v, email: val }));
              setErrors(e => ({ ...e, email: undefined }));
            }}
            error={!!errors.email}
            errorMessage={errors.email}
          />
          <Select
            label="Subject"
            name="subject"
            defaultSelectedKey="general"
            onChange={key => setValues(v => ({ ...v, subject: String(key) }))}
          >
            <Select.Option id="general">General</Select.Option>
            <Select.Option id="support">Support</Select.Option>
            <Select.Option id="feedback">Feedback</Select.Option>
          </Select>
          <TextArea
            label="Message"
            name="message"
            rows={5}
            value={values.message}
            onChange={val => {
              setValues(v => ({ ...v, message: val }));
              setErrors(e => ({ ...e, message: undefined }));
            }}
            error={!!errors.message}
            errorMessage={errors.message}
          />
          <Button variant="primary" type="submit">
            Send Message
          </Button>
        </Stack>
      </Form>
    </Inset>
  );
}
