import { INewUser, IRecipe, IUpdateRecipe } from '@/types'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query'
import { UpdatePublishStatusOfRecipe, addRecipe, createUserAccount, deleteRecipe, deleteSavedRecipe, editRecipe, getAllUsers, getCurrentUser, getIncredients, getInfiniteRecipes, getRecentRecipe, getRecipeById, getRecipeByUser, getSavedRecipeByUser, getSharedRecipeOfUser, likeRecipe, loginAccount, logoutAccount, saveRecipe, searchRecipes, searchSavedRecipes, searchUser, shareRecipe } from '../appwrite/api'
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
        onSuccess:(_data: unknown, variables: {
            recipeId: string;
            imageId: string;
        }, _context: unknown)=> {
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

            queryClient.invalidateQueries ({
                queryKey: [QUERY_KEYS.GET_INFINITE_RECIPES]
            })

            queryClient.invalidateQueries ({
                queryKey: [QUERY_KEYS.GET_RECIPES_BY_ID, variables.recipeId]
            })

            queryClient.invalidateQueries ({
                queryKey: [QUERY_KEYS.GET_SAVED_RECIPE_BY_USER]
            })

            queryClient.invalidateQueries ({
                queryKey: ['getRecipeByUserId']
            })
            
            }
    });
}; 

export const useGetRecentRecipeMutation = (userId:string)=> {
        return useInfiniteQuery ({
            queryKey: [QUERY_KEYS.GET_RECENT_RECIPES],
            queryFn:  async({pageParam})=> getRecentRecipe(userId,pageParam),
            initialPageParam:0,
            //getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,

            getNextPageParam : (lastPage:any)=> {
                if(lastPage && lastPage.length === 0) return null;

                const lastId = lastPage[lastPage.length - 1].$id;
                return lastId;
            }
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

    export const useGetAllUsersMutation = ()=> {
        return useInfiniteQuery ({
            queryKey:['getAllUsers'],
            queryFn: async({pageParam})=>getAllUsers(pageParam),
            initialPageParam:0,
            //getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,

            getNextPageParam : (lastPage:any)=> {
                if(lastPage && lastPage.length === 0) return null;

                const lastId = lastPage[lastPage.length - 1].$id;
                return lastId;
            }
        })
    }; 

    export const useSearchUserMutation = (searchValue:string)=> {
        return useQuery({
            queryKey: ['searchUser', searchValue],
            queryFn: ()=> searchUser(searchValue),
            enabled: !! searchValue
        });
    };

    export const useGetRecipeByIdMutation = (recipeId:string)=> {
        return useQuery ({            
            queryKey: [QUERY_KEYS.GET_RECIPES_BY_ID, recipeId],
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

    export const useUpdateSharedUserOfRecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: ({recipeId, sharedUsers}:{recipeId:string, sharedUsers:string[]}) => shareRecipe(recipeId,sharedUsers),
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
                    queryKey: [QUERY_KEYS.GET_USER_RECIPES]
                })
    
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_INFINITE_RECIPES]
                })
    
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_SAVED_RECIPE_BY_USER]
                })
    
                queryClient.invalidateQueries ({
                    queryKey: ['getRecipeByUserId']
                })
                }
        });
    };

    export const useUpdatePublishStatusOfRecipeMutation = ()=> {
        const queryClient = useQueryClient();
        return useMutation ({
            mutationFn: ({recipeId, publish}:{recipeId:string, publish:boolean}) => UpdatePublishStatusOfRecipe(recipeId,publish),
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
                    queryKey: [QUERY_KEYS.GET_USER_RECIPES]
                })
    
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_INFINITE_RECIPES]
                })
    
                queryClient.invalidateQueries ({
                    queryKey: [QUERY_KEYS.GET_SAVED_RECIPE_BY_USER]
                })
    
                queryClient.invalidateQueries ({
                    queryKey: ['getRecipeByUserId']
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
            queryKey: [QUERY_KEYS.GET_SAVED_RECIPE_BY_USER],
            queryFn: async({pageParam})=>getSavedRecipeByUser(userId, pageParam),
            enabled:!!userId,
            initialPageParam:0,
            //getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,
            getNextPageParam: (lastPage:any)=> {
                if(lastPage && lastPage.length === 0) return null;

                const lastId = lastPage[lastPage.length - 1].savedId;
                return lastId;
            }
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
        return useInfiniteQuery ({
            queryKey: ['getRecipeByUserId'],
            queryFn: async({pageParam})=>getRecipeByUser(userId, pageParam),
            enabled:!!userId,
            initialPageParam:0,
            //getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,
            getNextPageParam: (lastPage:any)=> {
                if(lastPage && lastPage.length === 0) return null;

                const lastId = lastPage[lastPage.length - 1].$id;
                return lastId;
            }
        });
    };

    export const useGetSharedRecipeOfUserMutation = (userId:string)=> {
        return useInfiniteQuery ({
            queryKey: ['getSharedRecipeOfUser'],
            queryFn: async({pageParam})=>getSharedRecipeOfUser(userId, pageParam),
            enabled:!!userId,
            initialPageParam:0,
            //getPreviousPageParam: (firstPage) => firstPage[0].$id ?? undefined,
            getNextPageParam: (lastPage:any)=> {
                if(lastPage && lastPage.length === 0) return null;

                const lastId = lastPage[lastPage.length - 1].$id;
                return lastId;
            }
        });
    };

    export const useGetIngredientsMutation = (language:string)=> {
        return useQuery ({
            queryKey: [QUERY_KEYS.GET_INGREDIENTS, language],
            queryFn:()=>getIncredients(language)
        });
    };