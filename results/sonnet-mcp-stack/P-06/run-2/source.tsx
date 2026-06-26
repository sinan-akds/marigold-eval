import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Columns,
  Drawer,
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

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'New' | 'Sale' | 'Sold Out';
  category: string;
  description: string;
  sizes: string[];
  inStock: boolean;
  popularity: number;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo Tee',
    price: 29.99,
    status: 'New',
    category: 'T-Shirts',
    description: 'A comfortable cotton tee featuring our iconic logo.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    popularity: 8,
  },
  {
    id: '2',
    name: 'Branded Hoodie',
    price: 59.99,
    status: 'Sale',
    category: 'Hoodies',
    description: 'Stay warm in our premium fleece hoodie with embroidered branding.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    popularity: 9,
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 24.99,
    status: 'New',
    category: 'Accessories',
    description: 'Adjustable snapback cap with our signature logo embroidery.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 7,
  },
  {
    id: '4',
    name: 'Event Poster',
    price: 14.99,
    status: 'Sale',
    category: 'Posters',
    description: 'Limited edition art print celebrating our biggest events.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 5,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    status: 'New',
    category: 'Stickers',
    description: 'Set of 10 vinyl stickers with various branded designs.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 6,
  },
  {
    id: '6',
    name: 'Vintage Tee',
    price: 34.99,
    status: 'Sold Out',
    category: 'T-Shirts',
    description: 'Retro-washed tee with a vintage-inspired logo graphic.',
    sizes: ['S', 'M', 'L'],
    inStock: false,
    popularity: 4,
  },
  {
    id: '7',
    name: 'Zip Hoodie',
    price: 79.99,
    status: 'Sold Out',
    category: 'Hoodies',
    description: 'Full-zip hoodie crafted from heavyweight organic cotton.',
    sizes: ['M', 'L', 'XL'],
    inStock: false,
    popularity: 3,
  },
  {
    id: '8',
    name: 'Enamel Pin',
    price: 12.99,
    status: 'New',
    category: 'Accessories',
    description: 'Hard enamel pin featuring our mascot in full color.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 7,
  },
  {
    id: '9',
    name: 'Canvas Tote',
    price: 19.99,
    status: 'New',
    category: 'Accessories',
    description: 'Durable canvas tote bag with a screen-printed logo design.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 6,
  },
  {
    id: '10',
    name: 'Graphic Sweatshirt',
    price: 54.99,
    status: 'Sale',
    category: 'Hoodies',
    description: 'Cozy crew-neck sweatshirt with a bold graphic print on the front.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    popularity: 8,
  },
  {
    id: '11',
    name: 'Retro Poster',
    price: 17.99,
    status: 'New',
    category: 'Posters',
    description: 'High-quality retro-style art print featuring classic event artwork.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 4,
  },
  {
    id: '12',
    name: 'Logo Keychain',
    price: 8.99,
    status: 'New',
    category: 'Accessories',
    description: 'Sturdy metal keychain engraved with our logo — a perfect everyday carry.',
    sizes: ['one-size'],
    inStock: true,
    popularity: 5,
  },
];

const ITEMS_PER_PAGE = 4;

