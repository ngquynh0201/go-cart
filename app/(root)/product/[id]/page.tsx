import ProductDetails from '@/components/client/ProductDetails';
import { getProductById } from '@/lib/actions/product.action';

interface ProductDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    return <ProductDetails id={id} product={product} />;
}
