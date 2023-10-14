import {useParams} from "react-router-dom";

const ListingDetail = () => {
  const {id} = useParams<{ id: string }>()
  return (
    <p className={"text-center my-64 text-xl text-blue-500"}><span className={"text-orange-500"}>"id"</span>:"{id}"</p>
  );
};


export default ListingDetail