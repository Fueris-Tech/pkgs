
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "../ComponentManager";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls";


export interface ICbdSearchWebPartProps {
  count: number;
}

export default class CbdSearchWebPart extends BaseClientSideWebPart<ICbdSearchWebPartProps> {


  public render(): void {
    ComponentManager.render(
      this.context,
      this.properties.count,
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
                })
              ],

            },
          ],
        }
      ]
    };
  }
}

