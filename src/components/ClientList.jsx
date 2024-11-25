import { useState } from 'react'

export default function ClientList({ clients, setClients }) {
  const [newClient, setNewClient] = useState('')

  const addClient = (e) => {
    e.preventDefault()
    if (!newClient.trim()) return
    
    setClients([...clients, {
      id: Date.now(),
      name: newClient.trim()
    }])
    setNewClient('')
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Clients</h2>
      
      <form onSubmit={addClient} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            placeholder="Nouveau client"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {clients.map(client => (
          <li 
            key={client.id}
            className="p-2 bg-gray-50 rounded flex justify-between items-center"
          >
            {client.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
