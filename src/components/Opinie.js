import axios from "axios";
import {useEffect, useState} from "react";

function Opinie({food}) {
    const [opinie, setOpinie] = useState()
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

    useEffect(() => {
        getOpinie()
        console.log(food)
    }, [food]);

    return (
        <div className="opinie">
            {opinie.map((opinia) => {

            })}
        </div>
    );
}

export default Opinie;
