import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import "./../../../../tailwind.css";
import { IBreadcrumbItem } from "@fluentui/react/lib/Breadcrumb";
import { Icon } from "@fluentui/react/lib/Icon";

export interface IBanner {
    context: BaseWebPartContext;
    title: string;
    bannerImageUrl: string;
}
export const Banner: React.FunctionComponent<IBanner> = (props) => {
    const [breadcrumbItems, setBreadcrumbItems] = React.useState<IBreadcrumbItem[]>([]);

    const fetchBreadcrumbItems = async () => {

        const currentPage = props.context.pageContext.legacyPageContext;
        const items: IBreadcrumbItem[] = [
            {
                text: currentPage.webTitle,
                key: 'home',
                href: currentPage.webAbsoluteUrl
            }
        ];

        items.push({
            text: props.title,
            key: 'pageTitle',
            isCurrentItem: true
        });
        setBreadcrumbItems(items);
    };

    const fetchAll = async () => {
        await fetchBreadcrumbItems();
    }

    React.useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div className="w-full rounded-lg relative font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto banner py-4" style={{ "height": "340px" }}>
            <div className="absolute top-140 left-140 z-10">
                <nav aria-label="Breadcrumb">
                    <ol className="flex gap-1 text-white text-base items-center">
                        {breadcrumbItems && breadcrumbItems.map((item, index) => (
                            <li key={item.key} className={index === breadcrumbItems.length - 1 ? 'flex text-base items-center opacity-75' : ' text-base flex items-center'}>
                                {item.isCurrentItem ? (
                                    <span>{item.text}</span>
                                ) : (
                                    <a href={`${item.href}/?env=WebView`} className="hover:underline block">
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
                {props.title}
            </div>
            <div className="relative mix-blend-overlay w-full h-full rounded-lg overflow-hidden">
                <div className="absolute bg-gradient-to-r from-primary to-primary1 h-full w-full" />
                <img src={props.bannerImageUrl} alt={"Banner"} className="absolute object-cover w-full h-full opacity-50" />
            </div>
        </div>
    );
}