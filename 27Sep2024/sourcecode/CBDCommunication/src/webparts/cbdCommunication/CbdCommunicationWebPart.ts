
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "../ComponentManager";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls";


export interface ICbdCommunicationWebPartProps {
  count: number;
  link: string;
  detailLink: string;
  view: number;
  bannerImageUrl: string;
}

export default class CbdCommunicationWebPart extends BaseClientSideWebPart<ICbdCommunicationWebPartProps> {


  public render(): void {
    ComponentManager.render(
      this.context,
      this.properties.count,
      this.properties.link,
      this.properties.detailLink,
      this.properties.bannerImageUrl,
      this.properties.view,
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
                PropertyFieldNumber("count", {
                
                  key: "count",
                  label: "Choose a number of items to display",
                  value: this.properties.count,
                  maxValue: 5000,
                  minValue: 2,
                  disabled: false,
                }),
                PropertyPaneDropdown("view", {
                  label: "Select View",
                  options: [{
                    key: 0,
                    text: "Gallery View"
                  },
                  {
                    key: 1,
                    text: "Search View"
                  },
                  {
                    key: 2,
                    text: "Detail View"
                  }],
                  selectedKey: this.properties.view
                }

                ),

                PropertyPaneTextField("bannerImageUrl", {
                  label: "Please provide a image url for the banner",
                  value: this.properties.bannerImageUrl
                }),
                PropertyPaneTextField("link", {
                  label: "Please provide a link for View All",
                  value: this.properties.link
                }),
                PropertyPaneTextField("detailLink", {
                  label: "Please provide a link for Detail",
                  value: this.properties.detailLink
                }),
              ],

            },
          ],
        }
      ]
    };
  }
}

