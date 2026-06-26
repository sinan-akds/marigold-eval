import {
  Badge,
  Callout,
  Card,
  Columns,
  Container,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  Stack,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    title: 'Designing for Screen Readers',
    description:
      'Practical techniques for making complex interfaces understandable to assistive technology.',
  },
  {
    title: 'Color Contrast in Practice',
    description:
      'How to build a palette that meets WCAG requirements without sacrificing your brand.',
  },
  {
    title: 'Keyboard-First Components',
    description:
      'Patterns for ensuring every interaction works without ever touching a mouse.',
  },
];

const TestApp = () => {
  return (
    <Container>
      <Stack space={8}>
        {/* Breadcrumb trail */}
        <Inline space={2} alignY="center">
          <Link href="#">Blog</Link>
          <Text>›</Text>
          <Link href="#">Frontend</Link>
          <Text>›</Text>
          <Link href="#">Accessibility</Link>
        </Inline>

        {/* Article */}
        <Stack space={6}>
          {/* Header */}
          <Stack space={4}>
            <Headline level={1}>Building Accessible Design Systems</Headline>
            <Inline space={3} alignY="center">
              <Text>Sarah Chen</Text>
              <Badge>Staff Engineer</Badge>
              <Text>Published May 15, 2026</Text>
            </Inline>
            <Divider />
          </Stack>

          {/* Body */}
          <Stack space={5}>
            <Text>
              Accessibility is not a feature you bolt on at the end of a
              project. It is a foundational concern that shapes how every
              component in a design system is conceived, built, and tested.
              When done well, it benefits every user, not just those relying
              on assistive technology.
            </Text>

            <Callout variant="info">
              <Callout.Title>Accessibility Series</Callout.Title>
              <Callout.Content>
                This article is part of our accessibility series. Check out the
                full series for more.
              </Callout.Content>
            </Callout>

            <Text>
              A robust design system encodes accessible behavior directly into
              its primitives. By the time a developer reaches for a button, a
              dialog, or a menu, the keyboard handling and focus management have
              already been solved. This is what separates a component library
              from a true design system.
            </Text>

            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            <Text>
              Treating these concerns as first-class principles ensures that
              accessibility scales with your product rather than becoming
              technical debt. The result is an experience that is more usable,
              more inclusive, and more resilient for everyone.
            </Text>
          </Stack>
        </Stack>

        {/* Tags */}
        <Stack space={4}>
          <Divider />
          <Inline space={2} alignY="center">
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related articles */}
        <Stack space={4}>
          <Headline level={2}>Related Articles</Headline>
          <Columns space={4} collapseAt="40rem">
            {relatedArticles.map((article) => (
              <Card key={article.title}>
                <Stack space={3}>
                  <Headline level={3}>{article.title}</Headline>
                  <Text>{article.description}</Text>
                  <Link href="#">Read more →</Link>
                </Stack>
              </Card>
            ))}
          </Columns>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TestApp;
