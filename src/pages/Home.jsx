import Hero from '../components/Hero';
import MainContent from '../components/MainContent';

export default function Home({ onPlan }) {
  return (
    <main>
      <Hero />
      <MainContent onPlan={onPlan} />
    </main>
  );
}
