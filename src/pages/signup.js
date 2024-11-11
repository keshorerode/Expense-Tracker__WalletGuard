import React from 'react';
import Header from '../components/Header';
import SignupsigninComponent from '../components/SignupSignin';

function Signup() {
    return <div>
        <Header />
        <div className='wrapper'>
            <SignupsigninComponent />
        </div>
    </div>
    
}

export default Signup;
