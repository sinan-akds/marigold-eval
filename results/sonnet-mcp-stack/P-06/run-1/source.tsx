import { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Columns,
  Tiles,
  Inset,
  Split,
  Headline,
  Text,
  Badge,
  Card,
  EmptyState,
  SearchField,
  Select,
  Checkbox,
  Slider,
  Switch,
  Tag,
  Pagination,
  Drawer,
  Button,
} from '@marigold/components';

const PAGE_SIZE = 8;

type Status = 'New' | 'Sale' | null;

interface Product {
  id: string;
  name: string;
  price: number;
  status: Status;
  category: string;
  sizes: string[];
  description: string;
  soldOut: boolean;
  popularity: number;
}

const ALL_PRODUCTS: Product[] = [
  { id: '1', name: 'Logo T-Shirt', price: 29.99, status: 'New', category: 'T-Shirts', sizes: ['S', 'M', 'L'], description: 'Classic comfort fit with our signature logo on the front.', soldOut: false, popularity: 95 },
  { id: '2', name: 'Pullover Hoodie', price: 59.99, status: 'Sale', category: 'Hoodies', sizes: ['M', 'L', 'XL'], description: 'Warm fleece hoodie perfect for everyday wear.', soldOut: false, popularity: 88 },
  { id: '3', name: 'Embroidered Cap', price: 24.99, status: 'New', category: 'Accessories', sizes: ['S', 'M', 'L'], description: 'Structured cap with embroidered logo on the front panel.', soldOut: false, popularity: 72 },
  { id: '4', name: 'Artist Poster', price: 14.99, status: null, category: 'Posters', sizes: [], description: 'High-quality print of our latest exclusive artwork.', soldOut: false, popularity: 60 },
  { id: '5', name: 'Vinyl Sticker Set', price: 9.99, status: 'Sale', category: 'Stickers', sizes: [], description: 'Pack of 5 weatherproof stickers featuring brand designs.', soldOut: false, popularity: 80 },
  { id: '6', name: 'Zip-Up Hoodie', price: 69.99, status: null, category: 'Hoodies', sizes: ['S', 'M'], description: 'Lightweight zip-up with kangaroo pocket and contrast zipper.', soldOut: true, popularity: 55 },
  { id: '7', name: 'Graphic Tee', price: 34.99, status: 'New', category: 'T-Shirts', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'Bold graphic print on premium ringspun cotton.', soldOut: false, popularity: 91 },
  { id: '8', name: 'Logo Tote Bag', price: 19.99, status: null, category: 'Accessories', sizes: [], description: 'Durable canvas tote with screen-printed logo.', soldOut: true, popularity: 68 },
  { id: '9', name: 'Crew Neck Sweatshirt', price: 49.99, status: 'New', category: 'Hoodies', sizes: ['XS', 'S', 'M', 'L'], description: 'Classic sweatshirt with ribbed cuffs and collar.', soldOut: false, popularity: 77 },
  { id: '10', name: 'Enamel Pin Set', price: 12.99, status: 'Sale', category: 'Accessories', sizes: [], description: 'Set of 3 collectible enamel pins with logo designs.', soldOut: false, popularity: 85 },
  { id: '11', name: 'Tour T-Shirt', price: 39.99, status: null, category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], description: 'Exclusive tour tee with printed setlist on the back.', soldOut: false, popularity: 92 },
  { id: '12', name: 'Limited Poster', price: 24.99, status: 'New', category: 'Posters', sizes: [], description: 'Limited edition signed print from the latest tour.', soldOut: false, popularity: 75 },
  { id: '13', name: 'Holographic Stickers', price: 7.99, status: null, category: 'Stickers', sizes: [], description: 'Shimmering holographic sticker pack, 6 designs.', soldOut: false, popularity: 66 },
  { id: '14', name: 'Snapback Cap', price: 27.99, status: 'Sale', category: 'Accessories', sizes: ['S', 'M', 'L'], description: 'Adjustable snapback with embroidered patch.', soldOut: false, popularity: 73 },
  { id: '15', name: 'Oversized Tee', price: 32.99, status: 'New', category: 'T-Shirts', sizes: ['M', 'L', 'XL'], description: 'Relaxed oversized fit with dropped shoulders.', soldOut: false, popularity: 82 },
  { id: '16', name: 'Vintage Hoodie', price: 74.99, status: null, category: 'Hoodies', sizes: ['S', 'M', 'L', 'XL'], description: 'Washed-out vintage style hoodie with retro print.', soldOut: false, popularity: 78 },
  { id: '17', name: 'Tote Bag Deluxe', price: 22.99, status: 'New', category: 'Accessories', sizes: [], description: 'Premium canvas tote with interior pocket and zipper.', soldOut: false, popularity: 70 },
  { id: '18', name: 'Poster Bundle', price: 29.99, status: 'Sale', category: 'Posters', sizes: [], description: 'Bundle of 3 posters at a discounted price.', soldOut: false, popularity: 65 },
  { id: '19', name: 'Die-Cut Stickers', price: 11.99, status: null, category: 'Stickers', sizes: [], description: 'Custom die-cut stickers with unique character designs.', soldOut: false, popularity: 58 },
  { id: '20', name: 'Long Sleeve Tee', price: 36.99, status: 'New', category: 'T-Shirts', sizes: ['XS', 'S', 'M', 'L'], description: 'Comfortable long sleeve with minimalist design.', soldOut: false, popularity: 83 },
  { id: '21', name: 'Premium Zip Hoodie', price: 79.99, status: null, category: 'Hoodies', sizes: ['M', 'L', 'XL'], description: 'Premium full-zip hoodie with custom metal zipper pulls.', soldOut: false, popularity: 79 },
  { id: '22', name: 'Beanie Hat', price: 18.99, status: 'Sale', category: 'Accessories', sizes: ['S', 'M', 'L'], description: 'Warm knitted beanie with woven logo patch.', soldOut: false, popularity: 87 },
  { id: '23', name: 'Photo Print Tee', price: 31.99, status: 'New', category: 'T-Shirts', sizes: ['S', 'M', 'L', 'XL'], description: 'All-over photographic print on a comfortable base.', soldOut: false, popularity: 76 },
  { id: '24', name: 'Art Print Deluxe', price: 34.99, status: null, category: 'Posters', sizes: [], description: 'Gallery-quality art print on heavyweight stock.', soldOut: false, popularity: 71 },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

