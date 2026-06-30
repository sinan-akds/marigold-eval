import { useEffect, useMemo, useState } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Checkbox,
  Columns,
  Drawer,
  Headline,
  Inline,
  Inset,
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

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  status: 'New' | 'Sale' | 'Sold Out';
  sizes: string[];
  description: string;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo Tee',
    price: 24.99,
    category: 'T-Shirts',
    status: 'New',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'A timeless tee featuring our iconic brand logo on premium cotton.',
    inStock: true,
  },
  {
    id: '2',
    name: 'Comfort Hoodie',
    price: 54.99,
    category: 'Hoodies',
    status: 'Sale',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Cozy pullover hoodie perfect for cooler days and casual wear.',
    inStock: true,
  },
  {
    id: '3',
    name: 'Logo Snapback',
    price: 19.99,
    category: 'Accessories',
    status: 'New',
    sizes: [],
    description: 'Adjustable snapback cap with embroidered logo on the front panel.',
    inStock: true,
  },
  {
    id: '4',
    name: 'Brand Poster',
    price: 12.99,
    category: 'Posters',
    status: 'Sale',
    sizes: [],
    description: 'High-quality 24×36 in offset print perfect for any wall space.',
    inStock: true,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 7.99,
    category: 'Stickers',
    status: 'New',
    sizes: [],
    description: 'Pack of 10 premium vinyl die-cut stickers for any surface.',
    inStock: true,
  },
  {
    id: '6',
    name: 'Vintage Hoodie',
    price: 64.99,
    category: 'Hoodies',
    status: 'Sold Out',
    sizes: ['M', 'L'],
    description: 'Limited edition vintage-wash hoodie with a relaxed, lived-in fit.',
    inStock: false,
  },
  {
    id: '7',
    name: 'Graphic Tee',
    price: 29.99,
    category: 'T-Shirts',
    status: 'Sale',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Bold graphic print on a premium soft-touch cotton blend.',
    inStock: true,
  },
  {
    id: '8',
    name: 'Enamel Pin Set',
    price: 14.99,
    category: 'Accessories',
    status: 'Sold Out',
    sizes: [],
    description: 'Set of 3 collectible hard enamel pins with gold-plated finish.',
    inStock: false,
  },
];

const PAGE_SIZE = 3;

const badgeVariant = (status: Product['status']) => {
  if (status === 'New') return 'info' as const;
  if (status === 'Sale') return 'success' as const;
  return 'error' as const;
};

