import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import ResultsListItem from "./ResultsListItem";
import Spinner from "../Spinner";
import { Blog } from "../../pages/Home";
import { searchPosts } from "../../utils/blogCrudHandlers";
import { setOpen } from "../../redux/features/snackbarSlice";

export const limitAmount = 5;
export type SearchResult = Pick<Blog, "id" | "title" | "content" | "thumbUrl">


const SearchBar = () => {
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[] | []>([]);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [hideList, setHideList] = useState(false);
  const [searchBoxHeight, setSearchBoxHeight] = useState(0);

  // Calcular el height del search box.
  useEffect(() => {
    if (searchBoxRef.current) {
      const height = (searchBoxRef.current as HTMLDivElement).clientHeight;
      setSearchBoxHeight(height);
    }
  }, [searchBoxRef]);

  
  // Iniciar la búsqueda por término
  // si deja de tipear durante 500ms
  // cancelando la búsqueda anterior.
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    if (term) {
      setNoResults(false);
      setTerm(term);
      setSearching(true);
      setHideList(false);
      
      timerRef.current = setTimeout(() => {
        searchPosts({term, category: null, limitAmount})
        .then(({results}) => {
          const length = results.length;

          if(length <= 0) {
            setNoResults(true);
          } else {
            setResults(results);
          };
        })
        .catch((err: Error) => {
          dispatch(setOpen({open: true, message: err.message}));
          setResults([]);
        })
        .finally(() => {
          setSearching(false);
        });
        
      }, 500);
    };

    return () => {
      setNoResults(false);
      setResults([]);
    };

  }, [term, timerRef]);


  /**
   * Navegar a la página de resultados si presiona la tecla Enter.
   */
  const onSubmitHandler = (e: KeyboardEvent) => {
    const key = e.key;
    if(term && key.toLowerCase() === "enter") {
      setHideList(true);
      navigate(`/blog/search?term=${term}`);
    }
  };


  /**
   * Restablecer el state del componente
   */
  const resetState = () => {
    setTerm("");
    setResults([]);
    setSearching(false);
    setNoResults(false);
    setHideList(false);
  };


  return (
    <Box
      ref={searchBoxRef}
      className="navbar__searchbar"
      component="div"
    >
      <TextField
        className="navbar__searchbar__textfield"
        placeholder="Search post..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={onSubmitHandler}
        InputProps={{
          endAdornment: (
            <FaTimes
              style={{
                opacity: term ? 1 : 0.50,
                cursor: term ? "pointer" : "default",
              }}
              className="navbar__searchbar__icon"
              onClick={() => {
                if(!term) return;
                resetState();
              }}
            />
          )
        }}
      />
        {(searching || noResults || results.length > 0) && term && !hideList &&
          <Box
            style={{top: `calc(${searchBoxHeight}px - 3px)`}}
            className="navbar__searchbar__results custom-scrollbar"
          >
            {searching &&
              <Spinner
                spinnerWidth="1rem"
                spinnerHeight="1rem"
                containerHeight="100%"
                spinnerColor="black"
              />
            }

            {noResults &&
              <Typography
                style={{
                  marginTop: "var(--spacing)",
                  textAlign: "center",
                  fontWeight: 700,
                  color: "black"
                }}
                variant="body1"
              >
                No results found...
              </Typography>
            }

            {results.length > 0 &&
              <Box className="navbar__searchbar__results__list">
                {results.map((post) => (
                  <ResultsListItem
                    key={post.id}
                    post={post}
                    setHideListOnClick={setHideList}
                  />
                ))}
              </Box>
            }
          </Box>
        }
    </Box>
  )
};

export default SearchBar;