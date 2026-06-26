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

interface Profile {
  name: string;
  avatarUrl: string;
  status: Status;
  role: string;
  department: string;
  email: string;
  location: string;
  bio: string;
}

const profile: Profile = {
  name: 'Jane Doe',
  avatarUrl: 'https://i.pravatar.cc/160?img=47',
  status: 'active',
  role: 'Senior Developer',
  department: 'Engineering',
  email: 'jane.doe@example.com',
  location: 'Freiburg, Germany',
  bio: 'Jane is a senior developer who enjoys building accessible, well-tested interfaces. She has spent the last few years focused on design systems and developer tooling, and mentors junior engineers on the team.',
};

const details: { label: string; value: string }[] = [
  { label: 'Role', value: profile.role },
  { label: 'Department', value: profile.department },
  { label: 'Email', value: profile.email },
  { label: 'Location', value: profile.location },
];

const TestApp = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleSendMessage = () => {
    setMessage(`Message dialog opened for ${profile.name}.`);
  };

  const handleEditProfile = () => {
    setMessage(`Editing profile for ${profile.name}.`);
  };

  const isActive = profile.status === 'active';

  return (
    <Card>
      <Stack space={6}>
        <Inline space={4} alignY="center">
          <img
            src={profile.avatarUrl}
            alt={`${profile.name}'s profile photo`}
            width={80}
            height={80}
            style={{ borderRadius: '9999px', objectFit: 'cover' }}
          />
          <Stack space={2}>
            <Headline level={2}>{profile.name}</Headline>
            <Badge variant={isActive ? 'success' : 'warning'}>
              {isActive ? 'Active' : 'Away'}
            </Badge>
          </Stack>
        </Inline>

        <Divider />

        <Stack space={3}>
          {details.map((item) => (
            <Inline key={item.label} space={2} alignY="center">
              <Text fontWeight="bold">{item.label}:</Text>
              <Text>{item.value}</Text>
            </Inline>
          ))}
        </Stack>

        <Divider />

        <Text>{profile.bio}</Text>

        {message && (
          <Text fontStyle="italic">{message}</Text>
        )}

        <Inline space={3} alignY="center">
          <Button variant="primary" onPress={handleSendMessage}>
            Send Message
          </Button>
          <Button variant="secondary" onPress={handleEditProfile}>
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
