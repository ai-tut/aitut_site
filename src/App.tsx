import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">Velkommen til AI-TUT</h1>
      <p className="mt-4 text-lg text-gray-600">Klar til at bygge med AI!</p>
      <Button className="mt-8" onClick={() => console.log('Knappen blev klikket!')}>Klik her</Button>
    </div>
  )
}

export default App
