import Hero from "../components/Hero";
import PopularBooks from "../components/PopularBooks";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import RewardsPreview from "../components/RewardsPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularBooks />
      <Categories />
      <HowItWorks />
      <RewardsPreview />
    </>
  );
}