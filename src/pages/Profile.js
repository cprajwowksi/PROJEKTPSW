import {useEffect, useState} from 'react'
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useCookies } from "react-cookie";
import axios from 'axios'
import {useUserContext} from "../components/UserProvider";
import { useNavigate} from "react-router-dom";

const Profile = () => {

    const navigate = useNavigate()
    const [ cookie, setCookie, removeCookie ] = useCookies(['user'])
    const logout = () => {
        removeCookie('UserId', cookie.UserId)
        removeCookie('AuthToken', cookie.AuthToken)
        navigate('/')
        window.location.reload()
    }

    const { user } = useUserContext()
    const deleteUser = async () => {
        try{
            const response = await axios.delete('http://localhost:8000/user', {params: { userId: user.user_id } })

            const success = response.status === 200
            logout()
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        console.log(user)
    }, [user]);

    const initialValues = user
        ? {
            user_id: cookie.UserId,
            first_name: user.first_name,
            dob_day: user.dob_day,
            dob_month: user.dob_month,
            dob_year: user.dob_year,
            gender_identity: user.gender_identity,
            ulica: user.adres.ulica,
            miasto: user.adres.miasto,
            numer: user.adres.numer
        }
        : {
            user_id: '',
            first_name: '',
            dob_day: '',
            dob_month: '',
            dob_year: '',
            gender_identity: '',
            ulica: '',
            miasto: '',
            numer: ''
        };

    const validation = Yup.object({
        first_name: Yup.string().required('Required'),
        dob_day:  Yup.number().required('Day Required').max(31, 'DAY MAX 31'),
        dob_month: Yup.number().required('Month Required').max(12, 'MONTH MAX 12'),
        dob_year: Yup.number().required('Year Required').max(2005, 'MIN 18 LAT'),
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validation,
        onSubmit: async (values) => {
            console.log('submitted')
            console.log(values)
            window.location.reload()
            try{
                const response = await axios.patch('/user', { values })
                const success = response.status === 200
            } catch (err) {
                console.log(err)
            }
        }
    })

    return (
        <>
            <Nav/>
            <div className="onboarding">
                <h2>EDYTUJ KONTO</h2>
                <form onSubmit={formik.handleSubmit}>
                    <section>
                        <label htmlFor="first_name">Imie</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            {...formik.getFieldProps('first_name')}

                        />

                        {formik.touched.first_name && formik.errors.first_name ? (<div>{formik.errors.first_name}</div>) : null}
                        <label>Data urodzenia</label>

                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                {...formik.getFieldProps('dob_day')}
                            />

                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                {...formik.getFieldProps('dob_month')}
                            />

                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                {...formik.getFieldProps('dob_year')}
                            />
                            <div className="dob-errors">
                                {formik.touched.dob_day && formik.errors.dob_day ? (<div>{formik.errors.dob_day}</div>) : null}
                                {formik.touched.dob_month && formik.errors.dob_month ? (<div>{formik.errors.dob_month}</div>) : null}
                                {formik.touched.dob_year && formik.errors.dob_year ? (<div>{formik.errors.dob_year}</div>) : null}
                            </div>

                        </div>
                        <label>Płeć</label>

                        <div className="multiple-input-container">

                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={formik.handleChange}
                                checked={formik.values.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Mężczyzna</label>

                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={formik.handleChange}
                                checked={formik.values.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Kobieta</label>

                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={formik.handleChange}
                                checked={formik.values.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">Inne</label>

                        </div>
                        <label htmlFor="adres">Adres</label>
                        <div className="multiple-input-container">
                            <input
                                id="ulica"
                                type="text"
                                name="ulica"
                                placeholder="ul."
                                {...formik.getFieldProps('ulica')}
                            />

                            <input
                                id="miasto"
                                type="text"
                                name="miasto"
                                placeholder="Miasto"
                                {...formik.getFieldProps('miasto')}
                            />

                            <input
                                id="numer_domu"
                                type="number"
                                name="numer_domu"
                                placeholder="Numer-Domu"
                                {...formik.getFieldProps('numer')}
                            />

                        </div>
                        <input type='submit'/>

                    </section>


                </form>
            </div>
            {user && <div className="ramen-list"><button onClick={() => deleteUser()}>USUN KONTO</button></div>}
            <Footer/>

        </>
    )
}

export default Profile