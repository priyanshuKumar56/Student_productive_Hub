import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useSelector } from "react-redux";

function MainNav() {
  const { unreadNotifications } = useSelector((state) => state.notifications);

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6" />
        <span className="font-bold">StudySpace</span>
      </Link>
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </Link>
        <Link
          href="/documents"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Documents
        </Link>
        <Link
          href="/whiteboards"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Whiteboards
        </Link>
        <Link
          href="/calendar"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Calendar
        </Link>
      </nav>
    </div>
  );
}
export default MainNav;
