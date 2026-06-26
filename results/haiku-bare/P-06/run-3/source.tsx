import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Heading,
  Text,
  TextField,
  Select,
  Checkbox,
  Slider,
  Stack,
  HStack,
  Tabs,
  Badge,
  Chip,
  Inline,
  Dialog,
  Disclosure,
} from '@marigold/components';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  size: string;
  inStock: boolean;
  status: 'new' | 'sale' | 'sold-out';
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Logo T-Shirt',
    price: 24.99,
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
    status: 'new',
    description: 'Comfortable cotton t-shirt with our classic logo.',
  },
  {
    id: 2,
    name: 'Premium Hoodie',
    price: 49.99,
    category: 'Hoodies',
    size: 'L',
    inStock: true,
    status: 'new',
    description: 'Warm and cozy hoodie perfect for any season.',
  },
  {
    id: 3,
    name: 'Vintage Cap',
    price: 19.99,
    category: 'Accessories',
    size: 'XS',
    inStock: true,
    status: 'sale',
    description: 'Classic baseball cap with embroidered logo.',
  },
  {
    id: 4,
    name: 'Poster Pack',
    price: 14.99,
    category: 'Posters',
    size: 'S',
    inStock: false,
    status: 'sold-out',
    description: 'Set of three premium quality posters.',
  },
  {
    id: 5,
    name: 'Sticker Bundle',
    price: 9.99,
    category: 'Stickers',
    size: 'XS',
    inStock: true,
    status: 'new',
    description: 'Assorted stickers for your laptop or water bottle.',
  },
  {
    id: 6,
    name: 'Graphic T-Shirt',
    price: 29.99,
    category: 'T-Shirts',
    size: 'M',
    inStock: false,
    status: 'sold-out',
    description: 'Bold graphic design on premium cotton.',
  },
  {
    id: 7,
    name: 'Sport Tote Bag',
    price: 39.99,
    category: 'Accessories',
    size: 'L',
    inStock: true,
    status: 'sale',
    description: 'Durable tote bag perfect for carrying essentials.',
  },
  {
    id: 8,
    name: 'Crew Neck Sweatshirt',
    price: 44.99,
    category: 'Hoodies',
    size: 'XL',
    inStock: true,
    status: 'new',
    description: 'Soft fleece sweatshirt with crew neckline.',
  },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (filterType === 'search') {
      setSearchQuery('');
    } else if (filterType === 'sort') {
      setSortBy('newest');
    } else if (filterType === 'category' && value) {
      setSelectedCategories((prev) =>
        prev.filter((c) => c !== value)
      );
    } else if (filterType === 'price') {
      setPriceRange([0, 100]);
    } else if (filterType === 'size' && value) {
      setSelectedSizes((prev) => prev.filter((s) => s !== value));
    } else if (filterType === 'inStock') {
      setInStockOnly(false);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSortBy('newest');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS.filter((product) => {
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

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id - a.id;
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'popular') {
        return b.id - a.id;
      }
      return 0;
    });

    return sorted;
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasActiveFilters =
    searchQuery ||
    sortBy !== 'newest' ||
    selectedCategories.length > 0 ||
    (priceRange[0] !== 0 || priceRange[1] !== 100) ||
    selectedSizes.length > 0 ||
    inStockOnly;

  const getStatusBadge = (status: string) => {
    if (status === 'new') return 'New';
    if (status === 'sale') return 'Sale';
    if (status === 'sold-out') return 'Sold Out';
    return '';
  };

  const getStatusColor = (status: string) => {
    if (status === 'new') return 'success';
    if (status === 'sale') return 'warning';
    if (status === 'sold-out') return 'critical';
    return 'neutral';
  };

  return (
    <Box p={6}>
      <Stack space={8}>
        <Box>
          <Heading level={1} size="xl">
            Merchandise Store
          </Heading>
          <Text>Browse our collection of branded merchandise.</Text>
        </Box>

        <HStack space={4} justifyContent="space-between">
          <Box style={{ flex: 1 }}>
            <TextField
              label=""
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              width="100%"
            />
          </Box>
          <Box style={{ minWidth: '200px' }}>
            <Select
              label=""
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </Select>
          </Box>
          <Button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            variant="outlined"
          >
            Filters
          </Button>
        </HStack>

        {showFilterPanel && (
          <Box
            p={6}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
            }}
          >
            <Stack space={6}>
              <Box>
                <Heading level={3} size="sm">
                  Category
                </Heading>
                <Stack space={3} mt={3}>
                  {CATEGORIES.map((category) => (
                    <Checkbox
                      key={category}
                      label={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Heading level={3} size="sm">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Heading>
                <Box mt={3}>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={priceRange}
                    onChange={(value) => {
                      if (Array.isArray(value)) {
                        setPriceRange(value as [number, number]);
                      }
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Heading level={3} size="sm">
                  Size
                </Heading>
                <Stack space={3} mt={3}>
                  {SIZES.map((size) => (
                    <Checkbox
                      key={size}
                      label={size}
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                    />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Checkbox
                  label="In stock only"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
              </Box>

              <HStack space={3} justifyContent="flex-end">
                <Button variant="outlined" onClick={clearAllFilters}>
                  Reset
                </Button>
                <Button onClick={() => setShowFilterPanel(false)}>
                  Apply Filters
                </Button>
              </HStack>
            </Stack>
          </Box>
        )}

        <Box>
          {hasActiveFilters && (
            <Stack space={3} mb={4}>
              <HStack space={2} wrap="wrap">
                {searchQuery && (
                  <Chip
                    label={`Search: ${searchQuery}`}
                    onRemove={() => removeFilter('search')}
                  />
                )}
                {sortBy !== 'newest' && (
                  <Chip
                    label={`Sort: ${sortBy}`}
                    onRemove={() => removeFilter('sort')}
                  />
                )}
                {selectedCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onRemove={() => removeFilter('category', category)}
                  />
                ))}
                {(priceRange[0] !== 0 || priceRange[1] !== 100) && (
                  <Chip
                    label={`$${priceRange[0]}-$${priceRange[1]}`}
                    onRemove={() => removeFilter('price')}
                  />
                )}
                {selectedSizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    onRemove={() => removeFilter('size', size)}
                  />
                ))}
                {inStockOnly && (
                  <Chip
                    label="In stock only"
                    onRemove={() => removeFilter('inStock')}
                  />
                )}
              </HStack>
              <Button variant="text" onClick={clearAllFilters}>
                Clear all
              </Button>
            </Stack>
          )}
          {!hasActiveFilters && (
            <Text color="muted" mb={4}>
              No filters applied
            </Text>
          )}
        </Box>

        {paginatedProducts.length === 0 ? (
          <Stack space={4} alignItems="center" py={12}>
            <Heading level={2} size="md">
              No products found
            </Heading>
            <Text>Try adjusting your filters or search query.</Text>
            <Button onClick={clearAllFilters}>Clear all filters</Button>
          </Stack>
        ) : (
          <>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
              }}
            >
              {paginatedProducts.map((product) => (
                <Card key={product.id} p={4}>
                  <Stack space={3}>
                    <HStack justifyContent="space-between">
                      <Heading level={3} size="sm">
                        {product.name}
                      </Heading>
                      {getStatusBadge(product.status) && (
                        <Badge color={getStatusColor(product.status) as any}>
                          {getStatusBadge(product.status)}
                        </Badge>
                      )}
                    </HStack>
                    <Text size="lg" weight="bold">
                      ${product.price.toFixed(2)}
                    </Text>
                    <Text size="sm">{product.description}</Text>
                    <Button
                      disabled={!product.inStock}
                      onClick={() => {
                        // Add to cart action
                      }}
                      fullWidth
                    >
                      {product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Box>

            <HStack space={4} justifyContent="center" mt={8}>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                variant="outlined"
              >
                Previous
              </Button>
              <Text>
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                variant="outlined"
              >
                Next
              </Button>
            </HStack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default TestApp;
