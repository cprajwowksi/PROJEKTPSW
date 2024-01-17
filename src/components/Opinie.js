import axios from "axios";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useUserContext} from "./UserProvider";

function Opinie({food, setClicked}) {
    const [opinie, setOpinie] = useState(null)
    const [opinia, setOpinia] = useState("")
    const [editClicked, setEditClicked] = useState(false)
    const [edit, setEdit] = useState("")
    const [cookies, setCookie, removeCookie ] = useCookies(['user'])
    const { user } = useUserContext();

    const getOpinie =  async () => {
        try {
            const response = await axios.get(`http://localhost:8000/opinie`, {
                params: { foodId: food._id }
            })
            await setOpinie(response.data)
        } catch(err) {
            console.log(err)
        }
    }
    const handleValue = (e) => {
        setOpinia(e.target.value)
    }

    const handleEditChange = (e) => {
        setEdit(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedOpinia = {
            opinia: opinia,
            date: new Date().toISOString(),
            user: user,
            foodId: food._id
        }
        const postOpinia =  async () => {
            try {
                const response = await axios.post(`http://localhost:8000/opinia`, {
                    params: { formattedOpinia }
                })

            } catch(err) {
                console.log(err)
            }
        }

        await postOpinia()
        await getOpinie()

    }
    useEffect(() => {
        getOpinie()
    }, [food]);


    const deletePost = async (opinia) => {
        console.log(opinia)
        const formattedOpinia = {
            opinia: opinia.opinia,
            date:   opinia.date,
            user: opinia.user,
            foodId: food._id
        }
        console.log("for", formattedOpinia)
        try {
            await axios.delete(`http://localhost:8000/opinia`, {
                data: { formattedOpinia }
            })
        } catch(err) {
            console.log(err)
        }
    }

    const editPost = async (opinia,edit) => {
        console.log(opinia)

        const formattedOpinia = {
            opinia: opinia.opinia,
            date:   opinia.date,
            user: opinia.user,
            foodId: food._id
        }

        const drugaOpinia = {
            opinia: edit,
            date:   opinia.date,
            user: opinia.user,
            foodId: food._id
        }
        console.log("for", formattedOpinia)
        try {
            await axios.put(`http://localhost:8000/opinia`, {
                data: { formattedOpinia, drugaOpinia }
            })
        } catch(err) {
            console.log(err)
        }
    }

    return (
        opinie ? (
            <div className="opinie-component">
                <i className="fa-solid fa-xmark" onClick={() => setClicked(null)}></i>
                <h2>{food.name}</h2>
                {opinie.map((opinia, index) => (
                    <div key={index}>
                        <h4>{opinia.user.first_name}</h4> {opinia.opinia}

                        <footer>
                            {opinia.date}
                            <i className="fa-solid fa-trash delete-opinia" onClick={() => deletePost(opinia)}></i>
                            <i className="fa-solid fa-pen-to-square" onClick={() => setEditClicked(!editClicked)}> </i>
                            { editClicked ? <>
                                <input type="text" value={edit} onChange={handleEditChange}/>
                                <i className="fa-solid fa-check" onClick={() => editPost(opinia, edit)}></i>
                            </> : null}

                        </footer></div>
                ))}
                <h3>Dodaj nową opinię</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={opinia} onChange={handleValue}/>
                    <button type="submit">SKOMENTUJ</button>
                </form>
            </div>
        ) : (
            <i className="fa-solid fa-rotate-right"></i>
        )
    );

}

export default Opinie;
