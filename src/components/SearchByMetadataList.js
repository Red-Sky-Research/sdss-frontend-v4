export default function SearchByMetadataList ({responseMetadataFromServer}) {

  let responseObject = null;
  let result = "";
  let values = [];

  let subscriptionId = null;

  let arrayDataItems = null;
   
  let headers = <tr><th>Time Stamp</th><th>Ticker</th><th>Doc Id</th><th>Asset Id</th><th>Type</th><th>Name</th><th>Hash</th><th>Val</th></tr>;


  // setting up data here
  // 
  if (responseMetadataFromServer) {
    responseObject = Object.create(JSON.parse(responseMetadataFromServer));
    subscriptionId = responseObject["subscriptionId"];

    if (responseObject["result"]){
      result = responseObject["result"];
      if (result.value){
        values = result.value;

        let time, ticker, assetId, docId, type, validation, name, hash= "na";
        let timeStampTitle, hashTitle, docIdTitle, assetIdTitle, nameTitle = "na";
        
        //        arrayDataItems =  values.map((doc) => <><td>{timestamp.substring(0,10)}</td><td>{doc["customMetadata"].ticker}</td><td>{doc.DocumentId.substring(0, 5)}</td><td>{subscriptionId.substring(0,5)}</td><td>{(doc["customMetadata"].assetId)?doc["customMetadata"].assetId.substring(0,10):""}</td><td>{doc["customMetadata"].docType}</td></>);
        arrayDataItems =  values.map((doc) => {
        // use DocumentRow here
        // pass in doc
          docIdTitle = doc.DocumentId ? doc.DocumentId : "";
          docId = docIdTitle.substring(0, 10) + "...";

          if (doc["customMetadata"]){
            ticker = doc["customMetadata"].ticker ? doc["customMetadata"].ticker : "";
            assetIdTitle = doc["customMetadata"].assetId ? (doc["customMetadata"].assetId)?doc["customMetadata"].assetId : "":"";
            assetId = assetIdTitle.substring(0,10) + "...";
            type = (doc["customMetadata"].docType)?doc["customMetadata"].docType:"";
            validation = (doc["customMetadata"].validation)?doc["customMetadata"].validation:"";
          }
          if (doc["documentMetadata"]){
            nameTitle = doc["documentMetadata"].name ? doc["documentMetadata"].name : "";
            name = nameTitle.substring(0,10) + "...";
            hashTitle = doc["documentMetadata"]["contentHash"].value ? doc["documentMetadata"]["contentHash"].value : "";
            hash = hashTitle.substring(0, 8) + "...";
          }
          if (doc["processMetadata"]["instrumentation"]["blob"]) {
            timeStampTitle = doc["processMetadata"]["instrumentation"]["blob"].startTimeStamp;
            time = timeStampTitle.substring(0,22);

          }
           return (
              <>
              <td title={timeStampTitle}>{time}</td>
              <td>{ticker}</td>
              <td title={docIdTitle}>{docId}</td>
              <td title={assetIdTitle}>{assetId}</td>
              <td>{type}</td>
              <td title={nameTitle}>{name}</td>
              <td title={hashTitle}>{hash}</td>
              <td>{validation}</td>
              </>
            )
          }
        );           
    }
  }
}

if (responseObject){

  return ( 
      <div className="response-box centered">
      <label>Subscription Id = {subscriptionId}</label>
      <label>{values? values.length: 0} Documents Matched Search Criteria</label>

      <table border = "1px solid black"
  border-collapse = "collapse" >
        {headers}
          {arrayDataItems.map((obj) => (
            <tr>
                  {obj}
            </tr>
          ))}
        </table>
      </div>
  )

  } else {
      return (
        
        <div className="response-box centered">
        <label><b>Search By Metadata Results</b></label>
  
        <table border = "1px solid black"
    border-collapse = "collapse" >
  {headers}
          </table>
        </div>
      )
  }

};


/*table>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
*/
//  I can get subscriptionId and the top level key values like trackingId, timestamp.
//  But what I want to do is iterate through
// result.value[] and create a row for each returned document, like a spreadsheet
// e.g.
// DocumentId, CustomMetadata.assetId, CustomMetadata.ticker and so on
// Do this:
// run the app
// execute "Search by Metadata" as is and you;ll see that I get subscriptionId
// but, I can't figure out how to get 
// result or the value array
  // as in the following returns undefined
  // let resultObject = Object.create(JSON.parse(responseObject["result"]));
  //let resultObject = JSON.parse(responseObject.result);
  // this doesn't cause a problem


  // << this works
// << this works

  //let length = values.length;
 // {responseObject["subscriptionId"]}
//  {length}

 // this works    {values.length}
 // so does this      {JSON.stringify(result, null, 2)}

// <ul>{values[0].DocumentId}</ul>
// this works
//           <li>{arrayDataItems[0]}, returns documentId as a li</li> 
// now I need to create a Component to display the output of a Document Metadata
// this worked
//<td key={obj}>
//{obj}
//</td>

