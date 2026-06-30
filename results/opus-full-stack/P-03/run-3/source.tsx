import {
  Badge,
  Breadcrumbs,
  Card,
  Columns,
  Container,
  Divider,
  Headline,
  Inline,
  Inset,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    title: 'Designing for Screen Readers',
    description:
      'How thoughtful markup and labels make your interface usable for everyone.',
    href: '#',
  },
  {
    title: 'Keyboard-First Interactions',
    description:
      'Patterns for building components that work without a mouse from the start.',
    href: '#',
  },
  {
    title: 'Color Contrast in Practice',
    description:
      'A practical guide to meeting WCAG contrast ratios without sacrificing brand.',
    href: '#',
  },
];

const tags = ['Accessibility', 'Design Systems', 'React', 'WCAG'];

const TestApp = () => {
  return (
    <Container contentLength="long">
      <Stack space={8}>
        <Breadcrumbs aria-label="Breadcrumbs">
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        <Stack space={4}>
          <Headline level="1">Building Accessible Design Systems</Headline>
          <Inline space={3} alignY="center">
            <Text weight="bold">Sarah Chen</Text>
            <Badge variant="info">Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={6}>
          <Text>
            Accessibility is not a feature you bolt on at the end of a project;
            it is a foundation you build from the very first commit. When a
            design system bakes in accessible defaults, every team that consumes
            it inherits those benefits for free.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Accessibility series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            The hardest part is rarely the technology itself. It is the
            discipline of testing with real assistive technology and treating
            accessibility bugs with the same seriousness as any other defect.
            The following building blocks are a good place to start.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            Adopt these practices incrementally and document them as shared
            conventions. Over time, accessible patterns become the path of least
            resistance, and your whole product becomes more inclusive as a
            result.
          </Text>
        </Stack>

        <Divider />

        <Inline space={2} alignY="center">
          {tags.map(tag => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Inline>

        <Stack space={4}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            {relatedArticles.map(article => (
              <Card key={article.title}>
                <Inset space="square-regular">
                  <Stack space={3}>
                    <Headline level="3">{article.title}</Headline>
                    <Text>{article.description}</Text>
                    <Link href={article.href}>Read more →</Link>
                  </Stack>
                </Inset>
              </Card>
            ))}
          </Columns>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TestApp;
