import { useState } from "react";
import {
  Disclosure,
  DisclosureGroup,
  TextField,
  Textarea,
  Button,
  RadioGroup,
  Radio,
  Select,
  Checkbox,
  Message,
} from "@marigold/components";

const TestApp = () => {
  // Profile section state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Appearance section state
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");
  const [compactMode, setCompactMode] = useState(false);

  // Notifications section state
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [notificationSound, setNotificationSound] = useState("default");
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // Privacy section state
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveProfile = () => {
    if (!displayName.trim() || !isEmailValid(email)) {
      return;
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 3000);
  };

  const handleSavePrivacy = () => {
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 3000);
  };

  const isSearchEngineDisabled =
    profileVisibility === "team-only" || profileVisibility === "private";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <DisclosureGroup>
        {/* Profile Section */}
        <Disclosure title="Profile">
          <div className="space-y-6">
            <TextField
              label="Display Name"
              isRequired
              value={displayName}
              onChange={setDisplayName}
              description="Your public display name"
            />

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              description={
                email && !isEmailValid(email) ? "Invalid email format" : ""
              }
            />

            <Textarea
              label="Bio"
              value={bio}
              onChange={setBio}
              description="Optional biography (max 500 characters)"
            />

            {profileSaved && (
              <Message variant="success">Profile saved successfully!</Message>
            )}

            <Button
              onPress={handleSaveProfile}
              disabled={!displayName.trim() || !isEmailValid(email)}
            >
              Save Profile
            </Button>
          </div>
        </Disclosure>

        {/* Appearance Section */}
        <Disclosure title="Appearance">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Theme</label>
              <RadioGroup value={theme} onChange={setTheme}>
                <Radio value="light">Light</Radio>
                <Radio value="dark">Dark</Radio>
                <Radio value="system">System Default</Radio>
              </RadioGroup>
            </div>

            <Select
              label="Language"
              value={language}
              onChange={setLanguage}
            >
              <option value="en">English</option>
              <option value="de">German</option>
              <option value="fr">French</option>
            </Select>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={compactMode}
                onChange={setCompactMode}
              />
              <div>
                <label className="text-sm font-medium block">
                  Compact Mode
                </label>
                <p className="text-xs text-gray-600">
                  Reduce spacing and font size for denser layouts
                </p>
              </div>
            </div>
          </div>
        </Disclosure>

        {/* Notifications Section */}
        <Disclosure title="Notifications">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium mb-3">
                Notification Preferences
              </label>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <label className="text-sm">
                  Email notifications for new messages
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={pushNotifications}
                  onChange={setPushNotifications}
                />
                <label className="text-sm">
                  Push notifications for mentions
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
                <label className="text-sm">Weekly activity digest</label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={marketingEmails}
                  onChange={setMarketingEmails}
                />
                <label className="text-sm">
                  Marketing and promotional emails
                </label>
              </div>
            </div>

            <Select
              label="Notification Sound"
              value={notificationSound}
              onChange={setNotificationSound}
            >
              <option value="default">Default</option>
              <option value="chime">Chime</option>
              <option value="none">None</option>
            </Select>

            {notificationsSaved && (
              <Message variant="success">
                Notification preferences saved!
              </Message>
            )}

            <Button onPress={handleSaveNotifications}>
              Save Notification Preferences
            </Button>
          </div>
        </Disclosure>

        {/* Privacy Section */}
        <Disclosure title="Privacy">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Profile Visibility
              </label>
              <RadioGroup
                value={profileVisibility}
                onChange={setProfileVisibility}
              >
                <Radio value="public">Public</Radio>
                <Radio value="team-only">Team Only</Radio>
                <Radio value="private">Private</Radio>
              </RadioGroup>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={showOnlineStatus}
                onChange={setShowOnlineStatus}
              />
              <label className="text-sm font-medium">Show Online Status</label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={allowSearchEngines}
                onChange={setAllowSearchEngines}
                disabled={isSearchEngineDisabled}
              />
              <div>
                <label className="text-sm font-medium block">
                  Allow Search Engines
                </label>
                <p className="text-xs text-gray-600">
                  Let search engines index your public profile
                </p>
              </div>
            </div>

            {privacySaved && (
              <Message variant="success">Privacy settings saved!</Message>
            )}

            <Button onPress={handleSavePrivacy}>Save Privacy Settings</Button>
          </div>
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
};

export default TestApp;
