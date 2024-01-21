import axios from 'axios';
import {useEffect, useState , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import mqtt from "mqtt";

const AuthModal = ({ setSignUpClicked }) => {
    const [cookie, setCookie] = useCookies(['user']);
    const [isSignUp, setIsSignUp] = useState(false)

    const navigate = useNavigate();

    const handleClick = () => {
        setSignUpClicked(false)
    };

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required').min(3, 'Password needs to be longer than 3 letters'),
        confirmPassword: isSignUp
            ? Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required')
            : Yup.string(),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {

                const response = await axios.post(`http://localhost:8000/${isSignUp ? 'signup' : 'login'}`, {
                    email: values.email,
                    password: values.password,
                });

                const success = response.status === 201;

                setCookie('Email', response.data.email);
                setCookie('UserId', response.data.userId);
                setCookie('AuthToken', response.data.token);

                if (success && isSignUp) navigate('/onboarding');

                const client = mqtt.connect("ws://localhost:9000/mqtt");

                const userId = response.data.userId;

                const jsonData = JSON.stringify({ userId });
                console.log('logujemy logujemy')
                client.on("connect", async () => {
                     await client.publishAsync("login", jsonData);
                     window.location.reload();
                })
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <div className="auth-modal">
            <div className="closeIcon" onClick={handleClick}>
                &#10006;
            </div>
            <h2>{isSignUp ? 'Zarejestruj się' : 'Zaloguj się'}</h2>
            <p>
                Klikając Zaloguj się, zgadzasz się na nasze warunki. Dowiedz się, jak przetwarzamy Twoje dane w naszej Polityce prywatności i Polityce plików cookie.
            </p>
            <form onSubmit={formik.handleSubmit}>
                <input type="email" id="email" name="email" placeholder="email" {...formik.getFieldProps('email')} />
                {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}

                <input type="password" id="password" name="password" placeholder="password" {...formik.getFieldProps('password')} />
                {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}

                {isSignUp && (
                    <>
                        <input type="password" id="password_check" name="password_check" placeholder="confirm-password" {...formik.getFieldProps('confirmPassword')} />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div>{formik.errors.confirmPassword}</div> : null}
                    </>
                )}

                <input className="auth-modal-button" type="submit" />
            </form>
            <hr />
            <div className="footer">
                <div>{!isSignUp ? <p>Nie masz konta?</p> : <p>Masz konto?</p>}</div>
                <button className="auth-modal-second-button" onClick={() => setIsSignUp(!isSignUp)}> {!isSignUp ? <>Zarejestruj się</> : <>Zaloguj się</>}</button>
            </div>
        </div>
    );
};

export default AuthModal;
