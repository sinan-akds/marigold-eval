import { useState } from 'react';
import {
  Accordion,
  Button,
  Checkbox,
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ProfileSection = () => {
  const { addToast } = useToast();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const nameError = submitted && displayName.trim() === '';
  const emailError = email.trim() !== '' && !EMAIL_REGEX.test(email);

  const handleSave = () => {
    setSubmitted(true);
    if (displayName.trim() === '' || emailError) {
      return;
    }
    addToast({
      title: 'Profile saved',
      description: 'Your profile changes have been saved.',
      variant: 'success',
    });
  };

  return (
    <Stack space={4} alignX="left">
      <TextField
        label="Display Name"
        required
        value={displayName}
        onChange={setDisplayName}
        error={nameError}
        errorMessage="Display Name is required."
      />
      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={setEmail}
        error={emailError}
        errorMessage="Enter a valid email address."
        description="We'll use this to contact you."
      />
      <TextArea
        label="Bio"
        rows={4}
        value={bio}
        onChange={setBio}
        description="Optional. Tell others a little about yourself."
      />
      <Button variant="primary" onPress={handleSave}>
        Save Profile
      </Button>
    </Stack>
  );
};

const AppearanceSection = () => {
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState<string>('en');
  const [compact, setCompact] = useState(false);

  return (
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
        onSelectionChange={key => setLanguage(key as string)}
      >
        <Select.Option id="en">English</Select.Option>
        <Select.Option id="de">German</Select.Option>
        <Select.Option id="fr">French</Select.Option>
      </Select>
      <Stack space={1} alignX="left">
        <Switch
          label="Compact Mode"
          selected={compact}
          onChange={setCompact}
        />
        <Text fontSize="sm" color="foreground-muted">
          Reduce spacing and font size for denser layouts.
        </Text>
      </Stack>
    </Stack>
  );
};

const NotificationsSection = () => {
  const { addToast } = useToast();
  const [channels, setChannels] = useState<string[]>(['email-messages']);
  const [sound, setSound] = useState<string>('default');

  const handleSave = () => {
    addToast({
      title: 'Notification preferences saved',
      description: 'Your notification settings have been updated.',
      variant: 'success',
    });
  };

  return (
    <Stack space={5} alignX="left">
      <Checkbox.Group
        label="Notifications"
        value={channels}
        onChange={setChannels}
      >
        <Checkbox
          value="email-messages"
          label="Email notifications for new messages"
        />
        <Checkbox value="push-mentions" label="Push notifications for mentions" />
        <Checkbox value="weekly-digest" label="Weekly activity digest" />
        <Checkbox value="marketing" label="Marketing and promotional emails" />
      </Checkbox.Group>
      <Select
        label="Notification Sound"
        selectedKey={sound}
        onSelectionChange={key => setSound(key as string)}
      >
        <Select.Option id="default">Default</Select.Option>
        <Select.Option id="chime">Chime</Select.Option>
        <Select.Option id="none">None</Select.Option>
      </Select>
      <Button variant="primary" onPress={handleSave}>
        Save Notification Preferences
      </Button>
    </Stack>
  );
};

const PrivacySection = () => {
  const { addToast } = useToast();
  const [visibility, setVisibility] = useState('public');
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);

  const searchDisabled = visibility !== 'public';

  const handleSave = () => {
    addToast({
      title: 'Privacy settings saved',
      description: 'Your privacy settings have been updated.',
      variant: 'success',
    });
  };

  return (
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
        selected={onlineStatus}
        onChange={setOnlineStatus}
      />
      <Stack space={1} alignX="left">
        <Switch
          label="Allow Search Engines"
          selected={allowSearch && !searchDisabled}
          onChange={setAllowSearch}
          disabled={searchDisabled}
        />
        <Text fontSize="sm" color="foreground-muted">
          Let search engines index your public profile.
          {searchDisabled
            ? ' Available only when your profile is Public.'
            : ''}
        </Text>
      </Stack>
      <Button variant="primary" onPress={handleSave}>
        Save Privacy Settings
      </Button>
    </Stack>
  );
};

const TestApp = () => {
  return (
    <>
      <ToastProvider position="bottom-right" />
      <Inset space={6}>
        <Stack space={6}>
          <Stack space={1}>
            <Headline level={1}>Settings</Headline>
            <Text color="foreground-muted">
              Manage your profile, appearance, notifications, and privacy.
            </Text>
          </Stack>
          <Accordion allowsMultipleExpanded defaultExpandedKeys={['profile']}>
            <Accordion.Item id="profile">
              <Accordion.Header>Profile</Accordion.Header>
              <Accordion.Content>
                <ProfileSection />
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="appearance">
              <Accordion.Header>Appearance</Accordion.Header>
              <Accordion.Content>
                <AppearanceSection />
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="notifications">
              <Accordion.Header>Notifications</Accordion.Header>
              <Accordion.Content>
                <NotificationsSection />
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item id="privacy">
              <Accordion.Header>Privacy</Accordion.Header>
              <Accordion.Content>
                <PrivacySection />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Inset>
    </>
  );
};

export default TestApp;
