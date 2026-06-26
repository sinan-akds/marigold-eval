import { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
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
  Text,
  Tiles,
} from '@marigold/components';

interface Product {
  id: number;
  name: string;
  price: number;
  category: 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';
  sizes: string[];
  status: 'New' | 'Sale' | 'Available' | 'Sold Out';
  description: string;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Logo T-Shirt',
    price: 29.99,
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'New',
    description: 'Comfortable cotton t-shirt with our iconic logo.',
    inStock: true,
  },
  {
    id: 2,
    name: 'Vintage Hoodie',
    price: 49.99,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'Sale',
    description: 'Warm and cozy hoodie perfect for any season.',
    inStock: true,
  },
  {
    id: 3,
    name: 'Premium Baseball Cap',
    price: 24.99,
    category: 'Accessories',
    sizes: ['One Size'],
    status: 'Available',
    description: 'Classic baseball cap with adjustable fit.',
    inStock: true,
  },
  {
    id: 4,
    name: 'Limited Edition Poster',
    price: 19.99,
    category: 'Posters',
    sizes: ['One Size'],
    status: 'Sold Out',
    description: 'Exclusive art print by renowned artist.',
    inStock: false,
  },
  {
    id: 5,
    name: 'Neon Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    sizes: ['One Size'],
    status: 'New',
    description: 'Vibrant stickers for customizing your gear.',
    inStock: true,
  },
  {
    id: 6,
    name: 'Performance T-Shirt',
    price: 34.99,
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'Available',
    description: 'Moisture-wicking fabric for active wear.',
    inStock: true,
  },
  {
    id: 7,
    name: 'Zip-Up Hoodie',
    price: 59.99,
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    status: 'Sold Out',
    description: 'Premium zip-up hoodie with kangaroo pocket.',
    inStock: false,
  },
  {
    id: 8,
    name: 'Canvas Tote Bag',
    price: 39.99,
    category: 'Accessories',
    sizes: ['One Size'],
    status: 'Available',
    description: 'Durable canvas bag for everyday use.',
    inStock: true,
  },
];

const PRODUCTS_PER_PAGE = 8;

