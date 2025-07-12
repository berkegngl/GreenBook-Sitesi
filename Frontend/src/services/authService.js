// src/services/authService.js
const BASE_URL = 'https://greenbooksapi-production.up.railway.app/api';

export async function login({ username, password }) {
  console.log('[AUTH][REQUEST] /auth/login', { username });
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  console.log('[AUTH][RESPONSE] /auth/login', data);
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return data;
}

export async function register({ username, email, password, firstName, lastName, phoneNumber }) {
  console.log('[AUTH][REQUEST] /auth/register', { username, email, firstName, lastName, phoneNumber });
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, firstName, lastName, phoneNumber })
  });
  const data = await response.json();
  console.log('[AUTH][RESPONSE] /auth/register', data);
  if (!response.ok) {
    throw new Error('Register failed');
  }
  return data;
} 