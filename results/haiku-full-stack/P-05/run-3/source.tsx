import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Container,
  Form,
  Headline,
  Radio,
  Select,
  Stack,
  Switch,
  TextArea,
  TextField,
  ToastProvider,
  Text,
  useToast,
} from '@marigold/components';

const SettingsContent = () => {
  const { addToast } = useToast();

  // Profile section state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Appearance section state
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('english');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications section state
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationSound, setNotificationSound] = useState('default');

  // Privacy section state
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);

  const handleProfileSave = () => {
    addToast({ title: 'Profile saved successfully!', variant: 'success' });
  };

  const handleNotificationsSave = () => {
    addToast({ title: 'Notification preferences saved!', variant: 'success' });
  };

  const handlePrivacySave = () => {
    addToast({ title: 'Privacy settings saved!', variant: 'success' });
  };

  const isSearchDisabled = visibility !== 'public';

  return (
    <Stack space="section">
      <Stack space="tight">
        <Headline level={1}>Settings</Headline>
        <Text variant="muted">Manage your account preferences and settings</Text>
      </Stack>

      <Accordion>
          {/* Profile Section */}
          <Accordion.Item>
            <Accordion.Header>Profile</Accordion.Header>
            <Accordion.Content>
              <Form>
                <Stack space="regular">
                  <TextField
                    label="Display Name"
                    value={displayName}
                    onChange={setDisplayName}
                    required
                    description="Your name will be visible to other users"
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    description="We'll use this for account notifications"
                  />
                  <TextArea
                    label="Bio"
                    value={bio}
                    onChange={setBio}
                    description="Optional. Tell us about yourself"
                    rows={4}
                  />
                  <Button variant="primary" onPress={handleProfileSave}>
                    Save Profile
                  </Button>
                </Stack>
              </Form>
            </Accordion.Content>
          </Accordion.Item>

          {/* Appearance Section */}
          <Accordion.Item>
            <Accordion.Header>Appearance</Accordion.Header>
            <Accordion.Content>
              <Stack space="regular">
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
                  onSelectionChange={(key) => {
                    if (key !== null) {
                      setLanguage(String(key));
                    }
                  }}
                >
                  <Select.Option id="english">English</Select.Option>
                  <Select.Option id="german">German</Select.Option>
                  <Select.Option id="french">French</Select.Option>
                </Select>

                <Switch
                  label="Compact Mode"
                  selected={compactMode}
                  onChange={setCompactMode}
                />
                <Text size="xs" variant="muted">Reduce spacing and font size for denser layouts</Text>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          {/* Notifications Section */}
          <Accordion.Item>
            <Accordion.Header>Notifications</Accordion.Header>
            <Accordion.Content>
              <Stack space="regular">
                <Checkbox.Group
                  aria-label="Notification preferences"
                  value={notifications}
                  onChange={setNotifications}
                >
                  <Checkbox value="newMessages" label="Email notifications for new messages" />
                  <Checkbox value="mentions" label="Push notifications for mentions" />
                  <Checkbox value="weeklyDigest" label="Weekly activity digest" />
                  <Checkbox value="marketing" label="Marketing and promotional emails" />
                </Checkbox.Group>

                <Select
                  label="Notification Sound"
                  selectedKey={notificationSound}
                  onSelectionChange={(key) => {
                    if (key !== null) {
                      setNotificationSound(String(key));
                    }
                  }}
                >
                  <Select.Option id="default">Default</Select.Option>
                  <Select.Option id="chime">Chime</Select.Option>
                  <Select.Option id="none">None</Select.Option>
                </Select>

                <Button variant="primary" onPress={handleNotificationsSave}>
                  Save Notification Preferences
                </Button>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          {/* Privacy Section */}
          <Accordion.Item>
            <Accordion.Header>Privacy</Accordion.Header>
            <Accordion.Content>
              <Stack space="regular">
                <Radio.Group
                  label="Profile Visibility"
                  value={visibility}
                  onChange={setVisibility}
                >
                  <Radio value="public">Public</Radio>
                  <Radio value="team">Team Only</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>

                <Switch
                  label="Show Online Status"
                  selected={showOnlineStatus}
                  onChange={setShowOnlineStatus}
                />

                <Stack space="tight">
                  <Switch
                    label="Allow Search Engines"
                    selected={allowSearch}
                    onChange={setAllowSearch}
                    disabled={isSearchDisabled}
                  />
                  <Text size="xs" variant="muted">Let search engines index your public profile</Text>
                </Stack>

                <Button variant="primary" onPress={handlePrivacySave}>
                  Save Privacy Settings
                </Button>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
    </Stack>
  );
};

const TestApp = () => {
  return (
    <>
      <ToastProvider position="bottom-right" />
      <Container>
        <SettingsContent />
      </Container>
    </>
  );
};

export default TestApp;
