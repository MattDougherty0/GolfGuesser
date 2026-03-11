import PlayViewportEffect from "./PlayViewportEffect";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PlayViewportEffect />
      {children}
    </>
  );
}
