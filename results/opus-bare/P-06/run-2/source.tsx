import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Divider,
  Headline,
  Inline,
  SearchField,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  Tiles,
} from '@marigold/components';

type Status = 'New' | 'Sale' | 'Sold Out';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  status: Status;
  description: string;
  popularity: number;
  added: number;
}

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const MAX_PRICE = 100;
const PAGE_SIZE = 3;

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Logo Tee',
    price: 24.99,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'New',
    description: 'A soft cotton tee featuring our signature embroidered logo.',
    popularity: 72,
    added: 8,
  },
  {
    id: 2,
    name: 'Cozy Pullover Hoodie',
    price: 49.99,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    status: 'Sale',
    description: 'Brushed fleece hoodie with a roomy front pocket for chilly days.',
    popularity: 95,
    added: 6,
  },
  {
    id: 3,
    name: 'Enamel Pin Set',
    price: 12.99,
    category: 'Accessories',
    sizes: [],
    status: 'New',
    description: 'A collectible set of five hard enamel pins with rubber clutches.',
    popularity: 40,
    added: 7,
  },
  {
    id: 4,
    name: 'Retro Travel Poster',
    price: 18.0,
    category: 'Posters',
    sizes: [],
    status: 'Sold Out',
    description: 'Vintage-inspired print on heavy matte stock, ready to frame.',
    popularity: 33,
    added: 4,
  },
  {
    id: 5,
    name: 'Sticker Variety Pack',
    price: 6.99,
    category: 'Stickers',
    sizes: [],
    status: 'New',
    description: 'Ten weatherproof vinyl stickers perfect for laptops and bottles.',
    popularity: 58,
    added: 5,
  },
  {
    id: 6,
    name: 'Premium Zip Hoodie',
    price: 64.99,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'Sale',
    description: 'Full-zip heavyweight hoodie with a brushed interior and metal pulls.',
    popularity: 88,
    added: 3,
  },
  {
    id: 7,
    name: 'Graphic Art Tee',
    price: 29.99,
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L'],
    status: 'New',
    description: 'Limited-edition tee with an exclusive screen-printed artwork.',
    popularity: 64,
    added: 2,
  },
  {
    id: 8,
    name: 'Canvas Tote Bag',
    price: 21.99,
    category: 'Accessories',
    sizes: [],
    status: 'Sold Out',
    description: 'Durable organic-canvas tote with reinforced shoulder straps.',
    popularity: 51,
    added: 1,
  },
];

interface AppliedFilters {
  categories: string[];
  sizes: string[];
  maxPrice: number;
  inStock: boolean;
}

const DEFAULT_FILTERS: AppliedFilters = {
  categories: [],
  sizes: [],
  maxPrice: MAX_PRICE,
  inStock: false,
};

interface FilterPanelProps {
  applied: AppliedFilters;
  onApply: (filters: AppliedFilters) => void;
  onReset: () => void;
  close: () => void;
}

