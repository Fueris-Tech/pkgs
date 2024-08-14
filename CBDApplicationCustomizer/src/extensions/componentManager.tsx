import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Header } from "./cbdAppCustomizer/components/header/header";
//import { Footer } from "./cbdAppCustomizer/components/footer/footer";

export default class ComponentManager {
    public static renderHeader(context: ApplicationCustomizerContext, headerSiteUrl: string, element: HTMLElement): void {
        let component = React.createElement(Header, { context, headerSiteUrl });
        ReactDOM.render(component, element);
    }

    // public static renderFooter(context: ApplicationCustomizerContext, element: HTMLElement): void {
    //     let component = React.createElement(Footer, { context });
    //     ReactDOM.render(component, element);
    // }

    public static _dispose(element: HTMLElement): void {
        ReactDOM.unmountComponentAtNode(element);
    }
}