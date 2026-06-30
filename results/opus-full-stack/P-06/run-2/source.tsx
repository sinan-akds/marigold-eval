import { useState } from 'react';
import type { Key, Selection } from 'react-aria-components';
import {
  Badge,
  Button,
  Card,
  Columns,
  Drawer,
  EmptyState,
  Headline,
  Inline,
  SearchField,
  Select,
  Slider,
  Stack,
  Switch,
  Tag,
  Text,
  Tiles,
} from '@marigold/components';

type Status = 'New' | 'Sale' | 'Sold Out';

interface Product {
  id: string;
  name: string;
  price: number;
  status: Status;
  description: string;
  category: string;
  sizes: string[];
  popularity: number;
}

const CATEGORIES = [
  { id: 'tshirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'posters', label: 'Posters' },
  { id: 'stickers', label: 'Stickers' },
];

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, c.label])
);

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const STATUS_VARIANT: Record<Status, 'info' | 'warning' | 'error'> = {
  New: 'info',
  Sale: 'warning',
  'Sold Out': 'error',
};

const PAGE_SIZE = 8;
const MIN_PRICE = 0;
const MAX_PRICE = 100;

// Products are listed newest-first; the two newest are sold out.
const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Aurora Logo Tee', price: 24.99, status: 'Sold Out', category: 'tshirts', sizes: ['XS', 'S', 'M', 'L', 'XL'], popularity: 88, description: 'Soft cotton tee featuring our signature aurora logo print.' },
  { id: 'p2', name: 'Midnight Pullover Hoodie', price: 59.99, status: 'Sold Out', category: 'hoodies', sizes: ['S', 'M', 'L', 'XL'], popularity: 95, description: 'Heavyweight fleece hoodie in a deep midnight black.' },
  { id: 'p3', name: 'Retro Wave Poster', price: 14.99, status: 'New', category: 'posters', sizes: [], popularity: 40, description: 'A2 matte poster with a vibrant retro wave design.' },
  { id: 'p4', name: 'Sticker Pack Vol. 1', price: 6.99, status: 'New', category: 'stickers', sizes: [], popularity: 72, description: 'Set of ten weatherproof vinyl stickers for any surface.' },
  { id: 'p5', name: 'Canvas Tote Bag', price: 18.5, status: 'Sale', category: 'accessories', sizes: [], popularity: 65, description: 'Durable canvas tote with reinforced handles and a roomy interior.' },
  { id: 'p6', name: 'Graphic Crew Tee', price: 22.0, status: 'New', category: 'tshirts', sizes: ['S', 'M', 'L', 'XL'], popularity: 54, description: 'Relaxed-fit crew neck tee with a bold front graphic.' },
  { id: 'p7', name: 'Zip-Up Tech Hoodie', price: 74.99, status: 'New', category: 'hoodies', sizes: ['XS', 'S', 'M', 'L'], popularity: 81, description: 'Lightweight zip hoodie with moisture-wicking tech fabric.' },
  { id: 'p8', name: 'Enamel Pin Set', price: 9.99, status: 'Sale', category: 'accessories', sizes: [], popularity: 48, description: 'Trio of collectible enamel pins with butterfly clutch backs.' },
  { id: 'p9', name: 'Tour Dates Poster', price: 16.0, status: 'New', category: 'posters', sizes: [], popularity: 33, description: 'Limited edition tour dates poster printed on heavy stock.' },
  { id: 'p10', name: 'Logo Beanie', price: 21.99, status: 'New', category: 'accessories', sizes: [], popularity: 57, description: 'Ribbed knit beanie with an embroidered logo cuff.' },
  { id: 'p11', name: 'Vintage Wash Tee', price: 27.5, status: 'Sale', category: 'tshirts', sizes: ['M', 'L', 'XL'], popularity: 60, description: 'Garment-dyed tee with a lived-in vintage wash.' },
  { id: 'p12', name: 'Sherpa Lined Hoodie', price: 89.99, status: 'New', category: 'hoodies', sizes: ['S', 'M', 'L', 'XL'], popularity: 77, description: 'Cozy sherpa-lined hoodie built for cold weather.' },
  { id: 'p13', name: 'Holographic Sticker', price: 3.99, status: 'New', category: 'stickers', sizes: [], popularity: 90, description: 'Single die-cut holographic sticker that shifts in the light.' },
  { id: 'p14', name: 'Coffee Mug', price: 12.99, status: 'Sale', category: 'accessories', sizes: [], popularity: 69, description: 'Ceramic 12oz mug with a wraparound logo print.' },
  { id: 'p15', name: 'Festival Poster', price: 19.99, status: 'New', category: 'posters', sizes: [], popularity: 29, description: 'Full-color festival poster with foil-stamped accents.' },
  { id: 'p16', name: 'Performance Tee', price: 31.0, status: 'New', category: 'tshirts', sizes: ['XS', 'S', 'M', 'L', 'XL'], popularity: 51, description: 'Breathable performance tee for training and everyday wear.' },
  { id: 'p17', name: 'Oversized Hoodie', price: 64.5, status: 'Sale', category: 'hoodies', sizes: ['M', 'L', 'XL'], popularity: 84, description: 'Street-style oversized hoodie with a dropped shoulder fit.' },
  { id: 'p18', name: 'Logo Sticker Sheet', price: 4.99, status: 'New', category: 'stickers', sizes: [], popularity: 44, description: 'A5 sticker sheet packed with mini logo decals.' },
  { id: 'p19', name: 'Snapback Cap', price: 26.0, status: 'New', category: 'accessories', sizes: [], popularity: 62, description: 'Structured snapback cap with a flat embroidered brim.' },
  { id: 'p20', name: 'Minimal Line Poster', price: 13.5, status: 'Sale', category: 'posters', sizes: [], popularity: 37, description: 'Minimalist line-art poster printed with eco-friendly inks.' },
];

