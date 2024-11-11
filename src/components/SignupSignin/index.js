import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, provider } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";




function SignupsigninComponent() {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [LoginForm,setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function signupiwthEmail(){
        setLoading(true);
        console.log("name",name);
        console.log("email",email);
        console.log("password",password);
        console.log("confirmpassword",confirmPassword);
        //Authenticate the User or basically create a new account using email and pass
        if(name!="" && email!="" && password!="" && confirmPassword!=""){
            if(password==confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed up 
              const user = userCredential.user;
              console.log("user>>>", user);
              toast.success("user Created!")
              setLoading(false);
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              createDoc(user);
              navigate("/dashboard");
              // create A doc with user id as the following id
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage)
              setLoading(false);
              // ..
            });  
        }else{
        toast.error("Password and ConfirmPassword does not match each other");
        setLoading(false);

    }}
    else {
            toast.error("All field are Mandatory.");
            setLoading(false);
        }
    
    } 

    function loginUsingEmail(){
        console.log("Email", email);
        console.log("Password", password);
        setLoading(true);

        if( email!="" && password!=""){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast.success("User Loggged In!!")
                console.log("User Logged In", user);
                createDoc(user);
                setLoading(false);
                navigate("dashboard");

                // ...
            })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false);
            toast.error(errorMessage);
         });

        }else{
            toast.error("All fields are Mandatory!!")
            setLoading(false);
        }
    }

    async function createDoc(user){
        //Make sure the Doc with the uid doesn't exist
        //Create a doc.
        setLoading(true);
        if(!user) return;

        const userRef = doc(db, "user", user.uid);
        const userData = await getDoc(userRef);

        if(!userData.exists()) {
            try{
                await setDoc(doc(db, "user", user.uid), {
                    name: user.displayName ? user.displayName: name,
                    email: user.email,
                    photoURL : user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                toast.success("Doc created!!");
                setLoading(false);
            }
            catch(e){
                toast.error(e.message);
                setLoading(false);
            }
        }else{
            toast.error("Doc Alrady exists!");
            setLoading(false);
        }
    }

    function googleAuth() {
        setLoading(true);
        try{
            signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("user>>", user);
    createDoc(user);
    setLoading(false);
    navigate("/dashboard");
    toast.success("user authenticated!!");
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    setLoading(false);
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    // ...
  });
        }catch(e){
            toast.error(e.message);
        }
        
    }


    return (
        <>
        {LoginForm? ( 
        
        <div className="signupwrapper">
        <h2 className="title">LogIn on <span style={ {color:"var(--theme)"}}>WalletGuard.</span></h2>
        <form>
        <Input 
             type="email" 
            lable={"email "} 
            state={email}  
            setState={setEmail}
            placeholder={"KeshoreMurugesan@gmail.com"}
            />

            <Input 
            type="password"
            lable={"password "} 
            state={password}  
            setState={setPassword}
            placeholder={"123"}
            />

        
            <Button 
            disabled={loading}
            text={loading? "Loading....! ":"Login using Email and Password"} 
            onclick={loginUsingEmail}
            />
            <p className="p-login" >  or  </p>
            <Button 
            onclick={googleAuth}
            text={loading? "Loading....!" : "Login using Google"} 
            blue={true}
            />
            <p className="p-login">
                Or Don't Have An Account Already? <span 
                style={{ cursor: "pointer", color: "blue" }}  
                onClick={() => setLoginForm(!LoginForm)}
                >
                    Sign Up
                </span>
            </p>
        </form>
    </div>

        ): 
        (
    
        <div className="signupwrapper">
        <h2 className="title">SignUp On <span style={ {color:"var(--theme)"}}>WalletGuard.</span></h2>
        <form>
            <Input 
            lable={"full Name"} 
            state={name}  
            setState={setName}
            placeholder={"Keshore Murugesan"}
            />

            <Input 
             type="email" 
            lable={"email "} 
            state={email}  
            setState={setEmail}
            placeholder={"KeshoreMurugesan@gmail.com"}
            />

            <Input 
            type="password"
            lable={"password "} 
            state={password}  
            setState={setPassword}
            placeholder={"123"}
            />

            <Input
            type="password" 
            lable={"confrimPassword "} 
            state={confirmPassword}  
            setState={setConfirmPassword}
            placeholder={"123"}
            />

            <Button 
            disabled={loading}
            text={loading? "Loading....! ":"Signup using Email and Password"} 
            onclick={signupiwthEmail}
            />
            <p className="p-login">  or  </p>
            <Button 
            onclick={googleAuth}
            text={loading? "Loading....!" : "Signup using Google"}  
            blue={true}/>
            
            <p className="p-login">
                Or Have An Account Already?  <span 
                style={{ cursor: "pointer", color: "blue" }}  
                onClick={() => setLoginForm(!LoginForm)}
                >
                    Log in
                </span>
            </p>


        </form>
        </div>
        )}
    </>
    );

}

export default SignupsigninComponent;