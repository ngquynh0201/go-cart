import Banner from '@/components/client/home/Banner';
import Footer from '@/components/client/home/Footer';
import Navbar from '@/components/client/home/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
