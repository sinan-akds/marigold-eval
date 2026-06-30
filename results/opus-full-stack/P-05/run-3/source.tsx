import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
  Form,
  Headline,
  Inset,
  Radio,
  Select,
  Stack,
  Switch,
  Text,
  TextArea,
  TextField,
  ToastProvider,
  useToast,
} from '@marigold/components';

const TestApp = () => {
  const { addToast } = useToast();

  // Profile
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Appearance
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<string[]>([
    'email-messages',
  ]);
  const [sound, setSound] = useState('default');

  // Privacy
  const [visibility, setVisibility] = useState('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);

  const isPublic = visibility === 'public';

  return (
    <>
      <ToastProvider position="bottom-right" />
      <Inset space={6}>
        <Stack space={6}>
          <Headline level={1}>Settings</Headline>

          <Accordion
            allowsMultipleExpanded
            defaultExpandedKeys={['profile']}
          >
            {/* Section 1: Profile */}
            <Accordion.Item id="profile">
              <Accordion.Header>Profile</Accordion.Header>
              <Accordion.Content>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    addToast({
                      title: 'Profile saved',
                      description: 'Your profile changes have been saved.',
                      variant: 'success',
                    });
                  }}
                >
                  <Stack space={5} alignX="left">
                    <TextField
                      label="Display Name"
                      name="displayName"
                      value={displayName}
                      onChange={setDisplayName}
                      required
                      width="full"
                    />
                    <TextField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      description="We'll never share your email with anyone."
                      width="full"
                    />
                    <TextArea
                      label="Bio"
                      name="bio"
                      rows={4}
                      value={bio}
                      onChange={setBio}
                      description="Optional. Tell others a little about yourself."
                      width="full"
                    />
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
                    onSelectionChange={key => setLanguage(String(key))}
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
                    <Text size="sm" variant="muted">
                      Reduce spacing and font size for denser layouts
                    </Text>
                  </Stack>
                </Stack>
              </Accordion.Content>
            </Accordion.Item>

            {/* Section 3: Notifications */}
            <Accordion.Item id="notifications">
              <Accordion.Header>Notifications</Accordion.Header>
              <Accordion.Content>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    addToast({
                      title: 'Notification preferences saved',
                      variant: 'success',
                    });
                  }}
                >
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
                      <Checkbox
                        value="weekly-digest"
                        label="Weekly activity digest"
                      />
                      <Checkbox
                        value="marketing"
                        label="Marketing and promotional emails"
                      />
                    </Checkbox.Group>

                    <Select
                      label="Notification Sound"
                      selectedKey={sound}
                      onSelectionChange={key => setSound(String(key))}
                    >
                      <Select.Option id="default">Default</Select.Option>
                      <Select.Option id="chime">Chime</Select.Option>
                      <Select.Option id="none">None</Select.Option>
                    </Select>

                    <Button variant="primary" type="submit">
                      Save Notification Preferences
                    </Button>
                  </Stack>
                </Form>
              </Accordion.Content>
            </Accordion.Item>

            {/* Section 4: Privacy */}
            <Accordion.Item id="privacy">
              <Accordion.Header>Privacy</Accordion.Header>
              <Accordion.Content>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    addToast({
                      title: 'Privacy settings saved',
                      variant: 'success',
                    });
                  }}
                >
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
                        selected={isPublic && allowSearch}
                        onChange={setAllowSearch}
                        disabled={!isPublic}
                      />
                      <Text size="sm" variant="muted">
                        Let search engines index your public profile. Only
                        available when your profile visibility is Public.
                      </Text>
                    </Stack>

                    <Button variant="primary" type="submit">
                      Save Privacy Settings
                    </Button>
                  </Stack>
                </Form>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Inset>
    </>
  );
};

export default TestApp;
