import { useMemo, useState } from 'react';
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

type ProductStatus = 'New' | 'Sale';
type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'popular';

interface Product {
  id: string;
  name: string;
  price: number;
  status: ProductStatus;
  category: string;
  sizes: string[];
  description: string;
  inStock: boolean;
  popularity: number;
  date: string;
}

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo Tee',
    price: 29.99,
    status: 'New',
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A timeless tee featuring our iconic logo on premium cotton.',
    inStock: true,
    popularity: 95,
    date: '2024-04-15',
  },
  {
    id: '2',
    name: 'Retro Hoodie',
    price: 59.99,
    status: 'Sale',
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    description: 'Cozy hoodie with vintage-inspired branding for everyday wear.',
    inStock: true,
    popularity: 88,
    date: '2024-02-10',
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 24.99,
    status: 'New',
    category: 'Accessories',
    sizes: ['XS', 'S', 'M'],
    description: 'Structured cap with embroidered logo for a clean finish.',
    inStock: true,
    popularity: 72,
    date: '2024-03-01',
  },
  {
    id: '4',
    name: 'Art Print Poster',
    price: 14.99,
    status: 'New',
    category: 'Posters',
    sizes: [],
    description: 'High-quality art print perfect for decorating your space.',
    inStock: true,
    popularity: 60,
    date: '2024-01-20',
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    status: 'Sale',
    category: 'Stickers',
    sizes: [],
    description: 'A set of 10 premium vinyl stickers for all surfaces.',
    inStock: true,
    popularity: 55,
    date: '2024-03-15',
  },
  {
    id: '6',
    name: 'Graphic Tee',
    price: 34.99,
    status: 'Sale',
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Bold graphic tee that makes a statement wherever you go.',
    inStock: false,
    popularity: 80,
    date: '2023-12-01',
  },
  {
    id: '7',
    name: 'Zip Hoodie',
    price: 69.99,
    status: 'New',
    category: 'Hoodies',
    sizes: ['S', 'M', 'L'],
    description: 'Full-zip hoodie with a clean logo patch on the chest.',
    inStock: false,
    popularity: 65,
    date: '2024-04-01',
  },
  {
    id: '8',
    name: 'Tote Bag',
    price: 19.99,
    status: 'New',
    category: 'Accessories',
    sizes: [],
    description: 'Durable canvas tote bag with minimalist branding.',
    inStock: true,
    popularity: 45,
    date: '2024-02-20',
  },
];

function statusBadgeVariant(status: ProductStatus | 'Sold Out') {
  if (status === 'New') return 'info' as const;
  if (status === 'Sale') return 'warning' as const;
  return 'error' as const;
}

interface FilterChip {
  id: string;
  label: string;
}

export default function MerchandiseStore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    result = result.filter(p => p.price <= maxPrice);

    if (selectedSizes.length > 0) {
      result = result.filter(
        p => p.sizes.length === 0 || p.sizes.some(s => selectedSizes.includes(s))
      );
    }

    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return result;
  }, [searchQuery, sortBy, selectedCategories, maxPrice, selectedSizes, inStockOnly]);

  const filterChips: FilterChip[] = useMemo(() => {
    const chips: FilterChip[] = [];
    selectedCategories.forEach(cat =>
      chips.push({ id: `cat-${cat}`, label: `Category: ${cat}` })
    );
    if (maxPrice < 100) {
      chips.push({ id: 'price', label: `Max price: $${maxPrice}` });
    }
    selectedSizes.forEach(size =>
      chips.push({ id: `size-${size}`, label: `Size: ${size}` })
    );
    if (inStockOnly) {
      chips.push({ id: 'stock', label: 'In stock only' });
    }
    return chips;
  }, [selectedCategories, maxPrice, selectedSizes, inStockOnly]);

  const hasActiveFilters = filterChips.length > 0;

  const removeChip = (keys: Set<any>) => {
    keys.forEach((key: any) => {
      const k = String(key);
      if (k.startsWith('cat-')) {
        const cat = k.slice(4);
        setSelectedCategories(prev => prev.filter(c => c !== cat));
      } else if (k === 'price') {
        setMaxPrice(100);
      } else if (k.startsWith('size-')) {
        const size = k.slice(5);
        setSelectedSizes(prev => prev.filter(s => s !== size));
      } else if (k === 'stock') {
        setInStockOnly(false);
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(100);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(100);
    setSelectedSizes([]);
    setInStockOnly(false);
  };

  return (
    <AppLayout>
    <AppLayout.Main>
      <Inset space={6}>
      <Stack space={6}>
        {/* Header */}
        <Stack space={2}>
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Columns columns={[3, 1, 'fit']} space={4} collapseAt="40em">
          <SearchField
            label="Search products"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name…"
          />
          <Select
            label="Sort by"
            value={sortBy}
            onChange={val => setSortBy(val as SortKey)}
          >
            <Select.Option id="newest">Newest</Select.Option>
            <Select.Option id="price-asc">Price: Low to High</Select.Option>
            <Select.Option id="price-desc">Price: High to Low</Select.Option>
            <Select.Option id="popular">Most Popular</Select.Option>
          </Select>
          <Drawer.Trigger>
            <Button variant="secondary">Filters</Button>
            <Drawer closeButton size="small">
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
                    label="Max price"
                    minValue={0}
                    maxValue={100}
                    value={maxPrice}
                    onChange={val => setMaxPrice(val as number)}
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
                <Button slot="close" onPress={resetFilters}>
                  Reset
                </Button>
                <Button slot="close" variant="primary">
                  Apply Filters
                </Button>
              </Drawer.Actions>
            </Drawer>
          </Drawer.Trigger>
        </Columns>

        {/* Applied Filters */}
        {hasActiveFilters ? (
          <Inline space={4} alignY="center">
            <Tag.Group aria-label="Applied filters" onRemove={removeChip}>
              {filterChips.map(chip => (
                <Tag key={chip.id} id={chip.id}>
                  {chip.label}
                </Tag>
              ))}
            </Tag.Group>
            <Button variant="ghost" onPress={clearAllFilters}>
              Clear all
            </Button>
          </Inline>
        ) : (
          <Text>No filters applied</Text>
        )}

        {/* Product Grid or Empty State */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
            action={
              <Button variant="primary" onPress={clearAllFilters}>
                Clear all filters
              </Button>
            }
          />
        ) : (
          <Tiles tilesWidth="260px" space={4} stretch equalHeight>
            {filteredProducts.map(product => {
              const displayStatus: ProductStatus | 'Sold Out' = product.inStock
                ? product.status
                : 'Sold Out';
              return (
                <Card key={product.id} p={4}>
                  <Stack space={3}>
                    <Headline level={2}>{product.name}</Headline>
                    <Inline space={2} alignY="center">
                      <Badge variant={statusBadgeVariant(displayStatus)}>
                        {displayStatus}
                      </Badge>
                      <Text weight="bold">${product.price.toFixed(2)}</Text>
                    </Inline>
                    <Text>{product.description}</Text>
                    <Button variant="primary" disabled={!product.inStock}>
                      Add to Cart
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </Tiles>
        )}

        {/* Pagination */}
        <Inline alignY="center">
          <Text>Page {currentPage} of 3</Text>
          <Split />
          <Pagination
            totalItems={24}
            pageSize={8}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </Inline>
      </Stack>
      </Inset>
    </AppLayout.Main>
    </AppLayout>
  );
}
