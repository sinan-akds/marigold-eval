import { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Tiles,
  Text,
  Heading,
  Button,
  TextField,
  Select,
  Option,
  CheckboxGroup,
  Checkbox,
  Switch,
  Slider,
  Badge,
  Card,
  Dialog,
  DialogTrigger,
  Modal,
} from '@marigold/components';

type Status = 'New' | 'Sale' | 'Sold Out';
type SortKey = 'newest' | 'price-low' | 'price-high' | 'popular';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  status: Status;
  description: string;
  sizes: string[];
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Classic Logo T-Shirt', price: 29.99,
    category: 'T-Shirts', status: 'New',
    description: 'Comfortable cotton tee with our iconic logo on the front.',
    sizes: ['S', 'M', 'L', 'XL'], inStock: true,
  },
  {
    id: 2, name: 'Branded Hoodie', price: 59.99,
    category: 'Hoodies', status: 'Sale',
    description: 'Warm pullover hoodie perfect for cooler days.',
    sizes: ['M', 'L', 'XL'], inStock: true,
  },
  {
    id: 3, name: 'Enamel Pin Set', price: 12.99,
    category: 'Accessories', status: 'New',
    description: 'Set of three collectible enamel pins with vibrant colors.',
    sizes: [], inStock: true,
  },
  {
    id: 4, name: 'Logo Poster', price: 19.99,
    category: 'Posters', status: 'New',
    description: 'High-quality print poster in A2 size with our branding.',
    sizes: [], inStock: true,
  },
  {
    id: 5, name: 'Sticker Pack', price: 9.99,
    category: 'Stickers', status: 'Sale',
    description: 'Ten unique stickers in various sizes and designs.',
    sizes: [], inStock: true,
  },
  {
    id: 6, name: 'Vintage Hoodie', price: 64.99,
    category: 'Hoodies', status: 'Sold Out',
    description: 'Retro-style hoodie with a faded vintage print.',
    sizes: ['XS', 'S', 'M'], inStock: false,
  },
  {
    id: 7, name: 'Summer T-Shirt', price: 24.99,
    category: 'T-Shirts', status: 'Sale',
    description: 'Lightweight breathable tee ideal for warm weather.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], inStock: true,
  },
  {
    id: 8, name: 'Snapback Cap', price: 34.99,
    category: 'Accessories', status: 'Sold Out',
    description: 'Adjustable snapback cap with embroidered logo.',
    sizes: [], inStock: false,
  },
];

const POPULARITY: Record<number, number> = {
  2: 1, 7: 2, 1: 3, 8: 4, 3: 5, 6: 6, 4: 7, 5: 8,
};

const ITEMS_PER_PAGE = 3;

