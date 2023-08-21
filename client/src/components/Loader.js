import React from "react";

const Loader = () => {
  return (
    <div class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p style={{fontSize:'25px'}}>Waiting for wallet connection</p>
    </div>
  );
};

export default Loader;
