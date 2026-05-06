import { Typography } from 'antd';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  extra?: ReactNode;
}

export default function PageHeader({ title, extra }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
      {extra && <div>{extra}</div>}
    </div>
  );
}
