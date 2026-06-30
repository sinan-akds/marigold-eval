import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Drawer,
  Headline,
  Inline,
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

type Status = 'new' | 'sale' | 'soldout';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: Status;
  description: string;
  sizes: string[];
  popularity: number;
  added: number;
}

const CATEGORIES = [
  { id: 'tshirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'posters', label: 'Posters' },
  { id: 'stickers', label: 'Stickers' },
];

const SIZES = ['xs', 's', 'm', 'l', 'xl'];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const STATUS_BADGE: Record<Status, { variant: string; label: string }> = {
  new: { variant: 'info', label: 'New' },
  sale: { variant: 'warning', label: 'Sale' },
  soldout: { variant: 'error', label: 'Sold Out' },
};

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic Logo Tee',
    category: 'tshirts',
    price: 24.99,
    status: 'new',
    description: 'Soft cotton tee with the signature embroidered logo.',
    sizes: ['s', 'm', 'l', 'xl'],
    popularity: 42,
    added: 8,
  },
  {
    id: 'p2',
    name: 'Pullover Hoodie',
    category: 'hoodies',
    price: 59.99,
    status: 'sale',
    description: 'Cozy fleece-lined hoodie for cooler days.',
    sizes: ['s', 'm', 'l', 'xl'],
    popularity: 88,
    added: 6,
  },
  {
    id: 'p3',
    name: 'Enamel Pin Set',
    category: 'accessories',
    price: 9.99,
    status: 'new',
    description: 'A set of three collectible enamel pins.',
    sizes: [],
    popularity: 30,
    added: 7,
  },
  {
    id: 'p4',
    name: 'Retro Tour Poster',
    category: 'posters',
    price: 14.99,
    status: 'new',
    description: 'High-quality print of our limited tour artwork.',
    sizes: [],
    popularity: 21,
    added: 5,
  },
  {
    id: 'p5',
    name: 'Sticker Pack',
    category: 'stickers',
    price: 4.99,
    status: 'soldout',
    description: 'Twelve weatherproof vinyl stickers in assorted designs.',
    sizes: [],
    popularity: 64,
    added: 3,
  },
  {
    id: 'p6',
    name: 'Zip-Up Hoodie',
    category: 'hoodies',
    price: 64.99,
    status: 'soldout',
    description: 'Full-zip hoodie with a brushed-fleece interior.',
    sizes: ['m', 'l', 'xl'],
    popularity: 73,
    added: 4,
  },
  {
    id: 'p7',
    name: 'Snapback Cap',
    category: 'accessories',
    price: 19.99,
    status: 'sale',
    description: 'Adjustable cap with a flat embroidered brim.',
    sizes: [],
    popularity: 55,
    added: 2,
  },
  {
    id: 'p8',
    name: 'Graphic Tee',
    category: 'tshirts',
    price: 29.99,
    status: 'new',
    description: 'Bold front-print tee cut in a relaxed fit.',
    sizes: ['xs', 's', 'm', 'l'],
    popularity: 48,
    added: 1,
  },
];

const TOTAL_PAGES = 3;
const DEFAULT_PRICE: [number, number] = [0, 100];

const toKeySet = (keys: unknown, all: string[]): Set<string> =>
  keys === 'all' ? new Set(all) : new Set(keys as Iterable<string>);

