'use client';

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
  useToast,
} from '@marigold/components';

const TestApp = () => {
  const { addToast } = useToast();

  // Profile section state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Appearance section state
  const [theme, setTheme] = useState<string>('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications section state
  const [notificationPreferences, setNotificationPreferences] = useState<string[]>([]);
  const [notificationSound, setNotificationSound] = useState<string>('default');

  // Privacy section state
  const [profileVisibility, setProfileVisibility] = useState<string>('team');
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);

  // Validation
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSaveProfile = () => {
    if (!displayName.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Display Name is required',
        variant: 'error',
      });
      return;
    }

    if (email.trim() && !validateEmail(email)) {
      addToast({
        title: 'Validation Error',
        description: 'Please enter a valid email address',
        variant: 'error',
      });
      return;
    }

    addToast({
      title: 'Profile Saved',
      description: 'Your profile settings have been updated',
      variant: 'success',
      timeout: 5000,
    });
  };

  const handleSaveNotifications = () => {
    addToast({
      title: 'Preferences Saved',
      description: 'Your notification preferences have been updated',
      variant: 'success',
      timeout: 5000,
    });
  };

  const handleSavePrivacy = () => {
    addToast({
      title: 'Settings Saved',
      description: 'Your privacy settings have been updated',
      variant: 'success',
      timeout: 5000,
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Stack space={4}>
        <Accordion>
        {/* Profile Section */}
        <Accordion.Item>
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
                rows={4}
              />

              <Button variant="primary" onPress={handleSaveProfile}>
                Save Profile
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item>
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
                onSelectionChange={(key) => setLanguage(key as string)}
              >
                <Select.Option id="en">English</Select.Option>
                <Select.Option id="de">German</Select.Option>
                <Select.Option id="fr">French</Select.Option>
              </Select>

              <Switch
                label="Compact Mode"
                description="Reduce spacing and font size for denser layouts"
                checked={compactMode}
                onChange={setCompactMode}
              />
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item>
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Checkbox.Group
                label="Notification Options"
                value={notificationPreferences}
                onChange={setNotificationPreferences}
              >
                <Checkbox
                  value="email"
                  label="Email notifications for new messages"
                />
                <Checkbox
                  value="push"
                  label="Push notifications for mentions"
                />
                <Checkbox
                  value="digest"
                  label="Weekly activity digest"
                />
                <Checkbox
                  value="marketing"
                  label="Marketing and promotional emails"
                />
              </Checkbox.Group>

              <Select
                label="Notification Sound"
                selectedKey={notificationSound}
                onSelectionChange={(key) => setNotificationSound(key as string)}
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              <Button variant="primary" onPress={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item>
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
                checked={showOnlineStatus}
                onChange={setShowOnlineStatus}
              />

              <Switch
                label="Allow Search Engines"
                description="Let search engines index your public profile"
                checked={allowSearchEngines}
                onChange={setAllowSearchEngines}
                disabled={profileVisibility !== 'public'}
              />

              <Button variant="primary" onPress={handleSavePrivacy}>
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      </Stack>
    </div>
  );
};

export default TestApp;
