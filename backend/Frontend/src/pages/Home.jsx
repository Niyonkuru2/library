import BestSeller from "../components/BestSeller"
import Hero from "../components/Hero"
import LatestCllection from "../components/LatestCllection"
import NewsLetterBox from "../components/NewsLetterBox"
import OurPolicy from "../components/OurPolicy"

const Home = () => {
  return (
    <div>
      <Hero/>
      <LatestCllection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsLetterBox/>
    </div>
  )
}

export default Home