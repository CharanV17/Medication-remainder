import React, { useState } from 'react'
import { api } from '../services/api'

export default function Reminders({ rems, meds, refresh, token }) {
  const [form, setForm] = useState({ 
    medication_id: '', 
    time_of_day: '09:00', 
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', 
    repeat_pattern: 'daily' 
  })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ medication_id: '', time_of_day: '', timezone: '', repeat_pattern: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Kolkata',
    'Asia/Tokyo',
    'Australia/Sydney'
  ]

  const repeatPatterns = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' }
  ]

  const getMedicationName = (medId) => {
    const med = meds.find(m => m.id === medId)
    return med ? med.name : `Medication #${medId}`
  }

  const add = async () => {
    if (!form.medication_id || !form.time_of_day) {
      setError('Please select a medication and set a time')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.addReminder(token, form)
      setForm({ 
        medication_id: '', 
        time_of_day: '09:00', 
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', 
        repeat_pattern: 'daily' 
      })
      refresh()
    } catch (err) {
      setError('Failed to add reminder')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (rem) => {
    setEditingId(rem.id)
    setEditForm({ 
      medication_id: rem.medication_id, 
      time_of_day: rem.time_of_day, 
      timezone: rem.timezone || 'UTC', 
      repeat_pattern: rem.repeat_pattern || 'daily' 
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ medication_id: '', time_of_day: '', timezone: '', repeat_pattern: '' })
  }

  const update = async (id) => {
    if (!editForm.medication_id || !editForm.time_of_day) {
      setError('Please select a medication and set a time')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.updateReminder(token, id, editForm)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError('Failed to update reminder')
    } finally {
      setLoading(false)
    }
  }

  const del = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) {
      return
    }
    setLoading(true)
    try {
      await api.deleteReminder(token, id)
      refresh()
    } catch (err) {
      setError('Failed to delete reminder')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (time) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour12 = parseInt(hours) % 12 || 12
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reminders</h2>
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Create New Reminder</h3>
        <div className="space-y-3">
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            value={form.medication_id}
            onChange={(e) => setForm({ ...form, medication_id: e.target.value })}
          >
            <option value="">Select medication</option>
            {meds.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.dose})</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Time</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                value={form.time_of_day}
                onChange={(e) => setForm({ ...form, time_of_day: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Repeat</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                value={form.repeat_pattern}
                onChange={(e) => setForm({ ...form, repeat_pattern: e.target.value })}
              >
                {repeatPatterns.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Timezone</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            onClick={add}
            disabled={loading || meds.length === 0}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
          >
            {loading ? 'Adding...' : 'Add Reminder'}
          </button>

          {meds.length === 0 && (
            <p className="text-xs text-gray-500 text-center">Add a medication first to create reminders</p>
          )}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {rems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>No reminders yet. Create your first reminder above.</p>
          </div>
        ) : (
          rems.map((r) => (
            <div
              key={r.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingId === r.id ? (
                <div className="space-y-3">
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                    value={editForm.medication_id}
                    onChange={(e) => setEditForm({ ...editForm, medication_id: e.target.value })}
                  >
                    <option value="">Select medication</option>
                    {meds.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                        value={editForm.time_of_day}
                        onChange={(e) => setEditForm({ ...editForm, time_of_day: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Repeat</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                        value={editForm.repeat_pattern}
                        onChange={(e) => setEditForm({ ...editForm, repeat_pattern: e.target.value })}
                      >
                        {repeatPatterns.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => update(r.id)}
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
                      <h3 className="font-semibold text-gray-900">{getMedicationName(r.medication_id)}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{formatTime(r.time_of_day)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="capitalize">{r.repeat_pattern}</span>
                        </div>
                      </div>
                      {r.timezone && (
                        <p className="text-xs text-gray-500 mt-1">{r.timezone}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(r)}
                        className="text-purple-600 hover:text-purple-700 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => del(r.id)}
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
