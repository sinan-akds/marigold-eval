import { useState, useMemo, useEffect } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Checkbox,
  Columns,
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

type Product = {
  id: string;
  name: string;
  price: number;
  status: 'New' | 'Sale' | 'Sold Out';
  description: string;
  category: string;
  sizes: string[];
  popularity: number;
  createdAt: number;
  soldOut: boolean;
};

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Tee',
    price: 24.99,
    status: 'New',
    description: 'A timeless crew-neck tee in soft, premium cotton.',
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 85,
    createdAt: 7,
    soldOut: false,
  },
  {
    id: '2',
    name: 'Logo Hoodie',
    price: 49.99,
    status: 'Sale',
    description: 'Warm and cozy hoodie featuring an embroidered logo.',
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    popularity: 90,
    createdAt: 6,
    soldOut: false,
  },
  {
    id: '3',
    name: 'Snapback Cap',
    price: 19.99,
    status: 'New',
    description: 'Adjustable snapback cap with embossed front logo patch.',
    category: 'Accessories',
    sizes: ['XS', 'S', 'M'],
    popularity: 70,
    createdAt: 5,
    soldOut: false,
  },
  {
    id: '4',
    name: 'Tour Poster',
    price: 14.99,
    status: 'Sale',
    description: 'High-quality art print from the 2024 world tour.',
    category: 'Posters',
    sizes: ['S', 'M'],
    popularity: 60,
    createdAt: 4,
    soldOut: false,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    status: 'New',
    description: 'Set of 12 premium vinyl stickers for any surface.',
    category: 'Stickers',
    sizes: ['XS'],
    popularity: 75,
    createdAt: 3,
    soldOut: false,
  },
  {
    id: '6',
    name: 'Vintage Tee',
    price: 29.99,
    status: 'Sold Out',
    description: 'Retro-style shirt with a beautifully faded logo print.',
    category: 'T-Shirts',
    sizes: ['S', 'M'],
    popularity: 95,
    createdAt: 2,
    soldOut: true,
  },
  {
    id: '7',
    name: 'Zip Hoodie',
    price: 59.99,
    status: 'Sold Out',
    description: 'Full-zip hoodie with kangaroo pocket and thumb holes.',
    category: 'Hoodies',
    sizes: ['L', 'XL'],
    popularity: 80,
    createdAt: 1,
    soldOut: true,
  },
  {
    id: '8',
    name: 'Canvas Tote',
    price: 17.99,
    status: 'New',
    description: 'Eco-friendly canvas tote bag with screen-printed logo.',
    category: 'Accessories',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    popularity: 65,
    createdAt: 8,
    soldOut: false,
  },
];

type FilterState = {
  categories: string[];
  maxPrice: number;
  sizes: string[];
  inStockOnly: boolean;
};

const EMPTY_FILTERS: FilterState = {
  categories: [],
  maxPrice: 100,
  sizes: [],
  inStockOnly: false,
};

const PAGE_SIZE = 3;

function badgeVariant(status: Product['status']): 'info' | 'warning' | 'error' {
  if (status === 'New') return 'info';
  if (status === 'Sale') return 'warning';
  return 'error';
}

