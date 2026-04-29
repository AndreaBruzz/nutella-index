'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { RankingSort } from '@/types';

type RankingSortTabsProps = {
  activeSort: RankingSort;
  labels: Record<RankingSort, string>;
  locale: "it" | "en";
};

const SORTS: RankingSort[] = ['expensive', 'cheap', 'recent'];

export default function RankingSortTabs({ activeSort, labels }: RankingSortTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSort = (sort: RankingSort) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort === 'expensive') {
      params.delete('sort');
    } else {
      params.set('sort', sort);
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <div className="mb-6 flex justify-center px-4 md:px-8">
      <div className="flex w-full max-w-sm flex-wrap justify-center gap-3">
        {SORTS.map((item) => {
          const isActive = item === activeSort;

          return (
            <button
              key={item}
              type="button"
              onClick={() => setSort(item)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors md:px-5 md:py-2.5 md:text-base ${
                isActive
                  ? 'border-[var(--nutella-red)] bg-[rgba(229,1,1,0.2)] text-[var(--nutella-cream)]'
                  : 'border-[var(--nutella-gold)]/40 bg-[rgba(75,32,6,0.32)] hover:bg-[rgba(250,179,11,0.12)]'
              }`}
            >
              {labels[item]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
