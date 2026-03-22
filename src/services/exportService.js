import Papa from 'papaparse'

export const exportService = {
  exportToCSV(data, fileName = 'export.csv') {
    try {
      const csv = Papa.unparse(data)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting to CSV:', error)
      throw error
    }
  },

  exportToJSON(data, fileName = 'export.json') {
    try {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting to JSON:', error)
      throw error
    }
  },

  generateReport(reportData, reportName = 'Report') {
    try {
      const date = new Date().toISOString().split('T')[0]
      this.exportToJSON(reportData, `${reportName}_${date}.json`)
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  },
}
