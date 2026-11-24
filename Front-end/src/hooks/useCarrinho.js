import api from '../util/api';

function useProduto() {
  async function getAll() {
    const response = await api.get('/Produto/getAll');
    return response.data;
  }

  async function getById(id) {
    const response = await api.get(`/Produto/getById/${id}`);
    return response.data;
  }

  async function create(formData) {
    const response = await api.post('/Produto/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async function update(id, formData) {
    const response = await api.patch(`/Produto/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async function remove(id) {
    const response = await api.delete(`/Produto/delete/${id}`);
    return response.data;
  }

  return { getAll, getById, create, update, remove };
}

export default useProduto;