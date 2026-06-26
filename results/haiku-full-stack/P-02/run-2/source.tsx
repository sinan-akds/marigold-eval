import { useState } from 'react';
import { Stack, Inline, Button, Badge, Headline, Text, Inset } from '@marigold/components';

const TestApp = () => {
  const [messageAction, setMessageAction] = useState(false);
  const [editAction, setEditAction] = useState(false);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <Inset space="square-relaxed">
        <Stack space="group">
          {/* Header with Avatar and Status */}
          <Inline space="regular" alignY="center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
              alt="Jane Doe"
              style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
            />
            <Stack space="related" stretch>
              <Headline size="level-4">Jane Doe</Headline>
              <Badge variant="success">Active</Badge>
            </Stack>
          </Inline>

          {/* Details Section */}
          <Stack space="related">
            <div>
              <Text weight="medium" size="xs" variant="muted">Role</Text>
              <Text>Senior Developer</Text>
            </div>
            <div>
              <Text weight="medium" size="xs" variant="muted">Department</Text>
              <Text>Engineering</Text>
            </div>
            <div>
              <Text weight="medium" size="xs" variant="muted">Email</Text>
              <Text>jane.doe@example.com</Text>
            </div>
            <div>
              <Text weight="medium" size="xs" variant="muted">Location</Text>
              <Text>Freiburg, Germany</Text>
            </div>
          </Stack>

          {/* Bio Section */}
          <Text variant="muted">
            Jane is a talented senior developer with 8+ years of experience building scalable applications.
            She specializes in frontend architecture and loves mentoring junior team members.
          </Text>

          {/* Action Buttons */}
          <Inline space="related" alignY="center">
            <Button
              variant="primary"
              onPress={() => setMessageAction(!messageAction)}
            >
              Send Message
            </Button>
            <Button
              variant="secondary"
              onPress={() => setEditAction(!editAction)}
            >
              Edit Profile
            </Button>
          </Inline>

          {/* Action Feedback */}
          {messageAction && (
            <Text color="success">
              Message action triggered!
            </Text>
          )}
          {editAction && (
            <Text color="success">
              Edit profile action triggered!
            </Text>
          )}
        </Stack>
      </Inset>
    </div>
  );
};

export default TestApp;
