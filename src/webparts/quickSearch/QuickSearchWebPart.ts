import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'QuickSearchWebPartStrings';
import QuickSearch from './components/QuickSearch';
import { IQuickSearchProps } from './components/IQuickSearchProps';

export interface IQuickSearchWebPartProps {
  description: string;
}

export default class QuickSearchWebPart extends BaseClientSideWebPart<IQuickSearchWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IQuickSearchProps> = React.createElement(
      QuickSearch,
      {
        description: this.properties.description,
        spHttpClient: this.context.spHttpClient,
        currentSiteUrl: this.context.pageContext.web.absoluteUrl,
        currentRootUrl: this.context.pageContext.site.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
