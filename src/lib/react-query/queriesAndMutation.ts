import { INewUser } from '@/types'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query'
import { createUserAccount } from '../appwrite/api'

export const useCreateUserAccountMutation = ()=> {

    return useMutation ({
        mutationFn: (user:INewUser) => createUserAccount(user)
    });
};

// export const useLoginAccountMutation = ()=> {

//     return useMutation ({
//         mutationFn: (user:{email:string, password:string}) => loginAccount(user)
//     });
// };