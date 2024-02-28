import { INewUser, IRecipe } from "@/types";
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
        const currentUser = await databases.listDocuments('65d8126fe7df1bb5e5e3','65d8e9ca49daa05e1499');

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

export async function getFilePreview(fileId:string) {
    try{
        const uploadedFile = await storage.getFilePreview(
            '65d811e43bbce2b5f5ae',
            fileId,
            2000,2000,ImageGravity.Top,100
        );
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

