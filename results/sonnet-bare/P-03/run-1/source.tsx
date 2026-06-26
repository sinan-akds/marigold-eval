import React from 'react';
import {
  Stack,
  Inline,
  Text,
  Heading,
  Badge,
  Divider,
  Card,
  Link,
  Tiles,
} from '@marigold/components';

const InfoCallout = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <Text>{children}</Text>
  </Card>
);

const RelatedCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Card>
    <Stack space={3}>
      <Heading level={3}>{title}</Heading>
      <Text>{description}</Text>
      <Link href="#">Read more →</Link>
    </Stack>
  </Card>
);

const TestApp = () => {
  return (
    <Stack space={8}>
      {/* Breadcrumb */}
      <Inline space={2} alignY="center">
        <Link href="#">Blog</Link>
        <Text>&gt;</Text>
        <Link href="#">Frontend</Link>
        <Text>&gt;</Text>
        <Text>Accessibility</Text>
      </Inline>

      {/* Article */}
      <Stack space={6}>
        {/* Header */}
        <Stack space={4}>
          <Heading level={1}>Building Accessible Design Systems</Heading>
          <Inline space={4} alignY="center">
            <Text weight="bold">Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text>Published May 15, 2026</Text>
          </Inline>
          <Divider />
        </Stack>

        {/* Body */}
        <Stack space={5}>
          <Text>
            Accessibility is not an afterthought — it is a core design principle
            that shapes how we build interfaces from the ground up. When design
            systems treat accessibility as a first-class concern, every team that
            consumes them inherits those guarantees automatically.
          </Text>

          <InfoCallout>
            This article is part of our accessibility series. Check out the full
            series for more.
          </InfoCallout>

          <Text>
            Creating truly inclusive experiences requires collaboration between
            designers, engineers, and accessibility specialists. A shared design
            system provides a single source of truth for accessible patterns,
            making it easier to ship features that work for everyone.
          </Text>

          <Stack space={2}>
            <Text>- Semantic HTML as the foundation</Text>
            <Text>- ARIA attributes for complex widgets</Text>
            <Text>- Keyboard navigation patterns</Text>
            <Text>- Color contrast and visual indicators</Text>
          </Stack>

          <Text>
            Adopting these practices consistently across your component library
            will reduce audit failures, improve user satisfaction, and
            future-proof your system as standards continue to evolve.
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
        <Tiles columns={[1, 3]} space={4}>
          <RelatedCard
            title="ARIA Live Regions Explained"
            description="Learn how to announce dynamic content changes to screen reader users without disrupting their flow."
          />
          <RelatedCard
            title="Keyboard Traps and Focus Management"
            description="Discover patterns for managing focus in modals, drawers, and other overlay components."
          />
          <RelatedCard
            title="Color Contrast in Practice"
            description="A practical guide to meeting WCAG contrast ratios while keeping your brand palette intact."
          />
        </Tiles>
      </Stack>
    </Stack>
  );
};

export default TestApp;
