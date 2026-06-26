import { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Drawer,
  Headline,
  Inline,
  Pagination,
  SearchField,
  Select,
  Slider,
  Stack,
  Text,
  Tiles,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  size: string;
  inStock: boolean;
  status?: 'New' | 'Sale' | null;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    price: 19.99,
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
    status: 'New',
    description: 'Premium cotton t-shirt with logo print.',
  },
  {
    id: '2',
    name: 'Hoodie Sweatshirt',
    price: 49.99,
    category: 'Hoodies',
    size: 'L',
    inStock: true,
    status: 'Sale',
    description: 'Comfortable fleece-lined hoodie.',
  },
  {
    id: '3',
    name: 'Baseball Cap',
    price: 24.99,
    category: 'Accessories',
    size: 'One Size',
    inStock: true,
    status: null,
    description: 'Adjustable baseball cap with embroidered logo.',
  },
  {
    id: '4',
    name: 'Branded Poster',
    price: 14.99,
    category: 'Posters',
    size: 'A2',
    inStock: false,
    status: null,
    description: 'High-quality poster print on premium paper.',
  },
  {
    id: '5',
    name: 'Logo Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    size: 'One Size',
    inStock: true,
    status: null,
    description: 'Set of 10 vinyl stickers with various designs.',
  },
  {
    id: '6',
    name: 'V-Neck Shirt',
    price: 22.99,
    category: 'T-Shirts',
    size: 'S',
    inStock: false,
    status: null,
    description: 'Classic v-neck shirt in multiple colors.',
  },
  {
    id: '7',
    name: 'Zip-Up Hoodie',
    price: 59.99,
    category: 'Hoodies',
    size: 'XL',
    inStock: true,
    status: 'Sale',
    description: 'Full-zip hoodie with kangaroo pocket.',
  },
  {
    id: '8',
    name: 'Water Bottle',
    price: 29.99,
    category: 'Accessories',
    size: 'One Size',
    inStock: true,
    status: 'New',
    description: 'Insulated stainless steel water bottle.',
  },
];

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = PRODUCTS.filter(product => {
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

    let sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      sorted.reverse();
    }

    return sorted;
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    selectedSizes.length > 0 ||
    inStockOnly;

  const handleApplyFilters = () => {
    setFilterDrawerOpen(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
    setFilterDrawerOpen(false);
  };

  const handleClearAllFilters = () => {
    handleResetFilters();
    setSearchQuery('');
    setSortBy('newest');
  };

  const removeFilter = (type: string, value?: string) => {
    if (type === 'category' && value) {
      setSelectedCategories(prev => prev.filter(c => c !== value));
    } else if (type === 'price') {
      setPriceRange([0, 100]);
    } else if (type === 'size' && value) {
      setSelectedSizes(prev => prev.filter(s => s !== value));
    } else if (type === 'inStock') {
      setInStockOnly(false);
    }
    setCurrentPage(1);
  };

  return (
    <Stack space={6} p={6}>
      {/* Header */}
      <Stack space={2}>
        <Headline level="1">Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Inline space={4} alignY="input">
        <div style={{ flex: 1 }}>
          <SearchField
            label="Search products"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by product name..."
          />
        </div>
        <Select
          label="Sort by"
          width="fit"
          selectedKey={sortBy}
          onSelectionChange={(key) => setSortBy(key as string)}
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-low">Price: Low to High</Select.Option>
          <Select.Option id="price-high">Price: High to Low</Select.Option>
          <Select.Option id="popular">Most Popular</Select.Option>
        </Select>
        <Button variant="secondary" onPress={() => setFilterDrawerOpen(true)}>
          Filters
        </Button>
      </Inline>

      {/* Filter Drawer */}
      <Drawer
        isOpen={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        title="Filters"
      >
        <Stack space={6} p={4}>
          {/* Category Filter */}
          <Stack space={3}>
            <Headline level="5">Category</Headline>
            <Checkbox.Group
              value={selectedCategories}
              onChange={(keys: string[]) => setSelectedCategories(keys)}
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
            <Headline level="5">Price Range</Headline>
            <Slider
              label={`$${priceRange[0]} - $${priceRange[1]}`}
              minValue={0}
              maxValue={100}
              step={5}
              value={priceRange}
              onChange={(value: number | number[]) => {
                if (Array.isArray(value)) {
                  setPriceRange(value);
                }
              }}
              thumbLabels={['min', 'max']}
              formatOptions={{ style: 'currency', currency: 'USD' }}
            />
          </Stack>

          {/* Size Filter */}
          <Stack space={3}>
            <Headline level="5">Size</Headline>
            <Checkbox.Group
              value={selectedSizes}
              onChange={(keys: string[]) => setSelectedSizes(keys)}
            >
              <Checkbox value="XS" label="XS" />
              <Checkbox value="S" label="S" />
              <Checkbox value="M" label="M" />
              <Checkbox value="L" label="L" />
              <Checkbox value="XL" label="XL" />
              <Checkbox value="One Size" label="One Size" />
            </Checkbox.Group>
          </Stack>

          {/* Availability Filter */}
          <Stack space={3}>
            <Checkbox
              label="In stock only"
              checked={inStockOnly}
              onChange={setInStockOnly}
            />
          </Stack>

          {/* Action Buttons */}
          <Inline space={2}>
            <Button variant="primary" onPress={handleApplyFilters} width="fit">
              Apply Filters
            </Button>
            <Button variant="secondary" onPress={handleResetFilters} width="fit">
              Reset
            </Button>
          </Inline>
        </Stack>
      </Drawer>

      {/* Applied Filters */}
      <Stack space={2}>
        {hasActiveFilters ? (
          <Stack space={2}>
            <Inline space={2} alignY="center">
              {selectedCategories.map(cat => (
                <Badge
                  key={`cat-${cat}`}
                  variant="default"
                >
                  <Inline space={1} alignY="center">
                    <span>{cat}</span>
                    <button
                      onClick={() => removeFilter('category', cat)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0 4px',
                      }}
                      aria-label={`Remove ${cat} filter`}
                    >
                      ✕
                    </button>
                  </Inline>
                </Badge>
              ))}
              {(priceRange[0] !== 0 || priceRange[1] !== 100) && (
                <Badge variant="default">
                  <Inline space={1} alignY="center">
                    <span>${priceRange[0]} - ${priceRange[1]}</span>
                    <button
                      onClick={() => removeFilter('price')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0 4px',
                      }}
                      aria-label="Remove price filter"
                    >
                      ✕
                    </button>
                  </Inline>
                </Badge>
              )}
              {selectedSizes.map(size => (
                <Badge key={`size-${size}`} variant="default">
                  <Inline space={1} alignY="center">
                    <span>{size}</span>
                    <button
                      onClick={() => removeFilter('size', size)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0 4px',
                      }}
                      aria-label={`Remove ${size} filter`}
                    >
                      ✕
                    </button>
                  </Inline>
                </Badge>
              ))}
              {inStockOnly && (
                <Badge variant="default">
                  <Inline space={1} alignY="center">
                    <span>In stock</span>
                    <button
                      onClick={() => removeFilter('inStock')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '0 4px',
                      }}
                      aria-label="Remove in stock filter"
                    >
                      ✕
                    </button>
                  </Inline>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="small"
                onPress={handleClearAllFilters}
              >
                Clear all
              </Button>
            </Inline>
          </Stack>
        ) : (
          <Text variant="muted">No filters applied</Text>
        )}
      </Stack>

      {/* Product Grid or Empty State */}
      {paginatedProducts.length === 0 ? (
        <Stack space={4} alignX="center" p={8}>
          <Headline level="3">No products found</Headline>
          <Text variant="muted">
            Try adjusting your filters or search query.
          </Text>
          <Button variant="primary" onPress={handleClearAllFilters}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Tiles tilesWidth="250px" space={4} stretch>
          {paginatedProducts.map(product => (
            <Card key={product.id} p={4}>
              <Stack space={3}>
                <Inline alignX="between" alignY="top">
                  <Stack space={1} stretch>
                    <Headline level="5">{product.name}</Headline>
                    <Text weight="bold">${product.price.toFixed(2)}</Text>
                  </Stack>
                  {product.status && (
                    <Badge
                      variant={
                        product.status === 'New'
                          ? 'info'
                          : product.status === 'Sale'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {product.status}
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="error">Sold Out</Badge>
                  )}
                </Inline>
                <Text fontSize="sm">{product.description}</Text>
                <Button
                  variant="primary"
                  disabled={!product.inStock}
                  width="fit"
                >
                  {product.inStock ? 'Add to Cart' : 'Unavailable'}
                </Button>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {/* Pagination */}
      {filteredAndSortedProducts.length > 0 && (
        <Stack space={2} alignX="center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <Text variant="muted" fontSize="sm">
            Page {currentPage} of {totalPages}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export default TestApp;
