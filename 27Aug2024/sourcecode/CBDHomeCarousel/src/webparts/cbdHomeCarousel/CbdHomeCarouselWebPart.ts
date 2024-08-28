import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import ComponentManager from "../ComponentManager";
import { PropertyFieldNumber } from "@pnp/spfx-property-controls";

export interface ICbdHomeCarouselWebPartProps {
  count: number;
  playspeed: number;
}

export default class CbdHomeCarouselWebPart extends BaseClientSideWebPart<ICbdHomeCarouselWebPartProps> {

  public render(): void {
    ComponentManager.render(
      this.context,
      this.properties.count,
      this.properties.playspeed,
      this.domElement);
  }

  protected onDispose(): void {
    ComponentManager._dispose(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    //   const speedOptions:IPropertyPaneDropdownOption[] = [{
    //     key: 1000,
    //     text: '1ms'
    //   }, {
    //     key: 2000,
    //     text: '2ms'
    //   }, {
    //     key: 3000,
    //     text: '3ms'
    //   }, {
    //     key: 6000,
    //     text: '1min'
    //   },
    //   , {
    //     key: 12000,
    //     text: '2min'
    //   }
    // ] as any;
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyFieldNumber("count", {
                  key: "count",
                  label: "Choose a number of slides to display",
                  value: this.properties.count,
                  maxValue: 10,
                  minValue: 2,
                  disabled: false,
                }),
                // PropertyPaneDropdown('playspeed', {
                //   label: 'Select the speed',
                //   options: speedOptions,
                //   selectedKey: this.properties.playspeed
                // })
              ],

            },
          ],
        },
      ],
    };
  }
}
