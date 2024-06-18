import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import Header from "../components/Header";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";
import { useEffect, useState } from "react";
import Editor from "../components/Editor";

const Create = () => {
  const { connected } = useConnection();
  // const processId = "3mHxrn7Pm45J1D_9EFV_RorOz9kgOLFMTpZQW3ar1S0";
  const processId = "qYK8zQz3RZQFy2g372yPWW8H1XolWaaAHQfpw5ubcXQ";
  const [isFetching, setIsFetching] = useState(false);
  const [userList, setUserList] = useState([]);
  const [name, setName] = useState([]);

  const activeAddress = useActiveAddress();

  const syncAllUsers = async () => {
    if (!connected) {
      return;
    }

    try {
      const res = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "UserList" }],
        anchor: "1234",
      });
      console.log("Dry run User result", res);
      const filteredResult = res.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered User result", filteredResult);
      setUserList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const registerUser = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" },
      { name: "Name", value: name }
      ],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register User result", res);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    if (
      registerResult.Messages[0].Data === "Successfully Registered." ||
      registerResult.Messages[0].Data === "Already Registered"
    ) {
      syncAllUsers();
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllUsers();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes user",
      userList.some((user) => user.UID == activeAddress)
    );

    setIsFetching(false);
  }, [connected]);

  return (
    <div>
      <Header />
      <main style={styles.main}>
        <div style={styles.container}>
          <h2 style={styles.heading}>What is on your mind?</h2>
          {isFetching && <div style={styles.fetching}>Fetching posts...</div>}
          <hr style={styles.horizontalRule} />
          {userList && userList.some((user) => user.UID === activeAddress) ? (
            <Editor />
          ) : (
            <div>
              <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.titleInput}
            />
            <button style={styles.button} onClick={registerUser}>
              Register
            </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Create;

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
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "200px",
    marginTop: "20px",
  },
};
