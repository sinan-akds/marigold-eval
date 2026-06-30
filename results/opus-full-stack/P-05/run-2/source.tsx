import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Container,
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

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const SettingsPage = () => {
  const { addToast } = useToast();

  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSubmitted, setProfileSubmitted] = useState(false);

  const displayNameError = profileSubmitted && displayName.trim().length === 0;
  const emailError =
    (profileSubmitted && email.trim().length === 0) ||
    (email.length > 0 && !EMAIL_REGEX.test(email));

  const handleSaveProfile = () => {
    setProfileSubmitted(true);
    if (displayName.trim().length === 0 || !EMAIL_REGEX.test(email)) {
      addToast({
        title: 'Please fix the highlighted fields',
        variant: 'error',
      });
      return;
    }
    addToast({ title: 'Profile saved', variant: 'success' });
  };

  // Appearance
  const [appearanceTheme, setAppearanceTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([
    'email-messages',
  ]);
  const [notificationSound, setNotificationSound] = useState('default');

  const handleSaveNotifications = () => {
    addToast({ title: 'Notification preferences saved', variant: 'success' });
  };

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const isPublic = visibility === 'public';

  const handleSavePrivacy = () => {
    addToast({ title: 'Privacy settings saved', variant: 'success' });
  };

  return (
    <Container>
      <ToastProvider position="bottom-right" />
      <Stack space={6}>
        <Headline level={1}>Settings</Headline>

        <Accordion defaultExpandedKeys={['profile']} allowsMultipleExpanded>
          {/* Section 1: Profile */}
          <Accordion.Item id="profile">
            <Accordion.Header>Profile</Accordion.Header>
            <Accordion.Content>
              <Stack space={4}>
                <TextField
                  label="Display Name"
                  required
                  value={displayName}
                  onChange={setDisplayName}
                  error={displayNameError}
                  errorMessage="Display name is required."
                />
                <TextField
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={setEmail}
                  error={emailError}
                  errorMessage="Please enter a valid email address."
                />
                <TextArea
                  label="Bio"
                  rows={4}
                  value={bio}
                  onChange={setBio}
                  description="Optional. Tell others a little about yourself."
                />
                <Button variant="primary" onPress={handleSaveProfile}>
                  Save Profile
                </Button>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          {/* Section 2: Appearance */}
          <Accordion.Item id="appearance">
            <Accordion.Header>Appearance</Accordion.Header>
            <Accordion.Content>
              <Stack space={4}>
                <Radio.Group
                  label="Theme"
                  value={appearanceTheme}
                  onChange={setAppearanceTheme}
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
                  <Text color="text-muted" fontSize="sm">
                    Reduce spacing and font size for denser layouts
                  </Text>
                </Stack>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          {/* Section 3: Notifications */}
          <Accordion.Item id="notifications">
            <Accordion.Header>Notifications</Accordion.Header>
            <Accordion.Content>
              <Stack space={4}>
                <Checkbox.Group
                  label="Notify me about"
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
                  onSelectionChange={key => setNotificationSound(key as string)}
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

          {/* Section 4: Privacy */}
          <Accordion.Item id="privacy">
            <Accordion.Header>Privacy</Accordion.Header>
            <Accordion.Content>
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
                  label="Show Online Status"
                  selected={showOnlineStatus}
                  onChange={setShowOnlineStatus}
                />
                <Stack space={1}>
                  <Switch
                    label="Allow Search Engines"
                    selected={isPublic && allowSearchEngines}
                    onChange={setAllowSearchEngines}
                    disabled={!isPublic}
                  />
                  <Text color="text-muted" fontSize="sm">
                    {isPublic
                      ? 'Let search engines index your public profile'
                      : 'Let search engines index your public profile. Only available when your profile is Public.'}
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
    </Container>
  );
};

const TestApp = () => <SettingsPage />;

export default TestApp;
