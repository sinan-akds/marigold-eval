import { useState } from 'react';
import {
  Button,
  Container,
  Select,
  Stack,
  TextField,
  TextArea,
  useToast,
} from '@marigold/components';

const TestApp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);

  const { addToast } = useToast();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = () => {
    let hasErrors = false;

    setNameError(!name.trim());
    if (!name.trim()) hasErrors = true;

    const emailValid = validateEmail(email);
    setEmailError(!emailValid);
    if (!emailValid) hasErrors = true;

    setSubjectError(!subject);
    if (!subject) hasErrors = true;

    if (hasErrors) return;

    addToast({
      title: 'Form Submitted',
      description: `Thank you ${name}! We received your ${subject} inquiry and will respond to ${email} shortly.`,
      variant: 'success',
    });

    setName('');
    setEmail('');
    setSubject(null);
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Container space="regular" contentLength="short">
      <Stack space="regular" alignX="left">
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          required
          error={nameError}
          errorMessage={nameError ? 'Name is required' : undefined}
          width="full"
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          required
          error={emailError}
          errorMessage={
            emailError ? 'Please enter a valid email address' : undefined
          }
          width="full"
        />

        <Select
          label="Subject"
          selectedKey={subject}
          onSelectionChange={key => {
            setSubject(key as string);
            setSubjectError(false);
          }}
          required
          error={subjectError}
          errorMessage={subjectError ? 'Subject is required' : undefined}
          width="full"
        >
          <Select.Option id="general">General</Select.Option>
          <Select.Option id="support">Support</Select.Option>
          <Select.Option id="feedback">Feedback</Select.Option>
        </Select>

        <TextArea
          label="Message"
          value={message}
          onChange={setMessage}
          rows={6}
          width="full"
        />

        <Button
          variant="primary"
          onPress={handleSubmit}
        >
          Submit
        </Button>

        {submitted && (
          <div className="text-green-600">
            Form submitted successfully!
          </div>
        )}
      </Stack>
    </Container>
  );
};

export default TestApp;
