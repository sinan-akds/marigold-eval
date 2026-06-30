import { useState } from 'react';
import {
  AppLayout,
  Button,
  Container,
  Form,
  Headline,
  Inset,
  SectionMessage,
  Select,
  Stack,
  TextArea,
  TextField,
} from '@marigold/components';

const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError('Name is required.');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!message.trim()) {
      setMessageError('Message is required.');
      valid = false;
    } else {
      setMessageError('');
    }

    if (valid) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <AppLayout>
        <AppLayout.Main>
          <Container>
            <Inset space={8}>
              <SectionMessage variant="success">
                <SectionMessage.Title>Message sent!</SectionMessage.Title>
                <SectionMessage.Content>
                  Thank you for reaching out. We'll get back to you as soon as
                  possible.
                </SectionMessage.Content>
              </SectionMessage>
            </Inset>
          </Container>
        </AppLayout.Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppLayout.Main>
        <Container>
          <Inset space={8}>
            <Form onSubmit={handleSubmit}>
              <Stack space={4}>
                <Headline level="1">Contact Us</Headline>
                <TextField
                  label="Name"
                  name="name"
                  value={name}
                  onChange={val => {
                    setName(val);
                    if (nameError) setNameError('');
                  }}
                  error={!!nameError}
                  errorMessage={nameError}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="text"
                  value={email}
                  onChange={val => {
                    setEmail(val);
                    if (emailError) setEmailError('');
                  }}
                  error={!!emailError}
                  errorMessage={emailError}
                />
                <Select
                  label="Subject"
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
                  onChange={val => {
                    setMessage(val);
                    if (messageError) setMessageError('');
                  }}
                  rows={5}
                  error={!!messageError}
                  errorMessage={messageError}
                />
                <Button variant="primary" type="submit">
                  Send Message
                </Button>
              </Stack>
            </Form>
          </Inset>
        </Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default ContactForm;
