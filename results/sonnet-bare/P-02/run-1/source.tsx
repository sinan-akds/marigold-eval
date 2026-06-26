import { useState } from 'react';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Badge,
  Button,
  Divider,
} from '@marigold/components';

const TestApp = () => {
  const [status, setStatus] = useState<'Active' | 'Away'>('Active');

  const handleSendMessage = () => {
    alert('Message sent to Jane Doe!');
  };

  const handleEditProfile = () => {
    setStatus(prev => (prev === 'Active' ? 'Away' : 'Active'));
  };

  return (
    <Stack space={4} style={{ maxWidth: 480, margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      {/* Avatar + Name */}
      <Inline space={4} alignY="center">
        <img
          src="https://i.pravatar.cc/80?img=47"
          alt="Jane Doe"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
        />
        <Stack space={1}>
          <Headline level="3">Jane Doe</Headline>
          <Badge variant={status === 'Active' ? 'positive' : 'warning'}>
            {status}
          </Badge>
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
        Jane is a passionate Senior Developer with over eight years of experience building
        scalable web applications. She thrives in collaborative environments, mentors junior
        engineers, and leads cross-functional projects from inception to delivery.
      </Text>

      <Divider />

      {/* Actions */}
      <Inline space={2}>
        <Button variant="primary" onPress={handleSendMessage}>
          Send Message
        </Button>
        <Button variant="secondary" onPress={handleEditProfile}>
          Edit Profile
        </Button>
      </Inline>
    </Stack>
  );
};

export default TestApp;
