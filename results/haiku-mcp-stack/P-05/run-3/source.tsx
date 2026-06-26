import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
  Headline,
  Toast,
} from '@marigold/components';

interface ProfileSettings {
  displayName: string;
  email: string;
  bio: string;
}

interface AppearanceSettings {
  theme: string;
  language: string;
  compactMode: boolean;
}

interface NotificationSettings {
  emailMessages: boolean;
  pushMentions: boolean;
  weeklyDigest: boolean;
  marketing: boolean;
  sound: string;
}

interface PrivacySettings {
  visibility: string;
  showOnlineStatus: boolean;
  allowSearchEngines: boolean;
}

const TestApp = () => {
  const [profile, setProfile] = useState<ProfileSettings>({
    displayName: '',
    email: '',
    bio: '',
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'light',
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
    visibility: 'team-only',
    showOnlineStatus: true,
    allowSearchEngines: false,
  });

  const [showProfileSaved, setShowProfileSaved] = useState(false);
  const [showNotificationsSaved, setShowNotificationsSaved] = useState(false);
  const [showPrivacySaved, setShowPrivacySaved] = useState(false);

  const handleProfileSave = () => {
    setShowProfileSaved(true);
    setTimeout(() => setShowProfileSaved(false), 3000);
  };

  const handleNotificationsSave = () => {
    setShowNotificationsSaved(true);
    setTimeout(() => setShowNotificationsSaved(false), 3000);
  };

  const handlePrivacySave = () => {
    setShowPrivacySaved(true);
    setTimeout(() => setShowPrivacySaved(false), 3000);
  };

  const isSearchEnginesDisabled = privacy.visibility !== 'public';

  return (
    <Stack space="large" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div>
        <Headline level={1}>Settings</Headline>
      </div>

      <Accordion>
        {/* Profile Section */}
        <Accordion.Item id="profile" title="Profile">
          <Stack space="medium">
            <TextField
              label="Display Name"
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
              onChange={(value) =>
                setProfile({ ...profile, email: value })
              }
            />

            <TextArea
              label="Bio"
              value={profile.bio}
              onChange={(value) =>
                setProfile({ ...profile, bio: value })
              }
            />

            <Button onPress={handleProfileSave}>Save Profile</Button>
          </Stack>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item id="appearance" title="Appearance">
          <Stack space="medium">
            <Select
              label="Theme"
              value={appearance.theme}
              onSelectionChange={(value) =>
                setAppearance({ ...appearance, theme: String(value) })
              }
            >
              <Select.Option id="light" textValue="Light">
                Light
              </Select.Option>
              <Select.Option id="dark" textValue="Dark">
                Dark
              </Select.Option>
              <Select.Option id="system" textValue="System Default">
                System Default
              </Select.Option>
            </Select>

            <Select
              label="Language"
              value={appearance.language}
              onSelectionChange={(value) =>
                setAppearance({ ...appearance, language: String(value) })
              }
            >
              <Select.Option id="en" textValue="English">
                English
              </Select.Option>
              <Select.Option id="de" textValue="German">
                German
              </Select.Option>
              <Select.Option id="fr" textValue="French">
                French
              </Select.Option>
            </Select>

            <Stack>
              <Switch
                checked={appearance.compactMode}
                onChange={(checked) =>
                  setAppearance({ ...appearance, compactMode: checked })
                }
              >
                Compact Mode
              </Switch>
              <Text variant="text-sm" color="muted">
                Reduce spacing and font size for denser layouts
              </Text>
            </Stack>
          </Stack>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item id="notifications" title="Notifications">
          <Stack space="medium">
            <Stack>
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
            </Stack>

            <Select
              label="Notification Sound"
              value={notifications.sound}
              onSelectionChange={(value) =>
                setNotifications({
                  ...notifications,
                  sound: String(value),
                })
              }
            >
              <Select.Option id="default" textValue="Default">
                Default
              </Select.Option>
              <Select.Option id="chime" textValue="Chime">
                Chime
              </Select.Option>
              <Select.Option id="none" textValue="None">
                None
              </Select.Option>
            </Select>

            <Button onPress={handleNotificationsSave}>
              Save Notification Preferences
            </Button>
          </Stack>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item id="privacy" title="Privacy">
          <Stack space="medium">
            <Select
              label="Profile Visibility"
              value={privacy.visibility}
              onSelectionChange={(value) => {
                const newVisibility = String(value);
                setPrivacy({
                  ...privacy,
                  visibility: newVisibility,
                  allowSearchEngines:
                    newVisibility === 'public'
                      ? privacy.allowSearchEngines
                      : false,
                });
              }}
            >
              <Select.Option id="public" textValue="Public">
                Public
              </Select.Option>
              <Select.Option id="team-only" textValue="Team Only">
                Team Only
              </Select.Option>
              <Select.Option id="private" textValue="Private">
                Private
              </Select.Option>
            </Select>

            <Switch
              checked={privacy.showOnlineStatus}
              onChange={(checked) =>
                setPrivacy({ ...privacy, showOnlineStatus: checked })
              }
            >
              Show Online Status
            </Switch>

            <Stack>
              <Switch
                checked={privacy.allowSearchEngines}
                onChange={(checked) =>
                  setPrivacy({
                    ...privacy,
                    allowSearchEngines: checked,
                  })
                }
                disabled={isSearchEnginesDisabled}
              >
                Allow Search Engines
              </Switch>
              <Text variant="text-sm" color="muted">
                Let search engines index your public profile
              </Text>
              {isSearchEnginesDisabled && (
                <Text variant="text-sm" color="muted">
                  This option is only available when profile visibility is set
                  to Public
                </Text>
              )}
            </Stack>

            <Button onPress={handlePrivacySave}>Save Privacy Settings</Button>
          </Stack>
        </Accordion.Item>
      </Accordion>

      {showProfileSaved && (
        <Toast>Profile settings saved successfully!</Toast>
      )}
      {showNotificationsSaved && (
        <Toast>Notification preferences saved successfully!</Toast>
      )}
      {showPrivacySaved && (
        <Toast>Privacy settings saved successfully!</Toast>
      )}
    </Stack>
  );
};

export default TestApp;
