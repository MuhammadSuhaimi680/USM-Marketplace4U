import Image from 'next/image';
import { products, users } from '@/lib/data';
import type { Product, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product: Product | undefined = products.find((p) => p.id === params.id);
  const seller: User | undefined = users.find(
    (u) => u.id === product?.sellerId
  );

  if (!product || !seller) {
    return <div className="py-10 text-center">Product not found.</div>;
  }

  const whatsappLink = `https://wa.me/${seller.phone}?text=Hi, I'm interested in your '${product.name}' listing on USM Marketplace4U.`;

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.imageHint}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="font-headline text-3xl font-bold lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-3xl font-bold text-primary">
              RM{product.price.toFixed(2)}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Condition:</span>
              <Badge variant="outline">{product.condition}</Badge>
              <span className="font-medium">Posted:</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{seller.name}</CardTitle>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>5.0 (12 reviews)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Seller via WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
