import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import classnames from "classnames";
import axios from "axios";
import plusIcon from "../../shared/images/plus.png";

import "./index.scss";

interface todoInterface {
  title: string;
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
function TodoPage() {
  const navigate = useNavigate();
  const [clickedContentIndex, changeClickedContentIndex] = useState(-1);
  const [isAddTodoModalOpen, toggleAddTodoModalOpen] = useState(false);
  const [todoList, changeTodoList] = useState<todoInterface[]>([]);
  const [newItem, setNewItem] = useState({ title: "", content: "" });
  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      toast.error("토큰이 없어 로그인화면으로 전환됩니다.");
      navigate("/auth");
    }
    axios
      .get("http://localhost:8080/todos", {
        headers: {
          Authorization: window.localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        const responseData = response.data;
        changeTodoList(responseData.data);
      })
      .catch((error) => {
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  }, []);
  const handleInserNewTodoItem = () => {
    axios
      .post(
        "http://localhost:8080/todos",
        {
          title: newItem.title,
          content: newItem.content,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        }
      )
      .then(function (response) {
        changeTodoList([...todoList, response.data.data]);
        toggleAddTodoModalOpen(false);
      })
      .catch((error) => {
        console.log(error.response);
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  };
  return (
    <div className="todo">
      {isAddTodoModalOpen && (
        <div className={"todo-modal"}>
          <div className={"todo-innerModal"}>
            <div className={"header"}>
              <span>새 할일 추가</span>
              <span
                onClick={() => {
                  setNewItem({ title: "", content: "" });
                  toggleAddTodoModalOpen(false);
                }}
                className={"close"}
              >
                X
              </span>
            </div>
            <div className={"body"}>
              <span>
                제목
                <input
                  className="todo-innerModal--input"
                  placeholder="제목을 입력하세요."
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                />
              </span>
              <span>
                내용
                <input
                  className="todo-innerModal--input"
                  placeholder="내용을 입력하세요."
                  onChange={(e) =>
                    setNewItem({ ...newItem, content: e.target.value })
                  }
                />
              </span>
            </div>
            <div className={"todo-footer"}>
              <button
                className={"todo-footer--add"}
                onClick={() => handleInserNewTodoItem()}
              >
                추가
              </button>
              <button
                className={"todo-footer--cancel "}
                onClick={() => {
                  toggleAddTodoModalOpen(false);
                  setNewItem({ title: "", content: "" });
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="todo-body">
        <span className="todo-todoTypo">Todo</span>
        <span className="todo-subBody">
          <div className="todo-left">
            {todoList.map((item: todoInterface, index) => (
              <div
                className={classnames("todo-item", {
                  clicked: clickedContentIndex === index,
                })}
                onClick={() => changeClickedContentIndex(index)}
              >
                <span className="todo-number">{index + 1}</span>
                <span className="todo-contentName">{item.title}</span>
              </div>
            ))}
            <div
              className={"todo-item"}
              onClick={() => toggleAddTodoModalOpen(true)}
            >
              <img height={30} width={30} src={plusIcon} alt="logo" />
              <span className="todo-contentName">새 할일 추가</span>
            </div>
          </div>
          <div className="todo-right">right</div>
        </span>
      </div>
    </div>
  );
}

export default TodoPage;
