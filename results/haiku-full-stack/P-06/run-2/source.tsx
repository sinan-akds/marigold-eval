import { useState, useMemo } from 'react';
import {
  Headline,
  Text,
  Stack,
  Inline,
  Card,
  Button,
  SearchField,
  Select,
  Drawer,
  Slider,
  Checkbox,
  Tag,
  Badge,
  Pagination,
  EmptyState,
  Switch,
  Tiles,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'New' | 'Sale' | 'Sold Out';
  description: string;
  category: 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  inStock: boolean;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium T-Shirt',
    price: 29.99,
    status: 'New',
    description: 'Comfortable cotton t-shirt with modern design.',
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
  },
  {
    id: '2',
    name: 'Classic Hoodie',
    price: 59.99,
    status: 'Sale',
    description: 'Warm and cozy hoodie perfect for any season.',
    category: 'Hoodies',
    size: 'L',
    inStock: true,
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 19.99,
    status: 'New',
    description: 'Stylish cap with embroidered logo.',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: '4',
    name: 'Poster Set',
    price: 34.99,
    status: 'Sale',
    description: 'Set of three beautiful art posters.',
    category: 'Posters',
    inStock: false,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    status: 'New',
    description: 'Collection of 50 unique vinyl stickers.',
    category: 'Stickers',
    inStock: true,
  },
  {
    id: '6',
    name: 'Limited Edition Hoodie',
    price: 79.99,
    status: 'Sale',
    description: 'Exclusive limited edition hoodie design.',
    category: 'Hoodies',
    size: 'XL',
    inStock: true,
  },
  {
    id: '7',
    name: 'Vintage Tee',
    price: 24.99,
    status: 'Sold Out',
    description: 'Retro styled t-shirt with classic appeal.',
    category: 'T-Shirts',
    size: 'S',
    inStock: false,
  },
  {
    id: '8',
    name: 'Beanie',
    price: 21.99,
    status: 'New',
    description: 'Warm winter beanie in assorted colors.',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: '9',
    name: 'Polo Shirt',
    price: 39.99,
    status: 'New',
    description: 'Professional polo shirt for any occasion.',
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
  },
  {
    id: '10',
    name: 'Windbreaker Jacket',
    price: 89.99,
    status: 'Sale',
    description: 'Lightweight windbreaker for outdoor activities.',
    category: 'Hoodies',
    size: 'L',
    inStock: true,
  },
  {
    id: '11',
    name: 'Wristband',
    price: 14.99,
    status: 'Sold Out',
    description: 'Colorful fabric wristband with logo.',
    category: 'Accessories',
    inStock: false,
  },
  {
    id: '12',
    name: 'Canvas Print',
    price: 44.99,
    status: 'New',
    description: 'High-quality canvas wall art print.',
    category: 'Posters',
    inStock: true,
  },
];

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>(
    'newest'
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(product.category);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSize = selectedSizes.size === 0 || !product.size || selectedSizes.has(product.size);
      const matchesStock = !inStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesStock;
    });

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    return filtered;
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
    handleFilterChange();
  };

  const handleSizeChange = (size: string) => {
    const newSizes = new Set(selectedSizes);
    if (newSizes.has(size)) {
      newSizes.delete(size);
    } else {
      newSizes.add(size);
    }
    setSelectedSizes(newSizes);
    handleFilterChange();
  };

  const handleRemoveFilter = (keys: Set<string | number>) => {
    const filterToRemove = Array.from(keys)[0] as string;
    if (filterToRemove.startsWith('cat-')) {
      handleCategoryChange(filterToRemove.replace('cat-', ''));
    } else if (filterToRemove.startsWith('size-')) {
      handleSizeChange(filterToRemove.replace('size-', ''));
    } else if (filterToRemove === 'stock') {
      setInStockOnly(false);
      handleFilterChange();
    } else if (filterToRemove === 'price') {
      setPriceRange([0, 100]);
      handleFilterChange();
    }
  };

  const handleClearAllFilters = () => {
    setSelectedCategories(new Set());
    setPriceRange([0, 100]);
    setSelectedSizes(new Set());
    setInStockOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  // Build applied filters array
  const appliedFilters: Array<{ id: string; label: string }> = [];
  selectedCategories.forEach(cat => {
    appliedFilters.push({ id: `cat-${cat}`, label: `Category: ${cat}` });
  });
  if (priceRange[0] > 0 || priceRange[1] < 100) {
    appliedFilters.push({
      id: 'price',
      label: `Price: $${priceRange[0]} - $${priceRange[1]}`,
    });
  }
  selectedSizes.forEach(size => {
    appliedFilters.push({ id: `size-${size}`, label: `Size: ${size}` });
  });
  if (inStockOnly) {
    appliedFilters.push({ id: 'stock', label: 'In stock only' });
  }

  const hasFilters = appliedFilters.length > 0;

  return (
    <Stack space={6} alignX="left">
      {/* Header */}
      <Stack space={2} alignX="left">
        <Headline level="1">Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Inline space={4} alignY="center">
        <SearchField
          label="Search products"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={setSearchQuery}
          width={48}
        />
        <Select
          label="Sort"
          value={sortBy}
          onChange={(val: any) => setSortBy(val as typeof sortBy)}
          width={40}
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-low">Price: Low to High</Select.Option>
          <Select.Option id="price-high">Price: High to Low</Select.Option>
          <Select.Option id="popular">Most Popular</Select.Option>
        </Select>
      </Inline>

      {/* Applied Filters */}
      <Tag.Group
        label="Applied Filters"
        onRemove={handleRemoveFilter}
        removeAll={hasFilters}
        emptyState={() => (
          <Text variant="muted" fontSize="sm" fontStyle="italic">
            No filters applied
          </Text>
        )}
      >
        {appliedFilters.map(filter => (
          <Tag key={filter.id} id={filter.id}>
            {filter.label}
          </Tag>
        ))}
      </Tag.Group>

      {/* Filter Drawer */}
      <Drawer.Trigger>
        <Button variant="secondary" onPress={() => setIsFilterOpen(true)}>
          Filters
        </Button>
        <Drawer open={isFilterOpen}>
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Content>
            <Stack space={6} alignX="left">
              {/* Category Filter */}
              <Stack space={2} alignX="left">
                <Text weight="bold">Category</Text>
                <Checkbox.Group
                  value={Array.from(selectedCategories) as string[]}
                  onChange={values => {
                    setSelectedCategories(new Set(values));
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
              <Stack space={2} alignX="left">
                <Text weight="bold">Price Range</Text>
                <Slider
                  label="Price"
                  minValue={0}
                  maxValue={100}
                  step={5}
                  value={priceRange}
                  onChange={val => setPriceRange(Array.isArray(val) ? (val as [number, number]) : [0, 100])}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                  thumbLabels={['min', 'max']}
                />
              </Stack>

              {/* Size Filter */}
              <Stack space={2} alignX="left">
                <Text weight="bold">Size</Text>
                <Checkbox.Group
                  value={Array.from(selectedSizes) as string[]}
                  onChange={values => {
                    setSelectedSizes(new Set(values));
                  }}
                >
                  <Checkbox value="XS" label="XS" />
                  <Checkbox value="S" label="S" />
                  <Checkbox value="M" label="M" />
                  <Checkbox value="L" label="L" />
                  <Checkbox value="XL" label="XL" />
                </Checkbox.Group>
              </Stack>

              {/* In Stock Filter */}
              <Switch label="In stock only" selected={inStockOnly} onChange={setInStockOnly} />
            </Stack>
          </Drawer.Content>
          <Drawer.Actions>
            <Inline space={2}>
              <Button variant="secondary" onPress={handleClearAllFilters} fullWidth>
                Reset
              </Button>
              <Button variant="primary" onPress={() => setIsFilterOpen(false)} fullWidth>
                Apply Filters
              </Button>
            </Inline>
          </Drawer.Actions>
        </Drawer>
      </Drawer.Trigger>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={<Button onPress={handleClearAllFilters}>Clear all filters</Button>}
        />
      ) : (
        <Stack space={6} alignX="left">
          <Tiles
            tilesWidth="250px"
            space={4}
            stretch
            equalHeight
          >
            {paginatedProducts.map(product => (
              <Card key={product.id}>
                <Stack space={3} alignX="left">
                  {/* Product Name */}
                  <Stack space={1} alignX="left">
                    <Headline level={2}>{product.name}</Headline>
                    <Text fontSize="sm">{product.description}</Text>
                  </Stack>

                  {/* Price and Status */}
                  <Inline space={3} alignY="center">
                    <Text weight="bold">${product.price.toFixed(2)}</Text>
                    <Badge variant={
                      product.status === 'Sale' ? 'warning' :
                      product.status === 'New' ? 'info' :
                      'error'
                    }>
                      {product.status}
                    </Badge>
                  </Inline>

                  {/* Add to Cart Button */}
                  <Button
                    variant="primary"
                    disabled={!product.inStock}
                    onPress={() => {}}
                    fullWidth
                  >
                    {product.inStock ? 'Add to Cart' : 'Sold Out'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>

          {/* Pagination */}
          <Stack space={2} alignX="center">
            <Text fontSize="sm">
              Page {currentPage} of {totalPages}
            </Text>
            <Pagination
              totalItems={filteredProducts.length}
              pageSize={ITEMS_PER_PAGE}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default TestApp;
