import { useMemo, useState } from 'react';
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
  Slider,
  Split,
  Stack,
  Switch,
  Tag,
  Text,
  TextField,
  Tiles,
} from '@marigold/components';

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'New' | 'Sale' | 'Sold Out';
  description: string;
  sizes: string[];
  inStock: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo Tee',
    price: 29.99,
    category: 'T-Shirts',
    status: 'New',
    description: 'Soft cotton tee with an embroidered signature logo.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Vintage Hoodie',
    price: 59.99,
    category: 'Hoodies',
    status: 'Sale',
    description: 'Cozy fleece hoodie in a warm vintage wash finish.',
    sizes: ['M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 24.99,
    category: 'Accessories',
    status: 'New',
    description: 'Structured baseball cap with embroidered front logo.',
    sizes: ['XS', 'S', 'M'],
    inStock: true,
  },
  {
    id: '4',
    name: 'City Skyline Poster',
    price: 14.99,
    category: 'Posters',
    status: 'Sold Out',
    description: 'High-resolution print of the iconic city skyline artwork.',
    sizes: [],
    inStock: false,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    status: 'Sale',
    description: 'Set of 10 durable waterproof vinyl stickers.',
    sizes: [],
    inStock: true,
  },
  {
    id: '6',
    name: 'Premium Zip Hoodie',
    price: 79.99,
    category: 'Hoodies',
    status: 'New',
    description: 'Premium full-zip hoodie with a woven logo patch.',
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Graphic Tee',
    price: 34.99,
    category: 'T-Shirts',
    status: 'Sold Out',
    description: 'Bold graphic print on heavyweight 100% cotton fabric.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: false,
  },
  {
    id: '8',
    name: 'Enamel Pin Set',
    price: 19.99,
    category: 'Accessories',
    status: 'New',
    description: 'Collection of 4 hand-crafted collectible enamel pins.',
    sizes: [],
    inStock: true,
  },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const PAGE_SIZE = 3;

const BADGE_VARIANT: Record<string, 'info' | 'warning' | 'error'> = {
  New: 'info',
  Sale: 'warning',
  'Sold Out': 'error',
};

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

