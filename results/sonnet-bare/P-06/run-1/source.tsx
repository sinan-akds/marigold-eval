import React, { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  TextField,
  Select,
  CheckboxGroup,
  Checkbox,
  Switch,
  Slider,
  Badge,
  Divider,
  Inset,
  Tiles,
  Item,
} from '@marigold/components';

interface Product {
  id: number;
  name: string;
  price: number;
  status: 'New' | 'Sale' | 'Sold Out';
  description: string;
  category: string;
  sizes: string[];
  popularity: number;
  createdAt: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Logo T-Shirt',
    price: 29.99,
    status: 'New',
    description: 'A comfortable cotton tee featuring our iconic brand logo.',
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 95,
    createdAt: 8,
  },
  {
    id: 2,
    name: 'Vintage Hoodie',
    price: 59.99,
    status: 'Sale',
    description: 'Warm and stylish hoodie with a retro-inspired design.',
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    popularity: 88,
    createdAt: 6,
  },
  {
    id: 3,
    name: 'Logo Cap',
    price: 24.99,
    status: 'New',
    description: 'Adjustable cap with embroidered brand logo on the front.',
    category: 'Accessories',
    sizes: ['XS', 'S', 'M'],
    popularity: 72,
    createdAt: 7,
  },
  {
    id: 4,
    name: 'Brand Poster',
    price: 14.99,
    status: 'New',
    description: 'High-quality print poster perfect for decorating any wall.',
    category: 'Posters',
    sizes: [],
    popularity: 60,
    createdAt: 4,
  },
  {
    id: 5,
    name: 'Sticker Pack',
    price: 9.99,
    status: 'Sale',
    description: 'A pack of ten vinyl stickers featuring various brand designs.',
    category: 'Stickers',
    sizes: [],
    popularity: 99,
    createdAt: 5,
  },
  {
    id: 6,
    name: 'Premium Hoodie',
    price: 79.99,
    status: 'Sold Out',
    description: 'Our most luxurious hoodie crafted from premium fleece material.',
    category: 'Hoodies',
    sizes: [],
    popularity: 91,
    createdAt: 2,
  },
  {
    id: 7,
    name: 'Graphic T-Shirt',
    price: 34.99,
    status: 'New',
    description: 'Bold graphic print on a soft, high-quality cotton tee.',
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L'],
    popularity: 78,
    createdAt: 9,
  },
  {
    id: 8,
    name: 'Enamel Pin Set',
    price: 19.99,
    status: 'Sold Out',
    description: 'Collectible enamel pins featuring iconic brand symbols.',
    category: 'Accessories',
    sizes: [],
    popularity: 85,
    createdAt: 1,
  },
];

