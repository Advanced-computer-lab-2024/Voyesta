import { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

function AdminListView(props){

    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState({});
    const [adding, setAdding] = useState(false);
    const [newActivity, setNewActivity] = useState("");

    //fetch activity categories
    const fetchItems = () =>{
        const url = props.baseUrl +"/get"+props.target;
        axios.get(url)
        .then(res => {
            // console.log(res.data);
            setItems(res.data);
        })
        .catch(err => console.log(err));
    }

    // handle delete pressed
    const handleDelete = (e) =>{
        const parent = e.target.parentNode.parentNode.parentNode;
        
        const url = props.baseUrl +"/delete"+props.target;
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

    //handle edit icon pressed
    const handleEditIcon = (e, item) => {
        setEditing({ [item._id]: true });
      }

    //handle edit pressed
    const handleEditSubmit = (e, item) =>   {
        e.preventDefault();
        const newName = e.target.elements[0].value;
        const url = props.baseUrl +"/update"+props.target;
        axios.put(url,{

                Id: item._id,
                Name: newName

        })
        .then(res => {
            console.log(res.data);
            setEditing({});
            fetchItems();
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
      const url = props.baseUrl +"/add"+props.target;
      axios.post(url, {
          Name: newActivity
      })
        .then(res => {
          console.log(res.data);
          setNewActivity("");
          setAdding(false);
          fetchItems();
        })
        .catch(err => console.log(err));
    }


    useEffect( () =>{
        fetchItems()
    },[props.title]);


    return(
      <>
        <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">{props.title}</h1>
          <ul className="text-center">
          
            {items.map(item => (
              <li key={item._id} id={item._id} className="border-b border-gray-200 last:border-0 p-2">
                  {editing[item._id] ? (
                    <div >
                      <form
                        className="flex justify-between text-lg font-medium text-gray-300"
                        onSubmit={(e) => handleEditSubmit(e, item)}
                      >
                        <input
                          type="text"
                          defaultValue={item.Name}
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
                        <span>{item.Name}</span>
                        <div className="flex gap-2">
                            <img onClick={handleDelete} src={assets.deleteIcon} className="w-6 h-6 cursor-pointer" />
                            <img onClick={(e) => handleEditIcon(e, item)} src={assets.editIcon} className="w-6 h-6 cursor-pointer" />
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

export default AdminListView;