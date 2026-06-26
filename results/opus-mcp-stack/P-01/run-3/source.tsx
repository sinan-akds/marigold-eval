import type { FormEvent } from 'react';
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
  parseFormData,
} from '@marigold/components';

type ContactData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const TestApp = () => {
  const [submitted, setSubmitted] = useState<ContactData | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Prevent the native (page-reloading) submission. The Form only fires
    // onSubmit once all native constraints (required, type="email") pass.
    event.preventDefault();
    const data = parseFormData(event) as ContactData;
    setSubmitted(data);
  };

  return (
    <Stack space={6} alignX="left">
      <Headline level={1}>Contact us</Headline>

      {submitted ? (
        <SectionMessage variant="success">
          <SectionMessage.Title>Message sent</SectionMessage.Title>
          <SectionMessage.Content>
            Thanks {submitted.name}, we received your message and will reply to{' '}
            {submitted.email} soon.
          </SectionMessage.Content>
        </SectionMessage>
      ) : null}

      <Form onSubmit={handleSubmit}>
        <Stack space={4} alignX="left">
          <TextField
            label="Name"
            name="name"
            required
            width="full"
            errorMessage={({ validationDetails }) =>
              validationDetails.valueMissing
                ? 'Please enter your name.'
                : 'Please check your name.'
            }
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            required
            width="full"
            description="We'll only use this to reply to you."
            errorMessage={({ validationDetails }) =>
              validationDetails.valueMissing
                ? 'Please enter your email address.'
                : 'Please enter a valid email address.'
            }
          />

          <Select
            label="Subject"
            name="subject"
            defaultSelectedKey="general"
            width="full"
          >
            <Select.Option id="general">General</Select.Option>
            <Select.Option id="support">Support</Select.Option>
            <Select.Option id="feedback">Feedback</Select.Option>
          </Select>

          <TextArea label="Message" name="message" rows={6} width="full" />

          <Button type="submit" variant="primary">
            Send message
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
};

export default TestApp;
