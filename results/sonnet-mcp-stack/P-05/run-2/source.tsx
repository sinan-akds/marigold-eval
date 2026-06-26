import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Inline,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState<string>('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const isEmailValid =
    !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  return (
    <Stack space={6}>
      <Text size="3xl" weight="bold">
        Settings
      </Text>

      <Accordion allowsMultipleExpanded>
        {/* ── Profile ───────────────────────────────────────────── */}
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
                  setEmailTouched(true);
                }}
                error={emailTouched && !isEmailValid}
                errorMessage="Please enter a valid email address."
              />
              <TextArea
                label="Bio"
                value={bio}
                onChange={setBio}
                rows={4}
              />
              <Stack space={2}>
                <Inline space={2}>
                  <Button variant="primary" onPress={handleSaveProfile}>
                    Save Profile
                  </Button>
                </Inline>
                {profileSaved && (
                  <Text variant="muted">Profile saved successfully!</Text>
                )}
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* ── Appearance ────────────────────────────────────────── */}
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
                <Text variant="muted" size="sm">
                  Reduce spacing and font size for denser layouts
                </Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* ── Notifications ─────────────────────────────────────── */}
        <Accordion.Item id="notifications">
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Checkbox.Group
                label="Notification preferences"
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
                selectedKey={notifSound}
                onSelectionChange={(key) => setNotifSound(String(key))}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              <Stack space={2}>
                <Inline space={2}>
                  <Button
                    variant="primary"
                    onPress={handleSaveNotifications}
                  >
                    Save Notification Preferences
                  </Button>
                </Inline>
                {notifSaved && (
                  <Text variant="muted">
                    Notification preferences saved!
                  </Text>
                )}
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* ── Privacy ───────────────────────────────────────────── */}
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
                  selected={allowSearch}
                  onChange={setAllowSearch}
                  disabled={visibility !== 'public'}
                />
                <Text variant="muted" size="sm">
                  Let search engines index your public profile
                </Text>
              </Stack>

              <Stack space={2}>
                <Inline space={2}>
                  <Button variant="primary" onPress={handleSavePrivacy}>
                    Save Privacy Settings
                  </Button>
                </Inline>
                {privacySaved && (
                  <Text variant="muted">Privacy settings saved!</Text>
                )}
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
