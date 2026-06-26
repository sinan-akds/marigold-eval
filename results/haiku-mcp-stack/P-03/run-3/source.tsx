import {
  Badge,
  Breadcrumbs,
  Card,
  Center,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
  Tiles,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Center maxWidth="large" space={6}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs">
        <Breadcrumbs>
          <Breadcrumbs.Item href="#blog">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#frontend">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#accessibility">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>
      </nav>

      {/* Article Content */}
      <Stack space={4} stretch>
        {/* Article Header */}
        <Stack space={3}>
          <Headline size="level-1">Building Accessible Design Systems</Headline>

          {/* Author Info */}
          <Inline space={3} alignY="center">
            <Text weight="bold">Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text color="muted">Published May 15, 2026</Text>
          </Inline>

          <Divider variant="bold" />
        </Stack>

        {/* Article Body */}
        <Stack space={4}>
          {/* First Paragraph */}
          <Text as="p">
            Accessibility is not an afterthought—it's a fundamental principle that should guide the design of every system. When we build design systems with accessibility at the core, we create products that are usable by everyone, regardless of their abilities. This approach strengthens our designs, improves code quality, and demonstrates our commitment to inclusive design.
          </Text>

          {/* Info Callout */}
          <SectionMessage>
            <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          {/* Second Paragraph */}
          <Text as="p">
            The key to building accessible design systems lies in understanding the diverse needs of your users. By incorporating semantic HTML, proper ARIA attributes, and keyboard navigation from the start, we create systems that naturally support assistive technologies. Testing with real users who rely on these technologies is invaluable.
          </Text>

          {/* Key Points List */}
          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          {/* Final Paragraph */}
          <Text as="p">
            As you continue to develop your design system, remember that accessibility is an ongoing journey. Regular audits, user testing, and feedback from the community will help you identify areas for improvement. By maintaining accessibility as a priority, you're not just building better products—you're creating opportunities for everyone to participate fully in digital experiences.
          </Text>
        </Stack>

        {/* Tags Section */}
        <Stack space={3}>
          <Divider variant="bold" />
          <Inline space={2}>
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related Articles Section */}
        <Stack space={3}>
          <Headline size="level-2">Related Articles</Headline>
          <Tiles tilesWidth="250px" space={3} stretch>
            {/* Article Card 1 */}
            <Card p={4}>
              <Stack space={2}>
                <Headline size="level-3">Testing Accessibility Compliance</Headline>
                <Text size="small">
                  Learn how to implement automated testing to ensure your design system meets WCAG standards.
                </Text>
                <Link href="#article1">Read more →</Link>
              </Stack>
            </Card>

            {/* Article Card 2 */}
            <Card p={4}>
              <Stack space={2}>
                <Headline size="level-3">Keyboard Navigation Patterns</Headline>
                <Text size="small">
                  Explore best practices for implementing keyboard navigation in complex interactive components.
                </Text>
                <Link href="#article2">Read more →</Link>
              </Stack>
            </Card>

            {/* Article Card 3 */}
            <Card p={4}>
              <Stack space={2}>
                <Headline size="level-3">Color Contrast in Design Systems</Headline>
                <Text size="small">
                  Discover how to choose colors that meet accessibility standards while maintaining visual appeal.
                </Text>
                <Link href="#article3">Read more →</Link>
              </Stack>
            </Card>
          </Tiles>
        </Stack>
      </Stack>
    </Center>
  );
};

export default TestApp;
