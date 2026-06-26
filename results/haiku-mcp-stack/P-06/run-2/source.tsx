'use client';

import { useState, useMemo } from 'react';
import {
  Headline,
  Text,
  Stack,
  Inline,
  Tiles,
  Card,
  Button,
  TextField,
  Select,
  Drawer,
  Checkbox,
  Slider,
  Switch,
  Badge,
  Pagination,
  Tag,
  EmptyState,
  Split,
  Container,
  Center,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'new' | 'sale' | 'sold-out';
  description: string;
  category: 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo T-Shirt',
    price: 29.99,
    status: 'new',
    description: 'Comfortable cotton t-shirt with our signature logo.',
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    price: 59.99,
    status: 'sale',
    description: 'Warm and cozy hoodie perfect for any season.',
    category: 'Hoodies',
    size: 'L',
    inStock: true,
  },
  {
    id: '3',
    name: 'Branded Hat',
    price: 24.99,
    status: 'new',
    description: 'Stylish cap with embroidered branding.',
    category: 'Accessories',
    size: 'M',
    inStock: false,
  },
  {
    id: '4',
    name: 'Poster Pack',
    price: 19.99,
    status: 'new',
    description: 'Set of 3 high-quality posters featuring our brand.',
    category: 'Posters',
    size: 'M',
    inStock: true,
  },
  {
    id: '5',
    name: 'Sticker Sheet',
    price: 9.99,
    status: 'new',
    description: 'Assorted stickers perfect for personalizing your gear.',
    category: 'Stickers',
    size: 'M',
    inStock: true,
  },
  {
    id: '6',
    name: 'Vintage T-Shirt',
    price: 34.99,
    status: 'sale',
    description: 'Limited edition vintage-style tee.',
    category: 'T-Shirts',
    size: 'S',
    inStock: false,
  },
  {
    id: '7',
    name: 'Eco Tote Bag',
    price: 19.99,
    status: 'new',
    description: 'Sustainable canvas bag with our logo.',
    category: 'Accessories',
    size: 'M',
    inStock: true,
  },
  {
    id: '8',
    name: 'Limited Hoodie',
    price: 69.99,
    status: 'new',
    description: 'Exclusive limited edition hoodie.',
    category: 'Hoodies',
    size: 'XL',
    inStock: true,
  },
];

const ITEMS_PER_PAGE = 8;

