import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useRef, useState } from 'react'

export default function TimeSheet({ missions, timeEntries, setTimeEntries }) {
  const [selectedDate] = useState(new Date())
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const [activeCell, setActiveCell] = useState(null)
  const inputRefs = useRef({})

  const getTotalForDate = (date, excludeMissionId = null) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return timeEntries
      .filter(entry => 
        entry.date === dateStr && 
        (excludeMissionId === null || entry.missionId !== excludeMissionId)
      )
      .reduce((sum, entry) => sum + (entry.duration || 0), 0)
  }

  const adjustExistingEntries = (date, newDuration, missionId) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const otherEntries = timeEntries.filter(
      entry => entry.date === dateStr && entry.missionId !== missionId
    )
    
    const totalOthers = otherEntries.reduce((sum, entry) => sum + entry.duration, 0)
    
    if (totalOthers + newDuration > 1) {
      // Si le nouveau total dépasserait 1, on ajuste les autres entrées
      const remainingTime = Math.max(0, 1 - newDuration)
      const adjustmentFactor = remainingTime / totalOthers

      return timeEntries.map(entry => {
        if (entry.date === dateStr && entry.missionId !== missionId) {
          return {
            ...entry,
            duration: Math.round(entry.duration * adjustmentFactor * 100) / 100
          }
        }
        return entry
      })
    }
    
    return timeEntries
  }

  const updateEntry = (date, missionId, duration) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const parsedDuration = duration === '' ? 0 : parseFloat(duration)
    const existingEntryIndex = timeEntries.findIndex(
      entry => entry.date === dateStr && entry.missionId === missionId
    )

    // Vérifier si la nouvelle durée plus les autres entrées ne dépasse pas 1
    const totalOthers = getTotalForDate(date, missionId)
    const newDuration = Math.min(parsedDuration, 1 - totalOthers)

    let newEntries = [...timeEntries]
    
    if (parsedDuration === 0 || duration === '') {
      newEntries = timeEntries.filter((_, index) => index !== existingEntryIndex)
    } else {
      // Ajuster d'abord les autres entrées si nécessaire
      newEntries = adjustExistingEntries(date, newDuration, missionId)
      
      if (existingEntryIndex !== -1) {
        newEntries[existingEntryIndex] = {
          ...newEntries[existingEntryIndex],
          duration: newDuration
        }
      } else {
        newEntries.push({
          date: dateStr,
          missionId,
          duration: newDuration
        })
      }
    }

    setTimeEntries(newEntries)
  }

  const getDuration = (date, missionId) => {
    const entry = timeEntries.find(
      entry => entry.date === format(date, 'yyyy-MM-dd') && entry.missionId === missionId
    )
    return entry ? entry.duration : ''
  }

  const handleKeyDown = (e, date, missionId, currentIndex) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const newIndex = currentIndex + (e.key === 'ArrowLeft' ? -1 : 1)
      if (newIndex >= 0 && newIndex < days.length) {
        const newDate = days[newIndex]
        const newCellId = `${format(newDate, 'yyyy-MM-dd')}-${missionId}`
        inputRefs.current[newCellId]?.focus()
      }
    } else if (e.key >= '0' && e.key <= '1') {
      e.preventDefault()
      updateEntry(date, missionId, e.key === '1' ? 1 : 0)
    } else if (e.key === '.') {
      e.preventDefault()
      updateEntry(date, missionId, 0.5)
    }
  }

  const handleChange = (e, date, missionId) => {
    const value = e.target.value
    if (value === '' || (!isNaN(value) && value >= 0 && value <= 1)) {
      updateEntry(date, missionId, value)
    }
  }

  // ... [Reste du code pour le rendu reste identique]

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">
        CRA - {format(selectedDate, 'MMMM yyyy', { locale: fr })}
      </h2>

      {/* ... [Reste du JSX identique] */}
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50">Mission</th>
              {days.map(day => (
                <th key={day.toString()} className="border p-2 w-10 bg-gray-50">
                  <div>{format(day, 'd')}</div>
                  <div className="text-xs">{format(day, 'EEE', { locale: fr })}</div>
                  <div className="text-xs text-gray-500">
                    {getTotalForDate(day).toFixed(1)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {missions.map(mission => (
              <tr key={mission.id}>
                <td className="border p-2">{mission.name}</td>
                {days.map((day, index) => {
                  const cellId = `${format(day, 'yyyy-MM-dd')}-${mission.id}`
                  const totalForDay = getTotalForDate(day)
                  return (
                    <td key={day.toString()} className="border p-1 text-center">
                      <input
                        ref={el => inputRefs.current[cellId] = el}
                        type="text"
                        value={getDuration(day, mission.id)}
                        onChange={(e) => handleChange(e, day, mission.id)}
                        onKeyDown={(e) => handleKeyDown(e, day, mission.id, index)}
                        className={`w-8 h-8 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${totalForDay > 1 ? 'bg-red-100' : ''}`}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
