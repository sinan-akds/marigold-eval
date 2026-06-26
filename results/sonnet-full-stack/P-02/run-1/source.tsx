import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Headline,
  Inline,
  Inset,
  Stack,
  Text,
} from '@marigold/components';

const details = [
  { label: 'Role', value: 'Senior Developer' },
  { label: 'Department', value: 'Engineering' },
  { label: 'Email', value: 'jane.doe@example.com' },
  { label: 'Location', value: 'Freiburg, Germany' },
];

const TestApp = () => {
  const [status, setStatus] = useState<'Active' | 'Away'>('Active');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    setMessage('Message sent to Jane Doe!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEditProfile = () => {
    setStatus(s => (s === 'Active' ? 'Away' : 'Active'));
  };

  return (
    <Center>
      <Stack space={4}>
        <Card>
          <Inset space={6}>
            <Stack space={4}>
              {/* Avatar + Name + Status */}
              <Inline space={4} alignY="center">
                <img
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Jane Doe"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Stack space={2}>
                  <Headline level="2">Jane Doe</Headline>
                  <Badge variant={status === 'Active' ? 'success' : 'warning'}>
                    {status}
                  </Badge>
                </Stack>
              </Inline>

              <Divider />

              {/* Details */}
              <Stack space={2}>
                {details.map(({ label, value }) => (
                  <Inline key={label} space={2}>
                    <Text variant="muted">{label}:</Text>
                    <Text weight="medium">{value}</Text>
                  </Inline>
                ))}
              </Stack>

              <Divider />

              {/* Bio */}
              <Text>
                Jane is a passionate engineer who loves building elegant
                solutions to complex problems. With over eight years of
                experience in full-stack development, she brings both technical
                depth and creative thinking to every project she takes on.
              </Text>

              <Divider />

              {/* Actions */}
              <Stack space={2}>
                <Inline space={3}>
                  <Button variant="primary" onPress={handleSendMessage}>
                    Send Message
                  </Button>
                  <Button variant="ghost" onPress={handleEditProfile}>
                    Edit Profile
                  </Button>
                </Inline>
                {message && <Text variant="muted">{message}</Text>}
              </Stack>
            </Stack>
          </Inset>
        </Card>
      </Stack>
    </Center>
  );
};

export default TestApp;