export default function TestApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const result = ALL_PRODUCTS.filter(p => {
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(p.category)
      )
        return false;
      if (p.price > filters.maxPrice) return false;
      if (
        filters.sizes.length > 0 &&
        !p.sizes.some(s => filters.sizes.includes(s))
      )
        return false;
      if (filters.inStockOnly && p.soldOut) return false;
      return true;
    });

    return result.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popular':
          return b.popularity - a.popularity;
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [searchQuery, filters, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const activeFilterChips = useMemo(() => {
    const chips: { id: string; label: string }[] = [];
    filters.categories.forEach(cat =>
      chips.push({ id: `cat-${cat}`, label: `Category: ${cat}` })
    );
    if (filters.maxPrice < 100) {
      chips.push({ id: 'price', label: `Max price: $${filters.maxPrice}` });
    }
    filters.sizes.forEach(size =>
      chips.push({ id: `size-${size}`, label: `Size: ${size}` })
    );
    if (filters.inStockOnly) {
      chips.push({ id: 'stock', label: 'In stock only' });
    }
    return chips;
  }, [filters]);

  const handleRemoveChip = (keys: Set<string | number>) => {
    setFilters(prev => {
      let categories = [...prev.categories];
      let sizes = [...prev.sizes];
      let maxPrice = prev.maxPrice;
      let inStockOnly = prev.inStockOnly;

      for (const key of keys) {
        const k = String(key);
        if (k.startsWith('cat-')) {
          categories = categories.filter(c => c !== k.slice(4));
        } else if (k === 'price') {
          maxPrice = 100;
        } else if (k.startsWith('size-')) {
          sizes = sizes.filter(s => s !== k.slice(5));
        } else if (k === 'stock') {
          inStockOnly = false;
        }
      }

      return { categories, sizes, maxPrice, inStockOnly };
    });
  };

  const handleClearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearchQuery('');
  };

  return (
    <AppLayout>
      <AppLayout.Main>
    <Stack space={6}>
      {/* Page Header */}
      <Stack space={2}>
        <Headline level="1">Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Columns columns={[1, 'fit', 'fit']} space={4} collapseAt="30em">
        <SearchField
          aria-label="Search products"
          placeholder="Search products..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Select
          aria-label="Sort by"
          selectedKey={sortOrder}
          onSelectionChange={key => setSortOrder(String(key))}
          width="fit"
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-asc">Price: Low to High</Select.Option>
          <Select.Option id="price-desc">Price: High to Low</Select.Option>
          <Select.Option id="popular">Most Popular</Select.Option>
        </Select>
        <Drawer.Trigger>
          <Button variant="secondary" aria-label="Open filter panel">Filters</Button>
          <Drawer size="medium">
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                <Checkbox.Group
                  label="Category"
                  value={filters.categories}
                  onChange={val =>
                    setFilters(f => ({ ...f, categories: val }))
                  }
                >
                  <Checkbox value="T-Shirts" label="T-Shirts" />
                  <Checkbox value="Hoodies" label="Hoodies" />
                  <Checkbox value="Accessories" label="Accessories" />
                  <Checkbox value="Posters" label="Posters" />
                  <Checkbox value="Stickers" label="Stickers" />
                </Checkbox.Group>
                <Slider
                  label="Price range"
                  minValue={0}
                  maxValue={100}
                  value={filters.maxPrice}
                  onChange={v =>
                    setFilters(f => ({
                      ...f,
                      maxPrice: Array.isArray(v) ? v[0] : (v as number),
                    }))
                  }
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />
                <Checkbox.Group
                  label="Size"
                  value={filters.sizes}
                  onChange={val => setFilters(f => ({ ...f, sizes: val }))}
                >
                  <Checkbox value="XS" label="XS" />
                  <Checkbox value="S" label="S" />
                  <Checkbox value="M" label="M" />
                  <Checkbox value="L" label="L" />
                  <Checkbox value="XL" label="XL" />
                </Checkbox.Group>
                <Switch
                  label="In stock only"
                  selected={filters.inStockOnly}
                  onChange={val =>
                    setFilters(f => ({ ...f, inStockOnly: val }))
                  }
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Inline space={2}>
                <Button
                  variant="secondary"
                  onPress={() => setFilters(EMPTY_FILTERS)}
                >
                  Reset
                </Button>
                <Button slot="close" variant="primary">
                  Apply Filters
                </Button>
              </Inline>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      </Columns>

      {/* Applied Filter Chips */}
      <Tag.Group
        label="Applied filters"
        onRemove={handleRemoveChip}
        removeAll={activeFilterChips.length > 0}
        emptyState={() => <Text>No filters applied</Text>}
      >
        {activeFilterChips.map(chip => (
          <Tag key={chip.id} id={chip.id}>
            {chip.label}
          </Tag>
        ))}
      </Tag.Group>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search query."
          action={
            <Button variant="primary" onPress={handleClearAll}>
              Clear all filters
            </Button>
          }
        />
      ) : (
        <Tiles tilesWidth="280px" space={4} stretch equalHeight>
          {pagedProducts.map(product => (
            <Card key={product.id} p={4}>
              <Stack space={3}>
                <Inline alignY="center">
                  <Headline level="2">{product.name}</Headline>
                  <Split />
                  <Badge variant={badgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                </Inline>
                <Text weight="bold">${product.price.toFixed(2)}</Text>
                <Text>{product.description}</Text>
                <Button
                  variant="primary"
                  disabled={product.soldOut}
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
      {filteredProducts.length > 0 && (
        <Inline space={4} alignY="center">
          <Text>Page {currentPage} of {totalPages}</Text>
          <Pagination
            totalItems={filteredProducts.length}
            pageSize={PAGE_SIZE}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </Inline>
      )}
    </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
}
