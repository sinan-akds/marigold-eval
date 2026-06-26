import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Checkbox,
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
  Tag,
  Text,
  Tiles,
} from '@marigold/components';

type Status = 'New' | 'Sale' | 'Sold Out';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: Status;
  description: string;
  sizes: string[];
  soldOut: boolean;
  popularity: number;
};

const PRODUCTS: Product[] = [
  { id: 1, name: 'Logo T-Shirt', price: 24.99, category: 'T-Shirts', status: 'New', description: 'Classic crew-neck tee with embroidered logo on the chest.', sizes: ['S', 'M', 'L', 'XL'], soldOut: false, popularity: 95 },
  { id: 2, name: 'Hoodie Pullover', price: 49.99, category: 'Hoodies', status: 'Sale', description: 'Warm fleece hoodie with kangaroo pocket and adjustable drawstring.', sizes: ['S', 'M', 'L', 'XL'], soldOut: false, popularity: 88 },
  { id: 3, name: 'Enamel Pin Set', price: 12.99, category: 'Accessories', status: 'New', description: 'Set of three collectible enamel pins with unique designs.', sizes: ['XS'], soldOut: false, popularity: 72 },
  { id: 4, name: 'Art Poster', price: 19.99, category: 'Posters', status: 'Sold Out', description: 'High-quality 18×24 inch art print on matte paper.', sizes: ['XS'], soldOut: true, popularity: 65 },
  { id: 5, name: 'Sticker Pack', price: 9.99, category: 'Stickers', status: 'New', description: 'Pack of 10 durable vinyl stickers for any surface.', sizes: ['XS'], soldOut: false, popularity: 90 },
  { id: 6, name: 'Zip-Up Hoodie', price: 59.99, category: 'Hoodies', status: 'Sold Out', description: 'Full-zip hoodie with side pockets and ribbed cuffs.', sizes: ['XS', 'S', 'M', 'L'], soldOut: true, popularity: 80 },
  { id: 7, name: 'Tote Bag', price: 14.99, category: 'Accessories', status: 'Sale', description: 'Durable canvas tote bag with logo print and inner pocket.', sizes: ['XS'], soldOut: false, popularity: 85 },
  { id: 8, name: 'Vintage Tee', price: 29.99, category: 'T-Shirts', status: 'New', description: 'Soft-washed vintage-style tee with distressed logo graphic.', sizes: ['XS', 'S', 'M', 'L', 'XL'], soldOut: false, popularity: 78 },
  { id: 9, name: 'Snapback Cap', price: 22.99, category: 'Accessories', status: 'New', description: 'Adjustable snapback cap with embroidered logo on the front.', sizes: ['XS'], soldOut: false, popularity: 76 },
  { id: 10, name: 'Graphic Tee', price: 27.99, category: 'T-Shirts', status: 'Sale', description: 'Bold graphic tee featuring limited-edition artwork.', sizes: ['S', 'M', 'L'], soldOut: false, popularity: 84 },
  { id: 11, name: 'Crewneck Sweatshirt', price: 44.99, category: 'Hoodies', status: 'New', description: 'Heavyweight crewneck sweatshirt in brushed fleece fabric.', sizes: ['S', 'M', 'L', 'XL'], soldOut: false, popularity: 70 },
  { id: 12, name: 'Landscape Poster', price: 17.99, category: 'Posters', status: 'New', description: 'Stunning landscape photography print, 24×36 inches.', sizes: ['XS'], soldOut: false, popularity: 60 },
  { id: 13, name: 'Clear Sticker Set', price: 7.99, category: 'Stickers', status: 'Sale', description: 'Transparent vinyl stickers that look great on any surface.', sizes: ['XS'], soldOut: false, popularity: 82 },
  { id: 14, name: 'Bomber Jacket', price: 89.99, category: 'Hoodies', status: 'New', description: 'Satin bomber jacket with ribbed trim and embroidered logo patch.', sizes: ['S', 'M', 'L'], soldOut: false, popularity: 91 },
  { id: 15, name: 'Phone Case', price: 15.99, category: 'Accessories', status: 'Sale', description: 'Slim hard-shell phone case with printed logo design.', sizes: ['XS'], soldOut: false, popularity: 68 },
  { id: 16, name: 'Pocket Tee', price: 21.99, category: 'T-Shirts', status: 'New', description: 'Lightweight pocket tee in premium combed cotton blend.', sizes: ['XS', 'S', 'M'], soldOut: false, popularity: 74 },
  { id: 17, name: 'Fleece Joggers', price: 39.99, category: 'Hoodies', status: 'Sale', description: 'Cozy fleece joggers with elastic waistband and deep pockets.', sizes: ['S', 'M', 'L', 'XL'], soldOut: false, popularity: 87 },
  { id: 18, name: 'Keychain', price: 8.99, category: 'Accessories', status: 'New', description: 'Durable metal keychain with enamel logo accent.', sizes: ['XS'], soldOut: false, popularity: 55 },
  { id: 19, name: 'Motivational Poster', price: 16.99, category: 'Posters', status: 'New', description: 'Inspirational typography print on premium matte paper.', sizes: ['XS'], soldOut: false, popularity: 63 },
  { id: 20, name: 'Holographic Sticker', price: 5.99, category: 'Stickers', status: 'New', description: 'Eye-catching holographic sticker with a foil finish.', sizes: ['XS'], soldOut: false, popularity: 79 },
  { id: 21, name: 'V-Neck Tee', price: 23.99, category: 'T-Shirts', status: 'Sale', description: 'Classic v-neck tee in a relaxed fit with soft jersey fabric.', sizes: ['XS', 'S', 'M', 'L', 'XL'], soldOut: false, popularity: 82 },
  { id: 22, name: 'Quarter-Zip', price: 54.99, category: 'Hoodies', status: 'New', description: 'Sporty quarter-zip pullover with moisture-wicking performance fabric.', sizes: ['S', 'M', 'L'], soldOut: false, popularity: 86 },
  { id: 23, name: 'Sunglasses', price: 34.99, category: 'Accessories', status: 'New', description: 'UV400 polarized sunglasses with a branded hard case.', sizes: ['XS'], soldOut: false, popularity: 71 },
  { id: 24, name: 'Abstract Poster', price: 21.99, category: 'Posters', status: 'Sale', description: 'Modern abstract art print, perfect for any living space.', sizes: ['XS'], soldOut: false, popularity: 67 },
];

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Accessories', 'Posters', 'Stickers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const PAGE_SIZE = 8;

