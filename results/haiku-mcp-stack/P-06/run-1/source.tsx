import { useState, useMemo } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Drawer,
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
  id: number;
  name: string;
  price: number;
  status: 'New' | 'Sale' | 'Sold Out' | undefined;
  description: string;
  soldOut: boolean;
  category: 'T-Shirts' | 'Hoodies' | 'Accessories' | 'Posters' | 'Stickers';
  size?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Classic Logo T-Shirt',
    price: 24.99,
    status: 'New',
    description: 'High-quality cotton t-shirt with our signature logo.',
    soldOut: false,
    category: 'T-Shirts',
    size: 'M',
    inStock: true,
  },
  {
    id: 2,
    name: 'Premium Hoodie',
    price: 59.99,
    status: 'Sale',
    description: 'Warm and comfortable hoodie perfect for any season.',
    soldOut: false,
    category: 'Hoodies',
    size: 'L',
    inStock: true,
  },
  {
    id: 3,
    name: 'Branded Cap',
    price: 19.99,
    status: undefined,
    description: 'Adjustable baseball cap with embroidered logo.',
    soldOut: false,
    category: 'Accessories',
    inStock: true,
  },
  {
    id: 4,
    name: 'Vintage Poster',
    price: 14.99,
    status: undefined,
    description: 'Limited edition vintage-style poster for your room.',
    soldOut: true,
    category: 'Posters',
    inStock: false,
  },
  {
    id: 5,
    name: 'Sticker Pack',
    price: 4.99,
    status: 'New',
    description: 'Set of 10 unique weatherproof stickers.',
    soldOut: false,
    category: 'Stickers',
    inStock: true,
  },
  {
    id: 6,
    name: 'Winter Beanie',
    price: 22.99,
    status: undefined,
    description: 'Cozy knit beanie for cold weather days.',
    soldOut: true,
    category: 'Accessories',
    inStock: false,
  },
  {
    id: 7,
    name: 'Retro Graphic Tee',
    price: 29.99,
    status: 'Sale',
    description: 'Retro-inspired design on premium cotton blend.',
    soldOut: false,
    category: 'T-Shirts',
    size: 'S',
    inStock: true,
  },
  {
    id: 8,
    name: 'Oversized Hoodie',
    price: 64.99,
    status: undefined,
    description: 'Relaxed fit oversized hoodie for ultimate comfort.',
    soldOut: false,
    category: 'Hoodies',
    size: 'XL',
    inStock: true,
  },
];

interface Filters {
  searchQuery: string;
  sortBy: string;
  categories: Set<string>;
  priceRange: [number, number];
  sizes: Set<string>;
  inStockOnly: boolean;
}