interface Filters {
  categories: string[];
  maxPrice: number;
  sizes: string[];
  inStockOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  maxPrice: 100,
  sizes: [],
  inStockOnly: false,
};

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const ITEMS_PER_PAGE = 8;

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(product => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
      if (product.price > filters.maxPrice) return false;
      if (filters.sizes.length > 0 && filters.sizes.length > 0 && product.sizes.length > 0 && !product.sizes.some(s => filters.sizes.includes(s))) return false;
      if (filters.inStockOnly && product.status === 'Sold Out') return false;
      return true;
    });

    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }
    return sorted;
  }, [search, sortBy, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilters: Array<{ key: string; label: string }> = [];
  filters.categories.forEach(cat =>
    activeFilters.push({ key: `cat-${cat}`, label: cat })
  );
  if (filters.maxPrice < 100) {
    activeFilters.push({ key: 'price', label: `Max $${filters.maxPrice}` });
  }
  filters.sizes.forEach(s =>
    activeFilters.push({ key: `size-${s}`, label: `Size: ${s}` })
  );
  if (filters.inStockOnly) {
    activeFilters.push({ key: 'instock', label: 'In Stock Only' });
  }

  const removeFilter = (key: string) => {
    if (key.startsWith('cat-')) {
      const cat = key.replace('cat-', '');
      setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
    } else if (key === 'price') {
      setFilters(prev => ({ ...prev, maxPrice: 100 }));
    } else if (key.startsWith('size-')) {
      const size = key.replace('size-', '');
      setFilters(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
    } else if (key === 'instock') {
      setFilters(prev => ({ ...prev, inStockOnly: false }));
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPendingFilters(DEFAULT_FILTERS);
    setSearch('');
    setCurrentPage(1);
  };

  const openFilterPanel = () => {
    setPendingFilters({ ...filters });
    setFilterPanelOpen(true);
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
    setFilterPanelOpen(false);
    setCurrentPage(1);
  };

  const resetPending = () => {
    setPendingFilters(DEFAULT_FILTERS);
  };

  return (
    <Inset space="24">
      <Stack space="16">
        {/* Header */}
        <Stack space="4">
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        <Divider />

        {/* Toolbar */}
        <Inline space="8" alignY="bottom">
          <TextField
            label="Search"
            value={search}
            onChange={(val) => { setSearch(val); setCurrentPage(1); }}
            placeholder="Search products..."
          />
          <Select
            label="Sort by"
            selectedKey={sortBy}
            onSelectionChange={(key) => { setSortBy(String(key)); setCurrentPage(1); }}
          >
            <Item key="newest">Newest</Item>
            <Item key="price-asc">Price: Low to High</Item>
            <Item key="price-desc">Price: High to Low</Item>
            <Item key="popular">Most Popular</Item>
          </Select>
          <Button variant="secondary" onPress={openFilterPanel}>
            Filters
          </Button>
        </Inline>

        {/* Filter Panel */}
        {filterPanelOpen && (
          <Stack space="12">
            <Inline space="8" alignY="center">
              <Headline level={3}>Filters</Headline>
              <Button variant="ghost" onPress={() => setFilterPanelOpen(false)}>
                Close
              </Button>
            </Inline>

            <CheckboxGroup
              label="Category"
              value={pendingFilters.categories}
              onChange={(vals) =>
                setPendingFilters(prev => ({ ...prev, categories: vals }))
              }
            >
              {CATEGORIES.map(cat => (
                <Checkbox key={cat} value={cat}>
                  {cat}
                </Checkbox>
              ))}
            </CheckboxGroup>

            <Slider
              label={`Price range: $0 – $${pendingFilters.maxPrice}`}
              minValue={0}
              maxValue={100}
              value={pendingFilters.maxPrice}
              onChange={(val) =>
                setPendingFilters(prev => ({ ...prev, maxPrice: val as number }))
              }
            />

            <CheckboxGroup
              label="Size"
              value={pendingFilters.sizes}
              onChange={(vals) =>
                setPendingFilters(prev => ({ ...prev, sizes: vals }))
              }
            >
              {SIZES.map(size => (
                <Checkbox key={size} value={size}>
                  {size}
                </Checkbox>
              ))}
            </CheckboxGroup>

            <Switch
              isSelected={pendingFilters.inStockOnly}
              onChange={(val) =>
                setPendingFilters(prev => ({ ...prev, inStockOnly: val }))
              }
            >
              In stock only
            </Switch>

            <Inline space="8">
              <Button variant="primary" onPress={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="secondary" onPress={resetPending}>
                Reset
              </Button>
            </Inline>

            <Divider />
          </Stack>
        )}

        {/* Applied Filters */}
        {activeFilters.length > 0 ? (
          <Inline space="4" alignY="center">
            {activeFilters.map(filter => (
              <Inline key={filter.key} space="2" alignY="center">
                <Badge>{filter.label}</Badge>
                <Button
                  variant="ghost"
                  size="small"
                  onPress={() => removeFilter(filter.key)}
                >
                  ×
                </Button>
              </Inline>
            ))}
            <Button variant="ghost" size="small" onPress={clearAllFilters}>
              Clear all
            </Button>
          </Inline>
        ) : (
          <Text color="text-muted">No filters applied</Text>
        )}

        {/* Product Grid or Empty State */}
        {paginatedProducts.length === 0 ? (
          <Stack space="8" alignX="center">
            <Headline level={3}>No products found</Headline>
            <Text>Try adjusting your filters or search query.</Text>
            <Button variant="primary" onPress={clearAllFilters}>
              Clear all filters
            </Button>
          </Stack>
        ) : (
          <Tiles space="16" tilesWidth="240px">
            {paginatedProducts.map(product => (
              <Stack key={product.id} space="8">
                <Inline space="4" alignY="center">
                  <Text weight="bold">{product.name}</Text>
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
                </Inline>
                <Text weight="bold">${product.price.toFixed(2)}</Text>
                <Text>{product.description}</Text>
                <Button
                  variant="primary"
                  isDisabled={product.status === 'Sold Out'}
                  onPress={() => {}}
                >
                  Add to Cart
                </Button>
              </Stack>
            ))}
          </Tiles>
        )}

        {/* Pagination */}
        <Inline space="8" alignY="center">
          <Button
            variant="secondary"
            isDisabled={currentPage <= 1}
            onPress={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            variant="secondary"
            isDisabled={currentPage >= totalPages}
            onPress={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </Inline>
      </Stack>
    </Inset>
  );
};

export default TestApp;
