import { gql, useSubscription } from "@apollo/client";
import styled from "styled-components";

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    roomUpdates(id: 8) {
      payload
    }
  }
`;
const Chats = () => {
  const { loading, error, data } = useSubscription(MESSAGE_SUBSCRIPTION);
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error</p>;

  console.log(data);

  return <div>Chats</div>;
};
export default Chats;
