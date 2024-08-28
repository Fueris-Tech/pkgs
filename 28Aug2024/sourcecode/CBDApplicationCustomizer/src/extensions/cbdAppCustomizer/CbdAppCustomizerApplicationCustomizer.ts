import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import ComponentManager from '../componentManager';

import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

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

  private async getHeaderUrlFromList(): Promise<void> {
    try {
      const sp = spfi().using(SPFx(this.context));
      const listItems = await sp.web.lists.getByTitle("CBDMappingList").items.select("Title")();
      if (listItems.length > 0) {
        this.properties.headerSiteUrl = listItems[0].Title;
      }
    } catch (error) {
      console.error("Error fetching header URL from list:", error);
    }
  }
  @override
  public async onInit(): Promise<void> {
    //this.properties.headerSiteUrl = "https://cbddxb.sharepoint.com/sites/CBDDEVZOOM";

    //this.properties.cssurl = "/sites/test/SiteAssets/cbd/cbd.css";
    //this.properties.cssurl = `${this.context.pageContext.web.serverRelativeUrl}/SiteAssets/CBD/cbd.css`;
    this.hidecss();
    await this.getHeaderUrlFromList();
    this.properties.cssurl = `${this.properties.headerSiteUrl}/SiteAssets/CBD/cbd.css`;
    const cssUrl: string = this.properties.cssurl;

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

    const canvasComponent = document.querySelector('.CanvasComponent');

    // if (!this.footer) {
    //   this.footer = this.context.placeholderProvider.tryCreateContent(
    //     PlaceholderName.Bottom,
    //     { onDispose: this._onDispose }
    //   );

    //}

    if (canvasComponent) {
      const footerDiv = document.createElement('div');
      footerDiv.className = 'footer';
      ComponentManager.renderFooter(this.context, this.properties.headerSiteUrl, footerDiv);
      canvasComponent.appendChild(footerDiv);
      // this.footer = {
      //   domElement: footerDiv,
      //   dispose: this._onDispose.bind(this)
      // };
    }

    ComponentManager.renderHeader(this.context, this.properties.headerSiteUrl, this.header!.domElement);
    //ComponentManager.renderFooter(this.context, this.properties.headerSiteUrl, this.footer!.domElement);
  }

  private _onDispose(): void {
    ComponentManager._dispose(this.header!.domElement);
    //ComponentManager._dispose(this.footer!.domElement);
  }
}
