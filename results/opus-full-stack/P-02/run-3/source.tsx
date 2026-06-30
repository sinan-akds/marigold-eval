import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Headline,
  Inline,
  Link,
  Stack,
  Text,
} from '@marigold/components';

type Status = 'active' | 'away';

const person = {
  name: 'Jane Doe',
  avatar: 'https://i.pravatar.cc/160?img=47',
  status: 'active' as Status,
  role: 'Senior Developer',
  department: 'Engineering',
  email: 'jane.doe@example.com',
  location: 'Freiburg, Germany',
  bio: 'Jane is a senior developer with a passion for building accessible, well-crafted user interfaces. She enjoys mentoring teammates, untangling tricky bugs, and exploring the Black Forest on weekends.',
};

const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Inline space={2} alignY="center">
    <Text weight="bold">{label}</Text>
    <Text>{children}</Text>
  </Inline>
);

const TestApp = () => {
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <Card>
      <Stack space={5}>
        <Inline space={4} alignY="center">
          <img
            src={person.avatar}
            alt={`Portrait of ${person.name}`}
            width={72}
            height={72}
            style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <Stack space={1}>
            <Headline level="1">{person.name}</Headline>
            <Badge variant={person.status === 'active' ? 'success' : 'warning'}>
              {person.status === 'active' ? 'Active' : 'Away'}
            </Badge>
          </Stack>
        </Inline>

        <Divider />

        <Stack space={2}>
          <DetailRow label="Role:">{person.role}</DetailRow>
          <DetailRow label="Department:">{person.department}</DetailRow>
          <Inline space={2} alignY="center">
            <Text weight="bold">Email:</Text>
            <Link href={`mailto:${person.email}`}>{person.email}</Link>
          </Inline>
          <DetailRow label="Location:">{person.location}</DetailRow>
        </Stack>

        <Divider />

        <Text>{person.bio}</Text>

        {feedback ? <Text variant="muted">{feedback}</Text> : null}

        <Inline space={3} alignX="left">
          <Button
            variant="primary"
            onPress={() => setFeedback(`Message sent to ${person.name}.`)}
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
