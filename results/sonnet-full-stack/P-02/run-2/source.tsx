import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Headline,
  Inline,
  Inset,
  Stack,
  Text,
} from '@marigold/components';

const UserProfileCard = () => {
  const [status, setStatus] = useState<'Active' | 'Away'>('Active');

  const handleSendMessage = () => {
    alert('Opening message composer for Jane Doe…');
  };

  const handleEditProfile = () => {
    alert('Opening profile editor for Jane Doe…');
  };

  return (
    <Card>
      <Inset space={6}>
        <Stack space={4}>
          {/* Avatar + Name */}
          <Inline space={4} alignY="center">
            <img
              src="https://picsum.photos/seed/janedoe/80/80"
              alt="Jane Doe"
              style={{ borderRadius: '50%', width: 80, height: 80, flexShrink: 0 }}
            />
            <Stack space={1}>
              <Headline level="3">Jane Doe</Headline>
              <Badge
                variant={status === 'Active' ? 'success' : 'warning'}
              >
                {status}
              </Badge>
            </Stack>
          </Inline>

          <Divider />

          {/* Details */}
          <Stack space={2}>
            <Inline space={2}>
              <Text variant="muted" weight="bold">Role:</Text>
              <Text>Senior Developer</Text>
            </Inline>
            <Inline space={2}>
              <Text variant="muted" weight="bold">Department:</Text>
              <Text>Engineering</Text>
            </Inline>
            <Inline space={2}>
              <Text variant="muted" weight="bold">Email:</Text>
              <Text>jane.doe@example.com</Text>
            </Inline>
            <Inline space={2}>
              <Text variant="muted" weight="bold">Location:</Text>
              <Text>Freiburg, Germany</Text>
            </Inline>
          </Stack>

          <Divider />

          {/* Bio */}
          <Text>
            Jane is a passionate senior developer with over 8 years of experience
            building scalable web applications. She specialises in React and
            TypeScript and is known for her clear communication and mentoring
            skills. Outside of work, she enjoys hiking in the Black Forest and
            contributing to open-source projects.
          </Text>

          <Divider />

          {/* Actions */}
          <Inline space={3}>
            <Button variant="primary" onPress={handleSendMessage}>
              Send Message
            </Button>
            <Button variant="ghost" onPress={handleEditProfile}>
              Edit Profile
            </Button>
          </Inline>
        </Stack>
      </Inset>
    </Card>
  );
};

export default UserProfileCard;
