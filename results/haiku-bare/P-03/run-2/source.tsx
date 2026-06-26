import {
  Box,
  Container,
  Heading,
  Text,
  Divider,
  Badge,
  Link,
  UnorderedList,
  ListItem,
  Callout,
} from "@marigold/components";

const TestApp = () => {
  return (
    <Box as="main" padding="large">
      <Container size="small">
        {/* Breadcrumb trail */}
        <Box marginBottom="medium">
          <Text size="small">
            <Link href="#">Blog</Link>
            {" > "}
            <Link href="#">Frontend</Link>
            {" > "}
            <Link href="#">Accessibility</Link>
          </Text>
        </Box>

        {/* Article header */}
        <Box marginBottom="large">
          <Heading level="1" size="large" marginBottom="medium">
            Building Accessible Design Systems
          </Heading>

          <Box display="flex" gap="medium" marginBottom="medium" alignItems="center">
            <Text>Sarah Chen</Text>
            <Badge>Staff Engineer</Badge>
            <Text>Published May 15, 2026</Text>
          </Box>

          <Divider />
        </Box>

        {/* Article body */}
        <Box marginBottom="large">
          <Text marginBottom="medium">
            Accessibility is not an afterthought in modern design systems. It must be baked into every
            component, every interaction, and every decision we make. When we build accessible design
            systems, we create products that work for everyone, regardless of their abilities. This
            approach benefits not just users with disabilities, but all users who may find themselves
            in different contexts or situations.
          </Text>

          <Callout type="info" marginBottom="medium">
            This article is part of our accessibility series. Check out the full series for more.
          </Callout>

          <Text marginBottom="medium">
            Throughout this article, we'll explore the core principles that make design systems truly
            accessible. We'll look at practical strategies for implementation, common pitfalls to avoid,
            and tools that can help validate your work. By the end, you should have a clearer roadmap
            for building inclusive components.
          </Text>

          <Heading level="2" marginBottom="medium">
            Key Principles
          </Heading>

          <UnorderedList marginBottom="medium">
            <ListItem>Semantic HTML as the foundation</ListItem>
            <ListItem>ARIA attributes for complex widgets</ListItem>
            <ListItem>Keyboard navigation patterns</ListItem>
            <ListItem>Color contrast and visual indicators</ListItem>
          </UnorderedList>

          <Text>
            Implementing these principles requires a shift in how we think about component design. Rather
            than adding accessibility features at the end, we need to start with accessibility in mind
            from the very beginning. This ensures that our components are not just compliant, but
            genuinely usable for everyone.
          </Text>
        </Box>

        {/* Tags */}
        <Box marginBottom="large">
          <Divider marginBottom="medium" />
          <Box display="flex" gap="small" flexWrap="wrap">
            <Badge>Accessibility</Badge>
            <Badge>Design Systems</Badge>
            <Badge>React</Badge>
            <Badge>WCAG</Badge>
          </Box>
        </Box>

        {/* Related articles */}
        <Box>
          <Heading level="2" marginBottom="medium">
            Related Articles
          </Heading>

          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="large">
            <Box borderWidth="1" borderColor="neutral-200" borderRadius="medium" padding="medium">
              <Heading level="3" size="medium" marginBottom="small">
                Keyboard Navigation Best Practices
              </Heading>
              <Text marginBottom="medium">
                Learn how to implement keyboard navigation that feels natural and intuitive for all users.
              </Text>
              <Link href="#">Read more →</Link>
            </Box>

            <Box borderWidth="1" borderColor="neutral-200" borderRadius="medium" padding="medium">
              <Heading level="3" size="medium" marginBottom="small">
                WCAG 2.1 Compliance Checklist
              </Heading>
              <Text marginBottom="medium">
                A comprehensive guide to meeting WCAG 2.1 Level AA standards in your component library.
              </Text>
              <Link href="#">Read more →</Link>
            </Box>

            <Box borderWidth="1" borderColor="neutral-200" borderRadius="medium" padding="medium">
              <Heading level="3" size="medium" marginBottom="small">
                Testing for Color Blindness
              </Heading>
              <Text marginBottom="medium">
                Strategies and tools for ensuring your design system works for users with color vision deficiency.
              </Text>
              <Link href="#">Read more →</Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TestApp;
