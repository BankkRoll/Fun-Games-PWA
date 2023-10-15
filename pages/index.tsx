import { NextPage } from "next";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardContent,
} from "../components/ui/glow-card";

const Home: NextPage = () => {
  return (
    <div className="bg-background mx-auto p-4 mb-32 md:mb-64">
      <header className="py-4 text-center">
        <h1 className="text-4xl font-bold">Fun Games App</h1>
        <p className="text-lg text-gray-600">
          Unlock endless fun and challenges
        </p>
      </header>

      <section className="text-center my-8">
        <h2 className="text-3xl font-semibold">Join the Fun!</h2>
        <p className="text-lg text-gray-600">
          Sign up now and get 100 free coins to play! Coin purchasing feature
          coming soon.
        </p>
      </section>

      <div className="flex flex-wrap justify-center md:justify-between">
        <GlowCard className="w-full md:w-1/2 my-8 p-4 rounded">
          <GlowCardHeader>
            <h2 className="text-2xl font-semibold">Early Development</h2>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-lg">
              This app is in the early stages of development. Heres what you can
              expect:
              <ul className="list-inside list-disc">
                <li>- Possible bugs and glitches</li>
                <li>- New features released regularly</li>
                <li>
                  - We appreciate your understanding and patience as we work to
                  improve your gaming experience.
                </li>
              </ul>
            </p>
          </GlowCardContent>
        </GlowCard>

        <GlowCard className="w-full md:w-1/2 my-8 p-4 rounded">
          <GlowCardHeader>
            <h2 className="text-2xl font-semibold">Whats Inside?</h2>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-lg">
              Wondering what kinds of games you can play? Heres a sneak peek:
              <ul className="list-inside list-disc">
                <li>- Arcade games</li>
                <li>- Arcade classics</li>
                <li>- Puzzle games</li>
                <li>- Strategy games</li>
                <li>- And much more!</li>
              </ul>
            </p>
          </GlowCardContent>
        </GlowCard>

        <GlowCard className="w-full md:w-1/2 my-8 p-4 rounded">
          <GlowCardHeader>
            <h2 className="text-2xl font-semibold">Purchase Coins</h2>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-lg">
              Ready to level up your gaming? With our in-game currency, you can:
              <ul className="list-inside list-disc">
                <li>- Play Games</li>
                <li>- REDACTED</li>
                <li>- REDACTED</li>
                <li>- REDACTED</li>
              </ul>
            </p>
          </GlowCardContent>
        </GlowCard>

        <GlowCard className="w-full md:w-1/2 my-8 p-4 rounded">
          <GlowCardHeader>
            <h2 className="text-2xl font-semibold">Disclaimer</h2>
          </GlowCardHeader>
          <GlowCardContent>
            <p className="text-lg">
              Please note the following:
              <ul className="list-inside list-disc">
                <li>- All in-game purchases are final.</li>
                <li>- Coins have no real-world value.</li>
                <li>- Terms and conditions apply.</li>
                <li>- Play responsibly.</li>
              </ul>
            </p>
          </GlowCardContent>
        </GlowCard>
      </div>
    </div>
  );
};

export default Home;