export default function TestApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>(
    'newest'
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSorted = useMemo(() => {
    let results = PRODUCTS.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesSize =
        selectedSizes.length === 0 || selectedSizes.includes(product.size);

      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesStock
      );
    });

    results.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'popular') return Math.random() - 0.5;
      return 0;
    });

    return results;
  }, [searchQuery, selectedCategories, priceRange, selectedSizes, inStockOnly, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (filterType === 'search') setSearchQuery('');
    else if (filterType === 'category' && value)
      setSelectedCategories(prev => prev.filter(c => c !== value));
    else if (filterType === 'price')
      setPriceRange([0, 100]);
    else if (filterType === 'size' && value)
      setSelectedSizes(prev => prev.filter(s => s !== value));
    else if (filterType === 'stock') setInStockOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100 ||
    selectedSizes.length > 0 ||
    inStockOnly;

  return (
    <Container>
      <Stack space={8}>
        {/* Header */}
        <Stack space={2}>
          <Headline size="level-1">Merchandise Store</Headline>
          <Text variant="muted">
            Browse our collection of branded merchandise.
          </Text>
        </Stack>

        {/* Toolbar */}
        <Stack space={4}>
          <Inline space={4} alignY="input">
            <div className="flex-1">
              <TextField
                label="Search products"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <div style={{ minWidth: '200px' }}>
              <Select
                label="Sort by"
                value={sortBy}
                onSelectionChange={(key) => {
                  setSortBy(key as typeof sortBy);
                  setCurrentPage(1);
                }}
              >
                <Select.Option id="newest">Newest</Select.Option>
                <Select.Option id="price-low">Price: Low to High</Select.Option>
                <Select.Option id="price-high">Price: High to Low</Select.Option>
                <Select.Option id="popular">Most Popular</Select.Option>
              </Select>
            </div>
            <Drawer.Trigger>
              <Button>Filters</Button>
              <Drawer>
                <Drawer.Title>Filters</Drawer.Title>
                <Drawer.Content>
                  <Stack space={6}>
                    {/* Category Filter */}
                    <Stack space={3}>
                      <Text weight="bold" fontSize="sm">
                        Category
                      </Text>
                      <Checkbox.Group
                        value={selectedCategories}
                        onChange={(val) => {
                          setSelectedCategories(val as string[]);
                          setCurrentPage(1);
                        }}
                      >
                        <Checkbox value="T-Shirts" label="T-Shirts" />
                        <Checkbox value="Hoodies" label="Hoodies" />
                        <Checkbox value="Accessories" label="Accessories" />
                        <Checkbox value="Posters" label="Posters" />
                        <Checkbox value="Stickers" label="Stickers" />
                      </Checkbox.Group>
                    </Stack>

                    {/* Price Range Filter */}
                    <Stack space={3}>
                      <Text weight="bold" fontSize="sm">
                        Price Range
                      </Text>
                      <Slider
                        label="Filter by price"
                        minValue={0}
                        maxValue={100}
                        step={5}
                        defaultValue={priceRange}
                        onChange={(val) => {
                          setPriceRange(val as [number, number]);
                          setCurrentPage(1);
                        }}
                        thumbLabels={['min', 'max']}
                        formatOptions={{
                          style: 'currency',
                          currency: 'USD',
                        }}
                      />
                    </Stack>

                    {/* Size Filter */}
                    <Stack space={3}>
                      <Text weight="bold" fontSize="sm">
                        Size
                      </Text>
                      <Checkbox.Group
                        value={selectedSizes}
                        onChange={(val) => {
                          setSelectedSizes(val as string[]);
                          setCurrentPage(1);
                        }}
                      >
                        <Checkbox value="XS" label="XS" />
                        <Checkbox value="S" label="S" />
                        <Checkbox value="M" label="M" />
                        <Checkbox value="L" label="L" />
                        <Checkbox value="XL" label="XL" />
                      </Checkbox.Group>
                    </Stack>

                    {/* Availability Filter */}
                    <Stack space={3}>
                      <Switch
                        label="In stock only"
                        selected={inStockOnly}
                        onChange={(val) => {
                          setInStockOnly(val);
                          setCurrentPage(1);
                        }}
                      />
                    </Stack>
                  </Stack>
                </Drawer.Content>
                <Drawer.Actions>
                  <Button
                    variant="secondary"
                    onClick={() => handleClearAllFilters()}
                    slot="close"
                  >
                    Reset
                  </Button>
                  <Button variant="primary" slot="close">
                    Apply Filters
                  </Button>
                </Drawer.Actions>
              </Drawer>
            </Drawer.Trigger>
          </Inline>

          {/* Applied Filters */}
          <Stack space={2}>
            {hasActiveFilters ? (
              <Inline space={2} alignY="center">
                <Text fontSize="sm" variant="muted">
                  Active filters:
                </Text>
                <Tag.Group onRemove={(ids) => {
                  ids.forEach(id => {
                    const [filterType, ...valueParts] = (id as string).split(':');
                    const value = valueParts.join(':');
                    removeFilter(filterType, value || undefined);
                  });
                }}>
                  {searchQuery && (
                    <Tag id={`search:${searchQuery}`}>
                      Search: {searchQuery}
                    </Tag>
                  )}
                  {selectedCategories.map(cat => (
                    <Tag key={cat} id={`category:${cat}`}>
                      {cat}
                    </Tag>
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < 100) && (
                    <Tag id="price">
                      ${priceRange[0]} - ${priceRange[1]}
                    </Tag>
                  )}
                  {selectedSizes.map(size => (
                    <Tag key={size} id={`size:${size}`}>
                      Size: {size}
                    </Tag>
                  ))}
                  {inStockOnly && (
                    <Tag id="stock">
                      In Stock
                    </Tag>
                  )}
                </Tag.Group>
                <Split />
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => handleClearAllFilters()}
                >
                  Clear all
                </Button>
              </Inline>
            ) : (
              <Text fontSize="sm" variant="muted" fontStyle="italic">
                No filters applied
              </Text>
            )}
          </Stack>
        </Stack>

        {/* Product Grid or Empty State */}
        {filteredAndSorted.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
            action={
              <Button onPress={() => handleClearAllFilters()}>
                Clear all filters
              </Button>
            }
          />
        ) : (
          <Stack space={6}>
            <Tiles tilesWidth="200px" space={4}>
              {paginatedProducts.map(product => (
                <Card key={product.id}>
                  <Stack space={3}>
                    <Inline alignY="center" alignX="between">
                      <Text weight="bold" fontSize="sm">
                        {product.name}
                      </Text>
                      <Badge
                        variant={
                          product.status === 'new'
                            ? 'info'
                            : product.status === 'sale'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {product.status === 'new'
                          ? 'New'
                          : product.status === 'sale'
                            ? 'Sale'
                            : 'Sold Out'}
                      </Badge>
                    </Inline>
                    <Text fontSize="sm" variant="muted">
                      {product.description}
                    </Text>
                    <Text weight="bold">${product.price.toFixed(2)}</Text>
                    <Button
                      variant="primary"
                      disabled={!product.inStock}
                      fullWidth
                    >
                      {product.inStock ? 'Add to Cart' : 'Unavailable'}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Tiles>

            {/* Pagination */}
            <Center>
              <Stack space={4} alignX="center">
                <Text fontSize="sm">
                  Page {currentPage} of {totalPages}
                </Text>
                <Pagination
                  totalItems={filteredAndSorted.length}
                  pageSize={ITEMS_PER_PAGE}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              </Stack>
            </Center>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
