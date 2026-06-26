import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Radio,
  Select,
  Stack,
  Switch,
  TextField,
  TextArea,
  Text,
  useToast,
} from '@marigold/components';

const TestApp = () => {
  const { addToast } = useToast();

  // Profile section state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Appearance section state
  const [theme, setTheme] = useState('system-default');
  const [language, setLanguage] = useState('english');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications section state
  const [notifications, setNotifications] = useState({
    newMessages: false,
    mentions: false,
    digest: false,
    marketing: false,
  });
  const [notificationSound, setNotificationSound] = useState('default');

  // Privacy section state
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);

  const handleSaveProfile = () => {
    addToast({
      title: 'Profile saved',
      variant: 'success',
      timeout: 3000,
    });
  };

  const handleSaveNotifications = () => {
    addToast({
      title: 'Notification preferences saved',
      variant: 'success',
      timeout: 3000,
    });
  };

  const handleSavePrivacy = () => {
    addToast({
      title: 'Privacy settings saved',
      variant: 'success',
      timeout: 3000,
    });
  };

  const isSearchEngineDisabled = profileVisibility !== 'public';

  return (
    <Stack space={6}>
      <Accordion>
        {/* Profile Section */}
        <Accordion.Item>
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <TextField
                label="Display Name"
                value={displayName}
                onChange={setDisplayName}
                required
              />
              <TextField
                type="email"
                label="Email Address"
                value={email}
                onChange={setEmail}
              />
              <TextArea
                label="Bio"
                value={bio}
                onChange={setBio}
                rows={4}
              />
              <Button variant="primary" onPress={handleSaveProfile}>
                Save Profile
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item>
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Radio.Group
                label="Theme"
                value={theme}
                onChange={setTheme}
              >
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system-default">System Default</Radio>
              </Radio.Group>

              <Select
                label="Language"
                selectedKey={language}
                onSelectionChange={key => {
                  if (typeof key === 'string') {
                    setLanguage(key);
                  }
                }}
              >
                <Select.Option id="english">English</Select.Option>
                <Select.Option id="german">German</Select.Option>
                <Select.Option id="french">French</Select.Option>
              </Select>

              <Stack space={2}>
                <Switch
                  label="Compact Mode"
                  selected={compactMode}
                  onChange={setCompactMode}
                />
                <Text fontSize="xs">
                  Reduce spacing and font size for denser layouts
                </Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item>
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Checkbox.Group
                value={Object.keys(notifications).filter(
                  k => notifications[k as keyof typeof notifications]
                )}
                onChange={selected => {
                  setNotifications({
                    newMessages: selected.includes('newMessages'),
                    mentions: selected.includes('mentions'),
                    digest: selected.includes('digest'),
                    marketing: selected.includes('marketing'),
                  });
                }}
              >
                <Checkbox
                  value="newMessages"
                  label="Email notifications for new messages"
                />
                <Checkbox
                  value="mentions"
                  label="Push notifications for mentions"
                />
                <Checkbox
                  value="digest"
                  label="Weekly activity digest"
                />
                <Checkbox
                  value="marketing"
                  label="Marketing and promotional emails"
                />
              </Checkbox.Group>

              <Select
                label="Notification Sound"
                selectedKey={notificationSound}
                onSelectionChange={key => {
                  if (typeof key === 'string') {
                    setNotificationSound(key);
                  }
                }}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              <Button variant="primary" onPress={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item>
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Radio.Group
                label="Profile Visibility"
                value={profileVisibility}
                onChange={setProfileVisibility}
              >
                <Radio value="public">Public</Radio>
                <Radio value="team-only">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>

              <Switch
                label="Show Online Status"
                selected={showOnlineStatus}
                onChange={setShowOnlineStatus}
              />

              <Stack space={2}>
                <Switch
                  label="Allow Search Engines"
                  selected={allowSearchEngines}
                  onChange={setAllowSearchEngines}
                  disabled={isSearchEngineDisabled}
                />
                <Text fontSize="xs">
                  Let search engines index your public profile
                </Text>
              </Stack>

              <Button variant="primary" onPress={handleSavePrivacy}>
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
