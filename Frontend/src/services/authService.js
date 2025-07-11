// src/services/authService.js
const BASE_URL = 'https://greenbooksapi-production.up.railway.app/api';

export async function login({ username, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function register({ username, email, password, firstName, lastName, phoneNumber }) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, firstName, lastName, phoneNumber })
  });
  if (!response.ok) {
    throw new Error('Register failed');
  }
  return response.json();
} 