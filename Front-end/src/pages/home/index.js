import { useState, useEffect } from "react";
import useProduto from "../../hooks/useProduto";
import useCarrinho from "../../hooks/useCarrinho";

const Home = () => {
  const { getAll: getAllProdutos } = useProduto();
  const { getAll: getAllCarrinho, addItem, updateQuantidade, removeItem, finalizarVenda, getVendas } = useCarrinho();

  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [listaProdutos, listaCarrinho, listaVendas] = await Promise.all([
        getAllProdutos(),
        getAllCarrinho(),
        getVendas()
      ]);
      setProdutos(listaProdutos);
      setCarrinho(listaCarrinho);
      setVendas(listaVendas);
    } catch (err) {
      console.error("Erro ao carregar dados da loja:", err);
    }
  }

  async function handleAdicionarCarrinho(produtoId) {
    try {
      await addItem(produtoId, 1);
      setCarrinho(await getAllCarrinho());
    } catch (err) {
      alert("Erro ao adicionar produto ao carrinho.");
    }
  }

  async function handleAlterarQuantidade(itemId, novaQtd) {
    try {
      await updateQuantidade(itemId, novaQtd);
      setCarrinho(await getAllCarrinho());
    } catch (err) {
      alert("Erro ao atualizar quantidade.");
    }
  }

  async function handleRemoverItem(itemId) {
    try {
      await removeItem(itemId);
      setCarrinho(await getAllCarrinho());
    } catch (err) {
      alert("Erro ao remover item do carrinho.");
    }
  }

  async function handleFinalizarVenda() {
    if (carrinho.length === 0) {
      alert("Adicione produtos ao carrinho antes de finalizar!");
      return;
    }
    try {
      const resposta = await finalizarVenda();
      alert(`${resposta.message} Total: R$ ${Number(resposta.venda.valorTotal).toFixed(2)}`);
      carregarDados();
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao finalizar venda.");
    }
  }

  const totalCarrinho = carrinho.reduce((acc, item) => {
    const preco = item.Produto ? Number(item.Produto.preco) : 0;
    return acc + preco * item.quantidade;
  }, 0);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <h2 className="fs-4 mb-3">Catálogo de Produtos</h2>
          <div className="row">
            {produtos.length === 0 ? (
              <p className="text-muted">Nenhum produto disponível para venda.</p>
            ) : (
              produtos.map((prod) => (
                <div className="col-md-4 mb-4" key={prod.id}>
                  <div className="card h-100 shadow-sm">
                    {prod.imagem ? (
                      <img src={`http://localhost:5000/images/${prod.imagem}`} className="card-img-top" alt={prod.nome} style={{ height: "180px", objectFit: "cover" }} />
                    ) : (
                      <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ height: "180px" }}>Sem imagem</div>
                    )}
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="card-title">{prod.nome}</h5>
                        <p className="card-text fw-bold text-success">R$ {Number(prod.preco).toFixed(2)}</p>
                      </div>
                      <button className="btn btn-primary w-100 mt-2" onClick={() => handleAdicionarCarrinho(prod.id)}>
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Carrinho de Compras</h5>
            </div>
            <div className="card-body">
              {carrinho.length === 0 ? (
                <p className="text-muted text-center my-3">Seu carrinho está vazio.</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {carrinho.map((item) => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.Produto?.nome}</strong>
                          <br />
                          <small className="text-muted">R$ {Number(item.Produto?.preco || 0).toFixed(2)} x {item.quantidade}</small>
                        </div>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary" onClick={() => handleAlterarQuantidade(item.id, item.quantidade - 1)}>-</button>
                          <button className="btn btn-outline-secondary" onClick={() => handleAlterarQuantidade(item.id, item.quantidade + 1)}>+</button>
                          <button className="btn btn-outline-danger" onClick={() => handleRemoverItem(item.id)}>x</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                    <span>Total:</span>
                    <span>R$ {totalCarrinho.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-success w-100" onClick={handleFinalizarVenda}>Finalizar Venda</button>
                </>
              )}
            </div>
          </div>

          {vendas.length > 0 && (
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-secondary text-white">
                <h6 className="mb-0">Últimas Vendas Realizadas</h6>
              </div>
              <ul className="list-group list-group-flush">
                {vendas.slice(0, 5).map((v) => (
                  <li key={v.id} className="list-group-item d-flex justify-content-between">
                    <span>Venda #{v.id}</span>
                    <strong>R$ {Number(v.valorTotal).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;