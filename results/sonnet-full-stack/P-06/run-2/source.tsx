import { useState } from 'react';
import {
  AppLayout,
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
  Columns,
  Drawer,
  EmptyState,
  Headline,
  Inset,
  Pagination,
  SearchField,
  Select,
  Slider,
  Stack,
  Switch,
  Tag,
  Text,
  Tiles,
  VisuallyHidden,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'new' | 'sale' | 'sold-out';
  description: string;
  category: string;
  sizes: string[];
  addedAt: number;
  popularity: number;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo Tee',
    price: 24.99,
    status: 'new',
    description: 'A comfortable cotton tee with our classic embroidered logo.',
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    addedAt: 8,
    popularity: 85,
  },
  {
    id: '2',
    name: 'Branded Hoodie',
    price: 49.99,
    status: 'sale',
    description: 'Stay cozy in this premium fleece hoodie with embroidered logo.',
    category: 'Hoodies',
    sizes: ['M', 'L', 'XL'],
    addedAt: 7,
    popularity: 92,
  },
  {
    id: '3',
    name: 'Logo Cap',
    price: 19.99,
    status: 'new',
    description: 'Adjustable snapback cap with an embossed brand logo.',
    category: 'Accessories',
    sizes: ['M'],
    addedAt: 6,
    popularity: 78,
  },
  {
    id: '4',
    name: 'Tour Poster',
    price: 12.99,
    status: 'new',
    description: 'Exclusive A2 glossy poster from our latest design collection.',
    category: 'Posters',
    sizes: ['M'],
    addedAt: 5,
    popularity: 65,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 7.99,
    status: 'sale',
    description: 'Set of 10 die-cut vinyl stickers in assorted fun designs.',
    category: 'Stickers',
    sizes: ['XS'],
    addedAt: 4,
    popularity: 70,
  },
  {
    id: '6',
    name: 'Vintage Wash Tee',
    price: 29.99,
    status: 'new',
    description: 'Soft vintage-wash cotton tee with a retro graphic print.',
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L'],
    addedAt: 3,
    popularity: 88,
  },
  {
    id: '7',
    name: 'Zip-Up Hoodie',
    price: 59.99,
    status: 'sold-out',
    description: 'Full-zip heavyweight hoodie perfect for colder days.',
    category: 'Hoodies',
    sizes: ['L', 'XL'],
    addedAt: 2,
    popularity: 95,
  },
  {
    id: '8',
    name: 'Enamel Pin Set',
    price: 14.99,
    status: 'sold-out',
    description: 'Set of 3 collectible enamel pins with gold plating finish.',
    category: 'Accessories',
    sizes: ['XS'],
    addedAt: 1,
    popularity: 80,
  },
];

const PAGE_SIZE = 3;

function getBadgeVariant(status: Product['status']) {
  if (status === 'new') return 'info' as const;
  if (status === 'sale') return 'warning' as const;
  return 'error' as const;
}

function getStatusLabel(status: Product['status']) {
  if (status === 'new') return 'New';
  if (status === 'sale') return 'Sale';
  return 'Sold Out';
}

