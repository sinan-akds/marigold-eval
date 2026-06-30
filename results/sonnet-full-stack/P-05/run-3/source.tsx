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

function ProfileSection() {
  const { addToast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const isValidEmail = (val: string) =>
    val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSave = () => {
    const nameOk = displayName.trim().length > 0;
    const emailOk = isValidEmail(email);
    setNameError(!nameOk);
    setEmailError(!emailOk);
    if (nameOk && emailOk) {
      addToast({ title: 'Profile saved successfully.', variant: 'success', timeout: 3000 });
    }
  };

  return (
    <Stack space={4}>
      <TextField
        label="Display Name"
        value={displayName}
        onChange={setDisplayName}
        required
        error={nameError}
        errorMessage="Display name is required."
      />
      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={setEmail}
        error={emailError}
        errorMessage="Please enter a valid email address."
      />
      <TextArea
        label="Bio"
        value={bio}
        onChange={setBio}
        rows={4}
      />
      <Button variant="primary" onPress={handleSave}>
        Save Profile
      </Button>
    </Stack>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('english');
  const [compactMode, setCompactMode] = useState(false);

  return (
    <Stack space={4}>
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
          selected={compactMode}
          onChange={setCompactMode}
        />
        <Text>Reduce spacing and font size for denser layouts</Text>
      </Stack>
    </Stack>
  );
}

function NotificationsSection() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [sound, setSound] = useState<string>('default');

  const handleSave = () => {
    addToast({ title: 'Notification preferences saved.', variant: 'success', timeout: 3000 });
  };

  return (
    <Stack space={4}>
      <Checkbox.Group
        label="Notification Types"
        value={notifications}
        onChange={setNotifications}
      >
        <Checkbox value="email-messages" label="Email notifications for new messages" />
        <Checkbox value="push-mentions" label="Push notifications for mentions" />
        <Checkbox value="weekly-digest" label="Weekly activity digest" />
        <Checkbox value="marketing" label="Marketing and promotional emails" />
      </Checkbox.Group>
      <Select
        label="Notification Sound"
        selectedKey={sound}
        onSelectionChange={(key) => setSound(key as string)}
      >
        <Select.Option id="default">Default</Select.Option>
        <Select.Option id="chime">Chime</Select.Option>
        <Select.Option id="none">None</Select.Option>
      </Select>
      <Button variant="primary" onPress={handleSave}>
        Save Notification Preferences
      </Button>
    </Stack>
  );
}

function PrivacySection() {
  const { addToast } = useToast();
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);

  const searchEnginesDisabled = visibility !== 'public';

  const handleSave = () => {
    addToast({ title: 'Privacy settings saved.', variant: 'success', timeout: 3000 });
  };

  return (
    <Stack space={4}>
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
        selected={showOnlineStatus}
        onChange={setShowOnlineStatus}
      />
      <Stack space={1}>
        <Switch
          label="Allow Search Engines"
          selected={allowSearchEngines}
          onChange={setAllowSearchEngines}
          disabled={searchEnginesDisabled}
        />
        <Text>Let search engines index your public profile</Text>
      </Stack>
      <Button variant="primary" onPress={handleSave}>
        Save Privacy Settings
      </Button>
    </Stack>
  );
}

const TestApp = () => {
  return (
    <>
      <ToastProvider position="bottom-right" />
      <Stack space={6}>
        <Headline level={1}>Settings</Headline>
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Profile</Accordion.Header>
            <Accordion.Content>
              <ProfileSection />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Appearance</Accordion.Header>
            <Accordion.Content>
              <AppearanceSection />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Notifications</Accordion.Header>
            <Accordion.Content>
              <NotificationsSection />
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>Privacy</Accordion.Header>
            <Accordion.Content>
              <PrivacySection />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </>
  );
};

export default TestApp;
