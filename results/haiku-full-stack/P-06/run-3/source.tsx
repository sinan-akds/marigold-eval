import { useState, useMemo } from 'react';
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
  description: string;
  status: 'new' | 'sale' | 'sold-out';
  category: 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  inStock: boolean;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Logo T-Shirt',
    price: 29.99,
    description: 'Comfortable cotton t-shirt with embroidered logo.',
    status: 'new',
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    price: 59.99,
    description: 'Warm fleece hoodie perfect for cold weather.',
    status: 'sale',
    category: 'Hoodies',
    size: 'L',
    inStock: true,
  },
  {
    id: '3',
    name: 'Vintage Band Poster',
    price: 19.99,
    description: 'High-quality poster featuring iconic band artwork.',
    status: 'new',
    category: 'Posters',
    inStock: true,
  },
  {
    id: '4',
    name: 'Logo Cap',
    price: 24.99,
    description: 'Adjustable cap with embroidered logo patch.',
    status: 'sold-out',
    category: 'Accessories',
    inStock: false,
  },
  {
    id: '5',
    name: 'Sticker Pack',
    price: 9.99,
    description: 'Set of 10 vinyl stickers with band logos.',
    status: 'new',
    category: 'Stickers',
    inStock: true,
  },
  {
    id: '6',
    name: 'Crew Neck Sweatshirt',
    price: 49.99,
    description: 'Soft sweatshirt with screen-printed design.',
    status: 'sale',
    category: 'Hoodies',
    size: 'M',
    inStock: true,
  },
  {
    id: '7',
    name: 'Branded Tote Bag',
    price: 34.99,
    description: 'Durable canvas tote with company branding.',
    status: 'sold-out',
    category: 'Accessories',
    inStock: false,
  },
  {
    id: '8',
    name: 'Concert T-Shirt',
    price: 29.99,
    description: 'Limited edition concert merchandise t-shirt.',
    status: 'new',
    category: 'T-Shirts',
    size: 'S',
    inStock: true,
  },
];

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    let filtered = SAMPLE_PRODUCTS.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesCategory =
        selectedCategories.size === 0 ||
        selectedCategories.has(product.category);

      const matchesSize =
        selectedSizes.size === 0 ||
        (product.size && selectedSizes.has(product.size));

      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesCategory &&
        matchesSize &&
        matchesStock
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return b.id.localeCompare(a.id);
        case 'newest':
        default:
          return a.id.localeCompare(b.id);
      }
    });

    return filtered;
  }, [searchQuery, sortOrder, priceRange, selectedCategories, selectedSizes, inStockOnly]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasActiveFilters =
    searchQuery !== '' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100 ||
    selectedCategories.size > 0 ||
    selectedSizes.size > 0 ||
    inStockOnly;

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 100]);
    setSelectedCategories(new Set());
    setSelectedSizes(new Set());
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (keys: Set<string | number>) => {
    const filterArray = Array.from(keys);
    filterArray.forEach(key => {
      const strKey = String(key);
      if (strKey.startsWith('category-')) {
        const category = strKey.replace('category-', '');
        setSelectedCategories(prev => {
          const next = new Set(prev);
          next.delete(category);
          return next;
        });
      } else if (strKey.startsWith('size-')) {
        const size = strKey.replace('size-', '');
        setSelectedSizes(prev => {
          const next = new Set(prev);
          next.delete(size);
          return next;
        });
      } else if (strKey === 'in-stock') {
        setInStockOnly(false);
      } else if (strKey === 'price') {
        setPriceRange([0, 100]);
      } else if (strKey.startsWith('search-')) {
        setSearchQuery('');
      }
    });
  };

  const appliedFilterTags = (() => {
    const tags: Array<{ id: string; label: string }> = [];

    if (searchQuery) {
      tags.push({ id: 'search-query', label: `Search: "${searchQuery}"` });
    }

    selectedCategories.forEach(cat => {
      tags.push({ id: `category-${cat}`, label: `Category: ${cat}` });
    });

    selectedSizes.forEach(size => {
      tags.push({ id: `size-${size}`, label: `Size: ${size}` });
    });

    if (priceRange[0] !== 0 || priceRange[1] !== 100) {
      tags.push({
        id: 'price',
        label: `Price: $${priceRange[0]} - $${priceRange[1]}`,
      });
    }

    if (inStockOnly) {
      tags.push({ id: 'in-stock', label: 'In stock only' });
    }

    return tags;
  })();

  return (
    <AppLayout>
      <AppLayout.Main>
        <Stack space={6}>
          {/* Header */}
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>

          {/* Toolbar */}
          <Columns columns={[8, 'fit', 'fit']} space={3} collapseAt="40em">
            <SearchField
              label="Search products"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name..."
            />
            <Select
              label="Sort by"
              value={sortOrder}
              onSelectionChange={(value: string | number | null) => {
                if (value !== null) {
                  setSortOrder(String(value));
                }
              }}
              width="fit"
            >
              <Select.Option id="newest">Newest</Select.Option>
              <Select.Option id="price-low">Price: Low to High</Select.Option>
              <Select.Option id="price-high">Price: High to Low</Select.Option>
              <Select.Option id="popular">Most Popular</Select.Option>
            </Select>
            <Button
              variant="secondary"
              onPress={() => setFilterOpen(true)}
            >
              Filters
            </Button>
          </Columns>

          {/* Applied Filters */}
          {appliedFilterTags.length > 0 ? (
            <Tag.Group
              label="Applied Filters"
              onRemove={handleRemoveFilter}
              removeAll
            >
              {appliedFilterTags.map(tag => (
                <Tag key={tag.id} id={tag.id}>
                  {tag.label}
                </Tag>
              ))}
            </Tag.Group>
          ) : (
            <Text fontSize="sm" color="text-base-muted" fontStyle="italic">
              No filters applied
            </Text>
          )}

          {/* Filter Drawer */}
          <Drawer open={filterOpen} closeButton>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                {/* Category Filter */}
                <Stack space={2}>
                  <Headline level={2}>Category</Headline>
                  <Checkbox.Group
                    value={Array.from(selectedCategories)}
                    onChange={(values: string[]) => setSelectedCategories(new Set(values))}
                  >
                    <Checkbox value="T-Shirts" label="T-Shirts" />
                    <Checkbox value="Hoodies" label="Hoodies" />
                    <Checkbox value="Accessories" label="Accessories" />
                    <Checkbox value="Posters" label="Posters" />
                    <Checkbox value="Stickers" label="Stickers" />
                  </Checkbox.Group>
                </Stack>

                {/* Price Range Filter */}
                <Stack space={2}>
                  <Headline level={2}>Price Range</Headline>
                  <Slider
                    label="Price"
                    minValue={0}
                    maxValue={100}
                    step={5}
                    value={priceRange}
                    onChange={setPriceRange as (value: number | number[]) => void}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                  />
                </Stack>

                {/* Size Filter */}
                <Stack space={2}>
                  <Headline level={2}>Size</Headline>
                  <Checkbox.Group
                    value={Array.from(selectedSizes)}
                    onChange={(values: string[]) => setSelectedSizes(new Set(values))}
                  >
                    <Checkbox value="XS" label="XS" />
                    <Checkbox value="S" label="S" />
                    <Checkbox value="M" label="M" />
                    <Checkbox value="L" label="L" />
                    <Checkbox value="XL" label="XL" />
                  </Checkbox.Group>
                </Stack>

                {/* In Stock Filter */}
                <Stack space={2}>
                  <Headline level={2}>Availability</Headline>
                  <Switch
                    label="In stock only"
                    selected={inStockOnly}
                    onChange={setInStockOnly}
                  />
                </Stack>
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button
                variant="primary"
                onPress={() => setFilterOpen(false)}
                fullWidth
              >
                Apply Filters
              </Button>
              <Button
                variant="secondary"
                onPress={() => {
                  clearAllFilters();
                  setFilterOpen(false);
                }}
                fullWidth
              >
                Reset
              </Button>
            </Drawer.Actions>
          </Drawer>

          {/* Product Grid or Empty State */}
          {paginatedProducts.length > 0 ? (
            <>
              <Tiles tilesWidth="250px" space={4} stretch equalHeight>
                {paginatedProducts.map(product => (
                  <Card key={product.id}>
                    <Stack space={3}>
                      {/* Product Status Badge */}
                      <Inline alignX="between" alignY="top">
                        <Text weight="bold" fontSize="lg">{product.name}</Text>
                        <Badge
                          variant={
                            product.status === 'new'
                              ? 'info'
                              : product.status === 'sale'
                                ? 'warning'
                                : 'error'
                          }
                        >
                          {product.status === 'new'
                            ? 'New'
                            : product.status === 'sale'
                              ? 'Sale'
                              : 'Sold Out'}
                        </Badge>
                      </Inline>

                      {/* Price */}
                      <Text weight="bold" fontSize="lg">
                        ${product.price.toFixed(2)}
                      </Text>

                      {/* Description */}
                      <Text fontSize="sm">{product.description}</Text>

                      {/* Add to Cart Button */}
                      <Button
                        variant="primary"
                        disabled={!product.inStock}
                        fullWidth
                        onPress={() => {}}
                      >
                        {product.inStock ? 'Add to Cart' : 'Sold Out'}
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Tiles>

              {/* Pagination */}
              {totalPages > 1 && (
                <Inline alignX="center" alignY="center" space={4}>
                  <Text fontSize="sm">
                    Page {currentPage} of {totalPages}
                  </Text>
                  <Pagination
                    totalItems={filteredProducts.length}
                    pageSize={itemsPerPage}
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </Inline>
              )}
            </>
          ) : (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search query."
              action={
                hasActiveFilters && (
                  <Button variant="primary" onPress={clearAllFilters}>
                    Clear all filters
                  </Button>
                )
              }
            />
          )}
        </Stack>
      </AppLayout.Main>
    </AppLayout>
  );
};

export default TestApp;
