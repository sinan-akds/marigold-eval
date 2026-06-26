import {
  Badge,
  Box,
  Breadcrumbs,
  Callout,
  Card,
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
      'A practical guide to making your interfaces announce the right things at the right time.',
  },
  {
    title: 'Theming with Design Tokens',
    description:
      'How a single source of truth for color and spacing keeps large products consistent.',
  },
  {
    title: 'Testing Components at Scale',
    description:
      'Strategies for keeping a shared component library reliable as your team grows.',
  },
];

const TestApp = () => {
  return (
    <Box
      css={{
        maxWidth: '768px',
        marginInline: 'auto',
        paddingBlock: '48px',
        paddingInline: '24px',
      }}
    >
      <Stack space={8}>
        {/* Breadcrumb trail */}
        <Breadcrumbs>
          <Link href="#">Blog</Link>
          <Link href="#">Frontend</Link>
          <Link href="#">Accessibility</Link>
        </Breadcrumbs>

        {/* Article */}
        <Stack space={6}>
          {/* Header */}
          <Stack space={4}>
            <Headline level={1}>Building Accessible Design Systems</Headline>
            <Inline space={3} alignY="center">
              <Text weight="bold">Sarah Chen</Text>
              <Badge>Staff Engineer</Badge>
              <Text>Published May 15, 2026</Text>
            </Inline>
          </Stack>

          <Divider />

          {/* Body */}
          <Stack space={5}>
            <Text>
              Accessibility is not a feature you bolt on at the end of a project;
              it is a quality that emerges from deliberate decisions made
              throughout the design and engineering process. When a design system
              treats accessibility as a first-class concern, every team that
              consumes it inherits those good defaults for free.
            </Text>

            <Callout variant="info">
              <Callout.Title>Part of a series</Callout.Title>
              <Callout.Content>
                This article is part of our accessibility series. Check out the
                full series for more.
              </Callout.Content>
            </Callout>

            <Text>
              The most resilient systems start from a small set of well-tested
              primitives. By encoding focus management, color contrast, and
              keyboard behavior into shared components, you remove entire classes
              of bugs before they are ever written. The result is a product that
              works for more people with far less effort.
            </Text>

            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            <Text>
              Treating these concerns as building blocks rather than afterthoughts
              turns accessibility into something your whole organization can rely
              on. The investment compounds with every new feature shipped on top
              of the system.
            </Text>
          </Stack>

          <Divider />

          {/* Tags */}
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
          <Box
            css={{
              display: 'grid',
              gap: '24px',
              gridTemplateColumns: ['1fr', '1fr', 'repeat(3, 1fr)'],
            }}
          >
            {relatedArticles.map(article => (
              <Card key={article.title}>
                <Stack space={3}>
                  <Headline level={3}>{article.title}</Headline>
                  <Text>{article.description}</Text>
                  <Link href="#">Read more →</Link>
                </Stack>
              </Card>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TestApp;
