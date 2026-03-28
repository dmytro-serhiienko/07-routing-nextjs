import Link from "next/link";
import css from "./Header.module.css";

import { FaReact } from "react-icons/fa";

export default function Header() {
  return (
    <header className={css.header}>
      <Link className="css.logo" href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/notes">Notes</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
