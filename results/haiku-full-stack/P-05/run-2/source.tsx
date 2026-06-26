'use client';

import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Inset,
  Radio,
  Select,
  SectionMessage,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

const TestApp = () => {
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    bio: '',
  });

  const [appearanceData, setAppearanceData] = useState({
    theme: 'system',
    language: 'english',
    compactMode: false,
  });

  const [notificationData, setNotificationData] = useState({
    emailMessages: false,
    pushMentions: false,
    weeklyDigest: false,
    marketing: false,
    sound: 'default',
  });

  const [privacyData, setPrivacyData] = useState({
    visibility: 'team',
    showOnlineStatus: false,
    allowSearch: false,
  });

  const [profileSaved, setProfileSaved] = useState(false);
  const [notificationSaved, setNotificationSaved] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleNotificationSave = () => {
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 2000);
  };

  const handlePrivacySave = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2000);
  };

  const isSearchEngineDisabled =
    privacyData.visibility !== 'public';

  return (
    <Stack space={6}>
      <Accordion>
        {/* Profile Section */}
        <Accordion.Item>
          <Accordion.Header>Profile</Accordion.Header>
          <Accordion.Content>
            <Inset spaceY="padding-regular">
              <Stack space={4}>
                <TextField
                  label="Display Name"
                  required
                  value={profileData.displayName}
                  onChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      displayName: value,
                    }))
                  }
                />

                <TextField
                  type="email"
                  label="Email Address"
                  value={profileData.email}
                  onChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                />

                <TextArea
                  label="Bio"
                  description="Optional"
                  rows={4}
                  value={profileData.bio}
                  onChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      bio: value,
                    }))
                  }
                />

                <Button
                  variant="primary"
                  onPress={handleProfileSave}
                >
                  Save Profile
                </Button>

                {profileSaved && (
                  <SectionMessage variant="success">
                    Profile saved successfully!
                  </SectionMessage>
                )}
              </Stack>
            </Inset>
          </Accordion.Content>
        </Accordion.Item>

        {/* Appearance Section */}
        <Accordion.Item>
          <Accordion.Header>Appearance</Accordion.Header>
          <Accordion.Content>
            <Inset spaceY="padding-regular">
              <Stack space={4}>
                <Radio.Group
                  label="Theme"
                  value={appearanceData.theme}
                  onChange={(value) =>
                    setAppearanceData((prev) => ({
                      ...prev,
                      theme: String(value),
                    }))
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
                    setAppearanceData((prev) => ({
                      ...prev,
                      language: String(value),
                    }))
                  }
                >
                  <Select.Option id="english">English</Select.Option>
                  <Select.Option id="german">German</Select.Option>
                  <Select.Option id="french">French</Select.Option>
                </Select>

                <Stack space={1}>
                  <Switch
                    label="Compact Mode"
                    selected={appearanceData.compactMode}
                    onChange={(value) =>
                      setAppearanceData((prev) => ({
                        ...prev,
                        compactMode: value,
                      }))
                    }
                  />
                  <Text fontSize="sm" color="foreground-muted">
                    Reduce spacing and font size for denser layouts
                  </Text>
                </Stack>
              </Stack>
            </Inset>
          </Accordion.Content>
        </Accordion.Item>

        {/* Notifications Section */}
        <Accordion.Item>
          <Accordion.Header>Notifications</Accordion.Header>
          <Accordion.Content>
            <Inset spaceY="padding-regular">
              <Stack space={4}>
                <Checkbox.Group
                  value={
                    Object.keys(notificationData)
                      .filter((key) => key !== 'sound')
                      .filter(
                        (key) => notificationData[key as keyof typeof notificationData] === true
                      )
                  }
                  onChange={(values) => {
                    setNotificationData((prev) => ({
                      ...prev,
                      emailMessages: values.includes(
                        'emailMessages',
                      ),
                      pushMentions: values.includes(
                        'pushMentions',
                      ),
                      weeklyDigest: values.includes(
                        'weeklyDigest',
                      ),
                      marketing: values.includes('marketing'),
                    }));
                  }}
                >
                  <Checkbox
                    value="emailMessages"
                    label="Email notifications for new messages"
                  />
                  <Checkbox
                    value="pushMentions"
                    label="Push notifications for mentions"
                  />
                  <Checkbox
                    value="weeklyDigest"
                    label="Weekly activity digest"
                  />
                  <Checkbox
                    value="marketing"
                    label="Marketing and promotional emails"
                  />
                </Checkbox.Group>

                <Select
                  label="Notification Sound"
                  selectedKey={notificationData.sound}
                  onSelectionChange={(value) =>
                    setNotificationData((prev) => ({
                      ...prev,
                      sound: String(value),
                    }))
                  }
                >
                  <Select.Option id="default">Default</Select.Option>
                  <Select.Option id="chime">Chime</Select.Option>
                  <Select.Option id="none">None</Select.Option>
                </Select>

                <Button
                  variant="primary"
                  onPress={handleNotificationSave}
                >
                  Save Notification Preferences
                </Button>

                {notificationSaved && (
                  <SectionMessage variant="success">
                    Notification preferences saved!
                  </SectionMessage>
                )}
              </Stack>
            </Inset>
          </Accordion.Content>
        </Accordion.Item>

        {/* Privacy Section */}
        <Accordion.Item>
          <Accordion.Header>Privacy</Accordion.Header>
          <Accordion.Content>
            <Inset spaceY="padding-regular">
              <Stack space={4}>
                <Radio.Group
                  label="Profile Visibility"
                  value={privacyData.visibility}
                  onChange={(value) =>
                    setPrivacyData((prev) => ({
                      ...prev,
                      visibility: String(value),
                    }))
                  }
                >
                  <Radio value="public">Public</Radio>
                  <Radio value="team">Team Only</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>

                <Switch
                  label="Show Online Status"
                  selected={privacyData.showOnlineStatus}
                  onChange={(value) =>
                    setPrivacyData((prev) => ({
                      ...prev,
                      showOnlineStatus: value,
                    }))
                  }
                />

                <Stack space={1}>
                  <Switch
                    label="Allow Search Engines"
                    selected={privacyData.allowSearch}
                    onChange={(value) =>
                      setPrivacyData((prev) => ({
                        ...prev,
                        allowSearch: value,
                      }))
                    }
                    disabled={isSearchEngineDisabled}
                  />
                  <Text
                    fontSize="sm"
                    color={isSearchEngineDisabled ? 'disabled' : 'foreground-muted'}
                  >
                    Let search engines index your public profile
                  </Text>
                </Stack>

                <Button
                  variant="primary"
                  onPress={handlePrivacySave}
                >
                  Save Privacy Settings
                </Button>

                {privacySaved && (
                  <SectionMessage variant="success">
                    Privacy settings saved!
                  </SectionMessage>
                )}
              </Stack>
            </Inset>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
