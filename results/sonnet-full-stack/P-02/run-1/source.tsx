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

export default function TestApp() {
  const [status, setStatus] = useState<'Active' | 'Away'>('Active');
  const [feedback, setFeedback] = useState('');

  return (
    <AppLayout>
      <AppLayout.Main>
        <Center maxWidth="medium" space={4}>
          <Card>
            <Stack space={4}>
              {/* Avatar + Name + Status */}
              <Inline space={4} alignY="center">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Jane Doe"
                  width={80}
                  height={80}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
                <Stack space={2}>
                  <Headline level="1">Jane Doe</Headline>
                  <Inline space={2} alignY="center">
                    <Badge variant={status === 'Active' ? 'success' : 'warning'}>
                      {status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="small"
                      onPress={() =>
                        setStatus(s => (s === 'Active' ? 'Away' : 'Active'))
                      }
                    >
                      Toggle
                    </Button>
                  </Inline>
                </Stack>
              </Inline>

              <Divider />

              {/* Details */}
              <Stack space={2}>
                <Inline space={2}>
                  <Text weight="bold">Role:</Text>
                  <Text variant="muted">Senior Developer</Text>
                </Inline>
                <Inline space={2}>
                  <Text weight="bold">Department:</Text>
                  <Text variant="muted">Engineering</Text>
                </Inline>
                <Inline space={2}>
                  <Text weight="bold">Email:</Text>
                  <Text variant="muted">jane.doe@example.com</Text>
                </Inline>
                <Inline space={2}>
                  <Text weight="bold">Location:</Text>
                  <Text variant="muted">Freiburg, Germany</Text>
                </Inline>
              </Stack>

              <Divider />

              {/* Bio */}
              <Text>
                Jane is a passionate senior developer with over 8 years of experience
                building scalable web applications. She champions clean code practices and
                mentors junior developers on the team. Outside of work, she enjoys hiking
                in the Black Forest and contributing to open-source projects.
              </Text>

              <Divider />

              {/* Actions */}
              <Stack space={2}>
                <Inline space={3}>
                  <Button
                    variant="primary"
                    onPress={() => setFeedback('Message sent to Jane!')}
                  >
                    Send Message
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={() => setFeedback('Opening profile editor...')}
                  >
                    Edit Profile
                  </Button>
                </Inline>
                {feedback && <Text variant="muted">{feedback}</Text>}
              </Stack>
            </Stack>
          </Card>
        </Center>
      </AppLayout.Main>
    </AppLayout>
  );
}
