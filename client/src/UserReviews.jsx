import {
    useState, useEffect
} from 'react'

import {
    useParams
} from 'react-router-dom'

const UserReviews = ({users, auth, deleteReview})=> {
    const {id} = useParams()
    console.log(id);
    const [reviews, setReviews] = useState([]);
    useEffect(()=> {
        fetch(`/api/reviews/user/${id}`).then(res => res.json()).then(json => {console.log(json);setReviews(json)}).catch(ex => console.log(ex))
    }, [])
    console.log(auth)
    console.log(reviews)
    return  <div>
        {
        reviews.map(review => <p>{review.comment}
        
        <span style = {{display:'inline-block', marginLeft: '10px'}}>{review.rating}</span>
        <span style = {{display:'inline-block', marginLeft: '10px'}}>{review.name}</span>
    {review.user_id == auth.id && <button onClick = {()=> deleteReview(review.id, auth.id)}>DELETE</button>}</p>)
    }
          
        
        
    </div>
    
}

export default UserReviews;