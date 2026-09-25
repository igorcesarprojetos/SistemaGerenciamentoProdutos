/**
 * Api — encapsula o axios com autenticação Bearer.
 * Uso: const api = new Api('https://localhost:7204/');
 */
 class Api {
  constructor(baseURL) {
    this._baseURL = baseURL;
    this._token   = '';
    this._client  = axios.create({ baseURL });

    this._client.interceptors.request.use(cfg => {
      if (this._token) cfg.headers.Authorization = `Bearer ${this._token}`;
      return cfg;
    });

    this._client.interceptors.response.use(
      r   => r,
      err => {
        if (err.response?.status === 401) window.App?.auth?.logout();
        return Promise.reject(err);
      }
    );
  }

  setToken(token) { this._token = token; }
  clearToken()    { this._token = ''; }

  get(path)         { return this._client.get(path); }
  post(path, body)  { return this._client.post(path, body); }
  put(path, body)   { return this._client.put(path, body); }
  delete(path)      { return this._client.delete(path); }
  getBlob(path)      { return this._client.get(path, { responseType: 'blob' }); }
}
