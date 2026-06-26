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

const SettingsPage = () => {
  const { addToast } = useToast();

  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifChecked, setNotifChecked] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState<string>('default');

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [searchEngines, setSearchEngines] = useState(false);

  const searchEnginesDisabled = visibility !== 'public';

  const handleVisibilityChange = (val: string) => {
    setVisibility(val);
    if (val !== 'public') {
      setSearchEngines(false);
    }
  };

  return (
    <Stack space={6}>
      <Headline level={2}>Settings</Headline>
      <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>
        <Accordion.Item id="profile">
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
              <Button
                variant="primary"
                onPress={() =>
                  addToast({ title: 'Profile saved successfully', variant: 'success' })
                }
              >
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
                onSelectionChange={key => setLanguage(String(key))}
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
                <Text size="sm" variant="muted">Reduce spacing and font size for denser layouts</Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="notifications">
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Checkbox.Group
                label="Notification Preferences"
                value={notifChecked}
                onChange={setNotifChecked}
              >
                <Checkbox value="email-messages" label="Email notifications for new messages" />
                <Checkbox value="push-mentions" label="Push notifications for mentions" />
                <Checkbox value="weekly-digest" label="Weekly activity digest" />
                <Checkbox value="marketing" label="Marketing and promotional emails" />
              </Checkbox.Group>
              <Select
                label="Notification Sound"
                selectedKey={notifSound}
                onSelectionChange={key => setNotifSound(String(key))}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>
              <Button
                variant="primary"
                onPress={() =>
                  addToast({
                    title: 'Notification preferences saved',
                    variant: 'success',
                  })
                }
              >
                Save Notification Preferences
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item id="privacy">
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Radio.Group
                label="Profile Visibility"
                value={visibility}
                onChange={handleVisibilityChange}
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
                  selected={searchEngines}
                  onChange={setSearchEngines}
                  disabled={searchEnginesDisabled}
                />
                <Text size="sm" variant="muted">Let search engines index your public profile</Text>
              </Stack>
              <Button
                variant="primary"
                onPress={() =>
                  addToast({ title: 'Privacy settings saved', variant: 'success' })
                }
              >
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

const TestApp = () => (
  <>
    <ToastProvider position="bottom-right" />
    <SettingsPage />
  </>
);

export default TestApp;
