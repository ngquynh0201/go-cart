import AdminLayout from '@/components/admin/home/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
