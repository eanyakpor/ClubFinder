import Link from "next/link";
import { Alexandria } from "next/font/google";

const alexandria = Alexandria({ subsets: ["latin"] });

export default function NavBarLogo({ isScrolled }: { isScrolled: boolean }) {
  
  return (
    <Link href="/">
      <h1 className={alexandria.className + " text-xl transition-all duration-200 " + (isScrolled ? "text-black dark:text-white" : "text-white")}>ClubFinder</h1>
    </Link>
  );
}
