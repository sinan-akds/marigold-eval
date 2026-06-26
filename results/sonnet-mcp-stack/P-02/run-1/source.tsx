import {
  Badge,
  Button,
  Card,
  Center,
  Dialog,
  Divider,
  Headline,
  Inline,
  Stack,
  Text,
  TextField,
} from '@marigold/components';

const UserProfileCard = () => {
  return (
    <Center maxWidth="small" space={8}>
      <Card>
        <Stack space="regular">
          {/* Avatar + Name + Status */}
          <Inline space="regular" alignY="center">
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
            <Stack space={1}>
              <Headline size="level-3">Jane Doe</Headline>
              <Badge variant="success">Active</Badge>
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
          <Text as="p">
            Jane is a passionate full-stack engineer with over eight years of experience
            building scalable web applications. She champions clean code, mentors junior
            developers, and leads the platform reliability initiative across the engineering
            organization.
          </Text>

          <Divider />

          {/* Actions */}
          <Inline space={3}>
            <Dialog.Trigger>
              <Button variant="primary">Send Message</Button>
              <Dialog size="small">
                <Dialog.Title>Send Message</Dialog.Title>
                <Dialog.Content>
                  <Stack space={3}>
                    <Text>Compose a message for Jane Doe.</Text>
                    <TextField label="Subject" />
                    <TextField label="Message" />
                  </Stack>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button variant="secondary" slot="close">
                    Cancel
                  </Button>
                  <Button variant="primary">Send</Button>
                </Dialog.Actions>
              </Dialog>
            </Dialog.Trigger>

            <Dialog.Trigger>
              <Button variant="secondary">Edit Profile</Button>
              <Dialog size="small">
                <Dialog.Title>Edit Profile</Dialog.Title>
                <Dialog.Content>
                  <Stack space={3}>
                    <TextField label="Name" defaultValue="Jane Doe" />
                    <TextField label="Role" defaultValue="Senior Developer" />
                    <TextField
                      label="Email"
                      defaultValue="jane.doe@example.com"
                      type="email"
                    />
                    <TextField label="Location" defaultValue="Freiburg, Germany" />
                  </Stack>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button variant="secondary" slot="close">
                    Cancel
                  </Button>
                  <Button variant="primary">Save</Button>
                </Dialog.Actions>
              </Dialog>
            </Dialog.Trigger>
          </Inline>
        </Stack>
      </Card>
    </Center>
  );
};

export default UserProfileCard;
