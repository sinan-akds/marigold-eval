import {
  Badge,
  Breadcrumbs,
  Card,
  Center,
  Columns,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Center maxWidth="large" space={8}>
      <Stack space={8}>
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        <Stack space={6}>
          {/* Article header */}
          <Stack space={4}>
            <Headline level="1">Building Accessible Design Systems</Headline>
            <Inline space={3}>
              <Text>Sarah Chen</Text>
              <Badge variant="info">Staff Engineer</Badge>
              <Text variant="muted">Published May 15, 2026</Text>
            </Inline>
            <Divider />
          </Stack>

          {/* Article body */}
          <Stack space={6}>
            <Text as="p">
              Design systems serve as the backbone of modern product
              development, providing teams with a shared language of components,
              patterns, and guidelines. When built with accessibility in mind
              from the start, they ensure that every product is inclusive and
              usable by all people, regardless of ability or assistive
              technology.
            </Text>

            <SectionMessage variant="info">
              <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
              <SectionMessage.Content>
                This article is part of our accessibility series. Check out the
                full series for more.
              </SectionMessage.Content>
            </SectionMessage>

            <Text as="p">
              Accessibility is not an afterthought — it must be baked into
              every token, every component, and every pattern from the very
              beginning. Teams that treat it as a retroactive concern often face
              costly rewrites, fragmented user experiences, and products that
              fail compliance requirements.
            </Text>

            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            <Text as="p">
              By prioritizing accessibility at the design system level,
              organizations empower every product team to ship inclusive
              experiences by default. The investment pays dividends in reach,
              compliance, and trust — proving that great design and inclusive
              design are never in conflict.
            </Text>
          </Stack>

          {/* Tags */}
          <Stack space={4}>
            <Divider />
            <Inline space={2}>
              <Badge>Accessibility</Badge>
              <Badge>Design Systems</Badge>
              <Badge>React</Badge>
              <Badge>WCAG</Badge>
            </Inline>
          </Stack>
        </Stack>

        {/* Related articles */}
        <Stack space={4}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            <Card p={4}>
              <Stack space={3}>
                <Headline level="3">Color Contrast in Practice</Headline>
                <Text>
                  A hands-on guide to meeting WCAG color contrast requirements
                  across light and dark themes.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level="3">Keyboard Navigation Patterns</Headline>
                <Text>
                  Explore proven patterns for making complex interactive widgets
                  fully keyboard accessible.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level="3">Semantic HTML Fundamentals</Headline>
                <Text>
                  Learn how the right HTML elements form a solid accessible
                  foundation for any design system.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Columns>
        </Stack>
      </Stack>
    </Center>
  );
};

export default TestApp;
