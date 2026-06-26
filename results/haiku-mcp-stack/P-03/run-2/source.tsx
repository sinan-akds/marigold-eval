import {
  Breadcrumbs,
  Headline,
  Badge,
  Stack,
  Text,
  Container,
  Divider,
  SectionMessage,
  List,
  Inline,
  Card,
  Columns,
  Link,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Container space={6}>
      <nav aria-label="Breadcrumbs">
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>
      </nav>

      <Stack space={4}>
        <Headline level="1">Building Accessible Design Systems</Headline>

        <Inline space={3} alignY="center">
          <Text weight="bold">Sarah Chen</Text>
          <Badge variant="primary">Staff Engineer</Badge>
          <Text variant="muted">Published May 15, 2026</Text>
        </Inline>

        <Divider />
      </Stack>

      <Stack space={4}>
        <Text>
          Accessibility is not just a feature to be added at the end of a project—it's a core principle that should guide every decision in design system development. When building components with accessibility in mind from the start, you create a foundation that benefits all users, not just those with disabilities. A truly inclusive design system empowers teams to build applications that work for everyone, regardless of their abilities or the devices they use.
        </Text>

        <SectionMessage>
          <SectionMessage.Title>Series Information</SectionMessage.Title>
          <SectionMessage.Content>
            This article is part of our accessibility series. Check out the full series for more.
          </SectionMessage.Content>
        </SectionMessage>

        <Text>
          The path to accessibility begins with understanding the fundamentals. Semantic HTML provides the foundation upon which all accessible web experiences are built, allowing assistive technologies to understand the structure and meaning of your content. ARIA attributes complement semantic HTML by adding additional context and behavior when native elements alone are insufficient. Together, these tools create a comprehensive framework for building interfaces that are both semantically correct and fully interactive for all users.
        </Text>

        <List>
          <List.Item>Semantic HTML as the foundation</List.Item>
          <List.Item>ARIA attributes for complex widgets</List.Item>
          <List.Item>Keyboard navigation patterns</List.Item>
          <List.Item>Color contrast and visual indicators</List.Item>
        </List>

        <Text>
          Building accessible design systems requires a shift in mindset. Rather than thinking of accessibility as an afterthought or a compliance checkbox, embrace it as a core value that influences everything from component architecture to documentation and testing practices. When accessibility is prioritized from the beginning, teams can create design systems that are not only compliant with standards like WCAG, but also genuinely delightful for users of all abilities.
        </Text>
      </Stack>

      <Stack space={4}>
        <Divider />

        <Inline space={2}>
          <Badge>Accessibility</Badge>
          <Badge>Design Systems</Badge>
          <Badge>React</Badge>
          <Badge>WCAG</Badge>
        </Inline>
      </Stack>

      <Stack space={4}>
        <Headline level="2">Related Articles</Headline>

        <Columns columns={[1, 1, 1]} collapseAt="40em" space={4}>
          <Card>
            <Stack space={3}>
              <Headline level="3">Inclusive Color Palettes</Headline>
              <Text>
                Learn how to create color palettes that are accessible to users with color vision deficiency.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>

          <Card>
            <Stack space={3}>
              <Headline level="3">Screen Reader Testing Best Practices</Headline>
              <Text>
                Discover the tools and techniques for testing your components with screen readers.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>

          <Card>
            <Stack space={3}>
              <Headline level="3">Keyboard Navigation Essentials</Headline>
              <Text>
                Understand how to implement robust keyboard navigation patterns in your design system.
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
