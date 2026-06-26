import { useState } from 'react';
import {
  Card,
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  Badge,
  Divider,
} from '@marigold/components';

type Status = 'active' | 'away';

const DETAILS = [
  { label: 'Role', value: 'Senior Developer' },
  { label: 'Department', value: 'Engineering' },
  { label: 'Email', value: 'jane.doe@example.com' },
  { label: 'Location', value: 'Freiburg, Germany' },
];

const TestApp = () => {
  const [status, setStatus] = useState<Status>('active');

  return (
    <Card>
      <Stack space={4}>
        <Inline space={4} alignY="center">
          <img
            src="https://i.pravatar.cc/96?img=47"
            alt="Portrait of Jane Doe"
            width={96}
            height={96}
            style={{ borderRadius: '9999px', objectFit: 'cover', display: 'block' }}
          />
          <Stack space={2}>
            <Headline level={2}>Jane Doe</Headline>
            <Badge variant={status === 'active' ? 'success' : 'warning'}>
              {status === 'active' ? 'Active' : 'Away'}
            </Badge>
          </Stack>
        </Inline>

        <Divider />

        <Stack space={2}>
          {DETAILS.map((detail) => (
            <Inline key={detail.label} space={2} alignY="center">
              <Text fontWeight="bold">{detail.label}:</Text>
              <Text>{detail.value}</Text>
            </Inline>
          ))}
        </Stack>

        <Divider />

        <Text>
          Jane is a senior developer on the Engineering team with a passion for
          building accessible, well-crafted user interfaces. She enjoys mentoring
          teammates, refining design systems, and shipping reliable software that
          people love to use.
        </Text>

        <Inline space={3} alignY="center">
          <Button
            variant="primary"
            onPress={() => alert('Message sent to Jane Doe')}
          >
            Send Message
          </Button>
          <Button
            variant="secondary"
            onPress={() =>
              setStatus((prev) => (prev === 'active' ? 'away' : 'active'))
            }
          >
            Edit Profile
          </Button>
        </Inline>
      </Stack>
    </Card>
  );
};

export default TestApp;
