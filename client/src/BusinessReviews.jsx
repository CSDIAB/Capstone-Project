import {
    useState, useEffect
} from 'react'

import {
    useParams
} from 'react-router-dom'

const BusineessReview = ({businesses, auth, deleteReview})=> {
    const {id} = useParams()
    console.log(id);
    const [reviews, setReviews] = useState([]);
    useEffect(()=> {
        fetch(`/api/reviews/${id}`).then(res => res.json()).then(json => {console.log(json);setReviews(json)}).catch(ex => console.log(ex))
    }, [])
    console.log(reviews)
    console.log(auth)
    return <div> 
    {
    reviews.map(review => <p>{review.comment}
    <span style = {{display:'inline-block', marginLeft: '10px'}}>{review.rating}</span>
    <span style = {{display:'inline-block', marginLeft: '10px'}}>{review.name}</span>
    {review.user_id === auth.id && <button onClick = {()=> deleteReview(review.id, auth.id)}>DELETE</button>}</p>)
    }
    </div>
}



// add delete code here and in userReviews
// you will need a route, delete for method 
// on the front end you will need logic to allow only that user to delete their reviews

export default BusineessReview;