import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Inline,
  RadioGroup,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextField,
  Textarea,
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
  const [emailNotif, setEmailNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [notifSound, setNotifSound] = useState('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnline, setShowOnline] = useState(false);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const saveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const saveNotif = () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const savePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  return (
    <Stack space={4}>
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
            <Textarea
              label="Bio"
              value={bio}
              onChange={setBio}
            />
            <Stack space={2}>
              <Button variant="primary" onPress={saveProfile}>
                Save Profile
              </Button>
              {profileSaved && <Text>Profile saved successfully.</Text>}
            </Stack>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="appearance" title="Appearance">
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
        </Accordion.Item>

        <Accordion.Item id="notifications" title="Notifications">
          <Stack space={4}>
            <Stack space={2}>
              <Checkbox isSelected={emailNotif} onChange={setEmailNotif}>
                Email notifications for new messages
              </Checkbox>
              <Checkbox isSelected={pushNotif} onChange={setPushNotif}>
                Push notifications for mentions
              </Checkbox>
              <Checkbox isSelected={weeklyDigest} onChange={setWeeklyDigest}>
                Weekly activity digest
              </Checkbox>
              <Checkbox isSelected={marketing} onChange={setMarketing}>
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
            <Stack space={2}>
              <Button variant="primary" onPress={saveNotif}>
                Save Notification Preferences
              </Button>
              {notifSaved && <Text>Notification preferences saved.</Text>}
            </Stack>
          </Stack>
        </Accordion.Item>

        <Accordion.Item id="privacy" title="Privacy">
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
            <Switch isSelected={showOnline} onChange={setShowOnline}>
              Show Online Status
            </Switch>
            <Switch
              isSelected={allowSearch}
              onChange={setAllowSearch}
              isDisabled={visibility !== 'public'}
            >
              Allow Search Engines — Let search engines index your public profile
            </Switch>
            <Stack space={2}>
              <Button variant="primary" onPress={savePrivacy}>
                Save Privacy Settings
              </Button>
              {privacySaved && <Text>Privacy settings saved.</Text>}
            </Stack>
          </Stack>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
