import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import * as React from "react";
import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";

export interface IFooter {
    context: ApplicationCustomizerContext
}

export const Footer: React.FunctionComponent<IFooter> = (props: any) => {

    const [menus, setMenus] = React.useState<any[]>();
    const logourl = `${props.context.pageContext.web.serverRelativeUrl}/SiteAssets/CBD/footer/logo.png`;

    const fetchFooterMenu = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any[] = await sp.web.lists.getByTitle("CBDFooterMenu").items.select("ID,Title,FooterNavOrder,FooterNavUrl").orderBy("FooterNavOrder", true)();
        setMenus(results);
    }

    const fetchAll = async () => {
        await fetchFooterMenu();
    }
    React.useEffect(() => {
        fetchAll();
    },[]);

    return (<div className="bg-gray1">
        <div className="p-2 font-cairo m-auto max-w-screen-2xl ">
        <div className="flex gap-10 items-center min-h-[76px] text-white flex-wrap">
           <div className="flex-none">
           <a href={props.context.pageContext.site.serverRelativeUrl}><img src={logourl} alt="Commercial Bank of Dubai" width={180} height={50} /></a>
           </div>
           <div className="grow">
            <span>Copyright © {(new Date()).getFullYear()}.Commercial Bank of Dubai,All Rights Reserved.</span>
           </div>
            <ul className="grow flex items-center justify-around">
                {menus && menus.map((menu:any,index:number) => (
                    <li key={`footer_${index}`}>
                        <a target="_blank" href={menu.FooterNavUrl}>{menu.Title}</a>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    </div>)
}