export default function TestApp() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterPriceMax, setFilterPriceMax] = useState(100);
  const [filterSizes, setFilterSizes] = useState<string[]>([]);
  const [filterInStock, setFilterInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    if (filterCategories.length > 0) {
      result = result.filter(p => filterCategories.includes(p.category));
    }

    if (filterPriceMax < 100) {
      result = result.filter(p => p.price <= filterPriceMax);
    }

    if (filterSizes.length > 0) {
      result = result.filter(p => filterSizes.some(s => p.sizes.includes(s)));
    }

    if (filterInStock) {
      result = result.filter(p => p.inStock);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    return result;
  }, [search, filterCategories, filterPriceMax, filterSizes, filterInStock, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProducts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string }[] = [];
    filterCategories.forEach(cat =>
      chips.push({ id: `category:${cat}`, label: `Category: ${cat}` })
    );
    if (filterPriceMax < 100) {
      chips.push({ id: 'price', label: `Price: up to $${filterPriceMax}` });
    }
    filterSizes.forEach(size =>
      chips.push({ id: `size:${size}`, label: `Size: ${size}` })
    );
    if (filterInStock) {
      chips.push({ id: 'instock', label: 'In stock only' });
    }
    return chips;
  }, [filterCategories, filterPriceMax, filterSizes, filterInStock]);

  const handleRemoveChip = (keys: Set<string>) => {
    const arr = Array.from(keys);
    const cats = arr
      .filter(k => k.startsWith('category:'))
      .map(k => k.slice('category:'.length));
    if (cats.length > 0) {
      setFilterCategories(prev => prev.filter(c => !cats.includes(c)));
    }
    if (arr.includes('price')) setFilterPriceMax(100);
    const sizes = arr
      .filter(k => k.startsWith('size:'))
      .map(k => k.slice('size:'.length));
    if (sizes.length > 0) {
      setFilterSizes(prev => prev.filter(s => !sizes.includes(s)));
    }
    if (arr.includes('instock')) setFilterInStock(false);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearch('');
    setFilterCategories([]);
    setFilterPriceMax(100);
    setFilterSizes([]);
    setFilterInStock(false);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterCategories([]);
    setFilterPriceMax(100);
    setFilterSizes([]);
    setFilterInStock(false);
    setCurrentPage(1);
  };

  return (
    <AppLayout.Main>
      <Inset space={4}>
        <Stack space={6}>
          {/* Page header */}
          <Stack space={2}>
            <Headline level={1}>Merchandise Store</Headline>
            <Text>Browse our collection of branded merchandise.</Text>
          </Stack>

          {/* Toolbar */}
          <Stack space={4}>
            <Inline alignY="center" space={4}>
              <TextField
                label="Search"
                aria-label="Search products"
                placeholder="Search products…"
                value={search}
                onChange={(val: string) => {
                  setSearch(val);
                  setCurrentPage(1);
                }}
              />
              <Split />
              <Drawer.Trigger>
                <Button variant="secondary">Filters</Button>
                <Drawer size="medium">
                  <Drawer.Title>Filters</Drawer.Title>
                  <Drawer.Content>
                    <Stack space={6}>
                      <Checkbox.Group
                        label="Category"
                        value={filterCategories}
                        onChange={setFilterCategories}
                      >
                        {CATEGORIES.map(cat => (
                          <Checkbox key={cat} value={cat} label={cat} />
                        ))}
                      </Checkbox.Group>
                      <Slider
                        label="Price range"
                        value={filterPriceMax}
                        onChange={val =>
                          setFilterPriceMax(Array.isArray(val) ? val[0] : val)
                        }
                        minValue={0}
                        maxValue={100}
                        step={5}
                        formatOptions={{ style: 'currency', currency: 'USD' }}
                      />
                      <Checkbox.Group
                        label="Size"
                        value={filterSizes}
                        onChange={setFilterSizes}
                      >
                        {SIZES.map(size => (
                          <Checkbox key={size} value={size} label={size} />
                        ))}
                      </Checkbox.Group>
                      <Switch
                        label="In stock only"
                        selected={filterInStock}
                        onChange={setFilterInStock}
                      />
                    </Stack>
                  </Drawer.Content>
                  <Drawer.Actions>
                    <Button slot="close" onPress={resetFilters}>
                      Reset
                    </Button>
                    <Button
                      slot="close"
                      variant="primary"
                      onPress={() => setCurrentPage(1)}
                    >
                      Apply Filters
                    </Button>
                  </Drawer.Actions>
                </Drawer>
              </Drawer.Trigger>
            </Inline>

            {/* Sort controls — individual Buttons, each independently Tab-reachable */}
            <Inline space={2} alignY="center">
              <Text>Sort:</Text>
              {SORT_OPTIONS.map(opt => (
                <Button
                  key={opt.id}
                  variant={sortBy === opt.id ? 'primary' : 'secondary'}
                  onPress={() => {
                    setSortBy(opt.id);
                    setCurrentPage(1);
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </Inline>
          </Stack>

          {/* Applied filter chips */}
          {activeChips.length > 0 ? (
            <Inline alignY="center" space={4}>
              <Tag.Group
                label="Active filters"
                onRemove={handleRemoveChip as any}
              >
                {activeChips.map(chip => (
                  <Tag key={chip.id} id={chip.id}>
                    {chip.label}
                  </Tag>
                ))}
              </Tag.Group>
              <Button variant="secondary" onPress={clearAllFilters}>
                Clear all
              </Button>
            </Inline>
          ) : (
            <Text fontSize="sm" color="muted-foreground" fontStyle="italic">
              No filters applied
            </Text>
          )}

          {/* Product grid or empty state */}
          {pageProducts.length === 0 ? (
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
              {pageProducts.map(product => (
                <Card key={product.id} p={4}>
                  <Stack space={3}>
                    <Badge variant={BADGE_VARIANT[product.status]}>
                      {product.status}
                    </Badge>
                    <Headline level={2}>{product.name}</Headline>
                    <Text weight="bold">${product.price.toFixed(2)}</Text>
                    <Text>{product.description}</Text>
                    <Button
                      variant={product.inStock ? 'primary' : 'secondary'}
                      aria-disabled={!product.inStock || undefined}
                      onPress={() => {
                        if (!product.inStock) return;
                      }}
                    >
                      {product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Tiles>
          )}

          {/* Pagination — custom Previous/Next with aria-disabled to keep buttons Tab-reachable */}
          {filtered.length > 0 && (
            <Inline alignY="center" space={4}>
              <Text>
                Page {safePage} of {totalPages}
              </Text>
              <Split />
              <Inline space={2}>
                <Button
                  variant="secondary"
                  aria-disabled={safePage <= 1 || undefined}
                  onPress={() => {
                    if (safePage > 1) setCurrentPage(safePage - 1);
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  aria-disabled={safePage >= totalPages || undefined}
                  onPress={() => {
                    if (safePage < totalPages) setCurrentPage(safePage + 1);
                  }}
                >
                  Next
                </Button>
              </Inline>
            </Inline>
          )}
        </Stack>
      </Inset>
    </AppLayout.Main>
  );
}
