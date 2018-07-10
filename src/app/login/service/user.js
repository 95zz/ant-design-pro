import request from '../../../core/utils/request';

export async function query() {
  return request('/users');
}

export async function queryCurrent() {
  return request('/currentUser');
}
