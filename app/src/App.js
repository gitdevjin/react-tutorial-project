import Layout from './Layout';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';
import { Route, Routes } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

function App() {

  return (
    <DataProvider>
      <Routes>

        <Route path="/" element={<Layout />}> {/*Since Layout is a parent of routes below it should contain <Outlet />*/}

          {/***************  Only one of them will be applied   ******************/}
          <Route index element={<Home />} />
          <Route path="post">
            <Route index element={<NewPost />} />
            <Route path=":id" element={<PostPage />} />
          </Route>
          <Route path="edit/:id" element={<EditPost />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Missing />} />
          {/***************  ********************************   ******************/}

        </Route>
      </Routes>
    </DataProvider >
  );
}

export default App;
