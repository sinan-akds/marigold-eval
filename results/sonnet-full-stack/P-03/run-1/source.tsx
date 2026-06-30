import {
  AppLayout,
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

export default function TestApp() {
  return (
    <AppLayout>
      <AppLayout.Main>
        <Center maxWidth="large">
      <Stack space={10}>
        {/* Breadcrumb trail */}
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        {/* Article */}
        <Stack space={6}>
          {/* Article Header */}
          <Stack space={4}>
            <Headline level="1">Building Accessible Design Systems</Headline>
            <Inline space={4} alignY="center">
              <Text weight="bold">Sarah Chen</Text>
              <Badge variant="info">Staff Engineer</Badge>
              <Text>Published May 15, 2026</Text>
            </Inline>
            <Divider />
          </Stack>

          {/* Article Body */}
          <Stack space={6}>
            <Text>
              Accessible design systems are the foundation of inclusive digital
              experiences. When built thoughtfully, they enable teams to ship
              accessible products by default rather than as an afterthought.
              The components and guidelines within a design system set a shared
              standard that every team can rely on.
            </Text>

            <SectionMessage variant="info">
              <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
              <SectionMessage.Content>
                This article is part of our accessibility series. Check out the
                full series for more.
              </SectionMessage.Content>
            </SectionMessage>

            <Text>
              Design systems that prioritize accessibility reduce the cognitive
              load on individual developers and designers. Standardized,
              accessible components create a shared language that scales across
              organizations. Teams ship faster with confidence when the
              foundation is solid.
            </Text>

            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            <Text>
              As organizations grow, the return on investment in accessible
              design systems compounds. Teams move faster with confidence,
              knowing every component meets the accessibility bar they have set
              together. Consistency in implementation leads to consistency in
              experience for all users.
            </Text>
          </Stack>

          {/* Tags row */}
          <Stack space={4}>
            <Divider />
            <Inline space={3}>
              <Badge>Accessibility</Badge>
              <Badge>Design Systems</Badge>
              <Badge>React</Badge>
              <Badge>WCAG</Badge>
            </Inline>
          </Stack>
        </Stack>

        {/* Related Articles */}
        <Stack space={4}>
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            <Card p={4}>
              <Stack space={3}>
                <Headline level="3">Getting Started with ARIA Roles</Headline>
                <Text>
                  A practical guide to using ARIA roles effectively in modern
                  web applications.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level="3">
                  Keyboard Navigation Best Practices
                </Headline>
                <Text>
                  Learn how to build keyboard-friendly interfaces that work for
                  everyone.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level="3">Color Contrast in Design Systems</Headline>
                <Text>
                  Understanding WCAG color contrast requirements and how to
                  meet them consistently.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Columns>
        </Stack>
      </Stack>
        </Center>
      </AppLayout.Main>
    </AppLayout>
  );
}
