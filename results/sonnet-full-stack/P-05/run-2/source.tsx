import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Headline,
  Inset,
  Radio,
  Select,
  SectionMessage,
  Stack,
  Switch,
  TextArea,
  TextField,
  Text,
} from '@marigold/components';

type Visibility = 'public' | 'team-only' | 'private';

const SettingsPage = () => {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [showOnline, setShowOnline] = useState(false);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  return (
    <Inset space={6}>
      <Stack space={6}>
        <Headline level={1}>Settings</Headline>
      <Accordion>
        <Accordion.Item id="profile">
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              {profileSaved && (
                <SectionMessage
                  closeButton
                  onCloseChange={() => setProfileSaved(false)}
                >
                  <SectionMessage.Title>Profile saved!</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your profile has been updated successfully.
                  </SectionMessage.Content>
                </SectionMessage>
              )}
              <TextField
                label="Display Name"
                required
                value={displayName}
                onChange={setDisplayName}
              />
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <TextArea
                label="Bio"
                value={bio}
                onChange={setBio}
                description="Optional. Tell others a bit about yourself."
              />
              <Button variant="primary" onPress={() => setProfileSaved(true)}>
                Save Profile
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="appearance">
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Radio.Group label="Theme" value={theme} onChange={setTheme}>
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system">System Default</Radio>
              </Radio.Group>
              <Select
                label="Language"
                selectedKey={language}
                onChange={(key) => setLanguage(String(key))}
              >
                <Select.Option id="english">English</Select.Option>
                <Select.Option id="german">German</Select.Option>
                <Select.Option id="french">French</Select.Option>
              </Select>
              <Stack space={1}>
                <Switch
                  label="Compact Mode"
                  selected={compactMode}
                  onChange={setCompactMode}
                />
                <Text>Reduce spacing and font size for denser layouts</Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="notifications">
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              {notifSaved && (
                <SectionMessage
                  closeButton
                  onCloseChange={() => setNotifSaved(false)}
                >
                  <SectionMessage.Title>
                    Notification preferences saved!
                  </SectionMessage.Title>
                  <SectionMessage.Content>
                    Your notification preferences have been updated.
                  </SectionMessage.Content>
                </SectionMessage>
              )}
              <Checkbox.Group
                label="Notification Preferences"
                value={notifPrefs}
                onChange={setNotifPrefs}
              >
                <Checkbox
                  value="email-messages"
                  label="Email notifications for new messages"
                />
                <Checkbox
                  value="push-mentions"
                  label="Push notifications for mentions"
                />
                <Checkbox
                  value="weekly-digest"
                  label="Weekly activity digest"
                />
                <Checkbox
                  value="marketing"
                  label="Marketing and promotional emails"
                />
              </Checkbox.Group>
              <Select
                label="Notification Sound"
                selectedKey={notifSound}
                onChange={(key) => setNotifSound(String(key))}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>
              <Button variant="primary" onPress={() => setNotifSaved(true)}>
                Save Notification Preferences
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="privacy">
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              {privacySaved && (
                <SectionMessage
                  closeButton
                  onCloseChange={() => setPrivacySaved(false)}
                >
                  <SectionMessage.Title>
                    Privacy settings saved!
                  </SectionMessage.Title>
                  <SectionMessage.Content>
                    Your privacy settings have been updated.
                  </SectionMessage.Content>
                </SectionMessage>
              )}
              <Radio.Group
                label="Profile Visibility"
                value={visibility}
                onChange={(v) => setVisibility(v as Visibility)}
              >
                <Radio value="public">Public</Radio>
                <Radio value="team-only">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>
              <Switch
                label="Show Online Status"
                selected={showOnline}
                onChange={setShowOnline}
              />
              <Stack space={1}>
                <Switch
                  label="Allow Search Engines"
                  selected={allowSearch}
                  onChange={setAllowSearch}
                  disabled={visibility !== 'public'}
                />
                <Text>Let search engines index your public profile</Text>
              </Stack>
              <Button variant="primary" onPress={() => setPrivacySaved(true)}>
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      </Stack>
    </Inset>
  );
};

export default SettingsPage;