const TestApp = () => {
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    sortBy: 'newest',
    categories: new Set(),
    priceRange: [0, 100],
    sizes: new Set(),
    inStockOnly: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [tempFilters, setTempFilters] = useState<Filters>(filters);

  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const matchesCategory =
        filters.categories.size === 0 || filters.categories.has(product.category);

      const matchesPrice =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

      const matchesSize =
        filters.sizes.size === 0 ||
        (product.size && filters.sizes.has(product.size));

      const matchesStock = !filters.inStockOnly || product.inStock;

      return matchesSearch && matchesCategory && matchesPrice && matchesSize && matchesStock;
    });

    if (filters.sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'most-popular') {
      result.sort(() => Math.random() - 0.5);
    }

    return result;
  }, [filters]);

  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const hasActiveFilters =
    filters.searchQuery ||
    filters.categories.size > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 100 ||
    filters.sizes.size > 0 ||
    filters.inStockOnly;

  const getAppliedFiltersChips = () => {
    const chips = [];

    if (filters.searchQuery) {
      chips.push({ id: `search-${filters.searchQuery}`, label: `Search: ${filters.searchQuery}`, type: 'search' });
    }

    filters.categories.forEach(cat => {
      chips.push({ id: `cat-${cat}`, label: `Category: ${cat}`, type: 'category' });
    });

    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100) {
      chips.push({
        id: 'price',
        label: `Price: $${filters.priceRange[0]} - $${filters.priceRange[1]}`,
        type: 'price',
      });
    }

    filters.sizes.forEach(size => {
      chips.push({ id: `size-${size}`, label: `Size: ${size}`, type: 'size' });
    });

    if (filters.inStockOnly) {
      chips.push({ id: 'stock', label: 'In stock only', type: 'stock' });
    }

    return chips;
  };

  const removeChip = (chipId: string) => {
    const [type, value] = chipId.split('-');

    if (type === 'search') {
      setFilters(f => ({ ...f, searchQuery: '' }));
      setCurrentPage(1);
    } else if (type === 'cat') {
      setFilters(f => {
        const newCats = new Set(f.categories);
        newCats.delete(value);
        return { ...f, categories: newCats };
      });
      setCurrentPage(1);
    } else if (type === 'price') {
      setFilters(f => ({ ...f, priceRange: [0, 100] }));
      setCurrentPage(1);
    } else if (type === 'size') {
      setFilters(f => {
        const newSizes = new Set(f.sizes);
        newSizes.delete(value);
        return { ...f, sizes: newSizes };
      });
      setCurrentPage(1);
    } else if (type === 'stock') {
      setFilters(f => ({ ...f, inStockOnly: false }));
      setCurrentPage(1);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      sortBy: 'newest',
      categories: new Set(),
      priceRange: [0, 100],
      sizes: new Set(),
      inStockOnly: false,
    });
    setTempFilters({
      searchQuery: '',
      sortBy: 'newest',
      categories: new Set(),
      priceRange: [0, 100],
      sizes: new Set(),
      inStockOnly: false,
    });
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
  };

  const resetFilterPanel = () => {
    setTempFilters({
      searchQuery: filters.searchQuery,
      sortBy: filters.sortBy,
      categories: new Set(filters.categories),
      priceRange: [...filters.priceRange] as [number, number],
      sizes: new Set(filters.sizes),
      inStockOnly: filters.inStockOnly,
    });
  };

  const appliedChips = getAppliedFiltersChips();

  return (
    <Stack space={6} p={6}>
      {/* Header */}
      <Stack space={2}>
        <Headline level={1}>Merchandise Store</Headline>
        <Text>Browse our collection of branded merchandise.</Text>
      </Stack>

      {/* Toolbar */}
      <Inline space={4} alignY="input" noWrap>
        <SearchField
          label=""
          value={filters.searchQuery}
          onChange={(value: string) => {
            setFilters(f => ({ ...f, searchQuery: value }));
            setCurrentPage(1);
          }}
          placeholder="Search products..."
          width="200px"
        />
        <Select
          label=""
          selectedKey={filters.sortBy}
          onSelectionChange={(key: any) => {
            setFilters(f => ({ ...f, sortBy: key }));
          }}
          width="fit"
        >
          <Select.Option id="newest">Newest</Select.Option>
          <Select.Option id="price-low-high">Price: Low to High</Select.Option>
          <Select.Option id="price-high-low">Price: High to Low</Select.Option>
          <Select.Option id="most-popular">Most Popular</Select.Option>
        </Select>
        <Drawer.Trigger>
          <Button variant="secondary">Filters</Button>
          <Drawer>
            <Drawer.Title>Filters</Drawer.Title>
            <Drawer.Content>
              <Stack space={6}>
                {/* Category */}
                <Stack space={2}>
                  <Text weight="bold">Category</Text>
                  <Checkbox.Group
                    value={Array.from(tempFilters.categories)}
                    onChange={(keys: any) => {
                      setTempFilters(f => ({ ...f, categories: new Set(keys) }));
                    }}
                  >
                    <Checkbox value="T-Shirts" label="T-Shirts" />
                    <Checkbox value="Hoodies" label="Hoodies" />
                    <Checkbox value="Accessories" label="Accessories" />
                    <Checkbox value="Posters" label="Posters" />
                    <Checkbox value="Stickers" label="Stickers" />
                  </Checkbox.Group>
                </Stack>

                {/* Price Range */}
                <Stack space={2}>
                  <Text weight="bold">Price Range</Text>
                  <Slider
                    label=""
                    minValue={0}
                    maxValue={100}
                    step={5}
                    value={tempFilters.priceRange}
                    onChange={(value: any) => {
                      setTempFilters(f => ({ ...f, priceRange: value }));
                    }}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                    thumbLabels={['min', 'max']}
                  />
                </Stack>

                {/* Size */}
                <Stack space={2}>
                  <Text weight="bold">Size</Text>
                  <Checkbox.Group
                    value={Array.from(tempFilters.sizes)}
                    onChange={(keys: any) => {
                      setTempFilters(f => ({ ...f, sizes: new Set(keys) }));
                    }}
                  >
                    <Checkbox value="XS" label="XS" />
                    <Checkbox value="S" label="S" />
                    <Checkbox value="M" label="M" />
                    <Checkbox value="L" label="L" />
                    <Checkbox value="XL" label="XL" />
                  </Checkbox.Group>
                </Stack>

                {/* Availability */}
                <Stack space={2}>
                  <Text weight="bold">Availability</Text>
                  <Switch
                    label="In stock only"
                    onChange={(checked: boolean) => {
                      setTempFilters(f => ({ ...f, inStockOnly: checked }));
                    }}
                    isSelected={tempFilters.inStockOnly}
                  />
                </Stack>
              </Stack>
            </Drawer.Content>
            <Drawer.Actions>
              <Button
                variant="secondary"
                onPress={resetFilterPanel}
              >
                Reset
              </Button>
              <Button variant="primary" onPress={applyFilters} slot="close">
                Apply Filters
              </Button>
            </Drawer.Actions>
          </Drawer>
        </Drawer.Trigger>
      </Inline>

      {/* Applied Filters */}
      {appliedChips.length > 0 ? (
        <Stack space={3}>
          <Tag.Group
            onRemove={(keys: any) => {
              keys.forEach((key: string) => removeChip(key));
            }}
            removeAll
          >
            {appliedChips.map(chip => (
              <Tag key={chip.id} id={chip.id}>
                {chip.label}
              </Tag>
            ))}
          </Tag.Group>
          <Button variant="secondary" size="small" onPress={clearAllFilters}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <Text color="muted-foreground" fontStyle="italic">
          No filters applied
        </Text>
      )}

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <Stack space={4} alignX="center" alignY="center" stretch>
          <Headline level={2}>No products found</Headline>
          <Text>Try adjusting your filters or search query.</Text>
          <Button variant="primary" onPress={clearAllFilters}>
            Clear all filters
          </Button>
        </Stack>
      ) : (
        <>
          <Tiles tilesWidth="400px" space={4} equalHeight>
            {paginatedProducts.map(product => (
              <Card key={product.id} p={4}>
                <Stack space={3}>
                  {/* Status Badge */}
                  {product.status && (
                    <Text
                      fontSize="xs"
                      weight="bold"
                      color={
                        product.status === 'New'
                          ? 'success'
                          : product.status === 'Sale'
                            ? 'warning'
                            : 'destructive'
                      }
                    >
                      {product.status}
                    </Text>
                  )}

                  {/* Product Name */}
                  <Headline level={4}>{product.name}</Headline>

                  {/* Price */}
                  <Text weight="bold" fontSize="lg">
                    ${product.price.toFixed(2)}
                  </Text>

                  {/* Description */}
                  <Text fontSize="sm">{product.description}</Text>

                  {/* Add to Cart Button */}
                  <Button
                    variant={product.soldOut ? 'secondary' : 'primary'}
                    disabled={product.soldOut}
                    width="100%"
                  >
                    {product.soldOut ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>

          {/* Pagination */}
          {totalPages > 0 && (
            <Stack space={3} alignX="center">
              <Text fontSize="sm">
                Page {currentPage} of {totalPages}
              </Text>
              <Pagination
                totalItems={filteredProducts.length}
                pageSize={itemsPerPage}
                page={currentPage}
                onChange={(page: number) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};

export default TestApp;
