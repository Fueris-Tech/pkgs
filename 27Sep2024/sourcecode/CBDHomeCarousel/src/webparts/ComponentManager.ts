import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Slider } from "./cbdHomeCarousel/components/Slider/slider";


export default class ComponentManager {
  public static render(context: BaseWebPartContext, count:number,playspeed:number, element: HTMLElement): void {
    const component = React.createElement(Slider, { context, count,playspeed });
    ReactDOM.render(component, element);
  }

  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


