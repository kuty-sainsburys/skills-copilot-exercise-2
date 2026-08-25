import { useEffect, useState } from 'react'
import { apiUrl, toArray } from '../config/api.js'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetch(apiUrl('api/workouts'))
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted) {
          setWorkouts(toArray(payload))
        }
      })
      .catch((fetchError) => {
        if (isMounted) {
          setError(fetchError.message)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="container py-4">
      <h1>Workouts</h1>
      {loading && <p>Loading workouts…</p>}
      {error && <p className="text-danger">Unable to load workouts: {error}</p>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Difficulty</th>
              <th>Duration (min)</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout._id}>
                <td>{workout.name}</td>
                <td>{workout.description}</td>
                <td>{workout.difficulty}</td>
                <td>{workout.durationMinutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Workouts
