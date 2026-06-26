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
    <Center maxWidth="large" space={8}>
      <Breadcrumbs>
        <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
      </Breadcrumbs>

      <Stack space={6}>
        {/* Article header */}
        <Stack space={4}>
          <Headline level={1}>Building Accessible Design Systems</Headline>
          <Inline space={3} alignY="center">
            <Text weight="bold">Sarah Chen</Text>
            <Badge variant="info">Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        {/* Article body */}
        <Stack space={6}>
          <Text>
            Accessible design systems form the backbone of inclusive digital
            experiences. When teams invest in accessibility from the ground up,
            they create components that work for everyone — regardless of
            disability, device, or context of use.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text>
            Design systems that prioritize accessibility empower developers to
            make the right choices by default. Rather than retrofitting
            accessible patterns after the fact, the system itself encodes best
            practices into every component it ships.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text>
            As you adopt these principles throughout your design system, you
            will notice a compounding effect: each accessible component makes
            the next one easier to build correctly, creating a virtuous cycle of
            inclusive design across every product that consumes the system.
          </Text>
        </Stack>

        {/* Tags */}
        <Stack space={3}>
          <Divider />
          <Inline space={2}>
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related articles */}
        <Stack space={4}>
          <Headline level={2}>Related Articles</Headline>
          <Tiles tilesWidth="260px" space={4} stretch>
            <Card p={4}>
              <Stack space={3}>
                <Headline level={4}>Color Contrast in Modern UIs</Headline>
                <Text>
                  Learn how to choose color combinations that meet WCAG contrast
                  ratios while keeping your visual design compelling.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level={4}>Keyboard Navigation Patterns</Headline>
                <Text>
                  A deep dive into implementing keyboard-first interaction
                  models for complex widget components in your system.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level={4}>ARIA Roles and When to Use Them</Headline>
                <Text>
                  Understand which ARIA roles genuinely improve the experience
                  and which ones create noise for screen reader users.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Tiles>
        </Stack>
      </Stack>
    </Center>
  );
};

export default TestApp;
