'use client';

import { useState, useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  EmptyState,
  Headline,
  Inline,
  Inset,
  Pagination,
  SearchField,
  Select,
  Slider,
  Stack,
  Switch,
  Text,
  Tiles,
} from '@marigold/components';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  size?: string;
  description: string;
  status: 'new' | 'sale' | 'normal';
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    price: 19.99,
    category: 'T-Shirts',
    size: 'M',
    description: 'Comfortable 100% cotton t-shirt perfect for everyday wear.',
    status: 'new',
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Hoodie',
    price: 49.99,
    category: 'Hoodies',
    size: 'L',
    description: 'Cozy hoodie with adjustable drawstring and kangaroo pocket.',
    status: 'normal',
    inStock: true,
  },
  {
    id: '3',
    name: 'Baseball Cap',
    price: 24.99,
    category: 'Accessories',
    description: 'Classic baseball cap with embroidered logo.',
    status: 'normal',
    inStock: true,
  },
  {
    id: '4',
    name: 'Vintage Poster',
    price: 14.99,
    category: 'Posters',
    description: 'High-quality vintage-style poster print.',
    status: 'sale',
    inStock: false,
  },
  {
    id: '5',
    name: 'Logo Sticker Pack',
    price: 5.99,
    category: 'Stickers',
    description: 'Set of 10 durable waterproof stickers.',
    status: 'normal',
    inStock: true,
  },
  {
    id: '6',
    name: 'Crew Neck Sweatshirt',
    price: 39.99,
    category: 'Hoodies',
    size: 'XL',
    description: 'Warm and stylish crew neck sweatshirt made from soft fabric.',
    status: 'normal',
    inStock: true,
  },
  {
    id: '7',
    name: 'Minimalist Art Print',
    price: 12.99,
    category: 'Posters',
    description: 'Modern minimalist art print in neutral colors.',
    status: 'normal',
    inStock: false,
  },
  {
    id: '8',
    name: 'V-Neck T-Shirt',
    price: 21.99,
    category: 'T-Shirts',
    size: 'S',
    description: 'Sleek v-neck t-shirt in premium cotton blend.',
    status: 'new',
    inStock: true,
  },
];

type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

