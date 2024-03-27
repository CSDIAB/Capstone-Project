import {
  Link
} from "react-router-dom"

const Businesses = ({ businesses })=> {
  console.log(businesses)
  return (
    <>
    <h1>Placeholder for Businesses { businesses.length }</h1>
    {
     businesses.map(business => <Link to = {`/businesses/${business.id}`}>{business.name}</Link>)   
    }
    </>
  );
}


export default Businesses;
