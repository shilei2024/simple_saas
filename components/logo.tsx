import Link from "next/link";
import { Mail } from "lucide-react";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      <div className="flex items-center justify-center p-1.5 bg-primary/10 rounded-md">
        <Mail className="w-5 h-5 text-primary" />
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Dear Stranger
      </span>
    </Link>
  );
}
