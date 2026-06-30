import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Headline,
  Inline,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const TestApp = () => {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance
  const [theme, setTheme] = useState<string>('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationSound, setNotificationSound] = useState<string>('default');
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState<string>('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const searchEnginesDisabled = visibility !== 'public';

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>

      <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>
        <Accordion.Item id="profile" key="profile" title="Profile">
          <Stack space={4}>
            <TextField
              label="Display Name"
              isRequired
              value={displayName}
              onChange={setDisplayName}
            />
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              validate={(value) =>
                value && !isValidEmail(value)
                  ? 'Please enter a valid email address.'
                  : null
              }
            />
            <TextArea
              label="Bio"
              value={bio}
              onChange={setBio}
              description="Optional"
            />
            <Inline>
              <Button variant="primary" onPress={handleSaveProfile}>
                Save Profile
              </Button>
            </Inline>
            {profileSaved && (
              <Text color="green">Profile saved successfully.</Text>
            )}
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="appearance" key="appearance" title="Appearance">
          <Stack space={4}>
            <Radio.Group label="Theme" value={theme} onChange={setTheme}>
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
              <Radio value="system">System Default</Radio>
            </Radio.Group>
            <Select
              label="Language"
              selectedKey={language}
              onSelectionChange={(key) => setLanguage(String(key))}
            >
              <Select.Option id="en">English</Select.Option>
              <Select.Option id="de">German</Select.Option>
              <Select.Option id="fr">French</Select.Option>
            </Select>
            <Stack space={1}>
              <Switch
                isSelected={compactMode}
                onChange={setCompactMode}
              >
                Compact Mode
              </Switch>
              <Text fontSize="xs" color="text-secondary">
                Reduce spacing and font size for denser layouts.
              </Text>
            </Stack>
          </Stack>
        </Accordion.Item>

        <Accordion.Item
          id="notifications"
          key="notifications"
          title="Notifications"
        >
          <Stack space={4}>
            <Checkbox.Group
              label="Notifications"
              value={notifications}
              onChange={setNotifications}
            >
              <Checkbox value="email-messages">
                Email notifications for new messages
              </Checkbox>
              <Checkbox value="push-mentions">
                Push notifications for mentions
              </Checkbox>
              <Checkbox value="weekly-digest">Weekly activity digest</Checkbox>
              <Checkbox value="marketing">
                Marketing and promotional emails
              </Checkbox>
            </Checkbox.Group>
            <Select
              label="Notification Sound"
              selectedKey={notificationSound}
              onSelectionChange={(key) => setNotificationSound(String(key))}
            >
              <Select.Option id="default">Default</Select.Option>
              <Select.Option id="chime">Chime</Select.Option>
              <Select.Option id="none">None</Select.Option>
            </Select>
            <Inline>
              <Button variant="primary" onPress={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </Inline>
            {notificationsSaved && (
              <Text color="green">Notification preferences saved.</Text>
            )}
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="privacy" key="privacy" title="Privacy">
          <Stack space={4}>
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
              isSelected={showOnlineStatus}
              onChange={setShowOnlineStatus}
            >
              Show Online Status
            </Switch>
            <Stack space={1}>
              <Switch
                isSelected={allowSearchEngines && !searchEnginesDisabled}
                onChange={setAllowSearchEngines}
                isDisabled={searchEnginesDisabled}
              >
                Allow Search Engines
              </Switch>
              <Text fontSize="xs" color="text-secondary">
                Let search engines index your public profile.
              </Text>
            </Stack>
            <Inline>
              <Button variant="primary" onPress={handleSavePrivacy}>
                Save Privacy Settings
              </Button>
            </Inline>
            {privacySaved && (
              <Text color="green">Privacy settings saved.</Text>
            )}
          </Stack>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
