export default function Selectable({ children }: { children?: string }) {
  return <span className="enableSelection">{children}</span>;
}