const FilterPanel = ({ applied, onApply, onReset, close }: FilterPanelProps) => {
  const [categories, setCategories] = useState<string[]>(applied.categories);
  const [sizes, setSizes] = useState<string[]>(applied.sizes);
  const [maxPrice, setMaxPrice] = useState<number>(applied.maxPrice);
  const [inStock, setInStock] = useState<boolean>(applied.inStock);

  return (
    <Stack space={6}>
      <Headline level={2}>Filters</Headline>

      <CheckboxGroup
        label="Category"
        value={categories}
        onChange={setCategories}
      >
        {CATEGORIES.map((c) => (
          <Checkbox key={c} value={c}>
            {c}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <Divider />

      <Slider
        label="Price range"
        minValue={0}
        maxValue={MAX_PRICE}
        value={maxPrice}
        onChange={(value) => setMaxPrice(value as number)}
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

      <Switch isSelected={inStock} onChange={setInStock}>
        In stock only
      </Switch>

      <Inline space={4}>
        <Button
          variant="primary"
          onPress={() => {
            onApply({ categories, sizes, maxPrice, inStock });
            close();
          }}
        >
          Apply Filters
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setCategories([]);
            setSizes([]);
            setMaxPrice(MAX_PRICE);
            setInStock(false);
            onReset();
          }}
        >
          Reset
        </Button>
      </Inline>
    </Stack>
  );
};

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<string>('newest');
  const [applied, setApplied] = useState<AppliedFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState(0);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateSort = (key: string) => {
    setSort(key);
    setPage(1);
  };

  const applyFilters = (filters: AppliedFilters) => {
    setApplied(filters);
    setPage(1);
  };

  const resetFilters = () => {
    setApplied(DEFAULT_FILTERS);
    setPage(1);
  };

  const clearAll = () => {
    setSearch('');
    setApplied(DEFAULT_FILTERS);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query)) return false;
      if (applied.categories.length && !applied.categories.includes(p.category))
        return false;
      if (
        applied.sizes.length &&
        !applied.sizes.some((s) => p.sizes.includes(s))
      )
        return false;
      if (p.price > applied.maxPrice) return false;
      if (applied.inStock && p.status === 'Sold Out') return false;
      return true;
    });

    return list.sort((a, b) => {
      switch (sort) {
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
  }, [search, sort, applied]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (search.trim()) {
    chips.push({
      key: 'search',
      label: `Search: "${search.trim()}"`,
      clear: () => updateSearch(''),
    });
  }
  applied.categories.forEach((c) =>
    chips.push({
      key: `cat-${c}`,
      label: `Category: ${c}`,
      clear: () =>
        applyFilters({
          ...applied,
          categories: applied.categories.filter((x) => x !== c),
        }),
    })
  );
  applied.sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `Size: ${s}`,
      clear: () =>
        applyFilters({
          ...applied,
          sizes: applied.sizes.filter((x) => x !== s),
        }),
    })
  );
  if (applied.maxPrice < MAX_PRICE) {
    chips.push({
      key: 'price',
      label: `Max price: $${applied.maxPrice}`,
      clear: () => applyFilters({ ...applied, maxPrice: MAX_PRICE }),
    });
  }
  if (applied.inStock) {
    chips.push({
      key: 'instock',
      label: 'In stock only',
      clear: () => applyFilters({ ...applied, inStock: false }),
    });
  }

  return (
    <Stack space={8}>
      <Stack space={2}>
        <Inline space={4} alignY="center">
          <Headline level={1}>Merchandise Store</Headline>
          <Badge>{`Cart: ${cart}`}</Badge>
        </Inline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      <Inline space={4} alignY="bottom">
        <SearchField
          label="Search"
          placeholder="Search products by name"
          value={search}
          onChange={updateSearch}
        />
        <Select
          label="Sort by"
          selectedKey={sort}
          onSelectionChange={(key) => updateSort(String(key))}
        >
          {SORT_OPTIONS.map((option) => (
            <Select.Option key={option.id} id={option.id}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
        <Dialog.Trigger>
          <Button variant="secondary">Filters</Button>
          <Dialog aria-label="Product filters" closeButton>
            {({ close }) => (
              <FilterPanel
                applied={applied}
                onApply={applyFilters}
                onReset={resetFilters}
                close={close}
              />
            )}
          </Dialog>
        </Dialog.Trigger>
      </Inline>

      <Inline space={3} alignY="center">
        {chips.length === 0 ? (
          <Text>No filters applied</Text>
        ) : (
          <>
            {chips.map((chip) => (
              <Button
                key={chip.key}
                variant="secondary"
                onPress={chip.clear}
              >
                {`${chip.label}  ✕`}
              </Button>
            ))}
            <Button variant="text" onPress={clearAll}>
              Clear all
            </Button>
          </>
        )}
      </Inline>

      {pageItems.length === 0 ? (
        <Stack space={4} alignX="center">
          <Headline level={2}>No products found</Headline>
          <Text>Try adjusting your filters or search query.</Text>
          <Button variant="primary" onPress={clearAll}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Tiles columns={[1, 2, 4]} space={6}>
          {pageItems.map((product) => (
            <Card key={product.id}>
              <Stack space={3}>
                <Badge>{product.status}</Badge>
                <Headline level={3}>{product.name}</Headline>
                <Text>{product.description}</Text>
                <Text>{`$${product.price.toFixed(2)}`}</Text>
                <Button
                  variant="primary"
                  isDisabled={product.status === 'Sold Out'}
                  onPress={() => setCart((c) => c + 1)}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Card>
          ))}
        </Tiles>
      )}

      <Inline space={4} alignY="center" align="center">
        <Button
          variant="secondary"
          isDisabled={currentPage === 1}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
        <Button
          variant="secondary"
          isDisabled={currentPage === totalPages}
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </Inline>
    </Stack>
  );
};

export default TestApp;
