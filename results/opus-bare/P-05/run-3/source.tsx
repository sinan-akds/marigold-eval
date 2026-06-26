import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Headline,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  // --- Profile state ---
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const emailInvalid = email.length > 0 && !EMAIL_REGEX.test(email);

  // --- Appearance state ---
  const [themeChoice, setThemeChoice] = useState('system');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // --- Notifications state ---
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationSound, setNotificationSound] = useState('default');
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // --- Privacy state ---
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const searchEnginesDisabled = visibility !== 'public';

  const flashConfirmation = (setter: (value: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>

      <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>
        {/* ---------------- Profile ---------------- */}
        <Accordion.Item id="profile" key="profile" title="Profile">
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
              error={emailInvalid}
              errorMessage="Please enter a valid email address."
            />
            <TextArea
              label="Bio"
              description="Optional"
              value={bio}
              onChange={setBio}
            />
            <Stack space={2} alignX="left">
              <Button
                variant="primary"
                onPress={() => flashConfirmation(setProfileSaved)}
              >
                Save Profile
              </Button>
              {profileSaved && <Text>Profile saved.</Text>}
            </Stack>
          </Stack>
        </Accordion.Item>

        {/* ---------------- Appearance ---------------- */}
        <Accordion.Item id="appearance" key="appearance" title="Appearance">
          <Stack space={4}>
            <RadioGroup
              label="Theme"
              value={themeChoice}
              onChange={setThemeChoice}
            >
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

            <Stack space={1}>
              <Switch checked={compactMode} onChange={setCompactMode}>
                Compact Mode
              </Switch>
              <Text>Reduce spacing and font size for denser layouts.</Text>
            </Stack>
          </Stack>
        </Accordion.Item>

        {/* ---------------- Notifications ---------------- */}
        <Accordion.Item id="notifications" key="notifications" title="Notifications">
          <Stack space={4}>
            <Checkbox.Group
              label="Notifications"
              value={notifications}
              onChange={setNotifications}
            >
              <Checkbox value="email-messages">
                Email notifications for new messages
              </Checkbox>
              <Checkbox value="push-mentions">
                Push notifications for mentions
              </Checkbox>
              <Checkbox value="weekly-digest">Weekly activity digest</Checkbox>
              <Checkbox value="marketing">
                Marketing and promotional emails
              </Checkbox>
            </Checkbox.Group>

            <Select
              label="Notification Sound"
              selectedKey={notificationSound}
              onSelectionChange={(key) => setNotificationSound(String(key))}
            >
              <Select.Option id="default">Default</Select.Option>
              <Select.Option id="chime">Chime</Select.Option>
              <Select.Option id="none">None</Select.Option>
            </Select>

            <Stack space={2} alignX="left">
              <Button
                variant="primary"
                onPress={() => flashConfirmation(setNotificationsSaved)}
              >
                Save Notification Preferences
              </Button>
              {notificationsSaved && (
                <Text>Notification preferences saved.</Text>
              )}
            </Stack>
          </Stack>
        </Accordion.Item>

        {/* ---------------- Privacy ---------------- */}
        <Accordion.Item id="privacy" key="privacy" title="Privacy">
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

            <Switch
              checked={showOnlineStatus}
              onChange={setShowOnlineStatus}
            >
              Show Online Status
            </Switch>

            <Stack space={1}>
              <Switch
                checked={allowSearchEngines && !searchEnginesDisabled}
                onChange={setAllowSearchEngines}
                disabled={searchEnginesDisabled}
              >
                Allow Search Engines
              </Switch>
              <Text>Let search engines index your public profile.</Text>
            </Stack>

            <Stack space={2} alignX="left">
              <Button
                variant="primary"
                onPress={() => flashConfirmation(setPrivacySaved)}
              >
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
