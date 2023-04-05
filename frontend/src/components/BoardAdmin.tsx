import React from "react";

// import { getAdminBoard } from "../services/user.service";
// import EventBus from "../common/EventBus";

const BoardAdmin: React.FC = () => {
  // const [content, setContent] = useState<string>("");

  // useEffect(() => {
  //   getAdminBoard().then(
  //     (response) => {
  //       setContent(response.data);
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();

  //       setContent(_content);

  //       if (error.response && error.response.status === 401) {
  //         EventBus.dispatch("logout");
  //       }
  //     }
  //   );
  // }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>BoardAdmin</h3>
      </header>
    </div>
  );
};

export default BoardAdmin;
