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
  Tag,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    id: 'aria-patterns',
    title: 'Mastering ARIA Authoring Patterns',
    description:
      'A practical tour of the WAI-ARIA patterns that power robust, accessible widgets.',
  },
  {
    id: 'focus-management',
    title: 'Focus Management in Single Page Apps',
    description:
      'Keep keyboard users oriented as views change with deliberate focus handling.',
  },
  {
    id: 'color-contrast',
    title: 'Designing for Color Contrast',
    description:
      'How to meet WCAG contrast ratios without sacrificing your brand palette.',
  },
];

const TestApp = () => {
  return (
    <Container space={8}>
      <Stack space={8}>
        <Breadcrumbs>
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

        <Stack space={5}>
          <Text>
            Accessible design systems begin with shared primitives that bake in
            correct semantics, keyboard support, and focus handling. When every
            team builds on the same foundation, accessibility stops being an
            afterthought and becomes the default.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            The hardest part is not the individual components but the patterns
            that connect them. Composition, state, and announcements all need
            consistent handling so that assistive technology hears a coherent
            story rather than a pile of disconnected widgets.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            Treat these concerns as a budget you spend deliberately across the
            system. With clear ownership and automated checks, accessibility
            scales alongside the rest of your product instead of lagging behind
            it.
          </Text>
        </Stack>

        <Divider />

        <Tag.Group label="Tags">
          <Tag id="accessibility">Accessibility</Tag>
          <Tag id="design-systems">Design Systems</Tag>
          <Tag id="react">React</Tag>
          <Tag id="wcag">WCAG</Tag>
        </Tag.Group>

        <Stack space={5}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={6} collapseAt="40em">
            {relatedArticles.map(article => (
              <Card key={article.id}>
                <Inset space="square-regular">
                  <Stack space={3}>
                    <Headline level="3">{article.title}</Headline>
                    <Text>{article.description}</Text>
                    <Link href="#">Read more →</Link>
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
