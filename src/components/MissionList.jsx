import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MissionList({ missions, setMissions, clients }) {
  const [newMission, setNewMission] = useState({
    name: '',
    clientId: '',
    type: 'regie',
    rate: '',
    maxDays: '', // Uniquement pour la régie
    startDate: '',
    deadline: '', // Pour les deux types
    amount: '' // Montant total pour le forfait
  })

  const addMission = (e) => {
    e.preventDefault()
    if (!newMission.name.trim() || !newMission.clientId || !newMission.startDate || !newMission.deadline) return
    
    if (newMission.type === 'regie' && (!newMission.rate || !newMission.maxDays)) return
    if (newMission.type === 'forfait' && !newMission.amount) return

    setMissions([...missions, {
      id: Date.now(),
      name: newMission.name.trim(),
      clientId: parseInt(newMission.clientId),
      type: newMission.type,
      startDate: newMission.startDate,
      deadline: newMission.deadline,
      ...(newMission.type === 'regie' 
        ? { 
            rate: parseFloat(newMission.rate),
            maxDays: parseInt(newMission.maxDays)
          }
        : { 
            amount: parseFloat(newMission.amount)
          }
      )
    }])

    setNewMission({
      name: '',
      clientId: '',
      type: 'regie',
      rate: '',
      maxDays: '',
      startDate: '',
      deadline: '',
      amount: ''
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'd MMMM yyyy', { locale: fr })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Missions</h2>
      
      <form onSubmit={addMission} className="mb-4 space-y-2">
        <input
          type="text"
          value={newMission.name}
          onChange={(e) => setNewMission({...newMission, name: e.target.value})}
          placeholder="Nom de la mission"
          className="w-full p-2 border rounded"
        />

        <select
          value={newMission.clientId}
          onChange={(e) => setNewMission({...newMission, clientId: e.target.value})}
          className="w-full p-2 border rounded"
        >
          <option value="">Sélectionner un client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <select
            value={newMission.type}
            onChange={(e) => setNewMission({...newMission, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="regie">Régie</option>
            <option value="forfait">Forfait</option>
          </select>
        </div>

        {newMission.type === 'regie' ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={newMission.rate}
              onChange={(e) => setNewMission({...newMission, rate: e.target.value})}
              placeholder="Taux journalier (€)"
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              value={newMission.maxDays}
              onChange={(e) => setNewMission({...newMission, maxDays: e.target.value})}
              placeholder="Nombre de jours max"
              className="w-48 p-2 border rounded"
            />
          </div>
        ) : (
          <input
            type="number"
            value={newMission.amount}
            onChange={(e) => setNewMission({...newMission, amount: e.target.value})}
            placeholder="Montant forfait (€)"
            className="w-full p-2 border rounded"
          />
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Date de début</label>
            <input
              type="date"
              value={newMission.startDate}
              onChange={(e) => setNewMission({...newMission, startDate: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              {newMission.type === 'forfait' ? 'Date limite' : 'Date de fin prévue'}
            </label>
            <input
              type="date"
              value={newMission.deadline}
              onChange={(e) => setNewMission({...newMission, deadline: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter la mission
        </button>
      </form>

      <ul className="space-y-2">
        {missions.map(mission => (
          <li 
            key={mission.id}
            className="p-3 bg-gray-50 rounded"
          >
            <div className="font-medium">{mission.name}</div>
            <div className="text-sm text-gray-500">
              {clients.find(c => c.id === mission.clientId)?.name}
            </div>
            <div className="text-sm mt-1">
              <div>Du {formatDate(mission.startDate)} au {formatDate(mission.deadline)}</div>
              {mission.type === 'regie' ? (
                <div className="text-blue-600">
                  Régie - {formatCurrency(mission.rate)}/jour
                  <div className="text-gray-600">
                    Maximum : {mission.maxDays} jours
                  </div>
                </div>
              ) : (
                <div className="text-green-600">
                  Forfait - {formatCurrency(mission.amount)}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}