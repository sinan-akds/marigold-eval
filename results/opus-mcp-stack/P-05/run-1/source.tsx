import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Form,
  Headline,
  Radio,
  SectionMessage,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  // --- Profile section state ---
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // --- Appearance section state ---
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // --- Notifications section state ---
  const [notifications, setNotifications] = useState<string[]>([
    'email-messages',
  ]);
  const [notificationSound, setNotificationSound] = useState<string>('default');
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // --- Privacy section state ---
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(true);
  const [privacySaved, setPrivacySaved] = useState(false);

  // Search-engine indexing only applies to a public profile.
  const searchEnginesDisabled = visibility !== 'public';

  const flash = (setter: (value: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    flash(setProfileSaved);
  };

  return (
    <Stack space={6}>
      <Headline level={1}>Settings</Headline>

      <Accordion defaultExpandedKeys={['profile']}>
        {/* Section 1: Profile */}
        <Accordion.Item id="profile">
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Form onSubmit={handleProfileSubmit}>
              <Stack space={4} alignX="left">
                <TextField
                  label="Display Name"
                  name="displayName"
                  value={displayName}
                  onChange={setDisplayName}
                  required
                  errorMessage="Please enter a display name."
                  width="full"
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  errorMessage="Please enter a valid email address."
                  width="full"
                />
                <TextArea
                  label="Bio"
                  name="bio"
                  value={bio}
                  onChange={setBio}
                  description="Optional — tell others a little about yourself."
                  rows={4}
                  width="full"
                />
                {profileSaved && (
                  <SectionMessage variant="success">
                    <SectionMessage.Title>Profile saved</SectionMessage.Title>
                    <SectionMessage.Content>
                      Your profile changes have been saved.
                    </SectionMessage.Content>
                  </SectionMessage>
                )}
                <Button variant="primary" type="submit">
                  Save Profile
                </Button>
              </Stack>
            </Form>
          </Accordion.Content>
        </Accordion.Item>

        {/* Section 2: Appearance */}
        <Accordion.Item id="appearance">
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Stack space={5} alignX="left">
              <Radio.Group label="Theme" value={theme} onChange={setTheme}>
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system">System Default</Radio>
              </Radio.Group>

              <Select
                label="Language"
                selectedKey={language}
                onSelectionChange={key => setLanguage(key as string)}
                width="fit"
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
                <Text fontSize="sm" color="foreground-muted">
                  Reduce spacing and font size for denser layouts.
                </Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Section 3: Notifications */}
        <Accordion.Item id="notifications">
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={5} alignX="left">
              <Checkbox.Group
                label="Notifications"
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
                <Checkbox value="weekly-digest" label="Weekly activity digest" />
                <Checkbox
                  value="marketing"
                  label="Marketing and promotional emails"
                />
              </Checkbox.Group>

              <Select
                label="Notification Sound"
                selectedKey={notificationSound}
                onSelectionChange={key => setNotificationSound(key as string)}
                width="fit"
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              {notificationsSaved && (
                <SectionMessage variant="success">
                  <SectionMessage.Title>Preferences saved</SectionMessage.Title>
                  <SectionMessage.Content>
                    Your notification preferences have been saved.
                  </SectionMessage.Content>
                </SectionMessage>
              )}

              <Button
                variant="primary"
                onPress={() => flash(setNotificationsSaved)}
              >
                Save Notification Preferences
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Section 4: Privacy */}
        <Accordion.Item id="privacy">
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={5} alignX="left">
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
                  selected={!searchEnginesDisabled && allowSearchEngines}
                  onChange={setAllowSearchEngines}
                  disabled={searchEnginesDisabled}
                />
                <Text fontSize="sm" color="foreground-muted">
                  Let search engines index your public profile.
                  {searchEnginesDisabled
                    ? ' Only available when your profile is Public.'
                    : ''}
                </Text>
              </Stack>

              {privacySaved && (
                <SectionMessage variant="success">
                  <SectionMessage.Title>
                    Privacy settings saved
                  </SectionMessage.Title>
                  <SectionMessage.Content>
                    Your privacy settings have been saved.
                  </SectionMessage.Content>
                </SectionMessage>
              )}

              <Button variant="primary" onPress={() => flash(setPrivacySaved)}>
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
