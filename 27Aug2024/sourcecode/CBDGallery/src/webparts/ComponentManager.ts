import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { PhotoGallery } from "./cbdGallery/components/PhotoGallery/photoGallery";
import { SlideShow } from "./cbdGallery/components/SlideShow/slideShow";
import { ShowCase } from "./cbdGallery/components/ShowCase/showCase";


export default class ComponentManager {
  public static render(context: BaseWebPartContext, count: number, link: string, detaillink: string, slides: number, view: number, element: HTMLElement): void {
    let component;
    switch (view) {
      case 1:
        component = React.createElement(ShowCase, { context, count, link, detaillink, slides });
        break;
      case 2:
        component = React.createElement(SlideShow, { context, count, link, detaillink, slides });
        break;

      default:
        component = React.createElement(PhotoGallery, { context, count, link, detaillink, slides });
        break;
    }
    ReactDOM.render(component, element);
  }

  public static _dispose(element: HTMLElement): void {
    ReactDOM.unmountComponentAtNode(element);
  }
}


