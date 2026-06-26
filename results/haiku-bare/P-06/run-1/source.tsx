import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeading,
  CheckBox,
  Heading,
  HStack,
  Slider,
  Stack,
  Text,
  TextField,
  Select,
  Badge,
  Inline,
  Grid,
  Columns,
  Dialog,
} from "@marigold/components";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  size: string[];
  status: "new" | "sale" | "sold-out" | "regular";
  description: string;
  inStock: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 19.99,
    category: "T-Shirts",
    size: ["S", "M", "L", "XL"],
    status: "new",
    description: "High-quality cotton t-shirt in classic colors.",
    inStock: true,
  },
  {
    id: 2,
    name: "Premium Hoodie",
    price: 49.99,
    category: "Hoodies",
    size: ["XS", "S", "M", "L", "XL"],
    status: "regular",
    description: "Warm and comfortable hoodie perfect for any season.",
    inStock: true,
  },
  {
    id: 3,
    name: "Branded Cap",
    price: 24.99,
    category: "Accessories",
    size: ["One Size"],
    status: "sale",
    description: "Stylish cap with embroidered logo.",
    inStock: true,
  },
  {
    id: 4,
    name: "Poster Set",
    price: 34.99,
    category: "Posters",
    size: ["A3", "A2"],
    status: "regular",
    description: "Set of 3 premium quality posters.",
    inStock: false,
  },
  {
    id: 5,
    name: "Sticker Pack",
    price: 9.99,
    category: "Stickers",
    size: ["One Size"],
    status: "new",
    description: "Assorted vinyl stickers for laptops and phones.",
    inStock: true,
  },
  {
    id: 6,
    name: "Deluxe Hoodie",
    price: 59.99,
    category: "Hoodies",
    size: ["XS", "S", "M", "L", "XL"],
    status: "regular",
    description: "Premium merino wool blend hoodie with hidden pockets.",
    inStock: false,
  },
  {
    id: 7,
    name: "Crew Neck Shirt",
    price: 29.99,
    category: "T-Shirts",
    size: ["S", "M", "L", "XL"],
    status: "sale",
    description: "Trendy crew neck shirt in various colors.",
    inStock: true,
  },
  {
    id: 8,
    name: "Tote Bag",
    price: 39.99,
    category: "Accessories",
    size: ["One Size"],
    status: "regular",
    description: "Durable canvas tote bag with branded print.",
    inStock: true,
  },
];

const TestApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ["T-Shirts", "Hoodies", "Accessories", "Posters", "Stickers"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSize =
        selectedSizes.length === 0 ||
        selectedSizes.some((size) => product.size.includes(size));
      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesStock
      );
    });

    if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [
    searchTerm,
    sortBy,
    selectedCategories,
    priceRange,
    selectedSizes,
    inStockOnly,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  const handleClearFilter = (type: string, value?: string) => {
    if (type === "category" && value) {
      handleCategoryToggle(value);
    } else if (type === "price") {
      setPriceRange([0, 100]);
    } else if (type === "size" && value) {
      handleSizeToggle(value);
    } else if (type === "stock") {
      setInStockOnly(false);
    }
    setCurrentPage(1);
  };

  const activeFilters = [
    ...selectedCategories.map((c) => ({
      type: "category",
      label: c,
      value: c,
    })),
    ...(priceRange[0] !== 0 || priceRange[1] !== 100
      ? [
          {
            type: "price",
            label: `$${priceRange[0]}-$${priceRange[1]}`,
            value: undefined,
          },
        ]
      : []),
    ...selectedSizes.map((s) => ({
      type: "size",
      label: s,
      value: s,
    })),
    ...(inStockOnly
      ? [
          {
            type: "stock",
            label: "In stock only",
            value: undefined,
          },
        ]
      : []),
  ];

  const getStatusBadge = (status: string) => {
    if (status === "new") return <Badge>New</Badge>;
    if (status === "sale") return <Badge>Sale</Badge>;
    if (status === "sold-out") return <Badge>Sold Out</Badge>;
    return null;
  };

  return (
    <Stack space="large">
      <Box paddingX="large" paddingY="xlarge">
        <Heading level="1" align="center">
          Merchandise Store
        </Heading>
        <Text align="center" variant="bodySmall" color="muted">
          Browse our collection of branded merchandise.
        </Text>
      </Box>

      <Box paddingX="large">
        <Stack space="medium">
          <HStack space="medium" justifyContent="space-between" wrap>
            <Box width="medium" flexGrow>
              <TextField
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Box>

            <Box width="small">
              <Select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </Select>
            </Box>

            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </HStack>

          {showFilters && (
            <Card variant="filled">
              <CardHeading>Filter Products</CardHeading>
              <CardBody>
                <Stack space="large">
                  <Stack space="medium">
                    <Heading level="4">Category</Heading>
                    <Stack space="small">
                      {categories.map((category) => (
                        <CheckBox
                          key={category}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        >
                          {category}
                        </CheckBox>
                      ))}
                    </Stack>
                  </Stack>

                  <Stack space="medium">
                    <Heading level="4">Price Range</Heading>
                    <Text variant="bodySmall">
                      ${priceRange[0]} - ${priceRange[1]}
                    </Text>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={priceRange}
                      onChange={(value) => {
                        if (Array.isArray(value)) {
                          setPriceRange([value[0], value[1]]);
                        }
                      }}
                    />
                  </Stack>

                  <Stack space="medium">
                    <Heading level="4">Size</Heading>
                    <Stack space="small">
                      {sizes.map((size) => (
                        <CheckBox
                          key={size}
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        >
                          {size}
                        </CheckBox>
                      ))}
                    </Stack>
                  </Stack>

                  <CheckBox
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  >
                    In stock only
                  </CheckBox>

                  <HStack space="medium">
                    <Button onClick={handleApplyFilters}>Apply Filters</Button>
                    <Button variant="secondary" onClick={handleResetFilters}>
                      Reset
                    </Button>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          )}

          {activeFilters.length > 0 && (
            <HStack space="small" wrap>
              {activeFilters.map((filter) => (
                <Badge
                  key={`${filter.type}-${filter.value}`}
                  onRemove={() =>
                    handleClearFilter(filter.type, filter.value)
                  }
                >
                  {filter.label}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="small"
                onClick={handleResetFilters}
              >
                Clear all
              </Button>
            </HStack>
          )}

          {activeFilters.length === 0 && (
            <Text color="muted" variant="bodySmall">
              No filters applied
            </Text>
          )}
        </Stack>
      </Box>

      <Box paddingX="large">
        {filteredProducts.length === 0 ? (
          <Stack space="large" align="center" paddingY="xlarge">
            <Heading level="3">No products found</Heading>
            <Text color="muted">
              Try adjusting your filters or search query.
            </Text>
            <Button onClick={handleResetFilters}>Clear all filters</Button>
          </Stack>
        ) : (
          <Grid columns={[1, 2, 4]} gap="large">
            {paginatedProducts.map((product) => (
              <Card key={product.id} variant="elevated">
                <CardBody>
                  <Stack space="medium">
                    <HStack space="small" justifyContent="space-between">
                      <Heading level="5">{product.name}</Heading>
                      {getStatusBadge(product.status)}
                    </HStack>

                    <Text variant="bodySmall" color="muted">
                      {product.description}
                    </Text>

                    <Text weight="bold">${product.price.toFixed(2)}</Text>

                    <Button
                      disabled={!product.inStock}
                      width="full"
                    >
                      {product.inStock ? "Add to Cart" : "Sold Out"}
                    </Button>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Box>

      {filteredProducts.length > 0 && (
        <Box paddingX="large" paddingY="xlarge">
          <HStack space="medium" justifyContent="center">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            <Text>
              Page {currentPage} of {totalPages}
            </Text>

            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Next
            </Button>
          </HStack>
        </Box>
      )}
    </Stack>
  );
};

export default TestApp;
