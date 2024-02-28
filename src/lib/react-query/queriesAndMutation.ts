import { INewUser, IRecipe } from '@/types'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query'
import { addRecipe, createUserAccount, getRecentRecipe, loginAccount, logoutAccount } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccountMutation = ()=> {

    return useMutation ({
        mutationFn: (user:INewUser) => createUserAccount(user)
    });
};

export const useLoginAccountMutation = ()=> {

    return useMutation ({
        mutationFn: (user:{email:string, password:string}) => loginAccount(user)
    });
};

export const useLogoutAccountMutation = ()=> {

    return useMutation ({
        mutationFn: () => logoutAccount()
    });
};

export const useAddRecipeMutation = ()=> {
const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: (recipe:IRecipe) => addRecipe(recipe),
        onSuccess:()=> {
            queryClient.invalidateQueries ({
                queryKey: [QUERY_KEYS.GET_RECENT_RECIPES]
            }
                )
            }
    });
}; 

export const useGetRecentRecipeMutation = ()=> {
        return useQuery ({
            queryKey: [QUERY_KEYS.GET_RECENT_RECIPES],
            queryFn: getRecentRecipe
        });
    }; 