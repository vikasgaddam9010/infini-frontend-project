import React, { useState } from 'react';
import { FaRegCopy } from "react-icons/fa";


const CopyButton = ({ textToCopy }) => {
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000); // Clear message after 2 seconds
      })
      .catch(() => setCopyStatus('Failed to copy!'));
  };

  return (
    <div style={{height:"30px", marginLeft:"10px"}}>
      {
        copyStatus.length > 0 ? copyStatus && <p style={{margin:"0px", width:"70px", padding:"0px", fontSize:"14px"}}>{copyStatus}</p> : (<button  style={{width:"70px", backgroundColor:"transparent", border:"none", color:"gray", fontSize:"20px"}} onClick={handleCopy}><FaRegCopy/></button>)
      }
    </div>
  );
};

export default CopyButton;
