import { useState, useMemo, useEffect } from 'react';
import {
  Headline,
  Text,
  SearchField,
  Select,
  Button,
  Drawer,
  Slider,
  Checkbox,
  Switch,
  Card,
  Badge,
  Stack,
  Inline,
  Tiles,
  Tag,
  EmptyState,
  Pagination,
  Container,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  size: string;
  inStock: boolean;
  status: 'New' | 'Sale' | 'Sold Out';
  description: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    price: 29.99,
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Comfortable cotton tee with premium stitching.',
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    price: 79.99,
    category: 'Hoodies',
    size: 'L',
    inStock: true,
    status: 'Sale',
    description: 'Warm and cozy hoodie perfect for any season.',
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 24.99,
    category: 'Accessories',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Adjustable cap with embroidered logo.',
  },
  {
    id: '4',
    name: 'Art Poster',
    price: 19.99,
    category: 'Posters',
    size: 'M',
    inStock: false,
    status: 'Sold Out',
    description: 'Limited edition art print on premium paper.',
  },
  {
    id: '5',
    name: 'Vinyl Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Set of 5 high-quality vinyl stickers.',
  },
  {
    id: '6',
    name: 'Oversized Tee',
    price: 34.99,
    category: 'T-Shirts',
    size: 'XL',
    inStock: true,
    status: 'Sale',
    description: 'Relaxed fit oversized tee with modern design.',
  },
  {
    id: '7',
    name: 'Winter Jacket',
    price: 149.99,
    category: 'Hoodies',
    size: 'L',
    inStock: false,
    status: 'Sold Out',
    description: 'Insulated winter jacket for cold weather.',
  },
  {
    id: '8',
    name: 'Branded Mug',
    price: 14.99,
    category: 'Accessories',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Ceramic mug with company branding.',
  },
  {
    id: '9',
    name: 'Crew Neck Sweatshirt',
    price: 59.99,
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Soft fleece crew neck for everyday comfort.',
  },
  {
    id: '10',
    name: 'Canvas Tote Bag',
    price: 39.99,
    category: 'Accessories',
    size: 'M',
    inStock: true,
    status: 'Sale',
    description: 'Durable canvas tote perfect for shopping.',
  },
  {
    id: '11',
    name: 'Retro Poster',
    price: 24.99,
    category: 'Posters',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Vintage-inspired retro poster design.',
  },
  {
    id: '12',
    name: 'T-Shirt Bundle',
    price: 49.99,
    category: 'T-Shirts',
    size: 'S',
    inStock: true,
    status: 'Sale',
    description: 'Pack of 2 premium quality t-shirts.',
  },
];

