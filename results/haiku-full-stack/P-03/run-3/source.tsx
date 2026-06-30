import {
  AppLayout,
  Breadcrumbs,
  Container,
  Stack,
  Headline,
  Text,
  Badge,
  Inline,
  Divider,
  SectionMessage,
  List,
  Card,
  Columns,
  Link,
} from '@marigold/components';

const TestApp = () => {
  return (
    <AppLayout>
      <AppLayout.Main>
        <Container>
          <Stack space="section">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs>
          <Breadcrumbs.Item href="#blog">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#frontend">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#accessibility">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        {/* Article Header */}
        <Stack space="related">
          <Headline level="1">Building Accessible Design Systems</Headline>

          <Inline space="regular" alignY="center">
            <Text weight="medium">Sarah Chen</Text>
            <Badge variant="info">Staff Engineer</Badge>
            <Text variant="muted">Published May 15, 2026</Text>
          </Inline>

          <Divider />
        </Stack>

        {/* Article Body */}
        <Stack space="section">
          {/* First Paragraph */}
          <Text>
            Accessible design is not an afterthought—it's a fundamental principle that should be embedded from the very beginning of your design system. When you prioritize accessibility, you create inclusive experiences that benefit everyone, from users with disabilities to those in challenging environments. This article explores the key practices that make design systems truly accessible.
          </Text>

          {/* Info Callout */}
          <SectionMessage variant="info">
            <SectionMessage.Title>Part of our accessibility series</SectionMessage.Title>
            <SectionMessage.Content>
              This article is part of our accessibility series. Check out the full series for more.
            </SectionMessage.Content>
          </SectionMessage>

          {/* Second Paragraph */}
          <Text>
            Building an accessible design system requires collaboration between designers, developers, and accessibility specialists. It's not just about WCAG compliance; it's about creating a culture where accessibility is valued and integrated into every decision. The components you build should be flexible enough to adapt to different user needs while maintaining a consistent experience.
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
            As we continue to evolve our understanding of digital accessibility, remember that the best design systems are those that serve all users equally. Invest in accessibility testing, involve users with disabilities in your design process, and keep learning from the community. The effort you put in today will create a more inclusive web for everyone tomorrow.
          </Text>
        </Stack>

        {/* Tags Section */}
        <Stack space="related">
          <Divider />
          <Inline space="tight">
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Inline>
        </Stack>

        {/* Related Articles */}
        <Stack space="related">
          <Headline level="2">Related Articles</Headline>

          <Columns
            columns={[1, 1, 1]}
            space="section"
            collapseAt="40em"
          >
            {/* Article Card 1 */}
            <Card>
              <Stack space="related">
                <Headline level="3">Semantic HTML Best Practices</Headline>
                <Text>Learn how to structure your HTML documents to improve accessibility and SEO for your web applications.</Text>
                <Link href="#semantic-html">Read more →</Link>
              </Stack>
            </Card>

            {/* Article Card 2 */}
            <Card>
              <Stack space="related">
                <Headline level="3">ARIA Attributes Demystified</Headline>
                <Text>A comprehensive guide to using ARIA attributes correctly to enhance your component's accessibility features.</Text>
                <Link href="#aria-guide">Read more →</Link>
              </Stack>
            </Card>

            {/* Article Card 3 */}
            <Card>
              <Stack space="related">
                <Headline level="3">Testing for Accessibility</Headline>
                <Text>Discover the tools and techniques needed to thoroughly test your design system for accessibility compliance.</Text>
                <Link href="#testing-guide">Read more →</Link>
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
