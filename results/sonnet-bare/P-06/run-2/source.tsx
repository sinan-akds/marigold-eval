import { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Text,
  Headline,
  Button,
  TextField,
  Select,
  Slider,
  Switch,
  Badge,
  Card,
  Dialog,
  DialogTrigger,
  Divider,
  CheckboxGroup,
  Checkbox,
  Center,
} from '@marigold/components';

type Status = 'New' | 'Sale' | 'Sold Out';

interface Product {
  id: number;
  name: string;
  price: number;
  status: Status;
  description: string;
  soldOut: boolean;
  category: string;
  sizes: string[];
  newest: boolean;
  popular: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Logo Tee',
    price: 29.99,
    status: 'New',
    description: 'A comfortable everyday t-shirt with our iconic logo.',
    soldOut: false,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    newest: true,
    popular: false,
  },
  {
    id: 2,
    name: 'Vintage Hoodie',
    price: 59.99,
    status: 'Sale',
    description: 'Warm and cozy hoodie with a retro brand print.',
    soldOut: false,
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    newest: false,
    popular: true,
  },
  {
    id: 3,
    name: 'Logo Cap',
    price: 24.99,
    status: 'New',
    description: 'Adjustable cap featuring an embroidered logo.',
    soldOut: false,
    category: 'Accessories',
    sizes: ['XS', 'S', 'M'],
    newest: true,
    popular: false,
  },
  {
    id: 4,
    name: 'Brand Poster',
    price: 14.99,
    status: 'Sale',
    description: 'High-quality print poster perfect for any wall.',
    soldOut: true,
    category: 'Posters',
    sizes: [],
    newest: false,
    popular: false,
  },
  {
    id: 5,
    name: 'Sticker Pack',
    price: 9.99,
    status: 'New',
    description: 'A set of 10 unique branded stickers.',
    soldOut: false,
    category: 'Stickers',
    sizes: [],
    newest: true,
    popular: true,
  },
  {
    id: 6,
    name: 'Zip-Up Hoodie',
    price: 74.99,
    status: 'New',
    description: 'Full-zip hoodie with front pockets and logo detail.',
    soldOut: true,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L'],
    newest: true,
    popular: false,
  },
  {
    id: 7,
    name: 'Graphic Tee',
    price: 34.99,
    status: 'Sale',
    description: 'Bold graphic design tee made from organic cotton.',
    soldOut: false,
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    newest: false,
    popular: true,
  },
  {
    id: 8,
    name: 'Tote Bag',
    price: 19.99,
    status: 'New',
    description: 'Eco-friendly canvas tote with a large logo print.',
    soldOut: false,
    category: 'Accessories',
    sizes: [],
    newest: false,
    popular: true,
  },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const ITEMS_PER_PAGE = 8;

type ActiveFilters = {
  categories: string[];
  maxPrice: number;
  sizes: string[];
  inStockOnly: boolean;
};

const DEFAULT_FILTERS: ActiveFilters = {
  categories: [],
  maxPrice: 100,
  sizes: [],
  inStockOnly: false,
};

