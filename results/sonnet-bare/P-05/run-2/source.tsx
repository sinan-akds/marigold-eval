import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Inline,
  Radio,
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
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notifSound, setNotifSound] = useState('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [searchEngines, setSearchEngines] = useState(true);
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

  const isSearchDisabled = visibility !== 'public';

  return (
    <Accordion>
      <Accordion.Item id="profile">
        <Accordion.Header>Profile</Accordion.Header>
        <Accordion.Panel>
          <Stack space={4}>
            <TextField
              label="Display Name"
              value={displayName}
              onChange={setDisplayName}
              isRequired
            />
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <Textarea
              label="Bio"
              value={bio}
              onChange={setBio}
            />
            <Inline space={4}>
              <Button variant="primary" onPress={handleSaveProfile}>
                Save Profile
              </Button>
              {profileSaved && <Text>Profile saved successfully!</Text>}
            </Inline>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item id="appearance">
        <Accordion.Header>Appearance</Accordion.Header>
        <Accordion.Panel>
          <Stack space={4}>
            <RadioGroup label="Theme" value={theme} onChange={setTheme}>
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
              <Radio value="system">System Default</Radio>
            </RadioGroup>
            <Select
              label="Language"
              selectedKey={language}
              onSelectionChange={(key) => setLanguage(String(key))}
            >
              <Select.Option id="en">English</Select.Option>
              <Select.Option id="de">German</Select.Option>
              <Select.Option id="fr">French</Select.Option>
            </Select>
            <Switch isSelected={compactMode} onChange={setCompactMode}>
              Compact Mode — Reduce spacing and font size for denser layouts
            </Switch>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item id="notifications">
        <Accordion.Header>Notifications</Accordion.Header>
        <Accordion.Panel>
          <Stack space={4}>
            <Stack space={2}>
              <Checkbox isSelected={emailNotifs} onChange={setEmailNotifs}>
                Email notifications for new messages
              </Checkbox>
              <Checkbox isSelected={pushNotifs} onChange={setPushNotifs}>
                Push notifications for mentions
              </Checkbox>
              <Checkbox isSelected={weeklyDigest} onChange={setWeeklyDigest}>
                Weekly activity digest
              </Checkbox>
              <Checkbox isSelected={marketingEmails} onChange={setMarketingEmails}>
                Marketing and promotional emails
              </Checkbox>
            </Stack>
            <Select
              label="Notification Sound"
              selectedKey={notifSound}
              onSelectionChange={(key) => setNotifSound(String(key))}
            >
              <Select.Option id="default">Default</Select.Option>
              <Select.Option id="chime">Chime</Select.Option>
              <Select.Option id="none">None</Select.Option>
            </Select>
            <Inline space={4}>
              <Button variant="primary" onPress={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
              {notifSaved && <Text>Notification preferences saved!</Text>}
            </Inline>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item id="privacy">
        <Accordion.Header>Privacy</Accordion.Header>
        <Accordion.Panel>
          <Stack space={4}>
            <RadioGroup
              label="Profile Visibility"
              value={visibility}
              onChange={setVisibility}
            >
              <Radio value="public">Public</Radio>
              <Radio value="team">Team Only</Radio>
              <Radio value="private">Private</Radio>
            </RadioGroup>
            <Switch isSelected={onlineStatus} onChange={setOnlineStatus}>
              Show Online Status
            </Switch>
            <Switch
              isSelected={searchEngines}
              onChange={setSearchEngines}
              isDisabled={isSearchDisabled}
            >
              Allow Search Engines — Let search engines index your public profile
            </Switch>
            <Inline space={4}>
              <Button variant="primary" onPress={handleSavePrivacy}>
                Save Privacy Settings
              </Button>
              {privacySaved && <Text>Privacy settings saved!</Text>}
            </Inline>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default TestApp;
