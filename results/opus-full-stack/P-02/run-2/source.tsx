import { useState } from 'react';
import {
  Aspect,
  Badge,
  Button,
  Card,
  Columns,
  Dialog,
  Divider,
  Headline,
  Inline,
  Stack,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

type Status = 'active' | 'away';

interface Profile {
  name: string;
  role: string;
  department: string;
  email: string;
  location: string;
  bio: string;
  status: Status;
  avatar: string;
}

const initialProfile: Profile = {
  name: 'Jane Doe',
  role: 'Senior Developer',
  department: 'Engineering',
  email: 'jane.doe@example.com',
  location: 'Freiburg, Germany',
  bio: 'Jane is a Senior Developer on the platform team, focused on building accessible, resilient interfaces. She enjoys mentoring engineers, tidying up legacy code, and a good cup of coffee while reviewing pull requests.',
  status: 'active',
  avatar: 'https://i.pravatar.cc/160?img=47',
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Columns columns={['fit', 1]} space="group">
    <Text weight="medium">{label}</Text>
    <Text variant="muted">{value}</Text>
  </Columns>
);

const TestApp = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [messages, setMessages] = useState<string[]>([]);

  const statusBadge =
    profile.status === 'active' ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="warning">Away</Badge>
    );

  return (
    <Card variant="default" p="square-relaxed" space="related">
      <Stack space="section">
        <Inline space="regular" alignY="center">
          <Aspect ratio="square" maxWidth="72px">
            <img
              src={profile.avatar}
              alt={`Portrait of ${profile.name}`}
              className="size-full rounded-full object-cover"
            />
          </Aspect>
          <Stack space="tight">
            <Headline level="1">{profile.name}</Headline>
            {statusBadge}
          </Stack>
        </Inline>

        <Divider />

        <Stack space="regular">
          <DetailRow label="Role" value={profile.role} />
          <DetailRow label="Department" value={profile.department} />
          <DetailRow label="Email" value={profile.email} />
          <DetailRow label="Location" value={profile.location} />
        </Stack>

        <Text>{profile.bio}</Text>

        {messages.length > 0 ? (
          <Text variant="muted">
            {messages.length === 1
              ? '1 message sent to ' + profile.name + '.'
              : messages.length + ' messages sent to ' + profile.name + '.'}
          </Text>
        ) : null}

        <Divider />

        <Inline space="regular" alignY="center">
          <SendMessageDialog
            name={profile.name}
            onSend={message => setMessages(prev => [...prev, message])}
          />
          <EditProfileDialog profile={profile} onSave={setProfile} />
        </Inline>
      </Stack>
    </Card>
  );
};

const SendMessageDialog = ({
  name,
  onSend,
}: {
  name: string;
  onSend: (message: string) => void;
}) => {
  const [draft, setDraft] = useState('');

  return (
    <Dialog.Trigger>
      <Button variant="primary">Send Message</Button>
      <Dialog size="small">
        {({ close }) => (
          <>
            <Dialog.Title>Send a message to {name}</Dialog.Title>
            <Dialog.Content>
              <TextArea
                label="Message"
                placeholder={`Write your message to ${name}…`}
                value={draft}
                onChange={setDraft}
                rows={4}
                autoFocus
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={draft.trim().length === 0}
                onPress={() => {
                  onSend(draft.trim());
                  setDraft('');
                  close();
                }}
              >
                Send
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Dialog.Trigger>
  );
};

const EditProfileDialog = ({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (profile: Profile) => void;
}) => {
  const [draft, setDraft] = useState<Profile>(profile);

  return (
    <Dialog.Trigger>
      <Button variant="secondary">Edit Profile</Button>
      <Dialog size="medium">
        {({ close }) => (
          <>
            <Dialog.Title>Edit Profile</Dialog.Title>
            <Dialog.Content>
              <Stack space="regular">
                <TextField
                  label="Name"
                  value={draft.name}
                  onChange={value => setDraft({ ...draft, name: value })}
                  autoFocus
                />
                <TextField
                  label="Role"
                  value={draft.role}
                  onChange={value => setDraft({ ...draft, role: value })}
                />
                <TextField
                  label="Department"
                  value={draft.department}
                  onChange={value => setDraft({ ...draft, department: value })}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={draft.email}
                  onChange={value => setDraft({ ...draft, email: value })}
                />
                <TextField
                  label="Location"
                  value={draft.location}
                  onChange={value => setDraft({ ...draft, location: value })}
                />
                <TextArea
                  label="Bio"
                  value={draft.bio}
                  onChange={value => setDraft({ ...draft, bio: value })}
                  rows={4}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                variant="secondary"
                slot="close"
                onPress={() => setDraft(profile)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  onSave(draft);
                  close();
                }}
              >
                Save Changes
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Dialog.Trigger>
  );
};

export default TestApp;
