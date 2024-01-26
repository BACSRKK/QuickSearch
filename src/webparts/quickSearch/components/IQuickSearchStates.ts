import { NumericLiteral } from "typescript";

export interface IQuickSearchStates {
  listItems:  IListData[];
  total: number;
  uptodate: number;
  forreview: number;
  overdue: number;
  publishedcount: number;
  businessName: businessList[];
  policyCount : number;
  procedureCount: number;
  //L3count: number;
  piechart: chartSchema[];
  hbarchart: hbarChartSchema[];
  uptodatecount: uptoDate[];
}

export interface uptoDate{
  count:number;
  id: number;
  Name: string;
  Status: string;
  business: string;
}

export interface IListData {
  id: number;
  Name: string;
  Status: string;
  business: string;
  libType: string;
  duedate?: Date;
}

export interface businessList {
Title: string;
}
export interface chartSchema {
  id: number;
  title: string;
  chartData: number;

}

export interface hbarChartSchema {
  business: string;
  data: number[];
  data2: number[];
  data3: number[];
}

