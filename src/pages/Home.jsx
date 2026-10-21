import Hero from '../components/Hero';
import DestinationPicker from '../components/DestinationPicker';
import MainContent from '../components/MainContent';

export default function Home({ onPlan }) {
  return (
    <main>
      <Hero />
      <DestinationPicker />
      <MainContent onPlan={onPlan} />
    </main>
  );
}
