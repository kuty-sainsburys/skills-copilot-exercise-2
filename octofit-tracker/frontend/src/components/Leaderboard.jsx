import { useEffect, useState } from 'react'
import { apiUrl, toArray } from '../config/api.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetch(apiUrl('leaderboard'))
      .then((response) => response.json())
      .then((payload) => {
        if (isMounted) {
          setEntries(toArray(payload))
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

  const sortedEntries = [...entries].sort((a, b) => a.rank - b.rank)

  return (
    <div className="container py-4">
      <h1>Leaderboard</h1>
      {loading && <p>Loading leaderboard…</p>}
      {error && <p className="text-danger">Unable to load leaderboard: {error}</p>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Team</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.rank}</td>
                <td>{entry.userId}</td>
                <td>{entry.teamId ?? '—'}</td>
                <td>{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Leaderboard
