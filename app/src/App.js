import Layout from './Layout';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns'
import api from './api/posts'

function App() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          // response status is not 200
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);
        }
      }
    }

    fetchPosts();
  }, [])


  useEffect(() => {
    const filteredResults = posts.filter(post => ((post.body).toLocaleLowerCase()).includes(search.toLowerCase())
      || ((post.title).toLocaleLowerCase()).includes(search.toLowerCase()));

    setSearchResults(filteredResults.reverse());

  }, [posts, search])

  const handleSubmit = async (element) => {
    element.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const dateTime = format(new Date(), `MMMM dd, yyyy pp`);
    const newPost = { id, title: postTitle, dateTime, body: postBody };
    try {
      console.log(newPost.id);
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleEdit = async (id) => {
    const dateTime = format(new Date(), `MMMM dd, yyyy pp`);
    const updatedPost = { id, title: editTitle, dateTime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      console.log("twice called?")
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsLists = posts.filter(post => post.id !== id);
      setPosts(postsLists);
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Layout search={search} setSearch={setSearch} />}>

        {/***************  Only one of them will be applied   ******************/}
        <Route index element={<Home posts={searchResults} />} />
        <Route path="post">
          <Route index
            element={
              <NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
              />}
          />
          <Route path=":id" element={<PostPage posts={posts} handleDelete={handleDelete} />} />
        </Route>
        <Route path="edit/:id"
          element={
            <EditPost
              posts={posts}
              handleEdit={handleEdit}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editBody={editBody}
              setEditBody={setEditBody}
            />}
        />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
        {/***************  ********************************   ******************/}

      </Route>
    </Routes>
  );
}

export default App;
