import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Stack,
  Inline,
  Headline,
  Text,
  Button,
  Card,
  Badge,
  SearchField,
  Select,
  Slider,
  Switch,
  Checkbox,
  CheckboxGroup,
  Dialog,
} from '@marigold/components';

type Status = 'New' | 'Sale' | 'Sold Out';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sizes: string[];
  description: string;
  status: Status;
  popularity: number;
  createdAt: number;
}

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const PAGE_SIZE = 8;

const DEFAULT_FILTERS = {
  categories: [] as string[],
  sizes: [] as string[],
  maxPrice: 100,
  inStock: false,
};

type Filters = typeof DEFAULT_FILTERS;

// 24 products → 3 pages of 8. The first page (default "Newest" sort) has
// exactly two sold-out products, as required.
const RAW_PRODUCTS: Omit<Product, 'id' | 'popularity' | 'createdAt'>[] = [
  { name: 'Classic Logo Tee', category: 'T-Shirts', price: 24.99, sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'Soft cotton tee with our signature embroidered logo.', status: 'New' },
  { name: 'Vintage Wash Tee', category: 'T-Shirts', price: 29.99, sizes: ['S', 'M', 'L', 'XL'], description: 'Garment-dyed for a lived-in vintage feel.', status: 'Sale' },
  { name: 'Pullover Hoodie', category: 'Hoodies', price: 54.99, sizes: ['S', 'M', 'L', 'XL'], description: 'Cozy fleece pullover with a roomy front pocket.', status: 'New' },
  { name: 'Enamel Pin Set', category: 'Accessories', price: 12.5, sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'Set of three hard-enamel pins for your jacket or bag.', status: 'Sold Out' },
  { name: 'Tour Poster', category: 'Posters', price: 18.0, sizes: ['M', 'L'], description: '18x24 matte print commemorating the world tour.', status: 'New' },
  { name: 'Holographic Sticker', category: 'Stickers', price: 4.99, sizes: ['XS', 'S'], description: 'Rainbow holographic die-cut vinyl sticker.', status: 'Sale' },
  { name: 'Zip-Up Hoodie', category: 'Hoodies', price: 59.99, sizes: ['M', 'L', 'XL'], description: 'Full-zip hoodie in heavyweight brushed fleece.', status: 'Sold Out' },
  { name: 'Snapback Cap', category: 'Accessories', price: 22.0, sizes: ['S', 'M', 'L'], description: 'Adjustable snapback with an embroidered front panel.', status: 'New' },
  { name: 'Graphic Print Tee', category: 'T-Shirts', price: 27.5, sizes: ['XS', 'S', 'M', 'L'], description: 'Bold front graphic on a breathable cotton blend.', status: 'New' },
  { name: 'Canvas Tote Bag', category: 'Accessories', price: 16.0, sizes: ['M', 'L', 'XL'], description: 'Sturdy cotton canvas tote for everyday hauling.', status: 'Sale' },
  { name: 'Art Print Poster', category: 'Posters', price: 25.0, sizes: ['L', 'XL'], description: 'Limited gallery-quality giclée art print.', status: 'New' },
  { name: 'Sticker Pack', category: 'Stickers', price: 7.99, sizes: ['XS', 'S', 'M'], description: 'Pack of ten assorted weatherproof stickers.', status: 'New' },
  { name: 'Fleece Hoodie', category: 'Hoodies', price: 49.99, sizes: ['S', 'M', 'L'], description: 'Midweight fleece hoodie for everyday layering.', status: 'Sale' },
  { name: 'Premium Cotton Tee', category: 'T-Shirts', price: 32.0, sizes: ['S', 'M', 'L', 'XL'], description: 'Pima cotton tee with a buttery-smooth finish.', status: 'New' },
  { name: 'Coffee Mug', category: 'Accessories', price: 14.0, sizes: ['M'], description: '11oz ceramic mug with a wraparound print.', status: 'Sold Out' },
  { name: 'Limited Edition Poster', category: 'Posters', price: 40.0, sizes: ['XL'], description: 'Numbered limited-edition screen print.', status: 'New' },
  { name: 'Die-Cut Sticker Set', category: 'Stickers', price: 9.5, sizes: ['XS', 'S'], description: 'Four die-cut stickers with a glossy laminate.', status: 'Sale' },
  { name: 'Oversized Tee', category: 'T-Shirts', price: 34.99, sizes: ['M', 'L', 'XL'], description: 'Relaxed oversized fit in heavyweight jersey.', status: 'New' },
  { name: 'Cropped Hoodie', category: 'Hoodies', price: 47.0, sizes: ['XS', 'S', 'M'], description: 'Cropped-cut hoodie with a ribbed hem.', status: 'New' },
  { name: 'Water Bottle', category: 'Accessories', price: 19.99, sizes: ['L', 'XL'], description: 'Insulated stainless steel bottle, 750ml.', status: 'Sale' },
  { name: 'Vintage Tour Poster', category: 'Posters', price: 21.0, sizes: ['M', 'L'], description: 'Reprint of the classic vintage tour artwork.', status: 'New' },
  { name: 'Mini Sticker Pack', category: 'Stickers', price: 3.5, sizes: ['XS'], description: 'Five mini stickers perfect for laptops.', status: 'Sold Out' },
  { name: 'Heavyweight Tee', category: 'T-Shirts', price: 36.0, sizes: ['S', 'M', 'L', 'XL'], description: 'Structured heavyweight tee that keeps its shape.', status: 'New' },
  { name: 'Knit Beanie', category: 'Accessories', price: 17.5, sizes: ['S', 'M', 'L'], description: 'Ribbed knit beanie with a fold-over cuff.', status: 'New' },
];

