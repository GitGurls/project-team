import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(!name || !email || !password){
      alert("All fields required");
      return;
    }

    try{

      setLoading(true);

      const res = await API.post("/auth/register",{
        name,
        email,
        password
      });

      console.log(res.data);

      alert("User Registered Successfully");

      navigate("/");

    }catch(err){

      console.log(err.response?.data);

      alert(err.response?.data?.message || "Register Failed");

    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded w-80"
      >

        <h2 className="text-2xl mb-4 font-bold">
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-3"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="bg-green-500 text-white w-full p-2"
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

    </div>
  )
}