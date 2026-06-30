import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Headline,
  Inline,
  Stack,
  Text,
} from '@marigold/components';

type Status = 'active' | 'away';

const DETAILS = [
  { label: 'Role', value: 'Senior Developer' },
  { label: 'Department', value: 'Engineering' },
  { label: 'Email', value: 'jane.doe@example.com' },
  { label: 'Location', value: 'Freiburg, Germany' },
];

const TestApp = () => {
  const [status, setStatus] = useState<Status>('active');
  const [feedback, setFeedback] = useState<string>('');

  return (
    <Card>
      <Stack space={6}>
        {/* Avatar + name + status */}
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/96?img=47"
            alt="Jane Doe"
            width={72}
            height={72}
            style={{ borderRadius: '9999px', objectFit: 'cover' }}
          />
          <Stack space={1}>
            <Headline level="2">Jane Doe</Headline>
            <Badge variant={status === 'active' ? 'success' : 'warning'}>
              {status === 'active' ? 'Active' : 'Away'}
            </Badge>
          </Stack>
        </Inline>

        {/* Details */}
        <Stack space={2}>
          {DETAILS.map(({ label, value }) => (
            <Inline key={label} space={2} alignY="center">
              <Text weight="bold">{label}:</Text>
              <Text variant="muted">{value}</Text>
            </Inline>
          ))}
        </Stack>

        {/* Bio */}
        <Text>
          Jane is a senior developer on the Engineering team with a passion for
          building accessible, well-crafted user interfaces. She enjoys
          mentoring teammates, refining design systems, and shipping reliable
          software.
        </Text>

        {feedback ? <Text variant="muted">{feedback}</Text> : null}

        {/* Actions */}
        <Inline space={3} alignY="center">
          <Button
            variant="primary"
            onPress={() => setFeedback('Message sent to Jane Doe.')}
          >
            Send Message
          </Button>
          <Button
            variant="secondary"
            onPress={() => {
              setStatus(prev => (prev === 'active' ? 'away' : 'active'));
              setFeedback('Profile updated — status toggled.');
            }}
          >
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
