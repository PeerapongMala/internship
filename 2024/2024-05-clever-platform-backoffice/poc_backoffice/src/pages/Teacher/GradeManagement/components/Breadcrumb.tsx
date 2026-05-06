import { Fragment } from 'react';

export interface BreadcrumbItem {
    text: string;
    href?: string;
}

function Breadcrumb({ items }: Readonly<{ items: BreadcrumbItem[] }>) {
    return (
        <nav>
            <ol className="list-reset flex">
                {items.map((item, index) => {
                    return (
                        <Fragment key={`${item.text}_${index}`}>
                            {index !== items.length - 1 ? (
                                <Fragment>
                                    <li>
                                        <a href={item.href} className="text-primary">
                                            {item.text}
                                        </a>
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
}

export default Breadcrumb;
