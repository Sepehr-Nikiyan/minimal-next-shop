import { generateStaticParams } from './generate-params';
import ProductContent from './product-content';

export { generateStaticParams };

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductContent params={params} />;
}
