import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Columns,
  Drawer,
  EmptyState,
  Headline,
  Inline,
  Inset,
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
  created: number;
  popularity: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  tshirts: 'T-Shirts',
  hoodies: 'Hoodies',
  accessories: 'Accessories',
  posters: 'Posters',
  stickers: 'Stickers',
};

const SORT_LABELS: Record<string, string> = {
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  popular: 'Most Popular',
};

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic Logo Tee',
    price: 24.99,
    status: 'New',
    description: 'Soft cotton tee with our embroidered brand logo on the chest.',
    category: 'tshirts',
    sizes: APPAREL_SIZES,
    created: 8,
    popularity: 70,
  },
  {
    id: 'p2',
    name: 'Premium Pullover Hoodie',
    price: 59.99,
    status: 'Sale',
    description: 'Heavyweight fleece hoodie with a cozy lined hood and kangaroo pocket.',
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    created: 7,
    popularity: 95,
  },
  {
    id: 'p3',
    name: 'Enamel Sticker Pack',
    price: 9.99,
    status: 'New',
    description: 'A set of five weatherproof vinyl stickers featuring our mascots.',
    category: 'stickers',
    sizes: [],
    created: 6,
    popularity: 40,
  },
  {
    id: 'p4',
    name: 'Vintage Tour Poster',
    price: 19.99,
    status: 'Sold Out',
    description: 'Limited edition screen-printed poster on heavy matte stock.',
    category: 'posters',
    sizes: [],
    created: 5,
    popularity: 60,
  },
  {
    id: 'p5',
    name: 'Canvas Tote Bag',
    price: 14.99,
    status: 'New',
    description: 'Durable everyday tote with reinforced handles and a roomy interior.',
    category: 'accessories',
    sizes: [],
    created: 4,
    popularity: 55,
  },
  {
    id: 'p6',
    name: 'Zip-Up Tech Hoodie',
    price: 64.99,
    status: 'Sold Out',
    description: 'Full-zip hoodie in a breathable performance blend for active days.',
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    created: 3,
    popularity: 80,
  },
  {
    id: 'p7',
    name: 'Graphic Print Tee',
    price: 29.99,
    status: 'Sale',
    description: 'Bold all-over print tee designed in collaboration with local artists.',
    category: 'tshirts',
    sizes: APPAREL_SIZES,
    created: 2,
    popularity: 88,
  },
  {
    id: 'p8',
    name: 'Snapback Cap',
    price: 22.99,
    status: 'New',
    description: 'Structured six-panel cap with an adjustable snap closure.',
    category: 'accessories',
    sizes: [],
    created: 1,
    popularity: 50,
  },
];

const TOTAL_PAGES = 3;
const DEFAULT_PRICE: [number, number] = [0, 100];

const statusVariant = (status: Status) => {
  switch (status) {
    case 'New':
      return 'info';
    case 'Sale':
      return 'warning';
    case 'Sold Out':
      return 'error';
  }
};

