'use client'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import Button from '@/app/components/Button'
import Input from '@/app/components/inputs/Input'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AuthSocialButton from './AuthSocialButton'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {
  //State to control current status LOGIN or REGISTER
  const [variant, setVariant] = useState<Variant>('LOGIN')
  //To check if the page is in loading state
  const [isLoading, setIsLoading] = useState(false)
  //Session for current User
  const session = useSession()
  //For redirecting purposes
  const router = useRouter()

  //useEffect to check if the session is authenticated, then redirect accordingly
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status, router])

  //set the status to either LOGIN or REGISTER
  //saved in useCallback so it wont get rebuilt everytime the page got rerendered
  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else setVariant('LOGIN')
  }, [variant])

  //useForm hook to manage form data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  //Handling the submit button
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //first set isLoading state to true, data is now fetching from server
    setIsLoading(true)

    //If current status is REGISTER, send data to create a new user
    if (variant === 'REGISTER') {
      //Axios Register
      axios
        .post('/api/register', data)
        // .then() => sign the user in as soon as the registration is done
        .then(() => signIn('credentials', data))
        // .catch() => displaying error if the registration failed
        .catch(() => toast.error('Something went wrong!'))
        // reset the loading states after the registration either fail or success
        .finally(() => setIsLoading(false))
    }

    //if current status is LOGIN, send data to get the user's info
    if (variant === 'LOGIN') {
      //NextAuth SignIn
      signIn('credentials', { ...data, redirect: false })
        // .then() => display error if credentials are invalid
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials')
          }
          // or display Logged in if everything went well
          if (callback?.ok && !callback?.error) {
            toast.success('Logged in!')
          }
        })
        // .finally() reset loading state
        .finally(() => setIsLoading(false))
    }
  }

  //Handling clicking GitHub or Google login button
  //set Loading state to true
  const socialAction = (action: string) => {
    setIsLoading(true)
    //redirect to the corresponding login page
    signIn(action, { redirect: false })
      .then((cb) => {
        if (cb?.error) {
          toast.error('Invalid credentials')
        }
        if (cb?.ok && !cb?.error) {
          toast.success('Logged in!')
        }
      })
      //also reset loading state
      .finally(() => setIsLoading(false))

    //NextAuth Social Sign In
  }
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Log in'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
