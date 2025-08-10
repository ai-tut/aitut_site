import { useState } from "react";
import { Button } from "@/components/ui/button"

function App() {
  const [messageVisible, setMessageVisible] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-800">Velkommen til AI-TUT</h1>
      <p className="mt-4 text-lg text-gray-600">Klar til at bygge med AI!</p>
      <Button 
        className="mt-8" 
        onClick={() => setMessageVisible(!messageVisible)}
      >
        {messageVisible ? 'Skjul besked' : 'Vis besked'}
      </Button>

      {messageVisible && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <p className="text-lg font-semibold text-blue-600">
            Tillykke! Du har interageret med siden.
          </p>
        </div>
      )}
    </div>
  )
}

export default App
