import { useState } from 'react';
import type { Key } from 'react';
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

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const SUBJECTS = [
  { id: 'general', label: 'General' },
  { id: 'support', label: 'Support' },
  { id: 'feedback', label: 'Feedback' },
];

type Errors = {
  name?: string;
  email?: string;
};

const TestApp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<Key | null>(null);
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
    } else if (!EMAIL_PATTERN.test(email)) {
      next.email = 'Please enter a valid email address.';
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Inset space={8}>
        <Stack space={6}>
          <Headline level={1}>Contact us</Headline>

          {submitted && (
            <SectionMessage variant="success">
              <SectionMessage.Title>Message sent</SectionMessage.Title>
              <SectionMessage.Content>
                Thanks for reaching out! We've received your message and will get
                back to you soon.
              </SectionMessage.Content>
            </SectionMessage>
          )}

          <Stack space={4}>
            <TextField
              label="Name"
              name="name"
              value={name}
              onChange={value => {
                setName(value);
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: undefined }));
                }
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
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: undefined }));
                }
              }}
              required
              error={Boolean(errors.email)}
              errorMessage={errors.email}
              width="full"
            />

            <Select
              label="Subject"
              name="subject"
              placeholder="Select a subject"
              selectedKey={subject}
              onSelectionChange={key => setSubject(key)}
              width="full"
            >
              {SUBJECTS.map(item => (
                <Select.Option key={item.id} id={item.id}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>

            <TextArea
              label="Message"
              name="message"
              value={message}
              onChange={setMessage}
              rows={5}
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
