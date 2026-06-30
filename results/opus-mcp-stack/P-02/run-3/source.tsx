import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  Headline,
  Inline,
  Split,
  Stack,
  Text,
} from '@marigold/components';

type Status = 'active' | 'away';

const DETAILS: { label: string; value: string }[] = [
  { label: 'Role', value: 'Senior Developer' },
  { label: 'Department', value: 'Engineering' },
  { label: 'Email', value: 'jane.doe@example.com' },
  { label: 'Location', value: 'Freiburg, Germany' },
];

const TestApp = () => {
  const [status] = useState<Status>('active');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  return (
    <Container align="center" alignItems="center" contentLength="short">
      <Card>
        <Stack space={5}>
          {/* Avatar + name + status */}
          <Inline space={4} alignY="center">
            <img
              src="https://i.pravatar.cc/96?img=47"
              alt="Jane Doe"
              width={72}
              height={72}
              style={{ borderRadius: 'var(--radii-full, 9999px)' }}
            />
            <Stack space={1}>
              <Headline level="2">Jane Doe</Headline>
              {status === 'active' ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="warning">Away</Badge>
              )}
            </Stack>
          </Inline>

          {/* Details */}
          <Stack space={2}>
            {DETAILS.map(({ label, value }) => (
              <Inline key={label} space={2} alignY="center">
                <Text variant="muted" weight="medium">
                  {label}:
                </Text>
                <Text>{value}</Text>
              </Inline>
            ))}
          </Stack>

          {/* Bio */}
          <Text>
            Jane is a senior developer on the Engineering team with a passion for
            building accessible, well-architected user interfaces. When she's not
            shipping features, she mentors teammates and contributes to the design
            system.
          </Text>

          {/* Feedback message */}
          {feedback ? (
            <Text variant="muted">{feedback}</Text>
          ) : null}

          {/* Actions */}
          <Inline space={3} alignY="center">
            <Button
              variant="primary"
              onPress={() => setFeedback('Message sent to Jane Doe.')}
            >
              Send Message
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                const next = !editing;
                setEditing(next);
                setFeedback(
                  next ? 'Editing Jane Doe’s profile…' : 'Edit cancelled.'
                );
              }}
            >
              {editing ? 'Done Editing' : 'Edit Profile'}
            </Button>
            <Split />
          </Inline>
        </Stack>
      </Card>
    </Container>
  );
};

export default TestApp;
