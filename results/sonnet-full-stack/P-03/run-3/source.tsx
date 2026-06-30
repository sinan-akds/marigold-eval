import {
  AppLayout,
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

const TestApp = () => {
  return (
    <AppLayout>
      <AppLayout.Main>
        <Container space={6}>
      <Stack space={8}>
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        <Stack space={4}>
          <Headline level="1">Building Accessible Design Systems</Headline>
          <Inline space={3} alignY="center">
            <Text>Sarah Chen</Text>
            <Badge variant="info">Staff Engineer</Badge>
            <Text>Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        <Stack space={5}>
          <Text>
            Accessibility in design systems is not an afterthought but a
            foundational requirement. When we build components that work for
            everyone, we create better experiences across the board. A
            well-designed system considers keyboard navigation, screen reader
            support, and visual contrast from the very start.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            Implementing accessibility requires both technical knowledge and
            empathy for users with different needs. From semantic HTML to ARIA
            roles, every detail contributes to a more inclusive product. Teams
            that prioritize accessibility from day one avoid costly retrofits
            down the line.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            By following these principles consistently, design systems become
            force multipliers for accessibility across your entire organization.
            Each accessible component you build benefits every product and team
            that adopts the system. Investing at the system level is the
            highest-leverage way to improve inclusion at scale.
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
                <Headline level="3">Color Contrast in Modern UIs</Headline>
                <Text>
                  Learn how to apply WCAG contrast ratios effectively across
                  your component library.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card>
              <Stack space={3}>
                <Headline level="3">Keyboard Navigation Patterns</Headline>
                <Text>
                  Explore common interaction models for keyboard users and how
                  to implement them well.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card>
              <Stack space={3}>
                <Headline level="3">ARIA Roles and Attributes</Headline>
                <Text>
                  A practical guide to using ARIA to make complex widgets
                  understandable to assistive technologies.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Columns>
        </Stack>
      </Stack>
        </Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