const TestApp = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);

  const isPriceDefault =
    priceRange[0] === DEFAULT_PRICE[0] && priceRange[1] === DEFAULT_PRICE[1];

  const visibleProducts = useMemo(() => {
    const filtered = PRODUCTS.filter(product => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (categories.length > 0 && !categories.includes(product.category)) {
        return false;
      }
      if (sizes.length > 0 && !product.sizes.some(s => sizes.includes(s))) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      if (inStockOnly && product.status === 'Sold Out') {
        return false;
      }
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
        sorted.sort((a, b) => b.created - a.created);
        break;
    }
    return sorted;
  }, [search, sort, categories, sizes, priceRange, inStockOnly]);

  const appliedChips = useMemo(() => {
    const chips: { id: string; label: string }[] = [];
    if (search) {
      chips.push({ id: 'search', label: `Search: "${search}"` });
    }
    if (sort !== 'newest') {
      chips.push({ id: 'sort', label: `Sort: ${SORT_LABELS[sort]}` });
    }
    categories.forEach(c =>
      chips.push({ id: `cat:${c}`, label: `Category: ${CATEGORY_LABELS[c]}` })
    );
    sizes.forEach(s => chips.push({ id: `size:${s}`, label: `Size: ${s}` }));
    if (!isPriceDefault) {
      chips.push({
        id: 'price',
        label: `Price: $${priceRange[0]} – $${priceRange[1]}`,
      });
    }
    if (inStockOnly) {
      chips.push({ id: 'instock', label: 'In stock only' });
    }
    return chips;
  }, [search, sort, categories, sizes, priceRange, inStockOnly, isPriceDefault]);

  const removeChips = (keys: Set<React.Key>) => {
    keys.forEach(key => {
      const id = String(key);
      if (id === 'search') setSearch('');
      else if (id === 'sort') setSort('newest');
      else if (id === 'price') setPriceRange(DEFAULT_PRICE);
      else if (id === 'instock') setInStockOnly(false);
      else if (id.startsWith('cat:'))
        setCategories(prev => prev.filter(c => c !== id.slice(4)));
      else if (id.startsWith('size:'))
        setSizes(prev => prev.filter(s => s !== id.slice(5)));
    });
    setPage(1);
  };

  const clearAll = () => {
    setSearch('');
    setSort('newest');
    setCategories([]);
    setSizes([]);
    setPriceRange(DEFAULT_PRICE);
    setInStockOnly(false);
    setPage(1);
  };

  return (
    <Inset space={6}>
      <Stack space={6}>
        {/* Header */}
        <Inline alignX="between" alignY="center" space={4}>
          <Stack space={1}>
            <Headline level={1}>Merchandise Store</Headline>
            <Text color="text-secondary">
              Browse our collection of branded merchandise.
            </Text>
          </Stack>
          <Badge>{`Cart: ${cartCount}`}</Badge>
        </Inline>

        {/* Toolbar */}
        <Columns columns={[1, 'fit', 'fit']} space={4} collapseAt="48em">
          <SearchField
            label="Search"
            aria-label="Search products by name"
            placeholder="Search products by name"
            value={search}
            onChange={value => {
              setSearch(value);
              setPage(1);
            }}
            onClear={() => setSearch('')}
          />
          <Select
            label="Sort by"
            selectedKey={sort}
            onSelectionChange={key => setSort(String(key))}
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
                    <Checkbox.Group
                      label="Category"
                      value={categories}
                      onChange={value => {
                        setCategories(value);
                        setPage(1);
                      }}
                    >
                      <Checkbox value="tshirts" label="T-Shirts" />
                      <Checkbox value="hoodies" label="Hoodies" />
                      <Checkbox value="accessories" label="Accessories" />
                      <Checkbox value="posters" label="Posters" />
                      <Checkbox value="stickers" label="Stickers" />
                    </Checkbox.Group>

                    <Slider
                      label="Price range"
                      value={priceRange}
                      onChange={value => {
                        setPriceRange(value as [number, number]);
                        setPage(1);
                      }}
                      minValue={0}
                      maxValue={100}
                      step={5}
                      thumbLabels={['Minimum price', 'Maximum price']}
                      formatOptions={{ style: 'currency', currency: 'USD' }}
                    />

                    <Checkbox.Group
                      label="Size"
                      value={sizes}
                      onChange={value => {
                        setSizes(value);
                        setPage(1);
                      }}
                    >
                      {APPAREL_SIZES.map(size => (
                        <Checkbox key={size} value={size} label={size} />
                      ))}
                    </Checkbox.Group>

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
                  <Button variant="secondary" onPress={clearAll}>
                    Reset
                  </Button>
                  <Button slot="close" variant="primary">
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
          removeAll={appliedChips.length > 0}
          emptyState={() => (
            <Text color="text-secondary" fontStyle="italic">
              No filters applied
            </Text>
          )}
        >
          {appliedChips.map(chip => (
            <Tag key={chip.id} id={chip.id}>
              {chip.label}
            </Tag>
          ))}
        </Tag.Group>

        {/* Product grid or empty state */}
        {visibleProducts.length === 0 ? (
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
          <Stack space={6}>
            <Headline level={2}>
              {`${visibleProducts.length} product${
                visibleProducts.length === 1 ? '' : 's'
              }`}
            </Headline>
            <Tiles tilesWidth="240px" space={4} stretch equalHeight>
              {visibleProducts.map(product => (
                <Card key={product.id} p={4}>
                  <Stack space={3}>
                    <Inline alignX="between" alignY="center" space={2}>
                      <Headline level={3}>{product.name}</Headline>
                      <Badge variant={statusVariant(product.status)}>
                        {product.status}
                      </Badge>
                    </Inline>
                    <Text weight="bold" fontSize="lg">
                      {`$${product.price.toFixed(2)}`}
                    </Text>
                    <Text color="text-secondary">{product.description}</Text>
                    <Button
                      variant="primary"
                      fullWidth
                      disabled={product.status === 'Sold Out'}
                      onPress={() => setCartCount(count => count + 1)}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
                </Card>
              ))}
            </Tiles>

            {/* Pagination */}
            <Inline alignX="center" alignY="center" space={4}>
              <Button
                variant="secondary"
                disabled={page === 1}
                onPress={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Text>{`Page ${page} of ${TOTAL_PAGES}`}</Text>
              <Button
                variant="secondary"
                disabled={page === TOTAL_PAGES}
                onPress={() => setPage(p => Math.min(TOTAL_PAGES, p + 1))}
              >
                Next
              </Button>
            </Inline>
          </Stack>
        )}
      </Stack>
    </Inset>
  );
};

export default TestApp;
