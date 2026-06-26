import { useState } from 'react';
import {
  Card,
  Badge,
  Button,
  Stack,
  Inline,
  Headline,
  Text,
  Inset,
  Divider,
  Center,
} from '@marigold/components';

const TestApp = () => {
  const [messageClicked, setMessageClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);

  return (
    <Center>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <Card>
          <Inset spaceX="padding-regular" spaceY="padding-relaxed">
            <Stack space={4}>
              {/* Avatar and Name Section */}
              <Inline space={3} alignY="center">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop"
                  alt="Jane Doe"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <Stack space={1}>
                  <Headline level="3">Jane Doe</Headline>
                  <Badge variant="success">Active</Badge>
                </Stack>
              </Inline>

              {/* Bio */}
              <Text>
                Senior developer with a passion for building elegant solutions to
                complex problems. Always learning and eager to collaborate with
                talented teams.
              </Text>

              {/* Details Section */}
              <Stack space={2}>
                <Stack space={1}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    Role
                  </div>
                  <Text>Senior Developer</Text>
                </Stack>

                <Stack space={1}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    Department
                  </div>
                  <Text>Engineering</Text>
                </Stack>

                <Stack space={1}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    Email
                  </div>
                  <Text>jane.doe@example.com</Text>
                </Stack>

                <Stack space={1}>
                  <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                    Location
                  </div>
                  <Text>Freiburg, Germany</Text>
                </Stack>
              </Stack>

              <Divider />

              {/* Actions */}
              <Inline space={2}>
                <div style={{ flex: 1 }}>
                  <Button
                    variant="primary"
                    onPress={() => setMessageClicked(!messageClicked)}
                  >
                    {messageClicked ? 'Message Sent!' : 'Send Message'}
                  </Button>
                </div>
                <div style={{ flex: 1 }}>
                  <Button
                    variant="secondary"
                    onPress={() => setEditClicked(!editClicked)}
                  >
                    {editClicked ? 'Editing...' : 'Edit Profile'}
                  </Button>
                </div>
              </Inline>
            </Stack>
          </Inset>
        </Card>
      </div>
    </Center>
  );
};

export default TestApp;
