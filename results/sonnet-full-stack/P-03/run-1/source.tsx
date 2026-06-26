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
    <Center maxWidth="xxlarge">
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
            <Badge variant="primary">Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={6}>
          <Text as="p">
            Design systems form the backbone of modern web applications,
            providing a shared visual language and component library that ensures
            consistency across an entire product. When accessibility is built
            into the foundation of these systems, every team that adopts them
            inherits those benefits automatically.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text as="p">
            The challenge lies in anticipating the diverse needs of users with
            disabilities, from those relying on screen readers to those
            navigating entirely by keyboard. Building inclusive components from
            the ground up is far more effective than retrofitting accessibility
            as an afterthought.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text as="p">
            By investing in accessible design systems, organizations empower
            every developer to ship products that work for everyone. The
            compounding effect of shared, well-tested accessible components
            accelerates development while raising the quality bar across the
            entire platform.
          </Text>
        </Stack>

        <Stack space={4}>
          <Divider />
          <Inline space={2}>
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        <Stack space={4}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            <Card>
              <Stack space={3}>
                <Headline level="3">
                  The Role of Semantics in Accessible UIs
                </Headline>
                <Text>
                  Explore how choosing the right HTML semantics reduces the need
                  for ARIA and makes components more robust.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card>
              <Stack space={3}>
                <Headline level="3">
                  Focus Management in Single-Page Apps
                </Headline>
                <Text>
                  Learn strategies for managing keyboard focus during route
                  transitions and dynamic content updates.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card>
              <Stack space={3}>
                <Headline level="3">
                  Testing Accessibility with Automated Tools
                </Headline>
                <Text>
                  A practical guide to integrating axe-core and other automated
                  accessibility checks into your CI pipeline.
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
