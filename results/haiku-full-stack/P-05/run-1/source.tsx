import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Button,
  Checkbox,
  Headline,
  Inline,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextField,
  TextArea,
} from '@marigold/components';

type ProfileSettings = {
  displayName: string;
  email: string;
  bio: string;
};

type AppearanceSettings = {
  theme: string;
  language: string;
  compactMode: boolean;
};

type NotificationSettings = {
  emailMessages: boolean;
  pushMentions: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  notificationSound: string;
};

type PrivacySettings = {
  profileVisibility: string;
  showOnlineStatus: boolean;
  allowSearchEngines: boolean;
};

const TestApp = () => {
  const [profileData, setProfileData] = useState<ProfileSettings>({
    displayName: 'John Doe',
    email: 'john@example.com',
    bio: '',
  });

  const [appearanceData, setAppearanceData] = useState<AppearanceSettings>({
    theme: 'system',
    language: 'english',
    compactMode: false,
  });

  const [notificationData, setNotificationData] = useState<NotificationSettings>({
    emailMessages: true,
    pushMentions: true,
    weeklyDigest: false,
    marketingEmails: false,
    notificationSound: 'default',
  });

  const [privacyData, setPrivacyData] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowSearchEngines: true,
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [notificationSaved, setNotificationSaved] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveNotifications = () => {
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 2000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2000);
  };

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={4}>
          <Headline level="1">Settings</Headline>

          <Accordion>
        {/* Profile Section */}
        <Accordion.Item>
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Stack space={3}>
              <TextField
                label="Display Name"
                required
                value={profileData.displayName}
                onChange={(value) =>
                  setProfileData({ ...profileData, displayName: value })
                }
              />

              <TextField
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(value) =>
                  setProfileData({ ...profileData, email: value })
                }
              />

              <TextArea
                label="Bio"
                value={profileData.bio}
                onChange={(value) =>
                  setProfileData({ ...profileData, bio: value })
                }
                rows={4}
              />

              {profileSaved && (
                <Text color="success">Profile saved successfully!</Text>
              )}

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
            <Stack space={3}>
              <Radio.Group
                label="Theme"
                value={appearanceData.theme}
                onChange={(value) =>
                  setAppearanceData({ ...appearanceData, theme: value })
                }
              >
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system">System Default</Radio>
              </Radio.Group>

              <Select
                label="Language"
                selectedKey={appearanceData.language}
                onSelectionChange={(value) =>
                  setAppearanceData({
                    ...appearanceData,
                    language: value as string,
                  })
                }
              >
                <Select.Option id="english">English</Select.Option>
                <Select.Option id="german">German</Select.Option>
                <Select.Option id="french">French</Select.Option>
              </Select>

              <Stack space={1} alignX="left">
                <Switch
                  label="Compact Mode"
                  selected={appearanceData.compactMode}
                  onChange={(selected) =>
                    setAppearanceData({ ...appearanceData, compactMode: selected })
                  }
                />
                <Text size="sm">
                  Reduce spacing and font size for denser layouts
                </Text>
              </Stack>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item>
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Stack space={3}>
              <Stack space={2}>
                <Checkbox
                  label="Email notifications for new messages"
                  checked={notificationData.emailMessages}
                  onChange={(checked) =>
                    setNotificationData({
                      ...notificationData,
                      emailMessages: checked,
                    })
                  }
                />
                <Checkbox
                  label="Push notifications for mentions"
                  checked={notificationData.pushMentions}
                  onChange={(checked) =>
                    setNotificationData({
                      ...notificationData,
                      pushMentions: checked,
                    })
                  }
                />
                <Checkbox
                  label="Weekly activity digest"
                  checked={notificationData.weeklyDigest}
                  onChange={(checked) =>
                    setNotificationData({
                      ...notificationData,
                      weeklyDigest: checked,
                    })
                  }
                />
                <Checkbox
                  label="Marketing and promotional emails"
                  checked={notificationData.marketingEmails}
                  onChange={(checked) =>
                    setNotificationData({
                      ...notificationData,
                      marketingEmails: checked,
                    })
                  }
                />
              </Stack>

              <Select
                label="Notification Sound"
                selectedKey={notificationData.notificationSound}
                onSelectionChange={(value) =>
                  setNotificationData({
                    ...notificationData,
                    notificationSound: value as string,
                  })
                }
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              {notificationSaved && (
                <Text color="success">Notification preferences saved!</Text>
              )}

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
            <Stack space={3}>
              <Radio.Group
                label="Profile Visibility"
                value={privacyData.profileVisibility}
                onChange={(value) =>
                  setPrivacyData({ ...privacyData, profileVisibility: value })
                }
              >
                <Radio value="public">Public</Radio>
                <Radio value="team">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>

              <Switch
                label="Show Online Status"
                selected={privacyData.showOnlineStatus}
                onChange={(selected) =>
                  setPrivacyData({ ...privacyData, showOnlineStatus: selected })
                }
              />

              <Stack space={1} alignX="left">
                <Switch
                  label="Allow Search Engines"
                  selected={privacyData.allowSearchEngines}
                  onChange={(selected) =>
                    setPrivacyData({
                      ...privacyData,
                      allowSearchEngines: selected,
                    })
                  }
                  disabled={privacyData.profileVisibility !== 'public'}
                />
                <Text size="sm">
                  Let search engines index your public profile
                </Text>
              </Stack>

              {privacySaved && (
                <Text color="success">Privacy settings saved!</Text>
              )}

              <Button variant="primary" onPress={handleSavePrivacy}>
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
