import api from '../util/api';

function useCarrinho() {
  async function getAll() {
    const response = await api.get('/Carrinho/getAll');
    return response.data;
  }

  async function addItem(produtoId, quantidade = 1) {
    const response = await api.post('/Carrinho/add', { produtoId, quantidade });
    return response.data;
  }

  async function updateQuantidade(id, quantidade) {
    const response = await api.patch(`/Carrinho/update/${id}`, { quantidade });
    return response.data;
  }

  async function removeItem(id) {
    const response = await api.delete(`/Carrinho/delete/${id}`);
    return response.data;
  }

  async function finalizarVenda() {
    const response = await api.post('/Venda/finalizar');
    return response.data;
  }

  async function getVendas() {
    const response = await api.get('/Venda/getAll');
    return response.data;
  }

  return { getAll, addItem, updateQuantidade, removeItem, finalizarVenda, getVendas };
}

export default useCarrinho;