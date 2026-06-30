import {
  Badge,
  Breadcrumbs,
  Card,
  Center,
  Columns,
  Divider,
  Headline,
  Inline,
  Inset,
  Link,
  List,
  SectionMessage,
  Stack,
  Text,
} from '@marigold/components';

const ArticlePage = () => {
  return (
    <Center maxWidth="xlarge">
      <Stack space="section">
        <Breadcrumbs>
          <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Frontend</Breadcrumbs.Item>
          <Breadcrumbs.Item href="#">Accessibility</Breadcrumbs.Item>
        </Breadcrumbs>

        <Stack space="group">
          {/* Article header */}
          <Stack space="regular">
            <Headline level="1">Building Accessible Design Systems</Headline>
            <Inline space="related" alignY="center">
              <Text weight="bold">Sarah Chen</Text>
              <Badge variant="info">Staff Engineer</Badge>
              <Text variant="muted">Published May 15, 2026</Text>
            </Inline>
            <Divider />
          </Stack>

          {/* Article body */}
          <Stack space="regular">
            <Text>
              Accessible design systems are the foundation of inclusive digital products. They
              provide a shared vocabulary for designers and engineers to build interfaces that
              work for everyone, regardless of ability or the assistive technology they rely on.
            </Text>

            <SectionMessage variant="info">
              <SectionMessage.Title>Accessibility Series</SectionMessage.Title>
              <SectionMessage.Content>
                This article is part of our accessibility series. Check out the full series for more.
              </SectionMessage.Content>
            </SectionMessage>

            <Text>
              Building an accessible design system goes beyond checklists and audits. It requires
              deep empathy for how people with disabilities interact with technology and a sustained
              commitment to involving real users throughout the design and development process.
            </Text>

            <List>
              <List.Item>Semantic HTML as the foundation</List.Item>
              <List.Item>ARIA attributes for complex widgets</List.Item>
              <List.Item>Keyboard navigation patterns</List.Item>
              <List.Item>Color contrast and visual indicators</List.Item>
            </List>

            <Text>
              Accessibility in design systems is an ongoing practice, not a one-time effort.
              Regular audits, evolving standards, and continuous feedback from users with
              disabilities keep your system genuinely inclusive over time.
            </Text>
          </Stack>

          {/* Tags */}
          <Stack space="related">
            <Divider />
            <Inline space="related">
              <Badge>Accessibility</Badge>
              <Badge>Design Systems</Badge>
              <Badge>React</Badge>
              <Badge>WCAG</Badge>
            </Inline>
          </Stack>
        </Stack>

        {/* Related articles */}
        <Stack space="regular">
          <Headline level="2">Related Articles</Headline>
          <Columns columns={[1, 1, 1]} space={4} collapseAt="40em">
            <Card>
              <Inset spaceX="padding-regular" spaceY="padding-snug">
                <Stack space="related">
                  <Headline level="3">ARIA Roles Explained</Headline>
                  <Text>
                    Learn how ARIA roles help assistive technologies understand the structure of your interface.
                  </Text>
                  <Link href="#">Read more →</Link>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset spaceX="padding-regular" spaceY="padding-snug">
                <Stack space="related">
                  <Headline level="3">Focus Management Patterns</Headline>
                  <Text>
                    Discover best practices for managing keyboard focus in complex interactive web applications.
                  </Text>
                  <Link href="#">Read more →</Link>
                </Stack>
              </Inset>
            </Card>
            <Card>
              <Inset spaceX="padding-regular" spaceY="padding-snug">
                <Stack space="related">
                  <Headline level="3">Color Contrast in UI Design</Headline>
                  <Text>
                    Understand WCAG color contrast requirements and practical techniques to meet them in practice.
                  </Text>
                  <Link href="#">Read more →</Link>
                </Stack>
              </Inset>
            </Card>
          </Columns>
        </Stack>
      </Stack>
    </Center>
  );
};

export default ArticlePage;
