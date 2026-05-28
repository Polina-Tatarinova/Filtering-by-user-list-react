import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const localStorageValue = () => {
    const save = localStorage.getItem("value");
    return save ? JSON.parse(save) : "";
  };

  const localStorageUser = () => {
    const save = localStorage.getItem("user");
    return save ? JSON.parse(save) : [];
  };

  const localStorageSort = () => {
    const save = localStorage.getItem("user");
    return save ? JSON.parse(save) : "";
  };

  const [user, setUser] = useState(localStorageUser);
  const [value, setValue] = useState(localStorageValue);
  const [sort, setSort] = useState(localStorageSort);
  const USERS = "https://jsonplaceholder.typicode.com/users";

  useEffect(() => {
    async function fetchServerData() {
      try {
        const responce = await fetch(USERS);
        if (!responce.ok) {
          throw new Error(`Ошибка сервера: ${responce.status}`);
        }
        const data = await responce.json();
        setUser(data);
        console.log("Полученные данные:", data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    }
    fetchServerData();
  }, []);

  const inputFilterUsers = user.filter((person) => {
    if (!value.trim()) {
      return true;
    }
    const inputValue = value.toLowerCase();
    return (
      person.name.toLowerCase().includes(inputValue) ||
      person.address.city.toLowerCase().includes(inputValue)
    );
  });

  const sortUserNameOrCity = (arraySort) => {
    if (sort === "name") {
      return [...arraySort].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "city") {
      return [...arraySort].sort((a, b) =>
        a.address.city.localeCompare(b.address.city),
      );
    }
    return arraySort
  };

  const displayUserSortFilter = sortUserNameOrCity(inputFilterUsers);

  useEffect(() => {
    localStorage.setItem("value", JSON.stringify(value));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("sort", JSON.stringify(sort));
  }, [value, user, sort]);

  return (
    <>
      <div className="search-container">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="search-input"
        />
        {/* <button className="search-button">найти</button> */}
      </div>
      <button onClick={()=>{setSort('name')}}>Сортировать по имени(в алфавитном порядке)</button>
      <button onClick={()=>{setSort('city')}}>Сортировать по городу(в алфавитном порядке)</button>

      <div className="cards-grid">
        {displayUserSortFilter.map((person) => (
          <div className="card" key={person.id}>
            <p className="card-title">{person.name}</p>
            <p className="card-email">{person.email}</p>
            <p className="card-city">{person.address.city}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
