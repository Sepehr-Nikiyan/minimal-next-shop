'use client';

import { useEffect, useState } from 'react';
import { supabase, Product, Category } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Filter, Grid, List } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesData) {
        setCategories(categoriesData);
      }

      fetchProducts();
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true);

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'price-low') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-high') {
      query = query.order('price', { ascending: false });
    }

    const { data } = await query;

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center animate-in fade-in-50 slide-in-from-top-5">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Digital Products
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Browse our curated collection of premium digital goods
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between animate-in fade-in-50 slide-in-from-top-5 animation-delay-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-slate-600" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="transition-all"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="transition-all"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className={`${viewMode === 'grid' ? 'h-48' : 'h-32'} bg-slate-200`}></div>
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {products.map((product, index) => (
              <Card
                key={product.id}
                className={`overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg group animate-in fade-in-50 ${
                  viewMode === 'grid' ? 'slide-in-from-bottom-5' : 'slide-in-from-left-5'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                  <div className={`relative ${viewMode === 'grid' ? 'h-48 w-full' : 'h-full w-48'} overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200`}>
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.is_featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {product.description}
                      </CardDescription>
                      {product.category && (
                        <Badge variant="outline" className="w-fit mt-2">
                          {product.category.name}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center mt-auto">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      <Button asChild variant="outline" className="group/button hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                        <Link href={`/products/${product.slug}`}>
                          View Details
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-in fade-in-50">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Filter className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">No products found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your filters or check back later</p>
            <Button onClick={() => { setSelectedCategory('all'); setSortBy('newest'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
