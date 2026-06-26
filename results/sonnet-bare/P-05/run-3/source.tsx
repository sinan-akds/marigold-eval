import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string | null>('english');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState<string | null>('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const showSaved = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <Stack space={6}>
      <Accordion>
        <Accordion.Item id="profile" title="Profile">
          <Stack space={4}>
            <TextField
              label="Display Name"
              value={displayName}
              onChange={setDisplayName}
              required
            />
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <Textarea label="Bio" value={bio} onChange={setBio} />
            {profileSaved && <Text>Profile saved successfully!</Text>}
            <Button onPress={() => showSaved(setProfileSaved)}>Save Profile</Button>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="appearance" title="Appearance">
          <Stack space={4}>
            <RadioGroup label="Theme" value={theme} onChange={setTheme}>
              <RadioGroup.Radio value="light">Light</RadioGroup.Radio>
              <RadioGroup.Radio value="dark">Dark</RadioGroup.Radio>
              <RadioGroup.Radio value="system">System Default</RadioGroup.Radio>
            </RadioGroup>
            <Select
              label="Language"
              selectedKey={language}
              onSelectionChange={(key) => setLanguage(String(key))}
            >
              <Select.Option key="english">English</Select.Option>
              <Select.Option key="german">German</Select.Option>
              <Select.Option key="french">French</Select.Option>
            </Select>
            <Switch
              isSelected={compactMode}
              onChange={setCompactMode}
              description="Reduce spacing and font size for denser layouts"
            >
              Compact Mode
            </Switch>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="notifications" title="Notifications">
          <Stack space={4}>
            <CheckboxGroup
              label="Notification Types"
              value={selectedNotifications}
              onChange={setSelectedNotifications}
            >
              <Checkbox value="email">Email notifications for new messages</Checkbox>
              <Checkbox value="push">Push notifications for mentions</Checkbox>
              <Checkbox value="weekly">Weekly activity digest</Checkbox>
              <Checkbox value="marketing">Marketing and promotional emails</Checkbox>
            </CheckboxGroup>
            <Select
              label="Notification Sound"
              selectedKey={notifSound}
              onSelectionChange={(key) => setNotifSound(String(key))}
            >
              <Select.Option key="default">Default</Select.Option>
              <Select.Option key="chime">Chime</Select.Option>
              <Select.Option key="none">None</Select.Option>
            </Select>
            {notifSaved && <Text>Notification preferences saved!</Text>}
            <Button onPress={() => showSaved(setNotifSaved)}>
              Save Notification Preferences
            </Button>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="privacy" title="Privacy">
          <Stack space={4}>
            <RadioGroup
              label="Profile Visibility"
              value={visibility}
              onChange={setVisibility}
            >
              <RadioGroup.Radio value="public">Public</RadioGroup.Radio>
              <RadioGroup.Radio value="team">Team Only</RadioGroup.Radio>
              <RadioGroup.Radio value="private">Private</RadioGroup.Radio>
            </RadioGroup>
            <Switch isSelected={showOnlineStatus} onChange={setShowOnlineStatus}>
              Show Online Status
            </Switch>
            <Switch
              isSelected={allowSearch}
              onChange={setAllowSearch}
              isDisabled={visibility !== 'public'}
              description="Let search engines index your public profile"
            >
              Allow Search Engines
            </Switch>
            {privacySaved && <Text>Privacy settings saved!</Text>}
            <Button onPress={() => showSaved(setPrivacySaved)}>
              Save Privacy Settings
            </Button>
          </Stack>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
