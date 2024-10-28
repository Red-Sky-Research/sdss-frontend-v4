import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

let customMetadata;


function buildPayload() {

  customMetadata = {"assetId": "1234567", 
                          "ticker": "REtokens",  
                          "docType": "TITLE_REPORT",  
                          "identityId":"398475928abc987987"};

  //return JSON.stringify(customMetadata);
}

buildPayload();


const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  //buildPayload();



  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  //#region Upload
  const handleUpload = async (event) => {
    event.preventDefault();
    const subscriptionKey = document?.getElementById("subscription_key")?.value;
    const apiVersion = document?.getElementById("version")?.value;

    const headers = {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Api-Version': apiVersion,
    };

    const formData = new FormData();

    // Check if a file is selected, and if so, append it to the form data
    if (file) {
      formData.append('file', file);
    } else {
      return;
    }

    const payload = document?.getElementById("payloadUploadDocument")?.value;

    if (payload) {
      let customMetadata;
      
      try {
          customMetadata = JSON.parse(payload); 
          const blob = new Blob([JSON.stringify(customMetadata)], { type: 'application/json', fileName: '' });
          formData.append('metadata', blob, '');

      } catch (error) {
          setResponse('Metadata should be valid JSON ' + error);
          return;
      }
    }
    let serverResponse;
      try {
      serverResponse = await axios.post(
        'https://sdss01.azure-api.net/document/upload',
        formData,
        { headers }
      );

      //sdssResponse = JSON.stringify(serverResponse.data, null, 2);
      setResponse(JSON.stringify(serverResponse.data, null, 2));
      
      toast.success('File uploaded successfully.');

      console.log(serverResponse.data);


    } catch (error) {
      setResponse(error.response ? JSON.stringify(error.response.data, null, 2) : 'Upload failed.');
      //sdssResponse = error.response ? JSON.stringify(error.response.data, null, 2) : 'Upload failed.';
      toast.error('Upload failed.');
      console.error(error);

    }
  };

  return (

    <div className="file-upload-container">

      <form onSubmit={handleUpload} className="file-upload-form">
        <table >
          <tr>
            <td>Key</td>
            <td><input type="text" id="subscription_key" defaultValue="e72985c524234b89be6c2608b19632fe" required /></td>
            <td>Version</td>
            <td><input type="text" id="version" defaultValue="v1" required /></td>
          </tr>
        </table>

        <table>
          <tr>
            <td>Select File</td>
            <td><input type="file" id="fileInput" onChange={handleFileChange} /></td>
          </tr>
        </table>


        <table>
          <tr>
            <td>
              <div className="button-container">
                <button type="submit" id="uploadDocument">Upload</button>
              </div>
            </td>
            
            <td>
              <div className="form-group centered">
                <label htmlFor="payloadUploadDocument"><b>Document Upload Custom Metadata</b></label>
                <textarea
                  id="payloadUploadDocument"
                  rows="2"
                  cols="75"
                  defaultValue={JSON.stringify(customMetadata)}
                ></textarea>
              </div>
            </td>

          </tr>
        </table>
      </form>
      <div className="response-box centered">
        <label htmlFor="responseTextArea"><b>Response Metadata</b></label>
        <textarea
          id="responseTextArea"
          rows="25"
          cols="75"
          disabled
          readOnly
          value={response}
        ></textarea>
      </div>
    </div>
  );
}

export default UploadDocument;