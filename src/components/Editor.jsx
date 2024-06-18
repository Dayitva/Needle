import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  const [draftContent, setDraftContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { connected } = useConnection();
  const processId = "qYK8zQz3RZQFy2g372yPWW8H1XolWaaAHQfpw5ubcXQ";
  // const processId = "3mHxrn7Pm45J1D_9EFV_RorOz9kgOLFMTpZQW3ar1S0";

  const createPost = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected) {
      return;
    }

    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Post" },
          { name: "Content-Type", value: "text/html" },
          // { name: "Post", value: post },
        ],
        data: draftContent,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Post result", res);

      const postResult = await result({
        process: processId,
        message: res,
      });

      console.log("Post Created successfully", postResult);

      setDraftContent("");
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  return (
    <main style={styles.main}>
      <form style={styles.form}>
        <ReactQuill
          theme="snow"
          value={draftContent}
          onChange={setDraftContent}
          style={styles.editor}
        />
        {isPosting && <div style={styles.posting}>Posting...</div>}
        <button
          style={styles.button}
          type="submit"
          disabled={isPosting || draftContent == ""}
          onClick={(e) => createPost(e)}
        >
          Create Post
        </button>
      </form>
    </main>
  );
};

export default Editor;

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    padding: "20px",
  },
  form: {
    width: "80%",
    maxWidth: "1200px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  editor: {
    height: "200px",
    marginBottom: "20px",
  },
  posting: {
    marginBottom: "20px",
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
