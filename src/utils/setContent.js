import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Spinner from '../components/spinner/Spinner';
import Skeleton from '../components/skeleton/Skeleton'

const setContent = (process, Component, data) => {
    switch(process) {
        case 'waiting':
            return <Skeleton/>
            break
        case 'error':
            return <ErrorMessage/>
            break
        case 'loading':
            return <Spinner/>
            break
        case 'confirmed':
            return <Component data={data}/>
            break
        default:
            throw new Error('Unexpected result')
    }
}

export default setContent;