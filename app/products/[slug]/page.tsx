'use client';

import { useEffect, useState } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Download, Check, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', params.slug)
        .eq('is_active', true)
        .maybeSingle();

      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [params.slug]);

  const handlePurchase = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    router.push(`/checkout?product=${product?.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-slate-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-slate-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-12 bg-slate-200 rounded"></div>
                <div className="h-24 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">Product Not Found</h1>
          <p className="text-slate-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-8 animate-in fade-in-50 slide-in-from-left-5">
          <Link href="/products">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-in fade-in-50 slide-in-from-left-10">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.is_featured && (
                <div className="absolute top-6 left-6">
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 px-4 py-2">
                    Featured Product
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-10">
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-3">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-4 text-slate-900">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-slate-600">(5.0)</span>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ${product.price}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3 text-slate-900">Description</h2>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 text-slate-900">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-0">
              <h3 className="font-semibold mb-4 text-slate-900 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                What's Included
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  Instant digital download
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Regular updates
                </li>
              </ul>
            </Card>

            <Button
              size="lg"
              className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              onClick={handlePurchase}
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              Purchase Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
