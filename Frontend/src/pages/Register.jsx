const Register = () => {
  //   const navigate = useNavigate();
  //   const [user, setUser] = useState({
  //     name: "",
  //     email: "",
  //     phoneNumber: "",
  //     password: "",
  //   });

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setUser({
  //       ...user,
  //       [name]: value,
  //     });
  //     console.log(user);
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const res = await axios.post(
  //         "https://driveaway.onrender.com/api/v1/user/register",
  //         user,
  //         {
  //           withCredentials: true,
  //         }
  //       );

  //       console.log(res.data);

  //       if (res.data.success) {
  //         setUser(res.data.user);
  //         alert(res.data.message);
  //         setUser({ name: "", email: "", phoneNumber: "", password: "" });
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       console.error("User registration failed", error);
  //     }
  //   };

  return (
    <section className="mt-8 md:mt-6 lg:mt-20 flex justify-center items-center">
      <div className="relative w-10/12 sm:w-3/4 md:w-2/5 lg:w-1/4 border-2 pt-2 md:p-4 bg-white shadow-xl rounded-lg overflow-hidden">
        <h1 className="text-center mt-3 text-2xl font-bold text-[#92487A]">
          Register
        </h1>

        <form className="p-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Name</label>
            <input
              //   onChange={handleChange}
              className="border p-2 rounded-lg bg-white"
              type="text"
              placeholder="Enter your name"
              name="name"
              //   value={user.name}
            />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              //   onChange={handleChange}
              className="border p-2 rounded-lg bg-white"
              type="email"
              placeholder="Enter your email"
              name="email"
              //   value={user.email}
            />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm font-semibold">Password</label>
            <input
              //   onChange={handleChange}
              className="border p-2 rounded-lg bg-white"
              type="password"
              placeholder="Enter your password"
              name="password"
              //   value={user.password}
            />
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <button
              type="submit"
              className="bg-[#92487A] hover:bg-[#75325f] text-white font-bold p-2 rounded-lg"
            >
              Register
            </button>
            <p className="mt-2 text-center text-sm">
              Already have an account?
              {/* <NavLink className="text-indigo-600 font-semibold" to={"/login"}>
                Login
              </NavLink> */}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
