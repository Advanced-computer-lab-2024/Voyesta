import { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

function TourismGovernorAccount(props){
  const [places, setPlaces] = useState([]);

    const getplaces = () => {
        fetch("http://localhost:3000/tourismgovernor/get")
        .then(res => {
            if(res.ok){
                return res.json();
            }
            throw new error();
        })
        .then()
        }

    // handle delete pressed
    const handleDelete = (e) =>{
      const parent = e.target.parentNode.parentNode.parentNode;
      
      const url = props.baseUrl +"/delete";
      axios.delete(url,{
          data:{
              Id: parent.id
          }
      })
      .then(res => {
          console.log(res.data);
          fetchItems();
      })
      .catch(err => console.log(err));
  }

}

export default TourismGovernorAccount;