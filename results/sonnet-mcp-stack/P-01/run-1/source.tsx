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

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = () => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!values.name.trim()) {
      errs.name = 'Name is required.';
    }
    if (!values.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!EMAIL_RE.test(values.email)) {
      errs.email = 'Enter a valid email address (e.g. you@example.com).';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setValues({ name: '', email: '', subject: 'general', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Stack space={4}>
        <SectionMessage variant="success">
          <SectionMessage.Title>Message sent successfully!</SectionMessage.Title>
          <SectionMessage.Content>
            Thank you for reaching out. We'll get back to you as soon as possible.
          </SectionMessage.Content>
        </SectionMessage>
        <Button variant="secondary" onPress={handleReset}>
          Send another message
        </Button>
      </Stack>
    );
  }

  return (
    <Stack space={6}>
      <Headline level="2">Contact Us</Headline>
      <Form onSubmit={handleSubmit}>
        <Stack space={4}>
          <TextField
            label="Name"
            name="name"
            value={values.name}
            onChange={val => {
              setValues(v => ({ ...v, name: val }));
              if (errors.name) setErrors(e => ({ ...e, name: undefined }));
            }}
            error={!!errors.name}
            errorMessage={errors.name}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={val => {
              setValues(v => ({ ...v, email: val }));
              if (errors.email) setErrors(e => ({ ...e, email: undefined }));
            }}
            error={!!errors.email}
            errorMessage={errors.email}
            required
          />
          <Select
            label="Subject"
            name="subject"
            selectedKey={values.subject}
            onSelectionChange={key =>
              setValues(v => ({ ...v, subject: String(key) }))
            }
          >
            <Select.Option id="general">General</Select.Option>
            <Select.Option id="support">Support</Select.Option>
            <Select.Option id="feedback">Feedback</Select.Option>
          </Select>
          <TextArea
            label="Message"
            name="message"
            value={values.message}
            onChange={val => setValues(v => ({ ...v, message: val }))}
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
