import { INewUser, IRecipe, IUpdateRecipe } from '@/types'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query'
import { LucideSatelliteDish } from 'lucide-react';
import { addRecipe, createUserAccount, deleteRecipe, deleteSavedRecipe, editRecipe, getCurrentUser, getIncredients, getInfiniteRecipes, getRecentRecipe, getRecipeById, getRecipeByUser, getSavedRecipeByUser, likeRecipe, loginAccount, logoutAccount, saveRecipe, searchRecipes, searchSavedRecipes } from '../appwrite/api'
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

export const useDeleteRecipeMutation = ()=> {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: ({recipeId, imageId}:{recipeId:string; imageId: string}) => deleteRecipe(recipeId,imageId),
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
            
            queryClient.invalidateQueries ({
                queryKey: [QUERY_KEYS.GET_USER_RECIPES]
            })
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

    export const usedeleteRecipeMutation = ()=> {
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

    export const useGetRecipeMutation = ()=> {

        return useInfiniteQuery ({
            queryKey:[QUERY_KEYS.GET_INFINITE_RECIPES],
            queryFn: async({pageParam})=>getInfiniteRecipes({pageParam}),
            initialPageParam:0,
            //getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,

            getNextPageParam : (lastPage:any)=> {
                if(lastPage && lastPage.length === 0) return null;

                const lastId = lastPage[lastPage.length - 1].$id;
                return lastId;
            }
        })
    };

    export const useSearchRecipeMutation = (searchValue:string)=> {
        return useQuery({
            queryKey: [QUERY_KEYS.SEARCH_RECIPES, searchValue],
            queryFn: ()=> searchRecipes(searchValue),
            enabled: !! searchValue
        });
    };

    export const useGetSavedRecipeByUserMutation = (userId:string)=> {
        return useInfiniteQuery ({
            queryKey: [QUERY_KEYS.GET_RECIPES_BY_ID],
            queryFn: ()=>getSavedRecipeByUser(userId),
            enabled:!!userId,
            initialPageParam:0,
            getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,
            getNextPageParam: (lastPage) => lastPage[lastPage?.length - 1].$id ?? undefined,
        });
    }; 

    export const useSearchSavedRecipeMutation = (searchValue:string, userId:string)=> {
        return useQuery({
            queryKey: [QUERY_KEYS.SEARCH_RECIPES, searchValue],
            queryFn: ()=> searchSavedRecipes(searchValue, userId),
            enabled: !! searchValue
        });
    };

    export const useGetRecipeByUserMutation = (userId:string)=> {
        return useQuery ({
            queryKey: [QUERY_KEYS.GET_USER_RECIPES],
            queryFn: ()=>getRecipeByUser(userId),
            enabled:!!userId
        });
    };

    export const useGetIngredientsMutation = ()=> {
        return useQuery ({
            queryKey: [QUERY_KEYS.GET_INGREDIENTS],
            queryFn:getIncredients
        });
    };