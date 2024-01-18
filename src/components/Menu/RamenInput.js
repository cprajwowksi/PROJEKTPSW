
import * as Yup from 'yup'
import {useCookies} from "react-cookie";
import axios from "axios";
import { useFormik } from 'formik';
function RamenInput({selected}) {

    const [ cookie, setCookie, removeCookie ] = useCookies(['user'])

    const addFood = async (food) => {
        console.log(food)
        try {
            const response = await axios.post('http://localhost:8000/food', { data: food})
            console.log(response)
        } catch {

        }
    }


    const initialValues = {
        first_name: "",
        subscription: "",
        ingredients: "",
        price: 0,
    };

    const validationSchema = Yup.object({
        first_name: Yup.string().required('Required'),
        subscription: Yup.string().required('Required'),
        ingredients: Yup.string().required('Required'),
        price: Yup.number().required('Required').min(0, 'Price must be greater than or equal to 0'),
    });


        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: validationSchema,
            onSubmit: async (values) => {
                const ingredientsArray = values.ingredients.split(',').map((ingredient) => ingredient.trim());
                const formattedValues = {...values, opinie:[],spicy:0,type:"ramen",ingredients: ingredientsArray, vege:false, bestseller:false }


                try {
                    const response = await axios.post('http://localhost:8000/food', {
                        data: { formattedValues }
                    })
                    console.log(values)
                } catch (err) {
                    console.log(err)
                }
            },
        });

        return (
            <div className="ramen-input">
                <h1>Dodaj nowy Ramen</h1>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="first_name">Name</label>
                <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                />
                {formik.touched.first_name && formik.errors.first_name ? (
                    <div>{formik.errors.first_name}</div>
                ) : null}

                <label htmlFor="subscription">Subscription</label>
                <input
                    id="subscription"
                    name="subscription"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subscription}
                />
                {formik.touched.subscription && formik.errors.subscription ? (
                    <div>{formik.errors.subscription}</div>
                ) : null}

                <label htmlFor="ingredients">Ingredients</label>
                <input
                    id="ingredients"
                    type="textarea"
                    name="ingredients"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.ingredients}
                />
                {formik.touched.ingredients && formik.errors.ingredients ? (
                    <div>{formik.errors.ingredients}</div>
                ) : null}

                <label htmlFor="price">Price</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price ? (
                    <div>{formik.errors.price}</div>
                ) : null}

                <button type="submit">Submit</button>
            </form>
            </div>
        );
    }


export default RamenInput;
