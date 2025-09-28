import conf from '../config/config'
import {Client , Account , ID} from 'appwrite'

export class AuthServices {
 client = new Client()
    account;

    constructor(){
        console.log("Config:", conf)
        this.client
        .setEndpoint(conf.appWriteUrl)
        .setProject(conf.appWriteProjectId)        

    this.account = new Account(this.client)
    }
//---------------------------------------------------------------------------------------------------------
 async createAccount({email , password , name}) {//-----------------------------createAccount
    // eslint-disable-next-line no-useless-catch
    try {
        const userAccount = await this.account.create(ID.unique() , email , password, name)
        if (userAccount) {
           return this.login({email,password})
        } else {
            return userAccount
        }
    } catch (error) {
        throw error;
    }
 }
//------------------------------------------------------------------------------------------------------ 
async login({ email, password }) {
  try {
    // pehle session banao
    await this.account.createEmailPasswordSession(email, password)


    // fir user ka data lao
    return await this.getCurrentUser();
  } catch (error) {
    throw error;
  }
}


//--------------------------------------------------------------------------------------------------------
async getCurrentUser() {//------------------------------------------------------Getcurrent user
    try {
     return await this.account.get()
    } catch (error) {
        console.log("error in appwrite :" , error)
    }
}
//--------------------------------------------------------------------------------------------------------
async logOut(){
    try {
         await this.account.deleteSessions();
    } catch (error) {
        console.log("error in logout service :",error)
    }
}
}

const authServices = new AuthServices();

export default authServices