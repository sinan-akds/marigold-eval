import {
  Badge,
  Breadcrumbs,
  Card,
  Center,
  Divider,
  Headline,
  Inline,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
  Tiles,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Center maxWidth="xxlarge" space={10}>
      <nav aria-label="Breadcrumbs">
        <Breadcrumbs maxVisibleItems={3}>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>
      </nav>

      <Stack space={4}>
        <Headline level="1">Building Accessible Design Systems</Headline>
        <Inline space={4} alignY="center">
          <Text weight="bold">Sarah Chen</Text>
          <Badge variant="info">Staff Engineer</Badge>
          <Text variant="muted">Published May 15, 2026</Text>
        </Inline>
        <Divider />
      </Stack>

      <Stack space={6}>
        <Text>
          Accessible design systems are the backbone of inclusive digital
          products. Building them requires careful attention to semantic
          structure, keyboard interactions, and visual clarity across all user
          contexts.
        </Text>

        <SectionMessage variant="info">
          <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
          <SectionMessage.Content>
            This article is part of our accessibility series. Check out the
            full series for more.
          </SectionMessage.Content>
        </SectionMessage>

        <Text>
          From color contrast ratios to ARIA labeling, every decision in a
          design system shapes the experience for users who rely on assistive
          technologies. A well-structured component library makes accessibility
          the path of least resistance for developers and a richer experience
          for end users.
        </Text>

        <List>
          <List.Item>Semantic HTML as the foundation</List.Item>
          <List.Item>ARIA attributes for complex widgets</List.Item>
          <List.Item>Keyboard navigation patterns</List.Item>
          <List.Item>Color contrast and visual indicators</List.Item>
        </List>

        <Text>
          Investing in accessibility from day one means less retrofitting later,
          higher user satisfaction, and products that genuinely work for
          everyone. These principles guide our approach to building the next
          generation of design systems.
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
        <Tiles tilesWidth="280px" space={4} stretch>
          <Card p={4}>
            <Stack space={3}>
              <Headline level="3">
                Keyboard Navigation in Modern Web Apps
              </Headline>
              <Text>
                Discover best practices for building keyboard-first navigation
                experiences that work for every user.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>
          <Card p={4}>
            <Stack space={3}>
              <Headline level="3">Designing for Screen Readers</Headline>
              <Text>
                A comprehensive guide to ARIA roles and crafting components that
                communicate clearly to assistive technologies.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>
          <Card p={4}>
            <Stack space={3}>
              <Headline level="3">Color Contrast: Beyond the Minimum</Headline>
              <Text>
                Why meeting WCAG AA is just the starting point, and how to
                build color systems that truly work for everyone.
              </Text>
              <Link href="#">Read more →</Link>
            </Stack>
          </Card>
        </Tiles>
      </Stack>
    </Center>
  );
};

export default TestApp;
