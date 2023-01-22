import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import classnames from "classnames";
import axios from "axios";
import dayjs from "dayjs";
import plusIcon from "../../shared/images/plus.png";

import "./index.scss";
import classNames from "classnames";

interface todoInterface {
  title: string;
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
function TodoPage() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const [clickedContentIndex, changeClickedContentIndex] = useState("-1");
  const [infoMode, changeInfoMode] = useState<"edit" | "list">("list");
  const [isAddTodoModalOpen, toggleAddTodoModalOpen] = useState(false);
  const [todoList, changeTodoList] = useState<todoInterface[]>([]);
  const [newItem, setNewItem] = useState({ title: "", content: "" });
  const [changeItem, setChangeItem] = useState({ title: "", content: "" });
  const [focusedItemInfo, changeFocusedItemInfo] = useState<todoInterface>({
    title: "",
    content: "",
    id: "",
    createdAt: "",
    updatedAt: "",
  });

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
        const responseData: todoInterface[] = response.data.data;
        const urlID = params.get("id");
        changeTodoList(responseData);
        if (
          urlID &&
          responseData.filter((item) => item.id === urlID).length > 0
        ) {
          changeClickedContentIndex(urlID);
          handleChangeFocusTodoItem(urlID);
        }
      })
      .catch((error) => {
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  }, []);
  const handleInsertNewTodoItem = () => {
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
        toast.success("성공적으로 추가했습니다.");
      })
      .catch((error) => {
        console.log(error.response);
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  };
  const handleChangeFocusTodoItem = (id: string) => {
    axios
      .get(`http://localhost:8080/todos/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        changeClickedContentIndex(id);
        changeFocusedItemInfo(response.data.data);
        setChangeItem({
          title: response.data.data.title,
          content: response.data.data.content,
        });
        params.get("id") ? params.set("id", id) : params.append("id", id);
        navigate("/todo?" + params.toString());
      })
      .catch((error) => {
        console.log(error.response);
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  };
  const handleChangeInfoItem = (id: string) => {
    axios
      .put(
        `http://localhost:8080/todos/${id}`,
        {
          title: changeItem.title,
          content: changeItem.content,
        },
        {
          headers: {
            Authorization: window.localStorage.getItem("token"),
          },
        }
      )
      .then(function (response) {
        toast.success("성공적으로 수정했습니다.");
        changeFocusedItemInfo({
          ...focusedItemInfo,
          title: changeItem.title,
          content: changeItem.content,
        });
        changeTodoList(
          todoList.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: changeItem.title,
                  content: changeItem.content,
                }
              : item
          )
        );
      })
      .catch((error) => {
        console.log(error.response);
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  };
  const handleCancelChangeInfo = () => {
    changeInfoMode("list");
    setChangeItem({
      title: focusedItemInfo.title,
      content: focusedItemInfo.content,
    });
  };
  const handleDeleteChangeInfo = (id: string) => {
    axios
      .delete(`http://localhost:8080/todos/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem("token"),
        },
      })
      .then(function (response) {
        toast.success(`${focusedItemInfo.title}을 삭세하였습니다.`);
        setChangeItem({
          title: "",
          content: "",
        });
        changeFocusedItemInfo({
          title: "",
          content: "",
          id: "",
          createdAt: "",
          updatedAt: "",
        });
        changeTodoList(todoList.filter((item) => item.id !== id));
        changeClickedContentIndex("-1");
        navigate("/todo");
      })
      .catch((error) => {
        console.log(error.response);
        const errorResponse = error.response.data;
        toast.error(errorResponse.details ?? "알 수 없는 오류");
      });
  };
  const getFocusedInfoPage = () => {
    return (
      <div className="info">
        <div className="info-item">
          <span className="info-item--title">제목</span>
          {infoMode === "list" ? (
            <span className="info-item--content">{focusedItemInfo.title}</span>
          ) : (
            <input
              className="info-item--input"
              value={changeItem.title}
              onChange={(e) =>
                setChangeItem({ ...changeItem, title: e.target.value })
              }
            />
          )}
        </div>
        <div className="info-item">
          <span className="info-item--title">내용</span>
          {infoMode === "list" ? (
            <span className="info-item--content">
              {focusedItemInfo.content}
            </span>
          ) : (
            <input
              className="info-item--input"
              value={changeItem.content}
              onChange={(e) =>
                setChangeItem({ ...changeItem, content: e.target.value })
              }
            />
          )}
        </div>
        <div className="info-item">
          <span className="info-item--title">생성일</span>
          <span className="info-item--content">
            {dayjs(focusedItemInfo.createdAt).format("YYYY/MM/DD HH:mm")}
          </span>
        </div>
        <div className="info-item">
          <span className="info-item--title">변경일</span>
          <span className="info-item--content">
            {dayjs(focusedItemInfo.updatedAt).format("YYYY/MM/DD HH:mm")}
          </span>
        </div>
        <div className="info-item--button">
          {infoMode === "edit" ? (
            <input
              type={"button"}
              value={"취소"}
              onClick={() => {
                handleCancelChangeInfo();
              }}
            />
          ) : (
            <input
              type={"button"}
              value={"삭제"}
              onClick={() => {
                handleDeleteChangeInfo(focusedItemInfo.id);
              }}
            />
          )}

          <input
            type={"button"}
            value={infoMode === "edit" ? "확인" : "수정"}
            onClick={() => {
              changeInfoMode(infoMode === "edit" ? "list" : "edit");
              infoMode === "edit" && handleChangeInfoItem(focusedItemInfo.id);
            }}
          />
        </div>
      </div>
    );
  };
  const getIndexColor = (id: string) => {
    const colors = [
      "#2C5BF2",
      "#C9CDFF",
      "#2659EF",
      "#001B9D",
      "#00077F",
      "#5C76FF",
      "#8292FF",
      "#A6AFFF",
      "#AAA5DC",
      "#8D9AFF",
    ];
    return colors[(id[0].charCodeAt(0) + id[id.length - 1].charCodeAt(0)) % 10];
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
                onClick={() => handleInsertNewTodoItem()}
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
                  clicked: clickedContentIndex === item.id,
                })}
                onClick={() => handleChangeFocusTodoItem(item.id)}
              >
                <span
                  className="todo-number"
                  style={{
                    background: getIndexColor(item.id),
                  }}
                >
                  {index + 1}
                </span>
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
          <div
            className={classNames("todo-right", {
              none: clickedContentIndex === "-1",
            })}
          >
            {clickedContentIndex === "-1"
              ? "자세히 보고싶은 일을 선택해주세요."
              : getFocusedInfoPage()}
          </div>
        </span>
      </div>
    </div>
  );
}

export default TodoPage;
