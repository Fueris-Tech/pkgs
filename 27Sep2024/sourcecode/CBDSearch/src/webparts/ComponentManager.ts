import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Search } from "./cbdSearch/components/Search/search";


export default class ComponentManager {
  public static render(context: BaseWebPartContext, count: number, element: HTMLElement): void {
    const component = React.createElement(Search, { context, count });
    ReactDOM.render(component, element);
  }

  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


