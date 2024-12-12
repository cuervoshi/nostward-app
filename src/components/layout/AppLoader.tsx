import React from "react";

const AppLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Nostward</h1>
        <div className="loader border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default AppLoader;
