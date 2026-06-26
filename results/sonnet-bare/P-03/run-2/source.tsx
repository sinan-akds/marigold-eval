import {
  Badge,
  Callout,
  Card,
  Column,
  Columns,
  Divider,
  Heading,
  Inline,
  Link,
  Stack,
  Text,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Stack
      space={8}
      style={{ maxWidth: '720px', margin: '0 auto', padding: '24px' }}
    >
      {/* Breadcrumbs */}
      <Inline space={2}>
        <Link href="#">Blog</Link>
        <Text>›</Text>
        <Link href="#">Frontend</Link>
        <Text>›</Text>
        <Text>Accessibility</Text>
      </Inline>

      {/* Article */}
      <Stack space={4}>
        {/* Header */}
        <Stack space={3}>
          <Heading level={1}>Building Accessible Design Systems</Heading>
          <Inline space={3}>
            <Text>Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text>Published May 15, 2026</Text>
          </Inline>
        </Stack>

        <Divider />

        {/* Body */}
        <Stack space={4}>
          <Text>
            Design systems have become the backbone of modern web development,
            providing consistent UI patterns across products and teams. Building
            them with accessibility in mind from the start saves significant
            rework later and ensures all users can engage with your product.
          </Text>

          <Callout variant="info">
            <Text>
              This article is part of our accessibility series. Check out the
              full series for more.
            </Text>
          </Callout>

          <Text>
            When we started rebuilding our design system, we made the deliberate
            choice to treat accessibility as a first-class requirement rather
            than a retrofit. Every component in the library now ships with
            keyboard navigation, screen reader support, and proper ARIA
            semantics baked in.
          </Text>

          <Stack space={2}>
            <Text>• Semantic HTML as the foundation</Text>
            <Text>• ARIA attributes for complex widgets</Text>
            <Text>• Keyboard navigation patterns</Text>
            <Text>• Color contrast and visual indicators</Text>
          </Stack>

          <Text>
            The journey to a fully accessible design system is ongoing, but the
            principles outlined here provide a solid foundation. Start small,
            iterate often, and always test with real assistive technologies to
            validate your assumptions.
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
      </Stack>

      {/* Related Articles */}
      <Stack space={4}>
        <Heading level={2}>Related Articles</Heading>
        <Columns space={4} columns={3} collapseBelow="small">
          <Column>
            <Card>
              <Stack space={3}>
                <Heading level={3}>ARIA Roles Explained</Heading>
                <Text>
                  A deep dive into ARIA roles and when to use them effectively
                  in your components.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Column>
          <Column>
            <Card>
              <Stack space={3}>
                <Heading level={3}>Keyboard Navigation Fundamentals</Heading>
                <Text>
                  Learn the essential patterns for building fully
                  keyboard-navigable web applications.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Column>
          <Column>
            <Card>
              <Stack space={3}>
                <Heading level={3}>Color Contrast in Practice</Heading>
                <Text>
                  Practical guidance for meeting WCAG 2.1 AA color contrast
                  requirements in real-world designs.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Column>
        </Columns>
      </Stack>
    </Stack>
  );
};

export default TestApp;
