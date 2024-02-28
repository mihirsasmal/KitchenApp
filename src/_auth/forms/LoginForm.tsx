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
 const {checkAuthUser, isLoading:isUserLoading} = useUserContext();
 const navigate = useNavigate();
  

  const {mutateAsync: loginAccount, isPending:isLoggedIn} = useLoginAccountMutation();
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
    if(!session) {
      return toast({
        title: "Login failed. Please try again"
      });
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/');
    }
    else {
      toast({
        title: "Login Authentication failed. Please try again"
      });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2"> Please enter your details</p>
      
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="shad-button_primary">
          {isLoggedIn? (
            <div className = 'flex-center gap-2'>
             <Loader/>Logging In...
            </div>
          ): 'Login'}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2"> Don't have an account yet?
          <Link to= '/createaccount' className=" text-primary-500 text-small-semibold ml-1">Create Account</Link>
          </p>
      </form>
      </div>
    </Form>
  );
}

export default LoginForm