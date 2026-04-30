import  axiosInstance  from "axios"
export const tweetApi = {
    createTweet: (formData:unknown)=>{
        axiosInstance.post("/api/tweets/",formData,{
            headers:{'Content-Type':"multipart/from-data"}
        })
    }
}