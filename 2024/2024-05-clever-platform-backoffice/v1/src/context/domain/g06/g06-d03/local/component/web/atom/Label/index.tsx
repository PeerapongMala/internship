export default function Label({ text, className }: { text: string; className?: string }) {
  return <label className={`${className ? className : ''} !m-0`}>{text}</label>;
}
