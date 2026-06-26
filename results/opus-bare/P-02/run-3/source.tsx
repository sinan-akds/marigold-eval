import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Headline,
  Inline,
  Split,
  Stack,
  Text,
} from '@marigold/components';

const detail = (label: string, value: string) => (
  <Inline space={2} alignY="baseline">
    <Text fontWeight="bold">{label}:</Text>
    <Text>{value}</Text>
  </Inline>
);

const TestApp = () => {
  const [status] = useState<'Active' | 'Away'>('Active');
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <Card>
      <Stack space={5}>
        {/* Avatar + name + status */}
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/96?img=47"
            alt="Jane Doe"
            width={72}
            height={72}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <Stack space={1}>
            <Headline level={2}>Jane Doe</Headline>
            <Badge variant={status === 'Active' ? 'success' : 'warning'}>
              {status}
            </Badge>
          </Stack>
        </Inline>

        {/* Details */}
        <Stack space={2}>
          {detail('Role', 'Senior Developer')}
          {detail('Department', 'Engineering')}
          {detail('Email', 'jane.doe@example.com')}
          {detail('Location', 'Freiburg, Germany')}
        </Stack>

        {/* Bio */}
        <Text>
          Jane is a senior developer with a passion for building accessible,
          well-tested user interfaces. She enjoys mentoring teammates, refining
          design systems, and the occasional long-distance trail run on the
          weekend.
        </Text>

        {/* Actions */}
        <Split />
        <Inline space={3} alignY="center">
          <Button
            variant="primary"
            onPress={() => setFeedback('Message sent to Jane Doe.')}
          >
            Send Message
          </Button>
          <Button
            variant="secondary"
            onPress={() => setFeedback('Editing Jane Doe’s profile…')}
          >
            Edit Profile
          </Button>
        </Inline>

        {feedback && <Text>{feedback}</Text>}
      </Stack>
    </Card>
  );
};

export default TestApp;
