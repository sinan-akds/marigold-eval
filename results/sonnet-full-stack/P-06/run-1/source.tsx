import { useEffect, useMemo, useState } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Checkbox,
  Drawer,
  EmptyState,
  Headline,
  Inline,
  Inset,
  Pagination,
  SearchField,
  Select,
  Slider,
  Split,
  Stack,
  Switch,
  Tag,
  Text,
  Tiles,
} from '@marigold/components';

type ProductStatus = 'New' | 'Sale' | 'Sold Out';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: ProductStatus;
  description: string;
  sizes: string[];
  inStock: boolean;
}

interface FilterState {
  categories: string[];
  maxPrice: number;
  sizes: string[];
  inStockOnly: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo Tee',
    price: 29.99,
    category: 'T-Shirts',
    status: 'New',
    description: 'A comfortable everyday tee featuring our iconic brand logo.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Pullover Hoodie',
    price: 59.99,
    category: 'Hoodies',
    status: 'Sale',
    description: 'Stay warm in style with this premium pullover hoodie.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 24.99,
    category: 'Accessories',
    status: 'New',
    description: 'Classic structured cap with an embroidered brand logo on the front.',
    sizes: ['XS', 'S', 'M'],
    inStock: true,
  },
  {
    id: '4',
    name: 'City Poster',
    price: 19.99,
    category: 'Posters',
    status: 'New',
    description: 'High-quality print of our signature city artwork for your wall.',
    sizes: [],
    inStock: true,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    status: 'Sale',
    description: 'Set of 10 premium vinyl stickers for all your gear and devices.',
    sizes: [],
    inStock: true,
  },
  {
    id: '6',
    name: 'Vintage Tee',
    price: 34.99,
    category: 'T-Shirts',
    status: 'Sold Out',
    description: 'Soft vintage-washed tee with a retro feel and faded logo print.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: false,
  },
  {
    id: '7',
    name: 'Zip-Up Hoodie',
    price: 79.99,
    category: 'Hoodies',
    status: 'Sold Out',
    description: 'Full-zip hoodie with kangaroo pockets and an adjustable drawstring hem.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false,
  },
  {
    id: '8',
    name: 'Enamel Pin Set',
    price: 14.99,
    category: 'Accessories',
    status: 'New',
    description: 'Collectible enamel pin set featuring our beloved brand characters.',
    sizes: [],
    inStock: true,
  },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const PAGE_SIZE = 3;

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  maxPrice: 100,
  sizes: [],
  inStockOnly: false,
};

const STATUS_BADGE_VARIANT: Record<ProductStatus, 'info' | 'warning' | 'error'> = {
  New: 'info',
  Sale: 'warning',
  'Sold Out': 'error',
};

