import {
  Badge,
  Breadcrumbs,
  Center,
  Columns,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
} from '@marigold/components';

const TestApp = () => {
  return (
    <main>
      <Center maxWidth="xlarge">
        <Stack space={6}>
          {/* Breadcrumb */}
          <Breadcrumbs size="small">
            <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
          </Breadcrumbs>

          {/* Article Header */}
          <Stack space={3}>
            <Headline size="level-1">Building Accessible Design Systems</Headline>

            <Inline space={3} alignY="center">
              <Text weight="bold">Sarah Chen</Text>
              <Badge>Staff Engineer</Badge>
              <Text variant="muted">Published May 15, 2026</Text>
            </Inline>

            <Divider />
          </Stack>

          {/* Article Body */}
          <Stack space={4}>
            {/* First Paragraph */}
            <Text>
              Creating accessible design systems is essential for building inclusive web applications that serve all users. An accessible design system provides standardized components with built-in accessibility features, ensuring consistent user experiences across your product. By establishing accessibility at the component level, you empower teams to build compliant interfaces without needing deep accessibility expertise.
            </Text>

            {/* Info Callout */}
            <SectionMessage variant="info">
              <SectionMessage.Title>Series Note</SectionMessage.Title>
              <SectionMessage.Content>
                This article is part of our accessibility series. Check out the full series for more.
              </SectionMessage.Content>
            </SectionMessage>

            {/* Second Paragraph */}
            <Text>
              Accessibility is not a feature you add at the end of development; it should be foundational to your design process. Components that incorporate ARIA attributes, semantic HTML, keyboard navigation, and color contrast guidelines from the start eliminate rework and reduce the risk of accessibility failures in production. A well-designed system also makes your codebase more maintainable and helps teams ship faster with confidence.
            </Text>

            {/* Key Points List */}
            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            {/* Final Paragraph */}
            <Text>
              Implementing accessibility from the start strengthens your design system and creates a better product for everyone. Teams that prioritize accessibility report higher code quality, faster development cycles, and greater user satisfaction. Start with the fundamentals, test with real users, and iterate based on feedback to continuously improve your system.
            </Text>
          </Stack>

          {/* Tags Section */}
          <Stack space={3}>
            <Divider />
            <Inline space={2} noWrap>
              <Badge>Accessibility</Badge>
              <Badge>Design Systems</Badge>
              <Badge>React</Badge>
              <Badge>WCAG</Badge>
            </Inline>
          </Stack>

          {/* Related Articles Section */}
          <Stack space={4}>
            <Headline size="level-2">Related Articles</Headline>

            <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
              {/* Card 1 */}
              <Stack space={2}>
                <Headline size="level-4">Creating Color-Blind Friendly Palettes</Headline>
                <Text>Learn how to choose colors that work for users with color vision deficiency.</Text>
                <Link href="#">Read more →</Link>
              </Stack>

              {/* Card 2 */}
              <Stack space={2}>
                <Headline size="level-4">Testing Keyboard Navigation</Headline>
                <Text>A practical guide to testing your components for keyboard accessibility compliance.</Text>
                <Link href="#">Read more →</Link>
              </Stack>

              {/* Card 3 */}
              <Stack space={2}>
                <Headline size="level-4">ARIA Live Regions Explained</Headline>
                <Text>Master live regions to provide real-time updates to screen reader users.</Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Columns>
          </Stack>
        </Stack>
      </Center>
    </main>
  );
};

export default TestApp;
