import React from 'react';

const StyledH1 = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-4xl font-bold text-blue-600 my-4 pb-2 border-b-2 border-blue-200">
      {children}
    </h1>
  );
};

export default StyledH1;