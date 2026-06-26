import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Button,
  Checkbox,
  Headline,
  Radio,
  SectionMessage,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const SettingsPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [compactMode, setCompactMode] = useState(false);

  const [notifTypes, setNotifTypes] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState('default');
  const [notifSaved, setNotifSaved] = useState(false);

  const [visibility, setVisibility] = useState('public');
  const [showOnline, setShowOnline] = useState(true);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const saveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const saveNotifications = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const savePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={6}>
          <Headline level={1}>Settings</Headline>
          <Accordion
            allowsMultipleExpanded
            defaultExpandedKeys={[
              'profile',
              'appearance',
              'notifications',
              'privacy',
            ]}
          >
            <Accordion.Item id="profile">
              <Accordion.Header>Profile</Accordion.Header>
              <Accordion.Content>
                <Stack space={4}>
                  {profileSaved && (
                    <SectionMessage>
                      <SectionMessage.Title>Profile saved</SectionMessage.Title>
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
                    rows={4}
                    value={bio}
                    onChange={setBio}
                  />
                  <Button variant="primary" onPress={saveProfile}>
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
                  <Radio.Group
                    label="Language"
                    value={language}
                    onChange={setLanguage}
                  >
                    <Radio value="english">English</Radio>
                    <Radio value="german">German</Radio>
                    <Radio value="french">French</Radio>
                  </Radio.Group>
                  <Stack space={1}>
                    <Switch
                      label="Compact Mode"
                      selected={compactMode}
                      onChange={setCompactMode}
                    />
                    <Text>
                      Reduce spacing and font size for denser layouts
                    </Text>
                  </Stack>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item id="notifications">
              <Accordion.Header>Notifications</Accordion.Header>
              <Accordion.Content>
                <Stack space={4}>
                  {notifSaved && (
                    <SectionMessage>
                      <SectionMessage.Title>
                        Notification preferences saved
                      </SectionMessage.Title>
                      <SectionMessage.Content>
                        Your notification settings have been updated.
                      </SectionMessage.Content>
                    </SectionMessage>
                  )}
                  <Checkbox.Group
                    label="Notification Types"
                    value={notifTypes}
                    onChange={val => setNotifTypes(val)}
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
                  <Radio.Group
                    label="Notification Sound"
                    value={notifSound}
                    onChange={setNotifSound}
                  >
                    <Radio value="default">Default</Radio>
                    <Radio value="chime">Chime</Radio>
                    <Radio value="none">None</Radio>
                  </Radio.Group>
                  <Button variant="primary" onPress={saveNotifications}>
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
                    <SectionMessage>
                      <SectionMessage.Title>
                        Privacy settings saved
                      </SectionMessage.Title>
                      <SectionMessage.Content>
                        Your privacy settings have been updated.
                      </SectionMessage.Content>
                    </SectionMessage>
                  )}
                  <Radio.Group
                    label="Profile Visibility"
                    value={visibility}
                    onChange={setVisibility}
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
                    <Text>
                      Let search engines index your public profile
                    </Text>
                  </Stack>
                  <Button variant="primary" onPress={savePrivacy}>
                    Save Privacy Settings
                  </Button>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default SettingsPage;