const PRODUCTS: Product[] = RAW_PRODUCTS.map((p, i) => ({
  ...p,
  id: i + 1,
  // Higher createdAt = newer, so "Newest" keeps the definition order on page 1.
  createdAt: RAW_PRODUCTS.length - i,
  popularity: ((i * 17 + 11) % 50) + 10,
}));

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Applied filters drive the grid; draft filters live inside the panel until
  // the user presses "Apply Filters".
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query)) return false;
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.inStock && p.status === 'Sold Out') return false;
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popular':
          return b.popularity - a.popularity;
        case 'newest':
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [search, filters, sort]);

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [search, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const current = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Build the active-filter chips.
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (search.trim()) {
    chips.push({ key: 'search', label: `Search: "${search.trim()}"`, clear: () => setSearch('') });
  }
  filters.categories.forEach((c) =>
    chips.push({
      key: `cat-${c}`,
      label: c,
      clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
    }),
  );
  filters.sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `Size: ${s}`,
      clear: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })),
    }),
  );
  if (filters.maxPrice < 100) {
    chips.push({
      key: 'price',
      label: `Up to ${formatPrice(filters.maxPrice)}`,
      clear: () => setFilters((f) => ({ ...f, maxPrice: 100 })),
    });
  }
  if (filters.inStock) {
    chips.push({ key: 'stock', label: 'In stock only', clear: () => setFilters((f) => ({ ...f, inStock: false })) });
  }

  const clearAll = () => {
    setSearch('');
    setFilters(DEFAULT_FILTERS);
  };

  const statusVariant = (status: Status) =>
    status === 'Sold Out' ? 'error' : status === 'Sale' ? 'warning' : 'success';

  return (
    <Box css={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <Stack space={8}>
        {/* Header */}
        <Inline space={4} alignY="center" alignX="space-between">
          <Stack space={2}>
            <Headline level={1}>Merchandise Store</Headline>
            <Text>Browse our collection of branded merchandise.</Text>
          </Stack>
          <Badge>{`Cart: ${cart}`}</Badge>
        </Inline>

        {/* Toolbar */}
        <Inline space={4} alignY="bottom">
          <Box css={{ flex: 1, minWidth: '220px' }}>
            <SearchField label="Search" placeholder="Search products by name" value={search} onChange={setSearch} />
          </Box>
          <Box css={{ minWidth: '200px' }}>
            <Select
              label="Sort by"
              selectedKey={sort}
              onSelectionChange={(key) => setSort(String(key))}
            >
              {SORT_OPTIONS.map((opt) => (
                <Select.Option key={opt.id} id={opt.id}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </Box>
          <Dialog.Trigger
            isOpen={isFilterOpen}
            onOpenChange={(open) => {
              if (open) setDraft(filters);
              setFilterOpen(open);
            }}
          >
            <Button variant="secondary">Filters</Button>
            <Dialog closeButton aria-label="Filter products">
              <Stack space={6}>
                <Headline level={3}>Filters</Headline>

                <CheckboxGroup
                  label="Category"
                  value={draft.categories}
                  onChange={(value) => setDraft((d) => ({ ...d, categories: value }))}
                >
                  {CATEGORIES.map((c) => (
                    <Checkbox key={c} value={c}>
                      {c}
                    </Checkbox>
                  ))}
                </CheckboxGroup>

                <Slider
                  label="Price range"
                  minValue={0}
                  maxValue={100}
                  step={1}
                  value={draft.maxPrice}
                  onChange={(value) => setDraft((d) => ({ ...d, maxPrice: Number(value) }))}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />

                <CheckboxGroup
                  label="Size"
                  value={draft.sizes}
                  onChange={(value) => setDraft((d) => ({ ...d, sizes: value }))}
                >
                  {SIZES.map((s) => (
                    <Checkbox key={s} value={s}>
                      {s}
                    </Checkbox>
                  ))}
                </CheckboxGroup>

                <Switch
                  isSelected={draft.inStock}
                  onChange={(value) => setDraft((d) => ({ ...d, inStock: value }))}
                >
                  In stock only
                </Switch>

                <Inline space={3}>
                  <Button
                    variant="primary"
                    onPress={() => {
                      setFilters(draft);
                      setFilterOpen(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button variant="secondary" onPress={() => setDraft(DEFAULT_FILTERS)}>
                    Reset
                  </Button>
                </Inline>
              </Stack>
            </Dialog>
          </Dialog.Trigger>
        </Inline>

        {/* Applied filters */}
        <Inline space={2} alignY="center">
          {chips.length === 0 ? (
            <Text css={{ color: '#6b7280' }}>No filters applied</Text>
          ) : (
            <>
              {chips.map((chip) => (
                <Button key={chip.key} size="small" variant="secondary" onPress={chip.clear}>
                  {`${chip.label}  ✕`}
                </Button>
              ))}
              <Button size="small" variant="text" onPress={clearAll}>
                Clear all
              </Button>
            </>
          )}
        </Inline>

        {/* Product grid or empty state */}
        {current.length === 0 ? (
          <Stack space={4} alignX="center">
            <Headline level={3}>No products found</Headline>
            <Text>Try adjusting your filters or search query.</Text>
            <Button variant="primary" onPress={clearAll}>
              Clear all filters
            </Button>
          </Stack>
        ) : (
          <Stack space={6}>
            <Box
              css={{
                display: 'grid',
                gap: '1.25rem',
                gridTemplateColumns: '1fr',
                '@media (min-width: 640px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
                '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
              }}
            >
              {current.map((p) => {
                const soldOut = p.status === 'Sold Out';
                return (
                  <Card key={p.id}>
                    <Stack space={3}>
                      <Inline space={2} alignY="center" alignX="space-between">
                        <Headline level={4}>{p.name}</Headline>
                        <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                      </Inline>
                      <Text css={{ fontWeight: 700, fontSize: '1.125rem' }}>{formatPrice(p.price)}</Text>
                      <Text>{p.description}</Text>
                      <Button variant="primary" disabled={soldOut} onPress={() => setCart((c) => c + 1)}>
                        {soldOut ? 'Sold Out' : 'Add to Cart'}
                      </Button>
                    </Stack>
                  </Card>
                );
              })}
            </Box>

            {/* Pagination */}
            <Inline space={4} alignY="center" alignX="center">
              <Button
                variant="secondary"
                disabled={safePage <= 1}
                onPress={() => setPage(safePage - 1)}
              >
                Previous
              </Button>
              <Text>{`Page ${safePage} of ${totalPages}`}</Text>
              <Button
                variant="secondary"
                disabled={safePage >= totalPages}
                onPress={() => setPage(safePage + 1)}
              >
                Next
              </Button>
            </Inline>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default TestApp;
