// src/pages/MyAppointments.jsx
import { useState } from 'react'; // Import useState
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointmentsAsync, deleteAppointmentAsync, updateAppointmentAsync } from '../redux/appointmentSlice';
import { Link } from 'react-router-dom';

export default function MyAppointments() {
  const dispatch = useDispatch();
  const { items: appointments, loading, error } = useSelector((state) => state.appointments);
  const [editingStatus, setEditingStatus] = useState({}); // { appointmentId: newStatus }
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Загружаем записи только если пользователь авторизован
    if (user?.token) {
      dispatch(fetchAppointmentsAsync());
    }
  }, [dispatch, user?.token]);

  const handleStatusChange = (appointmentId, newStatus) => {
    dispatch(updateAppointmentAsync({ appointmentId, updateData: { status: newStatus } }))
      .unwrap()
      .then(() => setEditingStatus(prev => ({ ...prev, [appointmentId]: undefined })))
      .catch((err) => {
        console.error('Failed to update appointment status:', err);
        // Toast error is handled in slice
      });
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm('Вы уверены, что хотите отменить эту запись?')) {
      dispatch(deleteAppointmentAsync(appointmentId))
        .unwrap() // Allows catching rejection
        .catch((err) => {
          // Error toast is handled in the slice, but you could add specific handling here
          console.error('Failed to delete appointment:', err);
        });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-gray-600">Пожалуйста, <Link to="/login" className="text-blue-500 hover:underline">войдите</Link>, чтобы просмотреть свои записи на прием.</p>
      </div>
    );
  }

  // Determine which appointments to show based on role
  const userAppointments = (user.role === 'admin' || user.role === 'veterinarian')
    ? appointments // Admins/Vets see all
    : appointments.filter(app => app.client_id === user.id); // Clients see only their own

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Мои Записи на Прием</h1>

      {loading && <p className="text-center text-gray-600">Загрузка записей...</p>}
      {error && <p className="text-center text-red-500">Ошибка загрузки записей: {error}</p>}

      {!loading && !error && userAppointments.length === 0 && (
        <p className="text-center text-gray-500">У вас пока нет записей на прием.</p>
      )}

      {!loading && !error && userAppointments.length > 0 && (
        <div className="space-y-6">
          {userAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Запись #{appointment.id}</h2>
                  <p className="text-gray-600 mb-1">Дата: {new Date(appointment.appointment_date).toLocaleString()}</p>
                  <p className="text-gray-600 mb-1">Причина: {appointment.reason || 'Не указана'}</p>
                  {/* Display Pet Info */}
                  {appointment.pets && appointment.pets.length > 0 && (
                     <p className="text-gray-600 mb-1">Питомец(ы): {appointment.pets.map(p => p.name).join(', ')}</p>
                  )}
                   {/* Display Vet Info if available */}
                  {appointment.veterinarian && (
                     <p className="text-gray-600 mb-1">Врач: {appointment.veterinarian.username}</p>
                  )}
                   {/* Display Client Info if user is admin/vet */}
                  {(user.role === 'admin' || user.role === 'veterinarian') && appointment.client && (
                     <p className="text-gray-600 mb-1">Клиент: {appointment.client.username} ({appointment.client.email})</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                      {appointment.status}
                    </span>

                    {/* Status Update for Admin/Vet */} 
                    {(user.role === 'admin' || user.role === 'veterinarian') && appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                      <div className="mt-2">
                        {editingStatus[appointment.id] !== undefined ? (
                          <select
                            value={editingStatus[appointment.id]}
                            onChange={(e) => setEditingStatus(prev => ({ ...prev, [appointment.id]: e.target.value }))}
                            className="p-1 border rounded text-sm mr-2"
                          >
                            <option value="Pending">Ожидание</option>
                            <option value="Confirmed">Подтверждено</option>
                            <option value="Completed">Завершено</option>
                            <option value="Cancelled">Отменено</option>
                          </select>
                        ) : (
                          <select
                            value={appointment.status} 
                            onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                            className="p-1 border rounded text-sm mr-2"
                          >
                            <option value="Pending">Ожидание</option>
                            <option value="Confirmed">Подтверждено</option>
                            <option value="Completed">Завершено</option>
                            <option value="Cancelled">Отменено</option>
                          </select>
                        )}
                        {/* <button 
                          onClick={() => handleStatusChange(appointment.id, editingStatus[appointment.id])}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
                          disabled={!editingStatus[appointment.id]}
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingStatus(prev => ({ ...prev, [appointment.id]: undefined }))}
                          className="bg-gray-300 px-2 py-1 rounded text-xs"
                        >
                          Cancel
                        </button> */} 
                      </div>
                    )}

                    {/* Allow deletion only for 'Pending' or 'Confirmed' by client/admin/owner */} 
                    {(appointment.status === 'Pending' || appointment.status === 'Confirmed') && (user.role === 'client' || user.role === 'admin' || user.role === 'owner') && (
                        <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                        Отменить
                        </button>
                    )}
                    {/* Allow deletion by Admin/Vet regardless of status? Adjust as needed */} 
                    {(user.role === 'admin' || user.role === 'veterinarian') && user.role !== 'client' && (
                         <button
                         onClick={() => handleDelete(appointment.id)}
                         className="text-red-500 hover:text-red-700 text-sm font-medium mt-1"
                         >
                         Удалить (Админ/Вет)
                         </button>
                    )}
                     {/* Add Edit button later if needed */} 
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}