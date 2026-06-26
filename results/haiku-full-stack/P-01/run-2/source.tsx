import { useState } from 'react';
import {
  Form,
  TextField,
  TextArea,
  Select,
  Button,
  Stack,
  Inset,
  Card,
  Headline,
  Text,
} from '@marigold/components';

const TestApp = () => {
  const [submittedData, setSubmittedData] = useState<Record<string, string> | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('general');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {
      name: (formData.get('name') as string) || '',
      email: (formData.get('email') as string) || '',
      subject: selectedSubject,
      message: (formData.get('message') as string) || '',
    };

    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!data.subject) {
      newErrors.subject = 'Please select a subject.';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setSubmittedData(null);
      return;
    }

    setValidationErrors({});
    setSubmittedData(data);
  };

  return (
    <main>
      <Inset space={8}>
        <Stack space={6} alignX="left">
          <Headline level={1}>Contact Form</Headline>

          <Form onSubmit={handleSubmit}>
            <Stack space={4} alignX="left">
              <Headline level={2}>Contact Us</Headline>

              <TextField
                label="Name"
                name="name"
                required
                width="full"
                {...(validationErrors.name && { error: true, errorMessage: validationErrors.name })}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                required
                width="full"
                {...(validationErrors.email && { error: true, errorMessage: validationErrors.email })}
              />

              <Select
                label="Subject"
                selectedKey={selectedSubject}
                onSelectionChange={(key) => setSelectedSubject(key as string)}
                {...(validationErrors.subject && { error: true, errorMessage: validationErrors.subject })}
              >
                <Select.Option id="general">General</Select.Option>
                <Select.Option id="support">Support</Select.Option>
                <Select.Option id="feedback">Feedback</Select.Option>
              </Select>

              <TextArea
                label="Message"
                name="message"
                rows={6}
                width="full"
              />

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Stack>
          </Form>

          {submittedData && (
            <Card>
              <Inset space={6}>
                <Stack space={3} alignX="left">
                  <Headline level={3}>Thank You!</Headline>
                  <Text>Your message has been sent successfully. We will get back to you soon.</Text>
                  <Text weight="bold">Submitted details:</Text>
                  <Stack space={2} alignX="left">
                    <Stack space={1} alignX="left">
                      <Text weight="bold">Name:</Text>
                      <Text>{submittedData.name}</Text>
                    </Stack>
                    <Stack space={1} alignX="left">
                      <Text weight="bold">Email:</Text>
                      <Text>{submittedData.email}</Text>
                    </Stack>
                    <Stack space={1} alignX="left">
                      <Text weight="bold">Subject:</Text>
                      <Text>{submittedData.subject}</Text>
                    </Stack>
                    {submittedData.message && (
                      <Stack space={1} alignX="left">
                        <Text weight="bold">Message:</Text>
                        <Text>{submittedData.message}</Text>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </Inset>
            </Card>
          )}
        </Stack>
      </Inset>
    </main>
  );
};

export default TestApp;
