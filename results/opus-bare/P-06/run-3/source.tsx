import { useEffect, useMemo, useState } from 'react';
import {
  Headline,
  Text,
  Button,
  SearchField,
  Select,
  Checkbox,
  CheckboxGroup,
  Switch,
  Slider,
  Card,
  Stack,
  Inline,
  Divider,
} from '@marigold/components';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Status = 'new' | 'sale' | 'soldout';

interface Product {
  id: number;
  name: string;
  price: number;
  status: Status;
  description: string;
  category: string;
  sizes: string[];
  popularity: number;
  inStock: boolean;
  added: number; // higher = newer
}

const CATEGORIES = [
  { id: 'tshirts', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'posters', label: 'Posters' },
  { id: 'stickers', label: 'Stickers' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const STATUS_LABEL: Record<Status, string> = {
  new: 'New',
  sale: 'Sale',
  soldout: 'Sold Out',
};

const RAW: Array<Omit<Product, 'id' | 'added' | 'inStock'>> = [
  { name: 'Classic Logo Tee', price: 24.99, status: 'sale', description: 'Soft cotton tee with our signature embroidered logo.', category: 'tshirts', sizes: ['XS', 'S', 'M', 'L', 'XL'], popularity: 88 },
  { name: 'Vintage Hoodie', price: 59.99, status: 'new', description: 'Heavyweight fleece hoodie with a relaxed vintage wash.', category: 'hoodies', sizes: ['S', 'M', 'L', 'XL'], popularity: 95 },
  { name: 'Enamel Pin Set', price: 12.5, status: 'soldout', description: 'A set of three collectible hard-enamel pins.', category: 'accessories', sizes: [], popularity: 60 },
  { name: 'Retro Poster', price: 18.0, status: 'new', description: 'Matte A2 poster featuring our retro brand artwork.', category: 'posters', sizes: [], popularity: 40 },
  { name: 'Sticker Pack', price: 8.99, status: 'sale', description: 'Ten weatherproof vinyl stickers in assorted designs.', category: 'stickers', sizes: [], popularity: 70 },
  { name: 'Premium Zip Hoodie', price: 74.99, status: 'soldout', description: 'Brushed-interior zip hoodie with metal hardware.', category: 'hoodies', sizes: ['S', 'M', 'L', 'XL'], popularity: 80 },
  { name: 'Graphic Tee', price: 27.5, status: 'new', description: 'Bold front-print tee on combed ring-spun cotton.', category: 'tshirts', sizes: ['XS', 'S', 'M', 'L'], popularity: 65 },
  { name: 'Canvas Tote Bag', price: 15.0, status: 'sale', description: 'Sturdy organic-cotton tote with reinforced handles.', category: 'accessories', sizes: [], popularity: 55 },
  { name: 'Cuffed Beanie', price: 19.99, status: 'new', description: 'Ribbed knit beanie with a woven logo tag.', category: 'accessories', sizes: [], popularity: 50 },
  { name: 'Art Print Poster', price: 22.0, status: 'sale', description: 'Limited-run giclée art print on heavy stock.', category: 'posters', sizes: [], popularity: 45 },
  { name: 'Pocket Tee', price: 21.99, status: 'new', description: 'Everyday tee with a clean chest pocket detail.', category: 'tshirts', sizes: ['S', 'M', 'L', 'XL'], popularity: 58 },
  { name: 'Fleece Hoodie', price: 64.99, status: 'new', description: 'Cozy midweight fleece hoodie for everyday wear.', category: 'hoodies', sizes: ['M', 'L', 'XL'], popularity: 90 },
  { name: 'Holographic Stickers', price: 6.5, status: 'new', description: 'Shimmering holographic die-cut sticker sheet.', category: 'stickers', sizes: [], popularity: 62 },
  { name: 'Snapback Cap', price: 24.0, status: 'sale', description: 'Structured six-panel cap with adjustable snap.', category: 'accessories', sizes: [], popularity: 52 },
  { name: 'Long Sleeve Tee', price: 32.99, status: 'new', description: 'Lightweight long-sleeve tee with ribbed cuffs.', category: 'tshirts', sizes: ['S', 'M', 'L', 'XL'], popularity: 48 },
  { name: 'Minimal Poster', price: 16.0, status: 'new', description: 'Clean typographic poster in a muted palette.', category: 'posters', sizes: [], popularity: 38 },
  { name: 'Logo Sticker', price: 3.99, status: 'sale', description: 'Single durable logo sticker for laptops and bottles.', category: 'stickers', sizes: [], popularity: 75 },
  { name: 'Oversized Hoodie', price: 69.99, status: 'new', description: 'Drop-shoulder oversized hoodie in premium fleece.', category: 'hoodies', sizes: ['XS', 'S', 'M', 'L', 'XL'], popularity: 85 },
  { name: 'Striped Tee', price: 26.99, status: 'sale', description: 'Yarn-dyed striped tee with a soft hand feel.', category: 'tshirts', sizes: ['XS', 'S', 'M'], popularity: 44 },
  { name: 'Ceramic Mug', price: 13.99, status: 'new', description: 'Glazed 12oz ceramic mug with wrap-around print.', category: 'accessories', sizes: [], popularity: 53 },
  { name: 'Tour Poster', price: 20.0, status: 'new', description: 'Collectible tour poster with foil accents.', category: 'posters', sizes: [], popularity: 41 },
  { name: 'Die-Cut Stickers', price: 9.5, status: 'new', description: 'Precision die-cut stickers in five shapes.', category: 'stickers', sizes: [], popularity: 57 },
  { name: 'Cropped Hoodie', price: 54.99, status: 'sale', description: 'Cropped-fit hoodie with a kangaroo pocket.', category: 'hoodies', sizes: ['XS', 'S', 'M', 'L'], popularity: 72 },
  { name: 'Performance Tee', price: 34.99, status: 'new', description: 'Moisture-wicking athletic tee for active days.', category: 'tshirts', sizes: ['S', 'M', 'L', 'XL'], popularity: 49 },
];

const PRODUCTS: Product[] = RAW.map((p, i) => ({
  ...p,
  id: i,
  added: RAW.length - i, // first item is newest
  inStock: p.status !== 'soldout',
}));

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const PAGE_SIZE = 8;
const MAX_PRICE = 100;

const formatPrice = (n: number) => `$${n.toFixed(2)}`;
const catLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);

  const priceActive = maxPrice < MAX_PRICE;

  /* ---- filtering + sorting ---- */
  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query)) return false;
      if (categories.length && !categories.includes(p.category)) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (priceActive && p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    const sorted = [...filtered];
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
  }, [search, sort, categories, sizes, maxPrice, priceActive, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const effPage = Math.min(page, totalPages);

  /* reset to first page whenever the result set changes */
  useEffect(() => {
    setPage(1);
  }, [search, sort, categories.join('|'), sizes.join('|'), maxPrice, inStockOnly]);

  const pageItems = results.slice(
    (effPage - 1) * PAGE_SIZE,
    effPage * PAGE_SIZE
  );

  /* ---- filter mutators ---- */
  const resetFilters = () => {
    setCategories([]);
    setSizes([]);
    setMaxPrice(MAX_PRICE);
    setInStockOnly(false);
  };

  const clearAll = () => {
    resetFilters();
    setSearch('');
  };

  /* ---- active filter chips ---- */
  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (search.trim())
    chips.push({
      key: 'search',
      label: `Search: “${search.trim()}”`,
      onRemove: () => setSearch(''),
    });
  categories.forEach((c) =>
    chips.push({
      key: `cat-${c}`,
      label: catLabel(c),
      onRemove: () => setCategories((arr) => arr.filter((x) => x !== c)),
    })
  );
  sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `Size: ${s}`,
      onRemove: () => setSizes((arr) => arr.filter((x) => x !== s)),
    })
  );
  if (priceActive)
    chips.push({
      key: 'price',
      label: `Up to ${formatPrice(maxPrice)}`,
      onRemove: () => setMaxPrice(MAX_PRICE),
    });
  if (inStockOnly)
    chips.push({
      key: 'stock',
      label: 'In stock only',
      onRemove: () => setInStockOnly(false),
    });

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <Stack space={6} style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <Stack space={1}>
        <Inline
          space={4}
          alignY="center"
          style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
        >
          <Headline level="1">Merchandise Store</Headline>
          <Text>{`Cart: ${cart} item${cart === 1 ? '' : 's'}`}</Text>
        </Inline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      <Divider />

      {/* Toolbar */}
      <Inline
        space={4}
        alignY="bottom"
        style={{ flexWrap: 'wrap', alignItems: 'flex-end' }}
      >
        <Stack space={0} style={{ flex: '1 1 240px', minWidth: 200 }}>
          <SearchField
            label="Search"
            placeholder="Search products by name…"
            value={search}
            onChange={setSearch}
          />
        </Stack>
        <Stack space={0} style={{ flex: '0 1 220px', minWidth: 180 }}>
          <Select
            label="Sort by"
            selectedKey={sort}
            onSelectionChange={(key) => setSort(String(key))}
          >
            {SORT_OPTIONS.map((o) => (
              <Select.Option key={o.id} id={o.id}>
                {o.label}
              </Select.Option>
            ))}
          </Select>
        </Stack>
        <Button variant="secondary" onPress={() => setPanelOpen(true)}>
          Filters
        </Button>
      </Inline>

      {/* Applied filters */}
      <Inline space={2} alignY="center" style={{ flexWrap: 'wrap' }}>
        {chips.length === 0 ? (
          <Text>No filters applied</Text>
        ) : (
          <>
            {chips.map((chip) => (
              <Button
                key={chip.key}
                size="small"
                variant="secondary"
                onPress={chip.onRemove}
              >
                {`${chip.label}  ✕`}
              </Button>
            ))}
            <Button size="small" variant="text" onPress={clearAll}>
              Clear all
            </Button>
          </>
        )}
      </Inline>

      {/* Grid or empty state */}
      {results.length === 0 ? (
        <Stack
          space={3}
          alignX="center"
          style={{ textAlign: 'center', padding: '48px 16px' }}
        >
          <Headline level="3">No products found</Headline>
          <Text>Try adjusting your filters or search query.</Text>
          <Button variant="primary" onPress={clearAll}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Stack
          space={0}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {pageItems.map((p) => {
            const soldOut = p.status === 'soldout';
            return (
              <Card key={p.id}>
                <Stack space={3} style={{ height: '100%' }}>
                  <Inline
                    space={2}
                    alignY="center"
                    style={{ justifyContent: 'space-between' }}
                  >
                    <Headline level="4">{p.name}</Headline>
                    <Text>{STATUS_LABEL[p.status]}</Text>
                  </Inline>
                  <Headline level="5">{formatPrice(p.price)}</Headline>
                  <Text>{p.description}</Text>
                  <Button
                    variant="primary"
                    disabled={soldOut}
                    onPress={() => setCart((c) => c + 1)}
                  >
                    {soldOut ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Pagination */}
      {results.length > 0 && (
        <Inline space={3} alignY="center" style={{ justifyContent: 'center' }}>
          <Button
            variant="secondary"
            disabled={effPage <= 1}
            onPress={() => setPage((pg) => Math.max(1, pg - 1))}
          >
            Previous
          </Button>
          <Text>{`Page ${effPage} of ${totalPages}`}</Text>
          <Button
            variant="secondary"
            disabled={effPage >= totalPages}
            onPress={() => setPage((pg) => Math.min(totalPages, pg + 1))}
          >
            Next
          </Button>
        </Inline>
      )}

      {/* Filter panel — slides in from the right edge */}
      {panelOpen && (
        <>
          <Stack
            space={0}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 1000,
            }}
          />
          <Stack
            space={5}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 'min(380px, 90vw)',
              background: '#ffffff',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.15)',
              zIndex: 1001,
              overflowY: 'auto',
              padding: 24,
            }}
          >
            <Inline
              space={2}
              alignY="center"
              style={{ justifyContent: 'space-between' }}
            >
              <Headline level="3">Filters</Headline>
              <Button
                size="small"
                variant="text"
                onPress={() => setPanelOpen(false)}
              >
                Close
              </Button>
            </Inline>

            <CheckboxGroup
              label="Category"
              value={categories}
              onChange={setCategories}
            >
              {CATEGORIES.map((c) => (
                <Checkbox key={c.id} value={c.id}>
                  {c.label}
                </Checkbox>
              ))}
            </CheckboxGroup>

            <Divider />

            <Slider
              label="Price range"
              minValue={0}
              maxValue={MAX_PRICE}
              step={1}
              value={maxPrice}
              onChange={(v) => setMaxPrice(Array.isArray(v) ? v[0] : v)}
              formatOptions={{ style: 'currency', currency: 'USD' }}
            />

            <Divider />

            <CheckboxGroup label="Size" value={sizes} onChange={setSizes}>
              {SIZES.map((s) => (
                <Checkbox key={s} value={s}>
                  {s}
                </Checkbox>
              ))}
            </CheckboxGroup>

            <Divider />

            <Switch checked={inStockOnly} onChange={setInStockOnly}>
              In stock only
            </Switch>

            <Divider />

            <Inline space={2}>
              <Button variant="primary" onPress={() => setPanelOpen(false)}>
                Apply Filters
              </Button>
              <Button variant="secondary" onPress={resetFilters}>
                Reset
              </Button>
            </Inline>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default TestApp;
