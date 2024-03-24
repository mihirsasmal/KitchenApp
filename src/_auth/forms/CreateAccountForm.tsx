import { Button } from "@/components/ui/button";
import { createAccountValidation } from "@/lib/validation";
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
import { useCreateUserAccountMutation, useLoginAccountMutation } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const CreateAccountForm = () => {

  const { toast } = useToast();
 const {checkAuthUser} = useUserContext();
 const navigate = useNavigate();
  const {mutateAsync:createUserAccount, isPending:isCreatingAccount} = useCreateUserAccountMutation();

  const {mutateAsync: loginAccount} = useLoginAccountMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof createAccountValidation>>({
    resolver: zodResolver(createAccountValidation),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof createAccountValidation>) {
    const newUser = await createUserAccount(values);
    console.log(newUser);
    toast({
      title: "Account Created"
    })
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
        title: "Creating of Account failed. Please try again"
      });
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Create a new account</h2>
        <p className="text-light-4 dark:text-light-6 small-medium md:base-regular mt-2"> Enter your details</p>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="Name" {...field} />
              </FormControl>              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type = 'text' className="shad-input" placeholder="Username" {...field} />
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
        <Button type="submit" className="shad-button_primary">
          {isCreatingAccount? (
            <div className = 'flex-center gap-2'>
             <Loader/>Creating Account...
            </div>
          ): 'Create Account'}
          </Button>
          <p className="text-small-regular text-light-4 dark:text-light-2 text-center mt-2"> Already have an account?
          <Link to= '/Login' className=" text-primary-500 text-small-semibold ml-1">Log in</Link>
          </p>
      </form>
      </div>
    </Form>
  );
};

export default CreateAccountForm;


