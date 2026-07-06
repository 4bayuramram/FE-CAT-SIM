/**
 * httpClientDb.js
 *
 * Helper pemanggilan API bersama untuk seluruh engine "Db" (sumber data
 * database/server-driven). Bukan bagian dari 7 engine di dokumen
 * perencanaan, tapi dependency kecil supaya sessionEngineDb / examEngineDb
 * tidak menulis ulang fetch + auth header + error handling di banyak tempat.
 *
 * Cara pakai (di aplikasi nyata):
 *   import { configureHttpClientDb } from './httpClientDb';
 *   configureHttpClientDb({
 *     baseUrl: 'https://api.contoh.com',
 *     getAccessToken: () => store.getState().auth.accessToken,
 *   });
 */

let config = {
  baseUrl: '',
  getAccessToken: () => null,
};

function configureHttpClientDb({ baseUrl, getAccessToken }) {
  config = {
    baseUrl: baseUrl ?? config.baseUrl,
    getAccessToken: getAccessToken ?? config.getAccessToken,
  };
}

/**
 * Error khusus supaya rulesEngine/sessionEngine bisa membedakan error
 * bisnis (409, 403, dst — sesuai Kontrak API) dari error jaringan.
 */
class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function postDb(path, payload) {
  const token = await config.getAccessToken();

  let response;
  try {
    response = await fetch(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload ?? {}),
    });
  } catch (networkErr) {
    throw new ApiError(`Gagal menghubungi ${path}: ${networkErr.message}`, {
      status: null,
      body: null,
    });
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // Response tanpa body JSON valid — biarkan body null, status tetap dicek.
  }

  if (!response.ok) {
    // Sesuai Kontrak API: body error selalu { error: string, ...opsional }
    throw new ApiError(body?.error ?? `Request ke ${path} gagal`, {
      status: response.status,
      body,
    });
  }

  return body;
}

export { configureHttpClientDb, postDb, ApiError };
