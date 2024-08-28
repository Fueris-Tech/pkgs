import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BCM } from "./BCM/bcm";
import { Fee } from "./Fee/fee";

export default class ComponentManager {
  public static render(context: BaseWebPartContext, view: number, element: HTMLElement): void {

    let component;
    switch (view) {
      case 1:
        component = React.createElement(Fee, { context });
        break;

      default:
        component = React.createElement(BCM, { context });
        break;
    }
    ReactDOM.render(component, element);

  }

  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


