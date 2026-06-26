import { useState } from 'react';
import {
  Box,
  Card,
  Heading,
  Text,
  Badge,
  Button,
  Stack,
  HStack,
  Inline,
} from '@marigold/components';

const TestApp = () => {
  const [isActive, setIsActive] = useState(true);

  const handleSendMessage = () => {
    alert('Message sent to Jane Doe');
  };

  const handleEditProfile = () => {
    alert('Edit profile clicked');
  };

  return (
    <Box padding="xl">
      <Card>
        <Stack gap="lg">
          {/* Header with avatar and name */}
          <HStack gap="lg" alignItems="flex-start">
            <img
              src="https://i.pravatar.cc/150?img=1"
              alt="Jane Doe"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Stack gap="sm" flex={1}>
              <Heading level="2">Jane Doe</Heading>
              <Badge color={isActive ? 'positive' : 'warning'}>
                {isActive ? 'Active' : 'Away'}
              </Badge>
            </Stack>
          </HStack>

          {/* Details section */}
          <Stack gap="sm">
            <Inline gap="md">
              <Text weight="semibold">Role:</Text>
              <Text>Senior Developer</Text>
            </Inline>
            <Inline gap="md">
              <Text weight="semibold">Department:</Text>
              <Text>Engineering</Text>
            </Inline>
            <Inline gap="md">
              <Text weight="semibold">Email:</Text>
              <Text>jane.doe@example.com</Text>
            </Inline>
            <Inline gap="md">
              <Text weight="semibold">Location:</Text>
              <Text>Freiburg, Germany</Text>
            </Inline>
          </Stack>

          {/* Bio section */}
          <Text>
            Jane is a passionate senior developer with 8+ years of experience
            building scalable web applications. She specializes in React and
            cloud architecture, and loves mentoring junior team members.
          </Text>

          {/* Actions */}
          <HStack gap="md">
            <Button
              onClick={handleSendMessage}
              variant="primary"
              flex={1}
            >
              Send Message
            </Button>
            <Button
              onClick={handleEditProfile}
              variant="secondary"
              flex={1}
            >
              Edit Profile
            </Button>
          </HStack>
        </Stack>
      </Card>
    </Box>
  );
};

export default TestApp;
