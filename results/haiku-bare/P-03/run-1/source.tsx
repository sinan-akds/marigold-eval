import {
  Breadcrumbs,
  Heading,
  Text,
  Divider,
  Box,
  Stack,
  Badge,
  Inline,
  List,
  ListItem,
  Card,
  CardContent,
  Button,
  Flex,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Box
      as="main"
      padding="xl"
      maxWidth="800px"
      marginLeft="auto"
      marginRight="auto"
    >
      {/* Breadcrumb */}
      <Breadcrumbs>
        <Breadcrumbs.Item>Blog</Breadcrumbs.Item>
        <Breadcrumbs.Item>Frontend</Breadcrumbs.Item>
        <Breadcrumbs.Item>Accessibility</Breadcrumbs.Item>
      </Breadcrumbs>

      {/* Article Header */}
      <Stack gap="md" marginTop="lg" marginBottom="lg">
        <Heading level="1" size="2xl">
          Building Accessible Design Systems
        </Heading>

        <Inline space="md" alignY="center">
          <Text weight="bold">Sarah Chen</Text>
          <Badge>Staff Engineer</Badge>
          <Text variant="secondary">Published May 15, 2026</Text>
        </Inline>

        <Divider />
      </Stack>

      {/* Article Body */}
      <Stack gap="lg" marginBottom="lg">
        <Text>
          Accessibility is not just a feature—it's a fundamental principle that
          should be woven into the fabric of every design system. When we
          prioritize accessible design from the start, we create experiences
          that work for everyone. This means considering users with varying
          abilities, contexts, and technologies.
        </Text>

        <Box
          padding="md"
          borderLeft="4px solid"
          borderLeftColor="primary"
          backgroundColor="info-background"
        >
          <Text weight="bold">
            This article is part of our accessibility series. Check out the
            full series for more.
          </Text>
        </Box>

        <Text>
          Building accessible design systems requires attention to detail and a
          commitment to testing with real users. It's an ongoing process that
          involves collaboration between designers, developers, and users to
          ensure that the systems we create truly serve everyone in our
          communities.
        </Text>

        <Stack as="ul" gap="md">
          <ListItem>Semantic HTML as the foundation</ListItem>
          <ListItem>ARIA attributes for complex widgets</ListItem>
          <ListItem>Keyboard navigation patterns</ListItem>
          <ListItem>Color contrast and visual indicators</ListItem>
        </Stack>

        <Text>
          Remember that accessibility is a journey, not a destination. Start
          with these foundational practices and continue to learn and iterate
          as you build your design systems.
        </Text>
      </Stack>

      {/* Tags */}
      <Divider marginY="lg" />
      <Inline space="md" marginBottom="xl">
        <Badge>Accessibility</Badge>
        <Badge>Design Systems</Badge>
        <Badge>React</Badge>
        <Badge>WCAG</Badge>
      </Inline>

      {/* Related Articles */}
      <Stack gap="lg">
        <Heading level="2" size="lg">
          Related Articles
        </Heading>

        <Flex
          gap="lg"
          wrap="wrap"
          justifyContent="space-between"
          marginBottom="xl"
        >
          {[
            {
              title: "Color Contrast: Getting the Basics Right",
              description:
                "Learn how to ensure your color combinations meet WCAG standards.",
              link: "#",
            },
            {
              title: "ARIA Labels and Descriptions Explained",
              description:
                "A comprehensive guide to using ARIA attributes effectively.",
              link: "#",
            },
            {
              title: "Testing for Keyboard Accessibility",
              description:
                "Practical strategies for ensuring full keyboard navigation.",
              link: "#",
            },
          ].map((article, index) => (
            <Card key={index} width={{ default: "100%", tablet: "calc(33.333% - 11px)" }}>
              <CardContent>
                <Stack gap="md">
                  <Heading level="3" size="md">
                    {article.title}
                  </Heading>
                  <Text>{article.description}</Text>
                  <Button as="a" href={article.link} variant="plain">
                    Read more →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Flex>
      </Stack>
    </Box>
  );
};

export default TestApp;
