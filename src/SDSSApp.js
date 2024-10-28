import React, { useState } from 'react';
import './FileUpload.css';
import FileUpload from './FileUpload';
let file;

const SDSSApp = () => {

  return (

    <div className="SDSSApp">
            <h1><b>Secure Document Storage Service</b></h1>
      <hr></hr>

  <FileUpload />    

  </div>
  );
};

export default SDSSApp;