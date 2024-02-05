import React from 'react'

function SignIn() {
    const apiUrl=process.env.APIURL
  return (
    <div>
<h1>{apiUrl}</h1>
    </div>
  )
}

export default SignIn