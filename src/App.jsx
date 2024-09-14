import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(window.localStorage.getItem("user")); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");



  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  function submitLogin(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    if(!username || !password) {
      return;
    }

    const userData = loginService.login(username, password)
    userData.then(data => data.error ? changeErrorMessage(data.error) : addUser(data));

  }

  function addUser(user) {
    window.localStorage.setItem("user", user);
    setUser(user)
  }

  function logoutUser() {
    window.localStorage.removeItem("user");
    setUser(null)
  }

  function submitBlog(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const title = formData.get("title");
    const author = formData.get("author");
    const url = formData.get("url");

    if(!title || !author || !url) {
      return;
    }

    const userData = blogService.create(title, author, url, user.token);
    userData.then(data => data.error ? changeErrorMessage(data.error) : addBlog(data));

  }
  
  function addBlog(newBlog) {
    changeSuccessMessage("Blog created!");
    setBlogs(prev => prev.concat(newBlog))
  }


  function changeErrorMessage(message) {
    if(successMessage) {
      setSuccessMessage("");
    }

    setErrorMessage(message)

    setTimeout(() => setErrorMessage(""), 5000)
  }


  function changeSuccessMessage(message) {
    if(errorMessage) {
      setErrorMessage("")
    }

    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  if(!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage.length > 0 ? 
          <p className="message error">{errorMessage}</p>
          : null
        }
        <form onSubmit={submitLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input id="username" name="username" type="text" placeholder="Type your username"/>
          </div> 
          <div>
            <label htmlFor="password">password</label>
            <input id="password" name="password" type="password" placeholder="Type your password"/>
          </div> 
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.username} logged in 
        <button onClick={logoutUser}>logout</button>
      </p>
      {errorMessage.length > 0 ? 
        <p className="message error">{errorMessage}</p>
        : null
      }
      {successMessage.length > 0 ? 
        <p className="message success">{successMessage}</p>
        : null
      } 
      <form onSubmit={submitBlog}>
        <h2>Create new</h2>
        <div>
          <label htmlFor="title">title:</label>
          <input id="title" name="title" type="text" placeholder="Type your title"/>
        </div> 
        <div>
          <label htmlFor="author">author:</label>
          <input id="author" name="author" type="text" placeholder="Type your author"/>
        </div> 
        <div>
          <label htmlFor="url">url:</label>
          <input id="url" name="url" type="url" placeholder="Type your url"/>
        </div> 

        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
