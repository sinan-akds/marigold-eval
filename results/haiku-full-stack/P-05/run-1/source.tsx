import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Inline,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [compactMode, setCompactMode] = useState(false);

  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationSound, setNotificationSound] = useState('default');
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const isSearchEnginesDisabled = profileVisibility !== 'public';

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 2000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2000);
  };

  return (
    <Stack space={6} alignX="left">
      <Accordion>
        {/* Profile Section */}
        <Accordion.Item>
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Stack space={4} alignX="left">
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
                rows={4}
              />
              <Inline>
                <Button variant="primary" onPress={handleSaveProfile}>
                  Save Profile
                </Button>
                {profileSaved && <Text>Profile saved successfully!</Text>}
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item>
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Stack space={4} alignX="left">
              <Radio.Group
                label="Theme"
                value={theme}
                onChange={setTheme}
              >
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system">System Default</Radio>
              </Radio.Group>

              <Select
                label="Language"
                selectedKey={language}
                onSelectionChange={(key) => setLanguage(key as string)}
              >
                <Select.Option id="english">English</Select.Option>
                <Select.Option id="german">German</Select.Option>
                <Select.Option id="french">French</Select.Option>
              </Select>

              <Stack space={1}>
                <Switch
                  label="Compact Mode"
                  onChange={setCompactMode}
                  selected={compactMode}
                />
                <Text size="sm">Reduce spacing and font size for denser layouts</Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item>
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={4} alignX="left">
              <Checkbox.Group
                value={notifications}
                onChange={setNotifications}
              >
                <Checkbox value="emailNotif" label="Email notifications for new messages" />
                <Checkbox value="pushNotif" label="Push notifications for mentions" />
                <Checkbox value="weeklyDigest" label="Weekly activity digest" />
                <Checkbox value="marketing" label="Marketing and promotional emails" />
              </Checkbox.Group>

              <Select
                label="Notification Sound"
                selectedKey={notificationSound}
                onSelectionChange={(key) => setNotificationSound(key as string)}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              <Inline>
                <Button variant="primary" onPress={handleSaveNotifications}>
                  Save Notification Preferences
                </Button>
                {notificationsSaved && <Text>Preferences saved successfully!</Text>}
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item>
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={4} alignX="left">
              <Radio.Group
                label="Profile Visibility"
                value={profileVisibility}
                onChange={setProfileVisibility}
              >
                <Radio value="public">Public</Radio>
                <Radio value="team">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>

              <Switch
                label="Show Online Status"
                onChange={setShowOnlineStatus}
                selected={showOnlineStatus}
              />

              <Stack space={1}>
                <Switch
                  label="Allow Search Engines"
                  onChange={setAllowSearchEngines}
                  selected={allowSearchEngines}
                  disabled={isSearchEnginesDisabled}
                />
                <Text size="sm">Let search engines index your public profile</Text>
              </Stack>

              <Inline>
                <Button variant="primary" onPress={handleSavePrivacy}>
                  Save Privacy Settings
                </Button>
                {privacySaved && <Text>Privacy settings saved successfully!</Text>}
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
