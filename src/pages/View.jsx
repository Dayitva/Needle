import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import { Outlet } from "react-router-dom";

const View = () => {
  const { connected } = useConnection();
  const processId = "qYK8zQz3RZQFy2g372yPWW8H1XolWaaAHQfpw5ubcXQ";
  // const processId = "3mHxrn7Pm45J1D_9EFV_RorOz9kgOLFMTpZQW3ar1S0";
  const [isFetching, setIsFetching] = useState(false);
  const [postList, setPostList] = useState();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "PostsList" }],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setPostList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected]);

  return (
    <div>
      <Header />
      <main style={styles.main}>
        <div style={styles.container}>
          <h2>Check out the latest posts</h2>
          {isFetching && <div>Fetching posts...</div>}
          {postList &&
            postList.map((post, index) => (
              <div key={index} style={styles.postDiv}>
                <a href={`/view/${post.PID}`} style={styles.postLink}>
                  <p style={styles.postContent}>{post.Post}</p>
                  <p style={styles.postContent}>@{post.Name}</p>
                </a>
              </div>
            ))}
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default View;

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
  postDiv: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  },
  postContent: {
    margin: "0",
    color: "#333",
  },
  postLink: {
    textDecoration: "none",
    color: "#007BFF",
  },
};
