import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const {showAlert} = props;
    const [credentials,setCredentials] = useState({email:"", password:""})
    let navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
              },
              body: JSON.stringify({email: credentials.email,password: credentials.password})
          });
          const json = await response.json();
          console.log(json)
          if(json.success){
             //save the auth token and redirect
             localStorage.setItem('token',json.authToken);
             navigate('/')
             showAlert("Logged in Successfully :)","success")
          }
          else{
            showAlert("Invalid Credentials","danger")
          }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
  return (
    <div className='mt-2'>
      <h2>Login to use iNoteBook</h2>
     <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input onChange={onChange} type="email" className="form-control" value={credentials.email} id="email" name='email' aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input onChange={onChange} type="password" className="form-control" value={credentials.password} id="password" name='password'/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Login