export default function TestApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const filteredAndSorted = useMemo(() => {
    const result = PRODUCTS.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category))
        return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (
        selectedSizes.length > 0 &&
        p.sizes.length > 0 &&
        !selectedSizes.some(s => p.sizes.includes(s))
      )
        return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    switch (sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price);
      case 'popular':
        return [...result].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      default:
        return result;
    }
  }, [searchQuery, selectedCategories, priceRange, selectedSizes, inStockOnly, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedProducts = filteredAndSorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ id: string; label: string }> = [];
    selectedCategories.forEach(c =>
      chips.push({ id: `cat:${c}`, label: `Category: ${c}` })
    );
    if (priceRange[0] !== 0 || priceRange[1] !== 100) {
      chips.push({
        id: 'price',
        label: `Price: $${priceRange[0]}–$${priceRange[1]}`,
      });
    }
    selectedSizes.forEach(s => chips.push({ id: `size:${s}`, label: `Size: ${s}` }));
    if (inStockOnly) chips.push({ id: 'stock', label: 'In stock only' });
    return chips;
  }, [selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const handleRemoveFilter = (keys: Set<string | number>) => {
    for (const key of keys) {
      const k = String(key);
      if (k.startsWith('cat:')) {
        const cat = k.slice(4);
        setSelectedCategories(prev => prev.filter(c => c !== cat));
      } else if (k === 'price') {
        setPriceRange([0, 100]);
      } else if (k.startsWith('size:')) {
        const size = k.slice(5);
        setSelectedSizes(prev => prev.filter(s => s !== size));
      } else if (k === 'stock') {
        setInStockOnly(false);
      }
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  const emptyFilterState = () => (
    <Text fontSize="sm" fontStyle="italic">
      No filters applied.
    </Text>
  );

  return (
    <AppLayout>
      <AppLayout.Main>
        <Inset space={6}>
    <Stack space={8}>
      {/* Page header */}
      <Stack space={2}>
        <Headline level={1}>Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Columns columns={[1, 'fit', 'fit']} space={4} collapseAt="30em">
        <SearchField
          label="Search"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Select
          label="Sort by"
          value={sortBy}
          onChange={val => setSortBy(String(val))}
          width="fit"
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-low">Price: Low to High</Select.Option>
          <Select.Option id="price-high">Price: High to Low</Select.Option>
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
                  value={selectedCategories}
                  onChange={setSelectedCategories}
                >
                  <Checkbox value="T-Shirts" label="T-Shirts" />
                  <Checkbox value="Hoodies" label="Hoodies" />
                  <Checkbox value="Accessories" label="Accessories" />
                  <Checkbox value="Posters" label="Posters" />
                  <Checkbox value="Stickers" label="Stickers" />
                </Checkbox.Group>

                <Slider
                  label="Price range"
                  value={priceRange}
                  onChange={val => setPriceRange(Array.isArray(val) ? val : [0, val])}
                  minValue={0}
                  maxValue={100}
                  step={5}
                  thumbLabels={['min', 'max']}
                  formatOptions={{ style: 'currency', currency: 'USD' }}
                />

                <Checkbox.Group
                  label="Size"
                  value={selectedSizes}
                  onChange={setSelectedSizes}
                >
                  <Checkbox value="XS" label="XS" />
                  <Checkbox value="S" label="S" />
                  <Checkbox value="M" label="M" />
                  <Checkbox value="L" label="L" />
                  <Checkbox value="XL" label="XL" />
                </Checkbox.Group>

                <Switch
                  label="In stock only"
                  selected={inStockOnly}
                  onChange={setInStockOnly}
                />
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button variant="ghost" onPress={resetFilters}>
                Reset
              </Button>
              <Button slot="close" variant="primary">
                Apply Filters
              </Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      </Columns>

      {/* Applied filter chips */}
      <Tag.Group
        label="Applied filters"
        onRemove={handleRemoveFilter}
        removeAll={activeFilterChips.length > 0}
        emptyState={emptyFilterState}
      >
        {activeFilterChips.map(({ id, label }) => (
          <Tag key={id} id={id}>
            {label}
          </Tag>
        ))}
      </Tag.Group>

      {/* Product grid or empty state */}
      {filteredAndSorted.length === 0 ? (
        <Stack space={4} alignX="center">
          <Headline level={2}>No products found</Headline>
          <Text>Try adjusting your filters or search query.</Text>
          <Button variant="secondary" onPress={clearAllFilters}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Stack space={6}>
          <Tiles tilesWidth="280px" space={4} stretch equalHeight>
            {pagedProducts.map(product => (
              <Card key={product.id} p={4}>
                <Stack space={3}>
                  <Badge variant={badgeVariant(product.status)}>
                    {product.status}
                  </Badge>
                  <Headline level={2}>{product.name}</Headline>
                  <Text weight="bold">${product.price.toFixed(2)}</Text>
                  <Text fontSize="sm">{product.description}</Text>
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

          {/* Pagination */}
          <Inline alignY="center">
            <Text fontSize="sm">
              Page {safePage} of {totalPages}
            </Text>
            <Split />
            <Pagination
              totalItems={filteredAndSorted.length}
              pageSize={PAGE_SIZE}
              page={safePage}
              onChange={setCurrentPage}
            />
          </Inline>
        </Stack>
      )}
    </Stack>
        </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
}
