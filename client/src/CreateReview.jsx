import {
  useState,
  useEffect
} from 'react'



const CreateReview = ({ businesses })=> {
  //three state variables one for comment one for rating and one to select business id
  //need handler functions on all of the endpoints for text area, for rating select and for business select.
  //remember that to get value from a select use ev.target.value 
  //confirm that you are getting value of console.log(e.target.value)
  //store user input in correct state variable
  const [review, setReview] = useState({
    comment: '',
    rating: '',
    businessId:''
  });
 
  const handleInputChange = (ev) => {
    const {name, value} = ev.target;
    setReview(prevReview => ({
      ...prevReview,
      [name]: value
    }));
  }
  const handleSubmit = async(ev) => {
    ev.preventDefault();
    
    console.log(review);
    //get token from local storage
    const token = window.localStorage.getItem('token');
    const headers = {
      'authorization': token,
      'Content-type': 'application/json'
    };
    

    const body = JSON.stringify(review);
    // thats it! :) 
 const result = await fetch('/api/reviews', {
  method: 'POST', headers, body 
 })
  const json = await result.json();
  console.log(json);
    setReview({
      comment:'',
      rating:'',
      businessId:''
    })
    
  }

  return (
    <h1>
      <form onSubmit= {handleSubmit}>
        <div>
          <textarea onChange = {handleInputChange} 
          name = 'comment' 
          htmlFor="comment" 
          placeholder = 'what did you think of this business' rows = '8' cols = '50'/><button>submit</button></div>
        </form>
        <select onChange = {handleInputChange} name="rating" id="rating-select">
          <option value="">--Please choose a rating--</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          
</select>
<select name="businessId" id="business-select" onChange = {handleInputChange}>
          <option value="">--Please choose a business--</option>
         {
        businesses.map( business =>  <option key = {business.id} value = {business.id}>{business.name}</option>)
         }
          
</select>
      
    </h1>
  );
}


export default CreateReview;
