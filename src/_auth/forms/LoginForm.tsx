import { Button } from "@/components/ui/button";
import { loginValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast"
import { useLoginAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const LoginForm = () => {
  const { toast } = useToast();
 const {checkAuthUser} = useUserContext();
 const navigate = useNavigate();
  

  const {mutateAsync: loginAccount, isPending} = useLoginAccountMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginValidation>) {

    const session = await loginAccount({email:values.email, password:values.password});
    console.log(session);
    if(!(session as any).$id) {
      return toast({
        title: "Login failed. " +(session as any).message 
      ,     
        className: 'dark:bg-rose-500 bg-rose-400',
        });
    }

    const isLoggedIn = await checkAuthUser();
 console.log(isLoggedIn);
    if(isLoggedIn) {
      form.reset();
      navigate('/');
    }
    else {
      return toast({
        title: "Login Authentication failed. " +(session as any).message 
        ,     
          className: 'dark:bg-rose-500 bg-rose-400',
      });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Log in to your account</h2>
        <p className="text-light-4 dark:text-light-6 small-medium md:base-regular mt-2 "> Please enter your details</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type = 'email' className="shad-input" placeholder="jndoe@gmail.com" {...field} />
              </FormControl>              
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type ='password' className="shad-input" {...field} />
              </FormControl>              
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="shad-button_primary">
          {isPending? (
            <div className = 'flex-center gap-2'>
             <Loader/>Logging In...
            </div>
          ): 'Login'}
          </Button>
          <p className="text-small-regular text-light-4 dark:text-light-2 text-center mt-2"> Don't have an account yet?
          <Link to= '/createaccount' className=" text-primary-500 text-small-semibold ml-1">Create Account</Link>
          </p>
      </form>
      </div>
    </Form>
  );
}

export default LoginForm