import { useState, useEffect, useRef } from "react";
import InputGroup from "../../components/inputGroup";
import useProduto from "../../hooks/useProduto";

const Produtos = () => {
  const { getAll, create, update, remove } = useProduto();
  const [produto, setProduto] = useState({ nome: "", preco: "" });
  const [imagem, setImagem] = useState(null);
  const [lstProdutos, setLstProdutos] = useState([]);
  const [editId, setEditId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const dados = await getAll();
      setLstProdutos(dados);
    } catch (err) {
      alert("Erro ao carregar produtos da API.");
    }
  }

  function validateProduto() {
    if (!produto.nome || produto.nome.trim() === "") {
      alert("O campo Nome é obrigatório!");
      return false;
    }
    if (produto.preco === "" || produto.preco === null || produto.preco === undefined) {
      alert("O campo Preço é obrigatório!");
      return false;
    }
    if (Number(produto.preco) < 0) {
      alert("O preço não pode ser negativo!");
      return false;
    }
    if (imagem) {
      const tiposPermitidos = ["image/jpeg", "image/png"];
      const nomeArquivo = imagem.name.toLowerCase();
      const extensaoValida = nomeArquivo.endsWith(".jpeg") || nomeArquivo.endsWith(".jpg") || nomeArquivo.endsWith(".png");
      if (!tiposPermitidos.includes(imagem.type) || !extensaoValida) {
        alert("Formato inválido! Selecione apenas imagens .jpeg ou .png.");
        return false;
      }
    }
    return true;
  }

  function handleChange(e) {
    setProduto({ ...produto, [e.target.name]: e.target.value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setImagem(null);
      return;
    }
    const tiposPermitidos = ["image/jpeg", "image/png"];
    const nomeArquivo = file.name.toLowerCase();
    const extensaoValida = nomeArquivo.endsWith(".jpeg") || nomeArquivo.endsWith(".jpg") || nomeArquivo.endsWith(".png");

    if (!tiposPermitidos.includes(file.type) || !extensaoValida) {
      alert("Apenas arquivos .jpeg e .png são permitidos!");
      e.target.value = "";
      setImagem(null);
      return;
    }
    setImagem(file);
  }

  function limparFormulario() {
    setProduto({ nome: "", preco: "" });
    setImagem(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateProduto()) return;

    const formData = new FormData();
    formData.append("nome", produto.nome);
    formData.append("preco", produto.preco);
    if (imagem) formData.append("imagem", imagem);

    try {
      if (editId) {
        await update(editId, formData);
        alert("Produto atualizado com sucesso!");
      } else {
        await create(formData);
        alert("Produto cadastrado com sucesso!");
      }
      limparFormulario();
      carregarProdutos();
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao salvar o produto.");
    }
  }

  function handleEdit(item) {
    setEditId(item.id);
    setProduto({ nome: item.nome, preco: item.preco });
    setImagem(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;
    try {
      await remove(id);
      alert("Produto excluído com sucesso!");
      carregarProdutos();
    } catch (err) {
      alert("Erro ao excluir o produto.");
    }
  }

  return (
    <div className="container">
      <h1 className="text-center fs-4 mb-4">
        {editId ? "Editar Produto" : "Cadastro de Produtos"}
      </h1>

      <form onSubmit={handleSubmit}>
        <InputGroup label="Nome" onChange={handleChange} type="text" placeholder="Nome do Produto" name="nome" value={produto.nome} />
        <InputGroup label="Preço" onChange={handleChange} type="number" placeholder="Preço do Produto" name="preco" value={produto.preco} min="0" step="0.01" />

        <div className="input-group mb-3">
          <span className="input-group-text">Imagem (.jpeg / .png)</span>
          <input ref={fileInputRef} className="form-control" type="file" accept=".jpeg,.jpg,.png,image/jpeg,image/png" onChange={handleFileChange} />
        </div>

        <button className="btn btn-primary me-2" type="submit">{editId ? "Atualizar" : "Salvar"}</button>
        {editId && (
          <button className="btn btn-secondary" type="button" onClick={limparFormulario}>Cancelar</button>
        )}
      </form>

      <table className="table table-striped align-middle mt-4">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {lstProdutos.length === 0 ? (
            <tr><td colSpan={4} className="text-center">Nenhum produto cadastrado</td></tr>
          ) : (
            lstProdutos.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.imagem ? (
                    <img src={`http://localhost:5000/images/${item.imagem}`} alt={item.nome} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} />
                  ) : (
                    <span className="text-muted">Sem imagem</span>
                  )}
                </td>
                <td>{item.nome}</td>
                <td>R$ {Number(item.preco).toFixed(2)}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Produtos;