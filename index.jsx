import { useEffect, useState, useRef } from "react";
import "./style.css";
import Lixeira from "../../assets/lixeira.svg";
import api from "../../services/api";

function Home() {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getUsers() {
    const usersFromApi = await api.get("/usuarios");
    setUsers(usersFromApi.data);
  }

  async function createUser() {
    await api.post("/usuarios", {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });
    clearForm();
    getUsers();
  }

  async function updateUser() {
    await api.put(`/usuarios/${editUserId}`, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });
    clearForm();
    getUsers();
  }

  function clearForm() {
    inputName.current.value = "";
    inputAge.current.value = "";
    inputEmail.current.value = "";
    setEditMode(false);
    setEditUserId(null);
  }

  function handleEdit(user) {
    setEditMode(true);
    setEditUserId(user.id);
    inputName.current.value = user.name;
    inputAge.current.value = user.age;
    inputEmail.current.value = user.email;
  }

  async function deleteUser(id) {
    await api.delete(`/usuarios/${id}`);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>{editMode ? "Editar Usuário" : "Cadastro de Usuários"}</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input placeholder="Email" name="email" type="email" ref={inputEmail} />
        <button
          type="button"
          onClick={editMode ? updateUser : createUser}
        >
          {editMode ? "Salvar Alterações" : "Cadastrar"}
        </button>
        {editMode && <button type="button" onClick={clearForm}>Cancelar</button>}
      </form>

      {users.map((user) => (
        <div key={user.id} className="card">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => handleEdit(user)}>Editar</button>
          <button onClick={() => deleteUser(user.id)}>
            <img src={Lixeira} alt="Excluir" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;

