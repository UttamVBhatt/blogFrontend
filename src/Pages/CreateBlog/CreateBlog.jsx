import React, { useEffect, useState } from "react";

import { useAuthController } from "./../../contexts/AuthProvider";

import Loader from "./../../Components/Loader/Loader";

import { useNavigate } from "react-router-dom";

import "./CreateBlog.scss";
import axios from "axios";

function CreateBlog() {
  const { user, BASE_URL } = useAuthController();
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [headingHolder, setHeadingHolder] = useState(
    "Type your blog's heading here...."
  );

  const [descHolder, setDescHolder] = useState(
    "Description must contain atleaset 20 characters"
  );

  const [categoryHolder, setCategoryHolder] = useState(
    "Write the category in which your blog relies e.x. Sports, Food"
  );

  const navigate = useNavigate();

  function handleCreateBlog(e) {
    e.preventDefault();
    setHeading(e.target[0].value);
    setDescription(e.target[1].value);
    setCategory(e.target[2].value);
  }

  useEffect(() => {
    if (window.innerWidth < 507) {
      setHeadingHolder(() => "Type Blog's Heading");
      setDescHolder(() => "Blog's Description (in 20 chars.)");
      setCategoryHolder(() => "Blog's Category");
    } else {
      setHeadingHolder(() => "Type your blog's heading here....");
      setDescHolder(() => "Description must contain atleaset 20 characters");
      setCategoryHolder(
        () => "Write the category in which your blog relies e.x. Sports, Food"
      );
    }
  }, [window.innerWidth]);

  useEffect(() => {
    async function createBlog() {
      if (!heading) return;

      try {
        setIsLoading(true);

        const data = await axios({
          method: "POST",
          url: `${BASE_URL}/api/v1/blogs/create-blog/${user._id}`,
          data: {
            heading,
            description,
            category,
          },
        });

        setIsLoading(false);
        alert(data?.data?.message);
        navigate("/");
      } catch (err) {
        setIsLoading(false);
        alert(err?.response?.data?.message);
        console.log(err);
        console.log(err?.response?.data?.message);
      }
    }
    createBlog();
  }, [heading, setHeading, description, setDescription, category, setCategory]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="create-blog-main-div">
          <div className="form-container-div">
            <h3>
              {!user.blogs.length ? (
                <span>
                  Create your <span className="colored-span">first blog </span>
                  now....
                </span>
              ) : (
                <span>
                  Keep creating <span className="colored-span"> blogs </span>{" "}
                  and explore <span> the world of bloggers</span>
                </span>
              )}
            </h3>
            <form onSubmit={handleCreateBlog}>
              <div>
                <label id="first-heading-label" htmlFor="heading">
                  Heading
                </label>

                <br />

                <input
                  type="text"
                  id="heading"
                  placeholder={headingHolder}
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="description">Description</label>

                <br />

                <input
                  type="text"
                  id="description"
                  placeholder={descHolder}
                  required
                  minLength={20}
                />
              </div>

              <div>
                <label htmlFor="category">Category</label>

                <br />

                <input
                  type="text"
                  id="category"
                  placeholder={categoryHolder}
                  required
                  minLength={3}
                />
              </div>

              <button type="submit">Create Blog</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateBlog;
