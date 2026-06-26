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

const TestApp = () => {
  return (
    <Container space={8} align="center">
      {/* Breadcrumb trail */}
      <Breadcrumbs>
        <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
      </Breadcrumbs>

      {/* Article header */}
      <Stack space={3}>
        <Headline level="1">Building Accessible Design Systems</Headline>
        <Inline space={3}>
          <Text>Sarah Chen</Text>
          <Badge variant="primary">Staff Engineer</Badge>
          <Text variant="muted">Published May 15, 2026</Text>
        </Inline>
        <Divider />
      </Stack>

      {/* Article body */}
      <Stack space={6}>
        <Text>
          Accessible design systems form the backbone of inclusive digital
          experiences, ensuring that every user — regardless of ability — can
          interact with software confidently and independently. Building such
          systems requires deliberate decisions at every layer, from token
          choices to component APIs.
        </Text>

        <SectionMessage variant="info">
          <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
          <SectionMessage.Content>
            This article is part of our accessibility series. Check out the
            full series for more.
          </SectionMessage.Content>
        </SectionMessage>

        <Text>
          Design tokens serve as the foundation for communicating accessible
          visual properties like color contrast, focus states, and spacing.
          When tokens are defined with accessibility in mind from the start,
          every component built on top of them inherits those guarantees
          automatically.
        </Text>

        <List>
          <List.Item>Semantic HTML as the foundation</List.Item>
          <List.Item>ARIA attributes for complex widgets</List.Item>
          <List.Item>Keyboard navigation patterns</List.Item>
          <List.Item>Color contrast and visual indicators</List.Item>
        </List>

        <Text>
          Investing in accessibility at the design system level multiplies the
          impact across every product built on top of it. Teams no longer need
          to solve the same accessibility problems in isolation — the design
          system becomes a shared foundation of inclusive defaults.
        </Text>
      </Stack>

      {/* Tags */}
      <Stack space={3}>
        <Divider />
        <Tag.Group label="Tags">
          <Tag id="accessibility">Accessibility</Tag>
          <Tag id="design-systems">Design Systems</Tag>
          <Tag id="react">React</Tag>
          <Tag id="wcag">WCAG</Tag>
        </Tag.Group>
      </Stack>

      {/* Related articles */}
      <Stack space={4}>
        <Headline level="2">Related Articles</Headline>
        <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
          <Card p={4}>
            <Stack space={2}>
              <Headline level="3">Getting Started with ARIA</Headline>
              <Text>
                A beginner's guide to ARIA roles and properties for building
                complex interactive widgets accessibly.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>
          <Card p={4}>
            <Stack space={2}>
              <Headline level="3">Keyboard Navigation Patterns</Headline>
              <Text>
                Learn how to design and implement fully keyboard-navigable
                interfaces that work for every user.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>
          <Card p={4}>
            <Stack space={2}>
              <Headline level="3">Color Contrast in Modern UIs</Headline>
              <Text>
                Ensure your color choices meet WCAG 2.2 requirements while
                maintaining a beautiful, on-brand visual design.
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