const selectionToSet = (keys: Selection, all: string[]): Set<string> =>
  keys === 'all' ? new Set(all) : new Set([...keys].map(String));

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('newest');
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState<number[]>([MIN_PRICE, MAX_PRICE]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);

  const priceChanged = price[0] !== MIN_PRICE || price[1] !== MAX_PRICE;

  const resetFilters = () => {
    setCategories(new Set());
    setSizes(new Set());
    setPrice([MIN_PRICE, MAX_PRICE]);
    setInStockOnly(false);
    setPage(1);
  };

  const clearAll = () => {
    resetFilters();
    setSearch('');
    setSort('newest');
  };

  // Active-filter chips
  const chips: { id: string; label: string }[] = [];
  if (search) chips.push({ id: 'search', label: `Search: ${search}` });
  categories.forEach(c =>
    chips.push({ id: `cat:${c}`, label: CATEGORY_LABEL[c] })
  );
  sizes.forEach(s => chips.push({ id: `size:${s}`, label: `Size: ${s}` }));
  if (priceChanged)
    chips.push({ id: 'price', label: `$${price[0]} – $${price[1]}` });
  if (inStockOnly) chips.push({ id: 'instock', label: 'In stock only' });

  const removeChips = (keys: Set<Key>) => {
    keys.forEach(raw => {
      const key = String(raw);
      if (key === 'search') setSearch('');
      else if (key.startsWith('cat:'))
        setCategories(prev => {
          const next = new Set(prev);
          next.delete(key.slice(4));
          return next;
        });
      else if (key.startsWith('size:'))
        setSizes(prev => {
          const next = new Set(prev);
          next.delete(key.slice(5));
          return next;
        });
      else if (key === 'price') setPrice([MIN_PRICE, MAX_PRICE]);
      else if (key === 'instock') setInStockOnly(false);
    });
    setPage(1);
  };

  // Filtering
  const filtered = PRODUCTS.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (categories.size && !categories.has(p.category)) return false;
    if (sizes.size && !p.sizes.some(s => sizes.has(s))) return false;
    if (p.price < price[0] || p.price > price[1]) return false;
    if (inStockOnly && p.status === 'Sold Out') return false;
    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'popular':
        return b.popularity - a.popularity;
      default:
        return 0; // newest: preserve source (newest-first) order
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = sorted.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  return (
    <Stack space={8}>
      {/* Header */}
      <Inline alignX="between" alignY="center" space={4}>
        <Stack space={2}>
          <Headline level={1}>Merchandise Store</Headline>
          <Text variant="muted">
            Browse our collection of branded merchandise.
          </Text>
        </Stack>
        <Badge variant="primary">{`Cart: ${cart}`}</Badge>
      </Inline>

      {/* Toolbar */}
      <Columns columns={[1, 'fit', 'fit']} space={4} collapseAt="40em">
        <SearchField
          label="Search"
          aria-label="Search products by name"
          placeholder="Search products…"
          value={search}
          onChange={value => {
            setSearch(value);
            setPage(1);
          }}
        />
        <Select
          label="Sort by"
          aria-label="Sort products"
          selectedKey={sort}
          onSelectionChange={key => {
            setSort(String(key));
            setPage(1);
          }}
          width="fit"
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-asc">Price: Low to High</Select.Option>
          <Select.Option id="price-desc">Price: High to Low</Select.Option>
          <Select.Option id="popular">Most Popular</Select.Option>
        </Select>
        <Drawer.Trigger>
          <Button variant="secondary">Filters</Button>
          <Drawer closeButton>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                <Tag.Group
                  label="Category"
                  selectionMode="multiple"
                  selectedKeys={categories}
                  onSelectionChange={keys => {
                    setCategories(
                      selectionToSet(
                        keys,
                        CATEGORIES.map(c => c.id)
                      )
                    );
                    setPage(1);
                  }}
                >
                  {CATEGORIES.map(c => (
                    <Tag key={c.id} id={c.id}>
                      {c.label}
                    </Tag>
                  ))}
                </Tag.Group>

                <Slider
                  label="Price range"
                  minValue={MIN_PRICE}
                  maxValue={MAX_PRICE}
                  step={5}
                  value={price}
                  onChange={value => {
                    setPrice(value as number[]);
                    setPage(1);
                  }}
                  thumbLabels={['Minimum price', 'Maximum price']}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />

                <Tag.Group
                  label="Size"
                  selectionMode="multiple"
                  selectedKeys={sizes}
                  onSelectionChange={keys => {
                    setSizes(selectionToSet(keys, SIZES));
                    setPage(1);
                  }}
                >
                  {SIZES.map(s => (
                    <Tag key={s} id={s}>
                      {s}
                    </Tag>
                  ))}
                </Tag.Group>

                <Switch
                  label="In stock only"
                  selected={inStockOnly}
                  onChange={value => {
                    setInStockOnly(value);
                    setPage(1);
                  }}
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button onPress={resetFilters}>Reset</Button>
              <Button slot="close" variant="primary" onPress={() => setPage(1)}>
                Apply Filters
              </Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      </Columns>

      {/* Applied filters */}
      <Tag.Group
        label="Applied filters"
        onRemove={removeChips}
        removeAll
        emptyState={() => <Text variant="muted">No filters applied</Text>}
      >
        {chips.map(c => (
          <Tag key={c.id} id={c.id}>
            {c.label}
          </Tag>
        ))}
      </Tag.Group>

      {/* Product grid / empty state */}
      <Headline level={2}>Products</Headline>
      {pageItems.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={
            <Button variant="primary" onPress={clearAll}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <Tiles tilesWidth="260px" space={4} stretch equalHeight>
          {pageItems.map(p => (
            <Card key={p.id} p={4}>
              <Stack space={3} alignX="left" stretch>
                <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
                <Headline level={3}>{p.name}</Headline>
                <Text weight="bold" fontSize="lg">
                  {`$${p.price.toFixed(2)}`}
                </Text>
                <Text variant="muted" fontSize="sm">
                  {p.description}
                </Text>
                <Button
                  variant="primary"
                  fullWidth
                  disabled={p.status === 'Sold Out'}
                  onPress={() => setCart(c => c + 1)}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {/* Pagination */}
      <Inline space={4} alignX="center" alignY="center">
        <Button
          variant="secondary"
          onPress={() => setPage(Math.max(1, current - 1))}
          disabled={current <= 1}
        >
          Previous
        </Button>
        <Text>{`Page ${current} of ${totalPages}`}</Text>
        <Button
          variant="secondary"
          onPress={() => setPage(Math.min(totalPages, current + 1))}
          disabled={current >= totalPages}
        >
          Next
        </Button>
      </Inline>
    </Stack>
  );
};

export default TestApp;
