import {
  Badge,
  Breadcrumbs,
  Card,
  Column,
  Columns,
  Container,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  Message,
  Stack,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    title: 'Designing Accessible Color Systems',
    description:
      'How to build a token-based color palette that meets contrast requirements out of the box.',
  },
  {
    title: 'Keyboard Navigation in Practice',
    description:
      'A walkthrough of focus management patterns for menus, dialogs, and complex widgets.',
  },
  {
    title: 'Testing for Accessibility',
    description:
      'Tools and workflows for catching accessibility regressions before they ship.',
  },
];

const TestApp = () => {
  return (
    <Container>
      <Stack space={10}>
        {/* Breadcrumb trail */}
        <Breadcrumbs>
          <Link href="#">Blog</Link>
          <Link href="#">Frontend</Link>
          <Link href="#">Accessibility</Link>
        </Breadcrumbs>

        {/* Article */}
        <Stack space={8}>
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
          <Stack space={6}>
            <Text>
              Accessibility is not a feature you add at the end of a project; it
              is a foundation you build on from the very first commit. A design
              system that bakes in accessible defaults lets every team ship
              inclusive experiences without reinventing the basics each time.
            </Text>

            <Message variant="info" messageTitle="Part of a series">
              This article is part of our accessibility series. Check out the
              full series for more.
            </Message>

            <Text>
              The most effective systems treat accessibility as a shared
              contract between design and engineering. When tokens, components,
              and documentation all reinforce the same expectations, accessible
              outcomes become the path of least resistance for everyone.
            </Text>

            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            <Text>
              Start small, measure often, and let your component library carry
              the weight. Each accessible primitive you add compounds across
              every product that depends on it.
            </Text>
          </Stack>

          {/* Tags */}
          <Divider />
          <Inline space={2} alignY="center">
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related articles */}
        <Stack space={5}>
          <Headline level={2}>Related Articles</Headline>
          <Columns space={6} collapseAt="45rem">
            {relatedArticles.map((article) => (
              <Column key={article.title}>
                <Card>
                  <Stack space={3}>
                    <Headline level={3}>{article.title}</Headline>
                    <Text>{article.description}</Text>
                    <Link href="#">Read more →</Link>
                  </Stack>
                </Card>
              </Column>
            ))}
          </Columns>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TestApp;
