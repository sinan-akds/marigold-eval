import { Card, Stack, Inline, Headline, Text, Badge, Button, Aspect } from '@marigold/components';

const TestApp = () => {
  const handleSendMessage = () => {
    alert('Send Message clicked');
  };

  const handleEditProfile = () => {
    alert('Edit Profile clicked');
  };

  return (
    <Card>
      <Stack space={5}>
        {/* Header with Avatar and Name */}
        <Inline space={5} alignY="center">
          <Aspect ratio="square">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Jane Doe"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </Aspect>
          <Stack space={2}>
            <Headline level="2">Jane Doe</Headline>
            <Badge>Active</Badge>
          </Stack>
        </Inline>

        {/* Details Section */}
        <Stack space={3}>
          <Inline space={3}>
            <Text weight="bold">Role:</Text>
            <Text>Senior Developer</Text>
          </Inline>
          <Inline space={3}>
            <Text weight="bold">Department:</Text>
            <Text>Engineering</Text>
          </Inline>
          <Inline space={3}>
            <Text weight="bold">Email:</Text>
            <Text>jane.doe@example.com</Text>
          </Inline>
          <Inline space={3}>
            <Text weight="bold">Location:</Text>
            <Text>Freiburg, Germany</Text>
          </Inline>
        </Stack>

        {/* Bio */}
        <Text>
          Jane is a Senior Developer with over 10 years of experience in full-stack
          development. She specializes in React and TypeScript, and is passionate
          about building accessible and user-friendly applications.
        </Text>

        {/* Action Buttons */}
        <Inline space={3}>
          <Button onPress={handleSendMessage} variant="primary">
            Send Message
          </Button>
          <Button onPress={handleEditProfile} variant="secondary">
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
