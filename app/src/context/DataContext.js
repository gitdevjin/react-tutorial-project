import { createContext, useState, useEffect } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { width } = useWindowSize();
    const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

    useEffect(() => {
        setPosts(data);
    }, [data]);


    useEffect(() => {
        const filteredResults = posts.filter(post => ((post.body).toLocaleLowerCase()).includes(search.toLowerCase())
            || ((post.title).toLocaleLowerCase()).includes(search.toLowerCase()));

        setSearchResults(filteredResults.reverse());

    }, [posts, search])



    return (
        <DataContext.Provider value={{
            width, search, setSearch, searchResults,
            fetchError, isLoading, setPosts,
            posts
        }}>

            {children}
        </DataContext.Provider>
    )
};

export default DataContext;