import { useState } from 'react';
import {
  Accordion,
  AppLayout,
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

export default function TestApp() {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
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
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  const handleSaveProfile = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    flash(setProfileSaved);
  };

  const handleVisibilityChange = (val: string) => {
    setVisibility(val);
    if (val !== 'public') {
      setAllowSearchEngines(false);
    }
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={6}>
          <Headline level={1}>Settings</Headline>
          <Headline level={2}>Account preferences</Headline>
          <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>
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
                    onChange={(val) => {
                      setEmail(val);
                      if (emailError) setEmailError(false);
                    }}
                    error={emailError}
                    errorMessage="Please enter a valid email address."
                  />
                  <TextArea
                    label="Bio"
                    value={bio}
                    onChange={setBio}
                    description="Optional. Tell others a bit about yourself."
                  />
                  <Inline space={4} alignY="center">
                    <Button variant="primary" onPress={handleSaveProfile}>
                      Save Profile
                    </Button>
                    {profileSaved && <Text>Profile saved successfully!</Text>}
                  </Inline>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item id="appearance">
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
                      label="Compact Mode"
                      selected={compactMode}
                      onChange={setCompactMode}
                    />
                    <Text>Reduce spacing and font size for denser layouts</Text>
                  </Stack>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item id="notifications">
              <Accordion.Header>Notifications</Accordion.Header>
              <Accordion.Content>
                <Stack space={4}>
                  <Checkbox.Group
                    label="Notification Types"
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
                    <Checkbox value="digest" label="Weekly activity digest" />
                    <Checkbox
                      value="marketing"
                      label="Marketing and promotional emails"
                    />
                  </Checkbox.Group>
                  <Select
                    label="Notification Sound"
                    selectedKey={notifSound}
                    onSelectionChange={(key) => setNotifSound(String(key))}
                  >
                    <Select.Option id="default">Default</Select.Option>
                    <Select.Option id="chime">Chime</Select.Option>
                    <Select.Option id="none">None</Select.Option>
                  </Select>
                  <Inline space={4} alignY="center">
                    <Button variant="primary" onPress={() => flash(setNotifSaved)}>
                      Save Notification Preferences
                    </Button>
                    {notifSaved && <Text>Notification preferences saved!</Text>}
                  </Inline>
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
                    selected={showOnlineStatus}
                    onChange={setShowOnlineStatus}
                  />
                  <Stack space={1}>
                    <Switch
                      label="Allow Search Engines"
                      selected={allowSearchEngines}
                      onChange={setAllowSearchEngines}
                      disabled={visibility !== 'public'}
                    />
                    <Text>Let search engines index your public profile</Text>
                  </Stack>
                  <Inline space={4} alignY="center">
                    <Button variant="primary" onPress={() => flash(setPrivacySaved)}>
                      Save Privacy Settings
                    </Button>
                    {privacySaved && <Text>Privacy settings saved!</Text>}
                  </Inline>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
}
