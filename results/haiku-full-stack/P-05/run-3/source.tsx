import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Radio,
  Select,
  Stack,
  Switch,
  TextField,
  TextArea,
  Inline,
  Text,
  Headline,
  Container,
} from '@marigold/components';

const TestApp = () => {
  // Profile section
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance section
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications section
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notificationSound, setNotificationSound] = useState('');
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // Privacy section
  const [profileVisibility, setProfileVisibility] = useState('');
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  const isProfilePublic = profileVisibility === 'public';

  return (
    <Container>
      <Stack space={4}>
        <Headline level={1}>Settings</Headline>
        <Accordion>
        {/* Profile Section */}
        <Accordion.Item id="profile">
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Stack space={3}>
              <TextField
                label="Display Name"
                required
                value={displayName}
                onChange={setDisplayName}
                description="How your name will appear to others"
              />
              <TextField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                description="Your email address for login and communication"
              />
              <TextArea
                label="Bio"
                value={bio}
                onChange={setBio}
                rows={4}
                description="Optional short biography about yourself"
              />
              <Inline alignX="left" space={2} alignY="center">
                <Button
                  variant="primary"
                  onPress={handleSaveProfile}
                  disabled={!displayName}
                >
                  Save Profile
                </Button>
                {profileSaved && (
                  <Text color="success-500" fontSize="sm">
                    Profile saved successfully
                  </Text>
                )}
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item id="appearance">
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Stack space={3}>
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
                onSelectionChange={key => setLanguage(key as string)}
              >
                <Select.Option id="en">English</Select.Option>
                <Select.Option id="de">German</Select.Option>
                <Select.Option id="fr">French</Select.Option>
              </Select>

              <Stack space={1}>
                <Switch
                  label="Compact Mode"
                  onChange={setCompactMode}
                  selected={compactMode}
                />
                <Text fontSize="xs" color="muted-foreground">
                  Reduce spacing and font size for denser layouts
                </Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item id="notifications">
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={3}>
              <Checkbox.Group
                value={[
                  emailNotifications && 'email',
                  pushNotifications && 'push',
                  weeklyDigest && 'digest',
                  marketingEmails && 'marketing',
                ].filter(Boolean) as string[]}
              >
                <Checkbox
                  value="email"
                  label="Email notifications for new messages"
                  onChange={val => setEmailNotifications(val as boolean)}
                />
                <Checkbox
                  value="push"
                  label="Push notifications for mentions"
                  onChange={val => setPushNotifications(val as boolean)}
                />
                <Checkbox
                  value="digest"
                  label="Weekly activity digest"
                  onChange={val => setWeeklyDigest(val as boolean)}
                />
                <Checkbox
                  value="marketing"
                  label="Marketing and promotional emails"
                  onChange={val => setMarketingEmails(val as boolean)}
                />
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

              <Inline alignX="left" space={2} alignY="center">
                <Button variant="primary" onPress={handleSaveNotifications}>
                  Save Notification Preferences
                </Button>
                {notificationsSaved && (
                  <Text color="success-500" fontSize="sm">
                    Notification preferences saved
                  </Text>
                )}
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item id="privacy">
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={3}>
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
                onChange={setShowOnlineStatus}
                selected={showOnlineStatus}
              />

              <Stack space={1}>
                <Switch
                  label="Allow Search Engines"
                  onChange={setAllowSearchEngines}
                  selected={allowSearchEngines}
                  disabled={!isProfilePublic}
                />
                <Text fontSize="xs" color="muted-foreground">
                  Let search engines index your public profile
                </Text>
              </Stack>

              <Inline alignX="left" space={2} alignY="center">
                <Button variant="primary" onPress={handleSavePrivacy}>
                  Save Privacy Settings
                </Button>
                {privacySaved && (
                  <Text color="success-500" fontSize="sm">
                    Privacy settings saved
                  </Text>
                )}
              </Inline>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
        </Accordion>
      </Stack>
    </Container>
  );
};

export default TestApp;
