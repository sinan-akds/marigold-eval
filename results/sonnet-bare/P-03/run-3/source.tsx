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
  Stack,
  Text,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Center>
      <Stack space={8}>

        <Breadcrumbs>
          <Breadcrumbs.Item href="/blog">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/frontend">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item>Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        <Stack space={4}>
          <Headline level={1}>Building Accessible Design Systems</Headline>
          <Inline space={3} alignY="center">
            <Text>Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text>Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={6}>
          <Text>
            Accessible design systems form the backbone of inclusive user
            interfaces. When we build components with accessibility in mind
            from the start, we create better experiences for all users, not
            just those with disabilities.
          </Text>

          <Card>
            <Text>
              This article is part of our accessibility series. Check out the
              full series for more.
            </Text>
          </Card>

          <Text>
            The principles of accessible design extend beyond technical
            implementation. They require a cultural shift in how teams
            approach product development, from initial design sketches to
            final code reviews and beyond.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            By incorporating these principles into your design system, you
            create a multiplier effect where every product built on the system
            inherits accessible foundations automatically.
          </Text>
        </Stack>

        <Stack space={3}>
          <Divider />
          <Inline space={2}>
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        <Stack space={4}>
          <Headline level={2}>Related Articles</Headline>
          <Columns columns={3} space={4}>
            <Card>
              <Stack space={2}>
                <Headline level={3}>WCAG 2.2: What's New</Headline>
                <Text>
                  Explore the latest updates to web accessibility guidelines
                  and what they mean for your projects.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card>
              <Stack space={2}>
                <Headline level={3}>Focus Management in SPAs</Headline>
                <Text>
                  Learn how to manage keyboard focus effectively in
                  single-page applications for a seamless user experience.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card>
              <Stack space={2}>
                <Headline level={3}>Color Systems for Accessibility</Headline>
                <Text>
                  Designing a color palette that meets WCAG contrast
                  requirements without sacrificing visual aesthetics.
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
