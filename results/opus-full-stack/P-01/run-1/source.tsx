import { useState } from 'react';
import {
  Button,
  Form,
  Headline,
  Inset,
  SectionMessage,
  Select,
  Stack,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Inset space={8}>
      <Stack space={6}>
        <Stack space={1}>
          <Headline level={1}>Contact us</Headline>
          <Text variant="muted">
            Have a question or some feedback? Fill out the form and we'll be in
            touch.
          </Text>
        </Stack>
        {submitted ? (
          <SectionMessage variant="success">
            <SectionMessage.Title>Message sent</SectionMessage.Title>
            <SectionMessage.Content>
              Thanks for reaching out! We have received your message and will get
              back to you soon.
            </SectionMessage.Content>
          </SectionMessage>
        ) : null}
        <Form
          onSubmit={e => {
            e.preventDefault();
            setSubmitted(true);
            e.currentTarget.reset();
          }}
          onInvalid={() => setSubmitted(false)}
        >
          <Stack space={5}>
            <TextField
              label="Name"
              name="name"
              required
              errorMessage="Please enter your name."
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              description="We'll only use this to reply to you."
              errorMessage="Please enter a valid email address."
            />
            <Select
              label="Subject"
              name="subject"
              required
              placeholder="Select a subject"
              errorMessage="Please choose a subject."
            >
              <Select.Option id="general">General</Select.Option>
              <Select.Option id="support">Support</Select.Option>
              <Select.Option id="feedback">Feedback</Select.Option>
            </Select>
            <TextArea label="Message" name="message" rows={5} />
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
