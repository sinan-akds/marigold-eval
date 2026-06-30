'use client';

import { useState, useMemo } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  EmptyState,
  Headline,
  Inline,
  Pagination,
  SearchField,
  Select,
  Slider,
  Stack,
  Switch,
  Tag,
  Text,
  Tiles,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  status: 'New' | 'Sale' | 'Normal';
  inStock: boolean;
  description: string;
  sortOrder: number;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    price: 19.99,
    category: 'T-Shirts',
    size: 'M',
    status: 'New',
    inStock: true,
    description: 'Comfortable cotton t-shirt perfect for everyday wear.',
    sortOrder: 1,
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    price: 49.99,
    category: 'Hoodies',
    size: 'L',
    status: 'Sale',
    inStock: true,
    description: 'Soft and warm hoodie ideal for cold weather.',
    sortOrder: 2,
  },
  {
    id: '3',
    name: 'Baseball Cap',
    price: 24.99,
    category: 'Accessories',
    status: 'Normal',
    inStock: true,
    description: 'Classic baseball cap with embroidered logo.',
    sortOrder: 3,
  },
  {
    id: '4',
    name: 'Poster Set',
    price: 29.99,
    category: 'Posters',
    status: 'New',
    inStock: false,
    description: 'Beautiful poster set featuring exclusive artwork.',
    sortOrder: 4,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    status: 'Normal',
    inStock: true,
    description: 'Assorted waterproof stickers for any surface.',
    sortOrder: 5,
  },
  {
    id: '6',
    name: 'Vintage T-Shirt',
    price: 24.99,
    category: 'T-Shirts',
    size: 'S',
    status: 'Sale',
    inStock: true,
    description: 'Retro design with vintage color wash.',
    sortOrder: 6,
  },
  {
    id: '7',
    name: 'Crew Neck Sweatshirt',
    price: 39.99,
    category: 'Hoodies',
    size: 'XL',
    status: 'Normal',
    inStock: false,
    description: 'Heavyweight sweatshirt for maximum comfort.',
    sortOrder: 7,
  },
  {
    id: '8',
    name: 'Tote Bag',
    price: 34.99,
    category: 'Accessories',
    status: 'New',
    inStock: true,
    description: 'Spacious canvas tote bag perfect for shopping.',
    sortOrder: 8,
  },
];

type SortBy = 'newest' | 'price-low' | 'price-high' | 'popular';

