import { useState } from 'react';
import {
  Accordion,
  Text,
  TextField,
  TextArea,
  Button,
  RadioGroup,
  Radio,
  Select,
  Checkbox,
  Switch,
  Stack,
  Inset,
  Box,
} from '@marigold/components';

interface ProfileSettings {
  displayName: string;
  email: string;
  bio: string;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'de' | 'fr';
  compactMode: boolean;
}

interface NotificationSettings {
  emailMessages: boolean;
  pushMentions: boolean;
  weeklyDigest: boolean;
  marketing: boolean;
  sound: 'default' | 'chime' | 'none';
}

interface PrivacySettings {
  visibility: 'public' | 'team' | 'private';
  showOnline: boolean;
  allowSearch: boolean;
}

const TestApp = () => {
  const [profile, setProfile] = useState<ProfileSettings>({
    displayName: '',
    email: '',
    bio: '',
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'system',
    language: 'en',
    compactMode: false,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMessages: true,
    pushMentions: false,
    weeklyDigest: true,
    marketing: false,
    sound: 'default',
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    visibility: 'team',
    showOnline: true,
    allowSearch: false,
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [notificationsSaved, setNotificationsSaved] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleProfileSave = () => {
    if (!profile.displayName.trim()) {
      return;
    }
    if (profile.email && !isValidEmail(profile.email)) {
      return;
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleNotificationsSave = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  const handlePrivacySave = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  const isSearchEngineDisabled = privacy.visibility !== 'public';

  return (
    <Box marginX="large" marginY="large">
      <Text variant="headline"marginBottom="large">Settings</Text>

      <Accordion>
        {/* Profile Section */}
        <Accordion.Item value="profile" label="Profile">
          <Inset space="medium">
            <Stack space="medium">
              <TextField
                label="Display Name *"
                value={profile.displayName}
                onChange={(value) =>
                  setProfile({ ...profile, displayName: value })
                }
                required
              />

              <TextField
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(value) => setProfile({ ...profile, email: value })}
                description="Enter a valid email address"
              />

              <TextArea
                label="Bio"
                value={profile.bio}
                onChange={(value) => setProfile({ ...profile, bio: value })}
              />

              <Box>
                {profileSaved && (
                  <Text variant="body" style={{ color: 'green' }}>
                    Profile saved successfully
                  </Text>
                )}
                <Button onPress={handleProfileSave}>Save Profile</Button>
              </Box>
            </Stack>
          </Inset>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item value="appearance" label="Appearance">
          <Inset space="medium">
            <Stack space="medium">
              <div>
                <Text variant="label" as="label">
                  Theme
                </Text>
                <RadioGroup
                  value={appearance.theme}
                  onChange={(value) =>
                    setAppearance({
                      ...appearance,
                      theme: value as 'light' | 'dark' | 'system',
                    })
                  }
                >
                  <Radio value="light">Light</Radio>
                  <Radio value="dark">Dark</Radio>
                  <Radio value="system">System Default</Radio>
                </RadioGroup>
              </div>

              <div>
                <Text variant="label" as="label">
                  Language
                </Text>
                <Select
                  value={appearance.language}
                  onChange={(value) =>
                    setAppearance({
                      ...appearance,
                      language: value as 'en' | 'de' | 'fr',
                    })
                  }
                >
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                </Select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch
                  checked={appearance.compactMode}
                  onChange={(checked) =>
                    setAppearance({ ...appearance, compactMode: checked })
                  }
                />
                <div>
                  <Text variant="body">Compact Mode</Text>
                  <Text variant="caption">
                    Reduce spacing and font size for denser layouts
                  </Text>
                </div>
              </div>
            </Stack>
          </Inset>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item value="notifications" label="Notifications">
          <Inset space="medium">
            <Stack space="medium">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Checkbox
                  checked={notifications.emailMessages}
                  onChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      emailMessages: checked,
                    })
                  }
                >
                  Email notifications for new messages
                </Checkbox>

                <Checkbox
                  checked={notifications.pushMentions}
                  onChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      pushMentions: checked,
                    })
                  }
                >
                  Push notifications for mentions
                </Checkbox>

                <Checkbox
                  checked={notifications.weeklyDigest}
                  onChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      weeklyDigest: checked,
                    })
                  }
                >
                  Weekly activity digest
                </Checkbox>

                <Checkbox
                  checked={notifications.marketing}
                  onChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      marketing: checked,
                    })
                  }
                >
                  Marketing and promotional emails
                </Checkbox>
              </div>

              <div>
                <Text variant="label" as="label">
                  Notification Sound
                </Text>
                <Select
                  value={notifications.sound}
                  onChange={(value) =>
                    setNotifications({
                      ...notifications,
                      sound: value as 'default' | 'chime' | 'none',
                    })
                  }
                >
                  <option value="default">Default</option>
                  <option value="chime">Chime</option>
                  <option value="none">None</option>
                </Select>
              </div>

              <Box>
                {notificationsSaved && (
                  <Text variant="body" style={{ color: 'green' }}>
                    Notification preferences saved
                  </Text>
                )}
                <Button onPress={handleNotificationsSave}>
                  Save Notification Preferences
                </Button>
              </Box>
            </Stack>
          </Inset>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item value="privacy" label="Privacy">
          <Inset space="medium">
            <Stack space="medium">
              <div>
                <Text variant="label" as="label">
                  Profile Visibility
                </Text>
                <RadioGroup
                  value={privacy.visibility}
                  onChange={(value) =>
                    setPrivacy({
                      ...privacy,
                      visibility: value as 'public' | 'team' | 'private',
                      allowSearch: value === 'public' ? privacy.allowSearch : false,
                    })
                  }
                >
                  <Radio value="public">Public</Radio>
                  <Radio value="team">Team Only</Radio>
                  <Radio value="private">Private</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch
                  checked={privacy.showOnline}
                  onChange={(checked) =>
                    setPrivacy({ ...privacy, showOnline: checked })
                  }
                />
                <Text variant="body">Show Online Status</Text>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch
                  checked={privacy.allowSearch}
                  onChange={(checked) =>
                    setPrivacy({ ...privacy, allowSearch: checked })
                  }
                  disabled={isSearchEngineDisabled}
                />
                <div>
                  <Text
                    variant="body"
                    style={{
                      opacity: isSearchEngineDisabled ? 0.5 : 1,
                    }}
                  >
                    Allow Search Engines
                  </Text>
                  <Text
                    variant="caption"
                    style={{
                      opacity: isSearchEngineDisabled ? 0.5 : 1,
                    }}
                  >
                    Let search engines index your public profile
                  </Text>
                </div>
              </div>

              <Box>
                {privacySaved && (
                  <Text variant="body" style={{ color: 'green' }}>
                    Privacy settings saved
                  </Text>
                )}
                <Button onPress={handlePrivacySave}>Save Privacy Settings</Button>
              </Box>
            </Stack>
          </Inset>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

export default TestApp;
