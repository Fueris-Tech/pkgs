
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "../ComponentManager";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls";


export interface ICbdGalleryWebPartProps {
  count: number;
  link: string;
  detaillink: string;
  slides: number;
  view: number;
}

export default class CbdGalleryWebPart extends BaseClientSideWebPart<ICbdGalleryWebPartProps> {


  public render(): void {
    ComponentManager.render(
      this.context,
      this.properties.count,
      this.properties.link,
      this.properties.detaillink,
      this.properties.slides,
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
                PropertyPaneDropdown("view", {
                  label: "Select View",
                  options: [{
                    key: 0,
                    text: "Gallery View"
                  },
                  {
                    key: 1,
                    text: "Showcase View"
                  },
                  {
                    key: 2,
                    text: "SlideShow View"
                  }],
                  selectedKey: this.properties.view
                }

                ),
                PropertyPaneTextField("link", {
                  label: "Please provide a link for View All",
                  value: this.properties.link,

                }),
                PropertyPaneTextField("detaillink", {
                  label: "Please provide a link for Slideshow",
                  value: this.properties.link,

                }),
                PropertyFieldNumber("count", {

                  key: "count",
                  label: "Choose a number of filters to display",
                  value: this.properties.count,
                  maxValue: 20,
                  minValue: 2,
                  disabled: false,
                }),
                PropertyFieldNumber("slides", {

                  key: "slides",
                  label: "Choose a number of items to display",
                  value: this.properties.slides,
                  maxValue: 20,
                  minValue: 2,
                  disabled: false,
                })
              ],

            },
          ],
        }
      ]
    };
  }
}


