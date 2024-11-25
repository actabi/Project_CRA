import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const EXPENSE_CATEGORIES = {
  mission: [
    { id: 'transport', label: 'Transport' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'materiel', label: 'Matériel' },
    { id: 'hebergement', label: 'Hébergement' },
    { id: 'autres', label: 'Autres' }
  ],
  general: [
    { id: 'bureau', label: 'Bureau/Location' },
    { id: 'logiciel', label: 'Logiciels/Abonnements' },
    { id: 'formation', label: 'Formation' },
    { id: 'comptabilite', label: 'Comptabilité' },
    { id: 'assurance', label: 'Assurance' },
    { id: 'autres', label: 'Autres' }
  ]
}

export default function ExpenseManager({ missions }) {
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'mission', // 'mission' ou 'general'
    missionId: '',
    category: '',
    amount: '',
    description: ''
  })

  const addExpense = (e) => {
    e.preventDefault()
    if (!newExpense.category || !newExpense.amount || !newExpense.date) return
    if (newExpense.type === 'mission' && !newExpense.missionId) return

    setExpenses([...expenses, {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    }])

    setNewExpense({
      ...newExpense,
      category: '',
      amount: '',
      description: '',
      missionId: newExpense.type === 'mission' ? '' : undefined
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const calculateTotalsByMission = () => {
    return expenses
      .filter(expense => expense.type === 'mission')
      .reduce((acc, expense) => {
        acc[expense.missionId] = (acc[expense.missionId] || 0) + expense.amount
        return acc
      }, {})
  }

  const calculateGeneralTotal = () => {
    return expenses
      .filter(expense => expense.type === 'general')
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  const deleteExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Ajouter un frais</h2>
        
        <form onSubmit={addExpense} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newExpense.type}
                onChange={e => setNewExpense({
                  ...newExpense,
                  type: e.target.value,
                  missionId: '',
                  category: ''
                })}
                className="w-full p-2 border rounded"
              >
                <option value="mission">Frais de mission</option>
                <option value="general">Frais généraux</option>
              </select>
            </div>

            {newExpense.type === 'mission' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                <select
                  value={newExpense.missionId}
                  onChange={e => setNewExpense({...newExpense, missionId: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionner une mission</option>
                  {missions.map(mission => (
                    <option key={mission.id} value={mission.id}>
                      {mission.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner une catégorie</option>
                {EXPENSE_CATEGORIES[newExpense.type].map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="0.00"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Description du frais"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ajouter le frais
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Frais par mission</h3>
          {Object.entries(calculateTotalsByMission()).map(([missionId, total]) => {
            const mission = missions.find(m => m.id.toString() === missionId)
            return (
              <div key={missionId} className="flex justify-between items-center py-2 border-b">
                <span>{mission?.name}</span>
                <span className="font-medium">{formatCurrency(total)}</span>
              </div>
            )
          })}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Frais généraux</h3>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Total</span>
            <span className="font-medium">{formatCurrency(calculateGeneralTotal())}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Liste des frais</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Mission/Catégorie</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Montant</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className="border-t">
                  <td className="p-2">
                    {format(new Date(expense.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="p-2">
                    {expense.type === 'mission' ? 'Mission' : 'Général'}
                  </td>
                  <td className="p-2">
                    {expense.type === 'mission'
                      ? missions.find(m => m.id.toString() === expense.missionId)?.name
                      : EXPENSE_CATEGORIES.general.find(cat => cat.id === expense.category)?.label
                    }
                  </td>
                  <td className="p-2">{expense.description}</td>
                  <td className="p-2 text-right">{formatCurrency(expense.amount)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
