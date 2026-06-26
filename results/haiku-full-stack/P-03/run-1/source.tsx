import {
  Badge,
  Breadcrumbs,
  Card,
  Container,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
  Columns,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Container space={6}>
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumbs">
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>
      </nav>

      {/* Article header */}
      <Stack space={4}>
        <Headline level="1">Building Accessible Design Systems</Headline>

        <Inline space={3} alignY="center">
          <Text weight="medium">Sarah Chen</Text>
          <Badge>Staff Engineer</Badge>
          <Text variant="muted">Published May 15, 2026</Text>
        </Inline>

        <Divider />
      </Stack>

      {/* Article body */}
      <Stack space={4}>
        <Text>
          Accessibility is not an afterthought—it's a fundamental principle that
          should be embedded into every step of design system development.
          Creating truly accessible components requires understanding user needs,
          implementing semantic HTML, and testing with real users and assistive
          technologies. When done well, accessible design benefits everyone,
          making interfaces more intuitive and inclusive.
        </Text>

        <SectionMessage>
          <SectionMessage.Title>
            Accessibility Series Highlight
          </SectionMessage.Title>
          <SectionMessage.Content>
            This article is part of our accessibility series. Check out the full
            series for more.
          </SectionMessage.Content>
        </SectionMessage>

        <Text>
          Building an accessible design system goes beyond compliance. It means
          considering how different users interact with your components—whether
          they use keyboards, screen readers, or voice controls. Developers and
          designers must collaborate to ensure that components are not just
          visually appealing but also functionally accessible to everyone.
        </Text>

        <Stack space={2}>
          <Headline level="4">Key Accessibility Principles</Headline>
          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>
        </Stack>

        <Text>
          By prioritizing accessibility from the start, design systems create a
          foundation that benefits all users. Inclusive design is better design,
          and it makes your product more resilient, performant, and appreciated
          by the broader user base.
        </Text>
      </Stack>

      {/* Tags */}
      <Stack space={3}>
        <Divider />
        <Inline space={2}>
          <Badge>Accessibility</Badge>
          <Badge>Design Systems</Badge>
          <Badge>React</Badge>
          <Badge>WCAG</Badge>
        </Inline>
      </Stack>

      {/* Related articles section */}
      <Stack space={4}>
        <Headline level="2">Related Articles</Headline>

        <Columns columns={[1, 1, 1]} collapseAt="40em" space={4}>
          <Card>
            <Stack space={2}>
              <Headline level="4">Testing Accessibility in Practice</Headline>
              <Text>
                Learn how to implement practical testing strategies to ensure
                your components work for everyone.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>

          <Card>
            <Stack space={2}>
              <Headline level="4">Color Contrast Standards</Headline>
              <Text>
                Explore WCAG color contrast requirements and how to implement
                them effectively in your designs.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>

          <Card>
            <Stack space={2}>
              <Headline level="4">Keyboard Navigation Patterns</Headline>
              <Text>
                Master the patterns and best practices for creating fully
                keyboard-navigable components.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>
        </Columns>
      </Stack>
    </Container>
  );
};

export default TestApp;
