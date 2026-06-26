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

interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const TestApp = () => {
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent the native (page-reloading) form submission. This handler only
    // fires once all built-in field validations pass.
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget)
    ) as unknown as ContactSubmission;

    setSubmission(data);
    event.currentTarget.reset();
  };

  return (
    <Inset space={8}>
      <Stack space={6}>
        <Headline level={1}>Contact us</Headline>

        {submission ? (
          <SectionMessage variant="success">
            <SectionMessage.Title>Message sent</SectionMessage.Title>
            <SectionMessage.Content>
              Thanks, {submission.name}! We received your message and will reply
              to {submission.email} soon.
            </SectionMessage.Content>
          </SectionMessage>
        ) : null}

        <Form onSubmit={handleSubmit} onChange={() => setSubmission(null)}>
          <Stack space={4} alignX="left">
            <TextField
              label="Name"
              name="name"
              required
              width="full"
              errorMessage="Please enter your name."
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              width="full"
              errorMessage="Please enter a valid email address."
            />
            <Select
              label="Subject"
              name="subject"
              required
              placeholder="Choose a topic"
              width="full"
              errorMessage="Please choose a subject."
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
              Send message
            </Button>
          </Stack>
        </Form>
      </Stack>
    </Inset>
  );
};

export default TestApp;
