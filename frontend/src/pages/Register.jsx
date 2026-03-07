// import { useState } from "react";
// import API from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Register() {

//   const navigate = useNavigate();

//   const [name,setName] = useState("");
//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");
//   const [loading,setLoading] = useState(false);

//   const handleSubmit = async (e)=>{
//     e.preventDefault();

//     if(!name || !email || !password){
//       alert("All fields required");
//       return;
//     }

//     try{

//       setLoading(true);

//       const res = await API.post("/auth/register",{
//         name,
//         email,
//         password
//       });

//       console.log(res.data);

//       alert("User Registered Successfully");

//       navigate("/");

//     }catch(err){

//       console.log(err.response?.data);

//       alert(err.response?.data?.message || "Register Failed");

//     }finally{
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex justify-center items-center h-screen">

//       <form
//         onSubmit={handleSubmit}
//         className="border p-6 rounded w-80"
//       >

//         <h2 className="text-2xl mb-4 font-bold">
//           Register
//         </h2>

//         <input
//           type="text"
//           placeholder="Name"
//           className="border p-2 w-full mb-3"
//           value={name}
//           onChange={(e)=>setName(e.target.value)}
//         />

//         <input
//           type="email"
//           placeholder="Email"
//           className="border p-2 w-full mb-3"
//           value={email}
//           onChange={(e)=>setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-3"
//           value={password}
//           onChange={(e)=>setPassword(e.target.value)}
//         />

//         <button
//           className="bg-green-500 text-white w-full p-2"
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//       </form>

//     </div>
//   )
// }

import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { alert("All fields required"); return; }
    try {
      setLoading(true);
      const res = await API.post("/auth/register", { name, email, password });
      console.log(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["#e5e7eb", "#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = ["", "Weak", "Good", "Strong"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tf-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .tf-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.38) !important; }
        .tf-link:hover { color: #6366f1; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#f5f6fa",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", padding: 20,
      }}>
        <div style={{ position: "fixed", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{
          background: "#fff", borderRadius: 20, padding: "40px 36px",
          width: "100%", maxWidth: 400,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
            }}>⚡</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: "#111827" }}>TaskFlow</span>
          </div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Create account</h2>
          <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>Start managing your tasks like a pro</p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Full Name</label>
              <input
                className="tf-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
                  background: "#fafafa", outline: "none", transition: "all 0.2s",
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Email</label>
              <input
                className="tf-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
                  background: "#fafafa", outline: "none", transition: "all 0.2s",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="tf-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "11px 40px 11px 14px", borderRadius: 10,
                    border: "1px solid #e5e7eb", fontSize: 14, color: "#111827",
                    background: "#fafafa", outline: "none", transition: "all 0.2s",
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#9ca3af",
                }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 4,
                      background: i <= strength ? strengthColors[strength] : "#e5e7eb",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, color: strengthColors[strength], fontWeight: 600 }}>{strengthLabels[strength]}</p>
              </div>
            )}
            {password.length === 0 && <div style={{ marginBottom: 24 }} />}

            <button
              className="tf-btn"
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: loading ? "#c7d2fe" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 14px rgba(99,102,241,0.28)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#9ca3af" }}>
            Already have an account?{" "}
            <a href="/" className="tf-link" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none", transition: "color 0.15s" }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
}