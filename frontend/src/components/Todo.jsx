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

const addTodo = async (name) => {
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

const deleteTodo = async (id) => {
  const res = await fetch(`http://localhost:3001/todos/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
}

const updateTodo = async (todo) => {
  const res = await fetch(`http://localhost:3001/todos/${todo.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
};

const Todo = () => {
  const [name, setName] = useState('')
  const queryClient = useQueryClient();

  const { isLoading, isError,  data: todos, error } = useQuery(['todos'], fetchTodos);
  const addMutation = useMutation(addTodo, {
    // リクエスト前に実行
    onMutate: async (todo) => {
      await queryClient.cancelQueries(['todos']);
  
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos']);
  
      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], (old) => [...old, todo]);
  
      // Return a context object with the snapshotted value
      return { previousTodos };
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
    onError: (err, todo, context) => {
      // 失敗した場合は更新前の情報でキャッシュを更新する
      queryClient.setQueryData(['todos'], context.previousTodos);
    },
    // 正否に関わらず実行
    onSettled: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const deleteMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const updateMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMutation.mutate({ name, isCompleted: false }, { id: 1 })
  };

  const handleRemoveTodo = (id) => {
    deleteMutation.mutate(id);
  };

  const handleCheckChange = (todo) => {
    updateMutation.mutate(todo);
  };

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
          <li key={todo.id}
            style={
              todo.isCompleted === true
                ? { textDecorationLine: 'line-through' }
                : {}
            }
          >
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() =>
                handleCheckChange({ ...todo, isCompleted: !todo.isCompleted })
              }
            />
            {todo.name}
            <button
              style={{ marginLeft: '0.2em', cursor: 'pointer' }}
              onClick={() => handleRemoveTodo(todo.id)}
            >
              X
            </button>
            </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;