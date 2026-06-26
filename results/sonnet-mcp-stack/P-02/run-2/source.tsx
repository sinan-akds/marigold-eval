import {
  Badge,
  Button,
  Card,
  Divider,
  Headline,
  Inline,
  Stack,
  Text,
  ToastProvider,
  useToast,
} from '@marigold/components';

const ProfileCard = () => {
  const { addToast } = useToast();

  return (
    <Card>
      <Stack space={6}>
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/80"
            alt="Jane Doe"
            style={{ borderRadius: '50%', width: 80, height: 80 }}
          />
          <Stack space={2}>
            <Headline level="3">Jane Doe</Headline>
            <Badge variant="success">Active</Badge>
          </Stack>
        </Inline>

        <Divider />

        <Stack space={2}>
          <Inline space={2}>
            <Text weight="bold">Role:</Text>
            <Text>Senior Developer</Text>
          </Inline>
          <Inline space={2}>
            <Text weight="bold">Department:</Text>
            <Text>Engineering</Text>
          </Inline>
          <Inline space={2}>
            <Text weight="bold">Email:</Text>
            <Text>jane.doe@example.com</Text>
          </Inline>
          <Inline space={2}>
            <Text weight="bold">Location:</Text>
            <Text>Freiburg, Germany</Text>
          </Inline>
        </Stack>

        <Divider />

        <Text>
          Jane is a passionate software engineer with over 8 years of experience
          building scalable web applications. She loves open source, clean code,
          and mentoring junior developers on the team.
        </Text>

        <Inline space={3}>
          <Button
            variant="primary"
            onPress={() =>
              addToast({ title: 'Message sent!', variant: 'success' })
            }
          >
            Send Message
          </Button>
          <Button
            variant="ghost"
            onPress={() =>
              addToast({ title: 'Edit profile opened', variant: 'info' })
            }
          >
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

const TestApp = () => {
  return (
    <>
      <ToastProvider position="bottom-right" />
      <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
        <ProfileCard />
      </div>
    </>
  );
};

export default TestApp;
