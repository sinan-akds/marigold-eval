import { useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
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
  category: string;
  price: number;
  status: Status;
  popularity: number;
  added: number; // lower = newer
  sizes: string[];
  description: string;
}

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const APPAREL = ['T-Shirts', 'Hoodies'];
const PAGE_SIZE = 8;
const PRICE_MIN = 0;
const PRICE_MAX = 100;

const PRODUCT_DEFS: Array<{
  name: string;
  category: string;
  price: number;
  status: Status;
  popularity: number;
  description: string;
}> = [
  { name: 'Classic Logo Tee', category: 'T-Shirts', price: 24.99, status: 'New', popularity: 95, description: 'Soft combed-cotton tee featuring the embroidered house logo.' },
  { name: 'Vintage Wash Hoodie', category: 'Hoodies', price: 59.99, status: 'Sale', popularity: 88, description: 'Heavyweight fleece hoodie with a lived-in vintage wash.' },
  { name: 'Enamel Pin Set', category: 'Accessories', price: 14.99, status: 'Sold Out', popularity: 70, description: 'Collectible set of three hard-enamel pins with rubber backs.' },
  { name: 'Tour Poster A2', category: 'Posters', price: 19.99, status: 'New', popularity: 64, description: 'Limited-run screen-printed poster on heavy matte stock.' },
  { name: 'Holographic Sticker Pack', category: 'Stickers', price: 6.99, status: 'Sale', popularity: 52, description: 'Pack of ten weatherproof holographic die-cut stickers.' },
  { name: 'Oversized Graphic Tee', category: 'T-Shirts', price: 29.99, status: 'Sold Out', popularity: 81, description: 'Relaxed boxy fit tee with an oversized back graphic.' },
  { name: 'Zip-Up Tech Hoodie', category: 'Hoodies', price: 74.99, status: 'New', popularity: 77, description: 'Lightweight zip hoodie in a moisture-wicking tech knit.' },
  { name: 'Canvas Tote Bag', category: 'Accessories', price: 18.0, status: 'Sale', popularity: 60, description: 'Sturdy organic-canvas tote with reinforced shoulder straps.' },
  { name: 'Album Art Poster', category: 'Posters', price: 22.5, status: 'New', popularity: 45, description: 'Gallery-grade print of the anniversary album artwork.' },
  { name: 'Mini Sticker Sheet', category: 'Stickers', price: 4.5, status: 'New', popularity: 38, description: 'Single sheet of twelve glossy mini logo stickers.' },
  { name: 'Pocket Detail Tee', category: 'T-Shirts', price: 27.0, status: 'Sale', popularity: 72, description: 'Fitted tee with a contrast chest pocket and tonal stitching.' },
  { name: 'Sherpa Lined Hoodie', category: 'Hoodies', price: 89.99, status: 'New', popularity: 84, description: 'Cozy sherpa-lined pullover built for cold-weather wear.' },
  { name: 'Embroidered Cap', category: 'Accessories', price: 26.0, status: 'Sale', popularity: 66, description: 'Six-panel cap with a low-profile embroidered crest.' },
  { name: 'Minimal Line Poster', category: 'Posters', price: 16.0, status: 'Sale', popularity: 40, description: 'Single-color minimalist line-art poster for any wall.' },
  { name: 'Die-Cut Logo Sticker', category: 'Stickers', price: 3.0, status: 'New', popularity: 33, description: 'Durable vinyl die-cut sticker of the primary wordmark.' },
  { name: 'Heavyweight Crew Tee', category: 'T-Shirts', price: 32.0, status: 'New', popularity: 79, description: 'Premium heavyweight crew tee with a structured collar.' },
  { name: 'Cropped Fleece Hoodie', category: 'Hoodies', price: 54.0, status: 'Sale', popularity: 69, description: 'Cropped brushed-fleece hoodie with a relaxed silhouette.' },
  { name: 'Knit Beanie', category: 'Accessories', price: 21.0, status: 'New', popularity: 58, description: 'Ribbed knit beanie with a woven fold-up label.' },
  { name: 'Photo Print Poster', category: 'Posters', price: 24.0, status: 'New', popularity: 42, description: 'Archival photographic print from the studio sessions.' },
  { name: 'Glow Sticker Bundle', category: 'Stickers', price: 8.5, status: 'Sale', popularity: 36, description: 'Bundle of glow-in-the-dark stickers for night-time flair.' },
  { name: 'Long Sleeve Tee', category: 'T-Shirts', price: 34.0, status: 'New', popularity: 74, description: 'Midweight long-sleeve tee with ribbed cuffs.' },
  { name: 'Quarter-Zip Hoodie', category: 'Hoodies', price: 64.0, status: 'New', popularity: 71, description: 'Streamlined quarter-zip with a stand-up funnel collar.' },
  { name: 'Lanyard & Keychain', category: 'Accessories', price: 9.99, status: 'Sale', popularity: 49, description: 'Woven lanyard paired with a metal logo keychain.' },
  { name: 'Grid Layout Poster', category: 'Posters', price: 17.5, status: 'New', popularity: 30, description: 'Typographic grid poster printed on uncoated stock.' },
];

