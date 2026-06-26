import { useState } from 'react';
import { Stack, Inline, Text, Heading, Badge, Button, Divider } from '@marigold/components';

const TestApp = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [editCount, setEditCount] = useState(0);

  return (
    <Stack space={0} style={{ maxWidth: 420, margin: '32px auto' }}>
      <Stack space={4} style={{ padding: 24, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
        {/* Avatar + Name */}
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/80?img=47"
            alt="Jane Doe"
            style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
          />
          <Stack space={1}>
            <Heading level={2}>Jane Doe</Heading>
            <Badge variant="positive">Active</Badge>
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
          Jane is a passionate software engineer with over eight years of experience building
          scalable web applications. She enjoys mentoring junior developers, contributing to
          open-source projects, and exploring the latest trends in frontend architecture.
        </Text>

        {/* Actions */}
        <Inline space={3}>
          <Button
            variant="primary"
            onPress={() => setMessageCount(c => c + 1)}
          >
            Send Message{messageCount > 0 ? ` (${messageCount})` : ''}
          </Button>
          <Button
            variant="secondary"
            onPress={() => setEditCount(c => c + 1)}
          >
            Edit Profile{editCount > 0 ? ` (${editCount})` : ''}
          </Button>
        </Inline>
      </Stack>
    </Stack>
  );
};

export default TestApp;