const TestApp = () => {
  // Toolbar state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('newest');

  // Applied filters (drive the grid)
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [price, setPrice] = useState<[number, number]>(DEFAULT_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Draft filters (edited inside the drawer, committed on "Apply")
  const [draftCategories, setDraftCategories] = useState<Set<string>>(new Set());
  const [draftSizes, setDraftSizes] = useState<Set<string>>(new Set());
  const [draftPrice, setDraftPrice] = useState<[number, number]>(DEFAULT_PRICE);
  const [draftInStock, setDraftInStock] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  const syncDraftFromApplied = () => {
    setDraftCategories(new Set(categories));
    setDraftSizes(new Set(sizes));
    setDraftPrice([...price] as [number, number]);
    setDraftInStock(inStockOnly);
  };

  const applyFilters = () => {
    setCategories(new Set(draftCategories));
    setSizes(new Set(draftSizes));
    setPrice([...draftPrice] as [number, number]);
    setInStockOnly(draftInStock);
    setCurrentPage(1);
  };

  const resetDraft = () => {
    setDraftCategories(new Set());
    setDraftSizes(new Set());
    setDraftPrice(DEFAULT_PRICE);
    setDraftInStock(false);
  };

  const clearAllFilters = () => {
    setCategories(new Set());
    setSizes(new Set());
    setPrice(DEFAULT_PRICE);
    setInStockOnly(false);
    resetDraft();
    setCurrentPage(1);
  };

  // Build the active-filter chips
  const chips: { id: string; label: string }[] = [];
  categories.forEach(c =>
    chips.push({
      id: `cat:${c}`,
      label: `Category: ${CATEGORIES.find(x => x.id === c)?.label ?? c}`,
    })
  );
  sizes.forEach(s => chips.push({ id: `size:${s}`, label: `Size: ${s.toUpperCase()}` }));
  if (price[0] !== DEFAULT_PRICE[0] || price[1] !== DEFAULT_PRICE[1]) {
    chips.push({ id: 'price', label: `Price: $${price[0]} – $${price[1]}` });
  }
  if (inStockOnly) {
    chips.push({ id: 'instock', label: 'In stock only' });
  }

  const removeChips = (keys: Set<string>) => {
    setCategories(prev => new Set([...prev].filter(c => !keys.has(`cat:${c}`))));
    setSizes(prev => new Set([...prev].filter(s => !keys.has(`size:${s}`))));
    setDraftCategories(prev => new Set([...prev].filter(c => !keys.has(`cat:${c}`))));
    setDraftSizes(prev => new Set([...prev].filter(s => !keys.has(`size:${s}`))));
    if (keys.has('price')) {
      setPrice(DEFAULT_PRICE);
      setDraftPrice(DEFAULT_PRICE);
    }
    if (keys.has('instock')) {
      setInStockOnly(false);
      setDraftInStock(false);
    }
    setCurrentPage(1);
  };

  // Filter + sort
  const visible = PRODUCTS.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categories.size && !categories.has(p.category)) return false;
    if (sizes.size && !p.sizes.some(s => sizes.has(s))) return false;
    if (p.price < price[0] || p.price > price[1]) return false;
    if (inStockOnly && p.status === 'soldout') return false;
    return true;
  }).sort((a, b) => {
    switch (sortKey) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'popular':
        return b.popularity - a.popularity;
      default:
        return b.added - a.added;
    }
  });

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--spacing-6, 1.5rem)',
      }}
    >
      <Stack space={8}>
        {/* Header */}
        <Stack space={2}>
          <Inline space={4} alignY="center" alignX="between">
            <Headline level={1}>Merchandise Store</Headline>
            <Badge variant="primary">Cart: {cartCount}</Badge>
          </Inline>
          <Text variant="muted">Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Inline space={4} alignY="end">
          <SearchField
            label="Search"
            aria-label="Search products by name"
            placeholder="Search products by name"
            value={searchQuery}
            onChange={value => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            width="fit"
          />
          <Select
            label="Sort by"
            aria-label="Sort products"
            selectedKey={sortKey}
            onSelectionChange={key => {
              setSortKey(String(key));
              setCurrentPage(1);
            }}
            width="fit"
          >
            {SORT_OPTIONS.map(option => (
              <Select.Option key={option.id} id={option.id}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
          <Split />
          <Drawer.Trigger
            onOpenChange={(isOpen: boolean) => {
              if (isOpen) syncDraftFromApplied();
            }}
          >
            <Button variant="secondary">Filters</Button>
            <Drawer role="search">
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Content>
                <Stack space={8}>
                  <Tag.Group
                    label="Category"
                    selectionMode="multiple"
                    selectedKeys={draftCategories}
                    onSelectionChange={(keys: any) =>
                      setDraftCategories(toKeySet(keys, CATEGORIES.map(c => c.id)))
                    }
                  >
                    {CATEGORIES.map(c => (
                      <Tag key={c.id} id={c.id}>
                        {c.label}
                      </Tag>
                    ))}
                  </Tag.Group>

                  <Slider
                    label="Price range"
                    value={draftPrice}
                    onChange={(value: any) => setDraftPrice(value as [number, number])}
                    minValue={0}
                    maxValue={100}
                    step={5}
                    thumbLabels={['min', 'max']}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                  />

                  <Tag.Group
                    label="Size"
                    selectionMode="multiple"
                    selectedKeys={draftSizes}
                    onSelectionChange={(keys: any) => setDraftSizes(toKeySet(keys, SIZES))}
                  >
                    {SIZES.map(s => (
                      <Tag key={s} id={s}>
                        {s.toUpperCase()}
                      </Tag>
                    ))}
                  </Tag.Group>

                  <Switch
                    label="In stock only"
                    selected={draftInStock}
                    onChange={setDraftInStock}
                  />
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button variant="secondary" onPress={resetDraft}>
                  Reset
                </Button>
                <Button variant="primary" slot="close" onPress={applyFilters}>
                  Apply Filters
                </Button>
              </Drawer.Actions>
            </Drawer>
          </Drawer.Trigger>
        </Inline>

        {/* Applied filters */}
        <Tag.Group
          label="Applied filters"
          onRemove={(keys: any) => removeChips(keys as Set<string>)}
          removeAll
          emptyState={() => <Text variant="muted">No filters applied</Text>}
        >
          {chips.map(chip => (
            <Tag key={chip.id} id={chip.id}>
              {chip.label}
            </Tag>
          ))}
        </Tag.Group>

        {/* Product grid / empty state */}
        {visible.length === 0 ? (
          <Stack space={4} alignX="center">
            <Headline level={3}>No products found</Headline>
            <Text variant="muted">Try adjusting your filters or search query.</Text>
            <Button
              variant="primary"
              onPress={() => {
                clearAllFilters();
                setSearchQuery('');
              }}
            >
              Clear all filters
            </Button>
          </Stack>
        ) : (
          <Stack space={8}>
            <Tiles tilesWidth="240px" space={4} stretch equalHeight>
              {visible.map(product => (
                <Card key={product.id} p={4}>
                  <Stack space={3} stretch>
                    <Inline space={3} alignY="center" alignX="between">
                      <Headline level={4}>{product.name}</Headline>
                      <Badge variant={STATUS_BADGE[product.status].variant}>
                        {STATUS_BADGE[product.status].label}
                      </Badge>
                    </Inline>
                    <Text weight="bold">${product.price.toFixed(2)}</Text>
                    <Text variant="muted">{product.description}</Text>
                    <Button
                      variant="primary"
                      disabled={product.status === 'soldout'}
                      onPress={() => setCartCount(count => count + 1)}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Tiles>

            {/* Pagination */}
            <Inline space={4} alignY="center" alignX="center">
              <Text>
                Page {currentPage} of {TOTAL_PAGES}
              </Text>
              <Pagination
                totalItems={TOTAL_PAGES}
                pageSize={1}
                page={currentPage}
                onChange={setCurrentPage}
              />
            </Inline>
          </Stack>
        )}
      </Stack>
    </div>
  );
};

export default TestApp;
