import { useState } from 'react';
import { Badge, Button, Card, Divider, Headline, Inline, Stack, Text } from '@marigold/components';

const TestApp = () => {
  const [messageStatus, setMessageStatus] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');

  const handleSendMessage = () => {
    setMessageStatus('Message sent!');
    setTimeout(() => setMessageStatus(''), 3000);
  };

  const handleEditProfile = () => {
    setEditStatus('Edit profile clicked');
    setTimeout(() => setEditStatus(''), 3000);
  };

  return (
    <Stack space="regular" alignX="center" alignY="top">
      <Card>
        <Stack space="group">
          <Inline space="group" alignY="center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
              alt="Jane Doe profile"
              style={{ width: '96px', height: '96px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <Stack space="tight">
              <Headline size="level-3">Jane Doe</Headline>
              <Badge variant="success">Active</Badge>
            </Stack>
          </Inline>

          <Stack space="tight">
            <Inline alignX="left" space="tight">
              <Text weight="medium">Role:</Text>
              <Text>Senior Developer</Text>
            </Inline>
            <Inline alignX="left" space="tight">
              <Text weight="medium">Department:</Text>
              <Text>Engineering</Text>
            </Inline>
            <Inline alignX="left" space="tight">
              <Text weight="medium">Email:</Text>
              <Text>jane.doe@example.com</Text>
            </Inline>
            <Inline alignX="left" space="tight">
              <Text weight="medium">Location:</Text>
              <Text>Freiburg, Germany</Text>
            </Inline>
          </Stack>

          <Text>
            Jane is a talented senior developer with over 8 years of experience in full-stack development. She specializes in React and Python, and leads our engineering team with expertise and enthusiasm.
          </Text>

          <Divider />

          <Inline space="group" alignX="left">
            <Button variant="primary" onPress={handleSendMessage}>
              Send Message
            </Button>
            <Button variant="secondary" onPress={handleEditProfile}>
              Edit Profile
            </Button>
          </Inline>

          {messageStatus && (
            <Text color="success">
              {messageStatus}
            </Text>
          )}
          {editStatus && (
            <Text color="info">
              {editStatus}
            </Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default TestApp;
