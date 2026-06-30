import { useEffect, useMemo, useState } from 'react';
import type { Key } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Drawer,
  EmptyState,
  Headline,
  Inline,
  Pagination,
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
type Category = 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';

interface Product {
  id: number;
  name: string;
  price: number;
  status: Status;
  category: Category;
  sizes: string[];
  popularity: number;
  description: string;
}

const ALL_CATEGORIES: Category[] = [
  'T-Shirts',
  'Hoodies',
  'Accessories',
  'Posters',
  'Stickers',
];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const PAGE_SIZE = 8;
const PRICE_MIN = 0;
const PRICE_MAX = 100;

const STATUS_VARIANT: Record<Status, 'info' | 'warning' | 'error'> = {
  New: 'info',
  Sale: 'warning',
  'Sold Out': 'error',
};

const PRODUCTS: Product[] = [
  { id: 1, name: 'Classic Logo Tee', price: 24.99, status: 'Sale', category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], popularity: 88, description: 'Soft cotton tee with the classic embroidered logo.' },
  { id: 2, name: 'Vintage Wash Tee', price: 29.99, status: 'New', category: 'T-Shirts', sizes: ['XS', 'S', 'M', 'L'], popularity: 64, description: 'Garment-dyed tee with a lived-in vintage feel.' },
  { id: 3, name: 'Pocket Detail Tee', price: 27.5, status: 'Sale', category: 'T-Shirts', sizes: ['M', 'L', 'XL'], popularity: 41, description: 'Everyday tee finished with a contrast chest pocket.' },
  { id: 4, name: 'Pullover Hoodie', price: 59.99, status: 'New', category: 'Hoodies', sizes: ['S', 'M', 'L', 'XL'], popularity: 95, description: 'Heavyweight fleece hoodie with a roomy front pocket.' },
  { id: 5, name: 'Zip-Up Hoodie', price: 64.0, status: 'Sale', category: 'Hoodies', sizes: ['XS', 'S', 'M', 'L', 'XL'], popularity: 73, description: 'Full-zip hoodie with brushed interior for warmth.' },
  { id: 6, name: 'Cropped Hoodie', price: 54.99, status: 'New', category: 'Hoodies', sizes: ['XS', 'S', 'M'], popularity: 38, description: 'Relaxed cropped hoodie in a soft cotton blend.' },
  { id: 7, name: 'Embroidered Cap', price: 19.99, status: 'Sale', category: 'Accessories', sizes: [], popularity: 57, description: 'Six-panel cap with a tonal embroidered mark.' },
  { id: 8, name: 'Canvas Tote Bag', price: 14.99, status: 'New', category: 'Accessories', sizes: [], popularity: 82, description: 'Sturdy canvas tote sized for everyday carry.' },
  { id: 9, name: 'Enamel Pin Set', price: 9.99, status: 'Sale', category: 'Accessories', sizes: [], popularity: 29, description: 'Set of three enamel pins with secure clasps.' },
  { id: 10, name: 'Knit Beanie', price: 22.0, status: 'New', category: 'Accessories', sizes: [], popularity: 49, description: 'Ribbed knit beanie with a fold-over cuff.' },
  { id: 11, name: 'Skyline Poster', price: 12.99, status: 'Sale', category: 'Posters', sizes: [], popularity: 35, description: 'Matte art print of a hand-drawn city skyline.' },
  { id: 12, name: 'Typographic Poster', price: 15.0, status: 'New', category: 'Posters', sizes: [], popularity: 60, description: 'Bold typographic print on heavyweight paper.' },
  { id: 13, name: 'Tour Poster', price: 18.5, status: 'Sale', category: 'Posters', sizes: [], popularity: 71, description: 'Limited-run tour poster with metallic ink.' },
  { id: 14, name: 'Sticker Pack', price: 6.99, status: 'New', category: 'Stickers', sizes: [], popularity: 90, description: 'Weatherproof vinyl sticker pack of ten designs.' },
  { id: 15, name: 'Holographic Sticker', price: 4.5, status: 'Sale', category: 'Stickers', sizes: [], popularity: 44, description: 'Single holographic die-cut sticker.' },
  { id: 16, name: 'Logo Sticker Sheet', price: 5.99, status: 'New', category: 'Stickers', sizes: [], popularity: 26, description: 'Sheet of mixed logo stickers for laptops.' },
  { id: 17, name: 'Performance Tee', price: 34.99, status: 'New', category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], popularity: 53, description: 'Moisture-wicking tee built for training days.' },
  { id: 18, name: 'Long Sleeve Tee', price: 32.0, status: 'Sale', category: 'T-Shirts', sizes: ['XS', 'S', 'M', 'L'], popularity: 47, description: 'Lightweight long sleeve with ribbed cuffs.' },
  { id: 19, name: 'Sherpa Hoodie', price: 79.99, status: 'New', category: 'Hoodies', sizes: ['M', 'L', 'XL'], popularity: 67, description: 'Cozy sherpa-lined hoodie for cold weather.' },
  { id: 20, name: 'Tech Fleece Hoodie', price: 89.0, status: 'Sale', category: 'Hoodies', sizes: ['S', 'M', 'L'], popularity: 78, description: 'Streamlined fleece hoodie with a modern cut.' },
  { id: 21, name: 'Leather Keychain', price: 11.99, status: 'Sold Out', category: 'Accessories', sizes: [], popularity: 33, description: 'Full-grain leather keychain with a brass ring.' },
  { id: 22, name: 'Travel Mug', price: 21.5, status: 'New', category: 'Accessories', sizes: [], popularity: 58, description: 'Insulated stainless mug that keeps drinks hot.' },
  { id: 23, name: 'Minimalist Poster', price: 16.0, status: 'New', category: 'Posters', sizes: [], popularity: 51, description: 'Clean minimalist print in a muted palette.' },
  { id: 24, name: 'Mascot Sticker', price: 3.99, status: 'Sold Out', category: 'Stickers', sizes: [], popularity: 62, description: 'Glossy die-cut sticker of the team mascot.' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const TestApp = () => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([PRICE_MIN, PRICE_MAX]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);

  const priceFiltered =
    priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setPage(1);
  }, [query, sort, categories, priceRange, sizes, inStockOnly]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = PRODUCTS.filter(product => {
      if (q && !product.name.toLowerCase().includes(q)) return false;
      if (categories.length && !categories.includes(product.category))
        return false;
      if (product.price < priceRange[0] || product.price > priceRange[1])
        return false;
      if (sizes.length && !sizes.some(size => product.sizes.includes(size)))
        return false;
      if (inStockOnly && product.status === 'Sold Out') return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popular':
          return b.popularity - a.popularity;
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return result;
  }, [query, sort, categories, priceRange, sizes, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const chips = useMemo(() => {
    const items: { id: string; label: string }[] = [];
    if (query.trim()) items.push({ id: 'search', label: `Search: ${query.trim()}` });
    categories.forEach(category =>
      items.push({ id: `cat:${category}`, label: `Category: ${category}` })
    );
    if (priceFiltered)
      items.push({
        id: 'price',
        label: `Price: $${priceRange[0]} – $${priceRange[1]}`,
      });
    sizes.forEach(size => items.push({ id: `size:${size}`, label: `Size: ${size}` }));
    if (inStockOnly) items.push({ id: 'instock', label: 'In stock only' });
    return items;
  }, [query, categories, priceFiltered, priceRange, sizes, inStockOnly]);

  const removeChips = (keys: Set<Key>) => {
    keys.forEach(rawKey => {
      const key = String(rawKey);
      if (key === 'search') setQuery('');
      else if (key === 'price') setPriceRange([PRICE_MIN, PRICE_MAX]);
      else if (key === 'instock') setInStockOnly(false);
      else if (key.startsWith('cat:'))
        setCategories(prev => prev.filter(c => c !== key.slice(4)));
      else if (key.startsWith('size:'))
        setSizes(prev => prev.filter(s => s !== key.slice(5)));
    });
  };

  const resetFilters = () => {
    setCategories([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSizes([]);
    setInStockOnly(false);
  };

  const clearAll = () => {
    setQuery('');
    resetFilters();
  };

  return (
    <Stack space={6}>
      <Inline space={4} alignY="center" alignX="between">
        <Stack space={2}>
          <Headline level={1}>Merchandise Store</Headline>
          <Text color="muted-foreground">
            Browse our collection of branded merchandise.
          </Text>
        </Stack>
        <Badge variant="primary">{`Cart: ${cart}`}</Badge>
      </Inline>

      <Inline space={4} alignY="bottom">
        <SearchField
          label="Search"
          aria-label="Search products by name"
          placeholder="Search products…"
          value={query}
          onChange={setQuery}
          width={64}
        />
        <Select
          label="Sort by"
          aria-label="Sort products"
          value={sort}
          onChange={key => setSort(String(key))}
          width="fit"
        >
          {SORT_OPTIONS.map(option => (
            <Select.Option key={option.id} id={option.id}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
        <Drawer.Trigger>
          <Button variant="secondary">Filters</Button>
          <Drawer closeButton>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                <CheckboxGroup
                  label="Category"
                  value={categories}
                  onChange={setCategories}
                >
                  {ALL_CATEGORIES.map(category => (
                    <Checkbox key={category} value={category} label={category} />
                  ))}
                </CheckboxGroup>
                <Slider
                  label="Price range"
                  value={priceRange}
                  onChange={value => setPriceRange(value as number[])}
                  minValue={PRICE_MIN}
                  maxValue={PRICE_MAX}
                  step={5}
                  thumbLabels={['Minimum', 'Maximum']}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />
                <CheckboxGroup label="Size" value={sizes} onChange={setSizes}>
                  {ALL_SIZES.map(size => (
                    <Checkbox key={size} value={size} label={size} />
                  ))}
                </CheckboxGroup>
                <Switch
                  label="In stock only"
                  selected={inStockOnly}
                  onChange={setInStockOnly}
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button variant="secondary" onPress={resetFilters}>
                Reset
              </Button>
              <Button slot="close" variant="primary">
                Apply Filters
              </Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      </Inline>

      {chips.length ? (
        <Tag.Group
          label="Applied filters"
          onRemove={removeChips}
          removeAll
        >
          {chips.map(chip => (
            <Tag key={chip.id} id={chip.id}>
              {chip.label}
            </Tag>
          ))}
        </Tag.Group>
      ) : (
        <Text color="muted-foreground" fontStyle="italic">
          No filters applied
        </Text>
      )}

      {pageItems.length ? (
        <Tiles tilesWidth="260px" space={4} stretch equalHeight>
          {pageItems.map(product => (
            <Card key={product.id} p={4}>
              <Stack space={3} height="100%">
                <Inline space={2} alignX="between" alignY="center">
                  <Headline level={4}>{product.name}</Headline>
                  <Badge variant={STATUS_VARIANT[product.status]}>
                    {product.status}
                  </Badge>
                </Inline>
                <Text weight="bold" fontSize="lg">
                  ${product.price.toFixed(2)}
                </Text>
                <Text color="muted-foreground">{product.description}</Text>
                <Button
                  variant="primary"
                  fullWidth
                  disabled={product.status === 'Sold Out'}
                  onPress={() => setCart(count => count + 1)}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Card>
          ))}
        </Tiles>
      ) : (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={
            <Button variant="primary" onPress={clearAll}>
              Clear all filters
            </Button>
          }
        />
      )}

      {pageItems.length ? (
        <Inline space={4} alignY="center" alignX="center">
          <Text fontSize="sm" color="muted-foreground">
            Page {currentPage} of {totalPages}
          </Text>
          <Pagination
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            page={currentPage}
            onChange={setPage}
          />
        </Inline>
      ) : null}
    </Stack>
  );
};

export default TestApp;