function getStatusVariant(displayStatus: string) {
  if (displayStatus === 'New') return 'info' as const;
  if (displayStatus === 'Sale') return 'warning' as const;
  if (displayStatus === 'Sold Out') return 'error' as const;
  return 'default' as const;
}

export default function TestApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSorted = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (inStockOnly) {
      result = result.filter(p => !p.soldOut);
    }

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'most-popular') {
      result.sort((a, b) => b.popularity - a.popularity);
    }

    return result;
  }, [searchQuery, sortBy, selectedCategories, priceRange, selectedSizes, inStockOnly]);

  const totalItems = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredSorted.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE
  );

  const appliedFilters = [
    ...selectedCategories.map(c => ({ id: `cat-${c}`, label: c })),
    ...(priceRange[0] > 0 || priceRange[1] < 100
      ? [{ id: 'price', label: `$${priceRange[0]}–$${priceRange[1]}` }]
      : []),
    ...selectedSizes.map(s => ({ id: `size-${s}`, label: `Size: ${s}` })),
    ...(inStockOnly ? [{ id: 'in-stock', label: 'In stock only' }] : []),
  ];

  const handleRemoveFilter = (keys: Set<string | number>) => {
    const arr = Array.from(keys).map(String);
    const catsToRemove = arr.filter(k => k.startsWith('cat-')).map(k => k.slice(4));
    const sizesToRemove = arr.filter(k => k.startsWith('size-')).map(k => k.slice(5));
    if (catsToRemove.length > 0) {
      setSelectedCategories(prev => prev.filter(c => !catsToRemove.includes(c)));
    }
    if (arr.includes('price')) {
      setPriceRange([0, 100]);
    }
    if (sizesToRemove.length > 0) {
      setSelectedSizes(prev => prev.filter(s => !sizesToRemove.includes(s)));
    }
    if (arr.includes('in-stock')) {
      setInStockOnly(false);
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <Inset space={6}>
      <Stack space={6}>
        {/* Page header */}
        <Stack space={2}>
          <Headline level="1">Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Columns columns={[6, 2, 'fit']} space={4} collapseAt="30em">
          <SearchField
            aria-label="Search products"
            value={searchQuery}
            onChange={(val: string) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search products…"
          />
          <Select
            aria-label="Sort by"
            value={sortBy}
            onChange={(val) => {
              setSortBy(String(val));
              setCurrentPage(1);
            }}
            width="full"
          >
            <Select.Option id="newest">Newest</Select.Option>
            <Select.Option id="price-low-high">Price: Low to High</Select.Option>
            <Select.Option id="price-high-low">Price: High to Low</Select.Option>
            <Select.Option id="most-popular">Most Popular</Select.Option>
          </Select>
          <Drawer.Trigger>
            <Button variant="secondary">Filters</Button>
            <Drawer size="small" closeButton>
              <Drawer.Title>Filters</Drawer.Title>
              <Drawer.Content>
                <Stack space={6}>
                  <Checkbox.Group
                    label="Category"
                    value={selectedCategories}
                    onChange={(val: string[]) => setSelectedCategories(val)}
                  >
                    {CATEGORIES.map(cat => (
                      <Checkbox key={cat} value={cat} label={cat} />
                    ))}
                  </Checkbox.Group>
                  <Slider
                    label="Price range"
                    value={priceRange as number[]}
                    onChange={(val: number | number[]) => {
                      const arr = Array.isArray(val) ? val : [val, priceRange[1]];
                      setPriceRange([arr[0], arr[1]]);
                    }}
                    minValue={0}
                    maxValue={100}
                    step={1}
                    thumbLabels={['min', 'max']}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                  />
                  <Checkbox.Group
                    label="Size"
                    value={selectedSizes}
                    onChange={(val: string[]) => setSelectedSizes(val)}
                  >
                    {SIZES.map(size => (
                      <Checkbox key={size} value={size} label={size} />
                    ))}
                  </Checkbox.Group>
                  <Switch
                    label="In stock only"
                    selected={inStockOnly}
                    onChange={(val: boolean) => setInStockOnly(val)}
                  />
                </Stack>
              </Drawer.Content>
              <Drawer.Actions>
                <Button slot="close" onPress={clearAllFilters}>
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
        <Inline space={3} alignY="center">
          <Tag.Group
            aria-label="Applied filters"
            onRemove={handleRemoveFilter}
            emptyState={() => (
              <Text color="text-primary-muted">No filters applied</Text>
            )}
          >
            {appliedFilters.map(({ id, label }) => (
              <Tag key={id} id={id}>
                {label}
              </Tag>
            ))}
          </Tag.Group>
          {appliedFilters.length > 0 && (
            <Button variant="secondary" onPress={clearAllFilters}>
              Clear all
            </Button>
          )}
        </Inline>

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
          <Tiles tilesWidth="280px" space={4} stretch>
            {paginatedProducts.map(product => {
              const displayStatus = product.soldOut
                ? 'Sold Out'
                : product.status ?? null;
              return (
                <Card key={product.id} p={4}>
                  <Stack space={3}>
                    {displayStatus && (
                      <Badge variant={getStatusVariant(displayStatus)}>
                        {displayStatus}
                      </Badge>
                    )}
                    <Headline level="4">{product.name}</Headline>
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
              );
            })}
          </Tiles>
        )}

        {/* Pagination */}
        <Inline alignY="center">
          <Text>Page {clampedPage} of {totalPages}</Text>
          <Split />
          <Pagination
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            page={clampedPage}
            onChange={(page: number) => setCurrentPage(page)}
          />
        </Inline>
      </Stack>
    </Inset>
  );
}
