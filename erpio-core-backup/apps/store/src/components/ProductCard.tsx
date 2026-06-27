import { Product } from '@erpio/shared';
import { Button } from '@repo/ui';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card flex flex-col">
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{product.name}</h3>
        <p className="text-sm text-zinc-500 mb-4">SKU: {product.sku}</p>
      </div>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-100">
        <span className="text-xl font-bold text-emerald-600">{product.price.toFixed(2)} ₽</span>
        <Button className="accent-button">В корзину</Button>
      </div>
    </div>
  );
}
