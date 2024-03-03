import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelServices from '../../services/MarvelServices';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>
            break
        case 'error':
            return <ErrorMessage/>
            break
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>
            break
        case 'confirmed':
            return <Component/>
            break
        default:
            throw new Error('Unexpected result')
    }
}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [comicsEnded, setComicsEnded] = useState(false)

    const {loading, error, getAllComics, process, setProcess} = useMarvelServices()

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)

        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false
        if (newComicsList.length < 8) {
            ended = true
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList])
        setNewItemLoading(false)
        setOffset(offset => offset + 8)
        setComicsEnded(ended)
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            // let imgStyle = {'objectFit': 'cover'}
            // if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            //     imgStyle = {'objectFit': 'unset'}
            // }

            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}       
            </ul>
        )
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading)}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;