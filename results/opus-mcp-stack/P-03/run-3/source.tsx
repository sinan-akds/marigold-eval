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
  Tag,
  Text,
} from '@marigold/components';

const relatedArticles = [
  {
    title: 'Designing for Screen Readers',
    description:
      'Practical techniques for making rich interfaces work with assistive technology.',
  },
  {
    title: 'Keyboard-First Interactions',
    description:
      'How to ensure every component can be operated without a mouse.',
  },
  {
    title: 'Color Contrast in Practice',
    description:
      'A hands-on guide to meeting WCAG contrast ratios in real products.',
  },
];

const TestApp = () => (
  <Container space={8}>
    <Stack space={8}>
      <Breadcrumbs aria-label="Breadcrumb">
        <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
      </Breadcrumbs>

      <Stack space={6}>
        <Stack space={4}>
          <Headline level="1">Building Accessible Design Systems</Headline>
          <Inline space={3} alignY="center">
            <Text weight="bold">Sarah Chen</Text>
            <Badge variant="info">Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={4}>
          <Text>
            Accessible design systems start with a shared understanding of how
            people actually use the web. By building inclusive patterns once and
            reusing them everywhere, teams can ship interfaces that work for
            everyone without reinventing the basics on every screen.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Accessibility series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            The components in a design system are where accessibility either
            succeeds or quietly breaks. When the foundations are solid, product
            teams inherit good behavior for free. When they are not, every team
            ends up patching the same gaps over and over again.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            Treating accessibility as a baseline rather than an afterthought
            keeps these concerns close to the components themselves, so the
            whole organization moves faster while serving a wider audience.
          </Text>
        </Stack>
      </Stack>

      <Stack space={4}>
        <Divider />
        <Tag.Group aria-label="Article tags">
          <Tag id="accessibility">Accessibility</Tag>
          <Tag id="design-systems">Design Systems</Tag>
          <Tag id="react">React</Tag>
          <Tag id="wcag">WCAG</Tag>
        </Tag.Group>
      </Stack>

      <Stack space={4}>
        <Headline level="2">Related Articles</Headline>
        <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
          {relatedArticles.map(article => (
            <Card key={article.title}>
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

export default TestApp;
