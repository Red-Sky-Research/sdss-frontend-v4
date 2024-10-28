import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FileUpload.css';

const SDSS = () => {

  // TRW, what do these do?
  // Are they Globals??
  // How do we use them?
  // How do we do Globals across all Components?
  const [file, setFile] = useState(null);
  const [payload, setPayload] = useState(''); 
  const [response, setResponse] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  // I want to get the Response Metadata and set a few Global Values:
  // - documentId
  // - customMetadata
  // = identityId
  // - documentMetadata
  // I also want functions which can extract
  //   - documentMetadata.contentHash and it's keyed values: type, value
  //   - documentMetadata.name

  // I want to turn Upload into a Component which
  // - can be a template for the others
  // - upldates the Globals for the other Components to use
  //    - e.g. DownloadDocument and GetMetadata need only 
  //           - documentId
  //           VerifyHash needs documentId and contentHash.value
  // etc.
  
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
    }

    // this section should be the same for every call except DownloadDocument
    let payload = document?.getElementById("payload")?.value;

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
    

    try {
      const response = await axios.post(
        'https://sdss01.azure-api.net/document/upload',
        formData,
        { headers }
      );

      setResponse(JSON.stringify(response.data, null, 2));

      if (file) {
        toast.success('File uploaded successfully.');
      } else {
        toast.success('Metadata uploaded successfully.');
      }

      console.log(response.data);
    } catch (error) {
      setResponse(error.response ? JSON.stringify(error.response.data, null, 2) : 'Upload failed.');
      toast.error('Upload failed.');
      console.error(error);
    }
  };

  return (

    <div className="file-upload-container">
      <h1><b>Secure Document Storage Service</b></h1>
      <hr></hr>
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
                <label htmlFor="payload"><b>Document Upload Custom Metadata</b></label>

                <textarea
                  id="payload"
                  rows="2"
                  cols="75"
                  defaultValue='{
              "assetId": "abcdefgh",
              "ticker": "REtokens",
              "docType": "TITLE_REPORT",
              "identityId":"398475928abc987987"
            }'
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
};

export default SDSS;