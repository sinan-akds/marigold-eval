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

type Status = 'active' | 'away';

const profile = {
  name: 'Jane Doe',
  avatar: 'https://i.pravatar.cc/160?img=5',
  status: 'active' as Status,
  role: 'Senior Developer',
  department: 'Engineering',
  email: 'jane.doe@example.com',
  location: 'Freiburg, Germany',
  bio: 'Jane is a seasoned engineer who enjoys building accessible, well-tested user interfaces. When she is not pairing with teammates, she mentors juniors and tinkers with side projects.',
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Inline space={2} alignY="center">
    <Text weight="medium" wrap="noWrap">
      {label}
    </Text>
    <Text variant="muted">{value}</Text>
  </Inline>
);

const TestApp = () => {
  const [feedback, setFeedback] = useState('');

  const statusBadge =
    profile.status === 'active' ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="warning">Away</Badge>
    );

  return (
    <Card>
      <Stack space={5}>
        <Inline space={4} alignY="center">
          <img
            src={profile.avatar}
            alt={`${profile.name}'s profile`}
            width={72}
            height={72}
            style={{ borderRadius: '9999px', objectFit: 'cover' }}
          />
          <Stack space={1}>
            <Headline level="3">{profile.name}</Headline>
            {statusBadge}
          </Stack>
        </Inline>

        <Divider />

        <Stack space={2}>
          <DetailRow label="Role:" value={profile.role} />
          <DetailRow label="Department:" value={profile.department} />
          <DetailRow label="Email:" value={profile.email} />
          <DetailRow label="Location:" value={profile.location} />
        </Stack>

        <Text>{profile.bio}</Text>

        {feedback ? <Text variant="muted">{feedback}</Text> : null}

        <Divider />

        <Inline space={3} alignX="left">
          <Button
            variant="primary"
            onPress={() => setFeedback(`Message sent to ${profile.name}.`)}
          >
            Send Message
          </Button>
          <Button
            variant="secondary"
            onPress={() => setFeedback('Editing profile…')}
          >
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
