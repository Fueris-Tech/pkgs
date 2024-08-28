import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Banner } from "./cbdBanner/components/Banner/banner";



export default class ComponentManager {
  public static render(context: BaseWebPartContext, title: string, bannerImageUrl: string, element: HTMLElement): void {

    const component = React.createElement(Banner, { context, title, bannerImageUrl });
    ReactDOM.render(component, element);

  }


  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