function statusVariant(status: Status): 'success' | 'warning' | 'error' {
  if (status === 'New') return 'success';
  if (status === 'Sale') return 'warning';
  return 'error';
}

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingFilters, setPendingFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const hasActiveFilters =
    appliedFilters.categories.length > 0 ||
    appliedFilters.maxPrice < 100 ||
    appliedFilters.sizes.length > 0 ||
    appliedFilters.inStockOnly;

  const filteredAndSorted = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (appliedFilters.categories.length > 0 && !appliedFilters.categories.includes(p.category)) return false;
      if (p.price > appliedFilters.maxPrice) return false;
      if (appliedFilters.sizes.length > 0 && p.sizes.length > 0 && !appliedFilters.sizes.some(s => p.sizes.includes(s))) return false;
      if (appliedFilters.inStockOnly && p.soldOut) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return (b.newest ? 1 : 0) - (a.newest ? 1 : 0);
    });

    return list;
  }, [search, sort, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProducts = filteredAndSorted.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    setCurrentPage(1);
    setFilterPanelOpen(false);
  };

  const handleResetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters(DEFAULT_FILTERS);
    setPendingFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const removeCategory = (cat: string) => {
    const updated = { ...appliedFilters, categories: appliedFilters.categories.filter(c => c !== cat) };
    setAppliedFilters(updated);
    setPendingFilters(updated);
  };

  const removeSize = (size: string) => {
    const updated = { ...appliedFilters, sizes: appliedFilters.sizes.filter(s => s !== size) };
    setAppliedFilters(updated);
    setPendingFilters(updated);
  };

  const removeMaxPrice = () => {
    const updated = { ...appliedFilters, maxPrice: 100 };
    setAppliedFilters(updated);
    setPendingFilters(updated);
  };

  const removeInStock = () => {
    const updated = { ...appliedFilters, inStockOnly: false };
    setAppliedFilters(updated);
    setPendingFilters(updated);
  };

  return (
    <Stack space={6} marginX={8} marginY={6}>
      {/* Header */}
      <Stack space={2}>
        <Headline level={1}>Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      <Divider />

      {/* Toolbar */}
      <Inline space={4} alignY="bottom">
        <TextField
          label="Search"
          placeholder="Search products..."
          value={search}
          onChange={setSearch}
          width="1/3"
        />
        <Select
          label="Sort by"
          selectedKey={sort}
          onSelectionChange={key => { setSort(String(key)); setCurrentPage(1); }}
        >
          {SORT_OPTIONS.map(opt => (
            <Select.Option key={opt.id} id={opt.id}>{opt.label}</Select.Option>
          ))}
        </Select>
        <DialogTrigger isOpen={filterPanelOpen} onOpenChange={setFilterPanelOpen}>
          <Button variant="secondary" onPress={() => setFilterPanelOpen(true)}>Filters</Button>
          <Dialog>
            <Stack space={6} padding={6}>
              <Headline level={3}>Filters</Headline>

              <Stack space={2}>
                <Text weight="bold">Category</Text>
                <CheckboxGroup
                  label="Category"
                  value={pendingFilters.categories}
                  onChange={vals => setPendingFilters(f => ({ ...f, categories: vals }))}
                >
                  {CATEGORIES.map(cat => (
                    <Checkbox key={cat} value={cat}>{cat}</Checkbox>
                  ))}
                </CheckboxGroup>
              </Stack>

              <Stack space={2}>
                <Text weight="bold">Price Range (up to ${pendingFilters.maxPrice})</Text>
                <Slider
                  label="Max price"
                  minValue={0}
                  maxValue={100}
                  value={pendingFilters.maxPrice}
                  onChange={val => setPendingFilters(f => ({ ...f, maxPrice: val as number }))}
                />
              </Stack>

              <Stack space={2}>
                <Text weight="bold">Size</Text>
                <CheckboxGroup
                  label="Size"
                  value={pendingFilters.sizes}
                  onChange={vals => setPendingFilters(f => ({ ...f, sizes: vals }))}
                >
                  {SIZES.map(size => (
                    <Checkbox key={size} value={size}>{size}</Checkbox>
                  ))}
                </CheckboxGroup>
              </Stack>

              <Stack space={2}>
                <Text weight="bold">Availability</Text>
                <Switch
                  isSelected={pendingFilters.inStockOnly}
                  onChange={val => setPendingFilters(f => ({ ...f, inStockOnly: val }))}
                >
                  In stock only
                </Switch>
              </Stack>

              <Inline space={4}>
                <Button variant="primary" onPress={handleApplyFilters}>Apply Filters</Button>
                <Button variant="ghost" onPress={handleResetFilters}>Reset</Button>
              </Inline>
            </Stack>
          </Dialog>
        </DialogTrigger>
      </Inline>

      {/* Applied filters chips */}
      <Inline space={2} alignY="center">
        {!hasActiveFilters && (
          <Text color="text-muted">No filters applied</Text>
        )}
        {appliedFilters.categories.map(cat => (
          <Button key={cat} variant="ghost" size="small" onPress={() => removeCategory(cat)}>
            {cat} ×
          </Button>
        ))}
        {appliedFilters.sizes.map(size => (
          <Button key={size} variant="ghost" size="small" onPress={() => removeSize(size)}>
            Size: {size} ×
          </Button>
        ))}
        {appliedFilters.maxPrice < 100 && (
          <Button variant="ghost" size="small" onPress={removeMaxPrice}>
            Max ${appliedFilters.maxPrice} ×
          </Button>
        )}
        {appliedFilters.inStockOnly && (
          <Button variant="ghost" size="small" onPress={removeInStock}>
            In stock only ×
          </Button>
        )}
        {hasActiveFilters && (
          <Button variant="ghost" size="small" onPress={handleClearAllFilters}>
            Clear all
          </Button>
        )}
      </Inline>

      {/* Product grid or empty state */}
      {pageProducts.length === 0 ? (
        <Center>
          <Stack space={4} alignX="center">
            <Headline level={3}>No products found</Headline>
            <Text>Try adjusting your filters or search query.</Text>
            <Button variant="primary" onPress={handleClearAllFilters}>Clear all filters</Button>
          </Stack>
        </Center>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {pageProducts.map(product => (
            <Card key={product.id}>
              <Stack space={3} padding={4}>
                <Inline space={2} alignY="center">
                  <Text weight="bold">{product.name}</Text>
                  <Badge variant={statusVariant(product.status)}>{product.status}</Badge>
                </Inline>
                <Text color="text-muted" fontSize="small">{product.description}</Text>
                <Text weight="bold">${product.price.toFixed(2)}</Text>
                <Button
                  variant="primary"
                  disabled={product.soldOut}
                  onPress={() => {}}
                >
                  {product.soldOut ? 'Sold Out' : 'Add to Cart'}
                </Button>
              </Stack>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Inline space={4} alignY="center">
        <Button
          variant="secondary"
          disabled={safePage <= 1}
          onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <Text>Page {safePage} of {totalPages}</Text>
        <Button
          variant="secondary"
          disabled={safePage >= totalPages}
          onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </Inline>
    </Stack>
  );
};

export default TestApp;
