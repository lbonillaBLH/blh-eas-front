import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const AuthGoogleButton = ({onSuccess, onError})=>{
    return <>
        <GoogleOAuthProvider clientId="228405537736-afdhngllh1r7i25g5401rq127dj2lrdn.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                width={300}
                shape="pill"
                theme="filled_blue"
            />
        </GoogleOAuthProvider>
    </>
}

export default AuthGoogleButton;