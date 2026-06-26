import { Card, Heading, Text, Inline, Stack, Badge, Button } from "@marigold/components";
import { useState } from "react";

const TestApp = () => {
  const [messageStatus, setMessageStatus] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string | null>(null);

  const handleSendMessage = () => {
    setMessageStatus("Message sent to jane.doe@example.com");
    setTimeout(() => setMessageStatus(null), 3000);
  };

  const handleEditProfile = () => {
    setEditStatus("Edit profile dialog would open here");
    setTimeout(() => setEditStatus(null), 3000);
  };

  return (
    <Card>
      <Stack space="large">
        {/* Header with Avatar and Name */}
        <Inline space="medium" alignY="center">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
            alt="Jane Doe"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <Stack space="small">
            <Heading level="2">Jane Doe</Heading>
            <Badge color="positive">Active</Badge>
          </Stack>
        </Inline>

        {/* Details Section */}
        <Stack space="small">
          <Inline space="medium">
            <Text weight="bold" style={{ minWidth: "90px" }}>
              Role:
            </Text>
            <Text>Senior Developer</Text>
          </Inline>
          <Inline space="medium">
            <Text weight="bold" style={{ minWidth: "90px" }}>
              Department:
            </Text>
            <Text>Engineering</Text>
          </Inline>
          <Inline space="medium">
            <Text weight="bold" style={{ minWidth: "90px" }}>
              Email:
            </Text>
            <Text>jane.doe@example.com</Text>
          </Inline>
          <Inline space="medium">
            <Text weight="bold" style={{ minWidth: "90px" }}>
              Location:
            </Text>
            <Text>Freiburg, Germany</Text>
          </Inline>
        </Stack>

        {/* Bio Section */}
        <Stack space="small">
          <Heading level="4">About</Heading>
          <Text>
            Jane is a passionate senior developer with 8+ years of experience
            building scalable web applications. She specializes in React and
            TypeScript, and enjoys mentoring junior team members and
            contributing to open-source projects in her spare time.
          </Text>
        </Stack>

        {/* Action Buttons */}
        <Inline space="medium">
          <Button onPress={handleSendMessage} variant="primary">
            Send Message
          </Button>
          <Button onPress={handleEditProfile} variant="secondary">
            Edit Profile
          </Button>
        </Inline>

        {/* Status Messages */}
        {messageStatus && <Text color="positive">{messageStatus}</Text>}
        {editStatus && <Text color="warning">{editStatus}</Text>}
      </Stack>
    </Card>
  );
};

export default TestApp;