interface FilterState {
  categories: Set<string>;
  priceRange: [number, number];
  sizes: Set<string>;
  inStockOnly: boolean;
}

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    categories: new Set(),
    priceRange: [0, 100],
    sizes: new Set(),
    inStockOnly: false,
  });
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const itemsPerPage = 8;

  const filteredAndSorted = useMemo(() => {
    let result = mockProducts.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        filters.categories.size === 0 ||
        filters.categories.has(product.category);

      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      const matchesSize =
        filters.sizes.size === 0 ||
        !product.size ||
        filters.sizes.has(product.size);

      const matchesStock =
        !filters.inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesStock
      );
    });

    if (sortBy === 'newest') {
      result = [...result].sort((a, b) => b.sortOrder - a.sortOrder);
    } else if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result = [...result].sort(
        (a, b) => a.id.localeCompare(b.id)
      );
    }

    return result;
  }, [searchQuery, sortBy, filters]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSorted.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasActiveFilters =
    filters.categories.size > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100 ||
    filters.sizes.size > 0 ||
    filters.inStockOnly;

  const getActiveFilterChips = () => {
    const chips: Array<{ id: string; label: string }> = [];

    filters.categories.forEach(cat => {
      chips.push({ id: `cat-${cat}`, label: cat });
    });

    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100) {
      chips.push({
        id: 'price',
        label: `$${filters.priceRange[0]} - $${filters.priceRange[1]}`,
      });
    }

    filters.sizes.forEach(size => {
      chips.push({ id: `size-${size}`, label: `Size: ${size}` });
    });

    if (filters.inStockOnly) {
      chips.push({ id: 'stock', label: 'In Stock Only' });
    }

    return chips;
  };

  const removeFilter = (chipId: string) => {
    if (chipId.startsWith('cat-')) {
      const cat = chipId.replace('cat-', '');
      setFilters(prev => {
        const newCats = new Set(prev.categories);
        newCats.delete(cat);
        return { ...prev, categories: newCats };
      });
    } else if (chipId.startsWith('size-')) {
      const size = chipId.replace('size-', '');
      setFilters(prev => {
        const newSizes = new Set(prev.sizes);
        newSizes.delete(size);
        return { ...prev, sizes: newSizes };
      });
    } else if (chipId === 'price') {
      setFilters(prev => ({ ...prev, priceRange: [0, 100] }));
    } else if (chipId === 'stock') {
      setFilters(prev => ({ ...prev, inStockOnly: false }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      categories: new Set(),
      priceRange: [0, 100],
      sizes: new Set(),
      inStockOnly: false,
    });
    setCurrentPage(1);
  };

  const toggleCategory = (cat: string) => {
    setTempFilters(prev => {
      const newCats = new Set(prev.categories);
      if (newCats.has(cat)) {
        newCats.delete(cat);
      } else {
        newCats.add(cat);
      }
      return { ...prev, categories: newCats };
    });
  };

  const toggleSize = (size: string) => {
    setTempFilters(prev => {
      const newSizes = new Set(prev.sizes);
      if (newSizes.has(size)) {
        newSizes.delete(size);
      } else {
        newSizes.add(size);
      }
      return { ...prev, sizes: newSizes };
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
    setFilterDrawerOpen(false);
  };

  const resetFilters = () => {
    const resetState: FilterState = {
      categories: new Set(),
      priceRange: [0, 100],
      sizes: new Set(),
      inStockOnly: false,
    };
    setTempFilters(resetState);
  };

  const handleDrawerOpen = (isOpen: boolean) => {
    if (isOpen) {
      setTempFilters(filters);
    }
    setFilterDrawerOpen(isOpen);
  };

  const activeChips = getActiveFilterChips();

  const pageContent = (
    <Stack space={6}>
      {/* Header */}
      <Stack space={2}>
        <Headline level={1}>Merchandise Store</Headline>
        <Text variant="muted">
          Browse our collection of branded merchandise.
        </Text>
      </Stack>

      {/* Toolbar */}
      <Inline space={4} alignY="input">
        <div style={{ flex: 1 }}>
          <SearchField
            label="Search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <Select
          label="Sort"
          value={sortBy}
          onChange={val => setSortBy(val as SortBy)}
          width="fit"
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-low">Price: Low to High</Select.Option>
          <Select.Option id="price-high">Price: High to Low</Select.Option>
          <Select.Option id="popular">Most Popular</Select.Option>
        </Select>
        <Drawer.Trigger open={filterDrawerOpen} onOpenChange={handleDrawerOpen}>
          <Button>Filters</Button>
          <Drawer size="medium" closeButton>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                {/* Categories */}
                <Stack space={2}>
                  <Text weight="medium">Category</Text>
                  <Stack space={2}>
                    {[
                      'T-Shirts',
                      'Hoodies',
                      'Accessories',
                      'Posters',
                      'Stickers',
                    ].map(cat => (
                      <Checkbox
                        key={cat}
                        value={cat}
                        label={cat}
                        checked={tempFilters.categories.has(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                    ))}
                  </Stack>
                </Stack>

                {/* Price Range */}
                <Stack space={2}>
                  <Text weight="medium">Price Range</Text>
                  <Slider
                    label="Price"
                    minValue={0}
                    maxValue={100}
                    step={1}
                    value={tempFilters.priceRange}
                    onChange={val => {
                      if (Array.isArray(val)) {
                        setTempFilters(prev => ({
                          ...prev,
                          priceRange: val as [number, number],
                        }));
                      }
                    }}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                  />
                </Stack>

                {/* Sizes */}
                <Stack space={2}>
                  <Text weight="medium">Size</Text>
                  <Stack space={2}>
                    {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                      <Checkbox
                        key={size}
                        value={size}
                        label={size}
                        checked={tempFilters.sizes.has(size)}
                        onChange={() => toggleSize(size)}
                      />
                    ))}
                  </Stack>
                </Stack>

                {/* In Stock Only */}
                <Switch
                  label="In stock only"
                  selected={tempFilters.inStockOnly}
                  onChange={() =>
                    setTempFilters(prev => ({
                      ...prev,
                      inStockOnly: !prev.inStockOnly,
                    }))
                  }
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button variant="secondary" slot="close">
                Cancel
              </Button>
              <Button variant="primary" onPress={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="secondary" onPress={resetFilters}>
                Reset
              </Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      </Inline>

      {/* Applied Filters */}
      {hasActiveFilters ? (
        <Tag.Group
          label="Applied Filters"
          onRemove={keys => {
            keys.forEach(key => removeFilter(key as string));
          }}
          emptyState={() => (
            <Text variant="muted" fontSize="sm" fontStyle="italic">
              No filters applied
            </Text>
          )}
        >
          {activeChips.map(chip => (
            <Tag key={chip.id} id={chip.id}>
              {chip.label}
            </Tag>
          ))}
        </Tag.Group>
      ) : (
        <Text variant="muted" fontSize="sm" fontStyle="italic">
          No filters applied
        </Text>
      )}

      {/* Products Grid or Empty State */}
      {filteredAndSorted.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={
            <Button variant="primary" onPress={clearAllFilters}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <Stack space={4}>
          <Tiles tilesWidth="250px" space={4} equalHeight>
            {paginatedProducts.map(product => (
              <Card key={product.id}>
                <Stack space={3}>
                  {/* Status Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <Badge
                      variant={
                        product.status === 'New'
                          ? 'info'
                          : product.status === 'Sale'
                            ? 'warning'
                            : 'default'
                      }
                    >
                      {product.inStock ? product.status : 'Sold Out'}
                    </Badge>
                  </div>

                  {/* Product Info */}
                  <Stack space={1}>
                    <Text weight="medium">{product.name}</Text>
                    <Text fontSize="sm" variant="muted">
                      {product.description}
                    </Text>
                  </Stack>

                  {/* Price */}
                  <Text weight="medium" fontSize="lg">
                    ${product.price.toFixed(2)}
                  </Text>

                  {/* Add to Cart Button */}
                  <Button
                    variant={product.inStock ? 'primary' : 'secondary'}
                    disabled={!product.inStock}
                    fullWidth
                  >
                    {product.inStock ? 'Add to Cart' : 'Sold Out'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>

          {/* Pagination */}
          <Inline alignX="center" space={4}>
            <Text fontSize="sm">
              Page {currentPage} of {Math.max(1, totalPages)}
            </Text>
            <Pagination
              totalItems={filteredAndSorted.length}
              pageSize={itemsPerPage}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </Inline>
        </Stack>
      )}
    </Stack>
  );

  return (
    <AppLayout>
      <AppLayout.Main>
        <Container>{pageContent}</Container>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
