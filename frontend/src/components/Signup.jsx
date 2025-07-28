import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthProvider.jsx';
import { Link , useNavigate} from 'react-router-dom';

export default function Signup() {
  
 
   const [username, setUsername] = useState("");
    const [PHnumber, setPHnumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
  const {user, signup, error} =useContext(AuthContext);
  const navigate = useNavigate();

function handleSignup(e) {
  e.preventDefault();
     console.log("sent from signup.jsx ");
  signup({ username, PHnumber, email, password, city, country });

};
 
useEffect(()=>{
    if(user){
      navigate('/dashboard/otp')
    }
  },[user, navigate])
  
  return (
    <form onSubmit={handleSignup}>
      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Phone Number
        <input
          type="tel"
          value={PHnumber}
          onChange={(e) => setPHnumber(e.target.value)}
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        City
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label>
        Country
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit">Sign Up</button>
      <Link to="/" className="link">
        Already have an account? Login
      </Link>
    </form>
  );
}