function statusVariant(status: Status): 'info' | 'warning' | 'neutral' {
  if (status === 'New') return 'info';
  if (status === 'Sale') return 'warning';
  return 'neutral';
}

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setSearch('');
    setCategories([]);
    setMaxPrice(100);
    setSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categories.length > 0 && !categories.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (sizes.length > 0 && p.sizes.length > 0 && !sizes.some(s => p.sizes.includes(s))) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === 'popular') result = [...result].sort((a, b) => POPULARITY[a.id] - POPULARITY[b.id]);

    return result;
  }, [search, sort, categories, maxPrice, sizes, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const filterChips = useMemo(() => {
    const chips: { label: string; id: string; remove: () => void }[] = [];
    if (search) chips.push({ label: `"${search}"`, id: 'search', remove: () => { setSearch(''); setCurrentPage(1); } });
    categories.forEach(c => chips.push({ label: c, id: `cat-${c}`, remove: () => { setCategories(prev => prev.filter(x => x !== c)); setCurrentPage(1); } }));
    if (maxPrice < 100) chips.push({ label: `Under $${maxPrice}`, id: 'price', remove: () => { setMaxPrice(100); setCurrentPage(1); } });
    sizes.forEach(s => chips.push({ label: s, id: `size-${s}`, remove: () => { setSizes(prev => prev.filter(x => x !== s)); setCurrentPage(1); } }));
    if (inStockOnly) chips.push({ label: 'In Stock', id: 'instock', remove: () => { setInStockOnly(false); setCurrentPage(1); } });
    return chips;
  }, [search, categories, maxPrice, sizes, inStockOnly]);

  const hasFilters = filterChips.length > 0;

  return (
    <Stack space={8}>
      {/* Page Header */}
      <Stack space={2}>
        <Heading level={1}>Merchandise Store</Heading>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Inline space={4} alignY="center">
        <TextField
          label="Search"
          value={search}
          onChange={val => { setSearch(val); setCurrentPage(1); }}
          placeholder="Search products..."
        />
        <Select
          label="Sort by"
          selectedKey={sort}
          onSelectionChange={key => { setSort(key as SortKey); setCurrentPage(1); }}
        >
          <Option key="newest" id="newest">Newest</Option>
          <Option key="price-low" id="price-low">Price: Low to High</Option>
          <Option key="price-high" id="price-high">Price: High to Low</Option>
          <Option key="popular" id="popular">Most Popular</Option>
        </Select>
        <DialogTrigger isOpen={filterOpen} onOpenChange={setFilterOpen}>
          <Button variant="secondary">Filters</Button>
          <Modal>
            <Dialog>
              <Stack space={6}>
                <Heading level={2}>Filters</Heading>

                <CheckboxGroup
                  label="Category"
                  value={categories}
                  onChange={vals => { setCategories(vals); setCurrentPage(1); }}
                >
                  <Checkbox value="T-Shirts">T-Shirts</Checkbox>
                  <Checkbox value="Hoodies">Hoodies</Checkbox>
                  <Checkbox value="Accessories">Accessories</Checkbox>
                  <Checkbox value="Posters">Posters</Checkbox>
                  <Checkbox value="Stickers">Stickers</Checkbox>
                </CheckboxGroup>

                <Slider
                  label={`Price: $0 – $${maxPrice}`}
                  minValue={0}
                  maxValue={100}
                  value={maxPrice}
                  onChange={val => { setMaxPrice(val as number); setCurrentPage(1); }}
                  step={5}
                />

                <CheckboxGroup
                  label="Size"
                  value={sizes}
                  onChange={vals => { setSizes(vals); setCurrentPage(1); }}
                >
                  <Checkbox value="XS">XS</Checkbox>
                  <Checkbox value="S">S</Checkbox>
                  <Checkbox value="M">M</Checkbox>
                  <Checkbox value="L">L</Checkbox>
                  <Checkbox value="XL">XL</Checkbox>
                </CheckboxGroup>

                <Switch
                  isSelected={inStockOnly}
                  onChange={val => { setInStockOnly(val); setCurrentPage(1); }}
                >
                  In stock only
                </Switch>

                <Inline space={3}>
                  <Button variant="primary" onPress={() => setFilterOpen(false)}>
                    Apply Filters
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={() => { resetFilters(); setFilterOpen(false); }}
                  >
                    Reset
                  </Button>
                </Inline>
              </Stack>
            </Dialog>
          </Modal>
        </DialogTrigger>
      </Inline>

      {/* Applied Filters */}
      <Inline space={2} alignY="center">
        {hasFilters ? (
          <>
            {filterChips.map(chip => (
              <Button key={chip.id} variant="ghost" onPress={chip.remove}>
                {chip.label} ×
              </Button>
            ))}
            <Button variant="text" onPress={resetFilters}>
              Clear all
            </Button>
          </>
        ) : (
          <Text>No filters applied</Text>
        )}
      </Inline>

      {/* Product Grid or Empty State */}
      {filtered.length === 0 ? (
        <Stack space={4}>
          <Heading level={3}>No products found</Heading>
          <Text>Try adjusting your filters or search query.</Text>
          <Button variant="primary" onPress={resetFilters}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Tiles tilesWidth="280px" space={4}>
          {paginated.map(product => (
            <Card key={product.id}>
              <Stack space={3}>
                <Inline space={2} alignY="center">
                  <Text weight="bold">{product.name}</Text>
                  <Badge variant={statusVariant(product.status)}>
                    {product.status}
                  </Badge>
                </Inline>
                <Text>${product.price.toFixed(2)}</Text>
                <Text>{product.description}</Text>
                <Button
                  variant="primary"
                  isDisabled={!product.inStock}
                  onPress={() => {}}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <Inline space={3} alignY="center">
          <Button
            variant="secondary"
            isDisabled={safePage === 1}
            onPress={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <Text>Page {safePage} of {totalPages}</Text>
          <Button
            variant="secondary"
            isDisabled={safePage === totalPages}
            onPress={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </Inline>
      )}
    </Stack>
  );
};

export default TestApp;
