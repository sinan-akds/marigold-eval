import {
  Badge,
  Breadcrumbs,
  Card,
  Container,
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
    <Container space={8}>
      <Stack space={8}>
        <nav aria-label="Breadcrumbs">
          <Breadcrumbs>
            <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
          </Breadcrumbs>
        </nav>

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
          <Text as="p">
            Accessible design systems are more than just a checklist of WCAG
            guidelines — they are the backbone of inclusive products. When teams
            invest in accessibility at the system level, every component built
            on top inherits those guarantees automatically.
          </Text>

          <SectionMessage variant="info">
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          <Text as="p">
            Building with accessibility in mind requires a shift in perspective.
            Rather than retrofitting features after the fact, design systems
            that bake in accessibility from the start empower developers to
            write inclusive code by default, reducing the cost of compliance
            significantly.
          </Text>

          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          <Text as="p">
            The journey to a truly accessible design system is iterative.
            Continuously testing with assistive technologies and gathering
            feedback from users with disabilities ensures the system evolves to
            meet real-world needs and remains compliant as standards advance.
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

        {/* Related articles */}
        <Stack space={4}>
          <Headline level={2}>Related Articles</Headline>
          <Tiles tilesWidth="280px" space={4} stretch equalHeight>
            <Card p={4}>
              <Stack space={3}>
                <Headline level={3}>Color Contrast in Modern UIs</Headline>
                <Text>
                  A deep dive into WCAG contrast ratios and how to audit your
                  design tokens for compliance.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level={3}>Keyboard-First Component Design</Headline>
                <Text>
                  How to ensure every interactive element in your component
                  library is fully keyboard navigable.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
            <Card p={4}>
              <Stack space={3}>
                <Headline level={3}>Screen Readers and ARIA Roles</Headline>
                <Text>
                  Practical patterns for adding ARIA roles and labels to complex
                  interactive widgets in your app.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Tiles>
        </Stack>
      </Stack>
    </Container>
  );
};

export default TestApp;
