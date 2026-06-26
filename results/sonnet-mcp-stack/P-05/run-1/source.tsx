import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Headline,
  Inset,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

export default function SettingsPage() {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifChecked, setNotifChecked] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnline, setShowOnline] = useState(true);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  const searchEnginesDisabled = visibility !== 'public';

  return (
    <Inset spaceX={6} spaceY={6}>
      <Stack space={6}>
        <Headline level={1}>Settings</Headline>

        <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>

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
                <Stack space={2} alignX="left">
                  <Button variant="primary" onPress={handleSaveProfile}>
                    Save Profile
                  </Button>
                  {profileSaved && <Text>Profile saved successfully!</Text>}
                </Stack>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

          {/* Section 2: Appearance */}
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
                  <Text>Reduce spacing and font size for denser layouts</Text>
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
                  label="Notification preferences"
                  value={notifChecked}
                  onChange={setNotifChecked}
                >
                  <Checkbox
                    value="email"
                    label="Email notifications for new messages"
                  />
                  <Checkbox
                    value="push"
                    label="Push notifications for mentions"
                  />
                  <Checkbox value="weekly" label="Weekly activity digest" />
                  <Checkbox
                    value="marketing"
                    label="Marketing and promotional emails"
                  />
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
                <Stack space={2} alignX="left">
                  <Button variant="primary" onPress={handleSaveNotifications}>
                    Save Notification Preferences
                  </Button>
                  {notifSaved && <Text>Notification preferences saved!</Text>}
                </Stack>
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
                  selected={showOnline}
                  onChange={setShowOnline}
                />
                <Stack space={1}>
                  <Switch
                    label="Allow Search Engines"
                    selected={allowSearch}
                    onChange={setAllowSearch}
                    disabled={searchEnginesDisabled}
                  />
                  <Text>Let search engines index your public profile</Text>
                </Stack>
                <Stack space={2} alignX="left">
                  <Button variant="primary" onPress={handleSavePrivacy}>
                    Save Privacy Settings
                  </Button>
                  {privacySaved && <Text>Privacy settings saved!</Text>}
                </Stack>
              </Stack>
            </Accordion.Content>
          </Accordion.Item>

        </Accordion>
      </Stack>
    </Inset>
  );
}
