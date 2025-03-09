import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state,setState]=useState("Login");
  const [formData,setFormData]=useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})

  }

  const login=async()=>{
    let responseData;
    await fetch('https://ecommercestore-backend.onrender.com/login',{
      method:'POST',
      headers:{
        'Accept':'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    }).then((response)=>response.json()).then((data)=>{responseData=data})

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace('/');
    }
    else{
      alert(responseData.error);
    }
    

  }

  const signup=async()=>{
    console.log("Sign Up Function Executed",formData);
    let responseData;
    await fetch('https://ecommercestore-backend.onrender.com/signup',{
      method:'POST',
      headers:{
        'Accept':'application/form-data',
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    }).then((response)=>response.json()).then((data)=>{responseData=data})

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace('/');
    }
    else{
      alert(responseData.error);
    }
    
  }




  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up" ? <input type="text" name='username' value={formData.username} onChange={changeHandler} placeholder='Your Name' /> :<></>}
          <input type="email" name='email' value={formData.email} onChange={changeHandler}  placeholder='Your Email' />
          <input type="password" name='password' value={formData.password} onChange={changeHandler}  placeholder='Your Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up"?<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>:<p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By Continuing,i agree to the terms of use & privacy policy</p>
        </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
