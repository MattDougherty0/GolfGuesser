"use client";

import Header from "./Header";

interface MainWithSidebarProps {
  children: React.ReactNode;
  playerName?: string | null;
}

export default function MainWithSidebar({ children, playerName }: MainWithSidebarProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header playerName={playerName} />
      <div className="flex flex-1 min-w-0">{children}</div>
    </div>
  );
}
