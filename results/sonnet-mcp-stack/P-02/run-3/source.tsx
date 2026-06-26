import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Headline,
  Inline,
  Stack,
  Text,
  ToastProvider,
  useToast,
} from '@marigold/components';

const ProfileCardContent = () => {
  const { addToast } = useToast();
  const [status, setStatus] = useState<'active' | 'away'>('active');

  const handleEditProfile = () => {
    const next = status === 'active' ? 'away' : 'active';
    setStatus(next);
    addToast({
      title: 'Profile updated',
      description: `Status set to ${next === 'active' ? 'Active' : 'Away'}`,
      variant: 'info',
    });
  };

  return (
    <Card>
      <Stack space={5}>
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/80?img=47"
            alt="Jane Doe"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <Stack space={2}>
            <Headline size="level-3">Jane Doe</Headline>
            <Badge variant={status === 'active' ? 'success' : 'warning'}>
              {status === 'active' ? 'Active' : 'Away'}
            </Badge>
          </Stack>
        </Inline>

        <Divider />

        <Stack space={2}>
          <Inline space={2}>
            <Text variant="muted">Role:</Text>
            <Text weight="medium">Senior Developer</Text>
          </Inline>
          <Inline space={2}>
            <Text variant="muted">Department:</Text>
            <Text weight="medium">Engineering</Text>
          </Inline>
          <Inline space={2}>
            <Text variant="muted">Email:</Text>
            <Text weight="medium">jane.doe@example.com</Text>
          </Inline>
          <Inline space={2}>
            <Text variant="muted">Location:</Text>
            <Text weight="medium">Freiburg, Germany</Text>
          </Inline>
        </Stack>

        <Divider />

        <Text>
          Jane is a passionate full-stack developer with over eight years of
          experience building scalable web applications. She thrives on
          mentoring junior engineers and championing clean code practices
          across the team.
        </Text>

        <Inline space={3}>
          <Button
            variant="primary"
            onPress={() =>
              addToast({ title: 'Message sent to Jane Doe!', variant: 'success' })
            }
          >
            Send Message
          </Button>
          <Button variant="secondary" onPress={handleEditProfile}>
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <Center>
      <div style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
        <ProfileCardContent />
      </div>
    </Center>
  </>
);

export default TestApp;
