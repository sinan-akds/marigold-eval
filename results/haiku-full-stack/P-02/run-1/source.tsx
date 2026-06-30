import { useState } from 'react';
import { Card, Badge, Button, Stack, Inline, Headline, Text, Center, Aspect, AppLayout } from '@marigold/components';

const TestApp = () => {
  const [status, setStatus] = useState<'Active' | 'Away'>('Active');

  const handleSendMessage = () => {
    alert('Message sent to Jane Doe');
  };

  const handleEditProfile = () => {
    alert('Edit profile clicked');
  };

  const toggleStatus = () => {
    setStatus(status === 'Active' ? 'Away' : 'Active');
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Center maxWidth="xlarge">
          <Card>
            <Stack space={6}>
              {/* Header with Avatar and Name */}
              <Inline space={4} alignY="center">
                <Aspect ratio="square" maxWidth="80px">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                    alt="Jane Doe"
                    className="object-cover rounded-xs"
                  />
                </Aspect>
            <Stack space={2}>
              <Headline size="level-3">Jane Doe</Headline>
              <Badge variant={status === 'Active' ? 'success' : 'warning'}>
                {status}
              </Badge>
            </Stack>
          </Inline>

          {/* Details Section */}
          <Stack space={2}>
            <Inline space={2} alignY="center">
              <Text weight="bold" size="sm">Role:</Text>
              <Text size="sm">Senior Developer</Text>
            </Inline>
            <Inline space={2} alignY="center">
              <Text weight="bold" size="sm">Department:</Text>
              <Text size="sm">Engineering</Text>
            </Inline>
            <Inline space={2} alignY="center">
              <Text weight="bold" size="sm">Email:</Text>
              <Text size="sm">jane.doe@example.com</Text>
            </Inline>
            <Inline space={2} alignY="center">
              <Text weight="bold" size="sm">Location:</Text>
              <Text size="sm">Freiburg, Germany</Text>
            </Inline>
          </Stack>

          {/* Bio Section */}
          <Text variant="muted">
            Jane is a talented senior developer with 8+ years of experience building scalable web applications.
            She specializes in React and TypeScript, and enjoys mentoring junior developers on the team.
          </Text>

          {/* Actions Section */}
          <Inline space={2} alignX="between">
            <Button variant="primary" onPress={handleSendMessage}>
              Send Message
            </Button>
            <Button variant="secondary" onPress={handleEditProfile}>
              Edit Profile
            </Button>
          </Inline>

          {/* Status Toggle for Demo */}
          <Button variant="ghost" onPress={toggleStatus} size="small">
            Toggle Status ({status})
          </Button>
            </Stack>
          </Card>
        </Center>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
