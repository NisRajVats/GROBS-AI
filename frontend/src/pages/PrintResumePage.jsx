import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom'; // 1. Import useLocation
import { useReactToPrint } from 'react-to-print';
import { ResumeTemplate } from '../components/ResumeTemplate';

function PrintResumePage() {
  const location = useLocation(); // 2. Get the location object

  // 3. Get the resume data from the 'state' we passed in the Link
  const { resume } = location.state;

  // Set up the print trigger using v3 API
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: `${resume?.full_name}_Resume`,
    contentRef,
  });

  const handlePrintClick = () => {
    handlePrint();
  };

  // 4. No more loading! If we're on this page, we have the data.
  if (!resume) {
    return <div>Error: No resume data found. Go back to the dashboard.</div>
  }

  return (
    <div>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button 
          onClick={handlePrintClick}
          style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          Download as PDF
        </button>
      </div>
      
      {/* Attach contentRef directly to a wrapper around the printable content */}
      <div ref={contentRef}>
        <ResumeTemplate resume={resume} />
      </div>
    </div>
  );
}

export default PrintResumePage;