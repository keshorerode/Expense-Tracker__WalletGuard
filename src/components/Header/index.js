import React, { useEffect } from 'react';
import "./styles.css";
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Firestore, loadBundle } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImg from "../../asset/user.svg";


function Header() {

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    useEffect(()=> {
        if(user){
            navigate("/dashboard");
        }
    }, [user,loading] )

    function logoutFnc(){
        try{
            signOut(auth)
            .then(() => {
                // Sign-out successful.
                toast.success("Logged out successfully!!");
                navigate("/")
              }).catch((error) => {
                toast.success(error.message);
                // An error happened.
              });

        }catch(e){
            toast.error(e.message)
        }
        
    }

    return  <div className='navbar'>
        <p className='logo'>WalletGuard.</p>
        {user &&
        <div style={{display:"flex",alignItems:"center" , gap:"0.75rem"}}>
            <img src={user.photoURL ? user.photoURL : userImg} 
            style={{borderRadius:"50%" ,height :"1.5rem" , width:"1.5rem"}}/>
            <p className='logolink'  onClick={logoutFnc}>Logout</p>
        </div>
        }
        
    </div>
}

export default Header;
