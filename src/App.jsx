import { useState } from 'react'
import ClientList from './components/ClientList'
import MissionList from './components/MissionList'
import TimeSheet from './components/TimeSheet'
import ExpenseManager from './components/ExpenseManager'

export default function App() {
  const [clients, setClients] = useState([])
  const [missions, setMissions] = useState([])
  const [timeEntries, setTimeEntries] = useState([])
  const [activeTab, setActiveTab] = useState('cra') // 'cra' ou 'expenses'

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">CRA Freelance</h1>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('cra')}
            className={`px-4 py-2 rounded ${
              activeTab === 'cra'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Compte-rendu d'activité
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded ${
              activeTab === 'expenses'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Gestion des frais
          </button>
        </div>

        {activeTab === 'cra' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ClientList clients={clients} setClients={setClients} />
              <MissionList 
                missions={missions} 
                setMissions={setMissions}
                clients={clients}
              />
            </div>
            <TimeSheet 
              missions={missions}
              timeEntries={timeEntries}
              setTimeEntries={setTimeEntries}
            />
          </>
        ) : (
          <ExpenseManager missions={missions} />
        )}
      </div>
    </div>
  )
}
