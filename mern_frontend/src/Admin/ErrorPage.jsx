import React from 'react'
import { NavLink } from 'react-router-dom'
import './css/Errorpage.css'

function ErrorPage() {
  return (
    <>
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>404</h1>
                </div>
                <h2>Page Not Found</h2>
                <p>
                    Page Not Available and You can Redirect to Home Page.
                </p>
                <NavLink to="/admin">Back To Home Page</NavLink>
            </div>

        </div>
    </>
  )
}

export default ErrorPage