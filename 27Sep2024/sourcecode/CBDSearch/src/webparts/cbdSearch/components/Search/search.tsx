import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchResult } from "@pnp/sp/search";


export interface ISearch {
    context: BaseWebPartContext;
    count: number;
}
export const Search: React.FunctionComponent<ISearch> = (props) => {

    const [loading, setLoading] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<ISearchResult[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(false);
    const [nextSearch, setNextSearch] = React.useState(0);

    const handleSearch = async () => {
        setLoading(true);
        const sp = spfi().using(SPFx(props.context));
        const results = await sp.search({
            Querytext: `${query} Path:"${props.context.pageContext.site.absoluteUrl}"`,
            RowLimit: props.count,
            TrimDuplicates: false
        });
        setSearchResults(results.PrimarySearchResults);
        setNextSearch(results.PrimarySearchResults.length);
        setHasMore(results.PrimarySearchResults.length > 0);
        setTotalCount(results.TotalRows);
        setLoading(false);
    }
    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const sp = spfi().using(SPFx(props.context));
        const results = await sp.search({
            Querytext: `${query} Path:"${props.context.pageContext.site.absoluteUrl}"`,
            RowLimit: props.count,
            TrimDuplicates: false,
            StartRow: nextSearch
        });
        setSearchResults((prev) => [...prev, ...results.PrimarySearchResults]);
        setNextSearch(nextSearch + results.PrimarySearchResults.length);
        setHasMore(results.PrimarySearchResults.length > 0);
        setLoading(false);
    }

    const handleScroll = () => {
        const elem: Element | null = document.querySelector('div[data-automation-id="contentScrollRegion"]');
        if (elem) {
            const lastItem = document.querySelector(".search:last-child");
            if (lastItem) {
                const rect = lastItem.getBoundingClientRect();
                if (rect.bottom <= elem.getBoundingClientRect().bottom && !loading && hasMore) {
                    loadMore();
                }
            }
        }
    };



    React.useEffect(() => {
        const elem: Element | null = document.querySelector('div[data-automation-id="contentScrollRegion"]');
        if (elem) {
            elem.addEventListener('scroll', handleScroll);
            return () => {
                elem.removeEventListener('scroll', handleScroll);
            };
        }
    }, [loading, hasMore]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    const appendEnvToSharePointUrl = (url: string | undefined): string => {
        if (url) {
            if (url.indexOf(".aspx") !== -1 && url.indexOf("env=WebView") === -1) {
                if (url.indexOf("?") !== -1) {
                    return `${url}&env=WebView`;
                } else {
                    return `${url}?env=WebView`;
                }
            }
        }
        return url || "";
    };

    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto relative search">
            <div className="grid place-items-center bg-primary h-340 rounded-lg w-full fixed font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto z-40 ">
                <div className="flex items-center bg-white rounded-lg max-w-smmax w-full h-140  p-4">
                    <div className="flex-none cursor-pointer text-gray1" onClick={() => handleSearch()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15.7832 14.3911L20 18.6069L18.6069 20L14.3911 15.7832C12.8224 17.0407 10.8713 17.7246 8.86088 17.7218C3.96968 17.7218 0 13.7521 0 8.86088C0 3.96968 3.96968 0 8.86088 0C13.7521 0 17.7218 3.96968 17.7218 8.86088C17.7246 10.8713 17.0407 12.8224 15.7832 14.3911ZM13.8082 13.6605C15.0577 12.3756 15.7555 10.6532 15.7527 8.86088C15.7527 5.05366 12.6681 1.96909 8.86088 1.96909C5.05366 1.96909 1.96909 5.05366 1.96909 8.86088C1.96909 12.6681 5.05366 15.7527 8.86088 15.7527C10.6532 15.7555 12.3756 15.0577 13.6605 13.8082L13.8082 13.6605Z" fill="#353535" />
                        </svg>
                    </div>
                    <div className="grow flex items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            value={query}
                            maxLength={255}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="text-gray1 text-base outline-none ring-0 focus:outline-none focus:ring-0 block p-2 w-full h-full" />
                        {query.length > 0 && <span className="cursor-pointer text-gray1" onClick={() => setQuery("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C10.0222 2 8.08879 2.58649 6.4443 3.6853C4.79981 4.78412 3.51809 6.3459 2.76121 8.17317C2.00433 10.0004 1.8063 12.0111 2.19215 13.9509C2.578 15.8907 3.53041 17.6725 4.92894 19.0711C6.32746 20.4696 8.10929 21.422 10.0491 21.8079C11.9889 22.1937 13.9996 21.9957 15.8268 21.2388C17.6541 20.4819 19.2159 19.2002 20.3147 17.5557C21.4135 15.9112 22 13.9778 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2ZM17.66 16.24L16.25 17.65L12 13.41L7.76 17.66L6.34 16.24L10.59 12L6.34 7.76L7.76 6.34L12 10.59L16.24 6.35L17.65 7.76L13.41 12L17.66 16.24Z" fill="#9B9B9B" />
                            </svg>
                        </span>
                        }
                    </div>
                </div>
            </div>

            <div className="max-w-mdmax m-auto pt-340 pb-10 flex flex-col gap-8 relative" style={{ "minHeight": "570px" }}>
                {searchResults && searchResults.length > 0 && <div className="text-4xl text-gray1 font-bold fixed py-10 w-full max-w-mdmax bg-white">Search Results<span className="font-light">({totalCount})</span></div>}
                <ul className="flex flex-col gap-8 w-full pt-240">
                    {searchResults.map((result, index) => (
                        <li key={`result_${index}`} className="flex flex-col gap-2 border-b border-gray5" >
                            <p className="text-gray1 text-xl font-bold">{result.Title}</p>
                            <a href={appendEnvToSharePointUrl(result.Path)} className="text-base text-accent hover:text-underline">{result.Path}</a>
                            <p className="text-base text-gray2">{result.Description}</p>
                        </li>
                    ))}
                </ul>
                {loading && (
                    <div className="bg-search rounded-full flex flex-col w-full h-160 items-center justify-center opacity-50">
                        <div className='flex justify-center items-center gap-2'>
                            <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                            <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                            <div className='h-2 w-2 bg-primary rounded-full animate-bounce'></div>
                        </div>
                        <div className="text-xs text-gray3" >LOADING MORE</div>
                    </div>
                )}
            </div>
        </div >
    )
}