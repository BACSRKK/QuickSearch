import * as React from 'react';
import styles from './QuickSearch.module.scss';
import { IQuickSearchProps } from './IQuickSearchProps';
import { IQuickSearchStates, IListData, chartSchema, hbarChartSchema, businessList } from './IQuickSearchStates';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import PieChart from "./PieChart";
import HBarChart from "./HorizontalBarChart";

export default class QuickSearch extends React.Component<IQuickSearchProps, IQuickSearchStates> {

  constructor(prop: IQuickSearchProps, state: IQuickSearchStates) {
    super(prop);
    this.state = {
      listItems: [],
      total: 0,
      uptodate: 0,
      forreview: 0,
      overdue: 0,
      publishedcount: 0,
      policyCount:0,
      procedureCount:0,
      piechart: [],
      hbarchart: [],
      businessName: [],
      uptodatecount: [],


    }
  }

  public async componentDidMount(): Promise<void> {
    this.getBusiness();
    await this.getMultiLists()
      .then((spListItemRSVP: IListData[]) => {
        console.log(spListItemRSVP);
        let vuptodate: number = 0; // VAR UP TO DATE
        let vforreview: number = 0; // VAR DUE FOR REVIEW
        let voverdue: number = 0; // VAR OVER DUE
        let hbar: hbarChartSchema[] = []
        let dataforbarchartCounts: any;
        let now = Date.now();

        spListItemRSVP.forEach(function (i, v) {
          // COUNT UP TO DATE (LIBRARY TYPE = PUBLISHED DOCUMENTS)
          if (i.libType == 'Published Documents') {
            vuptodate += 1;
          }

          else {
            if (i.Status == 'In Review') {
              vforreview += 1;  //COUNTS FOR THE DUE FOR THE REVIEW/PENDING
            }
            if (i.duedate != null && Date.parse(i.duedate.toLocaleString()) < now) {
              voverdue += 1; // COUNTS FOR THE OVERDUE
              console.log(i.id + " | " + i.Name + " | " + i.duedate);
            }
          }

        });

        var obj = [];// VARIABLE FOR PENDING COUNT
        var obj2 = []; // VARIABLE FOR OVERDUE COUNT
        var obj3 = []; // VARIABLE FOR PUBLISHED COUNT
        // TO GET THE COUNT FOR THE PENDING ,OVERDUE AND PUBLISHED OF THE BUSINESSES NAME
        for (let bnm = 0; bnm < this.state.businessName.length; bnm++) { // FOR LOOP THE BUSINESS NAME FROM MASTER LIST
          ////debugger;
          for (let index = 0; index < spListItemRSVP.length; index++) { // FOR LOOP FROM THE 4 SHAREPOINT LIST (L1, L2, L3, PUBLISHED DOCS)
            var item = spListItemRSVP[index];
            //debugger;
            switch (this.state.businessName[bnm].Title) { //SWITCH IF THE CASE THAT BUSINESS TITLE FROM THE MASTER LIST SAME WITH LIST ITEM FROM THE 4 SHAREPOINT LIST
              case spListItemRSVP[index].business: {

                //PENDING COUNTS
                if (item.Status == "In Review" && item.libType == "Procedures") {

                  if (typeof obj[item.business] == 'number') {
                    obj[item.business]++;

                  } else {
                    obj[item.business] = 1;

                  }
                }
                //OVERDUE COUNTS
                if (item.Status != null && item.Status.startsWith("In Review") && item.duedate != null && Date.parse(item.duedate.toLocaleString()) < now && item.libType == "Procedures") {

                  if (typeof obj2[item.business] == 'number') {
                    obj2[item.business]++;

                  } else {
                    obj2[item.business] = 1;

                  }
                }
                //PUBLISHED DOCUMENTS COUNT
                if (item.libType == "Published Documents") {

                  if (typeof obj3[item.business] == 'number') {
                    obj3[item.business]++;

                  } else {
                    obj3[item.business] = 1;

                  }
                }
                //TO GET THE DATA BUSINESS NAMES AND COUNTED TOTAL OF THE PENDING, OVERDUE AND PUBLISHED DOCS
                ////debugger;


              }


            }
          }

          // dataforbarchartCounts = { business: this.state.businessName[bnm].Title, data: obj[item.business], data2: obj2[item.business], data3: obj3[item.business] };
          dataforbarchartCounts = { business: "PRefChem", data: obj[item.business], data2: obj2[item.business], data3: obj3[item.business] };
          // console.log(dataforbarchartCounts);
          ////debugger;

          //PUSH TO ASSIGN AGAIN THE DATAS FOR THE STACKED BAR CHART
          hbar.push(dataforbarchartCounts);
          dataforbarchartCounts = undefined;
          obj = [];
          obj2 = [];
          obj3 = [];
        }

        let chart: chartSchema[] = [
          {
            id: 1,
            title: 'Up to Date',
            chartData: vuptodate
          },
          {
            id: 2,
            title: 'Due For Review',
            chartData: vforreview
          },
          {
            id: 3,
            title: 'Over Due',
            chartData: voverdue
          }
        ];
        // console.log(hbar);
        // console.log(chart);
        console.log(voverdue);
        const ttotal = this.state.publishedcount + this.state.policyCount + this.state.procedureCount; //COUNTS FOR THE TOTALS FROM PUBLISHED COUNTS, L1, L2, L3 SHAREPOINT ITEM LIST

        this.setState({
          listItems: spListItemRSVP, total: ttotal, uptodate: vuptodate,
          forreview: vforreview, overdue: voverdue, piechart: chart, hbarchart: hbar
        });
      });
  }