const BADGE_VARIANT: Record<Product['status'], 'info' | 'warning' | 'error'> = {
  New: 'info',
  Sale: 'warning',
  'Sold Out': 'error',
};

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterPriceMax, setFilterPriceMax] = useState(100);
  const [filterSizes, setFilterSizes] = useState<string[]>([]);
  const [filterInStock, setFilterInStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const result = PRODUCTS.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterCategories.length > 0 && !filterCategories.includes(p.category)) return false;
      if (p.price > filterPriceMax) return false;
      if (filterSizes.length > 0 && !p.sizes.some(s => filterSizes.includes(s))) return false;
      if (filterInStock && !p.inStock) return false;
      return true;
    });

    if (sortBy === 'price-asc') return [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'popular') return [...result].sort((a, b) => b.popularity - a.popularity);
    return result;
  }, [searchQuery, sortBy, filterCategories, filterPriceMax, filterSizes, filterInStock]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const filterChips = [
    ...filterCategories.map(cat => ({ id: `cat-${cat}`, label: `Category: ${cat}` })),
    ...(filterPriceMax < 100 ? [{ id: 'price', label: `Max: $${filterPriceMax}` }] : []),
    ...filterSizes.map(s => ({ id: `size-${s}`, label: `Size: ${s}` })),
    ...(filterInStock ? [{ id: 'instock', label: 'In Stock Only' }] : []),
  ];

  const handleRemoveChip = (keys: Set<any>) => {
    keys.forEach((key: any) => {
      const k = String(key);
      if (k.startsWith('cat-')) {
        const cat = k.slice(4);
        setFilterCategories(prev => prev.filter(c => c !== cat));
      } else if (k === 'price') {
        setFilterPriceMax(100);
      } else if (k.startsWith('size-')) {
        const s = k.slice(5);
        setFilterSizes(prev => prev.filter(sz => sz !== s));
      } else if (k === 'instock') {
        setFilterInStock(false);
      }
    });
    setCurrentPage(1);
  };

  const clearAll = () => {
    setSearchQuery('');
    setFilterCategories([]);
    setFilterPriceMax(100);
    setFilterSizes([]);
    setFilterInStock(false);
    setCurrentPage(1);
  };

  return (
    <Stack space={6}>
      {/* Header */}
      <Stack space={2}>
        <Headline level={1}>Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Columns columns={[3, 2, 'fit']} space={3} collapseAt="600px">
        <SearchField
          label="Search products"
          value={searchQuery}
          onChange={(val: string) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
        />
        <Select
          label="Sort by"
          selectedKey={sortBy}
          onSelectionChange={key => {
            setSortBy(String(key));
            setCurrentPage(1);
          }}
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
                  value={filterCategories}
                  onChange={setFilterCategories}
                >
                  {CATEGORIES.map(cat => (
                    <Checkbox key={cat} value={cat} label={cat} />
                  ))}
                </Checkbox.Group>
                <Slider
                  label="Price Range"
                  value={filterPriceMax}
                  onChange={(val: any) => setFilterPriceMax(val as number)}
                  minValue={0}
                  maxValue={100}
                  step={5}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />
                <Checkbox.Group
                  label="Size"
                  value={filterSizes}
                  onChange={setFilterSizes}
                >
                  {SIZES.map(sz => (
                    <Checkbox key={sz} value={sz} label={sz} />
                  ))}
                </Checkbox.Group>
                <Switch
                  label="In stock only"
                  selected={filterInStock}
                  onChange={setFilterInStock}
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button slot="close" onPress={clearAll}>
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
        onRemove={handleRemoveChip as any}
        removeAll
        emptyState={() => (
          <Text fontSize="sm" fontStyle="italic">
            No filters applied
          </Text>
        )}
      >
        {filterChips.map(chip => (
          <Tag key={chip.id} id={chip.id}>
            {chip.label}
          </Tag>
        ))}
      </Tag.Group>

      {/* Product grid or empty state */}
      {filteredProducts.length === 0 ? (
        <Stack space={4} alignX="center">
          <Headline level={3}>No products found</Headline>
          <Text>Try adjusting your filters or search query.</Text>
          <Button variant="secondary" onPress={clearAll}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Tiles tilesWidth="280px" space={4} equalHeight stretch>
          {pageProducts.map(product => (
            <Card key={product.id} p={4}>
              <Stack space={3}>
                <Inline>
                  <Badge variant={BADGE_VARIANT[product.status]}>{product.status}</Badge>
                </Inline>
                <Headline level={4}>{product.name}</Headline>
                <Text weight="bold">${product.price.toFixed(2)}</Text>
                <Text>{product.description}</Text>
                <Button
                  variant="primary"
                  disabled={!product.inStock}
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
      <Inline space={3} alignX="center" alignY="center">
        <Button
          variant="secondary"
          disabled={safePage === 1}
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
