import { useState } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Headline,
  Inline,
  Stack,
  Text,
} from '@marigold/components';

export default function UserProfileCard() {
  const [messageSent, setMessageSent] = useState(false);
  const [status, setStatus] = useState<'Active' | 'Away'>('Active');

  return (
    <AppLayout>
      <AppLayout.Main>
        <Center maxWidth="medium" space={8}>
          <Card p={6}>
            <Stack space={6}>
              {/* Avatar + Name + Status */}
              <Inline space={4} alignY="center">
                <img
                  src="https://i.pravatar.cc/80?img=47"
                  alt="Jane Doe"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <Stack space={2}>
                  <Headline level="1">Jane Doe</Headline>
                  <Badge variant={status === 'Active' ? 'success' : 'warning'}>
                    {status}
                  </Badge>
                </Stack>
              </Inline>

              <Divider />

              {/* Details */}
              <Stack space={3}>
                <Inline space={2}>
                  <Text variant="muted">Role:</Text>
                  <Text weight="bold">Senior Developer</Text>
                </Inline>
                <Inline space={2}>
                  <Text variant="muted">Department:</Text>
                  <Text weight="bold">Engineering</Text>
                </Inline>
                <Inline space={2}>
                  <Text variant="muted">Email:</Text>
                  <Text weight="bold">jane.doe@example.com</Text>
                </Inline>
                <Inline space={2}>
                  <Text variant="muted">Location:</Text>
                  <Text weight="bold">Freiburg, Germany</Text>
                </Inline>
              </Stack>

              <Divider />

              {/* Bio */}
              <Text>
                Jane is a passionate software engineer with over 8 years of
                experience building scalable web applications. She loves
                open-source contributions and mentoring junior developers on
                the team.
              </Text>

              <Divider />

              {/* Actions */}
              <Stack space={3}>
                <Inline space={3}>
                  <Button
                    variant="primary"
                    onPress={() => setMessageSent(true)}
                  >
                    Send Message
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={() =>
                      setStatus(s => (s === 'Active' ? 'Away' : 'Active'))
                    }
                  >
                    Edit Profile
                  </Button>
                </Inline>
                {messageSent && (
                  <Badge variant="success">Message sent successfully!</Badge>
                )}
              </Stack>
            </Stack>
          </Card>
        </Center>
      </AppLayout.Main>
    </AppLayout>
  );
}
