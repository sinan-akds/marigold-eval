import { useState } from 'react';
import {
  Card,
  Stack,
  Inline,
  Headline,
  Text,
  Button,
  Badge,
} from '@marigold/components';

const TestApp = () => {
  const [sendMessageClicked, setSendMessageClicked] = useState(false);
  const [editProfileClicked, setEditProfileClicked] = useState(false);

  const handleSendMessage = () => {
    setSendMessageClicked(true);
    setTimeout(() => setSendMessageClicked(false), 2000);
  };

  const handleEditProfile = () => {
    setEditProfileClicked(true);
    setTimeout(() => setEditProfileClicked(false), 2000);
  };

  return (
    <Card p="square-regular">
      <Stack space={6}>
        {/* Avatar + Name */}
        <Inline space={4} alignY="center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
            alt="Jane Doe"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Headline level="3">Jane Doe</Headline>
        </Inline>

        {/* Status */}
        <Inline space={2}>
          <Badge variant="success">Active</Badge>
        </Inline>

        {/* Details */}
        <Stack space={3}>
          <Stack space={1}>
            <Text weight="medium" variant="muted">
              Role
            </Text>
            <Text>Senior Developer</Text>
          </Stack>
          <Stack space={1}>
            <Text weight="medium" variant="muted">
              Department
            </Text>
            <Text>Engineering</Text>
          </Stack>
          <Stack space={1}>
            <Text weight="medium" variant="muted">
              Email
            </Text>
            <Text>jane.doe@example.com</Text>
          </Stack>
          <Stack space={1}>
            <Text weight="medium" variant="muted">
              Location
            </Text>
            <Text>Freiburg, Germany</Text>
          </Stack>
        </Stack>

        {/* Bio */}
        <Text>
          Jane is a passionate developer with a keen eye for detail. She leads our engineering team with innovative thinking and strong technical expertise.
        </Text>

        {/* Actions */}
        <Inline space={3} alignX="left">
          <Button variant="primary" onPress={handleSendMessage}>
            {sendMessageClicked ? 'Message sent!' : 'Send Message'}
          </Button>
          <Button variant="secondary" onPress={handleEditProfile}>
            {editProfileClicked ? 'Saved!' : 'Edit Profile'}
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
