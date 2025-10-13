import api from './api';

export const loginTeacher = async (email, password) => {
  const res = await api.get(`/teachers`, { params: { email, password } });
  return Array.isArray(res.data) ? res.data[0] : res.data?.value?.[0];
};

export const loginStudent = async (rollNo, password) => {
  const res = await api.get(`/students`, { params: { rollNo, password } });
  return Array.isArray(res.data) ? res.data[0] : res.data?.value?.[0];
};

