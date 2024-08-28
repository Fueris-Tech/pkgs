import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AnnouncementDetail } from "./AnnouncementDetail/announcementDetail";
import { NotificationDetail } from "./NotificationDetail/notificationDetail";
import { Announcement } from "./Announcement/announcement";
import { SubMenu } from "./Submenu/subMenu";
import { PDFViewer } from "./PDFViewer/pdfViewer";




export default class ComponentManager {
  public static render(context: BaseWebPartContext, link: string, view: number, submenuTitle: string, isOverview: boolean, pdfHeight: string, element: HTMLElement): void {

    let component;
    switch (view) {
      case 1:
        component = React.createElement(AnnouncementDetail, { context });
        break;
      case 2:
        component = React.createElement(NotificationDetail, { context });
        break;
      case 3:
        component = React.createElement(SubMenu, { context, submenuTitle, isOverview });
        break;
      case 4:
        component = React.createElement(PDFViewer, { context, link, pdfHeight });
        break;

      default:
        component = React.createElement(Announcement, { context, link, submenuTitle });
        break;
    }
    ReactDOM.render(component, element);

  }

  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


