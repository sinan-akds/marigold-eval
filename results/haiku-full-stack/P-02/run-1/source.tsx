import { useState } from 'react';
import {
  Card,
  Stack,
  Inline,
  Badge,
  Button,
  Headline,
  Text,
  AppLayout,
  Aspect,
  Inset,
} from '@marigold/components';

const TestApp = () => {
  const [messageAlert, setMessageAlert] = useState('');
  const [editAlert, setEditAlert] = useState('');

  const handleSendMessage = () => {
    setMessageAlert('Message sent to jane.doe@example.com');
    setTimeout(() => setMessageAlert(''), 3000);
  };

  const handleEditProfile = () => {
    setEditAlert('Edit profile initiated');
    setTimeout(() => setEditAlert(''), 3000);
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={16}>
          <Card>
            <Inset spaceX="padding-regular" spaceY="padding-regular">
              <Stack space={12}>
                {/* Header with avatar and name */}
                <Inline space={12} alignY="center">
                <Aspect ratio="square" maxWidth="80px">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop"
                    alt="Jane Doe"
                    className="object-cover"
                  />
                </Aspect>
                <Stack space={4}>
                  <Headline size="level-3">Jane Doe</Headline>
                  <Badge variant="success">Active</Badge>
                </Stack>
                </Inline>

                {/* Details section */}
                <Stack space={8}>
                  <Inline space={12} alignY="top">
                    <Text weight="medium">Role:</Text>
                    <Text>Senior Developer</Text>
                  </Inline>
                  <Inline space={12} alignY="top">
                    <Text weight="medium">Department:</Text>
                    <Text>Engineering</Text>
                  </Inline>
                  <Inline space={12} alignY="top">
                    <Text weight="medium">Email:</Text>
                    <Text>jane.doe@example.com</Text>
                  </Inline>
                  <Inline space={12} alignY="top">
                    <Text weight="medium">Location:</Text>
                    <Text>Freiburg, Germany</Text>
                  </Inline>
                </Stack>

                {/* Bio section */}
                <Stack space={4}>
                  <Text>
                    Jane is a passionate senior developer with 8 years of experience
                    in full-stack web development. She specializes in React and Node.js,
                    and leads the frontend infrastructure team. When not coding, she
                    enjoys mentoring junior developers and contributing to open source.
                  </Text>
                </Stack>

                {/* Actions */}
                <Stack space={8}>
                  <Button variant="primary" onPress={handleSendMessage} fullWidth>
                    Send Message
                  </Button>
                  <Button variant="secondary" onPress={handleEditProfile} fullWidth>
                    Edit Profile
                  </Button>
                </Stack>

                {/* Alert messages */}
                {messageAlert && (
                  <Text color="success">
                    {messageAlert}
                  </Text>
                )}
                {editAlert && (
                  <Text color="success">
                    {editAlert}
                  </Text>
                )}
              </Stack>
            </Inset>
          </Card>
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
