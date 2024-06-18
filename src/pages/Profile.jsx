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

const Profile = () => {
  const { userId } = useParams();
  const { connected } = useConnection();

  const processId = "qYK8zQz3RZQFy2g372yPWW8H1XolWaaAHQfpw5ubcXQ";
  // const processId = "3mHxrn7Pm45J1D_9EFV_RorOz9kgOLFMTpZQW3ar1S0";
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const syncUser = async () => {
    if (!connected) {
      return;
    }

    try {
      console.log("UserId", userId);
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "GetUser" },
          { name: "UserId", value: userId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result for user", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      await setUser(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const syncAllFollowers = async () => {
    if (!connected) {
      return;
    }

    try {
      console.log("UserID", userId);
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "FollowerList" },
          { name: "UserId", value: userId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result for follower", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result for follower", filteredResult);
      await setFollowers(filteredResult);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const syncAllFollowing = async () => {
    if (!connected) {
      return;
    }

    try {
      console.log("UserID", userId);
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "FollowingList" },
          { name: "UserId", value: userId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result for following", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result for following", filteredResult);
      await setFollowing(filteredResult);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const follow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected) {
      return;
    }

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Follow" },
          { name: "UserId", value: userId },
        ],
        data: "",
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Follow result", res);

      const postResult = await result({
        process: processId,
        message: res,
      });

      console.log("Post Created successfully", postResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncUser();
    syncAllFollowers();
    syncAllFollowing();
    setIsFetching(false);
  }, [connected]);

  return (
    <div>
      <Header />
      <main style={styles.main}>
        <div style={styles.container}>
          <section style={styles.section}>
            <h2>Welcome to the Profile Page</h2>
            {isFetching && <div>Fetching user...</div>}
            {user && (
              <div style={styles.userDiv}>
                <p style={styles.userContent}>@{user.Name}</p>
                <button style={styles.button} onClick={follow}>
                  Follow
                </button>
              </div>
            )}
          </section>

          <section style={styles.section}>
            <h2>Followers</h2>
            {isFetching && <div>Fetching followers...</div>}
            {followers &&
              followers.map((follower, index) => (
                <div key={index} style={styles.userDiv}>
                  <Link
                    to={`/profile/${follower.Follower}`}
                    style={styles.userLink}
                  >
                    <p style={styles.userContent}>{follower.Name}</p>
                  </Link>
                </div>
              ))}
          </section>

          <section style={styles.section}>
            <h2>Following</h2>
            {isFetching && <div>Fetching following...</div>}
            {following &&
              following.map((follow, index) => (
                <div key={index} style={styles.userDiv}>
                  <Link
                    to={`/profile/${follow.Followee}`}
                    style={styles.userLink}
                  >
                    <p style={styles.userContent}>{follow.Name}</p>
                  </Link>
                </div>
              ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;

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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    maxWidth: "1200px",
  },
  section: {
    flex: "1",
    margin: "10px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  userDiv: {
    margin: "10px 0",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  },
  userContent: {
    margin: "0",
    color: "#333",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  userLink: {
    textDecoration: "none",
    color: "#007BFF",
  },
};
