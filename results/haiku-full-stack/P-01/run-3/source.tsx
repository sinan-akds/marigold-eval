import { useState } from 'react';
import {
  Button,
  Form,
  Inset,
  Stack,
  TextField,
  TextArea,
  Select,
  SectionMessage,
  AppLayout,
  Headline,
  Text,
} from '@marigold/components';

const TestApp = () => {
  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Inset space={8}>
          <Stack space={6} alignX="left">
            <Stack space={2} alignX="left">
              <Headline level="1">Contact Us</Headline>
              <Text>
                We'd love to hear from you. Please fill out the form below.
              </Text>
            </Stack>

            {submitted && (
              <SectionMessage variant="success">
                <SectionMessage.Title>Thank You!</SectionMessage.Title>
                <SectionMessage.Content>
                  Your message has been sent successfully. We'll get back to you
                  as soon as possible.
                </SectionMessage.Content>
              </SectionMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <Stack space={2} alignX="left">
                <TextField
                  label="Name"
                  name="name"
                  value={formState.name}
                  onChange={value => {
                    setFormState(prev => ({ ...prev, name: value }));
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }
                  }}
                  required
                  error={!!errors.name}
                  errorMessage={errors.name}
                  width="full"
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={value => {
                    setFormState(prev => ({ ...prev, email: value }));
                    if (errors.email) {
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }
                  }}
                  required
                  error={!!errors.email}
                  errorMessage={errors.email}
                  width="full"
                />

                <Select
                  label="Subject"
                  name="subject"
                  selectedKey={formState.subject || null}
                  onSelectionChange={key => {
                    setFormState(prev => ({ ...prev, subject: key as string }));
                  }}
                  width="full"
                >
                  <Select.Option id="general">General</Select.Option>
                  <Select.Option id="support">Support</Select.Option>
                  <Select.Option id="feedback">Feedback</Select.Option>
                </Select>

                <TextArea
                  label="Message"
                  name="message"
                  value={formState.message}
                  onChange={value => {
                    setFormState(prev => ({ ...prev, message: value }));
                  }}
                  rows={6}
                  width="full"
                />

                <Button variant="primary" type="submit">
                  Send Message
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
