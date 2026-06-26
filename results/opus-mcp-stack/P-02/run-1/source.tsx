import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Center,
  Dialog,
  Headline,
  Inline,
  Inset,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

interface Profile {
  name: string;
  role: string;
  department: string;
  email: string;
  location: string;
  bio: string;
  active: boolean;
}

const INITIAL_PROFILE: Profile = {
  name: 'Jane Doe',
  role: 'Senior Developer',
  department: 'Engineering',
  email: 'jane.doe@example.com',
  location: 'Freiburg, Germany',
  bio: 'Jane is a seasoned engineer who enjoys building reliable, accessible interfaces. When she is not shipping features, she mentors junior developers and contributes to the team design system.',
  active: true,
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Inline space={2} alignY="center">
    <Text weight="medium" variant="muted">
      {label}:
    </Text>
    <Text>{value}</Text>
  </Inline>
);

const TestApp = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [draft, setDraft] = useState<Profile>(INITIAL_PROFILE);
  const [message, setMessage] = useState('');
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const openMessage = () => {
    setMessage('');
    setMessageOpen(true);
  };

  const openEdit = () => {
    setDraft(profile);
    setEditOpen(true);
  };

  const sendMessage = () => {
    setLastSent(message.trim());
  };

  const saveEdit = () => {
    setProfile(draft);
  };

  return (
    <Inset space={6}>
      <Center maxWidth="480px">
        <Card variant="default" p={6}>
          <Stack space={6}>
            {/* Avatar + name + status */}
            <Inline space={4} alignY="center">
              <img
                src="https://i.pravatar.cc/300?img=47"
                alt={`Profile photo of ${profile.name}`}
                width={72}
                height={72}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-full, 9999px)',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
              <Stack space={1}>
                <Headline level="2">{profile.name}</Headline>
                <Inline>
                  {profile.active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="warning">Away</Badge>
                  )}
                </Inline>
              </Stack>
            </Inline>

            {/* Details */}
            <Stack space={2}>
              <DetailRow label="Role" value={profile.role} />
              <DetailRow label="Department" value={profile.department} />
              <DetailRow label="Email" value={profile.email} />
              <DetailRow label="Location" value={profile.location} />
            </Stack>

            {/* Bio */}
            <Text>{profile.bio}</Text>

            {lastSent !== null && (
              <Text variant="muted" fontStyle="italic">
                {lastSent
                  ? `Message sent to ${profile.name}: “${lastSent}”`
                  : `Message sent to ${profile.name}.`}
              </Text>
            )}

            {/* Actions */}
            <Inline space={3} alignY="center">
              <Button variant="primary" onPress={openMessage}>
                Send Message
              </Button>
              <Button variant="ghost" onPress={openEdit}>
                Edit Profile
              </Button>
            </Inline>
          </Stack>
        </Card>
      </Center>

      {/* Send Message dialog */}
      <Dialog
        open={messageOpen}
        onOpenChange={setMessageOpen}
        size="small"
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>Send a message to {profile.name}</Dialog.Title>
            <Dialog.Content>
              <TextArea
                label="Message"
                rows={4}
                value={message}
                onChange={setMessage}
                autoFocus
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={message.trim().length === 0}
                onPress={() => {
                  sendMessage();
                  close();
                }}
              >
                Send
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>

      {/* Edit Profile dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={setEditOpen}
        size="medium"
        closeButton
      >
        {({ close }) => (
          <>
            <Dialog.Title>Edit Profile</Dialog.Title>
            <Dialog.Content>
              <Stack space={4}>
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
                  rows={4}
                  value={draft.bio}
                  onChange={value => setDraft({ ...draft, bio: value })}
                />
                <Switch
                  label="Active"
                  selected={draft.active}
                  onChange={value => setDraft({ ...draft, active: value })}
                />
              </Stack>
            </Dialog.Content>
            <Dialog.Actions>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={() => {
                  saveEdit();
                  close();
                }}
              >
                Save
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Inset>
  );
};

export default TestApp;
