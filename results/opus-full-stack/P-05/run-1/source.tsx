import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Headline,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
  ToastProvider,
  useToast,
} from '@marigold/components';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SettingsPage = () => {
  const { addToast } = useToast();

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [displayNameError, setDisplayNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Appearance state
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<string[]>([
    'email-messages',
  ]);
  const [notificationSound, setNotificationSound] = useState<string>('default');

  // Privacy state
  const [visibility, setVisibility] = useState('public');
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);

  const isPublic = visibility === 'public';

  const handleSaveProfile = () => {
    const nameInvalid = displayName.trim().length === 0;
    const emailInvalid = !EMAIL_REGEX.test(email);
    setDisplayNameError(nameInvalid);
    setEmailError(emailInvalid);

    if (nameInvalid || emailInvalid) {
      addToast({
        title: 'Please fix the highlighted fields',
        variant: 'error',
      });
      return;
    }

    addToast({ title: 'Profile saved', variant: 'success' });
  };

  const handleSaveNotifications = () => {
    addToast({
      title: 'Notification preferences saved',
      variant: 'success',
    });
  };

  const handleSavePrivacy = () => {
    addToast({ title: 'Privacy settings saved', variant: 'success' });
  };

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Stack space={6}>
        <Headline level={1}>Settings</Headline>
        <Accordion defaultExpandedKeys={['profile']}>
          <Accordion.Item id="profile">
            <Accordion.Header>Profile</Accordion.Header>
            <Accordion.Content>
              <Stack space={4}>
                <TextField
                  label="Display Name"
                  value={displayName}
                  onChange={value => {
                    setDisplayName(value);
                    if (displayNameError && value.trim().length > 0) {
                      setDisplayNameError(false);
                    }
                  }}
                  required
                  error={displayNameError}
                  errorMessage="Display name is required."
                />
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={value => {
                    setEmail(value);
                    if (emailError && EMAIL_REGEX.test(value)) {
                      setEmailError(false);
                    }
                  }}
                  required
                  error={emailError}
                  errorMessage="Enter a valid email address."
                />
                <TextArea
                  label="Bio"
                  value={bio}
                  onChange={setBio}
                  rows={4}
                  description="Optional — tell others a little about yourself."
                />
                <Button variant="primary" onPress={handleSaveProfile}>
                  Save Profile
                </Button>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item id="appearance">
            <Accordion.Header>Appearance</Accordion.Header>
            <Accordion.Content>
              <Stack space={5}>
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
                  onSelectionChange={key => setLanguage(key as string)}
                >
                  <Select.Option id="en">English</Select.Option>
                  <Select.Option id="de">German</Select.Option>
                  <Select.Option id="fr">French</Select.Option>
                </Select>
                <Stack space={1}>
                  <Switch
                    label="Compact Mode"
                    selected={compactMode}
                    onChange={setCompactMode}
                  />
                  <Text fontSize="xs" color="text-secondary">
                    Reduce spacing and font size for denser layouts
                  </Text>
                </Stack>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item id="notifications">
            <Accordion.Header>Notifications</Accordion.Header>
            <Accordion.Content>
              <Stack space={5}>
                <Checkbox.Group
                  label="Notifications"
                  value={notifications}
                  onChange={setNotifications}
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
                  selectedKey={notificationSound}
                  onSelectionChange={key =>
                    setNotificationSound(key as string)
                  }
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

          <Accordion.Item id="privacy">
            <Accordion.Header>Privacy</Accordion.Header>
            <Accordion.Content>
              <Stack space={5}>
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
                  selected={onlineStatus}
                  onChange={setOnlineStatus}
                />
                <Stack space={1}>
                  <Switch
                    label="Allow Search Engines"
                    selected={isPublic && allowSearchEngines}
                    onChange={setAllowSearchEngines}
                    disabled={!isPublic}
                  />
                  <Text fontSize="xs" color="text-secondary">
                    {isPublic
                      ? 'Let search engines index your public profile'
                      : 'Let search engines index your public profile. Available only when profile visibility is Public.'}
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
    </>
  );
};

const TestApp = () => <SettingsPage />;

export default TestApp;
