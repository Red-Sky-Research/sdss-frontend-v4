import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(''); // Define metadata state variable
  const [response, setResponse] = useState(null);


  const handleDownload = async () => {

    try {
      const subscriptionKey = document?.getElementById("subscription_key")?.value;
      const apiVersion = document?.getElementById("version")?.value;
      const jsonData = JSON.parse(document.getElementById("inputDownloadDocument").value);
      const fileName = '';
      const headers = {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Api-Version': apiVersion,
      };

      axios.post('https://sdss.azure-api.net/document/metadata', JSON.parse(document.getElementById("inputTextArea").value),

//      axios.post('https://sdss01.azure-api.net/document/metadata', jsonData,
        { headers })
        .then(r => {
          setResponse(JSON.stringify(r.data, null, 2));
          r.data.error ? toast.error('Download failed.') : toast.success('Download successful.');
          fileName = r.data.error ? '' : r.data.ProcessMetadata.SystemMetadata.DisplayName;
        })
        .catch(error => {
          console.error(error);
        });

      const response = await axios.post(
        'https://sdss01.azure-api.net/document/download',
        jsonData,
        {
          responseType: 'blob', // Specify that you're expecting a binary response
          headers: headers, // Pass the headers here
        }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      // Create a download link and trigger the download with the dynamically determined file extension
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setResponse(
        error.response ? JSON.stringify(error.response.data, null, 2) : 'Download failed.'
      );
      toast.error('Download failed.');
      console.error('Error downloading the file:', error);
    }
  };




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

    const metadataInput = document?.getElementById("metadataInput")?.value;

    if (metadataInput) {
      let metadata;
      
      try {
          metadata = JSON.parse(metadataInput); // Try parsing JSON
          // Append metadata as a JSON string with the desired content type
          const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json', fileName: '' });
          formData.append('metadata', blob, '');
      } catch (error) {
          setResponse('Metadata should be valid JSON.'); // Handle invalid JSON
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

  //#endregion Upload

  const verify = async () => {
    const subscriptionKey = document?.getElementById("subscription_key")?.value;
    const apiVersion = document?.getElementById("version")?.value;

    const headers = {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Api-Version': apiVersion,
    };

    const inputData = JSON.parse(document.getElementById("inputVerify").value);
    console.log(inputData);
    axios.post('https://sdss01.azure-api.net/document/verify', JSON.parse(document.getElementById("inputVerify").value),
      { headers })
      .then(response => {
        setResponse(JSON.stringify(response.data, null, 2));
        response.data.error ? toast.error('Verification failed.') : toast.success('Verification successful.');
      })
      .catch(error => {
        setResponse(error.response ? JSON.stringify(error.response.data, null, 2) : 'Verify failed.');
        toast.error('Verify failed.');
        console.error(error);
      });
  }
  //#endregion Verify

  //#region get metadata
  const getMetadata = async () => {
    const subscriptionKey = document?.getElementById("subscription_key")?.value;
    const apiVersion = document?.getElementById("version")?.value;

    const headers = {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
      'Api-Version': apiVersion,
    };

    const inputData = JSON.parse(document.getElementById("inputMetadata").value);
    console.log(inputData);
    axios.post('https://sdss01.azure-api.net/document/metadata', JSON.parse(document.getElementById("inputMetadata").value),
      { headers })
      .then(response => {
        setResponse(JSON.stringify(response.data, null, 2));
        response.data.error ? toast.warning('Get Metadata failed.') : toast.success('Get Metadata successful.');
      })
      .catch(error => {
        setResponse(error.response ? JSON.stringify(error.response.data, null, 2) : 'Get Metadata failed.');
        toast.error('Get Metadata failed.');
        console.error(error);
      });
  };

  //#endregion get metadata 
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
                <label htmlFor="metadataInput"><b>Document Upload Custom Metadata</b></label>

                <textarea
                  id="metadataInput"
                  rows="2"
                  cols="75"
                  defaultValue='{
              "assetID": "Asset Id",
              "ticker": "Ticker Symbol",
              "docType": "Doc Type",
              "idenityId":"Identity of Person Uploading Document"
            }'
                ></textarea>
              </div>
            </td>
          </tr>
        </table>
      </form>

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
              <label htmlFor="responseTextArea"><b>Download Document Payload</b></label>
              <textarea
                id="inputDownloadDocument"
                rows="2"
                cols="75"
                defaultValue='{
            "documentId": "DOC ID GOES HERE" 
          }'
              ></textarea>
            </div>        </td>
        </tr>
      </table>


      <hr></hr>
      <table>
        <tr>
          <td>
            <div className="button-container">
              <button id="verify" onClick={verify}>Verify</button>
            </div></td>
          <td>
            <div className="form-group centered">
              <label htmlFor="responseTextArea"><b>Verify Hash Payload</b></label>
              <textarea
                id="inputVerify"
                rows="2"
                cols="75"
                defaultValue='{
            "documentId": "DOC ID GOES HERE",
            "hash": "HASH GOES HERE" 
          }'
              >

              </textarea>
            </div>
          </td>
        </tr>
      </table>

      <hr></hr>
      <table>
        <tr>
          <td>      <div className="button-container">
            <button id="getmetadata" onClick={getMetadata}>Get Metadata</button>
          </div>
          </td>
          <td>      <div className="form-group centered">
            <label htmlFor="responseTextArea"><b>Get Metadat Payload</b></label>
            <textarea
              id="inputMetadata"
              rows="2"
              cols="75"
              defaultValue='{
            "documentId": "DOC ID GOES HERE" 
          }'
            ></textarea>
          </div></td>
        </tr>
      </table>

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

export default FileUpload;