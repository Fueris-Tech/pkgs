import { IBreadcrumbItem } from "@fluentui/react/lib/Breadcrumb";
import { Icon } from "@fluentui/react/lib/Icon";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/regional-settings";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as React from "react";

export interface ISearch {
    context: BaseWebPartContext;
    count: number;
    link: string;
    detailLink: string;
    bannerImageUrl: string;
}

export const Search: React.FunctionComponent<ISearch> = (props) => {
    const currentYear = new Date().getFullYear();
    const sorts = ["Recent", "Older"];
    const [years, setYears] = React.useState<number[]>([-1]);
    const [showSort, setShowSort] = React.useState<boolean>(false);
    const [showFilter, setShowFilter] = React.useState<boolean>(false);
    const [categories, setCategories] = React.useState<any[]>();
    const [comms, setComms] = React.useState<any[]>([]);
    const [category, setCategory] = React.useState<string>('All');
    const [filter, setFilter] = React.useState<number>(-1);
    const [sort, setSort] = React.useState<string>(sorts[0]);
    const [searchVal, setSearchVal] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const [breadcrumbItems, setBreadcrumbItems] = React.useState<IBreadcrumbItem[]>([]);

    const getPageTitle = async (pageItemId: number) => {
        try {
            const sp = spfi().using(SPFx(props.context));
            const pageProperties = await sp.web.lists.getByTitle("Site Pages").items.select("Title").getById(pageItemId)();
            return pageProperties.Title;
        } catch (error) {
            console.error("Error retrieving page title:", error);
            return null;
        }
    };

    const fetchBreadcrumbItems = async () => {

        const currentPage = props.context.pageContext.legacyPageContext;
        const items: IBreadcrumbItem[] = [
            {
                text: currentPage.webTitle,
                key: 'home',
                href: currentPage.webAbsoluteUrl
            }
        ];

        const pageTitle = await getPageTitle(currentPage.pageItemId);
        if (pageTitle) {
            items.push({
                text: pageTitle,
                key: 'pageTitle',
                isCurrentItem: true
            });
        }

        setBreadcrumbItems(items);
    };

    const fetchcommsChoices = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDCommunication")
            .fields.getByInternalNameOrTitle("Category")
            .select("Choices")();
        setCategories(['All', ...results?.Choices]);
    }

    const generateCamlQuery = (searchVal: string, page: number) => {
        const startDate = new Date(filter, 0, 1);
        const endDate = new Date(filter + 1, 0, 1);

        let filterQuery = '';

        if (filter !== -1) {
            filterQuery = `<And>
            <Geq>
                <FieldRef Name='PublishingDate' />
                <Value Type='DateTime'>${startDate.toISOString()}</Value>
            </Geq>
            <Lt>
                <FieldRef Name='PublishingDate' />
                <Value Type='DateTime'>${endDate.toISOString()}</Value>
            </Lt>
        </And>`;
        }

        if (category !== 'All') {
            filterQuery = filterQuery
                ? `<And>
                    <Eq>
                        <FieldRef Name='Category' />
                        <Value Type='Text'>${category}</Value>
                    </Eq>
                    ${filterQuery}
                </And>`
                : `<Eq>
                    <FieldRef Name='Category' />
                    <Value Type='Text'>${category}</Value>
                </Eq>`;
        }

        if (searchVal) {
            filterQuery = filterQuery
                ? `<And>
                    <Or>
                        <Contains>
                            <FieldRef Name='Title' />
                            <Value Type='Text'>${searchVal}</Value>
                        </Contains>
                        <Contains>
                            <FieldRef Name='Summary' />
                            <Value Type='Note'>${searchVal}</Value>
                        </Contains>
                    </Or>
                    ${filterQuery}
                </And>`
                : `<Or>
                    <Contains>
                        <FieldRef Name='Title' />
                        <Value Type='Text'>${searchVal}</Value>
                    </Contains>
                    <Contains>
                        <FieldRef Name='Summary' />
                        <Value Type='Note'>${searchVal}</Value>
                    </Contains>
                </Or>`;
        }

        filterQuery = filterQuery
            ? `<And>
            <Eq>
                <FieldRef Name='Status' />
                <Value Type='Text'>Approved</Value>
            </Eq>
            ${filterQuery}
        </And>`
            : `<Eq>
            <FieldRef Name='Status' />
            <Value Type='Text'>Approved</Value>
        </Eq>`;

        return `<View>
            <Query>
                <Where>${filterQuery}</Where>
                <OrderBy>
                <FieldRef Name='PublishingDate' Ascending='${sort !== 'Recent'}' />
                </OrderBy>
            </Query>
            <RowLimit>${props.count}</RowLimit>
                
        </View>`;
    };

    const fetchUTCDate = async (localDate: string): Promise<string> => {
        const sp = spfi().using(SPFx(props.context));
        const utcDate = await sp.web.regionalSettings.timeZone.localTimeToUTC(localDate);
        return utcDate;
    };

    const fetchComms = async (page: number = 1) => {
        setLoading(true);

        const sp = spfi().using(SPFx(props.context));
        const camlQuery = generateCamlQuery(searchVal, page);

        let query: any = { ViewXml: camlQuery };
        if (page > 1) {
            const last = comms[comms.length - 1];
            let ps = "";
            // if (sort === "Recent") {
            //     const utcModifiedDate = await fetchUTCDate(last.Modified);
            //     ps = `&p_Modified=${utcModifiedDate}`;
            // }
            // else {
            //     ps = `&p_Category=${last.Category}`
            // }
            const utcModifiedDate = await fetchUTCDate(last.PublishingDate);
            ps = `&p_PublishingDate=${utcModifiedDate}`;

            query = {
                ...query,
                ListItemCollectionPosition: { PagingInfo: `Paged=TRUE&p_ID=${last.ID}${ps}` },
            }
        }
        const results: any = await sp.web.lists.getByTitle("CBDCommunication").getItemsByCAMLQuery(query);
        setComms(prevComms => page === 1 ? results : [...prevComms, ...results]);
        setLoading(false);

        // Check if there are more items to load
        if (results.length < props.count) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }
    };

    const fetchYears = () => {
        let y: number[] = [-1];
        for (let i = 0; i < 2; i++) {
            y.push(currentYear - i);
        }
        setYears(y);
    }

    const fetchAll = async () => {
        await fetchBreadcrumbItems();
        await fetchcommsChoices();
        fetchYears();
        fetchComms(1);
    }

    React.useEffect(() => {
        fetchAll();
    }, []);

    React.useEffect(() => {
        fetchComms(1);
    }, [filter, sort, category, searchVal]);


    const fetchNextPage = () => {
        fetchComms(Math.floor(comms.length / props.count) + 1);
    };



    const handleScroll = () => {
        const elem: Element | null = document.querySelector('div[data-automation-id="contentScrollRegion"]');
        if (elem) {
            const lastItem = document.querySelector(".communication:last-child");
            if (lastItem) {
                const rect = lastItem.getBoundingClientRect();
                if (rect.bottom <= elem.getBoundingClientRect().bottom && !loading && hasMore) {
                    fetchNextPage();
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

    return (
        <div className="font-cairo m-auto max-w-xlmax communication pt-8 pb-20">

            <div className="w-full rounded-lg relative font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto m-auto " style={{ "height": "300px" }}>
                <div className="absolute top-140 left-140 z-10">
                    <nav aria-label="Breadcrumb">
                        <ol className="flex gap-1 text-white text-base items-center">
                            {breadcrumbItems.map((item, index) => (
                                <li key={item.key} className={index === breadcrumbItems.length - 1 ? 'flex text-base items-center opacity-75' : ' text-base flex items-center'}>
                                    {item.isCurrentItem ? (
                                        <span>{item.text}</span>
                                    ) : (
                                        <a href={item.href} className="hover:underline block">
                                            {item.text}
                                        </a>
                                    )}
                                    {index < breadcrumbItems.length - 1 && (
                                        <span className="px-2 text-sm "><Icon iconName="ChevronRight" /></span>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                </div>
                <div className="absolute top-340 left-140 z-10 text-4xl text-white font-bold">
                    {breadcrumbItems && breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1].text : ""}
                </div>
                <div className="relative mix-blend-overlay w-full h-full rounded-lg overflow-hidden">
                    <div className="absolute bg-gradient-to-r from-primary to-transparent h-full w-full" />
                    <img src={props.bannerImageUrl} alt={"Communication"} className="absolute object-cover w-full h-full opacity-50" />
                </div>
            </div>
            {categories && (
                <div className="flex flex-col gap-8 py-10">
                    <div className="flex items-center justify-between max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto w-full">
                        <ul className="flex gap-2 items-center flex-wrap">
                            {categories.map((c: string) => (
                                <li key={`category_${c}`} className="cursor-pointer">
                                    <a className={`block px-4 py-2 rounded-full border border-gray4 text-base ${category === c ? 'bg-primary text-white font-bold ' : 'text-primary bg-white'}`} onClick={() => setCategory(c)}>{c}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-light h-full py-10" style={{ "minHeight": "440px" }}>
                        <div className="flex w-full items-center gap-2 py-4 max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto searcharea">
                            <div className="grow">
                                <SearchBox placeholder="Search Communication Board" onChange={(e) => setSearchVal(e?.target.value || '')} underlined={true} className="bg-transparent max-w-smmax" />
                            </div>
                            <div className="relative text-left" >
                                <div >
                                    <button type="button" onClick={() => setShowFilter(true)} onBlur={() => setTimeout(() => setShowFilter(false), 200)} className="outline-none focus:outline-none inline-flex w-full justify-center gap-x-2 rounded-full bg-white px-3 py-2 text-base text-gray2 shadow-sm items-center" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 4.99952C8.73478 4.99952 8.48043 5.10488 8.29289 5.29241C8.10536 5.47995 8 5.7343 8 5.99952C8 6.26474 8.10536 6.51909 8.29289 6.70663C8.48043 6.89416 8.73478 6.99952 9 6.99952C9.26522 6.99952 9.51957 6.89416 9.70711 6.70663C9.89464 6.51909 10 6.26474 10 5.99952C10 5.7343 9.89464 5.47995 9.70711 5.29241C9.51957 5.10488 9.26522 4.99952 9 4.99952ZM6.17 4.99952C6.3766 4.41399 6.75974 3.90695 7.2666 3.54831C7.77346 3.18967 8.37909 2.99707 9 2.99707C9.62091 2.99707 10.2265 3.18967 10.7334 3.54831C11.2403 3.90695 11.6234 4.41399 11.83 4.99952H19C19.2652 4.99952 19.5196 5.10488 19.7071 5.29241C19.8946 5.47995 20 5.7343 20 5.99952C20 6.26474 19.8946 6.51909 19.7071 6.70663C19.5196 6.89416 19.2652 6.99952 19 6.99952H11.83C11.6234 7.58505 11.2403 8.09209 10.7334 8.45073C10.2265 8.80938 9.62091 9.00197 9 9.00197C8.37909 9.00197 7.77346 8.80938 7.2666 8.45073C6.75974 8.09209 6.3766 7.58505 6.17 6.99952H5C4.73478 6.99952 4.48043 6.89416 4.29289 6.70663C4.10536 6.51909 4 6.26474 4 5.99952C4 5.7343 4.10536 5.47995 4.29289 5.29241C4.48043 5.10488 4.73478 4.99952 5 4.99952H6.17ZM15 10.9995C14.7348 10.9995 14.4804 11.1049 14.2929 11.2924C14.1054 11.4799 14 11.7343 14 11.9995C14 12.2647 14.1054 12.5191 14.2929 12.7066C14.4804 12.8942 14.7348 12.9995 15 12.9995C15.2652 12.9995 15.5196 12.8942 15.7071 12.7066C15.8946 12.5191 16 12.2647 16 11.9995C16 11.7343 15.8946 11.4799 15.7071 11.2924C15.5196 11.1049 15.2652 10.9995 15 10.9995ZM12.17 10.9995C12.3766 10.414 12.7597 9.90695 13.2666 9.54831C13.7735 9.18967 14.3791 8.99707 15 8.99707C15.6209 8.99707 16.2265 9.18967 16.7334 9.54831C17.2403 9.90695 17.6234 10.414 17.83 10.9995H19C19.2652 10.9995 19.5196 11.1049 19.7071 11.2924C19.8946 11.4799 20 11.7343 20 11.9995C20 12.2647 19.8946 12.5191 19.7071 12.7066C19.5196 12.8942 19.2652 12.9995 19 12.9995H17.83C17.6234 13.5851 17.2403 14.0921 16.7334 14.4507C16.2265 14.8094 15.6209 15.002 15 15.002C14.3791 15.002 13.7735 14.8094 13.2666 14.4507C12.7597 14.0921 12.3766 13.5851 12.17 12.9995H5C4.73478 12.9995 4.48043 12.8942 4.29289 12.7066C4.10536 12.5191 4 12.2647 4 11.9995C4 11.7343 4.10536 11.4799 4.29289 11.2924C4.48043 11.1049 4.73478 10.9995 5 10.9995H12.17ZM9 16.9995C8.73478 16.9995 8.48043 17.1049 8.29289 17.2924C8.10536 17.4799 8 17.7343 8 17.9995C8 18.2647 8.10536 18.5191 8.29289 18.7066C8.48043 18.8942 8.73478 18.9995 9 18.9995C9.26522 18.9995 9.51957 18.8942 9.70711 18.7066C9.89464 18.5191 10 18.2647 10 17.9995C10 17.7343 9.89464 17.4799 9.70711 17.2924C9.51957 17.1049 9.26522 16.9995 9 16.9995ZM6.17 16.9995C6.3766 16.414 6.75974 15.907 7.2666 15.5483C7.77346 15.1897 8.37909 14.9971 9 14.9971C9.62091 14.9971 10.2265 15.1897 10.7334 15.5483C11.2403 15.907 11.6234 16.414 11.83 16.9995H19C19.2652 16.9995 19.5196 17.1049 19.7071 17.2924C19.8946 17.4799 20 17.7343 20 17.9995C20 18.2647 19.8946 18.5191 19.7071 18.7066C19.5196 18.8942 19.2652 18.9995 19 18.9995H11.83C11.6234 19.5851 11.2403 20.0921 10.7334 20.4507C10.2265 20.8094 9.62091 21.002 9 21.002C8.37909 21.002 7.77346 20.8094 7.2666 20.4507C6.75974 20.0921 6.3766 19.5851 6.17 18.9995H5C4.73478 18.9995 4.48043 18.8942 4.29289 18.7066C4.10536 18.5191 4 18.2647 4 17.9995C4 17.7343 4.10536 17.4799 4.29289 17.2924C4.48043 17.1049 4.73478 16.9995 5 16.9995H6.17Z" fill="#006E7D" />
                                        </svg>
                                        <span>Year :</span><span className="font-bold text-primary">{filter === -1 ? 'All' : filter}</span>
                                        <Icon iconName="ChevronDown" className="h-5 w-5 text-gray2" />
                                    </button>
                                </div>
                                {showFilter && <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-lg bg-white shadow-lg focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                    <div className="px-4 py-2" role="none">
                                        {
                                            years && years.map((y: number, i: number) => (
                                                <button className={`block py-2 text-base text-gray2 w-full text-left outline-none hover:outline-none active:outline-none focus:outline-none ${filter === y ? 'text-primary font-bold' : ''} ${i < years.length - 1 ? 'border-b border-b-2 border-light' : ''}`} role="menuitem" tabIndex={-1} onClick={() => { setFilter(y); setShowFilter(false); }} >{y === -1 ? 'All' : y}</button>
                                            ))
                                        }


                                    </div>
                                </div>
                                }
                            </div>
                            <div className="relative text-left" >
                                <div>
                                    <button type="button" onClick={() => setShowSort(true)} onBlur={() => setTimeout(() => setShowSort(false), 200)} className="outline-none focus:outline-none inline-flex w-full justify-center gap-x-2 rounded-full bg-white px-3 py-2 text-base text-gray2 shadow-sm items-center" id="menu-button" aria-expanded="true" aria-haspopup="true">
                                        <span>Sort By : </span><span className="font-bold text-primary">{sort}</span>

                                        <Icon iconName="ChevronDown" className="h-5 w-5 text-gray2" />
                                    </button>
                                </div>
                                {showSort && <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-lg bg-white shadow-lg focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                                    <div className="px-4 py-2" role="none">
                                        {
                                            sorts && sorts.map((s: string, i: number) => (
                                                <button className={`block  py-2 text-base text-gray2 w-full text-left outline-none hover:outline-none active:outline-none focus:outline-none ${sort === s ? 'text-primary font-bold' : ''} ${i < sorts.length - 1 ? 'border-b border-b-2 border-light' : ''}`} role="menuitem" tabIndex={-1} onClick={() => { setSort(s); setShowSort(false); }} >{s}</button>
                                            ))
                                        }


                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto">
                            {comms && comms.map((n: any, index: number) => (
                                <div key={`search${index}`} className="bg-white shadow-lg rounded-lg flex w-full gap-10 items-center overflow-hidden">
                                    <div>
                                        <a href={`${props.detailLink}?CommsId=${n.Id}`}> <img src={n.Thumbnail.Url} className="w-1300 h-1200 min-w-xsmmax max-w-xsmmax object-cover" /></a>
                                    </div>
                                    <div>
                                        <p className="w-fit px-4 py-2 rounded-full border border-gray4 text-sm text-primary bg-white font-bold">{n.Category}</p>
                                        <a className="text-xl px-2 block font-bold text-gray1" href={`${props.detailLink}?CommsId=${n.Id}`}>{n.Title}</a>
                                        <p className="text-lg px-2 block text-gray1 overflow-hidden" title={n.Summary} dangerouslySetInnerHTML={{ __html: n.Summary }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {loading && hasMore && (
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
                </div>
            )}
        </div>
    );
}