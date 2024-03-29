import React from "react";
import { useQuery } from "./hooks/useQuery";

type Todo = {
  userId: number;
  id: 1;
  title: string;
  completed: boolean;
};

function App() {
  const [id, setId] = React.useState<number>(1);
  const { data, error, loading } = useQuery<Todo>(
    'https://jsonplaceholder.typicode.com/posts/' + id, {}, 150)
  

  console.log(data)

  return (
    <>
      {error && <div>{error.toString()}</div>}
      {data && data.title}
      {loading && <div>Loading...</div>}
      <button onClick={() => setId((prev) => prev + 1)}>{id}</button>
    </>
  );
}

export default App;
