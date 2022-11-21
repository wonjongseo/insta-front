import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo/Photo";
import Loading from "../components/Loading";
import PageTitle from "../components/PageTitle";

export const HOME_PATH = "/*";

export const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ok
      error
      photos {
        id
        user {
          username
          avatar
        }
        file
        caption
        likes
        commentNumber
        comments {
          id
          payload
          isMine
          createdAt
          user {
            username
            avatar
          }
        }
        createdAt
        isMine
        isLiked
      }
    }
  }
`;

const Home = () => {
  const { data, loading } = useQuery(FEED_QUERY);
  return (
    <>
      <PageTitle title={"Home"} />
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div>
            {data?.seeFeed?.photos?.map((photo) => (
              <Photo key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
export default Home;
