import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";

import "./App.css";

import Signup from "./Pages/Signup/Signup";
import Me from "./Pages/Me/Me";
import CreateBlog from "./Pages/CreateBlog/CreateBlog";
import Contact from "./Pages/Contact/Contact";
import About from "./Pages/About/About";
import User from "./Pages/User/User";

import SideNav from "./Components/SideNav/SideNav";
import MyBlogs from "./Components/MyBlogs/MyBlogs";
import MyLikes from "./Components/MyLikes/MyLikes";
import MyComments from "./Components/MyComments/MyComments";
import UpdatePassword from "./Components/UpdatePassword/UpdatePassword";
import UpdateData from "./Components/UpdateData/UpdateData";
import BlogsDiv from "./Components/BlogsDiv/BlogsDiv";
import OneBlog from "./Components/OneBlog/OneBlog";
import Followers from "./Components/Followers/Followers";
import Following from "./Components/Following/Following";

import { useAuthController } from "./contexts/AuthProvider";

function App() {
  const { isLoggedIn } = useAuthController();

  return (
    <Router>
      {isLoggedIn ? <SideNav /> : ""}

      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home />}>
              <Route index path="/" element={<BlogsDiv />} />
              <Route path="/:id" element={<OneBlog />} />
              <Route path="/:id/user" element={<User />}>
                <Route path="/:id/user" element={<MyBlogs />} />
                <Route path="/:id/user/my-likes" element={<MyLikes />} />
                <Route path="/:id/user/my-comments" element={<MyComments />} />
              </Route>
            </Route>

            <Route path="/createBlog" element={<CreateBlog />} />

            <Route path="/me/:id" element={<Me />}>
              <Route path="/me/:id" element={<UpdatePassword />} />
              <Route path="/me/:id/my-followers" element={<Followers />} />
              <Route path="/me/:id/my-following" element={<Following />} />
              <Route path="/me/:id/my-likes" element={<MyLikes />} />
              <Route path="/me/:id/my-blogs" element={<MyBlogs />} />
              <Route path="/me/:id/my-comments" element={<MyComments />} />
              <Route path="/me/:id/update-data" element={<UpdateData />} />
            </Route>

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<h3>Page Not Found</h3>} />
          </>
        ) : (
          <>
            <Route index path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<h3>Page Not Found</h3>} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
