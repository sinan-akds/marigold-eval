import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Container,
  Headline,
  Inset,
  Radio,
  SectionMessage,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
} from '@marigold/components';

export default function SettingsPage() {
  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifChecked, setNotifChecked] = useState<string[]>([]);
  const [notifSound, setNotifSound] = useState<string>('default');
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnline, setShowOnline] = useState(true);
  const [allowSearch, setAllowSearch] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const flash = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 3000);
  };

  return (
    <Container>
      <Inset space="square-regular">
        <Stack space={6}>
          <Headline level={1}>Settings</Headline>
          <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>
            {/* Profile */}
            <Accordion.Item id="profile">
              <Accordion.Header>Profile</Accordion.Header>
              <Accordion.Content>
                <Stack space={4}>
                  {profileSaved && (
                    <SectionMessage variant="success">
                      <SectionMessage.Title>Profile saved</SectionMessage.Title>
                      <SectionMessage.Content>
                        Your profile changes have been saved successfully.
                      </SectionMessage.Content>
                    </SectionMessage>
                  )}
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
                    errorMessage="Please enter a valid email address."
                  />
                  <TextArea
                    label="Bio"
                    value={bio}
                    onChange={setBio}
                    rows={4}
                  />
                  <Button variant="primary" onPress={() => flash(setProfileSaved)}>
                    Save Profile
                  </Button>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            {/* Appearance */}
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
                    <Text color="text-secondary-foreground">
                      Reduce spacing and font size for denser layouts
                    </Text>
                  </Stack>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            {/* Notifications */}
            <Accordion.Item id="notifications">
              <Accordion.Header>Notifications</Accordion.Header>
              <Accordion.Content>
                <Stack space={4}>
                  {notifSaved && (
                    <SectionMessage variant="success">
                      <SectionMessage.Title>Preferences saved</SectionMessage.Title>
                      <SectionMessage.Content>
                        Your notification preferences have been updated.
                      </SectionMessage.Content>
                    </SectionMessage>
                  )}
                  <Checkbox.Group
                    label="Notification Types"
                    value={notifChecked}
                    onChange={setNotifChecked}
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
                    selectedKey={notifSound}
                    onSelectionChange={(key) => setNotifSound(String(key))}
                  >
                    <Select.Option id="default">Default</Select.Option>
                    <Select.Option id="chime">Chime</Select.Option>
                    <Select.Option id="none">None</Select.Option>
                  </Select>
                  <Button variant="primary" onPress={() => flash(setNotifSaved)}>
                    Save Notification Preferences
                  </Button>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            {/* Privacy */}
            <Accordion.Item id="privacy">
              <Accordion.Header>Privacy</Accordion.Header>
              <Accordion.Content>
                <Stack space={4}>
                  {privacySaved && (
                    <SectionMessage variant="success">
                      <SectionMessage.Title>Privacy settings saved</SectionMessage.Title>
                      <SectionMessage.Content>
                        Your privacy settings have been updated.
                      </SectionMessage.Content>
                    </SectionMessage>
                  )}
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
                    selected={showOnline}
                    onChange={setShowOnline}
                  />
                  <Stack space={1}>
                    <Switch
                      label="Allow Search Engines"
                      selected={allowSearch}
                      onChange={setAllowSearch}
                      disabled={visibility !== 'public'}
                    />
                    <Text color="text-secondary-foreground">
                      Let search engines index your public profile
                    </Text>
                  </Stack>
                  <Button variant="primary" onPress={() => flash(setPrivacySaved)}>
                    Save Privacy Settings
                  </Button>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Inset>
    </Container>
  );
}
