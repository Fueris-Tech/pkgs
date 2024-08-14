import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import ComponentManager from '../componentManager';

import { initializeIcons } from '@fluentui/font-icons-mdl2';

export interface ICbdAppCustomizerApplicationCustomizerProperties {
  cssurl: string;
  headerSiteUrl: string;
}

export default class CbdAppCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<ICbdAppCustomizerApplicationCustomizerProperties> {

  private header: PlaceholderContent | undefined;
  //private footer: PlaceholderContent | undefined;

  private hidecss() {
    const headerElements: any = document.querySelectorAll('#SuiteNavPlaceHolder, #SuiteNavWrapper, .sp-appBar, .ms-HubNav, #spSiteHeader'); // Replace with the actual header selector
    if (headerElements) {
      headerElements.forEach((element: any) => {
        (element as HTMLElement).style.display = 'none';
      });
    }
  }
  @override
  public onInit(): Promise<void> {
    this.properties.headerSiteUrl = "https://cbddxb.sharepoint.com/sites/CBDZOOM";

    //this.properties.cssurl = "/sites/test/SiteAssets/cbd/cbd.css";
    //this.properties.cssurl = `${this.context.pageContext.web.serverRelativeUrl}/SiteAssets/CBD/cbd.css`;
    this.properties.cssurl = `${this.properties.headerSiteUrl}/SiteAssets/CBD/cbd.css`;
    const cssUrl: string = this.properties.cssurl;
    this.hidecss();
    if (cssUrl) {
      const head: any =
        document.getElementsByTagName("head")[0] || document.documentElement;

      const customStyle: HTMLLinkElement = document.createElement("link");
      customStyle.href = cssUrl;
      customStyle.rel = "stylesheet";
      customStyle.type = "text/css";
      head.insertAdjacentElement("beforeEnd", customStyle);
    }

    initializeIcons();
    this.context.application.navigatedEvent.add(this, this.bootstrap);
    return Promise.resolve();
  }

  private bootstrap(): void {
    if (!this.header) {
      this.header = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
    }

    // if (!this.footer) {
    //   this.footer = this.context.placeholderProvider.tryCreateContent(
    //     PlaceholderName.Bottom,
    //     { onDispose: this._onDispose }
    //   );
    // }

    ComponentManager.renderHeader(this.context, this.properties.headerSiteUrl, this.header!.domElement);
    //ComponentManager.renderFooter(this.context, this.footer!.domElement);
  }

  private _onDispose(): void {
    ComponentManager._dispose(this.header!.domElement);
    //ComponentManager._dispose(this.footer!.domElement);
  }
}
