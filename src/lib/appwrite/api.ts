import { INewUser, IRecipe, IUpdateRecipe } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {ID, ImageGravity, Models, Query} from 'appwrite';


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
        const newUser = await databases.createDocument('65d8126fe7df1bb5e5e3','65d8e9ca49daa05e1499',ID.unique(), user);

        return newUser;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

export async function loginAccount(user:{email:string, password:string}) {
    try{
        const session = await account.createEmailPasswordSession(user.email,user.password);
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
        const users = await databases.listDocuments('65d8126fe7df1bb5e5e3','65d8e9ca49daa05e1499');

        const currentUser = users.documents.filter((x:any)=>x.accountId===currentAccount.$id)[0];

        // const currentUser = await databases.listDocuments('65d8126fe7df1bb5e5e3','65d8e9ca49daa05e1499',[Query.equal('accountId', [currentAccount.$id])]);
        if(!currentUser) throw Error;

        return currentUser;
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

        const newRecipe = await databases.createDocument('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb', ID.unique(),
        {
            creator:recipe.userId,
            RecipeName:recipe.name,
            CuisineType:recipe.cuisineType,
            CuisineRegion:recipe.regionOfCuisine,
            MealType:recipe.mealType,
            Ingredients:recipe.ingredients,
            Steps:recipe.steps,
            
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
        

        const updatedRecipe = await databases.updateDocument('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb', recipe.recipeId,
        {
            RecipeName:recipe.name,
            CuisineType:recipe.cuisineType,
            CuisineRegion:recipe.regionOfCuisine,
            MealType:recipe.mealType,
            Ingredients:recipe.ingredients,
            Steps:recipe.steps,
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
    if(!recipeId || !imageId ) throw Error;
    try{
        await databases.deleteDocument('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb', recipeId)

            await deleteFile(imageId);
          
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
            '65d811e43bbce2b5f5ae',
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
            '65d811e43bbce2b5f5ae',
            fileId,
            2000,2000,ImageGravity.Top,100
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
            '65d811e43bbce2b5f5ae',
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

        const allRecipe = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb')

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

        const recipe = await databases.getDocument('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb',recipeId);

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

export async function likeRecipe(recipeId:string, likesArray:string[]) {
    try{

        const updatedRecipe = await databases.updateDocument('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb',recipeId,{
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

        const updatedRecipe = await databases.createDocument('65d8126fe7df1bb5e5e3', '65d8e9e3e92945c89252',ID.unique(),{
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

        const deleteStatusCode = await databases.deleteDocument('65d8126fe7df1bb5e5e3', '65d8e9e3e92945c89252',saveRecordId)

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

export async function getInfiniteRecipes({pageParam}:{pageParam:number}) {
    console.log('insidefunction -2');

const queries:any[] = [Query.orderDesc('$createdAt'), Query.limit(1)]
console.log('before If -1');
if(pageParam) {
    queries.push (Query.cursorAfter(pageParam.toString()));
}
console.log('After If -2');
    try{

        console.log('Inside Try -1');
        //const recipe = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb',queries); //-- query not working hence skipping this one now
        const recipe = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb');
        console.log('GetListApi -1')
        console.log(recipe);
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
    
            //const recipe = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb',[Query.search('RecipeName',searchValue),Query.search('Ingredients',searchValue)]);
            const recipes = await databases.listDocuments('65d8126fe7df1bb5e5e3', '65da9e8506e228dce6bb');

            const recipe = recipes.documents.filter((x:any)=>x.RecipeName.includes(searchValue) || x.Ingredients.includes(searchValue));
 
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