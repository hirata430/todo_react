import localforage from "localforage";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n/configs";

import { isTodos } from "./lib/isTodos";
import { isFilter } from "./lib/isFilter";

export const App = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  //const [language, setLanguage] = useState(i18n.language);
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    //t(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    setTodos((todos) => [newTodo, ...todos]);
    setText("");
  };

  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, [key]: value };
        } else {
          return todo;
        }
      });

      return newTodos;
    });
  };

  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  /*const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.removed;
      case "checked":
        return todo.checked && !todo.removed;
      case "unchecked":
        return !todo.checked && !todo.removed;
      case "removed":
        return todo.removed;
      default:
        return todo;
    }
  });*/
  const filteredTodos = useMemo(() => {
    //
    return todos.filter((todo) => {
      switch (filter) {
        case "all":
          return !todo.removed;
        case "checked":
          return todo.checked && !todo.removed;
        case "unchecked":
          return !todo.checked && !todo.removed;
        case "removed":
          return todo.removed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  useEffect(() => {
    localforage
      .getItem("todo-20200101")
      .then((values) => isTodos(values) && setTodos(values));
    localforage
      .getItem("filter-20200102")
      .then((values) => isFilter(values) && setFilter(values));
  }, []);

  useEffect(() => {
    localforage.setItem("todo-20200101", todos);
  }, [todos]);
  useEffect(() => {
    localforage.setItem("filter-20200102", filter);
  }, [filter]);

  return (
    <div>
      <select
        //defaultValue="all"
        value={filter} //<select> の現在の選択肢を filter の状態に基づいて制御するため
        onChange={(e) => handleFilter(e.target.value as Filter)}
      >
        <option value="all">{t("filter.all")}</option>
        <option value="checked">{t("filter.checked")}</option>
        <option value="unchecked">{t("filter.unchecked")}</option>
        <option value="removed">{t("filter.removed")}</option>
      </select>
      <select
        //defaultValue={"i18n.language"}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="ja">{t("filter.lan_ja")}</option>
      </select>

      {filter === "removed" ? (
        <button
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          {t("button.emptyTrash")}
        </button>
      ) : (
        filter !== "checked" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input type="text" value={text} onChange={(e) => handleChange(e)} />
            <input
              type="submit"
              value={t("button.add")}
              onSubmit={handleSubmit}
            />
          </form>
        )
      )}
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() => handleTodo(todo.id, "checked", !todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleTodo(todo.id, "value", e.target.value)}
              />
              <button
                onClick={() => handleTodo(todo.id, "removed", !todo.removed)}
              >
                {todo.removed ? t("button.restore") : t("button.delete")}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
