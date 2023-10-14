import { ModeToggle } from "./ui/theme-toggle";

export default function Header() {
    return (
        <div className="flex items-center justify-between p-4 bg-background dark:bg-gray-900 border-b dark:border-gray-800">
            <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-foreground dark:text-white">
                    Fun Games PWA App
                </h1>
            </div>
            <div className="flex items-center space-x-4">
                <ModeToggle />
            </div>
        </div>
    );
}
