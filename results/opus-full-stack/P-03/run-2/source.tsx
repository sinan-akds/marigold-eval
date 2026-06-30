import {
  Badge,
  Breadcrumbs,
  Card,
  Columns,
  Container,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    id: 'aria',
    title: 'Demystifying ARIA Roles',
    description:
      'A practical guide to choosing the right ARIA roles without breaking native semantics.',
  },
  {
    id: 'focus',
    title: 'Managing Focus in Single Page Apps',
    description:
      'How to keep keyboard users oriented when content changes without a full page reload.',
  },
  {
    id: 'contrast',
    title: 'Color Contrast Beyond the Basics',
    description:
      'Going past the minimum WCAG ratios to build interfaces that work for everyone.',
  },
];

const tags = ['Accessibility', 'Design Systems', 'React', 'WCAG'];

const TestApp = () => {
  return (
    <Container space={8}>
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
            <Text color="text-secondary-muted">Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={6}>
          <Text>
            Accessibility is not a feature you bolt on at the end of a project;
            it is a foundation you build everything else upon. A design system
            that bakes accessible patterns into its primitives lets every team
            ship inclusive interfaces by default.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Accessibility series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            When components handle focus management, keyboard interaction, and
            semantics for you, accessibility stops being an afterthought. The
            result is a product that is more robust, easier to maintain, and
            usable by a far wider audience.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            Treating these principles as defaults rather than optional extras is
            what separates a good design system from a great one. Invest in them
            early and every interface built on top inherits the benefits.
          </Text>
        </Stack>

        <Divider />
        <Inline space={2}>
          {tags.map(tag => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </Inline>

        <Stack space={5}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={5} collapseAt="48em">
            {relatedArticles.map(article => (
              <Card key={article.id}>
                <Stack space={3}>
                  <Headline level="3">{article.title}</Headline>
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