export default function MerchandiseStore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(100);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = PRODUCTS.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (p.price > priceMax) return false;
    if (selectedSizes.length > 0 && !p.sizes.some(s => selectedSizes.includes(s))) return false;
    if (inStockOnly && p.status === 'sold-out') return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'popular') return b.popularity - a.popularity;
    return b.addedAt - a.addedAt;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = sortedProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const filterChips = [
    ...selectedCategories.map(c => ({ id: `cat-${c}`, label: `Category: ${c}` })),
    ...(priceMax < 100 ? [{ id: 'price', label: `Max price: $${priceMax}` }] : []),
    ...selectedSizes.map(s => ({ id: `size-${s}`, label: `Size: ${s}` })),
    ...(inStockOnly ? [{ id: 'instock', label: 'In stock only' }] : []),
  ];

  const handleRemoveChip = (keys: Set<string | number>) => {
    let newCategories = [...selectedCategories];
    let newSizes = [...selectedSizes];
    let newPriceMax = priceMax;
    let newInStockOnly = inStockOnly;

    keys.forEach(key => {
      const k = String(key);
      if (k === 'price') newPriceMax = 100;
      else if (k === 'instock') newInStockOnly = false;
      else if (k.startsWith('cat-')) newCategories = newCategories.filter(c => c !== k.slice(4));
      else if (k.startsWith('size-')) newSizes = newSizes.filter(s => s !== k.slice(5));
    });

    setSelectedCategories(newCategories);
    setSelectedSizes(newSizes);
    setPriceMax(newPriceMax);
    setInStockOnly(newInStockOnly);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceMax(100);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string | number | null) => {
    if (val !== null) setSortBy(String(val));
    setCurrentPage(1);
  };

  const handleCategoriesChange = (val: string[]) => {
    setSelectedCategories(val);
    setCurrentPage(1);
  };

  const handleSizesChange = (val: string[]) => {
    setSelectedSizes(val);
    setCurrentPage(1);
  };

  const handlePriceMaxChange = (val: number | number[]) => {
    setPriceMax(Array.isArray(val) ? val[0] : val);
    setCurrentPage(1);
  };

  const handleInStockOnlyChange = (val: boolean) => {
    setInStockOnly(val);
    setCurrentPage(1);
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
            <Columns columns={[1, 'fit', 'fit']} space={3} collapseAt="30em">
              <SearchField
                aria-label="Search products"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Select
                aria-label="Sort by"
                value={sortBy}
                onChange={handleSortChange}
                width="fit"
              >
                <Select.Option id="newest">Newest</Select.Option>
                <Select.Option id="price-low">Price: Low to High</Select.Option>
                <Select.Option id="price-high">Price: High to Low</Select.Option>
                <Select.Option id="popular">Most Popular</Select.Option>
              </Select>
              <Drawer.Trigger>
                <Button variant="secondary">Filters</Button>
                <Drawer closeButton size="medium">
                  <Drawer.Title>Filters</Drawer.Title>
                  <Drawer.Content>
                    <Stack space={6}>
                      <CheckboxGroup
                        label="Category"
                        value={selectedCategories}
                        onChange={handleCategoriesChange}
                      >
                        <Checkbox value="T-Shirts" label="T-Shirts" />
                        <Checkbox value="Hoodies" label="Hoodies" />
                        <Checkbox value="Accessories" label="Accessories" />
                        <Checkbox value="Posters" label="Posters" />
                        <Checkbox value="Stickers" label="Stickers" />
                      </CheckboxGroup>

                      <Slider
                        label="Max price"
                        minValue={0}
                        maxValue={100}
                        value={priceMax}
                        onChange={handlePriceMaxChange}
                        formatOptions={{ style: 'currency', currency: 'USD' }}
                      />

                      <CheckboxGroup
                        label="Size"
                        value={selectedSizes}
                        onChange={handleSizesChange}
                      >
                        <Checkbox value="XS" label="XS" />
                        <Checkbox value="S" label="S" />
                        <Checkbox value="M" label="M" />
                        <Checkbox value="L" label="L" />
                        <Checkbox value="XL" label="XL" />
                      </CheckboxGroup>

                      <Switch
                        label="In stock only"
                        selected={inStockOnly}
                        onChange={handleInStockOnlyChange}
                      />
                    </Stack>
                  </Drawer.Content>
                  <Drawer.Actions>
                    <Button onPress={clearAllFilters}>Reset</Button>
                    <Button
                      slot="close"
                      variant="primary"
                      onPress={() => setCurrentPage(1)}
                    >
                      Apply Filters
                    </Button>
                  </Drawer.Actions>
                </Drawer>
              </Drawer.Trigger>
            </Columns>

            {/* Applied filter chips */}
            <Tag.Group
              label="Applied filters"
              onRemove={handleRemoveChip}
              removeAll={filterChips.length > 0}
              emptyState={() => (
                <Text color="foreground-muted" fontStyle="italic">
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

            {/* Section heading for screen readers */}
            <VisuallyHidden>
              <Headline level={2}>Products</Headline>
            </VisuallyHidden>

            {/* Product grid or empty state */}
            {paginatedProducts.length === 0 ? (
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
              <Tiles tilesWidth="280px" space={4} stretch equalHeight>
                {paginatedProducts.map(product => (
                  <Card key={product.id} p={4}>
                    <Stack space={3}>
                      <Badge variant={getBadgeVariant(product.status)}>
                        {getStatusLabel(product.status)}
                      </Badge>
                      <Headline level={3}>{product.name}</Headline>
                      <Text weight="bold">${product.price.toFixed(2)}</Text>
                      <Text fontSize="sm">{product.description}</Text>
                      <Button
                        variant="primary"
                        disabled={product.status === 'sold-out'}
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
              <Stack space={2} alignX="center">
                <Text>
                  Page {safePage} of {totalPages}
                </Text>
                <Pagination
                  totalItems={filteredProducts.length}
                  pageSize={PAGE_SIZE}
                  page={safePage}
                  onChange={setCurrentPage}
                />
              </Stack>
            )}
          </Stack>
        </Inset>
      </AppLayout.Main>
    </AppLayout>
  );
}
