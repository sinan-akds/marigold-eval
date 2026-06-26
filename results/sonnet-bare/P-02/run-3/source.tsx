import { useState } from 'react';
import { Stack, Inline, Text, Heading, Badge, Button, Divider, Card } from '@marigold/components';

const TestApp = () => {
  const [messageSent, setMessageSent] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <Stack space={0} alignX="center" style={{ padding: '2rem' }}>
      <Card p={6} style={{ maxWidth: 420, width: '100%' }}>
        <Stack space={4}>
          {/* Avatar + Name */}
          <Inline space={4} alignY="center">
            <img
              src="https://i.pravatar.cc/80?img=47"
              alt="Jane Doe"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
            />
            <Stack space={1}>
              <Heading level={2}>Jane Doe</Heading>
              <Badge variant={messageSent ? 'positive' : editing ? 'warning' : 'positive'}>
                Active
              </Badge>
            </Stack>
          </Inline>

          <Divider />

          {/* Details */}
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

          {/* Bio */}
          <Text>
            Jane is a passionate engineer with over 8 years of experience building scalable web
            applications. She leads the frontend guild and enjoys mentoring junior developers in her
            spare time.
          </Text>

          {/* Status feedback */}
          {messageSent && (
            <Badge variant="positive">Message sent!</Badge>
          )}
          {editing && (
            <Badge variant="warning">Edit mode active</Badge>
          )}

          {/* Actions */}
          <Inline space={3}>
            <Button
              variant="primary"
              onPress={() => {
                setMessageSent(true);
                setEditing(false);
                setTimeout(() => setMessageSent(false), 2000);
              }}
            >
              Send Message
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                setEditing(prev => !prev);
                setMessageSent(false);
              }}
            >
              Edit Profile
            </Button>
          </Inline>
        </Stack>
      </Card>
    </Stack>
  );
};

export default TestApp;