const PRODUCTS: Product[] = PRODUCT_DEFS.map((p, i) => ({
  ...p,
  id: `product-${i + 1}`,
  added: i,
  sizes: APPAREL.includes(p.category) ? SIZES : [],
}));

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const statusVariant = (status: Status) =>
  status === 'New' ? 'info' : status === 'Sale' ? 'warning' : 'error';

const formatPrice = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);

  const priceActive = priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX;
  const activeFilterCount =
    categories.length + sizes.length + (priceActive ? 1 : 0) + (inStockOnly ? 1 : 0);

  const clearAllFilters = () => {
    setCategories([]);
    setSizes([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setInStockOnly(false);
  };

  // Active filter chips derived from the applied filter state.
  const chips = useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];
    categories.forEach(c => items.push({ id: `cat:${c}`, label: `Category: ${c}` }));
    sizes.forEach(s => items.push({ id: `size:${s}`, label: `Size: ${s}` }));
    if (priceActive) {
      items.push({
        id: 'price',
        label: `Price: ${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`,
      });
    }
    if (inStockOnly) {
      items.push({ id: 'stock', label: 'In stock only' });
    }
    return items;
  }, [categories, sizes, priceActive, priceRange, inStockOnly]);

  const removeChip = (keys: Set<Key>) => {
    keys.forEach(key => {
      const id = String(key);
      if (id.startsWith('cat:')) {
        const value = id.slice(4);
        setCategories(prev => prev.filter(c => c !== value));
      } else if (id.startsWith('size:')) {
        const value = id.slice(5);
        setSizes(prev => prev.filter(s => s !== value));
      } else if (id === 'price') {
        setPriceRange([PRICE_MIN, PRICE_MAX]);
      } else if (id === 'stock') {
        setInStockOnly(false);
      }
    });
  };

  // Filter + sort the catalog.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = PRODUCTS.filter(product => {
      if (query && !product.name.toLowerCase().includes(query)) return false;
      if (categories.length && !categories.includes(product.category)) return false;
      if (sizes.length && !product.sizes.some(s => sizes.includes(s))) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (inStockOnly && product.status === 'Sold Out') return false;
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
        sorted.sort((a, b) => a.added - b.added);
    }
    return sorted;
  }, [search, categories, sizes, priceRange, inStockOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [search, categories, sizes, priceRange, inStockOnly, sort]);

  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const hasResults = filtered.length > 0;

  return (
    <Stack space={8}>
      {/* Header */}
      <Inline space={4} alignX="between" alignY="center">
        <Stack space={2}>
          <Headline level="1">Merchandise Store</Headline>
          <Text color="text-base-muted">
            Browse our collection of branded merchandise.
          </Text>
        </Stack>
        <Badge variant="primary">Cart: {cart}</Badge>
      </Inline>

      {/* Toolbar */}
      <Inline space={4} alignY="bottom">
        <SearchField
          label="Search products"
          placeholder="Search by name"
          value={search}
          onChange={setSearch}
          width={64}
        />
          <Select
            label="Sort by"
            selectedKey={sort}
            onSelectionChange={key => setSort(String(key))}
            width="fit"
          >
            {SORT_OPTIONS.map(option => (
              <Select.Option key={option.id} id={option.id}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
          <Drawer.Trigger>
            <Button variant="secondary">
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Button>
            <Drawer closeButton>
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Content>
                <Stack space={8}>
                  <Checkbox.Group
                    label="Category"
                    value={categories}
                    onChange={setCategories}
                  >
                    {CATEGORIES.map(category => (
                      <Checkbox key={category} value={category} label={category} />
                    ))}
                  </Checkbox.Group>

                  <Slider
                    label="Price range"
                    value={priceRange}
                    onChange={value =>
                      setPriceRange(Array.isArray(value) ? value : [value, value])
                    }
                    minValue={PRICE_MIN}
                    maxValue={PRICE_MAX}
                    step={5}
                    thumbLabels={['Minimum', 'Maximum']}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                    width="full"
                  />

                  <Checkbox.Group label="Size" value={sizes} onChange={setSizes}>
                    {SIZES.map(size => (
                      <Checkbox key={size} value={size} label={size} />
                    ))}
                  </Checkbox.Group>

                  <Switch
                    label="In stock only"
                    selected={inStockOnly}
                    onChange={setInStockOnly}
                  />
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button variant="secondary" onPress={clearAllFilters}>
                  Reset
                </Button>
                <Button variant="primary" slot="close">
                  Apply Filters
                </Button>
              </Drawer.Actions>
            </Drawer>
          </Drawer.Trigger>
      </Inline>

      {/* Applied filters */}
      <Inline space={4} alignY="center">
        <Tag.Group
          label="Applied filters"
          onRemove={removeChip}
          emptyState={() => (
            <Text color="text-base-muted" fontStyle="italic">
              No filters applied
            </Text>
          )}
        >
          {chips.map(chip => (
            <Tag key={chip.id} id={chip.id}>
              {chip.label}
            </Tag>
          ))}
        </Tag.Group>
        {activeFilterCount > 0 ? (
          <Button variant="link" onPress={clearAllFilters}>
            Clear all
          </Button>
        ) : null}
      </Inline>

      {/* Product grid or empty state */}
      {hasResults ? (
        <Tiles tilesWidth="280px" space={4} stretch equalHeight>
          {pageItems.map(product => {
            const soldOut = product.status === 'Sold Out';
            return (
              <Card key={product.id} p={4}>
                <Stack space={3} alignX="left">
                  <Badge variant={statusVariant(product.status)}>
                    {product.status}
                  </Badge>
                  <Headline level="2" size="level-4">
                    {product.name}
                  </Headline>
                  <Text weight="bold">{formatPrice(product.price)}</Text>
                  <Text color="text-base-muted">{product.description}</Text>
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={soldOut}
                    onPress={() => setCart(count => count + 1)}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </Tiles>
      ) : (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={
            <Button
              variant="primary"
              onPress={() => {
                setSearch('');
                clearAllFilters();
              }}
            >
              Clear all filters
            </Button>
          }
        />
      )}

      {/* Pagination */}
      {hasResults ? (
        <Inline space={4} alignX="center" alignY="center">
          <Button
            variant="secondary"
            disabled={currentPage <= 1}
            onPress={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            variant="secondary"
            disabled={currentPage >= totalPages}
            onPress={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </Inline>
      ) : null}
    </Stack>
  );
};

export default TestApp;