function badgeVariant(status: Status) {
  if (status === 'New') return 'info' as const;
  if (status === 'Sale') return 'warning' as const;
  return 'error' as const;
}

export default function TestApp() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (categories.length > 0) {
      list = list.filter(p => categories.includes(p.category));
    }
    if (priceRange[0] > 0 || priceRange[1] < 100) {
      list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    if (sizes.length > 0) {
      list = list.filter(p => p.sizes.some(s => sizes.includes(s)));
    }
    if (inStock) {
      list = list.filter(p => !p.soldOut);
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'popular') list.sort((a, b) => b.popularity - a.popularity);

    return list;
  }, [search, sort, categories, priceRange, sizes, inStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageProducts = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const chips = [
    ...categories.map(c => ({ key: `cat-${c}`, label: c })),
    ...sizes.map(s => ({ key: `sz-${s}`, label: `Size: ${s}` })),
    ...(priceRange[0] > 0 || priceRange[1] < 100
      ? [{ key: 'price', label: `$${priceRange[0]}–$${priceRange[1]}` }]
      : []),
    ...(inStock ? [{ key: 'instock', label: 'In stock only' }] : []),
    ...(search.trim() ? [{ key: 'search', label: `"${search}"` }] : []),
  ];

  function removeChip(key: string) {
    if (key.startsWith('cat-')) {
      const cat = key.slice(4);
      setCategories(prev => prev.filter(c => c !== cat));
    } else if (key.startsWith('sz-')) {
      const sz = key.slice(3);
      setSizes(prev => prev.filter(s => s !== sz));
    } else if (key === 'price') {
      setPriceRange([0, 100]);
    } else if (key === 'instock') {
      setInStock(false);
    } else if (key === 'search') {
      setSearch('');
    }
    setPage(1);
  }

  function clearAll() {
    setSearch('');
    setCategories([]);
    setPriceRange([0, 100]);
    setSizes([]);
    setInStock(false);
    setPage(1);
  }

  function resetFilters() {
    setCategories([]);
    setPriceRange([0, 100]);
    setSizes([]);
    setInStock(false);
    setPage(1);
  }

  return (
    <Inset space={6}>
      <Stack space={6}>
        {/* Header */}
        <Stack space={2}>
          <Headline level={1}>Merchandise Store</Headline>
          <Text>Browse our collection of branded merchandise.</Text>
        </Stack>

        {/* Toolbar */}
        <Inline space={4} alignY="center">
          <SearchField
            label="Search"
            width={64}
            value={search}
            onChange={val => {
              setSearch(val);
              setPage(1);
            }}
          />
          <Select
            label="Sort by"
            width={56}
            value={sort}
            onChange={val => {
              setSort(String(val));
              setPage(1);
            }}
          >
            <Select.Option id="newest">Newest</Select.Option>
            <Select.Option id="price-asc">Price: Low to High</Select.Option>
            <Select.Option id="price-desc">Price: High to Low</Select.Option>
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
                    value={categories}
                    onChange={val => {
                      setCategories(val);
                      setPage(1);
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <Checkbox key={cat} value={cat} label={cat} />
                    ))}
                  </Checkbox.Group>

                  <Slider
                    label="Price range"
                    minValue={0}
                    maxValue={100}
                    value={priceRange}
                    thumbLabels={['min', 'max']}
                    onChange={val => {
                      setPriceRange(val as number[]);
                      setPage(1);
                    }}
                    formatOptions={{ style: 'currency', currency: 'USD' }}
                  />

                  <Checkbox.Group
                    label="Size"
                    value={sizes}
                    onChange={val => {
                      setSizes(val);
                      setPage(1);
                    }}
                  >
                    {SIZES.map(size => (
                      <Checkbox key={size} value={size} label={size} />
                    ))}
                  </Checkbox.Group>

                  <Switch
                    label="In stock only"
                    selected={inStock}
                    onChange={val => {
                      setInStock(Boolean(val));
                      setPage(1);
                    }}
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
        </Inline>

        {/* Applied filter chips */}
        <Inline space={2} alignY="center">
          {chips.length === 0 ? (
            <Text color="secondary">No filters applied</Text>
          ) : (
            <>
              <Tag.Group
                aria-label="Active filters"
                onRemove={(keys: Set<string>) => keys.forEach(k => removeChip(k))}
              >
                {chips.map(chip => (
                  <Tag key={chip.key} id={chip.key}>
                    {chip.label}
                  </Tag>
                ))}
              </Tag.Group>
              <Button variant="secondary" onPress={clearAll}>
                Clear all
              </Button>
            </>
          )}
        </Inline>

        {/* Product grid or empty state */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try adjusting your filters or search query."
            action={
              <Button variant="primary" onPress={clearAll}>
                Clear all filters
              </Button>
            }
          />
        ) : (
          <Tiles tilesWidth="260px" space={4} stretch equalHeight>
            {pageProducts.map(p => (
              <Card key={p.id} p={4}>
                <Stack space={3}>
                  <Inline alignX="between" alignY="center">
                    <Text weight="bold">{p.name}</Text>
                    <Badge variant={badgeVariant(p.status)}>{p.status}</Badge>
                  </Inline>
                  <Text weight="bold">${p.price.toFixed(2)}</Text>
                  <Text>{p.description}</Text>
                  <Button
                    variant="primary"
                    disabled={p.soldOut}
                    onPress={() => {}}
                  >
                    {p.soldOut ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </Stack>
              </Card>
            ))}
          </Tiles>
        )}

        {/* Pagination */}
        <Inline alignX="center" alignY="center" space={4}>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Pagination
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            page={currentPage}
            onChange={setPage}
          />
        </Inline>
      </Stack>
    </Inset>
  );
}
