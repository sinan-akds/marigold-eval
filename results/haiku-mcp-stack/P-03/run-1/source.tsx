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
    <Center maxWidth="xlarge">
      <Stack space="group">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumbs">
          <Breadcrumbs>
            <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
          </Breadcrumbs>
        </nav>

        {/* Article Header */}
        <Stack space="regular">
          <Headline size="level-1">Building Accessible Design Systems</Headline>

          <Inline space="group" alignY="center">
            <Text weight="medium">Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>

          <Divider variant="bold" />
        </Stack>

        {/* Article Body */}
        <Stack space="group">
          {/* First paragraph */}
          <Text as="p">
            Accessibility is not an afterthought in modern design systems—it's a foundational principle that enables all users to interact with digital products effectively. When we prioritize accessible design from the beginning, we create inclusive experiences that benefit not just users with disabilities, but all users. In this article, we'll explore the key principles and practical strategies for building design systems that are inherently accessible.
          </Text>

          {/* Info Callout */}
          <SectionMessage>
            <SectionMessage.Title>Part of Our Accessibility Series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the full
              series for more.
            </SectionMessage.Content>
          </SectionMessage>

          {/* Second paragraph */}
          <Text as="p">
            Building accessible design systems requires a deep understanding of web standards and user needs. By incorporating accessibility patterns, documentation, and testing practices into your design system, you ensure that every product built on top of it has a strong foundation for accessibility. The benefits extend beyond compliance—they improve overall user experience and code quality.
          </Text>

          {/* List */}
          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          {/* Final paragraph */}
          <Text as="p">
            Remember that accessibility is an ongoing commitment, not a one-time checklist. As you evolve your design system, continuously test with real users, gather feedback from the accessibility community, and stay updated with the latest standards and best practices. With these principles in mind, you'll build design systems that serve everyone.
          </Text>
        </Stack>

        {/* Tags */}
        <Stack space="regular">
          <Divider />
          <Inline space="tight">
            <Badge variant="default">Accessibility</Badge>
            <Badge variant="default">Design Systems</Badge>
            <Badge variant="default">React</Badge>
            <Badge variant="default">WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related Articles */}
        <Stack space="group">
          <Headline size="level-3">Related Articles</Headline>

          <Tiles tilesWidth="250px" space="group">
            {/* Card 1 */}
            <Card>
              <Stack space="regular">
                <Headline size="level-4">Designing for Color Blindness</Headline>
                <Text>Learn how to design color-accessible interfaces that work for users with color vision deficiency.</Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>

            {/* Card 2 */}
            <Card>
              <Stack space="regular">
                <Headline size="level-4">Accessible Forms: Best Practices</Headline>
                <Text>Master the essentials of creating form experiences that are intuitive and accessible to all users.</Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>

            {/* Card 3 */}
            <Card>
              <Stack space="regular">
                <Headline size="level-4">Testing Accessibility with Real Users</Headline>
                <Text>Discover practical approaches to user testing that reveal accessibility issues and improve inclusion.</Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Tiles>
        </Stack>
      </Stack>
    </Center>
  );
};

export default TestApp;
