export function MenuFrame({ src }: { src: string }) {
  if (!src) return null;

  return <img className="w-full" src={src} alt="Frame" />;
}

export default MenuFrame;
