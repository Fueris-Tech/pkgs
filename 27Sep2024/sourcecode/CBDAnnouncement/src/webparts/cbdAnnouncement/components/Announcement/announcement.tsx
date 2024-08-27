import "./../../../../tailwind.css";
import * as React from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import { BaseWebPartContext } from "@microsoft/sp-webpart-base";

export interface IAnnouncement {
    context: BaseWebPartContext;
    link: string;
    submenuTitle: string;
}

export const Announcement: React.FunctionComponent<IAnnouncement> = (props) => {


    return (
        <div className="font-cairo m-auto max-w-smmax news p-10 bg-light rounded-lg">
            <p className="flex-none w-fit  text-xl text-gray1 font-bold">New Policies & Procedures</p>
            <ul className="flex flex-col w-full gap-2 py-4">
                <li className="flex justify-between items-center py-2">
                    <a className="flex items-center gap-2 text-primary text-base" href={`${props.link}`}>
                        <span>{props.submenuTitle} </span>
                        <Icon iconName="ChevronRight" />
                    </a>
                </li>

            </ul>
        </div>
    )
}