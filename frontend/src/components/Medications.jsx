import React, { useState } from 'react'
import { api } from '../services/api'

export default function Medications({ meds, refresh, token }) {
  const [form, setForm] = useState({ name: '', dose: '', notes: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', dose: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const add = async () => {
    if (!form.name || !form.dose) {
      setError('Name and dose are required')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.addMedication(token, form)
      setForm({ name: '', dose: '', notes: '' })
      refresh()
    } catch (err) {
      setError('Failed to add medication')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (med) => {
    setEditingId(med.id)
    setEditForm({ name: med.name, dose: med.dose, notes: med.notes || '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', dose: '', notes: '' })
  }

  const update = async (id) => {
    if (!editForm.name || !editForm.dose) {
      setError('Name and dose are required')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.updateMedication(token, id, editForm)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError('Failed to update medication')
    } finally {
      setLoading(false)
    }
  }

  const del = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) {
      return
    }
    setLoading(true)
    try {
      await api.deleteMedication(token, id)
      refresh()
    } catch (err) {
      setError('Failed to delete medication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Medications</h2>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Medication</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              placeholder="Medication name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              placeholder="Dose (e.g., 100mg)"
              value={form.dose}
              onChange={(e) => setForm({ ...form, dose: e.target.value })}
            />
          </div>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            onClick={add}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {loading ? 'Adding...' : 'Add Medication'}
          </button>
        </div>
      </div>

      {/* Medications List */}
      <div className="space-y-3">
        {meds.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No medications yet. Add your first medication above.</p>
          </div>
        ) : (
          meds.map((m) => (
            <div
              key={m.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingId === m.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                    <input
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      value={editForm.dose}
                      onChange={(e) => setEditForm({ ...editForm, dose: e.target.value })}
                    />
                  </div>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Notes"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => update(m.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{m.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Dose: {m.dose}</p>
                      {m.notes && (
                        <p className="text-gray-500 text-sm mt-1">{m.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(m)}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => del(m.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
