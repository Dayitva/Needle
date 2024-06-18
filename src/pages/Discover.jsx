import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import { Outlet } from "react-router-dom";

const Discover = () => {
  const { connected } = useConnection();
  const processId = "qYK8zQz3RZQFy2g372yPWW8H1XolWaaAHQfpw5ubcXQ";
  // const processId = "3mHxrn7Pm45J1D_9EFV_RorOz9kgOLFMTpZQW3ar1S0";
  const [isFetching, setIsFetching] = useState(false);
  const [userList, setUserList] = useState();

  const syncAllUsers = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "UserList" }],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setUserList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllUsers();
    setIsFetching(false);
  }, [connected]);

  return (
    <div>
      <Header />
      <main style={styles.main}>
        <div style={styles.container}>
          <h2 style={styles.heading}>Discover people here</h2>
          {isFetching && <div style={styles.fetching}>Fetching users...</div>}
          <hr style={styles.horizontalRule} />
          {userList &&
            userList.map((user, index) => (
              <div key={index} style={styles.userDiv}>
                <a href={`/profile/${user.UID}`} style={styles.userLink}>
                  <p style={styles.userContent}>{user.Name}</p>
                </a>
              </div>
            ))}
          <hr style={styles.horizontalRule} />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Discover;

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    padding: "20px",
  },
  container: {
    width: "80%",
    maxWidth: "1200px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "20px",
  },
  fetching: {
    marginBottom: "20px",
  },
  horizontalRule: {
    border: 0,
    clear: "both",
    display: "block",
    width: "100%",
    backgroundColor: "#ccc",
    height: "1px",
  },
  userDiv: {
    padding: "10px 20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "10px",
  },
  userContent: {
    margin: "0px",
    padding: "0px",
    color: "#555",
    fontSize: "14px",
  },
  userLink: {
    textDecoration: "none",
    color: "#555",
  },
};
