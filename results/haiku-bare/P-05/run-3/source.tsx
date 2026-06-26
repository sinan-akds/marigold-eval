import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  Checkbox,
  TextField,
  Textarea,
  Select,
  SelectListBox,
  SelectOption,
  RadioGroup,
  Radio,
  Button,
  Stack,
  Text,
  Heading,
  HStack,
} from "@marigold/components";

const TestApp = () => {
  // Profile section
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance section
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("english");
  const [compactMode, setCompactMode] = useState(false);

  // Notifications section
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notificationSound, setNotificationSound] = useState("default");
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // Privacy section
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [allowSearchEngines, setAllowSearchEngines] = useState(true);
  const [privacySaved, setPrivacySaved] = useState(false);

  const isEmailValid = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSaveProfile = () => {
    if (displayName.trim() && (!email || isEmailValid(email))) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 2000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2000);
  };

  const isSearchEnginesDisabled = profileVisibility !== "public";

  return (
    <Stack gap="xl" padding="xl">
      <Heading level="1">Settings</Heading>

      <Accordion>
        {/* Profile Section */}
        <AccordionItem title="Profile">
          <Stack gap="lg" padding="lg">
            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              isRequired
              description="Your name as it appears to others"
            />

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              errorMessage={
                email && !isEmailValid(email) ? "Invalid email address" : ""
              }
              description="We'll use this to send you updates"
            />

            <Textarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              description="Tell others about yourself (optional)"
            />

            <HStack gap="md">
              <Button onClick={handleSaveProfile}>Save Profile</Button>
              {profileSaved && (
                <Text size="sm" color="green">
                  Profile saved successfully!
                </Text>
              )}
            </HStack>
          </Stack>
        </AccordionItem>

        {/* Appearance Section */}
        <AccordionItem title="Appearance">
          <Stack gap="lg" padding="lg">
            <div>
              <Text weight="bold" size="sm">
                Theme
              </Text>
              <RadioGroup value={theme} onChange={(val) => setTheme(val)}>
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system">System Default</Radio>
              </RadioGroup>
            </div>

            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <SelectListBox>
                <SelectOption value="english">English</SelectOption>
                <SelectOption value="german">German</SelectOption>
                <SelectOption value="french">French</SelectOption>
              </SelectListBox>
            </Select>

            <Checkbox
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
            >
              <Stack gap="xs">
                <Text weight="bold" size="sm">
                  Compact Mode
                </Text>
                <Text size="xs">
                  Reduce spacing and font size for denser layouts
                </Text>
              </Stack>
            </Checkbox>
          </Stack>
        </AccordionItem>

        {/* Notifications Section */}
        <AccordionItem title="Notifications">
          <Stack gap="lg" padding="lg">
            <Stack gap="md">
              <Text weight="bold" size="sm">
                Notification Preferences
              </Text>
              <Checkbox
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              >
                Email notifications for new messages
              </Checkbox>
              <Checkbox
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              >
                Push notifications for mentions
              </Checkbox>
              <Checkbox
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              >
                Weekly activity digest
              </Checkbox>
              <Checkbox
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
              >
                Marketing and promotional emails
              </Checkbox>
            </Stack>

            <Select
              label="Notification Sound"
              value={notificationSound}
              onChange={(e) => setNotificationSound(e.target.value)}
            >
              <SelectListBox>
                <SelectOption value="default">Default</SelectOption>
                <SelectOption value="chime">Chime</SelectOption>
                <SelectOption value="none">None</SelectOption>
              </SelectListBox>
            </Select>

            <HStack gap="md">
              <Button onClick={handleSaveNotifications}>
                Save Notification Preferences
              </Button>
              {notificationsSaved && (
                <Text size="sm" color="green">
                  Preferences saved successfully!
                </Text>
              )}
            </HStack>
          </Stack>
        </AccordionItem>

        {/* Privacy Section */}
        <AccordionItem title="Privacy">
          <Stack gap="lg" padding="lg">
            <div>
              <Text weight="bold" size="sm">
                Profile Visibility
              </Text>
              <RadioGroup
                value={profileVisibility}
                onChange={(val) => setProfileVisibility(val)}
              >
                <Radio value="public">Public</Radio>
                <Radio value="team">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </RadioGroup>
            </div>

            <Checkbox
              checked={showOnlineStatus}
              onChange={(e) => setShowOnlineStatus(e.target.checked)}
            >
              Show Online Status
            </Checkbox>

            <Checkbox
              checked={allowSearchEngines}
              onChange={(e) => setAllowSearchEngines(e.target.checked)}
              disabled={isSearchEnginesDisabled}
            >
              <Stack gap="xs">
                <Text weight="bold" size="sm">
                  Allow Search Engines
                </Text>
                <Text size="xs">
                  Let search engines index your public profile
                </Text>
              </Stack>
            </Checkbox>

            <HStack gap="md">
              <Button onClick={handleSavePrivacy}>Save Privacy Settings</Button>
              {privacySaved && (
                <Text size="sm" color="green">
                  Privacy settings saved successfully!
                </Text>
              )}
            </HStack>
          </Stack>
        </AccordionItem>
      </Accordion>
    </Stack>
  );
};

export default TestApp;
