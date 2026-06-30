import { useState } from 'react';
import {
  Accordion,
  AppLayout,
  Button,
  Checkbox,
  Container,
  Headline,
  Inset,
  Radio,
  Select,
  Stack,
  Switch,
  TextField,
  TextArea,
  Text,
  SectionMessage,
} from '@marigold/components';

const TestApp = () => {
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    bio: '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const [appearanceData, setAppearanceData] = useState({
    theme: 'light',
    language: 'en',
    compactMode: false,
  });

  const [notificationData, setNotificationData] = useState({
    emailNewMessages: false,
    pushMentions: false,
    weeklyDigest: false,
    marketing: false,
    notificationSound: 'default',
  });
  const [notificationSaved, setNotificationSaved] = useState(false);

  const [privacyData, setPrivacyData] = useState({
    profileVisibility: 'public',
    showOnlineStatus: false,
    allowSearch: true,
  });
  const [privacySaved, setPrivacySaved] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveProfile = () => {
    if (!profileData.displayName || !isValidEmail(profileData.email)) {
      return;
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 3000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  const isProfileVisibilityPublic = privacyData.profileVisibility === 'public';

  return (
    <AppLayout>
      <AppLayout.Main>
        <Container>
          <Inset space={4}>
            <Stack space={4}>
              <Headline level={1}>Settings</Headline>

              <Accordion allowsMultipleExpanded>
        {/* Profile Section */}
        <Accordion.Item id="profile">
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <TextField
                label="Display Name"
                name="displayName"
                required
                value={profileData.displayName}
                onChange={(value) =>
                  setProfileData({ ...profileData, displayName: value })
                }
              />
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                error={profileData.email !== '' && !isValidEmail(profileData.email)}
                errorMessage="Please enter a valid email address"
                onChange={(value) => setProfileData({ ...profileData, email: value })}
              />
              <TextArea
                label="Bio"
                name="bio"
                description="Optional"
                value={profileData.bio}
                onChange={(value) =>
                  setProfileData({ ...profileData, bio: value })
                }
              />
              {profileSaved && (
                <SectionMessage variant="success">
                  Profile saved — Your profile has been updated successfully.
                </SectionMessage>
              )}
              <Button
                variant="primary"
                onPress={handleSaveProfile}
                disabled={
                  !profileData.displayName ||
                  !isValidEmail(profileData.email)
                }
              >
                Save Profile
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item id="appearance">
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
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
                onSelectionChange={(key) =>
                  setAppearanceData({ ...appearanceData, language: String(key) })
                }
              >
                <Select.Option id="en">English</Select.Option>
                <Select.Option id="de">German</Select.Option>
                <Select.Option id="fr">French</Select.Option>
              </Select>

              <Stack space={1}>
                <Switch
                  label="Compact Mode"
                  selected={appearanceData.compactMode}
                  onChange={(selected) =>
                    setAppearanceData({ ...appearanceData, compactMode: selected })
                  }
                />
                <Text size="small" variant="secondary">
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
            <Stack space={4}>
              <Stack space={2}>
                <Checkbox
                  label="Email notifications for new messages"
                  checked={notificationData.emailNewMessages}
                  onChange={(checked) =>
                    setNotificationData({
                      ...notificationData,
                      emailNewMessages: checked,
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
                  checked={notificationData.marketing}
                  onChange={(checked) =>
                    setNotificationData({
                      ...notificationData,
                      marketing: checked,
                    })
                  }
                />
              </Stack>

              <Select
                label="Notification Sound"
                selectedKey={notificationData.notificationSound}
                onSelectionChange={(key) =>
                  setNotificationData({
                    ...notificationData,
                    notificationSound: String(key),
                  })
                }
              >
                <Select.Option id="default">Default</Select.Option>
                <Select.Option id="chime">Chime</Select.Option>
                <Select.Option id="none">None</Select.Option>
              </Select>

              {notificationSaved && (
                <SectionMessage variant="success">
                  Preferences saved — Your notification preferences have been updated.
                </SectionMessage>
              )}

              <Button variant="primary" onPress={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item id="privacy">
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Stack space={4}>
              <Radio.Group
                label="Profile Visibility"
                value={privacyData.profileVisibility}
                onChange={(value) =>
                  setPrivacyData({ ...privacyData, profileVisibility: value })
                }
              >
                <Radio value="public">Public</Radio>
                <Radio value="team-only">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>

              <Switch
                label="Show Online Status"
                selected={privacyData.showOnlineStatus}
                onChange={(selected) =>
                  setPrivacyData({
                    ...privacyData,
                    showOnlineStatus: selected,
                  })
                }
              />

              <Stack space={1}>
                <Switch
                  label="Allow Search Engines"
                  selected={privacyData.allowSearch}
                  onChange={(selected) =>
                    setPrivacyData({ ...privacyData, allowSearch: selected })
                  }
                  disabled={!isProfileVisibilityPublic}
                />
                <Text size="small" variant="secondary">
                  Let search engines index your public profile
                </Text>
              </Stack>

              {privacySaved && (
                <SectionMessage variant="success">
                  Settings saved — Your privacy settings have been updated.
                </SectionMessage>
              )}

              <Button variant="primary" onPress={handleSavePrivacy}>
                Save Privacy Settings
              </Button>
            </Stack>
          </Accordion.Content>
        </Accordion.Item>
              </Accordion>
            </Stack>
          </Inset>
        </Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
