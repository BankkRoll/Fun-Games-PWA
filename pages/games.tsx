import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
} from "../components/ui/card";
import Link from "next/link";
import { games }from "../lib/GamesList";

export default function Games() {
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {games.map((game) => (
        <Link className="block group hover:border-primary hover:bg-primary-light rounded-xl" href={`/game/${game.id}`} key={game.id}>
            <Card>
              <div className="relative overflow-hidden h-[200px] md:h-[400px] w-full">
                <CardImage 
                  className="absolute inset-0 object-cover transform group-hover:scale-110 transition-transform duration-300 ease-in-out" 
                  src={game.imageUrl} 
                  alt={game.title} 
                />
              </div>
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{game.description}</CardDescription>
              </CardContent>
            </Card>
        </Link>
      ))}
    </div>
  );
}