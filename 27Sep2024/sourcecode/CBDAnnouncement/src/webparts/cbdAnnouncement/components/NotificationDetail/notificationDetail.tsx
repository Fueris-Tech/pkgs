import { IBreadcrumbItem } from "@fluentui/react/lib/Breadcrumb";
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as React from "react";
import dateFormat from "dateformat";
import { Icon } from "@fluentui/react/lib/Icon";


export interface INotificationDetail {
    context: BaseWebPartContext;
}

export const NotificationDetail: React.FunctionComponent<INotificationDetail> = (props) => {

    const [breadcrumbItems, setBreadcrumbItems] = React.useState<IBreadcrumbItem[]>([]);
    const [notificationItem, setNotificationItem] = React.useState<any>(null);

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

    const fetchNotificationItem = async () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('NId')) {
            const id = parseInt(params.get('NId') || '');
            try {

                const sp = spfi().using(SPFx(props.context));
                const result = await sp.web.lists.getByTitle("CBDNotification").items.select("*").getById(id)();
                setNotificationItem(result);
            } catch (error) {
                setNotificationItem(null);
            }
        }
    }

    const fetchAll = async () => {
        await fetchBreadcrumbItems();
        await fetchNotificationItem();
    }

    React.useEffect(() => {
        fetchAll();
    }, []);




    return (
        <div className="font-cairo m-auto max-w-xlmax news pt-8 pb-20">
            {notificationItem && <>
                <div className="w-full rounded-lg relative max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto" style={{ "height": "340px" }}>
                    <div className="absolute top-140 left-140 z-10 ">
                        <nav aria-label="Breadcrumb">
                            <ol className="flex gap-1 text-white text-base items-center">
                                {breadcrumbItems.map((item, index) => (
                                    <li key={item.key} className={index === breadcrumbItems.length - 1 ? 'flex text-base items-center opacity-75' : ' text-base flex items-center'}>
                                        {item.isCurrentItem ? (
                                            <span >{item.text}</span>
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
                    <div className="absolute top-340 left-140 z-10 text-4xl text-white text-bold ">
                        <p className="w-fit px-4 py-2 rounded-full border border-white text-sm text-white bg-transparent font-bold">{notificationItem.Title}</p>
                        <p className="text-4xl py-2 font-bold text-white max-w-mdmax" >{notificationItem.Summary}</p>
                    </div>
                    <div className="relative mix-blend-overlay w-full h-full rounded-lg overflow-hidden">
                        <div className="absolute bg-gradient-to-r from-primary to-transparent h-full w-full" />
                        <img src={notificationItem?.Thumbnail?.Url} alt={"Announcement"} className="absolute object-cover w-full h-full opacity-50" />
                    </div>
                </div>
                <div className="max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto py-10">
                    <p className="text-sm py-2 font-bold text-gray3">{dateFormat(notificationItem.Modified, "d mmmm yy")}</p>
                    <div dangerouslySetInnerHTML={{ __html: notificationItem.PageContent }} />
                </div>
            </>
            }
        </div>
    );
}
