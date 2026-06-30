import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
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
  price: number;
  status: Status;
  description: string;
  category: string;
  sizes: string[];
  popularity: number;
  added: number;
}

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const PRICE_MIN = 0;
const PRICE_MAX = 100;
const PAGE_SIZE = 4;

const PRODUCTS: Product[] = [
  {
    id: 'classic-tee',
    name: 'Classic Logo T-Shirt',
    price: 24.99,
    status: 'new',
    description: 'Soft cotton tee with our embroidered brand logo on the chest.',
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    popularity: 80,
    added: 8,
  },
  {
    id: 'premium-hoodie',
    name: 'Pullover Hoodie',
    price: 59.99,
    status: 'sale',
    description: 'Heavyweight fleece hoodie with a roomy front pocket and hood.',
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 95,
    added: 7,
  },
  {
    id: 'enamel-pins',
    name: 'Enamel Pin Set',
    price: 9.99,
    status: 'new',
    description: 'A set of five collectible enamel pins in assorted designs.',
    category: 'Accessories',
    sizes: [],
    popularity: 60,
    added: 6,
  },
  {
    id: 'retro-poster',
    name: 'Retro Tour Poster',
    price: 14.99,
    status: 'sale',
    description: 'A3 matte poster featuring our limited retro tour artwork.',
    category: 'Posters',
    sizes: [],
    popularity: 40,
    added: 5,
  },
  {
    id: 'sticker-pack',
    name: 'Vinyl Sticker Pack',
    price: 4.99,
    status: 'new',
    description: 'Twelve weatherproof vinyl stickers perfect for laptops.',
    category: 'Stickers',
    sizes: [],
    popularity: 70,
    added: 4,
  },
  {
    id: 'embroidered-cap',
    name: 'Embroidered Cap',
    price: 19.99,
    status: 'soldout',
    description: 'Adjustable six-panel cap with a clean embroidered wordmark.',
    category: 'Accessories',
    sizes: [],
    popularity: 55,
    added: 3,
  },
  {
    id: 'vintage-tee',
    name: 'Vintage Wash Tee',
    price: 29.99,
    status: 'new',
    description: 'Garment-dyed tee with a lived-in vintage wash finish.',
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L'],
    popularity: 88,
    added: 2,
  },
  {
    id: 'limited-hoodie',
    name: 'Limited Hoodie',
    price: 74.99,
    status: 'soldout',
    description: 'Numbered drop hoodie with a tonal back print, very limited run.',
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    popularity: 99,
    added: 1,
  },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const STATUS_META: Record<
  Status,
  { label: string; variant: 'info' | 'warning' | 'error' }
> = {
  new: { label: 'New', variant: 'info' },
  sale: { label: 'Sale', variant: 'warning' },
  soldout: { label: 'Sold Out', variant: 'error' },
};

const toArray = (keys: 'all' | Set<React.Key>, all: string[]) =>
  keys === 'all' ? all : [...keys].map(String);

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [price, setPrice] = useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);

  const resetPage = () => setPage(1);

  const priceActive = price[0] > PRICE_MIN || price[1] < PRICE_MAX;
  const hasFilters =
    categories.length > 0 || sizes.length > 0 || priceActive || inStock;

  const clearFilters = () => {
    setCategories([]);
    setSizes([]);
    setPrice([PRICE_MIN, PRICE_MAX]);
    setInStock(false);
    resetPage();
  };

  const resetAll = () => {
    clearFilters();
    setSearch('');
  };

  // Build the list of active filter chips.
  const chips: { id: string; label: string }[] = [];
  categories.forEach(c => chips.push({ id: `cat:${c}`, label: `Category: ${c}` }));
  sizes.forEach(s => chips.push({ id: `size:${s}`, label: `Size: ${s}` }));
  if (priceActive) {
    chips.push({ id: 'price', label: `Price: $${price[0]} – $${price[1]}` });
  }
  if (inStock) {
    chips.push({ id: 'stock', label: 'In stock only' });
  }

  const removeChips = (keys: Set<React.Key>) => {
    keys.forEach(raw => {
      const key = String(raw);
      if (key === 'price') {
        setPrice([PRICE_MIN, PRICE_MAX]);
      } else if (key === 'stock') {
        setInStock(false);
      } else if (key.startsWith('cat:')) {
        const value = key.slice(4);
        setCategories(prev => prev.filter(c => c !== value));
      } else if (key.startsWith('size:')) {
        const value = key.slice(5);
        setSizes(prev => prev.filter(s => s !== value));
      }
    });
    resetPage();
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = PRODUCTS.filter(product => {
      if (query && !product.name.toLowerCase().includes(query)) return false;
      if (categories.length > 0 && !categories.includes(product.category))
        return false;
      if (
        sizes.length > 0 &&
        !product.sizes.some(size => sizes.includes(size))
      )
        return false;
      if (product.price < price[0] || product.price > price[1]) return false;
      if (inStock && product.status === 'soldout') return false;
      return true;
    });

    const sorted = [...result];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        sorted.sort((a, b) => b.added - a.added);
    }
    return sorted;
  }, [search, sort, categories, sizes, price, inStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <Stack space={6}>
      {/* Header */}
      <Stack space={1}>
        <Headline level={1}>Merchandise Store</Headline>
        <Text variant="muted">
          Browse our collection of branded merchandise.
        </Text>
      </Stack>

      {/* Toolbar */}
      <Inline space={4} alignY="end">
        <SearchField
          label="Search"
          aria-label="Search products by name"
          placeholder="Search products…"
          value={search}
          onChange={value => {
            setSearch(value);
            resetPage();
          }}
          width={72}
        />
        <Select
          label="Sort by"
          selectedKey={sort}
          onSelectionChange={key => {
            setSort(String(key));
            resetPage();
          }}
          width={56}
        >
          {SORT_OPTIONS.map(option => (
            <Select.Option key={option.id} id={option.id}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
        <Split />
        <Drawer.Trigger>
          <Button variant="secondary">Filters</Button>
          <Drawer>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                <Tag.Group
                  label="Category"
                  selectionMode="multiple"
                  selectedKeys={categories}
                  onSelectionChange={keys => {
                    setCategories(toArray(keys, CATEGORIES));
                    resetPage();
                  }}
                >
                  {CATEGORIES.map(category => (
                    <Tag key={category} id={category}>
                      {category}
                    </Tag>
                  ))}
                </Tag.Group>

                <Slider
                  label="Price range"
                  minValue={PRICE_MIN}
                  maxValue={PRICE_MAX}
                  step={5}
                  value={price}
                  onChange={value => {
                    setPrice(value as number[]);
                    resetPage();
                  }}
                  thumbLabels={['Minimum price', 'Maximum price']}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />

                <Tag.Group
                  label="Size"
                  selectionMode="multiple"
                  selectedKeys={sizes}
                  onSelectionChange={keys => {
                    setSizes(toArray(keys, SIZES));
                    resetPage();
                  }}
                >
                  {SIZES.map(size => (
                    <Tag key={size} id={size}>
                      {size}
                    </Tag>
                  ))}
                </Tag.Group>

                <Switch
                  label="In stock only"
                  selected={inStock}
                  onChange={value => {
                    setInStock(value);
                    resetPage();
                  }}
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button onPress={clearFilters}>Reset</Button>
              <Button slot="close" variant="primary" onPress={resetPage}>
                Apply Filters
              </Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
        <Text>Cart: {cart}</Text>
      </Inline>

      {/* Applied filters */}
      {hasFilters ? (
        <Inline space={3} alignY="center">
          <Tag.Group label="Applied filters" onRemove={removeChips}>
            {chips.map(chip => (
              <Tag key={chip.id} id={chip.id}>
                {chip.label}
              </Tag>
            ))}
          </Tag.Group>
          <Button variant="secondary" onPress={clearFilters}>
            Clear all
          </Button>
        </Inline>
      ) : (
        <Text variant="muted">No filters applied</Text>
      )}

      {/* Product grid or empty state */}
      {pageItems.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={
            <Button variant="primary" onPress={resetAll}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <Tiles tilesWidth="280px" space={4} stretch equalHeight>
          {pageItems.map(product => {
            const status = STATUS_META[product.status];
            const soldOut = product.status === 'soldout';
            return (
              <Card key={product.id} p={4} stretch>
                <Stack space={3} height="100%">
                  <Inline space={2} alignX="between" alignY="top" noWrap>
                    <Headline level={4}>{product.name}</Headline>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </Inline>
                  <Text weight="bold" fontSize="lg">
                    ${product.price.toFixed(2)}
                  </Text>
                  <Text variant="muted" fontSize="sm">
                    {product.description}
                  </Text>
                  <Split />
                  <Button
                    variant="primary"
                    disabled={soldOut}
                    onPress={() => setCart(count => count + 1)}
                  >
                    {soldOut ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </Tiles>
      )}

      {/* Pagination */}
      <Inline space={4} alignY="center">
        <Text fontSize="sm">
          Page {currentPage} of {totalPages}
        </Text>
        <Split />
        <Pagination
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          page={currentPage}
          onChange={setPage}
        />
      </Inline>
    </Stack>
  );
};

export default TestApp;
