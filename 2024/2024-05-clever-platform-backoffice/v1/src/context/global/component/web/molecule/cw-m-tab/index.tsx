import { matchWithGlob } from '@global/utils/validator/glob';
import { TabGroup, TabList } from '@headlessui/react';
import { Link, useLocation } from '@tanstack/react-router';

interface CMWTabProps {
  name: string;
  to: string;
  /**
   * Support glob pattern `*` `**`
   * - '*' for a single path segment (e.g., /users/`*`/profile matches /users/123/profile)
   * - '**' for zero or more path segments (e.g., /docs/`**`/index.html matches /docs/api/v1/index.html)
   */
  checkActiveUrl?: string;
  state?: Record<string, unknown>;
}

export default function CWMTab({ tabs }: { tabs: CMWTabProps[] }) {
  const location = useLocation();

  return (
    <div className="overflow-x-auto">
      <TabGroup as="div">
        <TabList className="flex h-9 w-full min-w-max border-b border-neutral-200 bg-white">
          {tabs.map((tab, index) => {
            const isActive = matchWithGlob(
              location.pathname,
              tab.checkActiveUrl || tab.to,
            );

            return (
              <Link
                key={`phorpor5-tab-${index}`}
                to={tab.to}
                className={`whitespace-nowrap px-3 py-2 text-center sm:px-5 ${
                  isActive
                    ? 'border-b-2 border-b-primary text-primary'
                    : 'border-b-2 border-transparent text-neutral-500'
                }`}
                state={tab.state}
              >
                {tab.name}
              </Link>
            );
          })}
        </TabList>
      </TabGroup>
    </div>
  );
}
