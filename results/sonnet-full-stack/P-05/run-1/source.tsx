import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Inset,
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

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('english');
  const [compactMode, setCompactMode] = useState(false);

  const [notificationPrefs, setNotificationPrefs] = useState<string[]>([]);
  const [notificationSound, setNotificationSound] = useState<string>('default');

  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);

  const searchEnginesDisabled = profileVisibility !== 'public';

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Inset spaceX={6} spaceY={4}>
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
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <TextArea
                  label="Bio"
                  value={bio}
                  onChange={setBio}
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
                  onSelectionChange={key => setLanguage(key as string)}
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
                  <Text size="xs">Reduce spacing and font size for denser layouts</Text>
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
                  value={notificationPrefs}
                  onChange={setNotificationPrefs}
                >
                  <Checkbox value="email-messages" label="Email notifications for new messages" />
                  <Checkbox value="push-mentions" label="Push notifications for mentions" />
                  <Checkbox value="weekly-digest" label="Weekly activity digest" />
                  <Checkbox value="marketing" label="Marketing and promotional emails" />
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
                <Button
                  variant="primary"
                  onPress={() =>
                    addToast({ title: 'Notification preferences saved', variant: 'success' })
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
                  value={profileVisibility}
                  onChange={setProfileVisibility}
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
                    selected={allowSearchEngines}
                    onChange={setAllowSearchEngines}
                    disabled={searchEnginesDisabled}
                  />
                  <Text size="xs">Let search engines index your public profile</Text>
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
      </Inset>
    </>
  );
};

export default SettingsPage;
