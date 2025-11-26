import {create} from 'zustand'

const useAuthState = create((set)=>({
    authUser:{name:"Prince", _id:123,age:22},
    isloggedIn:false,

    login:()=>{
        console.log("logged in")
        set({
            isloggedIn:true
        })
    }
}))
    
