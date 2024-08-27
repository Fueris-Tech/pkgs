import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as React from "react";
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";

export interface ISubMenu {
    context: BaseWebPartContext;
    submenuTitle: string;
    isOverview: boolean;
}

export const SubMenu: React.FunctionComponent<ISubMenu> = (props) => {

    const [menus, setMenus] = React.useState<any[]>();

    const fetchPolicy = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any[] = await sp.web.lists.getByTitle("CBDHeaderMenu").items.select("ID,Title,HeaderNavOrder,HeaderNavParentIdId,HeaderNavUrl,IsNew").orderBy("HeaderNavOrder", true)();
        let l = [];
        let p = results.filter(item => item.Title === props.submenuTitle)[0];
        if (props.isOverview) {
            l.push({ title: "Overview", url: p.HeaderNavUrl || '' });
        }
        results.filter(item => item.HeaderNavParentIdId === p.ID).forEach(ii => l.push({ title: ii.Title, url: ii.HeaderNavUrl || '', IsNew: ii.IsNew }));
        setMenus(l);
    }

    const fetchAll = async () => {
        await fetchPolicy();
    }
    React.useEffect(() => {
        fetchAll();
    }, []);

    const appendEnvToSharePointUrl = (url: string, IsNew: boolean, title: string): string => {
        if (url) {
            if (title === "Home") {
                return `${url}?env=WebView`;
            }
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
        <div className="font-cairo m-auto max-w-xlmax news pt-8 pb-8">
            <ul className="m-auto max-w-lgmax flex gap-2 items-center flex-wrap">
                {menus && menus.map(link => (
                    <li key={`link_${link}`} className="cursor-pointer">
                        <a className={`block px-4 py-2 rounded-full border border-gray4 text-base ${link.url.toLowerCase().includes(window.location.pathname.toLowerCase()) ? 'bg-primary text-white font-bold' : 'text-primary bg-white'}`} data-interception="off" rel="noopener noreferrer" target={link.IsNew ? "_blank" : "_self"} href={appendEnvToSharePointUrl(link.url, link.IsNew, link.Title)}  >{link.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    )


}