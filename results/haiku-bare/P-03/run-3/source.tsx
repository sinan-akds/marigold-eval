import {
  Breadcrumb,
  BreadcrumbItem,
  Heading,
  Text,
  Badge,
  Divider,
  Box,
  Link,
  List,
  ListItem,
  Callout,
  Grid,
} from '@marigold/components';

const TestApp = () => {
  return (
    <Box
      css={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}
    >
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem>Blog</BreadcrumbItem>
        <BreadcrumbItem>Frontend</BreadcrumbItem>
        <BreadcrumbItem>Accessibility</BreadcrumbItem>
      </Breadcrumb>

      {/* Article Header */}
      <Box css={{ marginTop: '2rem' }}>
        <Heading level="1" css={{ marginBottom: '1rem' }}>
          Building Accessible Design Systems
        </Heading>

        <Box
          css={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Text>Sarah Chen</Text>
          <Badge>Staff Engineer</Badge>
          <Text css={{ fontSize: '0.9rem', color: '#666' }}>
            Published May 15, 2026
          </Text>
        </Box>

        <Divider css={{ marginBottom: '2rem' }} />
      </Box>

      {/* Article Body */}
      <Box css={{ lineHeight: '1.6' }}>
        {/* First Paragraph */}
        <Text css={{ marginBottom: '1.5rem', display: 'block' }}>
          Accessibility is not an afterthought in modern web development—it's a fundamental pillar
          of creating inclusive user experiences. A well-designed design system must prioritize
          accessibility from the ground up, ensuring that all users, regardless of ability, can
          navigate and interact with your application effectively.
        </Text>

        {/* Callout */}
        <Callout
          css={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f4ff',
            borderLeft: '4px solid #0066cc',
          }}
        >
          <Text css={{ fontSize: '0.95rem' }}>
            This article is part of our accessibility series. Check out the full series for more.
          </Text>
        </Callout>

        {/* Second Paragraph */}
        <Text css={{ marginBottom: '1.5rem', display: 'block' }}>
          When we invest in accessibility, we're not just meeting compliance requirements or
          following best practices—we're creating tools that empower everyone. From keyboard
          navigation to color contrast, every detail contributes to an experience that works for
          all users.
        </Text>

        {/* List */}
        <List css={{ marginBottom: '1.5rem', marginLeft: '1.5rem' }}>
          <ListItem>Semantic HTML as the foundation</ListItem>
          <ListItem>ARIA attributes for complex widgets</ListItem>
          <ListItem>Keyboard navigation patterns</ListItem>
          <ListItem>Color contrast and visual indicators</ListItem>
        </List>

        {/* Final Paragraph */}
        <Text css={{ marginBottom: '2rem', display: 'block' }}>
          Building an accessible design system requires continuous learning and iteration. By
          prioritizing these principles from day one, you create a foundation that scales with your
          product and truly serves all your users.
        </Text>
      </Box>

      {/* Tags Section */}
      <Divider css={{ marginBottom: '1.5rem' }} />
      <Box
        css={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '3rem',
        }}
      >
        <Badge>Accessibility</Badge>
        <Badge>Design Systems</Badge>
        <Badge>React</Badge>
        <Badge>WCAG</Badge>
      </Box>

      {/* Related Articles */}
      <Heading level="2" css={{ marginBottom: '1.5rem' }}>
        Related Articles
      </Heading>
      <Grid
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Article Card 1 */}
        <Box
          css={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Heading level="3" css={{ marginBottom: '0.75rem' }}>
            ARIA Labels and Descriptions
          </Heading>
          <Text css={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            Learn how to effectively use ARIA attributes to enhance widget accessibility and
            improve screen reader support.
          </Text>
          <Link href="#" css={{ marginTop: 'auto' }}>
            Read more →
          </Link>
        </Box>

        {/* Article Card 2 */}
        <Box
          css={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Heading level="3" css={{ marginBottom: '0.75rem' }}>
            Testing for Accessibility
          </Heading>
          <Text css={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            Discover tools and techniques for automated and manual testing to ensure your design
            system meets accessibility standards.
          </Text>
          <Link href="#" css={{ marginTop: 'auto' }}>
            Read more →
          </Link>
        </Box>

        {/* Article Card 3 */}
        <Box
          css={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Heading level="3" css={{ marginBottom: '0.75rem' }}>
            Accessible Data Visualization
          </Heading>
          <Text css={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
            Explore patterns for making complex data visualizations accessible to users with color
            blindness and other visual impairments.
          </Text>
          <Link href="#" css={{ marginTop: 'auto' }}>
            Read more →
          </Link>
        </Box>
      </Grid>
    </Box>
  );
};

export default TestApp;
