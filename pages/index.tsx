import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="container mx-auto text-center p-4">
      <header className="py-4">
        <h1 className="text-4xl font-bold">Fun Games App</h1>
        <p className="text-lg text-gray-600">Unlock endless fun and challenges</p>
      </header>
      
      <section className="my-8">
        <h2 className="text-2xl font-semibold">Whats Inside?</h2>
        <p className="text-lg text-gray-600">Experience a variety of games that keep you entertained and engaged.</p>
      </section>

      <section className="my-8">
        <h2 className="text-2xl font-semibold">Purchase Coins</h2>
        <p className="text-lg text-gray-600">Buy coins to unlock premium features and special in-game advantages.</p>
      </section>
      
        <h2 className="text-2xl font-semibold">Disclaimer</h2>
        <p className="text-lg text-gray-600">Coins purchased are for gaming purposes only and have no cash value.</p>

    </div>
  );
};

export default Home;
