export default function Footer() {
  return (
    <footer className="flex items-center justify-center w-full p-6 text-muted-foreground">
      © {new Date().getFullYear()} ClubFinder
    </footer>
  );
}
