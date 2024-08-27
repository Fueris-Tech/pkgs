import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Communications } from "./cbdCommunication/components/Communication/communication";
import { Search } from "./cbdCommunication/components/Search/search";
import { Detail } from "./cbdCommunication/components/Detail/detail";


export default class ComponentManager {
  public static render(context: BaseWebPartContext, count: number, link: string, detailLink: string, bannerImageUrl: string, view: number, element: HTMLElement): void {

    let component;
    switch (view) {
      case 1:
        component = React.createElement(Search, { context, count, link, detailLink, bannerImageUrl });
        break;
      case 2:
        component = React.createElement(Detail, { context, link, detailLink, bannerImageUrl });
        break;

      default:
        component = React.createElement(Communications, { context, count, link, detailLink });
        break;
    }
    ReactDOM.render(component, element);

  }


  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


