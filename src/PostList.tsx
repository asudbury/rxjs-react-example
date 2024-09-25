import React, { useEffect, useState } from 'react';
import { from, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';

interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

    const fetchPosts$ = from(ajax.getJSON<Post[]>(apiUrl));

    const newSubscription = fetchPosts$.subscribe({
      next: (data) => {
        setPosts(data);
        setError(null); // Clear any previous error
      },
      error: (err) => {
        setError('Failed to load posts');
        console.error(err);
      },
    });

    setSubscription(newSubscription);

    // Cleanup the subscription on unmount
    return () => {
      newSubscription.unsubscribe();
      setSubscription(null); // Clear the subscription from state
    };
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
