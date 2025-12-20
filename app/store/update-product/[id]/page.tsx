import UpdateProduct from '@/components/store/UpdateProduct';

interface UpdateProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function UpdateProductPage({ params }: UpdateProductPageProps) {
    const { id } = await params;

    return <UpdateProduct id={id} />;
}
