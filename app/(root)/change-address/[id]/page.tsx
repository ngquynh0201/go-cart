import ChangeAddress from '@/components/client/ChangeAddress';
import { getAddressById } from '@/lib/actions/user.action';

interface ChangeAddressPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ChangeAddressPage({ params }: ChangeAddressPageProps) {
    const { id } = await params;
    const address = await getAddressById(id);

    return (
        <div>
            <ChangeAddress id={id} address={address} />
        </div>
    );
}
