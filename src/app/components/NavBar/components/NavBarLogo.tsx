import Link from "next/link";
import { Alexandria } from "next/font/google";

const alexandria = Alexandria({ subsets: ["latin"] });

export default function NavBarLogo() {
  
  return (
    <Link href="/">
      <h1 className={alexandria.className}>PROJECT X</h1>
    </Link>
  );
}
