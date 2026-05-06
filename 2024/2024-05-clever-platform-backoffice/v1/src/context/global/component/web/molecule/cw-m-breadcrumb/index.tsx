import { Fragment } from 'react';

export interface CWMBreadcrumbItems {
  text: string;
  href?: string;
}

export interface CWMBreadcrumbProps {
  items: CWMBreadcrumbItems[];
}

const CWMBreadcrumb: React.FC<CWMBreadcrumbProps> = ({ items }) => {
  return (
    <nav>
      <ol className="list-reset flex">
        {items.map((item, index) => {
          return (
            <Fragment key={`${item.text}_${index}`}>
              {index !== items.length - 1 ? (
                <Fragment>
                  <li>
                    <p className="">{item.text}</p>
                  </li>
                  <li>
                    <span className="mx-2">/</span>
                  </li>
                </Fragment>
              ) : (
                <li className="pointer-events-none">{item.text}</li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default CWMBreadcrumb;
