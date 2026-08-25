import { useEffect, useState } from 'react'
import { apiUrl, toArray } from '../config/api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetch(apiUrl('api/activities'))
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted) {
          setActivities(toArray(payload))
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
      <h1>Activities</h1>
      {loading && <p>Loading activities…</p>}
      {error && <p className="text-danger">Unable to load activities: {error}</p>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Points</th>
              <th>Completed at</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.userId}</td>
                <td>{activity.type}</td>
                <td>{activity.durationMinutes}</td>
                <td>{activity.points}</td>
                <td>{activity.completedAt ? new Date(activity.completedAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Activities
