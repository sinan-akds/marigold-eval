import {
  AppLayout,
  Badge,
  Card,
  Columns,
  Container,
  Divider,
  Headline,
  Inline,
  Link,
  SectionMessage,
  Stack,
  Text,
} from "@marigold/components";

const TestApp = () => {
  return (
    <AppLayout>
      <AppLayout.Main>
        <Container contentLength="short">
          <Stack space={8}>
            {/* Breadcrumbs */}
            <Inline space={0} alignY="center">
              <Link href="#blog">Blog</Link>
              <Text>/</Text>
              <Link href="#frontend">Frontend</Link>
              <Text>/</Text>
              <Link href="#accessibility">Accessibility</Link>
            </Inline>

            {/* Article Header */}
            <Stack space={3}>
              <Headline level="1">Building Accessible Design Systems</Headline>

              <Inline space={2} alignY="center">
                <Text weight="semibold">Sarah Chen</Text>
                <Badge>Staff Engineer</Badge>
                <Text>Published May 15, 2026</Text>
              </Inline>

              <Divider />
            </Stack>

            {/* Article Body */}
            <Stack space={5}>
              {/* First paragraph */}
              <Text>
                Accessibility is not an afterthought in design system development.
                It's the foundation upon which all great design systems are built.
                When we prioritize accessibility from the beginning, we create
                components that work for everyone, regardless of their abilities or
                the devices they use.
              </Text>

              {/* Info callout */}
              <SectionMessage variant="info">
                This article is part of our accessibility series. Check out the full
                series for more.
              </SectionMessage>

              {/* Second paragraph */}
              <Text>
                Building accessible components requires understanding the needs of
                users with diverse abilities. From keyboard navigation to screen
                reader support, every interaction matters. The investment in
                accessibility today pays dividends in user satisfaction and legal
                compliance tomorrow.
              </Text>

              {/* Key points list */}
              <Stack space={1}>
                <Text>• Semantic HTML as the foundation</Text>
                <Text>• ARIA attributes for complex widgets</Text>
                <Text>• Keyboard navigation patterns</Text>
                <Text>• Color contrast and visual indicators</Text>
              </Stack>

              {/* Final paragraph */}
              <Text>
                The journey to building truly accessible design systems is
                continuous. As web standards evolve and user needs become clearer,
                our components must evolve with them. By committing to accessibility
                principles, we not only serve more users but also create more
                robust and maintainable code for our teams.
              </Text>
            </Stack>

            {/* Tags */}
            <Stack space={3}>
              <Divider />
              <Inline space={1}>
                <Text weight="semibold">Accessibility</Text>
                <Text weight="semibold">Design Systems</Text>
                <Text weight="semibold">React</Text>
                <Text weight="semibold">WCAG</Text>
              </Inline>
            </Stack>

            {/* Related Articles */}
            <Stack space={3}>
              <Headline level="2">Related Articles</Headline>

              <Columns
                collapseAt="tablet"
                space={5}
                columns={[1, 2, 3]}
              >
                <Card space={3}>
                  <Headline level="3">Color Accessibility Fundamentals</Headline>
                  <Stack space={3}>
                    <Text>
                      Learn how to ensure your color palettes meet WCAG contrast
                      requirements while maintaining visual appeal.
                    </Text>
                    <Link href="#article1">Read more →</Link>
                  </Stack>
                </Card>

                <Card space={3}>
                  <Headline level="3">Keyboard Navigation Patterns</Headline>
                  <Stack space={3}>
                    <Text>
                      Discover best practices for implementing keyboard navigation
                      in complex interactive components.
                    </Text>
                    <Link href="#article2">Read more →</Link>
                  </Stack>
                </Card>

                <Card space={3}>
                  <Headline level="3">Testing for Accessibility</Headline>
                  <Stack space={3}>
                    <Text>
                      Explore automated and manual testing strategies to ensure
                      your components work for all users.
                    </Text>
                    <Link href="#article3">Read more →</Link>
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
