import { INewUser, IRecipe, IUpdateRecipe } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {ID,  Models, Query} from 'appwrite';
import { v4 as uuidv4 } from 'uuid';


export async function createUserAccount(user:INewUser) {
    try{

        const newAccount = await account.create(ID.unique(), user.email, user.password,user.name);

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        

        const newUser = await saveUserToDB({
            name:user.name,
            username : user.username,
            accountId:newAccount.$id,
            email:user.email,
            ImageUrl : avatarUrl
        });
        return newUser;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function saveUserToDB( user:{
     name:string,  username:string, accountId: string, email:string,  ImageUrl: URL }) {
    try{
        const newUser = await databases.createDocument(appwriteConfig.databaseId,appwriteConfig.userCollectionId,ID.unique(), user);

        return newUser;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function loginAccount(user:{email:string, password:string}) {
    try{
        const session = await account.createEmailSession(user.email,user.password);
        return session;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function getCurrentUser() {
    try{
        const currentAccount = await account.get();        

         const currentUser = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.userCollectionId,[Query.equal('accountId', [currentAccount.$id])]);

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }
    catch(error) {
        console.log(error)
      }
}

export async function logoutAccount() {
    try{
        const session = await account.deleteSession('current');
        return session;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function addRecipe(recipe:IRecipe) {
    try{
        const uploadedFile = await uploadFile(recipe.file[0]) as Models.File;
        
        if(!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
          await deleteFile(uploadedFile.$id);
            throw Error
        };

        const emptyStep = `[{"id": "${uuidv4()}","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]`
 
        const newRecipe = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId, ID.unique(),
        {
            creator:recipe.userId,
            RecipeName:recipe.name,
            CuisineType:recipe.cuisineType,
            CuisineRegion:recipe.regionOfCuisine,
            MealType:recipe.mealType,
            Ingredients:recipe.language === 'english'? recipe.ingredients : [],
            Steps: recipe.language === 'english'?recipe.steps: emptyStep,   
            IngredientsOdia:recipe.language === 'odiya'? recipe.ingredients : [],
            StepsOdia: recipe.language === 'odiya'?recipe.steps: emptyStep,           
            ImageId: uploadedFile.$id
        }
        )

        if(!newRecipe) {
            await deleteFile(uploadedFile.$id);
            throw Error
        }
        return newRecipe;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function editRecipe(recipe:IUpdateRecipe) {
    const hasFileToUpdate = recipe.file.length>0;
    try{

        let image = {
            imageUrl:recipe.imageUrl,
            imageId:recipe.imageId,
        }

        if(hasFileToUpdate) {

            const uploadedFile = await uploadFile(recipe.file[0]) as Models.File;
        
        if(!uploadedFile) throw Error;

        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
          await deleteFile(uploadedFile.$id);
            throw Error
        };

        image = {...image, imageUrl:fileUrl as URL, imageId:uploadedFile.$id};

        }
        
        
        const updatedRecipe = recipe.language === 'english'? await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId, recipe.recipeId,
        {
            RecipeName:recipe.name,
            CuisineType:recipe.cuisineType,
            CuisineRegion:recipe.regionOfCuisine,
            MealType:recipe.mealType,
            Ingredients: recipe.ingredients ,
            Steps: recipe.steps,  
            ImageUrl:image.imageUrl,
            ImageId: image.imageId
        }
        ) :  await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId, recipe.recipeId,
        {
            RecipeName:recipe.name,
            CuisineType:recipe.cuisineType,
            CuisineRegion:recipe.regionOfCuisine,
            MealType:recipe.mealType,
            
            IngredientsOdia:recipe.ingredients,
            StepsOdia:recipe.steps,
            ImageUrl:image.imageUrl,
            ImageId: image.imageId
        }
        ) 

        if(!updatedRecipe) {
            await deleteFile(recipe.imageId);
            throw Error
        }
        return updatedRecipe;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function deleteRecipe(recipeId:string, imageId:string) {
    
    if(!recipeId ) throw Error;

    try{

        await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId, recipeId)

           if(imageId) await deleteFile(imageId);
          
        return {status:'ok'};
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function uploadFile(file:File) {
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadedFile;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export function getFilePreview(fileId:string) {
    try{
        const uploadedFile = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,2000,'top',100
        );
        console.log(uploadedFile);
        return uploadedFile;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function deleteFile(fileId:string) {
    try{
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        );
        return {status:'ok'};
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function getRecentRecipe() {
    try{

        const allRecipe = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId)

        if(!allRecipe) {
            
            throw Error
        }
        return allRecipe;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function getRecipeById(recipeId:string) {
    try{

        const recipe = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId,recipeId);

        if(!recipe) {
            
            throw Error
        }
        return recipe;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function getRecipeByUser(userId:string, pageParam:number) {

    const queries:any[] = [Query.orderDesc('$createdAt'), Query.limit(12),Query.equal('creator', [userId])]
    if(pageParam) {

        queries.push (Query.cursorAfter(pageParam.toString()));
    }

    try{

        const recipeOfUser = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId,queries)


        

        if(!recipeOfUser) {
            
            throw Error
        }
        return recipeOfUser.documents;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function likeRecipe(recipeId:string, likesArray:string[]) {
    try{

        const updatedRecipe = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId,recipeId,{
            likes:likesArray
        })

        if(!updatedRecipe) {
            
            throw Error
        }
        return updatedRecipe;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function saveRecipe(recipeId:string, userId:string) {
    try{

        const updatedRecipe = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.savesCollectionId,ID.unique(),{
            users:userId,
            recipe:recipeId
        })

        if(!updatedRecipe) {
            
            throw Error
        }
        return updatedRecipe;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function deleteSavedRecipe(saveRecordId:string) {
    try{

        const deleteStatusCode = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.savesCollectionId,saveRecordId)

        if(!deleteStatusCode) {
            
            throw Error
        }
        return deleteStatusCode;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function getSavedRecipeByUser(userId:string, pageParam:number) {

    const queries:any[] = [Query.orderDesc('$createdAt'), Query.limit(10),Query.equal('users', [userId])]
    if(pageParam) {

        queries.push (Query.cursorAfter(pageParam.toString()));
    }

    try{


        const allSavedRecipe = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.savesCollectionId,queries)

        const savedRecipeOfUser = allSavedRecipe.documents.map(x=>{return {...x.recipe,savedId : x.$id}});

        if(!savedRecipeOfUser) {
            
            throw Error
        }
        return savedRecipeOfUser;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function getInfiniteRecipes({pageParam}:{pageParam:number}) {

const queries:any[] = [Query.orderDesc('$createdAt'), Query.limit(10)]

if(pageParam) {

    queries.push (Query.cursorAfter(pageParam.toString()));
}

    try{

        const recipe = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId,queries); 

        if(!recipe) {
            
            throw Error
        }
        return recipe.documents;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function searchRecipes(searchValue:string) {
    console.log('insideSearchfunction -1');
        try{
    
            const recipe = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId,[Query.search('RecipeName',searchValue)]); // currently ANd OR option not available in Appwrite query so using only recipename
            // const recipes = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb');

            // const recipe = recipes.documents.filter((x:any)=>x.RecipeName.includes(searchValue) || x.Ingredients.includes(searchValue));
 
            if(!recipe) {
                
                throw Error
            }
            //return {documents:recipe}; // return only recipe when query issue is fixed
            return recipe
        }
        catch(error) {
            console.log(error)
            return error;
        }
    }

export async function searchSavedRecipes(searchValue:string, userId:string) {

            try{
        
                //const recipe = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65d8e9e3e92945c89252',[Query.equal('users', [userId]),Query.search('RecipeName',searchValue),Query.search('Ingredients',searchValue)]); // Appwrite realtion search doesnot work
                const allSavedRecipe = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.savesCollectionId)

                const savedRecipeOfUser = allSavedRecipe.documents.filter(x=>x.users.$id === userId).map(x=>x.recipe);
    
                const recipe = savedRecipeOfUser.filter((x:any)=>x.RecipeName.includes(searchValue) || x.Ingredients.includes(searchValue));
     
                if(!recipe) {
                    
                    throw Error
                }
                return {documents:recipe}; // return only recipe when query issue is fixed
            }
            catch(error) {
                console.log(error)
                return error;
            }
        }

export async function getIncredients(language:string) {

            try{
        
                const allRecipe = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.recipeCollectionId,[ Query.limit(250)])
                
                const allIngredients = allRecipe.documents.flatMap((x)=>{ if(x.Ingredients && language==='english') { return x.Ingredients;} if(x.IngredientsOdia && language==='odiya') {  return x.IngredientsOdia; }});
                
                 const allUniqueIngredients =  [...new Set(allIngredients)];
    
                
     
                if(!allIngredients) {
                    
                    throw Error
                }
                return allUniqueIngredients; 
            }
            catch(error) {
                console.log(error)
                return error;
            }
        }