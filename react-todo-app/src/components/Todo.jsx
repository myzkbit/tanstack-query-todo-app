import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const fetchTodos = async () => {
  const res = await fetch('http://localhost:3001/todos');
  // 400系や 500系ならres.okはfalse
  if(!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};



const Todo = () => {
  const [name, setName] = useState('')
  const queryClient = useQueryClient();
  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({ id: 1 })
  };

  const addTodo = async () => {
    const res = await fetch('http://localhost:3001/todos/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  };
  
  const { isLoading, isError,  data: todos, error } = useQuery(['todos'], fetchTodos);
  const addMutation = useMutation(addTodo, {
    // リクエスト前に実行
    onMutate: () => {
      console.log('onMutate');
    },
    // 成功時に実行
    onSuccess: (data, variables, context) => {
      console.log('data', data);
      console.log('variables', variables);
      console.log('context', context);
      console.log('onSuccess');
      queryClient.invalidateQueries('todos')
    },
    // エラー時に実行
    onError: (error, variables, context) => {
      console.log('error', error);
      console.log('variables', variables);
      console.log('context', context);
      console.log('onError');
    },
    // 正否に関わらず実行
    onSettled: () => {
      console.log('onSettled');
    },
  });

  if (isLoading) {
    return <span>Loading</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <>
      <h1>Todo一覧</h1>
      <div>
        <form onSubmit={handleSubmit}>
          Add Todo :
          <input
            placeholder="Add New Todo"
            value={name}
            onChange={handleChange}
          />
          <button>追加</button>
        </form>
      </div>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Todo;