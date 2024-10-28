import React, { useState } from 'react';

const
 DocumentListView = () => {
  

  let serverResponse = "Server Response Not Yet Set";

  window.addEventListener('serverResponse', () => {
    console.log("Change to local storage!");
    serverResponse = localStorage.getItem("serverResonse");
   
 //   window.location.reload();

  })

  console.log(localStorage.getItem("serverResponse"));
  return (

      <div className="response-box centered">
        <label htmlFor="responseTextArea"><b>Response from SDSS Server</b></label>
        <textarea
          id="responseTextArea"
          rows="25"
          cols="75"
          disabled
          readOnly
          value={serverResponse}
          
        ></textarea>
      </div>

  );
};

export default DocumentListView;