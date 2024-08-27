
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import "./../../../../tailwind.css";
import * as React from "react";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IFee {
    context: BaseWebPartContext;
}

export const Fee: React.FunctionComponent<IFee> = (props) => {

    const [feeItems, setFeeItems] = React.useState<any[]>([]);

    const fetchFeeItems = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDFeeLinks")
            .items
            .orderBy("Order", true)();
        setFeeItems((prev: any) => [...prev, ...results]);

    };

    const fetchAll = async () => {
        await fetchFeeItems();
    }

    React.useEffect(() => {
        fetchAll();
    }, []);

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
        <div className="font-cairo m-auto max-w-xlmax news pt-8 pb-20">
            <div className="max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto grid grid-cols-2 gap-6 py-10">
                {
                    feeItems && feeItems
                        .filter(l => l.Category === "Header")
                        .map(it => (
                            <div className="flex flex-col gap-6">
                                <p className="text-gray1 font-bold text-2xl">{it.Title}</p>
                                <ul className="flex flex-col w-full gap-6">
                                    {feeItems
                                        .filter(ll => ll.Category === "Link" && ll.ParentId === it.Id)
                                        .map(iit => (
                                            <li>
                                                <a className="block p-4 bg-white rounded-lg border-light border shadow-3xl text-base text-primary hover:font-bold" data-interception="off" rel="noopener noreferrer" target={iit.IsNew ? "_blank" : "_self"} href={appendEnvToSharePointUrl(iit.LinkToPage, iit.IsNew)}>{iit.Title}</a>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}
            </div>
        </div>
    );
}