export default function TestApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price range filter
    result = result.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p =>
        selectedSizes.some(size => p.sizes.includes(size))
      );
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sort
    if (sortBy === 'newest') {
      // Keep original order
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      // Simulate popularity by reversing
      result.reverse();
    }

    return result;
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const activeFilters = [
    ...selectedCategories,
    ...(priceRange[0] !== 0 || priceRange[1] !== 100
      ? [`$${priceRange[0]} - $${priceRange[1]}`]
      : []),
    ...selectedSizes,
    ...(inStockOnly ? ['In Stock'] : []),
  ];

  const handleRemoveFilter = (filter: string) => {
    if (selectedCategories.includes(filter)) {
      setSelectedCategories(prev => prev.filter(c => c !== filter));
    } else if (selectedSizes.includes(filter)) {
      setSelectedSizes(prev => prev.filter(s => s !== filter));
    } else if (filter === 'In Stock') {
      setInStockOnly(false);
    } else if (filter.startsWith('$')) {
      setPriceRange([0, 100]);
    }
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  return (
    <Stack space={6} alignX="left">
      <div className="p-4">
        {/* Header */}
        <Stack space={1} alignX="left">
          <Headline level="1">Merchandise Store</Headline>
          <Text fontSize="sm" color="muted">
            Browse our collection of branded merchandise.
          </Text>
        </Stack>
      </div>

      {/* Toolbar */}
      <div className="px-4">
        <Inline space={2}>
          <SearchField
            width="fit"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products..."
          />
          <Select
            width="fit"
            value={sortBy}
            onChange={val => setSortBy(val as string)}
            label="Sort"
          >
            <Select.Option id="newest">Newest</Select.Option>
            <Select.Option id="price-low">Price: Low to High</Select.Option>
            <Select.Option id="price-high">Price: High to Low</Select.Option>
            <Select.Option id="popular">Most Popular</Select.Option>
          </Select>
          <Drawer.Trigger>
            <Button variant="secondary">
              Filters
            </Button>
            <Drawer role="search">
              <Drawer.Title>Filter</Drawer.Title>
              <Drawer.Content>
                <Stack space={4} alignX="left">
                  {/* Category */}
                  <Stack space={2} alignX="left">
                    <Text fontSize="sm" weight="bold">
                      Category
                    </Text>
                    <Checkbox.Group
                      value={selectedCategories}
                      onChange={val => setSelectedCategories(val as string[])}
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
                    <Text fontSize="sm" weight="bold">
                      Price Range
                    </Text>
                    <Slider
                      minValue={0}
                      maxValue={100}
                      value={priceRange}
                      onChange={val => setPriceRange(val as number[])}
                      formatOptions={{ style: 'currency', currency: 'USD' }}
                      step={1}
                    />
                  </Stack>

                  {/* Size */}
                  <Stack space={2} alignX="left">
                    <Text fontSize="sm" weight="bold">
                      Size
                    </Text>
                    <Checkbox.Group
                      value={selectedSizes}
                      onChange={val => setSelectedSizes(val as string[])}
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
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button
                  variant="secondary"
                  onPress={handleResetFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  slot="close"
                >
                  Apply Filters
                </Button>
              </Drawer.Actions>
            </Drawer>
          </Drawer.Trigger>
        </Inline>
      </div>

      {/* Applied Filters */}
      <div className="px-4">
        {activeFilters.length > 0 ? (
          <Stack space={2} alignX="left">
            <div className="flex flex-wrap gap-1">
              {activeFilters.map(filter => (
                <Badge key={filter} variant="default">
                  <Inline space={1} alignY="center">
                    <Text>{filter}</Text>
                    <Button
                      variant="ghost"
                      size="small"
                      onPress={() => handleRemoveFilter(filter)}
                    >
                      ✕
                    </Button>
                  </Inline>
                </Badge>
              ))}
            </div>
            <Button
              variant="secondary"
              size="small"
              onPress={handleClearAllFilters}
            >
              Clear all
            </Button>
          </Stack>
        ) : (
          <Text fontSize="sm" color="muted">
            No filters applied
          </Text>
        )}
      </div>

      {/* Product Grid or Empty State */}
      <div className="px-4">
        {displayedProducts.length > 0 ? (
          <Tiles
            tilesWidth="280px"
            space={4}
            equalHeight
            stretch
          >
            {displayedProducts.map(product => (
              <Card key={product.id}>
                <Stack space={3} alignX="left">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 bg-gray-200 rounded-t flex items-center justify-center">
                    <Text color="muted">Product Image</Text>
                  </div>

                  {/* Product Details */}
                  <Stack space={2} alignX="left">
                    <div className="px-3">
                      <Inline alignY="center">
                        <Headline level="4">{product.name}</Headline>
                        <Badge
                          variant={
                            product.status === 'New'
                              ? 'info'
                              : product.status === 'Sale'
                                ? 'warning'
                                : product.status === 'Sold Out'
                                  ? 'error'
                                  : 'default'
                          }
                        >
                          {product.status}
                        </Badge>
                      </Inline>
                    </div>

                    <div className="px-3">
                      <Text fontSize="sm">${product.price.toFixed(2)}</Text>
                    </div>

                    <div className="px-3">
                      <Text fontSize="sm" color="muted">
                        {product.description}
                      </Text>
                    </div>

                    <div className="px-3 pb-3">
                      <Button
                        variant="primary"
                        disabled={product.status === 'Sold Out'}
                        onPress={() => {
                          if (product.status !== 'Sold Out') {
                            console.log(`Added ${product.name} to cart`);
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Tiles>
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
      </div>

      {/* Pagination */}
      {displayedProducts.length > 0 && (
        <div className="px-4 py-4">
          <Inline alignY="center" alignX="center">
            <Pagination
              totalItems={filteredProducts.length}
              pageSize={PRODUCTS_PER_PAGE}
              page={currentPage}
              onChange={setCurrentPage}
            />
            <Text fontSize="sm">Page {currentPage} of {totalPages}</Text>
          </Inline>
        </div>
      )}
    </Stack>
  );
}
