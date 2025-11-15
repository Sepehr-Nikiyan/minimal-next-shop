'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase, Product } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard, Check, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const productId = searchParams.get('product');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .maybeSingle();

    if (data) {
      setProduct(data);
    } else {
      router.push('/products');
    }
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!product || !user) return;

    setProcessing(true);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: product.price,
        status: 'completed',
      })
      .select()
      .single();

    if (orderError || !order) {
      toast({
        title: 'Error',
        description: 'Failed to create order',
        variant: 'destructive',
      });
      setProcessing(false);
      return;
    }

    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: product.id,
        price: product.price,
      });

    if (itemError) {
      toast({
        title: 'Error',
        description: 'Failed to add product to order',
        variant: 'destructive',
      });
      setProcessing(false);
      return;
    }

    setSuccess(true);
    setProcessing(false);

    setTimeout(() => {
      router.push('/account');
    }, 2000);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-2xl animate-in fade-in-50 zoom-in-95">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Purchase Successful!</h2>
            <p className="text-slate-600 mb-6">
              Your order has been completed. Redirecting to your account...
            </p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-8 animate-in fade-in-50 slide-in-from-left-5">
          <Link href={`/products/${product.slug}`}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Product
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-10">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">
                      {product.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>${product.price}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 mb-1">What happens next?</p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Instant access to your product</li>
                    <li>• Download link available immediately</li>
                    <li>• Order history saved in your account</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="animate-in fade-in-50 slide-in-from-right-10">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Complete your purchase securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-lg text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 text-sm mb-4">
                    This is a demo checkout. In a real application, you would integrate a payment processor like Stripe.
                  </p>
                  <Badge variant="outline" className="mb-2">Demo Mode</Badge>
                </div>

                <Separator />

                <Button
                  size="lg"
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  onClick={handlePurchase}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 w-5 h-5" />
                      Complete Purchase
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-slate-500">
                  By completing this purchase, you agree to our terms of service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
