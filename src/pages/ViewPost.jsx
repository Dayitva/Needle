import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  message,
  result,
  dryrun,
} from "@permaweb/aoconnect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const ViewPost = () => {
  const { postId } = useParams();
  const { connected } = useConnection();

  const processId = "qYK8zQz3RZQFy2g372yPWW8H1XolWaaAHQfpw5ubcXQ";
  // const processId = "3mHxrn7Pm45J1D_9EFV_RorOz9kgOLFMTpZQW3ar1S0";
  const [isFetching, setIsFetching] = useState(false);
  const [postContent, setPostContent] = useState();
  const [replyContent, setReplyContent] = useState();
  const [replies, setReplies] = useState([]);

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      console.log("Post ID", postId);
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "GetPost" },
          { name: "PostId", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result for post", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      await setPostContent(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const syncAllReplies = async () => {
    if (!connected) {
      return;
    }

    try {
      console.log("Post ID", postId);
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "RepliesList" },
          { name: "PostId", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result for replies", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      await setReplies(filteredResult);

      // const result = await dryrun({
      //   process: processId,
      //   data: "",
      //   tags: [
      //     { name: "Action", value: "RepliesList" },
      //     { name: "PostId", value: postId },
      //   ],
      //   anchor: "1234",
      // });
      // console.log("Dry run result for replies", result);
      // const filteredResult = JSON.parse(result.Messages[0].Data);
      // console.log("Filtered result", filteredResult);
      // await setReplies(filteredResult);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const reply = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected) {
      return;
    }

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Reply" },
          { name: "PostId", value: postId },
        ],
        data: replyContent,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Reply result", res);

      const replyResult = await result({
        process: processId,
        message: res,
      });

      console.log("Reply Created successfully", replyResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    syncAllReplies();
    setIsFetching(false);
  }, [connected]);

  return (
    <div>
      <Header />
      <main style={styles.main}>
        {postContent && (
          <div style={styles.container}>
            <Link to="/view" style={styles.postLink}>
              <button style={styles.button}>Back</button>
            </Link>
            <br />
            <br />
            <p style={styles.postContent}>{postContent.Post}</p>
            <p style={styles.postContent}>@{postContent.Name}</p>
            {/* <hr style={styles.horizontalRule} />
          <ReactQuill value={postContent.Post} readOnly theme="bubble" />
          <hr style={styles.horizontalRule} /> */}
            <input
              type="text"
              placeholder="Reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              style={styles.titleInput}
            />
            <button style={styles.button} onClick={reply}>
              Reply
            </button>
          </div>
        )}

        {replies && (
          <div style={styles.container}>
            <h2 style={styles.postHeading}>Replies</h2>
            {replies.map((reply, index) => (
              <div key={index} style={styles.postDiv}>
                <p style={styles.postContent}>{reply.Reply}</p>
                <p style={styles.postContent}>@{reply.Name}</p>
                <hr style={styles.horizontalRule} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewPost;

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
  postContent: {
    margin: "0",
    color: "#333",
  },
  postLink: {
    textDecoration: "none",
    color: "#007BFF",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100px",
    marginTop: "20px",
  },
  horizontalRule: {
    border: 0,
    clear: "both",
    display: "block",
    width: "100%",
    backgroundColor: "#ccc",
    height: "1px",
  },
  postDiv: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  },
};
