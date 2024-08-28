
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneTextField, PropertyPaneToggle } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "./components/ComponentManager";


export interface ICbdAnnouncementWebPartProps {
  link: string;
  view: number;
  submenuTitle: string;
  isOverview: boolean;
  pdfHeight: string;
}

export default class CbdAnnouncementWebPart extends BaseClientSideWebPart<ICbdAnnouncementWebPartProps> {


  public render(): void {
    ComponentManager.render(
      this.context,
      this.properties.link,
      this.properties.view,
      this.properties.submenuTitle,
      this.properties.isOverview,
      this.properties.pdfHeight,
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
                    text: "Announcement View"
                  },
                  {
                    key: 1,
                    text: "Announcement Detail View"
                  },
                  {
                    key: 2,
                    text: "Notification Detail View"
                  },
                  {
                    key: 3,
                    text: "Submenu View"
                  },
                  {
                    key: 4,
                    text: "PDF View"
                  }],
                  selectedKey: this.properties.view
                }

                ),

                PropertyPaneTextField("link", {
                  label: "Please provide a link for Detail View",
                  value: this.properties.link
                }),
                PropertyPaneTextField("submenuTitle", {
                  label: "Please provide the menu Title for Submenu View",
                  value: this.properties.submenuTitle
                }),
                PropertyPaneTextField("pdfHeight", {
                  label: "Please provide the height for PDF(100px, 50%, 75vh,etc)",
                  value: this.properties.submenuTitle
                }),
                PropertyPaneToggle("isOverview", {
                  checked: this.properties.isOverview,
                  label: "Is Overview?"
                })
              ]
            }
          ],
        }
      ]
    };
  }
}




