import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser, setError } from '../store/userslice';

const AuthForm = () => {
  const [memberstate, setMemberState] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' ,name:'',number:'',address:''});
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const url = `https://ordereasebackend.vercel.app/auth/${memberstate ? 'signup' : 'login'}`;
    try {
      const response = await axios.post(url, {
        email: credentials.email,
        password: credentials.password,
        role: role,
        name:credentials.name,
        number:credentials.number,
        address:credentials.address
      });

      const { token } = response.data; 
      // console.log("responsedatais",token);
      if (token) {
        localStorage.setItem('token', token);
        dispatch(setUser({ userId: token, userInfo: { email: credentials.email, role: role,name:credentials.name,number:credentials.number, address:credentials.address } }));
        if(role==='customer'){
          navigate("/menu");}
          else{
            navigate("/admin");
          }
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-8">
  <div className="bg-white p-4 sm:p-8 rounded-xl shadow-xl max-w-md w-full space-y-6 transform transition-all duration-500 hover:scale-105">
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold text-center text-gray-800">{memberstate ? 'Sign Up' : 'Login'}</h2>
      <div className="space-y-4">
        {memberstate && (
          <>
            <input
              type="text"
              name="name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              value={credentials.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
              value={credentials.number}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Address"
              value={credentials.address}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        {memberstate && (
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="confirmPassword"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm Password"
              value={credentials.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="relative">
          <label htmlFor="role" className="block text-gray-700">
            Select your role:
          </label>
          <select
            id="role"
            name="role"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={handleRoleChange}
            required
          >
            <option value="customer">Customer</option>
            <option value="restaurantManager">Restaurant Manager</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        {memberstate ? 'Sign Up' : 'Login'}
      </button>
      <div className="text-center">
        {!memberstate ? (
          <button
            type="button"
            className="mt-4 text-blue-500 hover:underline"
            onClick={() => {
              setMemberState(!memberstate);
              setCredentials({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                number: '',
                address: '',
              });
            }}
          >
            New to OrderEase? Sign Up
          </button>
        ) : (
          <button
            type="button"
            className="mt-4 text-blue-500 hover:underline"
            onClick={() => {
              setMemberState(!memberstate);
              setCredentials({
                email: '',
                password: '',
                confirmPassword: '',
                name: '',
                number: '',
                address: '',
              });
            }}
          >
            Already have an account? Login
          </button>
        )}
      </div>
    </form>
  </div>
</div>

  );
};

export default AuthForm;
