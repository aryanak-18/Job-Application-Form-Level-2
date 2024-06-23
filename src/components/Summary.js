import React from 'react';

const Summary = ({ data }) => {
  return (
    <div className='summary'>
      <h2>Application Summary</h2>
      <p><strong>Full Name:</strong> {data.fullName}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Phone Number:</strong> {data.phoneNumber}</p>
      <p><strong>Position Applied:</strong> {data.position}</p>
      {(data.position === 'Developer' || data.position === 'Designer') && (
        <p><strong>Relevant Experience:</strong> {data.relevantExperience} years</p>
      )}
      {data.position === 'Designer' && (
        <p><strong>Portfolio URL:</strong> {data.portfolioUrl}</p>
      )}
      {data.position === 'Manager' && (
        <p><strong>Management Experience:</strong> {data.managementExperience}</p>
      )}
      <p><strong>Additional Skills:</strong> {data.additionalSkills.join(', ')}</p>
      <p id='summary-time'><strong>Preferred Interview Time:</strong> {new Date(data.preferredInterviewTime).toLocaleString()}</p>
    </div>
  );
};

export default Summary;