  private getBusiness(){
    // MASTER LIST FOR BUSINESS NAME FOR THE HORIZONTAL BAR CHART
    const businessURL: string = `${this.props.currentSiteUrl}/_api/lists/getbytitle('[Master]Business')/items?$top=5000`;
    // console.log(businessURL);
    this.props.spHttpClient.get(businessURL, SPHttpClient.configurations.v1)
      .then((responseb: SPHttpClientResponse) => {
        return responseb.json();
      })
      .then((jsonResponseb: any) => {
        ////debugger;
        // console.log(jsonResponseb.value);
        this.setState({ businessName: jsonResponseb.value });
      });
  }

  private getMultiLists(): Promise<IListData[]> {
    let spListItemRSVP: IListData[] = [];
    return new Promise<IListData[]>(async (resolve, reject) => {

      //GET THE POLICY FOR TOTAL DOCUMENT
      const urlPolicy: string = `${this.props.currentSiteUrl}/_api/lists/getbytitle('Policy')/items?$top=5000`;
      // console.log("urlPolicy: " + urlPolicy);

      await this.props.spHttpClient.get(urlPolicy, SPHttpClient.configurations.v1)
        .then((response3: SPHttpClientResponse) => {
          return response3.json();
        })
        .then((response3: any) => {
          // console.log(response3.value);
          // debugger
          this.setState({ policyCount: response3.value.length });
        });

      //GET THE PUBLISHED DOCUMENTS FOR TOTAL DOCUMENT, UP TO DATE
      const urlPublishedDocument: string = `${this.props.currentSiteUrl}/_api/lists/getbytitle('PublishedDocuments')/items?$top=5000`;
      // console.log("urlPublishedDocument: " + urlPublishedDocument);

      await this.props.spHttpClient.get(urlPublishedDocument, SPHttpClient.configurations.v1)
        .then((response1: SPHttpClientResponse) => {
          return response1.json();
        })
        .then((jsonResponse1: any) => {

          // console.log(jsonResponse1.value);
          ////debugger;
          for (let index = 0; index < jsonResponse1.value.length; index++) {
            var item = jsonResponse1.value[index];
            // console.log(item);
            spListItemRSVP.push({
              id: item.Id,
              Name: item.Title,
              Status: item.DocumentStatus,
              business: item.BusinessTitle,
              libType: 'Published Documents'
            });
            //resolve(spListItemRSVP);
          }
          this.setState({ publishedcount: jsonResponse1.value.length });
        });

      //GET THE PROCEDURES FOR TOTAL DOCUMENT, DUE FOR REVIEW, OVERDUE
      const urlProcedures: string = `${this.props.currentSiteUrl}/_api/lists/getbytitle('Procedures')/items?$top=5000`;
      // console.log("urlProcedures: " + urlProcedures);

      this.props.spHttpClient.get(urlProcedures, SPHttpClient.configurations.v1)
        .then((response4: SPHttpClientResponse) => {
          return response4.json();
        })
        .then((response4: any) => {
          // console.log(response4.value);
          this.setState({ procedureCount: response4.value.length });

          for (let index = 0; index < response4.value.length; index++) {
            var item = response4.value[index];
            // console.log(item);
            spListItemRSVP.push({
              id: item.Id,
              Name: item.Title,
              Status: item.DocumentStatus,
              business: item.BusinessTitle,
              libType: 'Procedures',
              duedate: item.ReviewDueDate = null ? "" : item.ReviewDueDate,
            });
            resolve(spListItemRSVP);
          }
        // console.log(spListItemRSVP);

        });



    });
  }


  public render(): React.ReactElement<IQuickSearchProps> {
    return (
      <div className={styles.quickSearch}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6" style={{ marginTop: '20px' }}>
                  {/* PIECHART */}
                  <PieChart data={this.state.piechart} />
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">

                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                    {/* TOTAL FROM PUBLISHED DOCS , L1, L2, L3 */}
                    <div className={styles.divTotals}>
                      <div className={styles.card_header}>
                        <span className={styles.card_text_header} style={{ textAlign: 'center' }}>
                          TOTAL (L1, L2 & L3 )
                        </span>
                        <span className={styles.card_text_child} style={{ textAlign: 'center', marginTop: '30px' }}>
                          <b>{this.state.total}</b>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                    {/* UP TO DATE COUNTED */}
                    <div className={styles.divUptodate}>
                      <div className={styles.card_header}>
                        <span className={styles.card_text_header} style={{ textAlign: 'center' }}>
                          UP TO DATE
                        </span>
                      </div>
                      <span className={styles.card_text_child} style={{ textAlign: 'center', marginTop: '20px' }}>
                        <b>{this.state.uptodate}</b>
                      </span>
                    </div>
                  </div>

                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                    {/* DUE FOR REVIEW COUNTED  */}
                    <div className={styles.divForeview}>
                      <div className={styles.card_header}>
                        <span className={styles.card_text_header} style={{ textAlign: 'center' }}>
                          DUE FOR REVIEW
                        </span>
                      </div>
                      <span className={styles.card_text_child} style={{ textAlign: 'center', marginTop: '20px' }}>
                        <b>{this.state.forreview}</b>
                      </span>
                    </div>
                  </div>

                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                    {/* OVERDUE COUNTED */}
                    <div className={styles.divOverDue}>
                      <div className={styles.card_header}>
                        <span className={styles.card_text_header} style={{ textAlign: 'center' }}>
                          OVER DUE
                        </span>
                      </div>
                      <span className={styles.card_text_child} style={{ textAlign: 'center', marginTop: '20px' }}>
                        <b>{this.state.overdue}</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ms-Grid-row" id={styles.barchart}>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12" >
                  <h2 className={styles.blevel}>Business Level</h2>

                  {/* HORIZONTAL/STACKED BAR CHART */}
                  <HBarChart data={this.state.hbarchart} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
