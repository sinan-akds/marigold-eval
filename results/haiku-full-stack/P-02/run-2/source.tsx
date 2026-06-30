import { useState } from 'react';
import {
  Card,
  Stack,
  Inline,
  Badge,
  Button,
  Text,
  Headline,
  Center,
  Columns,
} from '@marigold/components';

const TestApp = () => {
  const [messageAlert, setMessageAlert] = useState(false);
  const [editAlert, setEditAlert] = useState(false);

  const handleSendMessage = () => {
    setMessageAlert(true);
    setTimeout(() => setMessageAlert(false), 2000);
  };

  const handleEditProfile = () => {
    setEditAlert(true);
    setTimeout(() => setEditAlert(false), 2000);
  };

  return (
    <Center maxWidth="xlarge">
      <Card>
        <Stack space="group">
          <Inline space="group" alignY="center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
              alt="Jane Doe"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <Stack space="tight">
              <Headline size="level-3">Jane Doe</Headline>
              <Badge variant="success">Active</Badge>
            </Stack>
          </Inline>

          <Stack space="tight">
            <Columns columns={['fit', 1]} space="group">
              <Text weight="bold">Role:</Text>
              <Text>Senior Developer</Text>
            </Columns>
            <Columns columns={['fit', 1]} space="group">
              <Text weight="bold">Department:</Text>
              <Text>Engineering</Text>
            </Columns>
            <Columns columns={['fit', 1]} space="group">
              <Text weight="bold">Email:</Text>
              <Text>jane.doe@example.com</Text>
            </Columns>
            <Columns columns={['fit', 1]} space="group">
              <Text weight="bold">Location:</Text>
              <Text>Freiburg, Germany</Text>
            </Columns>
          </Stack>

          <Text variant="muted" size="sm">
            Jane is a passionate senior developer with 8+ years of experience in
            full-stack development. She specializes in building scalable web
            applications and mentoring junior developers. In her free time, she
            enjoys contributing to open-source projects and attending tech
            conferences.
          </Text>

          <Inline space="group" alignX="left">
            <Button variant="primary" onPress={handleSendMessage}>
              Send Message
            </Button>
            <Button variant="secondary" onPress={handleEditProfile}>
              Edit Profile
            </Button>
          </Inline>

          {messageAlert && (
            <Text color="success" size="sm">
              Message sent successfully!
            </Text>
          )}
          {editAlert && (
            <Text color="info" size="sm">
              Profile edit mode activated.
            </Text>
          )}
        </Stack>
      </Card>
    </Center>
  );
};

export default TestApp;
