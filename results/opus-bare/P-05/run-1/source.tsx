import { useState } from 'react';
import {
  Accordion,
  Stack,
  Inset,
  Headline,
  Text,
  TextField,
  TextArea,
  Button,
  Select,
  Switch,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
} from '@marigold/components';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TestApp = () => {
  // --- Profile state ---
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const emailValid = email === '' || EMAIL_PATTERN.test(email);

  // --- Appearance state ---
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // --- Notifications state ---
  const [notifications, setNotifications] = useState<string[]>(['email-messages']);
  const [notificationSound, setNotificationSound] = useState('default');
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // --- Privacy state ---
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const isPublic = visibility === 'public';

  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <Inset space={6}>
      <Stack space={6}>
        <Headline level={1}>Settings</Headline>

        <Accordion
          allowsMultipleExpanded
          defaultExpandedKeys={['profile', 'appearance', 'notifications', 'privacy']}
        >
          {/* ------------------------------------------------------------- */}
          {/* Section 1 — Profile                                            */}
          {/* ------------------------------------------------------------- */}
          <Accordion.Item id="profile" title="Profile">
            <Stack space={4}>
              <TextField
                label="Display Name"
                isRequired
                value={displayName}
                onChange={setDisplayName}
              />
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                error={!emailValid}
                errorMessage="Please enter a valid email address."
              />
              <TextArea
                label="Bio"
                description="Optional"
                value={bio}
                onChange={setBio}
              />
              <Button variant="primary" onPress={() => flash(setProfileSaved)}>
                Save Profile
              </Button>
              {profileSaved && <Text>✓ Profile saved.</Text>}
            </Stack>
          </Accordion.Item>

          {/* ------------------------------------------------------------- */}
          {/* Section 2 — Appearance                                         */}
          {/* ------------------------------------------------------------- */}
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

          {/* ------------------------------------------------------------- */}
          {/* Section 3 — Notifications                                      */}
          {/* ------------------------------------------------------------- */}
          <Accordion.Item id="notifications" title="Notifications">
            <Stack space={4}>
              <CheckboxGroup
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
              </CheckboxGroup>

              <Select
                label="Notification Sound"
                selectedKey={notificationSound}
                onSelectionChange={(key) => setNotificationSound(String(key))}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              <Button
                variant="primary"
                onPress={() => flash(setNotificationsSaved)}
              >
                Save Notification Preferences
              </Button>
              {notificationsSaved && (
                <Text>✓ Notification preferences saved.</Text>
              )}
            </Stack>
          </Accordion.Item>

          {/* ------------------------------------------------------------- */}
          {/* Section 4 — Privacy                                            */}
          {/* ------------------------------------------------------------- */}
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

              <Switch
                isSelected={showOnlineStatus}
                onChange={setShowOnlineStatus}
              >
                Show Online Status
              </Switch>

              <Switch
                isSelected={isPublic && allowSearchEngines}
                onChange={setAllowSearchEngines}
                isDisabled={!isPublic}
              >
                Allow Search Engines — Let search engines index your public profile
              </Switch>

              <Button variant="primary" onPress={() => flash(setPrivacySaved)}>
                Save Privacy Settings
              </Button>
              {privacySaved && <Text>✓ Privacy settings saved.</Text>}
            </Stack>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Inset>
  );
};

export default TestApp;
