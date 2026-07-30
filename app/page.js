import HeroSection from '@/components/home/HeroSection'
import CategorySection from '@/components/home/CategorySection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import ShopByConcernSection from '@/components/home/ShopByConcernSection'
import WhyUsSection from '@/components/home/WhyUsSection'
import StatsSection from '@/components/home/StatsSection'
import WatchLoveSection from '@/components/home/WatchLoveSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ProjectsSection from '@/components/home/ProjectsSection'
import PressLogosSection from '@/components/home/PressLogosSection'
import InstagramFeedSection from '@/components/home/InstagramFeedSection'
import CTASection from '@/components/home/CTASection'

export const metadata = {
  title: 'GLOWW — Plant-Powered Wellness | Nourish From Within',
  description:
    'GLOWW makes clean-label wellness simple — cold-pressed juices, tablets, powders, and oils like sea buckthorn and moringa, lab-tested and delivered pan India.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <ShopByConcernSection />
      <WhyUsSection />
      <StatsSection />
      <WatchLoveSection />
      <ProjectsSection />
      <PressLogosSection />
      <TestimonialsSection />
      <CTASection />
      <InstagramFeedSection />
    </>
  )
}
