import StoreShop from '@/components/client/StoreShop';

interface StoreShopPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function StoreShopPage({ params }: StoreShopPageProps) {
    const { username } = await params;

    return <StoreShop username={username} />;
}
