import { useState, useEffect } from 'react'
import { logService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'
import toast from 'react-hot-toast'

export function ActivityLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const data = await logService.getLogs(500)
      setLogs(data)
    } catch (error) {
      toast.error('Failed to load activity logs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action) => {
    if (action?.includes('create') || action?.includes('add')) return 'text-green-600'
    if (action?.includes('delete') || action?.includes('remove')) return 'text-danger'
    if (action?.includes('update') || action?.includes('edit')) return 'text-blue-600'
    if (action?.includes('login') || action?.includes('logout')) return 'text-purple-600'
    return 'text-secondary-600'
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Activity Logs</h1>

      {/* Logs Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-secondary-500">
            No activity logs yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header text-left">Action</th>
                  <th className="table-header text-left">Details</th>
                  <th className="table-header text-left">User</th>
                  <th className="table-header text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="table-row">
                    <td className={`px-4 py-3 font-semibold ${getActionColor(log.action)}`}>
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-secondary-600 dark:text-secondary-400">{log.details}</td>
                    <td className="px-4 py-3">{log.userId?.substring(0, 8)}</td>
                    <td className="px-4 py-3">{formatters.formatDateTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
