import { useState } from 'react';
import {
  Button,
  Form,
  Inset,
  Select,
  Stack,
  SectionMessage,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    const errors: Record<string, string> = {};

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const subject = (formData.get('subject') as string) || '';

    if (!name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!subject.trim()) {
      errors.subject = 'Please select a subject.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <Form
      validationErrors={validationErrors}
      onSubmit={handleSubmit}
      onInvalid={() => {
        setValidationErrors({});
      }}
    >
      <Inset space={8}>
        <Stack space={4} alignX="left">
          <Text weight="bold" fontSize="lg">
            Contact Us
          </Text>

          <TextField
            label="Name"
            name="name"
            type="text"
            required
            width={96}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            width={96}
            description="We'll use this to respond to your inquiry."
          />

          <Select
            label="Subject"
            name="subject"
            required
            width={96}
          >
            <Select.Option id="general">General</Select.Option>
            <Select.Option id="support">Support</Select.Option>
            <Select.Option id="feedback">Feedback</Select.Option>
          </Select>

          <TextArea
            label="Message"
            name="message"
            rows={6}
            width={96}
            description="Please provide any additional details about your inquiry."
          />

          <Button variant="primary" type="submit">
            Send Message
          </Button>

          {submitted && (
            <SectionMessage variant="success">
              <SectionMessage.Title>Message sent successfully!</SectionMessage.Title>
              <SectionMessage.Content>
                Thank you for contacting us. We'll get back to you soon.
              </SectionMessage.Content>
            </SectionMessage>
          )}
        </Stack>
      </Inset>
    </Form>
  );
};

export default TestApp;
