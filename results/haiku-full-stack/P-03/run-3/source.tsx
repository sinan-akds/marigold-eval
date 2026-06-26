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
    <Center maxWidth="xxlarge" space={8}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs">
          <Breadcrumbs>
            <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
            <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
          </Breadcrumbs>
        </nav>

        {/* Article Header */}
        <Stack space={4}>
          <Headline level={1}>Building Accessible Design Systems</Headline>

          {/* Article Metadata Row */}
          <Inline space={4} alignY="center">
            <Text weight="bold">Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text>Published May 15, 2026</Text>
          </Inline>

          <Divider />
        </Stack>

        {/* Article Body */}
        <Stack space={6}>
          {/* First Paragraph */}
          <Text>
            Accessible design systems form the backbone of inclusive digital
            experiences. When we prioritize accessibility from the ground up, we
            create products that serve everyone, regardless of their abilities or
            circumstances. By establishing patterns and components that inherently
            support assistive technologies, we reduce friction and empower teams
            to build responsibly.
          </Text>

          {/* Info Callout */}
          <SectionMessage>
            <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the
              full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          {/* Second Paragraph */}
          <Text>
            The journey to accessibility is not a one-time effort but an
            ongoing commitment. It requires understanding how people interact
            with our designs, testing with real users, and iterating based on
            feedback. Good accessibility practices often improve the overall
            user experience for everyone, making interfaces clearer, more
            predictable, and easier to navigate.
          </Text>

          {/* Key Points List */}
          <List>
            <List.Item>Semantic HTML as the foundation</List.Item>
            <List.Item>ARIA attributes for complex widgets</List.Item>
            <List.Item>Keyboard navigation patterns</List.Item>
            <List.Item>Color contrast and visual indicators</List.Item>
          </List>

          {/* Final Paragraph */}
          <Text>
            Building with accessibility in mind is not a limitation—it is an
            opportunity to create better, more thoughtful products. Teams that
            embrace accessibility principles find they have fewer bugs, better
            user satisfaction, and reach a wider audience. Start small, measure
            your progress, and celebrate the impact you are making.
          </Text>
        </Stack>

        {/* Tags Section */}
        <Stack space={4}>
          <Divider />
          <Inline space={3}>
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related Articles Section */}
        <Stack space={4}>
          <Headline level={2}>Related Articles</Headline>

          <Columns
            columns={[1, 1, 1]}
            space={4}
            collapseAt="48em"
          >
            {/* Card 1 */}
            <Card>
              <Stack space={3}>
                <Headline level={4}>
                  Accessible Color Contrast Ratios
                </Headline>
                <Text>
                  Learn how to choose color combinations that meet WCAG
                  standards while maintaining your design aesthetic.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>

            {/* Card 2 */}
            <Card>
              <Stack space={3}>
                <Headline level={4}>
                  Keyboard Navigation Patterns
                </Headline>
                <Text>
                  Master the essential keyboard interactions that make your
                  interface usable for all users.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>

            {/* Card 3 */}
            <Card>
              <Stack space={3}>
                <Headline level={4}>
                  Testing with Assistive Technologies
                </Headline>
                <Text>
                  Explore tools and techniques for validating your design with
                  screen readers and other assistive tools.
                </Text>
                <Link href="#">Read more →</Link>
              </Stack>
            </Card>
          </Columns>
        </Stack>
      </Center>
  );
};

export default TestApp;
