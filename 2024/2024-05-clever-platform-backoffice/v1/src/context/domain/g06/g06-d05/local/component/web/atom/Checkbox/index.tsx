import styles from './index.module.css';
export default function Checkbox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center space-x-2">
      <input className={styles['checkbox']} type="checkbox" value={value} />
      <span>{label}</span>
    </div>
  );
}
