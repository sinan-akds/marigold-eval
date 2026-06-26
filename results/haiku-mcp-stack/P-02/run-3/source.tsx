import { useState } from 'react';
import {
  Card,
  Stack,
  Inline,
  Badge,
  Button,
  Text,
  Headline,
} from '@marigold/components';

const TestApp = () => {
  const [messagesSent, setMessagesSent] = useState(0);
  const [profileEdited, setProfileEdited] = useState(false);

  const handleSendMessage = () => {
    setMessagesSent(prev => prev + 1);
  };

  const handleEditProfile = () => {
    setProfileEdited(!profileEdited);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <Card>
        <Stack space="regular">
          {/* Avatar and Name */}
          <Inline space="regular" alignY="center">
            <img
              src="https://i.pravatar.cc/80?img=42"
              alt="Jane Doe"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
            <Stack space="tight">
              <Headline size="level-4">Jane Doe</Headline>
              <Badge variant="success">Active</Badge>
            </Stack>
          </Inline>

          {/* Details */}
          <Stack space="tight">
            <Inline space="tight" alignX="left">
              <div style={{ minWidth: '80px' }}>
                <Text weight="medium">Role:</Text>
              </div>
              <Text>Senior Developer</Text>
            </Inline>
            <Inline space="tight" alignX="left">
              <div style={{ minWidth: '80px' }}>
                <Text weight="medium">Department:</Text>
              </div>
              <Text>Engineering</Text>
            </Inline>
            <Inline space="tight" alignX="left">
              <div style={{ minWidth: '80px' }}>
                <Text weight="medium">Email:</Text>
              </div>
              <Text>jane.doe@example.com</Text>
            </Inline>
            <Inline space="tight" alignX="left">
              <div style={{ minWidth: '80px' }}>
                <Text weight="medium">Location:</Text>
              </div>
              <Text>Freiburg, Germany</Text>
            </Inline>
          </Stack>

          {/* Bio */}
          <Text>
            Jane is a passionate senior developer with over 8 years of experience
            in full-stack development. She leads the core platform team and is
            dedicated to building scalable, maintainable solutions.
          </Text>

          {/* Status Display */}
          {messagesSent > 0 && (
            <Text variant="muted" size="sm">
              Messages sent: {messagesSent}
            </Text>
          )}
          {profileEdited && (
            <Text variant="muted" size="sm">
              Profile edit mode is active
            </Text>
          )}

          {/* Actions */}
          <Inline space="regular">
            <Button variant="primary" onPress={handleSendMessage}>
              Send Message
            </Button>
            <Button variant="secondary" onPress={handleEditProfile}>
              Edit Profile
            </Button>
          </Inline>
        </Stack>
      </Card>
    </div>
  );
};

export default TestApp;
