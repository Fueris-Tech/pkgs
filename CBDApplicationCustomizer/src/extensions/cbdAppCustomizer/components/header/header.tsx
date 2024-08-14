import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import * as React from "react";
import "./../../../../tailwind.css";
import { IPersonaSharedProps, Persona, PersonaSize } from "@fluentui/react/lib/Persona";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/profiles";
import Navbar from "./navbar";
import { Icon } from "@fluentui/react/lib/components/Icon";
import dateFormat from "dateformat";
import { Web } from "@pnp/sp/webs";
export interface IHeader {
    context: ApplicationCustomizerContext,
    headerSiteUrl: string;
}

export const Header: React.FunctionComponent<IHeader> = (props: IHeader) => {
    const [menus, setMenus] = React.useState<any[]>();
    const [filteredIds, setFilteredIds] = React.useState<any[]>([]);
    const [notifications, setNotifications] = React.useState<any[]>();
    const [profileInfo, setProfileInfo] = React.useState<any>();
    const [userInfo, setUserInfo] = React.useState<any>();
    //const logourl = `${props.context.pageContext.web.serverRelativeUrl}/SiteAssets/CBD/header/logo.jpg`;
    const logourl = `${props.headerSiteUrl}/SiteAssets/CBD/header/logo.jpg`;
    const personaProps: IPersonaSharedProps = {
        imageUrl: `/_layouts/15/userphoto.aspx?size=L&username=${props.context.pageContext.user.email}`,
        title: props.context.pageContext.user.displayName
    }

    const fetchUserProperty = async () => {
        const sp = spfi().using(SPFx(props.context));
        const data: any = await sp.profiles.myProperties();
        setUserInfo(data);
    }

    const fetchProfileProperty = async () => {
        const columns = ["Title", "Department", "WorkPhone", "SPS-StatusNotes"];
        let data: any = {};

        userInfo?.UserProfileProperties.map((up: any) => {
            if (columns.indexOf(up.Key) > -1) {
                data[up.Key] = up.Value || 'NA';
            }
        });
        setProfileInfo(data);

        await fetchNotifications(data);
    }

    const fetchHeaderMenu = async () => {
        //const sp = spfi().using(SPFx(props.context));
        // const targetWeb = Web(props.headerSiteUrl);
        // const sp = spfi().using(SPFx(props.context)).using(targetWeb);
        const sp = Web(props.headerSiteUrl).using(SPFx(props.context));
        // const results: any[] = await sp.web.lists.getByTitle("CBDHeaderMenu")
        const results: any[] = await sp.lists.getByTitle("CBDHeaderMenu")
            .items.select("ID,Title,HeaderNavOrder,HeaderNavParentIdId,HeaderNavUrl,IsNew").orderBy("HeaderNavOrder", true)();
        setMenus(results);
    }

    const fetchNotifications = async (data: any) => {
        const currentDate = new Date();
        //const sp = spfi().using(SPFx(props.context));
        //const targetWeb = Web(props.headerSiteUrl);
        //const sp = spfi().using(SPFx(props.context)).using(targetWeb);
        const sp = Web(props.headerSiteUrl).using(SPFx(props.context));
        //const results: any[] = await sp.web.lists.getByTitle("CBDNotification").items
        const results: any[] = await sp.lists.getByTitle("CBDNotification").items
            .select("*")
            .filter(
                `Expires ge datetime'${currentDate.toISOString()}'`
            )
            .orderBy("Modified", false)();
        if (data['SPS-StatusNotes'] === 'NA') {
            setNotifications(results);
            setFilteredIds([]);
        }
        else {
            const ids = data["SPS-StatusNotes"].split(',');
            const filteredResults: any[] = [];
            const fIds: any[] = [];
            results.map((r) => {
                if (ids.includes(`${r.Id}`)) {
                    fIds.push(r.Id);
                    filteredResults.push({ ...r, isRead: true });
                }
                else {
                    filteredResults.push({ ...r, isRead: false });
                }
            });
            setNotifications(filteredResults);
            setFilteredIds(prev => fIds);
        }
    }

    const fetchAll = async () => {
        await fetchUserProperty();
        await fetchHeaderMenu();
        // await fetchNotifications();
    }

    React.useEffect(() => {
        if (userInfo) {
            fetchProfileProperty();
        }
    }, [userInfo]);

    React.useEffect(() => {
        fetchAll();
    }, []);

    const markAsRead = async (itemId: number, isRead: boolean) => {
        if (!isRead) {
            const sp = spfi().using(SPFx(props.context));
            const i = [...filteredIds, itemId]
            setFilteredIds(ids => [...i]);
            //await sp.profiles.setSingleValueProfileProperty(userInfo.AccountName, "SPS-StatusNotes", "");
            await sp.profiles.setSingleValueProfileProperty(userInfo.AccountName, "SPS-StatusNotes", i.join(","));
        }
        //window.location.href = `${props.context.pageContext.web.serverRelativeUrl}/sitepages/notificationDetail.aspx?NId=${itemId}`;
        window.location.href = `${props.headerSiteUrl}/sitepages/notificationDetail.aspx?NId=${itemId}`;
    }


    return (
        <div className="bg-white font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto ">
            <div className="flex gap-4 items-center min-h-[88px]">
                <div className="grow">
                    {/* <a href={props.context.pageContext.web.serverRelativeUrl}><img src={logourl} alt="Commercial Bank of Dubai" width={200} height={50} /></a> */}
                    <a href={props.headerSiteUrl}><img src={logourl} alt="Commercial Bank of Dubai" width={200} height={50} /></a>
                </div>
                <div className="grow headermenu">
                    {menus && <Navbar menus={menus} />}
                </div>
                <div className="flex-none">
                    <div className="cursor-pointer relative bg-search flex items-center w-12 h-12 rounded-full overflow-hidden">
                        {/* <a className=" w-full h-full flex items-center justify-center" href={`${props.context.pageContext.web.serverRelativeUrl}/sitepages/search.aspx`} > */}
                        <a className=" w-full h-full flex items-center justify-center" href={`${props.headerSiteUrl}/sitepages/search.aspx`} >
                            <Icon iconName="Search" className="text-lg font-bold text-gray1" />
                        </a>
                    </div>
                </div>
                <div className="flex-none group">
                    <span className="cursor-pointer relative bg-search flex items-center justify-center w-12 h-12 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#353535" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        {
                            notifications && notifications?.filter(n => !n.isRead)?.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-3 py-2 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{notifications?.filter(n => !n.isRead)?.length}</span>
                            )
                        }
                        {
                            notifications && notifications?.length > 0 && (
                                <div className="hidden group-hover:block absolute right-0 top-12 z-[1000] border-2 border-search rounded-lg p-4 bg-light w-[310px] h-[330px] shadow-lg overflow-y-auto">
                                    <p className="text-gray1 font-bold text-2xl py-2">Notifications <span className="font-normal"> ({notifications?.length})</span></p>
                                    <div className="flex flex-col w-full gap-3">
                                        {notifications.map((notification: any, index: number) => (
                                            <a key={`notify_${index}`} data-interception="off" rel="noopener noreferrer" target={notification.IsNew ? "_blank" : "_self"} onClick={() => markAsRead(notification.Id, notification.isRead)} className={`cursor-pointer flex gap-2 items-start border-b border-light p-2  ${notification.isRead ? 'bg-light ' : 'bg-white rounded-lg'}`}>
                                                {/* <Icon iconName="ChatBot" className="text-4xl flex-none" /> */}
                                                <div className="grow flex flex-col gap-2 ">
                                                    <p className={`text-gray1 ${notification.isRead ? '' : 'font-bold'}  text-base`}>{notification.Title}</p>
                                                    <p className="text-gray2 text-sm text-ellipsis">{notification.Summary}</p>
                                                    <p className="text-gray2 text-xs">{dateFormat(notification.Modified, "dd/mm/yyyy")}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </span>
                </div>
                <div className="flex-none group" >
                    <div className="relative m-auto">
                        <Persona
                            {...personaProps}
                            size={PersonaSize.size48}

                        />
                        <div className="hidden group-hover:block absolute right-0 top-12 z-[1000] border-2 border-light rounded-lg p-6 bg-white w-fit h-[330px] shadow-lg">
                            <div className="flex flex-col gap-1 px-4 items-center">
                                <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                                    <img className="object-cover w-full h-full" src={personaProps.imageUrl} alt="" />
                                </div>

                                <div className="text-gray1 font-bold text-lg text-nowrap">{props.context.pageContext.user.displayName}</div>
                                <div className="text-gray1 font-semibold text-base text-nowrap">{profileInfo?.Title || 'NA'}</div>
                                <div className="text-gray1 font-semibold text-base text-nowrap">{profileInfo?.Department || 'NA'}</div>
                            </div>

                            <div className="flex items-center gap-4 px-4 py-1 group child hover:bg-search hover:rounded-lg" >
                                <div className="flex-none">
                                    <Icon iconName="Mail" className="text-2xl text-secondary" />
                                </div>
                                <a href={`mailto:${props.context.pageContext.user.email}`} className="grow group-[.child]:hover:text-primary group-[.child]:hover:font-bold text-base">
                                    {props.context.pageContext.user.email || 'NA'}
                                </a>
                            </div>

                            <div className="flex items-center gap-4 px-4 py-1 group child hover:bg-search hover:rounded-lg" >
                                <div className="flex-none">
                                    <Icon iconName="Phone" className="text-2xl text-secondary" />
                                </div>
                                <div className="grow group-[.child]:hover:text-primary group-[.child]:hover:font-bold text-base">
                                    {profileInfo?.WorkPhone || 'NA'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

