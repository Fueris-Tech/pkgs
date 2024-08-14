
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import "./../../../../tailwind.css";
import * as React from "react";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IBCM {
    context: BaseWebPartContext;
}

export const BCM: React.FunctionComponent<IBCM> = (props) => {

    const [bcmItems, setBcmItems] = React.useState<any[]>([]);

    const fetchBcmItems = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDBCM")
            .items
            .orderBy("Order", true)();
        setBcmItems((prev: any) => [...prev, ...results]);
    };

    const fetchAll = async () => {
        await fetchBcmItems();
    }

    React.useEffect(() => {
        fetchAll();
    }, []);


    return (
        <div className="font-cairo m-auto max-w-xlmax news pt-8 pb-20">
            <div className=" max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto flex flex-col gap-6 py-10">
                {
                    <div className="flex gap-6 w-full h-full">
                        {
                            bcmItems && bcmItems.filter((hh: any) => hh.Category === 'Header').map((it: any, index: number) => (
                                <div className="flex flex-col w-fit gap-6">
                                    <p className="flex-none w-fit  text-xl text-gray1 font-bold">{it.Title}</p>
                                    <div key={`Header_${it}_${index}`} className="flex flex-col justify-stretch w-1453 h-503 gap-4 rounded-lg shadow-lg overflow-hidden">
                                        <p className="flex-none h-1268"> <img src={it.Thumbnail.Url} className="w-full h-full object-cover" /></p>
                                        <p className="flex-none w-fit  px-4 py-4 flex gap-2 flex-wrap ">
                                            {
                                                bcmItems.filter((hhh: any) => hhh.Category === 'Link' && hhh.ParentId === it.Id).map((iit: any, iindex: number) => (
                                                    <a key={`Link_${index}_${iindex}`} data-interception="off" rel="noopener noreferrer" target={iit.IsNew ? "_blank" : "_self"} className="text-base text-primary font-bold bg-light rounded-full block px-4 py-2 text-nowrap hover:bg-primary hover:text-white" href={iit.LinkToPage}>{iit.Title}</a>
                                                ))
                                            }</p>

                                    </div>
                                </div>

                            ))
                        }
                    </div>
                }
            </div>
        </div>
    );
}