import { useState } from 'react';
import {
  Stack,
  Box,
  Text,
  Badge,
  Button,
  Heading,
} from '@marigold/components';

const TestApp = () => {
  const [status, setStatus] = useState<'active' | 'away'>('active');
  const [messageOpen, setMessageOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Box padding="large">
      <Stack
        space="large"
        style={{
          maxWidth: '400px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '24px',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Avatar and Name */}
        <Stack space="medium" alignItems="center">
          <img
            src="https://api.placeholder.com/96/96"
            alt="Jane Doe"
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <Stack space="small" alignItems="center">
            <Heading level={3}>Jane Doe</Heading>
            <Badge variant={status === 'active' ? 'info' : 'warning'}>
              {status === 'active' ? 'Active' : 'Away'}
            </Badge>
          </Stack>
        </Stack>

        {/* Details Section */}
        <Stack space="small">
          <DetailRow label="Role" value="Senior Developer" />
          <DetailRow label="Department" value="Engineering" />
          <DetailRow label="Email" value="jane.doe@example.com" />
          <DetailRow label="Location" value="Freiburg, Germany" />
        </Stack>

        {/* Bio */}
        <Text>
          Jane is a talented software engineer with over 8 years of experience in full-stack
          development. She specializes in React and Node.js, and loves mentoring junior
          developers on the team.
        </Text>

        {/* Status Toggle (for demo) */}
        <Stack space="small" alignItems="center">
          <Button
            variant="secondary"
            size="small"
            onPress={() => setStatus(status === 'active' ? 'away' : 'active')}
          >
            Toggle Status
          </Button>
          {messageOpen && <Text>Message sent to Jane!</Text>}
          {editOpen && <Text>Edit profile mode activated</Text>}
        </Stack>

        {/* Actions */}
        <Stack space="small" direction="row">
          <Button
            flex
            variant="primary"
            onPress={() => setMessageOpen(!messageOpen)}
          >
            Send Message
          </Button>
          <Button
            flex
            variant="secondary"
            onPress={() => setEditOpen(!editOpen)}
          >
            Edit Profile
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Stack direction="row" space="medium" alignItems="baseline">
    <Text weight="bold" style={{ minWidth: '100px' }}>
      {label}:
    </Text>
    <Text>{value}</Text>
  </Stack>
);

export default TestApp;
