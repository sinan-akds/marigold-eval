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
      'Practical techniques for making your components announce themselves clearly to assistive technology.',
  },
  {
    title: 'Keyboard-First Interfaces',
    description:
      'How to build navigation flows that work flawlessly without ever touching a mouse.',
  },
  {
    title: 'Color Contrast in Practice',
    description:
      'A hands-on guide to meeting WCAG contrast ratios while keeping your brand palette intact.',
  },
];

const TestApp = () => {
  return (
    <Container>
      <Stack space={6}>
        <nav aria-label="Breadcrumbs">
          <Breadcrumbs>
            <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
          </Breadcrumbs>
        </nav>

        <Stack space={4}>
          <Stack space={3}>
            <Headline level="1">Building Accessible Design Systems</Headline>
            <Inline space={3} alignY="center">
              <Text weight="bold">Sarah Chen</Text>
              <Badge variant="info">Staff Engineer</Badge>
              <Text color="muted-foreground">Published May 15, 2026</Text>
            </Inline>
          </Stack>
          <Divider />
        </Stack>

        <Stack space={5}>
          <Text>
            Accessibility is not a feature you bolt on at the end of a project;
            it is a foundational quality that shapes every decision in a design
            system. When components are built with inclusion in mind from the
            start, everyone benefits from clearer structure and more predictable
            behavior.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Part of a series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            A well-designed system encodes accessibility best practices directly
            into its primitives, so product teams inherit them for free. This
            means semantic markup, sensible focus management, and robust
            keyboard support are the default rather than the exception.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            By treating these principles as shared infrastructure, you reduce
            the burden on individual teams and raise the baseline quality of
            every interface across your organization.
          </Text>
        </Stack>

        <Divider />

        <Tag.Group aria-label="Article tags" selectionMode="none">
          <Tag id="accessibility">Accessibility</Tag>
          <Tag id="design-systems">Design Systems</Tag>
          <Tag id="react">React</Tag>
          <Tag id="wcag">WCAG</Tag>
        </Tag.Group>

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
};

export default TestApp;