const ITEMS_PER_PAGE = 8;

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Calculate active filters
  const activeFilters = useMemo(() => {
    const filters: { type: string; label: string; value: string }[] = [];

    selectedCategories.forEach(cat => {
      filters.push({ type: 'category', label: cat, value: cat });
    });

    if (priceRange[0] > 0 || priceRange[1] < 100) {
      filters.push({
        type: 'price',
        label: `$${priceRange[0]} - $${priceRange[1]}`,
        value: `price-${priceRange[0]}-${priceRange[1]}`,
      });
    }

    selectedSizes.forEach(size => {
      filters.push({ type: 'size', label: size, value: size });
    });

    if (inStockOnly) {
      filters.push({ type: 'inStock', label: 'In stock only', value: 'in-stock-only' });
    }

    return filters;
  }, [selectedCategories, priceRange, selectedSizes, inStockOnly]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'newest':
        return sorted;
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popular':
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIdx, endIdx);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const handleRemoveFilter = (filterValue: string) => {
    const filter = activeFilters.find(f => f.value === filterValue);
    if (!filter) return;

    if (filter.type === 'category') {
      setSelectedCategories(prev => prev.filter(c => c !== filter.label));
    } else if (filter.type === 'price') {
      setPriceRange([0, 100]);
    } else if (filter.type === 'size') {
      setSelectedSizes(prev => prev.filter(s => s !== filter.label));
    } else if (filter.type === 'inStock') {
      setInStockOnly(false);
    }
  };

  const handleRemoveFilterTags = (keys: Set<string | number>) => {
    keys.forEach(key => {
      handleRemoveFilter(key as string);
    });
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  const handleResetFilterPanel = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  const getBadgeVariant = (status: string) => {
    if (status === 'New') return 'info';
    if (status === 'Sale') return 'warning';
    if (status === 'Sold Out') return 'error';
    return 'default';
  };

  return (
    <Container>
      <Stack space={6} alignX="left">
        {/* Header */}
        <Stack space={2} alignX="left">
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Stack space={3} alignX="left">
          <Inline space={3} alignY="bottom">
            <SearchField
              label="Search products"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={setSearchQuery}
              width="full"
            />
            <Select
              label="Sort by"
              selectedKey={sortBy}
              onSelectionChange={(key) => setSortBy(key as string)}
              width="fit"
            >
              <Select.Option id="newest">Newest</Select.Option>
              <Select.Option id="price-low">Price: Low to High</Select.Option>
              <Select.Option id="price-high">Price: High to Low</Select.Option>
              <Select.Option id="popular">Most Popular</Select.Option>
            </Select>
            <Drawer.Trigger>
              <Button variant="secondary">Filters</Button>
              <Drawer>
                <Drawer.Title>Filters</Drawer.Title>
                <Drawer.Content>
                  <Stack space={4} alignX="left">
                    {/* Category */}
                    <Stack space={2} alignX="left">
                      <Text weight="bold">Category</Text>
                      <Checkbox.Group
                        value={selectedCategories}
                        onChange={(keys) => setSelectedCategories(keys as string[])}
                      >
                        <Checkbox value="T-Shirts" label="T-Shirts" />
                        <Checkbox value="Hoodies" label="Hoodies" />
                        <Checkbox value="Accessories" label="Accessories" />
                        <Checkbox value="Posters" label="Posters" />
                        <Checkbox value="Stickers" label="Stickers" />
                      </Checkbox.Group>
                    </Stack>

                    {/* Price Range */}
                    <Stack space={2} alignX="left">
                      <Text weight="bold">Price Range</Text>
                      <Slider
                        label="Price"
                        minValue={0}
                        maxValue={100}
                        step={5}
                        value={priceRange}
                        onChange={(value) => setPriceRange(value as [number, number])}
                        formatOptions={{ style: 'currency', currency: 'USD' }}
                        thumbLabels={['min', 'max']}
                      />
                    </Stack>

                    {/* Size */}
                    <Stack space={2} alignX="left">
                      <Text weight="bold">Size</Text>
                      <Checkbox.Group
                        value={selectedSizes}
                        onChange={(keys) => setSelectedSizes(keys as string[])}
                      >
                        <Checkbox value="XS" label="XS" />
                        <Checkbox value="S" label="S" />
                        <Checkbox value="M" label="M" />
                        <Checkbox value="L" label="L" />
                        <Checkbox value="XL" label="XL" />
                      </Checkbox.Group>
                    </Stack>

                    {/* Availability */}
                    <Stack space={2} alignX="left">
                      <Switch
                        label="In stock only"
                        selected={inStockOnly}
                        onChange={setInStockOnly}
                      />
                    </Stack>

                    {/* Actions */}
                    <Inline space={2}>
                      <Button
                        variant="primary"
                        slot="close"
                      >
                        Apply Filters
                      </Button>
                      <Button
                        variant="secondary"
                        onPress={handleResetFilterPanel}
                      >
                        Reset
                      </Button>
                    </Inline>
                  </Stack>
                </Drawer.Content>
              </Drawer>
            </Drawer.Trigger>
          </Inline>
        </Stack>

        {/* Applied Filters */}
        <Stack space={2} alignX="left">
          {activeFilters.length > 0 ? (
            <Inline space={2} alignY="center">
              <Text fontSize="sm" color="text-base-muted">
                Filters:
              </Text>
              <Tag.Group
                onRemove={handleRemoveFilterTags}
              >
                {activeFilters.map(filter => (
                  <Tag key={filter.value} id={filter.value}>
                    {filter.label}
                  </Tag>
                ))}
              </Tag.Group>
              <Button
                variant="tertiary"
                size="small"
                onPress={handleClearAllFilters}
              >
                Clear all
              </Button>
            </Inline>
          ) : (
            <Text variant="muted" fontSize="sm" fontStyle="italic">
              No filters applied
            </Text>
          )}
        </Stack>

        {/* Product Grid or Empty State */}
        {paginatedProducts.length > 0 ? (
          <>
            <Tiles tilesWidth="250px" space={4} stretch>
              {paginatedProducts.map(product => (
                <Card key={product.id} stretch>
                  <Stack space={3} alignX="left">
                    <Stack space={1} alignX="left">
                      <Inline space={2} alignY="top" alignX="between">
                        <Headline level={4}>{product.name}</Headline>
                        <Badge variant={getBadgeVariant(product.status)}>
                          {product.status}
                        </Badge>
                      </Inline>
                      <Text size="lg" weight="bold">
                        ${product.price.toFixed(2)}
                      </Text>
                    </Stack>
                    <Text size="sm">{product.description}</Text>
                    <Button
                      variant="primary"
                      disabled={!product.inStock}
                      onPress={() => {
                        console.log(`Added "${product.name}" to cart`);
                      }}
                    >
                      {product.inStock ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Tiles>

            {/* Pagination */}
            <Stack space={3} alignX="center">
              <Text fontSize="sm">
                Page {currentPage} of {totalPages}
              </Text>
              <Pagination
                page={currentPage}
                onChange={setCurrentPage}
                totalItems={sortedProducts.length}
                pageSize={ITEMS_PER_PAGE}
              />
            </Stack>
          </>
        ) : (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
            action={
              <Button variant="primary" onPress={handleClearAllFilters}>
                Clear all filters
              </Button>
            }
          />
        )}
      </Stack>
    </Container>
  );
};

export default TestApp;
