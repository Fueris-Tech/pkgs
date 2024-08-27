import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import "./../../../../tailwind.css";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import { SPFx, spfi } from "@pnp/sp";
import { Icon } from "@fluentui/react/lib/components/Icon";

export interface IQuickLinks {
    context: BaseWebPartContext;
    count: number;
}
export const QuickLinks: React.FunctionComponent<IQuickLinks> = (props) => {

    const [categories, setCategories] = React.useState<any[]>();
    const [quicklinks, setQuicklinks] = React.useState<any[]>();
    const [category, setCategory] = React.useState<string>('');
    const [showAll, setShowAll] = React.useState<boolean>(false);

    const fetchquicklinksChoices = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDQuickLinks")
            .fields.getByInternalNameOrTitle("Category")
            .select("Choices")();
        setCategories(p => results?.Choices);
        setCategory(results?.Choices[0]);
    }

    const fetchquicklinksByCategory = async (categoryVal: string) => {
        if (categoryVal) {
            setShowAll(false);
            const sp = spfi().using(SPFx(props.context));
            const results: any = await sp.web.lists
                .getByTitle("CBDQuickLinks")
                .items.filter(`Category eq '${categoryVal}'`).orderBy('Title')();
            setQuicklinks(results);

        }
    }

    const fetchAll = async () => {
        await fetchquicklinksChoices();
    }

    React.useEffect(() => {
        fetchAll();
    }, []);

    React.useEffect(() => {
        fetchquicklinksByCategory(category);
    }, [category]);

    const appendEnvToSharePointUrl = (url: string, IsNew: boolean): string => {
        if (url) {
            if (!IsNew && url.indexOf(".aspx") !== -1 && url.indexOf("env=WebView") === -1) {
                if (url.indexOf("?") !== -1) {
                    return `${url}&env=WebView`;
                } else {
                    return `${url}?env=WebView`;
                }
            }
        }
        return url;
    };

    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto quicklinks py-20">

            <div className="text-4xl text-gray1 font-bold px-2 pb-8">Quick Links</div>
            {categories && quicklinks && (
                <div className="flex flex-col gap-8">
                    <ul className="flex gap-2 items-center flex-wrap">
                        {categories.map((c: string) => (
                            <li key={`category_${c}`} className="cursor-pointer">
                                <a className={`block px-4 py-2 rounded-full border border-gray4 text-base ${category === c ? 'bg-primary text-white font-bold ' : 'text-primary bg-white'}`} onClick={() => setCategory(c)}>{c}</a>
                            </li>
                        ))}
                    </ul>
                    <ul className="grid grid-cols-2 list-inside list-square ">
                        {
                            quicklinks.slice(0, showAll ? quicklinks.length : props.count).map((link: any, index: number) => (
                                <li key={`link_${index}`} className={`border-b border-gray5 ${index === quicklinks.length - 1 && quicklinks.length % 2 !== 0 ? 'col-span-2' : ''}`}>
                                    <a className="text-gray1 inline-block px-2 py-4 hover:underline hover:underline-offset-8 hover:text-primary hover:font-bold text-base" data-interception="off" rel="noopener noreferrer" target={link.IsNew ? "_blank" : "_self"} href={appendEnvToSharePointUrl(link.LinkToPage, link.IsNew)}>{link.Title}</a>
                                </li>
                            ))
                        }

                    </ul>
                    {quicklinks.length > props.count && (
                        <button className="outline-none ring-0 focus:outline-none focus:ring-0 w-fit font-bold text-base text-primary flex gap-2 items-center cursor-pointer" onClick={() => setShowAll(!showAll)}>
                            <span>{showAll ? 'See Less' : 'See More'}</span>
                            <Icon iconName={showAll ? 'ChevronUp' : 'ChevronDown'} />
                        </button>
                    )}

                    {quicklinks.length < 1 && (
                        <div className="text-gray1 block p-2 text-base m-auto">No records Found.</div>
                    )}
                </div>
            )}
        </div>
    )
}
