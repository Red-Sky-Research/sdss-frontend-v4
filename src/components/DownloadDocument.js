import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function buildPayload() {
  const documentId = localStorage.getItem("documentId");
  const customMetadata = {"documentId": 'documentId'};
}

const DownloadDocument = () => {
 // buildPayload();
  
/*   function setResponse (newResponse){
    localStorage.setItem("serverResponse", newResponse);
    // set documentId
    localStorage.setItem("documentId", newResponse.DocumentId);
  
    window.dispatchEvent(new Event("serverResponse"));
  };
 */
  //window.addEventListener('serverResponse', () => {

  /* try {
      const serverResponse = localStorage.getItem("serverResponse");

      const documentId = serverResponse.DocumentId;
      console.log("documentId = " + documentId);
      localStorage.setItem("documentId", documentId);
    } catch (error){
      //localStorage.setItem("documentId", "documentId Not Yet Set");
    }
 */
    //console.log("bulding Payload via Event Listener");
    //buildPayload();
    //window.location.reload();
 // })

  const handleDownload = async (event) => {
    let fileName = '';
  try {

    const subscriptionKey = document?.getElementById("subscription_key")?.value;
    const apiVersion = document?.getElementById("version")?.value;

    const headers = {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Api-Version': apiVersion,
    };

    const jsonData = JSON.parse(document.getElementById("payloadDownloadDocument").value);
  
    const sPayload = JSON.stringify(jsonData);

    console.log("Payload is " + sPayload);

    const response = await axios.post(
      'https://sdss01.azure-api.net/document/download',
      jsonData,
      {
        responseType: 'blob', // Specify that you're expecting a binary response
        headers: headers, // Pass the headers here
      }
    );

    console.log("Server Response is " + response.data);

    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);

    //setResponse(url);

    // Create a download link and trigger the download with the dynamically determined file extension
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  } catch (error) {
    //setResponse("Download Failed " + error);
      //error.response ? JSON.stringify(error.response.data, null, 2) : 'Download failed.'
    //);
    toast.error('Download failed.');
    console.error('Error downloading the file:', error);
  }

  };
  return (

    <div className="file-upload-container">
      <hr></hr>
      <table>
        <tr>
          <td>
            <div className="button-container">
              <button id="myButton" onClick={handleDownload}>Download</button>
            </div>
          </td>
          <td>
            <div className="form-group centered">
              <label htmlFor="payloadDownloadDocument"><b>Download Document Payload</b></label>
              <textarea
                id="payloadDownloadDocument"
                rows="2"
                cols="75"
                defaultValue={buildPayload()}
              ></textarea>
            </div>
            
        </td>
        </tr>
      </table>
  </div>
  );
}

export default DownloadDocument;