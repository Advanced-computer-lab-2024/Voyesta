import { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";

function ActivityCategory(){

    const [activityCategories, setActivityCategories] = useState([]);
    const [editing, setEditing] = useState({});
    const [adding, setAdding] = useState(false);
    const [newActivity, setNewActivity] = useState("");


    //fetch activity categories
    const fetchActivityCategories = () =>{
        axios.get('http://localhost:3000/api/activityCategory/get')
        .then(res => {
            // console.log(res.data);
            setActivityCategories(res.data);
        })
        .catch(err => console.log(err));
    }

    // handle delete pressed
    const handleDelete = (e) =>{
        const parent = e.target.parentNode.parentNode.parentNode;
        console.log(parent.id);
        axios.delete('http://localhost:3000/api/activityCategory/delete',{
            data:{
                Id: parent.id
            }
        })
        .then(res => {
            console.log(res.data);
            fetchActivityCategories();
        })
        .catch(err => console.log(err));
    }

    //handle edit icon pressed
    const handleEditIcon = (e, activityCategory) => {
        setEditing({ [activityCategory._id]: true });
      }

    //handle edit pressed
    const handleEditSubmit = (e, activityCategory) =>   {
        e.preventDefault();
        const newName = e.target.elements[0].value;
        console.log(newName, activityCategory._id);
        axios.put('http://localhost:3000/api/activityCategory/update',{

                Id: activityCategory._id,
                Name: newName

        })
        .then(res => {
            console.log(res.data);
            setEditing({});
            fetchActivityCategories();
        })
        .catch(err => console.log(err));


    }

    // handle add icon pressed
    const handleAddIcon = () =>{
      setAdding(true);
    }

    //handle add  pressed
    const handleAdd = (e) =>{
      e.preventDefault();
      // const Name = e.target.elements[0].value;
      axios.post('http://localhost:3000/api/activityCategory/add', {
          Name: newActivity
      })
        .then(res => {
          console.log(res.data);
          setNewActivity("");
          setAdding(false);
          fetchActivityCategories();
        })
        .catch(err => console.log(err));
    }


    useEffect( () =>{
        fetchActivityCategories()
    },[]);


    return(
      <>
        <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Activity Categories</h1>
          <ul className="text-center">
          
            {activityCategories.map(activityCategory => (
              <li key={activityCategory._id} id={activityCategory._id} className="border-b border-gray-200 last:border-0 p-2">
                  {editing[activityCategory._id] ? (
                    <div >
                      <form
                        className="flex justify-between text-lg font-medium text-gray-300"
                        onSubmit={(e) => handleEditSubmit(e, activityCategory)}
                      >
                        <input
                          type="text"
                          defaultValue={activityCategory.Name}
                          className="bg-transparent border-2 border-solid border-black rounded-lg pl-2"
                          autoFocus={true}
                        />
                        <button type="submit">
                          <img src={assets.submitIcon} className="h-9"/>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="flex justify-between text-lg font-medium text-gray-500">
                        <span>{activityCategory.Name}</span>
                        <div className="flex gap-2">
                            <img onClick={(e) => handleEditIcon(e, activityCategory)} src={assets.editIcon} className="w-6 h-6 cursor-pointer" />
                            <img onClick={handleDelete} src={assets.deleteIcon} className="w-6 h-6 cursor-pointer" />
                        </div>
                    </div>
                  )}

              </li>
            ))}
            
            {adding && (
              <li className="border-b border-gray-200 last:border-0 p-2">
                <form
                  className="flex justify-between text-lg font-medium text-gray-900"
                  onSubmit={handleAdd}
                >
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    className="bg-transparent border-2 border-solid border-black rounded-lg pl-2"
                    autoFocus={true}
                  />
                  <button type="submit">
                    <img src={assets.submitIcon} className="h-9" />
                  </button>
                </form>
              </li>
            )}
              
          </ul>
            <div 
            onClick={handleAddIcon}
            className="absolute cursor-pointer inline bottom-0 right-0 bg-green-400 hover:bg-green-500 translate-x-1/2 translate-y-1/2 p-3 rounded-full">
              <img src={assets.addIcon} className="h-7 "/>
                {/* <button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-700 absolute bottom-0 right-0 transform">

                </button> */}
            </div>
        </div>
      </>
    );
}

export default ActivityCategory;