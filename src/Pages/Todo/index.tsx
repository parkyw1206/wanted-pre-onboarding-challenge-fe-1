import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import classnames from "classnames";
import axios from "axios";
import plusIcon from "../../shared/images/plus.png";
import Modal from "react-modal";

import "./index.scss";

function TodoPage() {
  const navigate = useNavigate();
  const [clickedContentIndex, changeClickedContentIndex] = useState(-1);
  const [isAddTodoModalOpen, toggleAddTodoModalOpen] = useState(false);
  const [todoList, changeTodoList] = useState([]);
  useEffect(() => {
    if (!window.localStorage.getItem("token")) {
      toast.error("토큰이 없어 로그인화면으로 전환됩니다.");
      navigate("/auth");
    }
    axios
      .get("http://localhost:8080/todos")
      .then(function (response) {
        const responseData = response.data;
        changeTodoList(responseData.data);
      })
      .catch((error) => {
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  }, []);
  return (
    <div className="todo">
      {isAddTodoModalOpen && (
        <Modal isOpen={isAddTodoModalOpen}>
          새 Todo 추가
          <button onClick={() => toggleAddTodoModalOpen(false)}>close</button>
        </Modal>
      )}
      <div className="todo-body">
        <span className="todo-todoTypo">Todo</span>
        <span className="todo-subBody">
          <div className="todo-left">
            {todoList.map((item, index) => (
              <div
                className={classnames("todo-item", {
                  clicked: clickedContentIndex === index,
                })}
                onClick={() => changeClickedContentIndex(index)}
              >
                <span className="todo-number">{index}</span>
                <span className="todo-contentName">{item}</span>
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
