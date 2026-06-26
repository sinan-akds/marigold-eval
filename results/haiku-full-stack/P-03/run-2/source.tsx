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
        <Container>
      <Stack space={6}>
        {/* Breadcrumbs */}
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/frontend">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/accessibility">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        <Stack space={6}>
          {/* Article Header */}
          <Stack space={4}>
            <Headline level="1">Building Accessible Design Systems</Headline>

            {/* Author info row */}
            <Inline space={2} alignY="center">
              <Text weight="bold">Sarah Chen</Text>
              <Badge>Staff Engineer</Badge>
              <Text>Published May 15, 2026</Text>
            </Inline>

            <Divider />
          </Stack>

          {/* Article Body */}
          <Stack space={6}>
            {/* First paragraph */}
            <Text>
              Creating accessible design systems is essential for ensuring that
              all users, regardless of their abilities, can interact with digital
              products effectively. Accessibility should not be an afterthought
              but rather a fundamental principle embedded in every aspect of
              design and development. When we prioritize accessibility from the
              start, we create better products for everyone.
            </Text>

            {/* Info callout */}
            <SectionMessage>
              <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
              <SectionMessage.Content>
                <Text>
                  This article is part of our accessibility series. Check out
                  the full series for more.
                </Text>
              </SectionMessage.Content>
            </SectionMessage>

            {/* Second paragraph */}
            <Text>
              The foundation of accessible design lies in understanding the
              diverse needs of users and implementing solutions that address
              these needs comprehensively. By following established guidelines
              and best practices, we can create inclusive experiences that serve
              a broader audience. Accessibility benefits everyone, not just
              people with disabilities.
            </Text>

            {/* List of items */}
            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            {/* Final paragraph */}
            <Text>
              Implementing these practices requires commitment and ongoing
              education, but the payoff is immense. Teams that embrace
              accessibility find themselves building more resilient, robust
              products that work better for all users. Start with these
              foundational principles today, and your users will thank you
              tomorrow.
            </Text>
          </Stack>

          {/* Tags */}
          <Stack space={2}>
            <Divider />
            <Inline space={2}>
              <Badge variant="primary">Accessibility</Badge>
              <Badge variant="primary">Design Systems</Badge>
              <Badge variant="primary">React</Badge>
              <Badge variant="primary">WCAG</Badge>
            </Inline>
          </Stack>

          {/* Related Articles Section */}
          <Stack space={4}>
            <Divider />
            <Headline level="2">Related Articles</Headline>

            <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
              {/* Card 1 */}
              <Card>
                <Stack space={3}>
                  <Headline level="3">
                    Testing for Accessibility Compliance
                  </Headline>
                  <Text>
                    Learn the tools and techniques to test your design systems
                    for accessibility standards.
                  </Text>
                  <Link href="/">Read more →</Link>
                </Stack>
              </Card>

              {/* Card 2 */}
              <Card>
                <Stack space={3}>
                  <Headline level="3">Advanced ARIA Patterns</Headline>
                  <Text>
                    Explore complex ARIA attributes and patterns for creating
                    truly accessible components.
                  </Text>
                  <Link href="/">Read more →</Link>
                </Stack>
              </Card>

              {/* Card 3 */}
              <Card>
                <Stack space={3}>
                  <Headline level="3">Inclusive Design Principles</Headline>
                  <Text>
                    Discover the core principles of inclusive design and how to
                    apply them to your work.
                  </Text>
                  <Link href="/">Read more →</Link>
                </Stack>
              </Card>
            </Columns>
          </Stack>
        </Stack>
      </Stack>
        </Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
