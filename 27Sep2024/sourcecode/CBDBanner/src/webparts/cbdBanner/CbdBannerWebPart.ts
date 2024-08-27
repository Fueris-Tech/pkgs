
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneTextField } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "../ComponentManager";
import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/security";


export interface ICbdBannerWebPartProps {
  title: string;
  bannerImageUrl: string;
}

export default class CbdBannerWebPart extends BaseClientSideWebPart<ICbdBannerWebPartProps> {


  // private updatePageTitle(newTitle: string): void {
  //   const pageId = this.context.pageContext.listItem?.id;

  //   if (pageId) {
  //     const updateTitle = (retryCount: number = 3) => {
  //       const sp = spfi().using(SPFx(this.context));
  //       sp.web.lists.getByTitle('Site Pages').items.getById(pageId)().then(item => {
  //         sp.web.lists.getByTitle('Site Pages').items.getById(pageId).update({
  //           Title: 'newTitle'
  //         }, item["odata.etag"]).then(() => {
  //           console.log('Page title updated successfully');
  //         }).catch(error => {
  //           if (error.status === 412 && retryCount > 0) { // Precondition Failed (412)
  //             console.warn('Conflict detected, retrying...', retryCount);
  //             updateTitle(retryCount - 1);
  //           } else {
  //             console.error('Error updating page title', error);
  //           }
  //         });
  //       }).catch(error => {
  //         console.error('Error fetching item', error);
  //       });
  //     };

  //     updateTitle();
  //   }
  // }




  public render(): void {
    ComponentManager.render(
      this.context,
      this.properties.title,
      this.properties.bannerImageUrl,
      this.domElement);
  }

  protected onDispose(): void {
    ComponentManager._dispose(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [

                PropertyPaneTextField("bannerImageUrl", {
                  label: "Please provide a image url for the banner",
                  value: this.properties.bannerImageUrl
                }),
                PropertyPaneTextField("title", {
                  label: "Please provide a title for the banner",
                  value: this.properties.title,
                }),

              ],

            },
          ],
        }
      ]
    };
  }

  protected async onPropertyPaneConfigurationStart(): Promise<void> {
    if (this.properties.title) {
      const sp = spfi().using(SPFx(this.context));
      const item = await sp.web.getFileByServerRelativePath(this.context.pageContext.legacyPageContext.serverRequestPath).getItem<{ Title: string }>("Title");
      this.properties.title = item.Title;
      this.context.propertyPane.refresh();
    }
  }
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if (propertyPath === 'title' && newValue !== oldValue) {
      //this.updatePageTitle(newValue);
      let elem:any = document.querySelector('div[data-automation-id="pageHeader"] textarea');
      if(elem){
        elem.value = newValue;
      }
      this.render();
    }
  }
}

