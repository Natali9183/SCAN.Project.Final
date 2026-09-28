import { apiRequest } from './api';

export function getAccountInfo() {
  return apiRequest('/api/v1/account/info');
}

export function getHistograms(body) {
  return apiRequest('/api/v1/objectsearch/histograms', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function objectSearch(body) {
  return apiRequest('/api/v1/objectsearch', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getDocuments(ids) {
  return apiRequest('/api/v1/documents', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}