export default function MerchandiseStore() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  // Sync pending filters from active whenever active changes externally
  useEffect(() => {
    setPendingFilters(activeFilters);
  }, [activeFilters]);

  // Build removable filter chip list from active filters
  const filterChips = useMemo(() => {
    const chips: Array<{ id: string; label: string }> = [];
    for (const cat of activeFilters.categories) {
      chips.push({ id: `cat:${cat}`, label: cat });
    }
    if (activeFilters.maxPrice < 100) {
      chips.push({ id: 'price', label: `Under $${activeFilters.maxPrice}` });
    }
    for (const size of activeFilters.sizes) {
      chips.push({ id: `size:${size}`, label: `Size: ${size}` });
    }
    if (activeFilters.inStockOnly) {
      chips.push({ id: 'instock', label: 'In Stock Only' });
    }
    return chips;
  }, [activeFilters]);

  const handleRemoveChip = (keys: any) => {
    setActiveFilters(prev => {
      const updated = {
        ...prev,
        categories: [...prev.categories],
        sizes: [...prev.sizes],
      };
      for (const key of keys) {
        const k = String(key);
        if (k.startsWith('cat:')) {
          updated.categories = updated.categories.filter(c => c !== k.slice(4));
        } else if (k === 'price') {
          updated.maxPrice = 100;
        } else if (k.startsWith('size:')) {
          updated.sizes = updated.sizes.filter(s => s !== k.slice(5));
        } else if (k === 'instock') {
          updated.inStockOnly = false;
        }
      }
      return updated;
    });
    setPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const applyFilters = () => {
    setActiveFilters({ ...pendingFilters });
    setPage(1);
  };

  const resetFilters = () => {
    setActiveFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  // Filtered + sorted product list
  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (
        activeFilters.categories.length > 0 &&
        !activeFilters.categories.includes(p.category)
      )
        return false;
      if (p.price > activeFilters.maxPrice) return false;
      if (
        activeFilters.sizes.length > 0 &&
        (p.sizes.length === 0 || !p.sizes.some(s => activeFilters.sizes.includes(s)))
      )
        return false;
      if (activeFilters.inStockOnly && !p.inStock) return false;
      return true;
    });

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [search, activeFilters, sortBy]);

  // Reset page when search or sort changes
  useEffect(() => {
    setPage(1);
  }, [search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  // Clamp page to valid range
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const currentProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <AppLayout>
      <AppLayout.Main>
    <Inset space={8}>
      <Stack space={8}>
        {/* Page Header */}
        <Stack space={2}>
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Stack space={4}>
          <SearchField
            aria-label="Search products"
            placeholder="Search products..."
            value={search}
            onChange={setSearch}
          />
          <Inline alignX="between" alignY="center" space={4}>
            <Select
              aria-label="Sort by"
              value={sortBy}
              onChange={val => setSortBy(String(val))}
              width="fit"
            >
              <Select.Option id="newest">Newest</Select.Option>
              <Select.Option id="price-asc">Price: Low to High</Select.Option>
              <Select.Option id="price-desc">Price: High to Low</Select.Option>
              <Select.Option id="popular">Most Popular</Select.Option>
            </Select>
            <Drawer.Trigger>
            <Button variant="secondary">Filters</Button>
            <Drawer>
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Content>
                <Stack space={6}>
                  {/* Category */}
                  <Stack space={3}>
                    <Text weight="bold">Category</Text>
                    <Checkbox.Group
                      aria-label="Filter by category"
                      value={pendingFilters.categories}
                      onChange={vals =>
                        setPendingFilters(prev => ({
                          ...prev,
                          categories: vals as string[],
                        }))
                      }
                    >
                      {CATEGORIES.map(cat => (
                        <Checkbox key={cat} value={cat} label={cat} />
                      ))}
                    </Checkbox.Group>
                  </Stack>

                  {/* Price Range */}
                  <Slider
                    label="Price range"
                    minValue={0}
                    maxValue={100}
                    value={pendingFilters.maxPrice}
                    onChange={val =>
                      setPendingFilters(prev => ({
                        ...prev,
                        maxPrice: val as number,
                      }))
                    }
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                  />

                  {/* Size */}
                  <Stack space={3}>
                    <Text weight="bold">Size</Text>
                    <Checkbox.Group
                      aria-label="Filter by size"
                      value={pendingFilters.sizes}
                      onChange={vals =>
                        setPendingFilters(prev => ({
                          ...prev,
                          sizes: vals as string[],
                        }))
                      }
                    >
                      {SIZES.map(size => (
                        <Checkbox key={size} value={size} label={size} />
                      ))}
                    </Checkbox.Group>
                  </Stack>

                  {/* Availability */}
                  <Stack space={2}>
                    <Text weight="bold">Availability</Text>
                    <Switch
                      label="In stock only"
                      selected={pendingFilters.inStockOnly}
                      onChange={(val: boolean) =>
                        setPendingFilters(prev => ({
                          ...prev,
                          inStockOnly: val,
                        }))
                      }
                    />
                  </Stack>
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button slot="close" onPress={resetFilters}>
                  Reset
                </Button>
                <Button slot="close" variant="primary" onPress={applyFilters}>
                  Apply Filters
                </Button>
              </Drawer.Actions>
            </Drawer>
          </Drawer.Trigger>
          </Inline>
        </Stack>

        {/* Applied Filters */}
        <Tag.Group
          label="Applied filters"
          onRemove={handleRemoveChip}
          removeAll={filterChips.length > 0}
          emptyState={() => (
            <Text color="muted-foreground">No filters applied</Text>
          )}
        >
          {filterChips.map(({ id, label }) => (
            <Tag key={id} id={id}>
              {label}
            </Tag>
          ))}
        </Tag.Group>

        {/* Product Grid or Empty State */}
        {currentProducts.length === 0 ? (
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
          <Tiles tilesWidth="280px" space={4} stretch equalHeight>
            {currentProducts.map(product => (
              <Card key={product.id} p={4}>
                <Stack space={3}>
                  <Inline alignX="between" alignY="center">
                    <Headline level={2}>{product.name}</Headline>
                    <Badge variant={STATUS_BADGE_VARIANT[product.status]}>
                      {product.status}
                    </Badge>
                  </Inline>
                  <Text weight="bold">${product.price.toFixed(2)}</Text>
                  <Text>{product.description}</Text>
                  <Button
                    variant="primary"
                    disabled={!product.inStock}
                    onPress={() => {}}
                  >
                    {product.inStock ? 'Add to Cart' : 'Sold Out'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>
        )}

        {/* Pagination */}
        <Inline alignY="center" space={4}>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Split />
          <Pagination
            totalItems={filteredProducts.length}
            pageSize={PAGE_SIZE}
            page={page}
            onChange={setPage}
          />
        </Inline>
      </Stack>
    </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
}
