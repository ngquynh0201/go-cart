import BestSelling from './home/BestSelling';
import Hero from './home/Hero';
import LatestProducts from './home/LatestProducts';
import Newsletter from './home/Newsletter';
import OurSpecs from './home/OurSpec';

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
