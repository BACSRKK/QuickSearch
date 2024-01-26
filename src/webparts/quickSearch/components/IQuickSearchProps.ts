import { SPHttpClient } from "@microsoft/sp-http";//get the httpclient
export interface IQuickSearchProps {
  description: string;
  spHttpClient:SPHttpClient;
  currentSiteUrl: string;
  currentRootUrl: string;
}
