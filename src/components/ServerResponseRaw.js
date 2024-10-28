import React, { useState } from 'react';

export default function ServerResponseRaw ({responseFromServer}) {
  
  return (

      <div className="response-box centered">
        <label><b>Server Response Raw</b></label>
        <textarea
          id="responseTextArea"
          rows="25"
          cols="75"
          disabled
          readOnly
value={responseFromServer}
          
        ></textarea>
      </div>

  );
};
