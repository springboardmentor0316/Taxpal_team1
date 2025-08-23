function SignIn() {
  return (
    <div>
      <div className="head">
        <img src="/img/taxpal1.png" alt="taxpal" className="logo"/>
        <p className="para">Your trusted tax partner</p>
      </div>
      <form>
        <h2>Sign in</h2>
        <p>Please enter your details to sign in.</p>
        <div>
          <label>Username:</label>
          <input type="Text" placeholder="Username" required />
        </div>
        <div>
        <label>Password:</label>
          <input type="password" placeholder="Password" required/>
           <div>
          <input type="checkbox" />
          <label>Remember me</label>
        </div>
        <a id="f"href="#">Forgot password?</a>
        </div>
        <button type="submit">Sign in</button>
        <p>Don't have an account? <a href="#">Sign up</a></p>
      </form>
    </div>
  );
}

export default SignIn;