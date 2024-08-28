
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneDropdown } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "./components/ComponentManager";


export interface ICbdbcmWebPartProps {
  view: number;
}

export default class CbdbcmWebPart extends BaseClientSideWebPart<ICbdbcmWebPartProps> {


  public render(): void {
    ComponentManager.render(
      this.context,
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
                    text: "BCM View"
                  },
                  {
                    key: 1,
                    text: "Fee View"
                  }],
                  selectedKey: this.properties.view
                }

                ),
              ]
            }
          ],
        }
      ]
    };
  }
}




