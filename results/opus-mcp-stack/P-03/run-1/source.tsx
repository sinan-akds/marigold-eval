import {
  Badge,
  Breadcrumbs,
  Card,
  Columns,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Tag,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    title: 'Designing for Screen Readers',
    description:
      'Practical techniques for making your interfaces speak clearly to assistive technology.',
    href: '#',
  },
  {
    title: 'Keyboard-First Interactions',
    description:
      'How to build components that work flawlessly without a mouse or trackpad.',
    href: '#',
  },
  {
    title: 'Color Contrast in Practice',
    description:
      'A hands-on guide to meeting WCAG contrast ratios across light and dark themes.',
    href: '#',
  },
];

const tags = ['Accessibility', 'Design Systems', 'React', 'WCAG'];

const TestApp = () => {
  return (
    <div
      style={{
        maxWidth: '768px',
        marginInline: 'auto',
        paddingInline: 'var(--spacing-6, 1.5rem)',
        paddingBlock: 'var(--spacing-8, 2rem)',
      }}
    >
      <Stack space={8}>
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
            <Badge variant="info">Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={6}>
          <Text>
            Accessibility is not a feature you bolt on at the end of a project;
            it is a foundation you build on from the very first commit. When a
            design system bakes inclusive patterns into its primitives, every
            team that consumes it inherits those benefits for free.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            The hardest part is rarely the code itself. It is establishing the
            shared conventions and review habits that keep accessibility from
            regressing over time. A good system makes the accessible path the
            path of least resistance.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            Treat these pillars as a checklist for every component you ship.
            When each one is satisfied by default, accessibility stops being a
            special project and simply becomes how your team builds software.
          </Text>
        </Stack>

        <Divider />

        <Tag.Group label="Tags" aria-label="Article tags">
          {tags.map(tag => (
            <Tag key={tag} id={tag}>
              {tag}
            </Tag>
          ))}
        </Tag.Group>

        <Stack space={4}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            {relatedArticles.map(article => (
              <Card key={article.title}>
                <Stack space={3}>
                  <Headline level="3">{article.title}</Headline>
                  <Text>{article.description}</Text>
                  <Link href={article.href}>Read more →</Link>
                </Stack>
              </Card>
            ))}
          </Columns>
        </Stack>
      </Stack>
    </div>
  );
};

export default TestApp;
