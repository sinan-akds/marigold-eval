import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Headline,
  Inline,
  Stack,
  Text,
} from '@marigold/components';

const TestApp = () => {
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <Card>
          <Stack space={6}>
            {/* Avatar + Name + Status */}
            <Inline space={4} alignY="center">
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Jane Doe"
                style={{
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  flexShrink: 0,
                }}
              />
              <Stack space={2}>
                <Headline level="3">Jane Doe</Headline>
                <Badge variant="success">Active</Badge>
              </Stack>
            </Inline>

            <Divider />

            {/* Details */}
            <Stack space={2}>
              <Inline space={2}>
                <Text weight="bold">Role:</Text>
                <Text>Senior Developer</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Department:</Text>
                <Text>Engineering</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Email:</Text>
                <Text>jane.doe@example.com</Text>
              </Inline>
              <Inline space={2}>
                <Text weight="bold">Location:</Text>
                <Text>Freiburg, Germany</Text>
              </Inline>
            </Stack>

            <Divider />

            {/* Bio */}
            <Text>
              Jane is a seasoned developer with over 8 years of experience
              building scalable web applications. She is passionate about clean
              code, developer experience, and mentoring junior engineers.
              Outside of work, she enjoys hiking in the Black Forest and
              contributing to open-source projects.
            </Text>

            <Divider />

            {/* Feedback message */}
            {feedbackMsg && <Text variant="muted">{feedbackMsg}</Text>}

            {/* Actions */}
            <Inline space={3}>
              <Button
                variant="primary"
                onPress={() => showFeedback('Message sent to Jane Doe!')}
              >
                Send Message
              </Button>
              <Button
                variant="secondary"
                onPress={() => showFeedback('Opening profile editor…')}
              >
                Edit Profile
              </Button>
            </Inline>
          </Stack>
        </Card>
      </div>
    </div>
  );
};

export default TestApp;
