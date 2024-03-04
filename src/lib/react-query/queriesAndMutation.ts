import { INewUser, IRecipe, IUpdateRecipe } from '@/types'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query'
import { addRecipe, createUserAccount, deleteRecipe, deleteSavedRecipe, editRecipe, getCurrentUser, getRecentRecipe, getRecipeById, likeRecipe, loginAccount, logoutAccount, saveRecipe } from '../appwrite/api'
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

    export const useLikeRecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: ({recipeId, likesArray}:{recipeId:string; likesArray :string[]}) => likeRecipe(recipeId, likesArray),
            onSuccess:(data:any)=> {
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECIPES_BY_ID, data?.$id]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECENT_RECIPES]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECIPES]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_CURRENT_USER]
                })

                }
        });
    }; 
    export const useSaveRecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: ({recipeId, userId}:{recipeId:string; userId :string}) => saveRecipe(recipeId, userId),
            onSuccess:()=> {
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECENT_RECIPES]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECIPES]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_CURRENT_USER]
                })

                }
        });
    };

    export const useDeleteSavedRecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: ({saveRecordId}:{saveRecordId:string; }) => deleteSavedRecipe(saveRecordId),
            onSuccess:()=> {
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECENT_RECIPES]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECIPES]
                })
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_CURRENT_USER]
                })

                }
        });
    }; 

    export const useGetCurrentUserMutation = ()=> {
        return useQuery ({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            queryFn: getCurrentUser
        });
    }; 

    export const useGetRecipeByIdMutation = (recipeId:string)=> {
        return useQuery ({
            queryKey: [QUERY_KEYS.GET_RECIPES_BY_ID],
            queryFn: ()=>getRecipeById(recipeId),
            enabled:!!recipeId
        });
    }; 

    export const useUpdateRecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: (recipe:IUpdateRecipe) => editRecipe(recipe),
            onSuccess:(data:any)=> {
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECIPES_BY_ID, data?.$id]
                })
                }
        });
    };

    export const usedeleteecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: ({recipeId,imageId}:{recipeId:string, imageId:string}) => deleteRecipe(recipeId, imageId),
            onSuccess:()=> {
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_RECENT_RECIPES]
                })
                }
        });
    };