export default function TestApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  // Apply filters and search
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSize =
        selectedSizes.length === 0 ||
        !product.size ||
        selectedSizes.includes(product.size);
      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesStock
      );
    });
  }, [searchQuery, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        sorted.reverse();
        break;
      case 'newest':
      default:
        break;
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  // Reset pagination when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 100 ||
    selectedSizes.length > 0 ||
    inStockOnly;

  const activeFilters = [];
  if (searchQuery) activeFilters.push({ id: 'search', label: searchQuery });
  selectedCategories.forEach((cat) => {
    activeFilters.push({ id: `cat-${cat}`, label: cat });
  });
  if (priceRange[0] > 0 || priceRange[1] < 100) {
    activeFilters.push({
      id: 'price',
      label: `$${priceRange[0]} - $${priceRange[1]}`,
    });
  }
  selectedSizes.forEach((size) => {
    activeFilters.push({ id: `size-${size}`, label: size });
  });
  if (inStockOnly) activeFilters.push({ id: 'stock', label: 'In stock only' });

  const getStatusVariant = (status: string): any => {
    switch (status) {
      case 'new':
        return 'info';
      case 'sale':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'new':
        return 'New';
      case 'sale':
        return 'Sale';
      default:
        return 'Normal';
    }
  };

  return (
    <Container>
      <Stack space="group" alignX="left">
        {/* Header */}
        <Stack space="tight" alignX="left">
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Inline space="regular" alignY="center" alignX="left">
          <SearchField
            label="Search products"
            value={searchQuery}
            onChange={setSearchQuery}
            width={72}
          />
          <Select
            label="Sort by"
            selectedKey={sortBy}
            onSelectionChange={(key) =>
              handleFilterChange(() => setSortBy(key as SortOption))
            }
            width={48}
          >
            <Select.Option id="newest">Newest</Select.Option>
            <Select.Option id="price-low">Price: Low to High</Select.Option>
            <Select.Option id="price-high">Price: High to Low</Select.Option>
            <Select.Option id="popular">Most Popular</Select.Option>
          </Select>
          <Drawer.Trigger>
            <Button>Filters</Button>
            <Drawer>
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Content>
                <Stack space="group" alignX="left">
                  {/* Category Filter */}
                  <Stack space="tight" alignX="left">
                    <Text weight="bold">Category</Text>
                    <Checkbox.Group
                      value={selectedCategories}
                      onChange={(keys) =>
                        handleFilterChange(() =>
                          setSelectedCategories(keys as string[])
                        )
                      }
                    >
                      <Checkbox value="T-Shirts" label="T-Shirts" />
                      <Checkbox value="Hoodies" label="Hoodies" />
                      <Checkbox value="Accessories" label="Accessories" />
                      <Checkbox value="Posters" label="Posters" />
                      <Checkbox value="Stickers" label="Stickers" />
                    </Checkbox.Group>
                  </Stack>

                  {/* Price Range Filter */}
                  <Stack space="tight" alignX="left">
                    <Text weight="bold">Price Range</Text>
                    <Slider
                      label="Price"
                      value={priceRange}
                      minValue={0}
                      maxValue={100}
                      step={1}
                      onChange={(value: number | number[]) => {
                        setPriceRange(
                          Array.isArray(value) ? value : [value, 100]
                        );
                      }}
                      formatOptions={{
                        style: 'currency',
                        currency: 'USD',
                      }}
                      thumbLabels={['min', 'max']}
                    />
                  </Stack>

                  {/* Size Filter */}
                  <Stack space="tight" alignX="left">
                    <Text weight="bold">Size</Text>
                    <Checkbox.Group
                      value={selectedSizes}
                      onChange={(keys) =>
                        handleFilterChange(() =>
                          setSelectedSizes(keys as string[])
                        )
                      }
                    >
                      <Checkbox value="XS" label="XS" />
                      <Checkbox value="S" label="S" />
                      <Checkbox value="M" label="M" />
                      <Checkbox value="L" label="L" />
                      <Checkbox value="XL" label="XL" />
                    </Checkbox.Group>
                  </Stack>

                  {/* Availability Filter */}
                  <Stack space="tight" alignX="left">
                    <Switch
                      label="In stock only"
                      selected={inStockOnly}
                      onChange={() =>
                        handleFilterChange(() => setInStockOnly(!inStockOnly))
                      }
                    />
                  </Stack>
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button
                  slot="close"
                  variant="secondary"
                  onPress={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 100]);
                    setSelectedSizes([]);
                    setInStockOnly(false);
                    setCurrentPage(1);
                  }}
                >
                  Reset
                </Button>
                <Button slot="close" variant="primary">
                  Apply Filters
                </Button>
              </Drawer.Actions>
            </Drawer>
          </Drawer.Trigger>
        </Inline>

        {/* Active Filters */}
        {hasActiveFilters ? (
          <Inline space="tight" alignY="center">
            {activeFilters.map((filter) => (
              <Badge key={filter.id} variant="default">
                <Inline space={1} alignY="center" noWrap>
                  <Text>{filter.label}</Text>
                  <Button
                    size="icon"
                    variant="ghost"
                    onPress={() => {
                      if (filter.id === 'search') {
                        handleFilterChange(() => setSearchQuery(''));
                      } else if (filter.id.startsWith('cat-')) {
                        const cat = filter.id.substring(4);
                        handleFilterChange(() =>
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== cat)
                          )
                        );
                      } else if (filter.id === 'price') {
                        handleFilterChange(() => setPriceRange([0, 100]));
                      } else if (filter.id.startsWith('size-')) {
                        const size = filter.id.substring(5);
                        handleFilterChange(() =>
                          setSelectedSizes(
                            selectedSizes.filter((s) => s !== size)
                          )
                        );
                      } else if (filter.id === 'stock') {
                        handleFilterChange(() => setInStockOnly(false));
                      }
                    }}
                  >
                    ×
                  </Button>
                </Inline>
              </Badge>
            ))}
            <Button
              variant="ghost"
              onPress={() => {
                setSearchQuery('');
                setSelectedCategories([]);
                setPriceRange([0, 100]);
                setSelectedSizes([]);
                setInStockOnly(false);
                setCurrentPage(1);
              }}
            >
              Clear all
            </Button>
          </Inline>
        ) : (
          <Text color="muted">No filters applied</Text>
        )}

        {/* Product Grid or Empty State */}
        {sortedProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
            action={
              <Button
                variant="primary"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                  setPriceRange([0, 100]);
                  setSelectedSizes([]);
                  setInStockOnly(false);
                  setCurrentPage(1);
                }}
              >
                Clear all filters
              </Button>
            }
          />
        ) : (
          <>
            <Tiles tilesWidth="220px" space={3} equalHeight>
              {paginatedProducts.map((product) => (
                <Card key={product.id} variant="default">
                  <Inset space={3}>
                    <Stack space="tight" alignX="left">
                      <Inline alignY="center" alignX="between" noWrap>
                        <Headline level={5}>{product.name}</Headline>
                        {product.status !== 'normal' && (
                          <Badge variant={getStatusVariant(product.status)}>
                            {getStatusLabel(product.status)}
                          </Badge>
                        )}
                      </Inline>
                      <Text weight="bold" color="brand">
                        ${product.price.toFixed(2)}
                      </Text>
                      <Text fontSize="xs">{product.description}</Text>
                      <Button
                        variant="primary"
                        fullWidth
                        disabled={!product.inStock}
                        onPress={() => {
                          if (product.inStock) {
                            alert(
                              `Added "${product.name}" to cart!`
                            );
                          }
                        }}
                      >
                        {product.inStock
                          ? 'Add to Cart'
                          : 'Sold Out'}
                      </Button>
                    </Stack>
                  </Inset>
                </Card>
              ))}
            </Tiles>

            {/* Pagination */}
            <Stack alignX="center">
              <Inline space="tight" alignY="center">
                <Text>
                  Page {currentPage} of {totalPages}
                </Text>
              </Inline>
              <Pagination
                totalItems={sortedProducts.length}
                pageSize={ITEMS_PER_PAGE}
                page={currentPage}
                onChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
}
