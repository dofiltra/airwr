import { FC } from 'react'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useState } from 'preact/hooks'

const EmailAuth: FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const auth = getAuth()
  return (
    <div className="modal" id="email-auth">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Sign in | Sign up</h3>
        <p className="py-4">
          <div className="form-control">
            <label className="input-group input-group-vertical mb-4">
              <span>Email</span>
              <input
                type="text"
                placeholder="info@site.com"
                className="input input-bordered"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="input-group input-group-vertical">
              <span>Password</span>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
        </p>
        <div className="modal-action">
          <a
            href="#"
            className="btn"
            onClick={() => {
              signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  const user = userCredential.user
                })
                .catch((error) => {
                  createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                      const user = userCredential.user
                    })
                    .catch((error) => {
                      const errorCode = error.code
                      const errorMessage = error.message
                      console.log(errorCode)
                      alert(errorMessage)
                    })
                })
            }}
          >
            Auth
          </a>
        </div>
      </div>
    </div>
  )
}

export default EmailAuth
