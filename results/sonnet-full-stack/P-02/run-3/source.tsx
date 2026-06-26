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

const UserProfileCard = () => {
  const [messageSent, setMessageSent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card>
      <Stack space={6}>
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/80?img=47"
            alt="Jane Doe avatar"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
          />
          <Stack space={2}>
            <Headline level="3">Jane Doe</Headline>
            <Badge variant="success">Active</Badge>
          </Stack>
        </Inline>

        <Divider />

        <Stack space={2}>
          <Inline space={2} alignY="center">
            <Text weight="bold">Role:</Text>
            <Text>Senior Developer</Text>
          </Inline>
          <Inline space={2} alignY="center">
            <Text weight="bold">Department:</Text>
            <Text>Engineering</Text>
          </Inline>
          <Inline space={2} alignY="center">
            <Text weight="bold">Email:</Text>
            <Text>jane.doe@example.com</Text>
          </Inline>
          <Inline space={2} alignY="center">
            <Text weight="bold">Location:</Text>
            <Text>Freiburg, Germany</Text>
          </Inline>
        </Stack>

        <Divider />

        <Text>
          Jane is a passionate software developer with over 8 years of experience building
          scalable web applications. She specializes in frontend architecture and enjoys
          mentoring junior developers on the team.
        </Text>

        <Divider />

        <Stack space={2}>
          <Inline space={3}>
            <Button
              variant="primary"
              onPress={() => setMessageSent(prev => !prev)}
            >
              {messageSent ? 'Message Sent!' : 'Send Message'}
            </Button>
            <Button
              variant="secondary"
              onPress={() => setIsEditing(prev => !prev)}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </Inline>
          {isEditing && (
            <Text variant="muted">Profile editing is now active.</Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

export default UserProfileCard;
