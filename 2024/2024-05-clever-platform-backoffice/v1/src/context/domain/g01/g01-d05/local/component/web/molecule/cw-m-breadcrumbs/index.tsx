import { Fragment } from 'react/jsx-runtime';

interface CWMBreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  className?: string;
  aClassName?: string;
  divClassName?: string;
  slashClassName?: string;
}

export type Breadcrumb = { label: string; href?: string };

const CWMBreadcrumbs = function (props: CWMBreadcrumbsProps) {
  return (
    <div className={`flex gap-2 ${props.className ?? ''}`}>
      {props.breadcrumbs.map((bread, index) => {
        let el;
        if (bread.href) {
          el = (
            <a className={`text-primary ${props.aClassName}`} href={bread.href}>
              {bread.label}
            </a>
          );
        } else {
          el = <div className={`${props.divClassName}`}>{bread.label}</div>;
        }

        return (
          <Fragment key={`${bread.href}-${index}`}>
            {el}
            {index < props.breadcrumbs.length - 1 && (
              <div className={props.slashClassName}>/</div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default CWMBreadcrumbs;
