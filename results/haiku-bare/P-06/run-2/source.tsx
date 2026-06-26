import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Heading,
  HStack,
  VStack,
  TextField,
  Select,
  SelectItem,
  Slider,
  Text,
  Badge,
  Inline,
  Stack,
  Dialog,
  Popover,
  PopoverTrigger,
  PopoverContent,
  GridList,
  GridListItem,
} from '@marigold/components';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  inStock: boolean;
  description: string;
  status: 'new' | 'sale' | null;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic T-Shirt',
    price: 24.99,
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Comfortable cotton t-shirt perfect for everyday wear.',
    status: 'new',
  },
  {
    id: 2,
    name: 'Premium Hoodie',
    price: 54.99,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Warm and cozy hoodie made from soft fleece material.',
    status: null,
  },
  {
    id: 3,
    name: 'Baseball Cap',
    price: 19.99,
    category: 'Accessories',
    sizes: [],
    inStock: false,
    description: 'Classic baseball cap in multiple colors.',
    status: null,
  },
  {
    id: 4,
    name: 'Branded Poster',
    price: 14.99,
    category: 'Posters',
    sizes: [],
    inStock: true,
    description: 'High-quality poster to decorate your space.',
    status: 'sale',
  },
  {
    id: 5,
    name: 'Sticker Pack',
    price: 9.99,
    category: 'Stickers',
    sizes: [],
    inStock: true,
    description: 'Assorted stickers featuring our brand designs.',
    status: null,
  },
  {
    id: 6,
    name: 'Long Sleeve Tee',
    price: 29.99,
    category: 'T-Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: false,
    description: 'Versatile long-sleeve shirt for layering or solo wear.',
    status: null,
  },
  {
    id: 7,
    name: 'Zip Hoodie',
    price: 64.99,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Full-zip hoodie with kangaroo pocket.',
    status: 'new',
  },
  {
    id: 8,
    name: 'Tote Bag',
    price: 34.99,
    category: 'Accessories',
    sizes: [],
    inStock: true,
    description: 'Spacious canvas tote bag for shopping or everyday use.',
    status: null,
  },
];

const TestApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const PRODUCTS_PER_PAGE = 8;

  const filteredAndSorted = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
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
        selectedSizes.some((size) => product.sizes.includes(size));
      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesStock
      );
    });

    if (sortBy === 'newest') {
      result = [...result].reverse();
    } else if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result = [...result].reverse();
    }

    return result;
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const totalPages = Math.ceil(filteredAndSorted.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const activeFilters = [
    ...selectedCategories.map((c) => ({ type: 'category', value: c })),
    ...(priceRange[0] > 0 || priceRange[1] < 100
      ? [{ type: 'price', value: `$${priceRange[0]} - $${priceRange[1]}` }]
      : []),
    ...selectedSizes.map((s) => ({ type: 'size', value: s })),
    ...(inStockOnly ? [{ type: 'stock', value: 'In stock only' }] : []),
  ];

  const removeFilter = (type: string, value: string) => {
    if (type === 'category') {
      setSelectedCategories((prev) => prev.filter((c) => c !== value));
    } else if (type === 'price') {
      setPriceRange([0, 100]);
    } else if (type === 'size') {
      setSelectedSizes((prev) => prev.filter((s) => s !== value));
    } else if (type === 'stock') {
      setInStockOnly(false);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  return (
    <VStack gap="xl" p="xl">
      {/* Header */}
      <VStack gap="sm" alignItems="flex-start" width="100%">
        <Heading level={1}>Merchandise Store</Heading>
        <Text>Browse our collection of branded merchandise.</Text>
      </VStack>

      {/* Toolbar */}
      <HStack gap="md" width="100%">
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{ flex: 1, minWidth: '200px' }}
        />

        <Select
          value={sortBy}
          onChange={(value) => {
            setSortBy(value);
            setCurrentPage(1);
          }}
          style={{ minWidth: '180px' }}
        >
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="popular">Most Popular</SelectItem>
        </Select>

        <Button
          onPress={() => setFilterPanelOpen(true)}
          variant="secondary"
        >
          Filters
        </Button>
      </HStack>

      {/* Applied Filters */}
      {activeFilters.length > 0 ? (
        <HStack gap="sm" width="100%" wrap="wrap">
          {activeFilters.map((filter, idx) => (
            <Badge
              key={idx}
              onPress={() => removeFilter(filter.type, filter.value)}
            >
              {filter.value} ✕
            </Badge>
          ))}
          <Button
            onPress={clearAllFilters}
            variant="secondary"
            size="sm"
          >
            Clear all
          </Button>
        </HStack>
      ) : (
        <Text color="muted">No filters applied</Text>
      )}

      {/* Filter Panel */}
      <Dialog
        isOpen={filterPanelOpen}
        onOpenChange={setFilterPanelOpen}
        title="Filters"
      >
        <VStack gap="md" p="md">
          {/* Category */}
          <VStack gap="sm">
            <Text weight="bold">Category</Text>
            {CATEGORIES.map((category) => (
              <Checkbox
                key={category}
                checked={selectedCategories.includes(category)}
                onChange={(checked) => {
                  setSelectedCategories((prev) =>
                    checked
                      ? [...prev, category]
                      : prev.filter((c) => c !== category)
                  );
                }}
              >
                {category}
              </Checkbox>
            ))}
          </VStack>

          {/* Price Range */}
          <VStack gap="sm">
            <Text weight="bold">
              Price range: ${priceRange[0]} - ${priceRange[1]}
            </Text>
            <Slider
              minValue={0}
              maxValue={100}
              step={1}
              value={priceRange}
              onChange={(value) => setPriceRange(Array.isArray(value) ? value : [value, 100])}
            />
          </VStack>

          {/* Size */}
          <VStack gap="sm">
            <Text weight="bold">Size</Text>
            {SIZES.map((size) => (
              <Checkbox
                key={size}
                checked={selectedSizes.includes(size)}
                onChange={(checked) => {
                  setSelectedSizes((prev) =>
                    checked
                      ? [...prev, size]
                      : prev.filter((s) => s !== size)
                  );
                }}
              >
                {size}
              </Checkbox>
            ))}
          </VStack>

          {/* Availability */}
          <VStack gap="sm">
            <Checkbox
              checked={inStockOnly}
              onChange={setInStockOnly}
            >
              In stock only
            </Checkbox>
          </VStack>

          {/* Buttons */}
          <HStack gap="md" justifyContent="space-between">
            <Button
              onPress={resetFilters}
              variant="secondary"
            >
              Reset
            </Button>
            <Button
              onPress={() => {
                setFilterPanelOpen(false);
                setCurrentPage(1);
              }}
              variant="primary"
            >
              Apply Filters
            </Button>
          </HStack>
        </VStack>
      </Dialog>

      {/* Product Grid or Empty State */}
      {paginatedProducts.length === 0 ? (
        <VStack
          gap="md"
          alignItems="center"
          justifyContent="center"
          p="xl"
          style={{ minHeight: '300px', width: '100%' }}
        >
          <Heading level={2}>No products found</Heading>
          <Text>Try adjusting your filters or search query.</Text>
          <Button onPress={clearAllFilters}>Clear all filters</Button>
        </VStack>
      ) : (
        <GridList
          items={paginatedProducts}
          columns={{ mobile: 1, tablet: 2, desktop: 4 }}
          gap="md"
          width="100%"
        >
          {(product) => (
            <GridListItem key={product.id}>
              <Card>
                <CardBody p="md">
                  <VStack gap="sm">
                    <HStack justifyContent="space-between" alignItems="flex-start">
                      <Text weight="bold" size="lg">
                        {product.name}
                      </Text>
                      {!product.inStock && (
                        <Badge variant="error">Sold Out</Badge>
                      )}
                      {product.status === 'new' && (
                        <Badge variant="info">New</Badge>
                      )}
                      {product.status === 'sale' && (
                        <Badge variant="warning">Sale</Badge>
                      )}
                    </HStack>

                    <Text color="muted">${product.price.toFixed(2)}</Text>

                    <Text size="sm">{product.description}</Text>

                    <Button
                      onPress={() => {
                        console.log(`Added ${product.name} to cart`);
                      }}
                      disabled={!product.inStock}
                      variant="primary"
                      width="100%"
                    >
                      {product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </GridListItem>
          )}
        </GridList>
      )}

      {/* Pagination */}
      {filteredAndSorted.length > 0 && (
        <HStack gap="md" justifyContent="center" width="100%">
          <Button
            onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="secondary"
          >
            Previous
          </Button>

          <Text weight="bold">
            Page {currentPage} of {totalPages}
          </Text>

          <Button
            onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="secondary"
          >
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default TestApp;
