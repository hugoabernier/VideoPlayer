import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'PlayerWebPartStrings';
import { Player } from './components/Player';
import { IPlayerProps } from './components/IPlayerProps';

/**
 * Use this for dynamic properties
 */
//import { DynamicProperty } from '@microsoft/sp-component-base';

/**
 * Plain old boring web part thingies
 */
import {
  BaseClientSideWebPart,
  IWebPartPropertiesMetadata,
  PropertyPaneDynamicFieldSet,
  PropertyPaneDynamicField
} from '@microsoft/sp-webpart-base';
export interface IPlayerWebPartProps {
  videoUrl: string;
}

export default class PlayerWebPart extends BaseClientSideWebPart<IPlayerWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IPlayerProps> = React.createElement(
      Player,
      {
        videoUrl: this.properties.videoUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }


  // protected get propertiesMetadata(): IWebPartPropertiesMetadata {
  //   return {
  //     // Specify the web part properties data type to allow the address
  //     // information to be serialized by the SharePoint Framework.
  //     'videoUrl': {
  //       dynamicPropertyType: 'string'
  //     }
  //   };
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('videoUrl', {
                  label: strings.VideoUrlFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
