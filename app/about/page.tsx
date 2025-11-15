'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ShoppingBag, Users, Globe, Award, Shield, Zap, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-top-5">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
            About Us
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome to DigiShop
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your premier destination for high-quality digital products. We're committed to connecting
            creators with customers who value excellence and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in-50 slide-in-from-left-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To empower creators and consumers by providing a trusted marketplace for digital products.
              We believe in quality, security, and seamless user experiences that drive success for everyone.
            </p>
          </Card>

          <Card className="p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-in fade-in-50 slide-in-from-right-5">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To become the world's most trusted digital marketplace, where innovation meets accessibility.
              We envision a future where digital products transform lives and businesses globally.
            </p>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 animate-in fade-in-50">
            Why Choose DigiShop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-in fade-in-50 slide-in-from-bottom-5">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Trusted Community</h3>
              <p className="text-slate-600">
                Join thousands of satisfied customers who trust us for their digital product needs.
              </p>
            </div>

            <div className="text-center animate-in fade-in-50 slide-in-from-bottom-5 animation-delay-200">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Secure Platform</h3>
              <p className="text-slate-600">
                Your data and transactions are protected with industry-leading security measures.
              </p>
            </div>

            <div className="text-center animate-in fade-in-50 slide-in-from-bottom-5 animation-delay-400">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Instant Delivery</h3>
              <p className="text-slate-600">
                Get immediate access to your purchases. Download and start using them right away.
              </p>
            </div>
          </div>
        </div>

        <Card className="p-12 text-center bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-2xl animate-in fade-in-50 slide-in-from-bottom-10">
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Quality Guaranteed</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Every product on our platform is carefully curated to ensure it meets our high standards.
            Your satisfaction is our priority.
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-8 bg-white text-blue-600 hover:bg-slate-50 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Link href="/products">
              Explore Our Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
